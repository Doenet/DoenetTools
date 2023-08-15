import me from "math-expressions";
import { flattenDeep } from "../../../../src/Core/utils/array";
import { cesc } from "../../../../src/utils/url";

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

  <p>a: $a.coords{assignNames="ashadow"}</p>
  <p>b: $b.coords{assignNames="bshadow"}</p>

  <collect name="cl2" componentTypes="point" prop="x" target="_graph1" assignNames="u v" />

  <p>u: $u{name="ushadow"}</p>
  <p>v: $v{name="vshadow"}</p>

  <graph>
    $cl1{name="cp1" assignNames="a1 b1"}
  </graph>

  <p>a1: $a1.coords{assignNames="a1shadow"}</p>
  <p>b1: $b1.coords{assignNames="b1shadow"}</p>

  $cl1.x{name="cp2" assignNames="u1 v1"}

  <p>u1: $u1{name="u1shadow"}</p>
  <p>v1: $v1{name="v1shadow"}</p>

  $cp1.x{name="cp3" assignNames="u2 v2"}

  <p>u2: $u2{name="u2shadow"}</p>
  <p>v2: $v2{name="v2shadow"}</p>

  <extract prop="x" assignNames="u3 v3">$cl1</extract>

  <p>u3: $u3{name="u3shadow"}</p>
  <p>v3: $v3{name="v3shadow"}</p>

  <extract prop="x" assignNames="u4">$a1</extract>
  <extract prop="x" assignNames="v4">$b1</extract>

  <p>u4: $u4{name="u4shadow"}</p>
  <p>v4: $v4{name="v4shadow"}</p>

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

  <p>a: $a.coords{assignNames="ashadow"}</p>
  <p>b: $b.coords{assignNames="bshadow"}</p>
  <p name="pc">c: $c.coords{assignNames="cshadow"}</p>

  <collect name="cl2" componentTypes="point" prop="x" target="_graph1" assignNames="u v w" />

  <p>u: $u{name="ushadow"}</p>
  <p>v: $v{name="vshadow"}</p>
  <p name="pw">w: $w{name="wshadow"}</p>

  <graph>
    $cl1{name="cp1" assignNames="a1 b1 c1"}
  </graph>

  <p>a1: $a1.coords{assignNames="a1shadow"}</p>
  <p>b1: $b1.coords{assignNames="b1shadow"}</p>
  <p name="pc1">c1: $c1.coords{assignNames="c1shadow"}</p>

  $cl1.x{name="cp2" assignNames="u1 v1 w1 x1"}

  <p>u1: $u1{name="u1shadow"}</p>
  <p>v1: $v1{name="v1shadow"}</p>
  <p name="pv1">v1: $w1{name="w1shadow"}</p>
  <p name="px1">x1: $x1{name="x1shadow"}</p>

  $cp1.x{name="cp3" assignNames="u2 v2"}

  <p>u2: $u2{name="u2shadow"}</p>
  <p>v2: $v2{name="v2shadow"}</p>

  <extract prop="x" assignNames="u3 v3 w3 x3">$cl1</extract>

  <p>u3: $u3{name="u3shadow"}</p>
  <p>v3: $v3{name="v3shadow"}</p>
  <p name="pv3">v3: $w3{name="w3shadow"}</p>
  <p name="px3">x3: $x3{name="x3shadow"}</p>

  <extract prop="x" assignNames="u4 w4">$a1</extract>
  <extract prop="x" assignNames="v4 x4">$b1</extract>

  <p>u4: $u4{name="u4shadow"}</p>
  <p>v4: $v4{name="v4shadow"}</p>
  <p name="pv4">v4: $w4{name="w4shadow"}</p>
  <p name="px4">x4: $x4{name="x4shadow"}</p>

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
  
  <p>a: $a.coords{assignNames="ashadow"}</p>
  <p>b: $b.coords{assignNames="bshadow"}</p>
  <p>c: $c.coords{assignNames="cshadow"}</p>
  <p>d: $d.coords{assignNames="dshadow"}</p>

  $cl1.x{assignNames="p q r s"}

  <p>p: $p{name="pshadow"}</p>
  <p>q: $q{name="qshadow"}</p>
  <p>r: $r{name="rshadow"}</p>
  <p>s: $s{name="sshadow"}</p>

  <extract prop="x" assignNames="p1 q1 r1 s1" >$cl1</extract>

  <p>p1: $p1{name="p1shadow"}</p>
  <p>q1: $q1{name="q1shadow"}</p>
  <p>r1: $r1{name="r1shadow"}</p>
  <p>s1: $s1{name="s1shadow"}</p>

  $cl1.xs{assignNames="x11 x12 x21 x22 x31 x32 x41 x42"}

  <p>x11: $x11{name="x11shadow"}</p>
  <p>x12: $x12{name="x12shadow"}</p>
  <p>x21: $x21{name="x21shadow"}</p>
  <p>x22: $x22{name="x22shadow"}</p>
  <p>x31: $x31{name="x31shadow"}</p>
  <p>x32: $x32{name="x32shadow"}</p>
  <p>x41: $x41{name="x41shadow"}</p>
  <p>x42: $x42{name="x42shadow"}</p>

  <extract prop="xs" assignNames="y11 y12 y21 y22 y31 y32 y41 y42" >$cl1</extract>

  <p>y11: $y11{name="y11shadow"}</p>
  <p>y12: $y12{name="y12shadow"}</p>
  <p>y21: $y21{name="y21shadow"}</p>
  <p>y22: $y22{name="y22shadow"}</p>
  <p>y31: $y31{name="y31shadow"}</p>
  <p>y32: $y32{name="y32shadow"}</p>
  <p>y41: $y41{name="y41shadow"}</p>
  <p>y42: $y42{name="y42shadow"}</p>

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

  <p>p1: $p1.coords{assignNames="p1shadow"}</p>
  <p>p2: $p2.coords{assignNames="p2shadow"}</p>
  <p>p3: $p3.coords{assignNames="p3shadow"}</p>
  <p>p4: $p4.coords{assignNames="p4shadow"}</p>

  $allpoints{name="allpoints2" target="allpoints" assignNames="q1 q2 q3 q4 q5 q6"}

  <p>q1: $q1.coords{assignNames="q1shadow"}</p>
  <p>q2: $q2.coords{assignNames="q2shadow"}</p>
  <p>q3: $q3.coords{assignNames="q3shadow"}</p>
  <p>q4: $q4.coords{assignNames="q4shadow"}</p>
  <p>q5: $q5.coords{assignNames="q5shadow"}</p>
  <p>q6: $q6.coords{assignNames="q6shadow"}</p>

  <collect name="allxs1" componentTypes="point" prop="x" target="_graph1" assignNames="x11 x12 x13 x14 x15 x16" />

  <p>x11: $x11{name="x11shadow"}</p>
  <p>x12: $x12{name="x12shadow"}</p>
  <p>x13: $x13{name="x13shadow"}</p>
  <p>x14: $x14{name="x14shadow"}</p>
  <p>x15: $x15{name="x15shadow"}</p>
  <p>x16: $x16{name="x16shadow"}</p>

  $allxs1{name="allxs2" assignNames="x21 x22 x23 x24"}

  <p>x21: $x21{name="x21shadow"}</p>
  <p>x22: $x22{name="x22shadow"}</p>
  <p>x23: $x23{name="x23shadow"}</p>
  <p>x24: $x24{name="x24shadow"}</p>

  $allpoints.x{name="allxs3" assignNames="x31 x32 x33 x34"}

  <p>x31: $x31{name="x31shadow"}</p>
  <p>x32: $x32{name="x32shadow"}</p>
  <p>x33: $x33{name="x33shadow"}</p>
  <p>x34: $x34{name="x34shadow"}</p>

  $allpoints2.x{name="allxs4" assignNames="x41 x42 x43 x44"}

  <p>x41: $x41{name="x41shadow"}</p>
  <p>x42: $x42{name="x42shadow"}</p>
  <p>x43: $x43{name="x43shadow"}</p>
  <p>x44: $x44{name="x44shadow"}</p>

  <extract name="allxs5" prop="x" assignNames="x51 x52 x53 x54 x55 x56">$allpoints</extract>

  <p>x51: $x51{name="x51shadow"}</p>
  <p>x52: $x52{name="x52shadow"}</p>
  <p>x53: $x53{name="x53shadow"}</p>
  <p>x54: $x54{name="x54shadow"}</p>
  <p>x55: $x55{name="x55shadow"}</p>
  <p>x56: $x56{name="x56shadow"}</p>


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

  <p>p1: $p1.coords{assignNames="p1shadow"}</p>
  <p>p2: $p2.coords{assignNames="p2shadow"}</p>
  <p>p3: $p3.coords{assignNames="p3shadow"}</p>
  <p>p4: $p4.coords{assignNames="p4shadow"}</p>

  $allpoints{name="allpoints2" assignNames="q1 q2 q3 q4 q5 q6"}

  <p>q1: $q1.coords{assignNames="q1shadow"}</p>
  <p>q2: $q2.coords{assignNames="q2shadow"}</p>
  <p>q3: $q3.coords{assignNames="q3shadow"}</p>
  <p>q4: $q4.coords{assignNames="q4shadow"}</p>
  <p>q5: $q5.coords{assignNames="q5shadow"}</p>
  <p>q6: $q6.coords{assignNames="q6shadow"}</p>

  <collect name="allxs1" componentTypes="point" prop="xs" target="originals" assignNames="xs11 xs12 xs13 xs14 xs15 xs16 xs17 xs18" />

  <p>xs11: $xs11{name="xs11shadow"}</p>
  <p>xs12: $xs12{name="xs12shadow"}</p>
  <p>xs13: $xs13{name="xs13shadow"}</p>
  <p>xs14: $xs14{name="xs14shadow"}</p>
  <p>xs15: $xs15{name="xs15shadow"}</p>
  <p>xs16: $xs16{name="xs16shadow"}</p>
  <p>xs17: $xs17{name="xs17shadow"}</p>
  <p>xs18: $xs18{name="xs18shadow"}</p>

  $allxs1{name="allxs2" assignNames="xs21 xs22 xs23 xs24 xs25 xs26"}

  <p>xs21: $xs21{name="xs21shadow"}</p>
  <p>xs22: $xs22{name="xs22shadow"}</p>
  <p>xs23: $xs23{name="xs23shadow"}</p>
  <p>xs24: $xs24{name="xs24shadow"}</p>
  <p>xs25: $xs25{name="xs25shadow"}</p>
  <p>xs26: $xs26{name="xs26shadow"}</p>

  $allpoints.xs{name="allxs3" assignNames="xs31 xs32 xs33 xs34 xs35 xs36"}

  <p>xs31: $xs31{name="xs31shadow"}</p>
  <p>xs32: $xs32{name="xs32shadow"}</p>
  <p>xs33: $xs33{name="xs33shadow"}</p>
  <p>xs34: $xs34{name="xs34shadow"}</p>
  <p>xs35: $xs35{name="xs35shadow"}</p>
  <p>xs36: $xs36{name="xs36shadow"}</p>

  $allpoints2.xs{name="allxs4" assignNames="xs41 xs42 xs43 xs44 xs45 xs46"}

  <p>xs41: $xs41{name="xs41shadow"}</p>
  <p>xs42: $xs42{name="xs42shadow"}</p>
  <p>xs43: $xs43{name="xs43shadow"}</p>
  <p>xs44: $xs44{name="xs44shadow"}</p>
  <p>xs45: $xs45{name="xs45shadow"}</p>
  <p>xs46: $xs46{name="xs46shadow"}</p>

  <extract name="allxs5" prop="xs" assignNames="xs51 xs52 xs53 xs54 xs55 xs56 xs57 xs58">$allpoints</extract>

  <p>xs51: $xs51{name="xs51shadow"}</p>
  <p>xs52: $xs52{name="xs52shadow"}</p>
  <p>xs53: $xs53{name="xs53shadow"}</p>
  <p>xs54: $xs54{name="xs54shadow"}</p>
  <p>xs55: $xs55{name="xs55shadow"}</p>
  <p>xs56: $xs56{name="xs56shadow"}</p>
  <p>xs57: $xs57{name="xs57shadow"}</p>
  <p>xs58: $xs58{name="xs58shadow"}</p>

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
