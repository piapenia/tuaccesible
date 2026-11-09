import { ArrowRight } from "lucide-react";
import { IMPACTOS } from "../../api/index.js";
import { Aviso } from "../../componentes/Aviso.jsx";
import { Boton } from "../../componentes/Boton.jsx";
import { Desplegable } from "../../componentes/Desplegable.jsx";

/* Paso 2: lo que encontro la prueba automatica.

   Arriba, la pagina y la fecha, cuatro numeros y el aviso de que una
   prueba automatica no encuentra todo. Debajo, una regla por desplegable,
   de la mas grave a la menos grave. La gravedad se dice con palabras dentro
   del propio resumen del desplegable ("Gravedad: Critico"): la etiqueta de
   color es un refuerzo para la vista.

   Los textos de cada regla (help, ejemplos) vienen del backend y se
   muestran como texto: los ejemplos son selectores CSS y van en <code>. */
export function PasoResultados({ t, idioma, refTitulo, analisis, alSeguir, alEmpezarDeNuevo }) {
  const r = t.resultados;
  const reglas = [...analisis.violations].sort((a, b) => IMPACTOS.indexOf(a.impact) - IMPACTOS.indexOf(b.impact));
  const elementos = reglas.reduce((suma, regla) => suma + regla.nodes, 0);
  const fecha = new Intl.DateTimeFormat(idioma === "en" ? "en-US" : "es", { dateStyle: "long", timeStyle: "short" }).format(
    new Date(analisis.analyzed_at)
  );
  const conteos = [
    [reglas.length, r.conteos.reglas],
    [elementos, r.conteos.elementos],
    [analisis.passes, r.conteos.superadas],
    [analisis.incomplete, r.conteos.revisar],
  ];

  return (
    <section className="analizador__paso-contenido">
      <h2 ref={refTitulo} tabIndex={-1}>
        {r.titulo}
      </h2>
      <p className="analizador__url">{r.resumen(analisis.analyzed_url, fecha)}</p>
      <ul className="analizador__conteos">
        {conteos.map(([numero, texto]) => (
          <li key={texto(2)} className="analizador__conteo">
            <strong className="analizador__numero">{numero}</strong> {texto(numero)}
          </li>
        ))}
      </ul>
      <p className="nota">{r.limites}</p>

      <h3>{r.problemas}</h3>
      {reglas.length === 0 ? (
        <Aviso>
          <strong>{r.sinProblemasDestacado}</strong> {r.sinProblemas}
        </Aviso>
      ) : (
        <ul className="analizador__reglas">
          {reglas.map((regla, indice) => (
            <li key={`${regla.rule_id}-${indice}`}>
              <Desplegable
                resumen={
                  <>
                    {regla.help}
                    <span className="sr-only">. {r.gravedad}:</span>{" "}
                    <span className={`analizador__gravedad analizador__gravedad--${regla.impact}`}>{r.gravedades[regla.impact]}</span>
                  </>
                }
              >
                <dl className="analizador__datos">
                  <dt>{r.criterios}</dt>
                  <dd>{regla.wcag.length > 0 ? regla.wcag.join(", ") : r.sinCriterio}</dd>
                  <dt>{r.elementos}</dt>
                  <dd>{regla.nodes}</dd>
                  {regla.examples.length > 0 && (
                    <>
                      <dt>{r.ejemplos}</dt>
                      <dd>
                        <ul>
                          {regla.examples.map((ejemplo, numero) => (
                            <li key={numero}>
                              <code>{ejemplo}</code>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </>
                  )}
                  <dt>{r.regla}</dt>
                  <dd>
                    <code>{regla.rule_id}</code>
                  </dd>
                </dl>
              </Desplegable>
            </li>
          ))}
        </ul>
      )}

      <div className="analizador__botones">
        <Boton onClick={alSeguir} icono={ArrowRight}>
          {r.entrevista}
        </Boton>
        <Boton variante="secundario" onClick={alEmpezarDeNuevo}>
          {r.otra}
        </Boton>
      </div>
    </section>
  );
}
