# Marca de tuaccesible

Documento de trabajo para quien toque el diseño del sitio o prepare piezas
gráficas. No se publica: vive en la raíz del repositorio, fuera de `src/`.

## La idea

El nombre se lee en dos partes, "tu" y "accesible". La marca usa dos recursos
y no más: **la letra a geométrica** y **el subrayado**.

El subrayado no es decoración. Es el recurso con el que un enlace se distingue
sin depender del color, que es la razón por la que este sitio puede sostener
contraste AAA sin pelearse con la paleta. Que la marca esté construida sobre
un subrayado dice de qué trabaja la consultora, y lo dice sin dibujar ni un
ojo, ni una mano, ni una silla de ruedas: los tres clichés del sector.

## Color

Dos familias sobre neutros fríos. Los números son ratios de contraste WCAG 2.x
medidos, no estimados; se recalculan solos en cada despliegue con
`npm run verificar:contraste`, que lee los hex directamente de la hoja de
estilos y corta el despliegue si alguno baja del mínimo.

### Modo claro

| Papel | Hex | Contraste sobre blanco |
| --- | --- | --- |
| Azul petróleo, marca | `#0B4A57` | 9.85:1 |
| Azul petróleo intenso, botones | `#08333D` | 13.54:1 (con texto blanco) |
| Terracota, acento | `#A2450A` | 6.19:1 |
| Texto | `#10181B` | 17.97:1 |
| Texto atenuado | `#455055` | 8.29:1 |
| Titulares | `#0A1013` | 19.15:1 |
| Superficie de tarjeta | `#F1F5F6` | — |

### Modo oscuro

| Papel | Hex | Contraste sobre `#0B0F11` |
| --- | --- | --- |
| Azul claro, marca | `#8AD4E4` | 11.57:1 |
| Ámbar, acento | `#F0A868` | 9.63:1 |
| Texto | `#E9EFF1` | 16.58:1 |
| Texto atenuado | `#AEBBC0` | 9.78:1 |
| Superficie de tarjeta | `#151C1F` | — |

Hay además una tercera y una cuarta paleta, para quien pide más contraste en el
sistema operativo (`prefers-contrast: more`). Se generan solas desde el CSS.

### La única regla dura del color

**El terracota nunca lleva texto encima ni se usa como color de texto.** En
claro llega a 6.19:1: cumple AA pero no el AAA que el sitio se autoimpone.
Sirve para subrayados, bordes y marcas; nunca para palabras.

Y la de siempre: el color no puede ser el único indicador. Los enlaces van
subrayados, la página actual del menú va subrayada y en negrita, y el estado
de un desplegable lo anuncia el propio `details` del navegador.

## Tipografía

Dos familias, las dos con licencia SIL Open Font 1.1 y alojadas en el propio
sitio. No hay una tercera.

- **Titulares y marca: Jost.** Geométrica, de caja ancha, la alternativa libre
  a Futura. Los títulos van en peso 600; el nombre de la cabecera, en 500.
- **Del logotipo:** **Jost 500 Medium**, la misma. **El logotipo ya está
  trazado con ella**: el archivo no contiene texto vivo, son curvas, y se ve
  igual en cualquier ordenador y en imprenta sin instalar nada. Como la web
  ahora carga Jost, el nombre de la cabecera y el del logotipo son las mismas
  letras.
- **Texto: Atkinson Hyperlegible Next**, del Braille Institute, pensada para
  baja visión: cada letra se distingue de las que se le parecen (la I
  mayúscula, la l y el 1; la b y la d; el cero lleva una barra para no
  confundirse con la O). Trae cursiva propia. Jost no se carga en cursiva
  porque ningún título la usa.
- **Detrás de cada una**, las del sistema: Century Gothic, Avenir Next y
  Futura para los títulos, y la del sistema operativo para el texto. Se ven
  el instante en que baja el archivo, o si no llega.

**Cómo se cargan.** Los archivos `.woff2` salen de los paquetes de Fontsource
(`@fontsource-variable/jost` y `@fontsource-variable/atkinson-hyperlegible-next`)
y Vite los copia a `dist/assets/`. Se sirven desde este mismo dominio y no
desde Google Fonts: ninguna visita le avisa a un tercero, y la política de
seguridad sigue en `font-src 'self'`. Cada paquete trae un archivo por grupo
de caracteres y el navegador baja solo el latino: **59,8 KB por página**
entre las dos, medidos el 9 de noviembre de 2026. Una página con texto en
cursiva suma 37 KB más.

**Escala.** Razón 1,25 a partir de 1rem, siempre en `rem` y nunca en unidades
de pantalla (`vw`), para que la ampliación de texto del navegador agrande
todo por igual (criterio 1.4.4). Desde 48rem de ancho, h1 y h2 suben un
escalón. Los tamaños son variables de `src/estilos/global.css`; no se escribe
un tamaño suelto fuera de ellas.

| Variable | Tamaño | Dónde |
| --- | --- | --- |
| `--step--1` | 0,875rem (14 px) | Letra chica: pie, avisos legales, selector y aviso de idioma. No se baja de aquí. |
| `--step-0` | 1rem (16 px) | Texto y h4. |
| `--step-1` | 1,25rem (20 px) | h3 y entradillas (`.lede`). |
| `--step-2` | 1,5625rem (25 px) | h2 en pantalla chica. |
| `--step-3` | 1,953rem (31 px) | h1 en pantalla chica, h2 desde 48rem. |
| `--step-4` | 2,441rem (39 px) | h1 desde 48rem. |

