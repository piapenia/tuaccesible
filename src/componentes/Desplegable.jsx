/* Bloque que se abre y se cierra: un <details> nativo con su <summary>.

   Es el elemento del navegador, y no un boton con JavaScript, a proposito:
   el contenido esta en el HTML aunque no corra ningun script, y el propio
   navegador le anuncia al lector de pantalla si el bloque esta abierto o
   cerrado, sin aria-expanded que mantener a mano. Los estilos estan en
   public/css/global.css, que explica tambien por que no usan contenido
   generado por CSS: algunos lectores de pantalla lo leen en voz alta.

     <Desplegable resumen="What the site audit includes">
       <ul>...</ul>
       <p>...</p>
     </Desplegable>

   resumen es el texto que se ve siempre y que abre o cierra el bloque. Lo
   de adentro va dentro de un <div> porque el CSS le pone el relleno
   interior a "details > div": sin ese <div>, el texto quedaria pegado al
   borde. */
export function Desplegable({ resumen, children }) {
  return (
    <details>
      <summary>{resumen}</summary>
      <div>{children}</div>
    </details>
  );
}
