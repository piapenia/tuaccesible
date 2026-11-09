import { api } from "../api/index.js";
import { Aviso } from "../componentes/Aviso.jsx";
import { Isla } from "../componentes/Isla.jsx";
import { Seccion } from "../componentes/Seccion.jsx";

/* El servicio de testing: la unica pagina con JavaScript propio.

   Esta en preparacion: no aparece en el menu ni en el sitemap (noindex) y
   el aviso de arriba lo dice siempre. Sin VITE_API_URL, como en el sitio
   publicado de hoy, la pagina no dibuja la isla, no carga ningun script y
   manda a contacto. Con VITE_API_URL dibuja la isla, que habla con el
   backend (ver docs/contrato-api.md). */
export const pagina = {
  idioma: "es",
  titulo: "Análisis automático de accesibilidad",
  descripcion: "Una prueba automática de una página de tu sitio, una entrevista breve y un informe en PDF. Servicio en preparación.",
  rutaAlternativa: "/en/analyze/",
  noindex: true,
};

export default function Analizar() {
  return (
    <>
      <h1>Analiza una página de tu sitio</h1>
      <p className="lede">
        Una prueba automática de accesibilidad, una entrevista breve sobre tu sitio y un informe en PDF con lo que encontramos. Sin crear una cuenta.
      </p>
      {api.configurado ? (
        <>
          <Aviso>
            <strong>Este servicio está en preparación.</strong> Puedes probarlo, pero los resultados todavía no son definitivos.
          </Aviso>
          <Isla nombre="Analizador" props={{ idioma: "es" }} />
        </>
      ) : (
        <Aviso>
          <strong>Este servicio está en preparación.</strong> Todavía no se puede usar desde esta página. Mientras tanto, puedes pedir una
          revisión de tu sitio desde la <a href="/contacto/">página de contacto</a>.
        </Aviso>
      )}

      <Seccion numero="01" titulo="Qué guardamos y por cuánto tiempo">
        <div className="prose">
          <ul>
            <li>La dirección de la página que analizas, sin parámetros ni fragmento, y la fecha del análisis.</li>
            <li>Si nos das tu opinión o pides una reunión, también el puntaje, el comentario y el pedido.</li>
            <li>Los resultados de la prueba y la conversación de la entrevista quedan en memoria durante una hora, para armar el informe, y después se borran.</li>
            <li>No te pedimos nombre ni correo.</li>
          </ul>
        </div>
      </Seccion>

      <Seccion numero="02" titulo="Qué alcanza esta prueba y qué no">
        <div className="prose">
          <ul>
            <li>La prueba usa axe, una herramienta de código abierto, y revisa una sola página por vez.</li>
            <li>
              Una prueba automática detecta solo una parte de los problemas. Los que dependen del teclado, del lector de pantalla o del sentido del
              contenido se encuentran revisando la página a mano.
            </li>
            <li>Las preguntas de la entrevista y las explicaciones del informe las escribe un modelo de lenguaje, que puede equivocarse.</li>
            <li>
              El informe no reemplaza una auditoría. Si necesitas una, mira nuestros <a href="/servicios/">servicios</a>.
            </li>
          </ul>
        </div>
      </Seccion>
    </>
  );
}
