import { Boton } from "./Boton.jsx";

/* Aviso de idioma de la primera visita.

   Aca solo se dibuja el marcado, oculto por CSS. Lo muestra y lo rellena
   public/js/lang.js, que sigue siendo un script chico sin React: corre en
   todas las paginas, y convertirlo en isla obligaria a descargar React
   entero en cada visita solo para sugerir un idioma. El script busca cada
   parte por su id, asi que los id no se cambian. Sin JavaScript el aviso no
   aparece y el sitio sigue completo, con el conmutador de idioma siempre
   visible en la cabecera.

   Se dibuja dentro de la cabecera (Encabezado.jsx), como su primera parte,
   y no suelto antes de ella: todo el contenido de la pagina tiene que estar
   dentro de alguna region (cabecera, contenido principal o pie) para que
   quien navega por regiones no se lo saltee. axe lo marcaba con la regla
   "region" en las paginas en ingles, donde el aviso tiene texto.

   El {" "} entre los botones separa los dos si la hoja de estilos no carga. */
export function AvisoIdioma({ idioma }) {
  const en = idioma === "en";
  return (
    <div className="lang-banner" id="lang-banner">
      <div className="wrap">
        <span id="lang-banner-text"></span>
        <span className="lang-banner__botones">
          <Boton variante="secundario" chico id="lang-banner-switch">
            {en ? "Switch language" : "Cambiar de idioma"}
          </Boton>{" "}
          <Boton variante="secundario" chico id="lang-banner-dismiss">
            {en ? "Stay in English" : "Quedarme en español"}
          </Boton>
        </span>
      </div>
    </div>
  );
}
