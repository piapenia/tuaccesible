import { PreferenciasVisualizacion } from "../../componentes/PreferenciasVisualizacion.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Display preferences",
  descripcion: "Choose a light or dark theme, more contrast, larger text or grayscale for tuaccesible.com. Saved in your browser, with no cookies.",
  rutaAlternativa: "/preferencias/",
};

export default function Preferences() {
  return (
    <>
      <h1>Display preferences</h1>
      <p className="lede">Change this site's theme, contrast and text size here, or view it in grayscale.</p>
      <noscript>
        <p>These controls need JavaScript, which is turned off in your browser. Without it, the site follows your system settings, explained below.</p>
      </noscript>
      <PreferenciasVisualizacion idioma="en" />
      <div className="prose">
        <h2 id="from-your-system">If you've already set this up on your device</h2>
        <p>You don't need to change anything here. The site follows the dark mode and more-contrast settings of your operating system or browser. With a Windows contrast theme turned on, your theme sets the colors: the theme and contrast you pick here won't show until you turn it off, but text size will.</p>
        <p>Whatever you pick on this page applies only to this site, in this browser. On another device or another browser, the site goes back to following your system.</p>
        <h2 id="zoom">To enlarge everything, not just the text</h2>
        <p>Browser zoom enlarges text, buttons, spacing and images all at once, and most browsers remember it for each site. Ctrl and the plus key zooms in (Cmd and plus on a Mac), Ctrl and minus zooms out, and Ctrl and 0 takes it back to normal. The content reflows to fit the window, so you never have to scroll sideways to read.</p>
        <p>The text size option on this page enlarges only the letters and leaves everything else as it is, for people who prefer it that way.</p>
        <h2 id="grayscale">Grayscale across your whole screen</h2>
        <p>The option on this page removes color from this site only. If you find it more comfortable everywhere, Windows and macOS have color filters that apply it to the whole screen: on Windows, under Settings, Accessibility, Color filters; on macOS, under System Settings, Accessibility, Display.</p>
        <h2 id="color-blindness">Why there's no color-blindness filter</h2>
        <p>Because on this site, color is never the only way information is shown. Links in the text are underlined, the current page in the menu is also in bold, errors and statuses are spelled out in words, and text contrast is at least 7 to 1. A filter that shifts colors wouldn't add any information, and it could lower that contrast.</p>
        <p>If you find something that can only be told apart by color, email us at <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a> and we'll fix it.</p>
        <h2 id="what-is-saved">What gets saved</h2>
        <p>Your choice is saved in your browser's local storage, not in a cookie, and it never leaves your device. The button that goes back to your system settings deletes it, and so does clearing your browser data. The details are in our <a href="/en/privacy/#in-your-browser">privacy policy</a>.</p>
      </div>
    </>
  );
}
