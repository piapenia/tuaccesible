import { Indice } from "../../componentes/Indice.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Accessibility statement",
  descripcion: "Conformance status of tuaccesible.com with WCAG, how it was tested, and how to report a problem.",
  rutaAlternativa: "/declaracion-accesibilidad/",
};

export default function AccessibilityStatement() {
  return (
    <>
      <h1>Accessibility statement</h1>
      <p className="lede">This site aims for full WCAG 2.2 Level AA with no exceptions, and Level AAA everywhere it's reasonably achievable. This statement documents the real status, not a headline.</p>
      <Indice
        idioma="en"
        entradas={[
          ["conformance-status", "Conformance status"],
          ["how-its-tested", "How it's tested"],
          ["where-aaa-is-applied", "Where AAA is applied"],
          ["display-preferences", "Display preferences"],
          ["known-limitations", "Known limitations"],
          ["report-a-problem", "Report a problem"],
          ["date", "Date"],
        ]}
      />
      <div className="prose">
        <h2 id="conformance-status">Conformance status</h2>
        <p>tuaccesible.com is built and maintained to meet Level AA in full. Level AAA is applied criterion by criterion, wherever it's reasonably achievable, and documented here as each section is tested. The site is held to the same standard, and the same process, as any client's product.</p>
        <h2 id="how-its-tested">How it's tested</h2>
        <p>Every change is checked automatically before it goes live, with axe-core or pa11y set to the WCAG2AAA ruleset. That catches some of the problems, not all of them. The rest is manual: full keyboard navigation, NVDA testing by someone who has used a screen reader as her main working tool for more than thirteen years, and a plain-language pass over the actual content.</p>
        <h2 id="where-aaa-is-applied">Where AAA is applied</h2>
        <ul>
          <li>7:1 text contrast across all content, except text that is part of the logo or brand name, which WCAG explicitly exempts from this requirement.</li>
          <li>No time limit on any content or form.</li>
          <li>Reinforced focus indicator, visible beyond the AA minimum.</li>
          <li>Link text that makes sense read out of context, without depending on surrounding text.</li>
          <li>No automatic changes of context. The language suggestion based on your browser appears once, never redirects you on its own, and can be dismissed.</li>
        </ul>
        <h2 id="display-preferences">Display preferences</h2>
        <p>Without you having to do anything, the site follows the dark mode, more-contrast and Windows contrast theme settings you already have. On top of that, the <a href="/en/preferences/">display preferences</a> page lets you choose a light or dark theme, more contrast, larger text or grayscale for this site only. It's an ordinary page with your browser's own controls, not an overlay, and your choice is saved in your browser, with no cookies.</p>
        <h2 id="known-limitations">Known limitations</h2>
        <p>As of today, we know of no unresolved Level AA barrier on this site. And to be clear about what we don't claim: we don't claim conformance with every AAA criterion. Level AAA is applied where it's reasonably achievable, criterion by criterion. The W3C itself advises against requiring full AAA across a whole site, and we agree.</p>
        <p>This site embeds no video, no audio, and no third-party content of any kind. Anything we deliver to a client during an engagement, reports and session recordings included, goes out as files and isn't part of this site.</p>
        <h2 id="report-a-problem">Report a problem</h2>
        <p>Found an accessibility barrier on this site? Email <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>. We're an accessibility consulting firm, so a barrier report about our own site goes straight to the front of the queue, and you'll hear back within two business days.</p>
        <h2 id="date">Date</h2>
        <p>Published August 19, 2026. This is a living document: we update it after every real review of the site, not on a fixed calendar date.</p>
      </div>
    </>
  );
}
