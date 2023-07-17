import { cesc } from "../../../../src/_utils/url";

describe("PeriodicSet Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("match given periodic set", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Offsets: <mathinput name="o"/></p>
    <p>Period: <mathinput name="p" /></p>
    <answer>
      <award>
        <when>
          <periodicSet name="s1"  offsets="$o" period="$p" />
          =
          <periodicSet name="s2"  offsets="pi/4 3pi/4" period="pi" />
        </when>
      </award>
    </answer>
    <p>Credit achieved: $_answer1.creditAchieved{assignNames="ca"}</p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/ca")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/s1"].stateValues.value).eq("\uFF3F");

      let s2 = ["periodic_set"];
      s2.push(["tuple", ["/", "pi", 4], "pi", -Infinity, Infinity]);
      s2.push(["tuple", ["/", ["*", 3, "pi"], 4], "pi", -Infinity, Infinity]);
      expect(stateVariables["/s2"].stateValues.value).eqls(s2);
      expect(stateVariables["/s2"].stateValues.numOffsets).eq(2);
      expect(stateVariables["/s2"].stateValues.offsets[0]).eqls(["/", "pi", 4]);
      expect(stateVariables["/s2"].stateValues.offsets[1]).eqls([
        "/",
        ["*", 3, "pi"],
        4,
      ]);
      expect(stateVariables["/s2"].stateValues.period).eq("pi");
      expect(stateVariables["/s2"].stateValues.redundantOffsets).eq(false);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });

    cy.log("Type in an offset and submit");
    cy.get(cesc("#\\/o") + " textarea").type(`-pi/4{enter}`, { force: true });
    cy.get(cesc("#\\/_answer1_submit")).click();
    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");

    cy.get(cesc("#\\/ca")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/s1"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });

    cy.log("Type in a period and submit");
    cy.get(cesc("#\\/p") + " textarea").type(`pi/2{enter}`, { force: true });
    cy.get(cesc("#\\/_answer1_submit")).click();

    cy.get(cesc("#\\/_answer1_correct")).should("be.visible");

    cy.get(cesc("#\\/ca")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ["periodic_set"];
      s1.push([
        "tuple",
        ["-", ["/", "pi", 4]],
        ["/", "pi", 2],
        -Infinity,
        Infinity,
      ]);
      expect(stateVariables["/s1"].stateValues.value).eqls(s1);
      expect(stateVariables["/s1"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/s1"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/s1"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/s1"].stateValues.redundantOffsets).eq(false);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
    });

    cy.log("Change period to be irrational factor of other period");
    cy.get(cesc("#\\/p") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}1{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/_answer1_submit")).click();

    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");
    cy.get(cesc("#\\/ca")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ["periodic_set"];
      s1.push(["tuple", ["-", ["/", "pi", 4]], 1, -Infinity, Infinity]);
      expect(stateVariables["/s1"].stateValues.value).eqls(s1);
      expect(stateVariables["/s1"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/s1"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/s1"].stateValues.period).eqls(1);
      expect(stateVariables["/s1"].stateValues.redundantOffsets).eq(false);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });

    cy.log("Change period");
    cy.get(cesc("#\\/p") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}pi{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/_answer1_submit")).click();

    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");
    cy.get(cesc("#\\/ca")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ["periodic_set"];
      s1.push(["tuple", ["-", ["/", "pi", 4]], "pi", -Infinity, Infinity]);
      expect(stateVariables["/s1"].stateValues.value).eqls(s1);
      expect(stateVariables["/s1"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/s1"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/s1"].stateValues.period).eqls("pi");
      expect(stateVariables["/s1"].stateValues.redundantOffsets).eq(false);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });

    cy.log("add offset");
    cy.get(cesc("#\\/o") + " textarea").type(`{end}, 5pi/4{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/_answer1_submit")).click();

    cy.get(cesc("#\\/_answer1_correct")).should("be.visible");
    cy.get(cesc("#\\/ca")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ["periodic_set"];
      s1.push(["tuple", ["-", ["/", "pi", 4]], "pi", -Infinity, Infinity]);
      s1.push(["tuple", ["/", ["*", 5, "pi"], 4], "pi", -Infinity, Infinity]);
      expect(stateVariables["/s1"].stateValues.value).eqls(s1);
      expect(stateVariables["/s1"].stateValues.numOffsets).eq(2);
      expect(stateVariables["/s1"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/s1"].stateValues.offsets[1]).eqls([
        "/",
        ["*", 5, "pi"],
        4,
      ]);
      expect(stateVariables["/s1"].stateValues.period).eqls("pi");
      expect(stateVariables["/s1"].stateValues.redundantOffsets).eq(false);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
    });

    cy.log("add redundant offset");
    cy.get(cesc("#\\/o") + " textarea").type(`{end}, pi/4{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/_answer1_submit")).click();

    cy.get(cesc("#\\/_answer1_correct")).should("be.visible");
    cy.get(cesc("#\\/ca")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ["periodic_set"];
      s1.push(["tuple", ["-", ["/", "pi", 4]], "pi", -Infinity, Infinity]);
      s1.push(["tuple", ["/", ["*", 5, "pi"], 4], "pi", -Infinity, Infinity]);
      s1.push(["tuple", ["/", "pi", 4], "pi", -Infinity, Infinity]);
      expect(stateVariables["/s1"].stateValues.value).eqls(s1);
      expect(stateVariables["/s1"].stateValues.numOffsets).eq(3);
      expect(stateVariables["/s1"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/s1"].stateValues.offsets[1]).eqls([
        "/",
        ["*", 5, "pi"],
        4,
      ]);
      expect(stateVariables["/s1"].stateValues.offsets[2]).eqls(["/", "pi", 4]);
      expect(stateVariables["/s1"].stateValues.period).eqls("pi");
      expect(stateVariables["/s1"].stateValues.redundantOffsets).eq(true);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
    });

    cy.log("add incorrect offset");
    cy.get(cesc("#\\/o") + " textarea").type(`{end}, pi/2{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/_answer1_submit")).click();

    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");
    cy.get(cesc("#\\/ca")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ["periodic_set"];
      s1.push(["tuple", ["-", ["/", "pi", 4]], "pi", -Infinity, Infinity]);
      s1.push(["tuple", ["/", ["*", 5, "pi"], 4], "pi", -Infinity, Infinity]);
      s1.push(["tuple", ["/", "pi", 4], "pi", -Infinity, Infinity]);
      s1.push(["tuple", ["/", "pi", 2], "pi", -Infinity, Infinity]);
      expect(stateVariables["/s1"].stateValues.value).eqls(s1);
      expect(stateVariables["/s1"].stateValues.numOffsets).eq(4);
      expect(stateVariables["/s1"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/s1"].stateValues.offsets[1]).eqls([
        "/",
        ["*", 5, "pi"],
        4,
      ]);
      expect(stateVariables["/s1"].stateValues.offsets[2]).eqls(["/", "pi", 4]);
      expect(stateVariables["/s1"].stateValues.offsets[3]).eqls(["/", "pi", 2]);
      expect(stateVariables["/s1"].stateValues.period).eqls("pi");
      expect(stateVariables["/s1"].stateValues.redundantOffsets).eq(true);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });

    cy.log("add invalid math");
    cy.get(cesc("#\\/o") + " textarea").type(`{end}, ({enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/_answer1_submit")).click();

    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");
    cy.get(cesc("#\\/ca")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      // expect((stateVariables['/s1'].stateValues.value)).eq('\uff3f');
      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });
  });

  it("match copied periodic sets", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Offsets: <mathinput name="offsets" /></p>
    <p>Period: <mathinput name="period" /></p>
    
    <p>Offsets 2: <mathinput name="offsets2" /></p>
    <p>Period 2: <mathinput name="period2" /></p>
    
    <periodicSet name="a"  offsets="$offsets" period="$period" />
    <periodicSet name="b"  offsets="$offsets2" period="$period2" />
    
    <answer>
      <award>
        <when>$a{name="a2"} = $b{name="b2"}</when>
      </award>
    </answer>
    
    <p>Credit achieved: $_answer1.creditAchieved{assignNames="ca"}</p>
    
    <p>Redundancies: $a.redundantOffsets, $b.redundantOffsets, $a2.redundantOffsets, $b2.redundantOffsets</p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/_answer1_submit")).click();
    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");

    cy.get(cesc("#\\/ca")).should("have.text", "0");
    cy.get(cesc("#\\/_p6")).should(
      "have.text",
      "Redundancies: false, false, false, false",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/b"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/a2"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/b2"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit offset for both");
    cy.get(cesc("#\\/offsets") + " textarea").type(`-pi/4{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/offsets2") + " textarea").type(`-pi/4{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/_answer1_submit")).click();
    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/a"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/b"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/a2"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/b2"].stateValues.value).eq("\uFF3F");
      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit periods for both");
    cy.get(cesc("#\\/period") + " textarea").type(`pi/2{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/period2") + " textarea").type(`2pi{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/_answer1_submit")).click();
    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");

    cy.get(cesc("#\\/ca")).should("have.text", "0");
    cy.get(cesc("#\\/_p6")).should(
      "have.text",
      "Redundancies: false, false, false, false",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let a = ["periodic_set"];
      a.push([
        "tuple",
        ["-", ["/", "pi", 4]],
        ["/", "pi", 2],
        -Infinity,
        Infinity,
      ]);
      expect(stateVariables["/a"].stateValues.value).eqls(a);
      expect(stateVariables["/a"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/a"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/a"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a"].stateValues.redundantOffsets).eq(false);
      expect(stateVariables["/a2"].stateValues.value).eqls(a);
      expect(stateVariables["/a2"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/a2"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/a2"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a2"].stateValues.redundantOffsets).eq(false);

      let b = ["periodic_set"];
      b.push([
        "tuple",
        ["-", ["/", "pi", 4]],
        ["*", 2, "pi"],
        -Infinity,
        Infinity,
      ]);
      expect(stateVariables["/b"].stateValues.value).eqls(b);
      expect(stateVariables["/b"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/b"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/b"].stateValues.redundantOffsets).eq(false);
      expect(stateVariables["/b"].stateValues.period).eqls(["*", 2, "pi"]);
      expect(stateVariables["/b2"].stateValues.value).eqls(b);
      expect(stateVariables["/b2"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/b2"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/b2"].stateValues.period).eqls(["*", 2, "pi"]);
      expect(stateVariables["/b2"].stateValues.redundantOffsets).eq(false);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });

    cy.log("Add offsets to match");
    cy.get(cesc("#\\/offsets2") + " textarea").type(
      `{end}, pi/4{rightArrow}, 11pi/4{rightArrow}, -11pi/4{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/_answer1_submit")).click();
    cy.get(cesc("#\\/_answer1_correct")).should("be.visible");

    cy.get(cesc("#\\/ca")).should("have.text", "1");

    cy.get(cesc("#\\/_p6")).should(
      "have.text",
      "Redundancies: false, false, false, false",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let a = ["periodic_set"];
      a.push([
        "tuple",
        ["-", ["/", "pi", 4]],
        ["/", "pi", 2],
        -Infinity,
        Infinity,
      ]);
      expect(stateVariables["/a"].stateValues.value).eqls(a);
      expect(stateVariables["/a"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/a"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/a"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a"].stateValues.redundantOffsets).eq(false);
      expect(stateVariables["/a2"].stateValues.value).eqls(a);
      expect(stateVariables["/a2"].stateValues.numOffsets).eq(1);
      expect(stateVariables["/a2"].stateValues.offsets[0]).eqls([
        "-",
        ["/", "pi", 4],
      ]);
      expect(stateVariables["/a2"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a2"].stateValues.redundantOffsets).eq(false);

      let b = ["periodic_set"];

      let offset0 = ["-", ["/", "pi", 4]];
      let offset1 = ["/", "pi", 4];
      let offset2 = ["/", ["*", 11, "pi"], 4];
      let offset3 = ["-", ["/", ["*", 11, "pi"], 4]];

      b.push(["tuple", offset0, ["*", 2, "pi"], -Infinity, Infinity]);
      b.push(["tuple", offset1, ["*", 2, "pi"], -Infinity, Infinity]);
      b.push(["tuple", offset2, ["*", 2, "pi"], -Infinity, Infinity]);
      b.push(["tuple", offset3, ["*", 2, "pi"], -Infinity, Infinity]);
      expect(stateVariables["/b"].stateValues.value).eqls(b);
      expect(stateVariables["/b"].stateValues.numOffsets).eq(4);
      expect(stateVariables["/b"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/b"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/b"].stateValues.offsets[2]).eqls(offset2);
      expect(stateVariables["/b"].stateValues.offsets[3]).eqls(offset3);
      expect(stateVariables["/b"].stateValues.redundantOffsets).eq(false);
      expect(stateVariables["/b"].stateValues.period).eqls(["*", 2, "pi"]);
      expect(stateVariables["/b2"].stateValues.value).eqls(b);
      expect(stateVariables["/b2"].stateValues.numOffsets).eq(4);
      expect(stateVariables["/b2"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/b2"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/b2"].stateValues.offsets[2]).eqls(offset2);
      expect(stateVariables["/b2"].stateValues.offsets[3]).eqls(offset3);
      expect(stateVariables["/b2"].stateValues.period).eqls(["*", 2, "pi"]);
      expect(stateVariables["/b2"].stateValues.redundantOffsets).eq(false);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
    });

    cy.log("Add extra offsets");
    cy.get(cesc("#\\/offsets") + " textarea").type(`{end}, -17pi/4{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/_answer1_submit")).click();
    cy.get(cesc("#\\/_answer1_correct")).should("be.visible");

    cy.get(cesc("#\\/ca")).should("have.text", "1");

    cy.get(cesc("#\\/_p6")).should(
      "have.text",
      "Redundancies: true, false, true, false",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let offset0 = ["-", ["/", "pi", 4]];
      let offset1 = ["-", ["/", ["*", 17, "pi"], 4]];

      let a = ["periodic_set"];
      a.push(["tuple", offset0, ["/", "pi", 2], -Infinity, Infinity]);
      a.push(["tuple", offset1, ["/", "pi", 2], -Infinity, Infinity]);
      expect(stateVariables["/a"].stateValues.value).eqls(a);
      expect(stateVariables["/a"].stateValues.numOffsets).eq(2);
      expect(stateVariables["/a"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/a"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/a"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a"].stateValues.redundantOffsets).eq(true);
      expect(stateVariables["/a2"].stateValues.value).eqls(a);
      expect(stateVariables["/a2"].stateValues.numOffsets).eq(2);
      expect(stateVariables["/a2"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/a2"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/a2"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a2"].stateValues.redundantOffsets).eq(true);

      let b = ["periodic_set"];

      offset0 = ["-", ["/", "pi", 4]];
      offset1 = ["/", "pi", 4];
      let offset2 = ["/", ["*", 11, "pi"], 4];
      let offset3 = ["-", ["/", ["*", 11, "pi"], 4]];

      b.push(["tuple", offset0, ["*", 2, "pi"], -Infinity, Infinity]);
      b.push(["tuple", offset1, ["*", 2, "pi"], -Infinity, Infinity]);
      b.push(["tuple", offset2, ["*", 2, "pi"], -Infinity, Infinity]);
      b.push(["tuple", offset3, ["*", 2, "pi"], -Infinity, Infinity]);
      expect(stateVariables["/b"].stateValues.value).eqls(b);
      expect(stateVariables["/b"].stateValues.numOffsets).eq(4);
      expect(stateVariables["/b"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/b"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/b"].stateValues.offsets[2]).eqls(offset2);
      expect(stateVariables["/b"].stateValues.offsets[3]).eqls(offset3);
      expect(stateVariables["/b"].stateValues.redundantOffsets).eq(false);
      expect(stateVariables["/b"].stateValues.period).eqls(["*", 2, "pi"]);
      expect(stateVariables["/b2"].stateValues.value).eqls(b);
      expect(stateVariables["/b2"].stateValues.numOffsets).eq(4);
      expect(stateVariables["/b2"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/b2"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/b2"].stateValues.offsets[2]).eqls(offset2);
      expect(stateVariables["/b2"].stateValues.offsets[3]).eqls(offset3);
      expect(stateVariables["/b2"].stateValues.period).eqls(["*", 2, "pi"]);
      expect(stateVariables["/b2"].stateValues.redundantOffsets).eq(false);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
    });

    cy.log("reduce period");
    cy.get(cesc("#\\/period2") + " textarea").type(
      `{end}{backspace}{backspace}pi{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/_answer1_submit")).click();
    cy.get(cesc("#\\/_answer1_correct")).should("be.visible");

    cy.get(cesc("#\\/ca")).should("have.text", "1");

    cy.get(cesc("#\\/_p6")).should(
      "have.text",
      "Redundancies: true, true, true, true",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let offset0 = ["-", ["/", "pi", 4]];
      let offset1 = ["-", ["/", ["*", 17, "pi"], 4]];

      let a = ["periodic_set"];
      a.push(["tuple", offset0, ["/", "pi", 2], -Infinity, Infinity]);
      a.push(["tuple", offset1, ["/", "pi", 2], -Infinity, Infinity]);
      expect(stateVariables["/a"].stateValues.value).eqls(a);
      expect(stateVariables["/a"].stateValues.numOffsets).eq(2);
      expect(stateVariables["/a"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/a"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/a"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a"].stateValues.redundantOffsets).eq(true);
      expect(stateVariables["/a2"].stateValues.value).eqls(a);
      expect(stateVariables["/a2"].stateValues.numOffsets).eq(2);
      expect(stateVariables["/a2"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/a2"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/a2"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a2"].stateValues.redundantOffsets).eq(true);

      let b = ["periodic_set"];

      offset0 = ["-", ["/", "pi", 4]];
      offset1 = ["/", "pi", 4];
      let offset2 = ["/", ["*", 11, "pi"], 4];
      let offset3 = ["-", ["/", ["*", 11, "pi"], 4]];

      b.push(["tuple", offset0, "pi", -Infinity, Infinity]);
      b.push(["tuple", offset1, "pi", -Infinity, Infinity]);
      b.push(["tuple", offset2, "pi", -Infinity, Infinity]);
      b.push(["tuple", offset3, "pi", -Infinity, Infinity]);
      expect(stateVariables["/b"].stateValues.value).eqls(b);
      expect(stateVariables["/b"].stateValues.numOffsets).eq(4);
      expect(stateVariables["/b"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/b"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/b"].stateValues.offsets[2]).eqls(offset2);
      expect(stateVariables["/b"].stateValues.offsets[3]).eqls(offset3);
      expect(stateVariables["/b"].stateValues.redundantOffsets).eq(true);
      expect(stateVariables["/b"].stateValues.period).eqls("pi");
      expect(stateVariables["/b2"].stateValues.value).eqls(b);
      expect(stateVariables["/b2"].stateValues.numOffsets).eq(4);
      expect(stateVariables["/b2"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/b2"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/b2"].stateValues.offsets[2]).eqls(offset2);
      expect(stateVariables["/b2"].stateValues.offsets[3]).eqls(offset3);
      expect(stateVariables["/b2"].stateValues.period).eqls("pi");
      expect(stateVariables["/b2"].stateValues.redundantOffsets).eq(true);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
    });

    cy.log("add incorrect offset");
    cy.get(cesc("#\\/offsets2") + " textarea").type(`{end}, 0{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/_answer1_submit")).click();
    cy.get(cesc("#\\/_answer1_incorrect")).should("be.visible");

    cy.get(cesc("#\\/ca")).should("have.text", "0");

    cy.get(cesc("#\\/_p6")).should(
      "have.text",
      "Redundancies: true, true, true, true",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let offset0 = ["-", ["/", "pi", 4]];
      let offset1 = ["-", ["/", ["*", 17, "pi"], 4]];

      let a = ["periodic_set"];
      a.push(["tuple", offset0, ["/", "pi", 2], -Infinity, Infinity]);
      a.push(["tuple", offset1, ["/", "pi", 2], -Infinity, Infinity]);
      expect(stateVariables["/a"].stateValues.value).eqls(a);
      expect(stateVariables["/a"].stateValues.numOffsets).eq(2);
      expect(stateVariables["/a"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/a"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/a"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a"].stateValues.redundantOffsets).eq(true);
      expect(stateVariables["/a2"].stateValues.value).eqls(a);
      expect(stateVariables["/a2"].stateValues.numOffsets).eq(2);
      expect(stateVariables["/a2"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/a2"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/a2"].stateValues.period).eqls(["/", "pi", 2]);
      expect(stateVariables["/a2"].stateValues.redundantOffsets).eq(true);

      let b = ["periodic_set"];

      offset0 = ["-", ["/", "pi", 4]];
      offset1 = ["/", "pi", 4];
      let offset2 = ["/", ["*", 11, "pi"], 4];
      let offset3 = ["-", ["/", ["*", 11, "pi"], 4]];
      let offset4 = 0;

      b.push(["tuple", offset0, "pi", -Infinity, Infinity]);
      b.push(["tuple", offset1, "pi", -Infinity, Infinity]);
      b.push(["tuple", offset2, "pi", -Infinity, Infinity]);
      b.push(["tuple", offset3, "pi", -Infinity, Infinity]);
      b.push(["tuple", offset4, "pi", -Infinity, Infinity]);
      expect(stateVariables["/b"].stateValues.value).eqls(b);
      expect(stateVariables["/b"].stateValues.numOffsets).eq(5);
      expect(stateVariables["/b"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/b"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/b"].stateValues.offsets[2]).eqls(offset2);
      expect(stateVariables["/b"].stateValues.offsets[3]).eqls(offset3);
      expect(stateVariables["/b"].stateValues.offsets[4]).eqls(offset4);
      expect(stateVariables["/b"].stateValues.redundantOffsets).eq(true);
      expect(stateVariables["/b"].stateValues.period).eqls("pi");
      expect(stateVariables["/b2"].stateValues.value).eqls(b);
      expect(stateVariables["/b2"].stateValues.numOffsets).eq(5);
      expect(stateVariables["/b2"].stateValues.offsets[0]).eqls(offset0);
      expect(stateVariables["/b2"].stateValues.offsets[1]).eqls(offset1);
      expect(stateVariables["/b2"].stateValues.offsets[2]).eqls(offset2);
      expect(stateVariables["/b2"].stateValues.offsets[3]).eqls(offset3);
      expect(stateVariables["/b2"].stateValues.offsets[4]).eqls(offset4);
      expect(stateVariables["/b2"].stateValues.period).eqls("pi");
      expect(stateVariables["/b2"].stateValues.redundantOffsets).eq(true);

      expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
    });
  });

  it("partial credit with periodic set", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <mathlist name="correct_offsets" mergemathlists="true">30,150</mathlist>
      $correct_offsets.numComponents{assignNames="n_correct_offsets"}
      <math name="correct_period">180</math>
      <periodicSet name="correct"  offsets="$correct_offsets" period="$correct_period" />
    </setup>
    <p>What is the period?
      <answer name="period">
        <mathinput name="period_input" />
        <award><when>
          <isinteger>$period_input/$correct_period</isinteger>
        </when></award>
      </answer>
    </p>

    <p>How many offsets? 
      <answer name="number_offsets">
        <mathinput name="number_offsets_input" />
        <award><when>
          <isinteger>$number_offsets_input</isinteger>
          and
          $number_offsets_input >= $period/$correct_period*$n_correct_offsets
        </when></award>  
      </answer> 
    </p>

    <p name="offset_p">Enter the offsets:
      <map assignNames="(mi1) (mi2) (mi3) (mi4) (mi5) (mi6) (mi7) (mi8) (mi9) (mi10)">
        <template>
          <mathinput />
        </template>
        <sources>
          <sequence length="$number_offsets" />
        </sources>
      </map>
    </p>

    <mathlist name="collected_offsets" hide>
      <collect componentTypes="mathinput" prop="value" target="offset_p" />
    </mathlist>

    <setup>
      <periodicSet offsets="$collected_offsets" period="$period" name="userPeriodicSet" />
      <conditionalContent hide assignNames="(maxCreditRedund)">
        <case condition="$(userPeriodicSet.redundantOffsets)">
          <number>0.8</number>
        </case>
        <else>
          <number>1</number>
        </else>
      </conditionalContent>
    </setup>
    
    <answer>
      <award>
        <when matchpartial="true">
          $userPeriodicSet = $correct
        </when>
      </award>
    </answer>


    <p>Answer when penalizing redundant offsets: 
      <answer>
        <award credit="$maxCreditRedund">
          <when matchPartial>
            $userPeriodicSet = $correct
          </when>
        </award>
        <award name="redund" credit="0">
          <when>$userPeriodicSet.redundantOffsets</when>
        </award>
        <considerAsResponses>
          $p$o
        </considerAsResponses>
      </answer>
    </p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_p1")).should("contain.text", "What is the period?");

    cy.log("partially correct answer");
    cy.get(cesc("#\\/period_input") + " textarea").type("360{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/period_input_correct")).should("be.visible");

    cy.get(cesc("#\\/number_offsets_input") + " textarea").type("4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/number_offsets_input_correct")).should("be.visible");

    cy.get(cesc("#\\/mi1") + " textarea")
      .type("30", { force: true })
      .blur();
    cy.get(cesc("#\\/mi2") + " textarea")
      .type("150", { force: true })
      .blur();
    cy.get(cesc("#\\/mi3") + " textarea")
      .type("210", { force: true })
      .blur();
    cy.get(cesc("#\\/mi4") + " textarea")
      .type("211", { force: true })
      .blur();

    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "75");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("75% correct");
      });

    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "75");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("75% correct");
      });

    cy.log("correct answer");

    cy.get(cesc("#\\/mi4") + " textarea")
      .type("{ctrl+home}{shift+end}{backspace}-30", { force: true })
      .blur();

    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_correct")).should("be.visible");

    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_correct")).should("be.visible");

    cy.log("add extraneous answer blanks");
    cy.get(cesc("#\\/number_offsets_input") + " textarea").type(
      "{end}{backspace}10",
      { force: true },
    );
    cy.get(cesc("#\\/number_offsets_input_submit")).should("be.visible");
    cy.get(cesc("#\\/number_offsets_input") + " textarea").type("{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/number_offsets_input_correct")).should("be.visible");

    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "40");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("40% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "40");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("40% correct");
      });

    cy.log("add in a duplicate");
    cy.get(cesc("#\\/mi5") + " textarea")
      .type("330", { force: true })
      .blur();
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "50");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "40");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("40% correct");
      });

    cy.log("fill in with duplicates");
    cy.get(cesc("#\\/mi6") + " textarea")
      .type("330", { force: true })
      .blur();
    cy.get(cesc("#\\/mi7") + " textarea")
      .type("330", { force: true })
      .blur();
    cy.get(cesc("#\\/mi8") + " textarea")
      .type("330", { force: true })
      .blur();
    cy.get(cesc("#\\/mi9") + " textarea")
      .type("330", { force: true })
      .blur();
    cy.get(cesc("#\\/mi10") + " textarea")
      .type("330", { force: true })
      .blur();
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_correct")).should("be.visible");
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "80");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("80% correct");
      });

    cy.log("too few answer blanks");
    cy.get(cesc("#\\/number_offsets_input") + " textarea").type(
      "{end}{backspace}{backspace}3",
      { force: true },
    );
    cy.get(cesc("#\\/number_offsets_input_submit")).click();
    cy.get(cesc("#\\/number_offsets_input_incorrect")).should("be.visible");
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "75");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("75% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "75");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("75% correct");
      });

    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{ctrl+home}{shift+end}{backspace}100", { force: true })
      .blur();
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "50");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "50");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });

    cy.log("even fewer answer blanks");
    cy.get(cesc("#\\/number_offsets_input") + " textarea").type(
      "{end}{backspace}2",
      { force: true },
    );
    cy.get(cesc("#\\/number_offsets_input_submit")).click();
    cy.get(cesc("#\\/number_offsets_input_incorrect")).should("be.visible");
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "50");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "50");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });

    cy.log("change period");
    cy.get(cesc("#\\/period_input") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}180",
      { force: true },
    );
    cy.get(cesc("#\\/period_input_submit")).click();
    cy.get(cesc("#\\/period_input_correct")).should("be.visible");
    cy.get(cesc("#\\/number_offsets_input_submit")).click();
    cy.get(cesc("#\\/number_offsets_input_correct")).should("be.visible");
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_correct")).should("be.visible");
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_correct")).should("be.visible");

    cy.log("additional answer blanks");
    cy.get(cesc("#\\/number_offsets_input") + " textarea").type(
      "{end}{backspace}3",
      { force: true },
    );
    cy.get(cesc("#\\/number_offsets_input_submit")).click();
    cy.get(cesc("#\\/number_offsets_input_correct")).should("be.visible");
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "67");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("67% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "67");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("67% correct");
      });

    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{ctrl+home}{shift+end}{backspace}330", { force: true })
      .blur();
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_correct")).should("be.visible");
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "80");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("80% correct");
      });

    cy.log("change period");
    cy.get(cesc("#\\/period_input") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}90",
      { force: true },
    );
    cy.get(cesc("#\\/period_input_submit")).click();
    cy.get(cesc("#\\/period_input_incorrect")).should("be.visible");
    cy.get(cesc("#\\/number_offsets_input_submit")).click();
    cy.get(cesc("#\\/number_offsets_input_correct")).should("be.visible");
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "50");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "40");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("40% correct");
      });

    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{ctrl+home}{shift+end}{backspace}100", { force: true })
      .blur();
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "33");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("33% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "33");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("33% correct");
      });

    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{ctrl+home}{shift+end}{backspace}150", { force: true })
      .blur();
    cy.get(cesc("#\\/_answer3_submit")).click();
    cy.get(cesc("#\\/_answer3_partial")).should("contain.text", "50");
    cy.get(cesc("#\\/_answer3_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("50% correct");
      });
    cy.get(cesc("#\\/_answer4_submit")).click();
    cy.get(cesc("#\\/_answer4_partial")).should("contain.text", "40");
    cy.get(cesc("#\\/_answer4_partial"))
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).equal("40% correct");
      });
  });

  it("display periodic set as list", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Period: <mathinput name="period" /></p>
    <p>Offsets: <mathinput name="offsets" /></p>

    <periodicSet period="$period" offsets="$offsets" name="pset" />
  
    <p>As list: $pset.asList{assignNames="l1"}</p>

    <p>Min index: <mathinput name="minIndex" />, <mathinput name="maxIndex" /></p>

    <periodicSet period="$period" offsets="$offsets" name="pset2" minIndexAsList="$minIndex" maxIndexAsList="$maxIndex" />

    <p>As list with specified min/max: $pset2.asList{assignNames="l2"}</p>

    <p>$offsets.value{assignNames="offsets2"}</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/l1")).should("not.exist");
    cy.get(cesc("#\\/l2")).should("not.exist");

    cy.get(cesc("#\\/period") + " textarea").type("7{enter}", { force: true });
    cy.get(cesc("#\\/offsets") + " textarea").type("1{enter}", { force: true });

    cy.get(cesc("#\\/l1")).should("contain.text", "…,−6,1,8,…");
    cy.get(cesc("#\\/l1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,−6,1,8,…");
      });
    cy.get(cesc("#\\/l2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,−6,1,8,…");
      });

    cy.get(cesc("#\\/minIndex") + " textarea").type("3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/l2")).should("contain.text", "…,…");
    cy.get(cesc("#\\/l2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,…");
      });
    cy.get(cesc("#\\/maxIndex") + " textarea").type("6{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/l2")).should("contain.text", "…,22,29,36,43,…");
    cy.get(cesc("#\\/l2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,22,29,36,43,…");
      });

    cy.get(cesc("#\\/offsets") + " textarea").type("{end},3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/offsets2")).should("contain.text", "1,3");
    cy.get(cesc("#\\/l1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,−6,−4,1,3,8,10,…");
      });
    cy.get(cesc("#\\/l2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,22,24,29,31,36,38,43,45,…");
      });

    cy.get(cesc("#\\/offsets") + " textarea").type(
      "{end}{backspace}{backspace}{leftArrow}3,{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/offsets2")).should("contain.text", "3,1");
    cy.get(cesc("#\\/l1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,−6,−4,1,3,8,10,…");
      });
    cy.get(cesc("#\\/l2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,22,24,29,31,36,38,43,45,…");
      });

    cy.get(cesc("#\\/offsets") + " textarea").type("{end},8{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/offsets2")).should("contain.text", "3,1,8");

    cy.get(cesc("#\\/l1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,−6,−4,1,3,8,10,…");
      });
    cy.get(cesc("#\\/l2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,22,24,29,31,36,38,43,45,…");
      });

    cy.get(cesc("#\\/offsets") + " textarea").type("{end},79{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/offsets2")).should("contain.text", "3,1,8,79");
    cy.get(cesc("#\\/l1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,−6,−5,−4,1,2,3,8,9,10,…");
      });
    cy.get(cesc("#\\/l2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("…,22,23,24,29,30,31,36,37,38,43,44,45,…");
      });
  });
});
