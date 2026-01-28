import { EditClassifications } from "./EditClassifications";
import { ContentClassification } from "../../types";

describe("EditClassifications Component", () => {
  const mockClassification: ContentClassification = {
    id: 1,
    code: "A1.B.C",
    descriptions: [
      {
        description: "Detailed description of this classification",
        sortIndex: 0,
        subCategory: {
          id: 1,
          subCategory: "Subcategory Name",
          sortIndex: 0,
          category: {
            id: 1,
            category: "Category Name",
            system: {
              id: 1,
              name: "Standards System",
              shortName: "SS",
              categoryLabel: "Standard",
              subCategoryLabel: "Cluster",
              descriptionLabel: "Competency",
              categoriesInDescription: false,
              type: "standards",
            },
          },
        },
      },
    ],
  };

  const mockClassifications = [mockClassification];

  const defaultProps = {
    contentId: "test-content-123",
    classifications: mockClassifications,
  };

  it("renders correctly and is accessible", () => {
    cy.mount(<EditClassifications {...defaultProps} />);

    // Verify the component renders with expected content
    cy.contains("button", "Add a classification").should("be.visible");
    cy.contains(mockClassification.code).should("be.visible");

    // Check accessibility
    cy.checkAccessibility("body");
  });

  it("is accessible with no classifications", () => {
    cy.mount(
      <EditClassifications
        contentId={defaultProps.contentId}
        classifications={[]}
      />,
    );

    cy.contains("None added yet.").should("be.visible");
    cy.contains("button", "Add a classification").should("be.visible");

    cy.checkAccessibility("body");
  });

  it("is accessible with multiple classifications", () => {
    const multipleClassifications: ContentClassification[] = [
      mockClassification,
      {
        id: 2,
        code: "B2.C.D",
        descriptions: [
          {
            description: "Another classification description",
            sortIndex: 0,
            subCategory: {
              id: 2,
              subCategory: "Another Subcategory",
              sortIndex: 0,
              category: {
                id: 2,
                category: "Another Category",
                system: {
                  id: 1,
                  name: "Standards System",
                  shortName: "SS",
                  categoryLabel: "Standard",
                  subCategoryLabel: "Cluster",
                  descriptionLabel: "Competency",
                  categoriesInDescription: false,
                  type: "standards",
                },
              },
            },
          },
        ],
      },
    ];

    cy.mount(
      <EditClassifications
        contentId={defaultProps.contentId}
        classifications={multipleClassifications}
      />,
    );

    cy.contains(mockClassification.code).should("be.visible");
    cy.contains("B2.C.D").should("be.visible");

    cy.checkAccessibility("body");
  });

  it("is accessible when expanded", () => {
    cy.mount(<EditClassifications {...defaultProps} />);

    // Expand the accordion
    cy.contains(mockClassification.code).click();

    cy.checkAccessibility("body");
  });

  it("is accessible with remove button visible", () => {
    cy.mount(<EditClassifications {...defaultProps} />);

    // Close button should have proper aria-label
    cy.get("[aria-label*='Remove classification']").should("be.visible");

    cy.checkAccessibility("body");
  });
});
