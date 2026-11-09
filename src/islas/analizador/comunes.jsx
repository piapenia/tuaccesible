import { useEffect, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { Icono } from "../../componentes/Icono.jsx";

/* Piezas que comparten los pasos del analizador. */

/* Mover el foco a un elemento cuando ya esta dibujado.

     const [ref, enfocar] = useFoco();
     setError("...");
     enfocar();   // el foco llega despues de que React dibuje el error

   Si el foco se moviera en el mismo momento del setState, el campo todavia
   no tendria su aria-describedby nuevo y el lector de pantalla leeria la
   version sin el error. Cada llamada cuenta, asi que el mismo error dos
   veces seguidas vuelve a mover el foco. */
export function useFoco() {
  const ref = useRef(null);
  const [pedidos, setPedidos] = useState(0);
  useEffect(() => {
    if (pedidos > 0) ref.current?.focus();
  }, [pedidos]);
  return [ref, () => setPedidos((n) => n + 1)];
}

/* Region de alerta para los errores que no son de un campo (sin conexion,
   el servidor fallo...). El contenedor con role="alert" esta siempre en la
   pagina, vacio, y el error se escribe adentro: asi NVDA lo anuncia al
   aparecer, sin mover el foco. Los errores de un campo no pasan por aca:
   van en el propio campo, y el foco va al campo.

   accion: opcional, un boton para resolverlo ("Volver a intentar"). */
export function Alerta({ texto, accion }) {
  return (
    <div role="alert" className="analizador__alerta">
      {texto && (
        <div className="aviso analizador__error">
          <Icono de={CircleAlert} className="aviso__icono" />
          <div className="analizador__error-cuerpo">
            <p className="aviso__texto">{texto}</p>
            {accion}
          </div>
        </div>
      )}
    </div>
  );
}

/* Region de estado: lo que pasa sin que la persona tenga que buscarlo
   ("Analizando...", "Anotamos tu pedido"). Se ve en la pagina donde ocurre
   y NVDA lo lee cuando termina de hablar, sin interrumpir. Vacia, no ocupa
   lugar. */
export function Estado({ children }) {
  return (
    <p role="status" className="analizador__estado">
      {children}
    </p>
  );
}

/* La respuesta del asistente llega como texto, con parrafos separados por
   una linea en blanco. Se dibuja como texto (React lo escapa), nunca como
   HTML. */
export function parrafos(texto) {
  return texto
    .split(/\n{2,}/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean);
}
