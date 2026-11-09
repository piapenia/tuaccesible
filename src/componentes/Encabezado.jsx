import { Logo } from "./Logo.jsx";
import { navegacion } from "../navegacion.js";

/* Cabecera: marca, menu principal y conmutador de idioma.
   La pagina actual se marca con aria-current="page"; el CSS la subraya y la
   pone en negrita para que el color no sea el unico indicador. */
export function Encabezado({ idioma, ruta, rutaAlternativa }) {
  const en = idioma === "en";
  return (
    <header className="site-header">
      <div className="wrap">
        <a className="wordmark" href={en ? "/en/" : "/"}>
          <Logo />
          <span>
            tu<span className="mark">accesible</span>
          </span>
        </a>
        <nav className="main-nav" aria-label={en ? "Main" : "Principal"}>
          <ul>
            {navegacion[idioma].map((item) => (
              <li key={item.url}>
                <a href={item.url} aria-current={item.url === ruta ? "page" : undefined}>
                  {item.etiqueta}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="lang-switch" id="lang-switch-link" href={rutaAlternativa} lang={en ? "es" : "en"}>
          {en ? "Español" : "English"}
        </a>
      </div>
    </header>
  );
}
