import { ShareMyContentModal } from "./ShareMyContentModal";
import { FetcherWithComponents } from "react-router";
import { UserInfoWithEmail } from "../types";

describe("ShareMyContentModal component tests", () => {
  const contentId = "content-123";
  const contentType = "sequence";

  const mockUser: UserInfoWithEmail = {
    userId: "12345678-1234-1234-1234-123456789999",
    firstNames: "Test",
    lastNames: "User",
    email: "test.user@example.com",
  };

  const shareStatusData = {
    isPublic: false,
    parentIsPublic: false,
    sharedWith: [mockUser],
    parentSharedWith: [],
  };

  const settingsData = {
    allCategories: [],
    categories: [],
  } as any;

  function createMockFetcher({
    state = "idle",
    data,
    submitAlias = "fetcherSubmit",
  }: {
    state?: "idle" | "submitting" | "loading";
    data?: any;
    submitAlias?: string;
  } = {}) {
    return {
      state,
      formData: undefined,
      data,
      Form: ({ children }: any) => <form>{children}</form>,
      submit: cy.stub().as(submitAlias),
      load: () => {},
    } as unknown as FetcherWithComponents<any>;
  }

  it("renders public and people sections when data is loaded", () => {
    cy.mount(
      <ShareMyContentModal
        contentId={contentId}
        contentType={contentType}
        isOpen={true}
        onClose={cy.spy().as("onClose")}
        shareStatusData={shareStatusData}
        settingsData={settingsData}
        isLoadingShareStatus={false}
        isLoadingSettings={false}
        addEmailFetcher={createMockFetcher({ submitAlias: "addEmailSubmit" })}
        publicShareFetcher={createMockFetcher({
          submitAlias: "publicShareSubmit",
        })}
        unshareFetcher={createMockFetcher({ submitAlias: "unshareSubmit" })}
      />,
    );

    cy.contains("With the public").should("be.visible");
    cy.contains("With specific people").should("be.visible");
    cy.contains("Content is not public").should("be.visible");
    cy.contains("Share publicly").should("be.visible");
  });

  it("renders shared users in the table", () => {
    cy.mount(
      <ShareMyContentModal
        contentId={contentId}
        contentType={contentType}
        isOpen={true}
        onClose={cy.spy().as("onClose")}
        shareStatusData={shareStatusData}
        settingsData={settingsData}
        isLoadingShareStatus={false}
        isLoadingSettings={false}
        addEmailFetcher={createMockFetcher({ submitAlias: "addEmailSubmit" })}
        publicShareFetcher={createMockFetcher({
          submitAlias: "publicShareSubmit",
        })}
        unshareFetcher={createMockFetcher({ submitAlias: "unshareSubmit" })}
      />,
    );

    cy.contains("People with access").should("be.visible");
    cy.contains("Test User").should("be.visible");
    cy.contains("test.user@example.com").should("be.visible");
  });

  it("submits add email when input loses focus", () => {
    cy.mount(
      <ShareMyContentModal
        contentId={contentId}
        contentType={contentType}
        isOpen={true}
        onClose={cy.spy().as("onClose")}
        shareStatusData={{ ...shareStatusData, sharedWith: [] }}
        settingsData={settingsData}
        isLoadingShareStatus={false}
        isLoadingSettings={false}
        addEmailFetcher={createMockFetcher({ submitAlias: "addEmailSubmit" })}
        publicShareFetcher={createMockFetcher({
          submitAlias: "publicShareSubmit",
        })}
        unshareFetcher={createMockFetcher({ submitAlias: "unshareSubmit" })}
      />,
    );

    cy.get('input[name="email"]').type("new.user@example.com");
    cy.get('input[name="email"]').blur();

    cy.get("@addEmailSubmit").should("have.been.calledWith", {
      path: "share/shareContent",
      contentId,
      email: "new.user@example.com",
    });
  });

  it("submits unshare when clicking remove on a user", () => {
    cy.mount(
      <ShareMyContentModal
        contentId={contentId}
        contentType={contentType}
        isOpen={true}
        onClose={cy.spy().as("onClose")}
        shareStatusData={shareStatusData}
        settingsData={settingsData}
        isLoadingShareStatus={false}
        isLoadingSettings={false}
        addEmailFetcher={createMockFetcher({ submitAlias: "addEmailSubmit" })}
        publicShareFetcher={createMockFetcher({
          submitAlias: "publicShareSubmit",
        })}
        unshareFetcher={createMockFetcher({ submitAlias: "unshareSubmit" })}
      />,
    );

    cy.get('[aria-label="Stop sharing with Test User"]').click();
    cy.get("@unshareSubmit").should("have.been.calledWith", {
      path: "share/unshareContent",
      contentId,
      userId: mockUser.userId,
    });
  });

  it("submits public share toggle when Share publicly is clicked", () => {
    cy.mount(
      <ShareMyContentModal
        contentId={contentId}
        contentType={contentType}
        isOpen={true}
        onClose={cy.spy().as("onClose")}
        shareStatusData={{ ...shareStatusData, isPublic: false }}
        settingsData={settingsData}
        isLoadingShareStatus={false}
        isLoadingSettings={false}
        addEmailFetcher={createMockFetcher({ submitAlias: "addEmailSubmit" })}
        publicShareFetcher={createMockFetcher({
          submitAlias: "publicShareSubmit",
        })}
        unshareFetcher={createMockFetcher({ submitAlias: "unshareSubmit" })}
      />,
    );

    cy.get('[data-test="Share Publicly Button"]').click();
    cy.get("@publicShareSubmit").should("have.been.calledWith", {
      path: "share/setContentIsPublic",
      contentId,
      isPublic: true,
    });
  });

  describe("Accessibility", () => {
    it("is accessible when not public", () => {
      cy.mount(
        <ShareMyContentModal
          contentId={contentId}
          contentType={contentType}
          isOpen={true}
          onClose={cy.spy().as("onClose")}
          shareStatusData={shareStatusData}
          settingsData={settingsData}
          isLoadingShareStatus={false}
          isLoadingSettings={false}
          addEmailFetcher={createMockFetcher()}
          publicShareFetcher={createMockFetcher()}
          unshareFetcher={createMockFetcher()}
        />,
      );

      cy.wait(200);
      cy.checkAccessibility("body");
    });

    it("is accessible when public", () => {
      cy.mount(
        <ShareMyContentModal
          contentId={contentId}
          contentType={contentType}
          isOpen={true}
          onClose={cy.spy().as("onClose")}
          shareStatusData={{ ...shareStatusData, isPublic: true }}
          settingsData={settingsData}
          isLoadingShareStatus={false}
          isLoadingSettings={false}
          addEmailFetcher={createMockFetcher()}
          publicShareFetcher={createMockFetcher()}
          unshareFetcher={createMockFetcher()}
        />,
      );

      cy.wait(200);
      cy.checkAccessibility("body");
    });
  });
});
