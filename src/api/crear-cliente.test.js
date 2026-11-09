/* Tests del cliente de la API (crear-cliente.js) con un fetch falso: no
   hace falta ningun backend corriendo. Corren con "npm test", o solo los de
   esta carpeta con:
     node --test "src/api/*.test.js" */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { crearClienteApi } from "./crear-cliente.js";

const URL_BASE = "http://localhost:3000";
const ID = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";
const SESION = {
  id: ID,
  analyzed_url: "https://misitio.com/",
  score: null,
  comment: null,
  meeting_requested: false,
  created_at: "2026-11-14T15:04:05.123Z",
};

const conCodigo = (codigo) => ({ name: "ErrorApi", codigo });
const esperar = (ms) => new Promise((listo) => setTimeout(listo, ms));

function json(estado, datos) {
  return new Response(JSON.stringify(datos), { status: estado, headers: { "Content-Type": "application/json" } });
}

/* fetch falso: anota cada llamada y devuelve lo que diga "contestar". */
function fetchFalso(contestar) {
  const llamadas = [];
  async function fetch(url, opciones) {
    llamadas.push({ url, ...opciones });
    return contestar(url, opciones);
  }
  return { fetch, llamadas };
}

/* Promesa que solo termina cuando el cliente aborta el pedido, como un
   fetch real cuando se cumple el tiempo limite. */
function hastaQueAborte(signal) {
  return new Promise((_, rechazar) => {
    signal.addEventListener("abort", () => rechazar(new DOMException("This operation was aborted", "AbortError")));
  });
}

describe("sin backend configurado", () => {
  test("informa no-configurado y no sale ningun pedido", async () => {
    for (const urlBase of [null, undefined, ""]) {
      const { fetch, llamadas } = fetchFalso(() => json(200, { status: "ok" }));
      const api = crearClienteApi({ urlBase, fetch });
      assert.equal(api.configurado, false);
      assert.deepEqual(await api.comprobarDisponibilidad(), { disponible: false, codigo: "no-configurado" });
      await assert.rejects(api.crearSesion({ analyzed_url: "misitio.com" }), conCodigo("no-configurado"));
      await assert.rejects(api.actualizarSesion(ID, { score: 8 }), conCodigo("no-configurado"));
      assert.equal(llamadas.length, 0);
    }
  });
});

describe("comprobarDisponibilidad", () => {
  test("GET /api/health, sin cookies, sin cache y sin cabeceras que pidan permiso previo", async () => {
    const { fetch, llamadas } = fetchFalso(() => json(200, { status: "ok" }));
    const api = crearClienteApi({ urlBase: `${URL_BASE}/`, fetch });
    assert.equal(api.configurado, true);
    assert.deepEqual(await api.comprobarDisponibilidad(), { disponible: true, codigo: null });
    const [llamada] = llamadas;
    assert.equal(llamada.url, `${URL_BASE}/api/health`);
    assert.equal(llamada.method, "GET");
    assert.equal(llamada.credentials, "omit");
    assert.equal(llamada.cache, "no-store");
    assert.equal(llamada.body, undefined);
    assert.deepEqual(llamada.headers, { Accept: "application/json" });
    assert.ok(llamada.signal instanceof AbortSignal);
  });

  test("si el backend contesta mal, disponible es false y codigo dice por que", async () => {
    const casos = [
      [() => json(503, { error: "servidor" }), "servidor"],
      [() => new Response("<!doctype html><title>Otra cosa</title>", { status: 200 }), "respuesta-invalida"],
      [() => json(200, { status: "down" }), "respuesta-invalida"],
      [() => new Response("", { status: 404 }), "no-encontrada"],
    ];
    for (const [contestar, codigo] of casos) {
      const { fetch } = fetchFalso(contestar);
      assert.deepEqual(await crearClienteApi({ urlBase: URL_BASE, fetch }).comprobarDisponibilidad(), { disponible: false, codigo });
    }
  });

  test("backend apagado o CORS que no deja pasar: sin-conexion", async () => {
    const fetch = async () => {
      throw new TypeError("Failed to fetch");
    };
    assert.deepEqual(await crearClienteApi({ urlBase: URL_BASE, fetch }).comprobarDisponibilidad(), {
      disponible: false,
      codigo: "sin-conexion",
    });
  });

  test("backend colgado: tiempo-agotado al cumplirse el tiempo limite", async () => {
    const fetch = (url, { signal }) => hastaQueAborte(signal);
    const inicio = Date.now();
    const resultado = await crearClienteApi({ urlBase: URL_BASE, fetch, tiempoLimiteMs: 20 }).comprobarDisponibilidad();
    assert.deepEqual(resultado, { disponible: false, codigo: "tiempo-agotado" });
    assert.ok(Date.now() - inicio < 1000);
  });

  test("el tiempo limite cubre tambien la lectura de la respuesta", async () => {
    const fetch = async (url, { signal }) => ({ ok: true, status: 200, text: () => hastaQueAborte(signal) });
    const resultado = await crearClienteApi({ urlBase: URL_BASE, fetch, tiempoLimiteMs: 20 }).comprobarDisponibilidad();
    assert.deepEqual(resultado, { disponible: false, codigo: "tiempo-agotado" });
  });

  test("al terminar, el temporizador se cancela y no aborta nada despues", async () => {
    const { fetch, llamadas } = fetchFalso(() => json(200, { status: "ok" }));
    await crearClienteApi({ urlBase: URL_BASE, fetch, tiempoLimiteMs: 30 }).comprobarDisponibilidad();
    await esperar(60);
    assert.equal(llamadas[0].signal.aborted, false);
  });
});

