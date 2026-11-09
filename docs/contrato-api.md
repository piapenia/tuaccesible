# Contrato entre el sitio y el backend del servicio de testing

Propuesta para la reunión del sábado. El backend lo decide Fafa: si algo de esto no le sirve, se cambia aquí y en `src/api/` en el mismo pull request, para que el documento y el código digan siempre lo mismo.

La pantalla que usa la API es la del servicio, en `/analizar/` y `/en/analyze/`. Está publicada sin enlace desde el menú y, mientras el sitio se compile sin `VITE_API_URL` (como hoy en GitHub Pages), solo dice que el servicio está en preparación. Del lado del sitio están el cliente en `src/api/`, con sus pruebas (`npm test`), y la isla en `src/islas/analizador/`. Para probar el recorrido completo sin el backend real hay un backend simulado: ver "Levantar los dos en local".

Los tres primeros pedidos son los acordados. Los del análisis, la entrevista y el informe son una propuesta, en su propia sección más abajo.

## Quién corre dónde

- El sitio (este repositorio): `http://localhost:5173` con `npm run dev`, y `http://localhost:8080` la versión compilada con `npm run preview`. Publicado, `https://tuaccesible.com`.
- El backend (repositorio de Fafa): `http://localhost:3000` en local. Todavía no tiene dirección pública.
- El sitio encuentra al backend por la variable `VITE_API_URL`. En desarrollo ya vale `http://localhost:3000` (archivo `.env.development`). En la compilación publicada no existe: el sitio no intenta conectarse a nada y la política de seguridad queda igual que siempre.

## CORS

El navegador solo deja que una página de `localhost:5173` lea respuestas de `localhost:3000` si el backend lo autoriza. Propuesta para el backend:

- Orígenes permitidos en su `.env`: `CORS_ORIGIN=http://localhost:5173,http://localhost:8080`. Al publicar, se suma `https://tuaccesible.com`. El origen incluye el puerto: si el 5173 está ocupado, `npm run dev` abre el sitio en el 5174, y desde ahí el backend no contesta. El servidor de desarrollo lo avisa en la terminal con las dos salidas posibles: liberar el 5173 o sumar `http://localhost:5174` a `CORS_ORIGIN`.
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

## Propuesta: análisis, entrevista e informe

Esto todavía no está acordado. Es lo que necesita la pantalla del servicio para hacer el recorrido completo del proyecto (dirección, análisis con axe, entrevista, informe, reunión y opinión), escrito para que Fafa lo acepte, lo cambie o lo rechace. El sitio ya lo usa contra el backend simulado; si el backend real lo hace distinto, se cambia aquí, en `src/api/` y en `tools/backend-simulado.js`, en el mismo pull request.

Los tres pedidos llevan `language`, que es `"es"` o `"en"`: el idioma de la página desde la que se usa el servicio. axe-core trae su traducción al español (`axe-core/locales/es.json`), y el LLM contesta en ese idioma.

### `POST /api/sessions/:id/analysis`

Corre axe-core sobre la `analyzed_url` de esa sesión, en un navegador sin ventana (Puppeteer o Playwright), y devuelve un resumen. Se analiza esa página sola, no el sitio entero.

Pedido:

```json
{ "language": "es" }
```

Respuesta `200`:

```json
{
  "analyzed_url": "https://misitio.com/tienda",
  "analyzed_at": "2026-11-09T15:04:20.000Z",
  "violations": [
    {
      "rule_id": "image-alt",
      "impact": "critical",
      "help": "Las imágenes deben tener texto alternativo",
      "wcag": ["1.1.1"],
      "nodes": 3,
      "examples": ["img.logo", "#galeria > img:nth-child(2)"]
    }
  ],
  "passes": 38,
  "incomplete": 3
}
```

- `violations`: una entrada por cada regla de axe que falló.
  - `rule_id`: el id de la regla en axe.
  - `impact`: `minor`, `moderate`, `serious` o `critical`, como lo da axe.
  - `help`: la descripción corta de la regla, en el idioma pedido. El sitio la muestra como texto, nunca como HTML.
  - `wcag`: los criterios WCAG de la regla, sacados de sus etiquetas (`wcag111` pasa a `"1.1.1"`). Va vacío si la regla es una buena práctica y no un criterio.
  - `nodes`: cuántos elementos fallan.
  - `examples`: hasta 3 selectores CSS de esos elementos (el `target` de axe).
- `passes`: cuántas reglas pasaron.
- `incomplete`: cuántas reglas axe no pudo decidir solo y necesitan que una persona las revise.

El sitio comprueba la forma de la respuesta y la trata como `respuesta-invalida` si no cumple: hasta 100 reglas, textos de hasta 500 caracteres, hasta 5 ejemplos por regla.

