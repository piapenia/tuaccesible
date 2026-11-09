# Contrato entre el sitio y el backend del servicio de testing

Propuesta para la reunión del sábado. El backend lo decide Fafa: si algo de esto no le sirve, se cambia aquí y en `src/api/` en el mismo pull request, para que el documento y el código digan siempre lo mismo.

Hoy no hay ninguna pantalla que use la API. Lo que ya existe del lado del sitio es el cliente en `src/api/`, con sus pruebas (`npm test`), listo para la primera isla que lo necesite.

## Quién corre dónde

- El sitio (este repositorio): `http://localhost:5173` con `npm run dev`, y `http://localhost:8080` la versión compilada con `npm run preview`. Publicado, `https://tuaccesible.com`.
- El backend (repositorio de Fafa): `http://localhost:3000` en local. Todavía no tiene dirección pública.
- El sitio encuentra al backend por la variable `VITE_API_URL`. En desarrollo ya vale `http://localhost:3000` (archivo `.env.development`). En la compilación publicada no existe: el sitio no intenta conectarse a nada y la política de seguridad queda igual que siempre.

## CORS

El navegador solo deja que una página de `localhost:5173` lea respuestas de `localhost:3000` si el backend lo autoriza. Propuesta para el backend:

- Orígenes permitidos en su `.env`: `CORS_ORIGIN=http://localhost:5173,http://localhost:8080`. Al publicar, se suma `https://tuaccesible.com`.
- Sin credenciales. El sitio manda todos los pedidos con `credentials: "omit"`, porque el servicio no tiene usuarios ni cookies. No hace falta `credentials: true` en `cors`.
- Métodos `GET`, `POST` y `PATCH`. Antes de un `POST` o un `PATCH` con JSON el navegador hace una consulta previa (`OPTIONS`); el paquete `cors` la contesta solo si va con `app.use` antes de las rutas.

Un ejemplo de referencia, no una obligación:

```js
const origenes = process.env.CORS_ORIGIN.split(",").map((origen) => origen.trim());
app.use(cors({ origin: origenes, methods: ["GET", "POST", "PATCH"] }));
```

## Los tres pedidos

Todo va y vuelve en JSON. Los campos se llaman igual que las columnas de la tabla `sessions`, en snake_case, para no traducir nada entre el sitio, el backend y la base.

### `GET /api/health`

Sirve para saber si el servicio está andando antes de mostrar el formulario.

Respuesta `200`:

```json
{ "status": "ok" }
```

Cualquier otra respuesta, o ninguna, y el sitio muestra el servicio como no disponible.

### `POST /api/sessions`

Crea la sesión cuando la persona envía la dirección de su sitio.

Pedido (la dirección ya llega limpia desde el sitio, ver "Validación"):

```json
{ "analyzed_url": "https://misitio.com/tienda" }
```

Respuesta `201`, con la sesión completa:

```json
{
  "id": "7f3c2a9e-1b4d-4c8e-9a2f-5d6e7f8a9b0c",
  "analyzed_url": "https://misitio.com/tienda",
  "score": null,
  "comment": null,
  "meeting_requested": false,
  "created_at": "2026-11-09T15:04:05.000Z"
}
```

El sitio guarda ese `id` en memoria, mientras la página está abierta, para mandar después el puntaje. Si el `id` no tiene forma de UUID, el sitio lo trata como un error del contrato.

### `PATCH /api/sessions/:id`

Guarda el puntaje, el comentario o el pedido de reunión. Se manda uno o más de estos campos:

```json
{ "score": 9, "comment": "Muy claro el informe", "meeting_requested": true }
```

Respuesta `200` con la sesión completa actualizada, igual que la de arriba. También sirve `204` sin cuerpo. Si el `id` no existe, `404`.

### Lo que no hay, a propósito

No hay pedido para listar sesiones ni para leer una por su `id`. Nadie desde afuera tiene por qué verlas. Las métricas del proyecto se consultan directamente en la base.

## Formato de error

El cuerpo de un error es un objeto con un código:

```json
{ "error": "puntaje-invalido" }
```

| Estado | Cuándo | Códigos |
| --- | --- | --- |
| 400 | Un dato no pasa la validación | `url-invalida`, `puntaje-invalido`, `comentario-invalido`, `id-invalido`, `datos-invalidos` |
| 404 | La sesión no existe | sin cuerpo |
| 429 | Demasiados pedidos seguidos | sin cuerpo |
| 500 | Falla del servidor | sin cuerpo; el detalle va al log del servidor, nunca a la respuesta |