describe("crearSesion", () => {
  test("POST /api/sessions en JSON, con la direccion ya limpia", async () => {
    const { fetch, llamadas } = fetchFalso(() => json(201, SESION));
    const sesion = await crearClienteApi({ urlBase: URL_BASE, fetch }).crearSesion({
      analyzed_url: " misitio.com/?email=ana@correo.com#token=abc ",
    });
    assert.deepEqual(sesion, SESION);
    const [llamada] = llamadas;
    assert.equal(llamada.url, `${URL_BASE}/api/sessions`);
    assert.equal(llamada.method, "POST");
    assert.equal(llamada.credentials, "omit");
    assert.equal(llamada.headers["Content-Type"], "application/json");
    assert.equal(llamada.body, '{"analyzed_url":"https://misitio.com/"}');
    assert.ok(!llamada.body.includes("ana@correo.com"));
  });

  test("una direccion invalida o un campo de mas no salen del navegador", async () => {
    const { fetch, llamadas } = fetchFalso(() => json(201, SESION));
    const api = crearClienteApi({ urlBase: URL_BASE, fetch });
    await assert.rejects(api.crearSesion({ analyzed_url: "javascript:alert(1)" }), conCodigo("url-invalida"));
    await assert.rejects(api.crearSesion({ analyzed_url: "misitio.com", email: "ana@correo.com" }), conCodigo("datos-invalidos"));
    await assert.rejects(api.crearSesion("misitio.com"), conCodigo("datos-invalidos"));
    assert.equal(llamadas.length, 0);
  });

  test("una respuesta sin un id con forma de UUID es respuesta-invalida", async () => {
    const respuestas = [
      () => json(201, { ...SESION, id: 1 }),
      () => json(201, { ...SESION, id: "1" }),
      () => json(201, { analyzed_url: SESION.analyzed_url }),
      () => json(201, "ok"),
      () => new Response(null, { status: 204 }),
      () => new Response("creada", { status: 201 }),
    ];
    for (const contestar of respuestas) {
      const { fetch } = fetchFalso(contestar);
      await assert.rejects(crearClienteApi({ urlBase: URL_BASE, fetch }).crearSesion({ analyzed_url: "misitio.com" }), conCodigo("respuesta-invalida"));
    }
  });

  test("de un 400 solo toma el codigo si es uno de validacion conocido", async () => {
    const casos = [
      [() => json(400, { error: "url-invalida" }), "url-invalida"],
      [() => json(422, { error: "url-invalida" }), "url-invalida"],
      [() => json(400, { error: "La URL no es valida" }), "datos-invalidos"],
      [() => json(400, { error: "<script>alert(1)</script>" }), "datos-invalidos"],
      [() => new Response("Bad Request", { status: 400 }), "datos-invalidos"],
    ];
    for (const [contestar, codigo] of casos) {
      const { fetch } = fetchFalso(contestar);
      await assert.rejects(crearClienteApi({ urlBase: URL_BASE, fetch }).crearSesion({ analyzed_url: "misitio.com" }), conCodigo(codigo));
    }
  });

  test("cada estado HTTP tiene su codigo, y el texto del servidor no llega al error", async () => {
    const casos = [
      [404, "no-encontrada"],
      [429, "demasiados-pedidos"],
      [500, "servidor"],
      [503, "servidor"],
      [401, "servidor"],
    ];
    for (const [estado, codigo] of casos) {
      const { fetch } = fetchFalso(() => new Response("<pre>error: duplicate key value at Pool.query (db.js:12)</pre>", { status: estado }));
      await assert.rejects(crearClienteApi({ urlBase: URL_BASE, fetch }).crearSesion({ analyzed_url: "misitio.com" }), (error) => {
        assert.equal(error.codigo, codigo);
        assert.equal(error.estado, estado);
        assert.ok(!error.message.includes("duplicate"));
        return true;
      });
    }
  });
});