El análisis tarda: el sitio espera hasta 60 segundos. Conviene que el backend corte antes, por ejemplo a los 45, y conteste `sitio-inaccesible`.

Errores: `404` si la sesión no existe. `422` con `{ "error": "sitio-inaccesible" }` si no se pudo abrir la página: no existe, no contesta, tarda demasiado o es una dirección que el backend no analiza.

**Seguridad.** El backend abre en su propio servidor una dirección que escribe cualquiera. Antes de abrirla tiene que rechazar las que apuntan a una red interna: `localhost`, `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16` (ahí está la dirección de metadatos de los proveedores de nube), `::1`, `fc00::/7` y `fe80::/10`. Se comprueba la IP a la que resuelve el dominio, no solo el texto, y otra vez en cada redirección. Si no, cualquiera puede usar el servicio para mirar adentro del servidor (el ataque se llama SSRF). Para probar en local se puede permitir con una variable de entorno que en producción no existe.

### `POST /api/sessions/:id/interview`

Un turno de la entrevista con el LLM. El backend ya tiene el análisis de la sesión y la conversación hasta ese momento, así que el sitio manda solo el mensaje nuevo.

Para empezar, `message` va en `null` y el LLM abre la entrevista:

```json
{ "language": "es", "message": null }
```

Después, cada respuesta de la persona:

```json
{ "language": "es", "message": "Sí, tiene un formulario de contacto." }
```

Respuesta `200`:

```json
{ "reply": "Encontré tres imágenes sin texto alternativo...", "finished": false }
```

- `reply`: lo que escribe el LLM, hasta 4000 caracteres, en texto plano. Los párrafos se separan con una línea en blanco. Sin Markdown ni HTML: el sitio lo muestra tal cual, como texto.
- `finished`: `true` cuando el LLM ya no tiene más preguntas. La persona igual puede pasar al informe cuando quiera, y también seguir escribiendo hasta el límite.

`message`: hasta 1000 caracteres, sin caracteres de control. Si no, `400` con `mensaje-invalido`. Hasta 10 mensajes de la persona por sesión; el siguiente recibe `429`. `404` si la sesión no existe o su análisis ya venció.

Lo que tiene que hacer la entrevista, según el proyecto: explicar los resultados en lenguaje claro y advertir los posibles falsos positivos. Para que no invente, el LLM recibe en su instrucción solo el resumen del análisis, y se le pide que diga cuándo algo no se puede saber sin una revisión manual. El mensaje de la persona va como mensaje de usuario, nunca pegado dentro de la instrucción del sistema: así un texto como "ignora tus instrucciones" no cambia lo que el LLM tiene que hacer.

### `GET /api/sessions/:id/report?language=es`

El informe en PDF. El sitio no lo pide con `fetch`: pone un enlace común a esta dirección, así la descarga la maneja el navegador y no hace falta CORS.

Respuesta `200` con `Content-Type: application/pdf` y `Content-Disposition: attachment; filename="informe-tuaccesible.pdf"`. `404` si la sesión no existe o su análisis ya venció.

Siendo un servicio de accesibilidad, el PDF tiene que ser accesible: etiquetado (PDF/UA si se puede), con título, idioma, encabezados y orden de lectura. Contenido propuesto: la dirección y la fecha, los problemas con sus criterios, lo que axe no pudo decidir, el resumen de la entrevista y la aclaración de que una prueba automática no encuentra todos los problemas.

### Qué guarda el backend y por cuánto

El análisis y la conversación no van a la base: quedan en la memoria del backend, unidos al `id` de la sesión, y se borran a la hora. La tabla `sessions` no cambia. Si el backend se reinicia, la persona vuelve a empezar. Si el LLM corre en el mismo servidor (Ollama, como dice el proyecto), la conversación tampoco sale hacia otra empresa.

### La reunión

No pasa por el backend. Cuando la persona pide una reunión, el sitio guarda `meeting_requested: true` con el `PATCH` de siempre y le muestra el enlace a la agenda externa, que se configura en `agenda` dentro de `src/sitio.js`. Los datos de la reserva los maneja ese servicio de agenda.

## Formato de error

El cuerpo de un error es un objeto con un código:

```json
{ "error": "puntaje-invalido" }
```

| Estado | Cuándo | Códigos |
| --- | --- | --- |
| 400 | Un dato no pasa la validación | `url-invalida`, `puntaje-invalido`, `comentario-invalido`, `mensaje-invalido`, `id-invalido`, `datos-invalidos` |
| 404 | La sesión no existe, o su análisis ya venció | sin cuerpo |
| 422 | No se pudo abrir la página para analizarla (propuesta) | `sitio-inaccesible` |
| 429 | Demasiados pedidos seguidos | sin cuerpo |
| 500 | Falla del servidor | sin cuerpo; el detalle va al log del servidor, nunca a la respuesta |

