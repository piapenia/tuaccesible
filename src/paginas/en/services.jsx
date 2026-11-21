import { Desplegable } from "../../componentes/Desplegable.jsx";
import { Seccion } from "../../componentes/Seccion.jsx";
import { Banda } from "../../componentes/Banda.jsx";
import { Boton } from "../../componentes/Boton.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Web accessibility audits and training",
  descripcion: "Web accessibility audits against WCAG 2.2, EN 301 549 and the European Accessibility Act (EAA). We review the site page by page, not a sample. Express audit, site audit, full package and team training.",
  rutaAlternativa: "/servicios/",
};

export default function Services() {
  return (
    <>
      <h1>Web accessibility audits and training</h1>
      <p className="lede">Four ways to work with tuaccesible, depending on where your product stands today and the timeline you're working with.</p>
      <p>Manual testing is carried out by a team of native screen reader users. We do a thorough technical review, focused on what a native, everyday user of this technology would experience and pay attention to.</p>
      <p><strong>Quoting costs nothing.</strong> With the site's address, the number and variety of templates, the journeys to review and details about any private areas, we give you a fixed scope, price and timeline within a week, in writing and before we start.</p>
      <p>We don't publish a price list, because no two sites are alike.</p>
      <p>This first step tells you the price and timeline. It doesn't include the list of fixes. For that we offer the Express audit, which also sharpens the quote for the overall job, since by then we know the relevant details.</p>
      <Seccion numero="01" titulo="Express audit" id="express-audit">
        <div className="prose">
          <p>A quick web accessibility diagnosis that shows you the overall picture before you commit to a full project. We review the home page at minimum, and add key links depending on the site. It's a first-level look.</p>
          <p>It's a general report on the current state of the site, and doesn't replace the page-by-page report. Delivered in 2 to 3 business days.</p>
          <p>This service is paid in full when you hire it.</p>
          <Desplegable resumen="What the express audit includes">
            <ul>
              <li>A manual review of the home page and a selection of key links.</li>
              <li>Direct observations, ordered by what has the most impact.</li>
              <li>A concrete recommendation on where to go next.</li>
            </ul>
            <p><strong>What it doesn't include:</strong> the page-by-page report or the full criteria table. That's what the Site audit adds.</p>
          </Desplegable>
          <p><Boton href="/en/contact-us/" variante="secundario">Get a quote for an express audit</Boton></p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="Site audit" id="site-audit">
        <div className="prose">
          <p>The industry norm is to audit a representative sample of 8 to 15 pages; we review all of it, page by page, against Level AA at minimum.</p>
          <Desplegable resumen="What the site audit includes">
            <ul>
              <li>Evaluation page by page and link by link, not a sample.</li>
              <li>Level AA as the minimum, with AAA suggested wherever it's achievable.</li>
              <li>A full report with criteria table, screenshots and examples.</li>
              <li>Both halves of the audit: the functional side, with keyboard and screen reader, and the visual side.</li>
              <li>A wrap-up call to go through the findings with anyone from your team you'd like to bring in.</li>
            </ul>
            <p><strong>How it differs from the Express audit:</strong> the Express audit tells you whether you have a problem. This one tells you exactly which, where and with what priority, in a document that serves as the basis for an accessibility statement.</p>
          </Desplegable>
          <p><Boton href="/en/contact-us/" variante="secundario">Get a quote for a site audit</Boton></p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Full package" id="full-package">
        <div className="prose">
          <p>A web audit plus whatever it takes for the fixes to be implemented successfully. It's the only option with support after delivery.</p>
          <Desplegable resumen="What the full package includes">
            <ul>
              <li>Everything in the Site audit.</li>
              <li>Follow-up after delivery, for as long as your team needs it and asks for it.</li>
              <li>The accessibility statement already drafted.</li>
              <li>20% off the retest, which is the second review once the changes are in. It costs less because we start from the material from the first job, which we keep.</li>
              <li>A live audit session, from 30 minutes to an hour and a half, depending on what there is to show and discuss.</li>
            </ul>
            <p>You're guaranteed the full report whatever the outcome of that live session. We give you the recording as a file, with the captions separate, so you can watch it in the player you normally use and keep it wherever you want. It isn't published anywhere or hosted on any channel of ours.</p>
            <p><strong>How it differs from the Site audit:</strong> the audit ends when you receive the report. The Full package ends when the changes are done.</p>
            <p>If you'd rather not handle it in-house, we also assess and quote the remediation: we make the changes in the code, not just flag them.</p>
          </Desplegable>
          <p><Boton href="/en/contact-us/" variante="secundario">Ask about the full package</Boton></p>
        </div>
      </Seccion>
      <Seccion numero="04" titulo="Corporate workshop" id="corporate-workshop">
        <div className="prose">
          <p>Web accessibility training for teams. A one-hour session, extendable as needed. Remote to any country, or in person in Argentina.</p>
          <p>This service is currently offered in Spanish.</p>
          <Desplegable resumen="What the corporate workshop includes">
            <ul>
              <li>A presentation built around your team's specific questions.</li>
              <li>A live demonstration navigating with a screen reader, as the centerpiece of the session.</li>
              <li>A mixed audience: design, development and content in the same room, building a shared vocabulary across roles.</li>
              <li>No cap on attendees. The priority is for as many people as possible to learn, not to charge per head.</li>
            </ul>
            <p>The demonstration works much better on your own site than on a generic example.</p>
            <p><strong>How it differs from the rest:</strong> the other three services evaluate a product. This one trains the people who build it, so the next one comes out right from the start.</p>
          </Desplegable>
          <p><Boton href="/en/contact-us/" variante="secundario">Ask about a workshop</Boton></p>
        </div>
      </Seccion>
      <Seccion numero="05" titulo="Extras">
        <div className="prose">
          <p>The accessibility statement and the ACR can be ordered separately, based on an audit already done. If you're asked for a certificate, before you hire anyone it's worth reading up on <a href="/en/web-accessibility-certificate/">the web accessibility certificates that exist</a> and which one you need depending on where you sell.</p>
        </div>
      </Seccion>
      <Seccion numero="06" titulo="How we audit web accessibility">
        <div className="prose">
          <p>We combine automated tools with manual review using screen readers: NVDA, JAWS, Windows Narrator and TalkBack for Android.</p>
          <p>We work from WCAG 2.2 as the common baseline. From there we evaluate against the relevant framework: EN 301 549 and the European Accessibility Act, the EAA, in Europe; ADA and Section 508 in the United States; or the applicable national regulation in Latin America. To make sure which law you have to comply with, check <a href="/en/legal-requirements/">which accessibility law applies to you</a>.</p>
          <p>We don't stop at websites. We audit Android apps, PDF and EPUB documents, desktop software and browser extensions.</p>
          <p>Every report is tailored to whoever receives it. We deliver in the following formats:</p>
          <ul>
            <li>A full document, with criteria table, screenshots and examples.</li>
            <li>A spreadsheet with the technical detail.</li>
            <li>A plain-language version for departments outside the core development team.</li>
            <li>An ACR, the VPAT template filled in criterion by criterion, for selling in the United States. It can be delivered on its own or alongside a full report.</li>
          </ul>
        </div>
      </Seccion>
      <Seccion numero="07" titulo="Working terms">
        <div className="prose">
          <p>We work with individual clients and with agencies, and prefer to deal directly. On the Site audit, the Full package and the workshop, 50% is paid when the contract is closed, in writing or after a video call, and the rest on delivery.</p>
          <p>The Express audit is paid in full when you hire it.</p>
          <p>We accept PayPal and European, Argentine or US bank transfer. We quote in euros for Europe and in dollars for the Americas, with special pricing for Argentina.</p>
          <p><strong>Contract.</strong> When we close the job we issue our own contract, which sets out in writing the scope, deliverables and timelines, beyond the quote.</p>
          <p>If the client asks for a non-disclosure agreement, we sign it.</p>
          <p><strong>Scope.</strong> We deliver the diagnosis, the prioritization and the recommendations. Implementation, and the product's compliance, stay with whoever develops it. The exception is the Full package, which includes post-audit support.</p>
        </div>
      </Seccion>
      <Banda>
        <p><a href="/en/contact-us/">Write to tuaccesible</a> or straight to <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
      </Banda>
    </>
  );
}
