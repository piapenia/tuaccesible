/* Punto de entrada del JavaScript que llega al navegador.

   Solo lo cargan las paginas que tienen alguna <Isla> (ver
   src/componentes/Isla.jsx). Busca cada elemento marcado con data-isla y le
   conecta su componente de React sobre el HTML que ya vino compilado. */
import { hydrateRoot } from "react-dom/client";
import { islas } from "./islas/registro.js";

for (const elemento of document.querySelectorAll("[data-isla]")) {
  const nombre = elemento.dataset.isla;
  const Componente = islas[nombre];
  if (!Componente) {
    console.error(`tuaccesible: la isla "${nombre}" no esta en src/islas/registro.js`);
    continue;
  }
  const props = elemento.dataset.props ? JSON.parse(elemento.dataset.props) : {};
  // El mismo prefijo de useId con que se dibujo al compilar (ver
  // src/componentes/Isla.jsx): si no coincide, React no reconoce el HTML.
  hydrateRoot(elemento, <Componente {...props} />, { identifierPrefix: elemento.dataset.islaPrefijo });
}
