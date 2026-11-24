import { PreferenciasVisualizacion } from "../componentes/PreferenciasVisualizacion.jsx";

export const pagina = {
  idioma: "es",
  titulo: "Preferencias de visualización",
  descripcion: "Elige tema claro u oscuro, más contraste, texto más grande o escala de grises para tuaccesible.com. Se guarda en tu navegador, sin cookies.",
  rutaAlternativa: "/en/preferences/",
};

export default function Preferencias() {
  return (
    <>
      <h1>Preferencias de visualización</h1>
      <p className="lede">Aquí puedes cambiar el tema, el contraste y el tamaño del texto de este sitio, o verlo en escala de grises.</p>
      <noscript>
        <p>Estos controles necesitan JavaScript, y tu navegador lo tiene desactivado. Sin él, el sitio sigue los ajustes de tu sistema, que se explican más abajo.</p>
      </noscript>
      <PreferenciasVisualizacion idioma="es" />
      <div className="prose">
        <h2 id="desde-tu-sistema">Si ya lo tienes configurado en tu equipo</h2>
        <p>No hace falta que cambies nada aquí. El sitio sigue el modo oscuro y la opción de más contraste de tu sistema o de tu navegador. Con un tema de contraste de Windows activado, los colores los pone tu tema: el tema y el contraste que elijas aquí no se notan hasta que lo desactives, y el tamaño del texto sí.</p>
        <p>Lo que elijas en esta página vale solo para este sitio y solo en este navegador. En otro equipo o en otro navegador, el sitio vuelve a seguir lo que diga el sistema.</p>
        <h2 id="zoom">Para agrandar todo, no solo el texto</h2>
        <p>El zoom del navegador agranda a la vez el texto, los botones, los márgenes y las imágenes, y la mayoría de los navegadores lo recuerda para cada sitio. Ctrl y la tecla más lo agranda (en Mac, Cmd y la tecla más), Ctrl y la tecla menos lo achica, y Ctrl y 0 lo devuelve a su tamaño. El contenido se reacomoda al ancho de la ventana, así que no hace falta desplazarse hacia los costados para leer.</p>
        <p>La opción de tamaño del texto de esta página agranda solo las letras y deja el resto como está, para quien lo prefiere así.</p>
        <h2 id="escala-de-grises">Escala de grises en toda la pantalla</h2>
        <p>La opción de esta página quita el color solo de este sitio. Si te resulta más cómodo así en todas partes, Windows y macOS tienen filtros de color que lo aplican a toda la pantalla: en Windows están en Configuración, Accesibilidad, Filtros de color; en macOS, en Ajustes del Sistema, Accesibilidad, Pantalla.</p>
        <h2 id="daltonismo">Por qué no hay un filtro para daltonismo</h2>
        <p>Porque en este sitio el color nunca es lo único que lleva información. Los enlaces del texto van subrayados, la página actual del menú va además en negrita, los errores y los estados se dicen con palabras, y el texto tiene un contraste de 7 a 1 como mínimo. Un filtro que cambie los colores no agregaría información y podría bajar ese contraste.</p>
        <p>Si encuentras algo que solo se distingue por el color, escríbenos a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a> y lo corregimos.</p>
        <h2 id="que-se-guarda">Qué se guarda</h2>
        <p>Lo que elijas se guarda en el almacenamiento local de tu navegador, no en una cookie, y no sale de tu equipo. Se borra con el botón que vuelve a los ajustes del sistema o desde las opciones de tu navegador. Los detalles están en la <a href="/privacidad/#en-tu-navegador">política de privacidad</a>.</p>
      </div>
    </>
  );
}
