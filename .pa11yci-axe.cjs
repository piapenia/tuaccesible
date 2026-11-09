// Segunda pasada del control de accesibilidad, con axe-core, el motor que
// ya trae pa11y. La primera, .pa11yci.json, usa HTML_CodeSniffer en
// WCAG 2 AAA. Van por separado porque pa11y le pasa la opcion "rules" a
// los dos motores, y HTML_CodeSniffer corta con un error ante una regla
// que no conoce.
//
// pa11y le pide a axe WCAG 2.0 y 2.1 en los niveles A y AA, mas sus
// buenas practicas. WCAG 2.2 y el nivel AAA no vienen de serie y se suman
// aca, regla por regla:
//   target-size                  2.5.8, WCAG 2.2 AA: cada control mide
//                                al menos 24 por 24 pixeles, o tiene ese
//                                espacio libre alrededor.
//   color-contrast-enhanced      1.4.6, AAA: contraste de 7 a 1 (4,5 a 1
//                                en texto grande).
//   identical-links-same-purpose 2.4.9, AAA: enlaces con el mismo texto
//                                llevan al mismo destino.
//   meta-refresh-no-exceptions   2.2.4 y 3.2.5, AAA: nada de recargas ni
//                                redirecciones automaticas.
//
// axe cuenta como error solo lo de impacto serio o critico. Lo moderado o
// menor sale como aviso en el informe y no frena la publicacion.
//
// Las direcciones se leen de .pa11yci.json, para que la lista exista en un
// solo lugar: una pagina nueva se suma alli y la revisan las dos pasadas.
//
// Uso: npx pa11y-ci --config .pa11yci-axe.cjs

const base = require("./.pa11yci.json");

module.exports = {
  defaults: {
    ...base.defaults,
    runners: ["axe"],
    rules: ["target-size", "color-contrast-enhanced", "identical-links-same-purpose", "meta-refresh-no-exceptions"],
  },
  urls: base.urls,
};
