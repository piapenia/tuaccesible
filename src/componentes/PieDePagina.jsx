import { Mail } from "lucide-react";
import { Icono } from "./Icono.jsx";
import { sitio } from "../sitio.js";

/* Pie: quien es, el correo y los dos enlaces legales.

   Los {" "} entre enlaces no cambian nada en pantalla (el contenedor es
   flex y ahi el espacio no se dibuja), pero mantienen el texto separado
   para quien lo lee sin estilos. */
export function PieDePagina({ idioma }) {
  const en = idioma === "en";
  return (
    <footer className="site-footer">
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
          </a>
        </p>
      </div>
    </footer>
  );
}
