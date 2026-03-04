import { FetcherWithComponents } from "react-router";
import { ScratchPadComponent, type DocumentEditorProps } from "./ScratchPad";
import { DoenetmlVersion, UserInfoWithEmail } from "../types";
import defaultSource from "../assets/scratchPadDefault.doenet?raw";

type CreateContentResponse = {
  status: number;
  data?: {
    contentId: string;
  };
  message?: string;
};

const initialSource = "<document><p>Initial scratch pad source</p></document>";
const changedSource = "<document><p>Edited source</p></document>";

function createMockFetcher(
  state: "idle" | "loading",
  data?: CreateContentResponse,
): FetcherWithComponents<CreateContentResponse> {
  return {
    state,
    data,
    formData: undefined,
    json: undefined,
    text: undefined,
    formAction: undefined,
    formMethod: undefined,
    formEncType: undefined,
    submit: cy.stub().as("fetcherSubmit"),
    load: cy.stub(),
    reset: cy.stub(),
    Form: (() => null) as any,
  } as FetcherWithComponents<CreateContentResponse>;
}

const mockVersion: DoenetmlVersion = {
  id: 2,
  displayedVersion: "0.7",
  fullVersion: "0.7.0",
  default: true,
  deprecated: false,
  removed: false,
  deprecationMessage: "",
};

const mockUser: UserInfoWithEmail = {
  userId: "user123",
  email: "test@example.com",
  firstNames: "Test",
  lastNames: "User",
};

const MockEditor = ({ sourceChangedCallback }: DocumentEditorProps) => {
  return (
    <div data-test="Mock Editor">
      <button
        data-test="Mock Editor Change"
        onClick={() => sourceChangedCallback?.(changedSource)}
      >
        Trigger editor change
      </button>
    </div>
  );
};

function mountScratchPad(
  overrides?: Partial<React.ComponentProps<typeof ScratchPadComponent>>,
) {
  cy.mount(
    <ScratchPadComponent
      doenetmlVersion={mockVersion}
      initialSource={initialSource}
      user={mockUser}
      setAddTo={cy.spy().as("setAddTo")}
      navigate={cy.spy().as("navigate")}
      fetcher={createMockFetcher("idle")}
      discussHref="https://example.com/discuss"
      editorComponent={MockEditor}
      {...overrides}
    />,
  );
}

function loadWelcomeTemplate() {
  cy.get('[data-test="Load Button"]').click();
  cy.get('[data-test="Add Default Button"]').click();
}

function saveToDocument() {
  cy.get('[data-test="Save to Document"]').click();
}

function getFirstSubmitPayload() {
  return cy.get("@fetcherSubmit").its("firstCall.args.0");
}

function expectPostJsonSubmitOptions() {
  cy.get("@fetcherSubmit")
    .its("firstCall.args.1")
    .should((options) => {
      expect(options.method).to.equal("post");
      expect(options.encType).to.equal("application/json");
    });
}

describe("ScratchPad tests", { tags: ["@group2"] }, () => {
  describe("ScratchPad save payload", () => {
    it("does not show save button when user is not logged in", () => {
      mountScratchPad({ user: undefined });

      cy.get('[data-test="Load Button"]').should("exist");
      cy.get('[data-test="Save to Document"]').should("not.exist");
    });

    it("sends Welcome source when save occurs immediately after setInitialSource", () => {
      mountScratchPad();

      loadWelcomeTemplate();
      saveToDocument();

      cy.get("@fetcherSubmit").should("have.been.calledOnce");
      getFirstSubmitPayload().should((payload) => {
        expect(payload.path).to.equal("updateContent/createContent");
        expect(payload.contentType).to.equal("singleDoc");
        expect(payload.doenetml).to.equal(defaultSource);
        expect(payload.doenetml).to.not.equal(initialSource);
        expect(payload.name).to.equal("Scratch Pad Document");
      });
      expectPostJsonSubmitOptions();
    });

    it("sends latest editor source after an editor callback", () => {
      mountScratchPad();

      cy.get('[data-test="Mock Editor Change"]').click({ force: true });
      saveToDocument();

      cy.get("@fetcherSubmit").should("have.been.calledOnce");
      getFirstSubmitPayload().should((payload) => {
        expect(payload.path).to.equal("updateContent/createContent");
        expect(payload.contentType).to.equal("singleDoc");
        expect(payload.doenetml).to.equal(changedSource);
        expect(payload.doenetml).to.not.equal(initialSource);
      });
    });

    it("sends initial source when no load or editor callback occurs", () => {
      mountScratchPad();

      saveToDocument();

      cy.get("@fetcherSubmit").should("have.been.calledOnce");
      getFirstSubmitPayload().should((payload) => {
        expect(payload.path).to.equal("updateContent/createContent");
        expect(payload.contentType).to.equal("singleDoc");
        expect(payload.doenetml).to.equal(initialSource);
      });
    });

    it("uses Welcome loaded source when load occurs after an editor change", () => {
      mountScratchPad();

      cy.get('[data-test="Mock Editor Change"]').click({ force: true });
      loadWelcomeTemplate();
      saveToDocument();

      cy.get("@fetcherSubmit").should("have.been.calledOnce");
      getFirstSubmitPayload().should((payload) => {
        expect(payload.doenetml).to.equal(defaultSource);
        expect(payload.doenetml).to.not.equal(changedSource);
      });
    });
  });

  describe("ScratchPad accessibility", () => {
    it("is accessible on initial render", () => {
      mountScratchPad();

      cy.contains("Scratch Pad").should("be.visible");
      cy.checkAccessibility("body");
    });

    it("is accessible with load menu open", () => {
      mountScratchPad();

      cy.get('[data-test="Load Button"]').click();
      cy.contains("Multiple Choice Examples").should("be.visible");
      cy.checkAccessibility("body");
    });

    it("toggles accessibility strict mode state", () => {
      mountScratchPad();

      cy.get('[aria-label="Toggle accessibility strict mode"]')
        .should("have.attr", "aria-pressed", "false")
        .click()
        .should("have.attr", "aria-pressed", "true")
        .click()
        .should("have.attr", "aria-pressed", "false");
    });

    it("is accessible while save modal is open", () => {
      mountScratchPad();

      saveToDocument();
      cy.get('[data-test="Copy Header"]').should("contain.text", "Saving...");
      cy.checkAccessibility("body");
    });
  });
});
