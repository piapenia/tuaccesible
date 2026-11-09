import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Icono } from "../../componentes/Icono.jsx";
import { PasoDireccion } from "./PasoDireccion.jsx";
import { PasoEntrevista } from "./PasoEntrevista.jsx";
import { PasoFinal } from "./PasoFinal.jsx";
import { PasoResultados } from "./PasoResultados.jsx";
import { textos } from "./textos.js";

/* Isla del servicio de testing: la unica parte del sitio con JavaScript.

     <Isla nombre="Analizador" props={{ idioma: "es" }} />

   Cuatro pasos, uno por vez:
   1. Direccion: la persona escribe la direccion de una pagina; se crea la
      sesion y el backend la analiza con axe.
   2. Resultados: los problemas que encontro la prueba, del mas grave al
      menos grave.
   3. Entrevista: un asistente hace unas preguntas sobre el sitio.
   4. Informe y opinion: el PDF, el pedido de reunion y el puntaje.

   Al compilar, y antes de que cargue el JavaScript, la isla es solo un
   parrafo que explica que el servicio se esta cargando, con un enlace a
   contacto: es lo que queda si el script no corre. Cuando React se monta,
   ese parrafo se reemplaza por el primer paso.

   Al cambiar de paso, el foco va al titulo del paso nuevo (un h2 con
   tabIndex -1): NVDA lo lee y la persona sigue leyendo desde ahi, en vez
   de quedar en un boton que ya no existe. Al cargar la pagina el foco no
   se mueve.

   Lo que habla con el backend esta en src/api/; aca solo se decide que
   mostrar con cada respuesta. Los textos estan en textos.js. */

export const PASOS = ["direccion", "resultados", "entrevista", "final"];

export function Analizador({ idioma = "es" }) {
  const t = textos[idioma] ?? textos.es;
  const [montado, setMontado] = useState(false);
  const [paso, setPaso] = useState("direccion");
  const [sesion, setSesion] = useState(null);
  const [analisis, setAnalisis] = useState(null);
  const refTitulo = useRef(null);
  const enfocarTitulo = useRef(false);

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!enfocarTitulo.current) return;
    enfocarTitulo.current = false;
    refTitulo.current?.focus();
  }, [paso]);

  function ir(nuevo) {
    enfocarTitulo.current = true;
    setPaso(nuevo);
  }

  function empezarDeNuevo() {
    setSesion(null);
    setAnalisis(null);
    ir("direccion");
  }

  if (!montado) {
    return (
      <div className="analizador">
        <p className="analizador__respaldo">
          {t.respaldo} <a href={t.contacto}>{t.respaldoEnlace}</a>.
        </p>
      </div>
    );
  }

  const comun = { t, idioma, refTitulo };
  return (
    <div className="analizador">
      <IndicadorDePasos t={t} paso={paso} />
      {paso === "direccion" && (
        <PasoDireccion
          {...comun}
          alTerminar={(nueva, resultado) => {
            setSesion(nueva);
            setAnalisis(resultado);
            ir("resultados");
          }}
        />
      )}
      {paso === "resultados" && (
        <PasoResultados {...comun} analisis={analisis} alSeguir={() => ir("entrevista")} alEmpezarDeNuevo={empezarDeNuevo} />
      )}
      {paso === "entrevista" && (
        <PasoEntrevista {...comun} sesion={sesion} alSeguir={() => ir("final")} alEmpezarDeNuevo={empezarDeNuevo} />
      )}
      {paso === "final" && <PasoFinal {...comun} sesion={sesion} alEmpezarDeNuevo={empezarDeNuevo} />}
    </div>
  );
}

/* Donde esta la persona: una lista numerada con el paso actual marcado con
   aria-current="step", que NVDA lee como "paso actual". Los pasos ya hechos
   llevan un tilde y "(completado)" en texto para el lector de pantalla:
   ni el tilde ni el color dicen nada solos. No son enlaces: no se puede
   volver atras, porque cada paso depende del anterior. */
function IndicadorDePasos({ t, paso }) {
  const actual = PASOS.indexOf(paso);
  return (
    <ol className="analizador__pasos" aria-label={t.pasos.etiqueta}>
      {PASOS.map((nombre, indice) => {
        const hecho = indice < actual;
        const clases = ["analizador__paso", hecho && "analizador__paso--hecho", indice === actual && "analizador__paso--actual"];
        return (
          <li key={nombre} className={clases.filter(Boolean).join(" ")} aria-current={indice === actual ? "step" : undefined}>
            <span className="analizador__paso-numero">
              {hecho ? <Icono de={Check} /> : indice + 1}
            </span>
            {hecho && <span className="sr-only">{indice + 1}</span>} {t.pasos.nombres[nombre]}
            {hecho && <span className="sr-only"> {t.pasos.completado}</span>}
          </li>
        );
      })}
    </ol>
  );
}
