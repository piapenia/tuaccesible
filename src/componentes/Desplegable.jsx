import { ChevronDown } from "lucide-react";
import { Icono } from "./Icono.jsx";

/* Bloque que se abre y se cierra: un <details> nativo con su <summary>.

   Es el elemento del navegador, y no un boton con JavaScript, a proposito:
   el contenido esta en el HTML aunque no corra ningun script, y el propio
   navegador le anuncia al lector de pantalla si el bloque esta abierto o
   cerrado, sin aria-expanded que mantener a mano.

     <Desplegable resumen="What the site audit includes">
       <ul>...</ul>
       <p>...</p>
     </Desplegable>

   resumen es el texto que se ve siempre y que abre o cierra el bloque.

   La flecha que gira es un icono decorativo (aria-hidden), en el marcado y
   no en un ::before con contenido: algunos lectores de pantalla leen en voz
   alta el contenido generado por CSS. Reemplaza al triangulo del navegador,
   que el CSS oculta. El estado no depende solo de esa flecha: el navegador
   lo anuncia, y a la vista el bloque abierto muestra su contenido.

   Lo de adentro va en un <div> que lleva el relleno interior. Los estilos,
   incluida la apertura suave cuando nadie pidio menos movimiento, estan en
   src/estilos/componentes.css. */
export function Desplegable({ resumen, children }) {
  return (
    <details className="desplegable">
      <summary>
        <span className="desplegable__resumen">{resumen}</span>
        <Icono de={ChevronDown} className="desplegable__flecha" />
      </summary>
      <div className="desplegable__contenido">{children}</div>
    </details>
  );
}
