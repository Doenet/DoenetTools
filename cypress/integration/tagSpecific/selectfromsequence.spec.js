import me from 'math-expressions';

describe('SelectFromSequence Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('no parameters, select single number from 1 to 10',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence name="sample1"/>
    <selectfromsequence name="sample2"/>
    <selectfromsequence name="sample3"/>
    <selectfromsequence name="sample4"/>
    <selectfromsequence name="sample5"/>
    <selectfromsequence name="sample6"/>
    <selectfromsequence name="sample7"/>
    <selectfromsequence name="sample8"/>
    <selectfromsequence name="sample9"/>
    <selectfromsequence name="sample10"/>
    <selectfromsequence name="sample11"/>
    <selectfromsequence name="sample12"/>
    <selectfromsequence name="sample13"/>
    <selectfromsequence name="sample14"/>
    <selectfromsequence name="sample15"/>
    <selectfromsequence name="sample16"/>
    <selectfromsequence name="sample17"/>
    <selectfromsequence name="sample18"/>
    <selectfromsequence name="sample19"/>
    <selectfromsequence name="sample20"/>
    <selectfromsequence name="sample21"/>
    <selectfromsequence name="sample22"/>
    <selectfromsequence name="sample23"/>
    <selectfromsequence name="sample24"/>
    <selectfromsequence name="sample25"/>
    <selectfromsequence name="sample26"/>
    <selectfromsequence name="sample27"/>
    <selectfromsequence name="sample28"/>
    <selectfromsequence name="sample29"/>
    <selectfromsequence name="sample30"/>
    </aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 30; ind++) {
        let num = components['/sample' + ind].replacements[0].stateValues.value;
        expect([1,2,3,4,5,6,7,8,9,10].includes(num)).eq(true);
      }
    })
  });

  it('select single number from 1 to 6',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence name="sample1">6</selectfromsequence>
    <selectfromsequence name="sample2">6</selectfromsequence>
    <selectfromsequence name="sample3">6</selectfromsequence>
    <selectfromsequence name="sample4">6</selectfromsequence>
    <selectfromsequence name="sample5">6</selectfromsequence>
    <selectfromsequence name="sample6">6</selectfromsequence>
    <selectfromsequence name="sample7">6</selectfromsequence>
    <selectfromsequence name="sample8">6</selectfromsequence>
    <selectfromsequence name="sample9">6</selectfromsequence>
    <selectfromsequence name="sample10">6</selectfromsequence>
    <selectfromsequence name="sample11">6</selectfromsequence>
    <selectfromsequence name="sample12">6</selectfromsequence>
    <selectfromsequence name="sample13">6</selectfromsequence>
    <selectfromsequence name="sample14">6</selectfromsequence>
    <selectfromsequence name="sample15">6</selectfromsequence>
    <selectfromsequence name="sample16">6</selectfromsequence>
    <selectfromsequence name="sample17">6</selectfromsequence>
    <selectfromsequence name="sample18">6</selectfromsequence>
    <selectfromsequence name="sample19">6</selectfromsequence>
    <selectfromsequence name="sample20">6</selectfromsequence>
    <selectfromsequence name="sample21">6</selectfromsequence>
    <selectfromsequence name="sample22">6</selectfromsequence>
    <selectfromsequence name="sample23">6</selectfromsequence>
    <selectfromsequence name="sample24">6</selectfromsequence>
    <selectfromsequence name="sample25">6</selectfromsequence>
    <selectfromsequence name="sample26">6</selectfromsequence>
    <selectfromsequence name="sample27">6</selectfromsequence>
    <selectfromsequence name="sample28">6</selectfromsequence>
    <selectfromsequence name="sample29">6</selectfromsequence>
    <selectfromsequence name="sample30">6</selectfromsequence>
    </aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 30; ind++) {
        let num = components['/sample' + ind].replacements[0].stateValues.value;
        expect([1,2,3,4,5,6].includes(num)).eq(true);
      }
    })
  });

  it('select single number from -3 to 5',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence name="sample1">-3,5</selectfromsequence>
    <selectfromsequence name="sample2">-3,5</selectfromsequence>
    <selectfromsequence name="sample3">-3,5</selectfromsequence>
    <selectfromsequence name="sample4">-3,5</selectfromsequence>
    <selectfromsequence name="sample5">-3,5</selectfromsequence>
    <selectfromsequence name="sample6">-3,5</selectfromsequence>
    <selectfromsequence name="sample7">-3,5</selectfromsequence>
    <selectfromsequence name="sample8">-3,5</selectfromsequence>
    <selectfromsequence name="sample9">-3,5</selectfromsequence>
    <selectfromsequence name="sample10">-3,5</selectfromsequence>
    <selectfromsequence name="sample11">-3,5</selectfromsequence>
    <selectfromsequence name="sample12">-3,5</selectfromsequence>
    <selectfromsequence name="sample13">-3,5</selectfromsequence>
    <selectfromsequence name="sample14">-3,5</selectfromsequence>
    <selectfromsequence name="sample15">-3,5</selectfromsequence>
    <selectfromsequence name="sample16">-3,5</selectfromsequence>
    <selectfromsequence name="sample17">-3,5</selectfromsequence>
    <selectfromsequence name="sample18">-3,5</selectfromsequence>
    <selectfromsequence name="sample19">-3,5</selectfromsequence>
    <selectfromsequence name="sample20">-3,5</selectfromsequence>
    <selectfromsequence name="sample21">-3,5</selectfromsequence>
    <selectfromsequence name="sample22">-3,5</selectfromsequence>
    <selectfromsequence name="sample23">-3,5</selectfromsequence>
    <selectfromsequence name="sample24">-3,5</selectfromsequence>
    <selectfromsequence name="sample25">-3,5</selectfromsequence>
    <selectfromsequence name="sample26">-3,5</selectfromsequence>
    <selectfromsequence name="sample27">-3,5</selectfromsequence>
    <selectfromsequence name="sample28">-3,5</selectfromsequence>
    <selectfromsequence name="sample29">-3,5</selectfromsequence>
    <selectfromsequence name="sample30">-3,5</selectfromsequence>
    </aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 30; ind++) {
        let num = components['/sample' + ind].replacements[0].stateValues.value;
        expect([-3,-2,-1,0,1,2,3,4,5].includes(num)).eq(true);
      }
    })
  });

  it('select single number from -3 to 5, excluding 0',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence exclude="0" name="sample1">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample2">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample3">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample4">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample5">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample6">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample7">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample8">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample9">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample10">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample11">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample12">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample13">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample14">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample15">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample16">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample17">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample18">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample19">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample20">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample21">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample22">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample23">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample24">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample25">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample26">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample27">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample28">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample29">-3,5</selectfromsequence>
    <selectfromsequence exclude="0" name="sample30">-3,5</selectfromsequence>
    </aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 30; ind++) {
        let num = components['/sample' + ind].replacements[0].stateValues.value;
        expect([-3,-2,-1,1,2,3,4,5].includes(num)).eq(true);
      }
    })
  });

  it('select single odd number from -3 to 5',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence step="2" name="sample1">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample2">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample3">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample4">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample5">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample6">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample7">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample8">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample9">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample10">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample11">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample12">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample13">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample14">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample15">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample16">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample17">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample18">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample19">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample20">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample21">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample22">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample23">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample24">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample25">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample26">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample27">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample28">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample29">-3,5</selectfromsequence>
    <selectfromsequence step="2" name="sample30">-3,5</selectfromsequence>
    </aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 30; ind++) {
        let num = components['/sample' + ind].replacements[0].stateValues.value;
        expect([-3,-1,1,3,5].includes(num)).eq(true);
      }
    })
  });

  it('select single letter from c to h',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence name="sample1">c,h</selectfromsequence>
    <selectfromsequence name="sample2">c,h</selectfromsequence>
    <selectfromsequence name="sample3">c,h</selectfromsequence>
    <selectfromsequence name="sample4">c,h</selectfromsequence>
    <selectfromsequence name="sample5">c,h</selectfromsequence>
    <selectfromsequence name="sample6">c,h</selectfromsequence>
    <selectfromsequence name="sample7">c,h</selectfromsequence>
    <selectfromsequence name="sample8">c,h</selectfromsequence>
    <selectfromsequence name="sample9">c,h</selectfromsequence>
    <selectfromsequence name="sample10">c,h</selectfromsequence>
    <selectfromsequence name="sample11">c,h</selectfromsequence>
    <selectfromsequence name="sample12">c,h</selectfromsequence>
    <selectfromsequence name="sample13">c,h</selectfromsequence>
    <selectfromsequence name="sample14">c,h</selectfromsequence>
    <selectfromsequence name="sample15">c,h</selectfromsequence>
    <selectfromsequence name="sample16">c,h</selectfromsequence>
    <selectfromsequence name="sample17">c,h</selectfromsequence>
    <selectfromsequence name="sample18">c,h</selectfromsequence>
    <selectfromsequence name="sample19">c,h</selectfromsequence>
    <selectfromsequence name="sample20">c,h</selectfromsequence>
    <selectfromsequence name="sample21">c,h</selectfromsequence>
    <selectfromsequence name="sample22">c,h</selectfromsequence>
    <selectfromsequence name="sample23">c,h</selectfromsequence>
    <selectfromsequence name="sample24">c,h</selectfromsequence>
    <selectfromsequence name="sample25">c,h</selectfromsequence>
    <selectfromsequence name="sample26">c,h</selectfromsequence>
    <selectfromsequence name="sample27">c,h</selectfromsequence>
    <selectfromsequence name="sample28">c,h</selectfromsequence>
    <selectfromsequence name="sample29">c,h</selectfromsequence>
    <selectfromsequence name="sample30">c,h</selectfromsequence>
    </aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 30; ind++) {
        let letter = components['/sample' + ind].replacements[0].stateValues.value;
        expect(['c','d','e','f','g','h'].includes(letter)).eq(true);
      }
    })
  });

  it('select two even numbers from -4 to 4, excluding 0',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample1">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample2">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample3">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample4">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample5">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample6">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample7">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample8">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample9">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample10">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample11">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample12">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample13">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample14">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample15">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample16">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample17">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample18">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample19">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample20">-4,4</selectfromsequence>
    </aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 20; ind++) {
        let num1 = components['/sample' + ind].replacements[0].stateValues.value;
        let num2 = components['/sample' + ind].replacements[1].stateValues.value;
        expect([-4,-2,2,4].includes(num1)).eq(true);
        expect([-4,-2,2,4].includes(num2)).eq(true);
        expect(num1).not.eq(num2);
      }
    })
  });

  it('select two even numbers from -4 to 2, excluding 0 and combinations',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample1" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample2" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample3" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample4" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample5" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample6" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample7" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample8" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample9" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample10" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample11" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample12" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample13" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample14" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample15" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample16" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample17" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample18" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample19" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence step="2" exclude="0" numbertoselect="2" name="sample20" excludecombination="-4,-2"><excludecombination>-2,2</excludecombination><excludecombination>2,-4</excludecombination>-4,2</selectfromsequence></aslist></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a')

    let allowedCombinations = [[-4,2], [-2,-4], [2,-2]];
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 20; ind++) {
        let num1 = components['/sample' + ind].replacements[0].stateValues.value;
        let num2 = components['/sample' + ind].replacements[1].stateValues.value;
        
        expect(allowedCombinations.some(v => v[0]===num1 && v[1]===num2)).eq(true);
      }
    })
  });

  it('select five even numbers with replacement from -4 to 4, excluding 0',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample1">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample2">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample3">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample4">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample5">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample6">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample7">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample8">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample9">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample10">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample11">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample12">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample13">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample14">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample15">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample16">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample17">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample18">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample19">-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" numbertoselect="5" withReplacement name="sample20">-4,4</selectfromsequence>
    </aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 20; ind++) {
        let num1 = components['/sample' + ind].replacements[0].stateValues.value;
        let num2 = components['/sample' + ind].replacements[1].stateValues.value;
        let num3 = components['/sample' + ind].replacements[2].stateValues.value;
        let num4 = components['/sample' + ind].replacements[3].stateValues.value;
        let num5 = components['/sample' + ind].replacements[4].stateValues.value;
        expect([-4,-2,2,4].includes(num1)).eq(true);
        expect([-4,-2,2,4].includes(num2)).eq(true);
        expect([-4,-2,2,4].includes(num3)).eq(true);
        expect([-4,-2,2,4].includes(num4)).eq(true);
        expect([-4,-2,2,4].includes(num5)).eq(true);
      }
    })
  });

  it('select five (number initially unresolved) even numbers with replacement from -4 to 4, excluding 0',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <aslist>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample1"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample2"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample3"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample4"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample5"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample6"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample7"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample8"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample9"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample10"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample11"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample12"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample13"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample14"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample15"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample16"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample17"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample18"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample19"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    <selectfromsequence step="2" exclude="0" withReplacement name="sample20"><numbertoselect><copy tname="n" /></numbertoselect>-4,4</selectfromsequence>
    </aslist>
    <copy name="n2" tname="n3" />
    <copy name="n" tname="num1" />
    <math name="num1"><copy tname="n2" />+<copy tname="num2" />+2</math>
    <math name="num2"><copy tname="n3" />+<copy tname="num3" /></math>
    <copy name="n3" tname="num3" />
    <number name="num3">1</number>
    `},"*");
    });

    // to wait for page to load
    cy.wait(2000);// TODO: need something better than this
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 20; ind++) {
        let num1 = components['/sample' + ind].replacements[0].stateValues.value;
        let num2 = components['/sample' + ind].replacements[1].stateValues.value;
        let num3 = components['/sample' + ind].replacements[2].stateValues.value;
        let num4 = components['/sample' + ind].replacements[3].stateValues.value;
        let num5 = components['/sample' + ind].replacements[4].stateValues.value;
        expect([-4,-2,2,4].includes(num1)).eq(true);
        expect([-4,-2,2,4].includes(num2)).eq(true);
        expect([-4,-2,2,4].includes(num3)).eq(true);
        expect([-4,-2,2,4].includes(num4)).eq(true);
        expect([-4,-2,2,4].includes(num5)).eq(true);
      }
    })
  });

  it("copies don't resample",() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <p><aslist>
    <selectfromsequence name="sample1">100</selectfromsequence>
    <selectfromsequence name="sample2">100</selectfromsequence>
    </aslist></p>

    <p><aslist>
    <copy name="noresample1" tname="sample1" />
    <copy name="noresample2" tname="sample2" />
    <copy name="noreresample1" tname="noresample1" />
    <copy name="noreresample2" tname="noresample2" />
    </aslist></p>

    <p><copy name="noresamplelist" tname="_aslist1" /></p>

    <p><copy name="noreresamplelist" tname="noresamplelist" /></p>

    <copy name="noresamplep" tname="_p1" />
    <copy name="noreresamplep" tname="noresamplep" />
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let num1 = components['/sample1'].replacements[0].stateValues.value;
      let num2 = components['/sample2'].replacements[0].stateValues.value;
      expect(Number.isInteger(num1) && num1>=1 && num1 <=100).eq(true);
      expect(Number.isInteger(num2) && num2>=1 && num2 <=100).eq(true);
      expect(components['/noresample1'].replacements[0].replacements[0].stateValues.value).eq(num1);
      expect(components['/noresample2'].replacements[0].replacements[0].stateValues.value).eq(num2);
      expect(components['/noreresample1'].replacements[0].replacements[0].replacements[0].stateValues.value).eq(num1);
      expect(components['/noreresample2'].replacements[0].replacements[0].replacements[0].stateValues.value).eq(num2);

      expect(components['/noresamplelist'].replacements[0].activeChildren[0].stateValues.value).eq(num1);
      expect(components['/noresamplelist'].replacements[0].activeChildren[1].stateValues.value).eq(num2);
      expect(components['/noreresamplelist'].replacements[0].replacements[0].activeChildren[0].stateValues.value).eq(num1);
      expect(components['/noreresamplelist'].replacements[0].replacements[0].activeChildren[1].stateValues.value).eq(num2);

      expect(components['/noresamplep'].replacements[0].activeChildren[0].activeChildren[0].stateValues.value).eq(num1);
      expect(components['/noresamplep'].replacements[0].activeChildren[0].activeChildren[1].stateValues.value).eq(num2);
      expect(components['/noreresamplep'].replacements[0].replacements[0].activeChildren[0].activeChildren[0].stateValues.value).eq(num1);
      expect(components['/noreresamplep'].replacements[0].replacements[0].activeChildren[0].activeChildren[1].stateValues.value).eq(num2);

    })
  });

  it("select doesn't change dynamically",() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <mathinput prefill="5" name="numbertoselect"/>
    <mathinput prefill="3" name="maxnum"/>
    <p><aslist>
    <selectfromsequence name="sample1" withReplacement>
      <count><copy prop="value" tname="maxnum" /></count>
      <numbertoselect><copy prop="value" tname="numbertoselect" /></numbertoselect>
    </selectfromsequence>
    </aslist></p>

    <mathinput prefill="2" name="numbertoselect2"/>
    <mathinput prefill="10" name="maxnum2"/>
    <p><aslist>
    <selectfromsequence name="sample2" withReplacement>
      <count><copy prop="value" tname="maxnum2" /></count>
      <numbertoselect><copy prop="value" tname="numbertoselect2" /></numbertoselect>
    </selectfromsequence>
    </aslist></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let sample1numbers, sample2numbers;

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let sample1replacements = components['/sample1'].replacements;
      let sample2replacements = components['/sample2'].replacements;
      expect(sample1replacements.length).eq(5);
      expect(sample2replacements.length).eq(2);
      sample1numbers = sample1replacements.map(x => x.stateValues.value);
      sample2numbers = sample2replacements.map(x => x.stateValues.value);

      for(let num of sample1numbers) {
        expect([1,2,3].includes(num)).eq(true);
      }
      for(let num of sample2numbers) {
        expect([1,2,3,4,5,6,7,8,9,10].includes(num)).eq(true);
      }

    });

    cy.log("Nothing changes when change mathinputs");
    cy.get('#\\/numbertoselect_input').clear().type(`7{enter}`);
    cy.get('#\\/maxnum_input').clear().type(`11{enter}`);
    cy.get('#\\/numbertoselect2_input').clear().type(`15{enter}`);
    cy.get('#\\/maxnum2_input').clear().type(`18{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let sample1replacements = components['/sample1'].replacements;
      let sample2replacements = components['/sample2'].replacements;
 
      expect(sample1replacements.map(x => x.stateValues.value)).eqls(sample1numbers)
      expect(sample2replacements.map(x => x.stateValues.value)).eqls(sample2numbers)


    })
  });

  it("select doesn't resample in dynamic map",() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnamespaces="a,b,c,d,e,f">
      <template>
        <selectfromsequence assignnames="n">100</selectfromsequence>
      </template>
      <substitutions>
      <sequence>
        <count><copy prop="value" tname="_mathinput1" /></count>
      </sequence>
      </substitutions>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><copy tname="_map1" /></aslist></p>
    <p name="p3"><copy tname="_aslist1" /></p>

    <copy name="p4" tname="p1" />
    <copy name="p5" tname="p2" />
    <copy name="p6" tname="p3" />

    <copy name="p7" tname="p4" />
    <copy name="p8" tname="p5" />
    <copy name="p9" tname="p6" />
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let samplednumbers=[];

    cy.log("initially nothing")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("sample one number");
    cy.get('#\\/_mathinput1_input').clear().type(`1{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      samplednumbers.push(n1);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      for(let ind=0; ind<1; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("get same number back");
    cy.get('#\\/_mathinput1_input').clear().type(`1{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);

      for(let ind=0; ind<1; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("get two more samples");
    cy.get('#\\/_mathinput1_input').clear().type(`3{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      let n2 = components['/b/n'].stateValues.value;
      let n3 = components['/c/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      samplednumbers.push(n2);
      samplednumbers.push(n3);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      for(let ind=0; ind<3; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
     }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });


    cy.log("get first two numbers back");
    cy.get('#\\/_mathinput1_input').clear().type(`2{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      let n2 = components['/b/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(2);

      for(let ind=0; ind<2; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("get six total samples");
    cy.get('#\\/_mathinput1_input').clear().type(`6{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      let n2 = components['/b/n'].stateValues.value;
      let n3 = components['/c/n'].stateValues.value;
      let n4 = components['/d/n'].stateValues.value;
      let n5 = components['/e/n'].stateValues.value;
      let n6 = components['/f/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      samplednumbers.push(n4);
      samplednumbers.push(n5);
      samplednumbers.push(n6);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      for(let ind=0; ind<6; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("get all six back");
    cy.get('#\\/_mathinput1_input').clear().type(`6{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let n1 = components['/a/n'].stateValues.value;
      let n2 = components['/b/n'].stateValues.value;
      let n3 = components['/c/n'].stateValues.value;
      let n4 = components['/d/n'].stateValues.value;
      let n5 = components['/e/n'].stateValues.value;
      let n6 = components['/f/n'].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      expect(n4).eq(samplednumbers[3]);
      expect(n5).eq(samplednumbers[4]);
      expect(n6).eq(samplednumbers[5]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      for(let ind=0; ind<6; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value).eq(samplednumbers[ind]);
      }
    })


  });

  it('select single math, assign name',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <p><selectfromsequence type="math" from="x" step="y" count="3" assignnames="u"/></p>
    <p><selectfromsequence type="math" from="x" step="y" count="3" assignnames="v"/></p>
    <p><selectfromsequence type="math" from="x" step="y" count="3" assignnames="w"/></p>
    <p><copy name="u2" tname="u" /></p>
    <p><copy name="v2" tname="v" /></p>
    <p><copy name="w2" tname="w" /></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let options = [
      me.fromText("x"),
      me.fromText("x+y"),
      me.fromText("x+2y"),
    ];
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let u=components['/u'];
      let u2=components['/u2'].replacements[0];
      let comparisons = options.map(el => el.equals(u.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(u.stateValues.value.tree).eqls(u2.stateValues.value.tree);

      let v=components['/v'];
      let v2=components['/v2'].replacements[0];
      comparisons = options.map(el => el.equals(v.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(v.stateValues.value.tree).eqls(v2.stateValues.value.tree);

      let w=components['/w'];
      let w2=components['/w2'].replacements[0];
      comparisons = options.map(el => el.equals(w.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(w.stateValues.value.tree).eqls(w2.stateValues.value.tree);

    })

  });

  it('select multiple maths, assign names',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <p><aslist>
      <selectfromsequence name="s" type="math" from="x" step="y" count="3" assignnames="u,v,w" numbertoselect="6" withReplacement />
    </aslist></p>
    <p><copy name="u2" tname="u" /></p>
    <p><copy name="v2" tname="v" /></p>
    <p><copy name="w2" tname="w" /></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let options = [
      me.fromText("x"),
      me.fromText("x+y"),
      me.fromText("x+2y"),
    ];
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let u=components['/u'];
      let u2=components['/u2'].replacements[0];
      let comparisons = options.map(el => el.equals(u.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(u.stateValues.value.tree).eqls(u2.stateValues.value.tree);

      let v=components['/v'];
      let v2=components['/v2'].replacements[0];
      comparisons = options.map(el => el.equals(v.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(v.stateValues.value.tree).eqls(v2.stateValues.value.tree);

      let w=components['/w'];
      let w2=components['/w2'].replacements[0];
      comparisons = options.map(el => el.equals(w.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(w.stateValues.value.tree).eqls(w2.stateValues.value.tree);

      let s = components['/s'];
      for(let ind=3; ind < 6; ind++) {
        let r = s.replacements[0];
        comparisons = options.map(el => el.equals(r.stateValues.value));
        expect(comparisons.includes(true)).eq(true);
      }
    })
    
  });

  it('select multiple maths, assign names, new namespace',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <math>1</math>
    <p><aslist>
      <selectfromsequence name="s" newnamespace type="math" from="x" step="y" count="3" assignnames="u,v,w" numbertoselect="6" withReplacement />
    </aslist></p>
    <p><copy name="u2" tname="s/u" /></p>
    <p><copy name="v2" tname="s/v" /></p>
    <p><copy name="w2" tname="s/w" /></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let options = [
      me.fromText("x"),
      me.fromText("x+y"),
      me.fromText("x+2y"),
    ];
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let u=components['/s/u'];
      let u2=components['/u2'].replacements[0];
      let comparisons = options.map(el => el.equals(u.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(u.stateValues.value.tree).eqls(u2.stateValues.value.tree);

      let v=components['/s/v'];
      let v2=components['/v2'].replacements[0];
      comparisons = options.map(el => el.equals(v.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(v.stateValues.value.tree).eqls(v2.stateValues.value.tree);

      let w=components['/s/w'];
      let w2=components['/w2'].replacements[0];
      comparisons = options.map(el => el.equals(w.stateValues.value));
      expect(comparisons.includes(true)).eq(true);
      expect(w.stateValues.value.tree).eqls(w2.stateValues.value.tree);

      let s = components['/s'];
      for(let ind=3; ind < 6; ind++) {
        let r = s.replacements[0];
        comparisons = options.map(el => el.equals(r.stateValues.value));
        expect(comparisons.includes(true)).eq(true);
      }
    })
    
  });

  it('two selects with mutual dependence, numbertoselect initially unresolved',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
  <p><aslist>
    <selectfromsequence name="s1" assignnames="x1, y1, z1" withReplacement>
      <numberToSelect><copy prop="numberToSelect" tname="s2" /></numberToSelect>
      1,5
    </selectfromsequence>
  </aslist></p>
  
  <p><aslist>
    <selectfromsequence name="s2" assignnames="x2, y2, z2">
      <numberToSelect><copy tname="n" /></numberToSelect>
      <withReplacement><copy prop="withReplacement" tname="s1" /></withReplacement>
      6,10
    </selectfromsequence>
  </aslist></p>
  
  <p><copy name="x1a" tname="x1" />, <copy name="y1a" tname="y1" />, <copy name="z1a" tname="z1" /></p>
  <p><copy name="x2a" tname="x2" />, <copy name="y2a" tname="y2" />, <copy name="z2a" tname="z2" /></p>
  
  <p> 
    <copy name="n2" tname="n3" />
    <copy name="n" tname="num1" />
    <math name="num1" simplify><copy tname="n2" />+<copy tname="num2" /></math>
    <math name="num2"><copy tname="n3" />+<copy tname="num3" /></math>
    <copy name="n3" tname="num3" />
    <number name="num3">1</number>
  </p>  
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/num1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let x1 = components['/x1'].stateValues.value;
      let y1 = components['/y1'].stateValues.value;
      let z1 = components['/z1'].stateValues.value;
      let x2 = components['/x2'].stateValues.value;
      let y2 = components['/y2'].stateValues.value;
      let z2 = components['/z2'].stateValues.value;

      expect(Number.isInteger(x1) && x1>=1 && x1 <= 5).eq(true);
      expect(Number.isInteger(y1) && y1>=1 && y1 <= 5).eq(true);
      expect(Number.isInteger(z1) && z1>=1 && z1 <= 5).eq(true);
      expect(Number.isInteger(x2) && x2>=6 && x2 <= 10).eq(true);
      expect(Number.isInteger(y2) && y2>=6 && y2 <= 10).eq(true);
      expect(Number.isInteger(z2) && z2>=6 && z2 <= 10).eq(true);

      let x1a = components['/x1a'].replacements[0].stateValues.value;
      let y1a = components['/y1a'].replacements[0].stateValues.value;
      let z1a = components['/z1a'].replacements[0].stateValues.value;
      let x2a = components['/x2a'].replacements[0].stateValues.value;
      let y2a = components['/y2a'].replacements[0].stateValues.value;
      let z2a = components['/z2a'].replacements[0].stateValues.value;

      expect(x1a).eq(x1);
      expect(y1a).eq(y1);
      expect(z1a).eq(z1);
      expect(x2a).eq(x2);
      expect(y2a).eq(y2);
      expect(z2a).eq(z2);

    })
  });

  it('selectfromsequence with hide will hide replacements', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <p>Selectfromsequences and hide</p>
      <p><selectfromsequence assignnames="c">
        a,e
      </selectfromsequence>, <selectfromsequence assignnames="d" hide>
        a,e
      </selectfromsequence></p>
      <p><copy tname="c" />, <copy hide="false" tname="d" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_p1').should('have.text', "Selectfromsequences and hide");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let c = components['/c'].stateValues.value;
      let d = components['/d'].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

      cy.get(`#\\/_p2`).should('have.text', `${c}, `)
      cy.get(`#\\/_p3`).should('have.text', `${c}, ${d}`)

    })
  });

  it('select multiple maths with excludes and excludecombinations',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample1" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample2" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample3" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample4" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample5" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample6" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample7" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample8" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample9" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample10" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample11" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample12" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample13" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample14" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample15" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample16" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample17" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample18" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample19" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence type="math" from="x" step="y" count="4" exclude="x+2y" numbertoselect="2" name="sample20" excludecombination="x,x+y"><excludecombination>x+y,x+3y</excludecombination><excludecombination>x+3y,x</excludecombination></selectfromsequence></aslist></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a')

    let allowedCombinations = [[me.fromText('x'),me.fromText('x+3y')], [me.fromText('x+y'),me.fromText('x')], [me.fromText('x+3y'),me.fromText('x+y')]];
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 20; ind++) {
        let x1 = components['/sample' + ind].replacements[0].stateValues.value;
        let x2 = components['/sample' + ind].replacements[1].stateValues.value;
        
        expect(allowedCombinations.some(v => v[0].equals(x1) && v[1].equals(x2))).eq(true);
      }
    })
  });

  it('select multiple letters with excludes and excludecombinations',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample1" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample2" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample3" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample4" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample5" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample6" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample7" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample8" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample9" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample10" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample11" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample12" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample13" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample14" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample15" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample16" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample17" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample18" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample19" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    <p><aslist><selectfromsequence from="m" step="3" count="4" exclude="p" numbertoselect="2" name="sample20" excludecombination="m,v"><excludecombination>s,m</excludecombination><excludecombination>v,s</excludecombination></selectfromsequence></aslist></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a')

    let allowedCombinations = [['m', 's'],['s','v'],['v','m']];
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let ind=1; ind <= 20; ind++) {
        let x1 = components['/sample' + ind].replacements[0].stateValues.value;
        let x2 = components['/sample' + ind].replacements[1].stateValues.value;
        
        expect(allowedCombinations.some(v => v[0] === x1 && v[1] === x2)).eq(true);
      }
    })
  });

  it('select numbers and sort',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence numbertoselect="20" sortresults="true" withreplacement="true">-20,20</selectfromsequence></aslist></p>

    <p><copy tname="_aslist1" /></p>
    <copy tname="_p1" />
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a')

  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let lastnumber = -20;
      let originalnumbers = components['/_selectfromsequence1'].replacements;
      let secondnumbers = components['/_copy1'].replacements[0].activeChildren;
      let thirdnumbers = components['/_copy2'].replacements[0].activeChildren[0].activeChildren;
      for(let i=0; i<20; i++) {
        let newnumber = originalnumbers[i].stateValues.value;
        expect(newnumber).gte(lastnumber);
        lastnumber = newnumber;
        expect(secondnumbers[i].stateValues.value).eq(newnumber);
        expect(thirdnumbers[i].stateValues.value).eq(newnumber);
      }
    });

  });

  it('select letters and sort',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p><aslist><selectfromsequence numbertoselect="40" sortresults="true" withreplacement="true">a,bz</selectfromsequence></aslist></p>

    <p><copy tname="_aslist1" /></p>
    <copy tname="_p1" />
    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text','a')

  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let lastletter = 'a';
      let originalletters = components['/_selectfromsequence1'].replacements;
      let secondletters = components['/_copy1'].replacements[0].activeChildren;
      let thirdletters = components['/_copy2'].replacements[0].activeChildren[0].activeChildren;
      for(let i=0; i<20; i++) {
        let newletter = originalletters[i].stateValues.value;
        expect(newletter.length).gte(lastletter.length);
        expect(newletter.length > lastletter.length || newletter >= lastletter).to.be.true;
        lastletter = newletter;
        expect(secondletters[i].stateValues.value).eq(newletter);
        expect(thirdletters[i].stateValues.value).eq(newletter);
      }
    });

  });



})