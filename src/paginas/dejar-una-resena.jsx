import { FormularioWeb3Forms } from "../componentes/formularios/FormularioWeb3Forms.jsx";
import { ProteccionDeDatos } from "../componentes/formularios/ProteccionDeDatos.jsx";

export const pagina = {
  idioma: "es",
  titulo: "Dejar una reseña",
  descripcion: "Formulario de reseña para clientes de tuaccesible.",
  rutaAlternativa: "/en/leave-a-review/",
};

export default function DejarUnaResena() {
  return (
    <>
      <h1>Dejar una reseña</h1>
      <p className="lede">Para clientes que ya trabajaron con tuaccesible. Las respuestas se revisan antes de publicarse — nada se publica de forma automática.</p>
      <FormularioWeb3Forms idioma="es" asunto="Nueva reseña desde tuaccesible.com">
        <p>
          <label htmlFor="display-name">Nombre o iniciales para publicar (obligatorio)</label>
          <br />
          <input type="text" id="display-name" name="display_name" required />
        </p>
        <p>
          <label htmlFor="service">Servicio contratado (obligatorio)</label>
          <br />
          <select id="service" name="service" required>
            <option value="">Elige una opción</option>
            <option value="Auditoría exprés">Auditoría exprés</option>
            <option value="Auditoría de sitio">Auditoría de sitio</option>
            <option value="Servicio integral">Servicio integral</option>
            <option value="Taller corporativo">Taller corporativo</option>
          </select>
        </p>
        <p>
          <label htmlFor="clarity">¿Cómo calificarías la claridad del informe o la formación?</label>
          <br />
          <select id="clarity" name="clarity_rating">
            <option value="">Elige una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Buena">Buena</option>
            <option value="Regular">Regular</option>
            <option value="Mala">Mala</option>
          </select>
        </p>
        <p>
          <label htmlFor="recommend">¿Nos recomendarías?</label>
          <br />
          <select id="recommend" name="would_recommend">
            <option value="">Elige una opción</option>
            <option value="Sí, sin dudarlo">Sí, sin dudarlo</option>
            <option value="Sí, con algo para mejorar">Sí, con algo para mejorar</option>
            <option value="No">No</option>
          </select>
        </p>
        <p>
          <label htmlFor="comment">¿Algo más que quieras contar? (opcional)</label>
          <br />
          <textarea id="comment" name="comment" rows={5}></textarea>
        </p>
        {/* El {" "} es el espacio entre la casilla y su texto: JSX no lo pone solo entre dos elementos en renglones distintos. */}
        <p>
          <input type="checkbox" id="consent" name="consent_publicacion" value="Sí" required />{" "}
          <label htmlFor="consent">Autorizo a publicar esta reseña y el nombre que escribí arriba en tuaccesible.com (obligatorio)</label>
        </p>
        <ProteccionDeDatos>
          <p>Protección de datos, en corto: tuaccesible usa lo que escribes aquí para publicar tu reseña, siempre con tu autorización y después de revisarla.</p>
          <p>El formulario lo procesa Web3Forms, un proveedor con servidores en Estados Unidos. Puedes retirar la autorización o pedir que borremos la reseña cuando quieras escribiendo a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. El detalle completo está en la <a href="/privacidad/">política de privacidad</a>.</p>
        </ProteccionDeDatos>
        <button type="submit">Enviar reseña</button>
      </FormularioWeb3Forms>
    </>
  );
}
