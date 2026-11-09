import { useId, useState } from "react";
import { CircleAlert, CircleCheck, Download, ExternalLink } from "lucide-react";
import { LARGO_MAXIMO_COMENTARIO, PUNTAJE_MAXIMO, PUNTAJE_MINIMO, api } from "../../api/index.js";
import { Boton } from "../../componentes/Boton.jsx";
import { Campo } from "../../componentes/Campo.jsx";
import { Icono } from "../../componentes/Icono.jsx";
import { sitio } from "../../sitio.js";
import { Alerta, useFoco } from "./comunes.jsx";
import { codigoDe, mensajeDeError } from "./textos.js";

const PUNTAJES = Array.from({ length: PUNTAJE_MAXIMO - PUNTAJE_MINIMO + 1 }, (_, indice) => PUNTAJE_MINIMO + indice);

/* Paso 4: el informe, la reunion y la opinion.

   Tres partes independientes, cada una con su h3: se pueden hacer en
   cualquier orden, o ninguna.

   Cuando un pedido sale bien, el boton que lo envio desaparece y el foco
   va a la confirmacion (un parrafo con tabIndex -1): NVDA la lee una vez y
   la persona sigue desde ahi. Sin ese salto, el foco quedaria en un boton
   que ya no existe y el lector volveria al principio de la pagina. */
export function PasoFinal({ t, idioma, refTitulo, sesion, alEmpezarDeNuevo }) {
  const f = t.final;
  return (
    <section className="analizador__paso-contenido">
      <h2 ref={refTitulo} tabIndex={-1}>
        {f.titulo}
      </h2>

      <h3>{f.informe}</h3>
      <p>{f.informeTexto}</p>
      <div className="analizador__botones">
        <Boton href={api.urlInforme(sesion.id, idioma)} icono={Download}>
          {f.descargar}
        </Boton>
      </div>

      <Reunion t={t} sesion={sesion} />
      <Opinion t={t} sesion={sesion} />

      <div className="analizador__botones analizador__botones--final">
        <Boton variante="secundario" onClick={alEmpezarDeNuevo}>
          {f.otra}
        </Boton>
      </div>
    </section>
  );
}

/* El pedido de reunion se anota en la sesion (meeting_requested). El dia
   se elige en una agenda externa, si el sitio tiene una (sitio.agenda); si
   no, se pide por la pagina de contacto. */
