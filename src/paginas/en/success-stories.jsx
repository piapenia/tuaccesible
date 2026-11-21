import { Aviso } from "../../componentes/Aviso.jsx";
import { Seccion } from "../../componentes/Seccion.jsx";
import { Banda } from "../../componentes/Banda.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Case studies and proof of work",
  descripcion: "What we audit, what we deliver and how you can check it yourself. No client names, because we don't publish any without express permission.",
  rutaAlternativa: "/casos-de-exito/",
};

export default function SuccessStories() {
  return (
    <>
      <h1>Case studies and proof of work</h1>
      <p className="lede">We don't publish any client's name without their express permission.</p>
      <p>Without it, we simply describe our work.</p>
      <Seccion numero="01" titulo="A recent project">
        <div className="prose">
          <p>A full audit of a web product and its browser extension, on web and Windows 11. Manual evaluation with NVDA and keyboard navigation against WCAG 2.2 Level AA, EN 301 549 and the European Accessibility Act. Two members of the team carried it out.</p>
          <p>The main finding wasn't a long list of different problems: it was the same one, repeated screen after screen, in a component reused across the whole product. That completely changes the client's job, because it isn't a hundred fixes but one done properly. Counting findings would have produced an alarming number and a wrong idea of the real effort.</p>
          <p>The delivery was a 29-page report with findings prioritized by severity, cognitive accessibility recommendations and a draft accessibility statement in Spanish and English.</p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="What exactly you get">
        <div className="prose">
          <p>An accessibility report isn't a list of errors dumped out of a tool. This is what every report that leaves here includes:</p>
          <ul>
            <li>The scope reviewed: which pages, which journeys and which components.</li>
            <li>The method and test environment: which screen readers, which browsers and which version of the standard.</li>
            <li>Each finding with the WCAG criterion it fails, its level, the steps to reproduce it and an acceptance criterion to close it.</li>
            <li>The full criteria table, including what passes. That's what an accessibility statement rests on.</li>
            <li>The proposed fix, not just the problem flagged.</li>
          </ul>
          <p>The <a href="/en/services/">full service details</a> explain which one includes what, and in which format it can be delivered.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="This site can be audited too">
        <div className="prose">
          <p>It's the easiest proof to check, and it doesn't depend on taking our word for it: go through this site with the keyboard, with a screen reader or at 400% zoom and check for yourself. Our <a href="/en/accessibility-statement/">accessibility statement</a> sets out what we meet, how we tested it and what we don't claim.</p>
        </div>
      </Seccion>
      <Seccion numero="04" titulo="Client reviews">
        <Aviso><strong>No reviews published yet.</strong> Reviews are checked before they're published and only appear with the permission of the person who wrote them.</Aviso>
        <p>Already worked with tuaccesible? <a href="/en/leave-a-review/">Leave us a review</a>.</p>
      </Seccion>
      <Banda>
        <p><a href="/en/contact-us/">Write to tuaccesible</a> or see the <a href="/en/services/">full service details</a>.</p>
      </Banda>
    </>
  );
}
