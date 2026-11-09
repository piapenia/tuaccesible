/* Seccion de pagina con el titulo a un costado, como en un informe impreso.

     <Seccion numero="01" titulo="Cuatro formas de empezar">
       <Tarjetas>...</Tarjetas>
     </Seccion>

   En pantalla ancha (desde 64rem) el titulo ocupa las primeras cuatro
   columnas de la grilla de doce y el contenido las ocho restantes. En el
   celular va todo en una columna, el titulo arriba. Arriba de cada seccion
   hay un filete fino y una barra corta terracota (src/estilos/componentes.css).

   - titulo: el texto del h2. La seccion lleva siempre su h2: es lo que
     NVDA usa para saltar de una a otra con la tecla H o con el 2.
   - numero: opcional, "01", "02"... Es decorativo y va con aria-hidden:
     el lector de pantalla ya dice "titulo nivel 2", y un "cero uno" antes
     de cada titulo solo alargaria la lectura. Por eso no puede llevar
     informacion que no este tambien en el titulo.
   - id: opcional, para enlazar a la seccion con #.

   El <section> no lleva aria-label ni aria-labelledby a proposito: con
   nombre, cada seccion se volveria una region en la lista de puntos de
   referencia de NVDA, y la portada pasaria a tener cinco regiones mas que
   no ayudan a orientarse. El titulo alcanza. */
export function Seccion({ numero, titulo, id, children }) {
  if (!titulo) {
    throw new Error("Seccion: falta titulo");
  }
  return (
    <section className="seccion" id={id}>
      <div className="seccion__cabeza">
        {numero && (
          <span className="seccion__numero" aria-hidden="true">
            {numero}
          </span>
        )}
        <h2 className="seccion__titulo">{titulo}</h2>
      </div>
      <div className="seccion__cuerpo">{children}</div>
    </section>
  );
}
