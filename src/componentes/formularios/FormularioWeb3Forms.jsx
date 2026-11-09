import { sitio } from "../../sitio.js";

/* Formulario que se envia a Web3Forms, el servicio que recibe lo que la
   persona escribe y lo reenvia por correo al buzon de tuaccesible. Lo usan
   las paginas de contacto y de resenas, en los dos idiomas.

   Este componente pone lo que es igual en todos esos formularios: la
   etiqueta <form> con su destino, los campos ocultos que lee Web3Forms y la
   trampa antispam. Lo propio de cada formulario se escribe dentro, en la
   pagina, y se dibuja a continuacion en el mismo orden: los campos
   visibles, el aviso de proteccion de datos y el boton de envio.

     <FormularioWeb3Forms idioma="en" asunto="New inquiry from tuaccesible.com">
       <p>...un campo...</p>
       <ProteccionDeDatos>...</ProteccionDeDatos>
       <button type="submit">Send message</button>
     </FormularioWeb3Forms>

   - asunto: el asunto del correo que llega al buzon.
   - idioma: "es" o "en". Decide el nombre de remitente con que llega ese
     correo, la pagina de confirmacion a la que vuelve la persona despues
     de enviar y el texto de la trampa antispam.

   La trampa antispam es el parrafo .hp con la casilla botcheck. Las
   personas no la ven: la clase hp la oculta con display:none
   (public/css/global.css), que la saca tambien del arbol de accesibilidad,
   asi que NVDA no la anuncia. Un robot que rellena todo lo que encuentra la
   marca, y Web3Forms descarta los envios que llegan con esa casilla
   marcada. Si la hoja de estilos no carga, la casilla queda a la vista: la
   etiqueta pide no marcarla, tabIndex={-1} la saca del recorrido con el
   tabulador y autoComplete="off" evita que el navegador la rellene o la
   recuerde por su cuenta. El {" "} entre la etiqueta y la casilla es el
   espacio que las separa en ese caso. */

/* Direccion a la que se envia el formulario. Si algun dia cambia, hay que
   cambiar tambien form-action en src/seguridad.js: la politica de seguridad
   solo deja enviar formularios a https://api.web3forms.com, y el navegador
   bloquearia el envio a cualquier otro lado. */
const destino = "https://api.web3forms.com/submit";

/* Clave de acceso de Web3Forms. Va a la vista en el HTML a proposito: esta
   pensada para eso, es publica por diseno y no es un secreto filtrado (lo
   explica SEGURIDAD.md). Lo que si permite es que cualquiera la use para
   mandar mensajes a nuestro buzon. Hoy eso lo frena la trampa antispam; si
   algun dia llega spam de verdad, la respuesta es la restriccion por
   dominio del plan pago de Web3Forms, no un captcha: un captcha visual
   seria una barrera de accesibilidad justo en el formulario de contacto de
   una consultora de accesibilidad. */
const claveDeAcceso = "9338efc0-195f-47b9-872f-4aca4a58b051";

export function FormularioWeb3Forms({ idioma, asunto, children }) {
  if (idioma !== "es" && idioma !== "en") {
    throw new Error(`FormularioWeb3Forms: idioma tiene que ser "es" o "en", no "${idioma}"`);
  }
  if (!asunto) {
    throw new Error("FormularioWeb3Forms: falta asunto, el asunto del correo que llega al buzon");
  }
  const en = idioma === "en";
  // El nombre de remitente con que aparece el correo en el buzon.
  const remitente = en ? "tuaccesible.com form" : "Formulario de tuaccesible.com";
  // Va con el dominio completo porque quien lleva a la persona a esta pagina
  // es Web3Forms, desde su propio servidor, despues de recibir el envio.
  const paginaDeConfirmacion = `${sitio.url}${en ? "/en/thank-you/" : "/gracias/"}`;
  return (
    <form action={destino} method="POST">
      <input type="hidden" name="access_key" value={claveDeAcceso} />
      <input type="hidden" name="subject" value={asunto} />
      <input type="hidden" name="from_name" value={remitente} />
      <input type="hidden" name="redirect" value={paginaDeConfirmacion} />
      <p className="hp">
        <label htmlFor="botcheck">{en ? "Leave this field empty" : "No completar este campo"}</label>{" "}
        <input type="checkbox" id="botcheck" name="botcheck" tabIndex={-1} autoComplete="off" />
      </p>
      {children}
    </form>
  );
}
