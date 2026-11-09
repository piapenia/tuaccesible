export const pagina = {
  idioma: "en",
  titulo: "Thank you",
  descripcion: "Confirmation that your message reached tuaccesible.",
  rutaAlternativa: "/gracias/",
  noindex: true,
};

export default function ThankYou() {
  return (
    <>
      <h1>Got it, thank you</h1>
      <p className="lede">Your message is in our inbox. You'll hear back within two business days.</p>
      <div className="prose">
        <p>If it's urgent, or you'd rather email us directly, we're at <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. We're on UTC-3, one to two hours ahead of US Eastern.</p>
        <p>Everything we deliver in English is written in English: the report, the criteria table, the accessibility statement and the ACR. Nothing is machine-translated.</p>
        <p>While you wait, see <a href="/en/services/">what each accessibility audit includes</a>, or find out <a href="/en/regulations/">which accessibility law applies to you</a>.</p>
      </div>
    </>
  );
}
