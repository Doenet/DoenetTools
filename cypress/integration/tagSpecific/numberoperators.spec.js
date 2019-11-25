describe('Number Operator Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('mean',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p name="pPrime">Mean of first primes: <mean name="meanPrime">2,3,5,7</mean></p>
    <p>Reffing that mean: <ref>meanPrime</ref></p>
    <ref>pPrime</ref>

    <p name="p100">Mean of numbers from 1 to 100: 
      <mean name="mean100"><sequence>100</sequence></mean>
    </p>
    <p>Reffing that mean: <ref>mean100</ref></p>
    <ref>p100</ref>
    `},"*");
    });

    cy.log('Test value displayed in browser')

    cy.get('#\\/meanprime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4.25')
    })
    cy.get('#__mean1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4.25')
    })
    cy.get('#__mean2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4.25')
    })
    cy.get('#\\/mean100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('50.5')
    })
    cy.get('#__mean3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('50.5')
    })
    cy.get('#__mean4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('50.5')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/meanprime'].state.number).eq(4.25);
      expect(components['/_ref1'].replacements[0].state.number).eq(4.25);
      expect(components['/_ref2'].replacements[0].activeChildren[1].state.number).eq(4.25);
      expect(components['/mean100'].state.number).eq(50.5);
      expect(components['/_ref3'].replacements[0].state.number).eq(50.5);
      expect(components['/_ref4'].replacements[0].activeChildren[1].state.number).eq(50.5);
    })
  })

  it('variance',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p name="pPrime">Variance of first primes: <variance name="variancePrime">2,3,5,7</variance></p>
    <p>Reffing that variance: <ref>variancePrime</ref></p>
    <ref>pPrime</ref>

    <p name="p100">Variance of numbers from 1 to 100: 
      <variance name="variance100"><sequence>100</sequence></variance>
    </p>
    <p>Reffing that variance: <ref>variance100</ref></p>
    <ref>p100</ref>
    `},"*");
    });

    cy.log('Test value displayed in browser')

    cy.get('#\\/varianceprime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3.6875')
    })
    cy.get('#__variance1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3.6875')
    })
    cy.get('#__variance2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3.6875')
    })
    cy.get('#\\/variance100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('833.25')
    })
    cy.get('#__variance3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('833.25')
    })
    cy.get('#__variance4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('833.25')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/varianceprime'].state.number).closeTo(59/16, 1E-12);
      expect(components['/_ref1'].replacements[0].state.number).closeTo(59/16, 1E-12);
      expect(components['/_ref2'].replacements[0].activeChildren[1].state.number).closeTo(59/16, 1E-12);
      expect(components['/variance100'].state.number).closeTo((100**2-1)/12, 1E-12);
      expect(components['/_ref3'].replacements[0].state.number).closeTo((100**2-1)/12, 1E-12);
      expect(components['/_ref4'].replacements[0].activeChildren[1].state.number).closeTo((100**2-1)/12, 1E-12);
    })
  })

  it('unbiased variance',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p name="pPrime">Variance of first primes: <variance unbiased name="variancePrime">2,3,5,7</variance></p>
    <p>Reffing that variance: <ref>variancePrime</ref></p>
    <ref>pPrime</ref>

    <p name="p100">Variance of numbers from 1 to 100: 
      <variance name="variance100" unbiased><sequence>100</sequence></variance>
    </p>
    <p>Reffing that variance: <ref>variance100</ref></p>
    <ref>p100</ref>
    `},"*");
    });

    cy.log('Test value displayed in browser')

    cy.get('#\\/varianceprime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(59/12,1E-6)
    })
    cy.get('#__variance1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(59/12,1E-6)
    })
    cy.get('#__variance2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(59/12,1E-6)
    })
    cy.get('#\\/variance100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo((100**2-1)/12*100/99,1E-6)
    })
    cy.get('#__variance3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo((100**2-1)/12*100/99,1E-6)
    })
    cy.get('#__variance4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo((100**2-1)/12*100/99,1E-6)
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/varianceprime'].state.number).closeTo(59/12, 1E-12);
      expect(components['/_ref1'].replacements[0].state.number).closeTo(59/12, 1E-12);
      expect(components['/_ref2'].replacements[0].activeChildren[1].state.number).closeTo(59/12, 1E-12);
      expect(components['/variance100'].state.number).closeTo((100**2-1)/12*100/99, 1E-12);
      expect(components['/_ref3'].replacements[0].state.number).closeTo((100**2-1)/12*100/99, 1E-12);
      expect(components['/_ref4'].replacements[0].activeChildren[1].state.number).closeTo((100**2-1)/12*100/99, 1E-12);
    })
  })

  it('standard deviation',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p name="pPrime">Standard deviation of first primes: <standarddeviation name="standarddeviationPrime">2,3,5,7</standarddeviation></p>
    <p>Reffing that standard deviation: <ref>standarddeviationPrime</ref></p>
    <ref>pPrime</ref>

    <p name="p100">Standard deviation of numbers from 1 to 100: 
      <standarddeviation name="standarddeviation100"><sequence>100</sequence></standarddeviation>
    </p>
    <p>Reffing that standard deviation: <ref>standarddeviation100</ref></p>
    <ref>p100</ref>
    `},"*");
    });

    cy.log('Test value displayed in browser')

    cy.get('#\\/standarddeviationprime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt(59/16),1E-6)
    })
    cy.get('#__standarddeviation1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt(59/16),1E-6)
    })
    cy.get('#__standarddeviation2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt(59/16),1E-6)
    })
    cy.get('#\\/standarddeviation100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt((100**2-1)/12),1E-6)
    })
    cy.get('#__standarddeviation3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt((100**2-1)/12),1E-6)
    })
    cy.get('#__standarddeviation4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt((100**2-1)/12),1E-6)
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/standarddeviationprime'].state.number).closeTo(Math.sqrt(59/16), 1E-12);
      expect(components['/_ref1'].replacements[0].state.number).closeTo(Math.sqrt(59/16), 1E-12);
      expect(components['/_ref2'].replacements[0].activeChildren[1].state.number).closeTo(Math.sqrt(59/16), 1E-12);
      expect(components['/standarddeviation100'].state.number).closeTo(Math.sqrt((100**2-1)/12), 1E-12);
      expect(components['/_ref3'].replacements[0].state.number).closeTo(Math.sqrt((100**2-1)/12), 1E-12);
      expect(components['/_ref4'].replacements[0].activeChildren[1].state.number).closeTo(Math.sqrt((100**2-1)/12), 1E-12);
    })
  })

  it('unbiased standard deviation',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p name="pPrime">Standard deviation of first primes: <standarddeviation unbiased name="standarddeviationPrime">2,3,5,7</standarddeviation></p>
    <p>Reffing that standard deviation: <ref>standarddeviationPrime</ref></p>
    <ref>pPrime</ref>

    <p name="p100">Standard deviation of numbers from 1 to 100: 
      <standarddeviation name="standarddeviation100" unbiased><sequence>100</sequence></standarddeviation>
    </p>
    <p>Reffing that standard deviation: <ref>standarddeviation100</ref></p>
    <ref>p100</ref>
    `},"*");
    });

    cy.log('Test value displayed in browser')

    cy.get('#\\/standarddeviationprime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt(59/12),1E-6)
    })
    cy.get('#__standarddeviation1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt(59/12),1E-6)
    })
    cy.get('#__standarddeviation2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt(59/12),1E-6)
    })
    cy.get('#\\/standarddeviation100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt((100**2-1)/12*100/99),1E-6)
    })
    cy.get('#__standarddeviation3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt((100**2-1)/12*100/99),1E-6)
    })
    cy.get('#__standarddeviation4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.sqrt((100**2-1)/12*100/99),1E-6)
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/standarddeviationprime'].state.number).closeTo(Math.sqrt(59/12), 1E-12);
      expect(components['/_ref1'].replacements[0].state.number).closeTo(Math.sqrt(59/12), 1E-12);
      expect(components['/_ref2'].replacements[0].activeChildren[1].state.number).closeTo(Math.sqrt(59/12), 1E-12);
      expect(components['/standarddeviation100'].state.number).closeTo(Math.sqrt((100**2-1)/12*100/99), 1E-12);
      expect(components['/_ref3'].replacements[0].state.number).closeTo(Math.sqrt((100**2-1)/12*100/99), 1E-12);
      expect(components['/_ref4'].replacements[0].activeChildren[1].state.number).closeTo(Math.sqrt((100**2-1)/12*100/99), 1E-12);
    })
  })

  it('count',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p name="pPrime">Count of first primes: <count name="countPrime">2,3,5,7</count></p>
    <p>Reffing that count: <ref>countPrime</ref></p>
    <ref>pPrime</ref>

    <p name="p100">count of numbers from 1 to 100: 
      <count name="count100"><sequence>100</sequence></count>
    </p>
    <p>Reffing that count: <ref>count100</ref></p>
    <ref>p100</ref>
    `},"*");
    });

    cy.log('Test value displayed in browser')

    cy.get('#\\/countprime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#__count1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#__count2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/count100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('100')
    })
    cy.get('#__count3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('100')
    })
    cy.get('#__count4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('100')
    })

    cy.log('Test internal values are set to the correct values')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/countprime'].state.number).eq(4);
      expect(components['/_ref1'].replacements[0].state.number).eq(4);
      expect(components['/_ref2'].replacements[0].activeChildren[1].state.number).eq(4);
      expect(components['/count100'].state.number).eq(100);
      expect(components['/_ref3'].replacements[0].state.number).eq(100);
      expect(components['/_ref4'].replacements[0].activeChildren[1].state.number).eq(100);
    })
  })

  it('mod',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <p>7 mod 2 is <mod><number>7</number><number>2</number></mod>.</p>
    `},"*");
    });

    cy.log('Test value displayed in browser')

    cy.get('#\\/_mod1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
  })

});