import { Boton } from "./Boton.jsx";

/* Los controles de /preferencias/ y /en/preferences/: cuatro grupos de
   botones de opcion nativos, un boton para volver a lo del sistema y un
   <output> donde se anuncia cada cambio.

   No es un widget ni una capa sobre el sitio: es una pagina comun, con
   controles del navegador, a la que se llega por un enlace. Lo que cambia
   lo aplica public/js/visualizacion.js, que se carga en todas las paginas.

   - Todo empieza oculto (hidden) y el script lo muestra: sin JavaScript
     estos controles no harian nada. El texto de la pagina explica como
     cambiar lo mismo desde el sistema. Ojo: .preferencias no puede llevar
     un display en el CSS, porque le ganaria a hidden y los controles
     quedarian a la vista sin funcionar.
   - Los nombres y valores de los botones son los que admite el script
     (VALORES en visualizacion.js). "sistema", "normal" y "no" quieren decir
     "sin atributo", o sea lo que diga el sistema.
   - Los mensajes del <output> van en atributos data- para que el texto
     este en el HTML, en el idioma de la pagina, y no en el script.
   - El aviso de que los cambios se aplican al momento va antes de los
     controles (WCAG 3.2.2 y 3.2.5). */
const textos = {
  es: {
    aviso:
      "Cada cambio se aplica en cuanto eliges una opción y queda guardado en este navegador para todas las páginas del sitio. No usamos cookies para esto.",
    grupos: [
      ["tema", "Tema", [["sistema", "Según el sistema"], ["claro", "Claro"], ["oscuro", "Oscuro"]]],
      ["contraste", "Contraste", [["sistema", "Según el sistema"], ["mas", "Más contraste"]]],
      ["texto", "Tamaño del texto", [["normal", "Normal"], ["grande", "Grande"], ["muy-grande", "Más grande"]]],
      ["grises", "Escala de grises", [["no", "Desactivada"], ["si", "Activada"]]],
    ],
    restablecer: "Usar los ajustes del sistema",
    guardado: "Cambio aplicado y guardado.",
    sinGuardar: "Cambio aplicado solo en esta página: tu navegador no permite guardarlo.",
    restablecido: "Listo: el sitio vuelve a seguir los ajustes de tu sistema.",
  },
  en: {
    aviso:
      "Each change applies as soon as you pick an option and is saved in this browser for every page on the site. No cookies are involved.",
    grupos: [
      ["tema", "Theme", [["sistema", "Use system setting"], ["claro", "Light"], ["oscuro", "Dark"]]],
      ["contraste", "Contrast", [["sistema", "Use system setting"], ["mas", "More contrast"]]],
      ["texto", "Text size", [["normal", "Default"], ["grande", "Large"], ["muy-grande", "Larger"]]],
      ["grises", "Grayscale", [["no", "Off"], ["si", "On"]]],
    ],
    restablecer: "Use my system settings",
    guardado: "Change applied and saved.",
    sinGuardar: "Change applied to this page only: your browser doesn't allow saving it.",
    restablecido: "Done. The site is back to following your system settings.",
  },
};

export function PreferenciasVisualizacion({ idioma }) {
  const t = textos[idioma];
  if (!t) {
    throw new Error(`PreferenciasVisualizacion: idioma tiene que ser "es" o "en", no "${idioma}"`);
  }
  return (
    <div id="preferencias-visualizacion" className="preferencias" hidden>
      <p className="preferencias__aviso">{t.aviso}</p>
      {t.grupos.map(([nombre, leyenda, opciones]) => (
        <fieldset className="preferencias__grupo" key={nombre}>
          <legend className="preferencias__leyenda">{leyenda}</legend>
          <div className="preferencias__opciones">
            {opciones.map(([valor, etiqueta]) => {
              const id = `preferencia-${nombre}-${valor}`;
              return (
                <label className="preferencias__opcion" htmlFor={id} key={valor}>
                  <input type="radio" id={id} name={nombre} value={valor} />
                  {etiqueta}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      <div className="preferencias__acciones">
        <Boton variante="secundario" id="preferencias-restablecer">
          {t.restablecer}
        </Boton>
        <output
          id="preferencias-estado"
          className="preferencias__estado"
          data-guardado={t.guardado}
          data-sin-guardar={t.sinGuardar}
          data-restablecido={t.restablecido}
        ></output>
      </div>
    </div>
  );
}
