/* Configuracion que cambia segun donde corre el sitio.

   VITE_API_URL es la direccion del backend (el servicio de testing que
   programa Fafa). Vite la lee de los archivos .env:
     - .env.development, que esta en el repositorio, la fija en
       http://localhost:3000 para "npm run dev".
     - En la compilacion de produccion no hay ninguna todavia, porque el
       backend no esta publicado. Sin direccion, la politica de seguridad
       queda igual que antes de la migracion y ninguna pagina intenta
       conectarse a nada.
   Cuando el backend tenga direccion publica, se agrega en .env.production
   (o como variable del flujo de GitHub Actions) y la politica de seguridad
   la suma sola a connect-src. */

function normalizarOrigen(valor) {
  if (!valor) return null;
  let url;
  try {
    url = new URL(valor);
  } catch {
    throw new Error(
      `VITE_API_URL no es una direccion valida: "${valor}". ` +
        "Tiene que ser algo como http://localhost:3000 o https://api.tuaccesible.com"
    );
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`VITE_API_URL tiene que empezar con http:// o https://, no con ${url.protocol}`);
  }
  return url.origin;
}

/* Origen del backend (protocolo, dominio y puerto, sin ruta), o null. */
export const origenApi = normalizarOrigen(import.meta.env.VITE_API_URL);

/* Direccion base para las llamadas, sin barra final, o null. */
export const urlApi = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, "")
  : null;

/* El backend corre en esta misma computadora (desarrollo o pruebas). */
export function esOrigenLocal(origen) {
  if (!origen) return false;
  const { hostname, protocol } = new URL(origen);
  return protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]");
}
