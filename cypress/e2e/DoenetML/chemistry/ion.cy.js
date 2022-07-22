import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Ion Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('ion names and charges', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <section name="H" newNamespace><title>Hydrogen</title>

    <p>Atom: <atom symbol="H" name="Hatom" /></p>
    <p>Symbol: <ion symbol="H" name="H" />, 
      name: <text copyTarget="H" name="Hname" />, 
      charge: <integer copyTarget="H" prop="charge" name="Hcharge" />
    </p>

    <p>Symbol: 
      <ion charge="-1" name="Hminus" >$Hatom</ion>,
      name: <text copyTarget="Hminus" name="Hminusname" />
      charge: <integer copyTarget="Hminus" prop="charge" name="Hminuscharge" />
    </p>

    <p>Symbol: 
      <ion charge="10" name="Hcrazy" atomicNumber="1" />,
      name: <text copyTarget="Hcrazy" name="Hcrazyname" />
      charge: <integer copyTarget="Hcrazy" prop="charge" name="Hcrazycharge" />
    </p>

  </section>


  <section name="Cl" newNamespace><title>Cloride</title>

    <p>Atom: <atom symbol="Cl" name="Clatom" /></p>
    <p>Symbol: <ion symbol="Cl" name="Cl" />, 
      name: <text copyTarget="Cl" name="Clname" />, 
      charge: <integer copyTarget="Cl" prop="charge" name="Clcharge" />
    </p>

    <p>Symbol: <ion charge="-1" name="Clminus" >$Clatom</ion>,
      name: <text copyTarget="Clminus" name="Clminusname" />
      charge: <integer copyTarget="Clminus" prop="charge" name="Clminuscharge" />
    </p>

    <p>Symbol: <ion symbol="Cl" name="Clplus" charge="1" />, 
      name: <text copyTarget="Clplus" name="Clplusname" />, 
      charge: <integer copyTarget="Clplus" prop="charge" name="Clpluscharge" />
    </p>

  </section>

  <section name="Fe" newNamespace><title>Iron</title>

    <p>Atom: <atom symbol="Fe" name="Featom" /></p>
    <p>Symbol: <ion symbol="Fe" name="Fe" />, 
      name: <text copyTarget="Fe" name="Fename" />, 
      charge: <integer copyTarget="Fe" prop="charge" name="Fecharge" />
    </p>

    <p>Symbol: 
      <ion charge="1" name="Fe1" >$Featom</ion>,
      name: <text copyTarget="Fe1" name="Fe1name" />,
      charge: <integer copyTarget="Fe1" prop="charge" name="Fe1charge" />
    </p>

    <p>Symbol: 
      <ion charge="2" name="Fe2" atomicNumber="26" />,
      name: <text copyTarget="Fe2" name="Fe2name" />,
      charge: <integer copyTarget="Fe2" prop="charge" name="Fe2charge" />
    </p>

    <p>Symbol: 
      <ion charge="3" name="Fe3" symbol="Fe" />,
      name: <text copyTarget="Fe3" name="Fe3name" />,
      charge: <integer copyTarget="Fe3" prop="charge" name="Fe3charge" />
    </p>

    <p>Symbol: 
      <ion charge="4" name="Fe4" >$Featom</ion>,
      name: <text copyTarget="Fe4" name="Fe4name" />,
      charge: <integer copyTarget="Fe4" prop="charge" name="Fe4charge" />
    </p>

    <p>Symbol: 
      <ion charge="5" name="Fe5" atomicNumber="26" />,
      name: <text copyTarget="Fe5" name="Fe5name" />,
      charge: <integer copyTarget="Fe5" prop="charge" name="Fe5charge" />
    </p>

    <p>Symbol: 
      <ion charge="6" name="Fe6" >$Featom</ion>,
      name: <text copyTarget="Fe6" name="Fe6name" />,
      charge: <integer copyTarget="Fe6" prop="charge" name="Fe6charge" />
    </p>

    <p>Symbol: 
      <ion charge="7" name="Fe7" >$Featom</ion>,
      name: <text copyTarget="Fe7" name="Fe7name" />,
      charge: <integer copyTarget="Fe7" prop="charge" name="Fe7charge" />
    </p>

    <p>Symbol: 
      <ion charge="8" name="Fe8" >$Featom</ion>,
      name: <text copyTarget="Fe8" name="Fe8name" />,
      charge: <integer copyTarget="Fe8" prop="charge" name="Fe8charge" />
    </p>

    <p>Symbol: 
      <ion charge="-1" name="Fen1" >$Featom</ion>,
      name: <text copyTarget="Fen1" name="Fen1name" />,
      charge: <integer copyTarget="Fen1" prop="charge" name="Fen1charge" />
    </p>

  </section>



  `}, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/H\\/H .mjx-mrow').eq(0).should('have.text', 'H+');
    cy.get('#\\/H\\/Hname').should('have.text', 'Hydrogen');
    cy.get('#\\/H\\/Hcharge').should('have.text', '1');

    cy.get('#\\/H\\/Hminus .mjx-mrow').eq(0).should('have.text', 'H−');
    cy.get('#\\/H\\/Hminusname').should('have.text', 'Hydride');
    cy.get('#\\/H\\/Hminuscharge').should('have.text', '-1');

    cy.get('#\\/H\\/Hcrazy .mjx-mrow').eq(0).should('have.text', 'H10+');
    cy.get('#\\/H\\/Hcrazyname').should('have.text', 'Hydrogen');
    cy.get('#\\/H\\/Hcrazycharge').should('have.text', '10');

    cy.get('#\\/Cl\\/Cl .mjx-mrow').eq(0).should('have.text', 'Cl−');
    cy.get('#\\/Cl\\/Clname').should('have.text', 'Chloride');
    cy.get('#\\/Cl\\/Clcharge').should('have.text', '-1');

    cy.get('#\\/Cl\\/Clminus .mjx-mrow').eq(0).should('have.text', 'Cl−');
    cy.get('#\\/Cl\\/Clminusname').should('have.text', 'Chloride');
    cy.get('#\\/Cl\\/Clminuscharge').should('have.text', '-1');

    cy.get('#\\/Cl\\/Clplus .mjx-mrow').eq(0).should('have.text', 'Cl+');
    cy.get('#\\/Cl\\/Clplusname').should('have.text', 'Chlorine');
    cy.get('#\\/Cl\\/Clpluscharge').should('have.text', '1');


    cy.get('#\\/Fe\\/Fe .mjx-mrow').eq(0).should('have.text', 'Fe');
    cy.get('#\\/Fe\\/Fename').should('have.text', 'Iron');
    cy.get('#\\/Fe\\/Fecharge').should('have.text', '0');

    cy.get('#\\/Fe\\/Fe1 .mjx-mrow').eq(0).should('have.text', 'Fe+');
    cy.get('#\\/Fe\\/Fe1name').should('have.text', 'Iron (I)');
    cy.get('#\\/Fe\\/Fe1charge').should('have.text', '1');

    cy.get('#\\/Fe\\/Fe2 .mjx-mrow').eq(0).should('have.text', 'Fe2+');
    cy.get('#\\/Fe\\/Fe2name').should('have.text', 'Iron (II)');
    cy.get('#\\/Fe\\/Fe2charge').should('have.text', '2');

    cy.get('#\\/Fe\\/Fe3 .mjx-mrow').eq(0).should('have.text', 'Fe3+');
    cy.get('#\\/Fe\\/Fe3name').should('have.text', 'Iron (III)');
    cy.get('#\\/Fe\\/Fe3charge').should('have.text', '3');

    cy.get('#\\/Fe\\/Fe4 .mjx-mrow').eq(0).should('have.text', 'Fe4+');
    cy.get('#\\/Fe\\/Fe4name').should('have.text', 'Iron (IV)');
    cy.get('#\\/Fe\\/Fe4charge').should('have.text', '4');

    cy.get('#\\/Fe\\/Fe5 .mjx-mrow').eq(0).should('have.text', 'Fe5+');
    cy.get('#\\/Fe\\/Fe5name').should('have.text', 'Iron (V)');
    cy.get('#\\/Fe\\/Fe5charge').should('have.text', '5');

    cy.get('#\\/Fe\\/Fe6 .mjx-mrow').eq(0).should('have.text', 'Fe6+');
    cy.get('#\\/Fe\\/Fe6name').should('have.text', 'Iron (VI)');
    cy.get('#\\/Fe\\/Fe6charge').should('have.text', '6');

    cy.get('#\\/Fe\\/Fe7 .mjx-mrow').eq(0).should('have.text', 'Fe7+');
    cy.get('#\\/Fe\\/Fe7name').should('have.text', 'Iron (VII)');
    cy.get('#\\/Fe\\/Fe7charge').should('have.text', '7');

    cy.get('#\\/Fe\\/Fe8 .mjx-mrow').eq(0).should('have.text', 'Fe8+');
    cy.get('#\\/Fe\\/Fe8name').should('have.text', 'Iron (VIII)');
    cy.get('#\\/Fe\\/Fe8charge').should('have.text', '8');

    cy.get('#\\/Fe\\/Fen1 .mjx-mrow').eq(0).should('have.text', 'Fe−');
    cy.get('#\\/Fe\\/Fen1name').should('have.text', 'Iron');
    cy.get('#\\/Fe\\/Fen1charge').should('have.text', '-1');


  });

  it('anion names', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>Symbol: 
    <ion charge="-1" name="Hminus" symbol="H"/>,
    name: <text copyTarget="Hminus" name="Hminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Cminus" symbol="C"/>,
    name: <text copyTarget="Cminus" name="Cminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Nminus" symbol="N"/>,
    name: <text copyTarget="Nminus" name="Nminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Ominus" symbol="O"/>,
    name: <text copyTarget="Ominus" name="Ominusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Fminus" symbol="F"/>,
    name: <text copyTarget="Fminus" name="Fminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Pminus" symbol="P"/>,
    name: <text copyTarget="Pminus" name="Pminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Sminus" symbol="S"/>,
    name: <text copyTarget="Sminus" name="Sminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Clminus" symbol="Cl"/>,
    name: <text copyTarget="Clminus" name="Clminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Brminus" symbol="Br"/>,
    name: <text copyTarget="Brminus" name="Brminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Iminus" symbol="I"/>,
    name: <text copyTarget="Iminus" name="Iminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Atminus" symbol="At"/>,
    name: <text copyTarget="Atminus" name="Atminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Tsminus" symbol="Ts"/>,
    name: <text copyTarget="Tsminus" name="Tsminusname" />
  </p>

  `}, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/Hminusname').should('have.text', 'Hydride');
    cy.get('#\\/Cminusname').should('have.text', 'Carbide');
    cy.get('#\\/Nminusname').should('have.text', 'Nitride');
    cy.get('#\\/Ominusname').should('have.text', 'Oxide');
    cy.get('#\\/Fminusname').should('have.text', 'Fluoride');
    cy.get('#\\/Pminusname').should('have.text', 'Phosphide');
    cy.get('#\\/Sminusname').should('have.text', 'Sulfide');
    cy.get('#\\/Clminusname').should('have.text', 'Chloride');
    cy.get('#\\/Brminusname').should('have.text', 'Bromide');
    cy.get('#\\/Iminusname').should('have.text', 'Iodide');
    cy.get('#\\/Atminusname').should('have.text', 'Astatide');
    cy.get('#\\/Tsminusname').should('have.text', 'Tennesside');

  });

  it('caion name suffixes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>Symbol: 
    <ion charge="1" name="Sc" symbol="Sc"/>,
    name: <text copyTarget="Sc" name="Scname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Ti" symbol="Ti"/>,
    name: <text copyTarget="Ti" name="Tiname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="V" symbol="V"/>,
    name: <text copyTarget="V" name="Vname" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Cr" symbol="Cr"/>,
    name: <text copyTarget="Cr" name="Crname" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="Mn" symbol="Mn"/>,
    name: <text copyTarget="Mn" name="Mnname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Fe" symbol="Fe"/>,
    name: <text copyTarget="Fe" name="Fename" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Co" symbol="Co"/>,
    name: <text copyTarget="Co" name="Coname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Ni" symbol="Ni"/>,
    name: <text copyTarget="Ni" name="Niname" />
  </p>

  <p>Symbol: 
    <ion charge="1" name="Cu" symbol="Cu"/>,
    name: <text copyTarget="Cu" name="Cuname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Zn" symbol="Zn"/>,
    name: <text copyTarget="Zn" name="Znname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="Al" symbol="Al"/>,
    name: <text copyTarget="Al" name="Alname" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Ga" symbol="Ga"/>,
    name: <text copyTarget="Ga" name="Ganame" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="In" symbol="In"/>,
    name: <text copyTarget="In" name="Inname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Sn" symbol="Sn"/>,
    name: <text copyTarget="Sn" name="Snname" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Tl" symbol="Tl"/>,
    name: <text copyTarget="Tl" name="Tlname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Pb" symbol="Pb"/>,
    name: <text copyTarget="Pb" name="Pbname" />
  </p>

  <p>Symbol: 
    <ion charge="1" name="Bi" symbol="Bi"/>,
    name: <text copyTarget="Bi" name="Biname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Po" symbol="Po"/>,
    name: <text copyTarget="Po" name="Poname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="Ce" symbol="Ce"/>,
    name: <text copyTarget="Ce" name="Cename" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Tm" symbol="Tm"/>,
    name: <text copyTarget="Tm" name="Tmname" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="Lu" symbol="Lu"/>,
    name: <text copyTarget="Lu" name="Luname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Th" symbol="Th"/>,
    name: <text copyTarget="Th" name="Thname" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Es" symbol="Es"/>,
    name: <text copyTarget="Es" name="Esname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Lr" symbol="Lr"/>,
    name: <text copyTarget="Lr" name="Lrname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Ca" symbol="Ca"/>,
    name: <text copyTarget="Ca" name="Caname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Si" symbol="Si"/>,
    name: <text copyTarget="Si" name="Siname" />
  </p>



  `}, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/Scname').should('have.text', 'Scandium (I)');
    cy.get('#\\/Tiname').should('have.text', 'Titanium (II)');
    cy.get('#\\/Vname').should('have.text', 'Vanadium (III)');
    cy.get('#\\/Crname').should('have.text', 'Chromium (IV)');
    cy.get('#\\/Mnname').should('have.text', 'Manganese (V)');
    cy.get('#\\/Fename').should('have.text', 'Iron (VI)');
    cy.get('#\\/Coname').should('have.text', 'Cobalt (VII)');
    cy.get('#\\/Niname').should('have.text', 'Nickel (VIII)');
    cy.get('#\\/Cuname').should('have.text', 'Copper (I)');
    cy.get('#\\/Znname').should('have.text', 'Zinc (II)');
    cy.get('#\\/Alname').should('have.text', 'Aluminum (III)');
    cy.get('#\\/Ganame').should('have.text', 'Gallium (IV)');
    cy.get('#\\/Inname').should('have.text', 'Indium (V)');
    cy.get('#\\/Snname').should('have.text', 'Tin (VI)');
    cy.get('#\\/Tlname').should('have.text', 'Thallium (VII)');
    cy.get('#\\/Pbname').should('have.text', 'Lead (VIII)');
    cy.get('#\\/Biname').should('have.text', 'Bismuth (I)');
    cy.get('#\\/Poname').should('have.text', 'Polonium (II)');
    cy.get('#\\/Cename').should('have.text', 'Cerium (III)');
    cy.get('#\\/Tmname').should('have.text', 'Thulium (IV)');
    cy.get('#\\/Luname').should('have.text', 'Lutetium (V)');
    cy.get('#\\/Thname').should('have.text', 'Thorium (VI)');
    cy.get('#\\/Esname').should('have.text', 'Einsteinium (VII)');
    cy.get('#\\/Lrname').should('have.text', 'Lawrencium (VIII)');
    cy.get('#\\/Caname').should('have.text', 'Calcium');
    cy.get('#\\/Siname').should('have.text', 'Silicon');

  });

})