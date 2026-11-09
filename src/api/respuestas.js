/* Lo que contesta el backend en el analisis y la entrevista (la propuesta
   de docs/contrato-api.md), comprobado antes de llegar a la pantalla.

   Cada funcion devuelve una copia con solo los campos que conoce: un campo
   de mas que mande el backend no viaja hasta la isla. Si falta algo, sobra
   largo o un valor no tiene la forma acordada, tira un ErrorApi
   respuesta-invalida y la isla muestra su mensaje de error, en vez de
   dibujar a medias una respuesta rara.

   Los textos (help de axe, reply del LLM) se muestran como texto, nunca
   como HTML: React los escapa solo. Aca solo se limita el largo. */

import { ErrorApi } from "./errores.js";

// Del mas grave al menos grave, como los nombra axe. La isla los ordena asi.
export const IMPACTOS = Object.freeze(["critical", "serious", "moderate", "minor"]);

export const LARGO_MAXIMO_RESPUESTA = 4000;
const MAXIMO_REGLAS = 100;
const MAXIMO_EJEMPLOS = 5;
const LARGO_MAXIMO_TEXTO = 500;
// Un criterio de WCAG: 1.1.1, 1.4.3, 2.4.11...
const FORMA_CRITERIO = /^[1-4]\.\d{1,2}\.\d{1,2}$/;

const invalida = () => new ErrorApi("respuesta-invalida");

/* POST /api/sessions/:id/analysis */
export function comprobarAnalisis(datos) {
  if (!esObjeto(datos) || typeof datos.analyzed_at !== "string") throw invalida();
  const fecha = new Date(datos.analyzed_at);
  if (Number.isNaN(fecha.getTime())) throw invalida();
  return {
    analyzed_url: texto(datos.analyzed_url, 2048),
    analyzed_at: fecha.toISOString(),
    violations: lista(datos.violations, MAXIMO_REGLAS).map(comprobarRegla),
    passes: entero(datos.passes, 0),
    incomplete: entero(datos.incomplete, 0),
  };
}

function comprobarRegla(regla) {
  if (!esObjeto(regla) || !IMPACTOS.includes(regla.impact)) throw invalida();
  return {
    rule_id: texto(regla.rule_id, 100),
    impact: regla.impact,
    help: texto(regla.help, LARGO_MAXIMO_TEXTO),
    wcag: lista(regla.wcag, 20).map((criterio) => {
      if (typeof criterio !== "string" || !FORMA_CRITERIO.test(criterio)) throw invalida();
      return criterio;
    }),
    nodes: entero(regla.nodes, 1),
    examples: lista(regla.examples, MAXIMO_EJEMPLOS).map((ejemplo) => texto(ejemplo, LARGO_MAXIMO_TEXTO)),
  };
}

/* POST /api/sessions/:id/interview */
export function comprobarTurno(datos) {
  if (!esObjeto(datos) || typeof datos.finished !== "boolean") throw invalida();
  return { reply: texto(datos.reply, LARGO_MAXIMO_RESPUESTA), finished: datos.finished };
}

function esObjeto(valor) {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

// Texto con algo adentro y de largo razonable, contado en caracteres.
function texto(valor, largoMaximo) {
  if (typeof valor !== "string" || !valor.trim() || [...valor].length > largoMaximo) throw invalida();
  return valor.trim();
}

function entero(valor, minimo) {
  if (!Number.isInteger(valor) || valor < minimo) throw invalida();
  return valor;
}

function lista(valor, maximo) {
  if (!Array.isArray(valor) || valor.length > maximo) throw invalida();
  return valor;
}
