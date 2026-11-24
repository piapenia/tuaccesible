import { Languages } from "lucide-react";
import { AvisoIdioma } from "./AvisoIdioma.jsx";
import { Icono } from "./Icono.jsx";
import { Logo } from "./Logo.jsx";
import { navegacion } from "../navegacion.js";

/* Cabecera: franja de atajos, aviso de idioma, marca y menu principal.

   La franja de atajos va primero y esta siempre a la vista, no escondida
   hasta recibir el foco como el enlace de salto clasico. Lleva al contenido
   y al pie (donde estan el correo, los enlaces legales y "Volver arriba"),
   y a la derecha el conmutador de idioma. Siempre visible porque no solo
   la usa quien navega con el tabulador: con control por voz, con un
   pulsador o con un puntero de cabeza, un enlace que no se ve no se puede
   nombrar ni senalar. Con el enlace de salto oculto, ademas, la letra
   agrandada lo hacia asomar sobre el logotipo. Los dos atajos apuntan a
   regiones que ya existen (#contenido-principal y #pie).

   El aviso de idioma va adentro, despues de la franja, para que quede
   dentro de la region de la cabecera (ver AvisoIdioma.jsx).

   El menu esta siempre a la vista, sin boton de hamburguesa: son siete
   enlaces, y un menu escondido es un paso mas para todo el mundo y un
   control con estado que mantener. En pantalla chica se acomoda en una
   grilla de casillas de 44 px de alto (src/estilos/componentes.css).

   La pagina actual se marca con aria-current="page"; el CSS la subraya y la
   pone en negrita para que el color no sea el unico indicador.

   El orden del codigo es el orden en pantalla en todos los anchos: la
   cabecera se acomoda con flex-wrap y nunca con "order", asi el tabulador
   recorre lo mismo que se ve. */
export function Encabezado({ idioma, ruta, rutaAlternativa }) {
  const en = idioma === "en";
  return (
    <header className="site-header">
      <div className="atajos">
        <div className="wrap atajos__fila">
          <a href="#contenido-principal">{en ? "Skip to main content" : "Ir al contenido principal"}</a>{" "}
          <a href="#pie">{en ? "Skip to footer" : "Ir al pie de página"}</a>{" "}
          <div className="atajos__ajustes">
            <a className="lang-switch" id="lang-switch-link" href={rutaAlternativa} lang={en ? "es" : "en"}>
              <Icono de={Languages} />
              {en ? "Español" : "English"}
            </a>
          </div>
        </div>
      </div>
      <AvisoIdioma idioma={idioma} />
      <div className="wrap site-header__fila">
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
      </div>
    </header>
  );
}
