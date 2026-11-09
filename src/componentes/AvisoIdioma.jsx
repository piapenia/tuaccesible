/* Aviso de idioma de la primera visita.

   Aca solo se dibuja el marcado, oculto por CSS. Lo muestra y lo rellena
   public/js/lang.js, que sigue siendo un script chico sin React: corre en
   todas las paginas, y convertirlo en isla obligaria a descargar React
   entero en cada visita solo para sugerir un idioma. Sin JavaScript el
   aviso no aparece y el sitio sigue completo, con el conmutador de idioma
   siempre visible en la cabecera.

   El {" "} entre los botones no es un descuido: estan dentro de un <span>
   en linea y ese espacio es el que los separa en pantalla, igual que en el
   sitio anterior. */
export function AvisoIdioma({ idioma }) {
  const en = idioma === "en";
  return (
    <div className="lang-banner" id="lang-banner">
      <div className="wrap">
        <span id="lang-banner-text"></span>
        <span>
          <button type="button" id="lang-banner-switch">{en ? "Switch language" : "Cambiar de idioma"}</button>{" "}
          <button type="button" id="lang-banner-dismiss">{en ? "Stay in English" : "Quedarme en español"}</button>
        </span>
      </div>
    </div>
  );
}
