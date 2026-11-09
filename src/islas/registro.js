/* Registro de islas: nombre -> componente.

   Hoy esta vacio a proposito: ninguna pagina del sitio necesita JavaScript
   propio todavia, y mientras este vacio la compilacion no genera ni publica
   ningun archivo de React para el navegador.

   Para agregar una isla:
   1. Crear el componente en esta carpeta, por ejemplo src/islas/Analizador.jsx.
   2. Importarlo aca y sumarlo al objeto:
        import { Analizador } from "./Analizador.jsx";
        export const islas = { Analizador };
   3. Usarlo en una pagina con <Isla nombre="Analizador" props={{ ... }} />.
   Detalle en el README, seccion "Partes interactivas: las islas". */
export const islas = {};
