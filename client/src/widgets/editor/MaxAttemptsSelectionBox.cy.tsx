import { MaxAttemptsSelectionBox } from "./EditAssignmentSettings";
import { useState } from "react";

// Wrapper component that manages attempts state
function MaxAttemptsWrapper({ initialAttempts }: { initialAttempts: number }) {
  const [attempts, setAttempts] = useState(initialAttempts);

  // Store setter in window so action can access it
  (window as any).setAttempts = setAttempts;

  return <MaxAttemptsSelectionBox contentId="test-123" attempts={attempts} />;
}

// Action that simulates server updating attempts
const action = async ({ request }: { request: Request }) => {
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const maxAttempts = body.maxAttempts;

      if (maxAttempts !== undefined) {
        // Update the component's attempts prop
        (window as any).setAttempts?.(maxAttempts);
      }
      return { success: true, maxAttempts };
    }
  }
  return null;
};

describe("MaxAttemptsSelectionBox Component", () => {
  it("should restore the new value when user deletes input and presses enter", () => {
    // Mount the component with initial attempts of 5
    cy.mount(<MaxAttemptsWrapper initialAttempts={5} />, {
      action,
    });

    // Verify initial value is 5
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "5");

    // Enter a new value (9) and press Enter
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .clear()
      .type("9")
      .type("{enter}");

    // Value should update to 9
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "9");

    // Delete the value with backspace to make it blank
    cy.get('[data-test="max-attempts-input"]').find("input").clear();

    // Should display as blank
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "");

    // Press Enter on the empty input
    cy.get('[data-test="max-attempts-input"]').find("input").type("{enter}");

    // Should restore to the new value (9)
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "9");
  });

  it("should clear to blank when user deletes input, then restore on blur", () => {
    cy.mount(<MaxAttemptsWrapper initialAttempts={3} />, {
      action,
    });

    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "3");

    // Delete the value
    cy.get('[data-test="max-attempts-input"]').find("input").clear();
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "");

    // Blur the input (click elsewhere)
    cy.get('[data-test="max-attempts-input"]').find("input").blur();

    // Should restore to original value
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "3");
  });

  it("should allow entering and submitting a new valid value", () => {
    cy.mount(<MaxAttemptsWrapper initialAttempts={2} />, {
      action,
    });

    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "2");

    // Enter new value 7 and press Enter
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .clear()
      .type("7")
      .type("{enter}");

    // Should show the new value
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "7");
  });

  it("should allow unlimited attempts toggle", () => {
    cy.mount(<MaxAttemptsWrapper initialAttempts={5} />, {
      action,
    });

    // Input should be enabled initially
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("not.be.disabled");

    // Click the unlimited switch
    cy.get("input[type='checkbox']").click({ force: true });

    // Input should now be disabled and show "---"
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("be.disabled");
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "---");

    // Click the unlimited switch again
    cy.get("input[type='checkbox']").click({ force: true });

    // Input should be enabled and show previous value (5)
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("not.be.disabled");
    cy.get('[data-test="max-attempts-input"]')
      .find("input")
      .should("have.value", "5");
  });
});
