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
    cy.get('#\\/_image1').invoke('attr', 'alt').then((alt) => expect(alt).eq("A giant anteater" ))
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

})



