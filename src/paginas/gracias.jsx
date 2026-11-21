export const pagina = {
  idioma: "es",
  titulo: "Gracias por contactarnos",
  descripcion: "Confirmación de que tu mensaje llegó a tuaccesible.",
  rutaAlternativa: "/en/thank-you/",
  noindex: true,
};

export default function Gracias() {
  return (
    <>
      <h1>Gracias por contactarnos</h1>
      <p className="lede">Recibimos tu mensaje y te responderemos a la mayor brevedad.</p>
      <div className="prose">
        <p>Si tu consulta es urgente, también puedes escribirnos directamente a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
        <p>Mientras tanto, puedes conocer el <a href="/servicios/">detalle de nuestros servicios</a> o la <a href="/normativa-legal/">normativa que se aplica a tu caso</a>.</p>
      </div>
    </>
  );
}
