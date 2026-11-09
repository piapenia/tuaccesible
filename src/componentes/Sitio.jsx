import { AvisoIdioma } from "./AvisoIdioma.jsx";
import { Encabezado } from "./Encabezado.jsx";
import { PieDePagina } from "./PieDePagina.jsx";

/* Todo lo visible que comparten las paginas: enlace para saltar al
   contenido, aviso de idioma, cabecera, contenido y pie.
   El enlace de salto va primero para que sea lo primero que alcanza el
   tabulador. El <head> no esta aca: lo arma src/documento.js. */
export function Sitio({ pagina, children }) {
  const en = pagina.idioma === "en";
  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        {en ? "Skip to main content" : "Saltar al contenido principal"}
      </a>
      <AvisoIdioma idioma={pagina.idioma} />
      <Encabezado idioma={pagina.idioma} ruta={pagina.ruta} rutaAlternativa={pagina.rutaAlternativa} />
      <main id="contenido-principal">
        <div className="wrap">{children}</div>
      </main>
      <PieDePagina idioma={pagina.idioma} />
    </>
  );
}
