/* Textos de la isla del analizador, en espanol y en ingles.

   Todo lo que la isla muestra o anuncia sale de aca: los componentes no
   tienen ningun texto escrito adentro. El espanol es el neutro del sitio,
   con tuteo ("escribe", "puedes"), nunca voseo.

   Los errores se eligen por el codigo del ErrorApi (src/api/errores.js):
   la isla nunca muestra lo que dice el servidor. */

const es = {
  respaldo: "El servicio se está cargando. Necesita JavaScript: si este texto no cambia en unos segundos, escríbenos desde la",
  respaldoEnlace: "página de contacto",
  contacto: "/contacto/",

  pasos: {
    etiqueta: "Pasos del análisis",
    completado: "(completado)",
    nombres: {
      direccion: "Dirección",
      resultados: "Resultados",
      entrevista: "Entrevista",
      final: "Informe y opinión",
    },
  },

  direccion: {
    titulo: "Dirección de la página",
    intro: "Analizamos una sola página por vez. Puede ser la portada o la que más te preocupe.",
    etiqueta: "Dirección de la página (obligatoria)",
    ayuda: "Por ejemplo, misitio.com o https://misitio.com/tienda.",
    enviar: "Analizar",
    enviando: "Analizando…",
    analizando: (url) => `Analizando ${url}. Puede tardar hasta un minuto.`,
  },

  resultados: {
    titulo: "Resultados del análisis automático",
    resumen: (url, fecha) => `Página analizada: ${url}, el ${fecha}.`,
    conteos: {
      reglas: (n) => (n === 1 ? "regla con problemas" : "reglas con problemas"),
      elementos: (n) => (n === 1 ? "elemento afectado" : "elementos afectados"),
      superadas: (n) => (n === 1 ? "regla superada" : "reglas superadas"),
      revisar: (n) => (n === 1 ? "resultado para revisar a mano" : "resultados para revisar a mano"),
    },
    limites:
      "Una prueba automática detecta solo una parte de los problemas. El resto se encuentra revisando la página con teclado y con lectores de pantalla, que es lo que hace una auditoría.",
    problemas: "Problemas encontrados",
    sinProblemas:
      "La prueba automática no encontró problemas en esta página. Eso no quiere decir que sea accesible: quedan los que solo aparecen al usarla con teclado y con lector de pantalla.",
    sinProblemasDestacado: "Sin problemas detectados.",
    gravedad: "Gravedad",
    gravedades: { critical: "Crítico", serious: "Grave", moderate: "Moderado", minor: "Leve" },
    criterios: "Criterios WCAG",
    sinCriterio: "Ninguno: es una buena práctica, no un criterio de WCAG.",
    elementos: "Elementos afectados",
    ejemplos: "Ejemplos en la página",
    regla: "Regla de axe",
    entrevista: "Seguir con la entrevista",
    otra: "Analizar otra dirección",
  },

  entrevista: {
    titulo: "Entrevista sobre tu sitio",
    intro:
      "Un asistente te hace unas pocas preguntas sobre tu sitio, para que el informe hable de tu caso. Puedes terminar cuando quieras.",
    privacidad: "No escribas datos personales ni contraseñas: tus respuestas las procesa un modelo de lenguaje.",
    conversacion: "Conversación con el asistente",
    asistente: "Asistente",
    tu: "Tú",
    etiqueta: "Tu respuesta",
    ayuda: (maximo) => `Hasta ${maximo} caracteres.`,
    enviar: "Enviar respuesta",
    terminar: "Terminar la entrevista",
    seguir: "Seguir al informe",
    esperando: "Esperando la respuesta del asistente.",
    completa: "La entrevista está completa. Puedes seguir al informe o agregar algo más.",
    reintentar: "Volver a intentar",
  },

  final: {
    titulo: "Informe y opinión",
    informe: "Informe en PDF",
    informeTexto: "El informe junta los resultados de la prueba y lo que contaste en la entrevista. Está disponible durante una hora.",
    descargar: "Descargar el informe en PDF",
    reunion: "Reunión",
    reunionTexto: "Si quieres repasar los resultados con nosotros en una videollamada, avísanos.",
    pedirReunion: "Quiero una reunión",
    pidiendoReunion: "Enviando el pedido…",
    reunionAnotada: "Anotamos tu pedido de reunión.",
    agenda: "Elige el día y el horario en la agenda",
    agendaPestana: "(se abre en otra pestaña)",
    sinAgenda: "La agenda en línea todavía no está lista. Para elegir el día, escríbenos desde la",
    sinAgendaEnlace: "página de contacto",
    sinAgendaCierre: "y menciona la página que analizaste.",
    opinion: "Tu opinión",
    pregunta: "¿Qué tan útil te resultó el análisis? (obligatorio)",
    escala: "1 es nada útil y 10 es muy útil.",
    comentario: "Comentario (opcional)",
    ayudaComentario: (maximo) => `Hasta ${maximo} caracteres. No escribas datos personales.`,
    enviarOpinion: "Enviar opinión",
    enviandoOpinion: "Enviando…",
    gracias: "Gracias por tu opinión. Nos ayuda a mejorar el servicio.",
    otra: "Analizar otra dirección",
  },

  errores: {
    "no-configurado": "El servicio todavía no está disponible en este sitio.",
    "sin-conexion": "No pudimos conectarnos con el servicio. Revisa tu conexión y vuelve a intentarlo en unos minutos.",
    "tiempo-agotado": "El servicio tardó demasiado en responder. Vuelve a intentarlo en unos minutos.",
    "respuesta-invalida": "El servicio respondió algo que no esperábamos. Vuelve a intentarlo, y si se repite, escríbenos.",
    "url-invalida": "Escribe la dirección de una página web, por ejemplo misitio.com o https://misitio.com/tienda.",
    "sitio-inaccesible": "No pudimos abrir esa página para analizarla. Revisa que la dirección esté bien escrita y que el sitio esté publicado.",
    "puntaje-invalido": "Elige un puntaje del 1 al 10.",
    "comentario-invalido": (maximo) => `El comentario puede tener hasta ${maximo} caracteres.`,
    "mensaje-invalido": (maximo) => `Escribe tu respuesta, de hasta ${maximo} caracteres.`,
    "id-invalido": "Algo salió mal con esta sesión. Vuelve a analizar la dirección.",
    "datos-invalidos": "Algo salió mal al enviar los datos. Vuelve a intentarlo.",
    "no-encontrada": "Esta sesión ya no existe: los resultados se guardan una hora. Vuelve a analizar la dirección.",
    "demasiados-pedidos": "Hiciste muchos pedidos seguidos. Espera unos minutos y vuelve a intentarlo.",
    "limite-entrevista": "Llegaste al límite de mensajes de esta entrevista. Puedes seguir al informe con lo que ya contaste.",
    servidor: "El servicio tuvo un problema. Vuelve a intentarlo en unos minutos.",
  },
};

