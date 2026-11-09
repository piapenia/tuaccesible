/* El cliente del sitio (src/api/) contra el backend simulado: si los dos
   cumplen el mismo contrato, el recorrido completo funciona. Node no aplica
   CORS, asi que las cabeceras se prueban aparte, mirandolas. */
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { crearClienteApi } from "../src/api/crear-cliente.js";
import { crearBackendSimulado } from "./backend-simulado.js";

const conCodigo = (codigo) => ({ name: "ErrorApi", codigo });

let servidor;
let base;

before(async () => {
  servidor = crearBackendSimulado({ demoraMs: 0, esperaLentoMs: 300 });
  await new Promise((listo) => servidor.listen(0, "127.0.0.1", listo));
  base = `http://127.0.0.1:${servidor.address().port}`;
});

after(() => {
  servidor.closeAllConnections();
  servidor.close();
});

describe("backend simulado", () => {
  test("recorrido completo con el cliente del sitio", async () => {
    const api = crearClienteApi({ urlBase: base });
    assert.deepEqual(await api.comprobarDisponibilidad(), { disponible: true, codigo: null });

    const sesion = await api.crearSesion({ analyzed_url: "misitio.com/tienda?email=ana@correo.com" });
    assert.equal(sesion.analyzed_url, "https://misitio.com/tienda");

    const analisis = await api.analizarSesion(sesion.id, { idioma: "es" });
    assert.equal(analisis.violations.length, 6);
    assert.equal(analisis.violations[0].help, "Las imágenes deben tener texto alternativo");

    const apertura = await api.entrevistar(sesion.id, { idioma: "es", mensaje: null });
    assert.equal(apertura.finished, false);
    assert.match(apertura.reply, /\n\n/);
    assert.equal((await api.entrevistar(sesion.id, { idioma: "es", mensaje: "Son productos" })).finished, false);
    assert.equal((await api.entrevistar(sesion.id, { idioma: "es", mensaje: "Usamos WordPress" })).finished, true);

    const informe = await fetch(api.urlInforme(sesion.id, "en"));
    assert.equal(informe.status, 200);
    assert.equal(informe.headers.get("content-type"), "application/pdf");
    assert.match(informe.headers.get("content-disposition"), /attachment; filename="informe-tuaccesible.pdf"/);
    const pdf = Buffer.from(await informe.arrayBuffer()).toString("latin1");
    assert.ok(pdf.startsWith("%PDF-1.7"));
    assert.match(pdf, /\/Lang \(en\)/);
    assert.ok(pdf.trimEnd().endsWith("%%EOF"));
    // La tabla xref apunta al primer byte de cada objeto.
    const [, primero] = pdf.match(/xref\n0 \d+\n0000000000 65535 f \n(\d{10})/);
    assert.ok(pdf.slice(Number(primero)).startsWith("1 0 obj"));

    const conReunion = await api.actualizarSesion(sesion.id, { meeting_requested: true });
    assert.equal(conReunion.meeting_requested, true);
    const final = await api.actualizarSesion(sesion.id, { score: "9", comment: "  Muy claro " });
    assert.deepEqual([final.score, final.comment, final.meeting_requested], [9, "Muy claro", true]);
  });

  test("las direcciones especiales", async () => {
    const api = crearClienteApi({ urlBase: base, tiempoLimiteLargoMs: 100 });
    const analizar = async (direccion) => api.analizarSesion((await api.crearSesion({ analyzed_url: direccion })).id, { idioma: "en" });
    const limpio = await analizar("limpio.test");
    assert.deepEqual(limpio.violations, []);
    await assert.rejects(analizar("sinsitio.test"), conCodigo("sitio-inaccesible"));
    await assert.rejects(analizar("fallo.test"), conCodigo("servidor"));
    await assert.rejects(analizar("lento.test"), conCodigo("tiempo-agotado"));
  });

  test("hasta 10 mensajes por sesion; el siguiente es 429", async () => {
    const api = crearClienteApi({ urlBase: base });
    const { id } = await api.crearSesion({ analyzed_url: "misitio.com" });
    await api.analizarSesion(id, { idioma: "es" });
    for (let numero = 1; numero <= 10; numero += 1) await api.entrevistar(id, { idioma: "es", mensaje: `Mensaje ${numero}` });
    await assert.rejects(api.entrevistar(id, { idioma: "es", mensaje: "Uno mas" }), conCodigo("demasiados-pedidos"));
  });

  test("sin analisis o sin sesion, 404; datos mal armados, 400 con su codigo", async () => {
    const api = crearClienteApi({ urlBase: base });
    const { id } = await api.crearSesion({ analyzed_url: "misitio.com" });
    await assert.rejects(api.entrevistar(id, { idioma: "es", mensaje: null }), conCodigo("no-encontrada"));
    assert.equal((await fetch(api.urlInforme(id, "es"))).status, 404);
    await assert.rejects(api.analizarSesion("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", { idioma: "es" }), conCodigo("no-encontrada"));

    const pedir = (ruta, cuerpo) =>
      fetch(base + ruta, { method: "POST", headers: { "Content-Type": "application/json" }, body: cuerpo }).then(async (respuesta) => [respuesta.status, await respuesta.json()]);
    assert.deepEqual(await pedir("/api/sessions", '{"analyzed_url":"ftp://misitio.com"}'), [400, { error: "url-invalida" }]);
    assert.deepEqual(await pedir("/api/sessions", "no es json"), [400, { error: "datos-invalidos" }]);
    assert.deepEqual(await pedir(`/api/sessions/${id}/analysis`, '{"language":"es","extra":1}'), [400, { error: "datos-invalidos" }]);
    assert.deepEqual(await pedir(`/api/sessions/${id}/interview`, '{"language":"es","message":"   "}'), [400, { error: "mensaje-invalido" }]);
    assert.deepEqual(await pedir("/api/sessions/1/analysis", '{"language":"es"}'), [400, { error: "id-invalido" }]);
  });

  test("CORS solo para los origenes del contrato", async () => {
    const consultar = (origen) =>
      fetch(`${base}/api/sessions`, {
        method: "OPTIONS",
        headers: { Origin: origen, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" },
      });
    const permitido = await consultar("http://localhost:8080");
    assert.equal(permitido.status, 204);
    assert.equal(permitido.headers.get("access-control-allow-origin"), "http://localhost:8080");
    assert.match(permitido.headers.get("access-control-allow-methods"), /PATCH/);
    assert.match(permitido.headers.get("access-control-allow-headers"), /Content-Type/i);
    const ajeno = await consultar("https://otro-sitio.example");
    assert.equal(ajeno.headers.get("access-control-allow-origin"), null);
  });
});
