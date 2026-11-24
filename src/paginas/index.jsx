import { GraduationCap, ListChecks, Wrench, Zap } from "lucide-react";
import { Banda } from "../componentes/Banda.jsx";
import { Boton } from "../componentes/Boton.jsx";
import { Credencial, Credenciales } from "../componentes/Credenciales.jsx";
import { Seccion } from "../componentes/Seccion.jsx";
import { Tarjeta, Tarjetas } from "../componentes/Tarjetas.jsx";

export const pagina = {
  idioma: "es",
  titulo: "Consultoría en accesibilidad digital",
  descripcion: "Consultoría en accesibilidad digital. Auditorías WCAG 2.2, EN 301 549 y EAA, formación para equipos y acompañamiento de las correcciones. Revisión manual con lector de pantalla.",
  rutaAlternativa: "/en/",
};

export default function Inicio() {
  return (
    <>
      <div className="portada">
        <h1 className="portada__titulo">Tu producto, marca y sitio, 100 % accesible</h1>
        <p className="lede">Auditorías WCAG y EN 301 549, formación para equipos, y acompañamiento para que la accesibilidad sea parte del proceso desde el principio. Trabajamos con empresas de España, América Latina y Estados Unidos.</p>
        <div className="portada__accion">
          <div className="portada__botones">
            <Boton href="/contactanos/">Pedir presupuesto</Boton>
            <Boton href="/servicios/" variante="secundario">Ver servicios</Boton>
          </div>
          <p>Presupuestar no cuesta nada: ¡cuéntanos qué requieres auditar y con qué plazo cuentas, y te decimos por dónde conviene empezar!</p>
        </div>
        <p className="portada__nota">Nuestro equipo de auditores está formado por usuarios nativos de lector de pantalla, quienes están habituados a su uso desde hace más de 10 años.</p>
        <Credenciales>
          <Credencial valor="Desde 2021">Auditorías profesionales de sitios web, aplicaciones, documentos y software</Credencial>
          <Credencial valor="IAAP"><span lang="en">A11Y Development Knowledge Badge</span>, 2026</Credencial>
          <Credencial valor="WCAG 2.2 AA">Especialización del Instituto de Accesibilidad y DALAT, certificada por la UNTREF</Credencial>
          <Credencial valor="UTN y WeAAAre">Formación en accesibilidad digital y en ARIA</Credencial>
        </Credenciales>
      </div>
      <Seccion numero="01" titulo="Cuatro formas de empezar">
        <Tarjetas>
          <Tarjeta titulo="Auditoría exprés" href="/servicios/#auditoria-expres" icono={Zap}>
            Un diagnóstico priorizado cuando necesitas saber con rapidez dónde está tu sitio.
          </Tarjeta>
          <Tarjeta titulo="Auditoría de sitio" href="/servicios/#auditoria-de-sitio" icono={ListChecks}>
            Revisión completa contra WCAG 2.2 y EN 301 549, página por página.
          </Tarjeta>
          <Tarjeta titulo="Servicio integral" href="/servicios/#servicio-integral" icono={Wrench}>
            Auditoría completa más acompañamiento hasta que las correcciones estén implementadas.
          </Tarjeta>
          <Tarjeta titulo="Taller corporativo" href="/servicios/#taller-corporativo" icono={GraduationCap}>
            Para que tu equipo deje de repetir los mismos errores en cada proyecto nuevo, ahorrándote tiempo, presupuesto y recursos.
          </Tarjeta>
        </Tarjetas>
      </Seccion>
      <Seccion numero="02" titulo="Por qué tuaccesible">
        <div className="prose">
          <p>La accesibilidad se sostiene con revisión real: navegación por teclado, lectores de pantalla y criterio técnico para priorizar lo que más impacta a las personas que usan tu sitio todos los días.</p>
          <p>Ningún informe se entrega con una sola lectura: varios miembros del equipo contrastan los hallazgos y su prioridad antes de que recibas el informe. Es más lento, lo preferimos así. Lo contamos entero en <a href="/quienes-somos/">cómo trabajamos</a>.</p>
          <p>¿Te están ofreciendo un sello o un certificado de accesibilidad? Antes de contratarlo, mira <a href="/certificado-accesibilidad-web/">qué certificados existen de verdad</a> y cuál te pide la ley, porque no cualquiera te aplica.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Por dónde comenzar">
        <div className="prose">
          <ol className="pasos">
            <li>Nos escribes contándonos qué producto necesitas revisar y con qué plazo cuentas.</li>
            <li>Te informamos qué necesitas, qué te podemos ofrecer y el precio del servicio en cuestión. La consulta inicial no incluye cargos. Escríbenos sin compromiso.</li>
            <li>Auditamos con herramientas automáticas, revisión manual y testing integral, entregándote un informe pormenorizado priorizando impacto sobre cantidad de reglas incumplidas. El <a href="/servicios/">detalle de cada servicio</a> explica qué incluye.</li>
          </ol>
          <p>Si no estás seguro de si hay alguna norma que te obligue, empieza por <a href="/normativa-legal/">qué ley de accesibilidad te obliga</a>.</p>
          <p>Infórmate y audita sobre seguro.</p>
        </div>
      </Seccion>
      <Banda titulo="¿Empezamos?">
        <p><a href="/contactanos/">Escribir a tuaccesible</a> o ver el <a href="/servicios/">detalle de servicios</a>.</p>
      </Banda>
    </>
  );
}