El sitio nunca muestra lo que dice el servidor: mira el código y escribe su propio mensaje, en español o en inglés. Además hay cuatro códigos que no manda el backend sino que produce el propio navegador: `no-configurado` (el sitio se compiló sin `VITE_API_URL`), `sin-conexion` (backend apagado o CORS que no deja pasar), `tiempo-agotado` (más de 10 segundos sin respuesta) y `respuesta-invalida` (contestó algo que no es lo de este contrato). La lista completa está en `src/api/errores.js`.

## Validación

Se valida en las dos puntas. El sitio lo hace para contestar enseguida y para que ningún dato de más salga de la computadora de la persona. El backend lo vuelve a hacer porque a la API le puede escribir cualquiera, no solo este sitio.

- `analyzed_url`: solo `http` o `https`, con dominio (se acepta `localhost` para pruebas), sin usuario ni contraseña, sin query ni fragmento, hasta 2048 caracteres una vez limpia. Si la persona escribe `misitio.com`, el sitio manda `https://misitio.com/`.
- `score`: entero de 1 a 10. Queda `null` hasta que la persona puntúa.
- `comment`: opcional, hasta 1000 caracteres, contados como los cuenta `char_length` de PostgreSQL. El sitio quita los espacios de las puntas y los caracteres de control; un comentario vacío se manda como `null`.
- `meeting_requested`: `true` o `false`.
- Un campo que no está en esta lista es `datos-invalidos`. No se ignora, así un nombre mal escrito salta enseguida.
- `id`: UUID.

## Privacidad

- La tabla guarda solo sus seis columnas. Ni correos, ni nombres, ni IP, ni navegador.
- La dirección se guarda sin la query ni el fragmento, porque ahí suelen viajar correos, tokens y códigos de acceso (`?email=...`, `#access_token=...`). El sitio ya la manda limpia; el backend la limpia otra vez antes de guardarla.
- Los logs del servidor no guardan IP. Si se usa `morgan`, con el formato `dev` o uno propio sin `:remote-addr`.
- Cuando el servicio se publique, la política de privacidad del sitio tiene que contar qué se guarda y para qué.

## Tabla de referencia

Para PostgreSQL 13 o posterior, donde `gen_random_uuid()` ya viene incluido:

```sql
CREATE TABLE sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analyzed_url      TEXT NOT NULL CHECK (analyzed_url ~ '^https?://' AND char_length(analyzed_url) <= 2048),
  score             SMALLINT CHECK (score BETWEEN 1 AND 10),
  comment           TEXT CHECK (char_length(comment) <= 1000),
  meeting_requested BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

UUID y no `SERIAL`: el sitio guarda el `id` para actualizar la sesión después, y con un número correlativo cualquiera podría probar 1, 2, 3 y pisar la sesión de otra persona. Un `CHECK` deja pasar `NULL`, por eso `score` y `comment` pueden quedar vacíos sin regla aparte.

## Levantar los dos en local

1. El backend, como diga el README de su repositorio. Tiene que quedar en `http://localhost:3000` y con `CORS_ORIGIN` como arriba. Para comprobarlo: `curl http://localhost:3000/api/health`.
2. El sitio, en este repositorio: `npm run dev` y abrir `http://localhost:5173/`. No hace falta configurar nada más.
3. Si el backend corre en otro puerto, no cambies `.env.development`: crea `.env.development.local` (no se sube a GitHub) con, por ejemplo, `VITE_API_URL=http://localhost:3001`.

Para probar la versión compilada contra el backend local, la variable se pone antes de compilar. En macOS o Linux:

```bash
VITE_API_URL=http://localhost:3000 npm run build
npm run preview
```

En PowerShell:

```powershell
$env:VITE_API_URL="http://localhost:3000"; npm run build; npm run preview
```

En el Símbolo del sistema (cmd):

```bat
set VITE_API_URL=http://localhost:3000
npm run build
npm run preview
```

En PowerShell y en cmd la variable queda puesta hasta que cierres esa terminal: una compilación posterior en la misma ventana también la llevaría. No afecta al sitio publicado, que compila GitHub Actions sin esa variable.

## Preguntas abiertas

1. ¿`score` es la nota de 1 a 10 que pone la persona al final, o el puntaje de accesibilidad de su sitio? Este contrato supone lo primero.
2. ¿En qué momento se crea la fila? La propuesta es al enviar la dirección, así se cuentan también los análisis que no terminan en puntaje.
3. ¿Alcanzan 1000 caracteres de comentario?
4. ¿Cuántos análisis por hora se permiten desde una misma conexión? Se puede limitar contando en memoria, sin guardar la IP.
5. El análisis con axe y la entrevista con el LLM no están en este contrato. Cuando se definan, se suman aquí como pedidos nuevos.
