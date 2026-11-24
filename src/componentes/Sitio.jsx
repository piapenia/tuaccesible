import { Encabezado } from "./Encabezado.jsx";
import { PieDePagina } from "./PieDePagina.jsx";

/* Todo lo visible que comparten las paginas: cabecera (con la franja de
   atajos y el aviso de idioma adentro), contenido y pie. Nada queda fuera
   de esas tres regiones. El primer enlace de la cabecera es "Ir al
   contenido principal", asi que sigue siendo lo primero que alcanza el
   tabulador. El <head> no esta aca: lo arma src/documento.js, que tambien
   le pone al <body> el id="arriba" al que vuelve "Volver arriba". */
export function Sitio({ pagina, children }) {
  return (
    <>
      <Encabezado idioma={pagina.idioma} ruta={pagina.ruta} rutaAlternativa={pagina.rutaAlternativa} />
      <main id="contenido-principal">
        <div className="wrap">{children}</div>
      </main>
      <PieDePagina idioma={pagina.idioma} />
    </>
  );
}
