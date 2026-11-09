import { Info } from "lucide-react";
import { Icono } from "./Icono.jsx";

/* Aviso: un recuadro para un dato que la persona no deberia pasar por alto
   ("Todavia no hay resenas publicadas").

     <Aviso><strong>Todavia no hay resenas publicadas.</strong> Las resenas...</Aviso>

   Es texto en un parrafo, sin rol de alerta: esta en la pagina desde que
   carga, y role="alert" o aria-live solo sirven para lo que aparece
   despues. Lo que lo distingue a la vista (el icono, el filete terracota)
   es decorativo; si lo importante tiene que destacarse para el lector de
   pantalla, va en <strong>, como en el ejemplo. */
export function Aviso({ children }) {
  return (
    <div className="aviso">
      <Icono de={Info} className="aviso__icono" />
      <p className="aviso__texto">{children}</p>
    </div>
  );
}