const en = {
  respaldo: "The service is loading. It needs JavaScript: if this text doesn't change in a few seconds, write to us from the",
  respaldoEnlace: "contact page",
  contacto: "/en/contact/",

  pasos: {
    etiqueta: "Analysis steps",
    completado: "(completed)",
    nombres: {
      direccion: "Address",
      resultados: "Results",
      entrevista: "Interview",
      final: "Report and feedback",
    },
  },

  direccion: {
    titulo: "Page address",
    intro: "We analyze one page at a time. It can be your home page or the one you're most concerned about.",
    etiqueta: "Page address (required)",
    ayuda: "For example, mysite.com or https://mysite.com/shop.",
    enviar: "Analyze",
    enviando: "Analyzing…",
    analizando: (url) => `Analyzing ${url}. It can take up to a minute.`,
  },

  resultados: {
    titulo: "Automated test results",
    resumen: (url, fecha) => `Page analyzed: ${url}, on ${fecha}.`,
    conteos: {
      reglas: (n) => (n === 1 ? "rule with issues" : "rules with issues"),
      elementos: (n) => (n === 1 ? "affected element" : "affected elements"),
      superadas: (n) => (n === 1 ? "rule passed" : "rules passed"),
      revisar: (n) => (n === 1 ? "result to check by hand" : "results to check by hand"),
    },
    limites:
      "An automated test finds only some of the issues. The rest show up when the page is tested with a keyboard and with screen readers, which is what an audit does.",
    problemas: "Issues found",
    sinProblemas:
      "The automated test found no issues on this page. That doesn't mean it's accessible: the issues that only show up with a keyboard and a screen reader are still unchecked.",
    sinProblemasDestacado: "No issues detected.",
    gravedad: "Severity",
    gravedades: { critical: "Critical", serious: "Serious", moderate: "Moderate", minor: "Minor" },
    criterios: "WCAG success criteria",
    sinCriterio: "None: it's a best practice, not a WCAG success criterion.",
    elementos: "Affected elements",
    ejemplos: "Examples on the page",
    regla: "axe rule",
    entrevista: "Continue to the interview",
    otra: "Analyze another address",
  },

  entrevista: {
    titulo: "Interview about your site",
    intro: "An assistant asks you a few questions about your site, so the report speaks to your case. You can stop whenever you want.",
    privacidad: "Don't include personal data or passwords: your answers are processed by a language model.",
    conversacion: "Conversation with the assistant",
    asistente: "Assistant",
    tu: "You",
    etiqueta: "Your answer",
    ayuda: (maximo) => `Up to ${maximo} characters.`,
    enviar: "Send answer",
    terminar: "End the interview",
    seguir: "Continue to the report",
    esperando: "Waiting for the assistant's reply.",
    completa: "The interview is complete. You can continue to the report or add something else.",
    reintentar: "Try again",
  },

  final: {
    titulo: "Report and feedback",
    informe: "PDF report",
    informeTexto: "The report brings together the test results and what you told us in the interview. It's available for one hour.",
    descargar: "Download the PDF report",
    reunion: "Meeting",
    reunionTexto: "If you'd like to go over the results with us on a video call, let us know.",
    pedirReunion: "I'd like a meeting",
    pidiendoReunion: "Sending the request…",
    reunionAnotada: "We've noted your meeting request.",
    agenda: "Choose a day and time in our calendar",
    agendaPestana: "(opens in a new tab)",
    sinAgenda: "Our online calendar isn't ready yet. To choose a day, write to us from the",
    sinAgendaEnlace: "contact page",
    sinAgendaCierre: "and mention the page you analyzed.",
    opinion: "Your feedback",
    pregunta: "How useful was the analysis? (required)",
    escala: "1 is not useful at all and 10 is very useful.",
    comentario: "Comment (optional)",
    ayudaComentario: (maximo) => `Up to ${maximo} characters. Don't include personal data.`,
    enviarOpinion: "Send feedback",
    enviandoOpinion: "Sending…",
    gracias: "Thank you for your feedback. It helps us improve the service.",
    otra: "Analyze another address",
  },

  errores: {
    "no-configurado": "The service isn't available on this site yet.",
    "sin-conexion": "We couldn't connect to the service. Check your connection and try again in a few minutes.",
    "tiempo-agotado": "The service took too long to respond. Try again in a few minutes.",
    "respuesta-invalida": "The service sent a response we didn't expect. Try again, and if it happens again, write to us.",
    "url-invalida": "Enter the address of a web page, for example mysite.com or https://mysite.com/shop.",
    "sitio-inaccesible": "We couldn't open that page to analyze it. Check that the address is spelled correctly and that the site is online.",
    "puntaje-invalido": "Choose a score from 1 to 10.",
    "comentario-invalido": (maximo) => `The comment can be up to ${maximo} characters long.`,
    "mensaje-invalido": (maximo) => `Write your answer, up to ${maximo} characters long.`,
    "id-invalido": "Something went wrong with this session. Analyze the address again.",
    "datos-invalidos": "Something went wrong while sending the data. Try again.",
    "no-encontrada": "This session no longer exists: results are kept for one hour. Analyze the address again.",
    "demasiados-pedidos": "You've made many requests in a row. Wait a few minutes and try again.",
    "limite-entrevista": "You've reached the message limit for this interview. You can continue to the report with what you've already told us.",
    servidor: "The service ran into a problem. Try again in a few minutes.",
  },
};

export const textos = { es, en };

/* El mensaje para un error de la API. "extra" es el numero que algunos
   mensajes necesitan (el largo maximo de un campo). Un error que no es de
   la API, como un fallo de programacion, se muestra como "servidor": a la
   persona no le sirve el detalle, y la consola ya lo tiene. */
export function mensajeDeError(t, error, extra) {
  const mensaje = t.errores[codigoDe(error)] ?? t.errores.servidor;
  return typeof mensaje === "function" ? mensaje(extra) : mensaje;
}

export function codigoDe(error) {
  if (error && error.name === "ErrorApi") return error.codigo;
  console.error("tuaccesible: error inesperado en el analizador", error);
  return "servidor";
}
