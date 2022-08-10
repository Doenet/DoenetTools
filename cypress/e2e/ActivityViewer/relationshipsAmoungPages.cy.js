import cssesc from 'cssesc';
import { C } from '../../../src/Core/components/ParagraphMarkup';
import { numberToLetters } from '../../../src/Core/utils/sequence';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Relationships among pages tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it("Problem numbering continues across pages", () => {
    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition: `
      <document type="activity">
        <order>
          <page>
            <problem>
              <p>The first problem</p>
            </problem>
          </page>
          <page>
            <problem>
              <p>The second problem</p>
            </problem>
          </page>
          <page>
            <problem>
              <p>The third problem</p>
            </problem>
            <problem>
              <p>The fourth problem</p>
            </problem>
          </page>
          <page>
            <problem>
              <p>The fifth problem</p>
            </problem>
            <problem>
              <title>Named problem</title>
              <p>The sixth problem</p>
            </problem>
          </page>
          <page>
            <problem>
              <p>The seventh problem</p>
            </problem>
          </page>
        </order>
      </document>
        
        `,
        
      }, "*");
    })

    cy.get('#\\/_problem1_title').should('have.text', 'Problem 1');
    cy.get('#\\/_p1').should('have.text', 'The first problem');

    cy.get('[data-test=next]').click();

    cy.get('#\\/_problem1_title').should('have.text', 'Problem 2');
    cy.get('#\\/_p1').should('have.text', 'The second problem');

    cy.get('[data-test=next]').click();

    cy.get('#\\/_problem1_title').should('have.text', 'Problem 3');
    cy.get('#\\/_p1').should('have.text', 'The third problem');

    cy.get('#\\/_problem2_title').should('have.text', 'Problem 4');
    cy.get('#\\/_p2').should('have.text', 'The fourth problem');

    cy.get('[data-test=next]').click();

    cy.get('#\\/_problem1_title').should('have.text', 'Problem 5');
    cy.get('#\\/_p1').should('have.text', 'The fifth problem');

    cy.get('#\\/_problem2_title').should('have.text', 'Named problem');
    cy.get('#\\/_title1').should('have.text', 'Named problem');
    cy.get('#\\/_p2').should('have.text', 'The sixth problem');

    cy.get('[data-test=next]').click();

    cy.get('#\\/_problem1_title').should('have.text', 'Problem 7');
    cy.get('#\\/_p1').should('have.text', 'The seventh problem');

  })

  it("Section numbering continues across pages", () => {
    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition: `
      <document type="activity">
        <order>
          <page>
            <section>
              <p>The first section</p>
            </section>
          </page>
          <page>
            <section>
              <p>The second section</p>
              <subsection>
                <p>First subsection of second section</p>
              </subsection>
              <subsection>
                <p>Second subsection of second section</p>
              </subsection>
            </section>
          </page>
          <page>
            <section>
              <p>The third section</p>
            </section>
            <section>
              <p>The fourth section</p>
              <subsection>
                <p>First subsection of fourth section</p>
              </subsection>
              <subsection>
                <p>Second subsection of fourth section</p>
              </subsection>
            </section>
          </page>
          <page>
            <section>
              <p>The fifth section</p>
            </section>
            <section>
              <title>Named section</title>
              <p>The sixth section</p>
              <subsection>
                <p>First subsection of sixth section</p>
              </subsection>
              <subsection>
                <p>Second subsection of sixth section</p>
              </subsection>
            </section>
          </page>
          <page>
            <section>
              <p>The seventh section</p>
            </section>
          </page>
        </order>
      </document>
        
        `,
        
      }, "*");
    })

    cy.get('#\\/_section1_title').should('have.text', 'Section 1');
    cy.get('#\\/_p1').should('have.text', 'The first section');

    cy.get('[data-test=next]').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 2');
    cy.get('#\\/_p1').should('have.text', 'The second section');

    cy.get('#\\/_subsection1_title').should('have.text', 'Section 2.1');
    cy.get('#\\/_p2').should('have.text', 'First subsection of second section');
    cy.get('#\\/_subsection2_title').should('have.text', 'Section 2.2');
    cy.get('#\\/_p3').should('have.text', 'Second subsection of second section');

    cy.get('[data-test=next]').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 3');
    cy.get('#\\/_p1').should('have.text', 'The third section');

    cy.get('#\\/_section2_title').should('have.text', 'Section 4');
    cy.get('#\\/_p2').should('have.text', 'The fourth section');

    cy.get('#\\/_subsection1_title').should('have.text', 'Section 4.1');
    cy.get('#\\/_p3').should('have.text', 'First subsection of fourth section');
    cy.get('#\\/_subsection2_title').should('have.text', 'Section 4.2');
    cy.get('#\\/_p4').should('have.text', 'Second subsection of fourth section');


    cy.get('[data-test=next]').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 5');
    cy.get('#\\/_p1').should('have.text', 'The fifth section');

    cy.get('#\\/_section2_title').should('have.text', 'Named section');
    cy.get('#\\/_title1').should('have.text', 'Named section');
    cy.get('#\\/_p2').should('have.text', 'The sixth section');

    cy.get('#\\/_subsection1_title').should('have.text', 'Section 6.1');
    cy.get('#\\/_p3').should('have.text', 'First subsection of sixth section');
    cy.get('#\\/_subsection2_title').should('have.text', 'Section 6.2');
    cy.get('#\\/_p4').should('have.text', 'Second subsection of sixth section');

    cy.get('[data-test=next]').click();

    cy.get('#\\/_section1_title').should('have.text', 'Section 7');
    cy.get('#\\/_p1').should('have.text', 'The seventh section');

  })

})