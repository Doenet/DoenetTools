
describe('SubsetOfReals Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })


  it("single intervals", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals name="o1">(4,5)</subsetOfReals></p>
  <p><subsetOfReals name="o2">(5,4)</subsetOfReals></p>
  <p><subsetOfReals name="o3">(5,5)</subsetOfReals></p>
  <p><subsetOfReals name="o4">(4,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="o5">(4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals name="o6">(-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals name="o7">(infinity,5)</subsetOfReals></p>
  <p><subsetOfReals name="o8">(-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="o9">(a,b)</subsetOfReals></p>

  <p><subsetOfReals name="c1">[4,5]</subsetOfReals></p>
  <p><subsetOfReals name="c2">[5,4]</subsetOfReals></p>
  <p><subsetOfReals name="c3">[5,5]</subsetOfReals></p>
  <p><subsetOfReals name="c4">[4,infinity]</subsetOfReals></p>
  <p><subsetOfReals name="c5">[4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals name="c6">[-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals name="c7">[infinity,5]</subsetOfReals></p>
  <p><subsetOfReals name="c8">[-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals name="c9">[a,b]</subsetOfReals></p>

  <p><subsetOfReals name="oc1">(4,5]</subsetOfReals></p>
  <p><subsetOfReals name="oc2">(5,4]</subsetOfReals></p>
  <p><subsetOfReals name="oc3">(5,5]</subsetOfReals></p>
  <p><subsetOfReals name="oc4">(4,infinity]</subsetOfReals></p>
  <p><subsetOfReals name="oc5">(4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals name="oc6">(-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals name="oc7">(infinity,5]</subsetOfReals></p>
  <p><subsetOfReals name="oc8">(-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals name="oc9">(a,b]</subsetOfReals></p>

  <p><subsetOfReals name="co1">[4,5)</subsetOfReals></p>
  <p><subsetOfReals name="co2">[5,4)</subsetOfReals></p>
  <p><subsetOfReals name="co3">[5,5)</subsetOfReals></p>
  <p><subsetOfReals name="co4">[4,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="co5">[4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals name="co6">[-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals name="co7">[infinity,5)</subsetOfReals></p>
  <p><subsetOfReals name="co8">[-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="co9">[a,b)</subsetOfReals></p>



  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/o1 .mjx-mrow').eq(0).should('have.text', "(4,5)")
    cy.get('#\\/o2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o4 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/o5 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o6 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/o7 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o8 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/c1 .mjx-mrow').eq(0).should('have.text', "[4,5]")
    cy.get('#\\/c2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c3 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/c4 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/c5 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c6 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/c7 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c8 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/c9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/oc1 .mjx-mrow').eq(0).should('have.text', "(4,5]")
    cy.get('#\\/oc2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc4 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/oc5 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc6 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/oc7 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc8 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/oc9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/co1 .mjx-mrow').eq(0).should('have.text', "[4,5)")
    cy.get('#\\/co2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co4 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/co5 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co6 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/co7 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co8 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/co9 .mjx-mrow').eq(0).should('have.text', "＿")

  })

  it("single intervals, display as inequality", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals displayMode="inequalities" name="o1">(4,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o2">(5,4)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o3">(5,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o4">(4,infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o5">(4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o6">(-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o7">(infinity,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o8">(-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="o9">(a,b)</subsetOfReals></p>

  <p><subsetOfReals displayMode="inequalities" name="c1">[4,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c2">[5,4]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c3">[5,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c4">[4,infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c5">[4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c6">[-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c7">[infinity,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c8">[-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="c9">[a,b]</subsetOfReals></p>

  <p><subsetOfReals displayMode="inequalities" name="oc1">(4,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc2">(5,4]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc3">(5,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc4">(4,infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc5">(4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc6">(-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc7">(infinity,5]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc8">(-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="oc9">(a,b]</subsetOfReals></p>

  <p><subsetOfReals displayMode="inequalities" name="co1">[4,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co2">[5,4)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co3">[5,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co4">[4,infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co5">[4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co6">[-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co7">[infinity,5)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co8">[-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals displayMode="inequalities" name="co9">[a,b)</subsetOfReals></p>



  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/o1 .mjx-mrow').eq(0).should('have.text', "4<x<5")
    cy.get('#\\/o2 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/o3 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/o4 .mjx-mrow').eq(0).should('have.text', "x>4")
    cy.get('#\\/o5 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/o6 .mjx-mrow').eq(0).should('have.text', "x<5")
    cy.get('#\\/o7 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/o8 .mjx-mrow').eq(0).should('have.text', "x∈R")
    cy.get('#\\/o9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/c1 .mjx-mrow').eq(0).should('have.text', "4≤x≤5")
    cy.get('#\\/c2 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/c3 .mjx-mrow').eq(0).should('have.text', "x=5")
    cy.get('#\\/c4 .mjx-mrow').eq(0).should('have.text', "x≥4")
    cy.get('#\\/c5 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/c6 .mjx-mrow').eq(0).should('have.text', "x≤5")
    cy.get('#\\/c7 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/c8 .mjx-mrow').eq(0).should('have.text', "x∈R")
    cy.get('#\\/c9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/oc1 .mjx-mrow').eq(0).should('have.text', "4<x≤5")
    cy.get('#\\/oc2 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/oc3 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/oc4 .mjx-mrow').eq(0).should('have.text', "x>4")
    cy.get('#\\/oc5 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/oc6 .mjx-mrow').eq(0).should('have.text', "x≤5")
    cy.get('#\\/oc7 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/oc8 .mjx-mrow').eq(0).should('have.text', "x∈R")
    cy.get('#\\/oc9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/co1 .mjx-mrow').eq(0).should('have.text', "4≤x<5")
    cy.get('#\\/co2 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/co3 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/co4 .mjx-mrow').eq(0).should('have.text', "x≥4")
    cy.get('#\\/co5 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/co6 .mjx-mrow').eq(0).should('have.text', "x<5")
    cy.get('#\\/co7 .mjx-mrow').eq(0).should('have.text', "x∈∅")
    cy.get('#\\/co8 .mjx-mrow').eq(0).should('have.text', "x∈R")
    cy.get('#\\/co9 .mjx-mrow').eq(0).should('have.text', "＿")

  })

  it("single intervals, display as inequality, change variable", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o1">(4,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o2">(5,4)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o3">(5,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o4">(4,infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o5">(4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o6">(-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o7">(infinity,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o8">(-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="o9">(a,b)</subsetOfReals></p>

  <p><subsetOfReals variable="v" displayMode="inequalities" name="c1">[4,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c2">[5,4]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c3">[5,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c4">[4,infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c5">[4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c6">[-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c7">[infinity,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c8">[-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="c9">[a,b]</subsetOfReals></p>

  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc1">(4,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc2">(5,4]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc3">(5,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc4">(4,infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc5">(4,-infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc6">(-infinity,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc7">(infinity,5]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc8">(-infinity,infinity]</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="oc9">(a,b]</subsetOfReals></p>

  <p><subsetOfReals variable="v" displayMode="inequalities" name="co1">[4,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co2">[5,4)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co3">[5,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co4">[4,infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co5">[4,-infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co6">[-infinity,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co7">[infinity,5)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co8">[-infinity,infinity)</subsetOfReals></p>
  <p><subsetOfReals variable="v" displayMode="inequalities" name="co9">[a,b)</subsetOfReals></p>



  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/o1 .mjx-mrow').eq(0).should('have.text', "4<v<5")
    cy.get('#\\/o2 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/o3 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/o4 .mjx-mrow').eq(0).should('have.text', "v>4")
    cy.get('#\\/o5 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/o6 .mjx-mrow').eq(0).should('have.text', "v<5")
    cy.get('#\\/o7 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/o8 .mjx-mrow').eq(0).should('have.text', "v∈R")
    cy.get('#\\/o9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/c1 .mjx-mrow').eq(0).should('have.text', "4≤v≤5")
    cy.get('#\\/c2 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/c3 .mjx-mrow').eq(0).should('have.text', "v=5")
    cy.get('#\\/c4 .mjx-mrow').eq(0).should('have.text', "v≥4")
    cy.get('#\\/c5 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/c6 .mjx-mrow').eq(0).should('have.text', "v≤5")
    cy.get('#\\/c7 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/c8 .mjx-mrow').eq(0).should('have.text', "v∈R")
    cy.get('#\\/c9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/oc1 .mjx-mrow').eq(0).should('have.text', "4<v≤5")
    cy.get('#\\/oc2 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/oc3 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/oc4 .mjx-mrow').eq(0).should('have.text', "v>4")
    cy.get('#\\/oc5 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/oc6 .mjx-mrow').eq(0).should('have.text', "v≤5")
    cy.get('#\\/oc7 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/oc8 .mjx-mrow').eq(0).should('have.text', "v∈R")
    cy.get('#\\/oc9 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/co1 .mjx-mrow').eq(0).should('have.text', "4≤v<5")
    cy.get('#\\/co2 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/co3 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/co4 .mjx-mrow').eq(0).should('have.text', "v≥4")
    cy.get('#\\/co5 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/co6 .mjx-mrow').eq(0).should('have.text', "v<5")
    cy.get('#\\/co7 .mjx-mrow').eq(0).should('have.text', "v∈∅")
    cy.get('#\\/co8 .mjx-mrow').eq(0).should('have.text', "v∈R")
    cy.get('#\\/co9 .mjx-mrow').eq(0).should('have.text', "＿")

  })

  it("single inequality", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals name="o1">4 < x < 5</subsetOfReals></p>
  <p><subsetOfReals name="o2">5 < x < 4</subsetOfReals></p>
  <p><subsetOfReals name="o3">5 < x < 5</subsetOfReals></p>
  <p><subsetOfReals name="o4">x > 4</subsetOfReals></p>
  <p><subsetOfReals name="o5">infinity > x > 4</subsetOfReals></p>
  <p><subsetOfReals name="o6">x > infinity</subsetOfReals></p>
  <p><subsetOfReals name="o7">x < 5</subsetOfReals></p>
  <p><subsetOfReals name="o8">-infinity < x < 5</subsetOfReals></p>
  <p><subsetOfReals name="o9">x < -infinity</subsetOfReals></p>
  <p><subsetOfReals name="o10">-infinity < x < infinity</subsetOfReals></p>
  <p><subsetOfReals name="o11">x < a</subsetOfReals></p>

  <p><subsetOfReals name="c1">4 <= x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="c2">5 <= x <= 4</subsetOfReals></p>
  <p><subsetOfReals name="c3">5 <= x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="c4">x >= 4</subsetOfReals></p>
  <p><subsetOfReals name="c5">infinity >= x >= 4</subsetOfReals></p>
  <p><subsetOfReals name="c6">x >= infinity</subsetOfReals></p>
  <p><subsetOfReals name="c7">x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="c8">-infinity <= x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="c9">x <= -infinity</subsetOfReals></p>
  <p><subsetOfReals name="c10">-infinity <= x <= infinity</subsetOfReals></p>
  <p><subsetOfReals name="c11">x <= a</subsetOfReals></p>

  <p><subsetOfReals name="oc1">4 < x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="oc2">5 < x <= 4</subsetOfReals></p>
  <p><subsetOfReals name="oc3">5 < x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="oc4">x > 4</subsetOfReals></p>
  <p><subsetOfReals name="oc5">infinity >= x > 4</subsetOfReals></p>
  <p><subsetOfReals name="oc6">x > infinity</subsetOfReals></p>
  <p><subsetOfReals name="oc7">x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="oc8">-infinity < x <= 5</subsetOfReals></p>
  <p><subsetOfReals name="oc9">x <= -infinity</subsetOfReals></p>
  <p><subsetOfReals name="oc10">-infinity < x <= infinity</subsetOfReals></p>
  <p><subsetOfReals name="oc11">x <= a</subsetOfReals></p>

  <p><subsetOfReals name="co1">4 <= x < 5</subsetOfReals></p>
  <p><subsetOfReals name="co2">5 <= x < 4</subsetOfReals></p>
  <p><subsetOfReals name="co3">5 <= x < 5</subsetOfReals></p>
  <p><subsetOfReals name="co4">x >= 4</subsetOfReals></p>
  <p><subsetOfReals name="co5">infinity > x >= 4</subsetOfReals></p>
  <p><subsetOfReals name="co6">x >= infinity</subsetOfReals></p>
  <p><subsetOfReals name="co7">x < 5</subsetOfReals></p>
  <p><subsetOfReals name="co8">-infinity <= x < 5</subsetOfReals></p>
  <p><subsetOfReals name="co9">x < -infinity</subsetOfReals></p>
  <p><subsetOfReals name="co10">-infinity <= x < infinity</subsetOfReals></p>
  <p><subsetOfReals name="co11">x < a</subsetOfReals></p>


  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/o1 .mjx-mrow').eq(0).should('have.text', "(4,5)")
    cy.get('#\\/o2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o4 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/o5 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/o6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o7 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/o8 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/o9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/c1 .mjx-mrow').eq(0).should('have.text', "[4,5]")
    cy.get('#\\/c2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c3 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/c4 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/c5 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/c6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c7 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/c8 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/c9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/c11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/oc1 .mjx-mrow').eq(0).should('have.text', "(4,5]")
    cy.get('#\\/oc2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc4 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/oc5 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/oc6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc7 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/oc8 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/oc9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/oc11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/co1 .mjx-mrow').eq(0).should('have.text', "[4,5)")
    cy.get('#\\/co2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co4 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/co5 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/co6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co7 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/co8 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/co9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/co11 .mjx-mrow').eq(0).should('have.text', "＿")

  })

  it("single inequality, change variable", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals variable="q" name="o1">4 < q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o2">5 < q < 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o3">5 < q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o4">q > 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o5">infinity > q > 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o6">q > infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o7">q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o8">-infinity < q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o9">q < -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o10">-infinity < q < infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="o11">q < a</subsetOfReals></p>

  <p><subsetOfReals variable="q" name="c1">4 <= q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c2">5 <= q <= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c3">5 <= q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c4">q >= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c5">infinity >= q >= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c6">q >= infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c7">q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c8">-infinity <= q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c9">q <= -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c10">-infinity <= q <= infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="c11">q <= a</subsetOfReals></p>

  <p><subsetOfReals variable="q" name="oc1">4 < q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc2">5 < q <= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc3">5 < q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc4">q > 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc5">infinity >= q > 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc6">q > infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc7">q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc8">-infinity < q <= 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc9">q <= -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc10">-infinity < q <= infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="oc11">q <= a</subsetOfReals></p>

  <p><subsetOfReals variable="q" name="co1">4 <= q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co2">5 <= q < 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co3">5 <= q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co4">q >= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co5">infinity > q >= 4</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co6">q >= infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co7">q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co8">-infinity <= q < 5</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co9">q < -infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co10">-infinity <= q < infinity</subsetOfReals></p>
  <p><subsetOfReals variable="q" name="co11">q < a</subsetOfReals></p>


  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/o1 .mjx-mrow').eq(0).should('have.text', "(4,5)")
    cy.get('#\\/o2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o4 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/o5 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/o6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o7 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/o8 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/o9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/c1 .mjx-mrow').eq(0).should('have.text', "[4,5]")
    cy.get('#\\/c2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c3 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/c4 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/c5 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/c6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c7 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/c8 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/c9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/c11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/oc1 .mjx-mrow').eq(0).should('have.text', "(4,5]")
    cy.get('#\\/oc2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc4 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/oc5 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/oc6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc7 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/oc8 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/oc9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/oc11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/co1 .mjx-mrow').eq(0).should('have.text', "[4,5)")
    cy.get('#\\/co2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co4 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/co5 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/co6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co7 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/co8 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/co9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/co11 .mjx-mrow').eq(0).should('have.text', "＿")

  })

  it("single equality", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals name="e1">x=5</subsetOfReals></p>
  <p><subsetOfReals name="e2">x=infinity</subsetOfReals></p>
  <p><subsetOfReals name="e3">x=-infinity</subsetOfReals></p>
  <p><subsetOfReals name="e4">x=a</subsetOfReals></p>


  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/e1 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/e2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/e3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/e4 .mjx-mrow').eq(0).should('have.text', "＿")

  })

  it("single inequality in set notation", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals name="o1">{q | 4 < q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="o2">{q | 5 < q < 4}</subsetOfReals></p>
  <p><subsetOfReals name="o3">{q | 5 < q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="o4">{q | q > 4}</subsetOfReals></p>
  <p><subsetOfReals name="o5">{q | infinity > q > 4}</subsetOfReals></p>
  <p><subsetOfReals name="o6">{q | q > infinity}</subsetOfReals></p>
  <p><subsetOfReals name="o7">{q | q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="o8">{q | -infinity < q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="o9">{q | q < -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="o10">{q | -infinity < q < infinity}</subsetOfReals></p>
  <p><subsetOfReals name="o11">{q | q < a}</subsetOfReals></p>

  <p><subsetOfReals name="c1">{q | 4 <= q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="c2">{q | 5 <= q <= 4}</subsetOfReals></p>
  <p><subsetOfReals name="c3">{q | 5 <= q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="c4">{q | q >= 4}</subsetOfReals></p>
  <p><subsetOfReals name="c5">{q | infinity >= q >= 4}</subsetOfReals></p>
  <p><subsetOfReals name="c6">{q | q >= infinity}</subsetOfReals></p>
  <p><subsetOfReals name="c7">{q | q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="c8">{q | -infinity <= q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="c9">{q | q <= -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="c10">{q | -infinity <= q <= infinity}</subsetOfReals></p>
  <p><subsetOfReals name="c11">{q | q <= a}</subsetOfReals></p>

  <p><subsetOfReals name="oc1">{q | 4 < q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="oc2">{q | 5 < q <= 4}</subsetOfReals></p>
  <p><subsetOfReals name="oc3">{q | 5 < q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="oc4">{q | q > 4}</subsetOfReals></p>
  <p><subsetOfReals name="oc5">{q | infinity >= q > 4}</subsetOfReals></p>
  <p><subsetOfReals name="oc6">{q | q > infinity}</subsetOfReals></p>
  <p><subsetOfReals name="oc7">{q | q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="oc8">{q | -infinity < q <= 5}</subsetOfReals></p>
  <p><subsetOfReals name="oc9">{q | q <= -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="oc10">{q | -infinity < q <= infinity}</subsetOfReals></p>
  <p><subsetOfReals name="oc11">{q | q <= a}</subsetOfReals></p>

  <p><subsetOfReals name="co1">{q | 4 <= q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="co2">{q | 5 <= q < 4}</subsetOfReals></p>
  <p><subsetOfReals name="co3">{q | 5 <= q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="co4">{q | q >= 4}</subsetOfReals></p>
  <p><subsetOfReals name="co5">{q | infinity > q >= 4}</subsetOfReals></p>
  <p><subsetOfReals name="co6">{q | q >= infinity}</subsetOfReals></p>
  <p><subsetOfReals name="co7">{q | q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="co8">{q | -infinity <= q < 5}</subsetOfReals></p>
  <p><subsetOfReals name="co9">{q | q < -infinity}</subsetOfReals></p>
  <p><subsetOfReals name="co10">{q | -infinity <= q < infinity}</subsetOfReals></p>
  <p><subsetOfReals name="co11">{q | q < a}</subsetOfReals></p>


  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/o1 .mjx-mrow').eq(0).should('have.text', "(4,5)")
    cy.get('#\\/o2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o4 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/o5 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/o6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o7 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/o8 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/o9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/o10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/c1 .mjx-mrow').eq(0).should('have.text', "[4,5]")
    cy.get('#\\/c2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c3 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/c4 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/c5 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/c6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c7 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/c8 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/c9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/c10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/c11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/oc1 .mjx-mrow').eq(0).should('have.text', "(4,5]")
    cy.get('#\\/oc2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc4 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/oc5 .mjx-mrow').eq(0).should('have.text', "(4,∞)")
    cy.get('#\\/oc6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc7 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/oc8 .mjx-mrow').eq(0).should('have.text', "(−∞,5]")
    cy.get('#\\/oc9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/oc10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/oc11 .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/co1 .mjx-mrow').eq(0).should('have.text', "[4,5)")
    cy.get('#\\/co2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co4 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/co5 .mjx-mrow').eq(0).should('have.text', "[4,∞)")
    cy.get('#\\/co6 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co7 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/co8 .mjx-mrow').eq(0).should('have.text', "(−∞,5)")
    cy.get('#\\/co9 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/co10 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/co11 .mjx-mrow').eq(0).should('have.text', "＿")

  })

  it("union and intersections of intervals and singletons", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals name="u1">(4,5) union (6,7)</subsetOfReals></p>
  <p><subsetOfReals name="u2">(4,5) union (5,6)</subsetOfReals></p>
  <p><subsetOfReals name="u3">(4,5] union (5,6]</subsetOfReals></p>
  <p><subsetOfReals name="u4">(4,5] union [5,6]</subsetOfReals></p>
  <p><subsetOfReals name="u5">(4,6) union (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="u6">(4,8) union (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="u7">(4,7) union (5,7]</subsetOfReals></p>
  <p><subsetOfReals name="u8">(4,6) union {4}</subsetOfReals></p>
  <p><subsetOfReals name="u9">(4,6) union {5}</subsetOfReals></p>
  <p><subsetOfReals name="u10">(4,6) union {6}</subsetOfReals></p>
  <p><subsetOfReals name="u11">(4,6) union {7}</subsetOfReals></p>
  <p><subsetOfReals name="u12">(4,5) union (5,6) union {5}</subsetOfReals></p>
  <p><subsetOfReals name="u13">(-infinity,5) union (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u14">(-infinity,5) union [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u15">(-infinity,5] union (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u16">(-infinity,5] union [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u17">(-infinity,5) union (9,infinity) union (4,10)</subsetOfReals></p>

  <p><subsetOfReals name="i1">(4,5) intersect (6,7)</subsetOfReals></p>
  <p><subsetOfReals name="i2">(4,5) intersect (5,6)</subsetOfReals></p>
  <p><subsetOfReals name="i3">(4,5] intersect (5,6]</subsetOfReals></p>
  <p><subsetOfReals name="i4">(4,5] intersect [5,6]</subsetOfReals></p>
  <p><subsetOfReals name="i5">(4,6) intersect (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="i6">(4,8) intersect (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="i7">(4,7) intersect (5,7]</subsetOfReals></p>
  <p><subsetOfReals name="i8">(4,6) intersect {4}</subsetOfReals></p>
  <p><subsetOfReals name="i9">(4,6) intersect {5}</subsetOfReals></p>
  <p><subsetOfReals name="i10">(4,6) intersect {6}</subsetOfReals></p>
  <p><subsetOfReals name="i11">(4,6) intersect {7}</subsetOfReals></p>
  <p><subsetOfReals name="i12">(4,5) intersect (5,6) intersect {5}</subsetOfReals></p>
  <p><subsetOfReals name="i13">(-infinity,5) intersect (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i14">(-infinity,5) intersect [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i15">(-infinity,5] intersect (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i16">(-infinity,5] intersect [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i17">(-infinity,5) intersect (9,infinity) intersect (4,10)</subsetOfReals></p>


  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/u1 .mjx-mrow').eq(0).should('have.text', "(4,5)∪(6,7)")
    cy.get('#\\/u2 .mjx-mrow').eq(0).should('have.text', "(4,5)∪(5,6)")
    cy.get('#\\/u3 .mjx-mrow').eq(0).should('have.text', "(4,6)")
    cy.get('#\\/u4 .mjx-mrow').eq(0).should('have.text', "(4,6]")
    cy.get('#\\/u5 .mjx-mrow').eq(0).should('have.text', "(4,7)")
    cy.get('#\\/u6 .mjx-mrow').eq(0).should('have.text', "(4,8)")
    cy.get('#\\/u7 .mjx-mrow').eq(0).should('have.text', "(4,7]")
    cy.get('#\\/u8 .mjx-mrow').eq(0).should('have.text', "[4,6)")
    cy.get('#\\/u9 .mjx-mrow').eq(0).should('have.text', "(4,6)")
    cy.get('#\\/u10 .mjx-mrow').eq(0).should('have.text', "(4,6]")
    cy.get('#\\/u11 .mjx-mrow').eq(0).should('have.text', "(4,6)∪{7}")
    cy.get('#\\/u12 .mjx-mrow').eq(0).should('have.text', "(4,6)")
    cy.get('#\\/u13 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/u14 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/u15 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/u16 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/u17 .mjx-mrow').eq(0).should('have.text', "R")

    cy.get('#\\/i1 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/i2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/i3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/i4 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/i5 .mjx-mrow').eq(0).should('have.text', "(5,6)")
    cy.get('#\\/i6 .mjx-mrow').eq(0).should('have.text', "(5,7)")
    cy.get('#\\/i7 .mjx-mrow').eq(0).should('have.text', "(5,7)")
    cy.get('#\\/i8 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/i9 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/i10 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/i11 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/i12 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/i13 .mjx-mrow').eq(0).should('have.text', "(2,5)")
    cy.get('#\\/i14 .mjx-mrow').eq(0).should('have.text', "[2,5)")
    cy.get('#\\/i15 .mjx-mrow').eq(0).should('have.text', "(2,5]")
    cy.get('#\\/i16 .mjx-mrow').eq(0).should('have.text', "[2,5]")
    cy.get('#\\/i17 .mjx-mrow').eq(0).should('have.text', "∅")


  })

  it("ands and ors with inequalities", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals name="o1">(4 < x < 5) or (6 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="o2">(4 < x < 5) or (5 < x < 6)</subsetOfReals></p>
  <p><subsetOfReals name="o3">(4 < x <= 5) or (5 < x <= 6)</subsetOfReals></p>
  <p><subsetOfReals name="o4">(4 < x <= 5) or (5 <= x <= 6)</subsetOfReals></p>
  <p><subsetOfReals name="o5">(4 < x < 6) or (5 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="o6">(4 < x < 8) or (5 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="o7">(4 < x < 7) or (5 < x <= 7)</subsetOfReals></p>
  <p><subsetOfReals name="o8">(4 < x < 6) or (x = 4)</subsetOfReals></p>
  <p><subsetOfReals name="o9">(4 < x < 6) or (x = 5)</subsetOfReals></p>
  <p><subsetOfReals name="o10">(4 < x < 6) or (x = 6)</subsetOfReals></p>
  <p><subsetOfReals name="o11">(4 < x < 6) or (x = 7)</subsetOfReals></p>
  <p><subsetOfReals name="o12">(4 < x < 5) or (5 < x < 6) or (x = 5)</subsetOfReals></p>
  <p><subsetOfReals name="o13">(x < 5) or (x > 2)</subsetOfReals></p>
  <p><subsetOfReals name="o14">(x < 5) or (x >= 2)</subsetOfReals></p>
  <p><subsetOfReals name="o15">(x <= 5) or (x > 2)</subsetOfReals></p>
  <p><subsetOfReals name="o16">(x <= 5) or (x >= 2)</subsetOfReals></p>
  <p><subsetOfReals name="o17">(x < 5) or (x > 9) or (4 < x < 10)</subsetOfReals></p>
  <p><subsetOfReals name="o18">(x != 5) or (4 < x < 10)</subsetOfReals></p>

  <p><subsetOfReals name="a1">(4 < x < 5) and (6 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="a2">(4 < x < 5) and (5 < x < 6)</subsetOfReals></p>
  <p><subsetOfReals name="a3">(4 < x <= 5) and (5 < x <= 6)</subsetOfReals></p>
  <p><subsetOfReals name="a4">(4 < x <= 5) and (5 <= x <= 6)</subsetOfReals></p>
  <p><subsetOfReals name="a5">(4 < x < 6) and (5 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="a6">(4 < x < 8) and (5 < x < 7)</subsetOfReals></p>
  <p><subsetOfReals name="a7">(4 < x < 7) and (5 < x <= 7)</subsetOfReals></p>
  <p><subsetOfReals name="a8">(4 < x < 6) and (x = 4)</subsetOfReals></p>
  <p><subsetOfReals name="a9">(4 < x < 6) and (x = 5)</subsetOfReals></p>
  <p><subsetOfReals name="a10">(4 < x < 6) and (x = 6)</subsetOfReals></p>
  <p><subsetOfReals name="a11">(4 < x < 6) and (x = 7)</subsetOfReals></p>
  <p><subsetOfReals name="a12">(4 < x < 5) and (5 < x < 6) and (x = 5)</subsetOfReals></p>
  <p><subsetOfReals name="a13">(x < 5) and (x > 2)</subsetOfReals></p>
  <p><subsetOfReals name="a14">(x < 5) and (x >= 2)</subsetOfReals></p>
  <p><subsetOfReals name="a15">(x <= 5) and (x > 2)</subsetOfReals></p>
  <p><subsetOfReals name="a16">(x <= 5) and (x >= 2)</subsetOfReals></p>
  <p><subsetOfReals name="a17">(x < 5) and (x > 9) and (4 < x < 10)</subsetOfReals></p>
  <p><subsetOfReals name="a18">(x != 5) and (4 < x < 10)</subsetOfReals></p>


  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/o1 .mjx-mrow').eq(0).should('have.text', "(4,5)∪(6,7)")
    cy.get('#\\/o2 .mjx-mrow').eq(0).should('have.text', "(4,5)∪(5,6)")
    cy.get('#\\/o3 .mjx-mrow').eq(0).should('have.text', "(4,6)")
    cy.get('#\\/o4 .mjx-mrow').eq(0).should('have.text', "(4,6]")
    cy.get('#\\/o5 .mjx-mrow').eq(0).should('have.text', "(4,7)")
    cy.get('#\\/o6 .mjx-mrow').eq(0).should('have.text', "(4,8)")
    cy.get('#\\/o7 .mjx-mrow').eq(0).should('have.text', "(4,7]")
    cy.get('#\\/o8 .mjx-mrow').eq(0).should('have.text', "[4,6)")
    cy.get('#\\/o9 .mjx-mrow').eq(0).should('have.text', "(4,6)")
    cy.get('#\\/o10 .mjx-mrow').eq(0).should('have.text', "(4,6]")
    cy.get('#\\/o11 .mjx-mrow').eq(0).should('have.text', "(4,6)∪{7}")
    cy.get('#\\/o12 .mjx-mrow').eq(0).should('have.text', "(4,6)")
    cy.get('#\\/o13 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o14 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o15 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o16 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o17 .mjx-mrow').eq(0).should('have.text', "R")
    cy.get('#\\/o18 .mjx-mrow').eq(0).should('have.text', "R")

    cy.get('#\\/a1 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/a2 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/a3 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/a4 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/a5 .mjx-mrow').eq(0).should('have.text', "(5,6)")
    cy.get('#\\/a6 .mjx-mrow').eq(0).should('have.text', "(5,7)")
    cy.get('#\\/a7 .mjx-mrow').eq(0).should('have.text', "(5,7)")
    cy.get('#\\/a8 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/a9 .mjx-mrow').eq(0).should('have.text', "{5}")
    cy.get('#\\/a10 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/a11 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/a12 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/a13 .mjx-mrow').eq(0).should('have.text', "(2,5)")
    cy.get('#\\/a14 .mjx-mrow').eq(0).should('have.text', "[2,5)")
    cy.get('#\\/a15 .mjx-mrow').eq(0).should('have.text', "(2,5]")
    cy.get('#\\/a16 .mjx-mrow').eq(0).should('have.text', "[2,5]")
    cy.get('#\\/a17 .mjx-mrow').eq(0).should('have.text', "∅")
    cy.get('#\\/a18 .mjx-mrow').eq(0).should('have.text', "(4,5)∪(5,10)")


  })

  it("complements of intervals and singletons", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><subsetOfReals name="c1">(4,5)^c</subsetOfReals></p>
  <p><subsetOfReals name="c2">(4,5)^C</subsetOfReals></p>
  <p><subsetOfReals name="c3">(4,5]^c</subsetOfReals></p>
  <p><subsetOfReals name="c4">(4,5]^C</subsetOfReals></p>
  <p><subsetOfReals name="c5">[4,5)^c</subsetOfReals></p>
  <p><subsetOfReals name="c6">[4,5)^C</subsetOfReals></p>
  <p><subsetOfReals name="c7">[4,5]^c</subsetOfReals></p>
  <p><subsetOfReals name="c8">[4,5]^C</subsetOfReals></p>
  <p><subsetOfReals name="c9">{4}^c</subsetOfReals></p>
  <p><subsetOfReals name="c10">{4}^C</subsetOfReals></p>
  <p><subsetOfReals name="c11">((4,5) union (5,6))^c</subsetOfReals></p>
  <p><subsetOfReals name="c12">(4,6)^c or (5,7)^c</subsetOfReals></p>


  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/c1 .mjx-mrow').eq(0).should('have.text', "(−∞,4]∪[5,∞)")
    cy.get('#\\/c2 .mjx-mrow').eq(0).should('have.text', "(−∞,4]∪[5,∞)")
    cy.get('#\\/c3 .mjx-mrow').eq(0).should('have.text', "(−∞,4]∪(5,∞)")
    cy.get('#\\/c4 .mjx-mrow').eq(0).should('have.text', "(−∞,4]∪(5,∞)")
    cy.get('#\\/c5 .mjx-mrow').eq(0).should('have.text', "(−∞,4)∪[5,∞)")
    cy.get('#\\/c6 .mjx-mrow').eq(0).should('have.text', "(−∞,4)∪[5,∞)")
    cy.get('#\\/c7 .mjx-mrow').eq(0).should('have.text', "(−∞,4)∪(5,∞)")
    cy.get('#\\/c8 .mjx-mrow').eq(0).should('have.text', "(−∞,4)∪(5,∞)")
    cy.get('#\\/c9 .mjx-mrow').eq(0).should('have.text', "(−∞,4)∪(4,∞)")
    cy.get('#\\/c10 .mjx-mrow').eq(0).should('have.text', "(−∞,4)∪(4,∞)")
    cy.get('#\\/c11 .mjx-mrow').eq(0).should('have.text', "(−∞,4]∪{5}∪[6,∞)")
    cy.get('#\\/c12 .mjx-mrow').eq(0).should('have.text', "(−∞,5]∪[6,∞)")

  })

  it("dynamic subsets", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Variable: <mathinput name="variable" prefill="x" /></p>
  <p>Input: <mathinput name="input" prefill="x > 1" /></p>
  <p>Display mode:</p>
  <choiceinput name="displayMode" preselectchoice='1'>
    <choice>intervals</choice>
    <choice>inequalities</choice>
  </choiceinput>
  <p>Result: <subsetOfReals name="result" variable="$variable" displayMode="$displayMode">$input</subsetOfReals></p>
  

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "(1,∞)")

    cy.get(`#\\/displayMode_choice${2}_input`).click();
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "x>1")

    cy.get('#\\/variable textarea').type('{end}{backspace}y{enter}', { force: true })
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "＿")

    cy.get('#\\/input textarea').type('{home}{rightArrow}{backspace}y{enter}', { force: true })
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "y>1")

    cy.get(`#\\/displayMode_choice${1}_input`).click();
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "(1,∞)")

    cy.get('#\\/input textarea').type('{end}{leftArrow}{backspace}\\ne{enter}{enter}', { force: true })
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "(−∞,1)∪(1,∞)")

    cy.get('#\\/input textarea').type('{end}{backspace}{backspace}{backspace}(y>1)\\and(y<3){enter}', { force: true })
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "(1,3)")

    cy.get(`#\\/displayMode_choice${2}_input`).click();
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "1<y<3")

    cy.get('#\\/input textarea').type('{end}\\or(y>6){enter}', { force: true })
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "(1<y<3)∨(y>6)")

    cy.get(`#\\/displayMode_choice${1}_input`).click();
    cy.get('#\\/result .mjx-mrow').eq(0).should('have.text', "(1,3)∪(6,∞)")


  })


})