**Medida.** El texto del contenido no pasa de 34em de ancho (`--medida`):
unos 67 caracteres por línea de promedio, y ningún párrafo pasa de 80, que es
lo que pide el criterio 1.4.8 (AAA). Va en `em` y no en `ch` porque el cero de
Atkinson es bastante más ancho que la letra promedio: una medida en `ch`
dejaría pasar líneas de más de 90 caracteres. Si cambia la fuente del texto o
su tamaño, hay que volver a medir.

## El símbolo

Una "a" de un solo piso construida con dos elementos: un círculo de trazo 7
(sobre una caja de 64) y un asta vertical cuyo eje cae exactamente en el punto
más a la derecha del círculo, de modo que se funden sin costura. Debajo, el
subrayado: un rectángulo de esquinas redondeadas, en terracota.

- Caja de dibujo: 64 × 64. Tinta real: de 8 a 56 en horizontal, de 8 a 56 en
  vertical.
- **Área de respeto:** el alto del subrayado (7 unidades, un 11 % del lado) por
  cada costado. Nada entra ahí.
- **Tamaño mínimo:** 24 px de lado en pantalla. Por debajo, el asta y el
  círculo empiezan a pegarse.

## Archivos y cuándo usar cada uno

| Archivo | Para qué |
| --- | --- |
| `src/componentes/Logo.jsx` | El símbolo dentro del sitio. Va en línea en el HTML y toma el color de la paleta activa, así que funciona en claro, en oscuro y en contraste forzado de Windows. |
| `public/img/logo-tuaccesible.svg` | Logotipo horizontal completo, con el nombre trazado en curvas. Listo para piezas externas, para imprenta y para entregar a un tercero: firmas, portadas de informe, facturas. Lienzo de 266 × 64. |
| `public/img/logo-marca.svg` | Solo el símbolo, a color. |
| `public/img/logo-marca-mono.svg` | Solo el símbolo, en `currentColor`: hereda el color de donde se ponga. Para sellos, grabados, o cualquier soporte de una tinta. |
| `public/img/favicon.svg` | Icono de pestaña. Trae su propia versión oscura. |
| `public/img/icono-180.png` | Icono de pantalla de inicio en iOS. Mosaico petróleo con la letra en blanco. |
| `public/img/og-tuaccesible.png` | Tarjeta de 1200 × 630 que se ve cuando alguien comparte una página **en español** en LinkedIn, WhatsApp o Slack. |
| `public/img/og-tuaccesible-en.png` | La misma tarjeta para las páginas **en inglés**, con el lema traducido y ADA delante de EN 301 549, que es lo que reconoce un comprador estadounidense. `src/documento.js` elige una u otra según el idioma de la página. |

Las dos tarjetas comparten geometría exacta: franja petróleo de 16 px arriba,
logotipo a 100 px del borde izquierdo con 760,7 px de ancho, lema en Century
Gothic de 44 px con interlineado de 57 px, y la dirección del sitio en 30 px
sobre `#455055`. Si hay que rehacer una, hay que rehacer la otra igual, o
dejan de parecer el mismo sitio.

El lema de las tarjetas sigue en Century Gothic y no en Jost: se hicieron
antes de alojar las fuentes, y `tools/generar-og.js` busca Century Gothic
instalada en la máquina. Pasarlas a Jost es posible, pero hay que rehacer las
dos y volver a calibrar la geometría.

En el sitio, el nombre **no** es una imagen: es texto real al lado del símbolo.
Así crece con el zoom de texto, se lee tal cual con lector de pantalla y no
desaparece si un archivo no carga.

## Íconos

Los íconos del sitio son de Lucide, de trazo fino y del mismo grosor, y se
usan con `src/componentes/Icono.jsx`. Toman el color del texto de al lado,
así que siguen a la paleta activa sin reglas propias.

- Siempre acompañan a un texto que dice lo mismo; nunca van solos. El lector
  de pantalla no los anuncia.
- Un ícono por tarjeta o por botón, como mucho. No son ilustración: si una
  sección necesita imagen, va una de verdad.
- Ninguno de los tres clichés del sector (ojo, mano, silla de ruedas), ni el
  ícono `accessibility` de Lucide. Por la misma razón que el logotipo no los
  dibuja: el sitio dice de qué trabaja con el subrayado, no con un
  pictograma.

## Qué no hacer

- No cambiar la proporción entre el símbolo y el nombre en el logotipo.
- No poner el símbolo a color sobre un fondo de color: para eso está la versión
  de una tinta.
- No rotar el símbolo ni inclinarlo.
- No agregar sombras, degradados ni brillos: la paleta está pensada plana y los
  degradados rompen la medición de contraste.
- No usar el terracota para texto (ver arriba).
- No volver a escribir el nombre con una tipografía cualquiera: el logotipo ya
  está trazado y no se puede editar como texto. Si hiciera falta cambiar algo
  del nombre, se rehace desde Jost 500, no se escribe encima.
