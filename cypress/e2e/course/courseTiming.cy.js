

describe('Course Timing Tests', function () {
        const userId = "cyuserId";
  // const userId = "devuserId";
        const courseId = "courseid1";
        const doenetId = "activity1id";
        const pageDoenetId = "_page1id";
    

    before(()=>{
        cy.signin({userId});
        cy.clearAllOfAUsersCoursesAndItems({userId});
        cy.createCourse({userId,courseId});
    })

    beforeEach(()=>{
        cy.signin({userId});
        cy.clearIndexedDB();
        cy.clearAllOfAUsersActivities({userId})
        cy.createActivity({courseId,doenetId,parentDoenetId:courseId,pageDoenetId});
        cy.visit(`http://localhost/course?tool=dashboard&courseId=${courseId}`);
        cy.get('[data-test="ClassTimes Menu"]').click();
        cy.get('.svg-inline--fa.fa-plus').click();
    })
        
        
    
        it.skip('choosing class timing by clicking',()=>{
            const correctTime ='1:00 PM';
            cy.get('.rdt').eq(0).click();
            cy.get('.rdtCounter > .rdtBtn').eq(0).click();
            cy.get('.rdtCounter> .rdtBtn').eq(4).click();
            cy.get('[data-test="Main Panel"]').click();   
            cy.get('.form-control').eq(0).should('have.value', correctTime);

      })

        it('choosing class timing by typing', ()=>{
            cy.get('.rdt').eq(0).click();
            cy.get(' .form-control').eq(0).type('1:00 PM');
            cy.get('[data-test="Main Panel"]').click();  
            cy.get('.form-control').eq(0).should('have.value', '1:00 PM');

      })
})

