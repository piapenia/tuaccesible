/* Icono de Lucide, siempre decorativo.

   Los iconos se dibujan al compilar, como el resto de la pagina: quedan como
   <svg> en el HTML y no hace falta ningun script para verlos. Toman el color
   del texto que los rodea (currentColor), asi que siguen al modo oscuro, al
   alto contraste y al contraste forzado de Windows sin reglas propias.

   Van siempre con aria-hidden: el lector de pantalla no los anuncia, y por
   eso un icono nunca puede llevar el significado solo. Al lado de cada uno
   tiene que haber texto que diga lo mismo ("English", "Enviar", el titulo
   de la tarjeta). Si alguna vez hiciera falta un icono que se anuncie, no
   se usa este componente.

     import { Mail } from "lucide-react";
     <a href="mailto:...">  <Icono de={Mail} />  contacto@...</a>

   Ninguno de los clichés del sector: ni ojos, ni manos, ni sillas de
   ruedas, ni el icono "accessibility" de Lucide (ver MARCA.md). */
export function Icono({ de: Componente, className }) {
  if (!Componente) {
    throw new Error("Icono: falta de={...}, el icono de lucide-react que se dibuja");
  }
  return (
    <Componente
      aria-hidden="true"
      size="1em"
      strokeWidth={1.75}
      className={className ? `icono ${className}` : "icono"}
    />
  );
}
