
describe('Examples', function () {
  const userId = "cyuserId";
  const courseId = "courseid1";


  before(() => {
    cy.clearCoursePeople({ courseId });
    cy.createCourse({ userId, courseId });
  })


  beforeEach(() => {
    cy.signin({ userId });
    cy.visit(`/`)
  })

  it('set can upload', () => {
    // cy.setUserUpload({userId,newValue:'0'})
    cy.setUserUpload({ userId, newValue: '1' })
  })

  it("set user's role can canEditContent", () => {

    const roleId = "canEditRoleId";
    cy.createUserRole({ courseId, roleId, label: "can edit role" });
    cy.updateRolePerm({ roleId, permName: "canEditContent", newValue: "1" })
    cy.setUserRole({ userId, courseId, roleId });
  })


})