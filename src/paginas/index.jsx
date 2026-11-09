import { GraduationCap, ListChecks, Wrench, Zap } from "lucide-react";
import { Banda } from "../componentes/Banda.jsx";
import { Boton } from "../componentes/Boton.jsx";
import { Seccion } from "../componentes/Seccion.jsx";
import { Tarjeta, Tarjetas } from "../componentes/Tarjetas.jsx";

export const pagina = {
  idioma: "es",
  titulo: "Inicio",
  descripcion: "Consultoría en accesibilidad digital. Auditorías WCAG 2.2, EN 301 549 y EAA, formación para equipos y acompañamiento de las correcciones. Revisión manual con lector de pantalla.",
  rutaAlternativa: "/en/",
};

export default function Inicio() {
  return (
    <>
      <div className="portada">
        <h1 className="portada__titulo">Tu producto, tu marca, tu sitio: <br />accesible.</h1>
        <p className="lede">Auditorías WCAG y EN 301 549, formación para equipos, y acompañamiento para que la accesibilidad deje de resolverse en el último momento. Trabajamos con empresas de España, América Latina y Estados Unidos.</p>
        <div className="portada__accion">
          <Boton href="/contacto/">Pedir presupuesto</Boton>
          <p>Presupuestar no cuesta nada: cuéntanos qué hay que auditar y en qué plazo, y te decimos por dónde conviene empezar aunque no termines contratando nada.</p>
        </div>
        <p className="portada__nota">La revisión manual la hace María Pía, que usa un lector de pantalla como su forma principal de trabajar desde hace más de trece años. No es un argumento de marketing: cambia qué se prueba y cómo.</p>
      </div>
      <Seccion numero="01" titulo="Cuatro formas de empezar">
        <Tarjetas>
          <Tarjeta titulo="Auditoría exprés" href="/servicios/#auditoria-expres" icono={Zap}>
            Un diagnóstico rápido y priorizado cuando necesitas saber ya dónde está tu sitio.
          </Tarjeta>
          <Tarjeta titulo="Auditoría de sitio" href="/servicios/#auditoria-de-sitio" icono={ListChecks}>
            Revisión completa contra WCAG 2.2 y EN 301 549, página por página y no por muestra.
          </Tarjeta>
          <Tarjeta titulo="Servicio integral" href="/servicios/#servicio-integral" icono={Wrench}>
            La auditoría completa más el acompañamiento hasta que las correcciones estén implementadas.
          </Tarjeta>
          <Tarjeta titulo="Taller corporativo" href="/servicios/#taller-corporativo" icono={GraduationCap}>
            Para que tu equipo deje de repetir los mismos errores en cada proyecto nuevo.
          </Tarjeta>
        </Tarjetas>
      </Seccion>
      <Seccion numero="02" titulo="Por qué tuaccesible">
        <div className="prose">
          <p>La accesibilidad se sostiene con revisión real: navegación por teclado, lectores de pantalla de verdad, y criterio técnico para priorizar lo que más impacta a las personas que usan tu sitio todos los días.</p>
          <p>Y ningún informe sale con una sola lectura: otra persona del equipo contrasta los hallazgos y su prioridad antes de que te lleguen. Es más lento y es deliberado. Lo contamos entero en <a href="/sobre-tuaccesible/">cómo trabajamos</a>.</p>
          <p>¿Te están ofreciendo un sello o un certificado de accesibilidad? Antes de contratarlo, mira <a href="/certificado-accesibilidad-web/">qué certificados existen de verdad</a> y cuál te pide la ley, porque no se llama certificado.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Cómo empieza">
        <div className="prose">
          <p>Nos escribes contando qué producto hay que revisar y para cuándo. Te decimos qué servicio encaja y cuánto costaría, sin coste ni compromiso.</p>
          <p>Auditamos con herramientas automáticas y con uso real, y te entregamos un informe priorizado por impacto, no por cantidad de reglas incumplidas. El <a href="/servicios/">detalle de cada servicio</a> explica qué incluye cada uno.</p>
          <p>Si no sabes si te obliga alguna norma, empieza por <a href="/normativa/">qué ley de accesibilidad te obliga</a>: está escrito para responder esa pregunta y nada más.</p>
        </div>
      </Seccion>
      <Banda>
        <p><a href="/contacto/">Escribir a tuaccesible</a> o ver el <a href="/servicios/">detalle de servicios</a>.</p>
      </Banda>
    </>
  );
}
