import cssesc from 'cssesc';
import { widthsBySize } from '../../../../src/Core/utils/size';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Image Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('image from external source', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" width="300px" description="A giant anteater" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load
    cy.get('#\\/_image1').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', widthsBySize["small"] - 4).and('be.lte', widthsBySize["small"] + 1)
    // cy.get('#\\/_image1').invoke('css', 'height').then((height) => expect(height).eq(undefined))
    cy.get('#\\/_image1').invoke('attr', 'alt').then((alt) => expect(alt).eq("A giant anteater"))
  })

  it('image sizes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="i" />

    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="itiny" size="tiny" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ismall" size="small" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="imedium" size="medium" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ilarge" size="large" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ifull" size="full" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="iinvalid" size="invalid" />

    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia10" width="10" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia100" width="100" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia200" width="200" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia300" width="300" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia400" width="400" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia500" width="500" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia600" width="600" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia700" width="700" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia800" width="800" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia900" width="900" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ia10000" width="10000" />

    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip1" width="1%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip10" width="10%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip20" width="20%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip30" width="30%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip40" width="40%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip50" width="50%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip60" width="60%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip70" width="70%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip80" width="80%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip90" width="90%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip100" width="100%" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ip1000" width="1000%" />

    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ibadwidth" width="bad" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let expectedSizes = {
      i: "medium",
      itiny: "tiny",
      ismall: "small",
      imedium: "medium",
      ilarge: "large",
      ifull: "full",
      iinvalid: "medium",
      ia10: "tiny",
      ia100: "tiny",
      ia200: "small",
      ia300: "small",
      ia400: "medium",
      ia500: "medium",
      ia600: "large",
      ia700: "large",
      ia800: "full",
      ia900: "full",
      ia10000: "full",
      ip1: "tiny",
      ip10: "tiny",
      ip20: "small",
      ip30: "small",
      ip40: "small",
      ip50: "medium",
      ip60: "medium",
      ip70: "large",
      ip80: "large",
      ip90: "full",
      ip100: "full",
      ip1000: "full",
      ibadwidth: "medium",
    }

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let name in expectedSizes) {
        console.log(stateVariables);
        console.log("/" + name)
        expect(stateVariables["/" + name].stateValues.size).eq(expectedSizes[name])
      }

    });

    for (let name in expectedSizes) {
      cy.get(cesc("#/" + name)).invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', widthsBySize[expectedSizes[name]] - 4).and('be.lte', widthsBySize[expectedSizes[name]] + 1)
    }

  });

  it('horizontal align', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="i" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="ileft" horizontalAlign="left" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="iright" horizontalAlign="right" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="icenter" horizontalAlign="center" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="iinvalid" horizontalAlign="invalid" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/i"].stateValues.horizontalAlign).eq("center")
      expect(stateVariables["/ileft"].stateValues.horizontalAlign).eq("left")
      expect(stateVariables["/iright"].stateValues.horizontalAlign).eq("right")
      expect(stateVariables["/icenter"].stateValues.horizontalAlign).eq("center")
      expect(stateVariables["/iinvalid"].stateValues.horizontalAlign).eq("center")

    });

    // TODO: anything to check in the DOM?

  });

  it('displayMode', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="i" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="iinline" displayMode="inline" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="iblock" displayMode="block" />
    <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="iinvalid" displayMode="invalid" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/i"].stateValues.displayMode).eq("block")
      expect(stateVariables["/iinline"].stateValues.displayMode).eq("inline")
      expect(stateVariables["/iblock"].stateValues.displayMode).eq("block")
      expect(stateVariables["/iinvalid"].stateValues.displayMode).eq("block")

    });

    // TODO: anything to check in the DOM?

  });

  it('image in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph >
      <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" width="$width1%" aspectRatio="$aspectRatio1" anchor="$anchorCoords1" name="image1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1"/>
      <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="image2" />
    </graph>
    
    <p name="pAnchor1">Anchor 1 coordinates: $image1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $image2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor1a">Change anchor 1 coordinates a: <mathinput name="anchorCoords1a" bindValueTo="$image1.anchor" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$image2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $image1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $image2.positionFromAnchor</p>
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
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$image2.positionFromAnchor">
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
    <p name="pWidth1">Width 1: $image1.width</p>
    <p name="pWidth2">Width 2: $image2.width</p>
    <p>Change width 1 <mathinput name="width1" prefill="40" /></p>
    <p>Change width 1a <mathinput name="width1a" bindValueTo="$image1.width" /></p>
    <p>Change width 2 <mathinput name="width2" bindValueTo="$image2.width" /></p>
    <p name="pAspectRatio1">Aspect Ratio 1: $image1.aspectRatio</p>
    <p name="pAspectRatio2">Aspect Ratio 2: $image2.AspectRatio</p>
    <p>Change aspect ratio 1 <mathinput name="aspectRatio1" prefill="1" /></p>
    <p>Change aspect ratio 1a <mathinput name="aspectRatio1a" bindValueTo="$image1.aspectRatio" /></p>
    <p>Change aspect ratio 2 <mathinput name="aspectRatio2" bindValueTo="$image2.aspectRatio" /></p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$image2.draggable" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>
    
    <image copySource="image1" name="image1a" />
    <image copySource="image2" name="image2a" />


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(1,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(0,0)')

    cy.get("#\\/pPositionFromAnchor1").should('have.text', 'Position from anchor 1: upperright')
    cy.get("#\\/pPositionFromAnchor2").should('have.text', 'Position from anchor 2: center')
    cy.get("#\\/positionFromAnchor1").should('have.value', '1')
    cy.get("#\\/positionFromAnchor2").should('have.value', '9')
    cy.get("#\\/pWidth1").should('have.text', 'Width 1: 40%')
    cy.get("#\\/pWidth2").should('have.text', 'Width 2: 50%')
    cy.get("#\\/pAspectRatio1").should('have.text', 'Aspect Ratio 1: 1')
    cy.get("#\\/pAspectRatio2").should('have.text', 'Aspect Ratio 2: NaN')
    cy.get("#\\/pDraggable1").should('have.text', 'Draggable 1: true')
    cy.get("#\\/pDraggable2").should('have.text', 'Draggable 2: true')

    cy.get('#\\/image1a').invoke('css', 'width').then(str => parseInt(str)).should('be.closeTo', 255, 2)
    cy.get('#\\/image2a').invoke('css', 'width').then(str => parseInt(str)).should('be.closeTo', 425, 2)
    cy.get('#\\/image1a').invoke('css', 'aspectRatio').then(str => parseInt(str)).should('equal', 1)
    cy.get('#\\/image2a').invoke('css', 'aspectRatio').should('equal', 'auto');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.widthForGraph).eqls({ isAbsolute: true, size: .4 * 20 })
      expect(stateVariables["/image2"].stateValues.widthForGraph).eqls({ isAbsolute: true, size: .5 * 20 })
    });

    cy.log("move images by dragging")

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveImage",
        componentName: "/image1",
        args: { x: -2, y: 3 }
      })
      win.callAction1({
        actionName: "moveImage",
        componentName: "/image2",
        args: { x: 4, y: -5 }
      })
    })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(4,−5)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(−2,3)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(4,−5)')


    cy.log("move images by entering coordinates")

    cy.get('#\\/anchorCoords1 textarea').type("{home}{shift+end}{backspace}(6,7){enter}", { force: true })
    cy.get('#\\/anchorCoords2 textarea').type("{home}{shift+end}{backspace}(8,9){enter}", { force: true })

    cy.get('#\\/pAnchor2 .mjx-mrow').should('contain.text', '(8,9)')

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(6,7)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(8,9)')

    cy.get('#\\/anchorCoords1a textarea').type("{home}{shift+end}{backspace}(7,6){enter}", { force: true })
    cy.get('#\\/pAnchor1 .mjx-mrow').should('contain.text', '(7,6)')
    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(7,6)')


    cy.log('change position from anchor');
    cy.get('#\\/positionFromAnchor1').select("lowerLeft")
    cy.get('#\\/positionFromAnchor2').select("lowerRight")

    cy.get("#\\/pPositionFromAnchor1").should('have.text', 'Position from anchor 1: lowerleft')
    cy.get("#\\/pPositionFromAnchor2").should('have.text', 'Position from anchor 2: lowerright')



    cy.log('make not draggable')

    cy.get('#\\/draggable1').click();
    cy.get('#\\/draggable2').click();
    cy.get("#\\/pDraggable1").should('have.text', 'Draggable 1: false')
    cy.get("#\\/pDraggable2").should('have.text', 'Draggable 2: false')


    cy.log('cannot move images by dragging')
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveImage",
        componentName: "/image1",
        args: { x: -10, y: -9 }
      })
      win.callAction1({
        actionName: "moveImage",
        componentName: "/image2",
        args: { x: -8, y: -7 }
      })
    })

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get("#\\/bi").click();
    cy.get("#\\/b").should('have.text', 'true');

    cy.get('#\\/pAnchor1 .mjx-mrow').eq(0).should('have.text', '(7,6)')
    cy.get('#\\/pAnchor2 .mjx-mrow').eq(0).should('have.text', '(8,9)')


    cy.log("change widths")

    cy.get('#\\/width1 textarea').type("{end}{backspace}{backspace}100{enter}", { force: true })
    cy.get('#\\/width2 textarea').type("{end}{backspace}{backspace}80{enter}", { force: true })

    cy.get("#\\/pWidth1").should('have.text', 'Width 1: 100%')
    cy.get("#\\/pWidth2").should('have.text', 'Width 2: 80%')

    cy.get('#\\/image1a').invoke('css', 'width').then(str => parseInt(str)).should('be.closeTo', 850, 2)
    cy.get('#\\/image2a').invoke('css', 'width').then(str => parseInt(str)).should('be.closeTo', 595, 2)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.widthForGraph).eqls({ isAbsolute: true, size: 20 })
      expect(stateVariables["/image2"].stateValues.widthForGraph).eqls({ isAbsolute: true, size: .8 * 20 })
    });

    cy.get('#\\/width1a textarea').type("{end}{backspace}{enter}", { force: true })
    cy.get("#\\/pWidth1").should('have.text', 'Width 1: 10%')
    cy.get('#\\/image1a').invoke('css', 'width').then(str => parseInt(str)).should('be.closeTo', 70.8, 2)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.widthForGraph).eqls({ isAbsolute: true, size: 2 })
    });

    cy.log('change aspect ratio')

    cy.get('#\\/aspectRatio1 textarea').type("{end}{backspace}2{enter}", { force: true })
    cy.get('#\\/aspectRatio2 textarea').type("1/2{enter}", { force: true })


    cy.get("#\\/pAspectRatio1").should('have.text', 'Aspect Ratio 1: 2')
    cy.get("#\\/pAspectRatio2").should('have.text', 'Aspect Ratio 2: 0.5')
    cy.get('#\\/image1a').invoke('css', 'aspectRatio').then(str => parseFloat(str)).should('equal', 2)
    cy.get('#\\/image2a').invoke('css', 'aspectRatio').then(str => parseFloat(str)).should('equal', 0.5)


    cy.get('#\\/aspectRatio1a textarea').type("{end}{backspace}{enter}", { force: true })
    cy.get('#\\/aspectRatio2 textarea').type("{end}{backspace}{backspace}{backspace}{enter}", { force: true })


    cy.get("#\\/pAspectRatio1").should('have.text', 'Aspect Ratio 1: NaN')
    cy.get("#\\/pAspectRatio2").should('have.text', 'Aspect Ratio 2: NaN')
    cy.get('#\\/image1a').invoke('css', 'aspectRatio').should('equal', 'auto');
    cy.get('#\\/image2a').invoke('css', 'aspectRatio').should('equal', 'auto');

  });

  it('image in graph, absolute size', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph >
      <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" width="$width1" aspectRatio="$aspectRatio1" name="image1" />
    </graph>
    
    <p name="pWidth1">Width 1: $image1.width</p>
    <p>Change width 1 <mathinput name="width1" prefill="5" /></p>
    <p>Change width 1a <mathinput name="width1a" bindValueTo="$image1.width" /></p>
    <p name="pAspectRatio1">Aspect Ratio 1: $image1.aspectRatio</p>
    <p>Change aspect ratio 1 <mathinput name="aspectRatio1" prefill="1" /></p>
    <p>Change aspect ratio 1a <mathinput name="aspectRatio1a" bindValueTo="$image1.aspectRatio" /></p>
    
    <image copySource="image1" name="image1a" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get("#\\/pWidth1").should('have.text', 'Width 1: 5px')
    cy.get("#\\/pAspectRatio1").should('have.text', 'Aspect Ratio 1: 1')

    cy.get('#\\/image1a').invoke('css', 'width').then(str => parseInt(str)).should('be.closeTo', 70.8, 2)
    cy.get('#\\/image1a').invoke('css', 'aspectRatio').then(str => parseInt(str)).should('equal', 1)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.widthForGraph).eqls({ isAbsolute: true, size: 5 })
    });

    cy.log("change width")

    cy.get('#\\/width1 textarea').type("{end}{backspace}{backspace}10{enter}", { force: true })

    cy.get("#\\/pWidth1").should('have.text', 'Width 1: 10px')

    cy.get('#\\/image1a').invoke('css', 'width').then(str => parseInt(str)).should('be.closeTo', 70.8, 2)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.widthForGraph).eqls({ isAbsolute: true, size: 10 })
    });

    cy.get('#\\/width1a textarea').type("{end}{backspace}{backspace}15{enter}", { force: true })

    cy.get("#\\/pWidth1").should('have.text', 'Width 1: 15px')
    cy.get('#\\/image1a').invoke('css', 'width').then(str => parseInt(str)).should('be.closeTo', 70.8, 2)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.widthForGraph).eqls({ isAbsolute: true, size: 15 })
    });


    cy.log('change aspect ratio')

    cy.get('#\\/aspectRatio1 textarea').type("{end}{backspace}2{enter}", { force: true })

    cy.get("#\\/pAspectRatio1").should('have.text', 'Aspect Ratio 1: 2')
    cy.get('#\\/image1a').invoke('css', 'aspectRatio').then(str => parseFloat(str)).should('equal', 2)

    cy.get('#\\/aspectRatio1a textarea').type("{end}{backspace}{enter}", { force: true })

    cy.get("#\\/pAspectRatio1").should('have.text', 'Aspect Ratio 1: NaN')
    cy.get('#\\/image1a').invoke('css', 'aspectRatio').should('equal', 'auto');

  });

  it('rotate image in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph >
      <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" rotate="$rotate1" name="image1" />
    </graph>
    
    <p name="pRotate1">Rotate 1: $image1.rotate</p>
    <p>Change rotate 1 <mathinput name="rotate1" prefill="pi/4" /></p>
    <p>Change rotate 1a <mathinput name="rotate1a" bindValueTo="$image1.rotate" /></p>

    <image copySource="image1" name="image1a" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // Is there a way to test the rotation of the image in the graph?

    cy.get("#\\/pRotate1").should('contain.text', 'Rotate 1: 0.785')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.rotate).eq(Math.PI / 4)
    });

    cy.log("change rotate")

    cy.get('#\\/rotate1 textarea').type("{end}{shift+home}{backspace}3pi/4{enter}", { force: true })

    cy.get("#\\/pRotate1").should('contain.text', 'Rotate 1: 2.356')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.rotate).eq(3 * Math.PI / 4)
    });

    cy.get('#\\/rotate1a textarea').type("{end}{shift+home}{backspace}-pi{enter}", { force: true })

    cy.get("#\\/pRotate1").should('contain.text', 'Rotate 1: -3.14159')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/image1"].stateValues.rotate).eq(-Math.PI)
    });


  });

})



