import { Navbar } from "./Navbar";
import { UserInfoWithEmail } from "../../types";
import { getDiscourseUrl } from "../../utils/discourse";

describe("Navbar", { tags: ["@group4"] }, () => {
  const baseUser: UserInfoWithEmail = {
    userId: "550e8400-e29b-41d4-a716-446655440000" as any,
    firstNames: "Test",
    lastNames: "User",
    email: "test@example.com",
    isAnonymous: false,
  };

  const makeUser = (overrides: Partial<UserInfoWithEmail> = {}) => ({
    ...baseUser,
    ...overrides,
  });

  describe("desktop navigation", () => {
    beforeEach(() => {
      cy.viewport(1280, 800);
    });

    it("renders public navigation links", () => {
      cy.mount(<Navbar />);

      cy.contains("a", "Explore")
        .should("be.visible")
        .and("have.attr", "href", "/explore");
      cy.contains("a", "Sign up/Log In")
        .should("be.visible")
        .and("have.attr", "href", "/signIn");

      cy.checkAccessibility("body");
    });

    it("opens About submenu and shows expected links", () => {
      cy.mount(<Navbar />);

      cy.contains("button", "About").click();

      cy.contains('[role="menuitem"]', "About Doenet")
        .should("be.visible")
        .and("have.attr", "href", "/about");
      cy.contains('[role="menuitem"]', "Blog")
        .should("be.visible")
        .and("have.attr", "href", "/blog");

      cy.checkAccessibility("body");
    });

    it("uses anonymous discourse URL when user is not authenticated", () => {
      cy.mount(<Navbar />);

      cy.contains("button", "Get Involved").click();

      cy.contains('[role="menuitem"]', "Community discussions")
        .should("be.visible")
        .and("have.attr", "href")
        .and("include", getDiscourseUrl(undefined));

      cy.checkAccessibility("body");
    });

    it("renders authenticated account links for a regular user", () => {
      const user = makeUser();

      cy.mount(<Navbar user={user} />);

      cy.contains("a", "My Activities")
        .should("be.visible")
        .and("have.attr", "href", `/activities/${user.userId}`);
      cy.contains("a", "Assigned to Me")
        .should("be.visible")
        .and("have.attr", "href", "/assigned");
      cy.contains("a", "Curate").should("not.exist");
      cy.contains("a", "Sign up/Log In").should("not.exist");

      cy.contains("button", "Get Involved").click();
      cy.contains('[role="menuitem"]', "Community discussions")
        .should("be.visible")
        .and("have.attr", "href")
        .and("include", getDiscourseUrl(user));

      cy.checkAccessibility("body");
    });

    it("renders editor account links including Curate", () => {
      const editor = makeUser({
        userId: "550e8400-e29b-41d4-a716-446655440111" as any,
        isEditor: true,
      });

      cy.mount(<Navbar user={editor} />);

      cy.contains("a", "My Activities")
        .should("be.visible")
        .and("have.attr", "href", `/activities/${editor.userId}`);
      cy.contains("a", "Assigned to Me")
        .should("be.visible")
        .and("have.attr", "href", "/assigned");
      cy.contains("a", "Curate")
        .should("be.visible")
        .and("have.attr", "href", "/curate");

      cy.checkAccessibility("body");
    });

    it("hides account section links for anonymous users", () => {
      const anonymousUser = makeUser({
        firstNames: null,
        lastNames: "Nick",
        email: null,
        isAnonymous: true,
      });

      cy.mount(<Navbar user={anonymousUser} />);

      cy.contains("a", "Sign up/Log In").should("not.exist");
      cy.contains("a", "My Activities").should("not.exist");
      cy.contains("a", "Assigned to Me").should("not.exist");
      cy.contains("a", "Curate").should("not.exist");

      cy.checkAccessibility("body");
    });
  });

  describe("mobile navigation", () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    it("opens drawer and displays top-level menu items", () => {
      cy.mount(<Navbar />);

      cy.get('button[aria-label="Open navigation menu"]').click();
      cy.contains("Menu").should("be.visible");
      cy.contains("Explore").should("be.visible");
      cy.contains("About").should("be.visible");
      cy.contains("Get Involved").should("be.visible");
      cy.contains("Authors").should("be.visible");
      cy.contains("Students").should("be.visible");
      cy.contains("Sign up/Log In").should("be.visible");

      cy.checkAccessibility("body");
    });

    it("supports drill-down navigation and back", () => {
      cy.mount(<Navbar />);

      cy.get('button[aria-label="Open navigation menu"]').click();
      cy.contains("About").click();

      cy.contains("About").should("be.visible");
      cy.contains("About Doenet")
        .should("be.visible")
        .and("have.attr", "href", "/about");
      cy.contains("Blog")
        .should("be.visible")
        .and("have.attr", "href", "/blog");

      cy.contains("button", "Back").click();
      cy.contains("Menu").should("be.visible");
      cy.contains("Get Involved").should("be.visible");

      cy.checkAccessibility("body");
    });

    it("shows editor-specific account options in drawer", () => {
      const editor = makeUser({ isEditor: true });

      cy.mount(<Navbar user={editor} />);

      cy.get('button[aria-label="Open navigation menu"]').click();
      cy.contains("My workspace").should("be.visible");
      cy.contains("My Activities")
        .should("be.visible")
        .and("have.attr", "href", `/activities/${editor.userId}`);
      cy.contains("Assigned to Me")
        .should("be.visible")
        .and("have.attr", "href", "/assigned");
      cy.contains("Curate")
        .should("be.visible")
        .and("have.attr", "href", "/curate");

      cy.checkAccessibility("body");
    });
  });
});
