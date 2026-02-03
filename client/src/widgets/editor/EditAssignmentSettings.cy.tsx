import { EditAssignmentSettings } from "./EditAssignmentSettings";

describe("EditAssignmentSettings Component", () => {
  const defaultProps = {
    contentId: "test-content-123",
    maxAttempts: 3,
    individualizeByStudent: false,
    mode: "formative" as const,
    includeMode: true,
    isAssigned: false,
  };

  it("renders correctly and is accessible", () => {
    cy.mount(<EditAssignmentSettings {...defaultProps} />);

    // Verify the component renders with expected content
    cy.contains("Allow unlimited attempts").should("be.visible");
    cy.contains("Maximum number of attempts allowed").should("be.visible");
    cy.contains(
      "Assign the same variant of this activity to all students",
    ).should("be.visible");
    cy.contains("Assignment mode").should("be.visible");

    // Check accessibility
    cy.checkAccessibility("body");
  });

  it("is accessible when mode is summative", () => {
    cy.mount(<EditAssignmentSettings {...defaultProps} mode="summative" />);

    cy.contains("Assignment mode").should("be.visible");
    cy.checkAccessibility("body");
  });

  it("is accessible when assignment is already assigned", () => {
    cy.mount(<EditAssignmentSettings {...defaultProps} isAssigned={true} />);

    // When assigned, certain controls should be disabled
    cy.contains("Assignment mode").should("be.visible");
    cy.checkAccessibility("body");
  });

  it("is accessible when includeMode is false", () => {
    cy.mount(<EditAssignmentSettings {...defaultProps} includeMode={false} />);

    // Mode selection should not be present
    cy.contains("Assignment mode").should("not.exist");
    cy.contains("Allow unlimited attempts").should("be.visible");

    cy.checkAccessibility("body");
  });

  it("is accessible with unlimited attempts enabled", () => {
    cy.mount(<EditAssignmentSettings {...defaultProps} maxAttempts={0} />);

    cy.contains("Allow unlimited attempts").should("be.visible");
    cy.checkAccessibility("body");
  });
});
