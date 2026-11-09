import { Icono } from "./Icono.jsx";

/* Boton del sitio, en dos variantes.

   Con href dibuja un enlace con aspecto de boton, que es lo que hace falta
   casi siempre: "Escribir a tuaccesible" lleva a otra pagina, asi que es un
   enlace, y el lector de pantalla lo anuncia como enlace. Sin href dibuja
   un <button> de verdad, para enviar un formulario o para lo que haga un
   script.

     <Boton href="/contacto/">Escribir a tuaccesible</Boton>
     <Boton href="/servicios/" variante="secundario">Ver servicios</Boton>
     <Boton tipo="submit">Enviar</Boton>

   - variante: "primario" (fondo petroleo, el que se elige primero) o
     "secundario" (solo borde). Uno primario por bloque, como mucho.
   - icono: opcional, un icono de lucide-react que va despues del texto. Es
     decorativo (ver Icono.jsx): el texto del boton tiene que decirlo todo.
   - chico: version de letra chica, para el aviso de idioma. Mantiene el
     alto minimo de 44 px.
   - Lo demas (id, lang...) pasa tal cual al elemento.

   Alto minimo de 2.75rem (44 px), que es el tamano de objetivo que pide el
   criterio 2.5.5 (AAA). El texto no va subrayado en reposo, porque el borde
   y el fondo ya lo distinguen del texto que lo rodea; el subrayado vuelve
   al pasar el mouse. Los estilos estan en src/estilos/componentes.css. */
const variantes = ["primario", "secundario"];

export function Boton({ href, variante = "primario", tipo = "button", icono, chico, className, children, ...resto }) {
  if (!variantes.includes(variante)) {
    throw new Error(`Boton: variante tiene que ser "primario" o "secundario", no "${variante}"`);
  }
  const clases = ["boton", `boton--${variante}`, chico && "boton--chico", className].filter(Boolean).join(" ");
  const contenido = (
    <>
      {children}
      {icono && <Icono de={icono} className="boton__icono" />}
    </>
  );
  if (href) {
    return (
      <a href={href} className={clases} {...resto}>
        {contenido}
      </a>
    );
  }
  return (
    <button type={tipo} className={clases} {...resto}>
      {contenido}
    </button>
  );
}
