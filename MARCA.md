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

- **Titulares y marca:** Century Gothic, con Avenir Next, Futura y Segoe UI
  detrás. Geométrica, de caja ancha.
- **Texto:** la tipografía del sistema. No se carga ninguna fuente web: menos
  peso, y ningún dato del visitante viajando a un servidor de fuentes.
- **Del logotipo:** **Jost 500 Medium**, licencia SIL Open Font 1.1. Es la
  alternativa libre a Futura, se puede redistribuir dentro de un archivo de
  logo, y **el logotipo ya está trazado con ella**: el archivo no contiene
  texto vivo, son curvas. Se ve igual en cualquier ordenador y en imprenta,
  sin instalar nada. Century Gothic es comercial y por eso no se usó.

Ojo con una consecuencia de esto: en la web el nombre se dibuja con la
tipografía del sistema (Century Gothic y sus alternativas), mientras que el
logotipo está trazado en Jost. Son parecidas pero no idénticas. Si algún día
molesta esa diferencia, la solución es alojar Jost en el propio sitio; hoy no
se carga ninguna tipografía web, que es lo que mantiene el sitio ligero y sin
pedidos a servidores ajenos.

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
| `src/_includes/logo.njk` | El símbolo dentro del sitio. Va en línea en el HTML y toma el color de la paleta activa, así que funciona en claro, en oscuro y en contraste forzado de Windows. |
| `src/img/logo-tuaccesible.svg` | Logotipo horizontal completo, con el nombre trazado en curvas. Listo para piezas externas, para imprenta y para entregar a un tercero: firmas, portadas de informe, facturas. Lienzo de 266 × 64. |
| `src/img/logo-marca.svg` | Solo el símbolo, a color. |
| `src/img/logo-marca-mono.svg` | Solo el símbolo, en `currentColor`: hereda el color de donde se ponga. Para sellos, grabados, o cualquier soporte de una tinta. |
| `src/img/favicon.svg` | Icono de pestaña. Trae su propia versión oscura. |
| `src/img/icono-180.png` | Icono de pantalla de inicio en iOS. Mosaico petróleo con la letra en blanco. |
| `src/img/og-tuaccesible.png` | Tarjeta de 1200 × 630 que se ve cuando alguien comparte el sitio en LinkedIn, WhatsApp o Slack. |

En el sitio, el nombre **no** es una imagen: es texto real al lado del símbolo.
Así crece con el zoom de texto, se lee tal cual con lector de pantalla y no
desaparece si un archivo no carga.

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
