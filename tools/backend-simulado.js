/* Backend simulado del servicio de testing: cumple docs/contrato-api.md,
   incluida la propuesta de analisis, entrevista e informe, para probar la
   pantalla del servicio sin el backend de Fafa.

     npm run backend:simulado            # http://localhost:3000
     PUERTO=3001 npm run backend:simulado

   No usa axe ni ningun LLM, y no abre la direccion que se escribe: el
   analisis es siempre el mismo ejemplo, la entrevista tiene respuestas
   fijas y el informe es un PDF minimo. Todo queda en memoria y se pierde
   al apagarlo (Ctrl+C).

   Algunas direcciones dan un caso especial (ver el contrato):
     limpio.test    el analisis no encuentra problemas
     sinsitio.test  422 sitio-inaccesible
     fallo.test     500
     lento.test     no contesta a tiempo: el sitio corta a los 60 segundos

   Valida los datos con el mismo codigo que el sitio (src/api/validacion.js),
   asi que sus errores son los que el backend real deberia dar.
   Sin dependencias: solo node:http. */

import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";
import { ErrorApi } from "../src/api/errores.js";
import { limpiarMensaje, validarCambios, validarId, validarIdioma, validarSesionNueva } from "../src/api/validacion.js";

// Los origenes del contrato. CORS_ORIGIN los cambia, separados por coma.
export const ORIGENES_POR_DEFECTO = Object.freeze(["http://localhost:5173", "http://localhost:5174", "http://localhost:8080"]);
const LARGO_MAXIMO_CUERPO = 16 * 1024;
const VIDA_DEL_ANALISIS_MS = 60 * 60 * 1000;
const MAXIMO_MENSAJES = 10;

export function crearBackendSimulado({ origenes = ORIGENES_POR_DEFECTO, demoraMs = 1500, esperaLentoMs = 65000, registrar = () => {} } = {}) {
  // id -> { sesion, analisis, analizadoEn, mensajes }
  const sesiones = new Map();
  const temporizadores = new Set();

  function despues(ms, accion) {
    const temporizador = setTimeout(() => {
      temporizadores.delete(temporizador);
      accion();
    }, ms);
    temporizadores.add(temporizador);
  }

  // El analisis y la conversacion duran una hora, como dice el contrato.
  // La sesion queda: en el backend real es una fila de la tabla.
  function olvidarAnalisisVencidos() {
    const limite = Date.now() - VIDA_DEL_ANALISIS_MS;
    for (const entrada of sesiones.values()) {
      if (entrada.analisis && entrada.analizadoEn < limite) Object.assign(entrada, { analisis: null, mensajes: 0 });
    }
  }

  async function atender(pedido, respuesta) {
    const url = new URL(pedido.url, "http://localhost");
    cabecerasCors(pedido, respuesta, origenes);
    if (pedido.method === "OPTIONS") return enviar(respuesta, 204);
    olvidarAnalisisVencidos();

    if (pedido.method === "GET" && url.pathname === "/api/health") return enviar(respuesta, 200, { status: "ok" });

    if (pedido.method === "POST" && url.pathname === "/api/sessions") {
      const { analyzed_url } = validarSesionNueva(await leerCuerpo(pedido));
      const sesion = { id: randomUUID(), analyzed_url, score: null, comment: null, meeting_requested: false, created_at: new Date().toISOString() };
      sesiones.set(sesion.id, { sesion, analisis: null, analizadoEn: 0, mensajes: 0 });
      return enviar(respuesta, 201, sesion);
    }

    const partes = url.pathname.split("/").filter(Boolean);
    if (partes[0] !== "api" || partes[1] !== "sessions" || partes.length < 3 || partes.length > 4) return enviar(respuesta, 404);
    const entrada = sesiones.get(validarId(partes[2]));
    const accion = partes[3] ?? "";

    if (pedido.method === "PATCH" && accion === "") {
      const cambios = validarCambios(await leerCuerpo(pedido));
      if (!entrada) return enviar(respuesta, 404);
      Object.assign(entrada.sesion, cambios);
      return enviar(respuesta, 200, entrada.sesion);
    }

    if (pedido.method === "POST" && accion === "analysis") {
      const cuerpo = await leerCuerpo(pedido);
      exigirSoloCampos(cuerpo, ["language"]);
      const idioma = validarIdioma(cuerpo.language);
      if (!entrada) return enviar(respuesta, 404);
      const { hostname } = new URL(entrada.sesion.analyzed_url);
      const esperar = hostname === "lento.test" ? esperaLentoMs : demoraMs;
      return despues(esperar, () => {
        if (hostname === "sinsitio.test" || hostname === "lento.test") return enviar(respuesta, 422, { error: "sitio-inaccesible" });
        if (hostname === "fallo.test") return enviar(respuesta, 500);
        entrada.analisis = analisisDeEjemplo(entrada.sesion.analyzed_url, idioma, hostname === "limpio.test");
        entrada.analizadoEn = Date.now();
        entrada.mensajes = 0;
        enviar(respuesta, 200, entrada.analisis);
      });
    }

    if (pedido.method === "POST" && accion === "interview") {
      const cuerpo = await leerCuerpo(pedido);
      exigirSoloCampos(cuerpo, ["language", "message"]);
      const idioma = validarIdioma(cuerpo.language);
      const mensaje = limpiarMensaje(cuerpo.message);
      if (!entrada?.analisis) return enviar(respuesta, 404);
      if (mensaje !== null) {
        if (entrada.mensajes >= MAXIMO_MENSAJES) return enviar(respuesta, 429);
        entrada.mensajes += 1;
      }
      const turno = turnoDeEjemplo(idioma, mensaje === null ? 0 : entrada.mensajes, entrada.analisis.violations.length === 0);
      return despues(Math.round(demoraMs / 2), () => enviar(respuesta, 200, turno));
    }

    if (pedido.method === "GET" && accion === "report") {
      const idioma = validarIdioma(url.searchParams.get("language"));
      if (!entrada?.analisis) return enviar(respuesta, 404);
      const pdf = informeDeEjemplo(entrada.analisis, idioma);
      respuesta.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="informe-tuaccesible.pdf"',
        "Content-Length": pdf.length,
        "Cache-Control": "no-store",
      });
      return respuesta.end(pdf);
    }

    return enviar(respuesta, 404);
  }

  const servidor = createServer((pedido, respuesta) => {
    // Lo que se anota no lleva IP, como pide el contrato para los logs.
    respuesta.on("finish", () => registrar(`${pedido.method} ${pedido.url.split("?")[0]} ${respuesta.statusCode}`));
    atender(pedido, respuesta).catch((error) => {
      if (error instanceof ErrorApi) return enviar(respuesta, 400, { error: error.codigo });
      console.error(error);
      enviar(respuesta, 500);
    });
  });
  servidor.on("close", () => {
    for (const temporizador of temporizadores) clearTimeout(temporizador);
  });
  return servidor;
}

