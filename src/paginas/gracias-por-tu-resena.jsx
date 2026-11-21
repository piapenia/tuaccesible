export const pagina = {
  idioma: "es",
  titulo: "Gracias por tu reseña",
  descripcion: "Confirmación de que tu reseña llegó a tuaccesible.",
  rutaAlternativa: "/en/thanks-for-your-review/",
  noindex: true,
};

export default function GraciasPorTuResena() {
  return (
    <>
      <h1>Gracias por tu reseña</h1>
      <p className="lede">La recibimos y la revisaremos antes de publicarla en <a href="/casos-de-exito/">casos de éxito</a>.</p>
      <div className="prose">
        <p>Si quieres corregir algo o retirar tu autorización, escríbenos a <a href="mailto:contacto@tuaccesible.com">contacto@tuaccesible.com</a>.</p>
      </div>
    </>
  );
}
