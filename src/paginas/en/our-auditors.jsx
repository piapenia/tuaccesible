import { DatosEstructurados } from "../../componentes/DatosEstructurados.jsx";
import { sitio } from "../../sitio.js";
import { Seccion } from "../../componentes/Seccion.jsx";
import { Banda } from "../../componentes/Banda.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Our auditors",
  descripcion: "María Pía Peña Foissac, lead accessibility auditor. More than thirteen years using a screen reader. Certifications, tools and track record.",
  rutaAlternativa: "/nuestros-auditores/",
};

export default function OurAuditors({ ruta }) {
  /* Datos estructurados (schema.org) de la persona que audita, para los
     buscadores. sameAs lleva el unico perfil externo verificable que existe
     hoy; si algun dia hay LinkedIn propio, va en esta misma lista.
     El bloque puede ir en cualquier lugar de la pagina sin que cambie nada
     para los buscadores: esta entre el titulo "Your report goes through two
     readings" y su parrafo solo porque ahi estaba en el sitio anterior. */
  const persona = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "María Pía Peña Foissac",
    jobTitle: "Lead accessibility auditor",
    worksFor: { "@type": "Organization", name: "tuaccesible" },
    url: `${sitio.url}${ruta}`,
    sameAs: ["https://www.credly.com/badges/b1386a4d-61cc-4c64-a4c4-a399475a6e42"],
  };
  return (
    <>
      <h1>Our auditors</h1>
      <p className="lede">María Pía Peña Foissac, lead auditor.</p>
      <div className="perfil">
        <img className="portrait" src="/img/maria-pia.jpg" width="1458" height="1534" alt="" />
        <div className="prose perfil__texto">
          <p>I'm totally blind, and I've used a screen reader for more than thirteen years. It isn't a tool I open to work: it's my main way of accessing everything digital, every day, inside and outside this consultancy. When I test your product with NVDA, I'm using it the way I use everything else.</p>
          <p>I work with NVDA, JAWS, Windows Narrator and TalkBack on Android, and with keyboard-only navigation. That's the part of the job where the barriers no automated tool flags show up.</p>
        </div>
      </div>
      <Seccion numero="01" titulo="What I audit, and since when">
        <div className="prose">
          <p>I've audited accessibility professionally since 2021: more than four years evaluating websites, mobile apps, documents and desktop software against WCAG 2.2, EN 301 549 and the European Accessibility Act.</p>
          <p>I write accessibility review reports with findings prioritized by severity, accessibility statements, and cognitive accessibility recommendations. My background is in software quality assurance. That's why a finding reaches your team with steps to reproduce it and an acceptance criterion, not as a loose observation.</p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="I also teach">
        <div className="prose">
          <p>I teach digital accessibility at the DALAT Foundation, and I taught the accessibility module at XAcademy. Teaching forced me to explain technical barriers to people who don't write code, and that changed how I write reports: if a content owner can't understand the finding, the finding doesn't get fixed.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Certifications">
        <div className="prose">
          <ul>
            <li>A11Y Development Knowledge Badge — IAAP, the International Association of Accessibility Professionals, January 2026. Earned by scoring above 85% on their accessibility knowledge test for developers. <a href="https://www.credly.com/badges/b1386a4d-61cc-4c64-a4c4-a399475a6e42">Verify on Credly</a>.</li>
            <li>Digital Accessibility Specialist, WCAG 2.2 Level AA — <span lang="es">Instituto de Accesibilidad</span> and DALAT, certified by <span lang="es">Universidad Nacional de Tres de Febrero</span>. October 2025.</li>
            <li>ARIA from Scratch for Developers and Designers — WeAAAre, July 2025.</li>
            <li>Digital Accessibility — <span lang="es">Universidad Tecnológica Nacional</span>, 2020.</li>
          </ul>
        </div>
      </Seccion>
      <Seccion numero="04" titulo="Your report goes through two readings">
        <div className="prose">
          <DatosEstructurados datos={persona} />
          <p>I do the auditing. I don't get the last word on the report. Before it goes out, another person at tuaccesible reads it, checks the prioritization and pushes back on the criteria I applied. The pushback is real: sometimes I drop a finding from critical to high because I can't defend it. That's the point. What reaches your team has already survived an argument.</p>
        </div>
      </Seccion>
      <Banda titulo="Let's talk">
        <p>If you have a product to audit, tell me where it stands and what timeline you have. I'll tell you where to start.</p>
        <p><a href="/en/contact-us/">Write to tuaccesible</a></p>
      </Banda>
    </>
  );
}
