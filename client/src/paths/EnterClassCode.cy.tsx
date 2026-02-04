import { EnterClassCodeComponent } from "./EnterClassCode";

describe("EnterClassCodeComponent", () => {
  it("renders the form with empty class code input", () => {
    cy.mount(
      <EnterClassCodeComponent
        classCode=""
        setClassCode={() => {}}
        haveInvalidClassCode={false}
        invalidCode={undefined}
      />,
    );

    cy.contains("Enter class code:").should("be.visible");
    cy.get('input[name="classCode"]').should("have.value", "");
    cy.contains("Submit code").should("be.visible");
    cy.checkAccessibility("body");
  });

  it("renders the form with an initial class code value", () => {
    cy.mount(
      <EnterClassCodeComponent
        classCode="ABC123"
        setClassCode={() => {}}
        haveInvalidClassCode={false}
        invalidCode={undefined}
      />,
    );

    cy.get('input[name="classCode"]').should("have.value", "ABC123");
    cy.checkAccessibility("body");
  });

  it("calls setClassCode when user types in the input", () => {
    const setClassCode = cy.stub();

    cy.mount(
      <EnterClassCodeComponent
        classCode="ABC"
        setClassCode={setClassCode}
        haveInvalidClassCode={false}
        invalidCode={undefined}
      />,
    );

    cy.get('input[name="classCode"]')
      .type("123")
      .then(() => {
        expect(setClassCode.callCount).to.be.greaterThan(0);
      });

    cy.checkAccessibility("body");
  });

  it("displays error message when invalid code is provided", () => {
    cy.mount(
      <EnterClassCodeComponent
        classCode="INVALID"
        setClassCode={() => {}}
        haveInvalidClassCode={true}
        invalidCode="INVALID"
      />,
    );

    cy.contains("Class code INVALID not found").should("be.visible");
    cy.checkAccessibility("body");
  });

  it("shows form control in invalid state when haveInvalidClassCode is true", () => {
    cy.mount(
      <EnterClassCodeComponent
        classCode="BADCODE"
        setClassCode={() => {}}
        haveInvalidClassCode={true}
        invalidCode="BADCODE"
      />,
    );

    cy.get('input[name="classCode"]').should("have.attr", "aria-invalid");
    cy.checkAccessibility("body");
  });

  it("required attribute is set on form control", () => {
    cy.mount(
      <EnterClassCodeComponent
        classCode=""
        setClassCode={() => {}}
        haveInvalidClassCode={false}
        invalidCode={undefined}
      />,
    );

    cy.get("input[required]").should("exist");
    cy.checkAccessibility("body");
  });
});
