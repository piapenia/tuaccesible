import { sitio } from "../sitio.js";

/* Los {" "} entre enlaces no cambian nada en pantalla (el contenedor es
   flex y ahi el espacio no se dibuja), pero mantienen el texto separado
   para quien lo lee sin estilos, igual que en el sitio anterior. */
export function PieDePagina({ idioma }) {
  const en = idioma === "en";
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>
          tuaccesible.com — © 2026. {en ? "Digital accessibility consulting." : "Consultoría en accesibilidad digital."}{" "}
          <a href={`mailto:${sitio.correo}`}>{sitio.correo}</a>
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