describe("actualizarSesion", () => {
  test("PATCH /api/sessions/:id con solo los campos que llegan, ya limpios", async () => {
    const { fetch, llamadas } = fetchFalso(() => json(200, { ...SESION, score: 9, comment: "Muy claro" }));
    const sesion = await crearClienteApi({ urlBase: URL_BASE, fetch }).actualizarSesion(ID.toUpperCase(), {
      score: "9",
      comment: "  Muy claro  ",
    });
    assert.equal(sesion.score, 9);
    const [llamada] = llamadas;
    assert.equal(llamada.url, `${URL_BASE}/api/sessions/${ID}`);
    assert.equal(llamada.method, "PATCH");
    assert.equal(llamada.credentials, "omit");
    assert.equal(llamada.headers["Content-Type"], "application/json");
    assert.equal(llamada.body, '{"score":9,"comment":"Muy claro"}');
  });

  test("acepta un 204 sin cuerpo", async () => {
    const { fetch } = fetchFalso(() => new Response(null, { status: 204 }));
    assert.equal(await crearClienteApi({ urlBase: URL_BASE, fetch }).actualizarSesion(ID, { meeting_requested: true }), null);
  });

  test("valida todo antes de mandar", async () => {
    const { fetch, llamadas } = fetchFalso(() => json(200, SESION));
    const api = crearClienteApi({ urlBase: URL_BASE, fetch });
    const casos = [
      ["1", { score: 8 }, "id-invalido"],
      ["../admin", { score: 8 }, "id-invalido"],
      [ID, { score: 11 }, "puntaje-invalido"],
      [ID, { score: 7.5 }, "puntaje-invalido"],
      [ID, { comment: "x".repeat(1001) }, "comentario-invalido"],
      [ID, {}, "datos-invalidos"],
      [ID, { puntaje: 8 }, "datos-invalidos"],
      [ID, { meeting_requested: "si" }, "datos-invalidos"],
    ];
    for (const [id, cambios, codigo] of casos) {
      await assert.rejects(api.actualizarSesion(id, cambios), conCodigo(codigo), JSON.stringify([id, cambios]));
    }
    assert.equal(llamadas.length, 0);
  });

  test("una respuesta con otro id es respuesta-invalida", async () => {
    const { fetch } = fetchFalso(() => json(200, { ...SESION, id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }));
    await assert.rejects(crearClienteApi({ urlBase: URL_BASE, fetch }).actualizarSesion(ID, { score: 8 }), conCodigo("respuesta-invalida"));
  });

  test("404: la sesion no existe", async () => {
    const { fetch } = fetchFalso(() => json(404, { error: "no-encontrada" }));
    await assert.rejects(crearClienteApi({ urlBase: URL_BASE, fetch }).actualizarSesion(ID, { score: 8 }), conCodigo("no-encontrada"));
  });
});

describe("fetch del navegador", () => {
  /* El fetch del navegador tira "Illegal invocation" si se lo llama como
     metodo de otro objeto. Este falso hace lo mismo. */
  function fetchExigente(url, opciones) {
    if (this !== undefined && this !== globalThis) throw new TypeError("Illegal invocation");
    return Promise.resolve(json(200, { status: "ok" }));
  }

  test("un fetch propio se llama suelto, sin this ajeno", async () => {
    const api = crearClienteApi({ urlBase: URL_BASE, fetch: fetchExigente });
    assert.deepEqual(await api.comprobarDisponibilidad(), { disponible: true, codigo: null });
  });

  test("sin fetch propio usa el global en el momento del pedido", async () => {
    const original = globalThis.fetch;
    const api = crearClienteApi({ urlBase: URL_BASE });
    globalThis.fetch = fetchExigente;
    try {
      assert.deepEqual(await api.comprobarDisponibilidad(), { disponible: true, codigo: null });
    } finally {
      globalThis.fetch = original;
    }
  });
});
