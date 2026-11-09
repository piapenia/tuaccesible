/* Banda de cierre: el recuadro petroleo del final de una pagina, con la
   invitacion a escribir.

     <Banda>
       <p><a href="/contacto/">Escribir a tuaccesible</a> o ver el ...</p>
     </Banda>

   Es un <div> comun, sin rol ni nombre: lo que dice esta en el texto de
   adentro, y el lector de pantalla lo lee como cualquier otro parrafo. Una
   por pagina, como mucho, y al final.

   El fondo es petroleo en los dos modos (--banda) y el texto, blanco en
   claro y gris muy claro en oscuro (--sobre-banda): 13.54:1 y 11.66:1. Los
   enlaces siguen subrayados, como en el resto del sitio. Adentro, el
   contorno de foco toma el color del texto (src/estilos/componentes.css),
   porque el oscuro de siempre no se veria sobre este fondo. */
export function Banda({ children }) {
  return <div className="banda">{children}</div>;
}
