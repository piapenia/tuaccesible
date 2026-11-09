import { ArrowRight } from "lucide-react";
import { Icono } from "./Icono.jsx";

/* Grilla de tarjetas: una lista, con una tarjeta por elemento.

   Es una lista (<ul>) porque eso es: cuatro servicios del mismo tipo. El
   lector de pantalla dice "lista, 4 elementos" y la persona sabe cuanto
   hay antes de recorrerla. role="list" no sobra: Safari y VoiceOver le
   quitan la semantica de lista a un <ul> sin vinetas, y con el rol la
   recupera.

     import { Zap } from "lucide-react";
     <Tarjetas>
       <Tarjeta titulo="Auditoria expres" href="/servicios/#auditoria-expres" icono={Zap}>
         Un diagnostico rapido y priorizado...
       </Tarjeta>
     </Tarjetas>

   Toda la tarjeta se puede cliquear, pero el enlace es uno solo y esta en
   el titulo: un ::after del enlace se estira sobre la tarjeta entera
   (src/estilos/componentes.css). Asi el lector de pantalla anuncia un
   enlace con el nombre del servicio, y no un enlace con todo el texto de
   la tarjeta adentro, que es lo que pasa si se envuelve la tarjeta en <a>.
   El foco se dibuja alrededor de la tarjeta, en ese mismo ::after.

   - titulo y href: el texto y el destino del enlace.
   - icono: opcional, decorativo (ver Icono.jsx).
   - nivel: el nivel del titulo, 3 por defecto. Tiene que seguir al titulo
     de la seccion donde esta la grilla. */
export function Tarjetas({ children }) {
  return (
    <ul className="tarjetas" role="list">
      {children}
    </ul>
  );
}

export function Tarjeta({ titulo, href, icono, nivel = 3, children }) {
  if (!titulo || !href) {
    throw new Error("Tarjeta: faltan titulo o href");
  }
  const Titulo = `h${nivel}`;
  return (
    <li className="tarjeta">
      {icono && (
        <span className="tarjeta__icono">
          <Icono de={icono} />
        </span>
      )}
      <Titulo className="tarjeta__titulo">
        <a href={href}>
          {titulo}
          <Icono de={ArrowRight} className="tarjeta__flecha" />
        </a>
      </Titulo>
      <p className="tarjeta__texto">{children}</p>
    </li>
  );
}
