# tuaccesible.com

Código del sitio [tuaccesible.com](https://tuaccesible.com). Está hecho con [Eleventy](https://www.11ty.dev/): las páginas viven en `src/` como plantillas Nunjucks (`.njk`) y Eleventy las convierte en HTML dentro de `_site/`.

## Qué necesitas

- Git.
- Node.js 20 o posterior. Sirve la versión LTS que ofrece [nodejs.org](https://nodejs.org/). Para saber cuál tienes, escribe `node --version` en la terminal.

## Levantar el sitio en tu equipo

1. Clona el repositorio y entra en la carpeta:

   ```bash
   git clone https://github.com/piapenia/tuaccesible.git
   cd tuaccesible
   ```

2. Instala las dependencias. `npm ci` instala exactamente las versiones de `package-lock.json`, así todo el equipo trabaja con lo mismo:

   ```bash
   npm ci
   ```

3. Levanta el servidor local:

   ```bash
   npm run serve
   ```

4. Abre en el navegador la dirección que aparece en la terminal, en la línea `Server at`. Normalmente es `http://localhost:8080/`, pero si ese puerto está ocupado, Eleventy usa solo el siguiente libre (8081, 8082...), así que conviene mirar esa línea.

Cada vez que guardas un archivo de `src/`, la página se actualiza sola. Para apagar el servidor, pulsa Ctrl+C en la terminal.

## Si algo falla

### La instalación tarda mucho o falla al descargar Chrome

`npm ci` descarga dos navegadores Chrome, unos 680 MB, que solo usa el control de accesibilidad (`pa11y-ci`). Para editar y ver el sitio no hacen falta. Para instalar sin ellos, borra la carpeta `node_modules` si quedó a medias y vuelve a instalar así:

- En PowerShell:

  ```powershell
  $env:PUPPETEER_SKIP_DOWNLOAD="true"; npm ci
  ```

- En el Símbolo del sistema (cmd), en dos líneas:

  ```bat
  set PUPPETEER_SKIP_DOWNLOAD=true
  npm ci
  ```

- En macOS o Linux:

  ```bash
  PUPPETEER_SKIP_DOWNLOAD=true npm ci
  ```

### PowerShell dice que la ejecución de scripts está deshabilitada

El mensaje es del tipo "No se puede cargar el archivo C:\Program Files\nodejs\npm.ps1 porque la ejecución de scripts está deshabilitada en este sistema". Escribe `npm.cmd` en lugar de `npm` (por ejemplo `npm.cmd ci` y `npm.cmd run serve`), o usa el Símbolo del sistema en vez de PowerShell.

### npm avisa de la versión de Node

Si aparece `EBADENGINE` o `Unsupported engine`, tu Node es anterior a la 20. Instala la versión LTS de nodejs.org y vuelve a empezar desde `npm ci`.

### La página se ve sin estilos

No abras los archivos `.html` con doble clic. Las rutas del sitio empiezan en la raíz (`/css/global.css`) y solo funcionan cuando un servidor las sirve. Usa `npm run serve` y la dirección `http://localhost`.

## Otros comandos

- `npm run build` compila el sitio en `_site/` sin levantar servidor.
- `npm run verificar:contraste` corre el mismo control de contraste que se hace antes de publicar: lee los colores de `src/css/global.css` y falla si algún par queda por debajo del mínimo.
- `npm run generar:og` regenera las dos tarjetas para redes sociales. Solo hace falta si cambian el lema o el logotipo, y necesita la fuente Century Gothic instalada.

Para correr el control de accesibilidad igual que antes de publicar, hace falta haber instalado Chrome (sin `PUPPETEER_SKIP_DOWNLOAD`) y tener libre el puerto 8080. Primero compila y sirve lo compilado:

```bash
npx eleventy
npx http-server _site -p 8080
```

Y en otra terminal, dentro de la misma carpeta:

```bash
npx pa11y-ci
```

## Cómo se publica

Cada push a la rama `master` dispara `.github/workflows/deploy.yml`: compila el sitio, corre el control de contraste y el de accesibilidad (`pa11y-ci` con WCAG 2 nivel AAA) y, si los dos pasan, lo publica en tuaccesible.com. Si alguno falla, no se publica nada. Para proponer un cambio sin publicarlo, trabaja en una rama propia y abre un pull request.

## Antes de tocar ciertas cosas

- Colores, logotipo o tipografía: lee `MARCA.md`.
- Scripts, formularios o servicios externos: lee `SEGURIDAD.md` y el comentario de la política de seguridad de contenido en `src/_includes/base.njk`. Cualquier script nuevo tiene que vivir en `src/js/`, porque la política no deja cargar scripts de otros dominios.
- Con `npm run serve`, esa política es un poco más abierta que en el sitio publicado, para que funcionen la recarga automática y Safari en `localhost`. El sitio publicado no cambia: el despliegue compila sin servidor (`npx @11ty/eleventy`, lo mismo que `npm run build`), y ahí esa excepción no se aplica.