Ante un error, el sitio nunca muestra lo que dice el servidor: mira el código y escribe su propio mensaje, en español o en inglés. Además hay cuatro códigos que no manda el backend sino que produce el propio navegador: `no-configurado` (el sitio se compiló sin `VITE_API_URL`), `sin-conexion` (backend apagado o CORS que no deja pasar), `tiempo-agotado` (más de 10 segundos sin respuesta, o 60 en el análisis y la entrevista) y `respuesta-invalida` (contestó algo que no es lo de este contrato). La lista completa está en `src/api/errores.js`.

## Validación

Se valida en las dos puntas. El sitio lo hace para contestar enseguida y para que ningún dato de más salga de la computadora de la persona. El backend lo vuelve a hacer porque a la API le puede escribir cualquiera, no solo este sitio.

- `analyzed_url`: solo `http` o `https`, con dominio (se acepta `localhost` para pruebas), sin usuario ni contraseña, sin query ni fragmento, hasta 2048 caracteres una vez limpia. Si la persona escribe `misitio.com`, el sitio manda `https://misitio.com/`.
- `score`: entero de 1 a 10. Queda `null` hasta que la persona puntúa.
- `comment`: opcional, hasta 1000 caracteres, contados como los cuenta `char_length` de PostgreSQL. El sitio quita los espacios de las puntas y los caracteres de control; un comentario vacío se manda como `null`.
- `meeting_requested`: `true` o `false`.
- `language` (propuesta): `"es"` o `"en"`.
- `message` (propuesta): `null` para empezar la entrevista; si no, texto de hasta 1000 caracteres, limpio igual que `comment`, que no puede quedar vacío.
- Un campo que no está en esta lista es `datos-invalidos`. No se ignora, así un nombre mal escrito salta enseguida.
- `id`: UUID.

## Privacidad

- La tabla guarda solo sus seis columnas. Ni correos, ni nombres, ni IP, ni navegador.
- La dirección se guarda sin la query ni el fragmento, porque ahí suelen viajar correos, tokens y códigos de acceso (`?email=...`, `#access_token=...`). El sitio ya la manda limpia; el backend la limpia otra vez antes de guardarla.
- El análisis y la conversación de la entrevista no se guardan en la base: duran una hora en la memoria del backend (propuesta, ver arriba).
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

### Sin el backend de Fafa: el backend simulado

`npm run backend:simulado` levanta en `http://localhost:3000` un backend de mentira que cumple este contrato, incluida la propuesta: sesiones en memoria, un análisis de ejemplo con seis problemas, una entrevista de tres turnos con respuestas fijas y un PDF mínimo. No usa axe ni ningún LLM, ni abre la dirección que se escribe. Sirve para probar la pantalla del servicio y para que Fafa vea qué espera el sitio. Algunas direcciones dan un caso especial:

| Dirección | Qué pasa |
| --- | --- |
| `limpio.test` | El análisis no encuentra problemas. |
| `sinsitio.test` | El análisis contesta `422 sitio-inaccesible`. |
| `fallo.test` | El análisis contesta `500`. |
| `lento.test` | El análisis no contesta a tiempo: el sitio corta a los 60 segundos con `tiempo-agotado`. |

El puerto se cambia con la variable `PUERTO`. Se apaga con Ctrl+C.

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

Al terminar, la compilación avisa que es solo para probar en esta computadora, porque su política de seguridad deja conectarse al backend por http. Es lo esperado. Si el aviso sale sin que hayas puesto la variable, la dirección viene de un `.env.local` o un `.env.production.local`, y el aviso nombra el archivo: si era para `npm run dev`, pasa esa línea a `.env.development.local`. En GitHub Actions, una dirección que no sea https corta el despliegue.

## Preguntas abiertas

1. Respondida: `score` es la nota de 1 a 10 que la persona le pone al servicio al final, como dice el proyecto, y no un puntaje de accesibilidad de su sitio.
2. ¿En qué momento se crea la fila? La propuesta es al enviar la dirección, así se cuentan también los análisis que no terminan en puntaje.
3. ¿Alcanzan 1000 caracteres de comentario?
4. ¿Cuántos análisis por hora se permiten desde una misma conexión? Se puede limitar contando en memoria, sin guardar la IP.
5. El análisis, la entrevista y el informe tienen una propuesta en este documento. Falta que Fafa la acepte o la cambie.
6. ¿Qué servicio de agenda se usa para las reuniones? Hace falta una cuenta de tuaccesible. Hasta que exista, la pantalla dice que la agenda todavía no está conectada y ofrece la página de contacto.
