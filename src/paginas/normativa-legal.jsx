import { Desplegable } from "../componentes/Desplegable.jsx";
import { Seccion } from "../componentes/Seccion.jsx";
import { Banda } from "../componentes/Banda.jsx";

export const pagina = {
  idioma: "es",
  titulo: "Qué ley de accesibilidad te obliga",
  descripcion: "Ley Europea de Accesibilidad, ADA y Section 508, y Ley 26.653 en Argentina. A quién obliga cada una y desde qué fecha.",
  rutaAlternativa: "/en/legal-requirements/",
};

export default function Normativa() {
  return (
    <>
      <h1>Qué ley de accesibilidad impera en tu zona, y desde cuándo</h1>
      <p className="lede">Importante tener en cuenta: la ley que se debe acatar es la imperante y vigente en el lugar en el que se vende, no en el lugar desde el que se opera. Una empresa argentina que vende a consumidores europeos debe cumplir la norma europea.</p>
      <Seccion numero="01" titulo="Si vendes a consumidores en la Unión Europea">
        <div className="prose">
          <p>Aplica la <strong>Ley Europea de Accesibilidad</strong>, la Directiva (UE) 2019/882. Es <strong>exigible desde el 28 de junio de 2025</strong>.</p>
          <p>Obliga sin distinguir el lugar desde el que opera la sede de la empresa.</p>
          <p>Para tener en cuenta: la Ley Europea de Accesibilidad aplica a quien vende al público. En caso de vender solo a otras empresas, el EAA no aplica por la presente vía.</p>
          <p>Importante: en caso de contratar con administraciones públicas o si un cliente traslada el requisito por contrato, la ley aplicará.</p>
          <Desplegable resumen="A qué sectores y empresas alcanza">
            <p>No obliga a todas las empresas. Los sectores cubiertos son:</p>
            <ul>
              <li>Comercio electrónico.</li>
              <li>Banca y servicios de pago.</li>
              <li>Telecomunicaciones y comunicaciones electrónicas.</li>
              <li>Servicios de medios audiovisuales.</li>
              <li>Transporte de pasajeros: venta de pasajes, información y terminales.</li>
              <li>Libros electrónicos y sus lectores.</li>
              <li>Equipos informáticos, teléfonos, tabletas y terminales de autoservicio como cajeros y quioscos.</li>
            </ul>
            <p><strong>Exención de microempresas:</strong> alcanza solo a las que prestan servicios. Se considera microempresa la que emplea a menos de 10 personas y, además, cumple una de estas dos condiciones: que su facturación anual no supere los 2 millones de euros, o que su balance anual total no supere los 2 millones. Basta con una de las dos. Quien fabrica o distribuye productos cubiertos no está exento, aunque sea microempresa.</p>
            <p><strong>Lo que la ley sí te concede.</strong> Puedes seguir usando hasta el 28 de junio de 2030 los productos que ya utilizabas legalmente antes del 28 de junio de 2025. Los contratos firmados antes de esa fecha siguen hasta expirar, con un máximo de cinco años. Y existe la excepción de carga desproporcionada, que hay que documentar y revisar cada cinco años. No es una puerta abierta, pero es una puerta.</p>
          </Desplegable>
          <p>El EAA obliga a marcado CE y declaración de conformidad para los <strong>productos</strong> cubiertos. Para los <strong>servicios</strong> no existe ningún certificado oficial. Lo explicamos en <a href="/certificado-accesibilidad-web/">qué certificados de accesibilidad web existen</a>.</p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="Operar en España">
        <div className="prose">
          <p>La ley española que traslada el EAA al derecho interno, su transposición, es la <strong>Ley 11/2023</strong>. El régimen sancionador es el del Real Decreto Legislativo 1/2013, la ley general de derechos de las personas con discapacidad, con tres niveles de infracción y multas que van de 301 € a 1.000.000 €.</p>
          <p>El <strong>Real Decreto 193/2023</strong> estipula que se verá complementado por la norma que transponga el EAA, por lo que no lo transpone. Desarrolla el Real Decreto Legislativo 1/2013 y <strong>aplica a cualquiera que ofrezca bienes o servicios al público</strong>.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Operar en Estados Unidos">
        <div className="prose">
          <p>El <strong>ADA</strong> no fija un estándar técnico en su texto, pero los tribunales resuelven usando <strong>WCAG 2.1 nivel AA</strong> como referencia de hecho.</p>
          <p>Las sanciones se mueven por vía judicial: quien reclama es un particular ante un tribunal, comenzando la mayoría de las veces con una carta de reclamación.</p>
          <Desplegable resumen="Plazos y normas que fijan estándar">
            <ul>
              <li><strong>Section 508:</strong> obliga a las agencias federales y a quienes les venden.</li>
              <li><strong>ADA Title II:</strong> alcanza a entidades públicas estatales y locales, con WCAG 2.1 AA como estándar exigido. El Departamento de Justicia prorrogó los plazos un año en abril de 2026: <strong>26 de abril de 2027</strong> para poblaciones de 50.000 habitantes o más, y <strong>26 de abril de 2028</strong> para las menores.</li>
              <li><strong>ADA Title III:</strong> alcanza a los negocios abiertos al público. No tiene plazo ni estándar publicado, y es donde se concentran las demandas.</li>
            </ul>
          </Desplegable>
          <p>Un abogado solicitará un informe de auditoría con fecha y tabla de criterios.</p>
        </div>
      </Seccion>
      <Seccion numero="04" titulo="Trabajando con el Estado argentino">
        <div className="prose">
          <p>Aplica la <strong>Ley 26.653</strong>, de accesibilidad de la información en las páginas web, vigente desde 2010. Los estándares técnicos los fija la Oficina Nacional de Tecnologías de la Información (ONTI).</p>
          <p><strong>No suele aplicar a la empresa privada argentina en general.</strong> Preferimos informarlo antes de consultar a un abogado.</p>
          <Desplegable resumen="A quién obliga exactamente">
            <ul>
              <li>El Estado nacional, sus organismos descentralizados y autárquicos.</li>
              <li>Las empresas del Estado y los entes públicos no estatales.</li>
              <li>Las empresas privadas concesionarias de servicios públicos.</li>
              <li>Las empresas prestadoras o contratistas de bienes y servicios del Estado.</li>
              <li>Las organizaciones de la sociedad civil que reciban subsidios o donaciones del Estado, o contraten con él.</li>
            </ul>
            <p>Si tu empresa es privada y no entra en ninguna de esas categorías, la Ley 26.653 no te obliga. Ahora bien, si le vendes a consumidores europeos, el EAA sí.</p>
          </Desplegable>
        </div>
      </Seccion>
      <Banda titulo="Qué normativa me aplica">
        <p>Cuéntanos qué vendes y en qué mercados. Te informamos qué marco te alcanza y desde cuándo, sin cargo ni compromiso de contratación.</p>
        <p><a href="/contactanos/">Consultar qué normativa me aplica</a> o ver el <a href="/servicios/">detalle de servicios</a>.</p>
        <p>En caso de que te soliciten un certificado, consulta <a href="/certificado-accesibilidad-web/">qué certificados de accesibilidad web existen</a>.</p>
      </Banda>
      <p><small>Esta página brinda orientación general sobre el estado de la normativa, no asesoramiento jurídico. Para una interpretación vinculante sobre un caso en particular, recomendamos ampliamente consultar con un profesional.</small></p>
    </>
  );
}
