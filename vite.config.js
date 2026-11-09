/* Configuracion de Vite.
   Casi todo lo decide scripts/construir.js (compilacion) y
   scripts/desarrollo.js (servidor local); aca queda lo que comparten.
   No hace falta el plugin de React: Vite ya convierte JSX por su cuenta, y
   el plugin solo agrega la recarga en caliente de componentes, que mete un
   script en linea que la politica de seguridad del sitio no deja correr.
   El de Tailwind compila src/estilos/sitio.css, la hoja que enlazan todas
   las paginas (ver ese archivo). */
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  appType: "custom",
  publicDir: "public",
  plugins: [tailwindcss()],
});
