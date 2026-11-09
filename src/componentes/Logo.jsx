/* Simbolo de tuaccesible: la "a" geometrica sobre su subrayado.
   Es decorativo, la marca legible es el texto que va al lado, asi que
   va con aria-hidden y sin titulo: si no, el lector de pantalla diria
   dos veces lo mismo al entrar a cada pagina. */
export function Logo() {
  return (
    <svg className="logo-symbol" viewBox="0 0 64 64" role="presentation" aria-hidden="true" focusable="false">
      <g className="logo-letter" fill="none" strokeWidth="7" strokeLinecap="butt">
        <circle cx="32" cy="25.5" r="14"></circle>
        <path d="M46 8 V43"></path>
      </g>
      <rect className="logo-rule" x="8" y="49" width="48" height="7" rx="3.5"></rect>
    </svg>
  );
}
