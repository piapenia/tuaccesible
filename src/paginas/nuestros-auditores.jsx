import { Seccion } from "../componentes/Seccion.jsx";
import { Banda } from "../componentes/Banda.jsx";
import { Indice } from "../componentes/Indice.jsx";

export const pagina = {
  idioma: "es",
  titulo: "Nuestros auditores",
  descripcion: "María Pía Peña Foissac, auditora de accesibilidad. Usa un lector de pantalla desde hace más de trece años. Certificaciones, herramientas y trayectoria.",
  rutaAlternativa: "/en/our-auditors/",
};

export default function Equipo() {
  return (
    <>
      <h1>Nuestros auditores</h1>
      <p className="lede">María Pía Peña Foissac, auditora jefe.</p>
      <Indice
        idioma="es"
        entradas={[
          ["que-audito", "Qué audito y desde cuándo"],
          ["tambien-enseno", "También enseño"],
          ["certificaciones", "Certificaciones"],
          ["dos-lecturas", "Tu informe pasa por dos lecturas"],
        ]}
      />
      <div className="perfil">
        <img className="portrait" src="/img/maria-pia.jpg" width="1458" height="1534" alt="" />
        <div className="prose perfil__texto">
          <p>Soy ciega total, uso un lector de pantalla desde hace más de trece años. No es una herramienta que abro para trabajar: es mi forma principal de acceder a todo lo digital, todos los días, dentro y fuera de esta consultora. Cuando pruebo tu producto con NVDA, lo estoy usando como uso todo lo demás.</p>
          <p>Trabajo con NVDA, JAWS, el Narrador de Windows y TalkBack en Android, y con navegación exclusivamente por teclado. Esa es la parte del trabajo donde aparecen las barreras que ninguna herramienta automática marca.</p>
        </div>
      </div>
      <Seccion numero="01" titulo="Qué audito y desde cuándo" id="que-audito">
        <div className="prose">
          <p>Audito accesibilidad de forma profesional desde 2021: más de cuatro años evaluando sitios web, aplicaciones móviles, documentos y software de escritorio contra WCAG 2.2, EN 301 549 y la Ley Europea de Accesibilidad.</p>
          <p>Redacto informes de revisión de accesibilidad con las incidencias priorizadas por severidad, declaraciones de accesibilidad, y recomendaciones de accesibilidad cognitiva. Mi formación anterior es de control de calidad de software. Por eso un hallazgo llega a tu equipo con pasos para reproducirlo y criterio de aceptación, no como una observación suelta.</p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="También enseño" id="tambien-enseno">
        <div className="prose">
          <p>Doy clases de accesibilidad digital en la Fundación DALAT y impartí el módulo de accesibilidad de XAcademy. Enseñar me obligó a explicar barreras técnicas a personas que no programan, y eso cambió cómo escribo los informes: si un responsable de contenido no entiende el hallazgo, el hallazgo no se corrige.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Certificaciones" id="certificaciones">
        <div className="prose">
          <ul>
            <li>A11Y Development Knowledge Badge — IAAP, enero 2026. Se obtiene aprobando su test de accesibilidad para desarrollo con más de un 85 %. <a href="https://www.credly.com/badges/b1386a4d-61cc-4c64-a4c4-a399475a6e42">Verificar en Credly</a>.</li>
            <li>Especialista en Accesibilidad Digital, WCAG 2.2 Nivel AA — Instituto de Accesibilidad y DALAT, con certificación de la Universidad Nacional de Tres de Febrero. Octubre de 2025.</li>
            <li>ARIA desde cero para desarrolladores y diseñadores — WeAAAre, julio 2025.</li>
            <li>Accesibilidad Digital — Universidad Tecnológica Nacional, 2020.</li>
          </ul>
        </div>
      </Seccion>
      <Seccion numero="04" titulo="Tu informe pasa por dos lecturas" id="dos-lecturas">
        <div className="prose">
          <p>Audito yo. El informe, no. Antes de salir lo lee otra persona de tuaccesible, que revisa la priorización y discute los criterios que apliqué. Discutimos de verdad: a veces bajo una incidencia de crítica a alta porque no consigo defenderla. Ese es el punto. Lo que llega a tu equipo ya sobrevivió a una discusión interna.</p>
        </div>
      </Seccion>
      <Banda titulo="Hablemos">
        <p>Si tienes un producto que auditar, cuéntame en qué situación está y con qué plazo. Te digo por dónde empezar.</p>
        <p><a href="/contactanos/">Escribir a tuaccesible</a></p>
      </Banda>
    </>
  );
}
