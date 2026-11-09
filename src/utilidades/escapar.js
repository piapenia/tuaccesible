/* Escapa texto para meterlo dentro de HTML, en contenido o en atributos.
   Lo usa src/documento.js, que arma el <head> como texto. Las partes que
   dibuja React ya salen escapadas por React. */
export function escapar(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
