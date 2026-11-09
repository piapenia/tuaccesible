/* Convierte un objeto en el texto de un bloque application/ld+json.
   Se escapa "<" como \u003c para que ningun valor pueda cerrar el
   <script> antes de tiempo (por ejemplo, un texto que contenga </script>).
   Sigue siendo JSON valido: los buscadores lo leen igual. */
export function serializarJsonLd(datos) {
  return JSON.stringify(datos, null, 2).replace(/</g, "\\u003c");
}
