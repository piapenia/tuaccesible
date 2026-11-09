/* Tests de la limpieza y validacion de datos (validacion.js y errores.js).
   Corren con "npm test", o solo los de esta carpeta con:
     node --test "src/api/*.test.js" */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { ErrorApi, codigosDeError } from "./errores.js";
import {
  LARGO_MAXIMO_COMENTARIO,
  LARGO_MAXIMO_URL,
  limpiarComentario,
  limpiarUrl,
  validarCambios,
  validarId,
  validarPuntaje,
  validarSesionNueva,
} from "./validacion.js";

const conCodigo = (codigo) => ({ name: "ErrorApi", codigo });
const EMOJI = String.fromCodePoint(0x1f600);

describe("limpiarUrl", () => {
  test("deja solo protocolo, dominio, puerto y ruta", () => {
    assert.equal(
      limpiarUrl(" HTTPS://Ejemplo.COM:443/Ruta/pagina?email=ana@correo.com&token=abc#seccion "),
      "https://ejemplo.com/Ruta/pagina"
    );
  });

  test("descarta tambien una query o un fragmento vacios", () => {
    assert.equal(limpiarUrl("https://ejemplo.com/?"), "https://ejemplo.com/");
    assert.equal(limpiarUrl("https://ejemplo.com/#"), "https://ejemplo.com/");
  });

  test("agrega https:// cuando falta el protocolo", () => {
    assert.equal(limpiarUrl("tuaccesible.com"), "https://tuaccesible.com/");
    assert.equal(limpiarUrl("www.ejemplo.com/servicios"), "https://www.ejemplo.com/servicios");
    assert.equal(limpiarUrl("//ejemplo.com/x"), "https://ejemplo.com/x");
  });

  test("acepta http, localhost y puertos propios", () => {
    assert.equal(limpiarUrl("http://ejemplo.com"), "http://ejemplo.com/");
    assert.equal(limpiarUrl("http://localhost:8080/servicios/"), "http://localhost:8080/servicios/");
  });

  test("normaliza la ruta y pasa un dominio con tildes a ASCII", () => {
    assert.equal(limpiarUrl("https://ejemplo.com/a/../b"), "https://ejemplo.com/b");
    assert.equal(limpiarUrl("https://cañón.com/página"), "https://xn--can-8mak.com/p%C3%A1gina");
  });

  test("rechaza otros protocolos", () => {
    for (const texto of ["ftp://ejemplo.com", "file:///etc/passwd", "javascript:alert(1)", "JAVASCRIPT://x.com/%0Aalert(1)", "mailto:ana@correo.com", "data:text/html,hola", "tel:+541234"]) {
      assert.throws(() => limpiarUrl(texto), conCodigo("url-invalida"), texto);
    }
  });

  test("rechaza usuario y contrasena en la direccion", () => {
    assert.throws(() => limpiarUrl("https://ana:clave@ejemplo.com/"), conCodigo("url-invalida"));
    assert.throws(() => limpiarUrl("https://ana@ejemplo.com/"), conCodigo("url-invalida"));
  });

  test("rechaza lo que no es una direccion", () => {
    for (const valor of ["", "   ", "hola", "https://", "https://mi sitio.com", "http://[::1]:3000/", null, undefined, 42, {}, ["https://ejemplo.com"]]) {
      assert.throws(() => limpiarUrl(valor), conCodigo("url-invalida"), String(valor));
    }
  });

  test("el largo maximo se mide con la direccion ya limpia", () => {
    const base = "https://ejemplo.com/";
    const justa = base + "a".repeat(LARGO_MAXIMO_URL - base.length);
    assert.equal(limpiarUrl(justa).length, LARGO_MAXIMO_URL);
    assert.throws(() => limpiarUrl(justa + "a"), conCodigo("url-invalida"));
    assert.equal(limpiarUrl(`${base}?${"x".repeat(5000)}`), base);
  });
});

describe("validarPuntaje", () => {
  test("acepta enteros de 1 a 10, tambien escritos como texto", () => {
    assert.equal(validarPuntaje(1), 1);
    assert.equal(validarPuntaje(10), 10);
    assert.equal(validarPuntaje("8"), 8);
    assert.equal(validarPuntaje(" 7 "), 7);
  });

  test("rechaza todo lo demas", () => {
    for (const valor of [0, 11, -1, 7.5, "7.5", "", "diez", "0x8", "1e1", NaN, Infinity, null, undefined, true, [8]]) {
      assert.throws(() => validarPuntaje(valor), conCodigo("puntaje-invalido"), String(valor));
    }
  });
});

