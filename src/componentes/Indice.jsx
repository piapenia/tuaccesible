/* Indice "En esta pagina": la lista de secciones de una pagina larga, al
   principio, con un enlace a cada una.

     <Indice idioma="es" entradas={[
       ["quien-trata-tus-datos", "Quién trata tus datos"],
       ["tus-derechos", "Tus derechos"],
     ]} />

   Sirve sobre todo a quien no usa el mouse ni un lector de pantalla: con
   teclado, con un pulsador o con control por voz, llegar a la ultima
   seccion de la politica de privacidad sin el indice son decenas de Tab o
   de "bajar". Con el indice es un enlace.

   - entradas: pares [id, texto]. El id es el de la seccion (Seccion.jsx
     con id=) o el del h2, y el texto es el del titulo, igual. La prueba de
     src/componentes/componentes.test.js dibuja cada pagina que lo usa y
     falla si un enlace no tiene destino o si su texto no es el del titulo.

   Va en un <nav> con nombre, que NVDA lista entre los puntos de referencia
   como "En esta pagina, navegacion". El nombre sale del texto visible de
   arriba (aria-labelledby), asi lo que se ve y lo que se oye es lo mismo.
   Es una lista comun con vinetas: no le hace falta role="list". */
export function Indice({ idioma, entradas }) {
  if (!entradas?.length) {
    throw new Error("Indice: faltan entradas");
  }
  const en = idioma === "en";
  return (
    <nav className="indice" aria-labelledby="indice-titulo">
      <p className="indice__titulo" id="indice-titulo">
        {en ? "On this page" : "En esta página"}
      </p>
      <ul>
        {entradas.map(([id, texto]) => (
          <li key={id}>
            <a href={`#${id}`}>{texto}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
