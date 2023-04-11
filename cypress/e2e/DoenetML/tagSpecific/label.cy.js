import { cesc, cesc2 } from '../../../../src/_utils/url';

describe('Label Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('label in graph, text and math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph >
      <label anchor="$anchorCoords1" name="label1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1">Hello <m>\\frac{\\partial f}{\\partial x}</m></label>
      <label name="label2">Bye <m>\\int_a^b f(x) dx</m></label>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $label1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $label2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$label2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $label1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $label2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$label2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$label2.draggable" /></p>
    <p name="pContent1">Content 1: $label1</p>
    <p name="pContent2">Content 2: $label2</p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(1,3)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: upperright')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: center')
    cy.get(cesc("#\\/positionFromAnchor1")).should('have.value', '1')
    cy.get(cesc("#\\/positionFromAnchor2")).should('have.value', '9')
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: true')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: true')
    cy.get(cesc("#\\/pContent1")).should('contain.text', 'Content 1: Hello ∂f∂x')
    cy.get(cesc("#\\/pContent1") + " .mjx-mrow").eq(0).should('have.text', '∂f∂x')
    cy.get(cesc("#\\/pContent2")).should('contain.text', 'Content 2: Bye ∫baf(x)dx')
    cy.get(cesc("#\\/pContent2") + " .mjx-mrow").eq(0).should('have.text', '∫baf(x)dx')


    cy.log("move labels by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLabel",
        componentName: "/label1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveLabel",
        componentName: "/label2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move labels by entering coordinates")

    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })
    cy.get(cesc('#\\/anchorCoords2') + ' textarea').type("{home}{shift+end}{backspace}(8,9){enter}", { force: true })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(8,9)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log('change position from anchor');
    cy.get(cesc('#\\/positionFromAnchor1')).select("lowerLeft")
    cy.get(cesc('#\\/positionFromAnchor2')).select("lowerRight")

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: lowerleft')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: lowerright')


    cy.log('make not draggable')

    cy.get(cesc('#\\/draggable1')).click();
    cy.get(cesc('#\\/draggable2')).click();
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: false')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: false')


    cy.log('cannot move labels by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLabel",
        componentName: "/label1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveLabel",
        componentName: "/label2",
        args: { x: -8, y: -7 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should('have.text', 'true');

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(8,9)')


  })

  it('label in graph, just text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph >
      <label anchor="$anchorCoords1" name="label1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1">Hello</label>
      <label name="label2">Bye</label>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $label1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $label2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$label2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $label1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $label2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$label2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$label2.draggable" /></p>
    <p name="pContent1">Content 1: $label1</p>
    <p name="pContent2">Content 2: $label2</p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(1,3)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: upperright')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: center')
    cy.get(cesc("#\\/positionFromAnchor1")).should('have.value', '1')
    cy.get(cesc("#\\/positionFromAnchor2")).should('have.value', '9')
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: true')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: true')
    cy.get(cesc("#\\/pContent1")).should('have.text', 'Content 1: Hello')
    cy.get(cesc("#\\/pContent2")).should('have.text', 'Content 2: Bye')


    cy.log("move labels by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLabel",
        componentName: "/label1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveLabel",
        componentName: "/label2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move labels by entering coordinates")

    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })
    cy.get(cesc('#\\/anchorCoords2') + ' textarea').type("{home}{shift+end}{backspace}(8,9){enter}", { force: true })

    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').should('contain.text', '(8,9)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log('change position from anchor');
    cy.get(cesc('#\\/positionFromAnchor1')).select("lowerLeft")
    cy.get(cesc('#\\/positionFromAnchor2')).select("lowerRight")

    cy.get(cesc("#\\/pPositionFromAnchor1")).should('have.text', 'Position from anchor 1: lowerleft')
    cy.get(cesc("#\\/pPositionFromAnchor2")).should('have.text', 'Position from anchor 2: lowerright')


    cy.log('make not draggable')

    cy.get(cesc('#\\/draggable1')).click();
    cy.get(cesc('#\\/draggable2')).click();
    cy.get(cesc("#\\/pDraggable1")).should('have.text', 'Draggable 1: false')
    cy.get(cesc("#\\/pDraggable2")).should('have.text', 'Draggable 2: false')


    cy.log('cannot move labels by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLabel",
        componentName: "/label1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveLabel",
        componentName: "/label2",
        args: { x: -8, y: -7 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should('have.text', 'true');

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get(cesc('#\\/pAnchor2') + ' .mjx-mrow').eq(0).should('have.text', '(8,9)')


  })

  it('label in graph, handle bad anchor coordinates', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph >
      <label anchor="$anchorCoords1" name="label1">Hello</label>
    </graph>
    

    <p name="pAnchor1">Anchor 1 coordinates: $label1.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="x" /></p>
    

    `}, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a') //wait for page to load

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', 'x')


    cy.log("give good anchor coords")

    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').should('contain.text', '(6,7)')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', '(6,7)')

    cy.log("give bad anchor coords again")

    cy.get(cesc('#\\/anchorCoords1') + ' textarea').type("{home}{shift+end}{backspace}q{enter}", { force: true })

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').should('contain.text', 'q')

    cy.get(cesc('#\\/pAnchor1') + ' .mjx-mrow').eq(0).should('have.text', 'q')


  });

  it('color label via style', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathinput prefill="1" name="sn" /></p>

    <p><label name="no_style">one: <m>x^2</m></label> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><label name="fixed_style" stylenumber="2">two: <m>x^3</m></label> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><label name="variable_style" stylenumber="$sn">three: <m>x^4</m></label> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    ` }, "*");
    });

    cy.get(cesc('#\\/tsd_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/tc_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/bc_no_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/tc_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/bc_fixed_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_variable_style')).should('have.text', 'black');
    cy.get(cesc('#\\/tc_variable_style')).should('have.text', 'black');
    cy.get(cesc('#\\/bc_variable_style')).should('have.text', 'none');


    cy.get(cesc('#\\/no_style')).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.get(cesc('#\\/no_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/fixed_style')).should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get(cesc('#\\/fixed_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/variable_style')).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.get(cesc('#\\/variable_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    // TODO: how to test color in graph


    cy.get(cesc('#\\/sn') + ' textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get(cesc('#\\/tsd_variable_style')).should('have.text', 'green');
    cy.get(cesc('#\\/tc_variable_style')).should('have.text', 'green');
    cy.get(cesc('#\\/bc_variable_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/tc_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/bc_no_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/tc_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/bc_fixed_style')).should('have.text', 'none');

    cy.get(cesc('#\\/no_style')).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.get(cesc('#\\/no_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/fixed_style')).should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get(cesc('#\\/fixed_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/variable_style')).should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get(cesc('#\\/variable_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');



    cy.get(cesc('#\\/sn') + ' textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get(cesc('#\\/tsd_variable_style')).should('have.text', 'red with a blue background');
    cy.get(cesc('#\\/tc_variable_style')).should('have.text', 'red');
    cy.get(cesc('#\\/bc_variable_style')).should('have.text', 'blue');

    cy.get(cesc('#\\/tsd_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/tc_no_style')).should('have.text', 'black');
    cy.get(cesc('#\\/bc_no_style')).should('have.text', 'none');

    cy.get(cesc('#\\/tsd_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/tc_fixed_style')).should('have.text', 'green');
    cy.get(cesc('#\\/bc_fixed_style')).should('have.text', 'none');

    cy.get(cesc('#\\/no_style')).should('have.css', 'color', 'rgb(0, 0, 0)');
    cy.get(cesc('#\\/no_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/fixed_style')).should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get(cesc('#\\/fixed_style')).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');

    cy.get(cesc('#\\/variable_style')).should('have.css', 'color', 'rgb(255, 0, 0)');
    cy.get(cesc('#\\/variable_style')).should('have.css', 'background-color', 'rgb(0, 0, 255)');



  })

  it('label copied by plain macro, but not value, reflects style and anchor position', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" />
      </styleDefinitions>
    </setup>

    <text>a</text>

    <graph name="g1">
      <label styleNumber="2" name="m1">one: <m>x^2</m></label>
      <label styleNumber="3" anchor="(3,4)" name="m2" >two: <m>x^3</m></label>
    </graph>

    <coords copySource="m1.anchor" name="m1coords" />
    <coords copySource="m2.anchor" name="m2coords" />

    <graph name="g2">
      $m1
      $m2
    </graph>

    <collect componentTypes="label" source="g2" prop="anchor" assignNames="m1acoords m2acoords" />

    <graph name="g3">
      $m1.value
      $m2.value
    </graph>

    <collect componentTypes="label" source="g3" prop="anchor" assignNames="m1bcoords m2bcoords" />

    <p name="p1">$m1 $m2</p>

    <p name="p2">$m1.value $m2.value</p>

    ` }, "*");
    });

    cy.get(cesc('#\\/_text1')).should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let m1aName = stateVariables["/g2"].activeChildren[0].componentName;
      let m2aName = stateVariables["/g2"].activeChildren[1].componentName;
      let m1bName = stateVariables["/g3"].activeChildren[0].componentName;
      let m2bName = stateVariables["/g3"].activeChildren[1].componentName;
      let m1cName = stateVariables["/p1"].activeChildren[0].componentName;
      let m2cName = stateVariables["/p1"].activeChildren[2].componentName;
      let m1dName = stateVariables["/p2"].activeChildren[0].componentName;
      let m2dName = stateVariables["/p2"].activeChildren[2].componentName;

      let m1cAnchor = '#' + cesc2(m1cName) + " .mjx-mrow";
      let m2cAnchor = '#' + cesc2(m2cName) + " .mjx-mrow";
      let m1dAnchor = '#' + cesc2(m1dName) + " .mjx-mrow";
      let m2dAnchor = '#' + cesc2(m2dName) + " .mjx-mrow";

      cy.get(m1cAnchor).eq(0).should('have.text', 'x2')
      cy.get(m1dAnchor).eq(0).should('have.text', 'x2')
      cy.get(m2cAnchor).eq(0).should('have.text', 'x3')
      cy.get(m2dAnchor).eq(0).should('have.text', 'x3')

      cy.get(m1cAnchor).should('have.css', 'color', 'rgb(0, 128, 0)');
      cy.get(m1dAnchor).should('have.css', 'color', 'rgb(0, 0, 0)');
      cy.get(m2cAnchor).should('have.css', 'color', 'rgb(255, 0, 0)');
      cy.get(m2dAnchor).should('have.css', 'color', 'rgb(0, 0, 0)');

      cy.get(cesc('#\\/m1coords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').eq(0).should('have.text', '(3,4)')
      cy.get(cesc('#\\/m1acoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2acoords') + ' .mjx-mrow').eq(0).should('have.text', '(3,4)')
      cy.get(cesc('#\\/m1bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')



      cy.log("move first labels")
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveLabel",
          componentName: "/m1",
          args: { x: -2, y: 3 }
        })
        win.callAction1({
          actionName: "moveLabel",
          componentName: "/m2",
          args: { x: 4, y: -5 }
        })
      })

      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').should('contain.text', '(4,−5)')

      cy.get(cesc('#\\/m1coords') + ' .mjx-mrow').eq(0).should('have.text', '(−2,3)')
      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').eq(0).should('have.text', '(4,−5)')
      cy.get(cesc('#\\/m1acoords') + ' .mjx-mrow').eq(0).should('have.text', '(−2,3)')
      cy.get(cesc('#\\/m2acoords') + ' .mjx-mrow').eq(0).should('have.text', '(4,−5)')
      cy.get(cesc('#\\/m1bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')


      cy.log("move second labels")
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveLabel",
          componentName: m1aName,
          args: { x: 7, y: 1 }
        })
        win.callAction1({
          actionName: "moveLabel",
          componentName: m2aName,
          args: { x: -8, y: 2 }
        })
      })

      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').should('contain.text', '(−8,2)')

      cy.get(cesc('#\\/m1coords') + ' .mjx-mrow').eq(0).should('have.text', '(7,1)')
      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').eq(0).should('have.text', '(−8,2)')
      cy.get(cesc('#\\/m1acoords') + ' .mjx-mrow').eq(0).should('have.text', '(7,1)')
      cy.get(cesc('#\\/m2acoords') + ' .mjx-mrow').eq(0).should('have.text', '(−8,2)')
      cy.get(cesc('#\\/m1bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')
      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(0,0)')


      cy.log("move third labels")
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveLabel",
          componentName: m1bName,
          args: { x: -6, y: 3 }
        })
        win.callAction1({
          actionName: "moveLabel",
          componentName: m2bName,
          args: { x: -5, y: -4 }
        })
      })

      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').should('contain.text', '(−5,−4)')

      cy.get(cesc('#\\/m1coords') + ' .mjx-mrow').eq(0).should('have.text', '(7,1)')
      cy.get(cesc('#\\/m2coords') + ' .mjx-mrow').eq(0).should('have.text', '(−8,2)')
      cy.get(cesc('#\\/m1acoords') + ' .mjx-mrow').eq(0).should('have.text', '(7,1)')
      cy.get(cesc('#\\/m2acoords') + ' .mjx-mrow').eq(0).should('have.text', '(−8,2)')
      cy.get(cesc('#\\/m1bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(−6,3)')
      cy.get(cesc('#\\/m2bcoords') + ' .mjx-mrow').eq(0).should('have.text', '(−5,−4)')



    })
  })


});