export const pagina = {
  idioma: "es",
  titulo: "Mensaje enviado",
  descripcion: "Confirmación de que tu mensaje llegó a tuaccesible.",
  rutaAlternativa: "/en/thank-you/",
  noindex: true,
};

export default function Gracias() {
  return (
    <>
      <h1>Mensaje enviado</h1>
      <p className="lede">Tu mensaje ya está en nuestro buzón. Respondemos en un plazo de dos días hábiles.</p>
      <div className="prose">
        <p>Si es urgente o prefieres escribir por tu cuenta, el correo directo es <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
        <p>Mientras tanto puedes ver el <a href="/servicios/">detalle de servicios</a> o la <a href="/normativa/">normativa que se aplica a tu caso</a>.</p>
      </div>
    </>
  );
}