function cabecerasCors(pedido, respuesta, origenes) {
  respuesta.setHeader("Vary", "Origin");
  const origen = pedido.headers.origin;
  if (!origen || !origenes.includes(origen)) return;
  respuesta.setHeader("Access-Control-Allow-Origin", origen);
  respuesta.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH");
  respuesta.setHeader("Access-Control-Allow-Headers", "Content-Type");
  respuesta.setHeader("Access-Control-Max-Age", "600");
}

/* Con datos, JSON; sin datos, sin cuerpo (404, 429 y 500 del contrato).
   Si el sitio ya corto el pedido (tiempo-agotado), no se manda nada. */
function enviar(respuesta, estado, datos) {
  if (respuesta.headersSent || respuesta.destroyed) return;
  const cuerpo = datos === undefined ? "" : JSON.stringify(datos);
  respuesta.writeHead(estado, {
    ...(cuerpo ? { "Content-Type": "application/json; charset=utf-8" } : {}),
    "Content-Length": Buffer.byteLength(cuerpo),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  respuesta.end(cuerpo);
}

async function leerCuerpo(pedido) {
  const trozos = [];
  let largo = 0;
  for await (const trozo of pedido) {
    largo += trozo.length;
    if (largo > LARGO_MAXIMO_CUERPO) throw new ErrorApi("datos-invalidos");
    trozos.push(trozo);
  }
  try {
    return JSON.parse(Buffer.concat(trozos).toString("utf8"));
  } catch {
    throw new ErrorApi("datos-invalidos");
  }
}

function exigirSoloCampos(cuerpo, permitidos) {
  const esObjeto = typeof cuerpo === "object" && cuerpo !== null && !Array.isArray(cuerpo);
  if (!esObjeto || !Object.keys(cuerpo).every((campo) => permitidos.includes(campo))) throw new ErrorApi("datos-invalidos");
}

/* ---------- El ejemplo ---------- */

// Seis problemas frecuentes, con los textos de ayuda de axe en los dos idiomas.
const REGLAS = [
  {
    rule_id: "image-alt",
    impact: "critical",
    help: { es: "Las imágenes deben tener texto alternativo", en: "Images must have alternative text" },
    wcag: ["1.1.1"],
    nodes: 3,
    examples: ["img.logo", "#galeria > img:nth-child(2)", "#galeria > img:nth-child(3)"],
  },
  {
    rule_id: "label",
    impact: "critical",
    help: { es: "Los elementos de formulario deben tener etiquetas", en: "Form elements must have labels" },
    wcag: ["4.1.2"],
    nodes: 2,
    examples: ["#buscar", "#boletin > input"],
  },
  {
    rule_id: "color-contrast",
    impact: "serious",
    help: {
      es: "Los elementos deben cumplir con los umbrales mínimos de contraste de color",
      en: "Elements must meet minimum color contrast ratio thresholds",
    },
    wcag: ["1.4.3"],
    nodes: 12,
    examples: [".pie p", "a.boton-secundario", ".precio-anterior"],
  },
  {
    rule_id: "link-name",
    impact: "serious",
    help: { es: "Los enlaces deben tener texto discernible", en: "Links must have discernible text" },
    wcag: ["2.4.4", "4.1.2"],
    nodes: 4,
    examples: [".redes > a:nth-child(1)", ".redes > a:nth-child(2)", "a.carrito"],
  },
  {
    rule_id: "html-has-lang",
    impact: "serious",
    help: { es: "El elemento <html> debe tener un atributo lang", en: "<html> element must have a lang attribute" },
    wcag: ["3.1.1"],
    nodes: 1,
    examples: ["html"],
  },
  {
    rule_id: "heading-order",
    impact: "moderate",
    help: { es: "Los niveles de encabezado solo deben aumentar de uno en uno", en: "Heading levels should only increase by one" },
    wcag: [],
    nodes: 2,
    examples: ["h4.destacado", "aside > h5"],
  },
];

function analisisDeEjemplo(direccion, idioma, limpio) {
  return {
    analyzed_url: direccion,
    analyzed_at: new Date().toISOString(),
    violations: limpio ? [] : REGLAS.map((regla) => ({ ...regla, help: regla.help[idioma] })),
    passes: limpio ? 44 : 38,
    incomplete: 3,
  };
}

/* La entrevista guionada. El numero es cuantos mensajes mando la persona:
   0 es la apertura; con el tercero, el asistente ya no tiene preguntas. */
const ENTREVISTA = {
  es: {
    apertura: [
      "Hola. Soy el asistente de tuaccesible y te voy a explicar lo que encontró la prueba automática en tu página.",
      "Lo más urgente son dos problemas críticos: hay 3 imágenes sin texto alternativo y 2 campos de formulario sin etiqueta. Quien usa un lector de pantalla no sabe qué muestran esas imágenes ni qué tiene que escribir en esos campos.",
      "Para explicarte mejor: esas imágenes, ¿muestran información, como productos o gráficos, o son decorativas?",
    ],
    aperturaLimpia: [
      "Hola. Soy el asistente de tuaccesible. La prueba automática no encontró problemas en tu página, y es una buena señal.",
      "Pero una prueba automática encuentra solo una parte de los problemas: no sabe, por ejemplo, si un texto alternativo describe bien la imagen o si todo se puede usar con el teclado.",
      "¿Tu página tiene formularios, menús que se abren o videos?",
    ],
    segunda: [
      "Gracias. Si muestran información, cada imagen necesita un texto alternativo que diga lo mismo que la imagen. Si son decorativas, el texto alternativo va vacío, para que el lector de pantalla las saltee.",
      "Un posible falso positivo: la prueba marcó 12 elementos con poco contraste, pero a veces se equivoca con textos sobre imágenes o degradados. Conviene revisarlos a mano.",
      "¿Alguien de tu equipo puede editar el código de la página, o la arman con una plataforma como WordPress?",
    ],
    segundaLimpia: [
      "Gracias. Eso es justo lo que conviene revisar a mano: que cada campo diga qué hay que escribir, que los menús se abran y se cierren con el teclado y que los videos tengan subtítulos.",
      "¿Alguien de tu equipo puede editar el código de la página, o la arman con una plataforma como WordPress?",
    ],
    tercera: [
      "Perfecto, con eso tengo lo que necesitaba. En el informe vas a encontrar el resultado de la prueba, con cada problema y su criterio WCAG, y lo que la prueba no pudo decidir sola.",
      "Recuerda que una prueba automática encuentra solo una parte de los problemas. Para una revisión completa, con lector de pantalla y teclado, puedes pedir una reunión.",
    ],
    despues: ["Gracias por tu mensaje. Ya no tengo más preguntas: puedes pasar al informe cuando quieras."],
  },
  en: {
    apertura: [
      "Hi. I'm the tuaccesible assistant, and I'll walk you through what the automated test found on your page.",
      "The most urgent are two critical issues: 3 images have no alternative text and 2 form fields have no label. People who use a screen reader can't tell what those images show or what to type in those fields.",
      "To explain this better: do those images carry information, like products or charts, or are they decorative?",
    ],
    aperturaLimpia: [
      "Hi. I'm the tuaccesible assistant. The automated test found no issues on your page, which is a good sign.",
      "But an automated test only finds some of the issues: it can't tell, for example, whether alternative text describes an image well or whether everything works with a keyboard.",
      "Does your page have forms, menus that open, or videos?",
    ],
    segunda: [
      "Thanks. If they carry information, each image needs alternative text that says what the image says. If they're decorative, the alternative text stays empty, so screen readers skip them.",
      "A possible false positive: the test flagged 12 elements with low contrast, but it sometimes gets text over images or gradients wrong. Those are worth checking by hand.",
      "Can someone on your team edit the page's code, or do you build it with a platform like WordPress?",
    ],
    segundaLimpia: [
      "Thanks. That's exactly what's worth checking by hand: that every field says what to type, that menus open and close with the keyboard, and that videos have captions.",
      "Can someone on your team edit the page's code, or do you build it with a platform like WordPress?",
    ],
    tercera: [
      "Great, that's what I needed. The report has the test results, with each issue and its WCAG criterion, and what the test couldn't decide on its own.",
      "Remember that an automated test only finds some of the issues. For a full review, with a screen reader and keyboard, you can ask for a meeting.",
    ],
    despues: ["Thanks for your message. I have no more questions: you can go to the report whenever you like."],
  },
};

function turnoDeEjemplo(idioma, numero, limpio) {
  const guion = ENTREVISTA[idioma];
  const parrafos = [
    limpio ? guion.aperturaLimpia : guion.apertura,
    limpio ? guion.segundaLimpia : guion.segunda,
    guion.tercera,
  ][numero] ?? guion.despues;
  return { reply: parrafos.join("\n\n"), finished: numero >= 2 };
}

/* ---------- El informe ---------- */

const INFORME = {
  es: {
    titulo: "Informe de accesibilidad de tuaccesible (de prueba)",
    direccion: "Dirección analizada",
    fecha: "Fecha del análisis",
    aviso: "Este informe es de prueba: lo arma el backend simulado del sitio, sin axe y sin un modelo de lenguaje. El informe real va a ser un PDF etiquetado y accesible.",
    problemas: (n) => (n === 0 ? "La prueba automática no encontró problemas." : `Problemas encontrados: ${n}.`),
    regla: (impacto, regla) =>
      `- ${impacto}: ${regla.help}. ${regla.wcag.length ? `WCAG ${regla.wcag.join(", ")}` : "Buena práctica"}. ${regla.nodes} ${regla.nodes === 1 ? "elemento" : "elementos"}.`,
    impactos: { critical: "Crítico", serious: "Grave", moderate: "Moderado", minor: "Leve" },
    resto: (pasaron, revisar) => `Comprobaciones que pasaron: ${pasaron}. Para revisar a mano: ${revisar}.`,
    limite: "Una prueba automática encuentra solo una parte de los problemas de accesibilidad.",
  },
  en: {
    titulo: "tuaccesible accessibility report (test)",
    direccion: "Page tested",
    fecha: "Date of the test",
    aviso: "This is a test report: the site's mock backend builds it, with no axe and no language model. The real report will be a tagged, accessible PDF.",
    problemas: (n) => (n === 0 ? "The automated test found no issues." : `Issues found: ${n}.`),
    regla: (impacto, regla) =>
      `- ${impacto}: ${regla.help}. ${regla.wcag.length ? `WCAG ${regla.wcag.join(", ")}` : "Best practice"}. ${regla.nodes} ${regla.nodes === 1 ? "element" : "elements"}.`,
    impactos: { critical: "Critical", serious: "Serious", moderate: "Moderate", minor: "Minor" },
    resto: (pasaron, revisar) => `Checks passed: ${pasaron}. To review by hand: ${revisar}.`,
    limite: "An automated test only finds some accessibility issues.",
  },
};

function informeDeEjemplo(analisis, idioma) {
  const t = INFORME[idioma];
  const fecha = `${analisis.analyzed_at.slice(0, 16).replace("T", " ")} UTC`;
  const lineas = [
    `${t.direccion}: ${analisis.analyzed_url}`,
    `${t.fecha}: ${fecha}`,
    "",
    t.aviso,
    "",
    t.problemas(analisis.violations.length),
    ...analisis.violations.map((regla) => t.regla(t.impactos[regla.impact], regla)),
    "",
    t.resto(analisis.passes, analisis.incomplete),
    "",
    t.limite,
  ];
  return armarPdf({ titulo: t.titulo, idioma, parrafos: lineas });
}

/* Un PDF de una pagina, armado a mano: Helvetica con WinAnsiEncoding (que
   coincide con latin1 en las letras del espanol), titulo e idioma en el
   catalogo. No esta etiquetado: es solo para probar la descarga. */
function armarPdf({ titulo, idioma, parrafos }) {
  const aLatin1 = (texto) => texto.replace(/[^\x20-\xFF]/g, "?");
  const escapar = (texto) => aLatin1(texto).replace(/[\\()]/g, "\\$&");
  const lineas = parrafos.flatMap((parrafo) => partir(parrafo, 88)).slice(0, 44);
  let contenido = `BT\n/F1 16 Tf\n56 780 Td\n(${escapar(titulo)}) Tj\n/F1 11 Tf\n15 TL\n0 -14 Td\n`;
  for (const linea of lineas) contenido += `(${escapar(linea)}) '\n`;
  contenido += "ET\n";
  const objetos = [
    `<< /Type /Catalog /Pages 2 0 R /Lang (${idioma}) /ViewerPreferences << /DisplayDocTitle true >> >>`,
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    `<< /Length ${Buffer.byteLength(contenido, "latin1")} >>\nstream\n${contenido}endstream`,
    `<< /Title (${escapar(titulo)}) /Producer (backend simulado de tuaccesible) >>`,
  ];
  let pdf = "%PDF-1.7\n%\xE2\xE3\xCF\xD3\n";
  const posiciones = [];
  objetos.forEach((objeto, indice) => {
    posiciones.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${indice + 1} 0 obj\n${objeto}\nendobj\n`;
  });
  const inicioXref = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  for (const posicion of posiciones) pdf += `${String(posicion).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

// Parte un parrafo en lineas de hasta "ancho" caracteres, por palabras.
function partir(parrafo, ancho) {
  if (!parrafo) return [""];
  const lineas = [];
  let actual = "";
  for (const palabra of parrafo.split(" ")) {
    for (let resto = palabra; resto; resto = resto.slice(ancho)) {
      const trozo = resto.slice(0, ancho);
      if (actual && actual.length + 1 + trozo.length > ancho) {
        lineas.push(actual);
        actual = trozo;
      } else {
        actual = actual ? `${actual} ${trozo}` : trozo;
      }
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

/* ---------- Arranque ---------- */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const puerto = Number(process.env.PUERTO ?? 3000);
  const origenes = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((origen) => origen.trim()) : ORIGENES_POR_DEFECTO;
  const servidor = crearBackendSimulado({ origenes, registrar: (linea) => console.log(linea) });
  servidor.on("error", (error) => {
    console.error(error.code === "EADDRINUSE" ? `El puerto ${puerto} ya esta en uso. Prueba con otro: PUERTO=3001 npm run backend:simulado` : error);
    process.exit(1);
  });
  servidor.listen(puerto, "localhost", () => {
    console.log(`Backend simulado en http://localhost:${puerto}`);
    console.log(`Acepta pedidos desde: ${origenes.join(", ")}`);
    console.log("Ctrl+C para apagarlo.");
  });
  process.on("SIGINT", () => {
    servidor.closeAllConnections();
    servidor.close(() => process.exit(0));
  });
}
