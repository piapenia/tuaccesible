import { serializarJsonLd } from "../utilidades/json-ld.js";

/* Bloque de datos estructurados (schema.org) dentro del cuerpo de una pagina.
   Un <script type="application/ld+json"> es un "data block", no un script
   ejecutable: el navegador lo descarta antes de llegar a la comprobacion de
   CSP, asi que script-src 'self' no lo bloquea. */
export function DatosEstructurados({ datos }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarJsonLd(datos) }} />;
}
