import { GraduationCap, ListChecks, Wrench, Zap } from "lucide-react";
import { Banda } from "../../componentes/Banda.jsx";
import { Boton } from "../../componentes/Boton.jsx";
import { Credencial, Credenciales } from "../../componentes/Credenciales.jsx";
import { Seccion } from "../../componentes/Seccion.jsx";
import { Tarjeta, Tarjetas } from "../../componentes/Tarjetas.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Digital accessibility consulting",
  descripcion: "Digital accessibility consulting. WCAG 2.2, EN 301 549, EAA and ADA audits, team training and support through remediation. Manual review with a screen reader.",
  rutaAlternativa: "/",
};

export default function Home() {
  return (
    <>
      <div className="portada">
        <h1 className="portada__titulo">Your product, brand and site, 100% accessible</h1>
        <p className="lede">WCAG and EN 301 549 audits, team training, and support so accessibility is part of the process from the start. We work with companies in the United States, Spain and Latin America.</p>
        <div className="portada__accion">
          <div className="portada__botones">
            <Boton href="/en/contact-us/">Ask for a quote</Boton>
            <Boton href="/en/services/" variante="secundario">See services</Boton>
          </div>
          <p>Quoting costs nothing: tell us what you need audited and what timeline you're working with, and we'll tell you where it makes sense to start!</p>
        </div>
        <p className="portada__nota">Our team of auditors is made up of native screen reader users, who have been using one for more than 10 years.</p>
        <Credenciales>
          <Credencial valor="Since 2021">Professional audits of websites, apps, documents and software</Credencial>
          <Credencial valor="IAAP">A11Y Development Knowledge Badge, 2026</Credencial>
          <Credencial valor="WCAG 2.2 AA">Specialization by <span lang="es">Instituto de Accesibilidad</span> and DALAT, certified by UNTREF, an Argentine national university</Credencial>
          <Credencial valor="UTN and WeAAAre">Training in digital accessibility and ARIA</Credencial>
        </Credenciales>
      </div>
      <Seccion numero="01" titulo="Four ways to start">
        <Tarjetas>
          <Tarjeta titulo="Express audit" href="/en/services/#express-audit" icono={Zap}>
            A prioritized diagnosis when you need to know quickly where your site stands.
          </Tarjeta>
          <Tarjeta titulo="Site audit" href="/en/services/#site-audit" icono={ListChecks}>
            A full review against WCAG 2.2 and EN 301 549, page by page.
          </Tarjeta>
          <Tarjeta titulo="Full package" href="/en/services/#full-package" icono={Wrench}>
            A full audit plus support until the fixes are implemented.
          </Tarjeta>
          <Tarjeta titulo="Corporate workshop" href="/en/services/#corporate-workshop" icono={GraduationCap}>
            So your team stops repeating the same mistakes on every new project, saving you time, budget and resources.
          </Tarjeta>
        </Tarjetas>
      </Seccion>
      <Seccion numero="02" titulo="Why tuaccesible">
        <div className="prose">
          <p>Accessibility holds up through real review: keyboard navigation, screen readers and the technical judgment to prioritize what most affects the people who use your site every day.</p>
          <p>No report is delivered on a single reading: several members of the team cross-check the findings and their priority before you receive the report. It's slower, and we prefer it that way. We tell the whole story in <a href="/en/who-we-are/">how we work</a>.</p>
          <p>Is someone offering you an accessibility seal or certificate? Before you pay for it, look at <a href="/en/web-accessibility-certificate/">which certificates actually exist</a> and which one the law asks of you, because not every one applies to you.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Where to begin">
        <div className="prose">
          <ol className="pasos">
            <li>You write to us telling us what product you need reviewed and what timeline you're working with.</li>
            <li>We tell you what you need, what we can offer and the price of that service. The initial consultation is free of charge. Write to us with no obligation.</li>
            <li>We audit with automated tools, manual review and end-to-end testing, and deliver a detailed report that prioritizes impact over the number of rules failed. The <a href="/en/services/">full service details</a> explain what each one includes.</li>
          </ol>
          <p>If you're not sure whether any regulation applies to you, start with <a href="/en/legal-requirements/">which accessibility law applies to you</a>.</p>
          <p>Get informed and audit with confidence.</p>
        </div>
      </Seccion>
      <Banda titulo="Ready to start?">
        <p><a href="/en/contact-us/">Write to tuaccesible</a> or see the <a href="/en/services/">full service details</a>.</p>
      </Banda>
    </>
  );
}
