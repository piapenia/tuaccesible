/* Informacion basica de proteccion de datos de un formulario: para que se
   usan los datos, quien mas los procesa y a donde escribir para ejercer los
   derechos sobre ellos, con un enlace a la politica de privacidad, que
   tiene el detalle completo. Va dentro del formulario, antes del boton de
   envio, porque esa informacion tiene que estar a la vista en el momento
   en que la persona entrega sus datos, no solo en otra pagina.

   El texto es propio de cada formulario y se escribe en la pagina:

     <ProteccionDeDatos>
       <p>...</p>
       <p>...</p>
     </ProteccionDeDatos>

   El recuadro lo dibuja la clase form-legal de src/estilos/global.css. */
export function ProteccionDeDatos({ children }) {
  return <div className="form-legal">{children}</div>;
}
