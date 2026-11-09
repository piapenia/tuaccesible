export const pagina = {
  idioma: "es",
  titulo: "Contacto",
  descripcion: "Escríbenos por correo o completa el formulario.",
  rutaAlternativa: "/en/contact/",
};

export default function Contacto() {
  return (
    <>
      <h1>Contacto</h1>
      <p className="lede">Como prefieras: un correo directo o el formulario de aquí abajo.</p>
      <p>Escríbenos a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
      <form action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value="9338efc0-195f-47b9-872f-4aca4a58b051" />
        <input type="hidden" name="subject" value="Nueva consulta desde tuaccesible.com" />
        <input type="hidden" name="from_name" value="Formulario de tuaccesible.com" />
        <input type="hidden" name="redirect" value="https://tuaccesible.com/gracias/" />
        <p className="hp">
          <label htmlFor="botcheck">No completar este campo</label>{" "}
          <input type="checkbox" id="botcheck" name="botcheck" tabIndex={-1} autoComplete="off" />
        </p>
        <p>
          <label htmlFor="name">Nombre (obligatorio)</label>
          <br />
          <input type="text" id="name" name="name" autoComplete="name" required />
        </p>
        <p>
          <label htmlFor="email">Correo (obligatorio)</label>
          <br />
          <input type="email" id="email" name="email" autoComplete="email" required />
        </p>
        <p>
          <label htmlFor="service">Servicio de interés</label>
          <br />
          <select id="service" name="service">
            <option value="Todavía no lo sé">Todavía no lo sé, ayúdame a elegir</option>
            <option value="Auditoría exprés">Auditoría exprés</option>
            <option value="Auditoría de sitio">Auditoría de sitio</option>
            <option value="Servicio integral">Servicio integral</option>
            <option value="Taller corporativo">Taller corporativo</option>
            <option value="Otra consulta">Otra consulta</option>
          </select>
        </p>
        <p>
          <label htmlFor="message">Mensaje (obligatorio)</label>
          <br />
          <textarea id="message" name="message" rows={6} required></textarea>
        </p>
        <div className="form-legal">
          <p>Protección de datos, en corto: tuaccesible usa tu nombre, tu correo y tu mensaje solo para responderte, y los conserva mientras dure la conversación.</p>
          <p>El formulario lo procesa Web3Forms, un proveedor con servidores en Estados Unidos, y el mensaje llega a nuestro buzón. Puedes pedir acceso, rectificación o supresión escribiendo a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. El detalle completo está en la <a href="/privacidad/">política de privacidad</a>.</p>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}
