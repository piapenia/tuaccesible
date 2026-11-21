export const pagina = {
  idioma: "en",
  titulo: "Thank you for contacting us",
  descripcion: "Confirmation that your message reached tuaccesible.",
  rutaAlternativa: "/gracias/",
  noindex: true,
};

export default function ThankYou() {
  return (
    <>
      <h1>Thank you for contacting us</h1>
      <p className="lede">We have received your message and will get back to you as soon as possible.</p>
      <div className="prose">
        <p>If your inquiry is urgent, you can also email us directly at <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
        <p>In the meantime, see <a href="/en/services/">what each accessibility audit includes</a>, or find out <a href="/en/legal-requirements/">which accessibility law applies to you</a>.</p>
      </div>
    </>
  );
}
