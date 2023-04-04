import cssesc from 'cssesc';

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
    cy.visit('/src/Tools/cypressTest/')
  })

  it("Problem numbering continues across pages", () => {

    let activityDefinition = `
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
          <problem includeAutoName includeAutoNumber>
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
    `;

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1');
    cy.get('#page1\\/_p1').should('have.text', 'The first problem');

    cy.get('#page2\\/_problem1_title').should('not.exist')
    cy.get('#page2\\/_p1').should('not.exist')
    cy.get('#page3\\/_problem1_title').should('not.exist')
    cy.get('#page3\\/_p1').should('not.exist')
    cy.get('#page3\\/_problem2_title').should('not.exist')
    cy.get('#page3\\/_p2').should('not.exist')
    cy.get('#page4\\/_problem1_title').should('not.exist')
    cy.get('#page4\\/_p1').should('not.exist')
    cy.get('#page4\\/_problem2_title').should('not.exist')
    cy.get('#page4\\/_title1').should('not.exist')
    cy.get('#page4\\/_p2').should('not.exist')
    cy.get('#page5\\/_problem1_title').should('not.exist')
    cy.get('#page5\\/_p1').should('not.exist')


    cy.get('[data-test=next]').click();

    cy.get('#page2\\/_problem1_title').should('have.text', 'Problem 2');
    cy.get('#page2\\/_p1').should('have.text', 'The second problem');

    cy.get('#page1\\/_problem1_title').should('not.exist')
    cy.get('#page1\\/_p1').should('not.exist')
    cy.get('#page3\\/_problem1_title').should('not.exist')
    cy.get('#page3\\/_p1').should('not.exist')
    cy.get('#page3\\/_problem2_title').should('not.exist')
    cy.get('#page3\\/_p2').should('not.exist')
    cy.get('#page4\\/_problem1_title').should('not.exist')
    cy.get('#page4\\/_p1').should('not.exist')
    cy.get('#page4\\/_problem2_title').should('not.exist')
    cy.get('#page4\\/_title1').should('not.exist')
    cy.get('#page4\\/_p2').should('not.exist')
    cy.get('#page5\\/_problem1_title').should('not.exist')
    cy.get('#page5\\/_p1').should('not.exist')

    cy.get('[data-test=next]').click();

    cy.get('#page3\\/_problem1_title').should('have.text', 'Problem 3');
    cy.get('#page3\\/_p1').should('have.text', 'The third problem');
    cy.get('#page3\\/_problem2_title').should('have.text', 'Problem 4');
    cy.get('#page3\\/_p2').should('have.text', 'The fourth problem');

    cy.get('#page1\\/_problem1_title').should('not.exist')
    cy.get('#page1\\/_p1').should('not.exist')
    cy.get('#page2\\/_problem1_title').should('not.exist')
    cy.get('#page2\\/_p1').should('not.exist')
    cy.get('#page4\\/_problem1_title').should('not.exist')
    cy.get('#page4\\/_p1').should('not.exist')
    cy.get('#page4\\/_problem2_title').should('not.exist')
    cy.get('#page4\\/_title1').should('not.exist')
    cy.get('#page4\\/_p2').should('not.exist')
    cy.get('#page5\\/_problem1_title').should('not.exist')
    cy.get('#page5\\/_p1').should('not.exist')


    cy.get('[data-test=next]').click();

    cy.get('#page4\\/_problem1_title').should('have.text', 'Problem 5');
    cy.get('#page4\\/_p1').should('have.text', 'The fifth problem');
    cy.get('#page4\\/_problem2_title').should('have.text', 'Problem 6: Named problem');
    cy.get('#page4\\/_title1').should('have.text', 'Named problem');
    cy.get('#page4\\/_p2').should('have.text', 'The sixth problem');

    cy.get('#page1\\/_problem1_title').should('not.exist')
    cy.get('#page1\\/_p1').should('not.exist')
    cy.get('#page2\\/_problem1_title').should('not.exist')
    cy.get('#page2\\/_p1').should('not.exist')
    cy.get('#page3\\/_problem1_title').should('not.exist')
    cy.get('#page3\\/_p1').should('not.exist')
    cy.get('#page3\\/_problem2_title').should('not.exist')
    cy.get('#page3\\/_p2').should('not.exist')
    cy.get('#page5\\/_problem1_title').should('not.exist')
    cy.get('#page5\\/_p1').should('not.exist')



    cy.get('[data-test=next]').click();

    cy.get('#page5\\/_problem1_title').should('have.text', 'Problem 7');
    cy.get('#page5\\/_p1').should('have.text', 'The seventh problem');

    cy.get('#page1\\/_problem1_title').should('not.exist')
    cy.get('#page1\\/_p1').should('not.exist')
    cy.get('#page2\\/_problem1_title').should('not.exist')
    cy.get('#page2\\/_p1').should('not.exist')
    cy.get('#page3\\/_problem1_title').should('not.exist')
    cy.get('#page3\\/_p1').should('not.exist')
    cy.get('#page3\\/_problem2_title').should('not.exist')
    cy.get('#page3\\/_p2').should('not.exist')
    cy.get('#page4\\/_problem1_title').should('not.exist')
    cy.get('#page4\\/_p1').should('not.exist')
    cy.get('#page4\\/_problem2_title').should('not.exist')
    cy.get('#page4\\/_title1').should('not.exist')
    cy.get('#page4\\/_p2').should('not.exist')



    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_paginate').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })

    // Note: activity is sufficiently short that even page 5
    // is within the buffer to be activated without needing to scroll

    cy.get('#page1\\/_problem1_title').should('have.text', 'Problem 1');
    cy.get('#page1\\/_p1').should('have.text', 'The first problem');


    cy.get('#page2\\/_problem1_title').should('have.text', 'Problem 2');
    cy.get('#page2\\/_p1').should('have.text', 'The second problem');

    cy.get('#page3\\/_problem1_title').should('have.text', 'Problem 3');
    cy.get('#page3\\/_p1').should('have.text', 'The third problem');
    cy.get('#page3\\/_problem2_title').should('have.text', 'Problem 4');
    cy.get('#page3\\/_p2').should('have.text', 'The fourth problem');

    cy.get('#page4\\/_problem1_title').should('have.text', 'Problem 5');
    cy.get('#page4\\/_p1').should('have.text', 'The fifth problem');
    cy.get('#page4\\/_problem2_title').should('have.text', 'Problem 6: Named problem');
    cy.get('#page4\\/_title1').should('have.text', 'Named problem');
    cy.get('#page4\\/_p2').should('have.text', 'The sixth problem');

    cy.get('#page5\\/_problem1_title').should('have.text', 'Problem 7');
    cy.get('#page5\\/_p1').should('have.text', 'The seventh problem');

  })

  it("Section numbering continues across pages", () => {
    let activityDefinition = `
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
            <section includeAutoName includeAutoNumber>
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
        `;


    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1');
    cy.get('#page1\\/_p1').should('have.text', 'The first section');

    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.get('#page2\\/_p1').should('not.exist')
    cy.get('#page3\\/_section1_title').should('not.exist')
    cy.get('#page3\\/_p1').should('not.exist')
    cy.get('#page3\\/_section2_title').should('not.exist')
    cy.get('#page3\\/_p2').should('not.exist')
    cy.get('#page4\\/_section1_title').should('not.exist')
    cy.get('#page4\\/_p1').should('not.exist')
    cy.get('#page4\\/_section2_title').should('not.exist')
    cy.get('#page4\\/_title1').should('not.exist')
    cy.get('#page4\\/_p2').should('not.exist')
    cy.get('#page5\\/_section1_title').should('not.exist')
    cy.get('#page5\\/_p1').should('not.exist')


    cy.get('[data-test=next]').click();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2');
    cy.get('#page2\\/_p1').should('have.text', 'The second section');

    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page1\\/_p1').should('not.exist')
    cy.get('#page3\\/_section1_title').should('not.exist')
    cy.get('#page3\\/_p1').should('not.exist')
    cy.get('#page3\\/_section2_title').should('not.exist')
    cy.get('#page3\\/_p2').should('not.exist')
    cy.get('#page4\\/_section1_title').should('not.exist')
    cy.get('#page4\\/_p1').should('not.exist')
    cy.get('#page4\\/_section2_title').should('not.exist')
    cy.get('#page4\\/_title1').should('not.exist')
    cy.get('#page4\\/_p2').should('not.exist')
    cy.get('#page5\\/_section1_title').should('not.exist')
    cy.get('#page5\\/_p1').should('not.exist')

    cy.get('[data-test=next]').click();

    cy.get('#page3\\/_section1_title').should('have.text', 'Section 3');
    cy.get('#page3\\/_p1').should('have.text', 'The third section');
    cy.get('#page3\\/_section2_title').should('have.text', 'Section 4');
    cy.get('#page3\\/_p2').should('have.text', 'The fourth section');

    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page1\\/_p1').should('not.exist')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.get('#page2\\/_p1').should('not.exist')
    cy.get('#page4\\/_section1_title').should('not.exist')
    cy.get('#page4\\/_p1').should('not.exist')
    cy.get('#page4\\/_section2_title').should('not.exist')
    cy.get('#page4\\/_title1').should('not.exist')
    cy.get('#page4\\/_p2').should('not.exist')
    cy.get('#page5\\/_section1_title').should('not.exist')
    cy.get('#page5\\/_p1').should('not.exist')


    cy.get('[data-test=next]').click();

    cy.get('#page4\\/_section1_title').should('have.text', 'Section 5');
    cy.get('#page4\\/_p1').should('have.text', 'The fifth section');
    cy.get('#page4\\/_section2_title').should('have.text', 'Section 6: Named section');
    cy.get('#page4\\/_title1').should('have.text', 'Named section');
    cy.get('#page4\\/_p2').should('have.text', 'The sixth section');

    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page1\\/_p1').should('not.exist')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.get('#page2\\/_p1').should('not.exist')
    cy.get('#page3\\/_section1_title').should('not.exist')
    cy.get('#page3\\/_p1').should('not.exist')
    cy.get('#page3\\/_section2_title').should('not.exist')
    cy.get('#page3\\/_p2').should('not.exist')
    cy.get('#page5\\/_section1_title').should('not.exist')
    cy.get('#page5\\/_p1').should('not.exist')



    cy.get('[data-test=next]').click();

    cy.get('#page5\\/_section1_title').should('have.text', 'Section 7');
    cy.get('#page5\\/_p1').should('have.text', 'The seventh section');

    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page1\\/_p1').should('not.exist')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.get('#page2\\/_p1').should('not.exist')
    cy.get('#page3\\/_section1_title').should('not.exist')
    cy.get('#page3\\/_p1').should('not.exist')
    cy.get('#page3\\/_section2_title').should('not.exist')
    cy.get('#page3\\/_p2').should('not.exist')
    cy.get('#page4\\/_section1_title').should('not.exist')
    cy.get('#page4\\/_p1').should('not.exist')
    cy.get('#page4\\/_section2_title').should('not.exist')
    cy.get('#page4\\/_title1').should('not.exist')
    cy.get('#page4\\/_p2').should('not.exist')



    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_paginate').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1');
    cy.get('#page1\\/_p1').should('have.text', 'The first section');


    cy.get('#page2').scrollIntoView();
    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2');
    cy.get('#page2\\/_p1').should('have.text', 'The second section');

    cy.get('#page3').scrollIntoView();
    cy.get('#page3\\/_section1_title').should('have.text', 'Section 3');
    cy.get('#page3\\/_p1').should('have.text', 'The third section');
    cy.get('#page3\\/_section2_title').should('have.text', 'Section 4');
    cy.get('#page3\\/_p2').should('have.text', 'The fourth section');

    cy.get('#page4').scrollIntoView();
    cy.get('#page4\\/_section1_title').should('have.text', 'Section 5');
    cy.get('#page4\\/_p1').should('have.text', 'The fifth section');
    cy.get('#page4\\/_section2_title').should('have.text', 'Section 6: Named section');
    cy.get('#page4\\/_title1').should('have.text', 'Named section');
    cy.get('#page4\\/_p2').should('have.text', 'The sixth section');

    cy.get('#page5').scrollIntoView();
    cy.get('#page5\\/_section1_title').should('have.text', 'Section 7');
    cy.get('#page5\\/_p1').should('have.text', 'The seventh section');


  })

  it("Links across pages", () => {
    let activityDefinition = `
      <document type="activity">
        <order>
          <page>
            <section>
              <p><ref name="toAbove" target="pAbove">Link to paragraph above aside</ref></p>
              <p><ref name="toAside" target="aside">Link to aside</ref></p>
              <p><ref name="toPage2" page="2">Link to page 2</ref></p>
              <p><ref name="toAbove2" page="2" target="pAbove">Link to paragraph above page 2 aside</ref></p>
              <p><ref name="toAside2" page="2" target="aside">Link to page 2 aside</ref></p>
              <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>
              <lorem generateParagraphs="4" />
              
              <p name="pAbove">Paragraph above aside</p>
              <aside name="aside">
                <title name="asideTitle">The aside</title>
                <p name="insideAside">Content in aside</p>
              </aside>

              <lorem generateParagraphs="8" />

            </section>
          </page>
          <page>
            <section>
              <p><ref name="toAbove" target="pAbove">Link to paragraph above aside</ref></p>
              <p><ref name="toAside" target="aside">Link to aside</ref></p>
              <p><ref name="toPage1" page="1">Link to page 1</ref></p>
              <p><ref name="toAbove1" page="1" target="pAbove">Link to paragraph above page 1 aside</ref></p>
              <p><ref name="toAside1" page="1" target="aside">Link to page 1 aside</ref></p>
              <p>Checkbox to make it save state: <booleaninput name="bi" /> <boolean copySource="bi" name="b" /></p>

              <lorem generateParagraphs="4" />
              
              <p name="pAbove">Paragraph above aside</p>
              <aside name="aside">
                <title name="asideTitle">The aside</title>
                <p name="insideAside">Content in aside</p>
              </aside>

              <lorem generateParagraphs="8" />

            </section>
          </page>
        </order>
      </document>
        `;

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')
    cy.url().should('match', /#page1$/)

    cy.window().then(async (win) => {
      expect(win.scrollY).eq(0);
    })

    cy.get('#page1\\/bi').click();
    cy.get('#page1\\/b').should('have.text', 'true');

    cy.get('#page1\\/toAbove').click();
    cy.url().should('match', /#page1\/pAbove$/)

    cy.get('#page1\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(1)
    })

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.get('#page1\\/toPage2').click();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.window().then(async (win) => {
      expect(win.scrollY).eq(0);
    })

    cy.get('#page2\\/bi').click();
    cy.get('#page2\\/b').should('have.text', 'true');

    cy.get('#page2\\/toAside1').click();

    cy.get('#page1\\/_section1_title').should('have.text', 'Section 1')
    cy.get('#page2\\/_section1_title').should('not.exist')

    cy.url().should('match', /#page1\/aside$/)

    cy.get('#page1\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(1)
    })

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');

    cy.get('#page1\\/toAbove2').click();

    cy.get('#page2\\/_section1_title').should('have.text', 'Section 2')
    cy.get('#page1\\/_section1_title').should('not.exist')
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');

    cy.url().should('match', /#page2\/pAbove$/)

    cy.get('#page2\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(1)
    })

    cy.get('[data-test=previous]').click();

    cy.url().should('match', /#page1$/)


    cy.get('#page1\\/bi').click();
    cy.get('#page1\\/b').should('have.text', 'false');

    cy.wait(2000);  // to wait for debounce
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })

    cy.get('#page1\\/b').should('have.text', 'false');

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#page1$/)

    cy.get('[data-test=next]').click();

    cy.get('#page2\\/b').should('have.text', 'true');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('not.exist');
    cy.url().should('match', /#page2$/)

    cy.get('[data-test=previous]').click();

    cy.get('#page1\\/b').should('have.text', 'false');
    cy.url().should('match', /#page1$/)

    cy.get('#page1\\/asideTitle').click();

    cy.get('#page1\\/insideAside').should('not.exist');

    cy.get('#page1\\/toAside2').click();

    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#page2\/aside$/)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(1)
    })

    cy.wait(2000);  // to wait for debounce
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })

    cy.get('#page2\\/b').should('have.text', 'true');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');

    cy.url().should('match', /#page2\/aside$/)

    cy.get('#page2\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(1)
    })

    cy.get('#page2\\/toAbove1').click();

    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.url().should('match', /#page1\/pAbove$/)

    cy.get('#page1\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(1)
    })


    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_paginate').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage({
        activityDefinition
      }, "*");
    })

    cy.get('#page1\\/b').should('have.text', 'false');
    cy.get('#page1\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page1\\/insideAside').should('not.exist');

    cy.url().should('match', /#page1\/pAbove$/)

    cy.get('#page1\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(1)
    })

    cy.get('#page2\\/b').should('have.text', 'true');
    cy.get('#page2\\/asideTitle').should('have.text', 'The aside');
    cy.get('#page2\\/insideAside').should('have.text', 'Content in aside');

    cy.get('#page1\\/toAbove2').click();

    cy.url().should('match', /#page2\/pAbove$/)

    cy.waitUntil(() => cy.get('#page2\\/pAbove').then(el => {
      let rect = el[0].getBoundingClientRect();
      return rect.top > -1 && rect.top < 1;
    }))

    cy.get('#page2\\/toAside1').click();

    cy.url().should('match', /#page1\/aside$/)

    cy.waitUntil(() => cy.get('#page1\\/aside').then(el => {
      let rect = el[0].getBoundingClientRect();
      return rect.top > -1 && rect.top < 1;
    }))

    cy.get('#page1\\/insideAside').should('have.text', 'Content in aside');

    cy.get('#page2\\/aside').scrollIntoView();
    cy.url().should('match', /#page2$/)

    cy.get('#page1\\/aside').scrollIntoView();
    cy.url().should('match', /#page1$/)

  })


})