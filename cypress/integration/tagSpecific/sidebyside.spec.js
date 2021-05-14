import me from 'math-expressions';

describe('SideBySide Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('sideBySide with no arguments, one panel, change margins first', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <p>Hello</p>
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    </p>


    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([100]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change left margin first, unspecified width adjusts`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([90]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 0]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change right margin, unspecified width adjusts`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([70]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 20]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`change width to be smaller, add extra to right margin`)
    //  Note: add to right margin since with one panel, there is not gapWidth to set
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}60{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs"].stateValues.widths).eqls([60]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 30]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change width to be larger, rescale to 100%`)
    // Note: this rescaling ignores the extra width added to the right margin,
    // as it was an indirect consequence of changing the width.
    // Computations assume the right margin is at the origin 20% specified
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}95{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 95 + 10 + 20;
      let newWidth = 95 / originalTotal * 100;
      let newMargin1 = 10 / originalTotal * 100;
      let newMargin2 = 20 / originalTotal * 100;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([95]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`shrink margins to make specified values add back to 100%`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}3{enter}", { force: true });
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}2{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([95]);
      expect(components["/sbs"].stateValues.widths).eqls([95]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([3, 2]);
      expect(components["/sbs"].stateValues.margins).eqls([3, 2]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`shrink right margin to 1, gets recreated to make 100%`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}1{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([95]);
      expect(components["/sbs"].stateValues.widths).eqls([95]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([3, 2]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`increase left margin to make specified total be 100%`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}4{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([95]);
      expect(components["/sbs"].stateValues.widths).eqls([95]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([4, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([4, 1]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`change totals to keep at 100%`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}80{enter}", { force: true });
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}15{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([80]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([15, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([15, 5]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`increasing right margin rescales`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}30{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 80 + 15 + 30;
      let newWidth = 80 / originalTotal * 100;
      let newMargin1 = 15 / originalTotal * 100;
      let newMargin2 = 30 / originalTotal * 100;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([15, 30]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`increasing left margin rescales`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}50{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 80 + 50 + 30;
      let newWidth = 80 / originalTotal * 100;
      let newMargin1 = 50 / originalTotal * 100;
      let newMargin2 = 30 / originalTotal * 100;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([50, 30]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`shrink width to get specified back to 100%`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20]);
      expect(components["/sbs"].stateValues.widths).eqls([20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([50, 30]);
      expect(components["/sbs"].stateValues.margins).eqls([50, 30]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change valign`)
    cy.get("#\\/v1_input").clear().type("bottom{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20]);
      expect(components["/sbs"].stateValues.widths).eqls([20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([50, 30]);
      expect(components["/sbs"].stateValues.margins).eqls([50, 30]);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom"]);
    })

    cy.log(`invalid valign ignored`)
    cy.get("#\\/v1_input").clear().type("invalid{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20]);
      expect(components["/sbs"].stateValues.widths).eqls([20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([50, 30]);
      expect(components["/sbs"].stateValues.margins).eqls([50, 30]);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom"]);
    })


  })

  it('sideBySide with no arguments, one panel, change width first', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <p>Hello</p>
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    </p>


    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([100]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change width first, unspecified margins adjusts`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}{backspace}70{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([70]);
      expect(components["/sbs"].stateValues.widths).eqls([70]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([15, 15]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`change width larger than 100%, scaled back to 100%`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}{backspace}170{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([170]);
      expect(components["/sbs"].stateValues.widths).eqls([100]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`change width smaller again`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}{backspace}60{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs"].stateValues.widths).eqls([60]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([20, 20]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`change right margin, unspecified left margin adjusts`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs"].stateValues.widths).eqls([60]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([30, 10]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change right margin so total is larger than 100%, rescales`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}60{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs"].stateValues.widths).eqls([50]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, 60]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 50]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`change left margin to be large, rescaling adjusts`)
    //  Note: add to right margin since with one panel, there is not gapWidth to set
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}120{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs"].stateValues.widths).eqls([25]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([120, 60]);
      expect(components["/sbs"].stateValues.margins).eqls([50, 25]);
      expect(components["/sbs"].stateValues.valigns).eqls(["top"]);
    })


  })

  it('sideBySide with singular relative arguments, one panel', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="80%" margins="10%" valign="middle">
    <p>Hello</p>
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([80]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })


    cy.log(`change left margin, specified margins stay symmetric, get rescaling`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}40{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([50]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([40, 40]);
      expect(components["/sbs"].stateValues.margins).eqls([25, 25]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })

    cy.log(`change right margin, specified margins stay symmetric, extra added to right`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([80]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 15]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })

    cy.log(`symmetry regained by increasing width`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}90{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([90]);
      expect(components["/sbs"].stateValues.widths).eqls([90]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })


    cy.log(`change valign`)
    cy.get("#\\/v1_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([90]);
      expect(components["/sbs"].stateValues.widths).eqls([90]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom"]);
    })

    cy.log(`ignore invalid valign`)
    cy.get("#\\/v1_input").clear().type("green{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([90]);
      expect(components["/sbs"].stateValues.widths).eqls([90]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom"]);
    })


  })

  it('sideBySide with plural relative arguments, one panel', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="80%" margins="15% 5%" valigns="middle">
    <p>Hello</p>
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([80]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([15, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([15, 5]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })


    cy.log(`decrease left margin, space added to right margin`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([80]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })

    cy.log(`increase right margin, get rescaling`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}35{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 80 + 10 + 35;
      let newWidth = 80 / originalTotal * 100;
      let newMargin1 = 10 / originalTotal * 100;
      let newMargin2 = 35 * 100 / originalTotal;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 35]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })

    cy.log(`decrease width to return to 100%`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}55{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([55]);
      expect(components["/sbs"].stateValues.widths).eqls([55]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 35]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 35]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })


    cy.log(`change valign`)
    cy.get("#\\/v1_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([55]);
      expect(components["/sbs"].stateValues.widths).eqls([55]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 35]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 35]);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom"]);
    })

    cy.log(`ignore invalid valign`)
    cy.get("#\\/v1_input").clear().type("green{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([55]);
      expect(components["/sbs"].stateValues.widths).eqls([55]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 35]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 35]);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom"]);
    })


  })

  it('sideBySide with singular relative arguments and auto margins, one panel', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="80%" margins="auto" valign="middle">
    <p>Hello</p>
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([80]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })

    cy.log(`change left margin, specified margins stay symmetric, get rescaling`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}40{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([50]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([40, 40]);
      expect(components["/sbs"].stateValues.margins).eqls([25, 25]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })

    cy.log(`change right margin, specified margins stay symmetric, extra added to right`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80]);
      expect(components["/sbs"].stateValues.widths).eqls([80]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 15]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })

    cy.log(`symmetry regained by increasing width`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}90{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([90]);
      expect(components["/sbs"].stateValues.widths).eqls([90]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle"]);
    })


    cy.log(`change valign`)
    cy.get("#\\/v1_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([90]);
      expect(components["/sbs"].stateValues.widths).eqls([90]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom"]);
    })

    cy.log(`ignore invalid valign`)
    cy.get("#\\/v1_input").clear().type("green{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([90]);
      expect(components["/sbs"].stateValues.widths).eqls([90]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom"]);
    })


  })

  it('sideBySide with no arguments, two panels, change margins first', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <p>Hello</p>
    <p>Bye</p>
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    <mathinput name="w2" bindValueTo="$(sbs{prop='width2'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    <textinput name="v2" bindValueTo="$(sbs{prop='valign2'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([50, 50]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change left margin first, unspecified widths adjust`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([40, 40]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change right margin, unspecified widths adjust`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([35, 35]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`change first width to be smaller, add extra to second width`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 50]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`change first width to be larger, second width shrinks to zero, rescale to 100%`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}95{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 95 + (10 + 5) * 2;
      let newWidth = 95 / originalTotal * 100;
      let newMargin1 = 10 / originalTotal * 100;
      let newMargin2 = 5 / originalTotal * 100;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([95, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth, 0]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change first width to be smaller again`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 60]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`change second width to be smaller, extra added to gap`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}50{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 50]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 50]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(10);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change second width to be larger, rescaled to 100%`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}85{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 10 + 85 + (10 + 5) * 2;
      let newWidth1 = 10 / originalTotal * 100;
      let newWidth2 = 85 / originalTotal * 100;
      let newMargin1 = 10 / originalTotal * 100;
      let newMargin2 = 5 / originalTotal * 100;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 85]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth1, newWidth2]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })



    cy.log(`shrink margins to make specified values add back to 100%`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}1.5{enter}", { force: true });
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}1{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 85]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 85]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([1.5, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([1.5, 1]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`shrink right margin to 0.5, extra added to gap`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}0.5{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 85]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 85]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([1.5, 0.5]);
      expect(components["/sbs"].stateValues.margins).eqls([1.5, 0.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(1);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`increase left margin to make specified total be 100%`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}{backspace}2{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 85]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 85]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 0.5]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 0.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`change totals to keep at 100%`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}30{enter}", { force: true });
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}50{enter}", { force: true });
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}4{enter}", { force: true });
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}6{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 50]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 50]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([4, 6]);
      expect(components["/sbs"].stateValues.margins).eqls([4, 6]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`increasing right margin rescales`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}18.5{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 30 + 50 + (4 + 18.5) * 2;
      let newWidth1 = 30 / originalTotal * 100;
      let newWidth2 = 50 / originalTotal * 100;
      let newMargin1 = 4 / originalTotal * 100;
      let newMargin2 = 18.5 * 100 / originalTotal;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 50]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth1, newWidth2]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([4, 18.5]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`increasing left margin rescales`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}{backspace}21.5{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 30 + 50 + (21.5 + 18.5) * 2;
      let newWidth1 = 30 / originalTotal * 100;
      let newWidth2 = 50 / originalTotal * 100;
      let newMargin1 = 21.5 * 100 / originalTotal;
      let newMargin2 = 18.5 * 100 / originalTotal;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 50]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth1, newWidth2]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`shrink widths to get specified below 100%`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}5{enter}", { force: true });
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([5, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.margins).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(5);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change first valign`)
    cy.get("#\\/v1_input").clear().type("bottom{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([5, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.margins).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(5);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change second valign`)
    cy.get("#\\/v2_input").clear().type("middle{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([5, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.margins).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(5);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom", "middle"]);
    })

    cy.log(`invalid valign ignored`)
    cy.get("#\\/v2_input").clear().type("invalid{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([5, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.margins).eqls([21.5, 18.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(5);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom", "middle"]);
    })


  })

  it('sideBySide with no arguments, two panels, change widths first', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <p>Hello</p>
    <p>Bye</p>
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    <mathinput name="w2" bindValueTo="$(sbs{prop='width2'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    <textinput name="v2" bindValueTo="$(sbs{prop='valign2'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([50, 50]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change second width past 100%, unspecified first width shrinks to zero, rescales`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}130{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, 130]);
      expect(components["/sbs"].stateValues.widths).eqls([0, 100]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change second width, unspecified first width adjusts`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([90, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change first width, unspecified margins adjust`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}{backspace}30{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([15, 15]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change right margin, unspecified left margin adjusts`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([25, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`increase second width so total is past 100%, rescaling`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}85{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 30 + 85 + (0 + 5) * 2;
      let newWidth1 = 30 / originalTotal * 100;
      let newWidth2 = 85 / originalTotal * 100;
      let newMargin1 = 0 / originalTotal * 100;
      let newMargin2 = 5 / originalTotal * 100;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 85]);
      expect(components["/sbs"].stateValues.widths).eqls([newWidth1, newWidth2]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`decrease second width`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([20, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`specify first margin to be smaller, remainder in gap`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(20);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

  })

  it('sideBySide with singular relative arguments, two panels', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="20%" margins="10%" valign="middle">
    <p>Hello</p>
    <p>Bye</p>
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    <mathinput name="w2" bindValueTo="$(sbs{prop='width2'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    <textinput name="v2" bindValueTo="$(sbs{prop='valign2'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.gapWidth).eq(20);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle"]);
    })

    cy.log(`change first width, second matches`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}30{enter}", { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle"]);
    })

    cy.log(`change second width, first matches, rescaling`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}80{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([80, 80]);
      expect(components["/sbs"].stateValues.widths).eqls([40, 40]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle"]);
    })

    cy.log(`shrink width, rest in gap`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.gapWidth).eq(40);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle"]);
    })


    cy.log(`increase left margin, right margin matches`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([20, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([20, 20]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle"]);
    })


    cy.log(`increase right margin, left margin matches, rescaling`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}45{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([45, 45]);
      expect(components["/sbs"].stateValues.margins).eqls([45 / 2, 45 / 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle"]);
    })


    cy.log(`change first valign`)
    cy.get("#\\/v1_input").clear().type("top{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([45, 45]);
      expect(components["/sbs"].stateValues.margins).eqls([45 / 2, 45 / 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`change second valign`)
    cy.get("#\\/v2_input").clear().type("bottom{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([45, 45]);
      expect(components["/sbs"].stateValues.margins).eqls([45 / 2, 45 / 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom", "bottom"]);
    })

    cy.log(`invalid valign ignored`)
    cy.get("#\\/v1_input").clear().type("invalid{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([45, 45]);
      expect(components["/sbs"].stateValues.margins).eqls([45 / 2, 45 / 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom", "bottom"]);
    })


  })

  it('sideBySide with plural relative arguments, two panels', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="20% 10%" margins="10% 20%" valigns="middle bottom">
    <p>Hello</p>
    <p>Bye</p>
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    <mathinput name="w2" bindValueTo="$(sbs{prop='width2'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    <textinput name="v2" bindValueTo="$(sbs{prop='valign2'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 20]);
      expect(components["/sbs"].stateValues.gapWidth).eq(10);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "bottom"]);
    })

    cy.log(`change first width`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}30{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 20]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "bottom"]);
    })

    cy.log(`change second width, rescaling`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}110{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 110]);
      expect(components["/sbs"].stateValues.widths).eqls([15, 55]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "bottom"]);
    })


    cy.log(`shrink second width`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 5]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 20]);
      expect(components["/sbs"].stateValues.gapWidth).eq(5);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "bottom"]);
    })


    cy.log(`decrease right margin`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 5]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(35);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "bottom"]);
    })


    cy.log(`increase left margin, rescaling`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}77.5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 5]);
      expect(components["/sbs"].stateValues.widths).eqls([15, 2.5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([77.5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([77.5 / 2, 2.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "bottom"]);
    })


    cy.log(`change first valign`)
    cy.get("#\\/v1_input").clear().type("top{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 5]);
      expect(components["/sbs"].stateValues.widths).eqls([15, 2.5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([77.5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([77.5 / 2, 2.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "bottom"]);
    })

    cy.log(`change second valign`)
    cy.get("#\\/v2_input").clear().type("middle{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 5]);
      expect(components["/sbs"].stateValues.widths).eqls([15, 2.5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([77.5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([77.5 / 2, 2.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "middle"]);
    })

    cy.log(`invalid valign ignored`)
    cy.get("#\\/v2_input").clear().type("invalid{enter}");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 5]);
      expect(components["/sbs"].stateValues.widths).eqls([15, 2.5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([77.5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([77.5 / 2, 2.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "middle"]);
    })


  })

  it('sideBySide with half-specified plural relative arguments and auto margins', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="20%" margins="auto" valigns="middle">
    <p>Hello</p>
    <p>Bye</p>
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    <mathinput name="w2" bindValueTo="$(sbs{prop='width2'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    <textinput name="v2" bindValueTo="$(sbs{prop='valign2'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 80]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`change first width, unspecified second width adjusts`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}30{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 70]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`change right margin, left is symmetric, unspecified second width adjusts`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change second width, rest in gap`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([30, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([30, 20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.gapWidth).eq(10);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change first width, rescaling`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}140{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([140, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([70, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`shrink first width`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.gapWidth).eq(30);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top"]);
    })



    cy.log(`decrease right margin, left matches`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(50);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`increase left margin, right matches, rescaling`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}42.5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([42.5, 42.5]);
      expect(components["/sbs"].stateValues.margins).eqls([42.5 / 2, 42.5 / 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`change first valign`)
    cy.get("#\\/v1_input").clear().type("top{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([42.5, 42.5]);
      expect(components["/sbs"].stateValues.margins).eqls([42.5 / 2, 42.5 / 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`change second valign`)
    cy.get("#\\/v2_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([42.5, 42.5]);
      expect(components["/sbs"].stateValues.margins).eqls([42.5 / 2, 42.5 / 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "bottom"]);
    })

    cy.log(`invalid valign ignored`)
    cy.get("#\\/v2_input").clear().type("invalid{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([42.5, 42.5]);
      expect(components["/sbs"].stateValues.margins).eqls([42.5 / 2, 42.5 / 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "bottom"]);
    })


  })

  it('sideBySide with no arguments, four panels', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <p>Hello</p>
    <p>Bye</p>
    <p>Never</p>
    <p>Always</p>
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    <mathinput name="w2" bindValueTo="$(sbs{prop='width2'})" />
    <mathinput name="w3" bindValueTo="$(sbs{prop='width3'})" />
    <mathinput name="w4" bindValueTo="$(sbs{prop='width4'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    <textinput name="v2" bindValueTo="$(sbs{prop='valign2'})" />
    <textinput name="v3" bindValueTo="$(sbs{prop='valign3'})" />
    <textinput name="v4" bindValueTo="$(sbs{prop='valign4'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined, undefined, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([25, 25, 25, 25]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })


    cy.log(`change left margin first, unspecified widths adjust`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}2{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined, undefined, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([23, 23, 23, 23]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, undefined]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })



    cy.log(`change right margin, unspecified widths adjust`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}3{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined, undefined, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 20, 20, 20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 3]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })

    cy.log(`change 3rd width to be smaller, add extra to other widths`)
    cy.get("#\\/w3 textarea").type("{end}{backspace}{backspace}14{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined, 14, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([22, 22, 14, 22]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 3]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })

    cy.log(`change 3rd width to be larger, others widths shrinks to zero, rescale to 100%`)
    cy.get("#\\/w3 textarea").type("{end}{backspace}{backspace}180{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined, 180, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([0, 0, 90, 0]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins).eqls([1, 1.5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })

    cy.log(`change 3rd width to be smaller again`)
    cy.get("#\\/w3 textarea").type("{end}{backspace}{backspace}11{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, undefined, 11, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([23, 23, 11, 23]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 3]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })

    cy.log(`change 2nd width to be smaller`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}15{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([undefined, 15, 11, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([27, 15, 11, 27]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 3]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })


    cy.log(`change 1st width to be smaller`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 15, 11, undefined]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 15, 11, 34]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 3]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })

    cy.log(`change 4th width to be smaller, remainder added to gap`)
    cy.get("#\\/w4 textarea").type("{end}{backspace}{backspace}19{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 15, 11, 19]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 15, 11, 19]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 3]);
      expect(components["/sbs"].stateValues.gapWidth).eq(5);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })


    cy.log(`change 2nd width to be larger, rescaled to 100%`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}55{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 20 + 55 + 11 + 19 + (2 + 3) * 4;
      let newWidth1 = 20 * 100 / originalTotal;
      let newWidth2 = 55 * 100 / originalTotal;
      let newWidth3 = 11 * 100 / originalTotal;
      let newWidth4 = 19 * 100 / originalTotal;
      let newMargin1 = 2 * 100 / originalTotal;
      let newMargin2 = 3 * 100 / originalTotal;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 55, 11, 19]);
      expect(components["/sbs"].stateValues.widths.map(x => me.math.round(x, 10))).eqls([newWidth1, newWidth2, newWidth3, newWidth4]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins.map(x => me.math.round(x, 10))).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })



    cy.log(`shrink width 2 to make specified values add back to 100%`)
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}30{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 3]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 3]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })


    cy.log(`shrink right margin, extra added to gap`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}1{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 1]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(8 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "top"]);
    })


    cy.log(`change fourth valign`)
    cy.get("#\\/v4_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 1]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(8 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top", "top", "bottom"]);
    })

    cy.log(`change second valign`)
    cy.get("#\\/v2_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 1]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(8 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "middle", "top", "bottom"]);
    })

    cy.log(`change first valign`)
    cy.get("#\\/v1_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 1]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(8 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle", "top", "bottom"]);
    })

    cy.log(`change third valign`)
    cy.get("#\\/v3_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 1]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(8 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle", "bottom", "bottom"]);
    })


    cy.log(`invalid valign ignored`)
    cy.get("#\\/v3_input").clear().type("invalid{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.widths).eqls([20, 30, 11, 19]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 1]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 1]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(8 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle", "bottom", "bottom"]);
    })


  })

  it('sideBySide with singular relative arguments, four panels', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="15%" margins="5%" valign="middle">
    <p>Hello</p>
    <p>Bye</p>
    <p>Never</p>
    <p>Always</p>
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    <mathinput name="w2" bindValueTo="$(sbs{prop='width2'})" />
    <mathinput name="w3" bindValueTo="$(sbs{prop='width3'})" />
    <mathinput name="w4" bindValueTo="$(sbs{prop='width4'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    <textinput name="v2" bindValueTo="$(sbs{prop='valign2'})" />
    <textinput name="v3" bindValueTo="$(sbs{prop='valign3'})" />
    <textinput name="v4" bindValueTo="$(sbs{prop='valign4'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([15, 15, 15, 15]);
      expect(components["/sbs"].stateValues.widths).eqls([15, 15, 15, 15]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle", "middle", "middle"]);
    })


    cy.log(`change 4th width, rest match, remainder added to gap`)
    cy.get("#\\/w4 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10, 10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 10, 10, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 5]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 5]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(20 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle", "middle", "middle"]);
    })


    cy.log(`change right margin, rescaled`)
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10, 10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 5, 5, 5]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([20, 20]);
      expect(components["/sbs"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle", "middle", "middle"]);
    })

    cy.log(`shrink left margin`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}2{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10, 10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 10, 10, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 2]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 2]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(44 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "middle", "middle", "middle"]);
    })

    cy.log(`change fourth valign`)
    cy.get("#\\/v4_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([10, 10, 10, 10]);
      expect(components["/sbs"].stateValues.widths).eqls([10, 10, 10, 10]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([2, 2]);
      expect(components["/sbs"].stateValues.margins).eqls([2, 2]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(44 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["bottom", "bottom", "bottom", "bottom"]);
    })


  })

  it('sideBySide with plural relative arguments, four panels', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="5% 10% 15% 20%" margins="5% 2%" valigns="middle">
    <p>Hello</p>
    <p>Bye</p>
    <p>Never</p>
    <p>Always</p>
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs{prop='width1'})" />
    <mathinput name="w2" bindValueTo="$(sbs{prop='width2'})" />
    <mathinput name="w3" bindValueTo="$(sbs{prop='width3'})" />
    <mathinput name="w4" bindValueTo="$(sbs{prop='width4'})" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs{prop='margin1'})" />
    <mathinput name="m2" bindValueTo="$(sbs{prop='margin2'})" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs{prop='valign1'})" />
    <textinput name="v2" bindValueTo="$(sbs{prop='valign2'})" />
    <textinput name="v3" bindValueTo="$(sbs{prop='valign3'})" />
    <textinput name="v4" bindValueTo="$(sbs{prop='valign4'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([5, 10, 15, 20]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10, 15, 20]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 2]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 2]);
      expect(components["/sbs"].stateValues.gapWidth).closeTo(22 / 3, 1E-12);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top", "top", "top"]);
    })


    cy.log(`change 4th width, remainder added to gap`)
    cy.get("#\\/w4 textarea").type("{end}{backspace}{backspace}9{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([5, 10, 15, 9]);
      expect(components["/sbs"].stateValues.widths).eqls([5, 10, 15, 9]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 2]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(11);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top", "top", "top"]);
    })

    cy.log(`change 1st width, rescaled`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}63{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotal = 63 + 10 + 15 + 9 + (5 + 2) * 4;
      let newWidth1 = 63 * 100 / originalTotal;
      let newWidth2 = 10 * 100 / originalTotal;
      let newWidth3 = 15 * 100 / originalTotal;
      let newWidth4 = 9 * 100 / originalTotal;
      let newMargin1 = 5 * 100 / originalTotal;
      let newMargin2 = 2 * 100 / originalTotal;
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([63, 10, 15, 9]);
      expect(components["/sbs"].stateValues.widths.map(x => me.math.round(x, 10))).eqls([newWidth1, newWidth2, newWidth3, newWidth4]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 2]);
      expect(components["/sbs"].stateValues.margins.map(x => me.math.round(x, 10))).eqls([newMargin1, newMargin2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(0);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top", "top", "top"]);
    })

    cy.log(`change more widths, remainder added to gap`)
    cy.get("#\\/w1 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}3{enter}", { force: true });
    cy.get("#\\/w2 textarea").type("{end}{backspace}{backspace}8{enter}", { force: true });
    cy.get("#\\/w3 textarea").type("{end}{backspace}{backspace}13{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([3, 8, 13, 9]);
      expect(components["/sbs"].stateValues.widths).eqls([3, 8, 13, 9]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([5, 2]);
      expect(components["/sbs"].stateValues.margins).eqls([5, 2]);
      expect(components["/sbs"].stateValues.gapWidth).eq(13);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top", "top", "top"]);
    })


    cy.log(`change margins`)
    cy.get("#\\/m1 textarea").type("{end}{backspace}{backspace}7{enter}", { force: true });
    cy.get("#\\/m2 textarea").type("{end}{backspace}{backspace}6{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([3, 8, 13, 9]);
      expect(components["/sbs"].stateValues.widths).eqls([3, 8, 13, 9]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([7, 6]);
      expect(components["/sbs"].stateValues.margins).eqls([7, 6]);
      expect(components["/sbs"].stateValues.gapWidth).eq(5);
      expect(components["/sbs"].stateValues.valigns).eqls(["middle", "top", "top", "top"]);
    })

    cy.log(`change valigns`)
    cy.get("#\\/v1_input").clear().type("top{enter}");
    cy.get("#\\/v2_input").clear().type("middle{enter}");
    cy.get("#\\/v3_input").clear().type("bottom{enter}");
    cy.get("#\\/v4_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([3, 8, 13, 9]);
      expect(components["/sbs"].stateValues.widths).eqls([3, 8, 13, 9]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([7, 6]);
      expect(components["/sbs"].stateValues.margins).eqls([7, 6]);
      expect(components["/sbs"].stateValues.gapWidth).eq(5);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "middle", "bottom", "middle"]);
    })


  })

  it('sbsGroup with no arguments, one panel', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg">
      <sideBySide name="sbs1">
        <p>Hello</p>
      </sideBySide>
      <sideBySide name="sbs2">
        <p>Never</p>
      </sideBySide>
    </sbsgroup>
    
    <p>Width for sbsg: 
    <mathinput name="w1g" bindValueTo="$(sbsg{prop='width1'})" />
    </p>
    
    <p>Margins for sbsg: 
    <mathinput name="m1g" bindValueTo="$(sbsg{prop='margin1'})" />
    <mathinput name="m2g" bindValueTo="$(sbsg{prop='margin2'})" />
    </p>
    
    <p>Valign for sbsg: 
    <textinput name="v1g" bindValueTo="$(sbsg{prop='valign1'})" />
    </p>
    
    <p>Width for sbs1: 
    <mathinput name="w11" bindValueTo="$(sbs1{prop='width1'})" />
    </p>
    
    <p>Margins for sbs1: 
    <mathinput name="m11" bindValueTo="$(sbs1{prop='margin1'})" />
    <mathinput name="m21" bindValueTo="$(sbs1{prop='margin2'})" />
    </p>
    
    <p>Valign for sbs1: 
    <textinput name="v11" bindValueTo="$(sbs1{prop='valign1'})" />
    </p>
    
    <p>Width for sbs2: 
    <mathinput name="w12" bindValueTo="$(sbs2{prop='width1'})" />
    </p>
    
    <p>Margins for sbs2: 
    <mathinput name="m12" bindValueTo="$(sbs2{prop='margin1'})" />
    <mathinput name="m22" bindValueTo="$(sbs2{prop='margin2'})" />
    </p>
    
    <p>Valign for sbs2: 
    <textinput name="v12" bindValueTo="$(sbs2{prop='valign1'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    // Note: including essentialWidths and essentialMargins
    // just so can keep track of which sbs will still be affected by the spsGroup

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([100]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([100]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs2"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([undefined]);
      expect(components["/sbs2"].stateValues.widths).eqls([100]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change left margin of sbs1, unspecified width of sbs1 adjusts`)
    cy.get("#\\/m11 textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([100]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([90]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 0]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([undefined]);
      expect(components["/sbs2"].stateValues.widths).eqls([100]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`change width of sbsg, unspecified margin(s) adjust`)
    cy.get("#\\/w1g textarea").type("{end}{backspace}{backspace}{backspace}70{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([70]);
      expect(components["/sbsg"].stateValues.widths).eqls([70]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([15, 15]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([70]);
      expect(components["/sbs1"].stateValues.widths).eqls([70]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 20]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([70]);
      expect(components["/sbs2"].stateValues.widths).eqls([70]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([15, 15]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change right margin of sbs2, unspecified margin adjusts`)
    cy.get("#\\/m22 textarea").type("{end}{backspace}{backspace}25{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([70]);
      expect(components["/sbsg"].stateValues.widths).eqls([70]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([15, 15]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([70]);
      expect(components["/sbs1"].stateValues.widths).eqls([70]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 20]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([70]);
      expect(components["/sbs2"].stateValues.widths).eqls([70]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([5, 25]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change left margin of sbsg, affects only sbs2`)
    cy.get("#\\/m1g textarea").type("{end}{backspace}{backspace}4{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([70]);
      expect(components["/sbsg"].stateValues.widths).eqls([70]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([4, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([4, 26]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([70]);
      expect(components["/sbs1"].stateValues.widths).eqls([70]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 20]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([70]);
      expect(components["/sbs2"].stateValues.widths).eqls([70]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([4, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([4, 26]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change sbgg width to be smaller, adds to unspecified or right margins`)
    cy.get("#\\/w1g textarea").type("{end}{backspace}{backspace}60{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([60]);
      expect(components["/sbsg"].stateValues.widths).eqls([60]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([4, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([4, 36]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs1"].stateValues.widths).eqls([60]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 30]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs2"].stateValues.widths).eqls([60]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([4, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([4, 36]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change sbs1 width to be smaller, adds to unspecified right margin`)
    cy.get("#\\/w11 textarea").type("{end}{backspace}{backspace}50{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([60]);
      expect(components["/sbsg"].stateValues.widths).eqls([60]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([4, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([4, 36]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([50]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([50]);
      expect(components["/sbs1"].stateValues.widths).eqls([50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 40]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs2"].stateValues.widths).eqls([60]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([4, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([4, 36]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`increase sbsg left margin, cause rescaling just in sbs2`)
    cy.get("#\\/m1g textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([60]);
      expect(components["/sbsg"].stateValues.widths).eqls([60]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([20, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([20, 20]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([50]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([50]);
      expect(components["/sbs1"].stateValues.widths).eqls([50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 40]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);

      let originalTotal2 = 60 + 20 + 25;
      let newWidth12 = 60 * 100 / originalTotal2;
      let newMargin12 = 20 * 100 / originalTotal2;
      let newMargin22 = 25 * 100 / originalTotal2;
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([60]);
      expect(components["/sbs2"].stateValues.widths[0]).closeTo(newWidth12, 1E-12);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.margins[0]).closeTo(newMargin12, 1E-12)
      expect(components["/sbs2"].stateValues.margins[1]).closeTo(newMargin22, 1E-12)
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })



    cy.log(`increase sbsg width, causing rescaling in sbsg and a second in sbs2`)
    cy.get("#\\/w1g textarea").type("{end}{backspace}{backspace}90{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotalg = 90 + 20 + 0;
      let newWidth1g = 90 * 100 / originalTotalg;
      let newMargin1g = 20 * 100 / originalTotalg;
      let newMargin2g = 0 * 100 / originalTotalg;
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([90]);
      expect(components["/sbsg"].stateValues.widths[0]).closeTo(newWidth1g, 1E-12);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([20, undefined]);
      expect(components["/sbsg"].stateValues.margins[0]).closeTo(newMargin1g, 1E-12)
      expect(components["/sbsg"].stateValues.margins[1]).eq(newMargin2g);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([50]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([50]);
      expect(components["/sbs1"].stateValues.widths).eqls([50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 40]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);

      let originalTotal2 = 90 + 20 + 25;
      let newWidth12 = 90 * 100 / originalTotal2;
      let newMargin12 = 20 * 100 / originalTotal2;
      let newMargin22 = 25 * 100 / originalTotal2;
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([90]);
      expect(components["/sbs2"].stateValues.widths[0]).closeTo(newWidth12, 1E-12);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.margins[0]).closeTo(newMargin12, 1E-12)
      expect(components["/sbs2"].stateValues.margins[1]).closeTo(newMargin22, 1E-12)
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`shrink sbsg width to remove rescaling`)
    cy.get("#\\/w1g textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}40{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40]);
      expect(components["/sbsg"].stateValues.widths).eqls([40]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([20, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([50]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([50]);
      expect(components["/sbs1"].stateValues.widths).eqls([50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 40]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40]);
      expect(components["/sbs2"].stateValues.widths).eqls([40]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`change valign of sbs1`)
    cy.get("#\\/v11_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40]);
      expect(components["/sbsg"].stateValues.widths).eqls([40]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([20, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([50]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([50]);
      expect(components["/sbs1"].stateValues.widths).eqls([50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 40]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40]);
      expect(components["/sbs2"].stateValues.widths).eqls([40]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })

    cy.log(`change valign of sbsg`)
    cy.get("#\\/v1g_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40]);
      expect(components["/sbsg"].stateValues.widths).eqls([40]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([20, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([50]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([50]);
      expect(components["/sbs1"].stateValues.widths).eqls([50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 40]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40]);
      expect(components["/sbs2"].stateValues.widths).eqls([40]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle"]);
    })

    cy.log(`change valign of sbs2`)
    cy.get("#\\/v12_input").clear().type("top{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40]);
      expect(components["/sbsg"].stateValues.widths).eqls([40]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([20, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([50]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([50]);
      expect(components["/sbs1"].stateValues.widths).eqls([50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 40]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40]);
      expect(components["/sbs2"].stateValues.widths).eqls([40]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })


    cy.log(`valign of sbsg ignores invalid`)
    cy.get("#\\/v1g_input").clear().type("banana{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40]);
      expect(components["/sbsg"].stateValues.widths).eqls([40]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([20, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([50]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([50]);
      expect(components["/sbs1"].stateValues.widths).eqls([50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 40]);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40]);
      expect(components["/sbs2"].stateValues.widths).eqls([40]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.margins).eqls([20, 40]);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top"]);
    })

  })

  it('sbsGroup with no arguments, two panels', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg">
      <sideBySide name="sbs1">
        <p>Hello</p>
        <p>Bye</p>
      </sideBySide>
      <sideBySide name="sbs2">
        <p>Never</p>
        <p>Always</p>
      </sideBySide>
    </sbsgroup>
    
    <p>Widths for sbsg: 
    <mathinput name="w1g" bindValueTo="$(sbsg{prop='width1'})" />
    <mathinput name="w2g" bindValueTo="$(sbsg{prop='width2'})" />
    </p>
    
    <p>Margins for sbsg: 
    <mathinput name="m1g" bindValueTo="$(sbsg{prop='margin1'})" />
    <mathinput name="m2g" bindValueTo="$(sbsg{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbsg: 
    <textinput name="v1g" bindValueTo="$(sbsg{prop='valign1'})" />
    <textinput name="v2g" bindValueTo="$(sbsg{prop='valign2'})" />
    </p>
    
    <p>Widths for sbs1: 
    <mathinput name="w11" bindValueTo="$(sbs1{prop='width1'})" />
    <mathinput name="w21" bindValueTo="$(sbs1{prop='width2'})" />
    </p>
    
    <p>Margins for sbs1: 
    <mathinput name="m11" bindValueTo="$(sbs1{prop='margin1'})" />
    <mathinput name="m21" bindValueTo="$(sbs1{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbs1: 
    <textinput name="v11" bindValueTo="$(sbs1{prop='valign1'})" />
    <textinput name="v21" bindValueTo="$(sbs1{prop='valign2'})" />
    </p>
    
    <p>Widths for sbs2: 
    <mathinput name="w12" bindValueTo="$(sbs2{prop='width1'})" />
    <mathinput name="w22" bindValueTo="$(sbs2{prop='width2'})" />
    </p>
    
    <p>Margins for sbs2: 
    <mathinput name="m12" bindValueTo="$(sbs2{prop='margin1'})" />
    <mathinput name="m22" bindValueTo="$(sbs2{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbs2: 
    <textinput name="v12" bindValueTo="$(sbs2{prop='valign1'})" />
    <textinput name="v22" bindValueTo="$(sbs2{prop='valign2'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    // Note: including essentialWidths and essentialMargins
    // just so can keep track of which sbs will still be affected by the spsGroup

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([50, 50]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([50, 50]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.widths).eqls([50, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(0);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change width1 of sbsg`)
    cy.get("#\\/w1g textarea").type("{end}{backspace}{backspace}40{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([40, 60]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([40, undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([40, 60]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, undefined]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 60]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(0);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`override width1 of sbs1`)
    cy.get("#\\/w11 textarea").type("{end}{backspace}{backspace}30{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([40, 60]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 70]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, undefined]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 60]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(0);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`override width2 of sbs2`)
    cy.get("#\\/w22 textarea").type("{end}{backspace}{backspace}50{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([40, 60]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 70]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([2.5, 2.5]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(0);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change left margin of sbs1`)
    cy.get("#\\/m11 textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([40, 60]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([undefined, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 60]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 0]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([2.5, 2.5]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(0);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change left margin of sbsg`)
    cy.get("#\\/m1g textarea").type("{end}{backspace}{backspace}3{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([40, 54]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, undefined]);
      expect(components["/sbsg"].stateValues.margins).eqls([3, 0]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 60]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 0]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, undefined]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 2]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(0);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })



    cy.log(`change right margin of sbsg`)
    cy.get("#\\/m2g textarea").type("{end}{backspace}{backspace}1{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, undefined]);
      expect(components["/sbsg"].stateValues.widths).eqls([40, 52]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 58]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(2);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change second width of sbsg`)
    cy.get("#\\/w2g textarea").type("{end}{backspace}{backspace}45{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, 45]);
      expect(components["/sbsg"].stateValues.widths).eqls([40, 45]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(7);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 45]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 45]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(13);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(2);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })

    cy.log(`increase second width of sbsg to cause rescaling`)
    cy.get("#\\/w2g textarea").type("{end}{backspace}{backspace}65{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotalg = 40 + 65 + 2*(3 + 1);
      let newWidth1g = 40 * 100 / originalTotalg;
      let newWidth2g = 65 * 100 / originalTotalg;
      let newMargin1g = 3 * 100 / originalTotalg;
      let newMargin2g = 1 * 100 / originalTotalg;
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, 65]);
      expect(components["/sbsg"].stateValues.widths[0]).closeTo(newWidth1g, 1E-12);
      expect(components["/sbsg"].stateValues.widths[1]).closeTo(newWidth2g, 1E-12);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins[0]).closeTo(newMargin1g, 1E-12);
      expect(components["/sbsg"].stateValues.margins[1]).closeTo(newMargin2g, 1E-12);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      let originalTotal1 = 30 + 65 + 2*(5 + 1);
      let newWidth11 = 30 * 100 / originalTotal1;
      let newWidth21 = 65 * 100 / originalTotal1;
      let newMargin11 = 5 * 100 / originalTotal1;
      let newMargin21 = 1 * 100 / originalTotal1;
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 65]);
      expect(components["/sbs1"].stateValues.widths[0]).closeTo(newWidth11, 1E-12);
      expect(components["/sbs1"].stateValues.widths[1]).closeTo(newWidth21, 1E-12);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins[0]).closeTo(newMargin11, 1E-12);
      expect(components["/sbs1"].stateValues.margins[1]).closeTo(newMargin21, 1E-12);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(2);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`decrease second width of sbs1 to drop below 100%`)
    cy.get("#\\/w21 textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}55{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let originalTotalg = 40 + 65 + 2*(3 + 1);
      let newWidth1g = 40 * 100 / originalTotalg;
      let newWidth2g = 65 * 100 / originalTotalg;
      let newMargin1g = 3 * 100 / originalTotalg;
      let newMargin2g = 1 * 100 / originalTotalg;
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([40, 65]);
      expect(components["/sbsg"].stateValues.widths[0]).closeTo(newWidth1g, 1E-12);
      expect(components["/sbsg"].stateValues.widths[1]).closeTo(newWidth2g, 1E-12);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins[0]).closeTo(newMargin1g, 1E-12);
      expect(components["/sbsg"].stateValues.margins[1]).closeTo(newMargin2g, 1E-12);
      expect(components["/sbsg"].stateValues.gapWidth).eq(0);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(3);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([40, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(2);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`decrease first width of sbsg to drop below 100%`)
    cy.get("#\\/w1g textarea").type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}25{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.widths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(2);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(3);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(17);
      expect(components["/sbs2"].stateValues.valigns).eqls(["top", "top"]);
    })


    cy.log(`change first valign of sbsg`)
    cy.get("#\\/v1g_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.widths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(2);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(3);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(17);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change first valign of sbs2`)
    cy.get("#\\/v12_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.widths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(2);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(3);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(17);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change second valign of sbs1`)
    cy.get("#\\/v21_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.widths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(2);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(3);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(17);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change second valign of sbsg`)
    cy.get("#\\/v2g_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.widths).eqls([25, 65]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(2);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "bottom"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 55]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([5, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 1]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(3);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 50]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.widths).eqls([25, 50]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.margins).eqls([3, 1]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(17);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "bottom"]);
    })

  })


  it('sbsGroup with singular arguments, sidebysides with plural or no arguments, two panels', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg" width="25%" margins="10%" valign="middle">
      <sideBySide name="sbs1" widths="40% 20%" valigns="top">
        <p>Hello</p>
        <p>Bye</p>
      </sideBySide>
      <sideBySide name="sbs2" margins="15% 5%" valigns="bottom top">
        <p>Never</p>
        <p>Always</p>
      </sideBySide>
    </sbsgroup>
    
    <p>Widths for sbsg: 
    <mathinput name="w1g" bindValueTo="$(sbsg{prop='width1'})" />
    <mathinput name="w2g" bindValueTo="$(sbsg{prop='width2'})" />
    </p>
    
    <p>Margins for sbsg: 
    <mathinput name="m1g" bindValueTo="$(sbsg{prop='margin1'})" />
    <mathinput name="m2g" bindValueTo="$(sbsg{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbsg: 
    <textinput name="v1g" bindValueTo="$(sbsg{prop='valign1'})" />
    <textinput name="v2g" bindValueTo="$(sbsg{prop='valign2'})" />
    </p>
    
    <p>Widths for sbs1: 
    <mathinput name="w11" bindValueTo="$(sbs1{prop='width1'})" />
    <mathinput name="w21" bindValueTo="$(sbs1{prop='width2'})" />
    </p>
    
    <p>Margins for sbs1: 
    <mathinput name="m11" bindValueTo="$(sbs1{prop='margin1'})" />
    <mathinput name="m21" bindValueTo="$(sbs1{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbs1: 
    <textinput name="v11" bindValueTo="$(sbs1{prop='valign1'})" />
    <textinput name="v21" bindValueTo="$(sbs1{prop='valign2'})" />
    </p>
    
    <p>Widths for sbs2: 
    <mathinput name="w12" bindValueTo="$(sbs2{prop='width1'})" />
    <mathinput name="w22" bindValueTo="$(sbs2{prop='width2'})" />
    </p>
    
    <p>Margins for sbs2: 
    <mathinput name="m12" bindValueTo="$(sbs2{prop='margin1'})" />
    <mathinput name="m22" bindValueTo="$(sbs2{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbs2: 
    <textinput name="v12" bindValueTo="$(sbs2{prop='valign1'})" />
    <textinput name="v22" bindValueTo="$(sbs2{prop='valign2'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([25, 25]);
      expect(components["/sbsg"].stateValues.widths).eqls([25, 25]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(10);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([40, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([40, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([25, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([25, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.margins).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(10);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })


    cy.log(`change width1 of sbsg`)
    cy.get("#\\/w1g textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 20]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 20]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(20);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([40, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([40, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([20, 20]);
      expect(components["/sbs2"].stateValues.widths).eqls([20, 20]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.margins).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(20);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })


    cy.log(`change width2 of sbs2`)
    cy.get("#\\/w22 textarea").type("{end}{backspace}{backspace}15{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 20]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 20]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(20);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([40, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([40, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([20, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([20, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.margins).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(25);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })


    cy.log(`change width2 of sbsg`)
    cy.get("#\\/w2g textarea").type("{end}{backspace}{backspace}12{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(36);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([40, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([40, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.margins).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(33);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })


    cy.log(`change width1 of sbs1`)
    cy.get("#\\/w11 textarea").type("{end}{backspace}{backspace}35{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(36);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(5);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.margins).eqls([15, 5]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(33);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })


    cy.log(`change margins of sbs2`)
    cy.get("#\\/m12 textarea").type("{end}{backspace}{backspace}22{enter}", { force: true });
    cy.get("#\\/m22 textarea").type("{end}{backspace}{backspace}11{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(36);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([10, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(5);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change right margin of sbsg`)
    cy.get("#\\/m2g textarea").type("{end}{backspace}{backspace}8{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([8, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(44);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs1"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(13);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change right margin of sbs1`)
    cy.get("#\\/m21 textarea").type("{end}{backspace}{backspace}7{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([8, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(44);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([8, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([8, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(15);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change left margin of sbsg`)
    cy.get("#\\/m1g textarea").type("{end}{backspace}{backspace}9{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(40);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([9, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([9, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(13);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change left margin of sbs1`)
    cy.get("#\\/m11 textarea").type("{end}{backspace}{backspace}6{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(40);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(19);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })


    cy.log(`change valign1 of sbsg`)
    cy.get("#\\/v1g_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(40);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "bottom"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(19);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "bottom"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })


    cy.log(`change valign2 of sbs1`)
    cy.get("#\\/v21_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(40);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "bottom"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(19);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change valign2 of sbsg`)
    cy.get("#\\/v2g_input").clear().type("top{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(40);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(19);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change valign1 of sbs1`)
    cy.get("#\\/v11_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(40);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(19);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })

    cy.log(`change valigns of sbs2`)
    cy.get("#\\/v12_input").clear().type("middle{enter}");
    cy.get("#\\/v22_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([12, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 9]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(40);
      expect(components["/sbsg"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(19);
      expect(components["/sbs1"].stateValues.valigns).eqls(["bottom", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 15]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([12, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.margins).eqls([22, 11]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(7);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "bottom"]);
    })


  })

  it('sbsGroup with plural arguments, sidebysides with singular or no arguments, two panels', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg" widths="25% 15%" margins="5% 10%" valigns="middle top">
      <sideBySide name="sbs1" width="20%" valign="top">
        <p>Hello</p>
        <p>Bye</p>
      </sideBySide>
      <sideBySide name="sbs2" margins="8%">
        <p>Never</p>
        <p>Always</p>
      </sideBySide>
    </sbsgroup>
    
    <p>Widths for sbsg: 
    <mathinput name="w1g" bindValueTo="$(sbsg{prop='width1'})" />
    <mathinput name="w2g" bindValueTo="$(sbsg{prop='width2'})" />
    </p>
    
    <p>Margins for sbsg: 
    <mathinput name="m1g" bindValueTo="$(sbsg{prop='margin1'})" />
    <mathinput name="m2g" bindValueTo="$(sbsg{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbsg: 
    <textinput name="v1g" bindValueTo="$(sbsg{prop='valign1'})" />
    <textinput name="v2g" bindValueTo="$(sbsg{prop='valign2'})" />
    </p>
    
    <p>Widths for sbs1: 
    <mathinput name="w11" bindValueTo="$(sbs1{prop='width1'})" />
    <mathinput name="w21" bindValueTo="$(sbs1{prop='width2'})" />
    </p>
    
    <p>Margins for sbs1: 
    <mathinput name="m11" bindValueTo="$(sbs1{prop='margin1'})" />
    <mathinput name="m21" bindValueTo="$(sbs1{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbs1: 
    <textinput name="v11" bindValueTo="$(sbs1{prop='valign1'})" />
    <textinput name="v21" bindValueTo="$(sbs1{prop='valign2'})" />
    </p>
    
    <p>Widths for sbs2: 
    <mathinput name="w12" bindValueTo="$(sbs2{prop='width1'})" />
    <mathinput name="w22" bindValueTo="$(sbs2{prop='width2'})" />
    </p>
    
    <p>Margins for sbs2: 
    <mathinput name="m12" bindValueTo="$(sbs2{prop='margin1'})" />
    <mathinput name="m22" bindValueTo="$(sbs2{prop='margin2'})" />
    </p>
    
    <p>Valigns for sbs2: 
    <textinput name="v12" bindValueTo="$(sbs2{prop='valign1'})" />
    <textinput name="v22" bindValueTo="$(sbs2{prop='valign2'})" />
    </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([25, 15]);
      expect(components["/sbsg"].stateValues.widths).eqls([25, 15]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(30);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([20, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([20, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(30);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([25, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([25, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(28);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`change width1 of sbsg`)
    cy.get("#\\/w1g textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 15]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 15]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(35);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([20, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([20, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(30);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([20, 15]);
      expect(components["/sbs2"].stateValues.widths).eqls([20, 15]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(33);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`change width2 of sbs2`)
    cy.get("#\\/w22 textarea").type("{end}{backspace}{backspace}25{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 15]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 15]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(35);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([20, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([20, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(30);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(23);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`change width2 of sbsg`)
    cy.get("#\\/w2g textarea").type("{end}{backspace}{backspace}12{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(38);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([20, 20]);
      expect(components["/sbs1"].stateValues.widths).eqls([20, 20]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(30);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(23);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`change width1 of sbs1`)
    cy.get("#\\/w11 textarea").type("{end}{backspace}{backspace}35{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(38);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([35, 35]);
      expect(components["/sbs1"].stateValues.widths).eqls([35, 35]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(0);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(23);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change width2 of sbs1`)
    cy.get("#\\/w21 textarea").type("{end}{backspace}{backspace}30{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(38);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(10);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([undefined, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([20, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(23);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change width1 of sbs2`)
    cy.get("#\\/w12 textarea").type("{end}{backspace}{backspace}22{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(38);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 10]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(10);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change right margin of sbsg`)
    cy.get("#\\/m2g textarea").type("{end}{backspace}{backspace}8{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(42);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 8]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 8]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(14);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change right margin of sbs1`)
    cy.get("#\\/m21 textarea").type("{end}{backspace}{backspace}7{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([5, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([5, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(42);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([5, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([5, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(16);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change left margin of sbsg`)
    cy.get("#\\/m1g textarea").type("{end}{backspace}{backspace}9{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(34);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([undefined, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([9, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([9, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(8);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })

    cy.log(`change left margin of sbs1`)
    cy.get("#\\/m11 textarea").type("{end}{backspace}{backspace}6{enter}", { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(34);
      expect(components["/sbsg"].stateValues.valigns).eqls(["middle", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(14);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "top"]);
    })


    cy.log(`change valign1 of sbsg`)
    cy.get("#\\/v1g_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(34);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(14);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"]);
    })


    cy.log(`change valign2 of sbs1`)
    cy.get("#\\/v21_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(34);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "top"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(14);
      expect(components["/sbs1"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "top"])
    })

    cy.log(`change valign2 of sbsg`)
    cy.get("#\\/v2g_input").clear().type("middle{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(34);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(14);
      expect(components["/sbs1"].stateValues.valigns).eqls(["middle", "middle"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "middle"])
    })

    cy.log(`change valign1 of sbs1`)
    cy.get("#\\/v11_input").clear().type("top{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(34);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(14);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["bottom", "middle"])
    })

    cy.log(`change valigns of sbs2`)
    cy.get("#\\/v12_input").clear().type("middle{enter}");
    cy.get("#\\/v22_input").clear().type("bottom{enter}");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbsg"].stateValues.specifiedWidths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.widths).eqls([20, 12]);
      expect(components["/sbsg"].stateValues.specifiedMargins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.margins).eqls([9, 8]);
      expect(components["/sbsg"].stateValues.gapWidth).eq(34);
      expect(components["/sbsg"].stateValues.valigns).eqls(["bottom", "middle"]);
      expect(components["/sbs1"].stateValues.essentialWidths).eqls([undefined, undefined]);
      expect(components["/sbs1"].stateValues.allWidthsSpecified).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.widths).eqls([30, 30]);
      expect(components["/sbs1"].stateValues.essentialMargins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.allMarginsSpecified).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.margins).eqls([6, 7]);
      expect(components["/sbs1"].stateValues.gapWidth).eq(14);
      expect(components["/sbs1"].stateValues.valigns).eqls(["top", "top"]);
      expect(components["/sbs2"].stateValues.essentialWidths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.allWidthsSpecified).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.widths).eqls([22, 25]);
      expect(components["/sbs2"].stateValues.essentialMargins).eqls([undefined, undefined]);
      expect(components["/sbs2"].stateValues.allMarginsSpecified).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.margins).eqls([8, 8]);
      expect(components["/sbs2"].stateValues.gapWidth).eq(21);
      expect(components["/sbs2"].stateValues.valigns).eqls(["middle", "bottom"])
    })


  })

  it('sideBySide with a stack', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="49%" margins="0%">
      <stack>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
      </stack>
      <p>Fringilla ut morbi tincidunt augue interdum velit euismod in. Mattis molestie a iaculis at erat. Pharetra magna ac placerat vestibulum lectus mauris ultrices. Nisl rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Congue quisque egestas diam in arcu cursus euismod quis viverra. Et leo duis ut diam quam nulla porttitor massa. Dolor sit amet consectetur adipiscing elit. Ullamcorper malesuada proin libero nunc consequat interdum varius. Nunc lobortis mattis aliquam faucibus purus. Amet commodo nulla facilisi nullam vehicula. Massa placerat duis ultricies lacus sed turpis.</p>
    </sideBySide>
    
  
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/sbs"].stateValues.absoluteMeasurements).eq(false);
      expect(components["/sbs"].stateValues.allWidthsSpecified).eqls([49, 49]);
      expect(components["/sbs"].stateValues.widths).eqls([49, 49]);
      expect(components["/sbs"].stateValues.allMarginsSpecified).eqls([0, 0]);
      expect(components["/sbs"].stateValues.margins).eqls([0, 0]);
      expect(components["/sbs"].stateValues.gapWidth).eq(2);
      expect(components["/sbs"].stateValues.valigns).eqls(["top", "top"]);
    })

  })


})



