import { cesc } from "../../../../src/_utils/url";

describe("SubsetOfReals Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("single intervals", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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



  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/o1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc("#\\/o2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/o5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/o7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/c1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,5]");
    cy.get(cesc("#\\/c2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/c4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/c5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/c7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/c9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/oc1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5]");
    cy.get(cesc("#\\/oc2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/oc5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/oc7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/oc9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/co1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,5)");
    cy.get(cesc("#\\/co2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/co5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/co7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/co9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
  });

  it("single intervals, display as inequality", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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



  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/o1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4<x<5");
    cy.get(cesc("#\\/o2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/o3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/o4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x>4");
    cy.get(cesc("#\\/o5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/o6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x<5");
    cy.get(cesc("#\\/o7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/o8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈R");
    cy.get(cesc("#\\/o9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");

    cy.get(cesc("#\\/c1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4≤x≤5");
    cy.get(cesc("#\\/c2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/c3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x=5");
    cy.get(cesc("#\\/c4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x≥4");
    cy.get(cesc("#\\/c5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/c6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x≤5");
    cy.get(cesc("#\\/c7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/c8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈R");
    cy.get(cesc("#\\/c9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");

    cy.get(cesc("#\\/oc1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4<x≤5");
    cy.get(cesc("#\\/oc2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/oc3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/oc4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x>4");
    cy.get(cesc("#\\/oc5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/oc6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x≤5");
    cy.get(cesc("#\\/oc7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/oc8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈R");
    cy.get(cesc("#\\/oc9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");

    cy.get(cesc("#\\/co1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4≤x<5");
    cy.get(cesc("#\\/co2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/co3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/co4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x≥4");
    cy.get(cesc("#\\/co5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/co6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x<5");
    cy.get(cesc("#\\/co7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
    cy.get(cesc("#\\/co8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈R");
    cy.get(cesc("#\\/co9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x∈∅");
  });

  it("single intervals, display as inequality, change variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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



  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/o1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4<v<5");
    cy.get(cesc("#\\/o2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/o3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/o4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v>4");
    cy.get(cesc("#\\/o5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/o6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v<5");
    cy.get(cesc("#\\/o7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/o8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈R");
    cy.get(cesc("#\\/o9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");

    cy.get(cesc("#\\/c1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4≤v≤5");
    cy.get(cesc("#\\/c2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/c3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v=5");
    cy.get(cesc("#\\/c4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v≥4");
    cy.get(cesc("#\\/c5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/c6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v≤5");
    cy.get(cesc("#\\/c7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/c8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈R");
    cy.get(cesc("#\\/c9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");

    cy.get(cesc("#\\/oc1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4<v≤5");
    cy.get(cesc("#\\/oc2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/oc3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/oc4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v>4");
    cy.get(cesc("#\\/oc5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/oc6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v≤5");
    cy.get(cesc("#\\/oc7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/oc8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈R");
    cy.get(cesc("#\\/oc9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");

    cy.get(cesc("#\\/co1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "4≤v<5");
    cy.get(cesc("#\\/co2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/co3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/co4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v≥4");
    cy.get(cesc("#\\/co5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/co6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v<5");
    cy.get(cesc("#\\/co7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
    cy.get(cesc("#\\/co8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈R");
    cy.get(cesc("#\\/co9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "v∈∅");
  });

  it("single inequality", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/o1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc("#\\/o2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/o5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/o6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/o8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/o9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/c1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,5]");
    cy.get(cesc("#\\/c2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/c4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/c5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/c6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/c8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/c9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/c11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/oc1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5]");
    cy.get(cesc("#\\/oc2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/oc5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/oc6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/oc8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/oc9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/oc11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/co1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,5)");
    cy.get(cesc("#\\/co2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/co5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/co6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/co8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/co9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/co11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
  });

  it("single inequality, change variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/o1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc("#\\/o2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/o5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/o6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/o8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/o9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/c1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,5]");
    cy.get(cesc("#\\/c2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/c4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/c5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/c6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/c8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/c9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/c11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/oc1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5]");
    cy.get(cesc("#\\/oc2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/oc5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/oc6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/oc8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/oc9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/oc11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/co1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,5)");
    cy.get(cesc("#\\/co2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/co5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/co6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/co8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/co9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/co11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
  });

  it("single equality", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><subsetOfReals name="e1">x=5</subsetOfReals></p>
  <p><subsetOfReals name="e2">x=infinity</subsetOfReals></p>
  <p><subsetOfReals name="e3">x=-infinity</subsetOfReals></p>
  <p><subsetOfReals name="e4">x=a</subsetOfReals></p>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/e1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/e2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/e3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/e4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
  });

  it("single inequality in set notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/o1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");
    cy.get(cesc("#\\/o2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/o5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/o6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/o8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/o9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/o10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/c1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,5]");
    cy.get(cesc("#\\/c2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/c4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/c5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/c6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/c8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/c9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/c10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/c11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/oc1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5]");
    cy.get(cesc("#\\/oc2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/oc5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,∞)");
    cy.get(cesc("#\\/oc6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/oc8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]");
    cy.get(cesc("#\\/oc9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/oc10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/oc11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");

    cy.get(cesc("#\\/co1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,5)");
    cy.get(cesc("#\\/co2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/co5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,∞)");
    cy.get(cesc("#\\/co6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/co8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5)");
    cy.get(cesc("#\\/co9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/co10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/co11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
  });

  it("union and intersections of intervals and singletons", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
  <p><subsetOfReals name="u18">[-4,-2) union {-4}</subsetOfReals></p>

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
  <p><subsetOfReals name="i18">[-4,-2) intersect {-4}</subsetOfReals></p>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/u1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(6,7)");
    cy.get(cesc("#\\/u2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(5,6)");
    cy.get(cesc("#\\/u3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/u6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,8)");
    cy.get(cesc("#\\/u7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7]");
    cy.get(cesc("#\\/u8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,6)");
    cy.get(cesc("#\\/u9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)∪{7}");
    cy.get(cesc("#\\/u12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[−4,−2)");

    cy.get(cesc("#\\/i1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/i6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5)");
    cy.get(cesc("#\\/i14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5)");
    cy.get(cesc("#\\/i15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5]");
    cy.get(cesc("#\\/i16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5]");
    cy.get(cesc("#\\/i17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{−4}");
  });

  it("union and intersections of intervals and singletons, latex format", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><subsetOfReals format="latex" name="u1">(4,5) \\cup (6,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u2">(4,5) \\cup (5,6)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u3">(4,5] \\cup (5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u4">(4,5] \\cup [5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u5">(4,6) \\cup (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u6">(4,8) \\cup (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u7">(4,7) \\cup (5,7]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u8">(4,6) \\cup {4}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u9">(4,6) \\cup {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u10">(4,6) \\cup {6}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u11">(4,6) \\cup {7}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u12">(4,5) \\cup (5,6) \\cup {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u13">(-\\infty,5) \\cup (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u14">(-\\infty,5) \\cup [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u15">(-\\infty,5] \\cup (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u16">(-\\infty,5] \\cup [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u17">(-\\infty,5) \\cup (9,\\infty) \\cup (4,10)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u18">[-4,-2) \\cup {-4}</subsetOfReals></p>

  <p><subsetOfReals format="latex" name="i1">(4,5) \\cap (6,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i2">(4,5) \\cap (5,6)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i3">(4,5] \\cap (5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i4">(4,5] \\cap [5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i5">(4,6) \\cap (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i6">(4,8) \\cap (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i7">(4,7) \\cap (5,7]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i8">(4,6) \\cap {4}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i9">(4,6) \\cap {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i10">(4,6) \\cap {6}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i11">(4,6) \\cap {7}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i12">(4,5) \\cap (5,6) \\cap {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i13">(-\\infty,5) \\cap (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i14">(-\\infty,5) \\cap [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i15">(-\\infty,5] \\cap (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i16">(-\\infty,5] \\cap [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i17">(-\\infty,5) \\cap (9,\\infty) \\cap (4,10)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i18">[-4,-2) \\cap {-4}</subsetOfReals></p>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/u1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(6,7)");
    cy.get(cesc("#\\/u2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(5,6)");
    cy.get(cesc("#\\/u3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/u6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,8)");
    cy.get(cesc("#\\/u7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7]");
    cy.get(cesc("#\\/u8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,6)");
    cy.get(cesc("#\\/u9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)∪{7}");
    cy.get(cesc("#\\/u12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[−4,−2)");

    cy.get(cesc("#\\/i1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/i6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5)");
    cy.get(cesc("#\\/i14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5)");
    cy.get(cesc("#\\/i15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5]");
    cy.get(cesc("#\\/i16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5]");
    cy.get(cesc("#\\/i17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{−4}");
  });

  it("x element of union and intersections of intervals and singletons", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><subsetOfReals name="u1">x elementof (4,5) union (6,7)</subsetOfReals></p>
  <p><subsetOfReals name="u2">x elementof (4,5) union (5,6)</subsetOfReals></p>
  <p><subsetOfReals name="u3">x elementof (4,5] union (5,6]</subsetOfReals></p>
  <p><subsetOfReals name="u4">x elementof (4,5] union [5,6]</subsetOfReals></p>
  <p><subsetOfReals name="u5">x elementof (4,6) union (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="u6">x elementof (4,8) union (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="u7">x elementof (4,7) union (5,7]</subsetOfReals></p>
  <p><subsetOfReals name="u8">x elementof (4,6) union {4}</subsetOfReals></p>
  <p><subsetOfReals name="u9">x elementof (4,6) union {5}</subsetOfReals></p>
  <p><subsetOfReals name="u10">x elementof (4,6) union {6}</subsetOfReals></p>
  <p><subsetOfReals name="u11">x elementof (4,6) union {7}</subsetOfReals></p>
  <p><subsetOfReals name="u12">x elementof (4,5) union (5,6) union {5}</subsetOfReals></p>
  <p><subsetOfReals name="u13">x elementof (-infinity,5) union (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u14">x elementof (-infinity,5) union [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u15">x elementof (-infinity,5] union (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u16">x elementof (-infinity,5] union [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="u17">x elementof (-infinity,5) union (9,infinity) union (4,10)</subsetOfReals></p>
  <p><subsetOfReals name="u18">x elementof [-4,-2) union {-4}</subsetOfReals></p>

  <p><subsetOfReals name="i1">x elementof (4,5) intersect (6,7)</subsetOfReals></p>
  <p><subsetOfReals name="i2">x elementof (4,5) intersect (5,6)</subsetOfReals></p>
  <p><subsetOfReals name="i3">x elementof (4,5] intersect (5,6]</subsetOfReals></p>
  <p><subsetOfReals name="i4">x elementof (4,5] intersect [5,6]</subsetOfReals></p>
  <p><subsetOfReals name="i5">x elementof (4,6) intersect (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="i6">x elementof (4,8) intersect (5,7)</subsetOfReals></p>
  <p><subsetOfReals name="i7">x elementof (4,7) intersect (5,7]</subsetOfReals></p>
  <p><subsetOfReals name="i8">x elementof (4,6) intersect {4}</subsetOfReals></p>
  <p><subsetOfReals name="i9">x elementof (4,6) intersect {5}</subsetOfReals></p>
  <p><subsetOfReals name="i10">x elementof (4,6) intersect {6}</subsetOfReals></p>
  <p><subsetOfReals name="i11">x elementof (4,6) intersect {7}</subsetOfReals></p>
  <p><subsetOfReals name="i12">x elementof (4,5) intersect (5,6) intersect {5}</subsetOfReals></p>
  <p><subsetOfReals name="i13">x elementof (-infinity,5) intersect (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i14">x elementof (-infinity,5) intersect [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i15">x elementof (-infinity,5] intersect (2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i16">x elementof (-infinity,5] intersect [2,infinity)</subsetOfReals></p>
  <p><subsetOfReals name="i17">x elementof (-infinity,5) intersect (9,infinity) intersect (4,10)</subsetOfReals></p>
  <p><subsetOfReals name="i18">x elementof [-4,-2) intersect {-4}</subsetOfReals></p>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/u1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(6,7)");
    cy.get(cesc("#\\/u2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(5,6)");
    cy.get(cesc("#\\/u3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/u6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,8)");
    cy.get(cesc("#\\/u7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7]");
    cy.get(cesc("#\\/u8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,6)");
    cy.get(cesc("#\\/u9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)∪{7}");
    cy.get(cesc("#\\/u12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[−4,−2)");

    cy.get(cesc("#\\/i1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/i6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5)");
    cy.get(cesc("#\\/i14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5)");
    cy.get(cesc("#\\/i15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5]");
    cy.get(cesc("#\\/i16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5]");
    cy.get(cesc("#\\/i17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{−4}");
  });

  it("union and intersections of intervals and singletons contains element x", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><subsetOfReals name="u1">(4,5) union (6,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u2">(4,5) union (5,6) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u3">(4,5] union (5,6] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u4">(4,5] union [5,6] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u5">(4,6) union (5,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u6">(4,8) union (5,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u7">(4,7) union (5,7] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u8">(4,6) union {4} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u9">(4,6) union {5} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u10">(4,6) union {6} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u11">(4,6) union {7} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u12">(4,5) union (5,6) union {5} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u13">(-infinity,5) union (2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u14">(-infinity,5) union [2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u15">(-infinity,5] union (2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u16">(-infinity,5] union [2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u17">(-infinity,5) union (9,infinity) union (4,10) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="u18">[-4,-2) union {-4} containselement x</subsetOfReals></p>

  <p><subsetOfReals name="i1">(4,5) intersect (6,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i2">(4,5) intersect (5,6) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i3">(4,5] intersect (5,6] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i4">(4,5] intersect [5,6] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i5">(4,6) intersect (5,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i6">(4,8) intersect (5,7) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i7">(4,7) intersect (5,7] containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i8">(4,6) intersect {4} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i9">(4,6) intersect {5} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i10">(4,6) intersect {6} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i11">(4,6) intersect {7} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i12">(4,5) intersect (5,6) intersect {5} containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i13">(-infinity,5) intersect (2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i14">(-infinity,5) intersect [2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i15">(-infinity,5] intersect (2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i16">(-infinity,5] intersect [2,infinity) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i17">(-infinity,5) intersect (9,infinity) intersect (4,10) containselement x</subsetOfReals></p>
  <p><subsetOfReals name="i18">[-4,-2) intersect {-4} containselement x</subsetOfReals></p>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/u1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(6,7)");
    cy.get(cesc("#\\/u2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(5,6)");
    cy.get(cesc("#\\/u3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/u6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,8)");
    cy.get(cesc("#\\/u7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7]");
    cy.get(cesc("#\\/u8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,6)");
    cy.get(cesc("#\\/u9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)∪{7}");
    cy.get(cesc("#\\/u12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[−4,−2)");

    cy.get(cesc("#\\/i1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/i6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5)");
    cy.get(cesc("#\\/i14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5)");
    cy.get(cesc("#\\/i15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5]");
    cy.get(cesc("#\\/i16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5]");
    cy.get(cesc("#\\/i17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{−4}");
  });

  it("x in union and intersections of intervals and singletons, latex format", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><subsetOfReals format="latex" name="u1">x \\in (4,5) \\cup (6,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u2">x \\in (4,5) \\cup (5,6)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u3">x \\in (4,5] \\cup (5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u4">x \\in (4,5] \\cup [5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u5">x \\in (4,6) \\cup (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u6">x \\in (4,8) \\cup (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u7">x \\in (4,7) \\cup (5,7]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u8">x \\in (4,6) \\cup {4}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u9">x \\in (4,6) \\cup {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u10">x \\in (4,6) \\cup {6}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u11">x \\in (4,6) \\cup {7}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u12">x \\in (4,5) \\cup (5,6) \\cup {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u13">x \\in (-\\infty,5) \\cup (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u14">x \\in (-\\infty,5) \\cup [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u15">x \\in (-\\infty,5] \\cup (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u16">x \\in (-\\infty,5] \\cup [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u17">x \\in (-\\infty,5) \\cup (9,\\infty) \\cup (4,10)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u18">x \\in [-4,-2) \\cup {-4}</subsetOfReals></p>

  <p><subsetOfReals format="latex" name="i1">x \\in (4,5) \\cap (6,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i2">x \\in (4,5) \\cap (5,6)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i3">x \\in (4,5] \\cap (5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i4">x \\in (4,5] \\cap [5,6]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i5">x \\in (4,6) \\cap (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i6">x \\in (4,8) \\cap (5,7)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i7">x \\in (4,7) \\cap (5,7]</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i8">x \\in (4,6) \\cap {4}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i9">x \\in (4,6) \\cap {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i10">x \\in (4,6) \\cap {6}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i11">x \\in (4,6) \\cap {7}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i12">x \\in (4,5) \\cap (5,6) \\cap {5}</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i13">x \\in (-\\infty,5) \\cap (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i14">x \\in (-\\infty,5) \\cap [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i15">x \\in (-\\infty,5] \\cap (2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i16">x \\in (-\\infty,5] \\cap [2,\\infty)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i17">x \\in (-\\infty,5) \\cap (9,\\infty) \\cap (4,10)</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i18">x \\in [-4,-2) \\cap {-4}</subsetOfReals></p>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/u1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(6,7)");
    cy.get(cesc("#\\/u2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(5,6)");
    cy.get(cesc("#\\/u3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/u6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,8)");
    cy.get(cesc("#\\/u7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7]");
    cy.get(cesc("#\\/u8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,6)");
    cy.get(cesc("#\\/u9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)∪{7}");
    cy.get(cesc("#\\/u12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[−4,−2)");

    cy.get(cesc("#\\/i1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/i6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5)");
    cy.get(cesc("#\\/i14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5)");
    cy.get(cesc("#\\/i15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5]");
    cy.get(cesc("#\\/i16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5]");
    cy.get(cesc("#\\/i17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{−4}");
  });

  it("union and intersections of intervals and singletons ni x, latex format", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p><subsetOfReals format="latex" name="u1">(4,5) \\cup (6,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u2">(4,5) \\cup (5,6) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u3">(4,5] \\cup (5,6] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u4">(4,5] \\cup [5,6] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u5">(4,6) \\cup (5,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u6">(4,8) \\cup (5,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u7">(4,7) \\cup (5,7] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u8">(4,6) \\cup {4} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u9">(4,6) \\cup {5} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u10">(4,6) \\cup {6} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u11">(4,6) \\cup {7} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u12">(4,5) \\cup (5,6) \\cup {5} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u13">(-\\infty,5) \\cup (2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u14">(-\\infty,5) \\cup [2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u15">(-\\infty,5] \\cup (2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u16">(-\\infty,5] \\cup [2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u17">(-\\infty,5) \\cup (9,\\infty) \\cup (4,10) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="u18">[-4,-2) \\cup {-4} \\ni x</subsetOfReals></p>

  <p><subsetOfReals format="latex" name="i1">(4,5) \\cap (6,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i2">(4,5) \\cap (5,6) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i3">(4,5] \\cap (5,6] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i4">(4,5] \\cap [5,6] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i5">(4,6) \\cap (5,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i6">(4,8) \\cap (5,7) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i7">(4,7) \\cap (5,7] \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i8">(4,6) \\cap {4} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i9">(4,6) \\cap {5} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i10">(4,6) \\cap {6} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i11">(4,6) \\cap {7} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i12">(4,5) \\cap (5,6) \\cap {5} \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i13">(-\\infty,5) \\cap (2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i14">(-\\infty,5) \\cap [2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i15">(-\\infty,5] \\cap (2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i16">(-\\infty,5] \\cap [2,\\infty) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i17">(-\\infty,5) \\cap (9,\\infty) \\cap (4,10) \\ni x</subsetOfReals></p>
  <p><subsetOfReals format="latex" name="i18">[-4,-2) \\cap {-4} \\ni x</subsetOfReals></p>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/u1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(6,7)");
    cy.get(cesc("#\\/u2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(5,6)");
    cy.get(cesc("#\\/u3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/u6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,8)");
    cy.get(cesc("#\\/u7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7]");
    cy.get(cesc("#\\/u8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,6)");
    cy.get(cesc("#\\/u9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/u11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)∪{7}");
    cy.get(cesc("#\\/u12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/u13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/u18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[−4,−2)");

    cy.get(cesc("#\\/i1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/i6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/i8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/i10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5)");
    cy.get(cesc("#\\/i14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5)");
    cy.get(cesc("#\\/i15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5]");
    cy.get(cesc("#\\/i16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5]");
    cy.get(cesc("#\\/i17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/i18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{−4}");
  });

  it("ands and ors with inequalities", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/o1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(6,7)");
    cy.get(cesc("#\\/o2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(5,6)");
    cy.get(cesc("#\\/o3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/o4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/o5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/o6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,8)");
    cy.get(cesc("#\\/o7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7]");
    cy.get(cesc("#\\/o8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[4,6)");
    cy.get(cesc("#\\/o9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/o10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6]");
    cy.get(cesc("#\\/o11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)∪{7}");
    cy.get(cesc("#\\/o12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,6)");
    cy.get(cesc("#\\/o13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");
    cy.get(cesc("#\\/o18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "R");

    cy.get(cesc("#\\/a1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/a2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/a3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/a4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/a5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/a6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/a7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/a8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/a9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "{5}");
    cy.get(cesc("#\\/a10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/a11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/a12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/a13") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5)");
    cy.get(cesc("#\\/a14") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5)");
    cy.get(cesc("#\\/a15") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,5]");
    cy.get(cesc("#\\/a16") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[2,5]");
    cy.get(cesc("#\\/a17") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∅");
    cy.get(cesc("#\\/a18") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)∪(5,10)");
  });

  it("complements of intervals and singletons", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/c1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4]∪[5,∞)");
    cy.get(cesc("#\\/c2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4]∪[5,∞)");
    cy.get(cesc("#\\/c3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4]∪(5,∞)");
    cy.get(cesc("#\\/c4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4]∪(5,∞)");
    cy.get(cesc("#\\/c5") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4)∪[5,∞)");
    cy.get(cesc("#\\/c6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4)∪[5,∞)");
    cy.get(cesc("#\\/c7") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4)∪(5,∞)");
    cy.get(cesc("#\\/c8") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4)∪(5,∞)");
    cy.get(cesc("#\\/c9") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4)∪(4,∞)");
    cy.get(cesc("#\\/c10") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4)∪(4,∞)");
    cy.get(cesc("#\\/c11") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,4]∪{5}∪[6,∞)");
    cy.get(cesc("#\\/c12") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,5]∪[6,∞)");
  });

  it("dynamic subsets", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
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
  

  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,∞)");

    cy.get(cesc(`#\\/displayMode_choice${2}_input`)).click();
    cy.get(cesc("#\\/result") + " .mjx-mrow").should("contain.text", "x>1");
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x>1");

    cy.get(cesc("#\\/variable") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/result") + " .mjx-mrow").should("contain.text", "y∈∅");
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y∈∅");

    cy.get(cesc("#\\/input") + " textarea").type(
      "{home}{rightArrow}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/result") + " .mjx-mrow").should("contain.text", "y>1");
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y>1");

    cy.get(cesc(`#\\/displayMode_choice${1}_input`)).click();
    cy.get(cesc("#\\/result") + " .mjx-mrow").should("contain.text", "(1,∞)");
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,∞)");

    cy.get(cesc("#\\/input") + " textarea").type(
      "{end}{leftArrow}{backspace}\\ne{enter}{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/result") + " .mjx-mrow").should(
      "contain.text",
      "(−∞,1)∪(1,∞)",
    );
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−∞,1)∪(1,∞)");

    cy.get(cesc("#\\/input") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(y>1)\\and(y<3){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/result") + " .mjx-mrow").should("contain.text", "(1,3)");
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");

    cy.get(cesc(`#\\/displayMode_choice${2}_input`)).click();
    cy.get(cesc("#\\/result") + " .mjx-mrow").should("contain.text", "1<y<3");
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1<y<3");

    cy.get(cesc("#\\/input") + " textarea").type("{end}\\or(y>6){enter}", {
      force: true,
    });
    cy.get(cesc("#\\/result") + " .mjx-mrow").should(
      "contain.text",
      "(1<y<3)∨(y>6)",
    );
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1<y<3)∨(y>6)");

    cy.get(cesc(`#\\/displayMode_choice${1}_input`)).click();
    cy.get(cesc("#\\/result") + " .mjx-mrow").should(
      "contain.text",
      "(1,3)∪(6,∞)",
    );
    cy.get(cesc("#\\/result") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)∪(6,∞)");
  });

  it("modifying copies of subsets", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <p>Enter subset: <mathinput name="input0" prefill="(0,1)" /></p>
  <p>Subset 1: <subsetOfReals name="s1">$input0</subsetOfReals></p>
  <p>Subset 2: $s1{name="s2"}</p>
  <p>Subset 3: $s1.value{assignNames="s3"}</p>
  <p>Subset 4: $s2{name="s4"}</p>
  <p>Subset 5: $s2.value{assignNames="s5"}</p>
  <p>Subset 6: $s3{name="s6"}</p>
  <p>Subset 7: $s3.value{assignNames="s7"}</p>
  <p>Subset 8: <subsetOfReals name="s8">$s1</subsetOfReals></p>
  <p>Subset 9: <subsetOfReals name="s9">$(s1.value)</subsetOfReals></p>
  <p>Modify subset 1: <mathinput name="input1" bindValueTo="$s1" /></p>
  <p>Modify subset 2: <mathinput name="input2" bindValueTo="$s2" /></p>
  <p>Modify subset 3: <mathinput name="input3" bindValueTo="$s3" /></p>
  <p>Modify subset 4: <mathinput name="input4" bindValueTo="$s4" /></p>
  <p>Modify subset 5: <mathinput name="input5" bindValueTo="$s5" /></p>
  <p>Modify subset 6: <mathinput name="input6" bindValueTo="$s6" /></p>
  <p>Modify subset 7: <mathinput name="input7" bindValueTo="$s7" /></p>
  <p>Modify subset 8: <mathinput name="input8" bindValueTo="$s8" /></p>
  <p>Modify subset 9: <mathinput name="input9" bindValueTo="$s9" /></p>

  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    function checkDisplay(str, str0) {
      if (str0 === undefined) {
        str0 = str;
      }

      cy.get(cesc("#\\/s1") + " .mjx-mrow").should("contain.text", str);
      cy.get(cesc("#\\/s2") + " .mjx-mrow").should("contain.text", str);
      cy.get(cesc("#\\/s3") + " .mjx-mrow").should("contain.text", str);
      cy.get(cesc("#\\/s4") + " .mjx-mrow").should("contain.text", str);
      cy.get(cesc("#\\/s5") + " .mjx-mrow").should("contain.text", str);
      cy.get(cesc("#\\/s6") + " .mjx-mrow").should("contain.text", str);
      cy.get(cesc("#\\/s7") + " .mjx-mrow").should("contain.text", str);
      cy.get(cesc("#\\/s8") + " .mjx-mrow").should("contain.text", str);
      cy.get(cesc("#\\/s9") + " .mjx-mrow").should("contain.text", str);

      cy.get(cesc("#\\/input0") + " .mq-editable-field").should(
        "contain.text",
        str0,
      );
      cy.get(cesc("#\\/input1") + " .mq-editable-field").should(
        "contain.text",
        str,
      );
      cy.get(cesc("#\\/input2") + " .mq-editable-field").should(
        "contain.text",
        str,
      );
      cy.get(cesc("#\\/input3") + " .mq-editable-field").should(
        "contain.text",
        str,
      );
      cy.get(cesc("#\\/input4") + " .mq-editable-field").should(
        "contain.text",
        str,
      );
      cy.get(cesc("#\\/input5") + " .mq-editable-field").should(
        "contain.text",
        str,
      );
      cy.get(cesc("#\\/input6") + " .mq-editable-field").should(
        "contain.text",
        str,
      );
      cy.get(cesc("#\\/input7") + " .mq-editable-field").should(
        "contain.text",
        str,
      );
      cy.get(cesc("#\\/input8") + " .mq-editable-field").should(
        "contain.text",
        str,
      );
      cy.get(cesc("#\\/input9") + " .mq-editable-field").should(
        "contain.text",
        str,
      );

      cy.get(cesc("#\\/s1") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc("#\\/s2") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc("#\\/s3") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc("#\\/s4") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc("#\\/s5") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc("#\\/s6") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc("#\\/s7") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc("#\\/s8") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc("#\\/s9") + " .mjx-mrow")
        .eq(0)
        .should("have.text", str);
      cy.get(cesc(`#\\/input0`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str0);
        });
      cy.get(cesc(`#\\/input1`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
      cy.get(cesc(`#\\/input2`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
      cy.get(cesc(`#\\/input3`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
      cy.get(cesc(`#\\/input4`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
      cy.get(cesc(`#\\/input5`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
      cy.get(cesc(`#\\/input6`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
      cy.get(cesc(`#\\/input7`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
      cy.get(cesc(`#\\/input8`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
      cy.get(cesc(`#\\/input9`) + ` .mq-editable-field`)
        .invoke("text")
        .then((text) => {
          expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(str);
        });
    }

    checkDisplay("(0,1)");

    cy.get(cesc("#\\/input0") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}x>=3{enter}",
      { force: true },
    );

    checkDisplay("[3,∞)", "x≥3");

    cy.get(cesc("#\\/input1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}{{}q\\mid q=5}{enter}",
      { force: true },
    );

    checkDisplay("{5}");

    cy.get(cesc("#\\/input2") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}[-\\infty, \\pi){enter}",
      { force: true },
    );

    checkDisplay("(−∞,3.141592654)");

    cy.get(cesc("#\\/input3") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(-\\infty,\\infty){enter}",
      { force: true },
    );

    checkDisplay("R");

    cy.get(cesc("#\\/input4") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}x\\in \\emptyset {enter}",
      { force: true },
    );

    checkDisplay("∅");

    cy.get(cesc("#\\/input5") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}x\\notin [9, \\infty){enter}",
      { force: true },
    );

    checkDisplay("(−∞,9)");

    cy.get(cesc("#\\/input6") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}{7}\\ni x{enter}",
      { force: true },
    );

    checkDisplay("{7}");

    cy.get(cesc("#\\/input7") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(-\\infty, -2) \\notni x{enter}",
      { force: true },
    );

    checkDisplay("[−2,∞)");

    cy.get(cesc("#\\/input8") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}{{}1}^c{rightArrow} \\cap {{}v\\mid v>=1}{enter}",
      { force: true },
    );

    checkDisplay("(1,∞)");

    cy.get(cesc("#\\/input9") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}x\\ne -6{enter}",
      { force: true },
    );

    checkDisplay("(−∞,−6)∪(−6,∞)");
  });

  it("union of subset with numbers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <number name="x1">-9</number>
  <number name="x2">-6</number>
  <number name="x3">-1</number>
  <number name="x4">8</number>
  <subsetOfReals name="S">
    ($x1,$x2) union ($x3,$x4)
  </subsetOfReals>
  <subsetOfReals name="Sclosed">$S union $x1 union $x2 union $x3 union $x4</subsetOfReals>


  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/S") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−9,−6)∪(−1,8)");
    cy.get(cesc("#\\/Sclosed") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "[−9,−6]∪[−1,8]");
  });
});
