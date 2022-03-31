
describe('Component Size Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('width of image from string', () => {

    let widthStrings = [
      "350", "350 px", "350px", "350 pixel", "  350  pixels ",
      "65%", "65 %", "  65   %",
      "8in", "8 inches", "8 inch",
      "100mm", "100millimeters", "100 millimeter",
      "10cm", "10centimeters", "10 centimeter",
      "100pt"
    ]
    let isAbsolutes = [
      true, true, true, true, true,
      false, false, false,
      true, true, true,
      true, true, true,
      true, true, true,
      true,
    ]
    let sizes = [
      350, 350, 350, 350, 350,
      65, 65, 65,
      768, 768, 768,
      377.95296, 377.95296, 377.95296,
      377.95296, 377.95296, 377.95296,
      133.3333333333
    ]

    for (let [ind, widthString] of widthStrings.entries()) {
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
    <document name="doc">
    <p><text>${ind}</text></p>
    <image name="ae" width="${widthString}" source="https://mathinsight.org/media/image/image/giant_anteater.jpg" />
    <p>width: <copy prop="width" target="ae" assignNames="w" /></p>
    <p>width as adapted number: <number name="wNum"><copy prop="width" target="ae" /></number></p>
    <p>width as adapted math: <math name="wMath"><copy prop="width" target="ae" /></math></p>
    <p>width as extracted number: <extract prop="number" assignNames="wExtract"><copy prop="width" target="ae" /></extract></p>
    <p>extracted isAbsolute: <extract prop="isAbsolute" assignNames="absExtract"><copy prop="width" target="ae" /></extract></p>
    </document>
    `}, "*");
      });



      cy.get('#\\/_text1').should('have.text', `${ind}`)


      cy.get('#\\/doc').invoke('width').then(docWidth => {
        let expectedWidthPixels = sizes[ind];
        if (!isAbsolutes[ind]) {
          expectedWidthPixels *= docWidth / 100;
        }

        cy.get('#\\/ae').invoke('width').then(width => {
          expect(Number(width)).closeTo(expectedWidthPixels, 0.1)
        })

      })

      let thisWidth = sizes[ind];
      let thisUnit;
      if (isAbsolutes[ind]) {
        thisUnit = "px"
      } else {
        thisUnit = "%";
      }

      cy.get('#\\/w').invoke('text').then(text => {
        expect(parseFloat(text)).closeTo(thisWidth, 1E-6);
        expect(text.slice(text.length - thisUnit.length)).eq(thisUnit)
      })
      cy.get('#\\/wNum').invoke('text').then(text => {
        expect(Number(text)).closeTo(thisWidth, 1E-6);
      })
      cy.get('#\\/wMath').find('.mjx-mrow').eq(0).invoke('text').then(text => {
        expect(Number(text)).closeTo(thisWidth, 1E-6);
      })
      cy.get('#\\/wExtract').invoke('text').then(text => {
        expect(Number(text)).closeTo(thisWidth, 1E-6);
      })

      cy.get('#\\/absExtract').should('have.text', isAbsolutes[ind].toString());

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/ae'].stateValues.width.size).closeTo(sizes[ind], 1E-6)
        expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(isAbsolutes[ind])

      })

    }


  })

  it('changing absolute width of image', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

<p><mathinput name="wPrescribed" prefill="500" /></p>
<image name="ae" width="$wPrescribed px" source="https://mathinsight.org/media/image/image/giant_anteater.jpg" />

<p>width: <copy prop="width" target="ae" assignNames="w" /></p>
<p>width as adapted number: <number name="wNum"><copy prop="width" target="ae" /></number></p>
<p>width as adapted math: <math name="wMath"><copy prop="width" target="ae" /></math></p>
<p>width as extracted number: <extract prop="number" assignNames="wExtract"><copy prop="width" target="ae" /></extract></p>
<p>extracted isAbsolute: <extract prop="isAbsolute" assignNames="absExtract"><copy prop="width" target="ae" /></extract></p>
<p>Change width 2: <mathinput name="w2" bindValueTo="$(ae{prop='width'})" /></p>
  `}, "*");
    });


    cy.get('#\\/ae').invoke('css', 'width').then(text => {
      expect(parseFloat(text)).closeTo(500, 1);
    })

    cy.get('#\\/w').should('have.text', '500px');
    cy.get('#\\/wNum').should('have.text', '500');
    cy.get('#\\/wMath').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('500');
    })
    cy.get('#\\/wExtract').should('have.text', '500');
    cy.get('#\\/absExtract').should('have.text', "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(500, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(true)
    })

    cy.log(`changed prescribed width`)
    cy.get('#\\/wPrescribed textarea').type("{end}{backspace}{backspace}{backspace}312{enter}", { force: true });


    cy.get('#\\/w').should('have.text', '312px');
    cy.get('#\\/wNum').should('have.text', '312');

    cy.get('#\\/ae').invoke('css', 'width').then(text => {
      expect(parseFloat(text)).closeTo(312, 1);
    })

    cy.get('#\\/wMath').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('312');
    })
    cy.get('#\\/wExtract').should('have.text', '312');
    cy.get('#\\/absExtract').should('have.text', "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(312, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(true)
    })


    cy.log(`changed width from inverse direction`)
    cy.get('#\\/w2 textarea').type("{end}{backspace}{backspace}{backspace}476{enter}", { force: true });

    cy.get('#\\/w').should('have.text', '476px');
    cy.get('#\\/wNum').should('have.text', '476');

    cy.get('#\\/ae').invoke('css', 'width').then(text => {
      expect(parseFloat(text)).closeTo(476, 1);
    })

    cy.get('#\\/wMath').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('476');
    })
    cy.get('#\\/wExtract').should('have.text', '476');
    cy.get('#\\/absExtract').should('have.text', "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(476, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(true)
    })

  })

  it('changing relative width of image', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
<document name="doc">
<p><mathinput name="wPrescribed" prefill="50" /></p>
<image name="ae" width="$wPrescribed %" source="https://mathinsight.org/media/image/image/giant_anteater.jpg" />

<p>width: <copy prop="width" target="ae" assignNames="w" /></p>
<p>width as adapted number: <number name="wNum"><copy prop="width" target="ae" /></number></p>
<p>width as adapted math: <math name="wMath"><copy prop="width" target="ae" /></math></p>
<p>width as extracted number: <extract prop="number" assignNames="wExtract"><copy prop="width" target="ae" /></extract></p>
<p>extracted isAbsolute: <extract prop="isAbsolute" assignNames="absExtract"><copy prop="width" target="ae" /></extract></p>
<p>Change width 2: <mathinput name="w2" bindValueTo="$(ae{prop='width'})" /></p>
</document>
  `}, "*");
    });


    cy.get('#\\/doc').invoke('width').then(docWidth => {
      let expectedWidthPixels = 50 * docWidth / 100;
      cy.get('#\\/ae').invoke('width').then(width => {
        expect(Number(width)).closeTo(expectedWidthPixels, 0.1)
      })
    })

    cy.get('#\\/w').should('have.text', '50%');
    cy.get('#\\/wNum').should('have.text', '50');
    cy.get('#\\/wMath').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('50');
    })
    cy.get('#\\/wExtract').should('have.text', '50');
    cy.get('#\\/absExtract').should('have.text', "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(50, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(false)
    })

    cy.log(`changed prescribed width`)
    cy.get('#\\/wPrescribed textarea').type("{end}{backspace}{backspace}{backspace}31{enter}", { force: true });

    cy.get('#\\/w').should('have.text', '31%');
    cy.get('#\\/wNum').should('have.text', '31');

    cy.get('#\\/doc').invoke('width').then(docWidth => {
      let expectedWidthPixels = 31 * docWidth / 100;
      cy.get('#\\/ae').invoke('width').then(width => {
        expect(Number(width)).closeTo(expectedWidthPixels, 0.1)
      })
    })

    cy.get('#\\/wMath').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('31');
    })
    cy.get('#\\/wExtract').should('have.text', '31');
    cy.get('#\\/absExtract').should('have.text', "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(31, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(false)
    })


    cy.log(`changed width from inverse direction`)
    cy.get('#\\/w2 textarea').type("{end}{backspace}{backspace}76{enter}", { force: true });

    cy.get('#\\/w').should('have.text', '76%');
    cy.get('#\\/wNum').should('have.text', '76');

    cy.get('#\\/doc').invoke('width').then(docWidth => {
      let expectedWidthPixels = 76 * docWidth / 100;
      cy.get('#\\/ae').invoke('width').then(width => {
        expect(Number(width)).closeTo(expectedWidthPixels, 0.1)
      })
    })

    cy.get('#\\/wMath').find('.mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('76');
    })
    cy.get('#\\/wExtract').should('have.text', '76');
    cy.get('#\\/absExtract').should('have.text', "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(76, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(false)
    })

  })

  it('height of image depends on width', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
<p><mathinput name="wPrescribed" prefill="500" /></p>
<image name="ae" width="$wPrescribed px" height="$(ae{prop='width'})/2" source="https://mathinsight.org/media/image/image/giant_anteater.jpg" />

<p>width: <copy prop="width" target="ae" assignNames="w" /></p>
<p>height: <copy prop="height" target="ae" assignNames="h" /></p>
<p>Change width 2: <mathinput name="w2" bindValueTo="$(ae{prop='width'})" /></p>
<p>Change height 2: <mathinput name="h2" bindValueTo="$(ae{prop='height'})" /></p>
  `}, "*");
    });


    cy.get('#\\/ae').invoke('css', 'width').then(text => {
      expect(parseFloat(text)).closeTo(500, 1);
    })
    cy.get('#\\/ae').invoke('css', 'height').then(text => {
      expect(parseFloat(text)).closeTo(250, 1);
    })

    cy.get('#\\/w').should('have.text', '500px');
    cy.get('#\\/h').should('have.text', '250px');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(500, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(true)
      expect(stateVariables['/ae'].stateValues.height.size).closeTo(250, 1E-6)
      expect(stateVariables['/ae'].stateValues.height.isAbsolute).eq(true)
    })

    cy.log(`changed prescribed width`)
    cy.get('#\\/wPrescribed textarea').type("{end}{backspace}{backspace}{backspace}{backspace}312{enter}", { force: true });

    cy.get('#\\/w').should('have.text', '312px');
    cy.get('#\\/h').should('have.text', '156px');

    cy.get('#\\/ae').invoke('css', 'width').then(text => {
      expect(parseFloat(text)).closeTo(312, 1);
    })
    cy.get('#\\/ae').invoke('css', 'height').then(text => {
      expect(parseFloat(text)).closeTo(156, 1);
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(312, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(true)
      expect(stateVariables['/ae'].stateValues.height.size).closeTo(156, 1E-6)
      expect(stateVariables['/ae'].stateValues.height.isAbsolute).eq(true)
    })

    cy.log(`changed width from inverse direction`)
    cy.get('#\\/w2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}476{enter}", { force: true });

    cy.get('#\\/w').should('have.text', '476px');
    cy.get('#\\/h').should('have.text', '238px');

    cy.get('#\\/ae').invoke('css', 'width').then(text => {
      expect(parseFloat(text)).closeTo(476, 1);
    })
    cy.get('#\\/ae').invoke('css', 'height').then(text => {
      expect(parseFloat(text)).closeTo(238, 1);
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(476, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(true)
      expect(stateVariables['/ae'].stateValues.height.size).closeTo(238, 1E-6)
      expect(stateVariables['/ae'].stateValues.height.isAbsolute).eq(true)
    })

    cy.log(`changed height from inverse direction`)
    cy.get('#\\/h2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}321{enter}", { force: true });

    cy.get('#\\/w').should('have.text', '642px');
    cy.get('#\\/h').should('have.text', '321px');

    cy.get('#\\/ae').invoke('css', 'width').then(text => {
      expect(parseFloat(text)).closeTo(642, 1);
    })
    cy.get('#\\/ae').invoke('css', 'height').then(text => {
      expect(parseFloat(text)).closeTo(321, 1);
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/ae'].stateValues.width.size).closeTo(642, 1E-6)
      expect(stateVariables['/ae'].stateValues.width.isAbsolute).eq(true)
      expect(stateVariables['/ae'].stateValues.height.size).closeTo(321, 1E-6)
      expect(stateVariables['/ae'].stateValues.height.isAbsolute).eq(true)
    })

  })

})
