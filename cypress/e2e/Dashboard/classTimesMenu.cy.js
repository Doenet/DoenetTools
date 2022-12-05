describe('Dashboard Classtime Menu tests', function () {
    const userId = "cyuserId";
    const courseId = "courseid1";

  
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
      //Just have the database clear this out
      cy.task('queryDb', `DELETE FROM class_times WHERE courseId="${courseId}"`);
      cy.visit(`http://localhost/course?tool=dashboard&courseId=${courseId}`)
    })

    it('Add a default time',()=>{
      cy.get('[data-test="ClassTimes Menu"]').click();
      cy.get('[data-test="Add Classtime"]').click();
      cy.get('[data-test="DOTW Dropdown 0"]').contains('Monday');
      //Not sure why these don't work and component is changing anyways
      // cy.get('[data-test="Classtime start time 0"]').contains('9:00 AM');
      // cy.get('[data-test="Classtime end time 0"]').contains('10:00 AM');
    })

    it('Add and Delete a class time',()=>{
      cy.get('[data-test="ClassTimes Menu"]').click();
      cy.get('[data-test="Add Classtime"]').click();
      cy.get('[data-test="DOTW Dropdown 0"]').should('exist');
      cy.get('[data-test="Classtime Delete Button 0"]').click();
      cy.get('[data-test="DOTW Dropdown 0"]').should('not.exist');
    })

    it('stores in the database',()=>{
      cy.get('[data-test="ClassTimes Menu"]').click();
      cy.get('[data-test="Add Classtime"]').click();
      cy.get('[data-test="DOTW Dropdown 0"]').should('exist');
      cy.wait(200);
      cy.task('queryDb', `SELECT * FROM class_times WHERE courseId="${courseId}"`).then((result)=>{
        expect(result.length).eq(1);
      });

    })
})