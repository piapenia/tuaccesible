import { FormularioWeb3Forms } from "../../componentes/formularios/FormularioWeb3Forms.jsx";
import { ProteccionDeDatos } from "../../componentes/formularios/ProteccionDeDatos.jsx";
import { Boton } from "../../componentes/Boton.jsx";
import { Campo } from "../../componentes/Campo.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Contact us",
  descripcion: "Email us or fill in the form.",
  rutaAlternativa: "/contactanos/",
};

export default function ContactUs() {
  return (
    <>
      <div className="contacto">
        <div className="contacto__intro">
          <h1>Contact us</h1>
          <p>Write to us at <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
        </div>
        <FormularioWeb3Forms idioma="en" asunto="New inquiry from tuaccesible.com" confirmacion="/en/thank-you/">
          <Campo etiqueta="Name (required)">
            <input type="text" id="name" name="name" autoComplete="name" required />
          </Campo>
          <Campo etiqueta="Email (required)">
            <input type="email" id="email" name="email" autoComplete="email" required />
          </Campo>
          <Campo etiqueta="Service you're interested in">
            <select id="service" name="service">
              <option value="Not sure">Not sure, help me choose</option>
              <option value="Express audit">Express audit</option>
              <option value="Site audit">Site audit</option>
              <option value="Full package">Full package</option>
              <option value="Corporate workshop">Corporate workshop</option>
              <option value="Other inquiry">Other inquiry</option>
            </select>
          </Campo>
          <Campo etiqueta="Message (required)">
            <textarea id="message" name="message" rows={6} required></textarea>
          </Campo>
          <ProteccionDeDatos>
            <h2>Data protection</h2>
            <p>tuaccesible uses your name, email and message only to reply to you, and keeps them only for as long as the conversation lasts.</p>
            <p>The form is processed by Web3Forms, a provider with servers in the United States, and the message arrives in our inbox. You can request access, rectification or erasure by writing to <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. Full details are in the <a href="/en/privacy/">privacy policy</a>.</p>
          </ProteccionDeDatos>
          <Boton tipo="submit">Send</Boton>
        </FormularioWeb3Forms>
      </div>
    </>
  );
}