function Reunion({ t, sesion }) {
  const f = t.final;
  const [ocupado, setOcupado] = useState(false);
  const [anotada, setAnotada] = useState(false);
  const [error, setError] = useState(null);
  const [refConfirmacion, enfocarConfirmacion] = useFoco();

  async function pedir() {
    if (ocupado) return;
    setOcupado(true);
    setError(null);
    try {
      await api.actualizarSesion(sesion.id, { meeting_requested: true });
      setAnotada(true);
      enfocarConfirmacion();
    } catch (falla) {
      setError(mensajeDeError(t, falla));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      <h3>{f.reunion}</h3>
      {anotada ? (
        <>
          <p ref={refConfirmacion} tabIndex={-1} className="analizador__confirmacion">
            <Icono de={CircleCheck} className="analizador__confirmacion-icono" />
            {f.reunionAnotada}
          </p>
          {sitio.agenda ? (
            <div className="analizador__botones">
              <Boton href={sitio.agenda} target="_blank" rel="noopener noreferrer" icono={ExternalLink}>
                {f.agenda} {f.agendaPestana}
              </Boton>
            </div>
          ) : (
            <p>
              {f.sinAgenda} <a href={t.contacto}>{f.sinAgendaEnlace}</a> {f.sinAgendaCierre}
            </p>
          )}
        </>
      ) : (
        <>
          <p>{f.reunionTexto}</p>
          <Alerta texto={error} />
          <div className="analizador__botones">
            <Boton variante="secundario" onClick={pedir} aria-disabled={ocupado ? "true" : undefined}>
              {ocupado ? f.pidiendoReunion : f.pedirReunion}
            </Boton>
          </div>
        </>
      )}
    </>
  );
}

/* El puntaje es un grupo de diez botones de opcion dentro de un fieldset:
   la pregunta es la leyenda, y la escala y el error se unen al grupo con
   aria-describedby, como lo hace el sistema de diseno del gobierno
   britanico. NVDA lee la pregunta, la escala y el error al entrar al grupo.
   El comentario es opcional.

   Antes de enviar se revisan los dos campos, para mostrar los dos errores
   juntos si los hay. El foco va al primero que falle. */
function Opinion({ t, sesion }) {
  const f = t.final;
  const id = useId();
  const idEscala = `${id}-escala`;
  const idErrorPuntaje = `${id}-error-puntaje`;
  const idComentario = `${id}-comentario`;
  const [puntaje, setPuntaje] = useState(null);
  const [comentario, setComentario] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const [errorPuntaje, setErrorPuntaje] = useState(null);
  const [errorComentario, setErrorComentario] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [refPrimerPuntaje, enfocarPuntaje] = useFoco();
  const [refComentario, enfocarComentario] = useFoco();
  const [refGracias, enfocarGracias] = useFoco();

  async function enviar(evento) {
    evento.preventDefault();
    if (ocupado) return;
    setErrorGeneral(null);

    const faltaPuntaje = puntaje === null;
    const comentarioLargo = [...comentario.trim()].length > LARGO_MAXIMO_COMENTARIO;
    setErrorPuntaje(faltaPuntaje ? t.errores["puntaje-invalido"] : null);
    setErrorComentario(comentarioLargo ? t.errores["comentario-invalido"](LARGO_MAXIMO_COMENTARIO) : null);
    if (faltaPuntaje) return enfocarPuntaje();
    if (comentarioLargo) return enfocarComentario();

    const cambios = { score: puntaje };
    if (comentario.trim()) cambios.comment = comentario;
    setOcupado(true);
    try {
      await api.actualizarSesion(sesion.id, cambios);
      setEnviada(true);
      enfocarGracias();
    } catch (falla) {
      const codigo = codigoDe(falla);
      if (codigo === "puntaje-invalido") {
        setErrorPuntaje(mensajeDeError(t, falla));
        enfocarPuntaje();
      } else if (codigo === "comentario-invalido") {
        setErrorComentario(mensajeDeError(t, falla, LARGO_MAXIMO_COMENTARIO));
        enfocarComentario();
      } else {
        setErrorGeneral(mensajeDeError(t, falla));
      }
    } finally {
      setOcupado(false);
    }
  }

  if (enviada) {
    return (
      <>
        <h3>{f.opinion}</h3>
        <p ref={refGracias} tabIndex={-1} className="analizador__confirmacion">
          <Icono de={CircleCheck} className="analizador__confirmacion-icono" />
          {f.gracias}
        </p>
      </>
    );
  }

  return (
    <>
      <h3>{f.opinion}</h3>
      <Alerta texto={errorGeneral} />
      <form className="formulario analizador__formulario" noValidate onSubmit={enviar}>
        <fieldset className="analizador__escala" aria-describedby={errorPuntaje ? `${idEscala} ${idErrorPuntaje}` : idEscala}>
          <legend>{f.pregunta}</legend>
          <p id={idEscala} className="campo__ayuda">
            {f.escala}
          </p>
          {errorPuntaje && (
            <p id={idErrorPuntaje} className="campo__error">
              <Icono de={CircleAlert} className="campo__error-icono" />
              {errorPuntaje}
            </p>
          )}
          <div className="analizador__puntajes">
            {PUNTAJES.map((valor, indice) => (
              <label key={valor} className="analizador__puntaje">
                <input
                  ref={indice === 0 ? refPrimerPuntaje : undefined}
                  type="radio"
                  name={`${id}-puntaje`}
                  value={valor}
                  checked={puntaje === valor}
                  onChange={() => setPuntaje(valor)}
                />
                {valor}
              </label>
            ))}
          </div>
        </fieldset>
        <Campo etiqueta={f.comentario} ayuda={f.ayudaComentario(LARGO_MAXIMO_COMENTARIO)} error={errorComentario}>
          <textarea
            ref={refComentario}
            id={idComentario}
            name="comentario"
            rows={4}
            value={comentario}
            onChange={(evento) => setComentario(evento.target.value)}
          />
        </Campo>
        <Boton tipo="submit" aria-disabled={ocupado ? "true" : undefined}>
          {ocupado ? f.enviandoOpinion : f.enviarOpinion}
        </Boton>
      </form>
    </>
  );
}
