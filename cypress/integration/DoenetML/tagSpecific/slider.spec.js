
describe('Slider Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })


  it.skip('move default two number slider', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider>
    <number>1</number>
    <number>2</number>
  </slider>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.log('move handle to 100 px');
    cy.get('[data-cy=\\/_slider1divslider-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 145, clientY: 0 })
      .trigger('mouseup')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let slider1value = components['/_slider1'].stateValues.value;
      expect(slider1value).eq(1)
    })

    cy.get('[data-cy=\\/_slider1divslider-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 160, clientY: 0 })
      .trigger('mouseup')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let slider1value = components['/_slider1'].stateValues.value;
      expect(slider1value).eq(2)
    })

    cy.get('[data-cy=\\/_slider1divslider-track]')
      .click('left');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let slider1value = components['/_slider1'].stateValues.value;
      expect(slider1value).eq(1)
    })
  })


  it('no arguments, default to number slider from 0 to 10', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 26 + 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '0')

    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(0)
      expect(components['/sv'].stateValues.value).eq(0)
      expect(components['/mi'].stateValues.value.tree).eq(0)
    })



    cy.log('move handle to 1');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(1)
      expect(components['/sv'].stateValues.value).eq(1)
      expect(components['/mi'].stateValues.value.tree).eq(1)
    })


    cy.log('move handle to 9');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(9), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '9')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(9)
      expect(components['/sv'].stateValues.value).eq(9)
      expect(components['/mi'].stateValues.value.tree).eq(9)
    })


    cy.log('enter 2.5');

    cy.get("#\\/mi textarea").type("{end}{backspace}2.5{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '3')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(3)
      expect(components['/sv'].stateValues.value).eq(3)
      expect(components['/mi'].stateValues.value.tree).eq(3)
    })


    cy.log('enter x, ignored');

    cy.get("#\\/mi textarea").type("{end}{backspace}{backspace}{backspace}x{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '3')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(3)
      expect(components['/sv'].stateValues.value).eq(3)
      expect(components['/mi'].stateValues.value.tree).eq(3)
    })


  })

  it('change step to 0.1', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s" step="0.1" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 26 + 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '0')

    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(0)
      expect(components['/sv'].stateValues.value).eq(0)
      expect(components['/mi'].stateValues.value.tree).eq(0)
    })



    cy.log('move handle to 1');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')
    cy.get("#\\/mi .mq-editable-field").should('have.text', '1')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(1)
      expect(components['/sv'].stateValues.value).eq(1)
      expect(components['/mi'].stateValues.value.tree).eq(1)
    })


    cy.log('move handle to 9.4');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(9.4), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '9.4')
    cy.get("#\\/mi .mq-editable-field").should('have.text', '9.4')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9.4')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(9.4)
      expect(components['/sv'].stateValues.value).eq(9.4)
      expect(components['/mi'].stateValues.value.tree).eq(9.4)
    })


    cy.log('enter 2.5');

    cy.get("#\\/mi textarea").type("{end}{backspace}{backspace}{backspace}2.5{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '2.5')
    // cy.get("#\\/mi .mq-editable-field").should('have.text', '2.5')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(2.5)
      expect(components['/sv'].stateValues.value).eq(2.5)
      expect(components['/mi'].stateValues.value.tree).eq(2.5)
    })

  })

  it('from 100 to 200', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s" from="100" to="200" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 26 + 30 * (x-100)/10;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '100')

    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('100')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(100)
      expect(components['/sv'].stateValues.value).eq(100)
      expect(components['/mi'].stateValues.value.tree).eq(100)
    })



    cy.log('move handle to 137');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(137), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '137')
    cy.get("#\\/mi .mq-editable-field").should('have.text', '137')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('137')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(137)
      expect(components['/sv'].stateValues.value).eq(137)
      expect(components['/mi'].stateValues.value.tree).eq(137)
    })


    cy.log('move handle to 199');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(199), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '199')
    cy.get("#\\/mi .mq-editable-field").should('have.text', '199')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('199')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(199)
      expect(components['/sv'].stateValues.value).eq(199)
      expect(components['/mi'].stateValues.value.tree).eq(199)
    })


    cy.log('enter 2.5');

    cy.get("#\\/mi textarea").type("{end}{backspace}{backspace}{backspace}2.5{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '100')
    // cy.get("#\\/mi .mq-editable-field").should('have.text', '100')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('100')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(100)
      expect(components['/sv'].stateValues.value).eq(100)
      expect(components['/mi'].stateValues.value.tree).eq(100)
    })


    cy.log('enter 357');

    cy.get("#\\/mi textarea").type("{end}{backspace}{backspace}{backspace}357{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '200')
    // cy.get("#\\/mi .mq-editable-field").should('have.text', '200')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('200')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(200)
      expect(components['/sv'].stateValues.value).eq(200)
      expect(components['/mi'].stateValues.value.tree).eq(200)
    })


    cy.log('enter 171');

    cy.get("#\\/mi textarea").type("{end}{backspace}{backspace}{backspace}171{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '171')
    // cy.get("#\\/mi .mq-editable-field").should('have.text', '171')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('171')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(171)
      expect(components['/sv'].stateValues.value).eq(171)
      expect(components['/mi'].stateValues.value.tree).eq(171)
    })

  })

  it('initial value', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s" initialValue="7" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 26 + 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '7')

    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(7)
      expect(components['/sv'].stateValues.value).eq(7)
      expect(components['/mi'].stateValues.value.tree).eq(7)
    })



    cy.log('move handle to 1');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(1)
      expect(components['/sv'].stateValues.value).eq(1)
      expect(components['/mi'].stateValues.value.tree).eq(1)
    })



    cy.log('enter 4.2');

    cy.get("#\\/mi textarea").type("{end}{backspace}4.2{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '4')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(4)
      expect(components['/sv'].stateValues.value).eq(4)
      expect(components['/mi'].stateValues.value.tree).eq(4)
    })

  })

  it('bind value to', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Original value: <mathinput name="mi0" /></p>
  <slider name="s" bindValueTo="$mi0" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 26 + 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '0')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(0)
      expect(components['/sv'].stateValues.value).eq(0)
      expect(components['/mi0'].stateValues.value.tree).eq('\uff3f')
      expect(components['/mi'].stateValues.value.tree).eq(0)
    })



    cy.log('move handle to 1');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(1)
      expect(components['/sv'].stateValues.value).eq(1)
      expect(components['/mi0'].stateValues.value.tree).eq(1)
      expect(components['/mi'].stateValues.value.tree).eq(1)
    })



    cy.log('enter 4.2 in post math input');

    cy.get("#\\/mi textarea").type("{end}{backspace}4.2{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '4')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(4)
      expect(components['/sv'].stateValues.value).eq(4)
      expect(components['/mi0'].stateValues.value.tree).eq(4)
      expect(components['/mi'].stateValues.value.tree).eq(4)
    })


    cy.log('enter 8.7 in pre math input');

    cy.get("#\\/mi0 textarea").type("{end}{backspace}8.7{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '9')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('8.7')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(9)
      expect(components['/sv'].stateValues.value).eq(9)
      expect(components['/mi0'].stateValues.value.tree).eq(8.7)
      expect(components['/mi'].stateValues.value.tree).eq(9)
    })


    cy.log('enter x in pre math input');

    cy.get("#\\/mi0 textarea").type("{end}{backspace}{backspace}{backspace}x{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '0')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(0)
      expect(components['/sv'].stateValues.value).eq(0)
      expect(components['/mi0'].stateValues.value.tree).eq('x')
      expect(components['/mi'].stateValues.value.tree).eq(0)
    })


    cy.log('move handle to 5');
    cy.get('[data-cy=\\/s-handle]')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(5), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '5')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(5)
      expect(components['/sv'].stateValues.value).eq(5)
      expect(components['/mi0'].stateValues.value.tree).eq(5)
      expect(components['/mi'].stateValues.value.tree).eq(5)
    })


    cy.log('enter 999 in pre math input');

    cy.get("#\\/mi0 textarea").type("{end}{backspace}999{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '10')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('999')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('10')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s'].stateValues.value).eq(10)
      expect(components['/sv'].stateValues.value).eq(10)
      expect(components['/mi0'].stateValues.value.tree).eq(999)
      expect(components['/mi'].stateValues.value.tree).eq(10)
    })


  })

})



