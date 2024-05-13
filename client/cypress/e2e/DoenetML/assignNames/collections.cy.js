import me from "math-expressions";
import { flattenDeep } from "../../../../src/Core/utils/array";
import { cesc } from "../../../../src/_utils/url";

describe("Collection assignName Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("name points and coords off a graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
  </graph>

  <collect name="cl1" componentTypes="point" target="_graph1" assignNames="a b" />

  <p>a: <copy target="a" prop="coords" assignNames="ashadow" /></p>
  <p>b: <copy target="b" prop="coords" assignNames="bshadow" /></p>

  <collect name="cl2" componentTypes="point" prop="x" target="_graph1" assignNames="u v" />

  <p>u: <copy target="u" assignNames="ushadow" /></p>
  <p>v: <copy target="v" assignNames="vshadow" /></p>

  <graph>
    <copy name="cp1" target="cl1" assignNames="a1 b1" />
  </graph>

  <p>a1: <copy target="a1" prop="coords" assignNames="a1shadow" /></p>
  <p>b1: <copy target="b1" prop="coords" assignNames="b1shadow" /></p>

  <copy name="cp2" prop="x" target="cl1" assignNames="u1 v1" />

  <p>u1: <copy target="u1" assignNames="u1shadow" /></p>
  <p>v1: <copy target="v1" assignNames="v1shadow" /></p>

  <copy name="cp3" prop="x" target="cp1" assignNames="u2 v2" />

  <p>u2: <copy target="u2" assignNames="u2shadow" /></p>
  <p>v2: <copy target="v2" assignNames="v2shadow" /></p>

  <extract prop="x" assignNames="u3 v3"><copy target="cl1"/></extract>

  <p>u3: <copy target="u3" assignNames="u3shadow" /></p>
  <p>v3: <copy target="v3" assignNames="v3shadow" /></p>

  <extract prop="x" assignNames="u4"><copy target="a1"/></extract>
  <extract prop="x" assignNames="v4"><copy target="b1"/></extract>

  <p>u4: <copy target="u4" assignNames="u4shadow" /></p>
  <p>v4: <copy target="v4" assignNames="v4shadow" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/a"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc("#\\/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/ashadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc("#\\/bshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/a1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc("#\\/b1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/u"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/ushadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/vshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u2shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v2shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u3shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v3shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u4shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v4shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a1"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([3, 4]);
    });

    cy.log("Move point a");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a",
        args: { x: 5, y: -5 },
      });

      cy.get(cesc("#\\/a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/a1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/b1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/u"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/ushadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/vshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
    });

    cy.log("Move point b");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 9, y: 8 },
      });

      cy.get(cesc("#\\/a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/a1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/b1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/u"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/ushadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/vshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
    });

    cy.log("Move point a1");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a1",
        args: { x: 7, y: 0 },
      });

      cy.get(cesc("#\\/a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/a1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/b1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/u"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/ushadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/vshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
    });

    cy.log("Move point b1");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b1",
        args: { x: 4, y: 1 },
      });

      cy.get(cesc("#\\/a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,1)");
        });
      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,1)");
        });
      cy.get(cesc("#\\/a1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/b1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,1)");
        });
      cy.get(cesc("#\\/u"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/ushadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/vshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
    });
  });

  it("name points and coords off a graph, extra names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
  </graph>

  <collect name="cl1" componentTypes="point" target="_graph1" assignNames="a b c" />

  <p>a: <copy target="a" prop="coords" assignNames="ashadow" /></p>
  <p>b: <copy target="b" prop="coords" assignNames="bshadow" /></p>
  <p name="pc">c: <copy target="c" prop="coords" assignNames="cshadow" /></p>

  <collect name="cl2" componentTypes="point" prop="x" target="_graph1" assignNames="u v w" />

  <p>u: <copy target="u" assignNames="ushadow" /></p>
  <p>v: <copy target="v" assignNames="vshadow" /></p>
  <p name="pw">w: <copy target="w" assignNames="wshadow" /></p>

  <graph>
    <copy name="cp1" target="cl1" assignNames="a1 b1 c1" />
  </graph>

  <p>a1: <copy target="a1" prop="coords" assignNames="a1shadow" /></p>
  <p>b1: <copy target="b1" prop="coords" assignNames="b1shadow" /></p>
  <p name="pc1">c1: <copy target="c1" prop="coords" assignNames="c1shadow" /></p>

  <copy name="cp2" prop="x" target="cl1" assignNames="u1 v1 w1 x1" />

  <p>u1: <copy target="u1" assignNames="u1shadow" /></p>
  <p>v1: <copy target="v1" assignNames="v1shadow" /></p>
  <p name="pv1">v1: <copy target="w1" assignNames="w1shadow" /></p>
  <p name="px1">x1: <copy target="x1" assignNames="x1shadow" /></p>

  <copy name="cp3" prop="x" target="cp1" assignNames="u2 v2" />

  <p>u2: <copy target="u2" assignNames="u2shadow" /></p>
  <p>v2: <copy target="v2" assignNames="v2shadow" /></p>

  <extract prop="x" assignNames="u3 v3 w3 x3"><copy target="cl1"/></extract>

  <p>u3: <copy target="u3" assignNames="u3shadow" /></p>
  <p>v3: <copy target="v3" assignNames="v3shadow" /></p>
  <p name="pv3">v3: <copy target="w3" assignNames="w3shadow" /></p>
  <p name="px3">x3: <copy target="x3" assignNames="x3shadow" /></p>

  <extract prop="x" assignNames="u4 w4"><copy target="a1"/></extract>
  <extract prop="x" assignNames="v4 x4"><copy target="b1"/></extract>

  <p>u4: <copy target="u4" assignNames="u4shadow" /></p>
  <p>v4: <copy target="v4" assignNames="v4shadow" /></p>
  <p name="pv4">v4: <copy target="w4" assignNames="w4shadow" /></p>
  <p name="px4">x4: <copy target="x4" assignNames="x4shadow" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/a"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc("#\\/b"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/ashadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc("#\\/bshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/a1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,2)");
      });
    cy.get(cesc("#\\/b1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,4)");
      });
    cy.get(cesc("#\\/u"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/ushadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/vshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u2shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v2shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u3shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v3shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/u4shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/v4shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/pc")).should("have.text", "c: ");
    cy.get(cesc("#\\/pw")).should("have.text", "w: ");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pv1")).should("have.text", "v1: ");
    cy.get(cesc("#\\/px1")).should("have.text", "x1: ");
    cy.get(cesc("#\\/pv3")).should("have.text", "v3: ");
    cy.get(cesc("#\\/px3")).should("have.text", "x3: ");
    cy.get(cesc("#\\/pv4")).should("have.text", "v4: ");
    cy.get(cesc("#\\/px4")).should("have.text", "x4: ");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a1"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/b1"].stateValues.xs).eqls([3, 4]);
    });

    cy.log("Move point a");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a",
        args: { x: 5, y: -5 },
      });

      cy.get(cesc("#\\/a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/a1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/b1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/u"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/ushadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/vshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/u4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/pc")).should("have.text", "c: ");
      cy.get(cesc("#\\/pw")).should("have.text", "w: ");
      cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
      cy.get(cesc("#\\/pv1")).should("have.text", "v1: ");
      cy.get(cesc("#\\/px1")).should("have.text", "x1: ");
      cy.get(cesc("#\\/pv3")).should("have.text", "v3: ");
      cy.get(cesc("#\\/px3")).should("have.text", "x3: ");
      cy.get(cesc("#\\/pv4")).should("have.text", "v4: ");
      cy.get(cesc("#\\/px4")).should("have.text", "x4: ");
    });

    cy.log("Move point b");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 9, y: 8 },
      });

      cy.get(cesc("#\\/a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/a1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/b1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/u"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/ushadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/vshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/v4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/pc")).should("have.text", "c: ");
      cy.get(cesc("#\\/pw")).should("have.text", "w: ");
      cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
      cy.get(cesc("#\\/pv1")).should("have.text", "v1: ");
      cy.get(cesc("#\\/px1")).should("have.text", "x1: ");
      cy.get(cesc("#\\/pv3")).should("have.text", "v3: ");
      cy.get(cesc("#\\/px3")).should("have.text", "x3: ");
      cy.get(cesc("#\\/pv4")).should("have.text", "v4: ");
      cy.get(cesc("#\\/px4")).should("have.text", "x4: ");
    });

    cy.log("Move point a1");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a1",
        args: { x: 7, y: 0 },
      });

      cy.get(cesc("#\\/a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/a1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/b1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(9,8)");
        });
      cy.get(cesc("#\\/u"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/ushadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/vshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/u4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc("#\\/pc")).should("have.text", "c: ");
      cy.get(cesc("#\\/pw")).should("have.text", "w: ");
      cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
      cy.get(cesc("#\\/pv1")).should("have.text", "v1: ");
      cy.get(cesc("#\\/px1")).should("have.text", "x1: ");
      cy.get(cesc("#\\/pv3")).should("have.text", "v3: ");
      cy.get(cesc("#\\/px3")).should("have.text", "x3: ");
      cy.get(cesc("#\\/pv4")).should("have.text", "v4: ");
      cy.get(cesc("#\\/px4")).should("have.text", "x4: ");
    });

    cy.log("Move point b1");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b1",
        args: { x: 4, y: 1 },
      });

      cy.get(cesc("#\\/a"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/b"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,1)");
        });
      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,1)");
        });
      cy.get(cesc("#\\/a1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,0)");
        });
      cy.get(cesc("#\\/b1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,1)");
        });
      cy.get(cesc("#\\/u"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/ushadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/vshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/u4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/v4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/pc")).should("have.text", "c: ");
      cy.get(cesc("#\\/pw")).should("have.text", "w: ");
      cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
      cy.get(cesc("#\\/pv1")).should("have.text", "v1: ");
      cy.get(cesc("#\\/px1")).should("have.text", "x1: ");
      cy.get(cesc("#\\/pv3")).should("have.text", "v3: ");
      cy.get(cesc("#\\/px3")).should("have.text", "x3: ");
      cy.get(cesc("#\\/pv4")).should("have.text", "v4: ");
      cy.get(cesc("#\\/px4")).should("have.text", "x4: ");
    });
  });

  it("sequentially name points and coords off lines", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <line through="(0,0) (1,1)"/>
    <line through="(4,3) (2,1)"/>
  </graph>

  <graph>
    <collect name="cl1" componentTypes="line" prop="points" target="_graph1" assignNames="a b c d" />
  </graph>
  
  <p>a: <copy target="a" prop="coords" assignNames="ashadow" /></p>
  <p>b: <copy target="b" prop="coords" assignNames="bshadow" /></p>
  <p>c: <copy target="c" prop="coords" assignNames="cshadow" /></p>
  <p>d: <copy target="d" prop="coords" assignNames="dshadow" /></p>

  <copy prop="x" target="cl1" assignNames="p q r s" />

  <p>p: <copy target="p" assignNames="pshadow" /></p>
  <p>q: <copy target="q" assignNames="qshadow" /></p>
  <p>r: <copy target="r" assignNames="rshadow" /></p>
  <p>s: <copy target="s" assignNames="sshadow" /></p>

  <extract prop="x" assignNames="p1 q1 r1 s1" ><copy target="cl1" /></extract>

  <p>p1: <copy target="p1" assignNames="p1shadow" /></p>
  <p>q1: <copy target="q1" assignNames="q1shadow" /></p>
  <p>r1: <copy target="r1" assignNames="r1shadow" /></p>
  <p>s1: <copy target="s1" assignNames="s1shadow" /></p>

  <copy prop="xs" target="cl1" assignNames="x11 x12 x21 x22 x31 x32 x41 x42" />

  <p>x11: <copy target="x11" assignNames="x11shadow" /></p>
  <p>x12: <copy target="x12" assignNames="x12shadow" /></p>
  <p>x21: <copy target="x21" assignNames="x21shadow" /></p>
  <p>x22: <copy target="x22" assignNames="x22shadow" /></p>
  <p>x31: <copy target="x31" assignNames="x31shadow" /></p>
  <p>x32: <copy target="x32" assignNames="x32shadow" /></p>
  <p>x41: <copy target="x41" assignNames="x41shadow" /></p>
  <p>x42: <copy target="x42" assignNames="x42shadow" /></p>

  <extract prop="xs" assignNames="y11 y12 y21 y22 y31 y32 y41 y42" ><copy target="cl1" /></extract>

  <p>y11: <copy target="y11" assignNames="y11shadow" /></p>
  <p>y12: <copy target="y12" assignNames="y12shadow" /></p>
  <p>y21: <copy target="y21" assignNames="y21shadow" /></p>
  <p>y22: <copy target="y22" assignNames="y22shadow" /></p>
  <p>y31: <copy target="y31" assignNames="y31shadow" /></p>
  <p>y32: <copy target="y32" assignNames="y32shadow" /></p>
  <p>y41: <copy target="y41" assignNames="y41shadow" /></p>
  <p>y42: <copy target="y42" assignNames="y42shadow" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/ashadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(0,0)");
      });
    cy.get(cesc("#\\/bshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1,1)");
      });
    cy.get(cesc("#\\/cshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4,3)");
      });
    cy.get(cesc("#\\/dshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,1)");
      });
    cy.get(cesc("#\\/p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/q"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/r"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/s"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/pshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/qshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/rshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/sshadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/p1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/q1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/r1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/s1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/p1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/q1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/r1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/s1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/x11"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/x12"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/x21"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/x22"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/x31"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/x32"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/x41"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/x42"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/x11shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/x12shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/x21shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/x22shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/x31shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/x32shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/x41shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/x42shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/y11"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/y12"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/y21"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/y22"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/y31"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/y32"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/y41"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/y42"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/y11shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/y12shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("0");
      });
    cy.get(cesc("#\\/y21shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/y22shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/y31shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("4");
      });
    cy.get(cesc("#\\/y32shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3");
      });
    cy.get(cesc("#\\/y41shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/y42shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.xs).eqls([0, 0]);
      expect(stateVariables["/b"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/c"].stateValues.xs).eqls([4, 3]);
      expect(stateVariables["/d"].stateValues.xs).eqls([2, 1]);
    });

    cy.log("Move point a");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a",
        args: { x: 5, y: -5 },
      });

      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,1)");
        });
      cy.get(cesc("#\\/cshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,3)");
        });
      cy.get(cesc("#\\/dshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1)");
        });
      cy.get(cesc("#\\/p"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/r"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/s"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/pshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/qshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/rshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/sshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/r1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/s1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/r1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/s1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/y12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/y21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/y32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/y41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/y42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/y12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/y21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/y32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/y41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/y42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
    });

    cy.log("Move point b");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b",
        args: { x: 7, y: 8 },
      });

      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,8)");
        });
      cy.get(cesc("#\\/cshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,3)");
        });
      cy.get(cesc("#\\/dshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1)");
        });
      cy.get(cesc("#\\/p"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/s"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/pshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/qshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/rshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/sshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/s1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/s1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/y12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/y21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/y22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/y31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/y32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/y41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/y42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/y12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/y21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/y22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/y31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/y32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/y41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/y42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
    });

    cy.log("Move point c");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c",
        args: { x: -3, y: -6 },
      });

      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,8)");
        });
      cy.get(cesc("#\\/cshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−6)");
        });
      cy.get(cesc("#\\/dshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1)");
        });
      cy.get(cesc("#\\/p"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/s"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/pshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/qshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/rshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/sshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/s1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/s1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/y12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/y21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/y22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/y31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/y32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/y41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/y42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/y11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/y12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/y21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/y22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/y31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/y32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/y41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/y42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
    });

    cy.log("Move point d");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/d",
        args: { x: -9, y: 4 },
      });

      cy.get(cesc("#\\/ashadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,−5)");
        });
      cy.get(cesc("#\\/bshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(7,8)");
        });
      cy.get(cesc("#\\/cshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−6)");
        });
      cy.get(cesc("#\\/dshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−9,4)");
        });
      cy.get(cesc("#\\/p"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/s"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/pshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/qshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/rshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/sshadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/s1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/r1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/s1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/y11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/y12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/y21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/y22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/y31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/y32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/y41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/y42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/y11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/y12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/y21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("7");
        });
      cy.get(cesc("#\\/y22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("8");
        });
      cy.get(cesc("#\\/y31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/y32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/y41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/y42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
    });
  });

  it("name points off a dynamic graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <p>Number for first set of points: <mathinput name="n1" /></p>
  <p>Number for second set of points: <mathinput name="n2" /></p>
  <graph>
    <map>
      <template>
        <point>
          ($n+<math>0</math>,
          $i+<math>0</math>)
        </point>
      </template>
      <sources alias="n" indexAlias="i">
        <sequence from="2" length="$n1" />
      </sources>
    </map>
    <map>
      <template>
        <point>
          (-$n+<math>0</math>,
          -$i+<math>0</math>)
        </point>
      </template>
      <sources alias="n" indexAlias="i">
        <sequence from="2" length="$n2" />
      </sources>
    </map>
  </graph>


  <collect name="allpoints" componentTypes="point" target="_graph1" assignNames="p1 p2 p3 p4"/>

  <p>p1: <copy target="p1" prop="coords" assignNames="p1shadow" /></p>
  <p>p2: <copy target="p2" prop="coords" assignNames="p2shadow" /></p>
  <p>p3: <copy target="p3" prop="coords" assignNames="p3shadow" /></p>
  <p>p4: <copy target="p4" prop="coords" assignNames="p4shadow" /></p>

  <copy name="allpoints2" target="allpoints" assignNames="q1 q2 q3 q4 q5 q6"/>

  <p>q1: <copy target="q1" prop="coords" assignNames="q1shadow" /></p>
  <p>q2: <copy target="q2" prop="coords" assignNames="q2shadow" /></p>
  <p>q3: <copy target="q3" prop="coords" assignNames="q3shadow" /></p>
  <p>q4: <copy target="q4" prop="coords" assignNames="q4shadow" /></p>
  <p>q5: <copy target="q5" prop="coords" assignNames="q5shadow" /></p>
  <p>q6: <copy target="q6" prop="coords" assignNames="q6shadow" /></p>

  <collect name="allxs1" componentTypes="point" prop="x" target="_graph1" assignNames="x11 x12 x13 x14 x15 x16" />

  <p>x11: <copy target="x11" assignNames="x11shadow" /></p>
  <p>x12: <copy target="x12" assignNames="x12shadow" /></p>
  <p>x13: <copy target="x13" assignNames="x13shadow" /></p>
  <p>x14: <copy target="x14" assignNames="x14shadow" /></p>
  <p>x15: <copy target="x15" assignNames="x15shadow" /></p>
  <p>x16: <copy target="x16" assignNames="x16shadow" /></p>

  <copy name="allxs2" target="allxs1" assignNames="x21 x22 x23 x24"/>

  <p>x21: <copy target="x21" assignNames="x21shadow" /></p>
  <p>x22: <copy target="x22" assignNames="x22shadow" /></p>
  <p>x23: <copy target="x23" assignNames="x23shadow" /></p>
  <p>x24: <copy target="x24" assignNames="x24shadow" /></p>

  <copy name="allxs3" prop="x" target="allpoints" assignNames="x31 x32 x33 x34" />

  <p>x31: <copy target="x31" assignNames="x31shadow" /></p>
  <p>x32: <copy target="x32" assignNames="x32shadow" /></p>
  <p>x33: <copy target="x33" assignNames="x33shadow" /></p>
  <p>x34: <copy target="x34" assignNames="x34shadow" /></p>

  <copy name="allxs4" prop="x" target="allpoints2" assignNames="x41 x42 x43 x44" />

  <p>x41: <copy target="x41" assignNames="x41shadow" /></p>
  <p>x42: <copy target="x42" assignNames="x42shadow" /></p>
  <p>x43: <copy target="x43" assignNames="x43shadow" /></p>
  <p>x44: <copy target="x44" assignNames="x44shadow" /></p>

  <extract name="allxs5" prop="x" assignNames="x51 x52 x53 x54 x55 x56"><copy target="allpoints" /></extract>

  <p>x51: <copy target="x51" assignNames="x51shadow" /></p>
  <p>x52: <copy target="x52" assignNames="x52shadow" /></p>
  <p>x53: <copy target="x53" assignNames="x53shadow" /></p>
  <p>x54: <copy target="x54" assignNames="x54shadow" /></p>
  <p>x55: <copy target="x55" assignNames="x55shadow" /></p>
  <p>x56: <copy target="x56" assignNames="x56shadow" /></p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/p1")).should("not.exist");
    cy.get(cesc("#\\/p2")).should("not.exist");
    cy.get(cesc("#\\/p3")).should("not.exist");
    cy.get(cesc("#\\/p4")).should("not.exist");

    cy.get(cesc("#\\/p1shadow")).should("not.exist");
    cy.get(cesc("#\\/p2shadow")).should("not.exist");
    cy.get(cesc("#\\/p3shadow")).should("not.exist");
    cy.get(cesc("#\\/p4shadow")).should("not.exist");

    cy.get(cesc("#\\/q1")).should("not.exist");
    cy.get(cesc("#\\/q2")).should("not.exist");
    cy.get(cesc("#\\/q3")).should("not.exist");
    cy.get(cesc("#\\/q4")).should("not.exist");
    cy.get(cesc("#\\/q5")).should("not.exist");
    cy.get(cesc("#\\/q6")).should("not.exist");

    cy.get(cesc("#\\/q1shadow")).should("not.exist");
    cy.get(cesc("#\\/q2shadow")).should("not.exist");
    cy.get(cesc("#\\/q3shadow")).should("not.exist");
    cy.get(cesc("#\\/q4shadow")).should("not.exist");
    cy.get(cesc("#\\/q5shadow")).should("not.exist");
    cy.get(cesc("#\\/q6shadow")).should("not.exist");

    cy.get(cesc("#\\/x11")).should("not.exist");
    cy.get(cesc("#\\/x12")).should("not.exist");
    cy.get(cesc("#\\/x13")).should("not.exist");
    cy.get(cesc("#\\/x14")).should("not.exist");
    cy.get(cesc("#\\/x15")).should("not.exist");
    cy.get(cesc("#\\/x16")).should("not.exist");

    cy.get(cesc("#\\/x11shadow")).should("not.exist");
    cy.get(cesc("#\\/x12shadow")).should("not.exist");
    cy.get(cesc("#\\/x13shadow")).should("not.exist");
    cy.get(cesc("#\\/x14shadow")).should("not.exist");
    cy.get(cesc("#\\/x15shadow")).should("not.exist");
    cy.get(cesc("#\\/x16shadow")).should("not.exist");

    cy.get(cesc("#\\/x21")).should("not.exist");
    cy.get(cesc("#\\/x22")).should("not.exist");
    cy.get(cesc("#\\/x23")).should("not.exist");
    cy.get(cesc("#\\/x24")).should("not.exist");

    cy.get(cesc("#\\/x21shadow")).should("not.exist");
    cy.get(cesc("#\\/x22shadow")).should("not.exist");
    cy.get(cesc("#\\/x23shadow")).should("not.exist");
    cy.get(cesc("#\\/x24shadow")).should("not.exist");

    cy.get(cesc("#\\/x31")).should("not.exist");
    cy.get(cesc("#\\/x32")).should("not.exist");
    cy.get(cesc("#\\/x33")).should("not.exist");
    cy.get(cesc("#\\/x34")).should("not.exist");

    cy.get(cesc("#\\/x31shadow")).should("not.exist");
    cy.get(cesc("#\\/x32shadow")).should("not.exist");
    cy.get(cesc("#\\/x33shadow")).should("not.exist");
    cy.get(cesc("#\\/x34shadow")).should("not.exist");

    cy.get(cesc("#\\/x41")).should("not.exist");
    cy.get(cesc("#\\/x42")).should("not.exist");
    cy.get(cesc("#\\/x43")).should("not.exist");
    cy.get(cesc("#\\/x44")).should("not.exist");

    cy.get(cesc("#\\/x41shadow")).should("not.exist");
    cy.get(cesc("#\\/x42shadow")).should("not.exist");
    cy.get(cesc("#\\/x43shadow")).should("not.exist");
    cy.get(cesc("#\\/x44shadow")).should("not.exist");

    cy.get(cesc("#\\/x51")).should("not.exist");
    cy.get(cesc("#\\/x52")).should("not.exist");
    cy.get(cesc("#\\/x53")).should("not.exist");
    cy.get(cesc("#\\/x54")).should("not.exist");
    cy.get(cesc("#\\/x55")).should("not.exist");
    cy.get(cesc("#\\/x56")).should("not.exist");

    cy.get(cesc("#\\/x51shadow")).should("not.exist");
    cy.get(cesc("#\\/x52shadow")).should("not.exist");
    cy.get(cesc("#\\/x53shadow")).should("not.exist");
    cy.get(cesc("#\\/x54shadow")).should("not.exist");
    cy.get(cesc("#\\/x55shadow")).should("not.exist");
    cy.get(cesc("#\\/x56shadow")).should("not.exist");

    cy.log("Create 1 and 2 points");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    // add window just so can collapse section
    cy.window().then(() => {
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", "(2,1)");
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should("contain.text", "(−2,−1)");
      cy.get(cesc("#\\/p3") + " .mjx-mrow").should("contain.text", "(−3,−2)");

      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−1)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−2)");
        });
      cy.get(cesc("#\\/p4")).should("not.exist");

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−1)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−2)");
        });
      cy.get(cesc("#\\/p4shadow")).should("not.exist");

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−1)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−2)");
        });
      cy.get(cesc("#\\/q4")).should("not.exist");
      cy.get(cesc("#\\/q5")).should("not.exist");
      cy.get(cesc("#\\/q6")).should("not.exist");

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,1)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−1)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−2)");
        });
      cy.get(cesc("#\\/q4shadow")).should("not.exist");
      cy.get(cesc("#\\/q5shadow")).should("not.exist");
      cy.get(cesc("#\\/q6shadow")).should("not.exist");

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x14")).should("not.exist");
      cy.get(cesc("#\\/x15")).should("not.exist");
      cy.get(cesc("#\\/x16")).should("not.exist");

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x14shadow")).should("not.exist");
      cy.get(cesc("#\\/x15shadow")).should("not.exist");
      cy.get(cesc("#\\/x16shadow")).should("not.exist");

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x24")).should("not.exist");

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x24shadow")).should("not.exist");

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x34")).should("not.exist");

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x34shadow")).should("not.exist");

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x44")).should("not.exist");

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x44shadow")).should("not.exist");

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x54")).should("not.exist");
      cy.get(cesc("#\\/x55")).should("not.exist");
      cy.get(cesc("#\\/x56")).should("not.exist");

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x54shadow")).should("not.exist");
      cy.get(cesc("#\\/x55shadow")).should("not.exist");
      cy.get(cesc("#\\/x56shadow")).should("not.exist");
    });

    cy.log("Move point all three points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: 1, y: 2 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 3, y: 4 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: 5, y: 6 },
      });

      cy.get(cesc("#\\/p3") + " .mjx-mrow").should("contain.text", "(5,6)");

      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });
      cy.get(cesc("#\\/p4")).should("not.exist");

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });
      cy.get(cesc("#\\/p4shadow")).should("not.exist");

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });
      cy.get(cesc("#\\/q4")).should("not.exist");
      cy.get(cesc("#\\/q5")).should("not.exist");
      cy.get(cesc("#\\/q6")).should("not.exist");

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });
      cy.get(cesc("#\\/q4shadow")).should("not.exist");
      cy.get(cesc("#\\/q5shadow")).should("not.exist");
      cy.get(cesc("#\\/q6shadow")).should("not.exist");

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x14")).should("not.exist");
      cy.get(cesc("#\\/x15")).should("not.exist");
      cy.get(cesc("#\\/x16")).should("not.exist");

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x14shadow")).should("not.exist");
      cy.get(cesc("#\\/x15shadow")).should("not.exist");
      cy.get(cesc("#\\/x16shadow")).should("not.exist");

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x24")).should("not.exist");

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x24shadow")).should("not.exist");

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x34")).should("not.exist");

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x34shadow")).should("not.exist");

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x44")).should("not.exist");

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x44shadow")).should("not.exist");

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x54")).should("not.exist");
      cy.get(cesc("#\\/x55")).should("not.exist");
      cy.get(cesc("#\\/x56")).should("not.exist");

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x54shadow")).should("not.exist");
      cy.get(cesc("#\\/x55shadow")).should("not.exist");
      cy.get(cesc("#\\/x56shadow")).should("not.exist");
    });

    cy.log("2 and 4 points");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.window().then(() => {
      cy.get(cesc("#\\/p4") + " .mjx-mrow").should("contain.text", "(5,6)");

      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,2)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/p4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,2)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/p4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,2)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/q4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });
      cy.get(cesc("#\\/q5"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−3)");
        });
      cy.get(cesc("#\\/q6"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,−4)");
        });

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,2)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,2)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,4)");
        });
      cy.get(cesc("#\\/q4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,6)");
        });
      cy.get(cesc("#\\/q5shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−3)");
        });
      cy.get(cesc("#\\/q6shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,−4)");
        });

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x14"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x15"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x16"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x14shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x15shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x16shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x24"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x24shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x34"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x34shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x44"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x44shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x54"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x55"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x56"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x54shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x55shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x56shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
    });

    cy.log("Move point all six points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q1",
        args: { x: -1, y: -9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q2",
        args: { x: -2, y: -8 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q3",
        args: { x: -3, y: -7 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q4",
        args: { x: -4, y: -6 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q5",
        args: { x: -5, y: -5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q6",
        args: { x: -6, y: -4 },
      });

      cy.get(cesc("#\\/q6") + " .mjx-mrow").should("contain.text", "(−6,−4)");

      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,−9)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−8)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−7)");
        });
      cy.get(cesc("#\\/p4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−6)");
        });

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,−9)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−8)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−7)");
        });
      cy.get(cesc("#\\/p4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−6)");
        });

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,−9)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−8)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−7)");
        });
      cy.get(cesc("#\\/q4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−6)");
        });
      cy.get(cesc("#\\/q5"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,−5)");
        });
      cy.get(cesc("#\\/q6"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−6,−4)");
        });

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,−9)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−8)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−7)");
        });
      cy.get(cesc("#\\/q4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−6)");
        });
      cy.get(cesc("#\\/q5shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,−5)");
        });
      cy.get(cesc("#\\/q6shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−6,−4)");
        });

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x14"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x15"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x16"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x14shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x15shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x16shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x24"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x24shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x34"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x34shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x44"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x44shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x54"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x55"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x56"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x54shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x55shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x56shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
    });

    cy.log("Down to 1 and 3 points");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should("contain.text", "(−3,−7)");

      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,−9)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−7)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−6)");
        });
      cy.get(cesc("#\\/p4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,−5)");
        });

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,−9)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−7)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−6)");
        });
      cy.get(cesc("#\\/p4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,−5)");
        });

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,−9)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−7)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−6)");
        });
      cy.get(cesc("#\\/q4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,−5)");
        });
      cy.get(cesc("#\\/q5")).should("not.exist");
      cy.get(cesc("#\\/q6")).should("not.exist");

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−1,−9)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−3,−7)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,−6)");
        });
      cy.get(cesc("#\\/q4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,−5)");
        });
      cy.get(cesc("#\\/q5shadow")).should("not.exist");
      cy.get(cesc("#\\/q6shadow")).should("not.exist");

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x14"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x15")).should("not.exist");
      cy.get(cesc("#\\/x16")).should("not.exist");

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x14shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x15shadow")).should("not.exist");
      cy.get(cesc("#\\/x16shadow")).should("not.exist");

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x24"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x24shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x34"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x34shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x44"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x44shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x54"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x55")).should("not.exist");
      cy.get(cesc("#\\/x56")).should("not.exist");

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−1");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−3");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x54shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x55shadow")).should("not.exist");
      cy.get(cesc("#\\/x56shadow")).should("not.exist");
    });

    cy.log("Move point all four points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: 4, y: -5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: 3, y: -6 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p3",
        args: { x: 2, y: -7 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p4",
        args: { x: 1, y: -8 },
      });

      cy.get(cesc("#\\/p4") + " .mjx-mrow").should("contain.text", "(1,−8)");

      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−5)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,−6)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,−7)");
        });
      cy.get(cesc("#\\/p4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−5)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,−6)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,−7)");
        });
      cy.get(cesc("#\\/p4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−5)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,−6)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,−7)");
        });
      cy.get(cesc("#\\/q4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });
      cy.get(cesc("#\\/q5")).should("not.exist");
      cy.get(cesc("#\\/q6")).should("not.exist");

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−5)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,−6)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,−7)");
        });
      cy.get(cesc("#\\/q4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });
      cy.get(cesc("#\\/q5shadow")).should("not.exist");
      cy.get(cesc("#\\/q6shadow")).should("not.exist");

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x14"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x15")).should("not.exist");
      cy.get(cesc("#\\/x16")).should("not.exist");

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x14shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x15shadow")).should("not.exist");
      cy.get(cesc("#\\/x16shadow")).should("not.exist");

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x24"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x24shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x34"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x34shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x44"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x44shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x54"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x55")).should("not.exist");
      cy.get(cesc("#\\/x56")).should("not.exist");

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
      cy.get(cesc("#\\/x54shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x55shadow")).should("not.exist");
      cy.get(cesc("#\\/x56shadow")).should("not.exist");
    });

    cy.log("4 and 2 points, remembers old 2nd value");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should("contain.text", "(−2,−8)");

      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−5)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−8)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,3)");
        });
      cy.get(cesc("#\\/p4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,4)");
        });

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−5)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−8)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,3)");
        });
      cy.get(cesc("#\\/p4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,4)");
        });

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−5)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−8)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,3)");
        });
      cy.get(cesc("#\\/q4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,4)");
        });
      cy.get(cesc("#\\/q5"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,−6)");
        });
      cy.get(cesc("#\\/q6"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,−7)");
        });

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,−5)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−2,−8)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(4,3)");
        });
      cy.get(cesc("#\\/q4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(5,4)");
        });
      cy.get(cesc("#\\/q5shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(3,−6)");
        });
      cy.get(cesc("#\\/q6shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(2,−7)");
        });

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x14"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x15"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x16"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x14shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x15shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x16shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x24"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x24shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x34"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x34shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x44"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x44shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x44"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x44shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x54"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x55"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x56"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−2");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc("#\\/x54shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("5");
        });
      cy.get(cesc("#\\/x55shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("3");
        });
      cy.get(cesc("#\\/x56shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("2");
        });
    });

    cy.log("Move point all six points again");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q1",
        args: { x: -4, y: 6 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q2",
        args: { x: -5, y: 5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q3",
        args: { x: -6, y: 4 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q4",
        args: { x: -7, y: 3 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q5",
        args: { x: -8, y: 2 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/q6",
        args: { x: -9, y: 1 },
      });
    });

    cy.get(cesc("#\\/q6") + " .mjx-mrow").should("contain.text", "(−9,1)");

    cy.get(cesc("#\\/p1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−4,6)");
      });
    cy.get(cesc("#\\/p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−5,5)");
      });
    cy.get(cesc("#\\/p3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−6,4)");
      });
    cy.get(cesc("#\\/p4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7,3)");
      });

    cy.get(cesc("#\\/p1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−4,6)");
      });
    cy.get(cesc("#\\/p2shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−5,5)");
      });
    cy.get(cesc("#\\/p3shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−6,4)");
      });
    cy.get(cesc("#\\/p4shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7,3)");
      });

    cy.get(cesc("#\\/q1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−4,6)");
      });
    cy.get(cesc("#\\/q2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−5,5)");
      });
    cy.get(cesc("#\\/q3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−6,4)");
      });
    cy.get(cesc("#\\/q4"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7,3)");
      });
    cy.get(cesc("#\\/q5"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,2)");
      });
    cy.get(cesc("#\\/q6"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9,1)");
      });

    cy.get(cesc("#\\/q1shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−4,6)");
      });
    cy.get(cesc("#\\/q2shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−5,5)");
      });
    cy.get(cesc("#\\/q3shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−6,4)");
      });
    cy.get(cesc("#\\/q4shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−7,3)");
      });
    cy.get(cesc("#\\/q5shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−8,2)");
      });
    cy.get(cesc("#\\/q6shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(−9,1)");
      });

    cy.get(cesc("#\\/x11"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x12"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x13"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x14"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });
    cy.get(cesc("#\\/x15"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−8");
      });
    cy.get(cesc("#\\/x16"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−9");
      });

    cy.get(cesc("#\\/x11shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x12shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x13shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x14shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });
    cy.get(cesc("#\\/x15shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−8");
      });
    cy.get(cesc("#\\/x16shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−9");
      });

    cy.get(cesc("#\\/x21"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x22"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x23"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x24"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });

    cy.get(cesc("#\\/x21shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x22shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x23shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x24shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });

    cy.get(cesc("#\\/x31"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x32"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x33"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x34"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });

    cy.get(cesc("#\\/x31shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x32shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x33shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x34shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });

    cy.get(cesc("#\\/x41"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x42"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x43"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x44"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });

    cy.get(cesc("#\\/x41shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x42shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x43shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x44shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });

    cy.get(cesc("#\\/x51"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x52"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x53"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x54"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });
    cy.get(cesc("#\\/x55"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−8");
      });
    cy.get(cesc("#\\/x56"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−9");
      });

    cy.get(cesc("#\\/x51shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−4");
      });
    cy.get(cesc("#\\/x52shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−5");
      });
    cy.get(cesc("#\\/x53shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−6");
      });
    cy.get(cesc("#\\/x54shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−7");
      });
    cy.get(cesc("#\\/x55shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−8");
      });
    cy.get(cesc("#\\/x56shadow"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−9");
      });

    cy.log("0 and 3 points, remembers old 3rd value");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", "(−8,2)");

      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−8,2)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−9,1)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });
      cy.get(cesc("#\\/p4")).should("not.exist");

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−8,2)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−9,1)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });
      cy.get(cesc("#\\/p4shadow")).should("not.exist");

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−8,2)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−9,1)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });
      cy.get(cesc("#\\/q4")).should("not.exist");
      cy.get(cesc("#\\/q5")).should("not.exist");
      cy.get(cesc("#\\/q6")).should("not.exist");

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−8,2)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−9,1)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });
      cy.get(cesc("#\\/q4shadow")).should("not.exist");
      cy.get(cesc("#\\/q5shadow")).should("not.exist");
      cy.get(cesc("#\\/q6shadow")).should("not.exist");

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x14")).should("not.exist");
      cy.get(cesc("#\\/x15")).should("not.exist");
      cy.get(cesc("#\\/x16")).should("not.exist");

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x14shadow")).should("not.exist");
      cy.get(cesc("#\\/x15shadow")).should("not.exist");
      cy.get(cesc("#\\/x16shadow")).should("not.exist");

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x24")).should("not.exist");

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x24shadow")).should("not.exist");

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x34")).should("not.exist");

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x34shadow")).should("not.exist");

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x44")).should("not.exist");

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x44shadow")).should("not.exist");

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x44")).should("not.exist");
      cy.get(cesc("#\\/x45")).should("not.exist");
      cy.get(cesc("#\\/x46")).should("not.exist");

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc("#\\/x44shadow")).should("not.exist");
      cy.get(cesc("#\\/x45shadow")).should("not.exist");
      cy.get(cesc("#\\/x46shadow")).should("not.exist");
    });

    cy.log("3 and 3 points");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", "(−4,6)");
      cy.get(cesc("#\\/p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,6)");
        });
      cy.get(cesc("#\\/p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,5)");
        });
      cy.get(cesc("#\\/p3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−6,4)");
        });
      cy.get(cesc("#\\/p4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−8,2)");
        });

      cy.get(cesc("#\\/p1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,6)");
        });
      cy.get(cesc("#\\/p2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,5)");
        });
      cy.get(cesc("#\\/p3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−6,4)");
        });
      cy.get(cesc("#\\/p4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−8,2)");
        });

      cy.get(cesc("#\\/q1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,6)");
        });
      cy.get(cesc("#\\/q2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,5)");
        });
      cy.get(cesc("#\\/q3"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−6,4)");
        });
      cy.get(cesc("#\\/q4"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−8,2)");
        });
      cy.get(cesc("#\\/q5"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−9,1)");
        });
      cy.get(cesc("#\\/q6"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });

      cy.get(cesc("#\\/q1shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−4,6)");
        });
      cy.get(cesc("#\\/q2shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−5,5)");
        });
      cy.get(cesc("#\\/q3shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−6,4)");
        });
      cy.get(cesc("#\\/q4shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−8,2)");
        });
      cy.get(cesc("#\\/q5shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(−9,1)");
        });
      cy.get(cesc("#\\/q6shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("(1,−8)");
        });

      cy.get(cesc("#\\/x11"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x12"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x13"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x14"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x15"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x16"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x11shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x12shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x13shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x14shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x15shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x16shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x21"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x22"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x23"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x24"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });

      cy.get(cesc("#\\/x21shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x22shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x23shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x24shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });

      cy.get(cesc("#\\/x31"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x32"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x33"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x34"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });

      cy.get(cesc("#\\/x31shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x32shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x33shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x34shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });

      cy.get(cesc("#\\/x41"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x42"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x43"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x44"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });

      cy.get(cesc("#\\/x41shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x42shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x43shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x44shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });

      cy.get(cesc("#\\/x51"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x52"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x53"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x54"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x55"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x56"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });

      cy.get(cesc("#\\/x51shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−4");
        });
      cy.get(cesc("#\\/x52shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−5");
        });
      cy.get(cesc("#\\/x53shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−6");
        });
      cy.get(cesc("#\\/x54shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−8");
        });
      cy.get(cesc("#\\/x55shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("−9");
        });
      cy.get(cesc("#\\/x56shadow"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
    });
  });

  it("name points off a dynamic list with changing dimensions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <section name="originals"><title>The originals</title>

    <p>Number for first set of points: <mathinput name="n1" /></p>
    <p>Number for second set of points: <mathinput name="n2" /></p>
    <p>Number of dimensions 1: <mathinput name="nd1" prefill="2"/></p>
    <p>Number of dimensions 2: <mathinput name="nd2" prefill="3"/></p>
    <map assignNames="pa1 pa2 pa3">
      <template newNamespace>
        <map hide>
          <template>
            <math>$b$a + <math>0</math></math>
          </template>
          <sources alias="a">
            <sequence length="$(../nd1)" />
          </sources>
        </map>
        <point xs="$_map1" />
      </template>
      <sources alias="b">
        <sequence length="$n1" />
      </sources>
    </map>
    <map assignNames="pb1 pb2 pb3">
      <template newNamespace>
        <map>
          <template>
            <math>-$b$a + <math>0</math></math>
          </template>
          <sources alias="a">
            <sequence length="$(../nd2)" />
          </sources>
        </map>
        <point xs="$_map1" />
      </template>
      <sources alias="b">
        <sequence length="$n2" />
      </sources>
    </map>
  </section>

  <collect name="allpoints" componentTypes="point" target="originals" assignNames="p1 p2 p3 p4"/>

  <p>p1: <copy target="p1" prop="coords" assignNames="p1shadow" /></p>
  <p>p2: <copy target="p2" prop="coords" assignNames="p2shadow" /></p>
  <p>p3: <copy target="p3" prop="coords" assignNames="p3shadow" /></p>
  <p>p4: <copy target="p4" prop="coords" assignNames="p4shadow" /></p>

  <copy name="allpoints2" target="allpoints" assignNames="q1 q2 q3 q4 q5 q6"/>

  <p>q1: <copy target="q1" prop="coords" assignNames="q1shadow" /></p>
  <p>q2: <copy target="q2" prop="coords" assignNames="q2shadow" /></p>
  <p>q3: <copy target="q3" prop="coords" assignNames="q3shadow" /></p>
  <p>q4: <copy target="q4" prop="coords" assignNames="q4shadow" /></p>
  <p>q5: <copy target="q5" prop="coords" assignNames="q5shadow" /></p>
  <p>q6: <copy target="q6" prop="coords" assignNames="q6shadow" /></p>

  <collect name="allxs1" componentTypes="point" prop="xs" target="originals" assignNames="xs11 xs12 xs13 xs14 xs15 xs16 xs17 xs18" />

  <p>xs11: <copy target="xs11" assignNames="xs11shadow" /></p>
  <p>xs12: <copy target="xs12" assignNames="xs12shadow" /></p>
  <p>xs13: <copy target="xs13" assignNames="xs13shadow" /></p>
  <p>xs14: <copy target="xs14" assignNames="xs14shadow" /></p>
  <p>xs15: <copy target="xs15" assignNames="xs15shadow" /></p>
  <p>xs16: <copy target="xs16" assignNames="xs16shadow" /></p>
  <p>xs17: <copy target="xs17" assignNames="xs17shadow" /></p>
  <p>xs18: <copy target="xs18" assignNames="xs18shadow" /></p>

  <copy name="allxs2" target="allxs1" assignNames="xs21 xs22 xs23 xs24 xs25 xs26"/>

  <p>xs21: <copy target="xs21" assignNames="xs21shadow" /></p>
  <p>xs22: <copy target="xs22" assignNames="xs22shadow" /></p>
  <p>xs23: <copy target="xs23" assignNames="xs23shadow" /></p>
  <p>xs24: <copy target="xs24" assignNames="xs24shadow" /></p>
  <p>xs25: <copy target="xs25" assignNames="xs25shadow" /></p>
  <p>xs26: <copy target="xs26" assignNames="xs26shadow" /></p>

  <copy name="allxs3" prop="xs" target="allpoints" assignNames="xs31 xs32 xs33 xs34 xs35 xs36" />

  <p>xs31: <copy target="xs31" assignNames="xs31shadow" /></p>
  <p>xs32: <copy target="xs32" assignNames="xs32shadow" /></p>
  <p>xs33: <copy target="xs33" assignNames="xs33shadow" /></p>
  <p>xs34: <copy target="xs34" assignNames="xs34shadow" /></p>
  <p>xs35: <copy target="xs35" assignNames="xs35shadow" /></p>
  <p>xs36: <copy target="xs36" assignNames="xs36shadow" /></p>

  <copy name="allxs4" prop="xs" target="allpoints2" assignNames="xs41 xs42 xs43 xs44 xs45 xs46" />

  <p>xs41: <copy target="xs41" assignNames="xs41shadow" /></p>
  <p>xs42: <copy target="xs42" assignNames="xs42shadow" /></p>
  <p>xs43: <copy target="xs43" assignNames="xs43shadow" /></p>
  <p>xs44: <copy target="xs44" assignNames="xs44shadow" /></p>
  <p>xs45: <copy target="xs45" assignNames="xs45shadow" /></p>
  <p>xs46: <copy target="xs46" assignNames="xs46shadow" /></p>

  <extract name="allxs5" prop="xs" assignNames="xs51 xs52 xs53 xs54 xs55 xs56 xs57 xs58"><copy target="allpoints" /></extract>

  <p>xs51: <copy target="xs51" assignNames="xs51shadow" /></p>
  <p>xs52: <copy target="xs52" assignNames="xs52shadow" /></p>
  <p>xs53: <copy target="xs53" assignNames="xs53shadow" /></p>
  <p>xs54: <copy target="xs54" assignNames="xs54shadow" /></p>
  <p>xs55: <copy target="xs55" assignNames="xs55shadow" /></p>
  <p>xs56: <copy target="xs56" assignNames="xs56shadow" /></p>
  <p>xs57: <copy target="xs57" assignNames="xs57shadow" /></p>
  <p>xs58: <copy target="xs58" assignNames="xs58shadow" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    function checkValues(points1, points2) {
      function pointToString(point) {
        if (!Array.isArray(point)) {
          point = [point];
        }
        let s = point
          .map((x) => (x < 0 ? `−${Math.abs(x)}` : String(x)))
          .join(",");
        if (point.length > 1) {
          s = `(${s})`;
        }
        return s;
      }

      let allPoints = [...points1, ...points2];

      let allXs = flattenDeep(allPoints);

      for (let ind = 0; ind < 3; ind++) {
        let pointa = points1[ind];
        if (pointa) {
          cy.get(cesc(`#\\/pa${ind + 1}\\/_point1`) + ` .mjx-mrow`).should(
            "contain.text",
            pointToString(pointa),
          );
          cy.get(cesc(`#\\/pa${ind + 1}\\/_point1`) + ` .mjx-mrow`).should(
            "not.contain.text",
            pointToString(pointa) + ",",
          );
          cy.get(cesc(`#\\/pa${ind + 1}\\/_point1`) + ` .mjx-mrow`).should(
            "not.contain.text",
            "," + pointToString(pointa),
          );
          cy.get(cesc(`#\\/pa${ind + 1}\\/_point1`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(pointa));
            });
        } else {
          cy.get(cesc(`#\\/pa${ind + 1}\\/_point1`)).should("not.exist");
        }

        let pointb = points2[ind];
        if (pointb) {
          cy.get(cesc(`#\\/pb${ind + 1}\\/_point1`) + ` .mjx-mrow`).should(
            "contain.text",
            pointToString(pointb),
          );
          cy.get(cesc(`#\\/pb${ind + 1}\\/_point1`) + ` .mjx-mrow`).should(
            "not.contain.text",
            pointToString(pointb) + ",",
          );
          cy.get(cesc(`#\\/pb${ind + 1}\\/_point1`) + ` .mjx-mrow`).should(
            "not.contain.text",
            "," + pointToString(pointb),
          );
          cy.get(cesc(`#\\/pb${ind + 1}\\/_point1`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(pointb));
            });
        } else {
          cy.get(cesc(`#\\/pb${ind + 1}\\/_point1`)).should("not.exist");
        }
      }

      for (let ind = 0; ind < 4; ind++) {
        let point = allPoints[ind];
        if (point) {
          cy.get(cesc(`#\\/p${ind + 1}`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(point));
            });
          cy.get(cesc(`#\\/p${ind + 1}shadow`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(point));
            });
        } else {
          cy.get(cesc(`#\\/p${ind + 1}`)).should("not.exist");
          cy.get(cesc(`#\\/p${ind + 1}shadow`)).should("not.exist");
        }
      }

      for (let ind = 0; ind < 6; ind++) {
        let point = allPoints[ind];
        if (point) {
          cy.get(cesc(`#\\/q${ind + 1}`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(point));
            });
          cy.get(cesc(`#\\/q${ind + 1}shadow`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(point));
            });
        } else {
          cy.get(cesc(`#\\/q${ind + 1}`)).should("not.exist");
          cy.get(cesc(`#\\/q${ind + 1}shadow`)).should("not.exist");
        }
      }

      for (let ind = 0; ind < 8; ind++) {
        let theX = allXs[ind];
        if (theX !== undefined) {
          cy.get(cesc(`#\\/xs1${ind + 1}`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
          cy.get(cesc(`#\\/xs1${ind + 1}shadow`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
          cy.get(cesc(`#\\/xs5${ind + 1}`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
          cy.get(cesc(`#\\/xs5${ind + 1}shadow`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
        } else {
          cy.get(cesc(`#\\/xs1${ind + 1}`)).should("not.exist");
          cy.get(cesc(`#\\/xs1${ind + 1}shadow`)).should("not.exist");
          cy.get(cesc(`#\\/xs5${ind + 1}`)).should("not.exist");
          cy.get(cesc(`#\\/xs5${ind + 1}shadow`)).should("not.exist");
        }
      }

      for (let ind = 0; ind < 6; ind++) {
        let theX = allXs[ind];
        if (theX !== undefined) {
          cy.get(cesc(`#\\/xs2${ind + 1}`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
          cy.get(cesc(`#\\/xs2${ind + 1}shadow`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
          cy.get(cesc(`#\\/xs3${ind + 1}`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
          cy.get(cesc(`#\\/xs3${ind + 1}shadow`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
          cy.get(cesc(`#\\/xs4${ind + 1}`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
          cy.get(cesc(`#\\/xs4${ind + 1}shadow`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(pointToString(theX));
            });
        } else {
          cy.get(cesc(`#\\/xs2${ind + 1}`)).should("not.exist");
          cy.get(cesc(`#\\/xs2${ind + 1}shadow`)).should("not.exist");
          cy.get(cesc(`#\\/xs3${ind + 1}`)).should("not.exist");
          cy.get(cesc(`#\\/xs3${ind + 1}shadow`)).should("not.exist");
          cy.get(cesc(`#\\/xs4${ind + 1}`)).should("not.exist");
          cy.get(cesc(`#\\/xs4${ind + 1}shadow`)).should("not.exist");
        }
      }
    }

    let points1 = [],
      points2 = [];

    checkValues(points1, points2);

    cy.log("Create 1 and 2 points");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    points1 = [[1, 2]];
    points2 = [
      [-1, -2, -3],
      [-2, -4, -6],
    ];

    checkValues(points1, points2);

    // move points
    cy.log("Move points");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pa1/_point1",
        args: { x: 3, y: 9 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pb1/_point1",
        args: { x: -6, y: -5, z: 4 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pb2/_point1",
        args: { x: 8, y: 0, z: 7 },
      });

      points1 = [[3, 9]];
      points2 = [
        [-6, -5, 4],
        [8, 0, 7],
      ];

      checkValues(points1, points2);
    });

    cy.log("Change dimensions to 3 and 2");
    cy.get(cesc("#\\/nd1") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/nd2") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    points1 = [[3, 9, 3]];
    points2 = [
      [-6, -5],
      [8, 0],
    ];

    checkValues(points1, points2);

    cy.log("Move points");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pa1/_point1",
        args: { x: -1, y: 7, z: -9 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pb1/_point1",
        args: { x: 5, y: 4 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pb2/_point1",
        args: { x: 3, y: 2 },
      });

      points1 = [[-1, 7, -9]];
      points2 = [
        [5, 4],
        [3, 2],
      ];

      checkValues(points1, points2);
    });

    cy.log("Change to 2 and 1 points");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    points1 = [
      [-1, 7, -9],
      [2, 4, 6],
    ];
    points2 = [[5, 4]];

    checkValues(points1, points2);

    cy.log("Move points");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pa1/_point1",
        args: { x: 9, y: -8, z: 7 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pa2/_point1",
        args: { x: -6, y: 5, z: -4 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/pb1/_point1",
        args: { x: 3, y: -2 },
      });

      points1 = [
        [9, -8, 7],
        [-6, 5, -4],
      ];
      points2 = [[3, -2]];

      checkValues(points1, points2);
    });

    cy.log("Change dimensions to 2 and 1");
    cy.get(cesc("#\\/nd1") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/nd2") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    points1 = [
      [9, -8],
      [-6, 5],
    ];
    points2 = [[3]];

    checkValues(points1, points2);

    cy.log("Change to 1 and 3 points");
    cy.get(cesc("#\\/n1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n2") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    points1 = [[9, -8]];
    points2 = [[3], [3], [-3]];

    checkValues(points1, points2);
  });

  // collect points and lines, once decide how should recurse
});
