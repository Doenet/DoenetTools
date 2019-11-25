import me from 'math-expressions';

describe('Sequence Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')
  })

  it('number sequence, no parameters',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence/></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      for(let i=0; i<10; i++) {
        expect(children[i].state.number).eq(i+1);
      }
    })
  });
  
  it('number sequence, just from',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="-4"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−4')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      for(let i=0; i<10; i++) {
        expect(children[i].state.number).eq(i-4);
      }
    })
  });

  it('number sequence, just to',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence to="3"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(3);
      for(let i=0; i<3; i++) {
        expect(children[i].state.number).eq(3+i-2);
      }
    })
  });

  it('number sequence, just step',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence step="-2"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      for(let i=0; i<10; i++) {
        expect(children[i].state.number).eq(1+i*(-2));
      }
    })
  });

  it('number sequence, just count',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence count="5"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      for(let i=0; i<5; i++) {
        expect(children[i].state.number).eq(1+i);
      }
    })
  });

  it('number sequence, from and to',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="-3" to="4"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−3')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      for(let i=0; i<8; i++) {
        expect(children[i].state.number).eq(-3+i);
      }
    })
  });

  it('number sequence, from and step',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="2" step="-4"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      for(let i=0; i<10; i++) {
        expect(children[i].state.number).eq(2 + i*(-4));
      }
    })
  });

  it('number sequence, from and count',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="11" count="3"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('11')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(3);
      for(let i=0; i<3; i++) {
        expect(children[i].state.number).eq(11 + i);
      }
    })
  });

  it('number sequence, to and step',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence to="21" step="3"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      for(let i=0; i<7; i++) {
        expect(children[i].state.number).eq(21 + 3*(i-6));
      }
    })
  });

  it('number sequence, to and count',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence to="-8" count="4"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−11')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      for(let i=0; i<4; i++) {
        expect(children[i].state.number).eq(-8 +(i-3));
      }
    })
  });

  it('number sequence, step and count',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence step="5" count="6"/></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      for(let i=0; i<6; i++) {
        expect(children[i].state.number).eq(1 + 5*i);
      }
    })
  });

  it('number sequence, from, to, and step',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="9" to="2" step="-2" /></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      for(let i=0; i<4; i++) {
        expect(children[i].state.number).eq(9 - 2*i);
      }
    })
  });

  it('number sequence, from, to, and count',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="-5" to="5" count="6" /></aslist>
    `},"*");
    });
  
    // to wait for page to load
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−5')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      for(let i=0; i<6; i++) {
        expect(children[i].state.number).eq(-5 + 2*i);
      }
    })
  });

  it('number sequence, from, step, and count',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="8" step="-2" count="5" /></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('8')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      for(let i=0; i<5; i++) {
        expect(children[i].state.number).eq(8 - 2*i);
      }
    })
  });

  it('number sequence, to, step, and count',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence to="8" step="-2" count="5" /></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16')
    })
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      for(let i=0; i<5; i++) {
        expect(children[i].state.number).eq(8 - 2*(i-4));
      }
    })
  });

  it('letters sequence, lowercase, explicit type',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence type="letters" from="c" to="Q" count="5" /></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters3').should('have.text', 'c');
 
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      expect(children[0].state.value).eq('c');
      expect(children[1].state.value).eq('f');
      expect(children[2].state.value).eq('i');
      expect(children[3].state.value).eq('l');
      expect(children[4].state.value).eq('o');
    })
  });

  it('letters sequence, lowercase',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="c" to="Q" count="5" /></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters3').should('have.text', 'c');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      expect(children[0].state.value).eq('c');
      expect(children[1].state.value).eq('f');
      expect(children[2].state.value).eq('i');
      expect(children[3].state.value).eq('l');
      expect(children[4].state.value).eq('o');
    })
  });

  it('letters sequence, uppercase',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="Y" to="f" step="-4" /></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters3').should('have.text', 'Y');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      expect(children[0].state.value).eq('Y');
      expect(children[1].state.value).eq('U');
      expect(children[2].state.value).eq('Q');
      expect(children[3].state.value).eq('M');
      expect(children[4].state.value).eq('I');
    })
  });

  it('letters sequence, multicharacter',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence from="aZ" step="3" count="4" /></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters2').should('have.text', 'az');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      expect(children[0].state.value).eq('az');
      expect(children[1].state.value).eq('bc');
      expect(children[2].state.value).eq('bf');
      expect(children[3].state.value).eq('bi');
    })
  });

  it('letters sequence, stays valid',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence to="q" step="3" count="10" /></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters2').should('have.text', 'b');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      expect(children[0].state.value).eq('b');
      expect(children[1].state.value).eq('e');
      expect(children[2].state.value).eq('h');
      expect(children[3].state.value).eq('k');
      expect(children[4].state.value).eq('n');
      expect(children[5].state.value).eq('q');
    })
  });

  it('number sequence, sugar to',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence>7</sequence></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      for(let i=0; i<7; i++) {
        expect(children[i].state.number).eq(7+i-6);
      }
    })
  });

  it('number sequence, sugar from and to',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence>-4,1</sequence></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−4')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      for(let i=0; i<6; i++) {
        expect(children[i].state.number).eq(-4+i);
      }
    })
  });

  it('number sequence, step with sugar from and to',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence step="-3">4,-6</sequence></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      for(let i=0; i<4; i++) {
        expect(children[i].state.number).eq(4-3*i);
      }
    })
  });

  it('letters sequence, explicit type but no parameters',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence type="letters"/></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(10);
      expect(children[0].state.value).eq('a');
      expect(children[1].state.value).eq('b');
      expect(children[2].state.value).eq('c');
      expect(children[3].state.value).eq('d');
      expect(children[4].state.value).eq('e');
      expect(children[5].state.value).eq('f');
      expect(children[6].state.value).eq('g');
      expect(children[7].state.value).eq('h');
      expect(children[8].state.value).eq('i');
      expect(children[9].state.value).eq('j');
    })
  });

  it('letters sequence, sugar to',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence>e</sequence></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters2').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(5);
      expect(children[0].state.value).eq('a');
      expect(children[1].state.value).eq('b');
      expect(children[2].state.value).eq('c');
      expect(children[3].state.value).eq('d');
      expect(children[4].state.value).eq('e');
    })
  });

  it('letters sequence, sugar from and to, explicit type',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence type="letters">bw, cb</sequence></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters3').should('have.text', 'bw');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      expect(children[0].state.value).eq('bw');
      expect(children[1].state.value).eq('bx');
      expect(children[2].state.value).eq('by');
      expect(children[3].state.value).eq('bz');
      expect(children[4].state.value).eq('ca');
      expect(children[5].state.value).eq('cb');
    })
  });

  it('letters sequence, sugar from and to',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence>bw, cb</sequence></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters3').should('have.text', 'bw');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(6);
      expect(children[0].state.value).eq('bw');
      expect(children[1].state.value).eq('bx');
      expect(children[2].state.value).eq('by');
      expect(children[3].state.value).eq('bz');
      expect(children[4].state.value).eq('ca');
      expect(children[5].state.value).eq('cb');
    })
  });

  it('math sequence, calculate step',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence type="math" from="3x" to="3y" count="4" /></aslist>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__math3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(4);
      expect(children[0].state.value.tree).eqls(['*', 3, 'x']);
      expect(children[1].state.value.tree).eqls(['+', ['*', 2, 'x'], 'y']);
      expect(children[2].state.value.tree).eqls(['+', 'x', ['*', 2, 'y']]);
      expect(children[3].state.value.tree).eqls(['*', 3, 'y']);
    })
  });

  it('check inactive dependencies',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <mathinput name="thecount" prefill="0" />
    <sequence from="0">
      <count><ref prop="value">thecount</ref></count>
    </sequence>
    `},"*");
    });
    cy.get('#\\/thecount_input').should('have.value', '0') //wait for page to load

    cy.log('dependency is inactive')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let sequence1 = components['/_sequence1'];
      expect(Object.keys(sequence1.upstreamDependencies).length).eq(0);
    })

    cy.log("Add number, dependency is created")
    cy.get('#\\/thecount_input').clear().type("1{enter}");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let sequence1 = components['/_sequence1'];
      let number2 = components.__number2;
      let upstreamDep1 = sequence1.upstreamDependencies['__number2'];
      let downstreamDep1 = number2.downstreamDependencies['/_sequence1'];
      expect(upstreamDep1.inactive).not.eq(true);
      expect(downstreamDep1.inactive).not.eq(true);
    })


    cy.log("remove number, dependency is inactive")
    cy.get('#\\/thecount_input').clear().type("0{enter}");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let sequence1 = components['/_sequence1'];
      let number2 = components.__number2;
      let upstreamDep1 = sequence1.upstreamDependencies['__number2'];
      let downstreamDep1 = number2.downstreamDependencies['/_sequence1'];
      expect(upstreamDep1.inactive).eq(true);
      expect(downstreamDep1.inactive).eq(true);
    })

    cy.log("Add ten numbers")
    cy.get('#\\/thecount_input').clear().type("10{enter}");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let sequence1 = components['/_sequence1'];
      for(let i=2; i <= 11; i++) {
        expect(sequence1.upstreamDependencies['__number'+i].inactive).not.eq(true);
        expect(components['__number'+i].downstreamDependencies['/_sequence1'].inactive).not.eq(true);
      }
    })

    cy.log("Reduce to five numbers")
    cy.get('#\\/thecount_input').clear().type("5{enter}");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let sequence1 = components['/_sequence1'];
      for(let i=2; i <= 6; i++) {
        expect(sequence1.upstreamDependencies['__number'+i].inactive).not.eq(true);
        expect(components['__number'+i].downstreamDependencies['/_sequence1'].inactive).not.eq(true);
      }
      for(let i=7; i <= 11; i++) {
        expect(sequence1.upstreamDependencies['__number'+i].inactive).eq(true);
        expect(components['__number'+i].downstreamDependencies['/_sequence1'].inactive).eq(true);
      }
    })

    cy.log("Reduce to zero numbers")
    cy.get('#\\/thecount_input').clear().type("0{enter}");
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let sequence1 = components['/_sequence1'];
      for(let i=2; i <= 11; i++) {
        expect(sequence1.upstreamDependencies['__number'+i].inactive).eq(true);
        expect(components['__number'+i].downstreamDependencies['/_sequence1'].inactive).eq(true);
      }
    })


  })

  it('number sequence, excludes',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence type="number" count="10">
    <exclude><ref prop="value">exclude2</ref></exclude>
    <exclude>2,6</exclude>
    </sequence></aslist>
    <p>Also exclude: <mathinput name="exclude2" /></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__number12 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(children[ind].state.number).eq(1+i);
        ind++
      }
    })

    cy.log("also exclude 9")
    cy.get('#\\/exclude2_input').clear().type(`9{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5 || i==8) {
          continue;
        }
        expect(children[ind].state.number).eq(1+i);
        ind++
      }
    })

    cy.log("also exclude 6 twice")
    cy.get('#\\/exclude2_input').clear().type(`6{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(children[ind].state.number).eq(1+i);
        ind++
      }
    })

    cy.log("also exclude 12")
    cy.get('#\\/exclude2_input').clear().type(`12{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(children[ind].state.number).eq(1+i);
        ind++
      }
    })


    cy.log("also exclude 3")
    cy.get('#\\/exclude2_input').clear().type(`3{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5 || i==2) {
          continue;
        }
        expect(children[ind].state.number).eq(1+i);
        ind++
      }
    })


    cy.log("don't exclude anything else")
    cy.get('#\\/exclude2_input').clear().type(`{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(children[ind].state.number).eq(1+i);
        ind++
      }
    })

  });

  it('letters sequence, excludes',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence type="letters" count="10">
    <exclude><ref prop="value">_textinput1</ref></exclude>
    <exclude>b,f</exclude>
    </sequence></aslist>
    <p>Also exclude: <textinput /></p>
    `},"*");
    });

    // to wait for page to load
    cy.get('#__letters12').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(children[ind].state.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })

    cy.log("also exclude i")
    cy.get('#\\/_textinput1_input').clear().type(`i{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5 || i==8) {
          continue;
        }
        expect(children[ind].state.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })

    cy.log("also exclude f twice")
    cy.get('#\\/_textinput1_input').clear().type(`f{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(children[ind].state.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })

    cy.log("also exclude l")
    cy.get('#\\/_textinput1_input').clear().type(`l{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(children[ind].state.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })


    cy.log("also exclude C")
    cy.get('#\\/_textinput1_input').clear().type(`C{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5 || i==2) {
          continue;
        }
        expect(children[ind].state.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })


    cy.log("don't exclude anything else")
    cy.get('#\\/_textinput1_input').clear().type(`{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(children[ind].state.value).eq(String.fromCharCode(97 + i));
        ind++
      }
    })

  });

  it('math sequence, excludes',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence type="math" count="10" from="x" step="x">
    <exclude><ref prop="value">_mathinput1</ref></exclude>
    <exclude>2x,6x</exclude>
    </sequence></aslist>
    <p>Also exclude: <mathinput /></p>
    <p>First value: <ref childnumber="1">_aslist1</ref></p>
    `},"*");
    });

    // get something that won't be right until page has finished processing
    // so that will wait until done
    cy.get('#\\/_p2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(me.fromAst(children[ind].state.value.tree).equals(me.fromText((1+i).toString() + "x"))).eq(true);
        ind++
      }
    })

    cy.log("also exclude 9x")
    cy.get('#\\/_mathinput1_input').clear().type(`9x{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5 || i==8) {
          continue;
        }
        expect(me.fromAst(children[ind].state.value.tree).equals(me.fromText((1+i).toString() + "x"))).eq(true);
        ind++
      }
    })

    cy.log("also exclude 6x twice")
    cy.get('#\\/_mathinput1_input').clear().type(`6x{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(me.fromAst(children[ind].state.value.tree).equals(me.fromText((1+i).toString() + "x"))).eq(true);
        ind++
      }
    })

    cy.log("also exclude 12x")
    cy.get('#\\/_mathinput1_input').clear().type(`12x{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(me.fromAst(children[ind].state.value.tree).equals(me.fromText((1+i).toString() + "x"))).eq(true);
        ind++
      }
    })


    cy.log("also exclude 3x")
    cy.get('#\\/_mathinput1_input').clear().type(`3x{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(7);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5 || i==2) {
          continue;
        }
        expect(me.fromAst(children[ind].state.value.tree).equals(me.fromText((1+i).toString() + "x"))).eq(true);
        ind++
      }
    })


    cy.log("don't exclude anything else")
    cy.get('#\\/_mathinput1_input').clear().type(`{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let children = components['/_aslist1'].activeChildren;
      expect(children.length).eq(8);
      let ind = 0;
      for(let i=0; i<10; i++) {
        if(i==1 || i==5) {
          continue;
        }
        expect(me.fromAst(children[ind].state.value.tree).equals(me.fromText((1+i).toString() + "x"))).eq(true);
        ind++
      }
    })

  });

  it('sequence of decimals rounds on display',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <aslist><sequence step="0.1" >0,1</sequence></aslist>
    `},"*");
    });
  
    cy.log("Round when displaying to show 10ths correctly")
    for(let i=0; i<11; i++) {
      cy.get('#__number' + (i+3)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal((i/10).toString());
      })
    }

    cy.log("Don't round internaly")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let i=0; i<11; i++) {
        expect(components['__number'+(i+3)].state.number).eq(0.1*i);
      }
    })
  });

  it('sequence with number operators ',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <text>a</text>
    <math name="n">5</math>
    <number name="m">10</number>
    <aslist><sequence>
      <from><min><ref>n</ref><number>11</number></min></from>
      <to><max><math><ref>m</ref>+3</math><number>11</number></max></to>
    </sequence></aslist>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a');  // to wait for page to load
  
    for(let i=0; i<9; i++) {
      cy.get('#__number' + (i+4)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal((i+5).toString());
      })
    }

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      for(let i=0; i<9; i++) {
        expect(components['__number'+(i+4)].state.number).eq(i+5);
      }
    })
  });

});

