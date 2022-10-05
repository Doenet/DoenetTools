describe('Assigned Activity Tests', function () {
  const userId = "cyuserId";
  const studentUserId = "cyStudentUserId";
  const courseId = "courseid1";
  const doenetId = "activity1id";
  const pageDoenetId = "_page1id";

  before(()=>{
    cy.signin({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId });
    cy.clearAllOfAUsersCoursesAndItems({ userId: studentUserId });
    cy.createCourse({ userId, courseId, studentUserId });
  })
  beforeEach(() => {
    cy.signin({ userId });
    cy.clearIndexedDB();
    cy.clearAllOfAUsersActivities({ userId });
    cy.clearAllOfAUsersActivities({ userId: studentUserId });
    cy.createActivity({ courseId, doenetId, parentDoenetId:courseId, pageDoenetId });
    cy.visit(`http://localhost/course?tool=editor&doenetId=${doenetId}&pageId=${pageDoenetId}`);
  })


  Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    return false;
  })

  /* Methods to get/set the date and time */

  // Formatting the date to be 'mm/dd/yyyy' WITH leading zeros
  // Ex: '09/12/2022' for September 12, 2022
  function formatDateWithYear(date) {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;

    return mm + '/' + dd + '/' + yyyy;
  }

  // Formatting the date to be 'mm/dd' WITHOUT leading zeros
  // Ex: '9/12' for September 12, 2022
  function formatDateWithoutYear(date) {
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    return mm + '/' + dd;
  }

  function getDayOfWeek(date) {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return weekday[date.getDay()];
  }

  function getAmPm(hour) {
    return hour >= 12 ? 'PM' : 'AM';
  }

  function formatHours(date) {
    let hr = date.getHours();
    hr = hr % 12;
    return hr ? hr : 12; // Hour '0' should be '12
  }

  function formatMinutes(date) {
    let min = date.getMinutes();
    return min < 10 ? '0' + min : min;

  }

  // Formatting the time to be 'hh:mm A/P'
  // Ex: '4:02 P' for '04:02:00 PM'
  function formatTime(date) {
    let hr = formatHours(date);
    let min = formatMinutes(date);
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM'; // Datetime component automatically adds the 'M'

    return hr + ':' + min + ' ' + ampm;
  }

  
  it('Activity contains due date in Content page', () => {

    const assignedDate = new Date();
    let dueDate = new Date(assignedDate.getTime() + 7 * 24 * 60 * 60 * 1000); // One week from now

    // Update the activity as the owner
    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Due Date Checkbox"]').click();
    cy.get('[data-test="Due Date"]').should('have.value', formatDateWithYear(dueDate) + ' ' + formatTime(dueDate));
    cy.get('[data-test="Assigned Date Checkbox"]').click();
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1000); // Wait for activity to be saved and assigned

    // Sign in as a student
    cy.signin({ userId: studentUserId });
    cy.visit(`http://localhost/course?tool=navigation&courseId=${courseId}`)

    // Check if the Content page contains the correct activity with the due date
    cy.get('.navigationRow').should('have.length', 1); // Need this to wait for the row to appear
    cy.get('[data-test="rowLabel"]').contains('Cypress Activity');
    cy.get('.navigationRow').eq(0).get('.navigationColumn2').contains(formatDateWithYear(dueDate) + ', ' + formatHours(dueDate) + ':' + formatMinutes(dueDate) + ':00');
  
  })


  it('Activity contains assigned date and due date in Content By Week page', () => {

    const assignedDate = new Date();
    let dueDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // One week from now

    // Update the activity as the owner
    cy.get('[data-test="AssignmentSettingsMenu Menu"]').click();
    cy.get('[data-test="Assigned Date Checkbox"]').click();
    cy.get('[data-test="Assigned Date"]').should('have.value', formatDateWithYear(assignedDate) + ' ' + formatTime(assignedDate));
    cy.get('[data-test="Due Date Checkbox"]').click();
    cy.get('[data-test="Due Date"]').should('have.value', formatDateWithYear(dueDate) + ' ' + formatTime(dueDate));
    cy.get('[data-test="Assign Activity"]').click();
    cy.wait(1000); // Wait for activity to be saved and assigned

    // Sign in as a student
    // Check if the Content By Week page contains the correct activity with the assigned date and due date
    cy.signin({ userId: studentUserId });
    cy.visit(`http://localhost/course?tool=dashboard&courseId=${courseId}`);
    cy.get('[data-test="Main Panel"]').scrollTo('right');
    cy.get(':nth-child(2) > .sc-bBHHxi').click();
    cy.get('table').should('have.length', 1); // Need this to wait for the row to appear
    cy.get('table > :nth-child(2) > :nth-child(2)').contains('Cypress Activity');
    cy.get('table > :nth-child(2) > :nth-child(3)').contains(formatDateWithoutYear(assignedDate) + ' ' + formatTime(assignedDate)); // Add the 'M' back to AM/PM
    cy.get('table > :nth-child(2) > :nth-child(4)').contains(formatDateWithoutYear(dueDate) + ' ' + formatTime(dueDate));
  
  })

})