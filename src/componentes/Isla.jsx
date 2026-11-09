import { createContext, useContext } from "react";
import { renderToString } from "react-dom/server";
import { islas } from "../islas/registro.js";

/* Islas: las unicas partes de una pagina que llevan JavaScript.

   Todo el sitio se convierte en HTML al compilar y llega al navegador sin
   React. Cuando una parte necesita interaccion de verdad (por ejemplo, el
   formulario del test automatico que va a hablar con el backend), se
   envuelve en <Isla>:

     <Isla nombre="Analizador" props={{ idioma: "es" }} />

   Que pasa entonces:
   1. Al compilar, el componente se dibuja igual que el resto, asi que su
      contenido inicial esta en el HTML aunque no cargue el JavaScript.
   2. La pagina, y solo esa pagina, carga /assets/cliente-*.js.
   3. En el navegador, src/cliente.jsx busca cada data-isla y la "hidrata":
      React toma ese HTML ya dibujado y le conecta los eventos.

   Las props tienen que poder pasarse a JSON (textos, numeros, listas,
   objetos simples): viajan escritas en el atributo data-props. Nada de
   funciones ni datos privados ahi, porque cualquiera las ve en el codigo
   fuente de la pagina. */

export const ContextoIslas = createContext(null);

export function Isla({ nombre, props = {}, como: Etiqueta = "div" }) {
  const usadas = useContext(ContextoIslas);
  const Componente = islas[nombre];
  if (!Componente) {
    throw new Error(`No existe la isla "${nombre}". Hay que registrarla en src/islas/registro.js`);
  }
  if (usadas) usadas.add(nombre);
  // renderToString, y no el render del resto de la pagina, porque deja las
  // marcas que React necesita para hidratar este pedazo sin redibujarlo.
  const html = renderToString(<Componente {...props} />);
  return <Etiqueta data-isla={nombre} data-props={JSON.stringify(props)} dangerouslySetInnerHTML={{ __html: html }} />;
}
