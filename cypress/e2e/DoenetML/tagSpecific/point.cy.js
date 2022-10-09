import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Point Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })


  it('point sugar a copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point>(5,6)</point>
      <point>(1, <copy prop="y" target="_point1" />)</point>
    </graph>
    <copy prop="coords" target="_point1" assignNames="coords1" />
    <copy prop="coords" target="_point2" assignNames="coords2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(5,6)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(1,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([5, 6])
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', 5, 6])
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, 6])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, 6])
    })

    cy.log('move point P to (-1,-7)')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−1,−7)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(1,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([-1, -7])
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', -1, -7])
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, -7])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, -7])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, -7])
    })
  });

  it('point sugar a copy, with labels', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point>(5,6)<label>P</label></point>
      <point><label>Q</label>(1, <copy prop="y" target="_point1" />)</point>
    </graph>
    <copy prop="coords" target="_point1" assignNames="coords1" />
    <copy prop="coords" target="_point2" assignNames="coords2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(5,6)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(1,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([5, 6])
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', 5, 6])
      expect(stateVariables['/_point1'].stateValues.label).eq("P")
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, 6])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, 6])
      expect(stateVariables['/_point2'].stateValues.label).eq("Q")
    })

    cy.log('move point P to (-1,-7)')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−1,−7)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(1,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([-1, -7])
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', -1, -7])
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, -7])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, -7])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, -7])
    })
  });

  it('coords use a copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(5,6)</point>
    <point coords="(1, $(_point1.y))" />
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  <copy prop="coords" target="_point2" assignNames="coords2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(5,6)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(1,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([5, 6])
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', 5, 6])
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, 6])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, 6])
    })

    cy.log('move point P to (-1,-7)')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−1,−7)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(1,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([-1, -7])
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', -1, -7])
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, -7])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, -7])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, -7])
    })
  })

  it('coords use a copy with label', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point><label>P</label>(5,6)</point>
    <point coords="(1, $(_point1.y))" ><label>Q</label></point>
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  <copy prop="coords" target="_point2" assignNames="coords2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(5,6)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(1,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([5, 6])
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', 5, 6])
      expect(stateVariables['/_point1'].stateValues.label).eq("P")
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, 6])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, 6])
      expect(stateVariables['/_point2'].stateValues.label).eq("Q")
    })

    cy.log('move point P to (-1,-7)')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−1,−7)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(1,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([-1, -7])
      expect(stateVariables['/_point1'].stateValues.coords).eqls(['vector', -1, -7])
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, -7])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, -7])
      expect((stateVariables['/_point2'].stateValues.coords)).eqls(['vector', 1, -7])
    })
  })

  it('label uses a copy', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point><label>P</label>(5,6)</point>
    <point>
      (1,3)
      <label><copy prop="label" target="_point1" />'</label>
    </point>
  </graph>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`Labels are P and P'`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([5, 6])
      expect(stateVariables['/_point1'].stateValues.label).eq('P')
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, 3])
      expect(stateVariables['/_point2'].stateValues.label).eq(`P'`)

    })

  })

  it('label uses a copy 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point><label>P</label>(5,6)</point>
    <point>
      (1,3)
      <label>$(_point1.label)'</label>
    </point>
  </graph>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`Labels are P and P'`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.xs).eqls([5, 6])
      expect(stateVariables['/_point1'].stateValues.label).eq('P')
      expect(stateVariables['/_point2'].stateValues.xs).eqls([1, 3])
      expect(stateVariables['/_point2'].stateValues.label).eq(`P'`)

    })

  })

  it('labels from labelIsName are preserved when shadowed', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g">
    <point name="P" labelIsName>(5,6)</point>
    <point labelIsName>
      (1,3)
    </point>
  </graph>

  <graph name="g2" copySource="g" newNamespace />

  <graph name="g3">
     <copy source="P" assignNames="P3" />
     <copy source="_point2" assignNames="Q3" />
  </graph>

  <graph name="g4">
     <copy source="P" assignNames="P4" labelIsName="false" />
     <copy source="_point2" assignNames="Q4" labelIsName="false" />
  </graph>

  <graph copySource="g2" name="g5" newNamespace />
  <graph copySource="g3" name="g6" newNamespace />
  <graph copySource="g4" name="g7" newNamespace />

  <p>P label: <label copySource="P.label" name="Plabel" /></p>
  <p>_point2 label: <label copySource="_point2.label" name="point2label" /></p>
  <p>g2/P label: <label copySource="g2/P.label" name="g2Plabel" /></p>
  <p>g2/_point2 label: <label copySource="g2/_point2.label" name="g2point2label" /></p>
  <p>P3 label: <label copySource="P3.label" name="P3label" /></p>
  <p>Q3 label: <label copySource="Q3.label" name="Q3label" /></p>
  <p>P4 label: <label copySource="P4.label" name="P4label" /></p>
  <p>Q4 label: <label copySource="Q4.label" name="Q4label" /></p>
  <p>g5/P label: <label copySource="g5/P.label" name="g5Plabel" /></p>
  <p>g5/_point2 label: <label copySource="g5/_point2.label" name="g5point2label" /></p>
  <p>g6/P3 label: <label copySource="g6/P3.label" name="g6Plabel" /></p>
  <p>g6/Q3 label: <label copySource="g6/Q3.label" name="g6point2label" /></p>
  <p>g7/P4 label: <label copySource="g7/P4.label" name="g7Plabel" /></p>
  <p>g7/Q4 label: <label copySource="g7/Q4.label" name="g7point2label" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/Plabel').should('have.text', 'P')
    cy.get('#\\/point2label').should('have.text', '_point2')
    cy.get('#\\/g2Plabel').should('have.text', 'P')
    cy.get('#\\/g2point2label').should('have.text', '_point2')
    cy.get('#\\/P3label').should('have.text', 'P')
    cy.get('#\\/Q3label').should('have.text', '_point2')
    cy.get('#\\/P4label').should('have.text', 'P')
    cy.get('#\\/Q4label').should('have.text', '_point2')
    cy.get('#\\/g5Plabel').should('have.text', 'P')
    cy.get('#\\/g5point2label').should('have.text', '_point2')
    cy.get('#\\/g6Plabel').should('have.text', 'P')
    cy.get('#\\/g6point2label').should('have.text', '_point2')
    cy.get('#\\/g7Plabel').should('have.text', 'P')
    cy.get('#\\/g7point2label').should('have.text', '_point2')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let P2Name = stateVariables["/g2"].activeChildren[0].componentName;
      let Q2Name = stateVariables["/g2"].activeChildren[1].componentName;
      let P5Name = stateVariables["/g5"].activeChildren[0].componentName;
      let Q5Name = stateVariables["/g5"].activeChildren[1].componentName;
      let P6Name = stateVariables["/g6"].activeChildren[0].componentName;
      let Q6Name = stateVariables["/g6"].activeChildren[1].componentName;
      let P7Name = stateVariables["/g7"].activeChildren[0].componentName;
      let Q7Name = stateVariables["/g7"].activeChildren[1].componentName;

      expect(stateVariables['/P'].stateValues.label).eq('P')
      expect(stateVariables['/P'].stateValues.labelForGraph).eq('P')
      expect(stateVariables['/_point2'].stateValues.label).eq(`_point2`)
      expect(stateVariables['/_point2'].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables[P2Name].stateValues.label).eq('P')
      expect(stateVariables[P2Name].stateValues.labelForGraph).eq('P')
      expect(stateVariables[Q2Name].stateValues.label).eq(`_point2`)
      expect(stateVariables[Q2Name].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables['/P3'].stateValues.label).eq('P')
      expect(stateVariables['/P3'].stateValues.labelForGraph).eq('P')
      expect(stateVariables['/Q3'].stateValues.label).eq(`_point2`)
      expect(stateVariables['/Q3'].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables['/P4'].stateValues.label).eq('P')
      expect(stateVariables['/P4'].stateValues.labelForGraph).eq('P')
      expect(stateVariables['/Q4'].stateValues.label).eq(`_point2`)
      expect(stateVariables['/Q4'].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables[P5Name].stateValues.label).eq('P')
      expect(stateVariables[P5Name].stateValues.labelForGraph).eq('P')
      expect(stateVariables[Q5Name].stateValues.label).eq(`_point2`)
      expect(stateVariables[Q5Name].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables[P6Name].stateValues.label).eq('P')
      expect(stateVariables[P6Name].stateValues.labelForGraph).eq('P')
      expect(stateVariables[Q6Name].stateValues.label).eq(`_point2`)
      expect(stateVariables[Q6Name].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables[P7Name].stateValues.label).eq('P')
      expect(stateVariables[P7Name].stateValues.labelForGraph).eq('P')
      expect(stateVariables[Q7Name].stateValues.label).eq(`_point2`)
      expect(stateVariables[Q7Name].stateValues.labelForGraph).eq(`&UnderBar;point2`)
    })

  })

  it('labelIsName in map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <map>
      <template><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g2" newNamespace>
    <map>
      <template newNamespace><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g3" newNamespace>
    <map assignNames="(A) (B) (C)">
      <template><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g4" newNamespace>
    <map assignNames="(A) (B) (C)">
      <template newNamespace><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g5" newNamespace>
    <map assignNames="A B C">
      <template><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g6" newNamespace>
    <map assignNames="A B C">
      <template newNamespace><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>


  <copy target="g1" assignNames="g7" />
  <copy target="g2" assignNames="g8" />
  <copy target="g3" assignNames="g9" />
  <copy target="g4" assignNames="g10" />
  <copy target="g5" assignNames="g11" />
  <copy target="g6" assignNames="g12" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`Labels are P and P'`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g1ChildNames = stateVariables["/g1"].activeChildren.map(x=>x.componentName)
      let g2ChildNames = stateVariables["/g2"].activeChildren.map(x=>x.componentName)
      let g3ChildNames = stateVariables["/g3"].activeChildren.map(x=>x.componentName)
      let g4ChildNames = stateVariables["/g4"].activeChildren.map(x=>x.componentName)
      let g5ChildNames = stateVariables["/g5"].activeChildren.map(x=>x.componentName)
      let g6ChildNames = stateVariables["/g6"].activeChildren.map(x=>x.componentName)
      let g7ChildNames = stateVariables["/g7"].activeChildren.map(x=>x.componentName)
      let g8ChildNames = stateVariables["/g8"].activeChildren.map(x=>x.componentName)
      let g9ChildNames = stateVariables["/g9"].activeChildren.map(x=>x.componentName)
      let g10ChildNames = stateVariables["/g10"].activeChildren.map(x=>x.componentName)
      let g11ChildNames = stateVariables["/g11"].activeChildren.map(x=>x.componentName)
      let g12ChildNames = stateVariables["/g12"].activeChildren.map(x=>x.componentName)
  
      let g1ChildLabels = Array(5).fill("");
      let g2ChildLabels = Array(5).fill("P");
      let g3ChildLabels = ["A", "B", "C", "", ""];
      let g4ChildLabels = ["A", "B", "C", "P", "P"];
      let g5ChildLabels = Array(5).fill("");
      let g6ChildLabels = Array(5).fill("P");

      for(let [ind, name] of g1ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g1ChildLabels[ind])
      }
      for(let [ind, name] of g2ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g2ChildLabels[ind])
      }
      for(let [ind, name] of g3ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g3ChildLabels[ind])
      }
      for(let [ind, name] of g4ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g4ChildLabels[ind])
      }
      for(let [ind, name] of g5ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g5ChildLabels[ind])
      }
      for(let [ind, name] of g6ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g6ChildLabels[ind])
      }

      for(let [ind, name] of g7ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g1ChildLabels[ind])
      }
      for(let [ind, name] of g8ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g2ChildLabels[ind])
      }
      for(let [ind, name] of g9ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g3ChildLabels[ind])
      }
      for(let [ind, name] of g10ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g4ChildLabels[ind])
      }
      for(let [ind, name] of g11ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g5ChildLabels[ind])
      }
      for(let [ind, name] of g12ChildNames.entries()) {
        expect(stateVariables[name].stateValues.label).eq(g6ChildLabels[ind])
      }


    })

  })

  it.skip('labels from labelIsName, copy with link=false', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g">
    <point name="P" labelIsName>(5,6)</point>
    <point labelIsName>
      (1,3)
    </point>
  </graph>

  <copy target="g" assignNames="g2" link="false" />

  <graph name="g3">
     <copy target="P" assignNames="P3" link="false" />
     <copy target="_point2" assignNames="Q3" link="false" />
  </graph>

  <copy target="g2" assignNames="g4" link="false" />
  <copy target="g3" assignNames="g5" link="false" />


    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`Labels are P and P'`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let P2Name = stateVariables["/g2"].activeChildren[0].componentName;
      let Q2Name = stateVariables["/g2"].activeChildren[1].componentName;
      let P4Name = stateVariables["/g4"].activeChildren[0].componentName;
      let Q4Name = stateVariables["/g4"].activeChildren[1].componentName;
      let P5Name = stateVariables["/g5"].activeChildren[0].componentName;
      let Q5Name = stateVariables["/g5"].activeChildren[1].componentName;

      expect(stateVariables['/P'].stateValues.label).eq('P')
      expect(stateVariables['/P'].stateValues.labelForGraph).eq('P')
      expect(stateVariables['/_point2'].stateValues.label).eq(`_point2`)
      expect(stateVariables['/_point2'].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables[P2Name].stateValues.label).eq('P')
      expect(stateVariables[P2Name].stateValues.labelForGraph).eq('P')
      expect(stateVariables[Q2Name].stateValues.label).eq(`_point2`)
      expect(stateVariables[Q2Name].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables['/P3'].stateValues.label).eq('P')
      expect(stateVariables['/P3'].stateValues.labelForGraph).eq('P')
      expect(stateVariables['/Q3'].stateValues.label).eq(`_point2`)
      expect(stateVariables['/Q3'].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables[P4Name].stateValues.label).eq('P')
      expect(stateVariables[P4Name].stateValues.labelForGraph).eq('P')
      expect(stateVariables[Q4Name].stateValues.label).eq(`_point2`)
      expect(stateVariables[Q4Name].stateValues.labelForGraph).eq(`&UnderBar;point2`)
      expect(stateVariables[P5Name].stateValues.label).eq('P')
      expect(stateVariables[P5Name].stateValues.labelForGraph).eq('P')
      expect(stateVariables[Q5Name].stateValues.label).eq(`_point2`)
      expect(stateVariables[Q5Name].stateValues.labelForGraph).eq(`&UnderBar;point2`)
    })

  })

  it('labelIsName in newNamespace', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g" newNamespace>
    <point name="P" labelIsName>(5,6)</point>
    <point labelIsName>
      (1,3)
    </point>
  </graph>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log(`Labels are P and P'`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/g/P'].stateValues.label).eq('P')
      expect(stateVariables['/g/_point2'].stateValues.label).eq(`_point2`)
      expect(stateVariables['/g/_point2'].stateValues.labelForGraph).eq(`&UnderBar;point2`)
    })

  })

  it('labelIsName converts case', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="the_first_point" labelIsName>(5,6)</point>
    <point name="the-second-point" labelIsName>(1,3)</point>
    <point name="theThirdPoint" labelIsName>(-2,1)</point>
    <point name="TheFourthPoint" labelIsName>(7,-5)</point>
    <point name="the-FIFTH_Point" labelIsName>(-6,-8)</point>
    <point name="the_SiXiTH-Point" labelIsName>(9,0)</point>
  </graph>

  <p><text copySource="the_first_point" copyProp="label" name="l1" /></p>
  <p><label copySource="the-second-point" copyProp="label" name="l2" /></p>
  <p><text copySource="theThirdPoint" copyProp="label" name="l3" /></p>
  <p><label copySource="TheFourthPoint" copyProp="label" name="l4" /></p>
  <p><text copySource="the-FIFTH_Point" copyProp="label" name="l5" /></p>
  <p><label copySource="the_SiXiTH-Point" copyProp="label" name="l6" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/l1").should('have.text', 'the first point');
    cy.get("#\\/l2").should('have.text', 'the second point');
    cy.get("#\\/l3").should('have.text', 'the third point');
    cy.get("#\\/l4").should('have.text', 'The Fourth Point');
    cy.get("#\\/l5").should('have.text', 'the FIFTH Point');
    cy.get("#\\/l6").should('have.text', 'the SiXiTH Point');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/the_first_point'].stateValues.label).eq('the first point')
      expect(stateVariables['/the-second-point'].stateValues.label).eq('the second point')
      expect(stateVariables['/theThirdPoint'].stateValues.label).eq('the third point')
      expect(stateVariables['/TheFourthPoint'].stateValues.label).eq('The Fourth Point')
      expect(stateVariables['/the-FIFTH_Point'].stateValues.label).eq('the FIFTH Point')
      expect(stateVariables['/the_SiXiTH-Point'].stateValues.label).eq('the SiXiTH Point')
    })

  })

  it('labelIsName and copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="A" labelIsName />
  </graph>
  <graph>
    <point copySource="A" name="B" />
  </graph>
  <graph>
    <copy source="A" assignNames="C" />
  </graph>
  <graph>
    <point copySource="A" name="D" labelIsName/>
  </graph>
  <graph>
    <copy source="A" assignNames="E" labelIsName />
  </graph>
  <graph>
    <point copySource="A" labelIsName/>
  </graph>
  <graph>
    <copy source="A" labelIsName />
  </graph>

  <p><text copySource="A" copyProp="label" name="lA" /></p>
  <p><label copySource="B" copyProp="label" name="lB" /></p>
  <p><text copySource="C" copyProp="label" name="lC" /></p>
  <p><label copySource="D" copyProp="label" name="lD" /></p>
  <p><text copySource="E" copyProp="label" name="lE" /></p>
  <p><label copySource="_point4" copyProp="label" name="lp4" /></p>
  <p><label copySource="_copy3" copyProp="label" name="lc3" /></p>

  <p><textinput bindValueTo="$A.label" name="tiA" /></p>
  <p><textinput bindValueTo="$B.label" name="tiB" /></p>
  <p><textinput bindValueTo="$C.label" name="tiC" /></p>
  <p><textinput bindValueTo="$D.label" name="tiD" /></p>
  <p><textinput bindValueTo="$E.label" name="tiE" /></p>
  <p><textinput bindValueTo="$_point4.label" name="tip4" /></p>
  <p><textinput bindValueTo="$_copy3.label" name="tic3" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/lA").should('have.text', 'A');
    cy.get("#\\/lB").should('have.text', 'A');
    cy.get("#\\/lC").should('have.text', 'A');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'E');
    cy.get("#\\/lp4").should('have.text', '_point4');
    cy.get("#\\/lc3").should('have.text', 'A');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('A')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('A')
      expect(stateVariables['/B'].stateValues.label).eq('A')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('A')
      expect(stateVariables['/C'].stateValues.label).eq('A')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('A')
      expect(stateVariables['/D'].stateValues.label).eq('D')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('D')
      expect(stateVariables['/E'].stateValues.label).eq('E')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('E')
      expect(stateVariables['/_point4'].stateValues.label).eq('_point4')
      expect(stateVariables['/_point4'].stateValues.labelForGraph).eq('&UnderBar;point4')
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq('A')
      expect(stateVariables[c3p].stateValues.labelForGraph).eq('A')
    })


    cy.get('#\\/tiA_input').type("{end}{backspace}F{enter}");

    cy.get("#\\/lA").should('have.text', 'F');
    cy.get("#\\/lB").should('have.text', 'F');
    cy.get("#\\/lC").should('have.text', 'F');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'E');
    cy.get("#\\/lp4").should('have.text', '_point4');
    cy.get("#\\/lc3").should('have.text', 'A');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('F')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('F')
      expect(stateVariables['/B'].stateValues.label).eq('F')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('F')
      expect(stateVariables['/C'].stateValues.label).eq('F')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('F')
      expect(stateVariables['/D'].stateValues.label).eq('D')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('D')
      expect(stateVariables['/E'].stateValues.label).eq('E')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('E')
      expect(stateVariables['/_point4'].stateValues.label).eq('_point4')
      expect(stateVariables['/_point4'].stateValues.labelForGraph).eq('&UnderBar;point4')
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq('A')
      expect(stateVariables[c3p].stateValues.labelForGraph).eq('A')
    })


    cy.get('#\\/tiB_input').type("{end}{backspace}G{enter}");

    cy.get("#\\/lA").should('have.text', 'G');
    cy.get("#\\/lB").should('have.text', 'G');
    cy.get("#\\/lC").should('have.text', 'G');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'E');
    cy.get("#\\/lp4").should('have.text', '_point4');
    cy.get("#\\/lc3").should('have.text', 'A');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('G')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('G')
      expect(stateVariables['/B'].stateValues.label).eq('G')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('G')
      expect(stateVariables['/C'].stateValues.label).eq('G')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('G')
      expect(stateVariables['/D'].stateValues.label).eq('D')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('D')
      expect(stateVariables['/E'].stateValues.label).eq('E')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('E')
      expect(stateVariables['/_point4'].stateValues.label).eq('_point4')
      expect(stateVariables['/_point4'].stateValues.labelForGraph).eq('&UnderBar;point4')
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq('A')
      expect(stateVariables[c3p].stateValues.labelForGraph).eq('A')
    })


    cy.get('#\\/tiC_input').type("{end}{backspace}H{enter}");

    cy.get("#\\/lA").should('have.text', 'H');
    cy.get("#\\/lB").should('have.text', 'H');
    cy.get("#\\/lC").should('have.text', 'H');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'E');
    cy.get("#\\/lp4").should('have.text', '_point4');
    cy.get("#\\/lc3").should('have.text', 'A');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('H')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/B'].stateValues.label).eq('H')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/C'].stateValues.label).eq('H')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/D'].stateValues.label).eq('D')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('D')
      expect(stateVariables['/E'].stateValues.label).eq('E')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('E')
      expect(stateVariables['/_point4'].stateValues.label).eq('_point4')
      expect(stateVariables['/_point4'].stateValues.labelForGraph).eq('&UnderBar;point4')
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq('A')
      expect(stateVariables[c3p].stateValues.labelForGraph).eq('A')
    })


    cy.get('#\\/tiD_input').type("{end}{backspace}I{enter}");

    cy.get("#\\/lA").should('have.text', 'H');
    cy.get("#\\/lB").should('have.text', 'H');
    cy.get("#\\/lC").should('have.text', 'H');
    cy.get("#\\/lD").should('have.text', 'I');
    cy.get("#\\/lE").should('have.text', 'E');
    cy.get("#\\/lp4").should('have.text', '_point4');
    cy.get("#\\/lc3").should('have.text', 'A');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('H')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/B'].stateValues.label).eq('H')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/C'].stateValues.label).eq('H')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/D'].stateValues.label).eq('I')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('I')
      expect(stateVariables['/E'].stateValues.label).eq('E')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('E')
      expect(stateVariables['/_point4'].stateValues.label).eq('_point4')
      expect(stateVariables['/_point4'].stateValues.labelForGraph).eq('&UnderBar;point4')
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq('A')
      expect(stateVariables[c3p].stateValues.labelForGraph).eq('A')
    })


    cy.get('#\\/tiE_input').type("{end}{backspace}J{enter}");

    cy.get("#\\/lA").should('have.text', 'H');
    cy.get("#\\/lB").should('have.text', 'H');
    cy.get("#\\/lC").should('have.text', 'H');
    cy.get("#\\/lD").should('have.text', 'I');
    cy.get("#\\/lE").should('have.text', 'J');
    cy.get("#\\/lp4").should('have.text', '_point4');
    cy.get("#\\/lc3").should('have.text', 'A');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('H')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/B'].stateValues.label).eq('H')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/C'].stateValues.label).eq('H')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/D'].stateValues.label).eq('I')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('I')
      expect(stateVariables['/E'].stateValues.label).eq('J')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('J')
      expect(stateVariables['/_point4'].stateValues.label).eq('_point4')
      expect(stateVariables['/_point4'].stateValues.labelForGraph).eq('&UnderBar;point4')
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq('A')
      expect(stateVariables[c3p].stateValues.labelForGraph).eq('A')
    })


    cy.get('#\\/tip4_input').type("{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}K{enter}");

    cy.get("#\\/lA").should('have.text', 'H');
    cy.get("#\\/lB").should('have.text', 'H');
    cy.get("#\\/lC").should('have.text', 'H');
    cy.get("#\\/lD").should('have.text', 'I');
    cy.get("#\\/lE").should('have.text', 'J');
    cy.get("#\\/lp4").should('have.text', 'K');
    cy.get("#\\/lc3").should('have.text', 'A');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('H')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/B'].stateValues.label).eq('H')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/C'].stateValues.label).eq('H')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/D'].stateValues.label).eq('I')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('I')
      expect(stateVariables['/E'].stateValues.label).eq('J')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('J')
      expect(stateVariables['/_point4'].stateValues.label).eq('K')
      expect(stateVariables['/_point4'].stateValues.labelForGraph).eq('K')
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq('A')
      expect(stateVariables[c3p].stateValues.labelForGraph).eq('A')
    })


    cy.get('#\\/tic3_input').type("{end}{backspace}L{enter}");

    cy.get("#\\/lA").should('have.text', 'H');
    cy.get("#\\/lB").should('have.text', 'H');
    cy.get("#\\/lC").should('have.text', 'H');
    cy.get("#\\/lD").should('have.text', 'I');
    cy.get("#\\/lE").should('have.text', 'J');
    cy.get("#\\/lp4").should('have.text', 'K');
    cy.get("#\\/lc3").should('have.text', 'L');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('H')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/B'].stateValues.label).eq('H')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/C'].stateValues.label).eq('H')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('H')
      expect(stateVariables['/D'].stateValues.label).eq('I')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('I')
      expect(stateVariables['/E'].stateValues.label).eq('J')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('J')
      expect(stateVariables['/_point4'].stateValues.label).eq('K')
      expect(stateVariables['/_point4'].stateValues.labelForGraph).eq('K')
      let c3p = stateVariables["/_copy3"].replacements[0].componentName;
      expect(stateVariables[c3p].stateValues.label).eq('L')
      expect(stateVariables[c3p].stateValues.labelForGraph).eq('L')
    })

  })

  it('label, labelIsName and copies, start with label', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
  
    <point name="A">
      <label>A</label>
    </point>
    <point copysource="A" name="B" x="1" />
    <point copysource="A" labelIsName name="C" x="2" />
    <point copysource="A" name="D" x="3"><label>D</label></point>

    <point copysource="B" name="E" x="1" y="1" />
    <point copysource="B" labelIsName name="F" x="2" y="1" />
    <point copysource="B" name="G" x="3" y="1"><label>G</label></point>

    <point copysource="C" name="H" x="1" y="2" />
    <point copysource="C" labelIsName name="I" x="2" y="2" />
    <point copysource="C" name="J" x="3" y="2"><label>J</label></point>

    <point copysource="D" name="K" x="1" y="3" />
    <point copysource="D" labelIsName name="L" x="2" y="3" />
    <point copysource="D" name="M" x="3" y="3"><label>M</label></point>

  </graph>

  <p><text copySource="A.label" name="lA" /></p>
  <p><text copySource="B.label" name="lB" /></p>
  <p><text copySource="C.label" name="lC" /></p>
  <p><text copySource="D.label" name="lD" /></p>
  <p><text copySource="E.label" name="lE" /></p>
  <p><text copySource="F.label" name="lF" /></p>
  <p><text copySource="G.label" name="lG" /></p>
  <p><text copySource="H.label" name="lH" /></p>
  <p><text copySource="I.label" name="lI" /></p>
  <p><text copySource="J.label" name="lJ" /></p>
  <p><text copySource="K.label" name="lK" /></p>
  <p><text copySource="L.label" name="lL" /></p>
  <p><text copySource="M.label" name="lM" /></p>

  <p>Change label of A: <textinput bindValueTo="$A.label" name="tiA" /></p>
  <p>Change label of B: <textinput bindValueTo="$B.label" name="tiB" /></p>
  <p>Change label of C: <textinput bindValueTo="$C.label" name="tiC" /></p>
  <p>Change label of D: <textinput bindValueTo="$D.label" name="tiD" /></p>
  <p>Change label of E: <textinput bindValueTo="$E.label" name="tiE" /></p>
  <p>Change label of F: <textinput bindValueTo="$F.label" name="tiF" /></p>
  <p>Change label of G: <textinput bindValueTo="$G.label" name="tiG" /></p>
  <p>Change label of H: <textinput bindValueTo="$H.label" name="tiH" /></p>
  <p>Change label of I: <textinput bindValueTo="$I.label" name="tiI" /></p>
  <p>Change label of J: <textinput bindValueTo="$J.label" name="tiJ" /></p>
  <p>Change label of K: <textinput bindValueTo="$K.label" name="tiK" /></p>
  <p>Change label of L: <textinput bindValueTo="$L.label" name="tiL" /></p>
  <p>Change label of M: <textinput bindValueTo="$M.label" name="tiM" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/lA").should('have.text', 'A');
    cy.get("#\\/lB").should('have.text', 'A');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'A');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiA_input').type("{end}{backspace}N{enter}");

    cy.get("#\\/lA").should('have.text', 'N');
    cy.get("#\\/lB").should('have.text', 'N');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'N');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiB_input').type("{end}{backspace}O{enter}");

    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiC_input').type("{end}{backspace}P{enter}");

    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiD_input').type("{end}{backspace}Q{enter}");

    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiE_input').type("{end}{backspace}R{enter}");

    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiF_input').type("{end}{backspace}S{enter}");

    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiG_input').type("{end}{backspace}T{enter}");

    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiH_input').type("{end}{backspace}U{enter}");
    
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiI_input').type("{end}{backspace}V{enter}");

    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiJ_input').type("{end}{backspace}W{enter}");

    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiK_input').type("{end}{backspace}X{enter}");
    
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiL_input').type("{end}{backspace}Y{enter}");
    
    cy.get("#\\/lL").should('have.text', 'Y');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiM_input').type("{end}{backspace}Z{enter}");

    cy.get("#\\/lM").should('have.text', 'Z');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lL").should('have.text', 'Y');

  })

  it('label, labelIsName and copies, start with labelIsName', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
  
    <point name="A" labelIsName />
    <point copysource="A" name="B" x="1" />
    <point copysource="A" labelIsName name="C" x="2" />
    <point copysource="A" name="D" x="3"><label>D</label></point>

    <point copysource="B" name="E" x="1" y="1" />
    <point copysource="B" labelIsName name="F" x="2" y="1" />
    <point copysource="B" name="G" x="3" y="1"><label>G</label></point>

    <point copysource="C" name="H" x="1" y="2" />
    <point copysource="C" labelIsName name="I" x="2" y="2" />
    <point copysource="C" name="J" x="3" y="2"><label>J</label></point>

    <point copysource="D" name="K" x="1" y="3" />
    <point copysource="D" labelIsName name="L" x="2" y="3" />
    <point copysource="D" name="M" x="3" y="3"><label>M</label></point>

  </graph>

  <p><text copySource="A.label" name="lA" /></p>
  <p><text copySource="B.label" name="lB" /></p>
  <p><text copySource="C.label" name="lC" /></p>
  <p><text copySource="D.label" name="lD" /></p>
  <p><text copySource="E.label" name="lE" /></p>
  <p><text copySource="F.label" name="lF" /></p>
  <p><text copySource="G.label" name="lG" /></p>
  <p><text copySource="H.label" name="lH" /></p>
  <p><text copySource="I.label" name="lI" /></p>
  <p><text copySource="J.label" name="lJ" /></p>
  <p><text copySource="K.label" name="lK" /></p>
  <p><text copySource="L.label" name="lL" /></p>
  <p><text copySource="M.label" name="lM" /></p>

  <p>Change label of A: <textinput bindValueTo="$A.label" name="tiA" /></p>
  <p>Change label of B: <textinput bindValueTo="$B.label" name="tiB" /></p>
  <p>Change label of C: <textinput bindValueTo="$C.label" name="tiC" /></p>
  <p>Change label of D: <textinput bindValueTo="$D.label" name="tiD" /></p>
  <p>Change label of E: <textinput bindValueTo="$E.label" name="tiE" /></p>
  <p>Change label of F: <textinput bindValueTo="$F.label" name="tiF" /></p>
  <p>Change label of G: <textinput bindValueTo="$G.label" name="tiG" /></p>
  <p>Change label of H: <textinput bindValueTo="$H.label" name="tiH" /></p>
  <p>Change label of I: <textinput bindValueTo="$I.label" name="tiI" /></p>
  <p>Change label of J: <textinput bindValueTo="$J.label" name="tiJ" /></p>
  <p>Change label of K: <textinput bindValueTo="$K.label" name="tiK" /></p>
  <p>Change label of L: <textinput bindValueTo="$L.label" name="tiL" /></p>
  <p>Change label of M: <textinput bindValueTo="$M.label" name="tiM" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/lA").should('have.text', 'A');
    cy.get("#\\/lB").should('have.text', 'A');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'A');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiA_input').type("{end}{backspace}N{enter}");

    cy.get("#\\/lA").should('have.text', 'N');
    cy.get("#\\/lB").should('have.text', 'N');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'N');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiB_input').type("{end}{backspace}O{enter}");

    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiC_input').type("{end}{backspace}P{enter}");

    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiD_input').type("{end}{backspace}Q{enter}");

    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiE_input').type("{end}{backspace}R{enter}");

    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiF_input').type("{end}{backspace}S{enter}");

    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiG_input').type("{end}{backspace}T{enter}");

    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiH_input').type("{end}{backspace}U{enter}");
    
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiI_input').type("{end}{backspace}V{enter}");

    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiJ_input').type("{end}{backspace}W{enter}");

    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiK_input').type("{end}{backspace}X{enter}");
    
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiL_input').type("{end}{backspace}Y{enter}");
    
    cy.get("#\\/lL").should('have.text', 'Y');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiM_input').type("{end}{backspace}Z{enter}");

    cy.get("#\\/lM").should('have.text', 'Z');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lL").should('have.text', 'Y');

  })

  it('label, labelIsName and copies, copy in labels', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
  
    <point name="A" >
      <label copySource="Al" />
    </point>
    <point copysource="A" name="B" x="1" />
    <point copysource="A" labelIsName name="C" x="2" />
    <point copysource="A" name="D" x="3"><label copySource="Dl"/></point>

    <point copysource="B" name="E" x="1" y="1" />
    <point copysource="B" labelIsName name="F" x="2" y="1" />
    <point copysource="B" name="G" x="3" y="1"><label copysource="Gl" /></point>

    <point copysource="C" name="H" x="1" y="2" />
    <point copysource="C" labelIsName name="I" x="2" y="2" />
    <point copysource="C" name="J" x="3" y="2"><label copySource="Jl" /></point>

    <point copysource="D" name="K" x="1" y="3" />
    <point copysource="D" labelIsName name="L" x="2" y="3" />
    <point copysource="D" name="M" x="3" y="3"><label>M</label></point>

  </graph>

  <label name="Al0">A</label>
  <label name="Al" copySource="Al0" />
  <label name="Dl">D</label>
  <label name="Gl0">G</label>
  <label name="Gl" copySource="Gl0" />
  <label name="Jl0">J</label>
  <label name="Jl1" copySource="Jl0" />
  <label name="Jl" copySource="Jl1" />


  <p><text copySource="A.label" name="lA" /></p>
  <p><text copySource="B.label" name="lB" /></p>
  <p><text copySource="C.label" name="lC" /></p>
  <p><text copySource="D.label" name="lD" /></p>
  <p><text copySource="E.label" name="lE" /></p>
  <p><text copySource="F.label" name="lF" /></p>
  <p><text copySource="G.label" name="lG" /></p>
  <p><text copySource="H.label" name="lH" /></p>
  <p><text copySource="I.label" name="lI" /></p>
  <p><text copySource="J.label" name="lJ" /></p>
  <p><text copySource="K.label" name="lK" /></p>
  <p><text copySource="L.label" name="lL" /></p>
  <p><text copySource="M.label" name="lM" /></p>

  <p>Change label of A: <textinput bindValueTo="$A.label" name="tiA" /></p>
  <p>Change label of B: <textinput bindValueTo="$B.label" name="tiB" /></p>
  <p>Change label of C: <textinput bindValueTo="$C.label" name="tiC" /></p>
  <p>Change label of D: <textinput bindValueTo="$D.label" name="tiD" /></p>
  <p>Change label of E: <textinput bindValueTo="$E.label" name="tiE" /></p>
  <p>Change label of F: <textinput bindValueTo="$F.label" name="tiF" /></p>
  <p>Change label of G: <textinput bindValueTo="$G.label" name="tiG" /></p>
  <p>Change label of H: <textinput bindValueTo="$H.label" name="tiH" /></p>
  <p>Change label of I: <textinput bindValueTo="$I.label" name="tiI" /></p>
  <p>Change label of J: <textinput bindValueTo="$J.label" name="tiJ" /></p>
  <p>Change label of K: <textinput bindValueTo="$K.label" name="tiK" /></p>
  <p>Change label of L: <textinput bindValueTo="$L.label" name="tiL" /></p>
  <p>Change label of M: <textinput bindValueTo="$M.label" name="tiM" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/lA").should('have.text', 'A');
    cy.get("#\\/lB").should('have.text', 'A');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'A');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiA_input').type("{end}{backspace}N{enter}");

    cy.get("#\\/lA").should('have.text', 'N');
    cy.get("#\\/lB").should('have.text', 'N');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'N');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiB_input').type("{end}{backspace}O{enter}");

    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lC").should('have.text', 'C');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'C');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiC_input').type("{end}{backspace}P{enter}");

    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lD").should('have.text', 'D');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'D');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiD_input').type("{end}{backspace}Q{enter}");

    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lA").should('have.text', 'O');
    cy.get("#\\/lB").should('have.text', 'O');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lE").should('have.text', 'O');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiE_input').type("{end}{backspace}R{enter}");

    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'F');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiF_input').type("{end}{backspace}S{enter}");

    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lG").should('have.text', 'G');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiG_input').type("{end}{backspace}T{enter}");

    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'P');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lH").should('have.text', 'P');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiH_input').type("{end}{backspace}U{enter}");
    
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'I');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiI_input').type("{end}{backspace}V{enter}");

    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lJ").should('have.text', 'J');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiJ_input').type("{end}{backspace}W{enter}");

    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'Q');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lK").should('have.text', 'Q');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiK_input').type("{end}{backspace}X{enter}");
    
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lL").should('have.text', 'L');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiL_input').type("{end}{backspace}Y{enter}");
    
    cy.get("#\\/lL").should('have.text', 'Y');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lM").should('have.text', 'M');


    cy.get('#\\/tiM_input').type("{end}{backspace}Z{enter}");

    cy.get("#\\/lM").should('have.text', 'Z');
    cy.get("#\\/lA").should('have.text', 'R');
    cy.get("#\\/lB").should('have.text', 'R');
    cy.get("#\\/lC").should('have.text', 'U');
    cy.get("#\\/lD").should('have.text', 'X');
    cy.get("#\\/lE").should('have.text', 'R');
    cy.get("#\\/lF").should('have.text', 'S');
    cy.get("#\\/lG").should('have.text', 'T');
    cy.get("#\\/lH").should('have.text', 'U');
    cy.get("#\\/lI").should('have.text', 'V');
    cy.get("#\\/lJ").should('have.text', 'W');
    cy.get("#\\/lK").should('have.text', 'X');
    cy.get("#\\/lL").should('have.text', 'Y');

  })

  it('escape underscore and caret in labelForGraph except if math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="A" >
      <label>x_1</label>
      (0,0)
    </point>
    <point name="B" >
      <label><m>x_1</m></label>
      (1,1)
    </point>
    <point name="C" >
      <label>x^1</label>
      (2,2)
    </point>
    <point name="D" >
      <label><m>x^1</m></label>
      (3,3)
    </point>
    <point name="E" >
      <label>x^1 or <m>x^2</m> or x_3 or <m>x_4</m></label>
      (4,4)
    </point>
    <point name="F" >
      <label>x_a^b or <m>x_c^d</m></label>
      (5,5)
    </point>
  </graph>

  <p>label for A: <label copySource="A" copyProp="label" name="lA" /></p>
  <p>label for B: <label copySource="B" copyProp="label" name="lB" /></p>
  <p>label for C: <label copySource="C" copyProp="label" name="lC" /></p>
  <p>label for D: <label copySource="D" copyProp="label" name="lD" /></p>
  <p>label for E: <label copySource="E" copyProp="label" name="lE" /></p>
  <p>label for F: <label copySource="F" copyProp="label" name="lF" /></p>
  <p>text of label for A: <text copySource="A" copyProp="label" name="tA" /></p>
  <p>text of label for B: <text copySource="B" copyProp="label" name="tB" /></p>
  <p>text of label for C: <text copySource="C" copyProp="label" name="tC" /></p>
  <p>text of label for D: <text copySource="D" copyProp="label" name="tD" /></p>
  <p>text of label for E: <text copySource="E" copyProp="label" name="tE" /></p>
  <p>text of label for F: <text copySource="F" copyProp="label" name="tF" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/lA").should('have.text', 'x_1');
    cy.get("#\\/lB .mjx-mrow").eq(0).should('have.text', 'x1');
    cy.get("#\\/lC").should('have.text', 'x^1');
    cy.get("#\\/lD .mjx-mrow").eq(0).should('have.text', 'x1');
    cy.get("#\\/lE").should('contain.text', 'x^1 or ');
    cy.get("#\\/lE").should('contain.text', 'or x_3 or ');
    cy.get("#\\/lE .mjx-mrow").eq(0).should('have.text', 'x2');
    cy.get("#\\/lE .mjx-mrow").eq(1).should('have.text', 'x4');
    cy.get("#\\/lF").should('contain.text', 'x_a^b or ');
    cy.get("#\\/lF .mjx-mrow").eq(0).should('have.text', 'xdc');

    cy.get("#\\/tA").should('have.text', 'x_1');
    cy.get("#\\/tB").should('have.text', 'x_1');
    cy.get("#\\/tC").should('have.text', 'x^1');
    cy.get("#\\/tD").should('have.text', 'x^1');
    cy.get("#\\/tE").should('have.text', 'x^1 or x^2 or x_3 or x_4');
    cy.get("#\\/tF").should('have.text', 'x_a^b or x_c^d');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/A'].stateValues.label).eq('x_1')
      expect(stateVariables['/A'].stateValues.labelForGraph).eq('x&UnderBar;1')
      expect(stateVariables['/B'].stateValues.label).eq('\\(x_1\\)')
      expect(stateVariables['/B'].stateValues.labelForGraph).eq('\\(x_1\\)')
      expect(stateVariables['/C'].stateValues.label).eq('x^1')
      expect(stateVariables['/C'].stateValues.labelForGraph).eq('x&Hat;1')
      expect(stateVariables['/D'].stateValues.label).eq('\\(x^1\\)')
      expect(stateVariables['/D'].stateValues.labelForGraph).eq('\\(x^1\\)')
      expect(stateVariables['/E'].stateValues.label).eq('x^1 or \\(x^2\\) or x_3 or \\(x_4\\)')
      expect(stateVariables['/E'].stateValues.labelForGraph).eq('x&Hat;1 or \\(x^2\\) or x&UnderBar;3 or \\(x_4\\)')
      expect(stateVariables['/F'].stateValues.label).eq('x_a^b or \\(x_c^d\\)')
      expect(stateVariables['/F'].stateValues.labelForGraph).eq('x&UnderBar;a&Hat;b or \\(x_c^d\\)')
    })

  })

  it('point sugar from single copied math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <graph>
      <point name="P" labelIsName>$(coords.value{createComponentOfType="math"})</point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" labelIsName/>
    </graph>
    <copy prop="coords" target="P" assignNames="Pcoords" />
    <copy prop="coords" target="Q" assignNames="Qcoords" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('initially undefined')

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '\uff3f');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/P'].stateValues.coords)).eqls('\uff3f')
      expect((stateVariables['/Q'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/Q'].stateValues.coords)).eqls('\uff3f')
    })

    cy.log('create 2D point')
    cy.get('#\\/coords textarea').type("(-1,-7){enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(−1,−7)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(−1,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", -1, -7])
      expect(stateVariables['/P'].stateValues.label).eq('P')
      expect((stateVariables['/Q'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", -1, -7])
      expect(stateVariables['/Q'].stateValues.label).eq('Q')
    })

    cy.log('move point P to (3,5)')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 }
      })
    });

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(3,5)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(3,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([3, 5])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 3, 5])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([3, 5])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 3, 5])
    })

    cy.log('move point Q to (9,1)')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 9, y: 1 }
      })
    });

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(9,1)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(9,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([9, 1])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 9, 1])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([9, 1])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 9, 1])
    })

    cy.log('make point undefined again')
    cy.get('#\\/coords textarea').type("{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '\uff3f');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/P'].stateValues.coords)).eqls('\uff3f')
      expect((stateVariables['/Q'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/Q'].stateValues.coords)).eqls('\uff3f')
    })

    cy.log('create 1D point')
    cy.get('#\\/coords textarea').type("-3{enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '−3');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '−3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([-3])
      expect((stateVariables['/P'].stateValues.coords)).eqls(-3)
      expect((stateVariables['/Q'].stateValues.xs)).eqls([-3])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(-3)
    })


    cy.log('create 3D point')
    cy.get('#\\/coords textarea').type("{end}{backspace}{backspace}(6,5,4){enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(6,5,4)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(6,5,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([6, 5, 4])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 6, 5, 4])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([6, 5, 4])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 6, 5, 4])
    })

  });

  it('point sugar from single math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <graph>
      <point name="P" labelIsName><math>$coords</math></point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" labelIsName/>
    </graph>
    <copy prop="coords" target="P" assignNames="Pcoords" />
    <copy prop="coords" target="Q" assignNames="Qcoords" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('initially undefined')

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '\uff3f');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/P'].stateValues.coords)).eqls('\uff3f')
      expect((stateVariables['/Q'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/Q'].stateValues.coords)).eqls('\uff3f')
    })

    cy.log('create 2D point')
    cy.get('#\\/coords textarea').type("(-1,-7){enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(−1,−7)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(−1,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", -1, -7])
      expect(stateVariables['/P'].stateValues.label).eq('P')
      expect((stateVariables['/Q'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", -1, -7])
      expect(stateVariables['/Q'].stateValues.label).eq('Q')
    })

    cy.log('move point P to (3,5)')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 }
      })
    });

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(3,5)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(3,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([3, 5])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 3, 5])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([3, 5])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 3, 5])
    })

    cy.log('move point Q to (9,1)')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 9, y: 1 }
      })
    });

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(9,1)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(9,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([9, 1])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 9, 1])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([9, 1])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 9, 1])
    })

    cy.log('make point undefined again')
    cy.get('#\\/coords textarea').type("{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '\uff3f');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/P'].stateValues.coords)).eqls('\uff3f')
      expect((stateVariables['/Q'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/Q'].stateValues.coords)).eqls('\uff3f')
    })

    cy.log('create 1D point')
    cy.get('#\\/coords textarea').type("-3{enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '−3');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '−3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([-3])
      expect((stateVariables['/P'].stateValues.coords)).eqls(-3)
      expect((stateVariables['/Q'].stateValues.xs)).eqls([-3])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(-3)
    })


    cy.log('create 3D point')
    cy.get('#\\/coords textarea').type("{end}{backspace}{backspace}(6,5,4){enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(6,5,4)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(6,5,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([6, 5, 4])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 6, 5, 4])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([6, 5, 4])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 6, 5, 4])
    })

  });

  it('point from vector with sugared single math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <graph>
      <point name="P" labelIsName><vector><math>$coords</math></vector></point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" labelIsName/>
    </graph>
    <copy prop="coords" target="P" assignNames="Pcoords" />
    <copy prop="coords" target="Q" assignNames="Qcoords" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('initially undefined')

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '\uff3f');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/P'].stateValues.coords)).eqls('\uff3f')
      expect((stateVariables['/Q'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/Q'].stateValues.coords)).eqls('\uff3f')
    })

    cy.log('create 2D point')
    cy.get('#\\/coords textarea').type("(-1,-7){enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(−1,−7)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(−1,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", -1, -7])
      expect(stateVariables['/P'].stateValues.label).eq('P')
      expect((stateVariables['/Q'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", -1, -7])
      expect(stateVariables['/Q'].stateValues.label).eq('Q')
    })

    cy.log('move point P to (3,5)')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 }
      })
    });

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(3,5)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(3,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([3, 5])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 3, 5])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([3, 5])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 3, 5])
    })

    cy.log('move point Q to (9,1)')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 9, y: 1 }
      })
    });

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(9,1)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(9,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([9, 1])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 9, 1])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([9, 1])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 9, 1])
    })

    cy.log('make point undefined again')
    cy.get('#\\/coords textarea').type("{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '\uff3f');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/P'].stateValues.coords)).eqls('\uff3f')
      expect((stateVariables['/Q'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/Q'].stateValues.coords)).eqls('\uff3f')
    })

    cy.log('create 1D point')
    cy.get('#\\/coords textarea').type("-3{enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '−3');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '−3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([-3])
      expect((stateVariables['/P'].stateValues.coords)).eqls(-3)
      expect((stateVariables['/Q'].stateValues.xs)).eqls([-3])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(-3)
    })


    cy.log('create 3D point')
    cy.get('#\\/coords textarea').type("{end}{backspace}{backspace}(6,5,4){enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(6,5,4)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(6,5,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([6, 5, 4])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 6, 5, 4])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([6, 5, 4])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 6, 5, 4])
    })

  });

  it('point from copied vector with sugared single math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="coords" />
    <vector name="v"><math>$coords</math></vector>
    <graph>
      <point name="P" labelIsName>$v</point>
    </graph>
    <graph>
      <copy target="P" assignNames="Q" labelIsName/>
    </graph>
    <copy prop="coords" target="P" assignNames="Pcoords" />
    <copy prop="coords" target="Q" assignNames="Qcoords" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('initially undefined')

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '\uff3f');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/P'].stateValues.coords)).eqls('\uff3f')
      expect((stateVariables['/Q'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/Q'].stateValues.coords)).eqls('\uff3f')
    })

    cy.log('create 2D point')
    cy.get('#\\/coords textarea').type("(-1,-7){enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(−1,−7)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(−1,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", -1, -7])
      expect(stateVariables['/P'].stateValues.label).eq('P')
      expect((stateVariables['/Q'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", -1, -7])
      expect(stateVariables['/Q'].stateValues.label).eq('Q')
    })

    cy.log('move point P to (3,5)')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 }
      })
    });

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(3,5)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(3,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([3, 5])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 3, 5])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([3, 5])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 3, 5])
    })

    cy.log('move point Q to (9,1)')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 9, y: 1 }
      })
    });

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(9,1)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(9,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([9, 1])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 9, 1])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([9, 1])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 9, 1])
    })

    cy.log('make point undefined again')
    cy.get('#\\/coords textarea').type("{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '\uff3f');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '\uff3f');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/P'].stateValues.coords)).eqls('\uff3f')
      expect((stateVariables['/Q'].stateValues.xs)).eqls(['\uff3f'])
      expect((stateVariables['/Q'].stateValues.coords)).eqls('\uff3f')
    })

    cy.log('create 1D point')
    cy.get('#\\/coords textarea').type("-3{enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '−3');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '−3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([-3])
      expect((stateVariables['/P'].stateValues.coords)).eqls(-3)
      expect((stateVariables['/Q'].stateValues.xs)).eqls([-3])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(-3)
    })


    cy.log('create 3D point')
    cy.get('#\\/coords textarea').type("{end}{backspace}{backspace}(6,5,4){enter}", { force: true })

    cy.get('#\\/Pcoords .mjx-mrow').should('contain.text', '(6,5,4)');
    cy.get('#\\/Qcoords .mjx-mrow').should('contain.text', '(6,5,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/P'].stateValues.xs)).eqls([6, 5, 4])
      expect((stateVariables['/P'].stateValues.coords)).eqls(["vector", 6, 5, 4])
      expect((stateVariables['/Q'].stateValues.xs)).eqls([6, 5, 4])
      expect((stateVariables['/Q'].stateValues.coords)).eqls(["vector", 6, 5, 4])
    })

  });

  it('test invertible due to modifyIndirectly', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (0.5<math>2</math><math modifyIndirectly="false">3</math>, <math name="y">1</math>)
  </point>
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(3,1)');

    cy.log(`we can move point`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 7, y: -5 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(7,−5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(7, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(-5, 1E-12)
      expect(me.fromAst(stateVariables['/_math1'].stateValues.value).evaluate_to_constant()).closeTo(7 / 1.5, 1E-12)
      expect((stateVariables['/_math2'].stateValues.value)).closeTo(3, 1E-12)
      expect((stateVariables['/y'].stateValues.value)).closeTo(-5, 1E-12)
    })

  })

  it('define 2D point from 3D point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<copy prop="y" target="source" />,<copy prop="z" target="source" />)
  </point>
  </graph>

  <point name="source">
    (<math modifyIndirectly="false">a</math>,2,3)
  </point>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(2,3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(2, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(3, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[0]).eq("a")
      expect((stateVariables['/source'].stateValues.xs)[1]).closeTo(2, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[2]).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -4, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−4,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(-4, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(-7, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[0]).eq("a")
      expect((stateVariables['/source'].stateValues.xs)[1]).closeTo(-4, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[2]).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from 3D point, copying xj', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<copy prop="x2" target="source" />,<copy prop="x3" target="source" />)
  </point>
  </graph>

  <point name="source">
    (<math modifyIndirectly="false">a</math>,2,3)
  </point>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(2,3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(2, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(3, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[0]).eq("a")
      expect((stateVariables['/source'].stateValues.xs)[1]).closeTo(2, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[2]).closeTo(3, 1E-12)
    })

    cy.log('move point 1')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -4, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−4,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(-4, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(-7, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[0]).eq("a")
      expect((stateVariables['/source'].stateValues.xs)[1]).closeTo(-4, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[2]).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from 3D point, separate coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point x="$(source.y)" y = "$(source.z)" />
  </graph>

  <math name="a" modifyIndirectly="false">a</math>
  <point name="source" x="$a" y="2" z="3" />
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(2,3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(2, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(3, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[0]).eq("a")
      expect((stateVariables['/source'].stateValues.xs)[1]).closeTo(2, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[2]).closeTo(3, 1E-12)
    })

    cy.log('move point 1')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -4, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−4,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(-4, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(-7, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[0]).eq("a")
      expect((stateVariables['/source'].stateValues.xs)[1]).closeTo(-4, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[2]).closeTo(-7, 1E-12)
    })
  })

  it('define 2D point from double-copied 3D point, separate coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point x="$(source3.y)" y = "$(source3.z)" />
  </graph>

  <copy name="source2" target="source" />
  <math name="a" modifyIndirectly="false">a</math>
  <point name="source" x="$a" y="2" z="3" />
  <copy name="source3" target="source2" />
  <copy prop="coords" target="_point1" assignNames="coords1" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.log('points are where they should be')

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(2,3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(2, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(3, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[0]).eq("a")
      expect((stateVariables['/source'].stateValues.xs)[1]).closeTo(2, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[2]).closeTo(3, 1E-12)
    })


    cy.log('move point 1')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -4, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−4,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(-4, 1E-12)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(-7, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[0]).eq("a")
      expect((stateVariables['/source'].stateValues.xs)[1]).closeTo(-4, 1E-12)
      expect((stateVariables['/source'].stateValues.xs)[2]).closeTo(-7, 1E-12)
    })
  })

  it('point on graph that is copied in two ways', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
  <point>(1,2)
  </point>
  </graph>
  <copy target="g1" assignNames="g2" />
  <graph>
  <copy assignNames="p3" target="/g1/_point1" />
  </graph>
  <copy prop="coords" target="p3" assignNames="coords1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(1,2)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/g1/_point1'].stateValues.xs).eqls([1, 2])
      expect(stateVariables['/g2/_point1'].stateValues.xs).eqls([1, 2])
      expect(stateVariables['/p3'].stateValues.xs).eqls([1, 2])
    })

    cy.log(`move point1 to (4,6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/_point1",
        args: { x: 4, y: 6 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(4,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/g1/_point1'].stateValues.xs).eqls([4, 6])
      expect(stateVariables['/g2/_point1'].stateValues.xs).eqls([4, 6])
      expect(stateVariables['/p3'].stateValues.xs).eqls([4, 6])
    })

    cy.log(`move point2 to (-3,-7)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/_point1",
        args: { x: -3, y: -7 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−3,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/g1/_point1'].stateValues.xs).eqls([-3, -7])
      expect(stateVariables['/g2/_point1'].stateValues.xs).eqls([-3, -7])
      expect(stateVariables['/p3'].stateValues.xs).eqls([-3, -7])
    })

    cy.log(`move point3 to (9,-2)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: 9, y: -2 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(9,−2)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/g1/_point1'].stateValues.xs).eqls([9, -2])
      expect(stateVariables['/g2/_point1'].stateValues.xs).eqls([9, -2])
      expect(stateVariables['/p3'].stateValues.xs).eqls([9, -2])
    })

  });

  it('point draggable but constrained to x = y^2/10', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<copy target="y" />^2/10, <math name="y">1</math>)
  </point>
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(110,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eqls(['/', 1, 10]);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(1)

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 6 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(185,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eqls(['/', 18, 5])
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(6)
    })

    cy.log(`move point1 to (9,-3)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -3 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(910,−3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eqls(['/', 9, 10])
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-3)
    })


  });

  it('point draggable but constrained to y = sin(x)', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<math name="x">1</math>, sin($x))
  </point>
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(1,sin(1))');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eqls(['apply', 'sin', 1]);

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 6 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−9,sin(−9))');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-9)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eqls(['apply', 'sin', -9]);
    })

    cy.log(`move point1 to (9,-3)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -3 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(9,sin(9))');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(9)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eqls(['apply', 'sin', 9])
    })


  });

  it('point reflected across line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>
    (<copy prop="y" target="_point1" />, <copy prop="x" target="_point1" />)
  </point>
  <line draggable="false">x=y</line>
  </graph>
  <copy prop="coords" target="_point2" assignNames="coords2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(2,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(2);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(2);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(1);

    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 6 }
      })
    })

    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(6,−9)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-9)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(6);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(6)
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(-9);
    })

    cy.log(`move point2 to (0,-3)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 0, y: -3 }
      })
    })

    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(0,−3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-3)
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(0)
      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(0)
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(-3)
    })

  });

  it('point not draggable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point draggable="false">(1,2)</point>
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(2);
    })

    cy.log(`move point1 to (-9,6)`)
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 6 }
      })
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(2);
    })

  });

  it('point on line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    ($d,3-$d)
  </point>
  </graph>
  <math name="d">5</math>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(5,−2)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(5);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-2);
    })

    cy.log(`move point1 to (8,8)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8, y: 8 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(8,−5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(8);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-5);
    })

  });

  it('points draggable even with complicated dependence', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>q</text>
  <graph>

  <point>
  (<copy prop="y" target="_point2" />,
  <copy target="a" />)
  </point>
  <point>(5,3)</point>

  </graph>

  <math name="a"><copy prop="x" target="_point2" />+1</math>
  `}, "*");
    });

    cy.get('#\\/_text1').should("have.text", 'q');  // to wait until loaded

    cy.get('#\\/a .mjx-mrow').should('contain.text', '5+1');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(5);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(6);
    })

    cy.log(`move point1 to (-4,-8)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -4, y: -8 }
      })
    })

    cy.get('#\\/a .mjx-mrow').should('contain.text', '−4+1');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(-4);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(-8);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-8);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-3);
    })

    cy.log(`move point2 to (-9,10)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 10 }
      })
    })

    cy.get('#\\/a .mjx-mrow').should('contain.text', '9+1');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(9);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(-9);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-9);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(10);
    })

  });

  // The behavior of this test varies widely depending on update order
  // When finalize exactly how we want the updates to occur, could resurrect this
  it.skip('points related through intermediate math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
  (<copy target="a" />,
  <copy prop="x" target="_point2" />)
  </point>
  <point>(<copy target="d" />,3-<copy target="d" />)</point>
  </graph>

  <math name="a" simplify modifyIndirectly="true"><copy target="b" />+1</math>,
  <math name="b" simplify modifyIndirectly="true"><copy prop="y" target="_point2" /><copy target="c" /></math>,
  <math name="c" simplify modifyIndirectly="false"><copy prop="x" target="_point2" /><copy target="d" />*0.01</math>,
  <math name="d" simplify modifyIndirectly="true">5</math>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')
    cy.get('#\\/d .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let d = 5;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(point1x, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(point1y, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(point2x, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(point2y, 1E-12);
      expect((stateVariables['/d'].stateValues.value)).closeTo(d, 1E-12);
      expect((stateVariables['/c'].stateValues.value)).closeTo(c, 1E-12);
      expect((stateVariables['/b'].stateValues.value)).closeTo(b, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(a, 1E-12);

    })

    cy.log(`move point2 along constained line`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let d = -6;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: point2x, y: point2y }
      });
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(point1x, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(point1y, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(point2x, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(point2y, 1E-12);
      expect((stateVariables['/d'].stateValues.value)).closeTo(d, 1E-12);
      expect((stateVariables['/c'].stateValues.value)).closeTo(c, 1E-12);
      expect((stateVariables['/b'].stateValues.value)).closeTo(b, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(a, 1E-12);
    })

    cy.log(`move point1 along constained curve`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let d = 7;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: point1x, y: point1y }
      });
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(point1x, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(point1y, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(point2x, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(point2y, 1E-12);
      expect((stateVariables['/d'].stateValues.value)).closeTo(d, 1E-12);
      expect((stateVariables['/c'].stateValues.value)).closeTo(c, 1E-12);
      expect((stateVariables['/b'].stateValues.value)).closeTo(b, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(a, 1E-12);
    })

    cy.log(`move point2 to upper right`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 9, y: 9 }
      });

      let d = 9;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(point1x, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(point1y, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(point2x, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(point2y, 1E-12);
      expect((stateVariables['/d'].stateValues.value)).closeTo(d, 1E-12);
      expect((stateVariables['/c'].stateValues.value)).closeTo(c, 1E-12);
      expect((stateVariables['/b'].stateValues.value)).closeTo(b, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(a, 1E-12);
    })

    cy.log(`move point1 to upper left`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -6, y: 4 }
      });

      let d = 4;
      let point2x = d;
      let point2y = 3 - d;
      let c = point2x * d * 0.01;
      let b = point2y * c;
      let a = b + 1;
      let point1x = a;
      let point1y = point2x;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(point1x, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(point1y, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(point2x, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(point2y, 1E-12);
      expect((stateVariables['/d'].stateValues.value)).closeTo(d, 1E-12);
      expect((stateVariables['/c'].stateValues.value)).closeTo(c, 1E-12);
      expect((stateVariables['/b'].stateValues.value)).closeTo(b, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(a, 1E-12);
    })

  });

  it('no dependence on downstream update order', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>
    (<copy prop="y" target="_point2" />, 3)
  </point>
  <point>
    (<copy target="a" />,<copy target="a" />)
  </point>
  </graph>

  <number name="a">2</number>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait to load

    cy.get("#\\/a").should('have.text', '2')

    cy.log(`point 2 is moveable, based on x component`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -3, y: -7 }
      })
    })

    cy.get("#\\/a").should('have.text', '-3')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(-3, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(3, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(-3, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(-3, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(-3, 1E-12);

    })
    // test zero as had a bug affect case when zero
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 0, y: 5 }
      })
    })

    cy.get("#\\/a").should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(0, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(3, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(0, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(0, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(0, 1E-12);

    })

    cy.log(`point1 is free to move`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -6 }
      })
    })

    cy.get("#\\/a").should('have.text', '9')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(9, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(-6, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(9, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(9, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(9, 1E-12);

    })

    // move to zero to make sure are testing the bug that occured at zero
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0, y: 0 }
      })
    })

    cy.get("#\\/a").should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(0, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(0, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(0, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(0, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(0, 1E-12);

    })


    cy.visit('/cypressTest')

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <graph>
  <point>
    (<copy prop="x" target="_point2" />, 3)
  </point>
  <point>
    (<copy target="a" />,<copy target="a" />)
  </point>
  </graph>

  <number name="a">3</number>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b');  // to wait to load

    cy.get("#\\/a").should('have.text', '3')

    cy.log(`point 2 is moveable, based on x component`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -3, y: -7 }
      })
    })

    cy.get("#\\/a").should('have.text', '-3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(-3, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(3, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(-3, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(-3, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(-3, 1E-12);

    })
    // test zero as had a bug affect case when zero
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 0, y: 5 }
      })
    })

    cy.get("#\\/a").should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(0, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(3, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(0, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(0, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(0, 1E-12);

    })

    cy.log(`point1 is free to move`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -6 }
      })
    })

    cy.get("#\\/a").should('have.text', '9')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(9, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(-6, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(9, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(9, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(9, 1E-12);

    })

    // move to zero to make sure are testing the bug that occured at zero
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 0, y: 0 }
      })
    })

    cy.get("#\\/a").should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).closeTo(0, 1E-12);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).closeTo(0, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).closeTo(0, 1E-12);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).closeTo(0, 1E-12);
      expect((stateVariables['/a'].stateValues.value)).closeTo(0, 1E-12);

    })

  });

  it('point constrained to grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point x="1" y="2">
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,2)');

    cy.log(`move point to (1.2,3.6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.2, y: 3.6 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1, 4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9.8, y: -7.4 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−10,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-10);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-7);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -10, -7]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    // test bug with number in scientific notation 
    cy.log(`move point to (-1.3E-14,2.5E-12)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.3E-14, y: 2.5E-12 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(0,0)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(0);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(0);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 0, 0]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });

  it('point constrained to grid with sugared coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point>
    (1,2)
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,2)');

    cy.log(`move point to (1.2,3.6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.2, y: 3.6 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1, 4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9.8, y: -7.4 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−10,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-10);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-7);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -10, -7]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('point constrained to grid, copied from outside', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <constraints name="toGrid">
    <constrainToGrid/>
  </constraints>

  <graph>
  <point x="1" y="2">
    <copy target="toGrid" createComponentOfType="constraints" />
  </point>
  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,2)');

    cy.log(`move point to (1.2,3.6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.2, y: 3.6 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1, 4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9.8, y: -7.4 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−10,−7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-10);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-7);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -10, -7]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });


  it('point constrained to grid, 3D', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point x="1" y="2" z="3">
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>

  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,2,3)');

    cy.log(`move point to (1.2,3.6,5.4)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.2, y: 3.6, z: 5.4 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,4,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq(5);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1, 4, 5]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4,5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (-9.8,-7.4,-4.6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9.8, y: -7.4, z: -4.6 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−10,−7,−5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-10);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-7);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq(-5);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -10, -7, -5]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−10,−7,−5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    // test bug with number in scientific notation 
    cy.log(`move point to (-1.3E-14,2.5E-12,7.1E-21)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.3E-14, y: 2.5E-12, z: 7.1E-121 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(0,0,0)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(0);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(0);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq(0);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 0, 0, 0]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });


  it('point constrained to two contradictory grids', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point xs="1 3.1">
    <constraints>
      <constrainToGrid dx="2" dy="2"/>
      <constrainToGrid dx="2" dy="2" xoffset="1" yoffset="1" />
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log("second constraint wins, but first constraint affects result")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(5);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 3, 5]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`Unexpected results when moving since constraints applied twice`)
    // Note: the behavior isn't necessarily desired, but it is a consequence
    // of applying the constraints in the inverse direction, and then
    // again in the normal direction.
    // If one can find a way to avoid this strange behavior, we can change this test

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: 2.9 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(7,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(7);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(5);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 7, 5]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,5)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('point constrained to grid and line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <line name="PhaseLine" equation="y=0" fixed styleNumber="3"/>
    <point x="-1.5" y="7.9">
      <constraints>
        <constrainToGrid/>
        <constrainto>$PhaseLine</constrainto>
      </constraints>
    </point>
  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(0);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−1,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    cy.log(`move point`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 8.5, y: -6.2 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(9,0)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(9);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(0);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
  });

  it('point constrained to graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point x="1" y="2" name="A">
      <constraints baseOnGraph="_graph1">
        <constrainToGraph/>
      </constraints>
    </point>
    <point x="3" y="4" name="C">
      <constraints baseOnGraph="_graph1">
        <constrainToGraph buffer="0.025" />
      </constraints>
    </point>
  </graph>

  <graph xmin="-20" xmax="20" ymin="-20" ymax="20" >
    <copy target="A" assignNames="B" />
    <copy target="C" assignNames="D" />
  </graph>

  <math><copy prop="coords" target="A" /></math>
  <boolean><copy prop="constraintUsed" target="A" /></boolean>
  <math><copy prop="coords" target="B" /></math>
  <boolean><copy prop="constraintUsed" target="B" /></boolean>
  <math><copy prop="coords" target="C" /></math>
  <boolean><copy prop="constraintUsed" target="C" /></boolean>
  <math><copy prop="coords" target="D" /></math>
  <boolean><copy prop="constraintUsed" target="D" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,2)');

    cy.log(`move point A to (105,3)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 105, y: 3 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(9.8,3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).eq(9.8);
      expect((stateVariables['/A'].stateValues.xs)[1]).eq(3);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/B'].stateValues.xs)[0]).eq(9.8);
      expect((stateVariables['/B'].stateValues.xs)[1]).eq(3);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9.8,3)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9.8,3)')
    });
    cy.get('#\\/_boolean2').should('have.text', "true")

    cy.log(`move point A to (-30,11)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -30, y: 11 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−9.8,9.8)');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).eq(-9.8);
      expect((stateVariables['/A'].stateValues.xs)[1]).eq(9.8);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/B'].stateValues.xs)[0]).eq(-9.8);
      expect((stateVariables['/B'].stateValues.xs)[1]).eq(9.8);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−9.8,9.8)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−9.8,9.8)')
    });
    cy.get('#\\/_boolean2').should('have.text', "true")

    cy.log(`move point A to (-3,1)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3, y: 1 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−3,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).eq(-3);
      expect((stateVariables['/A'].stateValues.xs)[1]).eq(1);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/B'].stateValues.xs)[0]).eq(-3);
      expect((stateVariables['/B'].stateValues.xs)[1]).eq(1);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,1)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,1)')
    });
    cy.get('#\\/_boolean2').should('have.text', "true")

    cy.log(`move point B to (-7,18)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -7, y: 18 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−7,9.8)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).eq(-7);
      expect((stateVariables['/A'].stateValues.xs)[1]).eq(9.8);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/B'].stateValues.xs)[0]).eq(-7);
      expect((stateVariables['/B'].stateValues.xs)[1]).eq(9.8);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9.8)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9.8)')
    });
    cy.get('#\\/_boolean2').should('have.text', "true")


    cy.log(`move point B to (56,-91)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 56, y: -91 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(9.8,−9.8)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).eq(9.8);
      expect((stateVariables['/A'].stateValues.xs)[1]).eq(-9.8);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/B'].stateValues.xs)[0]).eq(9.8);
      expect((stateVariables['/B'].stateValues.xs)[1]).eq(-9.8);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9.8,−9.8)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9.8,−9.8)')
    });
    cy.get('#\\/_boolean2').should('have.text', "true")

    cy.log(`move point C to (56,-91)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 56, y: -91 }
      })
    })
    cy.get('#\\/_math3 .mjx-mrow').should('contain.text', '(9.5,−9.5)');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/C'].stateValues.xs)[0]).eq(9.5);
      expect((stateVariables['/C'].stateValues.xs)[1]).eq(-9.5);
      expect(stateVariables['/C'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/D'].stateValues.xs)[0]).eq(9.5);
      expect((stateVariables['/D'].stateValues.xs)[1]).eq(-9.5);
      expect(stateVariables['/D'].stateValues.constraintUsed).eq(true);
    })

    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9.5,−9.5)')
    });
    cy.get('#\\/_boolean3').should('have.text', "true")
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9.5,−9.5)')
    });
    cy.get('#\\/_boolean4').should('have.text', "true")


    cy.log(`move point D to (5,15)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: 5, y: 15 }
      })
    })
    cy.get('#\\/_math3 .mjx-mrow').should('contain.text', '(5,9.5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/C'].stateValues.xs)[0]).eq(5);
      expect((stateVariables['/C'].stateValues.xs)[1]).eq(9.5);
      expect(stateVariables['/C'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/D'].stateValues.xs)[0]).eq(5);
      expect((stateVariables['/D'].stateValues.xs)[1]).eq(9.5);
      expect(stateVariables['/D'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,9.5)')
    });
    cy.get('#\\/_boolean3').should('have.text', "true")
    cy.get('#\\/_math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,9.5)')
    });
    cy.get('#\\/_boolean4').should('have.text', "true")



  });

  it('three points with one constrained to grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="original">(1,2)</point>
    <point name="constrained" x="$(original.x)+1" y="$(original.y)+1" >
      <constraints>
        <constrainToGrid/>
      </constraints>
    </point>
    <point name="follower">
        (<copy prop="x" target="constrained" />+1,
          <copy prop="y" target="constrained" />+1)
    </point>
  </graph>
  <math><copy prop="coords" target="original" /></math>
  <math><copy prop="coords" target="constrained" /></math>
  <math><copy prop="coords" target="follower" /></math>
  <boolean><copy prop="constraintUsed" target="original" /></boolean>
  <boolean><copy prop="constraintUsed" target="constrained" /></boolean>
  <boolean><copy prop="constraintUsed" target="follower" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,2)');

    cy.log(`move point1 to (1.2,3.6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/original",
        args: { x: 1.2, y: 3.6 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1.2,3.6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/original'].stateValues.xs)[0]).eq(1.2);
      expect((stateVariables['/original'].stateValues.xs)[1]).eq(3.6);
      expect((stateVariables['/original'].stateValues.coords)).eqls(["vector", 1.2, 3.6]);
      expect(stateVariables['/original'].stateValues.constraintUsed).eq(false);
      expect((stateVariables['/constrained'].stateValues.xs)[0]).eq(2);
      expect((stateVariables['/constrained'].stateValues.xs)[1]).eq(5);
      expect((stateVariables['/constrained'].stateValues.coords)).eqls(["vector", 2, 5]);
      expect(stateVariables['/constrained'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/follower'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/follower'].stateValues.xs)[1]).eq(6);
      expect((stateVariables['/follower'].stateValues.coords)).eqls(["vector", 3, 6]);
      expect(stateVariables['/follower'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.2,3.6)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,5)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6)')
    });

    cy.get('#\\/_boolean1').should('have.text', 'false')
    cy.get('#\\/_boolean2').should('have.text', 'true')
    cy.get('#\\/_boolean3').should('have.text', 'false')

    cy.log(`move point2 to (-3.4,6.7)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/constrained",
        args: { x: -3.4, y: 6.7 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−4,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/original'].stateValues.xs)[0]).eq(-4);
      expect((stateVariables['/original'].stateValues.xs)[1]).eq(6);
      expect((stateVariables['/original'].stateValues.coords)).eqls(["vector", -4, 6]);
      expect(stateVariables['/original'].stateValues.constraintUsed).eq(false);
      expect((stateVariables['/constrained'].stateValues.xs)[0]).eq(-3);
      expect((stateVariables['/constrained'].stateValues.xs)[1]).eq(7);
      expect((stateVariables['/constrained'].stateValues.coords)).eqls(["vector", -3, 7]);
      expect(stateVariables['/constrained'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/follower'].stateValues.xs)[0]).eq(-2);
      expect((stateVariables['/follower'].stateValues.xs)[1]).eq(8);
      expect((stateVariables['/follower'].stateValues.coords)).eqls(["vector", -2, 8]);
      expect(stateVariables['/follower'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−4,6)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,7)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,8)')
    });
    cy.get('#\\/_boolean1').should('have.text', 'false')
    cy.get('#\\/_boolean2').should('have.text', 'true')
    cy.get('#\\/_boolean3').should('have.text', 'false')

    cy.log(`move point3 to (5.3, -2.2)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/follower",
        args: { x: 5.3, y: -2.2 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(3,−4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/original'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/original'].stateValues.xs)[1]).eq(-4);
      expect((stateVariables['/original'].stateValues.coords)).eqls(["vector", 3, -4]);
      expect(stateVariables['/original'].stateValues.constraintUsed).eq(false);
      expect((stateVariables['/constrained'].stateValues.xs)[0]).eq(4);
      expect((stateVariables['/constrained'].stateValues.xs)[1]).eq(-3);
      expect((stateVariables['/constrained'].stateValues.coords)).eqls(["vector", 4, -3]);
      expect(stateVariables['/constrained'].stateValues.constraintUsed).eq(true);
      expect((stateVariables['/follower'].stateValues.xs)[0]).eq(5);
      expect((stateVariables['/follower'].stateValues.xs)[1]).eq(-2);
      expect((stateVariables['/follower'].stateValues.coords)).eqls(["vector", 5, -2]);
      expect(stateVariables['/follower'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,−4)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,−3)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,−2)')
    });
    cy.get('#\\/_boolean1').should('have.text', 'false')
    cy.get('#\\/_boolean2').should('have.text', 'true')
    cy.get('#\\/_boolean3').should('have.text', 'false')

  });

  it('points constrained to grid with parameters', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="dx"/>
  <mathinput name="dy"/>
  <mathinput name="xoffset"/>
  <mathinput name="yoffset"/>

  <graph>
    <point name="original">(1.2,3.6)</point>
    <point name="constrained" x="$(original.x)+1" y="$(original.y)+1">
      <constraints>
        <constrainToGrid dx="$dx" dy="$dy" xoffset="$xoffset" yoffset="$yoffset" />
      </constraints>
    </point>
    <point name="follower">
        (<copy prop="x" target="constrained" />+1,
          <copy prop="y" target="constrained" />+1)
    </point>
  </graph>
  <math><copy prop="coords" target="original" /></math>
  <math><copy prop="coords" target="constrained" /></math>
  <math><copy prop="coords" target="follower" /></math>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`no constraints with blanks`)
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.2,3.6)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2.2,4.6)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3.2,5.6)')
    }); cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/original'].stateValues.xs)[0]).eq(1.2);
      expect((stateVariables['/original'].stateValues.xs)[1]).eq(3.6);
      expect((stateVariables['/original'].stateValues.coords)).eqls(["vector", 1.2, 3.6]);
      expect((stateVariables['/constrained'].stateValues.xs)[0]).eq(2.2);
      expect((stateVariables['/constrained'].stateValues.xs)[1]).eq(4.6);
      expect((stateVariables['/constrained'].stateValues.coords)).eqls(["vector", 2.2, 4.6]);
      expect((stateVariables['/follower'].stateValues.xs)[0]).eq(3.2);
      expect((stateVariables['/follower'].stateValues.xs)[1]).eq(5.6);
      expect((stateVariables['/follower'].stateValues.coords)).eqls(["vector", 3.2, 5.6]);
    })


    cy.log(`constrain x and y to integers`);
    cy.get('#\\/dx textarea').type('1', { force: true });
    cy.get('#\\/dy textarea').type('1', { force: true });
    cy.get('#\\/xoffset textarea').type('0', { force: true });
    cy.get('#\\/yoffset textarea').type('0{enter}', { force: true });

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1.2,3.6)');
    cy.get('#\\/_math2 .mjx-mrow').should('contain.text', '(2,5)');
    cy.get('#\\/_math3 .mjx-mrow').should('contain.text', '(3,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/original'].stateValues.xs)[0]).eq(1.2);
      expect((stateVariables['/original'].stateValues.xs)[1]).eq(3.6);
      expect((stateVariables['/original'].stateValues.coords)).eqls(["vector", 1.2, 3.6]);
      expect((stateVariables['/constrained'].stateValues.xs)[0]).eq(2);
      expect((stateVariables['/constrained'].stateValues.xs)[1]).eq(5);
      expect((stateVariables['/constrained'].stateValues.coords)).eqls(["vector", 2, 5]);
      expect((stateVariables['/follower'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/follower'].stateValues.xs)[1]).eq(6);
      expect((stateVariables['/follower'].stateValues.coords)).eqls(["vector", 3, 6]);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.2,3.6)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,5)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6)')
    });

    cy.log(`move point2 to (5.3, -2.2)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/constrained",
        args: { x: 5.3, y: -2.2 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(4,−3)');
    cy.get('#\\/_math2 .mjx-mrow').should('contain.text', '(5,−2)');
    cy.get('#\\/_math3 .mjx-mrow').should('contain.text', '(6,−1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/original'].stateValues.xs)[0]).eq(4);
      expect((stateVariables['/original'].stateValues.xs)[1]).eq(-3);
      expect((stateVariables['/original'].stateValues.coords)).eqls(["vector", 4, -3]);
      expect((stateVariables['/constrained'].stateValues.xs)[0]).eq(5);
      expect((stateVariables['/constrained'].stateValues.xs)[1]).eq(-2);
      expect((stateVariables['/constrained'].stateValues.coords)).eqls(["vector", 5, -2]);
      expect((stateVariables['/follower'].stateValues.xs)[0]).eq(6);
      expect((stateVariables['/follower'].stateValues.xs)[1]).eq(-1);
      expect((stateVariables['/follower'].stateValues.coords)).eqls(["vector", 6, -1]);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,−3)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(5,−2)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(6,−1)')
    });


    cy.log(`change constraints`);
    cy.get('#\\/dx textarea').type('{end}{backspace}3', { force: true });
    cy.get('#\\/dy textarea').type('{end}{backspace}0.5', { force: true });
    cy.get('#\\/xoffset textarea').type('{end}{backspace}1', { force: true });
    cy.get('#\\/yoffset textarea').type('{end}{backspace}0.1{enter}', { force: true });

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(4,−3)');
    cy.get('#\\/_math2 .mjx-mrow').should('contain.text', '(4,−1.9)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/original'].stateValues.xs)[0]).eq(4);
      expect((stateVariables['/original'].stateValues.xs)[1]).eq(-3);
      expect((stateVariables['/original'].stateValues.coords)).eqls(["vector", 4, -3]);
      expect((stateVariables['/constrained'].stateValues.xs)[0]).eq(4);
      expect((stateVariables['/constrained'].stateValues.xs)[1]).eq(-1.9);
      expect((stateVariables['/constrained'].stateValues.coords)).eqls(["vector", 4, -1.9]);
      expect((stateVariables['/follower'].stateValues.xs)[0]).eq(5);
      expect((stateVariables['/follower'].stateValues.xs)[1]).to.be.approximately(-0.9, 1E-10);
      expect((stateVariables['/follower'].stateValues.coords).slice(0, 2)).eqls(["vector", 5]);
      expect((stateVariables['/follower'].stateValues.coords)[2]).to.be.approximately(-0.9, 1E-10);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,−3)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,−1.9)')
    });
    // cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('(5,−0.9)')
    // });


    cy.log(`move point to (-2.2, -8.6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/constrained",
        args: { x: -0.6, y: -8.6 }
      })
    })

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−3,−9.4)');
    cy.get('#\\/_math2 .mjx-mrow').should('contain.text', '(−2,−8.4)');
    cy.get('#\\/_math3 .mjx-mrow').should('contain.text', '(−1,−7.4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/original'].stateValues.xs)[0]).eq(-3);
      expect((stateVariables['/original'].stateValues.xs)[1]).eq(-9.4);
      expect((stateVariables['/original'].stateValues.coords)).eqls(["vector", -3, -9.4]);
      expect((stateVariables['/constrained'].stateValues.xs)[0]).eq(-2);
      expect((stateVariables['/constrained'].stateValues.xs)[1]).eq(-8.4);
      expect((stateVariables['/constrained'].stateValues.coords)).eqls(["vector", -2, -8.4]);
      expect((stateVariables['/follower'].stateValues.xs)[0]).eq(-1);
      expect((stateVariables['/follower'].stateValues.xs)[1]).eq(-7.4);
      expect((stateVariables['/follower'].stateValues.coords)).eqls(["vector", -1, -7.4]);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−3,−9.4)')
    });
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−2,−8.4)')
    });
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−1,−7.4)')
    });

  });

  it('point attracted to grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point xs="-7.1 8.9">
    <constraints>
      <attractToGrid/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−7,9)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-7);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(9);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -7, 9]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (1.1,3.6)`)

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.6 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1.1,3.6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1.1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(3.6);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1.1, 3.6]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.1,3.6)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`move point to (1.1,3.9)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1, 4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    // test bug with number in scientific notation 
    cy.log(`move point to (-1.3E-14,2.5E-12)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.3E-14, y: 2.5E-12 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(0,0)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(0);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(0);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 0, 0]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });

  it('point attracted to grid, copied from outside', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <constraints name="toGrid">
    <attractToGrid/>
  </constraints>

  <graph>

  <point xs="-7.1 8.9">
    <copy target="toGrid" createComponentOfType="constraints" />
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-7);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(9);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -7, 9]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (1.1,3.6)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.6 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1.1,3.6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1.1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(3.6);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1.1, 3.6]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.1,3.6)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`move point to (1.1,3.9)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1, 4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });

  it('point attracted to grid, 3D', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point xs="-7.1 8.9 2.1">
    <constraints>
      <attractToGrid/>
    </constraints>
  </point>

  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-7);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(9);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq(2);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -7, 9, 2]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9,2)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`move point to (1.1,3.9,5.4)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9, z: 5.4 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1.1,3.9,5.4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1.1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(3.9);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq(5.4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1.1, 3.9, 5.4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.1,3.9,5.4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`move point to (1.1,3.9,5.9)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9, z: 5.9 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,4,6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq(6);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1, 4, 6]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4,6)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")


    // test bug with number in scientific notation 
    cy.log(`move point to (-1.3E-14,2.5E-12,-2.3E-19)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -1.3E-14, y: 2.5E-12, z: -2.3E-19 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(0,0,0)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(0);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(0);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq(0);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 0, 0, 0]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0,0)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

  });


  it('point attracted to grid, including gridlines', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>

  <point xs="3.1 -3.4">
    <constraints>
      <attractToGrid includeGridlines="true"/>
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>
  

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,−3.4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-3.4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 3, -3.4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })


    cy.log(`move point to (1.3,3.9)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.3, y: 3.9 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1.3,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1.3);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1.3, 4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.3,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.log(`move point to (1.1,3.9)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.1, y: 3.9 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1,4)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1, 4]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true");

    cy.log(`move point to (1.3,3.7)`)
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1.3, y: 3.7 }
      })
    })
    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(1.3,3.7)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1.3);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(3.7);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 1.3, 3.7]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1.3,3.7)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false");

  });

  it('point attracted to grid with parameters', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="dx"/>
  <mathinput name="dy"/>
  <mathinput name="xoffset"/>
  <mathinput name="yoffset"/>
  <mathinput name="xthreshold"/>
  <mathinput name="ythreshold"/>

  <graph>

  <point xs="-7.1 8.9">
    <constraints>
      <attractToGrid dx="$dx" dy="$dy" xoffset="$xoffset" yoffset="$yoffset" xthreshold="$xthreshold" ythreshold="$ythreshold" />
    </constraints>
  </point>

  </graph>
  <math><copy prop="coords" target="_point1" /></math>
  <boolean><copy prop="constraintUsed" target="_point1" /></boolean>

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`no constraints with blanks`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-7.1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(8.9);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -7.1, 8.9]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7.1,8.9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.log(`constrain x and y to integers`);
    cy.get('#\\/dx textarea').type('1', { force: true });
    cy.get('#\\/dy textarea').type('1', { force: true });
    cy.get('#\\/xoffset textarea').type('0', { force: true });
    cy.get('#\\/yoffset textarea').type('0', { force: true });
    cy.get('#\\/xthreshold textarea').type('0.2', { force: true });
    cy.get('#\\/ythreshold textarea').type('0.2{enter}', { force: true });

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−7,9)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-7);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(9);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -7, 9]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7,9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")

    cy.log(`change constraints`);
    cy.get('#\\/dx textarea').type('{end}{backspace}3', { force: true });
    cy.get('#\\/dy textarea').type('{end}{backspace}0.5', { force: true });
    cy.get('#\\/xoffset textarea').type('{end}{backspace}1', { force: true });
    cy.get('#\\/yoffset textarea').type('{end}{backspace}0.1{enter}', { force: true });

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−7.1,8.9)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-7.1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(8.9);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -7.1, 8.9]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−7.1,8.9)')
    });
    cy.get('#\\/_boolean1').should('have.text', "false")

    cy.get('#\\/xthreshold textarea').type('{ctrl+home}{shift+end}{backspace}1.0', { force: true });
    cy.get('#\\/ythreshold textarea').type('{ctrl+home}{shift+end}{backspace}0.3{enter}', { force: true });

    cy.get('#\\/_math1 .mjx-mrow').should('contain.text', '(−8,9.1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-8);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(9.1);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -8, 9.1]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−8,9.1)')
    });
    cy.get('#\\/_boolean1').should('have.text', "true")



  });

  it('point constrained to line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,2)</point>
  <point>(2,0)</point>
  <line through="$_point1 $_point2"/>
  <point name="A" xs="-1 -5">
    <constraints>
      <constrainTo><copy target="_line1" /></constrainTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  <copy prop="coords" target="A" assignNames="coords" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {

      cy.log(`point is on line`);
      cy.get('#\\/coords .mjx-mrow').should('contain.text', '(3,−1)');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/A'].stateValues.xs)[0] + (stateVariables['/A'].stateValues.xs)[1]).eq(2);
        expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get("#\\/constraintUsed").should('have.text', "true")


      cy.log(`move point`);
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePoint",
          componentName: "/A",
          args: { x: 9, y: -3 }
        })
      })
      cy.get('#\\/coords .mjx-mrow').should('contain.text', '(7,−5)');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/A'].stateValues.xs)[0] + (stateVariables['/A'].stateValues.xs)[1]).eq(2);
        expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get("#\\/constraintUsed").should('have.text', "true")

      cy.log(`change line`);
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePoint",
          componentName: "/_point1",
          args: { x: 3, y: 1 }
        })
      })
      cy.get('#\\/coords .mjx-mrow').should('contain.text', '(2,0)');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/A'].stateValues.xs)[0] - (stateVariables['/A'].stateValues.xs)[1]).eq(2);
        expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get("#\\/constraintUsed").should('have.text', "true")

      cy.log(`move point`);
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePoint",
          componentName: "/A",
          args: { x: 9, y: -3 }
        })
      })
      cy.get('#\\/coords .mjx-mrow').should('contain.text', '(4,2)');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables['/A'].stateValues.xs)[0] - (stateVariables['/A'].stateValues.xs)[1]).eq(2);
        expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      })
      cy.get("#\\/constraintUsed").should('have.text', "true")

    })
  });

  it('point attracted to line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(0,2)</point>
  <point>(2,0)</point>
  <line through="$_point1 $_point2"/>
  <point name="A" xs="-1 -5">
    <constraints>
      <attractTo><copy target="_line1" /></attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  <copy prop="coords" target="A" assignNames="coords" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`point is not on line`);
    cy.get('#\\/coords .mjx-mrow').should('contain.text', '(−1,−5)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).eq(-1);
      expect((stateVariables['/A'].stateValues.xs)[1]).eq(-5);
      expect((stateVariables['/A'].stateValues.coords)).eqls(["vector", -1, -5]);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false)
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")

    cy.log(`move point near line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 9.1, y: -6.8 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + (stateVariables['/A'].stateValues.xs)[1]).closeTo(2, 1E-14);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })

    cy.log(`change line, point not on line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: 1 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + (stateVariables['/A'].stateValues.xs)[1]).closeTo(2, 1E-14);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false)
    })

    cy.log(`move point`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -5.1, y: -6.8 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - (stateVariables['/A'].stateValues.xs)[1]).closeTo(2, 1E-14);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })

  });

  it('point attracted to line, based on graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>xmin = <mathinput name="xmin" prefill="-10" /></p>
  <p>xmax = <mathinput name="xmax" prefill="10" /></p>
  <p>ymin = <mathinput name="ymin" prefill="-10" /></p>
  <p>ymax = <mathinput name="ymax" prefill="10" /></p>
  <graph xmin="$xmin" xmax="$xmax" ymin="$ymin" ymax="$ymax">
  <point>(-1,-10)</point>
  <point>(1,10)</point>
  <line through="$_point1 $_point2"/>
  <point name="A" xs="-1 -5">
    <constraints baseOnGraph="_graph1">
      <attractTo><copy target="_line1" /></attractTo>
    </constraints>
  </point>
  </graph>
  <graph xmin="$ymin" xmax="$ymax" ymin="$xmin" ymax="$xmax">
    <copy target="A" assignNames="B" />
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsedA" target="A" />
  <copy prop="constraintUsed" assignNames="constraintUsedB" target="B" />
  <copy prop="coords" target="A" assignNames="coordsA" />
  <copy prop="coords" target="B" assignNames="coordsB" />
  <copy prop="coords" target="_point1" assignNames="coords1" />
  <copy prop="coords" target="_point2" assignNames="coords2" />

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.log(`point is not on line`);

    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−1,−5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-1, -5])
      expect((stateVariables['/B'].stateValues.xs)).eqls([-1, -5])
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(false);
    })

    cy.get("#\\/constraintUsedA").should('have.text', "false")
    cy.get("#\\/constraintUsedB").should('have.text', "false")

    cy.log(`move point near line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.3, y: 0 }
      })
    })
    cy.get("#\\/constraintUsedA").should('have.text', "true")
    cy.get("#\\/constraintUsedB").should('have.text', "true")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - 0.1 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect((stateVariables['/B'].stateValues.xs)[0] - 0.1 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })


    cy.log('narrow range in x')
    cy.get('#\\/xmin textarea').type("{end}{backspace}{enter}", { force: true })
    cy.get('#\\/xmax textarea').type("{end}{backspace}{enter}", { force: true })

    cy.get("#\\/constraintUsedA").should('have.text', "true")
    cy.get("#\\/constraintUsedB").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - 0.1 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect((stateVariables['/B'].stateValues.xs)[0] - 0.1 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })

    cy.log('point is no longer close')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.3, y: 0 }
      })
    })

    cy.get("#\\/constraintUsedA").should('have.text', "false")
    cy.get("#\\/constraintUsedB").should('have.text', "false")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([0.3, 0])
      expect((stateVariables['/B'].stateValues.xs)).eqls([0.3, 0])
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(false);
    })

    cy.log('point is close again for larger x limits')

    cy.get('#\\/xmin textarea').type("{end}0{enter}", { force: true })
    cy.get('#\\/xmax textarea').type("{end}0{enter}", { force: true })

    cy.get("#\\/constraintUsedA").should('have.text', "true")
    cy.get("#\\/constraintUsedB").should('have.text', "true")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - 0.1 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect((stateVariables['/B'].stateValues.xs)[0] - 0.1 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })


    cy.log('make line with shallow slope')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 10, y: -0.1 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -10, y: 0.1 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(10,−0.1)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(−10,0.1)');

    cy.get("#\\/constraintUsedA").should('have.text', "true")
    cy.get("#\\/constraintUsedB").should('have.text', "true")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + 100 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect((stateVariables['/B'].stateValues.xs)[0] + 100 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })


    cy.log('move point away from line')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -6, y: 8 }
      })
    })
    cy.get("#\\/constraintUsedA").should('have.text', "false")
    cy.get("#\\/constraintUsedB").should('have.text', "false")


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-6, 8])
      expect((stateVariables['/B'].stateValues.xs)).eqls([-6, 8])
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(false);
    })



    cy.log('point is close again for larger y limits')

    cy.get('#\\/ymin textarea').type("{end}00{enter}", { force: true })
    cy.get('#\\/ymax textarea').type("{end}00{enter}", { force: true })

    cy.get("#\\/constraintUsedA").should('have.text', "true")
    cy.get("#\\/constraintUsedB").should('have.text', "true")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + 100 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect((stateVariables['/B'].stateValues.xs)[0] + 100 * (stateVariables['/A'].stateValues.xs)[1]).closeTo(0, 1E-14);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(true);
    })


    cy.log('point is not close for smaller y limits')

    cy.get('#\\/ymin textarea').type("{end}{backspace}{enter}", { force: true })
    cy.get('#\\/ymax textarea').type("{end}{backspace}{enter}", { force: true })

    cy.get("#\\/constraintUsedA").should('have.text', "false")
    cy.get("#\\/constraintUsedB").should('have.text', "false")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-6, 8])
      expect((stateVariables['/B'].stateValues.xs)).eqls([-6, 8])
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
      expect(stateVariables['/B'].stateValues.constraintUsed).eq(false);
    })


  });

  it('point constrained to lines and points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line hide>y = x + 7</line>
  <line hide>y = x - 3</line>
  <map>
    <template newNamespace>
      <point hide>($n,$n+2)</point>
    </template>
    <sources alias="n"><sequence from="-10" to="10"/></sources>
  </map>

  <point xs="3 2">
    <constraints>
    <constrainTo>
      <copy target="_line1" />
      <copy target="_line2" />
      <copy target="_map1" />
    </constrainTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="_point1" />
  <copy prop="coords" target="_point1" assignNames="coords1" />

  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.log(`point is on line`);

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(4,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[1] - (stateVariables['/_point1'].stateValues.xs)[0]).eq(-3);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move point to lower right`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -5 }
      })
    })
    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(3.5,0.5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[1] - (stateVariables['/_point1'].stateValues.xs)[0]).eq(-3);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move point near points`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.5, y: 5.5 }
      })
    })
    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(3,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(5);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 3, 5]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move point to upper left`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 8 }
      })
    })
    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−4,3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[1] - (stateVariables['/_point1'].stateValues.xs)[0]).eq(7);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
  });

  it('point attracted to lines and points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line hide>y = x + 7</line>
  <line hide>y = x - 3</line>
  <map>
    <template newNamespace>
      <point hide>($n,$n+2)</point>
    </template>
    <sources alias="n"><sequence from="-10" to="10"/></sources>
  </map>

  <point xs="3 2">
    <constraints>
      <attractTo threshold="1">
        <copy target="_line1" />
        <copy target="_line2" />
        <copy target="_map1" />
      </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="_point1" />
  <copy prop="coords" target="_point1" assignNames="coords1" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.log(`point is in original location`);

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(3,2)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(2);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 3, 2]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")

    cy.log(`point is on line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.1, y: 0.5 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[1] - (stateVariables['/_point1'].stateValues.xs)[0]).eq(-3);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true)
    })

    cy.log(`move point to lower right`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: -5 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(9);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-5);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 9, -5]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })

    cy.log(`move point near points`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3.1, y: 5.1 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(5);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", 3, 5]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true)
    })

    cy.log(`move point to upper left`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -9, y: 8 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(-9);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(8);
      expect((stateVariables['/_point1'].stateValues.coords)).eqls(["vector", -9, 8]);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(false);
    })

    cy.log(`move point near upper line`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8.8, y: -2.3 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[1] - (stateVariables['/_point1'].stateValues.xs)[0]).eq(7);
      expect(stateVariables['/_point1'].stateValues.constraintUsed).eq(true);
    })
  });

  it('point constrained to union of lines and grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <constraintUnion>
      <constrainTo><copy target="_line1" /></constrainTo>
      <constrainTo><copy target="_line2" /><copy target="_line3" /></constrainTo>
      <constrainTo><copy target="_line4" /></constrainTo>
      <constrainToGrid dx="2" dy="2"/>
    </constraintUnion>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  <copy prop="coords" target="A" assignNames="coordsA" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`point on grid`);
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(8,4)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(8, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(4, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.1, y: 8.2 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−7.65,7.65)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.1, y: 8.2 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(7.65,7.65)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near line x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3.5, y: -2.5 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(3.4,−2.3)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - 2 * (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near line x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3.5, y: -2.5 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−3.4,−2.3)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + 2 * (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

  });

  it('point attracted to union of lines and grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <attractToConstraint>
      <constraintUnion>
        <constrainTo><copy target="_line1" /></constrainTo>
        <constrainTo><copy target="_line2" /><copy target="_line3" /></constrainTo>
        <constrainTo><copy target="_line4" /></constrainTo>
        <constrainToGrid dx="2" dy="2"/>
      </constraintUnion>
    </attractToConstraint>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  <copy prop="coords" target="A" assignNames="coordsA" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`point in original location`);

    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(7,3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(7, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(3, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")

    cy.log(`move point near grid`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.2, y: -1.8 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(0, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-2, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })

    cy.log(`move not close enough to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.1, y: 8.2 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(-7.1, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(8.2, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
    })

    cy.log(`move close enough to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.5, y: 7.8 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })

    cy.log(`move not close enough to line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.1, y: 8.2 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(7.1, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(8.2, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
    })

    cy.log(`move close enough to line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.5, y: 7.8 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })

    cy.log(`move near line x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3.5, y: -2.5 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(3.4,−2.3)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - 2 * (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")


    cy.log(`move near line x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3.5, y: -2.5 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−3.4,−2.3)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + 2 * (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

  });

  it('point attracted to union of lines and intersections', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <attractTo>
      <copy target="_line1" />
      <copy target="_line2" />
      <copy target="_line3" />
      <copy target="_line4" />
    </attractTo>
    <attractTo>
      <intersection><copy target="_line1" /><copy target="_line2" /></intersection>
      <intersection><copy target="_line1" /><copy target="_line3" /></intersection>
      <intersection><copy target="_line1" /><copy target="_line4" /></intersection>
      <intersection><copy target="_line2" /><copy target="_line3" /></intersection>
      <intersection><copy target="_line2" /><copy target="_line4" /></intersection>
      <intersection><copy target="_line3" /><copy target="_line4" /></intersection>
    </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  <copy prop="coords" target="A" assignNames="coordsA" displayDecimals="2" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`point in original location`);

    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(7,3)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(7, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(3, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")

    cy.log(`move not close enough to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.1, y: 8.2 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−7.1,8.2)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(-7.1, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(8.2, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")

    cy.log(`move close enough to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.5, y: 7.8 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })

    cy.log(`move not close enough to line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.1, y: 8.2 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "false")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(7.1, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(8.2, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(false);
    })

    cy.log(`move close enough to line x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.5, y: 7.8 }
      })
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })

    cy.log(`move near line x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3.5, y: -2.5 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(3.4,−2.3)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - 2 * (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near line x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -3.5, y: -2.5 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−3.4,−2.3)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + 2 * (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x+y=0 and x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -0.2, y: 0.1 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(0,0)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(0, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x+y=0 and x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 2.6, y: -2.7 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(2.67,−2.67)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(8 / 3, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8 / 3, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x+y=0 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.9, y: -8.2 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(8,−8)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(8, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x=y and x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -8.1, y: -7.8 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−8,−8)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(-8, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x+y=0 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -2.5, y: -2.7 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−2.67,−2.67)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(-8 / 3, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8 / 3, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x=2y+8 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.2, y: -3.9 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(0,−4)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(0, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-4, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")
  });

  it('point constrained to union of lines and attracted to intersections', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <line>x+y=0</line>
  <line>x=y</line>
  <line>x=2y+8</line>
  <line>x=-2y-8</line>
  <point name="A" xs="7 3">
    <constraints>
    <constrainTo>
      <copy target="_line1" />
      <copy target="_line2" />
      <copy target="_line3" />
      <copy target="_line4" />
    </constrainTo>
    <attractTo>
      <intersection><copy target="_line1" /><copy target="_line2" /></intersection>
      <intersection><copy target="_line1" /><copy target="_line3" /></intersection>
      <intersection><copy target="_line1" /><copy target="_line4" /></intersection>
      <intersection><copy target="_line2" /><copy target="_line3" /></intersection>
      <intersection><copy target="_line2" /><copy target="_line4" /></intersection>
      <intersection><copy target="_line3" /><copy target="_line4" /></intersection>
    </attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="constraintUsed" assignNames="constraintUsed" target="A" />
  <copy prop="coords" target="A" assignNames="coordsA" displayDecimals="2" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`on x=y`);

    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(5,5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true)
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`attract to line x+y=0`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -7.1, y: 10 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−8.55,8.55)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near line x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 10, y: -3 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(8.4,0.2)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] - 2 * (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near line x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -10, y: -3 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−8.4,0.2)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0] + 2 * (stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x+y=0 and x=y`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -0.2, y: 0.1 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(0,0)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(0, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(0, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x+y=0 and x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 2.6, y: -2.7 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(2.67,−2.67)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(8 / 3, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8 / 3, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x+y=0 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 7.9, y: -8.2 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(8,−8)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(8, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x=y and x=2y+8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -8.1, y: -7.8 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−8,−8)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(-8, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x=y and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -2.5, y: -2.7 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(−2.67,−2.67)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(-8 / 3, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-8 / 3, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

    cy.log(`move near intersection of x=2y+8 and x=-2y-8`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 0.2, y: -3.9 }
      })
    })
    cy.get('#\\/coordsA .mjx-mrow').should('contain.text', '(0,−4)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)[0]).to.be.closeTo(0, 1E-12);
      expect((stateVariables['/A'].stateValues.xs)[1]).to.be.closeTo(-4, 1E-12);
      expect(stateVariables['/A'].stateValues.constraintUsed).eq(true);
    })
    cy.get("#\\/constraintUsed").should('have.text', "true")

  });

  it('point constrained intersection of two lines', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <point>(1,2)</point>
  <point>(2,2)</point>
  <point>(3,2)</point>
  <point>(4,2)</point>
  
  <line through="$_point1 $_point2" />
  <line through="$_point3 $_point4" />
  <intersection assignNames="int1"><copy target="_line1" /><copy target="_line2" /></intersection>
  
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" displayDecimals="2" />
  <copy prop="coords" target="_point2" assignNames="coords2" displayDecimals="2" />
  <copy prop="coords" target="_point3" assignNames="coords3" displayDecimals="2" />
  <copy prop="coords" target="_point4" assignNames="coords4" displayDecimals="2" />

  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(1,2)');

    cy.log(`intersection is a line`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].componentType).eq("line");
      expect(stateVariables["/int1"].stateValues.slope).eq(0);
      expect(stateVariables["/int1"].stateValues.yintercept).eq(2);
    })

    cy.log(`make first line vertical`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: 5 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: -5 }
      })
    })
    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(3,5)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(3,−5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].componentType).eq("point");
      expect(stateVariables["/int1"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/int1"].stateValues.xs[1]).eq(2);
    })

    cy.log(`make second line vertical`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -4, y: 5 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -4, y: -5 }
      })
    })
    cy.get('#\\/coords3 .mjx-mrow').should('contain.text', '(−4,5)');
    cy.get('#\\/coords4 .mjx-mrow').should('contain.text', '(−4,−5)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"]).eq(undefined);
    })

    cy.log(`make lines intersect again`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: -7 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 8, y: 9 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 4, y: 6 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -4, y: -6 }
      })
    })
    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−8,−7)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(8,9)');
    cy.get('#\\/coords3 .mjx-mrow').should('contain.text', '(4,6)');
    cy.get('#\\/coords4 .mjx-mrow').should('contain.text', '(−4,−6)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].componentType).eq("point");
      expect(stateVariables["/int1"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/int1"].stateValues.xs[1]).eq(3);
    })

    cy.log(`make lines equal again`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 6, y: 9 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -6, y: -9 }
      })
    })
    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(6,9)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(−6,−9)');
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].componentType).eq("line");
      expect(stateVariables["/int1"].stateValues.slope).eqls(['/', 3, 2]);
      expect(stateVariables["/int1"].stateValues.xintercept).eq(0);
      expect(stateVariables["/int1"].stateValues.yintercept).eq(0);
    })

  });

  it('intersection of two lines hides dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
  <point>(1,2)</point>
  <point>(2,2)</point>
  <point>(3,2)</point>
  <point>(4,2)</point>
  <line through="$_point1 $_point2" />
  <line through="$_point3 $_point4" />
  </graph>

  <booleaninput name='h1' prefill="false" >
    <label>Hide first intersection</label>
  </booleaninput>
  <booleaninput name='h2' prefill="true" >
    <label>Hide second intersection</label>
  </booleaninput>
  
  <p name="i1">Intersection 1: <intersection hide="$h1"><copy target="_line1" /><copy target="_line2" /></intersection></p>
  <p name="i2">Intersection 2: <intersection hide="$h2"><copy target="_line1" /><copy target="_line2" /></intersection></p>

  <copy prop="value" target="h1" assignNames="h1Val" />
  <copy prop="value" target="h2" assignNames="h2Val" />
  <copy prop="coords" target="_point1" assignNames="coords1" displayDecimals="2" />
  <copy prop="coords" target="_point2" assignNames="coords2" displayDecimals="2" />
  <copy prop="coords" target="_point3" assignNames="coords3" displayDecimals="2" />
  <copy prop="coords" target="_point4" assignNames="coords4" displayDecimals="2" />
  <text>a</text>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');


    cy.get('#\\/h1Val').should('have.text', 'false')
    cy.get('#\\/h2Val').should('have.text', 'true')
    cy.get('#\\/i1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0=y−2')
    })
    cy.get('#\\/i2').find('.mjx-mrow').should('not.exist');

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();
    cy.get('#\\/h1Val').should('have.text', 'true')
    cy.get('#\\/h2Val').should('have.text', 'false')
    cy.get('#\\/i1').find('.mjx-mrow').should('not.exist');
    cy.get('#\\/i2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0=y−2')
    })


    cy.log(`make first line vertical`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: 5 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: -5 }
      })
    })

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(3,5)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(3,−5)');

    cy.get('#\\/i1 .mjx-mrow').should('not.exist');
    cy.get('#\\/i2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();
    cy.get('#\\/h1Val').should('have.text', 'false')
    cy.get('#\\/h2Val').should('have.text', 'true')
    cy.get('#\\/i2 .mjx-mrow').should('not.exist');
    cy.get('#\\/i1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,2)')
    })

    cy.log(`make second line vertical`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -4, y: 5 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -4, y: -5 }
      })
    })

    cy.get('#\\/coords3 .mjx-mrow').should('contain.text', '(−4,5)');
    cy.get('#\\/coords4 .mjx-mrow').should('contain.text', '(−4,−5)');

    cy.get('#\\/i1 .mjx-mrow').should('not.exist');
    cy.get('#\\/i2 .mjx-mrow').should('not.exist');

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/h1Val').should('have.text', 'true')
    cy.get('#\\/h2Val').should('have.text', 'false')
    cy.get('#\\/i1 .mjx-mrow').should('not.exist');
    cy.get('#\\/i2 .mjx-mrow').should('not.exist');

    cy.log(`make lines intersect again`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: -7 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 8, y: 9 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 4, y: 6 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -4, y: -6 }
      })
    })


    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(−8,−7)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(8,9)');
    cy.get('#\\/coords3 .mjx-mrow').should('contain.text', '(4,6)');
    cy.get('#\\/coords4 .mjx-mrow').should('contain.text', '(−4,−6)');


    cy.get('#\\/i1 .mjx-mrow').should('not.exist');
    cy.get('#\\/i2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    })

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/h1Val').should('have.text', 'false')
    cy.get('#\\/h2Val').should('have.text', 'true')
    cy.get('#\\/i1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,3)')
    })
    cy.get('#\\/i2 .mjx-mrow').should('not.exist');


    cy.log(`make lines equal again`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 6, y: 9 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -6, y: -9 }
      })
    })


    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', '(6,9)');
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(−6,−9)');


    cy.get('#\\/i1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0=18x−12y')
    })
    cy.get('#\\/i2 .mjx-mrow').should('not.exist');

    cy.get('#\\/h1').click();
    cy.get('#\\/h2').click();

    cy.get('#\\/h1Val').should('have.text', 'true')
    cy.get('#\\/h2Val').should('have.text', 'false')
    cy.get('#\\/i1 .mjx-mrow').should('not.exist');
    cy.get('#\\/i2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0=18x−12y')
    })

  });

  // gap not so relevant any more with new sugar
  // Not sure how to make this work with core as a web work
  it.skip('sugar coords with defining gap', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <mathinput name="n"/>

  <graph>
    <point>(<math>5</math><sequence from="2" to="$n" /><math>1</math>,4 )</point>
  </graph>

  <text>a</text>
    `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = stateVariables['/_point1'].attributes.xs.component.activeChildren[0];
      let math1 = x1.definingChildren[0];
      let math1Name = math1.componentName;
      let math2 = x1.definingChildren[2];
      let math2Name = math2.componentName;

      cy.window().then(async (win) => {
        expect(x1.definingChildren.map(x => x.componentName)).eqls(
          [math1Name, '/_sequence1', math2Name]);
        expect(x1.activeChildren.map(x => x.componentName)).eqls(
          [math1Name, math2Name]);
        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(5)
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4)
      })

      cy.get('#\\/n textarea').type("2{enter}", { force: true }).
        blur();

      cy.window().then(async (win) => {
        let math3 = stateVariables['/_sequence1'].replacements[0].adapterUsed;
        let math3Name = math3.componentName;
        expect(x1.definingChildren.map(x => x.componentName)).eqls(
          [math1Name, '/_sequence1', math2Name]);
        expect(x1.activeChildren.map(x => x.componentName)).eqls(
          [math1Name, math3Name, math2Name]);
        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(10)
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(4)

      })
    })
  })

  it('copying via x1 and x2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <point>(<copy prop="x2" target="_point1" />, <copy prop="x1" target="_point1" />)</point>
  </graph>
  <copy prop="coords" target="_point2" assignNames="coords2" />
    `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(2,1)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(2);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(2);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(1);
    })

    cy.log("move point 2")
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -4, y: 9 }
      })
    })
    cy.get('#\\/coords2 .mjx-mrow').should('contain.text', '(−4,9)');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(9);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(-4);
      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(-4);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(9);
    })

  })

  it('updating via point children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point name="p1"><point name="p2">(1,2)</point></point>
  </graph>
  
  <graph>
  <point name="p3"><copy target="p1" assignNames="p4"/></point>
  </graph>
  
  <graph>
  <point name="p5"><copy target="p2" assignNames="p6"/></point>
  </graph>
  
  <graph>
  <point name="p7"><copy target="_copy1" assignNames="p8" /></point>
  </graph>
  <copy prop="coords" target="p1" assignNames="coords1" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let points = [
      '/p1', '/p2', '/p3', '/p4', '/p5', '/p6', '/p7', '/p8'
    ];
    let xs = [-10, 6, -4, 2, -9, -5, -2, 4];
    let ys = [8, 3, -3, -2, -6, 5, -9, 0];

    cy.log("initial positions")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(1,2)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 1;
      let y = 2;
      for (let point of points) {
        expect((stateVariables[point].stateValues.xs)[0]).eq(x);
        expect((stateVariables[point].stateValues.xs)[1]).eq(y);
      }
    })

    cy.log("move each point in turn")
    for (let i = 0; i < 8; i++) {
      let x = xs[i];
      let y = ys[i];

      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePoint",
          componentName: points[i],
          args: { x, y }
        })
      })
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        for (let point of points) {
          expect((stateVariables[point].stateValues.xs)[0]).eq(x);
          expect((stateVariables[point].stateValues.xs)[1]).eq(y);
        }

      })
    }
  })

  it('combining different components through copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <copy target="_point1" />
    <copy target="_point1" />
    <point x = "$(_copy1.y)" y="$(_copy2.x)" />
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial positions")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(1,2)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 1;
      let y = 2;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);
      })
    });


    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 9;
      let y = -1;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);
      })
    });
  })

  it('combining different components through copies 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <copy target="_point1" />
    <copy target="_point1" />
    <point x = "$(_copy1.y)" y="$(_copy2.x)" />
  </graph>
  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial positions")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(1,2)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 1;
      let y = 2;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {

      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);
      })
    });


    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 9;
      let y = -1;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);
      })
    });
  })

  it('copy prop of copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math><copy prop="y" target="p1a" assignNames="p1ay" /></math>

    <graph>
      <copy name="p1a" target="p1" assignNames="p1ap" />
    </graph>
    
    <graph>
      <point name="p1" x="3" y="7" />
    </graph>

    <copy prop="coords" target="p1" assignNames="coords1" />
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(3,7)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 3;
      let y = 7;

      expect((stateVariables['/p1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/p1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/p1ap'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/p1ap'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/p1ay'].stateValues.value)).eq(y);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/p1',
        args: { x, y }
      })


      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/p1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/p1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1ap'].stateValues.xs)[1]).eq(y);
        expect((stateVariables['/p1ay'].stateValues.value)).eq(y);
      })

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(y.toString())
      })
    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;


      win.callAction1({
        actionName: "movePoint",
        componentName: '/p1ap',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {

        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/p1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/p1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1ap'].stateValues.xs)[1]).eq(y);
        expect((stateVariables['/p1ay'].stateValues.value)).eq(y);
      })
      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(y.toString())
      })
    });

  })

  it('nested copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <copy assignNames="p1b" target="p1a" />
  </graph>
  
  <graph>
    <copy assignNames="p1a" target="p1" />
  </graph>
  
  <graph>
    <point name="p1" x="3" y="7"/>
  </graph>
  <copy prop="coords" target="p1" assignNames="coords1" />
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(3,7)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 3;
      let y = 7;

      expect((stateVariables['/p1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/p1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/p1a'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/p1a'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/p1b'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/p1b'].stateValues.xs)[1]).eq(y);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/p1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/p1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/p1a'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1a'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/p1b'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1b'].stateValues.xs)[1]).eq(y);

      });
    })

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;


      win.callAction1({
        actionName: "movePoint",
        componentName: '/p1a',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/p1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/p1a'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1a'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/p1b'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1b'].stateValues.xs)[1]).eq(y);
      })
    });


    cy.log("move point 3")
    cy.window().then(async (win) => {
      let x = -4;
      let y = 0;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/p1b',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/p1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/p1a'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1a'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/p1b'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/p1b'].stateValues.xs)[1]).eq(y);

      });

    })


  })

  it('points depending on each other', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point x="$(_point2.y)" y="7" />
    <point x="$(_point1.y)" y="9" />
  
  </graph>
  
  <copy prop="coords" target="_point1" assignNames="coords1" />
      
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(9,7)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

      });
    })

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

      });
    })

  })

  it('points depending on each other 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(<copy prop="y" target="_point2" />, 7)</point>
    <point>(<copy prop="y" target="_point1" />, 9)</point>
  </graph>
      
  <copy prop="coords" target="_point1" assignNames="coords1" />

  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(9,7)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);
      })
    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

      });
    })


  })

  it('points depending on each other through intermediaries', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point x="$(P2a.y)" y="7" />
    <point x="$(P1a.y)" y="9" />
  </graph>
  
  <graph>
    <copy name="P1a" target="_point1" assignNames="P1ap" />
    <copy name="P2a" target="_point2" assignNames="P2ap" />
  </graph>

  <copy prop="coords" target="_point1" assignNames="coords1" />
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(9,7)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

      expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

        expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);
      })
    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

        expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);
      })
    });


    cy.log("move point 3")
    cy.window().then(async (win) => {
      let x = 6;
      let y = -1;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/P1ap',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

        expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);
      })
    });


    cy.log("move point 4")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 2;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/P2ap',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

        expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);
      })
    });


  })

  it('points depending on each other through intermediaries 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(<copy prop="y" target="P2a" />, 7)</point>
    <point>(<copy prop="y" target="P1a" />, 9)</point>
  </graph>
  
  <graph>
    <copy name="P1a" target="_point1" assignNames="P1ap" />
    <copy name="P2a" target="_point2" assignNames="P2ap" />
  </graph>

  <copy prop="coords" target="_point1" assignNames="coords1" />

  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(9,7)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

      expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

        expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);
      })
    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

        expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);
      })
    });


    cy.log("move point 3")
    cy.window().then(async (win) => {
      let x = 6;
      let y = -1;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/P1ap',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

        expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);
      })
    });


    cy.log("move point 4")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 2;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/P2ap',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

        expect((stateVariables['/P1ap'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/P1ap'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/P2ap'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/P2ap'].stateValues.xs)[1]).eq(x);

      });
    })


  })

  it('points depending on each other, one using coords', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point coords="($(_point2.y), 7)" />
    <point x="$(_point1.y)" y="9" />
  
  </graph>

  <copy prop="coords" target="_point1" assignNames="coords1" />

  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(9,7)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);

    });

    cy.log("move point 1")
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);
      })
    });

    cy.log("move point 2")
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: y, y: x }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(y);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(x);
      })
    });


  })

  it('points depending on themselves', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(3, 2<copy prop="x" target="_point1"/>+1)</point>
    <point>(2<copy prop="y" target="_point2"/>+1, 3)</point>
  </graph>
     
  <copy prop="coords" target="_point1" assignNames="coords1" />
  <copy prop="coords" target="_point2" assignNames="coords2" />
  
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 3;
      let y1 = 2 * x1 + 1;

      let y2 = 3;
      let x2 = 2 * y2 + 1;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(${x1},${y1})`)

    });

    cy.log("move points")
    cy.window().then(async (win) => {
      let x1 = -3;
      let y1try = 5;

      let x2 = 9;
      let y2try = -7;

      let y1 = 2 * x1 + 1;
      let y2 = (x2 - 1) / 2;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x: x1, y: y1try }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: x2, y: y2try }
      })


      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x1)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y1)}`)
      cy.get('#\\/coords2 .mjx-mrow').should('contain.text', `${Math.abs(x2)}`)
      cy.get('#\\/coords2 .mjx-mrow').should('contain.text', `${Math.abs(y2)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

      })
    });


  })

  it('points depending original graph axis limit', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point x="3" y="$(_graph1.ymax{fixed='true'})" />
    <point>
      (<copy prop="xmin" fixed="true" target="_graph1" />,5)
    </point>
  </graph>

  <copy prop="coords" target="_point1" assignNames="coords1" />
  <copy prop="coords" target="_point2" assignNames="coords2" />
  
  `}, "*");
    });


    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 3;
      let y1 = 10;
      let x2 = -10
      let y2 = 5;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(${x1},${y1})`)

    });

    cy.log("move points")
    cy.window().then(async (win) => {
      let x1 = 1;
      let y1 = 5;
      let x2 = 8
      let y2 = -3;


      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x: x1, y: y1 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: x2, y: y2 }
      })


      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x1)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `10`)
      cy.get('#\\/coords2 .mjx-mrow').should('contain.text', `−10`)
      cy.get('#\\/coords2 .mjx-mrow').should('contain.text', `${Math.abs(y2)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(10);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(-10);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

      })
    });


  })

  it('label points by combining coordinates with other point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>
      <label><text><copy prop="x" displaydigits="3" target="_point1" />, <copy prop="x" displaydigits="3" target="_point2" /></text></label>
      (1,2)
    </point>
    <point>
      (3,4)
      <label><text><copy prop="y" displaydigits="3" target="_point1" />, <copy prop="y" displaydigits="3" target="_point2" /></text></label>
    </point>
  </graph>

  <p>Label 1: <copy prop="label" target="_point1" /></p>
  <p>Label 2: <copy prop="label" target="_point2" /></p>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/_p1').should('have.text', 'Label 1: 1, 3')
    cy.get('#\\/_p2').should('have.text', 'Label 2: 2, 4')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 1;
      let y1 = 2;
      let x2 = 3;
      let y2 = 4;

      let label1 = `${x1}, ${x2}`;
      let label2 = `${y1}, ${y2}`;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

      expect(stateVariables['/_point1'].stateValues.label).eq(label1);
      expect(stateVariables['/_point2'].stateValues.label).eq(label2);

    });

    cy.log("move points")
    cy.window().then(async (win) => {
      let x1 = 1;
      let y1 = 5;
      let x2 = 8
      let y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x: x1, y: y1 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: x2, y: y2 }
      })

      let label1 = `${x1}, ${x2}`;
      let label2 = `${y1}, ${y2}`;

      cy.get('#\\/_p1').should('have.text', `Label 1: ${label1}`)
      cy.get('#\\/_p2').should('have.text', `Label 2: ${label2}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

        expect(stateVariables['/_point1'].stateValues.label).eq(label1);
        expect(stateVariables['/_point2'].stateValues.label).eq(label2);

        cy.get('#\\/_p1').should('have.text', `Label 1: ${label1}`)
        cy.get('#\\/_p2').should('have.text', `Label 2: ${label2}`)

      });
    })


    cy.log("move points to fractional coordinates")
    cy.window().then(async (win) => {
      let x1 = 3.12552502;
      let y1 = -3.4815436398;
      let x2 = 0.36193540738
      let y2 = 7.813395519475;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x: x1, y: y1 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: x2, y: y2 }
      })


      let x1round = me.fromAst(x1).round_numbers_to_precision(3);
      let y1round = me.fromAst(y1).round_numbers_to_precision(3);
      let x2round = me.fromAst(x2).round_numbers_to_precision(3);
      let y2round = me.fromAst(y2).round_numbers_to_precision(3);

      let label1 = `${x1round}, ${x2round}`;
      let label2 = `${y1round}, ${y2round}`;


      cy.get('#\\/_p1').should('have.text', `Label 1: ${label1}`)
      cy.get('#\\/_p2').should('have.text', `Label 2: ${label2}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

        expect(stateVariables['/_point1'].stateValues.label).eq(label1);
        expect(stateVariables['/_point2'].stateValues.label).eq(label2);
      })
    });

  })

  it('label points by combining coordinates with other point 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>
      <label><copy prop="x" displaydigits="3" target="_point1" />, <copy prop="x" displaydigits="3" target="_point2" /></label>
      (1,2)
    </point>
    <point>
      (3,4)
      <label><copy prop="y" displaydigits="3" target="_point1" />, <copy prop="y" displaydigits="3" target="_point2" /></label>
    </point>
  </graph>

  <p>Label 1: <copy prop="label" target="_point1" /></p>
  <p>Label 2: <copy prop="label" target="_point2" /></p>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log("initial values")

    cy.get('#\\/_p1').should('contain.text', 'Label 1: ')
    cy.get('#\\/_p2').should('contain.text', 'Label 2: ')
    cy.get('#\\/_p1').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('1');
    })
    cy.get('#\\/_p1').find('.mjx-mrow').eq(1).invoke('text').then(text => {
      expect(text).eq('3');
    })
    cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('2');
    })
    cy.get('#\\/_p2').find('.mjx-mrow').eq(1).invoke('text').then(text => {
      expect(text).eq('4');
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 1;
      let y1 = 2;
      let x2 = 3;
      let y2 = 4;

      let label1 = `\\(${x1}\\), \\(${x2}\\)`;
      let label2 = `\\(${y1}\\), \\(${y2}\\)`;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

      expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
      expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

      expect(stateVariables['/_point1'].stateValues.label).eq(label1);
      expect(stateVariables['/_point2'].stateValues.label).eq(label2);

    });

    cy.log("move points")
    cy.window().then(async (win) => {
      let x1 = 1;
      let y1 = 5;
      let x2 = 8
      let y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x: x1, y: y1 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: x2, y: y2 }
      })

      let label1 = `\\(${x1}\\), \\(${x2}\\)`;
      let label2 = `\\(${y1}\\), \\(${y2}\\)`;

      cy.get('#\\/_p1').should('contain.text', `${x2}`)

      cy.get('#\\/_p1').find('.mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq(`${x1}`);
      })
      cy.get('#\\/_p1').find('.mjx-mrow').eq(1).invoke('text').then(text => {
        expect(text).eq(`${x2}`);
      })
      cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq(`${y1}`);
      })
      cy.get('#\\/_p2').find('.mjx-mrow').eq(1).invoke('text').then(text => {
        expect(text).eq(`−3`);
      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

        expect(stateVariables['/_point1'].stateValues.label).eq(label1);
        expect(stateVariables['/_point2'].stateValues.label).eq(label2);

      });
    })


    cy.log("move points to fractional coordinates")
    cy.window().then(async (win) => {
      let x1 = 3.12552502;
      let y1 = -3.4815436398;
      let x2 = 0.36193540738
      let y2 = 7.813395519475;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x: x1, y: y1 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point2',
        args: { x: x2, y: y2 }
      })


      let x1round = me.fromAst(x1).round_numbers_to_precision(3);
      let y1round = me.fromAst(y1).round_numbers_to_precision(3);
      let x2round = me.fromAst(x2).round_numbers_to_precision(3);
      let y2round = me.fromAst(y2).round_numbers_to_precision(3);

      let label1 = `\\(${x1round}\\), \\(${x2round}\\)`;
      let label2 = `\\(${y1round}\\), \\(${y2round}\\)`;

      cy.get('#\\/_p1').should('contain.text', `${x2round}`)

      cy.get('#\\/_p1').find('.mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq(`${x1round}`);
      })
      cy.get('#\\/_p1').find('.mjx-mrow').eq(1).invoke('text').then(text => {
        expect(text).eq(`${x2round}`);
      })
      cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then(text => {
        expect(text).eq(`−3.48`);
      })
      cy.get('#\\/_p2').find('.mjx-mrow').eq(1).invoke('text').then(text => {
        expect(text).eq(`${y2round}`);
      })

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x1);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y1);

        expect((stateVariables['/_point2'].stateValues.xs)[0]).eq(x2);
        expect((stateVariables['/_point2'].stateValues.xs)[1]).eq(y2);

        expect(stateVariables['/_point1'].stateValues.label).eq(label1);
        expect(stateVariables['/_point2'].stateValues.label).eq(label2);
      })
    });

  })

  it('update point with constraints', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math hide name="fixed0" fixed>0</math>
    <graph>
      <point x="-4" y="1">
        <constraints>
          <attractTo><point>(1,-7)</point></attractTo>
        </constraints>
      </point>
      <point x="$(_point1.x)" y="$fixed0" />
      <point y="$(_point1.y)" x="$fixed0" />
    </graph>

    <copy prop="coords" target="_point1" assignNames="coords1" />
    
    <booleaninput name="bi" /><copy prop="value" target="bi" assignNames="b" />
  `}, "*");
    });

    cy.get("#\\/_text1").should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(−4,1)`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = -4;
      let y = 1;

      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);
      expect((stateVariables['/_point3'].stateValues.xs)[0]).eq(x);
      expect((stateVariables['/_point3'].stateValues.xs)[1]).eq(0);
      expect((stateVariables['/_point4'].stateValues.xs)[0]).eq(0);
      expect((stateVariables['/_point4'].stateValues.xs)[1]).eq(y);

    });

    cy.log("move first point")
    cy.window().then(async (win) => {
      let x = 3;
      let y = -2;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point1',
        args: { x, y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);
        expect((stateVariables['/_point3'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point3'].stateValues.xs)[1]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[0]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[1]).eq(y);
      })
    });

    cy.log("move x-axis point")
    cy.window().then(async (win) => {
      let x = 9;
      let y = -2;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point3',
        args: { x, y: -3 }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);
        expect((stateVariables['/_point3'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point3'].stateValues.xs)[1]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[0]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[1]).eq(y);
      })
    });

    cy.log("move y-axis point")
    cy.window().then(async (win) => {
      let x = 9;
      let y = -7.1;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point4',
        args: { x: -10, y: y }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(x)}`)
      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `${Math.abs(y)}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);
        expect((stateVariables['/_point3'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point3'].stateValues.xs)[1]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[0]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[1]).eq(y);
      })
    });

    cy.log("move near attractor")
    cy.window().then(async (win) => {
      let x = 1;
      let y = -7;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point3',
        args: { x: 0.9, y: 6 }
      })

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(1,−7)`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);
        expect((stateVariables['/_point3'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point3'].stateValues.xs)[1]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[0]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[1]).eq(y);
      })
    });

    cy.log("move again near attractor to make sure doesn't change")
    cy.window().then(async (win) => {
      let x = 1;
      let y = -7;

      win.callAction1({
        actionName: "movePoint",
        componentName: '/_point3',
        args: { x: 1.1, y: 6 }
      })

      // since nothing has changed in the DOM
      // check boolean input and wait for it to change
      // to make sure got message back from core
      cy.get('#\\/bi').click();
      cy.get('#\\/b').should('have.text', 'true');

      cy.get('#\\/coords1 .mjx-mrow').should('contain.text', `(1,−7)`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(y);
        expect((stateVariables['/_point3'].stateValues.xs)[0]).eq(x);
        expect((stateVariables['/_point3'].stateValues.xs)[1]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[0]).eq(0);
        expect((stateVariables['/_point4'].stateValues.xs)[1]).eq(y);
      })
    });
  })

  it('change point dimensions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Specify point coordinates: <mathinput name="originalCoords" /></p>

    <section name="thePoints"><title>The points</title>
    <p name="point1p">The point: <point coords="$originalCoords"/></p>
    <p name="point2p">The point copied: <copy assignNames="point2" target="_point1"/></p>
    <p name="point3p">The point copied again: <copy assignNames="point3" target="point2"/></p>
    </section>

    <section><title>From point 1</title>
    <p>Number of dimensions: <copy assignNames="nDimensions1" prop="nDimensions" target="_point1" /></p>
    <p name="p1x">x-coordinate: <copy assignNames="point1x1" prop="x1" target="_point1"/></p>
    <p name="p1y">y-coordinate: <copy assignNames="point1x2" prop="x2" target="_point1"/></p>
    <p name="p1z">z-coordinate: <copy assignNames="point1x3" prop="x3" target="_point1"/></p>
    <p name="p1all">All individual coordinates: <aslist><copy prop="xs" target="_point1"/></aslist></p>
    <p>Coordinates: <copy assignNames="coords1" prop="coords" target="_point1"/></p>
    </section>

    <section><title>From point 2</title>
    <p>Number of dimensions: <copy assignNames="nDimensions2" prop="nDimensions" target="point2" /></p>
    <p name="p2x">x-coordinate: <copy assignNames="point2x1" prop="x1" target="point2"/></p>
    <p name="p2y">y-coordinate: <copy assignNames="point2x2" prop="x2" target="point2"/></p>
    <p name="p2z">z-coordinate: <copy assignNames="point2x3" prop="x3" target="point2"/></p>
    <p name="p2all">All individual coordinates: <aslist><copy prop="xs" target="point2"/></aslist></p>
    <p>Coordinates: <copy assignNames="coords2" prop="coords" target="point2"/></p>
    </section>

    <section><title>From point 3</title>
    <p>Number of dimensions: <copy assignNames="nDimensions3" prop="nDimensions" target="point3" /></p>
    <p name="p3x">x-coordinate: <copy assignNames="point3x1" prop="x1" target="point3"/></p>
    <p name="p3y">y-coordinate: <copy assignNames="point3x2" prop="x2" target="point3"/></p>
    <p name="p3z">z-coordinate: <copy assignNames="point3x3" prop="x3" target="point3"/></p>
    <p name="p3all">All individual coordinates: <aslist><copy prop="xs" target="point3"/></aslist></p>
    <p>Coordinates: <copy assignNames="coords3" prop="coords" target="point3"/></p>
    </section>

    <section><title>For point 1</title>
    <p>Change coords: <mathinput name="coords1b" bindValueTo="$(_point1.coords)" /></p>
    <p>Change x-coordinate: <mathinput name="point1x1b" bindValueTo="$(_point1.x1)" /></p>
    <p>Change y-coordinate: <mathinput name="point1x2b" bindValueTo="$(_point1.x2)" /></p>
    <p>Change z-coordinate: <mathinput name="point1x3b" bindValueTo="$(_point1.x3)" /></p>    
    </section>

    <section><title>For point 2</title>
    <p>Change coords: <mathinput name="coords2b" bindValueTo="$(point2.coords)" /></p>
    <p>Change x-coordinate: <mathinput name="point2x1b" bindValueTo="$(point2.x1)" /></p>
    <p>Change y-coordinate: <mathinput name="point2x2b" bindValueTo="$(point2.x2)" /></p>
    <p>Change z-coordinate: <mathinput name="point2x3b" bindValueTo="$(point2.x3)" /></p>    
    </section>

    <section><title>For point 3</title>
    <p>Change coords: <mathinput name="coords3b" bindValueTo="$(point3.coords)" /></p>
    <p>Change x-coordinate: <mathinput name="point3x1b" bindValueTo="$(point3.x1)" /></p>
    <p>Change y-coordinate: <mathinput name="point3x2b" bindValueTo="$(point3.x2)" /></p>
    <p>Change z-coordinate: <mathinput name="point3x3b" bindValueTo="$(point3.x3)" /></p>    
    </section>

    <section><title>collecting</title>
    <p name="pallx">x-coordinates: <aslist><collect assignNames="pointallx1A pointallx1B pointallx1C" componentTypes="point" prop="x1" target="thePoints"/></aslist></p>
    <p name="pally">y-coordinates: <aslist><collect assignNames="pointallx2A pointallx2B pointallx2C" componentTypes="point" prop="x2" target="thePoints"/></aslist></p>
    <p name="pallz">z-coordinates: <aslist><collect assignNames="pointallx3A pointallx3B pointallx3C" componentTypes="point" prop="x3" target="thePoints"/></aslist></p>
    <p name="pallall">All individual coordinates: <aslist><collect assignNames="pointallxsA pointallxsB pointallxsC" componentTypes="point" prop="xs" target="thePoints"/></aslist></p>
    <p>Coordinates: <aslist><collect assignNames="coordsallA coordsallB coordsallC" componentTypes="point" prop="coords" target="thePoints"/></aslist></p>
    </section>

    <section><title>Extracting from point 3</title>
    <p name="p3xe">x-coordinate: <extract assignNames="point3x1e" prop="x1"><copy target="point3"/></extract></p>
    <p name="p3ye">y-coordinate: <extract assignNames="point3x2e" prop="x2"><copy target="point3"/></extract></p>
    <p name="p3ze">z-coordinate: <extract assignNames="point3x3e" prop="x3"><copy target="point3"/></extract></p>
    <p name="p3alle">All individual coordinates: <aslist><extract prop="xs"><copy target="point3"/></extract></aslist></p>
    <p>Coordinates: <extract assignNames="coords3e" prop="coords"><copy target="point3"/></extract></p>
    </section>
 
  `}, "*");
    });

    cy.get("#\\/_text1").should('have.text', 'a'); // to wait for page to load

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/nDimensions1").should('have.text', '1');
    cy.get("#\\/nDimensions2").should('have.text', '1');
    cy.get("#\\/nDimensions3").should('have.text', '1');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/p1y").should('have.text', 'y-coordinate: ')
    cy.get("#\\/p2y").should('have.text', 'y-coordinate: ')
    cy.get("#\\/p3y").should('have.text', 'y-coordinate: ')
    cy.get("#\\/p3ye").should('have.text', 'y-coordinate: ')
    cy.get("#\\/pally").should('have.text', 'y-coordinates: ')
    cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
    cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('＿');
      expect(stateVariables['/_point1'].stateValues.x1).eq('＿');
      expect(stateVariables['/_point1'].stateValues.x2).eq(undefined);
      expect(stateVariables['/_point1'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(1);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('＿');
      expect(stateVariables['/point2'].stateValues.x1).eq('＿');
      expect(stateVariables['/point2'].stateValues.x2).eq(undefined);
      expect(stateVariables['/point2'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(1);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('＿');
      expect(stateVariables['/point3'].stateValues.x1).eq('＿');
      expect(stateVariables['/point3'].stateValues.x2).eq(undefined);
      expect(stateVariables['/point3'].stateValues.x3).eq(undefined);

    });

    cy.log('Create 2D point')
    cy.get('#\\/originalCoords textarea').type('{end}{backspace}(a,b){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(a,b)')
    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '2');
    cy.get("#\\/nDimensions2").should('have.text', '2');
    cy.get("#\\/nDimensions3").should('have.text', '2');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
    cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('b');
      expect(stateVariables['/_point1'].stateValues.x1).eq('a');
      expect(stateVariables['/_point1'].stateValues.x2).eq('b');
      expect(stateVariables['/_point1'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('b');
      expect(stateVariables['/point2'].stateValues.x1).eq('a');
      expect(stateVariables['/point2'].stateValues.x2).eq('b');
      expect(stateVariables['/point2'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('b');
      expect(stateVariables['/point3'].stateValues.x1).eq('a');
      expect(stateVariables['/point3'].stateValues.x2).eq('b');
      expect(stateVariables['/point3'].stateValues.x3).eq(undefined);

    });



    cy.log('Back to 1D point')
    cy.get('#\\/originalCoords textarea').type('{ctrl+home}{shift+end}{backspace}q{enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', 'q')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/nDimensions1").should('have.text', '1');
    cy.get("#\\/nDimensions2").should('have.text', '1');
    cy.get("#\\/nDimensions3").should('have.text', '1');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })

    cy.get("#\\/p1y").should('have.text', 'y-coordinate: ')
    cy.get("#\\/p2y").should('have.text', 'y-coordinate: ')
    cy.get("#\\/p3y").should('have.text', 'y-coordinate: ')
    cy.get("#\\/p3ye").should('have.text', 'y-coordinate: ')
    cy.get("#\\/pally").should('have.text', 'y-coordinates: ')

    cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
    cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).should('not.exist')
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).should('not.exist')
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).should('not.exist')
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).should('not.exist')
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('q');
      expect(stateVariables['/_point1'].stateValues.x1).eq('q');
      expect(stateVariables['/_point1'].stateValues.x2).eq(undefined);
      expect(stateVariables['/_point1'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(1);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('q');
      expect(stateVariables['/point2'].stateValues.x1).eq('q');
      expect(stateVariables['/point2'].stateValues.x2).eq(undefined);
      expect(stateVariables['/point2'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(1);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('q');
      expect(stateVariables['/point3'].stateValues.x1).eq('q');
      expect(stateVariables['/point3'].stateValues.x2).eq(undefined);
      expect(stateVariables['/point3'].stateValues.x3).eq(undefined);

    });



    cy.log('Create 3D point')
    cy.get('#\\/originalCoords textarea').type('{end}{backspace}(2x,u/v{rightarrow},w^2{rightarrow}){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(2x,uv,w2)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/p3alle .mjx-mrow").should('contain.text', "2x")
    cy.get("#\\/p3alle .mjx-mrow").should('contain.text', "uv")
    cy.get("#\\/p3alle .mjx-mrow").should('contain.text', "w2")
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(9).invoke('text').then((text) => {
      expect(text.trim()).equal('uv')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(10).invoke('text').then((text) => {
      expect(text.trim()).equal('w2')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eqls(["*", 2, "x"]);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eqls(["/", "u", "v"]);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eqls(["^", "w", 2]);
      expect(stateVariables['/_point1'].stateValues.x1).eqls(["*", 2, "x"]);;
      expect(stateVariables['/_point1'].stateValues.x2).eqls(["/", "u", "v"]);
      expect(stateVariables['/_point1'].stateValues.x3).eqls(["^", "w", 2]);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eqls(["*", 2, "x"]);
      expect((stateVariables['/point2'].stateValues.xs)[1]).eqls(["/", "u", "v"]);
      expect((stateVariables['/point2'].stateValues.xs)[2]).eqls(["^", "w", 2]);
      expect(stateVariables['/point2'].stateValues.x1).eqls(["*", 2, "x"]);
      expect(stateVariables['/point2'].stateValues.x2).eqls(["/", "u", "v"]);
      expect(stateVariables['/point2'].stateValues.x3).eqls(["^", "w", 2]);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eqls(["*", 2, "x"]);
      expect((stateVariables['/point3'].stateValues.xs)[1]).eqls(["/", "u", "v"]);
      expect((stateVariables['/point3'].stateValues.xs)[2]).eqls(["^", "w", 2]);
      expect(stateVariables['/point3'].stateValues.x1).eqls(["*", 2, "x"]);
      expect(stateVariables['/point3'].stateValues.x2).eqls(["/", "u", "v"]);
      expect(stateVariables['/point3'].stateValues.x3).eqls(["^", "w", 2]);

    });


    cy.log('change the coordinates from point 1 coords')
    cy.get("#\\/coords1b textarea").type('{ctrl+home}{shift+end}{backspace}(7,8,9){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(7,8,9)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(7,8,9)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq(7);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq(8);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq(9);
      expect(stateVariables['/_point1'].stateValues.x1).eq(7);;
      expect(stateVariables['/_point1'].stateValues.x2).eq(8);
      expect(stateVariables['/_point1'].stateValues.x3).eq(9);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq(7);
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq(8);
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq(9);
      expect(stateVariables['/point2'].stateValues.x1).eq(7);
      expect(stateVariables['/point2'].stateValues.x2).eq(8);
      expect(stateVariables['/point2'].stateValues.x3).eq(9);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq(7);
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq(8);
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq(9);
      expect(stateVariables['/point3'].stateValues.x1).eq(7);
      expect(stateVariables['/point3'].stateValues.x2).eq(8);
      expect(stateVariables['/point3'].stateValues.x3).eq(9);

    });


    cy.log('change the coordinates from point 2 coords')
    cy.get("#\\/coords2b textarea").type('{ctrl+home}{shift+end}{backspace}(i,j,k){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(i,j,k)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('i')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('j')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('k')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(i,j,k)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('i');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('j');
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq('k');
      expect(stateVariables['/_point1'].stateValues.x1).eq('i');;
      expect(stateVariables['/_point1'].stateValues.x2).eq('j');
      expect(stateVariables['/_point1'].stateValues.x3).eq('k');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('i');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('j');
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq('k');
      expect(stateVariables['/point2'].stateValues.x1).eq('i');
      expect(stateVariables['/point2'].stateValues.x2).eq('j');
      expect(stateVariables['/point2'].stateValues.x3).eq('k');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('i');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('j');
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq('k');
      expect(stateVariables['/point3'].stateValues.x1).eq('i');
      expect(stateVariables['/point3'].stateValues.x2).eq('j');
      expect(stateVariables['/point3'].stateValues.x3).eq('k');

    });



    cy.log('change the coordinates from point 3 coords')
    cy.get("#\\/coords3b textarea").type('{ctrl+home}{shift+end}{backspace}(l,m,n){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(l,m,n)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('l')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('m')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('n')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(l,m,n)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('l');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('m');
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq('n');
      expect(stateVariables['/_point1'].stateValues.x1).eq('l');;
      expect(stateVariables['/_point1'].stateValues.x2).eq('m');
      expect(stateVariables['/_point1'].stateValues.x3).eq('n');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('l');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('m');
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq('n');
      expect(stateVariables['/point2'].stateValues.x1).eq('l');
      expect(stateVariables['/point2'].stateValues.x2).eq('m');
      expect(stateVariables['/point2'].stateValues.x3).eq('n');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('l');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('m');
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq('n');
      expect(stateVariables['/point3'].stateValues.x1).eq('l');
      expect(stateVariables['/point3'].stateValues.x2).eq('m');
      expect(stateVariables['/point3'].stateValues.x3).eq('n');

    });



    cy.log('change the coordinates from point 1 individual components')
    cy.get("#\\/point1x1b textarea").type('{end}{backspace}r{enter}', { force: true });
    cy.get("#\\/point1x2b textarea").type('{end}{backspace}s{enter}', { force: true });
    cy.get("#\\/point1x3b textarea").type('{end}{backspace}t{enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(r,s,t)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(r,s,t)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('r');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('s');
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq('t');
      expect(stateVariables['/_point1'].stateValues.x1).eq('r');;
      expect(stateVariables['/_point1'].stateValues.x2).eq('s');
      expect(stateVariables['/_point1'].stateValues.x3).eq('t');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('r');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('s');
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq('t');
      expect(stateVariables['/point2'].stateValues.x1).eq('r');
      expect(stateVariables['/point2'].stateValues.x2).eq('s');
      expect(stateVariables['/point2'].stateValues.x3).eq('t');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('r');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('s');
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq('t');
      expect(stateVariables['/point3'].stateValues.x1).eq('r');
      expect(stateVariables['/point3'].stateValues.x2).eq('s');
      expect(stateVariables['/point3'].stateValues.x3).eq('t');

    });



    cy.log('change the coordinates from point 2 individual components')
    cy.get("#\\/point2x1b textarea").type('{end}{backspace}f{enter}', { force: true });
    cy.get("#\\/point2x2b textarea").type('{end}{backspace}g{enter}', { force: true });
    cy.get("#\\/point2x3b textarea").type('{end}{backspace}h{enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(f,g,h)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })

    // TODO: makes no sense why this is failing. 
    // It seems to be in the DOM just like the others
    // cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
    //   expect(text.trim()).equal('h')
    // })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(f,g,h)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('f');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('g');
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq('h');
      expect(stateVariables['/_point1'].stateValues.x1).eq('f');;
      expect(stateVariables['/_point1'].stateValues.x2).eq('g');
      expect(stateVariables['/_point1'].stateValues.x3).eq('h');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('f');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('g');
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq('h');
      expect(stateVariables['/point2'].stateValues.x1).eq('f');
      expect(stateVariables['/point2'].stateValues.x2).eq('g');
      expect(stateVariables['/point2'].stateValues.x3).eq('h');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('f');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('g');
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq('h');
      expect(stateVariables['/point3'].stateValues.x1).eq('f');
      expect(stateVariables['/point3'].stateValues.x2).eq('g');
      expect(stateVariables['/point3'].stateValues.x3).eq('h');

    });



    cy.log('change the coordinates from point 3 individual components')
    cy.get("#\\/point3x1b textarea").type('{end}{backspace}x{enter}', { force: true });
    cy.get("#\\/point3x2b textarea").type('{end}{backspace}y{enter}', { force: true });
    cy.get("#\\/point3x3b textarea").type('{end}{backspace}z{enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(x,y,z)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(x,y,z)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('x');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('y');
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/_point1'].stateValues.x1).eq('x');;
      expect(stateVariables['/_point1'].stateValues.x2).eq('y');
      expect(stateVariables['/_point1'].stateValues.x3).eq('z');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('x');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('y');
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/point2'].stateValues.x1).eq('x');
      expect(stateVariables['/point2'].stateValues.x2).eq('y');
      expect(stateVariables['/point2'].stateValues.x3).eq('z');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('x');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('y');
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/point3'].stateValues.x1).eq('x');
      expect(stateVariables['/point3'].stateValues.x2).eq('y');
      expect(stateVariables['/point3'].stateValues.x3).eq('z');

    });



    cy.log(`can't decrease dimension from inverse direction 1`)
    cy.get("#\\/coords1b textarea").type('{ctrl+home}{shift+end}{backspace}(u,v){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(u,v,z)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })


    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('u')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('v')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(u,v,z)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('u');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('v');
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/_point1'].stateValues.x1).eq('u');;
      expect(stateVariables['/_point1'].stateValues.x2).eq('v');
      expect(stateVariables['/_point1'].stateValues.x3).eq('z');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('u');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('v');
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/point2'].stateValues.x1).eq('u');
      expect(stateVariables['/point2'].stateValues.x2).eq('v');
      expect(stateVariables['/point2'].stateValues.x3).eq('z');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('u');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('v');
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/point3'].stateValues.x1).eq('u');
      expect(stateVariables['/point3'].stateValues.x2).eq('v');
      expect(stateVariables['/point3'].stateValues.x3).eq('z');

    });



    cy.log(`can't decrease dimension from inverse direction 2`)
    cy.get("#\\/coords2b textarea").type('{ctrl+home}{shift+end}{backspace}(s,t){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(s,t,z)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })


    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('s')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('t')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(s,t,z)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('s');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('t');
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/_point1'].stateValues.x1).eq('s');;
      expect(stateVariables['/_point1'].stateValues.x2).eq('t');
      expect(stateVariables['/_point1'].stateValues.x3).eq('z');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('s');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('t');
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/point2'].stateValues.x1).eq('s');
      expect(stateVariables['/point2'].stateValues.x2).eq('t');
      expect(stateVariables['/point2'].stateValues.x3).eq('z');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('s');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('t');
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/point3'].stateValues.x1).eq('s');
      expect(stateVariables['/point3'].stateValues.x2).eq('t');
      expect(stateVariables['/point3'].stateValues.x3).eq('z');

    });


    cy.log(`can't decrease dimension from inverse direction 3`)
    cy.get("#\\/coords3b textarea").type('{ctrl+home}{shift+end}{backspace}(q,r){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(q,r,z)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '3');
    cy.get("#\\/nDimensions2").should('have.text', '3');
    cy.get("#\\/nDimensions3").should('have.text', '3');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/point1x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point2x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point3x3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/point3x3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pointallx3C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })


    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).invoke('text').then((text) => {
      expect(text.trim()).equal('r')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(q,r,z)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('q');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('r');
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/_point1'].stateValues.x1).eq('q');;
      expect(stateVariables['/_point1'].stateValues.x2).eq('r');
      expect(stateVariables['/_point1'].stateValues.x3).eq('z');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('q');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('r');
      expect((stateVariables['/point2'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/point2'].stateValues.x1).eq('q');
      expect(stateVariables['/point2'].stateValues.x2).eq('r');
      expect(stateVariables['/point2'].stateValues.x3).eq('z');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('q');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('r');
      expect((stateVariables['/point3'].stateValues.xs)[2]).eq('z');
      expect(stateVariables['/point3'].stateValues.x1).eq('q');
      expect(stateVariables['/point3'].stateValues.x2).eq('r');
      expect(stateVariables['/point3'].stateValues.x3).eq('z');

    });






    cy.log('Back to 2D point')
    cy.get('#\\/originalCoords textarea').type('{ctrl+home}{shift+end}{backspace}(p,q){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(p,q)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '2');
    cy.get("#\\/nDimensions2").should('have.text', '2');
    cy.get("#\\/nDimensions3").should('have.text', '2');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
    cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('p')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('p');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('q');
      expect(stateVariables['/_point1'].stateValues.x1).eq('p');
      expect(stateVariables['/_point1'].stateValues.x2).eq('q');
      expect(stateVariables['/_point1'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('p');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('q');
      expect(stateVariables['/point2'].stateValues.x1).eq('p');
      expect(stateVariables['/point2'].stateValues.x2).eq('q');
      expect(stateVariables['/point2'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('p');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('q');
      expect(stateVariables['/point3'].stateValues.x1).eq('p');
      expect(stateVariables['/point3'].stateValues.x2).eq('q');
      expect(stateVariables['/point3'].stateValues.x3).eq(undefined);

    });


    cy.log(`can't increase dimension from inverse direction 1`)
    cy.get("#\\/coords1b textarea").type('{ctrl+home}{shift+end}{backspace}(a,b,c){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(a,b)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '2');
    cy.get("#\\/nDimensions2").should('have.text', '2');
    cy.get("#\\/nDimensions3").should('have.text', '2');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
    cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('b');
      expect(stateVariables['/_point1'].stateValues.x1).eq('a');
      expect(stateVariables['/_point1'].stateValues.x2).eq('b');
      expect(stateVariables['/_point1'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('b');
      expect(stateVariables['/point2'].stateValues.x1).eq('a');
      expect(stateVariables['/point2'].stateValues.x2).eq('b');
      expect(stateVariables['/point2'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('b');
      expect(stateVariables['/point3'].stateValues.x1).eq('a');
      expect(stateVariables['/point3'].stateValues.x2).eq('b');
      expect(stateVariables['/point3'].stateValues.x3).eq(undefined);

    });



    cy.log(`can't increase dimension from inverse direction 2`)
    cy.get("#\\/coords2b textarea").type('{ctrl+home}{shift+end}{backspace}(d,e,f){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(d,e)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '2');
    cy.get("#\\/nDimensions2").should('have.text', '2');
    cy.get("#\\/nDimensions3").should('have.text', '2');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
    cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('d')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('e')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(d,e)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('d');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('e');
      expect(stateVariables['/_point1'].stateValues.x1).eq('d');
      expect(stateVariables['/_point1'].stateValues.x2).eq('e');
      expect(stateVariables['/_point1'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('d');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('e');
      expect(stateVariables['/point2'].stateValues.x1).eq('d');
      expect(stateVariables['/point2'].stateValues.x2).eq('e');
      expect(stateVariables['/point2'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('d');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('e');
      expect(stateVariables['/point3'].stateValues.x1).eq('d');
      expect(stateVariables['/point3'].stateValues.x2).eq('e');
      expect(stateVariables['/point3'].stateValues.x3).eq(undefined);

    });


    cy.log(`can't increase dimension from inverse direction 3`)
    cy.get("#\\/coords3b textarea").type('{ctrl+home}{shift+end}{backspace}(g,h,i){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(g,h)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/nDimensions1").should('have.text', '2');
    cy.get("#\\/nDimensions2").should('have.text', '2');
    cy.get("#\\/nDimensions3").should('have.text', '2');
    cy.get("#\\/point1x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/point2x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/point3x1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/point3x1e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pointallx1A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pointallx1B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pointallx1C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/point1x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/point2x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/point3x2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/point3x2e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pointallx2A").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pointallx2B").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pointallx2C").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/p1z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p2z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3z").should('have.text', 'z-coordinate: ')
    cy.get("#\\/p3ze").should('have.text', 'z-coordinate: ')
    cy.get("#\\/pallz").should('have.text', 'z-coordinates: ')

    cy.get("#\\/p1all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/p1all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p2all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/p2all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3all").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/p3all").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/p3alle").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/p3alle").find('.mjx-mrow').eq(2).should('not.exist')

    cy.get("#\\/pallall").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(2).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(3).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(4).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(5).invoke('text').then((text) => {
      expect(text.trim()).equal('h')
    })
    cy.get("#\\/pallall").find('.mjx-mrow').eq(6).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(7).should('not.exist')
    cy.get("#\\/pallall").find('.mjx-mrow').eq(8).should('not.exist')

    cy.get("#\\/coords1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/coords2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/coords3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/coords3e").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/coordsallA").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/coordsallB").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })
    cy.get("#\\/coordsallC").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(g,h)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('g');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('h');
      expect(stateVariables['/_point1'].stateValues.x1).eq('g');
      expect(stateVariables['/_point1'].stateValues.x2).eq('h');
      expect(stateVariables['/_point1'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('g');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('h');
      expect(stateVariables['/point2'].stateValues.x1).eq('g');
      expect(stateVariables['/point2'].stateValues.x2).eq('h');
      expect(stateVariables['/point2'].stateValues.x3).eq(undefined);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('g');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('h');
      expect(stateVariables['/point3'].stateValues.x1).eq('g');
      expect(stateVariables['/point3'].stateValues.x2).eq('h');
      expect(stateVariables['/point3'].stateValues.x3).eq(undefined);

    });







  })

  // have this abbreviated test, at it was triggering an error
  // that wasn't caught with full test
  it('change point dimensions, abbreviated', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Specify point coordinates: <mathinput name="originalCoords" /></p>

    <section name="thePoints"><title>The points</title>
    <p name="point1p">The point: <point coords="$originalCoords" /></p>
    <p name="point2p">The point copied: <copy assignNames="point2" target="_point1"/></p>
    <p name="point3p">The point copied again: <copy assignNames="point3" target="point2"/></p>
    </section>

  `}, "*");
    });

    cy.get("#\\/_text1").should('have.text', 'a'); // to wait for page to load

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('＿');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(1);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('＿');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(1);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('＿');

    });

    cy.log('Create 2D point 2')
    cy.get('#\\/originalCoords textarea').type('(a,b){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(a,b)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(a,b)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('b');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('b');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('a');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('b');

    });



    cy.log('Back to 1D point')
    cy.get('#\\/originalCoords textarea').type('{ctrl+home}{shift+end}{backspace}q{enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', 'q')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(1);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('q');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(1);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('q');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(1);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(1);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('q');

    });



    cy.log('Create 3D point')
    cy.get('#\\/originalCoords textarea').type('{end}{backspace}(2x,u/v{rightarrow},w^2{rightarrow}){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(2x,uv,w2)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2x,uv,w2)')
    })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(3);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eqls(["*", 2, "x"]);
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eqls(["/", "u", "v"]);
      expect((stateVariables['/_point1'].stateValues.xs)[2]).eqls(["^", "w", 2]);
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eqls(["*", 2, "x"]);
      expect((stateVariables['/point2'].stateValues.xs)[1]).eqls(["/", "u", "v"]);
      expect((stateVariables['/point2'].stateValues.xs)[2]).eqls(["^", "w", 2]);
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(3);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(3);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eqls(["*", 2, "x"]);
      expect((stateVariables['/point3'].stateValues.xs)[1]).eqls(["/", "u", "v"]);
      expect((stateVariables['/point3'].stateValues.xs)[2]).eqls(["^", "w", 2]);

    });





    cy.log('Back to 2D point 2')
    cy.get('#\\/originalCoords textarea').type('{ctrl+home}{shift+end}{backspace}(p,q){enter}', { force: true });

    cy.get("#\\/point1p .mjx-mrow").should('contain.text', '(p,q)')

    cy.get("#\\/point1p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/point2p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })
    cy.get("#\\/point3p").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(p,q)')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_point1'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs).length).eq(2);
      expect((stateVariables['/_point1'].stateValues.xs)[0]).eq('p');
      expect((stateVariables['/_point1'].stateValues.xs)[1]).eq('q');
      expect(stateVariables['/point2'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point2'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point2'].stateValues.xs)[0]).eq('p');
      expect((stateVariables['/point2'].stateValues.xs)[1]).eq('q');
      expect(stateVariables['/point3'].stateValues.nDimensions).eq(2);
      expect((stateVariables['/point3'].stateValues.xs).length).eq(2);
      expect((stateVariables['/point3'].stateValues.xs)[0]).eq('p');
      expect((stateVariables['/point3'].stateValues.xs)[1]).eq('q');

    });


  })

  it('label positioning', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point labelPosition="$labelPos">
        <label>$label</label>
        (1,2)
      </point>
    </graph>

    <p>label: <textinput name="label" prefill="A" /></p>
    <p>position:
    <choiceinput inline preselectChoice="1" name="labelPos">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
    </choiceinput>
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // not sure what to test as don't know how to check renderer...

    cy.get('#\\/label_input').clear().type("B{enter}")

    cy.get('#\\/labelPos').select("upperLeft")
    cy.get('#\\/labelPos').select("lowerRight")
    cy.get('#\\/labelPos').select("lowerLeft")

  });


  it('copy and overwrite coordinates, initial individual components', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" labelIsName x="1" y="2" />
      <point name="B" labelIsName x="3" y="4">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName x="2$n+1" y="1" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('initial values')

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,2,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(3,0,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([1, 2])
      expect((stateVariables['/B'].stateValues.xs)).eqls([3, 4])
      expect((stateVariables['/C'].stateValues.xs)).eqls([3, 1])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([-1, 2])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([3, -2])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([1, 1])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([3, 0])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([1, 2, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([3, 0, 1])
      expect(stateVariables['/A'].stateValues.label).eq('A');
      expect(stateVariables['/A1'].stateValues.label).eq('A');
      expect(stateVariables['/B'].stateValues.label).eq('B');
      expect(stateVariables['/B1'].stateValues.label).eq('B');
      expect(stateVariables['/C'].stateValues.label).eq('C');
      expect(stateVariables['/C1'].stateValues.label).eq('C');
      expect(stateVariables['/C2/C'].stateValues.label).eq('C');

    })

    cy.log('move original points')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/A',
        args: { x: -2, y: -7 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/B',
        args: { x: 5.1, y: 8.9 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/C',
        args: { x: -3, y: -8 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−7,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−3,−6,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-2, -7])
      expect((stateVariables['/B'].stateValues.xs)).eqls([5, 9])
      expect((stateVariables['/C'].stateValues.xs)).eqls([-3, -8])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([5, -2])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([-5, -8])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([-3, -6])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([-2, -7, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([-3, -6, 1])

    })


    cy.log('move copied points')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/A1',
        args: { x: 8, y: -5 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/B1',
        args: { x: -5.6, y: 6.3 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/C1',
        args: { x: -7, y: 4 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−5,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−5,−8,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-2, -5])
      expect((stateVariables['/B'].stateValues.xs)).eqls([-6, 9])
      expect((stateVariables['/C'].stateValues.xs)).eqls([-5, 4])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([8, -5])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([-6, 6])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([-7, 4])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([-5, -8])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([-2, -5, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([-5, -8, 1])

    })



  });


  it('copy and overwrite coordinates, initial xs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" labelIsName xs="1 2" />
      <point name="B" labelIsName xs="3 4">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName xs="2$n+1 1" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('initial values')

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,2,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(3,0,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([1, 2])
      expect((stateVariables['/B'].stateValues.xs)).eqls([3, 4])
      expect((stateVariables['/C'].stateValues.xs)).eqls([3, 1])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([-1, 2])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([3, -2])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([1, 1])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([3, 0])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([1, 2, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([3, 0, 1])
      expect(stateVariables['/A'].stateValues.label).eq('A');
      expect(stateVariables['/A1'].stateValues.label).eq('A');
      expect(stateVariables['/B'].stateValues.label).eq('B');
      expect(stateVariables['/B1'].stateValues.label).eq('B');
      expect(stateVariables['/C'].stateValues.label).eq('C');
      expect(stateVariables['/C1'].stateValues.label).eq('C');
      expect(stateVariables['/C2/C'].stateValues.label).eq('C');

    })

    cy.log('move original points')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/A',
        args: { x: -2, y: -7 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/B',
        args: { x: 5.1, y: 8.9 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/C',
        args: { x: -3, y: -8 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−7,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−3,−6,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-2, -7])
      expect((stateVariables['/B'].stateValues.xs)).eqls([5, 9])
      expect((stateVariables['/C'].stateValues.xs)).eqls([-3, -8])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([5, -2])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([-5, -8])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([-3, -6])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([-2, -7, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([-3, -6, 1])

    })


    cy.log('move copied points')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/A1',
        args: { x: 8, y: -5 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/B1',
        args: { x: -5.6, y: 6.3 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/C1',
        args: { x: -7, y: 4 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−5,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−5,−8,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-2, -5])
      expect((stateVariables['/B'].stateValues.xs)).eqls([-6, 9])
      expect((stateVariables['/C'].stateValues.xs)).eqls([-5, 4])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([8, -5])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([-6, 6])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([-7, 4])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([-5, -8])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([-2, -5, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([-5, -8, 1])

    })



  });


  it('copy and overwrite coordinates, initial coords', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" labelIsName coords="(1,2)" />
      <point name="B" labelIsName coords="(3,4)">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName coords="(2$n+1,1)" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('initial values')

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,2,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(3,0,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([1, 2])
      expect((stateVariables['/B'].stateValues.xs)).eqls([3, 4])
      expect((stateVariables['/C'].stateValues.xs)).eqls([3, 1])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([-1, 2])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([3, -2])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([1, 1])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([3, 0])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([1, 2, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([3, 0, 1])
      expect(stateVariables['/A'].stateValues.label).eq('A');
      expect(stateVariables['/A1'].stateValues.label).eq('A');
      expect(stateVariables['/B'].stateValues.label).eq('B');
      expect(stateVariables['/B1'].stateValues.label).eq('B');
      expect(stateVariables['/C'].stateValues.label).eq('C');
      expect(stateVariables['/C1'].stateValues.label).eq('C');
      expect(stateVariables['/C2/C'].stateValues.label).eq('C');

    })

    cy.log('move original points')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/A',
        args: { x: -2, y: -7 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/B',
        args: { x: 5.1, y: 8.9 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/C',
        args: { x: -3, y: -8 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−7,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−3,−6,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-2, -7])
      expect((stateVariables['/B'].stateValues.xs)).eqls([5, 9])
      expect((stateVariables['/C'].stateValues.xs)).eqls([-3, -8])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([5, -2])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([-5, -8])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([-3, -6])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([-2, -7, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([-3, -6, 1])

    })


    cy.log('move copied points')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/A1',
        args: { x: 8, y: -5 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/B1',
        args: { x: -5.6, y: 6.3 }
      })
      win.callAction1({
        actionName: "movePoint",
        componentName: '/C1',
        args: { x: -7, y: 4 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(−2,−5,4)')
    cy.get('#\\/C3 .mjx-mrow').should('contain.text', '(−5,−8,1)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/A'].stateValues.xs)).eqls([-2, -5])
      expect((stateVariables['/B'].stateValues.xs)).eqls([-6, 9])
      expect((stateVariables['/C'].stateValues.xs)).eqls([-5, 4])
      expect((stateVariables['/A1'].stateValues.xs)).eqls([8, -5])
      expect((stateVariables['/B1'].stateValues.xs)).eqls([-6, 6])
      expect((stateVariables['/C1'].stateValues.xs)).eqls([-7, 4])
      expect((stateVariables['/C2/C'].stateValues.xs)).eqls([-5, -8])
      expect((stateVariables['/A2'].stateValues.xs)).eqls([-2, -5, 4])
      expect((stateVariables['/C3'].stateValues.xs)).eqls([-5, -8, 1])

    })



  });


  it('copy and overwrite each coordinate in sequence, initial sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g1" newNamespace>
      <point name="P">(3,2)</point>
    </graph>
    
    <graph name="g2" newNamespace>
      <copy target="../g1/P" x="-1" assignNames="P" />
    </graph>
    
    <copy target="g2" assignNames="g3" />
    
    <graph name="g4" newNamespace>
      <copy target="../g3/P" y="-5" assignNames="P" />
    </graph>

    <copy target="g1/P" assignNames="P1" />
    <copy target="g2/P" assignNames="P2" />
    <copy target="g3/P" assignNames="P3" />
    <copy target="g4/P" assignNames="P4" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.log('initial values')

    cy.get('#\\/P1 .mjx-mrow').should('contain.text', '(3,2)')
    cy.get('#\\/P2 .mjx-mrow').should('contain.text', '(−1,2)')
    cy.get('#\\/P3 .mjx-mrow').should('contain.text', '(−1,2)')
    cy.get('#\\/P4 .mjx-mrow').should('contain.text', '(−1,−5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/g1/P'].stateValues.xs)).eqls([3, 2])
      expect((stateVariables['/g2/P'].stateValues.xs)).eqls([-1, 2])
      expect((stateVariables['/g3/P'].stateValues.xs)).eqls([-1, 2])
      expect((stateVariables['/g4/P'].stateValues.xs)).eqls([-1, -5])
    })

    cy.log('move first point')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/g1/P',
        args: { x: -2, y: -7 }
      })
    })

    cy.get('#\\/P1 .mjx-mrow').should('contain.text', '(−2,−7)')
    cy.get('#\\/P2 .mjx-mrow').should('contain.text', '(−1,−7)')
    cy.get('#\\/P3 .mjx-mrow').should('contain.text', '(−1,−7)')
    cy.get('#\\/P4 .mjx-mrow').should('contain.text', '(−1,−5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/g1/P'].stateValues.xs)).eqls([-2, -7])
      expect((stateVariables['/g2/P'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/g3/P'].stateValues.xs)).eqls([-1, -7])
      expect((stateVariables['/g4/P'].stateValues.xs)).eqls([-1, -5])
    })


    cy.log('move second point')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/g2/P',
        args: { x: 8, y: -6 }
      })
    })

    cy.get('#\\/P1 .mjx-mrow').should('contain.text', '(−2,−6)')
    cy.get('#\\/P2 .mjx-mrow').should('contain.text', '(8,−6)')
    cy.get('#\\/P3 .mjx-mrow').should('contain.text', '(8,−6)')
    cy.get('#\\/P4 .mjx-mrow').should('contain.text', '(8,−5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/g1/P'].stateValues.xs)).eqls([-2, -6])
      expect((stateVariables['/g2/P'].stateValues.xs)).eqls([8, -6])
      expect((stateVariables['/g3/P'].stateValues.xs)).eqls([8, -6])
      expect((stateVariables['/g4/P'].stateValues.xs)).eqls([8, -5])
    })


    cy.log('move third point')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/g3/P',
        args: { x: 1, y: 0 }
      })
    })

    cy.get('#\\/P1 .mjx-mrow').should('contain.text', '(−2,0)')
    cy.get('#\\/P2 .mjx-mrow').should('contain.text', '(1,0)')
    cy.get('#\\/P3 .mjx-mrow').should('contain.text', '(1,0)')
    cy.get('#\\/P4 .mjx-mrow').should('contain.text', '(1,−5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/g1/P'].stateValues.xs)).eqls([-2, 0])
      expect((stateVariables['/g2/P'].stateValues.xs)).eqls([1, 0])
      expect((stateVariables['/g3/P'].stateValues.xs)).eqls([1, 0])
      expect((stateVariables['/g4/P'].stateValues.xs)).eqls([1, -5])
    })

    cy.log('move fourth point')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/g4/P',
        args: { x: 3, y: 4 }
      })
    })

    cy.get('#\\/P1 .mjx-mrow').should('contain.text', '(−2,0)')
    cy.get('#\\/P2 .mjx-mrow').should('contain.text', '(3,0)')
    cy.get('#\\/P3 .mjx-mrow').should('contain.text', '(3,0)')
    cy.get('#\\/P4 .mjx-mrow').should('contain.text', '(3,4)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/g1/P'].stateValues.xs)).eqls([-2, 0])
      expect((stateVariables['/g2/P'].stateValues.xs)).eqls([3, 0])
      expect((stateVariables['/g3/P'].stateValues.xs)).eqls([3, 0])
      expect((stateVariables['/g4/P'].stateValues.xs)).eqls([3, 4])
    })

  });

  it('1D point with 2D constraint does not crash', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph>
      <point x="1">
        <constraints>
          <constrainTo><function>x^2</function></constrainTo>
        </constraints>
      </point>
      <point x="2">
        <constraints>
          <constrainTo>
            <curve><function>x^2</function><function>x^3</function></curve>
          </constrainTo>
        </constraints>
      </point>
      <point x="3">
        <constraints>
          <constrainTo><circle/></constrainTo>
        </constraints>
      </point>
      <point x="4">
        <constraints>
          <constrainTo><line>y=2x</line></constrainTo>
        </constraints>
      </point>
      <point x="5">
        <constraints>
          <constrainTo><polygon vertices="(1,2) (3,4) (5,-6)" /></constrainTo>
        </constraints>
      </point>
      <point x="6">
        <constraints>
          <constrainTo><polyline vertices="(1,2) (3,4) (5,-6)" /></constrainTo>
        </constraints>
      </point>
      <point x="7">
        <constraints>
          <constrainTo><parabola/></constrainTo>
        </constraints>
      </point>
    </graph>

    <copy prop="x" target="_point1" assignNames="xa" />
    <copy prop="x" target="_point2" assignNames="xb" />
    <copy prop="x" target="_point3" assignNames="xc" />
    <copy prop="x" target="_point4" assignNames="xd" />
    <copy prop="x" target="_point5" assignNames="xe" />
    <copy prop="x" target="_point6" assignNames="xf" />
    <copy prop="x" target="_point7" assignNames="xg" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/xa .mjx-mrow').should('have.text', '1')
    cy.get('#\\/xb .mjx-mrow').should('have.text', '2')
    cy.get('#\\/xc .mjx-mrow').should('have.text', '3')
    cy.get('#\\/xd .mjx-mrow').should('have.text', '4')
    cy.get('#\\/xe .mjx-mrow').should('have.text', '5')
    cy.get('#\\/xf .mjx-mrow').should('have.text', '6')
    cy.get('#\\/xg .mjx-mrow').should('have.text', '7')


  });

  it('display digits propagates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    
    <point displayDigits="2" name="P">(32.252609, 0.0672854, 5)</point>
    <point displayDecimals="2" name="Q" x="32.252609" y="0.0672854" z="5" />
    <point padZeros name="R" x="32.252609" y="0.0672854" z="5" />

    <copy prop="coords" target="P" assignNames="Pcoords" />
    <copy prop="coords" target="Q" assignNames="Qcoords" />
    <copy prop="coords" target="R" assignNames="Rcoords" />

    <copy prop="coords" target="P" assignNames="PcoordsDec4" displayDecimals="4" />
    <copy prop="coords" target="Q" assignNames="QcoordsDig4" displayDigits="4" />
    <copy prop="coords" target="R" assignNames="RcoordsDig2" displayDigits="2" />

    <copy prop="coords" target="P" assignNames="PcoordsPad" padZeros />
    <copy prop="coords" target="Q" assignNames="QcoordsPad" padZeros />
    <copy prop="coords" target="R" assignNames="RcoordsNoPad" padZeros="false" />

    <copy prop="xs" target="P" assignNames="Px1 Px2 Px3" />
    <copy prop="x1" target="Q" assignNames="Qx1" />
    <copy prop="y" target="Q" assignNames="Qx2" />
    <copy prop="z" target="R" assignNames="Rx3" />

    <math name="Pmath">$P</math>
    <math name="Qmath">$Q</math>
    <math name="Rmath">$R</math>

    <math name="PmathDec4" displayDecimals="4">$P</math>
    <math name="QmathDig4" displayDigits="4">$Q</math>
    <math name="RmathDig2" displayDigits="2">$R</math>

    <number name="Px1number">$(P.x)</number>
    <number name="Px2number"><copy prop="y" target="P" /></number>

    <number name="Px1numberDec4" displayDecimals="4">$(P.x)</number>
    <number name="Px2numberDig4" displayDigits="4"><copy prop="y" target="P" /></number>


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/P .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32,0.067,5)")
    })
    cy.get('#\\/Q .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25,0.07,5)")
    })
    cy.get('#\\/R .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25260900,0.06728540000,5.000000000)")
    })
    cy.get('#\\/Pcoords .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32,0.067,5)")
    })
    cy.get('#\\/Qcoords .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25,0.07,5)")
    })
    cy.get('#\\/Rcoords .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25260900,0.06728540000,5.000000000)")
    })
    cy.get('#\\/PcoordsDec4 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.2526,0.0673,5)")
    })
    cy.get('#\\/QcoordsDig4 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25,0.06729,5)")
    })
    cy.get('#\\/RcoordsDig2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32,0.067,5.0)")
    })
    cy.get('#\\/PcoordsPad .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32,0.067,5.0)")
    })
    cy.get('#\\/QcoordsPad .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25,0.07,5.00)")
    })
    cy.get('#\\/RcoordsNoPad .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.252609,0.0672854,5)")
    })
    cy.get('#\\/Px1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("32")
    })
    cy.get('#\\/Px2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("0.067")
    })
    cy.get('#\\/Px3 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("5")
    })
    cy.get('#\\/Qx1 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("32.25")
    })
    cy.get('#\\/Qx2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("0.07")
    })
    cy.get('#\\/Rx3 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("5.000000000")
    })
    cy.get('#\\/Pmath .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32,0.067,5)")
    })
    cy.get('#\\/Qmath .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25,0.07,5)")
    })
    cy.get('#\\/Rmath .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25260900,0.06728540000,5.000000000)")
    })
    cy.get('#\\/PmathDec4 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.2526,0.0673,5)")
    })
    cy.get('#\\/QmathDig4 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32.25,0.06729,5)")
    })
    cy.get('#\\/RmathDig2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(32,0.067,5.0)")
    })
    cy.get('#\\/Px1number').should('have.text',"32")
    cy.get('#\\/Px2number').should('have.text',"0.067")
    cy.get('#\\/Px1numberDec4').should('have.text',"32.2526")
    cy.get('#\\/Px2numberDig4').should('have.text',"0.06729")


  });

  it('rounding, copy and override', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p><point name="p1">(34.245023482352345, 245.23823402358234234)</point></p>
    <p><point name="p1Dig4" copySource="p1" displayDigits="4" /></p>
    <p><point name="p1Dec6" copySource="p1" displayDecimals="5" /></p>
    <p><point name="p1Dig4a" copySource="p1Dec6" displayDigits="4" /></p>
    <p><point name="p1Dec6a" copySource="p1Dig4" displayDecimals="5" /></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get("#\\/p1 .mjx-mrow").eq(0).should("have.text", "(34.24502348,245.238234)")
 
    cy.get("#\\/p1Dig4 .mjx-mrow").eq(0).should("have.text", "(34.25,245.2)")
    cy.get("#\\/p1Dig4a .mjx-mrow").eq(0).should("have.text", "(34.25,245.2)")

    cy.get("#\\/p1Dec6 .mjx-mrow").eq(0).should("have.text", "(34.24502,245.23823)")
    cy.get("#\\/p1Dec6a .mjx-mrow").eq(0).should("have.text", "(34.24502,245.23823)")

  })

  it('label point with child, part math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P" displayDecimals="1" padZeros>
        (1,2)
        <label>We have <m>x^{<copy prop="x" target="P"/>} + y^{<copy target="P" prop="y" />}</m></label>
      </point>
      <point name="Q" displayDigits="3" padZeros>
        <label>No latex: x^<text><copy prop="x" target="Q"/></text> + y^<text><copy target="Q" prop="y" /></text></label>
        (3,4)
      </point>
      <point name="R" displayDecimals="2">
        <label><copy prop="label" target="P"/> and <copy prop="coords" target="R" /></label>
        (5,6)
      </point>
      <point name="S" displayDigits="2">
        <label><copy prop="label" target="Q"/> and <copy prop="coords" target="S" /></label>
        (7,8)
      </point>
    </graph>

    <p name="labelPPar">Label for P: <copy prop="label" target="P" /></p>
    <p name="labelQPar">Label for Q: <copy prop="label" target="Q" /></p>
    <p name="labelRPar">Label for R: <copy prop="label" target="R" /></p>
    <p name="labelSPar">Label for S: <copy prop="label" target="S" /></p>
    `}, "*");
    });

   
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load
    
    cy.get('#\\/labelPPar').should('contain.text', 'Label for P: We have ')
    cy.get('#\\/labelPPar .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("x1.0+y2.0")
    })
    cy.get('#\\/labelQPar').should('have.text', 'Label for Q: No latex: x^3.00 + y^4.00')
    cy.get('#\\/labelRPar').should('contain.text', 'Label for R: We have ')
    cy.get('#\\/labelRPar').should('contain.text', ' and ')
    cy.get('#\\/labelSPar').should('contain.text', 'Label for S: No latex: x^3.00 + y^4.00 and ')
    cy.get('#\\/labelSPar .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(7,8)")
    })
     
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.label).eq('We have \\(x^{1.0} + y^{2.0}\\)')
      expect(stateVariables["/P"].stateValues.labelHasLatex).eq(true)

      expect(stateVariables["/Q"].stateValues.label).eq('No latex: x^3.00 + y^4.00')
      expect(stateVariables["/Q"].stateValues.labelHasLatex).eq(false)

      expect(stateVariables["/R"].stateValues.label).eq('We have \\(x^{1.0} + y^{2.0}\\) and \\(\\left( 5, 6 \\right)\\)')
      expect(stateVariables["/R"].stateValues.labelHasLatex).eq(true)

      expect(stateVariables["/S"].stateValues.label).eq('No latex: x^3.00 + y^4.00 and \\(\\left( 7, 8 \\right)\\)')
      expect(stateVariables["/S"].stateValues.labelHasLatex).eq(true)

    })


    cy.log('move points')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: Math.PI, y: Math.E }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: Math.sqrt(2), y: 1/3 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/R",
        args: { x: 1/6, y: 2/3 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/S",
        args: { x: 1/8, y: 9/8 }
      })
    })


    cy.get('#\\/labelQPar').should('have.text', 'Label for Q: No latex: x^1.41 + y^0.333')

    cy.get('#\\/labelPPar').should('contain.text', 'Label for P: We have ')
    cy.get('#\\/labelPPar .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("x3.1+y2.7")
    })
    cy.get('#\\/labelSPar').should('contain.text', 'Label for S: No latex: x^1.41 + y^0.333 and ')
    cy.get('#\\/labelSPar .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("(0.13,1.1)")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.label).eq('We have \\(x^{3.1} + y^{2.7}\\)')
      expect(stateVariables["/P"].stateValues.labelHasLatex).eq(true)

      expect(stateVariables["/Q"].stateValues.label).eq('No latex: x^1.41 + y^0.333')
      expect(stateVariables["/Q"].stateValues.labelHasLatex).eq(false)

      expect(stateVariables["/R"].stateValues.label).eq('We have \\(x^{3.1} + y^{2.7}\\) and \\(\\left( 0.17, 0.67 \\right)\\)')
      expect(stateVariables["/R"].stateValues.labelHasLatex).eq(true)

      expect(stateVariables["/S"].stateValues.label).eq('No latex: x^1.41 + y^0.333 and \\(\\left( 0.13, 1.1 \\right)\\)')
      expect(stateVariables["/S"].stateValues.labelHasLatex).eq(true)

    })


  });

  it('copy point and override label', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P" displayDecimals="1" padZeros>
        (1,2)
        <label>We have <m>x^{<copy prop="x" target="P"/>} + y^{<copy target="P" prop="y" />}</m></label>
      </point>
    </graph>
    <graph>
      <point name="Q" displayDigits="3" padZeros copySource="P">
        <label>No latex: x^<text><copy prop="x" target="Q"/></text> + y^<text><copy target="Q" prop="y" /></text></label>
      </point>
    </graph>

    <p name="labelPPar">Label for P: <copy prop="label" target="P" /></p>
    <p name="labelQPar">Label for Q: <copy prop="label" target="Q" /></p>
    `}, "*");
    });

   
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load
    
    cy.get('#\\/labelPPar').should('contain.text', 'Label for P: We have ')
    cy.get('#\\/labelPPar .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("x1.0+y2.0")
    })
    cy.get('#\\/labelQPar').should('have.text', 'Label for Q: No latex: x^1.00 + y^2.00')
     
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.label).eq('We have \\(x^{1.0} + y^{2.0}\\)')
      expect(stateVariables["/P"].stateValues.labelHasLatex).eq(true)

      expect(stateVariables["/Q"].stateValues.label).eq('No latex: x^1.00 + y^2.00')
      expect(stateVariables["/Q"].stateValues.labelHasLatex).eq(false)

    })


    cy.log('move point')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: Math.PI, y: Math.E }
      })
    })


    cy.get('#\\/labelQPar').should('have.text', 'Label for Q: No latex: x^3.14 + y^2.72')

    cy.get('#\\/labelPPar').should('contain.text', 'Label for P: We have ')
    cy.get('#\\/labelPPar .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq("x3.1+y2.7")
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.label).eq('We have \\(x^{3.1} + y^{2.7}\\)')
      expect(stateVariables["/P"].stateValues.labelHasLatex).eq(true)

      expect(stateVariables["/Q"].stateValues.label).eq('No latex: x^3.14 + y^2.72')
      expect(stateVariables["/Q"].stateValues.labelHasLatex).eq(false)

    })

  });

  it('update labels', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <point name="P1">
        (1,2)
        <label>P1</label>
      </point>
      <point name="P2">
        (3,4)
        <label><text>P2</text></label>
      </point>
      <point name="P3">
        (5,6)
        <label><math>P/3</math></label>
      </point>
      <point name="P4">
        (7,8)
        <label><m>\\frac{P}{4}</m></label>
      </point>
    </graph>

    <p>Change label 1: <textinput bindValueTo="$(P1.label)" name="ti1" /></p>
    <p><updateValue target="P1" prop="label" newValue="P1" type="text" name="revert1" >
      <label>Revert value 1</label>
    </updateValue></p>
    <p>The label 1: <label copySource="P1" copyprop="label" name="theLabel1" /></p>

    <p>Change label 2: <textinput bindValueTo="$(P2.label)" name="ti2" /></p>
    <p><updateValue target="P2" prop="label" newValue="P2" type="text" name="revert2" >
      <label>Revert value 2</label>
    </updateValue></p>
    <p>The label 2: <label copySource="P2" copyprop="label" name="theLabel2" /></p>

    <p>Change label 3: <textinput bindValueTo="$(P3.label)" name="ti3" /></p>
    <p><updateValue target="P3" prop="label" newValue="\\frac{P}{3}" type="text" name="revert3" >
      <label>Revert value 3</label>
    </updateValue></p>
    <p>The label 3: <label copySource="P3" copyprop="label" name="theLabel3" /></p>
    

    <p>Change label 4: <textinput bindValueTo="$(P4.label)" name="ti4" /></p>
    <p><updateValue target="P4" prop="label" newValue="\\frac{P}{4}" type="text" name="revert4" >
      <label>Revert value 4</label>
    </updateValue></p>
    <p>The label 4: <label copySource="P4" copyprop="label" name="theLabel4" /></p>
    
    `}, "*");
    });

   
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load
    
    cy.get('#\\/theLabel1').should('have.text', 'P1')
    cy.get("#\\/ti1_input").should('have.value', 'P1')
    cy.get('#\\/theLabel2').should('have.text', 'P2')
    cy.get("#\\/ti2_input").should('have.value', 'P2')
    cy.get('#\\/theLabel3 .mjx-mrow').eq(0).should('have.text', 'P3')
    cy.get("#\\/ti3_input").should('have.value', '\\frac{P}{3}')
    cy.get('#\\/theLabel4 .mjx-mrow').eq(0).should('have.text', 'P4')
    cy.get("#\\/ti4_input").should('have.value', '\\frac{P}{4}')
     
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.label).eq('P1')
      expect(stateVariables["/P1"].stateValues.labelHasLatex).eq(false)
      expect(stateVariables["/theLabel1"].stateValues.value).eq('P1')
      expect(stateVariables["/theLabel1"].stateValues.text).eq('P1')
      expect(stateVariables["/theLabel1"].stateValues.latex).eq('P1')
      expect(stateVariables["/theLabel1"].stateValues.hasLatex).eq(false)

      expect(stateVariables["/P2"].stateValues.label).eq('P2')
      expect(stateVariables["/P2"].stateValues.labelHasLatex).eq(false)
      expect(stateVariables["/theLabel2"].stateValues.value).eq('P2')
      expect(stateVariables["/theLabel2"].stateValues.text).eq('P2')
      expect(stateVariables["/theLabel2"].stateValues.latex).eq('P2')
      expect(stateVariables["/theLabel2"].stateValues.hasLatex).eq(false)

      expect(stateVariables["/P3"].stateValues.label).eq('\\(\\frac{P}{3}\\)')
      expect(stateVariables["/P3"].stateValues.labelHasLatex).eq(true)
      expect(stateVariables["/theLabel3"].stateValues.value).eq('\\(\\frac{P}{3}\\)')
      expect(stateVariables["/theLabel3"].stateValues.text).eq('\\frac{P}{3}')
      expect(stateVariables["/theLabel3"].stateValues.latex).eq('\\frac{P}{3}')
      expect(stateVariables["/theLabel3"].stateValues.hasLatex).eq(true)

      expect(stateVariables["/P4"].stateValues.label).eq('\\(\\frac{P}{4}\\)')
      expect(stateVariables["/P4"].stateValues.labelHasLatex).eq(true)
      expect(stateVariables["/theLabel4"].stateValues.value).eq('\\(\\frac{P}{4}\\)')
      expect(stateVariables["/theLabel4"].stateValues.text).eq('\\frac{P}{4}')
      expect(stateVariables["/theLabel4"].stateValues.latex).eq('\\frac{P}{4}')
      expect(stateVariables["/theLabel4"].stateValues.hasLatex).eq(true)
    })


    cy.log("Change label via textinput")
    cy.get("#\\/ti1_input").clear().type("Q1{enter}");
    cy.get("#\\/ti2_input").clear().type("Q2{enter}");
    cy.get("#\\/ti3_input").clear().type("\\frac{{}Q}{{}3}{enter}");
    cy.get("#\\/ti4_input").clear().type("\\frac{{}Q}{{}4}{enter}");
    cy.get('#\\/theLabel4 .mjx-mrow').should('contain.text', 'Q4')


    cy.get('#\\/theLabel1').should('have.text', 'Q1')
    cy.get("#\\/ti1_input").should('have.value', 'Q1')
    cy.get('#\\/theLabel2').should('have.text', 'Q2')
    cy.get("#\\/ti2_input").should('have.value', 'Q2')
    cy.get('#\\/theLabel3 .mjx-mrow').eq(0).should('have.text', 'Q3')
    cy.get("#\\/ti3_input").should('have.value', '\\frac{Q}{3}')
    cy.get('#\\/theLabel4 .mjx-mrow').eq(0).should('have.text', 'Q4')
    cy.get("#\\/ti4_input").should('have.value', '\\frac{Q}{4}')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.label).eq('Q1')
      expect(stateVariables["/P1"].stateValues.labelHasLatex).eq(false)
      expect(stateVariables["/theLabel1"].stateValues.value).eq('Q1')
      expect(stateVariables["/theLabel1"].stateValues.text).eq('Q1')
      expect(stateVariables["/theLabel1"].stateValues.latex).eq('Q1')
      expect(stateVariables["/theLabel1"].stateValues.hasLatex).eq(false)

      expect(stateVariables["/P2"].stateValues.label).eq('Q2')
      expect(stateVariables["/P2"].stateValues.labelHasLatex).eq(false)
      expect(stateVariables["/theLabel2"].stateValues.value).eq('Q2')
      expect(stateVariables["/theLabel2"].stateValues.text).eq('Q2')
      expect(stateVariables["/theLabel2"].stateValues.latex).eq('Q2')
      expect(stateVariables["/theLabel2"].stateValues.hasLatex).eq(false)

      expect(stateVariables["/P3"].stateValues.label).eq('\\(\\frac{Q}{3}\\)')
      expect(stateVariables["/P3"].stateValues.labelHasLatex).eq(true)
      expect(stateVariables["/theLabel3"].stateValues.value).eq('\\(\\frac{Q}{3}\\)')
      expect(stateVariables["/theLabel3"].stateValues.text).eq('\\frac{Q}{3}')
      expect(stateVariables["/theLabel3"].stateValues.latex).eq('\\frac{Q}{3}')
      expect(stateVariables["/theLabel3"].stateValues.hasLatex).eq(true)

      expect(stateVariables["/P4"].stateValues.label).eq('\\(\\frac{Q}{4}\\)')
      expect(stateVariables["/P4"].stateValues.labelHasLatex).eq(true)
      expect(stateVariables["/theLabel4"].stateValues.value).eq('\\(\\frac{Q}{4}\\)')
      expect(stateVariables["/theLabel4"].stateValues.text).eq('\\frac{Q}{4}')
      expect(stateVariables["/theLabel4"].stateValues.latex).eq('\\frac{Q}{4}')
      expect(stateVariables["/theLabel4"].stateValues.hasLatex).eq(true)
    })

    cy.log('Revert label')
    cy.get('#\\/revert1_button').click();
    cy.get('#\\/revert2_button').click();
    cy.get('#\\/revert3_button').click();
    cy.get('#\\/revert4_button').click();
    cy.get('#\\/theLabel4 .mjx-mrow').should('contain.text', 'P4')

    cy.get('#\\/theLabel1').should('have.text', 'P1')
    cy.get("#\\/ti1_input").should('have.value', 'P1')
    cy.get('#\\/theLabel2').should('have.text', 'P2')
    cy.get("#\\/ti2_input").should('have.value', 'P2')
    cy.get('#\\/theLabel3 .mjx-mrow').eq(0).should('have.text', 'P3')
    cy.get("#\\/ti3_input").should('have.value', '\\frac{P}{3}')
    cy.get('#\\/theLabel4 .mjx-mrow').eq(0).should('have.text', 'P4')
    cy.get("#\\/ti4_input").should('have.value', '\\frac{P}{4}')
     
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.label).eq('P1')
      expect(stateVariables["/P1"].stateValues.labelHasLatex).eq(false)
      expect(stateVariables["/theLabel1"].stateValues.value).eq('P1')
      expect(stateVariables["/theLabel1"].stateValues.text).eq('P1')
      expect(stateVariables["/theLabel1"].stateValues.latex).eq('P1')
      expect(stateVariables["/theLabel1"].stateValues.hasLatex).eq(false)

      expect(stateVariables["/P2"].stateValues.label).eq('P2')
      expect(stateVariables["/P2"].stateValues.labelHasLatex).eq(false)
      expect(stateVariables["/theLabel2"].stateValues.value).eq('P2')
      expect(stateVariables["/theLabel2"].stateValues.text).eq('P2')
      expect(stateVariables["/theLabel2"].stateValues.latex).eq('P2')
      expect(stateVariables["/theLabel2"].stateValues.hasLatex).eq(false)

      expect(stateVariables["/P3"].stateValues.label).eq('\\(\\frac{P}{3}\\)')
      expect(stateVariables["/P3"].stateValues.labelHasLatex).eq(true)
      expect(stateVariables["/theLabel3"].stateValues.value).eq('\\(\\frac{P}{3}\\)')
      expect(stateVariables["/theLabel3"].stateValues.text).eq('\\frac{P}{3}')
      expect(stateVariables["/theLabel3"].stateValues.latex).eq('\\frac{P}{3}')
      expect(stateVariables["/theLabel3"].stateValues.hasLatex).eq(true)

      expect(stateVariables["/P4"].stateValues.label).eq('\\(\\frac{P}{4}\\)')
      expect(stateVariables["/P4"].stateValues.labelHasLatex).eq(true)
      expect(stateVariables["/theLabel4"].stateValues.value).eq('\\(\\frac{P}{4}\\)')
      expect(stateVariables["/theLabel4"].stateValues.text).eq('\\frac{P}{4}')
      expect(stateVariables["/theLabel4"].stateValues.latex).eq('\\frac{P}{4}')
      expect(stateVariables["/theLabel4"].stateValues.hasLatex).eq(true)
    })

    cy.log("Cannot switch to latex, unneeded delimiters ignored")
    cy.get("#\\/ti1_input").clear().type("\\(\\frac{{}Q}{{}1}\\){enter}");
    cy.get("#\\/ti2_input").clear().type("\\(\\frac{{}Q}{{}2}\\){enter}");
    cy.get("#\\/ti3_input").clear().type("\\(\\frac{{}Q}{{}3}\\){enter}");
    cy.get("#\\/ti4_input").clear().type("\\(\\frac{{}Q}{{}4}\\){enter}");
    cy.get('#\\/theLabel4 .mjx-mrow').should('contain.text', 'Q4')

    cy.get('#\\/theLabel1').should('have.text', '\\(\\frac{Q}{1}\\)')
    cy.get("#\\/ti1_input").should('have.value', '\\(\\frac{Q}{1}\\)')
    cy.get('#\\/theLabel2').should('have.text', '\\(\\frac{Q}{2}\\)')
    cy.get("#\\/ti2_input").should('have.value', '\\(\\frac{Q}{2}\\)')
    cy.get('#\\/theLabel3 .mjx-mrow').eq(0).should('have.text', 'Q3')
    cy.get("#\\/ti3_input").should('have.value', '\\frac{Q}{3}')
    cy.get('#\\/theLabel4 .mjx-mrow').eq(0).should('have.text', 'Q4')
    cy.get("#\\/ti4_input").should('have.value', '\\frac{Q}{4}')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.label).eq('\\(\\frac{Q}{1}\\)')
      expect(stateVariables["/P1"].stateValues.labelHasLatex).eq(false)
      expect(stateVariables["/theLabel1"].stateValues.value).eq('\\(\\frac{Q}{1}\\)')
      expect(stateVariables["/theLabel1"].stateValues.text).eq('\\(\\frac{Q}{1}\\)')
      expect(stateVariables["/theLabel1"].stateValues.latex).eq('\\(\\frac{Q}{1}\\)')
      expect(stateVariables["/theLabel1"].stateValues.hasLatex).eq(false)

      expect(stateVariables["/P2"].stateValues.label).eq('\\(\\frac{Q}{2}\\)')
      expect(stateVariables["/P2"].stateValues.labelHasLatex).eq(false)
      expect(stateVariables["/theLabel2"].stateValues.value).eq('\\(\\frac{Q}{2}\\)')
      expect(stateVariables["/theLabel2"].stateValues.text).eq('\\(\\frac{Q}{2}\\)')
      expect(stateVariables["/theLabel2"].stateValues.latex).eq('\\(\\frac{Q}{2}\\)')
      expect(stateVariables["/theLabel2"].stateValues.hasLatex).eq(false)

      expect(stateVariables["/P3"].stateValues.label).eq('\\(\\frac{Q}{3}\\)')
      expect(stateVariables["/P3"].stateValues.labelHasLatex).eq(true)
      expect(stateVariables["/theLabel3"].stateValues.value).eq('\\(\\frac{Q}{3}\\)')
      expect(stateVariables["/theLabel3"].stateValues.text).eq('\\frac{Q}{3}')
      expect(stateVariables["/theLabel3"].stateValues.latex).eq('\\frac{Q}{3}')
      expect(stateVariables["/theLabel3"].stateValues.hasLatex).eq(true)

      expect(stateVariables["/P4"].stateValues.label).eq('\\(\\frac{Q}{4}\\)')
      expect(stateVariables["/P4"].stateValues.labelHasLatex).eq(true)
      expect(stateVariables["/theLabel4"].stateValues.value).eq('\\(\\frac{Q}{4}\\)')
      expect(stateVariables["/theLabel4"].stateValues.text).eq('\\frac{Q}{4}')
      expect(stateVariables["/theLabel4"].stateValues.latex).eq('\\frac{Q}{4}')
      expect(stateVariables["/theLabel4"].stateValues.hasLatex).eq(true)
    })


  });

  it('copy point with no arguments, specify individual coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="A" labelIsName />
      <point copySource="A" name="B" labelIsName x="1" />
      <point copySource="A" name="C" labelIsName y="1" />
      <point copySource="B" name="D" labelIsName y="2" />
    </graph>

    <graph copySource="g" name="g2" newNamespace />

    <coords copySource="A" name="Ac" />
    <coords copySource="B" name="Bc" />
    <coords copySource="C" name="Cc" />
    <coords copySource="D" name="Dc" />
    <coords copySource="g2/A" name="Ac2" />
    <coords copySource="g2/B" name="Bc2" />
    <coords copySource="g2/C" name="Cc2" />
    <coords copySource="g2/D" name="Dc2" />
 
    `}, "*");
    });

   
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load
    
    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(0,0)");
    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(1,0)");
    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(0,1)");
    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(1,2)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(0,0)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(1,0)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(0,1)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(1,2)");


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/A',
        args: { x: 3, y: 4 }
      })
    })

    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(3,4)");
    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(1,4)");
    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(3,1)");
    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(1,2)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(3,4)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(1,4)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(3,1)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(1,2)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/B',
        args: { x: 5, y: 6 }
      })
    })

    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(5,6)");

    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(3,6)");
    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(3,1)");
    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(5,2)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(3,6)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(5,6)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(3,1)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(5,2)");


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/C',
        args: { x: 7, y: 8 }
      })
    })

    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(7,8)");
    
    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(7,6)");
    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(5,6)");
    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(5,2)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(7,6)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(5,6)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(7,8)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(5,2)");


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/D',
        args: { x: 9, y: 10 }
      })
    })

    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(9,10)");
    
    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(7,6)");
    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(9,6)");
    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(7,8)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(7,6)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(9,6)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(7,8)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(9,10)");


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/g2/D',
        args: { x: -1, y: -2 }
      })
    })

    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(−1,−2)");
    
    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(7,6)");
    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(−1,6)");
    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(7,8)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(7,6)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(−1,6)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(7,8)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(−1,−2)");


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/g2/C',
        args: { x: -3, y: -4 }
      })
    })

    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(−3,−4)");
    
    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(−3,6)");
    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(−1,6)");
    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(−1,−2)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(−3,6)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(−1,6)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(−3,−4)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(−1,−2)");


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/g2/B',
        args: { x: -5, y: -6 }
      })
    })

    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(−5,−6)");
    
    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(−3,−6)");
    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(−3,−4)");
    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(−5,−2)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(−3,−6)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(−5,−6)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(−3,−4)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(−5,−2)");


    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: '/g2/A',
        args: { x: -7, y: -8 }
      })
    })

    cy.get('#\\/Ac .mjx-mrow').should('contain.text', "(−7,−8)");
    
    cy.get('#\\/Bc .mjx-mrow').should('contain.text', "(−5,−8)");
    cy.get('#\\/Cc .mjx-mrow').should('contain.text', "(−7,−4)");
    cy.get('#\\/Dc .mjx-mrow').should('contain.text', "(−5,−2)");

    cy.get('#\\/Ac2 .mjx-mrow').should('contain.text', "(−7,−8)");
    cy.get('#\\/Bc2 .mjx-mrow').should('contain.text', "(−5,−8)");
    cy.get('#\\/Cc2 .mjx-mrow').should('contain.text', "(−7,−4)");
    cy.get('#\\/Dc2 .mjx-mrow').should('contain.text', "(−5,−2)");




  });

})
