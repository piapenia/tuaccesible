import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LARGO_MAXIMO_MENSAJE, api, limpiarMensaje } from "../../api/index.js";
import { Boton } from "../../componentes/Boton.jsx";
import { Campo } from "../../componentes/Campo.jsx";
import { Alerta, Estado, parrafos, useFoco } from "./comunes.jsx";
import { codigoDe, mensajeDeError } from "./textos.js";

/* Paso 3: la entrevista con el asistente.

   Al entrar se pide el primer turno (mensaje null) y el asistente abre con
   su primera pregunta. La conversacion es una lista dentro de role="log":
   NVDA lee cada mensaje nuevo cuando llega, sin que la persona tenga que ir
   a buscarlo, y la lista queda entera para releerla. Cada mensaje dice
   quien habla con texto ("Asistente", "Tu"), no solo con el color o el
   lado.

   Al enviar, el texto pasa a la conversacion, el campo se vacia y el foco
   vuelve al campo, listo para la respuesta siguiente. Si el envio falla, el
   mensaje sale de la conversacion y vuelve al campo, para mandarlo de
   nuevo sin reescribirlo.

   Cuando el backend dice finished, la entrevista esta completa: se avisa,
   el boton para seguir pasa a ser el principal y el campo queda por si la
   persona quiere agregar algo. "Terminar la entrevista" esta siempre. */
export function PasoEntrevista({ t, idioma, refTitulo, sesion, alSeguir, alEmpezarDeNuevo }) {
  const e = t.entrevista;
  const id = useId();
  const [mensajes, setMensajes] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [completa, setCompleta] = useState(false);
  const [estado, setEstado] = useState("");
  const [errorCampo, setErrorCampo] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [refCampo, enfocarCampo] = useFoco();
  const empezada = useRef(false);

  // Pide un turno al backend. mensaje null es el pedido para empezar.
  async function turno(mensaje) {
    setOcupado(true);
    setErrorGeneral(null);
    setEstado(e.esperando);
    try {
      const { reply, finished } = await api.entrevistar(sesion.id, { idioma, mensaje });
      setMensajes((lista) => [...lista, { autor: "asistente", texto: reply }]);
      if (finished) setCompleta(true);
      setEstado(finished ? e.completa : "");
      return true;
    } catch (error) {
      setEstado("");
      const codigo = codigoDe(error);
      if (codigo === "mensaje-invalido") {
        setErrorCampo(mensajeDeError(t, error, LARGO_MAXIMO_MENSAJE));
        enfocarCampo();
      } else {
        setErrorGeneral({ codigo, primero: mensaje === null });
      }
      return false;
    } finally {
      setOcupado(false);
    }
  }

  useEffect(() => {
    if (empezada.current) return;
    empezada.current = true;
    turno(null);
    // Solo al entrar al paso: turno cambia en cada dibujo y no tiene que
    // volver a pedir la apertura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enviar(evento) {
    evento.preventDefault();
    if (ocupado) return;
    let mensaje;
    try {
      mensaje = limpiarMensaje(respuesta);
    } catch (error) {
      setErrorCampo(mensajeDeError(t, error, LARGO_MAXIMO_MENSAJE));
      enfocarCampo();
      return;
    }
    setErrorCampo(null);
    setMensajes((lista) => [...lista, { autor: "tu", texto: mensaje }]);
    setRespuesta("");
    enfocarCampo();
    const salio = await turno(mensaje);
    if (!salio) {
      setMensajes((lista) => lista.slice(0, -1));
      setRespuesta((actual) => actual || mensaje);
    }
  }

  // Que se puede hacer ante cada error, ademas de leerlo.
  let textoError = null;
  let accionError = null;
  if (errorGeneral) {
    const { codigo, primero } = errorGeneral;
    textoError = codigo === "demasiados-pedidos" && !primero ? t.errores["limite-entrevista"] : mensajeDeError(t, { name: "ErrorApi", codigo });
    if (codigo === "no-encontrada") {
      accionError = (
        <Boton variante="secundario" chico onClick={alEmpezarDeNuevo}>
          {t.resultados.otra}
        </Boton>
      );
    } else if (primero && codigo !== "demasiados-pedidos") {
      accionError = (
        <Boton variante="secundario" chico onClick={() => turno(null)}>
          {e.reintentar}
        </Boton>
      );
    }
  }

  return (
    <section className="analizador__paso-contenido">
      <h2 ref={refTitulo} tabIndex={-1}>
        {e.titulo}
      </h2>
      <p>{e.intro}</p>
      <p className="nota">{e.privacidad}</p>

      <div role="log" aria-label={e.conversacion} className="analizador__conversacion">
        {mensajes.length > 0 && (
          <ol className="analizador__mensajes">
            {mensajes.map((mensaje, indice) => (
              <li key={indice} className={`analizador__mensaje analizador__mensaje--${mensaje.autor}`}>
                <p className="analizador__autor">{mensaje.autor === "asistente" ? e.asistente : e.tu}</p>
                {parrafos(mensaje.texto).map((parrafo, numero) => (
                  <p key={numero}>{parrafo}</p>
                ))}
              </li>
            ))}
          </ol>
        )}
      </div>

      <Alerta texto={textoError} accion={accionError} />

      <form className="formulario analizador__formulario" noValidate onSubmit={enviar}>
        <Campo etiqueta={e.etiqueta} ayuda={e.ayuda(LARGO_MAXIMO_MENSAJE)} error={errorCampo}>
          <textarea ref={refCampo} id={id} name="respuesta" rows={4} value={respuesta} onChange={(evento) => setRespuesta(evento.target.value)} />
        </Campo>
        <div className="analizador__botones">
          <Boton tipo="submit" variante={completa ? "secundario" : "primario"} aria-disabled={ocupado ? "true" : undefined}>
            {e.enviar}
          </Boton>
          <Boton variante={completa ? "primario" : "secundario"} onClick={alSeguir} icono={completa ? ArrowRight : undefined}>
            {completa ? e.seguir : e.terminar}
          </Boton>
        </div>
        <Estado>{estado}</Estado>
      </form>
    </section>
  );
}
