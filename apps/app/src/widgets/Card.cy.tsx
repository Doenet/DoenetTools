import Card, { CardContent } from "./Card";
import { Content } from "../types";

const outletContext = {
  user: undefined,
  setAddTo: () => {},
  allLicenses: [],
};

function docContent(overrides: Partial<Content> = {}): Content {
  return {
    contentId: "doc1",
    name: "A document",
    type: "singleDoc",
    isPublic: false,
    isShared: false,
    visibility: "private",
    licenseCode: null,
    categories: [],
    numVariants: 1,
    ...overrides,
  } as unknown as Content;
}

function mountCard(cardContent: Partial<CardContent>) {
  cy.mount(
    <Card
      cardContent={{ content: docContent(), ...cardContent } as CardContent}
    />,
    { outletContext },
  );
}

describe("Card description toggle", { tags: ["@group4"] }, () => {
  it("is absent unless the document is inside a problem set", () => {
    mountCard({});
    cy.get('input[type="checkbox"][aria-label^="Description"]').should(
      "not.exist",
    );
  });

  it("reports a check to the update callback", () => {
    const updateIsDescription = cy.stub().as("updateIsDescription");
    mountCard({ isDescription: false, updateIsDescription });

    cy.get('input[type="checkbox"][aria-label^="Description"]')
      .should("not.be.checked")
      .should("be.enabled");
    // Chakra visually hides the input behind its own control, so click the label
    cy.contains("label", "Description").click();
    cy.get("@updateIsDescription").should("have.been.calledWith", true);
  });

  it("reports an uncheck to the update callback", () => {
    const updateIsDescription = cy.stub().as("updateIsDescription");
    mountCard({ isDescription: true, updateIsDescription });

    cy.get('input[type="checkbox"][aria-label^="Description"]').should(
      "be.checked",
    );
    cy.contains("label", "Description").click();
    cy.get("@updateIsDescription").should("have.been.calledWith", false);
  });

  // Assigned (and otherwise read-only) content supplies no updater: changing
  // the flag would renumber the items, so the server rejects it.
  it("is disabled, but still shows its state, without an update callback", () => {
    mountCard({ isDescription: true });

    cy.get('input[type="checkbox"][aria-label^="Description"]')
      .should("be.checked")
      .should("be.disabled");
  });

  it("marks a description with its own icon and accessible name", () => {
    mountCard({ isDescription: true, updateIsDescription: () => {} });

    cy.get('[aria-label="Description (not scored)"]').should("exist");
    cy.checkAccessibility("body");
  });
});

describe("Card repeat control", { tags: ["@group4"] }, () => {
  function mountRepeatCard(cardContent: Partial<CardContent>) {
    cy.mount(
      <Card
        cardContent={
          {
            content: docContent({ numVariants: 5 }),
            ...cardContent,
          } as CardContent
        }
      />,
      { outletContext },
    );
  }

  it("is absent unless the document is inside a problem set", () => {
    mountRepeatCard({});
    cy.get('input[aria-label^="Number of times to repeat"]').should(
      "not.exist",
    );
  });

  it("is absent for a description, which is never repeated", () => {
    mountRepeatCard({
      repeatInProblemSet: 3,
      isDescription: true,
      updateRepeatInProblemSet: () => {},
    });
    cy.get('input[aria-label^="Number of times to repeat"]').should(
      "not.exist",
    );
  });

  // Assigned (and otherwise read-only) content supplies no updater: changing
  // the repeat would renumber the items, so the server rejects it.
  it("is disabled, but still shows its value, without an update callback", () => {
    mountRepeatCard({ repeatInProblemSet: 3 });

    cy.get('input[aria-label^="Number of times to repeat"]')
      .should("have.value", "3")
      .should("be.disabled");
  });

  it("reports a new value to the update callback", () => {
    const updateRepeatInProblemSet = cy.stub().as("updateRepeat");
    mountRepeatCard({ repeatInProblemSet: 3, updateRepeatInProblemSet });

    cy.get('input[aria-label^="Number of times to repeat"]')
      .should("be.enabled")
      .clear()
      .type("2{enter}");
    cy.get("@updateRepeat").should("have.been.calledWith", 2);
  });
});
