import { ShareTable } from "./ShareTable";
import { FetcherWithComponents } from "react-router";
import { UserInfoWithEmail } from "../../types";

function createMockFetcher() {
  return {
    state: "idle",
    formData: undefined,
    data: undefined,
    Form: ({ children }: any) => <form>{children}</form>,
    submit: cy.stub(),
    load: () => {},
  } as unknown as FetcherWithComponents<any>;
}

describe("ShareTable Component", () => {
  const contentId = "content-123";
  const sharedUser: UserInfoWithEmail = {
    userId: "b3d9b6f6-0d8a-4b9a-8f71-5e1f3e5d4f11",
    firstNames: "Ada",
    lastNames: "Lovelace",
    email: "ada@example.com",
  };
  const inheritedUser: UserInfoWithEmail = {
    userId: "b2c84f7b-2cb1-4ae9-8fd9-1d1c0af3e227",
    firstNames: "Grace",
    lastNames: "Hopper",
    email: "grace@example.com",
  };

  it("renders shared users and is accessible", () => {
    cy.mount(
      <ShareTable
        contentId={contentId}
        isPublic={false}
        parentIsPublic={false}
        sharedWith={[sharedUser]}
        parentSharedWith={[]}
        unshareFetcher={createMockFetcher()}
      />,
    );

    cy.contains("People with access").should("be.visible");
    cy.contains("Ada Lovelace").should("be.visible");
    cy.contains("ada@example.com").should("be.visible");
    cy.get('button[aria-label="Stop sharing with Ada Lovelace"]').should(
      "be.visible",
    );

    cy.checkAccessibility("body");
  });

  it("submits unshare actions for public and user rows", () => {
    const submit = cy.stub().as("submit");
    const fetcher = {
      state: "idle",
      formData: undefined,
      data: undefined,
      Form: ({ children }: any) => <form>{children}</form>,
      submit,
      load: () => {},
    } as unknown as FetcherWithComponents<any>;

    cy.mount(
      <ShareTable
        contentId={contentId}
        isPublic={true}
        parentIsPublic={false}
        sharedWith={[sharedUser]}
        parentSharedWith={[]}
        unshareFetcher={fetcher}
      />,
    );

    cy.get('button[aria-label="Stop sharing publicly"]').click();
    cy.get("@submit").should(
      "have.been.calledWith",
      {
        path: "share/setContentIsPublic",
        contentId,
        isPublic: false,
      },
      {
        method: "post",
        encType: "application/json",
      },
    );

    cy.get('button[aria-label="Stop sharing with Ada Lovelace"]').click();
    cy.get("@submit").should(
      "have.been.calledWith",
      {
        path: "share/unshareContent",
        contentId,
        userId: sharedUser.userId,
      },
      {
        method: "post",
        encType: "application/json",
      },
    );
  });

  it("shows inherited rows without close buttons and is accessible", () => {
    cy.mount(
      <ShareTable
        contentId={contentId}
        isPublic={true}
        parentIsPublic={true}
        sharedWith={[inheritedUser]}
        parentSharedWith={[inheritedUser]}
        unshareFetcher={createMockFetcher()}
      />,
    );

    cy.contains("Everyone").should("be.visible");
    cy.contains("(shared publicly)").should("be.visible");
    cy.contains("Grace Hopper").should("be.visible");
    cy.contains("grace@example.com").should("be.visible");
    cy.contains("(inherited)").should("be.visible");
    cy.get('button[aria-label="Stop sharing publicly"]').should("not.exist");
    cy.get('button[aria-label="Stop sharing with Grace Hopper"]').should(
      "not.exist",
    );

    cy.checkAccessibility("body");
  });
});
