import { FormularioWeb3Forms } from "../../componentes/formularios/FormularioWeb3Forms.jsx";
import { ProteccionDeDatos } from "../../componentes/formularios/ProteccionDeDatos.jsx";
import { Boton } from "../../componentes/Boton.jsx";
import { Campo } from "../../componentes/Campo.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Get an accessibility audit quote",
  descripcion: "Tell us what needs auditing and by when. Scope, price and timeline in writing within a week, at no cost and with nothing to sign.",
  rutaAlternativa: "/contacto/",
};

export default function Contact() {
  return (
    <>
      <div className="contacto">
        <div className="contacto__intro">
          <h1>Tell us what needs auditing</h1>
          <p className="lede">A free consultation, no strings attached. Tell us what needs auditing and by when, and you'll have scope, price and timeline in writing within a week.</p>
          <p>Prefer email? Write to us directly at <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. Either way, you'll hear back within two business days. We're on UTC-3, one to two hours ahead of US Eastern.</p>
        </div>
        <FormularioWeb3Forms idioma="en" asunto="New inquiry from tuaccesible.com">
          <Campo etiqueta="Name (required)">
            <input type="text" id="name" name="name" autoComplete="name" required />
          </Campo>
          <Campo etiqueta="Email (required)">
            <input type="email" id="email" name="email" autoComplete="email" required />
          </Campo>
          <Campo
            etiqueta="What are you interested in?"
            ayuda="Workshops are run in Spanish. Not sure which service fits? Leave the default and we'll tell you."
          >
            <select id="service" name="service">
              <option value="Not sure yet">Not sure yet, help me pick</option>
              <option value="Express audit">Express audit</option>
              <option value="Site audit">Site audit</option>
              <option value="Full package">Full package</option>
              <option value="Corporate workshop">Corporate workshop</option>
              <option value="Something else">Something else</option>
            </select>
          </Campo>
          <Campo
            etiqueta="Tell us about your project (required)"
            ayuda="The address of the site or app, roughly how many distinct page templates it has, which user journeys matter most, and whether there's a logged-in area. If you don't know yet, say so and we'll ask."
          >
            <textarea id="message" name="message" rows={6} required></textarea>
          </Campo>
          <ProteccionDeDatos>
            <p><strong>The short version.</strong> We use your name, email and message only to reply to you and put your quote together, and we keep them for as long as the conversation runs.</p>
            <p>The form is handled by Web3Forms, our data processor, whose servers are in the United States; your message lands in our inbox and nowhere else. You can ask us to show you, correct or delete your data at any time at <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. The full details are in our <a href="/en/privacy/">privacy policy</a>.</p>
          </ProteccionDeDatos>
          <p>Free consultation. We reply within two business days. Nothing is charged and nothing is signed at this stage.</p>
          <Boton tipo="submit">Send message</Boton>
        </FormularioWeb3Forms>
      </div>
    </>
  );
}
