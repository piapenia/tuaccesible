import { Languages } from "lucide-react";
import { AvisoIdioma } from "./AvisoIdioma.jsx";
import { Icono } from "./Icono.jsx";
import { Logo } from "./Logo.jsx";
import { navegacion } from "../navegacion.js";

/* Cabecera: aviso de idioma, marca, menu principal y conmutador de idioma.

   El aviso de idioma va adentro, primero, para que quede dentro de la
   region de la cabecera (ver AvisoIdioma.jsx).

   El menu esta siempre a la vista, sin boton de hamburguesa: son siete
   enlaces, y un menu escondido es un paso mas para todo el mundo y un
   control con estado que mantener. En pantalla chica se acomoda en una
   grilla de casillas de 44 px de alto (src/estilos/componentes.css).

   La pagina actual se marca con aria-current="page"; el CSS la subraya y la
   pone en negrita para que el color no sea el unico indicador.

   El orden del codigo es el orden en pantalla (marca, menu, idioma) en
   todos los anchos: la cabecera se acomoda con flex-wrap y nunca con
   "order", asi el tabulador recorre lo mismo que se ve. */
export function Encabezado({ idioma, ruta, rutaAlternativa }) {
  const en = idioma === "en";
  return (
    <header className="site-header">
      <AvisoIdioma idioma={idioma} />
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
          <Icono de={Languages} />
          {en ? "Español" : "English"}
        </a>
      </div>
    </header>
  );
}
