import { api } from "../../api/index.js";
import { Aviso } from "../../componentes/Aviso.jsx";
import { Isla } from "../../componentes/Isla.jsx";
import { Seccion } from "../../componentes/Seccion.jsx";

/* English version of /analizar/ (see the comment there). */
export const pagina = {
  idioma: "en",
  titulo: "Automated accessibility check",
  descripcion: "An automated test of one page of your site, a short interview and a PDF report. Service in preparation.",
  rutaAlternativa: "/analizar/",
  noindex: true,
};

export default function Analyze() {
  return (
    <>
      <h1>Analyze a page of your site</h1>
      <p className="lede">An automated accessibility test, a short interview about your site and a PDF report with what we found. No account needed.</p>
      {api.configurado ? (
        <>
          <Aviso>
            <strong>This service is in preparation.</strong> You can try it, but the results aren't final yet.
          </Aviso>
          <Isla nombre="Analizador" props={{ idioma: "en" }} />
        </>
      ) : (
        <Aviso>
          <strong>This service is in preparation.</strong> It can't be used from this page yet. In the meantime, you can ask us to review your
          site from the <a href="/en/contact/">contact page</a>.
        </Aviso>
      )}

      <Seccion numero="01" titulo="What we keep and for how long">
        <div className="prose">
          <ul>
            <li>The address of the page you analyze, without parameters or fragment, and the date of the analysis.</li>
            <li>If you give us feedback or ask for a meeting, also the score, the comment and the request.</li>
            <li>The test results and the interview conversation stay in memory for one hour, to build the report, and are then deleted.</li>
            <li>We don't ask for your name or email.</li>
          </ul>
        </div>
      </Seccion>

      <Seccion numero="02" titulo="What this test covers and what it doesn't">
        <div className="prose">
          <ul>
            <li>The test uses axe, an open-source tool, and checks one page at a time.</li>
            <li>
              An automated test finds only some of the issues. The ones that depend on the keyboard, the screen reader or the meaning of the content
              show up when the page is checked by hand.
            </li>
            <li>The interview questions and the explanations in the report are written by a language model, which can make mistakes.</li>
            <li>
              The report doesn't replace an audit. If you need one, see our <a href="/en/services/">services</a>.
            </li>
          </ul>
        </div>
      </Seccion>
    </>
  );
}
