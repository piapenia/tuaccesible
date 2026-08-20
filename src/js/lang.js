/* Sugerencia de idioma en la primera visita.
   Vive en un archivo aparte y no dentro del HTML por dos razones: la
   politica de seguridad de contenido del sitio prohibe el script en linea
   (script-src 'self'), y asi el navegador lo cachea una sola vez.
   Es una mejora aditiva: sin JavaScript el aviso simplemente no aparece y
   el sitio sigue completo, con el conmutador de idioma siempre visible. */
(function () {
  "use strict";

  var STORAGE_KEY = "tuaccesible-lang-choice";
  var currentLang = document.documentElement.lang;
  var switchLink = document.getElementById("lang-switch-link");
  if (!switchLink) { return; }
  var altUrl = switchLink.getAttribute("href");

  switchLink.addEventListener("click", function () {
    var target = currentLang === "en" ? "es" : "en";
    try { localStorage.setItem(STORAGE_KEY, target); } catch (e) {}
  });

  var saved;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }
  if (saved) { return; }

  var browserLang = (navigator.language || "").toLowerCase();
  var suggestEnglish = browserLang.indexOf("en") === 0 && currentLang === "es";
  var suggestSpanish = browserLang.indexOf("es") === 0 && currentLang === "en";
  if (!suggestEnglish && !suggestSpanish) { return; }

  var banner = document.getElementById("lang-banner");
  var text = document.getElementById("lang-banner-text");
  var switchBtn = document.getElementById("lang-banner-switch");
  var dismissBtn = document.getElementById("lang-banner-dismiss");
  if (!banner || !text || !switchBtn || !dismissBtn) { return; }

  /* Todo el aviso se escribe en el idioma de la persona a la que se le habla,
     no en el de la pagina. Dos consecuencias:
     1. Hay que declararlo con lang o el lector de pantalla lee espanol con voz
        inglesa y al reves. Es el criterio WCAG 3.1.2, nivel AA.
     2. El boton de descartar tambien, porque lo pinta la plantilla en el idioma
        de la pagina y quedaba al reves que el resto del banner. */
  if (suggestEnglish) {
    text.textContent = "It looks like your browser is set to English.";
    text.setAttribute("lang", "en");
    switchBtn.textContent = "View in English";
    switchBtn.setAttribute("lang", "en");
    dismissBtn.textContent = "Stay in Spanish";
    dismissBtn.setAttribute("lang", "en");
  } else {
    text.textContent = "Tu navegador parece estar configurado en español.";
    text.setAttribute("lang", "es");
    switchBtn.textContent = "Ver en español";
    switchBtn.setAttribute("lang", "es");
    dismissBtn.textContent = "Seguir en inglés";
    dismissBtn.setAttribute("lang", "es");
  }

  switchBtn.addEventListener("click", function () {
    var target = suggestEnglish ? "en" : "es";
    try { localStorage.setItem(STORAGE_KEY, target); } catch (e) {}
    window.location.href = altUrl;
  });

  dismissBtn.addEventListener("click", function () {
    try { localStorage.setItem(STORAGE_KEY, currentLang); } catch (e) {}
    banner.classList.remove("is-visible");
  });

  banner.classList.add("is-visible");
})();
