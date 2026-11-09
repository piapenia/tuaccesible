/* Que una compilacion no salga con la politica de seguridad aflojada sin
   que nadie se entere.

   La compilacion corre en modo produccion, y en ese modo Vite lee
   VITE_API_URL de .env, .env.local, .env.production, .env.production.local
   o de una variable de la terminal. Si esa direccion es la de un backend en
   esta computadora (http://localhost:3000), la politica de seguridad suma
   ese origen a connect-src y deja de pedir https para todo (ver
   src/seguridad.js). Eso esta bien para probar lo compilado con
   "npm run preview", pero no para publicarlo.

   Por eso:
     - En una computadora, la compilacion sale igual y avisa de donde vino
       la direccion.
     - En GitHub Actions (variable CI), se corta: el sitio publicado solo
       puede hablar con un backend por https.

   .env.development y .env.development.local no cuentan: solo los lee
   "npm run dev". Son el lugar para el puerto del backend mientras se
   trabaja. */

import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";

// De menor a mayor prioridad, como los lee Vite en modo produccion.
const ARCHIVOS = [".env", ".env.local", ".env.production", ".env.production.local"];

function deDondeViene(raiz) {
  if (process.env.VITE_API_URL !== undefined) return "una variable de la terminal";
  const conValor = ARCHIVOS.filter((archivo) => {
    const ruta = path.join(raiz, archivo);
    return fs.existsSync(ruta) && /^\s*(export\s+)?VITE_API_URL\s*=/m.test(fs.readFileSync(ruta, "utf8"));
  });
  return conValor.at(-1) ?? "un archivo .env";
}

function enIntegracionContinua() {
  const ci = process.env.CI;
  return Boolean(ci) && ci !== "false" && ci !== "0";
}

/* Devuelve un aviso para la terminal, o null si no hay backend configurado.
   Lanza un Error si la compilacion no tiene que seguir. */
export function revisarBackend(raiz, { enCI = enIntegracionContinua() } = {}) {
  const valor = loadEnv("production", raiz, "VITE_").VITE_API_URL;
  if (!valor) return null;

  let url;
  try {
    url = new URL(valor);
  } catch {
    // src/configuracion.js ya corta la compilacion con un mensaje claro.
    return null;
  }

  const fuente = deDondeViene(raiz);
  if (url.protocol === "https:") {
    return `La politica de seguridad deja conectarse al backend ${url.origin} (VITE_API_URL, de ${fuente}).`;
  }
  if (enCI) {
    throw new Error(
      `VITE_API_URL vale ${valor} (de ${fuente}). El sitio publicado solo puede hablar con un backend por https, ` +
        "y con esta direccion su politica de seguridad quedaria aflojada. Cambiala por la direccion https del backend o quitala."
    );
  }
  // El mismo criterio que esOrigenLocal en src/configuracion.js, que no se
  // puede importar aca porque lee import.meta.env, que solo existe en Vite.
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const efecto = local
    ? "deja conectarse a ese backend por http y no pide https para todo"
    : "deja conectarse a ese backend por http";
  return (
    `Atencion: esta compilacion es solo para probar en esta computadora. VITE_API_URL vale ${valor} (de ${fuente}), ` +
    `asi que la politica de seguridad ${efecto}. No la publiques a mano. ` +
    "Si esa direccion era para npm run dev, pasala a .env.development.local, que la compilacion no lee."
  );
}
