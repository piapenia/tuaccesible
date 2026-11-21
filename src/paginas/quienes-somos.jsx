import { Seccion } from "../componentes/Seccion.jsx";
import { Banda } from "../componentes/Banda.jsx";

export const pagina = {
  idioma: "es",
  titulo: "Quiénes somos",
  descripcion: "Consultora de accesibilidad digital. Auditamos con lectores de pantalla reales contra WCAG 2.2 y EN 301 549, y ningún informe sale sin una segunda revisión.",
  rutaAlternativa: "/en/who-we-are/",
};

export default function SobreTuaccesible() {
  return (
    <>
      <h1>Quiénes somos</h1>
      <p className="lede">Somos una consultora de accesibilidad digital. Auditamos productos web y móviles contra WCAG 2.2 y EN 301 549, formamos equipos internos y acompañamos en la implementación de correcciones.</p>
      <Seccion numero="01" titulo="Por qué una revisión automática no alcanza">
        <div className="prose">
          <p>Una herramienta automática analiza un sitio web en segundos y devuelve un informe superficial, señalando problemas como el contraste insuficiente o la imagen carente de texto alternativo.</p>
          <p>Con la revisión manual es posible detectar más problemas como el foco que desaparece al abrir un menú, un formulario que marca un error en rojo sin anunciarlo o un menú desplegable que se abre y no se cierra con el teclado.</p>
          <p>Nosotros realizamos ambas pruebas para entregar un informe completo y pormenorizado.</p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="Ningún informe se entrega con una sola lectura">
        <div className="prose">
          <p>Cada auditoría y taller pasan por una serie de revisiones antes de ser entregados.</p>
          <p>En caso de consultar y volver más adelante, no comenzamos de cero.</p>
          <p>Guardamos el informe y material de cada trabajo, por lo que un cliente que nos escribe meses o años después cuenta con la garantía de que conocemos su producto.</p>
          <p>Trabajamos con contrato, no solo con presupuesto: el alcance y los entregables quedan por escrito antes de empezar, y firmamos el acuerdo de confidencialidad que tu empresa necesite.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Quién audita">
        <div className="prose">
          <p>Con qué herramientas trabajamos, desde qué experiencia y con qué certificaciones: eso lo cuenta María Pía, auditora en jefe.</p>
          <p>Para saber más consulta la sección <a href="/nuestros-auditores/">Nuestros auditores</a>.</p>
        </div>
      </Seccion>
      <Banda>
        <p><a href="/contactanos/">Escribir a tuaccesible</a> o ver el <a href="/servicios/">detalle de servicios</a>.</p>
      </Banda>
    </>
  );
}
