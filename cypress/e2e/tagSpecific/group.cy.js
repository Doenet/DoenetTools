import { cesc, cesc2 } from "../../../../src/utils/url";

describe("Group Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("nested groups, copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Animal: <textinput name="animal" prefill="fox"/></p>
    <p>Plant: <textinput name="plant" prefill="tree"/></p>
    
    <group name="g1">
      <p name="animalp">The animal is a $animal.value.</p>
      <group name="g2">
        <p name="plantp">The plant is a $plant.value.</p>
        <p copySource="animalp" name="animalp2" />
        <group name="g3">
          <p copySource="plantp" name="plantp2" />
        </group>
        <group copySource="g3" assignNames="plantp3" />
      </group>
      <group copySource="g2" assignNames="plantp4 animalp3 (plantp5) (plantp6)" />
    </group>
    <group copySource="g1" assignNames="animalp4 (plantp7 animalp5 (plantp8) (plantp9)) (plantp10 animalp6 (plantp11) (plantp12))" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let animal = "fox";
    let plant = "tree";
    let animalSentence = "The animal is a " + animal + ".";
    let plantSentence = "The plant is a " + plant + ".";
    cy.get(cesc("#\\/animalp")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp2")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp2")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp3")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp4")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp3")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp5")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp6")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp4")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp7")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp5")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp8")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp9")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp10")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp6")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp11")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp12")).should("have.text", plantSentence);

    cy.get(cesc("#\\/animal_input")).clear().type("beetle{enter}");
    cy.get(cesc("#\\/plant_input")).clear().type("dandelion{enter}");
    let animal2 = "beetle";
    let plant2 = "dandelion";
    let animalSentence2 = "The animal is a " + animal2 + ".";
    let plantSentence2 = "The plant is a " + plant2 + ".";
    cy.get(cesc("#\\/animalp")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp2")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp2")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp3")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp4")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp3")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp5")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp6")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp4")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp7")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp5")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp8")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp9")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp10")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp6")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp11")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp12")).should("have.text", plantSentence2);
  });

  it("nested groups, initially unresolved, reffed", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `

    $g1
    <group name="g1">
      <p name="animalp">The animal $animalphrase.</p>
      <group name="g2">
        <p name="plantp">The plant $plantphrase.</p>
        <p copySource="animalp" name="animalp2" />
        <group name="g3">
          <p copySource="plantp" name="plantp2" />
        </group>
        <group copySource="g3" assignNames="plantp3" />
      </group>
      <group copySource="g2" assignNames="plantp4 animalp3 (plantp5) (plantp6)" />
    </group>
    <group copySource="g1" assignNames="animalp4 (plantp7 animalp5 (plantp8) (plantp9)) (plantp10 animalp6 (plantp11) (plantp12))" />

    $verb1{name="verb"}
    $animalphrase1{name="animalphrase"}
    <text name="animalphrase1">$verb $animal1</text>
    <text name="animal1">$article $animal.value</text>
    $verb2{name="verb1"}
    <text name="verb2">is</text>
    <text name="article">$article1</text>
    $article2{name="article1"}
    <text name="article2">a</text>
    $plantphrase1{name="plantphrase"}
    <text name="plantphrase1">$verb $plant1</text>
    <text name="plant1">$article $plant.value</text>

    <p>Animal: <textinput name="animal" prefill="fox"/></p>
    <p>Plant: <textinput name="plant" prefill="tree"/></p>
    
    `,
        },
        "*",
      );
    });

    let animal = "fox";
    let plant = "tree";
    let animalSentence = "The animal is a " + animal + ".";
    let plantSentence = "The plant is a " + plant + ".";
    cy.get(cesc("#\\/animalp")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp2")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp2")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp3")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp4")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp3")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp5")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp6")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp4")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp7")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp5")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp8")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp9")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp10")).should("have.text", plantSentence);
    cy.get(cesc("#\\/animalp6")).should("have.text", animalSentence);
    cy.get(cesc("#\\/plantp11")).should("have.text", plantSentence);
    cy.get(cesc("#\\/plantp12")).should("have.text", plantSentence);

    cy.get(cesc("#\\/animal_input")).clear().type("beetle{enter}");
    cy.get(cesc("#\\/plant_input")).clear().type("dandelion{enter}");
    let animal2 = "beetle";
    let plant2 = "dandelion";
    let animalSentence2 = "The animal is a " + animal2 + ".";
    let plantSentence2 = "The plant is a " + plant2 + ".";
    cy.get(cesc("#\\/animalp")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp2")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp2")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp3")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp4")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp3")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp5")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp6")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp4")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp7")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp5")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp8")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp9")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp10")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/animalp6")).should("have.text", animalSentence2);
    cy.get(cesc("#\\/plantp11")).should("have.text", plantSentence2);
    cy.get(cesc("#\\/plantp12")).should("have.text", plantSentence2);
  });

  it("group with a map that begins zero length, copied multiple times", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><group asList name="group1"><map>
    <template><math simplify>$x^2</math></template>
    <sources alias="x">
    <sequence from="$from" to="$to" length="$count" />
    </sources>
    </map></group></p>

    <mathinput name="from" prefill="1"/>
    <mathinput name="to" prefill="2"/>
    <mathinput name="count" prefill="0"/>
    
    <p name="p2"><group copySource="group1" name="group2" /></p>
    <p name="p3"><group copySource="group2" name="group3" /></p>

    <p name="p4" copySource="p1" />
    <p name="p5" copySource="p4" />
    <p name="p6" copySource="p5" />

    $count.value{assignNames="count2"}
    $to.value{assignNames="to2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("At beginning, nothing shown");
    for (let i = 1; i <= 6; i++) {
      cy.get(cesc(`#\\/p${i}`)).should("have.text", "");
    }

    cy.log("make sequence length 1");
    cy.get(cesc("#\\/count") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/count2")).should("contain.text", "1");

    for (let i = 1; i <= 6; i++) {
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(1)
        .should("not.exist");
    }

    cy.log("make sequence length 0 again");
    cy.get(cesc("#\\/count") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/count2")).should("contain.text", "0");
    for (let i = 1; i <= 6; i++) {
      cy.get(cesc(`#\\/p${i}`)).should("have.text", "");
    }

    cy.log("make sequence length 2");
    cy.get(cesc("#\\/count") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/count2")).should("contain.text", "2");

    for (let i = 1; i <= 6; i++) {
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("1");
        });
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("4");
        });
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(2)
        .should("not.exist");
    }

    cy.log("change limits");
    cy.get(cesc("#\\/from") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/to") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/to2")).should("contain.text", "5");

    for (let i = 1; i <= 6; i++) {
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("25");
        });
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(2)
        .should("not.exist");
    }

    cy.log("make sequence length 0 once again");
    cy.get(cesc("#\\/count") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/count2")).should("contain.text", "0");
    for (let i = 1; i <= 6; i++) {
      cy.get(cesc(`#\\/p${i}`)).should("have.text", "");
    }

    cy.log("make sequence length 3");
    cy.get(cesc("#\\/count") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/count2")).should("contain.text", "3");

    for (let i = 1; i <= 6; i++) {
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("9");
        });
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("16");
        });
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(2)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("25");
        });
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(3)
        .should("not.exist");
    }
  });

  it("group with mutual references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1">
    <aslist>
    <group><math simplify><math name="x">$var1.value</math> + $y</math></group>
    <group><math simplify><math name="y">$var2.value</math> + $x</math></group>
    </aslist>
    </p>
    
    <mathinput prefill="x" name="var1"/>
    <mathinput prefill="y" name="var2"/>
    
    <p name="p2"><aslist>$_group1$_group2</aslist></p>
    <p name="p3">$_aslist1</p>
    
    <p name="p4" copySource="p1" />
    <p name="p5" copySource="p2" />
    <p name="p6" copySource="p3" />
    
    <p name="p7" copySource="p4" />
    <p name="p8" copySource="p5" />
    <p name="p9" copySource="p6" />

    $var2.value{assignNames="var2b"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    for (let i = 1; i <= 9; i++) {
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+y");
        });

      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("x+y");
        });
    }

    cy.log("change variables");
    cy.get(cesc("#\\/var1") + " textarea").type("{end}{backspace}u{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/var2") + " textarea").type("{end}{backspace}v{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/var2b")).should("contain.text", "v");

    for (let i = 1; i <= 9; i++) {
      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("u+v");
        });

      cy.get(cesc(`#\\/p${i}`))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal("u+v");
        });
    }
  });

  it("fixed propagated when copy group", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <group name="g" newNamespace>
        <point name="A">(1,2)</point>
      </group>
    </graph>

    <graph>
      <group copySource="g" fixed name="g2" />
    </graph>

    <graph>
      <group copySource="g2" fixed="false" name="g3" />
    </graph>

    <graph>
      <group copySource="g2" fixed="false" link="false" name="g4" />
    </graph>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Initial values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g"].stateValues.fixed).eq(false);
      expect(stateVariables["/g/A"].stateValues.fixed).eq(false);
      expect(stateVariables["/g/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g2"].stateValues.fixed).eq(true);
      expect(stateVariables["/g2/A"].stateValues.fixed).eq(true);
      expect(stateVariables["/g2/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g3"].stateValues.fixed).eq(false);
      expect(stateVariables["/g3/A"].stateValues.fixed).eq(false);
      expect(stateVariables["/g3/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/g4"].stateValues.fixed).eq(false);
      expect(stateVariables["/g4/A"].stateValues.fixed).eq(false);
      expect(stateVariables["/g4/A"].stateValues.xs).eqls([1, 2]);
    });

    cy.log("move first point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g/A",
        args: { x: 3, y: 4 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/A"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/g2/A"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/g3/A"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/g4/A"].stateValues.xs).eqls([1, 2]);
    });

    cy.log(`can't move second point as fixed`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: 5, y: 6 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/A"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/g2/A"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/g3/A"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/g4/A"].stateValues.xs).eqls([1, 2]);
    });

    // TODO: this used to be immobile but not it is
    // Do we need to figure out how to make third point immobile again?
    // cy.log(`can't move third point as depends on fixed second point`)
    cy.log(
      `for now, can move third point as depends on directly on xs of first point`,
    );
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: 7, y: 8 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/A"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/g2/A"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/g3/A"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/g4/A"].stateValues.xs).eqls([1, 2]);
    });

    cy.log(`can move fourth point`);
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: 9, y: 0 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/A"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/g2/A"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/g3/A"].stateValues.xs).eqls([7, 8]);
      expect(stateVariables["/g4/A"].stateValues.xs).eqls([9, 0]);
    });
  });

  it("disabled propagated when copy group", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
      <group name="g" newNamespace>
        <textinput name="ti" prefill="hello" />
        $ti.value{assignNames="t"}
      </group>

      <group copySource="g" disabled name="g2" />

      <group copySource="g2" disabled="false" name="g3" />

      <group copySource="g2" disabled="false" link="false" name="g4" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Initial values");

    cy.get(cesc("#\\/g\\/ti_input")).should("not.be.disabled");
    cy.get(cesc("#\\/g2\\/ti_input")).should("be.disabled");
    cy.get(cesc("#\\/g3\\/ti_input")).should("not.be.disabled");
    cy.get(cesc("#\\/g4\\/ti_input")).should("not.be.disabled");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g"].stateValues.disabled).eq(false);
      expect(stateVariables["/g/ti"].stateValues.disabled).eq(false);
      expect(stateVariables["/g/ti"].stateValues.value).eq("hello");
      expect(stateVariables["/g2"].stateValues.disabled).eq(true);
      expect(stateVariables["/g2/ti"].stateValues.disabled).eq(true);
      expect(stateVariables["/g2/ti"].stateValues.value).eq("hello");
      expect(stateVariables["/g3"].stateValues.disabled).eq(false);
      expect(stateVariables["/g3/ti"].stateValues.disabled).eq(false);
      expect(stateVariables["/g3/ti"].stateValues.value).eq("hello");
      expect(stateVariables["/g4"].stateValues.disabled).eq(false);
      expect(stateVariables["/g4/ti"].stateValues.disabled).eq(false);
      expect(stateVariables["/g4/ti"].stateValues.value).eq("hello");
    });

    cy.log("type in first textinput");
    cy.get(cesc("#\\/g\\/ti_input")).clear().type("bye{enter}");
    cy.get(cesc("#\\/g\\/t")).should("contain.text", "bye");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/ti"].stateValues.value).eq("bye");
      expect(stateVariables["/g2/ti"].stateValues.value).eq("bye");
      expect(stateVariables["/g3/ti"].stateValues.value).eq("bye");
      expect(stateVariables["/g4/ti"].stateValues.value).eq("hello");
    });

    cy.log("type in third textinput");
    cy.get(cesc("#\\/g3\\/ti_input")).clear().type("this{enter}");
    cy.get(cesc("#\\/g3\\/t")).should("contain.text", "this");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/ti"].stateValues.value).eq("this");
      expect(stateVariables["/g2/ti"].stateValues.value).eq("this");
      expect(stateVariables["/g3/ti"].stateValues.value).eq("this");
      expect(stateVariables["/g4/ti"].stateValues.value).eq("hello");
    });

    cy.log("type in fourth textinput");
    cy.get(cesc("#\\/g4\\/ti_input")).clear().type("that{enter}");
    cy.get(cesc("#\\/g4\\/t")).should("contain.text", "that");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g/ti"].stateValues.value).eq("this");
      expect(stateVariables["/g2/ti"].stateValues.value).eq("this");
      expect(stateVariables["/g3/ti"].stateValues.value).eq("this");
      expect(stateVariables["/g4/ti"].stateValues.value).eq("that");
    });
  });

  it("change rendered", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <p><booleanInput name="ren1"><label>rendereed 1</label></booleaninput></p>
      <group name="g1" rendered="$ren1" newNamespace>
        <p>Hello</p>
      </group>

      <p><booleanInput name="ren2" prefill="true"><label>rendereed 2</label></booleaninput></p>
      <group name="g2" rendered="$ren2" newNamespace>
        <p>Bye</p>
      </group>

      
      $g1{name="g1a"}
      $g2{name="g2a"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/g2/_p1")).should("have.text", "Bye");
    cy.get(cesc2("#/g2a/_p1")).should("have.text", "Bye");
    cy.get(cesc2("#/g1/_p1")).should("not.exist");
    cy.get(cesc2("#/g1a/_p1")).should("not.exist");

    cy.get(cesc2("#/ren1")).click();
    cy.get(cesc2("#/g1/_p1")).should("have.text", "Hello");
    cy.get(cesc2("#/g1a/_p1")).should("have.text", "Hello");
    cy.get(cesc2("#/g2/_p1")).should("have.text", "Bye");
    cy.get(cesc2("#/g2a/_p1")).should("have.text", "Bye");

    cy.get(cesc2("#/ren2")).click();
    cy.get(cesc2("#/g2/_p1")).should("not.exist");
    cy.get(cesc2("#/g2a/_p1")).should("not.exist");
    cy.get(cesc2("#/g1/_p1")).should("have.text", "Hello");
    cy.get(cesc2("#/g1a/_p1")).should("have.text", "Hello");

    cy.get(cesc2("#/ren1")).click();
    cy.get(cesc2("#/g1/_p1")).should("not.exist");
    cy.get(cesc2("#/g1a/_p1")).should("not.exist");
    cy.get(cesc2("#/g2/_p1")).should("not.exist");
    cy.get(cesc2("#/g2a/_p1")).should("not.exist");

    cy.get(cesc2("#/ren2")).click();
    cy.get(cesc2("#/g2/_p1")).should("have.text", "Bye");
    cy.get(cesc2("#/g2a/_p1")).should("have.text", "Bye");
    cy.get(cesc2("#/g1/_p1")).should("not.exist");
    cy.get(cesc2("#/g1a/_p1")).should("not.exist");
  });
});
