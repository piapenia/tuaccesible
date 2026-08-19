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

  if (suggestEnglish) {
    text.textContent = "It looks like your browser is set to English.";
    switchBtn.textContent = "View in English";
  } else {
    text.textContent = "Tu navegador parece estar configurado en español.";
    switchBtn.textContent = "Ver en español";
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
