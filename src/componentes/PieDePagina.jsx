import { ArrowUp, Mail } from "lucide-react";
import { Icono } from "./Icono.jsx";
import { sitio } from "../sitio.js";

/* Pie: quien es, el correo, los dos enlaces legales, las preferencias de
   visualizacion y "Volver arriba".

   El id="pie" es el destino del atajo "Ir al pie de pagina" de la cabecera.

   "Volver arriba" es un enlace comun a #arriba, el id del <body>
   (src/documento.js), y no un boton con JavaScript: funciona sin scripts,
   el navegador lo desplaza solo, y el siguiente Tab sale desde el principio
   de la pagina. No apunta a un #top inexistente: ahi el desplazamiento
   funciona pero el foco se queda abajo, y el siguiente Tab vuelve al pie.
   En pantalla queda fijo abajo a la derecha, a mano de quien usa el mouse,
   un pulsador o un puntero de cabeza; en el codigo es lo ultimo del pie,
   asi el tabulador y el lector de pantalla lo encuentran donde termina la
   pagina. Lleva texto visible y no solo la flecha: con control por voz se
   lo nombra diciendo lo que se lee. Los detalles de por que no tapa el foco
   estan en src/estilos/componentes.css.

   Los {" "} entre enlaces no cambian nada en pantalla (el contenedor es
   flex y ahi el espacio no se dibuja), pero mantienen el texto separado
   para quien lo lee sin estilos. */
export function PieDePagina({ idioma }) {
  const en = idioma === "en";
  return (
    <footer className="site-footer" id="pie">
      <div className="wrap">
        <p>
          tuaccesible.com — © 2026. {en ? "Digital accessibility consulting." : "Consultoría en accesibilidad digital."}{" "}
          <a className="site-footer__correo" href={`mailto:${sitio.correo}`}>
            <Icono de={Mail} />
            <span className="site-footer__direccion">{sitio.correo}</span>
          </a>
        </p>
        <p className="footer-links">
          <a href={en ? "/en/privacy/" : "/privacidad/"}>{en ? "Privacy policy" : "Política de privacidad"}</a>{" "}
          <a href={en ? "/en/accessibility-statement/" : "/declaracion-accesibilidad/"}>
            {en ? "Accessibility statement" : "Declaración de accesibilidad"}
          </a>{" "}
          <a href={en ? "/en/preferences/" : "/preferencias/"}>{en ? "Display preferences" : "Preferencias de visualización"}</a>
        </p>{" "}
        <a className="volver-arriba" href="#arriba">
          <Icono de={ArrowUp} />
          {en ? "Back to top" : "Volver arriba"}
        </a>
      </div>
    </footer>
  );
}
