import me from "math-expressions";
import { cesc } from "../../../../src/utils/url";

describe("Atom Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("information on atom", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <title>Information on atom</title>

  <setup>
    <atom atomicNumber="$aNum" name="atom" />
  </setup>
  
  <p>Atomic number: <mathinput name="aNum" prefill="1" /></p>
  
  <p>Name: $atom.name{assignNames="name"}</p>
  <p>Symbol: $atom.symbol{assignNames="symbol"}</p>
  <p>Atomic number: $atom.atomicNumber{assignNames="atomicNumber"}</p>
  <p>Group: $atom.group{assignNames="group"}</p>
  <p>Group Name: $atom.groupName{assignNames="groupName"}</p>
  <p>Atomic mass: $atom.atomicMass{assignNames="atomicMass" displayDigits="10"}</p>
  <p>Phase at STP: $atom.phaseAtSTP{assignNames="pahseAtSTP" displayDigits="10"}</p>
  <p>Charge of common ion: $atom.chargeOfCommonIon{assignNames="chargeOfCommonIon" displayDigits="10"}</p>
  <p>Metal category: $atom.metalCategory{assignNames="metalCategory" displayDigits="10"}</p>
  <p>Period: $atom.period{assignNames="period" displayDigits="10"}</p>
  <p>Ionization energy: $atom.ionizationEnergy{assignNames="ionizationEnergy" displayDigits="10"}</p>
  <p>Melting point: $atom.meltingPoint{assignNames="meltingPoint" displayDigits="10"}</p>
  <p>Boiling point: $atom.boilingPoint{assignNames="boilingPoint" displayDigits="10"}</p>
  <p>Atomic radius: $atom.atomicRadius{assignNames="atomicRadius" displayDigits="10"}</p>
  <p>Density: $atom.density{assignNames="density" displayDigits="10"}</p>
  <p>Electronegativity: $atom.electronegativity{assignNames="electronegativity" displayDigits="10"}</p>
  <p>Electron configuration: $atom.electronConfiguration{assignNames="electronConfiguration"}</p>
  Orbital diagram: $atom.orbitalDiagram{assignNames="orbitalDiagram"}
  
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/name")).should("have.text", "Hydrogen");
    cy.get(cesc("#\\/symbol")).should("have.text", "H");
    cy.get(cesc("#\\/atomicNumber")).should("have.text", "1");
    cy.get(cesc("#\\/group")).should("have.text", "1");
    cy.get(cesc("#\\/groupName")).should("have.text", "");
    cy.get(cesc("#\\/atomicMass")).should("have.text", "1.00794");
    cy.get(cesc("#\\/pahseAtSTP")).should("have.text", "Gas");
    cy.get(cesc("#\\/chargeOfCommonIon")).should("have.text", "1");
    cy.get(cesc("#\\/metalCategory")).should("have.text", "Non Metal");
    cy.get(cesc("#\\/period")).should("have.text", "1");
    cy.get(cesc("#\\/ionizationEnergy")).should("have.text", "13.5984");
    cy.get(cesc("#\\/meltingPoint")).should("have.text", "-259.14");
    cy.get(cesc("#\\/boilingPoint")).should("have.text", "-252.87");
    cy.get(cesc("#\\/atomicRadius")).should("have.text", "53");
    cy.get(cesc("#\\/density")).should("have.text", "0.0899");
    cy.get(cesc("#\\/electronegativity")).should("have.text", "2.2");
    cy.get(cesc("#\\/electronConfiguration") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("1s1");
      });

    cy.get(cesc("#\\/aNum") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/name")).should("have.text", "Helium");
    cy.get(cesc("#\\/symbol")).should("have.text", "He");
    cy.get(cesc("#\\/atomicNumber")).should("have.text", "2");
    cy.get(cesc("#\\/group")).should("have.text", "18");
    cy.get(cesc("#\\/groupName")).should("have.text", "Noble Gas");
    cy.get(cesc("#\\/atomicMass")).should("have.text", "4.002602");
    cy.get(cesc("#\\/pahseAtSTP")).should("have.text", "Gas");
    cy.get(cesc("#\\/chargeOfCommonIon")).should("have.text", "NaN");
    cy.get(cesc("#\\/metalCategory")).should("have.text", "Non Metal");
    cy.get(cesc("#\\/period")).should("have.text", "1");
    cy.get(cesc("#\\/ionizationEnergy")).should("have.text", "24.5874");
    cy.get(cesc("#\\/meltingPoint")).should("have.text", "NaN");
    cy.get(cesc("#\\/boilingPoint")).should("have.text", "-268.93");
    cy.get(cesc("#\\/atomicRadius")).should("have.text", "31");
    cy.get(cesc("#\\/density")).should("have.text", "0.1785");
    cy.get(cesc("#\\/electronegativity")).should("have.text", "NaN");
    cy.get(cesc("#\\/electronConfiguration") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("1s2");
      });

    cy.get(cesc("#\\/aNum") + " textarea").type("{home}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/name")).should("have.text", "Magnesium");
    cy.get(cesc("#\\/symbol")).should("have.text", "Mg");
    cy.get(cesc("#\\/atomicNumber")).should("have.text", "12");
    cy.get(cesc("#\\/group")).should("have.text", "2");
    cy.get(cesc("#\\/groupName")).should("have.text", "Alkaline Earth Metal");
    cy.get(cesc("#\\/atomicMass")).should("have.text", "24.305");
    cy.get(cesc("#\\/pahseAtSTP")).should("have.text", "Solid");
    cy.get(cesc("#\\/chargeOfCommonIon")).should("have.text", "2");
    cy.get(cesc("#\\/metalCategory")).should("have.text", "Metal");
    cy.get(cesc("#\\/period")).should("have.text", "3");
    cy.get(cesc("#\\/ionizationEnergy")).should("have.text", "7.6462");
    cy.get(cesc("#\\/meltingPoint")).should("have.text", "650");
    cy.get(cesc("#\\/boilingPoint")).should("have.text", "1090");
    cy.get(cesc("#\\/atomicRadius")).should("have.text", "145");
    cy.get(cesc("#\\/density")).should("have.text", "1.738");
    cy.get(cesc("#\\/electronegativity")).should("have.text", "1.31");
    cy.get(cesc("#\\/electronConfiguration") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).eq("1s22s22p63s2");
      });

    cy.get(cesc("#\\/aNum") + " textarea").type(
      "{home}{rightArrow}{backspace}5{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/name")).should("have.text", "Tellurium");
    cy.get(cesc("#\\/symbol")).should("have.text", "Te");
    cy.get(cesc("#\\/atomicNumber")).should("have.text", "52");
    cy.get(cesc("#\\/group")).should("have.text", "16");
    cy.get(cesc("#\\/groupName")).should("have.text", "");
    cy.get(cesc("#\\/atomicMass")).should("have.text", "127.6");
    cy.get(cesc("#\\/pahseAtSTP")).should("have.text", "Solid");
    cy.get(cesc("#\\/chargeOfCommonIon")).should("have.text", "NaN");
    cy.get(cesc("#\\/metalCategory")).should("have.text", "Metalloid");
    cy.get(cesc("#\\/period")).should("have.text", "5");
    cy.get(cesc("#\\/ionizationEnergy")).should("have.text", "9.0096");
    cy.get(cesc("#\\/meltingPoint")).should("have.text", "449.51");
    cy.get(cesc("#\\/boilingPoint")).should("have.text", "988");
    cy.get(cesc("#\\/atomicRadius")).should("have.text", "123");
    cy.get(cesc("#\\/density")).should("have.text", "6.24");
    cy.get(cesc("#\\/electronegativity")).should("have.text", "2.1");
    cy.get(cesc("#\\/electronConfiguration") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).eq(
          "1s22s22p63s23p63d104s24p64d105s25p4",
        );
      });
  });

  it("sort atoms", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <p>Originals: <aslist><group name="original">
    <atom symbol="C" />
    <atom symbol="He" />
    <atom symbol="as" />
    <atom symbol="o" />
  </group></aslist></p>
    

  <p>Sort by atomic number: <aslist><sort assignNames="an1 an2 an3 an4" sortByProp="atomicnumber">$original</sort></aslist></p>
  <p>Sort by atomic radius: <aslist><sort assignNames="ar1 ar2 ar3 ar4" sortByProp="atomicRadius">$original</sort></aslist></p>
  <p>Sort by ionization energy: <aslist><sort assignNames="ie1 ie2 ie3 ie4" sortByProp="ionizationEnergy">$original</sort></aslist></p>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/an1") + " .mjx-mrow").contains("He");
    cy.get(cesc("#\\/an2") + " .mjx-mrow").contains("C");
    cy.get(cesc("#\\/an3") + " .mjx-mrow").contains("O");
    cy.get(cesc("#\\/an4") + " .mjx-mrow").contains("As");

    cy.get(cesc("#\\/ar1") + " .mjx-mrow").contains("He");
    cy.get(cesc("#\\/ar2") + " .mjx-mrow").contains("O");
    cy.get(cesc("#\\/ar3") + " .mjx-mrow").contains("C");
    cy.get(cesc("#\\/ar4") + " .mjx-mrow").contains("As");

    cy.get(cesc("#\\/ie1") + " .mjx-mrow").contains("As");
    cy.get(cesc("#\\/ie2") + " .mjx-mrow").contains("C");
    cy.get(cesc("#\\/ie3") + " .mjx-mrow").contains("O");
    cy.get(cesc("#\\/ie4") + " .mjx-mrow").contains("He");
  });
});
