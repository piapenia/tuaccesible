import { Seccion } from "../../componentes/Seccion.jsx";
import { Banda } from "../../componentes/Banda.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Who we are",
  descripcion: "A digital accessibility consultancy. We audit with real screen readers against WCAG 2.2 and EN 301 549, and no report goes out without a second review.",
  rutaAlternativa: "/quienes-somos/",
};

export default function WhoWeAre() {
  return (
    <>
      <h1>Who we are</h1>
      <p className="lede">We're a digital accessibility consultancy. We audit web and mobile products against WCAG 2.2 and EN 301 549, train in-house teams and provide support while fixes are implemented.</p>
      <Seccion numero="01" titulo="Why an automated review isn't enough">
        <div className="prose">
          <p>An automated tool analyzes a website in seconds and returns a surface-level report, flagging problems such as insufficient contrast or an image with no alternative text.</p>
          <p>Manual review can catch more problems, such as focus that disappears when a menu opens, a form that marks an error in red without announcing it, or a dropdown menu that opens and can't be closed with the keyboard.</p>
          <p>We run both kinds of testing to deliver a complete, detailed report.</p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="No report is delivered on a single reading">
        <div className="prose">
          <p>Every audit and workshop goes through a series of reviews before delivery.</p>
          <p>If you consult us and come back later, we don't start from scratch.</p>
          <p>We keep the report and material from every job, so a client who writes to us months or years later can count on us already knowing their product.</p>
          <p>We work under a contract, not just a quote: scope and deliverables are set down in writing before we start, and we sign whatever non-disclosure agreement your company needs.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Who audits">
        <div className="prose">
          <p>The tools we work with, the experience behind them and our certifications are covered by María Pía, our lead auditor.</p>
          <p>To learn more, see <a href="/en/our-auditors/">Our auditors</a>.</p>
        </div>
      </Seccion>
      <Banda>
        <p><a href="/en/contact-us/">Write to tuaccesible</a> or see the <a href="/en/services/">full service details</a>.</p>
      </Banda>
    </>
  );
}
