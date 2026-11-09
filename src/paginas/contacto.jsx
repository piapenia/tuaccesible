import { FormularioWeb3Forms } from "../componentes/formularios/FormularioWeb3Forms.jsx";
import { ProteccionDeDatos } from "../componentes/formularios/ProteccionDeDatos.jsx";

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
      <FormularioWeb3Forms idioma="es" asunto="Nueva consulta desde tuaccesible.com">
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
        <ProteccionDeDatos>
          <p>Protección de datos, en corto: tuaccesible usa tu nombre, tu correo y tu mensaje solo para responderte, y los conserva mientras dure la conversación.</p>
          <p>El formulario lo procesa Web3Forms, un proveedor con servidores en Estados Unidos, y el mensaje llega a nuestro buzón. Puedes pedir acceso, rectificación o supresión escribiendo a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. El detalle completo está en la <a href="/privacidad/">política de privacidad</a>.</p>
        </ProteccionDeDatos>
        <button type="submit">Enviar</button>
      </FormularioWeb3Forms>
    </>
  );
}