describe("limpiarComentario", () => {
  test("quita los espacios de las puntas, y vacio queda en null", () => {
    assert.equal(limpiarComentario("  Muy claro  "), "Muy claro");
    for (const valor of ["", "   ", " \n\t ", null, undefined]) assert.equal(limpiarComentario(valor), null);
  });

  test("conserva saltos de linea y tabulaciones, y quita los demas caracteres de control", () => {
    const nulo = String.fromCharCode(0);
    assert.equal(limpiarComentario(`linea 1\r\nlinea 2\tfin${nulo}`), "linea 1\nlinea 2\tfin");
  });

  test("cuenta caracteres como PostgreSQL: un emoji es uno", () => {
    assert.equal(limpiarComentario("a".repeat(LARGO_MAXIMO_COMENTARIO)).length, LARGO_MAXIMO_COMENTARIO);
    assert.throws(() => limpiarComentario("a".repeat(LARGO_MAXIMO_COMENTARIO + 1)), conCodigo("comentario-invalido"));
    assert.ok(limpiarComentario(EMOJI.repeat(LARGO_MAXIMO_COMENTARIO)));
    assert.throws(() => limpiarComentario(EMOJI.repeat(LARGO_MAXIMO_COMENTARIO + 1)), conCodigo("comentario-invalido"));
  });

  test("une una letra y su tilde suelta en un solo caracter (NFC)", () => {
    assert.equal(limpiarComentario(`e${String.fromCharCode(0x301)}`), "é");
  });

  test("rechaza lo que no es texto", () => {
    for (const valor of [42, {}, true, ["hola"]]) {
      assert.throws(() => limpiarComentario(valor), conCodigo("comentario-invalido"), String(valor));
    }
  });
});

describe("validarId", () => {
  test("acepta un UUID y lo pasa a minusculas", () => {
    assert.equal(validarId("3F2504E0-4F89-41D3-9A0C-0305E82C3301"), "3f2504e0-4f89-41d3-9a0c-0305e82c3301");
  });

  test("rechaza lo que no tiene forma de UUID", () => {
    for (const valor of [1, "1", "abc", "3f2504e04f8941d39a0c0305e82c3301", "3f2504e0-4f89-41d3-9a0c-0305e82c3301x", "../admin", "", null]) {
      assert.throws(() => validarId(valor), conCodigo("id-invalido"), String(valor));
    }
  });
});

describe("validarSesionNueva", () => {
  test("arma el cuerpo con la direccion ya limpia", () => {
    assert.deepEqual(validarSesionNueva({ analyzed_url: "misitio.com/?email=ana@correo.com" }), {
      analyzed_url: "https://misitio.com/",
    });
  });

  test("no deja mandar campos que no estan en el contrato", () => {
    for (const valor of [{ analyzed_url: "misitio.com", email: "ana@correo.com" }, "misitio.com", null, []]) {
      assert.throws(() => validarSesionNueva(valor), conCodigo("datos-invalidos"), JSON.stringify(valor));
    }
  });

  test("sin direccion es url-invalida", () => {
    assert.throws(() => validarSesionNueva({}), conCodigo("url-invalida"));
  });
});

describe("validarCambios", () => {
  test("manda solo los campos que llegan, ya limpios", () => {
    assert.deepEqual(validarCambios({ score: "9" }), { score: 9 });
    assert.deepEqual(validarCambios({ comment: "  hola " }), { comment: "hola" });
    assert.deepEqual(validarCambios({ comment: "" }), { comment: null });
    assert.deepEqual(validarCambios({ meeting_requested: true }), { meeting_requested: true });
    assert.deepEqual(validarCambios({ score: 7, comment: "Bien", meeting_requested: false }), {
      score: 7,
      comment: "Bien",
      meeting_requested: false,
    });
  });

  test("rechaza campos desconocidos y pedidos vacios", () => {
    for (const valor of [{}, { puntaje: 8 }, { score: 8, meetingRequested: true }, null, [], "score"]) {
      assert.throws(() => validarCambios(valor), conCodigo("datos-invalidos"), JSON.stringify(valor));
    }
  });

  test("meeting_requested tiene que ser true o false", () => {
    for (const valor of ["true", 1, null]) {
      assert.throws(() => validarCambios({ meeting_requested: valor }), conCodigo("datos-invalidos"), String(valor));
    }
  });

  test("cada campo invalido tiene su codigo", () => {
    assert.throws(() => validarCambios({ score: 11 }), conCodigo("puntaje-invalido"));
    assert.throws(() => validarCambios({ comment: "x".repeat(LARGO_MAXIMO_COMENTARIO + 1) }), conCodigo("comentario-invalido"));
  });
});

describe("ErrorApi", () => {
  test("solo acepta codigos de la lista", () => {
    assert.throws(() => new ErrorApi("inventado"), TypeError);
  });

  test("el mensaje es para la consola: lleva el codigo y el estado HTTP", () => {
    const causa = new TypeError("fetch failed");
    const error = new ErrorApi("servidor", { estado: 500, causa });
    assert.equal(error.message, "API de tuaccesible: servidor (HTTP 500)");
    assert.equal(error.estado, 500);
    assert.equal(error.cause, causa);
    assert.ok(error instanceof Error);
    assert.equal(new ErrorApi("sin-conexion").estado, null);
  });

  test("la lista de codigos no tiene repetidos y no se puede modificar", () => {
    assert.equal(new Set(codigosDeError).size, codigosDeError.length);
    assert.ok(Object.isFrozen(codigosDeError));
  });
});
