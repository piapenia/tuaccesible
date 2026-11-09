import { FormularioWeb3Forms } from "../../componentes/formularios/FormularioWeb3Forms.jsx";
import { ProteccionDeDatos } from "../../componentes/formularios/ProteccionDeDatos.jsx";
import { Boton } from "../../componentes/Boton.jsx";
import { Campo } from "../../componentes/Campo.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Leave a review",
  descripcion: "Review form for tuaccesible clients.",
  rutaAlternativa: "/dejar-una-resena/",
};

export default function LeaveAReview() {
  return (
    <>
      <h1>Leave a review</h1>
      <p className="lede">If we've worked together, a few lines from you do more for the next client than anything we can say about ourselves. We read every review and check it before we publish it, and nothing goes up without your permission.</p>
      <FormularioWeb3Forms idioma="en" asunto="New review from tuaccesible.com">
        <Campo etiqueta="The name or initials you want shown (required)">
          <input type="text" id="display-name" name="display_name" required />
        </Campo>
        <Campo etiqueta="Which service did we do for you? (required)">
          <select id="service" name="service" required>
            <option value="">Choose one</option>
            <option value="Express audit">Express audit</option>
            <option value="Site audit">Site audit</option>
            <option value="Full package">Full package</option>
            <option value="Corporate workshop">Corporate workshop</option>
          </select>
        </Campo>
        <Campo etiqueta="How clear was the report, or the training?">
          <select id="clarity" name="clarity_rating">
            <option value="">Choose one</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </Campo>
        <Campo etiqueta="Would you recommend us?">
          <select id="recommend" name="would_recommend">
            <option value="">Choose one</option>
            <option value="Yes, without hesitation">Yes, without hesitation</option>
            <option value="Yes, with a few reservations">Yes, with a few reservations</option>
            <option value="No">No</option>
          </select>
        </Campo>
        <Campo etiqueta="Anything else you'd like to share? (optional)">
          <textarea id="comment" name="comment" rows={5}></textarea>
        </Campo>
        <Campo etiqueta="I give tuaccesible permission to publish this review, and the name I entered above, on tuaccesible.com (required)" casilla>
          <input type="checkbox" id="consent" name="consent_publicacion" value="Yes" required />
        </Campo>
        <ProteccionDeDatos>
          <p><strong>The short version.</strong> We use what you write here to publish your review, only with your permission and only after we've read it.</p>
          <p>The form is handled by Web3Forms, our data processor, whose servers are in the United States. You can withdraw your permission or ask us to take the review down at any time at <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. The full details are in our <a href="/en/privacy/">privacy policy</a>.</p>
        </ProteccionDeDatos>
        <Boton tipo="submit">Submit review</Boton>
      </FormularioWeb3Forms>
    </>
  );
}
