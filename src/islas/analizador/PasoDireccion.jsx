import { useId, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { api, limpiarUrl } from "../../api/index.js";
import { Boton } from "../../componentes/Boton.jsx";
import { Campo } from "../../componentes/Campo.jsx";
import { Icono } from "../../componentes/Icono.jsx";
import { Alerta, Estado, useFoco } from "./comunes.jsx";
import { codigoDe, mensajeDeError } from "./textos.js";

/* Paso 1: la direccion de la pagina.

   La direccion se limpia antes de salir (sin parametros ni fragmento, ver
   limpiarUrl en src/api/validacion.js): si no es una direccion web, el
   error aparece en el campo y no sale ningun pedido. Si lo es, se crea la
   sesion y se pide el analisis, que puede tardar hasta un minuto.

   Mientras tanto el boton queda con aria-disabled, y no con disabled: asi
   conserva el foco y NVDA no lo pierde. Un segundo clic no hace nada. */
export function PasoDireccion({ t, idioma, refTitulo, alTerminar }) {
  const id = useId();
  const [direccion, setDireccion] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [estado, setEstado] = useState("");
  const [errorCampo, setErrorCampo] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [refCampo, enfocarCampo] = useFoco();

  async function analizar(evento) {
    evento.preventDefault();
    if (ocupado) return;
    setErrorGeneral(null);

    let url;
    try {
      url = limpiarUrl(direccion);
    } catch (error) {
      setErrorCampo(mensajeDeError(t, error));
      enfocarCampo();
      return;
    }

    setErrorCampo(null);
    setOcupado(true);
    setEstado(t.direccion.analizando(url));
    try {
      const sesion = await api.crearSesion({ analyzed_url: url });
      const analisis = await api.analizarSesion(sesion.id, { idioma });
      alTerminar(sesion, analisis);
    } catch (error) {
      setOcupado(false);
      setEstado("");
      const codigo = codigoDe(error);
      if (codigo === "url-invalida" || codigo === "sitio-inaccesible") {
        setErrorCampo(mensajeDeError(t, error));
        enfocarCampo();
      } else {
        setErrorGeneral(mensajeDeError(t, error));
      }
    }
  }

  return (
    <section className="analizador__paso-contenido">
      <h2 ref={refTitulo} tabIndex={-1}>
        {t.direccion.titulo}
      </h2>
      <p>{t.direccion.intro}</p>
      <Alerta texto={errorGeneral} />
      <form className="formulario analizador__formulario" noValidate onSubmit={analizar}>
        <Campo etiqueta={t.direccion.etiqueta} ayuda={t.direccion.ayuda} error={errorCampo}>
          <input
            ref={refCampo}
            id={id}
            name="direccion"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            value={direccion}
            onChange={(evento) => setDireccion(evento.target.value)}
          />
        </Campo>
        <Boton tipo="submit" aria-disabled={ocupado ? "true" : undefined}>
          {ocupado ? t.direccion.enviando : t.direccion.enviar}
          {ocupado && <Icono de={LoaderCircle} className="boton__icono analizador__girando" />}
        </Boton>
        <Estado>{estado}</Estado>
      </form>
    </section>
  );
}
