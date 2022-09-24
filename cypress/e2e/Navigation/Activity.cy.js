describe('Activity test', function () {
    const userId = "cyuserId";
    // const userId = "devuserId";
    const courseId = "courseid1";
    // const doenetId1 = "activity1id";
    // const pageDoenetId1 = "_page1id";
    // const doenetId2 = "activity2id";
    // const pageDoenetId2 = "_page2id";
  
    before(()=>{
      // cy.clearAllOfAUsersActivities({userId})
      cy.signin({userId});
      cy.clearAllOfAUsersCoursesAndItems({userId});
      cy.createCourse({userId,courseId});
    })
    beforeEach(() => {
      cy.signin({userId});
      cy.clearIndexedDB();
      cy.clearAllOfAUsersActivities({userId})
      // cy.createActivity({courseId,doenetId:doenetId1,parentDoenetId:courseId,pageDoenetId:pageDoenetId1});
      // cy.createActivity({courseId,doenetId:doenetId2,parentDoenetId:courseId,pageDoenetId:pageDoenetId2});
      cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)
    })

    it('Renaming activity',()=>{
        cy.get('[data-test="Add Activity Button"]').click();
        cy.get('.navigationRow').should('have.length',1); //Need this to wait for the row to appear
        cy.get('.navigationRow').eq(0).get('.navigationColumn1').contains('Untitled Activity');
        cy.get('.navigationRow').eq(0).get('.navigationColumn1').click();
        cy.get('[data-test="Label Activity"]', {timeout:20000}).should('be.visible').clear().type('Hello')
        cy.get('[data-test="infoPanelItemLabel"]').click();
        cy.get('[data-test="rowLabel"]').should('contain.text', 'Hello');
        // cy.get('[style="display: initial; width: 200px; align-items: center;"] > .sc-ctqQKy').clear();
        // cy.get('[style="display: initial; width: 200px; align-items: center;"] > .sc-ctqQKy').click({force:true}).type('Hello');

        //cy.get('[style="display: initial; width: 200px; align-items: center;"] > .sc-ctqQKy').type('First Activity');
        

    })
})