
describe('Slider Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('move two number slider', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s">
    <number>1</number>
    <number>2</number>
  </slider>
  <p>Value: <number name="sv">$s</number></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load
    
    cy.get('#\\/sv').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let slider1value = stateVariables['/s'].stateValues.value;
      expect(slider1value).eq(1)
    })

    cy.log('move handle less than half way, stays at 1');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 145, clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let slider1value = stateVariables['/s'].stateValues.value;
      expect(slider1value).eq(1)
    })

    cy.log('move handle past halfway, goes to 2')
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 180, clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '2')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let slider1value = stateVariables['/s'].stateValues.value;
      expect(slider1value).eq(2)
    })

    cy.log('clicking at left of sliders moves it to 1')
    cy.get('#\\/s')
      .click('left');

    cy.get('#\\/sv').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let slider1value = stateVariables['/s'].stateValues.value;
      expect(slider1value).eq(1)
    })
  })


  it('no arguments, default to number slider from 0 to 10', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
  <p>
    <booleaninput name="bi"/>
    <copy prop="value" target="bi" assignNames="b" />
  </p>
    `}, "*");
    });

    let numberToPx = x => 27 + 30 * x;
    let numberToPx2 = x => 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '0')

    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(0)
      expect(stateVariables['/sv'].stateValues.value).eq(0)
      expect(stateVariables['/mi'].stateValues.value).eq(0)
    })



    cy.log('drag handle to 1');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(1)
      expect(stateVariables['/sv'].stateValues.value).eq(1)
      expect(stateVariables['/mi'].stateValues.value).eq(1)
    })


    cy.log('drag handle to 9');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(9), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '9')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(9)
      expect(stateVariables['/sv'].stateValues.value).eq(9)
      expect(stateVariables['/mi'].stateValues.value).eq(9)
    })


    cy.log('enter 2.5');

    cy.get("#\\/mi textarea").type("{end}{backspace}2.5{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '3')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(3)
      expect(stateVariables['/sv'].stateValues.value).eq(3)
      expect(stateVariables['/mi'].stateValues.value).eq(3)
    })


    cy.log('enter x, ignored');

    cy.get("#\\/mi textarea").type("{ctrl+home}{shift+end}{backspace}x{enter}", { force: true })
    // use booleaninput to wait, since above has no effect
    cy.get('#\\/bi_input').click();
    cy.get('#\\/b').should('have.text', 'true');

    cy.get('#\\/sv').should('have.text', '3')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(3)
      expect(stateVariables['/sv'].stateValues.value).eq(3)
      expect(stateVariables['/mi'].stateValues.value).eq(3)
    })

    cy.log('drag handle past below document and past end sets to maximum 10');
    cy.get('#\\/_document1')
      .trigger('mousedown', numberToPx2(3), 50)
      .trigger('mousemove', numberToPx2(25), 400, {force: true})
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '10')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('10')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(10)
      expect(stateVariables['/sv'].stateValues.value).eq(10)
      expect(stateVariables['/mi'].stateValues.value).eq(10)
    })

    cy.log('hold down mouse at 6');
    cy.get('#\\/_document1')
      .trigger('mousedown', numberToPx2(6), 50)

    cy.get('#\\/sv').should('have.text', '6')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('6')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(6)
      expect(stateVariables['/sv'].stateValues.value).eq(6)
      expect(stateVariables['/mi'].stateValues.value).eq(6)
    })

    cy.log('drag to 2, but above slider');
    cy.get('#\\/_document1')
      .trigger('mousemove', numberToPx2(2), 0)

    cy.get('#\\/sv').should('have.text', '2')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(2)
      expect(stateVariables['/sv'].stateValues.value).eq(2)
      expect(stateVariables['/mi'].stateValues.value).eq(2)
    })


    cy.log('drag past left edge and below slider');
    cy.get('#\\/_document1')
      .trigger('mousemove', numberToPx2(-1), 200, {force: true})

    cy.get('#\\/sv').should('have.text', '0')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(0)
      expect(stateVariables['/sv'].stateValues.value).eq(0)
      expect(stateVariables['/mi'].stateValues.value).eq(0)
    })


    cy.log('drag to 7, but below slider');
    cy.get('#\\/_document1')
      .trigger('mousemove', numberToPx2(7), 300, {force: true})

    cy.get('#\\/sv').should('have.text', '7')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(7)
      expect(stateVariables['/sv'].stateValues.value).eq(7)
      expect(stateVariables['/mi'].stateValues.value).eq(7)
    })


  })

  it('change step to 0.1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s" step="0.1" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 27 + 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '0')

    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(0)
      expect(stateVariables['/sv'].stateValues.value).eq(0)
      expect(stateVariables['/mi'].stateValues.value).eq(0)
    })



    cy.log('move handle to 1');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')
    cy.get("#\\/mi .mq-editable-field").should('have.text', '1')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(1)
      expect(stateVariables['/sv'].stateValues.value).eq(1)
      expect(stateVariables['/mi'].stateValues.value).eq(1)
    })


    cy.log('move handle to 9.4');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(9.4), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '9.4')
    cy.get("#\\/mi .mq-editable-field").should('have.text', '9.4')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9.4')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(9.4)
      expect(stateVariables['/sv'].stateValues.value).eq(9.4)
      expect(stateVariables['/mi'].stateValues.value).eq(9.4)
    })


    cy.log('enter 2.5');

    cy.get("#\\/mi textarea").type("{ctrl+home}{shift+end}{backspace}2.5{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '2.5')
    // cy.get("#\\/mi .mq-editable-field").should('have.text', '2.5')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('2.5')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(2.5)
      expect(stateVariables['/sv'].stateValues.value).eq(2.5)
      expect(stateVariables['/mi'].stateValues.value).eq(2.5)
    })

  })

  it('from 100 to 200', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s" from="100" to="200" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 27 + 30 * (x - 100) / 10;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '100')

    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('100')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(100)
      expect(stateVariables['/sv'].stateValues.value).eq(100)
      expect(stateVariables['/mi'].stateValues.value).eq(100)
    })



    cy.log('move handle to 137');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(137), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '137')
    cy.get("#\\/mi .mq-editable-field").should('have.text', '137')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('137')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(137)
      expect(stateVariables['/sv'].stateValues.value).eq(137)
      expect(stateVariables['/mi'].stateValues.value).eq(137)
    })


    cy.log('move handle to 199');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(199), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '199')
    cy.get("#\\/mi .mq-editable-field").should('have.text', '199')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('199')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(199)
      expect(stateVariables['/sv'].stateValues.value).eq(199)
      expect(stateVariables['/mi'].stateValues.value).eq(199)
    })


    cy.log('enter 2.5');

    cy.get("#\\/mi textarea").type("{ctrl+home}{shift+end}{backspace}2.5{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '100')
    // cy.get("#\\/mi .mq-editable-field").should('have.text', '100')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('100')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(100)
      expect(stateVariables['/sv'].stateValues.value).eq(100)
      expect(stateVariables['/mi'].stateValues.value).eq(100)
    })


    cy.log('enter 357');

    cy.get("#\\/mi textarea").type("{ctrl+home}{shift+end}{backspace}357{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '200')
    // cy.get("#\\/mi .mq-editable-field").should('have.text', '200')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('200')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(200)
      expect(stateVariables['/sv'].stateValues.value).eq(200)
      expect(stateVariables['/mi'].stateValues.value).eq(200)
    })


    cy.log('enter 171');

    cy.get("#\\/mi textarea").type("{ctrl+home}{shift+end}{backspace}171{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '171')
    // cy.get("#\\/mi .mq-editable-field").should('have.text', '171')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('171')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(171)
      expect(stateVariables['/sv'].stateValues.value).eq(171)
      expect(stateVariables['/mi'].stateValues.value).eq(171)
    })

  })

  it('initial value', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s" initialValue="7" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 27 + 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '7')

    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(7)
      expect(stateVariables['/sv'].stateValues.value).eq(7)
      expect(stateVariables['/mi'].stateValues.value).eq(7)
    })



    cy.log('move handle to 1');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(1)
      expect(stateVariables['/sv'].stateValues.value).eq(1)
      expect(stateVariables['/mi'].stateValues.value).eq(1)
    })



    cy.log('enter 4.2');

    cy.get("#\\/mi textarea").type("{end}{backspace}4.2{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '4')
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('4')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(4)
      expect(stateVariables['/sv'].stateValues.value).eq(4)
      expect(stateVariables['/mi'].stateValues.value).eq(4)
    })

  })

  it('bind value to', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Original value: <mathinput name="mi0" /></p>
  <slider name="s" bindValueTo="$mi0" />
  <p>Value: <number name="sv">$s</number></p>
  <p>Change value: <mathinput name="mi" bindValueTo="$s" /></p>
    `}, "*");
    });

    let numberToPx = x => 27 + 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '0')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(0)
      expect(stateVariables['/sv'].stateValues.value).eq(0)
      expect(stateVariables['/mi0'].stateValues.value).eq('\uff3f')
      expect(stateVariables['/mi'].stateValues.value).eq(0)
    })



    cy.log('move handle to 1');
    cy.get('#\\/s-handle')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(1)
      expect(stateVariables['/sv'].stateValues.value).eq(1)
      expect(stateVariables['/mi0'].stateValues.value).eq(1)
      expect(stateVariables['/mi'].stateValues.value).eq(1)
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(4)
      expect(stateVariables['/sv'].stateValues.value).eq(4)
      expect(stateVariables['/mi0'].stateValues.value).eq(4)
      expect(stateVariables['/mi'].stateValues.value).eq(4)
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(9)
      expect(stateVariables['/sv'].stateValues.value).eq(9)
      expect(stateVariables['/mi0'].stateValues.value).eq(8.7)
      expect(stateVariables['/mi'].stateValues.value).eq(9)
    })


    cy.log('enter x in pre math input');

    cy.get("#\\/mi0 textarea").type("{ctrl+home}{shift+end}{backspace}x{enter}", { force: true })

    cy.get('#\\/sv').should('have.text', '0')
    cy.get("#\\/mi0 .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x')
    })
    cy.get("#\\/mi .mq-editable-field").invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(0)
      expect(stateVariables['/sv'].stateValues.value).eq(0)
      expect(stateVariables['/mi0'].stateValues.value).eq('x')
      expect(stateVariables['/mi'].stateValues.value).eq(0)
    })


    cy.log('move handle to 5');
    cy.get('#\\/s-handle')
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(5)
      expect(stateVariables['/sv'].stateValues.value).eq(5)
      expect(stateVariables['/mi0'].stateValues.value).eq(5)
      expect(stateVariables['/mi'].stateValues.value).eq(5)
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(10)
      expect(stateVariables['/sv'].stateValues.value).eq(10)
      expect(stateVariables['/mi0'].stateValues.value).eq(999)
      expect(stateVariables['/mi'].stateValues.value).eq(10)
    })


  })

  it('label with math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="s"><label>Hello <m>x^2</m></label></slider>
  <p>Value: <number name="sv">$s</number></p>
    `}, "*");
    });

    let numberToPx = x => 27 + 30 * x;
    let numberToPx2 = x => 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '0')

    cy.get('#\\/s-label').should('contain.text', 'Hello x2')
    cy.get('#\\/s-label').should('contain.text', 'x^2 = 0')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(0)
      expect(stateVariables['/s'].stateValues.label).eq('Hello \\(x^2\\)')
      expect(stateVariables['/sv'].stateValues.value).eq(0)
    })



    cy.log('drag handle to 1');
    cy.get('#\\/s-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')

    cy.get('#\\/s-label').should('contain.text', 'Hello x2')
    cy.get('#\\/s-label').should('contain.text', 'x^2 = 1')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s'].stateValues.value).eq(1)
      expect(stateVariables['/s'].stateValues.label).eq('Hello \\(x^2\\)')
      expect(stateVariables['/sv'].stateValues.value).eq(1)
    })



  })

  it('label is name', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <slider name="mySlider" labelIsName />
  <p>Value: <number name="sv">$mySlider</number></p>
    `}, "*");
    });

    let numberToPx = x => 27 + 30 * x;
    let numberToPx2 = x => 30 * x;

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/sv').should('have.text', '0')

    cy.get('#\\/mySlider-label').should('have.text', 'my slider = 0')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mySlider'].stateValues.value).eq(0)
      expect(stateVariables['/mySlider'].stateValues.label).eq('my slider')
      expect(stateVariables['/sv'].stateValues.value).eq(0)
    })



    cy.log('drag handle to 1');
    cy.get('#\\/mySlider-handle')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: numberToPx(1), clientY: 0 })
      .trigger('mouseup')

    cy.get('#\\/sv').should('have.text', '1')

    cy.get('#\\/mySlider-label').should('contain.text', 'my slider = 1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/mySlider'].stateValues.value).eq(1)
      expect(stateVariables['/mySlider'].stateValues.label).eq('my slider')
      expect(stateVariables['/sv'].stateValues.value).eq(1)
    })



  })

})



