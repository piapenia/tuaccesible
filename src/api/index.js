/* Cliente de la API ya configurado para este sitio: el que usan las islas.

     import { api, ErrorApi } from "../api/index.js";

   La direccion del backend sale de VITE_API_URL (ver src/configuracion.js).
   Sin esa variable, como en el sitio publicado de hoy, api.configurado es
   false, comprobarDisponibilidad() contesta
   { disponible: false, codigo: "no-configurado" } y ningun pedido sale del
   navegador. api.configurado vale lo mismo al compilar y en el navegador,
   asi que una isla puede usarlo para dibujar su aviso de "todavia no esta
   disponible" ya en el HTML, sin esperar al JavaScript.

   Las llamadas a la API van dentro de un useEffect o de un manejador de
   eventos (onSubmit, onClick), nunca mientras se dibuja el componente:
   cada isla tambien se dibuja al compilar, en Node, y ahi no tiene que
   salir ningun pedido. */

import { urlApi } from "../configuracion.js";
import { crearClienteApi } from "./crear-cliente.js";

export const api = crearClienteApi({ urlBase: urlApi });

export { ErrorApi, codigosDeError } from "./errores.js";
export { LARGO_MAXIMO_COMENTARIO, PUNTAJE_MAXIMO, PUNTAJE_MINIMO, limpiarUrl } from "./validacion.js";
