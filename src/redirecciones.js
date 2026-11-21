/* Direcciones viejas que siguen funcionando despues de renombrar una pagina.

   Cada clave es una direccion que ya no tiene pagina propia y cada valor, la
   pagina a la que tiene que llevar. Quien llega por un enlace viejo, un
   marcador del navegador o un resultado de busqueda anterior al cambio va a
   parar a la pagina nueva sin ver un error.

   GitHub Pages no deja configurar redirecciones del servidor, asi que la
   compilacion escribe en cada direccion vieja una pagina minima (ver
   renderizarRedireccion en src/renderizar.jsx) con:
     - una redireccion inmediata, <meta http-equiv="refresh" content="0">,
       que Google trata como una redireccion permanente;
     - el enlace canonico a la pagina nueva, para que los buscadores pasen a
       indexar esa;
     - un enlace visible a la pagina nueva, por si el navegador no sigue la
       redireccion.
   Estas paginas no entran en el sitemap.

   Para renombrar otra pagina: se cambia el nombre del archivo en
   src/paginas/ y se suma aca la direccion vieja con la nueva. Si alguna vez
   se crea de nuevo una pagina en una de estas direcciones viejas, la
   compilacion avisa y hay que quitar la linea de aca. */
export const redirecciones = {
  "/normativa/": "/normativa-legal/",
  "/sobre-tuaccesible/": "/quienes-somos/",
  "/equipo/": "/nuestros-auditores/",
  "/testimonios/": "/casos-de-exito/",
  "/contacto/": "/contactanos/",
  "/en/regulations/": "/en/legal-requirements/",
  "/en/about/": "/en/who-we-are/",
  "/en/team/": "/en/our-auditors/",
  "/en/testimonials/": "/en/success-stories/",
  "/en/contact/": "/en/contact-us/",
};
