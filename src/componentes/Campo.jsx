import { Children, cloneElement } from "react";
import { CircleAlert } from "lucide-react";
import { Icono } from "./Icono.jsx";

/* Campo de formulario: etiqueta, ayuda, error y control, ya unidos.

   El control (input, select o textarea) se escribe en la pagina, con su id
   y sus atributos de siempre. Campo le pone lo que cuesta acordarse:
   aria-describedby, para que el lector de pantalla lea la ayuda y el error
   al entrar al campo, y aria-invalid cuando hay error.

     <Campo etiqueta="Correo (obligatorio)" ayuda="Te respondemos a esta direccion.">
       <input type="email" id="email" name="email" autoComplete="email" required />
     </Campo>

     <Campo etiqueta="Autorizo a publicar esta resena..." casilla>
       <input type="checkbox" id="consent" name="consent" required />
     </Campo>

   - etiqueta: el texto del <label>. Si el campo es obligatorio, lo dice
     aca con palabras: el asterisco solo no lo entiende todo el mundo.
   - ayuda: opcional. Se lee despues de la etiqueta, con su id
     (<id>-ayuda).
   - error: opcional. Hoy los formularios del sitio no lo usan, porque los
     valida el navegador sin JavaScript; queda para la isla del servicio de
     testing, que si tendra validacion propia. Lleva icono y texto: el error
     no se senala solo con color.
   - casilla: para un checkbox. La casilla va antes de su etiqueta, al
     lado, que es donde se la busca.

   Orden en pantalla y en el codigo: etiqueta, ayuda, error y control. Asi
   la ayuda se ve antes de escribir, y con zoom grande no queda escondida
   debajo del teclado del celular. */
export function Campo({ etiqueta, ayuda, error, casilla, children }) {
  const control = Children.only(children);
  const id = control.props.id;
  if (!id) {
    throw new Error(`Campo "${etiqueta}": el control necesita un id, que es lo que une la etiqueta`);
  }
  const idAyuda = ayuda ? `${id}-ayuda` : null;
  const idError = error ? `${id}-error` : null;
  const descripcion = [idAyuda, idError].filter(Boolean).join(" ");
  const controlUnido = cloneElement(control, {
    "aria-describedby": descripcion || undefined,
    "aria-invalid": error ? "true" : undefined,
  });
  const textoEtiqueta = (
    <label htmlFor={id} className="campo__etiqueta">
      {etiqueta}
    </label>
  );
  return (
    <div className={casilla ? "campo campo--casilla" : "campo"}>
      {/* El {" "} separa la casilla de su etiqueta si la hoja de estilos no
          carga; con estilos, el hueco lo pone la grilla. */}
      {casilla ? (
        <>
          {controlUnido}{" "}
          {textoEtiqueta}
        </>
      ) : (
        textoEtiqueta
      )}
      {ayuda && (
        <p id={idAyuda} className="campo__ayuda">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="campo__error">
          <Icono de={CircleAlert} className="campo__error-icono" />
          {error}
        </p>
      )}
      {!casilla && controlUnido}
    </div>
  );
}
