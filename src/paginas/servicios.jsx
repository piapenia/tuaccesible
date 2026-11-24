import { Desplegable } from "../componentes/Desplegable.jsx";
import { Seccion } from "../componentes/Seccion.jsx";
import { Banda } from "../componentes/Banda.jsx";
import { Boton } from "../componentes/Boton.jsx";
import { Indice } from "../componentes/Indice.jsx";

export const pagina = {
  idioma: "es",
  titulo: "Auditoría de accesibilidad web y formación",
  descripcion: "Auditoría de accesibilidad web contra WCAG 2.2, EN 301 549 y la Ley Europea de Accesibilidad (EAA). Revisamos el sitio página por página, no una muestra. Auditoría exprés, auditoría de sitio, servicio integral y formación para equipos.",
  rutaAlternativa: "/en/services/",
};

export default function Servicios() {
  return (
    <>
      <h1>Auditoría de accesibilidad web y formación</h1>
      <p className="lede">Cuatro formas de trabajar con tuaccesible, según el estado actual de tu producto y el plazo con el que cuentes.</p>
      <Indice
        idioma="es"
        entradas={[
          ["auditoria-expres", "Auditoría exprés"],
          ["auditoria-de-sitio", "Auditoría de sitio"],
          ["servicio-integral", "Servicio integral"],
          ["taller-corporativo", "Taller corporativo"],
          ["extras", "Extras"],
          ["como-auditamos", "Cómo auditamos la accesibilidad web"],
          ["condiciones-de-trabajo", "Condiciones de trabajo"],
        ]}
      />
      <p>Las pruebas manuales están a cargo de un equipo de usuarios nativos de lector de pantalla. Realizamos una revisión técnica a fondo, enfocándonos en lo que experimentaría y tomaría en cuenta un usuario nativo y habitual de esta tecnología.</p>
      <p><strong>Presupuestar no cuesta nada.</strong> Con la dirección del sitio web, número y variedad de plantillas, recorridos a revisar y especificaciones sobre áreas privadas, te informamos alcance, precio y plazo cerrados en una semana, por escrito y antes de empezar.</p>
      <p>No manejamos tarifario público, entendiendo que no existen dos sitios iguales.</p>
      <p>Esta primera instancia te informa precio y plazo. No incluye la lista de correcciones. Para ello ofrecemos la auditoría exprés, que en adición afina el presupuesto del trabajo general, conociendo para entonces los detalles y pormenores pertinentes.</p>
      <Seccion numero="01" titulo="Auditoría exprés" id="auditoria-expres">
        <div className="prose">
          <p>Diagnóstico rápido de accesibilidad web, que permite conocer la situación general antes de comprometer un proyecto al completo. Revisamos como mínimo la página de inicio, y sumamos los enlaces clave según el sitio. Es una observación de primer nivel.</p>
          <p>Es un informe general sobre el estado actual del sitio, no sustituyendo al informe página por página. Entrega en 2 a 3 días hábiles.</p>
          <p>Este servicio se abona íntegro al contratar.</p>
          <Desplegable resumen="Qué incluye la auditoría exprés">
            <ul>
              <li>Revisión manual de la página de inicio y de una selección de enlaces clave.</li>
              <li>Observaciones directas, ordenadas por lo que más impacta.</li>
              <li>Una recomendación concreta de por dónde seguir.</li>
            </ul>
            <p><strong>Lo que no incluye:</strong> el informe página por página ni la tabla de criterios completa. Eso es lo que agrega la auditoría de sitio.</p>
          </Desplegable>
          <p><Boton href="/contactanos/" variante="secundario">Pedir presupuesto de auditoría exprés</Boton></p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="Auditoría de sitio" id="auditoria-de-sitio">
        <div className="prose">
          <p>Lo habitual en el sector es auditar una muestra representativa de entre 8 y 15 páginas; nosotros revisamos la totalidad, página por página, contra el nivel AA como mínimo.</p>
          <Desplegable resumen="Qué incluye la auditoría de sitio">
            <ul>
              <li>Evaluación página por página y enlace por enlace, no una muestra.</li>
              <li>Nivel AA como mínimo, con AAA sugerido donde sea alcanzable.</li>
              <li>Informe completo con tabla de criterios, capturas y ejemplos.</li>
              <li>Las dos caras de la auditoría: la funcional, con teclado y lector de pantalla, y también la visual.</li>
              <li>Una llamada de cierre para repasar los hallazgos con quien quieras sumar de tu equipo.</li>
            </ul>
            <p><strong>La diferencia con la exprés:</strong> la exprés te dice si tienes un problema. Esta te dice exactamente cuál, dónde y con qué prioridad, en un documento que sirve como base de una declaración de accesibilidad.</p>
          </Desplegable>
          <p><Boton href="/contactanos/" variante="secundario">Pedir presupuesto de auditoría de sitio</Boton></p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Servicio integral" id="servicio-integral">
        <div className="prose">
          <p>Auditoría web más lo necesario para que las correcciones sean implementadas con éxito. Es la única modalidad con acompañamiento posterior a la entrega.</p>
          <Desplegable resumen="Qué incluye el servicio integral">
            <ul>
              <li>Todo lo de la auditoría de sitio.</li>
              <li>Seguimiento después de la entrega, durante el tiempo que tu equipo lo necesite y nos lo pida.</li>
              <li>La declaración de accesibilidad ya redactada.</li>
              <li>Un 20 % de descuento sobre el retesteo, que es la segunda revisión que se hace una vez implementados los cambios. Cuesta menos porque partimos del material del primer trabajo, que guardamos.</li>
              <li>Una sesión de auditoría en vivo, de 30 minutos a hora y media, según lo que haya para mostrar y conversar.</li>
            </ul>
            <p>El informe completo está garantizado sea cual sea el resultado de esa sesión en vivo. La grabación te la entregamos a ti como archivo, con los subtítulos aparte, para que puedas verla en el reproductor que uses habitualmente y guardarla donde quieras. No queda publicada en ningún sitio ni alojada en ningún canal nuestro.</p>
            <p><strong>La diferencia con la auditoría de sitio:</strong> la auditoría termina cuando recibes el informe. El servicio integral termina cuando los cambios están hechos.</p>
            <p>Si prefieres no resolverlo puertas adentro, también evaluamos y presupuestamos la corrección: aplicamos los cambios en el código, no solo los señalamos.</p>
          </Desplegable>
          <p><Boton href="/contactanos/" variante="secundario">Consultar por el servicio integral</Boton></p>
        </div>
      </Seccion>
      <Seccion numero="04" titulo="Taller corporativo" id="taller-corporativo">
        <div className="prose">
          <p>Formación en accesibilidad web para equipos. Un encuentro de una hora, extensible según necesidad. Remoto a cualquier país, o presencial en Argentina.</p>
          <p>Actualmente este servicio se ofrece en español.</p>
          <Desplegable resumen="Qué incluye el taller corporativo">
            <ul>
              <li>Una presentación armada a medida de las dudas concretas de tu equipo.</li>
              <li>Una demostración en vivo navegando con lector de pantalla, como eje de la sesión.</li>
              <li>Audiencia mixta: diseño, desarrollo y contenido en la misma sala, construyendo vocabulario compartido entre roles.</li>
              <li>Sin límite de asistentes. La prioridad es que aprenda cuanta más gente mejor, no cobrar por cabeza.</li>
            </ul>
            <p>La demostración funciona mucho mejor sobre tu propio sitio que sobre un ejemplo genérico.</p>
            <p><strong>En qué se diferencia del resto:</strong> los otros tres servicios evalúan un producto. Este forma a las personas que lo construyen, para que el próximo salga bien desde el principio.</p>
          </Desplegable>
          <p><Boton href="/contactanos/" variante="secundario">Consultar por un taller</Boton></p>
        </div>
      </Seccion>
      <Seccion numero="05" titulo="Extras" id="extras">
        <div className="prose">
          <p>La declaración de accesibilidad y el ACR se pueden contratar por separado, sobre una auditoría ya hecha. Si te solicitan un certificado, antes de contratar es conveniente informarse sobre <a href="/certificado-accesibilidad-web/">los certificados de accesibilidad web existentes</a> y cuál se necesita según dónde se venda.</p>
        </div>
      </Seccion>
      <Seccion numero="06" titulo="Cómo auditamos la accesibilidad web" id="como-auditamos">
        <div className="prose">
          <p>Combinamos herramientas automáticas con revisión manual usando lectores de pantalla: NVDA, JAWS, el Narrador de Windows y TalkBack para Android.</p>
          <p>Trabajamos sobre WCAG 2.2 como base común. Desde ahí evaluamos contra el marco pertinente: EN 301 549 y la Ley Europea de Accesibilidad, la EAA, en Europa; ADA y Section 508 en Estados Unidos; o la normativa nacional que corresponda en América Latina. Para asegurarte de qué ley debes acatar, consúltalo en <a href="/normativa-legal/">qué ley de accesibilidad te obliga</a>.</p>
          <p>No nos limitamos a sitios web. Auditamos aplicaciones Android, documentos PDF y EPUB, software de escritorio y extensiones de navegador.</p>
          <p>Cada informe se adapta al destinatario. Ofrecemos entrega en los siguientes formatos:</p>
          <ul>
            <li>Documento completo, con tabla de criterios, capturas y ejemplos.</li>
            <li>Hoja de cálculo con el detalle técnico.</li>
            <li>Versión en lenguaje simplificado para departamentos ajenos al desarrollo principal.</li>
            <li>ACR, la plantilla <span lang="en">VPAT</span> rellenada criterio por criterio, para vender en Estados Unidos. Puede entregarse solo o acompañar a un informe completo.</li>
          </ul>
        </div>
      </Seccion>
      <Seccion numero="07" titulo="Condiciones de trabajo" id="condiciones-de-trabajo">
        <div className="prose">
          <p>Trabajamos con particulares y con agencias, con preferencia por el trato directo. En la auditoría de sitio, el servicio integral y el taller se abona el 50 % al cerrar el contrato, por escrito o después de una videollamada, y el resto contra entrega.</p>
          <p>La auditoría exprés se abona íntegra al contratarla.</p>
          <p>Manejamos PayPal y transferencia bancaria europea, argentina o estadounidense. Presupuestamos en euros para Europa y en dólares para América, con precios especiales para Argentina.</p>
          <p><strong>Contrato.</strong> Al cerrar el trabajo emitimos un contrato propio que deja por escrito el alcance, los entregables y los plazos, más allá del presupuesto.</p>
          <p>Si el contratante solicita un acuerdo de confidencialidad, lo firmamos.</p>
          <p><strong>Alcance.</strong> Entregamos el diagnóstico, la priorización y las recomendaciones. La implementación y el cumplimiento del producto quedan del lado de quien lo desarrolla. La excepción es el servicio integral, que incluye acompañamiento post auditoría.</p>
        </div>
      </Seccion>
      <Banda>
        <p><a href="/contactanos/">Escribir a tuaccesible</a> o directo a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
      </Banda>
    </>
  );
}
