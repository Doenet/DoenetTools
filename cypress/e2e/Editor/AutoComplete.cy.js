import { cesc2 } from "../../../src/_utils/url";

describe("Auto completion test", function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  // const userId = "devuserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
    cy.createCourse({ userId, courseId, studentUserId });
  });
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId });
    cy.clearAllOfAUsersActivities({ userId: studentUserId });
    cy.createActivity({
      courseId,
      doenetId,
      parentDoenetId: courseId,
      pageDoenetId,
    });
    cy.visit(`/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Basic autocompletion", () => {
    cy.get(".cm-content").type(`<sec`);

    cy.get(".cm-tooltip-autocomplete").should("be.visible");

    selectTopAutoCompleteOptionWhenNamed("section");

    cy.get(".cm-content").type(` includeAutoNumberI`);
    selectTopAutoCompleteOptionWhenNamed("includeAutoNumberIfNoTitle");

    cy.get(".cm-content").type(`="f`);
    selectTopAutoCompleteOptionWhenNamed(`"false"`);

    cy.get(".cm-content").type(`>{enter}{enter}{enter}</`);
    selectTopAutoCompleteOptionWhenNamed("section>");

    cy.get(".cm-content").type(`{ctrl+s}`);

    cy.get(cesc2("#/_section1_title")).should("have.text", "Section");

    cy.get(".cm-content").type(`{ctrl+home}{downArrow}{downArrow}<answer sym`);
    selectTopAutoCompleteOptionWhenNamed("symbolicEquality");

    cy.get(".cm-content").type(` simp`);
    selectTopAutoCompleteOptionWhenNamed("simplifyOnCompare");

    cy.get(".cm-content").type(`="f`);
    selectTopAutoCompleteOptionWhenNamed(`"full"`);

    cy.get(".cm-content").type(` na`);
    selectTopAutoCompleteOptionWhenNamed("name");

    cy.get(".cm-content").type(`="ans">{enter}<aw`);
    selectTopAutoCompleteOptionWhenNamed(`award`);

    cy.get(".cm-content").type(`><math fo`);
    selectTopAutoCompleteOptionWhenNamed(`format`);

    cy.get(".cm-content").type(`="l`);
    selectTopAutoCompleteOptionWhenNamed(`"latex"`);

    cy.get(".cm-content").type(`>\\frac{{}x}{{}y}</`);
    selectTopAutoCompleteOptionWhenNamed("math>");

    cy.get(".cm-content").type(`</`);
    selectTopAutoCompleteOptionWhenNamed("award>");

    cy.get(".cm-content").type(`{enter}</`);
    selectTopAutoCompleteOptionWhenNamed("answer>");

    cy.get(".cm-content").type(`<num`);
    selectTopAutoCompleteOptionWhenNamed("number");

    cy.get(".cm-content").type(` cop`);
    selectTopAutoCompleteOptionWhenNamed("copySource");

    cy.get(".cm-content").type(`="ans.creditAchieved" />`);

    cy.get(".cm-content").type(`{ctrl+s}`);

    cy.get(cesc2("#/ans") + " textarea").type("(x+1-1)/y{enter}", {
      force: true,
    });

    cy.get(cesc2("#/_number1")).should("have.text", "1");
  });

  it("Autocomplete additional children (for sugar)", () => {
    cy.get(".cm-content").type(`<ans`);

    selectTopAutoCompleteOptionWhenNamed("answer");

    cy.get(".cm-content").type(`><te`);
    selectTopAutoCompleteOptionWhenNamed("text");

    cy.get(".cm-content").type(`>hello</`);
    selectTopAutoCompleteOptionWhenNamed("text>");

    cy.get(".cm-content").type(`</`);
    selectTopAutoCompleteOptionWhenNamed("answer>");

    cy.get(".cm-content").type(`{ctrl+s}`);

    cy.get(cesc2("#/_answer1") + " input").type("hello{enter}", {
      force: true,
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let textinputName =
        stateVariables["/_answer1"].stateValues.inputChildren[0].componentName;
      let textinputCorrectAnchor = cesc2("#" + textinputName + "_correct");

      cy.get(textinputCorrectAnchor).should("be.visible");
    });
  });

  it("Composites", () => {
    cy.log("select, intersection available with inline children");
    cy.get(".cm-content").type(`<p><sel`);
    selectTopAutoCompleteOptionWhenNamed("select");
    cy.get(".cm-content").type(`/><inters`);
    selectTopAutoCompleteOptionWhenNamed("intersection");
    cy.get(".cm-content").type(`/></p>{enter}`);

    cy.log(
      "select and intersection not available, only selectFromSequence, inside math",
    );
    cy.get(".cm-content").type(`<math><sel`);
    selectTopAutoCompleteOptionWhenNamed("selectFromSequence");
    cy.get(".cm-content").type(`/><inters`);
    cy.get(".cm-tooltip-autocomplete").should("not.exist");
    cy.get(".cm-content").type(`{backspace}v`);
    selectTopAutoCompleteOptionWhenNamed("interval");
    cy.get(".cm-content").type(`/></math>{enter}`);

    cy.log("select, intersection available with graphical children");
    cy.get(".cm-content").type(`<graph><sel`);
    selectTopAutoCompleteOptionWhenNamed("select");
    cy.get(".cm-content").type(`/><inters`);
    selectTopAutoCompleteOptionWhenNamed("intersection");
    cy.get(".cm-content").type(`/></graph>{enter}`);

    cy.log("group, but not option, case, else, or template, at base level");
    cy.get(".cm-content").type(`<option`);
    verifyTopAutoCompleteOptionIsNamed("eigenDecomposition");
    cy.get(".cm-content").type(
      `{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}case`,
    );
    cy.get(".cm-tooltip-autocomplete").should("not.exist");
    cy.get(".cm-content").type(
      `{backspace}{backspace}{backspace}{backspace}else`,
    );
    verifyTopAutoCompleteOptionIsNamed("selectFromSequence");
    cy.get(".cm-content").type(
      `{backspace}{backspace}{backspace}{backspace}templ`,
    );
    cy.get(".cm-tooltip-autocomplete").should("not.exist");
    cy.get(".cm-content").type(
      `{backspace}{backspace}{backspace}{backspace}{backspace}gro`,
    );
    selectTopAutoCompleteOptionWhenNamed("group");

    cy.log(
      "Verify get autocomplete group children even though no child groups",
    );
    cy.get(".cm-content").type(`><tex`);
    selectTopAutoCompleteOptionWhenNamed("text");
    cy.get(".cm-content").type(`/></group>{enter}`);

    cy.log("only template and sources available in map");
    cy.get(".cm-content").type(`<map><`);
    verifyTopAutoCompleteOptionIsNamed("sources");
    cy.get(".cm-content").type(`t`);
    selectTopAutoCompleteOptionWhenNamed("template");
    cy.get(".cm-content").type(`/><`);
    selectTopAutoCompleteOptionWhenNamed("sources");
    cy.get(".cm-content").type(`/></map>{enter}`);

    cy.log("only option available in select");
    cy.get(".cm-content").type(`<select><`);
    selectTopAutoCompleteOptionWhenNamed("option");
    cy.get(".cm-content").type(`/></select>{enter}`);
  });

  it("tweak visibility in schema via inSchemaOnlyInheritAs", () => {
    cy.get(".cm-content").type(`<cons`);
    cy.get(".cm-tooltip-autocomplete ul li").should("be.visible");

    cy.get(".cm-content").type(`iderasr`);
    cy.get(".cm-tooltip-autocomplete").should("not.exist");

    cy.get(".cm-content").type(`{home}<answer>{end}e`);
    selectTopAutoCompleteOptionWhenNamed("considerAsResponses");

    cy.get(".cm-content").type(`/></`);
    selectTopAutoCompleteOptionWhenNamed("answer>");

    cy.get(".cm-content").type(`{enter}{enter}<cons`);
    cy.get(".cm-tooltip-autocomplete ul li").should("be.visible");

    cy.get(".cm-content").type(`tra`);
    cy.get(".cm-tooltip-autocomplete").should("not.exist");

    cy.get(".cm-content").type(`{home}<point>{end}i`);
    selectTopAutoCompleteOptionWhenNamed("constraints");

    cy.get(".cm-content").type(`><constra`);
    selectTopAutoCompleteOptionWhenNamed("constrainTo");

    cy.get(".cm-content").type(`/></`);
    selectTopAutoCompleteOptionWhenNamed("constraints>");

    cy.get(".cm-content").type(`</`);
    selectTopAutoCompleteOptionWhenNamed("point>");
  });

  it("size values", () => {
    cy.get(".cm-content").type(`<graph size="s`);
    selectTopAutoCompleteOptionWhenNamed(`"small"`);

    cy.get(".cm-content").type(`></`);
    selectTopAutoCompleteOptionWhenNamed("graph>");

    cy.get(".cm-content").type(`<image size="me`);
    selectTopAutoCompleteOptionWhenNamed(`"medium"`);

    cy.get(".cm-content").type(`></`);
    selectTopAutoCompleteOptionWhenNamed("image>");
  });

  it("tags allowed only in setup", () => {
    cy.get(".cm-content").type(`<customA`);
    cy.get(".cm-tooltip-autocomplete").should("not.exist");
    cy.get(".cm-content").type(
      `{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}style`,
    );
    cy.get(".cm-tooltip-autocomplete").should("not.exist");
    cy.get(".cm-content").type(
      `{backspace}{backspace}{backspace}{backspace}{backspace}feedbackD`,
    );
    cy.get(".cm-tooltip-autocomplete").should("not.exist");
    cy.get(".cm-content").type(
      `{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}setup>{enter}`,
    );

    cy.get(".cm-content").type(`<customA`);
    selectTopAutoCompleteOptionWhenNamed("customAttribute");
    cy.get(".cm-content").type(`/>{enter}<style`);
    selectTopAutoCompleteOptionWhenNamed("styleDefinitions");
    cy.get(".cm-content").type(`><`);
    selectTopAutoCompleteOptionWhenNamed("styleDefinition");
    cy.get(".cm-content").type(`/></`);
    selectTopAutoCompleteOptionWhenNamed("styleDefinitions>");
    cy.get(".cm-content").type(`{enter}<feedbackD`);
    selectTopAutoCompleteOptionWhenNamed("feedbackDefinitions");
    cy.get(".cm-content").type(`><`);
    selectTopAutoCompleteOptionWhenNamed("feedbackDefinition");
    cy.get(".cm-content").type(`/></`);
    selectTopAutoCompleteOptionWhenNamed("feedbackDefinitions>");
  });
});

function verifyTopAutoCompleteOptionIsNamed(value) {
  // wait autocompletion list has value at the top
  cy.waitUntil(() =>
    cy
      .get(".cm-tooltip-autocomplete ul li")
      .eq(0)
      .invoke("text")
      .then((text) => {
        return text === value;
      }),
  );
}

function selectTopAutoCompleteOptionWhenNamed(value) {
  verifyTopAutoCompleteOptionIsNamed(value);

  // for some reason, still have to wait longer
  cy.wait(100);
  cy.get(".cm-content").type(`{enter}`);
}
