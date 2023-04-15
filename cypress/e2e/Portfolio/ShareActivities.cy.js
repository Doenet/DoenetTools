// import {signIn} from '../DoenetSignin/DoenetSignin.cy';

const { cesc2 } = require("../../../src/_utils/url");


describe('doenetEditor test', function () {
  const userId = "cyuserId";
  const userId2 = "cyuserId2";

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: userId2 });
  })
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId })
    cy.clearAllOfAUsersActivities({ userId: userId2 })
    cy.visit(`/`)
  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  it('Share activities and remix', () => {

    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').should("have.length", 0);
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').should("have.length", 0);

    cy.log("Create an activity");
    cy.get('[data-test="Add Activity"]').click();

    cy.get('.cm-content').type(`<p>What is your name? <textinput name="name" /></p>{enter}`)
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('[data-test="Crumb 0"]').click();
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').should("have.length", 1);
    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').should("have.length", 0);

    cy.log("Edit the activity");
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').eq(0).find("img").eq(0).click()
    cy.get('.cm-content').type(`{ctrl+end}<p>Hello, <text name="name2" copySource="name" />!</p>`)
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')

    cy.get('[data-test="Crumb 0"]').click();
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').should("have.length", 1);
    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').should("have.length", 0);


    cy.log("Make the activity public");
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').eq(0).find("button").eq(0).click()
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').eq(0).contains("Make Public").click();
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').should("have.length", 0);
    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').should("have.length", 1);


    cy.log("Change activity label")

    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').eq(0).find("button").eq(0).click()
    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').eq(0).contains("Settings").click();
    cy.get('[data-test="Activity Label"]').clear().type("Hello!")
    cy.contains("button", "Update").click();

    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').eq(0).should('contain.text', "Hello!")


    cy.log("Edit the public activity");
    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').eq(0).find("img").eq(0).click()
    cy.get('.cm-content').type(`{ctrl+end}<p name="draft">Draft content</p>`)
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2('#/draft')).should('have.text', 'Draft content')

    cy.get('[data-test="Crumb 0"]').click();


    cy.log("Create a private activity");
    cy.get('[data-test="Add Activity"]').click();

    cy.get('.cm-content').type(`Stays private{enter}`)
    cy.get('[data-test="Viewer Update Button"]').click();


    cy.get('[data-test="Support Panel Controls"]').contains("Button", "Settings").click();
    cy.get('[data-test="Activity Label"]').clear().type("Stay private")
    cy.contains("button", "Update").click();


    cy.get('[data-test="Crumb 0"]').click();

    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').should('have.length', 1)
    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').should('have.length', 1)


    cy.log("Log on as other user")
    cy.signin({ userId: userId2 });

    cy.visit(`/`)


    cy.log("Cannot find private activity Stay Private");
    cy.get('[data-test="Community"]').click();
    cy.get('[data-test="Search"]').type("Stay Private{enter}")
    cy.get('[data-test="Search Results"] [data-test="Activity Card"]').should("have.length", 0)

    cy.log("Find public activity Hello!")
    cy.get('[data-test="Search"]').clear().type("Hello!{enter}")
    cy.get('[data-test="Search Results"] [data-test="Activity Card"]').eq(0).find("img").click();

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('not.exist');

    cy.get(cesc2('#/name')).type("Me{enter}");
    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, Me!')


    cy.log("View source code");
    cy.contains("See Inside").click();

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('not.exist');

    cy.get(cesc2('#/name')).type("You{enter}");
    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, You!')

    cy.log("Temporarily modify the source");
    cy.get('.cm-content').type(`{ctrl+end}<p name="temp_content">Temporary content</p>`)
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2('#/temp_content')).should('have.text', 'Temporary content')

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/name')).type("Mom{enter}");
    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, Mom!')


    cy.log("Remix");
    cy.contains("Remix").click();

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('not.exist');
    cy.get(cesc2('#/temp_content')).should('not.exist');

    cy.log("Modify the source for real");
    cy.get('.cm-content').type(`{ctrl+end}<p name="actual_change">Actual change</p>`)
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2('#/actual_change')).should('have.text', 'Actual change')

    cy.log("Find activity in portfolio")
    cy.get('[data-test="Crumb 0"]').click();
    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').should("have.length", 0);
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').should('have.length', 1)

    cy.log("Edit the activity");
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').eq(0).find("img").eq(0).click()

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('not.exist');
    cy.get(cesc2('#/temp_content')).should('not.exist');
    cy.get(cesc2('#/actual_change')).should('have.text', 'Actual change')

    cy.get(cesc2('#/name')).type("Dad{enter}");
    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, Dad!')


    cy.log("Log back in as first user")
    cy.signin({ userId });
    cy.visit(`/`)


    cy.log("Verify activity is unchanged with draft content")
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').eq(0).find("img").eq(0).click()

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('have.text', 'Draft content')
    cy.get(cesc2('#/temp_content')).should('not.exist');
    cy.get(cesc2('#/actual_change')).should('not.exist');


    cy.log("Update public activity")
    cy.get('[data-test="Support Panel Controls"]').contains("Button", "Update Public Activity").click();

    cy.get(cesc2('#/name')).type("Sis{enter}");
    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, Sis!')


    cy.log("Log back in as second user")
    cy.signin({ userId: userId2 });
    cy.visit(`/`)


    cy.log("Find new version of public activity Hello!")
    cy.get('[data-test="Community"]').click();

    cy.get('[data-test="Search"]').type("Hello!{enter}")
    cy.get('[data-test="Search Results"] [data-test="Activity Card"]').eq(0).find("img").click();

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('have.text', 'Draft content')
    cy.get(cesc2('#/temp_content')).should('not.exist');
    cy.get(cesc2('#/actual_change')).should('not.exist');

    cy.get(cesc2('#/name')).type("Bro{enter}");
    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, Bro!')


    cy.log("Remix");
    cy.contains("Remix").click();

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('have.text', 'Draft content')
    cy.get(cesc2('#/temp_content')).should('not.exist');
    cy.get(cesc2('#/actual_change')).should('not.exist');

    cy.log("Modify the source for real");
    cy.get('.cm-content').type(`{ctrl+end}<p name="change2">New change</p>`)
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2('#/change2')).should('have.text', 'New change')

    cy.log("Find both activities in portfolio")
    cy.get('[data-test="Crumb 0"]').click();
    cy.get('[data-test="Portfolio"]').click();

    cy.get('[data-test="Public Activities"] [data-test="Activity Card"]').should("have.length", 0);
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').should('have.length', 2)

    cy.log("View the most recently remixed activity");
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').eq(0).find("img").eq(0).click()

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('have.text', 'Draft content')
    cy.get(cesc2('#/temp_content')).should('not.exist');
    cy.get(cesc2('#/actual_change')).should('not.exist');
    cy.get(cesc2('#/change2')).should('have.text', 'New change')


    cy.log("View the first remixed activity");
    cy.get('[data-test="Crumb 0"]').click();
    cy.get('[data-test="Private Activities"] [data-test="Activity Card"]').eq(1).find("img").eq(0).click()

    cy.get(cesc2('#/_p2')).should('have.text', 'Hello, !')
    cy.get(cesc2('#/draft')).should('not.exist');
    cy.get(cesc2('#/temp_content')).should('not.exist');
    cy.get(cesc2('#/actual_change')).should('have.text', 'Actual change')
    cy.get(cesc2('#/change2')).should('not.exist');





  })

})