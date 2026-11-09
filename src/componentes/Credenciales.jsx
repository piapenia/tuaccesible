/* Franja de credenciales: una fila de datos cortos y comprobables, al pie
   de la primera franja de la portada.

     <Credenciales>
       <Credencial valor="Desde 2021">auditando sitios, apps, documentos y software</Credencial>
       <Credencial valor="IAAP">A11Y Development Knowledge Badge, 2026</Credencial>
     </Credenciales>

   Es una lista (<ul>), con role="list" por el mismo motivo que Tarjetas:
   Safari y VoiceOver le quitan la semantica a una lista sin vinetas. El
   lector de pantalla dice "lista, 4 elementos" y lee cada dato entero.

   El valor va arriba, en la letra de los titulos, y la explicacion abajo.
   No es un titulo (no lleva <hN>): son datos, no secciones. Solo datos que
   se puedan verificar en /equipo/; nada de logos ni de sellos. */
export function Credenciales({ children }) {
  return (
    <ul className="credenciales" role="list">
      {children}
    </ul>
  );
}

export function Credencial({ valor, children }) {
  if (!valor) {
    throw new Error("Credencial: falta valor");
  }
  return (
    <li className="credencial">
      <span className="credencial__valor">{valor}</span>{" "}
      <span className="credencial__texto">{children}</span>
    </li>
  );
}
