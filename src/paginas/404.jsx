export const pagina = {
  idioma: "es",
  titulo: "Página no encontrada",
  descripcion: "Esta página no existe.",
  rutaAlternativa: "/en/",
  noindex: true,
};

export default function PaginaNoEncontrada() {
  return (
    <>
      {/* GitHub Pages sirve este mismo archivo para cualquier ruta rota del dominio,
         incluidas las de /en/: no hay forma de servir un 404 distinto por carpeta.
         Por eso la pagina lleva los dos idiomas, cada uno con su atributo lang, en
         vez de mandar al visitante ingles a la version espanola del sitio. */}
      <h1>No encontramos esta página</h1>
      <p className="lede">El enlace puede estar roto o la página puede haberse movido.</p>
      <p><a href="/">Volver al inicio</a> o ir directo a <a href="/servicios/">Servicios</a> o <a href="/contacto/">Contacto</a>.</p>
      <div className="prose" lang="en">
        <h2>Page not found</h2>
        <p>The link may be broken, or the page may have moved.</p>
        <p><a href="/en/">Go to the English home page</a>, or straight to <a href="/en/services/">Services</a> or <a href="/en/contact/">Contact</a>.</p>
      </div>
    </>
  );
}
