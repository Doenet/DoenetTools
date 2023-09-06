
import { cesc2 } from "../../../src/_utils/url";

describe("Share Activities Using Portfolio", function () {
  const userId = "cyuserId";
  const userId2 = "cyuserId2";

  beforeEach(() => {
    cy.signin({ userId });
    cy.visit(`/`);
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Contributors History Course", () => {
    const activityLabel = "Contributors Activity";
    const activityLabel2 = "Contributors Activity 2";
    const activityLabel3 = "Contributors Activity 3";
    const courseLabel = "Contributors Course";
    const activityContent = "This is a popular activity!";
    const userId1 = "cyContributors1";
    const user1FirstName = "First";
    const user1LastName = "Last";
    const user1FullName = `${user1FirstName} ${user1LastName}`;
    const userId2 = "cyContributors2";
    const user2FirstName = "Second";
    const user2LastName = "Last";
    const user2FullName = `${user2FirstName} ${user2LastName}`;

    cy.signin({
      userId: userId1,
      firstName: user1FirstName,
      lastName: user1LastName,
    });
    cy.visit(`/`);

    cy.log("Create an activity in a course");
    cy.get('[data-test="My Courses"]').click();
    cy.get('[data-test="Add Course"]').click();
    cy.get('[data-test="Confirm Add Course"]').click();
    cy.get('[data-test="List of courses"]')
      .contains("Untitled Course")
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]')
      .click();

    cy.get('[data-test="List of courses"]')
      .contains("Untitled Course")
      .parent()
      .parent()
      .find('[data-test="Course Settings MenuItem"]')
      .click();

    cy.get("#label").clear().type(courseLabel).blur();
    cy.get(".chakra-modal__close-btn").click();

    cy.get('[data-test="List of courses"]')
      .contains(courseLabel)
      .parent()
      .parent()
      .parent()
      .parent()
      .find('[data-test="Card Image Link"]')
      .click();

    cy.get('[data-test="Dashboard Content Card"]').click();

    cy.get('[data-test="Add Activity Button"]').click();

    cy.get(".navigationRow").eq(0).click();

    cy.get('[data-test="Label Activity"]').type(
      `{selectAll}{backspace}${activityLabel}{enter}`,
    );
    cy.get(".navigationRow").eq(0).dblclick();

    cy.get(".cm-content").type(activityContent);

    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assign Activity"]').click();

    cy.get('[data-test="Unassign Activity"]').should("be.visible");

    cy.get('[data-test="Show DoenetML Source"]').click();
    cy.get('[data-test="Make Publicly Visible"]').click();

    cy.log("remix the activity");
    cy.get('[data-test="Crumb 0"]').click();
    cy.get('[data-test="Community"]').click();
    cy.get('[data-test="Search"]').clear().type(`${activityLabel}{enter}`);
    cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"]')
      .eq(0)
      .click();

    cy.get('[data-test="info on contributors"]').contains(courseLabel);
    cy.get('[data-test="contributors menu"]').click();
    cy.get('[data-test="contributors menu item 0"]').contains(courseLabel);
    cy.get('[data-test="contributors menu item 0"]').click({ force: true });

    cy.get('[data-test="heading1"]').contains(courseLabel);
    cy.get('[data-test="heading2"]').contains("Public Course Activities");
    cy.go("back");

    cy.get('[data-test="Copy to Portfolio Button"]').click();

    cy.log("rename the 2nd activity and make it public");
    cy.get('[data-test="Controls Button"]').click();

    cy.get('[data-test="Activity Label"]').clear().type(activityLabel2).blur();
    cy.get('[data-test="Public Checkbox"]').click();
    cy.get('[data-test="Close Settings Button"]').click();

    cy.log("sign in as another user and remix");
    cy.signin({
      userId: userId2,
      firstName: user2FirstName,
      lastName: user2LastName,
    });

    cy.visit(`/community`);

    cy.get('[data-test="Search"]').clear().type(`${activityLabel2}{enter}`);
    cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"]')
      .eq(0)
      .click();

    cy.get('[data-test="info on contributors"]').contains(user1FullName);
    cy.get('[data-test="info on contributors"]').contains(courseLabel);
    cy.get('[data-test="contributors menu"]').click();
    cy.get('[data-test="contributors menu item 0"]').contains(user1FullName);
    cy.get('[data-test="contributors menu item 1"]').contains(courseLabel);

    cy.get('[data-test="contributors menu item 1"]').click({ force: true });
    cy.get('[data-test="heading1"]').contains(courseLabel);
    cy.get('[data-test="heading2"]').contains("Public Course Activities");
    cy.go("back");

    cy.get('[data-test="contributors menu"]').click();
    cy.get('[data-test="contributors menu item 0"]').click({ force: true });
    cy.get('[data-test="heading1"]').contains(user1FullName);
    cy.get('[data-test="heading2"]').contains("User Portfolio");
    cy.go("back");

    cy.get('[data-test="Copy to Portfolio Button"]').click();

    cy.log("label the third activity and examine public portfolio info");

    cy.get('[data-test="Controls Button"]').click();

    cy.get('[data-test="Activity Label"]').clear().type(activityLabel3).blur();
    cy.get('[data-test="Public Checkbox"]').click();
    cy.get('[data-test="Close Settings Button"]').click();

    cy.visit(`/community`);

    cy.get('[data-test="Search"]').clear().type(`${activityLabel3}{enter}`);
    cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"]')
      .eq(0)
      .click();

    cy.get('[data-test="info on contributors"]').contains(user2FullName);
    cy.get('[data-test="info on contributors"]').contains(user1FullName);
    cy.get('[data-test="info on contributors"]').contains(", ...");

    cy.get('[data-test="contributors menu"]').click();
    cy.get('[data-test="contributors menu item 0"]').contains(user2FullName);
    cy.get('[data-test="contributors menu item 1"]').contains(user1FullName);
    cy.get('[data-test="contributors menu item 2"]').contains(courseLabel);

    cy.get('[data-test="contributors menu item 2"]').click({ force: true });
    cy.get('[data-test="heading1"]').contains(courseLabel);
    cy.get('[data-test="heading2"]').contains("Public Course Activities");
    cy.go("back");

    cy.get('[data-test="contributors menu"]').click();
    cy.get('[data-test="contributors menu item 1"]').click({ force: true });
    cy.get('[data-test="heading1"]').contains(user1FullName);
    cy.get('[data-test="heading2"]').contains("User Portfolio");
    cy.go("back");

    cy.get('[data-test="contributors menu"]').click();
    cy.get('[data-test="contributors menu item 0"]').click({ force: true });
    cy.get('[data-test="heading1"]').contains(user2FullName);
    cy.get('[data-test="heading2"]').contains("User Portfolio");
  });

  it("Portfolio Settings Menu", () => {
    const label = "ShareActivites Portfolio Settings Menu";
    cy.deletePortfolioActivity({ userId, label });

    cy.get('[data-test="Portfolio"]').click();

    cy.log("Create an activity");
    cy.get('[data-test="Add Activity"]').click();

    cy.get(".cm-content").type(
      `<p>What is your name? <textinput name="name" /></p>{enter}`,
    );

    cy.get(
      '[data-test="Activity Label Editable"] [data-test="Editable Preview"]',
    ).click();
    cy.get('[data-test="Activity Label Editable"] [data-test="Editable Input"]')
      .type(label)
      .blur();

    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Private Activities"]').contains(label);
    cy.get('[data-test="Public Activities"]').should("not.contain", label);

    cy.get('[data-test="Private Activities"]')
      .contains(label)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]')
      .click()
      .parent()
      .find('[data-test="Settings Menu Item"]')
      .click();

    cy.get('[data-test="Public Checkbox"]').click();

    cy.get(".chakra-modal__close-btn").click();
    // // cy.get('[data-test="Close Settings Button"]').click(); //TODO use data-test

    cy.get('[data-test="Public Activities"]').contains(label);
    cy.get('[data-test="Private Activities"]').should("not.contain", label);
  });

  it("Share activities and remix", () => {
    let labelPrefix = "Share activities and remix";
    let helloLabel = `${labelPrefix}: Hello!`;
    let stayPrivateLabel = `${labelPrefix}: Stay private`;

    // Note: create unique user ids for this test
    // so that can clear out all content for these ids
    // without affecting other tests that may be running in parallel
    let user1 = "cyShareActUser1";
    let user2 = "cyShareActUser2";
    cy.signin({ userId: user2, firstName: "C", lastName: "D" });
    cy.signin({ userId: user1, firstName: "A", lastName: "B" });
    cy.visit(`/`);
    cy.clearAllOfAUsersCoursesAndItems({ userId: user1 });
    cy.clearAllOfAUsersCoursesAndItems({ userId: user2 });
    cy.clearAllOfAUsersActivities({ userId: user1 });
    cy.clearAllOfAUsersActivities({ userId: user2 });

    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);
    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);

    cy.log("Create an activity");
    cy.get('[data-test="Add Activity"]').click();

    cy.get(".cm-content").type(
      `<p>What is your name? <textinput name="name" /></p>{enter}`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);
    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);

    cy.log("Edit the activity");
    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);

    cy.get('[data-test="Viewer Update Button"]').should("have.length", 1);
    cy.log("In the editor");

    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p>Hello, <text name="name2" copySource="name" />!</p>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");

    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);
    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);

    cy.log("Make the activity public");
    cy.get(
      '[data-test="Private Activities"] [data-test="Card Menu Button"]',
    ).click();
    cy.get('[data-test="Make Public Menu Item"]').click();

    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);
    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);

    cy.log("Change activity label");
    cy.get(
      '[data-test="Public Activities"] [data-test="Card Menu Button"]',
    ).click();
    cy.get('[data-test="Settings Menu Item"]').click();

    cy.get('[data-test="Activity Label"]').clear().type(helloLabel).blur();

    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]')
      .eq(0)
      .should("contain.text", helloLabel);

    cy.get(".chakra-modal__close-btn").click(); //Couldn't figure out data-test on this one

    cy.log("Edit the public activity");
    cy.get('[data-test="Public Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="draft">Draft content</p>`,
    );

    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");

    cy.get('[data-test="Portfolio"]').click();

    cy.log("Create a private activity");
    cy.get('[data-test="Add Activity"]').click();

    cy.get(".cm-content").type(`Stays private{enter}`);
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('[data-test="Controls Button"]').click();

    cy.get('[data-test="Activity Label"]')
      .clear()
      .type(stayPrivateLabel)
      .blur();
    cy.get(".chakra-modal__close-btn").click();

    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);
    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);

    cy.log("Log on as other user");
    cy.signin({ userId: user2 });

    cy.visit(`/`);

    cy.log("Cannot find private activity Stay Private");
    cy.get('[data-test="Community"]').click();
    cy.get('[data-test="Search"]').type(`${stayPrivateLabel}{enter}`);

    cy.get('[data-test="Search Results For"]').should(
      "have.text",
      stayPrivateLabel,
    );
    cy.get('[data-test="Search Results"] [data-test="Activity Card"]').should(
      "have.length",
      0,
    );

    cy.log("Find public activity Hello!");
    cy.get('[data-test="Search"]')
      .clear()
      .should("have.value", "")
      .type(`${helloLabel}{enter}`);
    cy.get('[data-test="Search Results For"]').should("have.text", helloLabel);

    cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");

    cy.get(cesc2("#/name")).type("Me{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Me!");

    cy.log("View source code");
    cy.contains("See Inside").click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");

    cy.get(cesc2("#/name")).type("You{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, You!");

    cy.log("Temporarily modify the source");
    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="temp_content">Temporary content</p>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/temp_content")).should("have.text", "Temporary content");

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/name")).type("Mom{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Mom!");

    cy.log("Remix");
    cy.get('[data-test="Copy to Portfolio Button"]').click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");
    cy.get(cesc2("#/temp_content")).should("not.exist");

    cy.log("Modify the source for real");
    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="actual_change">Actual change</p>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/actual_change")).should("have.text", "Actual change");

    cy.log("Find activity in portfolio");
    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);
    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 1);

    cy.log("Edit the activity");
    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("have.text", "Actual change");

    cy.get(cesc2("#/name")).type("Dad{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Dad!");

    cy.log("Log back in as first user");
    cy.signin({ userId: user1 });
    cy.visit(`/`);

    cy.log("Verify activity is unchanged with draft content");
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Public Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("not.exist");

    cy.log("Update public activity");
    cy.get('[data-test="Update Public Activity Button"]').click();

    cy.get(cesc2("#/name")).type("Sis{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Sis!");

    cy.log("Log back in as second user");
    cy.signin({ userId: user2 });
    cy.visit(`/`);

    cy.log("Find new version of public activity Hello!");
    cy.get('[data-test="Community"]').click();

    cy.get('[data-test="Search"]').type(`${helloLabel}{enter}`);
    cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("not.exist");

    cy.get(cesc2("#/name")).type("Bro{enter}");
    cy.get(cesc2("#/_p2")).should("have.text", "Hello, Bro!");

    cy.log("Remix");
    cy.get('[data-test="Copy to Portfolio Button"]').click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("not.exist");

    cy.log("Modify the source for real");
    cy.get(".cm-content").type(
      `{ctrl+end}{rightarrow}{ctrl+end}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}<p name="change2">New change</p>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/change2")).should("have.text", "New change");

    cy.log("Find both activities in portfolio");
    cy.get('[data-test="Portfolio"]').click();

    cy.get(
      '[data-test="Public Activities"] [data-test="Activity Card"]',
    ).should("have.length", 0);
    cy.get(
      '[data-test="Private Activities"] [data-test="Activity Card"]',
    ).should("have.length", 2);

    cy.log("View the most recently remixed activity");
    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("have.text", "Draft content");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("not.exist");
    cy.get(cesc2("#/change2")).should("have.text", "New change");

    cy.log("View the first remixed activity");
    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Private Activities"] [data-test="Card Image Link"] ')
      .eq(1)
      .click();

    cy.get(cesc2("#/_p2")).should("have.text", "Hello, !");
    cy.get(cesc2("#/draft")).should("not.exist");
    cy.get(cesc2("#/temp_content")).should("not.exist");
    cy.get(cesc2("#/actual_change")).should("have.text", "Actual change");
    cy.get(cesc2("#/change2")).should("not.exist");
  });

  it("View solution in portfolio", () => {
    const label = "View solution in portfolio";
    cy.deletePortfolioActivity({ userId, label });

    cy.get('[data-test="Portfolio"]').click();

    cy.log("Create an activity with a solution");
    cy.get('[data-test="Add Activity"]').click();

    cy.get(".cm-content").type(
      `<p>What is 1+1?</p>{enter}<solution name="sol"><number name="ans">2</number></solution>`,
    );

    cy.get(
      '[data-test="Activity Label Editable"] [data-test="Editable Preview"]',
    ).click();
    cy.get('[data-test="Activity Label Editable"] [data-test="Editable Input"]')
      .type(label)
      .blur();

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/_p1")).should("have.text", "What is 1+1?");

    cy.get(cesc2("#/ans")).should("not.exist");

    cy.get(cesc2("#/sol_button")).click();
    cy.get(cesc2("#/ans")).should("have.text", "2");
    cy.get(cesc2("#/sol_button")).click();
    cy.get(cesc2("#/ans")).should("not.exist");
    cy.get(cesc2("#/sol_button")).click();
    cy.get(cesc2("#/ans")).should("have.text", "2");
    cy.get(cesc2("#/sol_button")).click();
    cy.get(cesc2("#/ans")).should("not.exist");

    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Private Activities"]')
      .contains(label)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]')
      .click()
      .parent()
      .find('[data-test="Settings Menu Item"]')
      .click();

    cy.get('[data-test="Public Checkbox"]').click();

    cy.get(".chakra-modal__close-btn").click();
    // // cy.get('[data-test="Close Settings Button"]').click(); //TODO use data-test

    cy.get('[data-test="Public Activities"]').contains(label);
    cy.get('[data-test="Private Activities"]').should("not.contain", label);

    cy.get("[data-test=Community").click();
    cy.get("[data-test=Search]").type(label + "{enter}");

    cy.get('[data-test="Results All Matches"]')
      .contains(label)
      .get('[data-test="Card Image Link"]')
      .eq(0)
      .click();

    cy.get(cesc2("#/_p1")).should("have.text", "What is 1+1?");

    cy.get(cesc2("#/ans")).should("not.exist");

    cy.get(cesc2("#/sol_button")).click();
    cy.get(cesc2("#/ans")).should("have.text", "2");
    cy.get(cesc2("#/sol_button")).click();
    cy.get(cesc2("#/ans")).should("not.exist");
    cy.get(cesc2("#/sol_button")).click();
    cy.get(cesc2("#/ans")).should("have.text", "2");
    cy.get(cesc2("#/sol_button")).click();
    cy.get(cesc2("#/ans")).should("not.exist");
  });

  it("Links in portfolios", () => {
    const label1 = "Links in portfolios: linking page";
    const label2 = "Links in portfolios: linked page";
    cy.deletePortfolioActivity({ userId, label: label1 });
    cy.deletePortfolioActivity({ userId, label: label2 });

    cy.get('[data-test="Portfolio"]').click();

    cy.log("Create an activity that will be linked to");
    cy.get('[data-test="Add Activity"]').click();

    cy.get(".cm-content").type(`<p name="theP">Link to this page!</p>`);

    let linkedDoenetId;

    cy.url().then((url) => {
      linkedDoenetId = url.match(/portfolioeditor\/(\w*)/)[1];
    });

    cy.get(
      '[data-test="Activity Label Editable"] [data-test="Editable Preview"]',
    ).click();
    cy.get('[data-test="Activity Label Editable"] [data-test="Editable Input"]')
      .type(label2)
      .blur();

    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Private Activities"]')
      .contains(label2)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]')
      .click()
      .parent()
      .find('[data-test="Make Public Menu Item"]')
      .click();

    cy.get('[data-test="Public Activities"]').contains(label2);
    cy.get('[data-test="Private Activities"]').should("not.contain", label2);

    cy.log("Create an activity that will link to other activity");
    cy.get('[data-test="Add Activity"]')
      .click()
      .then(() => {
        cy.get(".cm-content").type(
          `<p>We have a <ref name="toDoc" uri="doenet:doenetId=${linkedDoenetId}">link to the activity</ref>.</p>
<p>We have a <ref name="toDocEdit" uri="doenet:doenetId=${linkedDoenetId}&edit=true">edit link to the activity</ref>.</p>`,
        );
      });

    cy.get(
      '[data-test="Activity Label Editable"] [data-test="Editable Preview"]',
    ).click();
    cy.get('[data-test="Activity Label Editable"] [data-test="Editable Input"]')
      .type(label1)
      .blur();

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/toDoc")).invoke("removeAttr", "target").click();
    cy.url().should("contain", "publicOverview");
    cy.get(cesc2("#/theP")).should("have.text", "Link to this page!");

    cy.go("back");

    cy.get(cesc2("#/toDocEdit")).invoke("removeAttr", "target").click();
    cy.url().should("contain", "portfolioeditor");
    cy.get(cesc2("#/theP")).should("have.text", "Link to this page!");

    cy.go("back");

    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Private Activities"]')
      .contains(label1)
      .parent()
      .parent()
      .find('[data-test="Card Menu Button"]')
      .click()
      .parent()
      .find('[data-test="Make Public Menu Item"]')
      .click();

    cy.log("Test links from community page");
    cy.get("[data-test=Community").click();
    cy.get("[data-test=Search]").type(label1 + "{enter}");

    cy.get('[data-test="Results All Matches"]')
      .contains(label1)
      .get('[data-test="Card Image Link"]')
      .eq(0)
      .click();

    cy.get(cesc2("#/toDoc")).invoke("removeAttr", "target").click();
    cy.url().should("contain", "publicOverview");
    cy.get(cesc2("#/theP")).should("have.text", "Link to this page!");

    cy.go("back");

    cy.get(cesc2("#/toDocEdit")).invoke("removeAttr", "target").click();
    cy.url().should("contain", "portfolioeditor");
    cy.get(cesc2("#/theP")).should("have.text", "Link to this page!");

    cy.log("Log on as other user");
    cy.signin({ userId: userId2 });

    cy.visit(`/`);

    cy.log("Test links from community page");
    cy.get("[data-test=Community").click();
    cy.get("[data-test=Search]").type(label1 + "{enter}");

    cy.get('[data-test="Results All Matches"]')
      .contains(label1)
      .get('[data-test="Card Image Link"]')
      .eq(0)
      .click();

    cy.get(cesc2("#/toDoc")).invoke("removeAttr", "target").click();
    cy.url().should("contain", "publicOverview");
    cy.get(cesc2("#/theP")).should("have.text", "Link to this page!");

    cy.go("back");

    cy.log("Edit link should go to public editor");
    cy.get(cesc2("#/toDocEdit")).invoke("removeAttr", "target").click();
    cy.url().should("contain", "publiceditor");
    cy.get(cesc2("#/theP")).should("have.text", "Link to this page!");
  });
});
