export const pagina = {
  idioma: "en",
  titulo: "Thank you for your review",
  descripcion: "Confirmation that your review reached tuaccesible.",
  rutaAlternativa: "/gracias-por-tu-resena/",
  noindex: true,
};

export default function ThanksForYourReview() {
  return (
    <>
      <h1>Thank you for your review</h1>
      <p className="lede">We have received it and will check it before publishing it in <a href="/en/success-stories/">Success stories</a>.</p>
      <div className="prose">
        <p>If you'd like to change anything or withdraw your permission, email us at <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
      </div>
    </>
  );
}
