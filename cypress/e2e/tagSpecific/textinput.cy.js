import { cesc } from "../../../../src/utils/url";

function cesc2(s) {
  return cesc(cesc(s));
}

describe("TextInput Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("textinput references", () => {
    // A fairly involved test
    // to check for bugs that have shown up only after multiple manipulations

    // Initial doenet code

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <textinput prefill='hello' name="ti1" />
    <textinput copySource="ti1" name="ti1a" />
    $ti1.value{assignNames="v1"}
    $ti1.immediateValue{assignNames="iv1"}
    $ti1a.value{assignNames="v1a"}
    $ti1a.immediateValue{assignNames="iv1a"}
    <textinput name="ti2" />
    $ti2.value{assignNames="v2"}
    $ti2.immediateValue{assignNames="iv2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "hello");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "hello");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "");

    cy.get(cesc("#\\/v1")).should("have.text", "hello");
    cy.get(cesc("#\\/iv1")).should("have.text", "hello");
    cy.get(cesc("#\\/v1a")).should("have.text", "hello");
    cy.get(cesc("#\\/iv1a")).should("have.text", "hello");
    cy.get(cesc("#\\/v2")).should("have.text", "");
    cy.get(cesc("#\\/iv2")).should("have.text", "");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
      expect(stateVariables["/ti1"].stateValues.value).eq("hello");
      expect(stateVariables["/ti1a"].stateValues.value).eq("hello");
      expect(stateVariables["/ti2"].stateValues.value).eq("");
    });

    // type 2 in first input

    cy.log("Typing 2 in first textinput");
    cy.get(cesc("#\\/ti1_input")).type(`2`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "hello2");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "hello2");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "");

    cy.get(cesc("#\\/v1")).should("have.text", "hello");
    cy.get(cesc("#\\/iv1")).should("have.text", "hello2");
    cy.get(cesc("#\\/v1a")).should("have.text", "hello");
    cy.get(cesc("#\\/iv1a")).should("have.text", "hello2");
    cy.get(cesc("#\\/v2")).should("have.text", "");
    cy.get(cesc("#\\/iv2")).should("have.text", "");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello2");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello2");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
      expect(stateVariables["/ti1"].stateValues.value).eq("hello");
      expect(stateVariables["/ti1a"].stateValues.value).eq("hello");
      expect(stateVariables["/ti2"].stateValues.value).eq("");
    });

    // press enter in first input

    cy.log("Pressing Enter in first textinput");
    cy.get(cesc("#\\/ti1_input")).type(`{enter}`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "hello2");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "hello2");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "");

    cy.get(cesc("#\\/v1")).should("have.text", "hello2");
    cy.get(cesc("#\\/iv1")).should("have.text", "hello2");
    cy.get(cesc("#\\/v1a")).should("have.text", "hello2");
    cy.get(cesc("#\\/iv1a")).should("have.text", "hello2");
    cy.get(cesc("#\\/v2")).should("have.text", "");
    cy.get(cesc("#\\/iv2")).should("have.text", "");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello2");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("hello2");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
      expect(stateVariables["/ti1"].stateValues.value).eq("hello2");
      expect(stateVariables["/ti1a"].stateValues.value).eq("hello2");
      expect(stateVariables["/ti2"].stateValues.value).eq("");
    });

    // erase "2" and type " you" in second input

    cy.log(`Erasing "2" and typing " you" in second textinput`);
    cy.get(cesc("#\\/ti1a_input")).type(`{backspace} you`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "hello you");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "hello you");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "");

    cy.get(cesc("#\\/v1")).should("have.text", "hello2");
    cy.get(cesc("#\\/iv1")).should("have.text", "hello you");
    cy.get(cesc("#\\/v1a")).should("have.text", "hello2");
    cy.get(cesc("#\\/iv1a")).should("have.text", "hello you");
    cy.get(cesc("#\\/v2")).should("have.text", "");
    cy.get(cesc("#\\/iv2")).should("have.text", "");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello you");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq(
        "hello you",
      );
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
      expect(stateVariables["/ti1"].stateValues.value).eq("hello2");
      expect(stateVariables["/ti1a"].stateValues.value).eq("hello2");
      expect(stateVariables["/ti2"].stateValues.value).eq("");
    });

    // change focus to textinput 1
    cy.log("Changing focus to first textinput");
    cy.get(cesc("#\\/ti1_input")).focus();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "hello you");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "hello you");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "");

    cy.get(cesc("#\\/v1")).should("have.text", "hello you");
    cy.get(cesc("#\\/iv1")).should("have.text", "hello you");
    cy.get(cesc("#\\/v1a")).should("have.text", "hello you");
    cy.get(cesc("#\\/iv1a")).should("have.text", "hello you");
    cy.get(cesc("#\\/v2")).should("have.text", "");
    cy.get(cesc("#\\/iv2")).should("have.text", "");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello you");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq(
        "hello you",
      );
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("");
      expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
      expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
      expect(stateVariables["/ti2"].stateValues.value).eq("");
    });

    // bye in third input

    cy.log(`Typing "bye" in third textinput`);
    cy.get(cesc("#\\/ti2_input")).type(`bye`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "hello you");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "hello you");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "bye");

    cy.get(cesc("#\\/v1")).should("have.text", "hello you");
    cy.get(cesc("#\\/iv1")).should("have.text", "hello you");
    cy.get(cesc("#\\/v1a")).should("have.text", "hello you");
    cy.get(cesc("#\\/iv1a")).should("have.text", "hello you");
    cy.get(cesc("#\\/v2")).should("have.text", "");
    cy.get(cesc("#\\/iv2")).should("have.text", "bye");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello you");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq(
        "hello you",
      );
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
      expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
      expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
      expect(stateVariables["/ti2"].stateValues.value).eq("");
    });

    // press enter in textinput 3

    cy.log("Pressing enter in third textinput");
    cy.get(cesc("#\\/ti2_input")).type(`{enter}`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "hello you");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "hello you");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "bye");

    cy.get(cesc("#\\/v1")).should("have.text", "hello you");
    cy.get(cesc("#\\/iv1")).should("have.text", "hello you");
    cy.get(cesc("#\\/v1a")).should("have.text", "hello you");
    cy.get(cesc("#\\/iv1a")).should("have.text", "hello you");
    cy.get(cesc("#\\/v2")).should("have.text", "bye");
    cy.get(cesc("#\\/iv2")).should("have.text", "bye");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("hello you");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq(
        "hello you",
      );
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
      expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
      expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
      expect(stateVariables["/ti2"].stateValues.value).eq("bye");
    });

    // type abc enter in textinput 2

    cy.log("Typing abc in second textinput");
    cy.get(cesc("#\\/ti1a_input")).clear().type(`abc`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abc");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abc");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "bye");

    cy.get(cesc("#\\/v1")).should("have.text", "hello you");
    cy.get(cesc("#\\/iv1")).should("have.text", "abc");
    cy.get(cesc("#\\/v1a")).should("have.text", "hello you");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abc");
    cy.get(cesc("#\\/v2")).should("have.text", "bye");
    cy.get(cesc("#\\/iv2")).should("have.text", "bye");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
      expect(stateVariables["/ti1"].stateValues.value).eq("hello you");
      expect(stateVariables["/ti1a"].stateValues.value).eq("hello you");
      expect(stateVariables["/ti2"].stateValues.value).eq("bye");
    });

    // press enter in textinput 2

    cy.log("Pressing enter in second textinput");
    cy.get(cesc("#\\/ti1a_input")).type(`{enter}`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abc");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abc");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "bye");

    cy.get(cesc("#\\/v1")).should("have.text", "abc");
    cy.get(cesc("#\\/iv1")).should("have.text", "abc");
    cy.get(cesc("#\\/v1a")).should("have.text", "abc");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abc");
    cy.get(cesc("#\\/v2")).should("have.text", "bye");
    cy.get(cesc("#\\/iv2")).should("have.text", "bye");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
      expect(stateVariables["/ti1"].stateValues.value).eq("abc");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
      expect(stateVariables["/ti2"].stateValues.value).eq("bye");
    });

    // type abc in textinput 1

    cy.log("Typing abc in first textinput");
    cy.get(cesc("#\\/ti1_input")).clear().type(`abc`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abc");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abc");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "bye");

    cy.get(cesc("#\\/v1")).should("have.text", "abc");
    cy.get(cesc("#\\/iv1")).should("have.text", "abc");
    cy.get(cesc("#\\/v1a")).should("have.text", "abc");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abc");
    cy.get(cesc("#\\/v2")).should("have.text", "bye");
    cy.get(cesc("#\\/iv2")).should("have.text", "bye");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("bye");
      expect(stateVariables["/ti1"].stateValues.value).eq("abc");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
      expect(stateVariables["/ti2"].stateValues.value).eq("bye");
    });

    // type saludos in textinput 3

    cy.log("Typing saludos in third textinput");
    cy.get(cesc("#\\/ti2_input")).clear().type(`saludos`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abc");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abc");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abc");
    cy.get(cesc("#\\/iv1")).should("have.text", "abc");
    cy.get(cesc("#\\/v1a")).should("have.text", "abc");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abc");
    cy.get(cesc("#\\/v2")).should("have.text", "bye");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abc");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abc");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abc");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
      expect(stateVariables["/ti2"].stateValues.value).eq("bye");
    });

    // type d in textinput 1

    cy.log("Typing d in first textinput");
    cy.get(cesc("#\\/ti1_input")).type(`d`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abcd");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abcd");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abc");
    cy.get(cesc("#\\/iv1")).should("have.text", "abcd");
    cy.get(cesc("#\\/v1a")).should("have.text", "abc");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abcd");
    cy.get(cesc("#\\/v2")).should("have.text", "saludos");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcd");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcd");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abc");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abc");
      expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });

    cy.log("Typing enter in first textinput");
    cy.get(cesc("#\\/ti1_input")).type(`{enter}`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abcd");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abcd");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abcd");
    cy.get(cesc("#\\/iv1")).should("have.text", "abcd");
    cy.get(cesc("#\\/v1a")).should("have.text", "abcd");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abcd");
    cy.get(cesc("#\\/v2")).should("have.text", "saludos");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcd");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcd");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abcd");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abcd");
      expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });

    cy.log("Clearing second textinput");
    cy.get(cesc("#\\/ti1a_input")).clear();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abcd");
    cy.get(cesc("#\\/iv1")).should("have.text", "");
    cy.get(cesc("#\\/v1a")).should("have.text", "abcd");
    cy.get(cesc("#\\/iv1a")).should("have.text", "");
    cy.get(cesc("#\\/v2")).should("have.text", "saludos");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abcd");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abcd");
      expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });

    cy.log("pressing escape to undo");
    cy.get(cesc("#\\/ti1a_input")).type(`{esc}`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abcd");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abcd");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abcd");
    cy.get(cesc("#\\/iv1")).should("have.text", "abcd");
    cy.get(cesc("#\\/v1a")).should("have.text", "abcd");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abcd");
    cy.get(cesc("#\\/v2")).should("have.text", "saludos");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcd");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcd");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abcd");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abcd");
      expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });

    cy.log("Type e in second textinput");
    cy.get(cesc("#\\/ti1a_input")).type(`e`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abcde");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abcde");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abcd");
    cy.get(cesc("#\\/iv1")).should("have.text", "abcde");
    cy.get(cesc("#\\/v1a")).should("have.text", "abcd");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abcde");
    cy.get(cesc("#\\/v2")).should("have.text", "saludos");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcde");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcde");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abcd");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abcd");
      expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });

    cy.log("Escape in first input doesn't undo");
    cy.get(cesc("#\\/ti1_input")).type(`{Esc}`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abcde");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abcde");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abcde");
    cy.get(cesc("#\\/iv1")).should("have.text", "abcde");
    cy.get(cesc("#\\/v1a")).should("have.text", "abcde");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abcde");
    cy.get(cesc("#\\/v2")).should("have.text", "saludos");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcde");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcde");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abcde");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abcde");
      expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });

    cy.log("Delete characters and replace in first input");
    cy.get(cesc("#\\/ti1_input")).type(`{backspace}{backspace}f`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abcf");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abcf");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abcde");
    cy.get(cesc("#\\/iv1")).should("have.text", "abcf");
    cy.get(cesc("#\\/v1a")).should("have.text", "abcde");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abcf");
    cy.get(cesc("#\\/v2")).should("have.text", "saludos");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcf");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcf");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abcde");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abcde");
      expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });

    cy.log("Undo with escape");
    cy.get(cesc("#\\/ti1_input")).type(`{Esc}`);

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "abcde");
    cy.get(cesc("#\\/ti1a_input")).should("have.value", "abcde");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "saludos");

    cy.get(cesc("#\\/v1")).should("have.text", "abcde");
    cy.get(cesc("#\\/iv1")).should("have.text", "abcde");
    cy.get(cesc("#\\/v1a")).should("have.text", "abcde");
    cy.get(cesc("#\\/iv1a")).should("have.text", "abcde");
    cy.get(cesc("#\\/v2")).should("have.text", "saludos");
    cy.get(cesc("#\\/iv2")).should("have.text", "saludos");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.immediateValue).eq("abcde");
      expect(stateVariables["/ti1a"].stateValues.immediateValue).eq("abcde");
      expect(stateVariables["/ti2"].stateValues.immediateValue).eq("saludos");
      expect(stateVariables["/ti1"].stateValues.value).eq("abcde");
      expect(stateVariables["/ti1a"].stateValues.value).eq("abcde");
      expect(stateVariables["/ti2"].stateValues.value).eq("saludos");
    });
  });

  it("downstream from textinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput bindValueTo="$_text1" /></p>
    <p>Copied textinput: <textInput copySource="_textinput1" name="textinput2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "hello there");

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "hello there");
    cy.get(cesc("#\\/textinput2_input")).should("have.value", "hello there");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "hello there",
      );
      expect(stateVariables["/_text1"].stateValues.value).eq("hello there");
      expect(stateVariables["/textinput2"].stateValues.value).eq("hello there");
      expect(stateVariables["/textinput2"].stateValues.immediateValue).eq(
        "hello there",
      );
    });

    cy.log("enter new values");
    cy.get(cesc("#\\/_textinput1_input")).clear().type(`bye now{enter}`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/textinput2_input")).should("have.value", "bye now");

    cy.get(cesc("#\\/_text1")).should("have.text", "bye now");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq("bye now");
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_text1"].stateValues.value).eq("bye now");
      expect(stateVariables["/textinput2"].stateValues.value).eq("bye now");
      expect(stateVariables["/textinput2"].stateValues.immediateValue).eq(
        "bye now",
      );
    });

    cy.log("prefill ignored");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput prefill="bye now" bindValueTo="$_text1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "hello there");

    cy.get(cesc("#\\/_text1")).should("have.text", "hello there");

    cy.log("values revert if not updatable");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Original text: <text>can't <text>update</text> <text>me</text></text></p>
    <p>textinput based on text: <textinput bindValueTo="$_text1" /></p>
    <p>immediate value: $_textinput1.immediateValue{assignNames="iv"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_textinput1_input")).should(
      "have.value",
      `can't update me`,
    );

    cy.get(cesc("#\\/_text1")).should("have.text", `can't update me`);

    cy.get(cesc("#\\/iv")).should("have.text", `can't update me`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        `can't update me`,
      );
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        `can't update me`,
      );
      expect(stateVariables["/_text1"].stateValues.value).eq(`can't update me`);
    });

    cy.log("enter new values");
    cy.get(cesc("#\\/_textinput1_input")).clear().type(`disappear`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", `disappear`);

    cy.get(cesc("#\\/_text1")).should("have.text", `can't update me`);

    cy.get(cesc("#\\/iv")).should("have.text", `disappear`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        `can't update me`,
      );
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        `disappear`,
      );
      expect(stateVariables["/_text1"].stateValues.value).eq(`can't update me`);
    });

    cy.log("values revert when press enter");
    cy.get(cesc("#\\/_textinput1_input")).type(`{enter}`);

    cy.get(cesc("#\\/_textinput1_input")).should(
      "have.value",
      `can't update me`,
    );

    cy.get(cesc("#\\/_text1")).should("have.text", `can't update me`);

    cy.get(cesc("#\\/iv")).should("have.text", `can't update me`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        `can't update me`,
      );
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        `can't update me`,
      );
      expect(stateVariables["/_text1"].stateValues.value).eq(`can't update me`);
    });
  });

  it("downstream from textinput via child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput>$_text1</textinput></p>
    <p>Copied textinput: <textInput copySource="_textinput1" name="textinput2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "hello there");

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "hello there");
    cy.get(cesc("#\\/textinput2_input")).should("have.value", "hello there");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "hello there",
      );
      expect(stateVariables["/_text1"].stateValues.value).eq("hello there");
      expect(stateVariables["/textinput2"].stateValues.value).eq("hello there");
      expect(stateVariables["/textinput2"].stateValues.immediateValue).eq(
        "hello there",
      );
    });

    cy.log("enter new values");
    cy.get(cesc("#\\/_textinput1_input")).clear().type(`bye now{enter}`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/textinput2_input")).should("have.value", "bye now");

    cy.get(cesc("#\\/_text1")).should("have.text", "bye now");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq("bye now");
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_text1"].stateValues.value).eq("bye now");
      expect(stateVariables["/textinput2"].stateValues.value).eq("bye now");
      expect(stateVariables["/textinput2"].stateValues.immediateValue).eq(
        "bye now",
      );
    });

    cy.log("prefill ignored");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Original text: <text>hello there</text></p>
    <p>textinput based on text: <textinput prefill="bye now">$_text1</textinput></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "hello there");

    cy.get(cesc("#\\/_text1")).should("have.text", "hello there");

    cy.log("prefill ignored, use string child");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>textinput based on text: <textinput prefill="bye now">Good morning</textinput></p>
    <p>value: <text copySource="_textinput1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "Good morning");

    cy.get(cesc("#\\/_text1")).should("have.text", "Good morning");

    cy.log("enter new values");
    cy.get(cesc("#\\/_textinput1_input")).clear().type(`Good night{enter}`);

    cy.get(cesc("#\\/_text1")).should("have.text", "Good night");

    cy.log("bindvalue ignored, use string child");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Ignore me: <text>ignore</text></p>
    <p>textinput based on text: <textinput bindValueTo="$_text1">Override with this</textinput></p>
    <p>value: <text copySource="_textinput1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_textinput1_input")).should(
      "have.value",
      "Override with this",
    );

    cy.get(cesc("#\\/_text1")).should("have.text", "ignore");
    cy.get(cesc("#\\/_text2")).should("have.text", "Override with this");

    cy.log("enter new values");
    cy.get(cesc("#\\/_textinput1_input")).clear().type(`Changed{enter}`);

    cy.get(cesc("#\\/_text1")).should("have.text", "ignore");
    cy.get(cesc("#\\/_text2")).should("have.text", "Changed");

    cy.log("values revert if not updatable");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Original text: <text>update</text></p>
    <p>textinput based on text: <textinput>can't $_text1 me</textinput></p>
    <p>immediate value: $_textinput1.immediateValue{assignNames="iv"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_textinput1_input")).should(
      "have.value",
      `can't update me`,
    );

    cy.get(cesc("#\\/_text1")).should("have.text", `update`);

    cy.get(cesc("#\\/iv")).should("have.text", `can't update me`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        `can't update me`,
      );
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        `can't update me`,
      );
      expect(stateVariables["/_text1"].stateValues.value).eq(`update`);
    });

    cy.log("enter new values");
    cy.get(cesc("#\\/_textinput1_input")).clear().type(`disappear`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", `disappear`);

    cy.get(cesc("#\\/_text1")).should("have.text", `update`);

    cy.get(cesc("#\\/iv")).should("have.text", `disappear`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        `can't update me`,
      );
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        `disappear`,
      );
      expect(stateVariables["/_text1"].stateValues.value).eq(`update`);
    });

    cy.log("values revert when press enter");
    cy.get(cesc("#\\/_textinput1_input")).type(`{enter}`);

    cy.get(cesc("#\\/_textinput1_input")).should(
      "have.value",
      `can't update me`,
    );

    cy.get(cesc("#\\/_text1")).should("have.text", `update`);

    cy.get(cesc("#\\/iv")).should("have.text", `can't update me`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        `can't update me`,
      );
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        `can't update me`,
      );
      expect(stateVariables["/_text1"].stateValues.value).eq(`update`);
    });
  });

  it("textinput based on value of textinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Original textinput: <textinput prefill="hello there"/></p>
    <p>textinput based on textinput: <textinput bindValueTo="$_textinput1" /></p>
    <p>Immediate value of original: <text name="originalimmediate">$_textinput1.immediateValue</text></p>
    <p>Value of original: <text name="originalvalue">$_textinput1.value</text></p>
    <p>Immediate value of second: <text name="secondimmediate">$_textinput2.immediateValue</text></p>
    <p>Value of second: <text name="secondvalue">$_textinput2.value</text></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "hello there");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "hello there");

    cy.get(cesc("#\\/originalimmediate")).should("have.text", "hello there");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "hello there");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "hello there");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "hello there");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq(
        "hello there",
      );
    });

    cy.log("type new values in first textinput");
    cy.get(cesc("#\\/_textinput1_input")).clear().type(`bye now`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "hello there");

    cy.get(cesc("#\\/originalimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "hello there");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "hello there");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "hello there");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq(
        "hello there",
      );
    });

    cy.log("press enter");
    cy.get(cesc("#\\/_textinput1_input")).type(`{enter}`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "bye now");

    cy.get(cesc("#\\/originalimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "bye now");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "bye now");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq("bye now");
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq("bye now");
    });

    cy.log("type values input second textinput");
    cy.get(cesc("#\\/_textinput2_input")).clear().type(`Hello again`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "Hello again");

    cy.get(cesc("#\\/originalimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "bye now");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "Hello again");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "bye now");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq("bye now");
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "Hello again",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq("bye now");
    });

    cy.log("leave second textinput");
    cy.get(cesc("#\\/_textinput2_input")).blur();

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "Hello again");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "Hello again");

    cy.get(cesc("#\\/originalimmediate")).should("have.text", "Hello again");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "Hello again");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "Hello again");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "Hello again");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "Hello again",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        "Hello again",
      );
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "Hello again",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq(
        "Hello again",
      );
    });
  });

  it("textinput based on immediateValue of textinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p>Original textinput: <textinput prefill="hello there"/></p>
    <p>textinput based on textinput: <textinput bindValueTo="$(_textinput1.immediateValue)" /></p>
    <p>Immediate value of original: <text name="originalimmediate">$_textinput1.immediateValue</text></p>
    <p>Value of original: <text name="originalvalue">$_textinput1.value</text></p>
    <p>Immediate value of second: <text name="secondimmediate">$_textinput2.immediateValue</text></p>
    <p>Value of second: <text name="secondvalue">$_textinput2.value</text></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "hello there");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "hello there");
    cy.get(cesc("#\\/originalimmediate")).should("have.text", "hello there");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "hello there");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "hello there");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "hello there");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq(
        "hello there",
      );
    });

    cy.log("type new values in first textinput");
    cy.get(cesc("#\\/_textinput1_input")).clear().type(`bye now`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/originalimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "hello there");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "bye now");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        "hello there",
      );
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq("bye now");
    });

    cy.log("press enter");
    cy.get(cesc("#\\/_textinput1_input")).type(`{enter}`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/originalimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "bye now");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "bye now");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq("bye now");
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq("bye now");
    });

    cy.log("type values in second textinput");
    cy.get(cesc("#\\/_textinput2_input")).clear().type(`Hello again`);

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "bye now");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "Hello again");
    cy.get(cesc("#\\/originalimmediate")).should("have.text", "bye now");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "bye now");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "Hello again");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "bye now");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "bye now",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq("bye now");
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "Hello again",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq("bye now");
    });

    cy.log("leave second textinput, changes all values");
    cy.get(cesc("#\\/_textinput2_input")).blur();

    cy.get(cesc("#\\/_textinput1_input")).should("have.value", "Hello again");
    cy.get(cesc("#\\/_textinput2_input")).should("have.value", "Hello again");
    cy.get(cesc("#\\/originalimmediate")).should("have.text", "Hello again");
    cy.get(cesc("#\\/originalvalue")).should("have.text", "Hello again");
    cy.get(cesc("#\\/secondimmediate")).should("have.text", "Hello again");
    cy.get(cesc("#\\/secondvalue")).should("have.text", "Hello again");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_textinput1"].stateValues.immediateValue).eq(
        "Hello again",
      );
      expect(stateVariables["/_textinput1"].stateValues.value).eq(
        "Hello again",
      );
      expect(stateVariables["/_textinput2"].stateValues.immediateValue).eq(
        "Hello again",
      );
      expect(stateVariables["/_textinput2"].stateValues.value).eq(
        "Hello again",
      );
    });
  });

  it("chain update off textinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <textinput name="ti" />
    $ti.immediateValue{assignNames="iv"}

    <text name="h">hello</text>
    <updateValue triggerWith="ti" target="h" newValue="$h$ti" type="text" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/h")).should("have.text", "hello");

    cy.get(cesc("#\\/ti_input")).type(" bye");
    cy.get(cesc("#\\/iv")).should("have.text", " bye");
    cy.get(cesc("#\\/h")).should("have.text", "hello");

    cy.get(cesc("#\\/ti_input")).clear().type(" there");
    cy.get(cesc("#\\/iv")).should("have.text", " there");
    cy.get(cesc("#\\/h")).should("have.text", "hello");

    cy.get(cesc("#\\/ti_input")).blur();
    cy.get(cesc("#\\/iv")).should("have.text", " there");
    cy.get(cesc("#\\/h")).should("have.text", "hello there");

    cy.get(cesc("#\\/ti_input")).clear().type("?");
    cy.get(cesc("#\\/iv")).should("have.text", "?");
    cy.get(cesc("#\\/h")).should("have.text", "hello there");

    cy.get(cesc("#\\/ti_input")).clear().type("!");
    cy.get(cesc("#\\/iv")).should("have.text", "!");
    cy.get(cesc("#\\/h")).should("have.text", "hello there");

    cy.get(cesc("#\\/ti_input")).type("{enter}");
    cy.get(cesc("#\\/iv")).should("have.text", "!");
    cy.get(cesc("#\\/h")).should("have.text", "hello there!");
  });

  it("expanded textinput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <textinput name="ti" expanded />

    <p>$ti</p>
    <p>$(ti.immediateValue)</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/ti_input")).type("hello");
    cy.get(cesc("#\\/ti_input")).should("have.value", "hello");
    cy.get(cesc("#\\/_p2")).should("have.text", "hello");
    cy.get(cesc("#\\/_p1")).should("have.text", "");

    cy.get(cesc("#\\/ti_input")).blur();
    cy.get(cesc("#\\/ti_input")).should("have.value", "hello");
    cy.get(cesc("#\\/_p2")).should("have.text", "hello");
    cy.get(cesc("#\\/_p1")).should("have.text", "hello");

    cy.get(cesc("#\\/ti_input")).type("{enter}bye{enter}");
    cy.get(cesc("#\\/ti_input")).should("have.value", "hello\nbye\n");
    cy.get(cesc("#\\/_p2")).should("have.text", "hello\nbye\n");
    cy.get(cesc("#\\/_p1")).should("have.text", "hello\nbye");

    cy.get(cesc("#\\/ti_input")).blur();
    cy.get(cesc("#\\/ti_input")).should("have.value", "hello\nbye\n");
    cy.get(cesc("#\\/_p2")).should("have.text", "hello\nbye\n");
    cy.get(cesc("#\\/_p1")).should("have.text", "hello\nbye\n");

    cy.get(cesc("#\\/ti_input")).type("{moveToStart}new{enter}old{enter}");
    cy.get(cesc("#\\/ti_input")).should("have.value", "new\nold\nhello\nbye\n");
    cy.get(cesc("#\\/_p2")).should("have.text", "new\nold\nhello\nbye\n");
    cy.get(cesc("#\\/_p1")).should("have.text", "new\noldhello\nbye\n");

    cy.get(cesc("#\\/ti_input")).blur();
    cy.get(cesc("#\\/ti_input")).should("have.value", "new\nold\nhello\nbye\n");
    cy.get(cesc("#\\/_p2")).should("have.text", "new\nold\nhello\nbye\n");
    cy.get(cesc("#\\/_p1")).should("have.text", "new\nold\nhello\nbye\n");
  });

  it("set value from immediateValue on reload", () => {
    let doenetML = `
    <p><textinput name="ti" /></p>

    <p name="pv">value: $ti</p>
    <p name="piv">immediate value: $ti.immediateValue</p>
    `;

    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/ti_input")).type("hello");

    cy.get(cesc("#\\/piv")).should("have.text", "immediate value: hello");
    cy.get(cesc("#\\/pv")).should("have.text", "value: ");

    cy.wait(1500); // wait for debounce

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/pv")).should("have.text", "value: hello");
    cy.get(cesc("#\\/piv")).should("have.text", "immediate value: hello");
  });

  it("text input in graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph >
      <textinput anchor="$anchorCoords1" name="textinput1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1"><label>input 1</label></textinput>
      <textinput name="textinput2"><label>input 2</label></textinput>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $textinput1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $textinput2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$textinput2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $textinput1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $textinput2.positionFromAnchor</p>
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
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$textinput2.positionFromAnchor">
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
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$textinput2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$textinput2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$textinput2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$textinput2.fixLocation" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    `,
        },
        "*",
      );
    });

    // TODO: how to click on the checkboxes and test if they are disabled?

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: upperright",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: center",
    );
    cy.get(cesc("#\\/positionFromAnchor1")).should("have.value", "1");
    cy.get(cesc("#\\/positionFromAnchor2")).should("have.value", "9");
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");

    cy.log("move textinputs by dragging");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput1",
        args: { x: -2, y: 3 },
      });
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput2",
        args: { x: 4, y: -5 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(4,−5)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,−5)");

    cy.log("move textinputs by entering coordinates");

    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(6,7){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(8,9){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should("contain.text", "(8,9)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("change position from anchor");
    cy.get(cesc("#\\/positionFromAnchor1")).select("lowerLeft");
    cy.get(cesc("#\\/positionFromAnchor2")).select("lowerRight");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: lowerleft",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("make not draggable");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: false");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: false");

    cy.log("cannot move textinputs by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput2",
        args: { x: -8, y: -7 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("make draggable again");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput2",
        args: { x: -8, y: -7 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(−8,−7)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−10,−9)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("fix location");

    cy.get(cesc("#\\/fixLocation1")).click();
    cy.get(cesc("#\\/fixLocation2")).click();
    cy.get(cesc("#\\/pFixLocation1")).should(
      "have.text",
      "FixLocation 1: true",
    );
    cy.get(cesc("#\\/pFixLocation2")).should(
      "have.text",
      "FixLocation 2: true",
    );

    cy.log("can change coordinates entering coordinates only for input 1");

    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(3,4){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(1,2){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("cannot move textinputs by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput1",
        args: { x: 4, y: 6 },
      });
      win.callAction1({
        actionName: "moveInput",
        componentName: "/textinput2",
        args: { x: 7, y: 8 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "false");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("can change position from anchor only for input 1");
    cy.get(cesc("#\\/positionFromAnchor2")).select("bottom");
    cy.get(cesc("#\\/positionFromAnchor1")).select("top");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: top",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("can change disabled attribute");
    cy.get(cesc("#\\/disabled1")).click();
    cy.get(cesc("#\\/disabled2")).click();
    cy.get(cesc("#\\/pDisabled1")).should("have.text", "Disabled 1: false");
    cy.get(cesc("#\\/pDisabled2")).should("have.text", "Disabled 2: true");

    cy.log("make completely fixed");
    cy.get(cesc("#\\/fixed1")).click();
    cy.get(cesc("#\\/fixed2")).click();
    cy.get(cesc("#\\/pFixed1")).should("have.text", "Fixed 1: true");
    cy.get(cesc("#\\/pFixed2")).should("have.text", "Fixed 2: true");

    cy.log("can change coordinates entering coordinates only for input 1");

    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(7,8){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(5,6){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow").should("contain.text", "(5,6)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("can change position from anchor only for input 1");
    cy.get(cesc("#\\/positionFromAnchor2")).select("left");
    cy.get(cesc("#\\/positionFromAnchor1")).select("right");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: right",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("can change disabled attribute only for input 1");
    cy.get(cesc("#\\/disabled2")).click();
    cy.get(cesc("#\\/disabled1")).click();
    cy.get(cesc("#\\/pDisabled1")).should("have.text", "Disabled 1: true");
    cy.get(cesc("#\\/pDisabled2")).should("have.text", "Disabled 2: true");
  });

  it("use textinput as basic math input", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <textinput name="ti" />

    <p>Math from text input: <math name="m1">$ti</math></p>
    <p>Number from text input: <number name="n1">$ti</number></p>
    <p>Math via latex from text input: <math name="m2">$ti.value{isLatex}</math></p>
    <p>Number via latex from text input: <number name="n2">$ti.value{isLatex}</number></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc2("#/n1")).should("have.text", "NaN");
    cy.get(cesc2("#/n2")).should("have.text", "NaN");

    cy.get(cesc2("#/ti_input")).type("4/2{enter}");

    cy.get(cesc2("#/m1") + " .mjx-mrow").should("contain.text", "42");
    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "42");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "42");
    cy.get(cesc2("#/n1")).should("have.text", "2");
    cy.get(cesc2("#/n2")).should("have.text", "2");

    cy.get(cesc2("#/ti_input")).clear().type("xy{enter}");

    cy.get(cesc2("#/m1") + " .mjx-mrow").should("contain.text", "xy");
    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "xy");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "xy");
    cy.get(cesc2("#/n1")).should("have.text", "NaN");
    cy.get(cesc2("#/n2")).should("have.text", "NaN");

    cy.get(cesc2("#/ti_input")).clear().type("\\frac{{}a}{{}b}{enter}");

    cy.get(cesc2("#/m1") + " .mjx-mrow").should("contain.text", "\uff3f");
    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "ab");
    cy.get(cesc2("#/n1")).should("have.text", "NaN");
    cy.get(cesc2("#/n2")).should("have.text", "NaN");

    cy.get(cesc2("#/ti_input")).clear().type("\\frac{{}6}{{}2}{enter}");

    cy.get(cesc2("#/m2") + " .mjx-mrow").should("contain.text", "62");
    cy.get(cesc2("#/m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "\uff3f");
    cy.get(cesc2("#/m2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "62");
    cy.get(cesc2("#/n1")).should("have.text", "NaN");
    cy.get(cesc2("#/n2")).should("have.text", "3");
  });

  it("valueChanged", () => {
    let doenetML = `
    <p><textInput name="ti1" /> <text copySource="ti1" name="ti1a" /> <boolean copysource="ti1.valueChanged" name="ti1changed" /> <text copySource="ti1.immediateValue" name="ti1iva" /> <boolean copysource="ti1.immediateValueChanged" name="ti1ivchanged" /></p>
    <p><textInput name="ti2" prefill="apple" /> <text copySource="ti2" name="ti2a" /> <boolean copysource="ti2.valueChanged" name="ti2changed" /> <text copySource="ti2.immediateValue" name="ti2iva" /> <boolean copysource="ti2.immediateValueChanged" name="ti2ivchanged" /></p>
    <p><textInput name="ti3" bindValueTo="$ti1" /> <text copySource="ti3" name="ti3a" /> <boolean copysource="ti3.valueChanged" name="ti3changed" /> <text copySource="ti3.immediateValue" name="ti3iva" /> <boolean copysource="ti3.immediateValueChanged" name="ti3ivchanged" /></p>
    <p><textInput name="ti4">$ti2.immediateValue</textInput> <text copySource="ti4" name="ti4a" /> <boolean copysource="ti4.valueChanged" name="ti4changed" /> <text copySource="ti4.immediateValue" name="ti4iva" /> <boolean copysource="ti4.immediateValueChanged" name="ti4ivchanged" /></p>

    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ti1a")).should("have.text", "");
    cy.get(cesc2("#/ti2a")).should("have.text", "apple");
    cy.get(cesc2("#/ti3a")).should("have.text", "");
    cy.get(cesc2("#/ti4a")).should("have.text", "apple");

    cy.get(cesc2("#/ti1iva")).should("have.text", "");
    cy.get(cesc2("#/ti2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ti3iva")).should("have.text", "");
    cy.get(cesc2("#/ti4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ti1changed")).should("have.text", "false");
    cy.get(cesc2("#/ti2changed")).should("have.text", "false");
    cy.get(cesc2("#/ti3changed")).should("have.text", "false");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("type in first marks only first immediate value as changed");

    cy.get(cesc2("#/ti1") + "_input").type("banana");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");

    cy.get(cesc2("#/ti1a")).should("have.text", "");
    cy.get(cesc2("#/ti2a")).should("have.text", "apple");
    cy.get(cesc2("#/ti3a")).should("have.text", "");
    cy.get(cesc2("#/ti4a")).should("have.text", "apple");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ti3iva")).should("have.text", "");
    cy.get(cesc2("#/ti4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ti1changed")).should("have.text", "false");
    cy.get(cesc2("#/ti2changed")).should("have.text", "false");
    cy.get(cesc2("#/ti3changed")).should("have.text", "false");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("press enter in first marks only first value as changed");

    cy.get(cesc2("#/ti1") + "_input").type("{enter}");

    cy.get(cesc2("#/ti1a")).should("have.text", "banana");

    cy.get(cesc2("#/ti1a")).should("have.text", "banana");
    cy.get(cesc2("#/ti2a")).should("have.text", "apple");
    cy.get(cesc2("#/ti3a")).should("have.text", "banana");
    cy.get(cesc2("#/ti4a")).should("have.text", "apple");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ti3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "false");
    cy.get(cesc2("#/ti3changed")).should("have.text", "false");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("type in second marks only second immediate value as changed");

    cy.get(cesc2("#/ti2") + "_input")
      .clear()
      .type("cherry", {
        force: true,
      });

    cy.get(cesc2("#/ti2iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1a")).should("have.text", "banana");
    cy.get(cesc2("#/ti2a")).should("have.text", "apple");
    cy.get(cesc2("#/ti3a")).should("have.text", "banana");
    cy.get(cesc2("#/ti4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "false");
    cy.get(cesc2("#/ti3changed")).should("have.text", "false");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("press enter in second marks only second value as changed");

    cy.get(cesc2("#/ti2") + "_input").type("{enter}");

    cy.get(cesc2("#/ti2a")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1a")).should("have.text", "banana");
    cy.get(cesc2("#/ti2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3a")).should("have.text", "banana");
    cy.get(cesc2("#/ti4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "true");
    cy.get(cesc2("#/ti3changed")).should("have.text", "false");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("type in third marks third immediate value as changed");

    cy.get(cesc2("#/ti3") + "_input")
      .clear()
      .type("dragonfruit", {
        force: true,
      });

    cy.get(cesc2("#/ti3iva")).should("have.text", "dragonfruit");

    cy.get(cesc2("#/ti1a")).should("have.text", "banana");
    cy.get(cesc2("#/ti2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3a")).should("have.text", "banana");
    cy.get(cesc2("#/ti4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "true");
    cy.get(cesc2("#/ti3changed")).should("have.text", "false");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("press enter in third marks third value as changed");

    cy.get(cesc2("#/ti3") + "_input").type("{enter}");

    cy.get(cesc2("#/ti3a")).should("have.text", "dragonfruit");

    cy.get(cesc2("#/ti1a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "true");
    cy.get(cesc2("#/ti3changed")).should("have.text", "true");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("type in fourth marks fourth immediate value as changed");

    cy.get(cesc2("#/ti4") + "_input")
      .clear()
      .type("eggplant", {
        force: true,
      });

    cy.get(cesc2("#/ti4iva")).should("have.text", "eggplant");

    cy.get(cesc2("#/ti1a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti4iva")).should("have.text", "eggplant");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "true");
    cy.get(cesc2("#/ti3changed")).should("have.text", "true");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "true");

    cy.log("press enter in fourth marks fourth value as changed");

    cy.get(cesc2("#/ti4") + "_input").type("{enter}");

    cy.get(cesc2("#/ti4a")).should("have.text", "eggplant");

    cy.get(cesc2("#/ti1a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti2a")).should("have.text", "eggplant");
    cy.get(cesc2("#/ti3a")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti4a")).should("have.text", "eggplant");

    cy.get(cesc2("#/ti1iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti2iva")).should("have.text", "eggplant");
    cy.get(cesc2("#/ti3iva")).should("have.text", "dragonfruit");
    cy.get(cesc2("#/ti4iva")).should("have.text", "eggplant");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "true");
    cy.get(cesc2("#/ti3changed")).should("have.text", "true");
    cy.get(cesc2("#/ti4changed")).should("have.text", "true");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "true");

    cy.log("reload");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ti1a")).should("have.text", "");
    cy.get(cesc2("#/ti2a")).should("have.text", "apple");
    cy.get(cesc2("#/ti3a")).should("have.text", "");
    cy.get(cesc2("#/ti4a")).should("have.text", "apple");

    cy.get(cesc2("#/ti1iva")).should("have.text", "");
    cy.get(cesc2("#/ti2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ti3iva")).should("have.text", "");
    cy.get(cesc2("#/ti4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ti1changed")).should("have.text", "false");
    cy.get(cesc2("#/ti2changed")).should("have.text", "false");
    cy.get(cesc2("#/ti3changed")).should("have.text", "false");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("type in third marks only third immediate value as changed");

    cy.get(cesc2("#/ti3") + "_input").type("banana");

    cy.get(cesc2("#/ti3iva")).should("have.text", "banana");

    cy.get(cesc2("#/ti1a")).should("have.text", "");
    cy.get(cesc2("#/ti2a")).should("have.text", "apple");
    cy.get(cesc2("#/ti3a")).should("have.text", "");
    cy.get(cesc2("#/ti4a")).should("have.text", "apple");

    cy.get(cesc2("#/ti1iva")).should("have.text", "");
    cy.get(cesc2("#/ti2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ti3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ti1changed")).should("have.text", "false");
    cy.get(cesc2("#/ti2changed")).should("have.text", "false");
    cy.get(cesc2("#/ti3changed")).should("have.text", "false");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log(
      "press enter in third marks first and third value/immediateValue as changed",
    );

    cy.get(cesc2("#/ti3") + "_input").type("{enter}");

    cy.get(cesc2("#/ti3a")).should("have.text", "banana");

    cy.get(cesc2("#/ti1a")).should("have.text", "banana");
    cy.get(cesc2("#/ti2a")).should("have.text", "apple");
    cy.get(cesc2("#/ti3a")).should("have.text", "banana");
    cy.get(cesc2("#/ti4a")).should("have.text", "apple");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ti3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti4iva")).should("have.text", "apple");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "false");
    cy.get(cesc2("#/ti3changed")).should("have.text", "true");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "false");

    cy.log("type in fourth marks only fourth immediate value as changed");

    cy.get(cesc2("#/ti4") + "_input")
      .clear()
      .type("cherry", {
        force: true,
      });

    cy.get(cesc2("#/ti4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1a")).should("have.text", "banana");
    cy.get(cesc2("#/ti2a")).should("have.text", "apple");
    cy.get(cesc2("#/ti3a")).should("have.text", "banana");
    cy.get(cesc2("#/ti4a")).should("have.text", "apple");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti2iva")).should("have.text", "apple");
    cy.get(cesc2("#/ti3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "false");
    cy.get(cesc2("#/ti3changed")).should("have.text", "true");
    cy.get(cesc2("#/ti4changed")).should("have.text", "false");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "false");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "true");

    cy.log(
      "press enter in fourth marks third and fourth value/immediateValue as changed",
    );

    cy.get(cesc2("#/ti4") + "_input").type("{enter}");

    cy.get(cesc2("#/ti4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1a")).should("have.text", "banana");
    cy.get(cesc2("#/ti2a")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3a")).should("have.text", "banana");
    cy.get(cesc2("#/ti4a")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti2iva")).should("have.text", "cherry");
    cy.get(cesc2("#/ti3iva")).should("have.text", "banana");
    cy.get(cesc2("#/ti4iva")).should("have.text", "cherry");

    cy.get(cesc2("#/ti1changed")).should("have.text", "true");
    cy.get(cesc2("#/ti2changed")).should("have.text", "true");
    cy.get(cesc2("#/ti3changed")).should("have.text", "true");
    cy.get(cesc2("#/ti4changed")).should("have.text", "true");

    cy.get(cesc2("#/ti1ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti2ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti3ivchanged")).should("have.text", "true");
    cy.get(cesc2("#/ti4ivchanged")).should("have.text", "true");
  });

  it("text input with label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <p><textInput name="ti1" ><label>Type something</label></textInput></p>
    <p><textInput name="ti2"><label>Hello <math>a/b</math></label></textInput></p>

     `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ti1")).should("have.text", "Type something");
    cy.get(cesc2("#/ti2")).should("contain.text", "Hello");
    cy.get(cesc2("#/ti2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "ab");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ti1"].stateValues.label).eq("Type something");
      expect(stateVariables["/ti2"].stateValues.label).eq(
        "Hello \\(\\frac{a}{b}\\)",
      );
    });
  });
});
