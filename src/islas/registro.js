/* Registro de islas: nombre -> componente.

   Hoy hay una sola: el Analizador, el servicio de testing (carpeta
   analizador/). Solo la usan las paginas /analizar/ y /en/analyze/, y solo
   cuando el sitio se compila con VITE_API_URL: sin esa variable las
   paginas no dibujan la isla y la compilacion no genera ni publica ningun
   archivo de React para el navegador.

   Para agregar una isla:
   1. Crear el componente en esta carpeta, por ejemplo src/islas/Otra.jsx.
   2. Importarlo aca y sumarlo al objeto:
        import { Otra } from "./Otra.jsx";
        export const islas = { Analizador, Otra };
   3. Usarlo en una pagina con <Isla nombre="Otra" props={{ ... }} />.
   Detalle en el README, seccion "Partes interactivas: las islas". */
import { Analizador } from "./analizador/Analizador.jsx";

export const islas = { Analizador };
