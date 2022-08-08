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
      name: <text copySource="H" name="Hname" />, 
      charge: <integer copySource="H.charge" name="Hcharge" />
    </p>

    <p>Symbol: 
      <ion charge="-1" name="Hminus" >$Hatom</ion>,
      name: <text copySource="Hminus" name="Hminusname" />
      charge: <integer copySource="Hminus.charge" name="Hminuscharge" />
    </p>

    <p>Symbol: 
      <ion charge="10" name="Hcrazy" atomicNumber="1" />,
      name: <text copySource="Hcrazy" name="Hcrazyname" />
      charge: <integer copySource="Hcrazy.charge" name="Hcrazycharge" />
    </p>

  </section>


  <section name="Cl" newNamespace><title>Cloride</title>

    <p>Atom: <atom symbol="Cl" name="Clatom" /></p>
    <p>Symbol: <ion symbol="Cl" name="Cl" />, 
      name: <text copySource="Cl" name="Clname" />, 
      charge: <integer copySource="Cl.charge" name="Clcharge" />
    </p>

    <p>Symbol: <ion charge="-1" name="Clminus" >$Clatom</ion>,
      name: <text copySource="Clminus" name="Clminusname" />
      charge: <integer copySource="Clminus.charge" name="Clminuscharge" />
    </p>

    <p>Symbol: <ion symbol="Cl" name="Clplus" charge="1" />, 
      name: <text copySource="Clplus" name="Clplusname" />, 
      charge: <integer copySource="Clplus.charge" name="Clpluscharge" />
    </p>

  </section>

  <section name="Fe" newNamespace><title>Iron</title>

    <p>Atom: <atom symbol="Fe" name="Featom" /></p>
    <p>Symbol: <ion symbol="Fe" name="Fe" />, 
      name: <text copySource="Fe" name="Fename" />, 
      charge: <integer copySource="Fe.charge" name="Fecharge" />
    </p>

    <p>Symbol: 
      <ion charge="1" name="Fe1" >$Featom</ion>,
      name: <text copySource="Fe1" name="Fe1name" />,
      charge: <integer copySource="Fe1.charge" name="Fe1charge" />
    </p>

    <p>Symbol: 
      <ion charge="2" name="Fe2" atomicNumber="26" />,
      name: <text copySource="Fe2" name="Fe2name" />,
      charge: <integer copySource="Fe2.charge" name="Fe2charge" />
    </p>

    <p>Symbol: 
      <ion charge="3" name="Fe3" symbol="Fe" />,
      name: <text copySource="Fe3" name="Fe3name" />,
      charge: <integer copySource="Fe3.charge" name="Fe3charge" />
    </p>

    <p>Symbol: 
      <ion charge="4" name="Fe4" >$Featom</ion>,
      name: <text copySource="Fe4" name="Fe4name" />,
      charge: <integer copySource="Fe4.charge" name="Fe4charge" />
    </p>

    <p>Symbol: 
      <ion charge="5" name="Fe5" atomicNumber="26" />,
      name: <text copySource="Fe5" name="Fe5name" />,
      charge: <integer copySource="Fe5.charge" name="Fe5charge" />
    </p>

    <p>Symbol: 
      <ion charge="6" name="Fe6" >$Featom</ion>,
      name: <text copySource="Fe6" name="Fe6name" />,
      charge: <integer copySource="Fe6.charge" name="Fe6charge" />
    </p>

    <p>Symbol: 
      <ion charge="7" name="Fe7" >$Featom</ion>,
      name: <text copySource="Fe7" name="Fe7name" />,
      charge: <integer copySource="Fe7.charge" name="Fe7charge" />
    </p>

    <p>Symbol: 
      <ion charge="8" name="Fe8" >$Featom</ion>,
      name: <text copySource="Fe8" name="Fe8name" />,
      charge: <integer copySource="Fe8.charge" name="Fe8charge" />
    </p>

    <p>Symbol: 
      <ion charge="-1" name="Fen1" >$Featom</ion>,
      name: <text copySource="Fen1" name="Fen1name" />,
      charge: <integer copySource="Fen1.charge" name="Fen1charge" />
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
    name: <text copySource="Hminus" name="Hminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Cminus" symbol="C"/>,
    name: <text copySource="Cminus" name="Cminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Nminus" symbol="N"/>,
    name: <text copySource="Nminus" name="Nminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Ominus" symbol="O"/>,
    name: <text copySource="Ominus" name="Ominusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Fminus" symbol="F"/>,
    name: <text copySource="Fminus" name="Fminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Pminus" symbol="P"/>,
    name: <text copySource="Pminus" name="Pminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Sminus" symbol="S"/>,
    name: <text copySource="Sminus" name="Sminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Clminus" symbol="Cl"/>,
    name: <text copySource="Clminus" name="Clminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Brminus" symbol="Br"/>,
    name: <text copySource="Brminus" name="Brminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Iminus" symbol="I"/>,
    name: <text copySource="Iminus" name="Iminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Atminus" symbol="At"/>,
    name: <text copySource="Atminus" name="Atminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Tsminus" symbol="Ts"/>,
    name: <text copySource="Tsminus" name="Tsminusname" />
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
    name: <text copySource="Sc" name="Scname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Ti" symbol="Ti"/>,
    name: <text copySource="Ti" name="Tiname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="V" symbol="V"/>,
    name: <text copySource="V" name="Vname" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Cr" symbol="Cr"/>,
    name: <text copySource="Cr" name="Crname" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="Mn" symbol="Mn"/>,
    name: <text copySource="Mn" name="Mnname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Fe" symbol="Fe"/>,
    name: <text copySource="Fe" name="Fename" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Co" symbol="Co"/>,
    name: <text copySource="Co" name="Coname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Ni" symbol="Ni"/>,
    name: <text copySource="Ni" name="Niname" />
  </p>

  <p>Symbol: 
    <ion charge="1" name="Cu" symbol="Cu"/>,
    name: <text copySource="Cu" name="Cuname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Zn" symbol="Zn"/>,
    name: <text copySource="Zn" name="Znname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="Al" symbol="Al"/>,
    name: <text copySource="Al" name="Alname" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Ga" symbol="Ga"/>,
    name: <text copySource="Ga" name="Ganame" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="In" symbol="In"/>,
    name: <text copySource="In" name="Inname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Sn" symbol="Sn"/>,
    name: <text copySource="Sn" name="Snname" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Tl" symbol="Tl"/>,
    name: <text copySource="Tl" name="Tlname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Pb" symbol="Pb"/>,
    name: <text copySource="Pb" name="Pbname" />
  </p>

  <p>Symbol: 
    <ion charge="1" name="Bi" symbol="Bi"/>,
    name: <text copySource="Bi" name="Biname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Po" symbol="Po"/>,
    name: <text copySource="Po" name="Poname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="Ce" symbol="Ce"/>,
    name: <text copySource="Ce" name="Cename" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Tm" symbol="Tm"/>,
    name: <text copySource="Tm" name="Tmname" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="Lu" symbol="Lu"/>,
    name: <text copySource="Lu" name="Luname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Th" symbol="Th"/>,
    name: <text copySource="Th" name="Thname" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Es" symbol="Es"/>,
    name: <text copySource="Es" name="Esname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Lr" symbol="Lr"/>,
    name: <text copySource="Lr" name="Lrname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Ca" symbol="Ca"/>,
    name: <text copySource="Ca" name="Caname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Si" symbol="Si"/>,
    name: <text copySource="Si" name="Siname" />
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

  it('answer ion symbols', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>Enter symbol for common ion of <atom name="Cl" symbol="Cl" />.  
    <answer name="ansCl" splitSymbols="false"><math><ion>$Cl</ion></math></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="H" symbol="H" />.  
    <answer name="ansH" splitSymbols="false"><math><ion copySource="H" /></math></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="Mg" symbol="Mg" />.  
    <answer name="ansMg" splitSymbols="false"><extract prop="math"><ion copySource="Mg" /></extract></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="P" symbol="P" />.  
    <answer name="ansP" splitSymbols="false"><ion>$P</ion></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="S" symbol="S" />.  
    <answer name="ansS" splitSymbols="false"><ion copySource="S" /></answer>
  </p>

  `}, "*");
    })

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let mathinputClName = stateVariables['/ansCl'].stateValues.inputChildren[0].componentName
      let mathinputClAnchor = cesc('#' + mathinputClName) + " textarea";
      let mathinputClSubmitAnchor = cesc('#' + mathinputClName + '_submit');
      let mathinputClCorrectAnchor = cesc('#' + mathinputClName + '_correct');
      let mathinputClIncorrectAnchor = cesc('#' + mathinputClName + '_incorrect');

      let mathinputHName = stateVariables['/ansH'].stateValues.inputChildren[0].componentName
      let mathinputHAnchor = cesc('#' + mathinputHName) + " textarea";
      let mathinputHSubmitAnchor = cesc('#' + mathinputHName + '_submit');
      let mathinputHCorrectAnchor = cesc('#' + mathinputHName + '_correct');
      let mathinputHIncorrectAnchor = cesc('#' + mathinputHName + '_incorrect');

      let mathinputMgName = stateVariables['/ansMg'].stateValues.inputChildren[0].componentName
      let mathinputMgAnchor = cesc('#' + mathinputMgName) + " textarea";
      let mathinputMgSubmitAnchor = cesc('#' + mathinputMgName + '_submit');
      let mathinputMgCorrectAnchor = cesc('#' + mathinputMgName + '_correct');
      let mathinputMgIncorrectAnchor = cesc('#' + mathinputMgName + '_incorrect');

      let mathinputPName = stateVariables['/ansP'].stateValues.inputChildren[0].componentName
      let mathinputPAnchor = cesc('#' + mathinputPName) + " textarea";
      let mathinputPSubmitAnchor = cesc('#' + mathinputPName + '_submit');
      let mathinputPCorrectAnchor = cesc('#' + mathinputPName + '_correct');
      let mathinputPIncorrectAnchor = cesc('#' + mathinputPName + '_incorrect');

      let mathinputSName = stateVariables['/ansS'].stateValues.inputChildren[0].componentName
      let mathinputSAnchor = cesc('#' + mathinputSName) + " textarea";
      let mathinputSSubmitAnchor = cesc('#' + mathinputSName + '_submit');
      let mathinputSCorrectAnchor = cesc('#' + mathinputSName + '_correct');
      let mathinputSIncorrectAnchor = cesc('#' + mathinputSName + '_incorrect');

      cy.get(mathinputClAnchor).type("Cl{enter}", {force: true});
      cy.get(mathinputClIncorrectAnchor).should('be.visible')

      cy.get(mathinputClAnchor).type("{end}^-{enter}", {force: true});
      cy.get(mathinputClCorrectAnchor).should('be.visible')

      cy.get(mathinputHAnchor).type("H{enter}", {force: true});
      cy.get(mathinputHIncorrectAnchor).should('be.visible')

      cy.get(mathinputHAnchor).type("{end}^+{enter}", {force: true});
      cy.get(mathinputHCorrectAnchor).should('be.visible')

      cy.get(mathinputMgAnchor).type("Mg{enter}", {force: true});
      cy.get(mathinputMgIncorrectAnchor).should('be.visible')

      cy.get(mathinputMgAnchor).type("{end}^2+{enter}", {force: true});
      cy.get(mathinputMgCorrectAnchor).should('be.visible')

      cy.get(mathinputPAnchor).type("P{enter}", {force: true});
      cy.get(mathinputPIncorrectAnchor).should('be.visible')

      cy.get(mathinputPAnchor).type("{end}^3-{enter}", {force: true});
      cy.get(mathinputPCorrectAnchor).should('be.visible')

      cy.get(mathinputSAnchor).type("S{enter}", {force: true});
      cy.get(mathinputSIncorrectAnchor).should('be.visible')

      cy.get(mathinputSAnchor).type("{end}^2-{enter}", {force: true});
      cy.get(mathinputSCorrectAnchor).should('be.visible')

    })
  });

})