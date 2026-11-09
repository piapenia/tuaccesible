import { FormularioWeb3Forms } from "../componentes/formularios/FormularioWeb3Forms.jsx";
import { ProteccionDeDatos } from "../componentes/formularios/ProteccionDeDatos.jsx";
import { Boton } from "../componentes/Boton.jsx";
import { Campo } from "../componentes/Campo.jsx";

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
        <Campo etiqueta="Nombre o iniciales para publicar (obligatorio)">
          <input type="text" id="display-name" name="display_name" required />
        </Campo>
        <Campo etiqueta="Servicio contratado (obligatorio)">
          <select id="service" name="service" required>
            <option value="">Elige una opción</option>
            <option value="Auditoría exprés">Auditoría exprés</option>
            <option value="Auditoría de sitio">Auditoría de sitio</option>
            <option value="Servicio integral">Servicio integral</option>
            <option value="Taller corporativo">Taller corporativo</option>
          </select>
        </Campo>
        <Campo etiqueta="¿Cómo calificarías la claridad del informe o la formación?">
          <select id="clarity" name="clarity_rating">
            <option value="">Elige una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Buena">Buena</option>
            <option value="Regular">Regular</option>
            <option value="Mala">Mala</option>
          </select>
        </Campo>
        <Campo etiqueta="¿Nos recomendarías?">
          <select id="recommend" name="would_recommend">
            <option value="">Elige una opción</option>
            <option value="Sí, sin dudarlo">Sí, sin dudarlo</option>
            <option value="Sí, con algo para mejorar">Sí, con algo para mejorar</option>
            <option value="No">No</option>
          </select>
        </Campo>
        <Campo etiqueta="¿Algo más que quieras contar? (opcional)">
          <textarea id="comment" name="comment" rows={5}></textarea>
        </Campo>
        <Campo etiqueta="Autorizo a publicar esta reseña y el nombre que escribí arriba en tuaccesible.com (obligatorio)" casilla>
          <input type="checkbox" id="consent" name="consent_publicacion" value="Sí" required />
        </Campo>
        <ProteccionDeDatos>
          <p>Protección de datos, en corto: tuaccesible usa lo que escribes aquí para publicar tu reseña, siempre con tu autorización y después de revisarla.</p>
          <p>El formulario lo procesa Web3Forms, un proveedor con servidores en Estados Unidos. Puedes retirar la autorización o pedir que borremos la reseña cuando quieras escribiendo a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. El detalle completo está en la <a href="/privacidad/">política de privacidad</a>.</p>
        </ProteccionDeDatos>
        <Boton tipo="submit">Enviar reseña</Boton>
      </FormularioWeb3Forms>
    </>
  );
}
