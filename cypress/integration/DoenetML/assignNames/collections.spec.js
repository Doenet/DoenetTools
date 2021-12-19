import me from 'math-expressions';
import cssesc from 'cssesc';
import { flattenDeep } from '../../../../src/Core/utils/array';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Collection assignName Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('name points and coords off a graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
  </graph>

  <collect name="cl1" componentTypes="point" tname="_graph1" assignNames="a b" />

  <p>a: <copy tname="a" prop="coords" assignNames="ashadow" /></p>
  <p>b: <copy tname="b" prop="coords" assignNames="bshadow" /></p>

  <collect name="cl2" componentTypes="point" prop="x" tname="_graph1" assignNames="u v" />

  <p>u: <copy tname="u" assignNames="ushadow" /></p>
  <p>v: <copy tname="v" assignNames="vshadow" /></p>

  <graph>
    <copy name="cp1" tname="cl1" assignNames="a1 b1" />
  </graph>

  <p>a1: <copy tname="a1" prop="coords" assignNames="a1shadow" /></p>
  <p>b1: <copy tname="b1" prop="coords" assignNames="b1shadow" /></p>

  <copy name="cp2" prop="x" tname="cl1" assignNames="u1 v1" />

  <p>u1: <copy tname="u1" assignNames="u1shadow" /></p>
  <p>v1: <copy tname="v1" assignNames="v1shadow" /></p>

  <copy name="cp3" prop="x" tname="cp1" assignNames="u2 v2" />

  <p>u2: <copy tname="u2" assignNames="u2shadow" /></p>
  <p>v2: <copy tname="v2" assignNames="v2shadow" /></p>

  <extract prop="x" assignNames="u3 v3"><copy tname="cl1"/></extract>

  <p>u3: <copy tname="u3" assignNames="u3shadow" /></p>
  <p>v3: <copy tname="v3" assignNames="v3shadow" /></p>

  <extract prop="x" assignNames="u4"><copy tname="a1"/></extract>
  <extract prop="x" assignNames="v4"><copy tname="b1"/></extract>

  <p>u4: <copy tname="u4" assignNames="u4shadow" /></p>
  <p>v4: <copy tname="v4" assignNames="v4shadow" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    })
    cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    })
    cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    })
    cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a1'].stateValues.xs.map(x => x.tree)).eqls([1, 2]);
      expect(components['/b1'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
    })

    cy.log('Move point a');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/a'].movePoint({ x: 5, y: -5 });

      cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })


    })

    cy.log('Move point b');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/b'].movePoint({ x: 9, y: 8 });

      cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })

    })


    cy.log('Move point a1');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/a1'].movePoint({ x: 7, y: 0 });

      cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })

    })


    cy.log('Move point b1');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/b1'].movePoint({ x: 4, y: 1 });

      cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,1)')
      })
      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,1)')
      })
      cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,1)')
      })
      cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })

    })

  })

  it('name points and coords off a graph, extra names', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
  </graph>

  <collect name="cl1" componentTypes="point" tname="_graph1" assignNames="a b c" />

  <p>a: <copy tname="a" prop="coords" assignNames="ashadow" /></p>
  <p>b: <copy tname="b" prop="coords" assignNames="bshadow" /></p>
  <p name="pc">c: <copy tname="c" prop="coords" assignNames="cshadow" /></p>

  <collect name="cl2" componentTypes="point" prop="x" tname="_graph1" assignNames="u v w" />

  <p>u: <copy tname="u" assignNames="ushadow" /></p>
  <p>v: <copy tname="v" assignNames="vshadow" /></p>
  <p name="pw">w: <copy tname="w" assignNames="wshadow" /></p>

  <graph>
    <copy name="cp1" tname="cl1" assignNames="a1 b1 c1" />
  </graph>

  <p>a1: <copy tname="a1" prop="coords" assignNames="a1shadow" /></p>
  <p>b1: <copy tname="b1" prop="coords" assignNames="b1shadow" /></p>
  <p name="pc1">c1: <copy tname="c1" prop="coords" assignNames="c1shadow" /></p>

  <copy name="cp2" prop="x" tname="cl1" assignNames="u1 v1 w1 x1" />

  <p>u1: <copy tname="u1" assignNames="u1shadow" /></p>
  <p>v1: <copy tname="v1" assignNames="v1shadow" /></p>
  <p name="pv1">v1: <copy tname="w1" assignNames="w1shadow" /></p>
  <p name="px1">x1: <copy tname="x1" assignNames="x1shadow" /></p>

  <copy name="cp3" prop="x" tname="cp1" assignNames="u2 v2" />

  <p>u2: <copy tname="u2" assignNames="u2shadow" /></p>
  <p>v2: <copy tname="v2" assignNames="v2shadow" /></p>

  <extract prop="x" assignNames="u3 v3 w3 x3"><copy tname="cl1"/></extract>

  <p>u3: <copy tname="u3" assignNames="u3shadow" /></p>
  <p>v3: <copy tname="v3" assignNames="v3shadow" /></p>
  <p name="pv3">v3: <copy tname="w3" assignNames="w3shadow" /></p>
  <p name="px3">x3: <copy tname="x3" assignNames="x3shadow" /></p>

  <extract prop="x" assignNames="u4 w4"><copy tname="a1"/></extract>
  <extract prop="x" assignNames="v4 x4"><copy tname="b1"/></extract>

  <p>u4: <copy tname="u4" assignNames="u4shadow" /></p>
  <p>v4: <copy tname="v4" assignNames="v4shadow" /></p>
  <p name="pv4">v4: <copy tname="w4" assignNames="w4shadow" /></p>
  <p name="px4">x4: <copy tname="x4" assignNames="x4shadow" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    })
    cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    })
    cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,4)')
    })
    cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/pc').should('have.text', 'c: ')
    cy.get('#\\/pw').should('have.text', 'w: ')
    cy.get('#\\/pc1').should('have.text', 'c1: ')
    cy.get('#\\/pv1').should('have.text', 'v1: ')
    cy.get('#\\/px1').should('have.text', 'x1: ')
    cy.get('#\\/pv3').should('have.text', 'v3: ')
    cy.get('#\\/px3').should('have.text', 'x3: ')
    cy.get('#\\/pv4').should('have.text', 'v4: ')
    cy.get('#\\/px4').should('have.text', 'x4: ')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a1'].stateValues.xs.map(x => x.tree)).eqls([1, 2]);
      expect(components['/b1'].stateValues.xs.map(x => x.tree)).eqls([3, 4]);
    })

    cy.log('Move point a');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/a'].movePoint({ x: 5, y: -5 });

      cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/pc').should('have.text', 'c: ')
      cy.get('#\\/pw').should('have.text', 'w: ')
      cy.get('#\\/pc1').should('have.text', 'c1: ')
      cy.get('#\\/pv1').should('have.text', 'v1: ')
      cy.get('#\\/px1').should('have.text', 'x1: ')
      cy.get('#\\/pv3').should('have.text', 'v3: ')
      cy.get('#\\/px3').should('have.text', 'x3: ')
      cy.get('#\\/pv4').should('have.text', 'v4: ')
      cy.get('#\\/px4').should('have.text', 'x4: ')

    })

    cy.log('Move point b');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/b'].movePoint({ x: 9, y: 8 });

      cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/pc').should('have.text', 'c: ')
      cy.get('#\\/pw').should('have.text', 'w: ')
      cy.get('#\\/pc1').should('have.text', 'c1: ')
      cy.get('#\\/pv1').should('have.text', 'v1: ')
      cy.get('#\\/px1').should('have.text', 'x1: ')
      cy.get('#\\/pv3').should('have.text', 'v3: ')
      cy.get('#\\/px3').should('have.text', 'x3: ')
      cy.get('#\\/pv4').should('have.text', 'v4: ')
      cy.get('#\\/px4').should('have.text', 'x4: ')

    })


    cy.log('Move point a1');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/a1'].movePoint({ x: 7, y: 0 });

      cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,8)')
      })
      cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9')
      })
      cy.get('#\\/pc').should('have.text', 'c: ')
      cy.get('#\\/pw').should('have.text', 'w: ')
      cy.get('#\\/pc1').should('have.text', 'c1: ')
      cy.get('#\\/pv1').should('have.text', 'v1: ')
      cy.get('#\\/px1').should('have.text', 'x1: ')
      cy.get('#\\/pv3').should('have.text', 'v3: ')
      cy.get('#\\/px3').should('have.text', 'x3: ')
      cy.get('#\\/pv4').should('have.text', 'v4: ')
      cy.get('#\\/px4').should('have.text', 'x4: ')

    })


    cy.log('Move point b1');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/b1'].movePoint({ x: 4, y: 1 });

      cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,1)')
      })
      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,1)')
      })
      cy.get('#\\/a1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,0)')
      })
      cy.get('#\\/b1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,1)')
      })
      cy.get('#\\/u').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/ushadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/vshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/u4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/v4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/pc').should('have.text', 'c: ')
      cy.get('#\\/pw').should('have.text', 'w: ')
      cy.get('#\\/pc1').should('have.text', 'c1: ')
      cy.get('#\\/pv1').should('have.text', 'v1: ')
      cy.get('#\\/px1').should('have.text', 'x1: ')
      cy.get('#\\/pv3').should('have.text', 'v3: ')
      cy.get('#\\/px3').should('have.text', 'x3: ')
      cy.get('#\\/pv4').should('have.text', 'v4: ')
      cy.get('#\\/px4').should('have.text', 'x4: ')

    })

  })

  it('sequentially name points and coords off lines', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <line through="(0,0)(1,1)"/>
    <line through="(4,3)(2,1)"/>
  </graph>

  <graph>
    <collect name="cl1" componentTypes="line" prop="points" tname="_graph1" assignNames="a b c d" />
  </graph>
  
  <p>a: <copy tname="a" prop="coords" assignNames="ashadow" /></p>
  <p>b: <copy tname="b" prop="coords" assignNames="bshadow" /></p>
  <p>c: <copy tname="c" prop="coords" assignNames="cshadow" /></p>
  <p>d: <copy tname="d" prop="coords" assignNames="dshadow" /></p>

  <copy prop="x" tname="cl1" assignNames="p q r s" />

  <p>p: <copy tname="p" assignNames="pshadow" /></p>
  <p>q: <copy tname="q" assignNames="qshadow" /></p>
  <p>r: <copy tname="r" assignNames="rshadow" /></p>
  <p>s: <copy tname="s" assignNames="sshadow" /></p>

  <extract prop="x" assignNames="p1 q1 r1 s1" ><copy tname="cl1" /></extract>

  <p>p1: <copy tname="p1" assignNames="p1shadow" /></p>
  <p>q1: <copy tname="q1" assignNames="q1shadow" /></p>
  <p>r1: <copy tname="r1" assignNames="r1shadow" /></p>
  <p>s1: <copy tname="s1" assignNames="s1shadow" /></p>

  <copy prop="xs" tname="cl1" assignNames="x11 x12 x21 x22 x31 x32 x41 x42" />

  <p>x11: <copy tname="x11" assignNames="x11shadow" /></p>
  <p>x12: <copy tname="x12" assignNames="x12shadow" /></p>
  <p>x21: <copy tname="x21" assignNames="x21shadow" /></p>
  <p>x22: <copy tname="x22" assignNames="x22shadow" /></p>
  <p>x31: <copy tname="x31" assignNames="x31shadow" /></p>
  <p>x32: <copy tname="x32" assignNames="x32shadow" /></p>
  <p>x41: <copy tname="x41" assignNames="x41shadow" /></p>
  <p>x42: <copy tname="x42" assignNames="x42shadow" /></p>

  <extract prop="xs" assignNames="y11 y12 y21 y22 y31 y32 y41 y42" ><copy tname="cl1" /></extract>

  <p>y11: <copy tname="y11" assignNames="y11shadow" /></p>
  <p>y12: <copy tname="y12" assignNames="y12shadow" /></p>
  <p>y21: <copy tname="y21" assignNames="y21shadow" /></p>
  <p>y22: <copy tname="y22" assignNames="y22shadow" /></p>
  <p>y31: <copy tname="y31" assignNames="y31shadow" /></p>
  <p>y32: <copy tname="y32" assignNames="y32shadow" /></p>
  <p>y41: <copy tname="y41" assignNames="y41shadow" /></p>
  <p>y42: <copy tname="y42" assignNames="y42shadow" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(0,0)')
    })
    cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,1)')
    })
    cy.get('#\\/cshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,3)')
    })
    cy.get('#\\/dshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,1)')
    })
    cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/q').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/pshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/qshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/rshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/sshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/r1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/s1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/r1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/s1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/y11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/y12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/y21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/y22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/y31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/y32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/y41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/y42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/y11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/y12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/y21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/y22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/y31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#\\/y32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/y41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#\\/y42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(components['/b'].stateValues.xs.map(x => x.tree)).eqls([1, 1]);
      expect(components['/c'].stateValues.xs.map(x => x.tree)).eqls([4, 3]);
      expect(components['/d'].stateValues.xs.map(x => x.tree)).eqls([2, 1]);
    })

    cy.log('Move point a');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/a'].movePoint({ x: 5, y: -5 });

      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })
      cy.get('#\\/cshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,3)')
      })
      cy.get('#\\/dshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1)')
      })
      cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/pshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/qshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/rshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/sshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/r1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/s1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/r1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/s1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/y12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/y21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/y32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/y41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/y42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/y12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/y21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/y32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/y41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/y42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })

    })

    cy.log('Move point b');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/b'].movePoint({ x: 7, y: 8 });

      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,8)')
      })
      cy.get('#\\/cshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,3)')
      })
      cy.get('#\\/dshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1)')
      })
      cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/pshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/qshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/rshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/sshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/s1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/s1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/y12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/y21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/y22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/y31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/y32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/y41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/y42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/y12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/y21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/y22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/y31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/y32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/y41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/y42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })

    })

    cy.log('Move point c');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/c'].movePoint({ x: -3, y: -6 });

      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,8)')
      })
      cy.get('#\\/cshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−6)')
      })
      cy.get('#\\/dshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1)')
      })
      cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/pshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/qshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/rshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/sshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/s1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/s1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/y12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/y21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/y22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/y31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/y32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/y41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/y42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/y11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/y12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/y21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/y22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/y31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/y32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/y41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/y42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })

    })

    cy.log('Move point d');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/d'].movePoint({ x: -9, y: 4 });

      cy.get('#\\/ashadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−5)')
      })
      cy.get('#\\/bshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,8)')
      })
      cy.get('#\\/cshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−6)')
      })
      cy.get('#\\/dshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,4)')
      })
      cy.get('#\\/p').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/s').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/pshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/qshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/rshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/sshadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/s1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/r1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/s1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/y11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/y12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/y21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/y22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/y31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/y32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/y41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/y42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/y11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/y12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/y21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      })
      cy.get('#\\/y22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('8')
      })
      cy.get('#\\/y31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/y32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/y41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/y42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })

    })
  })

  it('name points off a dynamic graph', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>Number for first set of points: <mathinput name="n1" /></p>
  <p>Number for second set of points: <mathinput name="n2" /></p>
  <graph>
    <map>
      <template>
        <point>
          ($n+<math>0</math>,
          $i+<math>0</math>)
        </point>
      </template>
      <sources alias="n" indexAlias="i">
        <sequence from="2" length="$n1" />
      </sources>
    </map>
    <map>
      <template>
        <point>
          (-$n+<math>0</math>,
          -$i+<math>0</math>)
        </point>
      </template>
      <sources alias="n" indexAlias="i">
        <sequence from="2" length="$n2" />
      </sources>
    </map>
  </graph>


  <collect name="allpoints" componentTypes="point" tname="_graph1" assignNames="p1 p2 p3 p4"/>

  <p>p1: <copy tname="p1" prop="coords" assignNames="p1shadow" /></p>
  <p>p2: <copy tname="p2" prop="coords" assignNames="p2shadow" /></p>
  <p>p3: <copy tname="p3" prop="coords" assignNames="p3shadow" /></p>
  <p>p4: <copy tname="p4" prop="coords" assignNames="p4shadow" /></p>

  <copy name="allpoints2" tname="allpoints" assignNames="q1 q2 q3 q4 q5 q6"/>

  <p>q1: <copy tname="q1" prop="coords" assignNames="q1shadow" /></p>
  <p>q2: <copy tname="q2" prop="coords" assignNames="q2shadow" /></p>
  <p>q3: <copy tname="q3" prop="coords" assignNames="q3shadow" /></p>
  <p>q4: <copy tname="q4" prop="coords" assignNames="q4shadow" /></p>
  <p>q5: <copy tname="q5" prop="coords" assignNames="q5shadow" /></p>
  <p>q6: <copy tname="q6" prop="coords" assignNames="q6shadow" /></p>

  <collect name="allxs1" componentTypes="point" prop="x" tname="_graph1" assignNames="x11 x12 x13 x14 x15 x16" />

  <p>x11: <copy tname="x11" assignNames="x11shadow" /></p>
  <p>x12: <copy tname="x12" assignNames="x12shadow" /></p>
  <p>x13: <copy tname="x13" assignNames="x13shadow" /></p>
  <p>x14: <copy tname="x14" assignNames="x14shadow" /></p>
  <p>x15: <copy tname="x15" assignNames="x15shadow" /></p>
  <p>x16: <copy tname="x16" assignNames="x16shadow" /></p>

  <copy name="allxs2" tname="allxs1" assignNames="x21 x22 x23 x24"/>

  <p>x21: <copy tname="x21" assignNames="x21shadow" /></p>
  <p>x22: <copy tname="x22" assignNames="x22shadow" /></p>
  <p>x23: <copy tname="x23" assignNames="x23shadow" /></p>
  <p>x24: <copy tname="x24" assignNames="x24shadow" /></p>

  <copy name="allxs3" prop="x" tname="allpoints" assignNames="x31 x32 x33 x34" />

  <p>x31: <copy tname="x31" assignNames="x31shadow" /></p>
  <p>x32: <copy tname="x32" assignNames="x32shadow" /></p>
  <p>x33: <copy tname="x33" assignNames="x33shadow" /></p>
  <p>x34: <copy tname="x34" assignNames="x34shadow" /></p>

  <copy name="allxs4" prop="x" tname="allpoints2" assignNames="x41 x42 x43 x44" />

  <p>x41: <copy tname="x41" assignNames="x41shadow" /></p>
  <p>x42: <copy tname="x42" assignNames="x42shadow" /></p>
  <p>x43: <copy tname="x43" assignNames="x43shadow" /></p>
  <p>x44: <copy tname="x44" assignNames="x44shadow" /></p>

  <extract name="allxs5" prop="x" assignNames="x51 x52 x53 x54 x55 x56"><copy tname="allpoints" /></extract>

  <p>x51: <copy tname="x51" assignNames="x51shadow" /></p>
  <p>x52: <copy tname="x52" assignNames="x52shadow" /></p>
  <p>x53: <copy tname="x53" assignNames="x53shadow" /></p>
  <p>x54: <copy tname="x54" assignNames="x54shadow" /></p>
  <p>x55: <copy tname="x55" assignNames="x55shadow" /></p>
  <p>x56: <copy tname="x56" assignNames="x56shadow" /></p>


  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/p1').should('not.exist');
    cy.get('#\\/p2').should('not.exist');
    cy.get('#\\/p3').should('not.exist');
    cy.get('#\\/p4').should('not.exist');

    cy.get('#\\/p1shadow').should('not.exist');
    cy.get('#\\/p2shadow').should('not.exist');
    cy.get('#\\/p3shadow').should('not.exist');
    cy.get('#\\/p4shadow').should('not.exist');

    cy.get('#\\/q1').should('not.exist');
    cy.get('#\\/q2').should('not.exist');
    cy.get('#\\/q3').should('not.exist');
    cy.get('#\\/q4').should('not.exist');
    cy.get('#\\/q5').should('not.exist');
    cy.get('#\\/q6').should('not.exist');

    cy.get('#\\/q1shadow').should('not.exist');
    cy.get('#\\/q2shadow').should('not.exist');
    cy.get('#\\/q3shadow').should('not.exist');
    cy.get('#\\/q4shadow').should('not.exist');
    cy.get('#\\/q5shadow').should('not.exist');
    cy.get('#\\/q6shadow').should('not.exist');

    cy.get('#\\/x11').should('not.exist');
    cy.get('#\\/x12').should('not.exist');
    cy.get('#\\/x13').should('not.exist');
    cy.get('#\\/x14').should('not.exist');
    cy.get('#\\/x15').should('not.exist');
    cy.get('#\\/x16').should('not.exist');

    cy.get('#\\/x11shadow').should('not.exist');
    cy.get('#\\/x12shadow').should('not.exist');
    cy.get('#\\/x13shadow').should('not.exist');
    cy.get('#\\/x14shadow').should('not.exist');
    cy.get('#\\/x15shadow').should('not.exist');
    cy.get('#\\/x16shadow').should('not.exist');

    cy.get('#\\/x21').should('not.exist');
    cy.get('#\\/x22').should('not.exist');
    cy.get('#\\/x23').should('not.exist');
    cy.get('#\\/x24').should('not.exist');

    cy.get('#\\/x21shadow').should('not.exist');
    cy.get('#\\/x22shadow').should('not.exist');
    cy.get('#\\/x23shadow').should('not.exist');
    cy.get('#\\/x24shadow').should('not.exist');

    cy.get('#\\/x31').should('not.exist');
    cy.get('#\\/x32').should('not.exist');
    cy.get('#\\/x33').should('not.exist');
    cy.get('#\\/x34').should('not.exist');

    cy.get('#\\/x31shadow').should('not.exist');
    cy.get('#\\/x32shadow').should('not.exist');
    cy.get('#\\/x33shadow').should('not.exist');
    cy.get('#\\/x34shadow').should('not.exist');

    cy.get('#\\/x41').should('not.exist');
    cy.get('#\\/x42').should('not.exist');
    cy.get('#\\/x43').should('not.exist');
    cy.get('#\\/x44').should('not.exist');

    cy.get('#\\/x41shadow').should('not.exist');
    cy.get('#\\/x42shadow').should('not.exist');
    cy.get('#\\/x43shadow').should('not.exist');
    cy.get('#\\/x44shadow').should('not.exist');

    cy.get('#\\/x51').should('not.exist');
    cy.get('#\\/x52').should('not.exist');
    cy.get('#\\/x53').should('not.exist');
    cy.get('#\\/x54').should('not.exist');
    cy.get('#\\/x55').should('not.exist');
    cy.get('#\\/x56').should('not.exist');

    cy.get('#\\/x51shadow').should('not.exist');
    cy.get('#\\/x52shadow').should('not.exist');
    cy.get('#\\/x53shadow').should('not.exist');
    cy.get('#\\/x54shadow').should('not.exist');
    cy.get('#\\/x55shadow').should('not.exist');
    cy.get('#\\/x56shadow').should('not.exist');


    cy.log('Create 1 and 2 points');
    cy.get('#\\/n1 textarea').type('{end}{backspace}1{enter}', { force: true })
    cy.get('#\\/n2 textarea').type('{end}{backspace}2{enter}', { force: true })

    // add window just so can collapse section
    cy.window().then(() => {

      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−1)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−2)')
      })
      cy.get('#\\/p4').should('not.exist');

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−1)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−2)')
      })
      cy.get('#\\/p4shadow').should('not.exist');

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−1)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−2)')
      })
      cy.get('#\\/q4').should('not.exist');
      cy.get('#\\/q5').should('not.exist');
      cy.get('#\\/q6').should('not.exist');

      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−1)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−2)')
      })
      cy.get('#\\/q4shadow').should('not.exist');
      cy.get('#\\/q5shadow').should('not.exist');
      cy.get('#\\/q6shadow').should('not.exist');

      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x14').should('not.exist');
      cy.get('#\\/x15').should('not.exist');
      cy.get('#\\/x16').should('not.exist');

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x14shadow').should('not.exist');
      cy.get('#\\/x15shadow').should('not.exist');
      cy.get('#\\/x16shadow').should('not.exist');

      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x24').should('not.exist');

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x24shadow').should('not.exist');

      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x34').should('not.exist');

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x34shadow').should('not.exist');

      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x44').should('not.exist');

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x44shadow').should('not.exist');

      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x54').should('not.exist');
      cy.get('#\\/x55').should('not.exist');
      cy.get('#\\/x56').should('not.exist');

      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x54shadow').should('not.exist');
      cy.get('#\\/x55shadow').should('not.exist');
      cy.get('#\\/x56shadow').should('not.exist');
    })

    cy.log('Move point all three points');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/p1'].movePoint({ x: 1, y: 2 });
      await components['/p2'].movePoint({ x: 3, y: 4 });
      await components['/p3'].movePoint({ x: 5, y: 6 });


      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      })
      cy.get('#\\/p4').should('not.exist');

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      })
      cy.get('#\\/p4shadow').should('not.exist');

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      })
      cy.get('#\\/q4').should('not.exist');
      cy.get('#\\/q5').should('not.exist');
      cy.get('#\\/q6').should('not.exist');

      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      })
      cy.get('#\\/q4shadow').should('not.exist');
      cy.get('#\\/q5shadow').should('not.exist');
      cy.get('#\\/q6shadow').should('not.exist');

      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x14').should('not.exist');
      cy.get('#\\/x15').should('not.exist');
      cy.get('#\\/x16').should('not.exist');

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x14shadow').should('not.exist');
      cy.get('#\\/x15shadow').should('not.exist');
      cy.get('#\\/x16shadow').should('not.exist');

      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x24').should('not.exist');

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x24shadow').should('not.exist');

      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x34').should('not.exist');

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x34shadow').should('not.exist');

      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x44').should('not.exist');

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x44shadow').should('not.exist');

      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x54').should('not.exist');
      cy.get('#\\/x55').should('not.exist');
      cy.get('#\\/x56').should('not.exist');

      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x54shadow').should('not.exist');
      cy.get('#\\/x55shadow').should('not.exist');
      cy.get('#\\/x56shadow').should('not.exist');


    })


    cy.log('2 and 4 points');
    cy.get('#\\/n1 textarea').type('{end}{backspace}2{enter}', { force: true })
    cy.get('#\\/n2 textarea').type('{end}{backspace}4{enter}', { force: true })

    cy.window().then(() => {

      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,2)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      })

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,2)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/p4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      })

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,2)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/q4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      })
      cy.get('#\\/q5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−3)')
      })
      cy.get('#\\/q6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,−4)')
      })

      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,2)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/q4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,6)')
      })
      cy.get('#\\/q5shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−3)')
      })
      cy.get('#\\/q6shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,−4)')
      })


      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x16').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x14shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x15shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x16shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })


      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x24').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x24shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x34').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x34shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x44').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x44shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x54').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x55').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x56').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })

      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x54shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x55shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x56shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
    })

    cy.log('Move point all six points');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/q1'].movePoint({ x: -1, y: -9 });
      await components['/q2'].movePoint({ x: -2, y: -8 });
      await components['/q3'].movePoint({ x: -3, y: -7 });
      await components['/q4'].movePoint({ x: -4, y: -6 });
      await components['/q5'].movePoint({ x: -5, y: -5 });
      await components['/q6'].movePoint({ x: -6, y: -4 });


      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−9)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−8)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      })
      cy.get('#\\/p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−6)')
      })

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−9)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−8)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      })
      cy.get('#\\/p4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−6)')
      })

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−9)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−8)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      })
      cy.get('#\\/q4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−6)')
      })
      cy.get('#\\/q5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,−5)')
      })
      cy.get('#\\/q6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,−4)')
      })

      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−9)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−8)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      })
      cy.get('#\\/q4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−6)')
      })
      cy.get('#\\/q5shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,−5)')
      })
      cy.get('#\\/q6shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,−4)')
      })


      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x16').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x14shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x15shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x16shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })


      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x24').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x24shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })

      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x34').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x34shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })

      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x44').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x44shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })

      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x54').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x55').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x56').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })

      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x54shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x55shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x56shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
    })

    cy.log('Down to 1 and 3 points');
    cy.get('#\\/n1 textarea').type('{end}{backspace}1{enter}', { force: true })
    cy.get('#\\/n2 textarea').type('{end}{backspace}3{enter}', { force: true })

    cy.window().then((win) => {

      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−9)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−6)')
      })
      cy.get('#\\/p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,−5)')
      })

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−9)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−6)')
      })
      cy.get('#\\/p4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,−5)')
      })

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−9)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−6)')
      })
      cy.get('#\\/q4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,−5)')
      })
      cy.get('#\\/q5').should('not.exist')
      cy.get('#\\/q6').should('not.exist')


      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,−9)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,−7)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,−6)')
      })
      cy.get('#\\/q4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,−5)')
      })
      cy.get('#\\/q5shadow').should('not.exist')
      cy.get('#\\/q6shadow').should('not.exist')



      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x15').should('not.exist')
      cy.get('#\\/x16').should('not.exist')

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x14shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x15shadow').should('not.exist')
      cy.get('#\\/x16shadow').should('not.exist')



      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x24').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x24shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })


      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x34').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x34shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })


      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x44').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x44shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })


      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x54').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x55').should('not.exist')
      cy.get('#\\/x56').should('not.exist')

      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−1')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−3')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x54shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x55shadow').should('not.exist')
      cy.get('#\\/x56shadow').should('not.exist')

    })

    cy.log('Move point all four points');

    cy.window().then(async (win) => {

      let components = Object.assign({}, win.state.components);
      await components['/p1'].movePoint({ x: 4, y: -5 });
      await components['/p2'].movePoint({ x: 3, y: -6 });
      await components['/p3'].movePoint({ x: 2, y: -7 });
      await components['/p4'].movePoint({ x: 1, y: -8 });


      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−5)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,−6)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,−7)')
      })
      cy.get('#\\/p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−5)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,−6)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,−7)')
      })
      cy.get('#\\/p4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−5)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,−6)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,−7)')
      })
      cy.get('#\\/q4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })
      cy.get('#\\/q5').should('not.exist')
      cy.get('#\\/q6').should('not.exist')


      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−5)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,−6)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,−7)')
      })
      cy.get('#\\/q4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })
      cy.get('#\\/q5shadow').should('not.exist')
      cy.get('#\\/q6shadow').should('not.exist')



      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x15').should('not.exist')
      cy.get('#\\/x16').should('not.exist')

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x14shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x15shadow').should('not.exist')
      cy.get('#\\/x16shadow').should('not.exist')



      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x24').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x24shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })


      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x34').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x34shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })


      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x44').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x44shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })


      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x54').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x55').should('not.exist')
      cy.get('#\\/x56').should('not.exist')

      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
      cy.get('#\\/x54shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x55shadow').should('not.exist')
      cy.get('#\\/x56shadow').should('not.exist')

    })

    cy.log('4 and 2 points, remembers old 2nd value');
    cy.get('#\\/n1 textarea').type('{end}{backspace}4{enter}', { force: true })
    cy.get('#\\/n2 textarea').type('{end}{backspace}2{enter}', { force: true })

    cy.window().then((win) => {

      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−5)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−8)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,3)')
      })
      cy.get('#\\/p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,4)')
      })

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−5)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−8)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,3)')
      })
      cy.get('#\\/p4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,4)')
      })

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−5)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−8)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,3)')
      })
      cy.get('#\\/q4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,4)')
      })
      cy.get('#\\/q5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,−6)')
      })
      cy.get('#\\/q6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,−7)')
      })

      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−5)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,−8)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,3)')
      })
      cy.get('#\\/q4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,4)')
      })
      cy.get('#\\/q5shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,−6)')
      })
      cy.get('#\\/q6shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,−7)')
      })


      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x16').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x14shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x15shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x16shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })


      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x24').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x24shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })


      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x34').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x34shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })


      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x44').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x44shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })



      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x44').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x44shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })



      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x54').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x55').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x56').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })


      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−2')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      })
      cy.get('#\\/x54shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5')
      })
      cy.get('#\\/x55shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      })
      cy.get('#\\/x56shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      })
    })

    cy.log('Move point all six points again');

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/q1'].movePoint({ x: -4, y: 6 });
      await components['/q2'].movePoint({ x: -5, y: 5 });
      await components['/q3'].movePoint({ x: -6, y: 4 });
      await components['/q4'].movePoint({ x: -7, y: 3 });
      await components['/q5'].movePoint({ x: -8, y: 2 });
      await components['/q6'].movePoint({ x: -9, y: 1 });


      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,6)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,5)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,4)')
      })
      cy.get('#\\/p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−7,3)')
      })

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,6)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,5)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,4)')
      })
      cy.get('#\\/p4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−7,3)')
      })

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,6)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,5)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,4)')
      })
      cy.get('#\\/q4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−7,3)')
      })
      cy.get('#\\/q5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })
      cy.get('#\\/q6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,1)')
      })

      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,6)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,5)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,4)')
      })
      cy.get('#\\/q4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−7,3)')
      })
      cy.get('#\\/q5shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })
      cy.get('#\\/q6shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,1)')
      })


      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })
      cy.get('#\\/x15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x16').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x14shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })
      cy.get('#\\/x15shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x16shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })


      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x24').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x24shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })


      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x34').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x34shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })


      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x44').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x44shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })


      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x54').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })
      cy.get('#\\/x55').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x56').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })


      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x54shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7')
      })
      cy.get('#\\/x55shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x56shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
    })

    cy.log('0 and 3 points, remembers old 3rd value');
    cy.get('#\\/n1 textarea').type('{end}{backspace}0{enter}', { force: true })
    cy.get('#\\/n2 textarea').type('{end}{backspace}3{enter}', { force: true })

    cy.window().then((win) => {

      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,1)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })
      cy.get('#\\/p4').should('not.exist')


      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,1)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })
      cy.get('#\\/p4shadow').should('not.exist')


      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,1)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })
      cy.get('#\\/q4').should('not.exist')
      cy.get('#\\/q5').should('not.exist')
      cy.get('#\\/q6').should('not.exist')


      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,1)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })
      cy.get('#\\/q4shadow').should('not.exist')
      cy.get('#\\/q5shadow').should('not.exist')
      cy.get('#\\/q6shadow').should('not.exist')


      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x14').should('not.exist')
      cy.get('#\\/x15').should('not.exist')
      cy.get('#\\/x16').should('not.exist')


      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x14shadow').should('not.exist')
      cy.get('#\\/x15shadow').should('not.exist')
      cy.get('#\\/x16shadow').should('not.exist')


      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x24').should('not.exist')


      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x24shadow').should('not.exist')



      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x34').should('not.exist')


      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x34shadow').should('not.exist')



      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x44').should('not.exist')


      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x44shadow').should('not.exist')



      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x44').should('not.exist')
      cy.get('#\\/x45').should('not.exist')
      cy.get('#\\/x46').should('not.exist')


      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
      cy.get('#\\/x44shadow').should('not.exist')
      cy.get('#\\/x45shadow').should('not.exist')
      cy.get('#\\/x46shadow').should('not.exist')


    })

    cy.log('3 and 3 points');
    cy.get('#\\/n1 textarea').type('{end}{backspace}3{enter}', { force: true })

    cy.window().then((win) => {

      cy.get('#\\/p1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,6)')
      })
      cy.get('#\\/p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,5)')
      })
      cy.get('#\\/p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,4)')
      })
      cy.get('#\\/p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })

      cy.get('#\\/p1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,6)')
      })
      cy.get('#\\/p2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,5)')
      })
      cy.get('#\\/p3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,4)')
      })
      cy.get('#\\/p4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })

      cy.get('#\\/q1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,6)')
      })
      cy.get('#\\/q2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,5)')
      })
      cy.get('#\\/q3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,4)')
      })
      cy.get('#\\/q4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })
      cy.get('#\\/q5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,1)')
      })
      cy.get('#\\/q6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })

      cy.get('#\\/q1shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,6)')
      })
      cy.get('#\\/q2shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,5)')
      })
      cy.get('#\\/q3shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−6,4)')
      })
      cy.get('#\\/q4shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,2)')
      })
      cy.get('#\\/q5shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,1)')
      })
      cy.get('#\\/q6shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−8)')
      })

      cy.get('#\\/x11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x16').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })

      cy.get('#\\/x11shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x12shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x13shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x14shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x15shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x16shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })


      cy.get('#\\/x21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x24').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })

      cy.get('#\\/x21shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x22shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x23shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x24shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })


      cy.get('#\\/x31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x34').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })

      cy.get('#\\/x31shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x32shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x33shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x34shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })


      cy.get('#\\/x41').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x42').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x43').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x44').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })

      cy.get('#\\/x41shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x42shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x43shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x44shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })


      cy.get('#\\/x51').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x52').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x53').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x54').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x55').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x56').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })


      cy.get('#\\/x51shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−4')
      })
      cy.get('#\\/x52shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−5')
      })
      cy.get('#\\/x53shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−6')
      })
      cy.get('#\\/x54shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8')
      })
      cy.get('#\\/x55shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9')
      })
      cy.get('#\\/x56shadow').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      })
    })


  })

  it('name points off a dynamic list with changing dimensions', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <section name="originals"><title>The originals</title>

    <p>Number for first set of points: <mathinput name="n1" /></p>
    <p>Number for second set of points: <mathinput name="n2" /></p>
    <p>Number of dimensions 1: <mathinput name="nd1" prefill="2"/></p>
    <p>Number of dimensions 2: <mathinput name="nd2" prefill="3"/></p>
    <map assignNames="pa1 pa2 pa3">
      <template newNamespace>
        <map hide>
          <template>
            <math>$b$a + <math>0</math></math>
          </template>
          <sources alias="a">
            <sequence length="$(../nd1)" />
          </sources>
        </map>
        <point xs="$_map1" />
      </template>
      <sources alias="b">
        <sequence length="$n1" />
      </sources>
    </map>
    <map assignNames="pb1 pb2 pb3">
      <template newNamespace>
        <map>
          <template>
            <math>-$b$a + <math>0</math></math>
          </template>
          <sources alias="a">
            <sequence length="$(../nd2)" />
          </sources>
        </map>
        <point xs="$_map1" />
      </template>
      <sources alias="b">
        <sequence length="$n2" />
      </sources>
    </map>
  </section>

  <collect name="allpoints" componentTypes="point" tname="originals" assignNames="p1 p2 p3 p4"/>

  <p>p1: <copy tname="p1" prop="coords" assignNames="p1shadow" /></p>
  <p>p2: <copy tname="p2" prop="coords" assignNames="p2shadow" /></p>
  <p>p3: <copy tname="p3" prop="coords" assignNames="p3shadow" /></p>
  <p>p4: <copy tname="p4" prop="coords" assignNames="p4shadow" /></p>

  <copy name="allpoints2" tname="allpoints" assignNames="q1 q2 q3 q4 q5 q6"/>

  <p>q1: <copy tname="q1" prop="coords" assignNames="q1shadow" /></p>
  <p>q2: <copy tname="q2" prop="coords" assignNames="q2shadow" /></p>
  <p>q3: <copy tname="q3" prop="coords" assignNames="q3shadow" /></p>
  <p>q4: <copy tname="q4" prop="coords" assignNames="q4shadow" /></p>
  <p>q5: <copy tname="q5" prop="coords" assignNames="q5shadow" /></p>
  <p>q6: <copy tname="q6" prop="coords" assignNames="q6shadow" /></p>

  <collect name="allxs1" componentTypes="point" prop="xs" tname="originals" assignNames="xs11 xs12 xs13 xs14 xs15 xs16 xs17 xs18" />

  <p>xs11: <copy tname="xs11" assignNames="xs11shadow" /></p>
  <p>xs12: <copy tname="xs12" assignNames="xs12shadow" /></p>
  <p>xs13: <copy tname="xs13" assignNames="xs13shadow" /></p>
  <p>xs14: <copy tname="xs14" assignNames="xs14shadow" /></p>
  <p>xs15: <copy tname="xs15" assignNames="xs15shadow" /></p>
  <p>xs16: <copy tname="xs16" assignNames="xs16shadow" /></p>
  <p>xs17: <copy tname="xs17" assignNames="xs17shadow" /></p>
  <p>xs18: <copy tname="xs18" assignNames="xs18shadow" /></p>

  <copy name="allxs2" tname="allxs1" assignNames="xs21 xs22 xs23 xs24 xs25 xs26"/>

  <p>xs21: <copy tname="xs21" assignNames="xs21shadow" /></p>
  <p>xs22: <copy tname="xs22" assignNames="xs22shadow" /></p>
  <p>xs23: <copy tname="xs23" assignNames="xs23shadow" /></p>
  <p>xs24: <copy tname="xs24" assignNames="xs24shadow" /></p>
  <p>xs25: <copy tname="xs25" assignNames="xs25shadow" /></p>
  <p>xs26: <copy tname="xs26" assignNames="xs26shadow" /></p>

  <copy name="allxs3" prop="xs" tname="allpoints" assignNames="xs31 xs32 xs33 xs34 xs35 xs36" />

  <p>xs31: <copy tname="xs31" assignNames="xs31shadow" /></p>
  <p>xs32: <copy tname="xs32" assignNames="xs32shadow" /></p>
  <p>xs33: <copy tname="xs33" assignNames="xs33shadow" /></p>
  <p>xs34: <copy tname="xs34" assignNames="xs34shadow" /></p>
  <p>xs35: <copy tname="xs35" assignNames="xs35shadow" /></p>
  <p>xs36: <copy tname="xs36" assignNames="xs36shadow" /></p>

  <copy name="allxs4" prop="xs" tname="allpoints2" assignNames="xs41 xs42 xs43 xs44 xs45 xs46" />

  <p>xs41: <copy tname="xs41" assignNames="xs41shadow" /></p>
  <p>xs42: <copy tname="xs42" assignNames="xs42shadow" /></p>
  <p>xs43: <copy tname="xs43" assignNames="xs43shadow" /></p>
  <p>xs44: <copy tname="xs44" assignNames="xs44shadow" /></p>
  <p>xs45: <copy tname="xs45" assignNames="xs45shadow" /></p>
  <p>xs46: <copy tname="xs46" assignNames="xs46shadow" /></p>

  <extract name="allxs5" prop="xs" assignNames="xs51 xs52 xs53 xs54 xs55 xs56 xs57 xs58"><copy tname="allpoints" /></extract>

  <p>xs51: <copy tname="xs51" assignNames="xs51shadow" /></p>
  <p>xs52: <copy tname="xs52" assignNames="xs52shadow" /></p>
  <p>xs53: <copy tname="xs53" assignNames="xs53shadow" /></p>
  <p>xs54: <copy tname="xs54" assignNames="xs54shadow" /></p>
  <p>xs55: <copy tname="xs55" assignNames="xs55shadow" /></p>
  <p>xs56: <copy tname="xs56" assignNames="xs56shadow" /></p>
  <p>xs57: <copy tname="xs57" assignNames="xs57shadow" /></p>
  <p>xs58: <copy tname="xs58" assignNames="xs58shadow" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    function checkValues(points1, points2) {

      function pointToString(point) {
        if (!Array.isArray(point)) {
          point = [point]
        }
        let s = point.map(x => x < 0 ? `−${Math.abs(x)}` : String(x)).join(',');
        if (point.length > 1) {
          s = `(${s})`
        }
        return s;
      }

      let allPoints = [...points1, ...points2];

      let allXs = flattenDeep(allPoints);

      for (let ind = 0; ind < 3; ind++) {

        let pointa = points1[ind];
        if (pointa) {
          cy.get(`#\\/pa${ind + 1}\\/_point1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(pointa))
          })
        } else {
          cy.get(`#\\/pa${ind + 1}\\/_point1`).should('not.exist')
        }

        let pointb = points2[ind];
        if (pointb) {
          cy.get(`#\\/pb${ind + 1}\\/_point1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(pointb))
          })
        } else {
          cy.get(`#\\/pb${ind + 1}\\/_point1`).should('not.exist')
        }
      }

      for (let ind = 0; ind < 4; ind++) {
        let point = allPoints[ind];
        if (point) {
          cy.get(`#\\/p${ind + 1}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(point))
          })
          cy.get(`#\\/p${ind + 1}shadow`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(point))
          })
        } else {
          cy.get(`#\\/p${ind + 1}`).should('not.exist')
          cy.get(`#\\/p${ind + 1}shadow`).should('not.exist')
        }
      }

      for (let ind = 0; ind < 6; ind++) {
        let point = allPoints[ind];
        if (point) {
          cy.get(`#\\/q${ind + 1}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(point))
          })
          cy.get(`#\\/q${ind + 1}shadow`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(point))
          })
        } else {
          cy.get(`#\\/q${ind + 1}`).should('not.exist')
          cy.get(`#\\/q${ind + 1}shadow`).should('not.exist')
        }
      }

      for (let ind = 0; ind < 8; ind++) {
        let theX = allXs[ind];
        if (theX !== undefined) {
          cy.get(`#\\/xs1${ind + 1}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
          cy.get(`#\\/xs1${ind + 1}shadow`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
          cy.get(`#\\/xs5${ind + 1}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
          cy.get(`#\\/xs5${ind + 1}shadow`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
        } else {
          cy.get(`#\\/xs1${ind + 1}`).should('not.exist')
          cy.get(`#\\/xs1${ind + 1}shadow`).should('not.exist')
          cy.get(`#\\/xs5${ind + 1}`).should('not.exist')
          cy.get(`#\\/xs5${ind + 1}shadow`).should('not.exist')
        }
      }

      for (let ind = 0; ind < 6; ind++) {
        let theX = allXs[ind];
        if (theX !== undefined) {
          cy.get(`#\\/xs2${ind + 1}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
          cy.get(`#\\/xs2${ind + 1}shadow`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
          cy.get(`#\\/xs3${ind + 1}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
          cy.get(`#\\/xs3${ind + 1}shadow`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
          cy.get(`#\\/xs4${ind + 1}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
          cy.get(`#\\/xs4${ind + 1}shadow`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(pointToString(theX))
          })
        } else {
          cy.get(`#\\/xs2${ind + 1}`).should('not.exist')
          cy.get(`#\\/xs2${ind + 1}shadow`).should('not.exist')
          cy.get(`#\\/xs3${ind + 1}`).should('not.exist')
          cy.get(`#\\/xs3${ind + 1}shadow`).should('not.exist')
          cy.get(`#\\/xs4${ind + 1}`).should('not.exist')
          cy.get(`#\\/xs4${ind + 1}shadow`).should('not.exist')
        }
      }
    }


    let points1 = [], points2 = [];

    checkValues(points1, points2)

    cy.log('Create 1 and 2 points');
    cy.get('#\\/n1 textarea').type('{end}{backspace}1{enter}', { force: true })
    cy.get('#\\/n2 textarea').type('{end}{backspace}2{enter}', { force: true })

    points1 = [[1, 2]];
    points2 = [[-1, -2, -3], [-2, -4, -6]];

    checkValues(points1, points2)


    // move points
    cy.log('Move points');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/pa1/_point1'].movePoint({ x: 3, y: 9 });
      await components['/pb1/_point1'].movePoint({ x: -6, y: -5, z: 4 });
      await components['/pb2/_point1'].movePoint({ x: 8, y: 0, z: 7 });

      points1 = [[3, 9]];
      points2 = [[-6, -5, 4], [8, 0, 7]];

      checkValues(points1, points2)

    })

    cy.log('Change dimensions to 3 and 2');
    cy.get('#\\/nd1 textarea').type('{end}{backspace}3{enter}', { force: true })
    cy.get('#\\/nd2 textarea').type('{end}{backspace}2{enter}', { force: true })


    points1 = [[3, 9, 3]];
    points2 = [[-6, -5], [8, 0]];

    checkValues(points1, points2)

    cy.log('Move points');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/pa1/_point1'].movePoint({ x: -1, y: 7, z: -9 });
      await components['/pb1/_point1'].movePoint({ x: 5, y: 4 });
      await components['/pb2/_point1'].movePoint({ x: 3, y: 2 });

      points1 = [[-1, 7, -9]];
      points2 = [[5, 4], [3, 2]];

      checkValues(points1, points2)

    })


    cy.log('Change to 2 and 1 points');
    cy.get('#\\/n1 textarea').type('{end}{backspace}2{enter}', { force: true })
    cy.get('#\\/n2 textarea').type('{end}{backspace}1{enter}', { force: true })

    points1 = [[-1, 7, -9], [2, 4, 6]];
    points2 = [[5, 4]];

    checkValues(points1, points2)


    cy.log('Move points');
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/pa1/_point1'].movePoint({ x: 9, y: -8, z: 7 });
      await components['/pa2/_point1'].movePoint({ x: -6, y: 5, z: -4 });
      await components['/pb1/_point1'].movePoint({ x: 3, y: -2 });

      points1 = [[9, -8, 7], [-6, 5, -4]];
      points2 = [[3, -2]];

      checkValues(points1, points2)

    })


    cy.log('Change dimensions to 2 and 1');
    cy.get('#\\/nd1 textarea').type('{end}{backspace}2{enter}', { force: true })
    cy.get('#\\/nd2 textarea').type('{end}{backspace}1{enter}', { force: true })

    points1 = [[9, -8], [-6, 5]];
    points2 = [[3]];

    checkValues(points1, points2)


    cy.log('Change to 1 and 3 points');
    cy.get('#\\/n1 textarea').type('{end}{backspace}1{enter}', { force: true })
    cy.get('#\\/n2 textarea').type('{end}{backspace}3{enter}', { force: true })

    points1 = [[9, -8]];
    points2 = [[3], [3], [-3]];

    checkValues(points1, points2)


  })


  // collect points and lines, once decide how should recurse

});
