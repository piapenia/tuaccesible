import { Desplegable } from "../../componentes/Desplegable.jsx";
import { Seccion } from "../../componentes/Seccion.jsx";
import { Banda } from "../../componentes/Banda.jsx";
import { Indice } from "../../componentes/Indice.jsx";

export const pagina = {
  idioma: "en",
  titulo: "Which accessibility law applies to you",
  descripcion: "The European Accessibility Act, the ADA and Section 508, and Argentina's Law 26.653. Who each one binds and from what date.",
  rutaAlternativa: "/normativa-legal/",
};

export default function LegalRequirements() {
  return (
    <>
      <h1>Which accessibility law is in force in your region, and since when</h1>
      <p className="lede">Important to keep in mind: the law you have to comply with is the one in force where you sell, not where you operate from. An Argentine company selling to European consumers has to comply with the European rules.</p>
      <Indice
        idioma="en"
        entradas={[
          ["european-union", "If you sell to consumers in the European Union"],
          ["spain", "Operating in Spain"],
          ["united-states", "Operating in the United States"],
          ["argentina", "Working with the Argentine State"],
        ]}
      />
      <Seccion numero="01" titulo="If you sell to consumers in the European Union" id="european-union">
        <div className="prose">
          <p>The <strong>European Accessibility Act</strong> applies, Directive (EU) 2019/882. It has been <strong>enforceable since June 28, 2025</strong>.</p>
          <p>It applies regardless of where the company is headquartered.</p>
          <p>Keep in mind: the European Accessibility Act applies to those who sell to the public. If you sell only to other businesses, the EAA doesn't apply by this route.</p>
          <p>Important: if you contract with public administrations, or a customer passes the requirement on to you by contract, the law will apply.</p>
          <Desplegable resumen="Which sectors and companies it covers">
            <p>It doesn't bind every company. The sectors covered are:</p>
            <ul>
              <li>E-commerce.</li>
              <li>Banking and payment services.</li>
              <li>Telecommunications and electronic communications.</li>
              <li>Audiovisual media services.</li>
              <li>Passenger transport: ticket sales, information and terminals.</li>
              <li>E-books and e-readers.</li>
              <li>Computer equipment, phones, tablets and self-service terminals such as ATMs and kiosks.</li>
            </ul>
            <p><strong>Microenterprise exemption:</strong> it covers only those that provide services. A microenterprise is one that employs fewer than 10 people and also meets one of these two conditions: annual turnover of no more than 2 million euros, or an annual balance sheet total of no more than 2 million. Either one is enough. Anyone who manufactures or distributes covered products is not exempt, even as a microenterprise.</p>
            <p><strong>What the law does give you.</strong> You can keep using until June 28, 2030 the products you were already lawfully using before June 28, 2025. Contracts signed before that date run until they expire, up to a maximum of five years. And there's the disproportionate burden exception, which has to be documented and reviewed every five years. It isn't an open door, but it is a door.</p>
          </Desplegable>
          <p>The EAA requires CE marking and a declaration of conformity for covered <strong>products</strong>. For <strong>services</strong> there is no official certificate. We explain it in <a href="/en/web-accessibility-certificate/">which web accessibility certificates exist</a>.</p>
        </div>
      </Seccion>
      <Seccion numero="02" titulo="Operating in Spain" id="spain">
        <div className="prose">
          <p>The Spanish law that carries the EAA into national law, its transposition, is <strong>Law 11/2023</strong>. The penalty regime is that of Royal Legislative Decree 1/2013, the general law on the rights of persons with disabilities, with three levels of infringement and fines ranging from €301 to €1,000,000.</p>
          <p><strong>Royal Decree 193/2023</strong> states that it will be complemented by the rule that transposes the EAA, so it doesn't transpose it itself. It implements Royal Legislative Decree 1/2013 and <strong>applies to anyone offering goods or services to the public</strong>.</p>
        </div>
      </Seccion>
      <Seccion numero="03" titulo="Operating in the United States" id="united-states">
        <div className="prose">
          <p>The <strong>ADA</strong> doesn't set a technical standard in its text, but courts decide cases using <strong>WCAG 2.1 Level AA</strong> as the de facto reference.</p>
          <p>Penalties come through the courts: the claimant is a private individual before a court, most often starting with a demand letter.</p>
          <Desplegable resumen="Deadlines and rules that set a standard">
            <ul>
              <li><strong>Section 508:</strong> binds federal agencies and those who sell to them.</li>
              <li><strong>ADA Title II:</strong> covers state and local public entities, with WCAG 2.1 AA as the required standard. The Department of Justice extended the deadlines by one year in April 2026: <strong>April 26, 2027</strong> for populations of 50,000 or more, and <strong>April 26, 2028</strong> for smaller ones.</li>
              <li><strong>ADA Title III:</strong> covers businesses open to the public. It has no published deadline or standard, and it's where lawsuits concentrate.</li>
            </ul>
          </Desplegable>
          <p>A lawyer will ask for a dated audit report with a criteria table.</p>
        </div>
      </Seccion>
      <Seccion numero="04" titulo="Working with the Argentine State" id="argentina">
        <div className="prose">
          <p><strong>Law 26.653</strong> applies, on access to information on web pages, in force since 2010. The technical standards are set by the National Office of Information Technologies (ONTI).</p>
          <p><strong>It doesn't usually apply to Argentine private companies in general.</strong> We'd rather tell you that before you consult a lawyer.</p>
          <Desplegable resumen="Exactly who it binds">
            <ul>
              <li>The national State and its decentralized and autonomous agencies.</li>
              <li>State-owned companies and non-state public entities.</li>
              <li>Private companies holding public service concessions.</li>
              <li>Companies that supply or contract goods and services to the State.</li>
              <li>Civil society organizations that receive subsidies or donations from the State, or contract with it.</li>
            </ul>
            <p>If your company is private and doesn't fall into any of those categories, Law 26.653 doesn't bind you. That said, if you sell to European consumers, the EAA does.</p>
          </Desplegable>
        </div>
      </Seccion>
      <Banda titulo="Which rules apply to me">
        <p>Tell us what you sell and in which markets. We'll tell you which framework covers you and since when, at no cost and with no obligation to hire us.</p>
        <p><a href="/en/contact-us/">Ask which regulations apply to me</a> or see the <a href="/en/services/">full service details</a>.</p>
        <p>If you're asked for a certificate, check <a href="/en/web-accessibility-certificate/">which web accessibility certificates exist</a>.</p>
      </Banda>
      <p><small>This page offers general guidance on the state of the regulations, not legal advice. For a binding interpretation of a particular case, we strongly recommend consulting a professional.</small></p>
    </>
  );
}
