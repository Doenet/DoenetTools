import me from 'math-expressions';
import cssesc from 'cssesc';
import { isStrictMode } from 'react-is';
import { isStyledComponent } from 'styled-components';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Math Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('sum', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <sum name="numbers"><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></sum>
      <sum name="withNumberSum"><math>3</math><sum><number>17</number><number>5-4</number></sum></sum>
      <sum name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3+17+1')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3+17+1')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('62+17+1')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get('#\\/withNumberSum').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+x+y+x+y+z')
      });
      cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+2y+z')
      });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('21')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+x+y+x+y+z')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(21);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['+', 3, 17, 1]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(21);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(21);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['+', 3, 17, 1]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(21);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['+', ['/', 6, 2], 17, 1]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(21);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(21);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberSum'].stateValues.value.tree).eq(21);
        expect(components['/withNumberSum'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberSum'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['+', 'x', 'x', 'y', 'x', 'y', 'z']);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsSimplify'].stateValues.value.tree).eqls(['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z']);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).eq(21);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        expect(replacement2.stateValues.value.tree).eqls(['+', 'x', 'x', 'y', 'x', 'y', 'z']);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })
  })

  it('sum with sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <sum name="numbers"><number>3</number><number>17</number><number>5-4</number></sum>
      <sum name="numbersAsString">3 17 1</sum>
      <sum name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</sum>
      <sum name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</sum>
      <sum name="numericAsString">6/2 17 5-4</sum>
      <sum name="numericAsStringSimplify" simplify>6/2 17 5-4</sum>
      <sum name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</sum>
      <sum name="numbersAsMacros">$a$b$c</sum>
      <sum name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</sum>
      <sum name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</sum>
      <sum name="numbersAsMacros2">$a $b $c</sum>
      <sum name="withNumberMathMacro">$aNumberMath$b$c</sum>
      <sum name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</sum>
      <sum name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</sum>
      <sum name="withNumericMathMacro">$aNumericMath$b$c</sum>
      <sum name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</sum>
      <sum name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</sum>
      <sum name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></sum>
      <sum name="varsAsString">x x+y x+y+z</sum>
      <sum name="varsAsStringSimplify" simplify>x x+y x+y+z</sum>
      <sum name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</sum>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numbersAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numbersAsStringForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3+17+1')
    });
    cy.get('#\\/numbersAsStringForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numericAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62+17+5−4')
    });
    cy.get('#\\/numericAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numericAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numbersAsMacros').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3+17+1')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numbersAsMacros2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/withNumberMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3+17+1')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/withNumericMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62+17+1')
    });
    cy.get('#\\/withNumericMathMacroSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/withNumericMathMacroForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x+y+x+y+z')
    });
    cy.get('#\\/varsAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x+y+x+y+z')
    });
    cy.get('#\\/varsAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x+2y+z')
    });
    cy.get('#\\/varsAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(21);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsString'].stateValues.value.tree).eq(21);
        expect(components['/numbersAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsString'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.value.tree).eqls(['+', 3, 17, 1]);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.value.tree).eq(21);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsString'].stateValues.value.tree).eqls(['+', ['/', 6, 2], 17, 5, ['-', 4]]);
        expect(components['/numericAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsString'].stateValues.isNumber).eq(false);
        expect(components['/numericAsStringSimplify'].stateValues.value.tree).eq(21);
        expect(components['/numericAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringForceNumeric'].stateValues.value.tree).eq(21);
        expect(components['/numericAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros'].stateValues.value.tree).eq(21);
        expect(components['/numbersAsMacros'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eqls(['+', 3, 17, 1]);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.value.tree).eq(21);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros2'].stateValues.value.tree).eq(21);
        expect(components['/numbersAsMacros2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros2'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacro'].stateValues.value.tree).eq(21);
        expect(components['/withNumberMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacro'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eqls(['+', 3, 17, 1]);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.value.tree).eq(21);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacro'].stateValues.value.tree).eqls(['+', ['/', 6, 2], 17, 1]);
        expect(components['/withNumericMathMacro'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacro'].stateValues.isNumber).eq(false);
        expect(components['/withNumericMathMacroSimplify'].stateValues.value.tree).eq(21);
        expect(components['/withNumericMathMacroSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacroSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.value.tree).eq(21);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['+', 'x', 'x', 'y', 'x', 'y', 'z']);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsAsString'].stateValues.value.tree).eqls(['+', 'x', 'x', 'y', 'x', 'y', 'z']);
        expect(components['/varsAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsString'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringSimplify'].stateValues.value.tree).eqls(['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z']);
        expect(components['/varsAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsStringSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringForceNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsStringForceNumeric'].stateValues.isNumber).eq(false);
      })
    })
  })

  it('sum as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">sum(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>sum(3,17,5-4)</math>
      <math name="numberStringProduct">sum(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>sum(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        sum(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      sum(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        sum(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        sum(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        sum($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        sum($a,$b,$c)
      </math>
      <math name="macrosProduct">
        sum($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        sum($a$b$c)
      </math>
      <math name="group">
        sum($nums)
      </math>
      <math name="groupPlusGroup">
        sum($nums) + sum($nums)
      </math>
      <math name="groupSimplify" simplify>
        sum($nums)
      </math>
      <math name="groupPlus">
        sum($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        sum($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        sum($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        sum($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        sum($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        sum($a, $b, $nums, $c)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3,17,5−4)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numberStringProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3⋅17⋅5−4)')
    });
    cy.get('#\\/numberStringProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('251')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3,17,1)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/numberComponentsProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3⋅17⋅1)')
    });
    cy.get('#\\/numberComponentsProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3,17,1)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/macrosProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3⋅17⋅1)')
    });
    cy.get('#\\/macrosProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3,17,1)')
    });
    cy.get('#\\/groupPlusGroup').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3,17,1)+sum(3,17,1)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('21')
    });
    cy.get('#\\/groupPlus').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlusSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('42')
    });
    cy.get('#\\/groupPlus2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlus2Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('42')
    });
    cy.get('#\\/groupPlus3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sum(3,17,3,17,1,1)')
    });
    cy.get('#\\/groupPlus3Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('42')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'sum', ["tuple", 3, 17, ["+", 5, ["-", 4]]]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(21);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberStringProduct'].stateValues.value.tree).eqls(['apply', 'sum', ["+", ["*", 3, 17, 5], ["-", 4]]]);
        expect(await components['/numberStringProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberStringProductSimplify'].stateValues.value.tree).eq(251);
        expect(await components['/numberStringProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'sum', ["tuple", 3, 17, 1]]);
        expect(await await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(21);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberComponentsProduct'].stateValues.value.tree).eqls(['apply', 'sum', ["*", 3, 17, 1]]);
        expect(await components['/numberComponentsProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/numberComponentsProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'sum', ["tuple", 3, 17, 1]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(21);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/macrosProduct'].stateValues.value.tree).eqls(['apply', 'sum', ["*", 3, 17, 1]]);
        expect(await components['/macrosProduct'].stateValues.isNumber).eq(false);
        expect(components['/macrosProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/macrosProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'sum', ["tuple", 3, 17, 1]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupPlusGroup'].stateValues.value.tree).eqls(["+", ['apply', 'sum', ["tuple", 3, 17, 1]], ['apply', 'sum', ["tuple", 3, 17, 1]]]);
        expect(await components['/groupPlusGroup'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(21);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus'].stateValues.value.tree).eqls(['apply', 'sum', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus'].stateValues.isNumber).eq(false);
        expect(components['/groupPlusSimplify'].stateValues.value.tree).eq(42);
        expect(await components['/groupPlusSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus2'].stateValues.value.tree).eqls(['apply', 'sum', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus2'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus2Simplify'].stateValues.value.tree).eq(42);
        expect(await components['/groupPlus2Simplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus3'].stateValues.value.tree).eqls(['apply', 'sum', ["tuple", 3, 17, 3, 17, 1, 1]]);
        expect(await components['/groupPlus3'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus3Simplify'].stateValues.value.tree).eq(42);
        expect(await components['/groupPlus3Simplify'].stateValues.isNumber).eq(true);


      })
    })
  })

  it('product', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <product name="numbers"><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></product>
      <product name="withNumberProduct"><math>3</math><product><number>17</number><number>5-4</number></product></product>
      <product name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsExpand" expand><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);


      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3⋅17⋅1')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3⋅17⋅1')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(62)⋅17⋅1')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get('#\\/withNumberProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x(x+y)(x+y+z)')
      });
      cy.get('#\\/varsExpand').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x3+2yx2+zx2+xy2+xyz')
      });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('51')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x(x+y)(x+y+z)')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(51);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['*', 3, 17, 1]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(51);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(51);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['*', 3, 17, 1]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(51);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['*', ['/', 6, 2], 17, 1]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(51);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(51);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberProduct'].stateValues.value.tree).eq(51);
        expect(components['/withNumberProduct'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberProduct'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['*', 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsExpand'].stateValues.value.tree).eqls(['+', ['^', 'x', 3], ['*', 2, 'y', ['^', 'x', 2]], ['*', 'z', ['^', 'x', 2]], ['*', 'x', ['^', 'y', 2]], ['*', 'x', 'y', 'z']]);
        expect(components['/varsExpand'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsExpand'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).eq(51);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        expect(replacement2.stateValues.value.tree).eqls(['*', 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })

  })

  it('product with sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <product name="numbers"><number>3</number><number>17</number><number>5-4</number></product>
      <product name="numbersAsString">3 17 1</product>
      <product name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</product>
      <product name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</product>
      <product name="numericAsString">6/2 17 5-4</product>
      <product name="numericAsStringSimplify" simplify>6/2 17 5-4</product>
      <product name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</product>
      <product name="numbersAsMacros">$a$b$c</product>
      <product name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</product>
      <product name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</product>
      <product name="numbersAsMacros2">$a $b $c</product>
      <product name="withNumberMathMacro">$aNumberMath$b$c</product>
      <product name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</product>
      <product name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</product>
      <product name="withNumericMathMacro">$aNumericMath$b$c</product>
      <product name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</product>
      <product name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</product>
      <product name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></product>
      <product name="varsAsString">x x+y x+y+z</product>
      <product name="varsAsStringExpand" expand>x x+y x+y+z</product>
      <product name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</product>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numbersAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numbersAsStringForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3⋅17⋅1')
    });
    cy.get('#\\/numbersAsStringForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numericAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(62)⋅17(5−4)')
    });
    cy.get('#\\/numericAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numericAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numbersAsMacros').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3⋅17⋅1')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numbersAsMacros2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/withNumberMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3⋅17⋅1')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/withNumericMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(62)⋅17⋅1')
    });
    cy.get('#\\/withNumericMathMacroSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/withNumericMathMacroForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x(x+y)(x+y+z)')
    });
    cy.get('#\\/varsAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x(x+y)(x+y+z)')
    });
    cy.get('#\\/varsAsStringExpand').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x3+2yx2+zx2+xy2+xyz')
    });
    cy.get('#\\/varsAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(51);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsString'].stateValues.value.tree).eq(51);
        expect(components['/numbersAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsString'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.value.tree).eqls(['*', 3, 17, 1]);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.value.tree).eq(51);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsString'].stateValues.value.tree).eqls(['*', ['/', 6, 2], 17, ["+", 5, ['-', 4]]]);
        expect(components['/numericAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsString'].stateValues.isNumber).eq(false);
        expect(components['/numericAsStringSimplify'].stateValues.value.tree).eq(51);
        expect(components['/numericAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringForceNumeric'].stateValues.value.tree).eq(51);
        expect(components['/numericAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros'].stateValues.value.tree).eq(51);
        expect(components['/numbersAsMacros'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eqls(['*', 3, 17, 1]);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.value.tree).eq(51);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros2'].stateValues.value.tree).eq(51);
        expect(components['/numbersAsMacros2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros2'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacro'].stateValues.value.tree).eq(51);
        expect(components['/withNumberMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacro'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eqls(['*', 3, 17, 1]);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.value.tree).eq(51);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacro'].stateValues.value.tree).eqls(['*', ['/', 6, 2], 17, 1]);
        expect(components['/withNumericMathMacro'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacro'].stateValues.isNumber).eq(false);
        expect(components['/withNumericMathMacroSimplify'].stateValues.value.tree).eq(51);
        expect(components['/withNumericMathMacroSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacroSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.value.tree).eq(51);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['*', 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsAsString'].stateValues.value.tree).eqls(['*', 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]);
        expect(components['/varsAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsString'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringExpand'].stateValues.value.tree).eqls(['+', ['^', 'x', 3], ['*', 2, 'y', ['^', 'x', 2]], ['*', 'z', ['^', 'x', 2]], ['*', 'x', ['^', 'y', 2]], ['*', 'x', 'y', 'z']]);
        expect(components['/varsAsStringExpand'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsStringExpand'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringForceNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsStringForceNumeric'].stateValues.isNumber).eq(false);
      })
    })
  })

  it('prod as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">prod(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>prod(3,17,5-4)</math>
      <math name="numberStringProduct">prod(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>prod(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        prod(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      prod(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        prod(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        prod(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        prod($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        prod($a,$b,$c)
      </math>
      <math name="macrosProduct">
        prod($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        prod($a$b$c)
      </math>
      <math name="group">
        prod($nums)
      </math>
      <math name="groupSimplify" simplify>
        prod($nums)
      </math>
      <math name="groupPlus">
        prod($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        prod($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        prod($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        prod($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        prod($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        prod($a, $b, $nums, $c)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3,17,5−4)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numberStringProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3⋅17⋅5−4)')
    });
    cy.get('#\\/numberStringProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('251')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3,17,1)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/numberComponentsProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3⋅17⋅1)')
    });
    cy.get('#\\/numberComponentsProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3,17,1)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/macrosProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3⋅17⋅1)')
    });
    cy.get('#\\/macrosProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3,17,1)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/groupPlus').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlusSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2601')
    });
    cy.get('#\\/groupPlus2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlus2Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2601')
    });
    cy.get('#\\/groupPlus3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('prod(3,17,3,17,1,1)')
    });
    cy.get('#\\/groupPlus3Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2601')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'prod', ["tuple", 3, 17, ["+", 5, ["-", 4]]]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberStringProduct'].stateValues.value.tree).eqls(['apply', 'prod', ["+", ["*", 3, 17, 5], ["-", 4]]]);
        expect(await components['/numberStringProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberStringProductSimplify'].stateValues.value.tree).eq(251);
        expect(await components['/numberStringProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'prod', ["tuple", 3, 17, 1]]);
        expect(await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberComponentsProduct'].stateValues.value.tree).eqls(['apply', 'prod', ["*", 3, 17, 1]]);
        expect(await components['/numberComponentsProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/numberComponentsProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'prod', ["tuple", 3, 17, 1]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/macrosProduct'].stateValues.value.tree).eqls(['apply', 'prod', ["*", 3, 17, 1]]);
        expect(await components['/macrosProduct'].stateValues.isNumber).eq(false);
        expect(components['/macrosProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/macrosProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'prod', ["tuple", 3, 17, 1]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus'].stateValues.value.tree).eqls(['apply', 'prod', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus'].stateValues.isNumber).eq(false);
        expect(components['/groupPlusSimplify'].stateValues.value.tree).eq(2601);
        expect(await components['/groupPlusSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus2'].stateValues.value.tree).eqls(['apply', 'prod', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus2'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus2Simplify'].stateValues.value.tree).eq(2601);
        expect(await components['/groupPlus2Simplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus3'].stateValues.value.tree).eqls(['apply', 'prod', ["tuple", 3, 17, 3, 17, 1, 1]]);
        expect(await components['/groupPlus3'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus3Simplify'].stateValues.value.tree).eq(2601);
        expect(await components['/groupPlus3Simplify'].stateValues.isNumber).eq(true);


      })
    })
  })

  it('clamp number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>

      <clampNumber>55.3</clampNumber>
      <clampNumber>-55.3</clampNumber>
      <clampNumber>0.3</clampNumber>

      <clampNumber lowervalue="10" uppervalue="40">55.3</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">-55.3</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">12</clampNumber>

      <clampNumber lowervalue="10" uppervalue="40"><math>55.3</math></clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><number>-55.3</number></clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><number>12</number></clampNumber>

      <clampNumber lowervalue="10" uppervalue="40">x+y</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40"><math>x+y</math></clampNumber>

      <number name="a">4</number>

      <clampNumber lowervalue="10" uppervalue="40">12$a</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">-12$a</clampNumber>
      <clampNumber lowervalue="10" uppervalue="40">3$a</clampNumber>

      <copy tname="_clampnumber1" />
      <copy tname="_clampnumber5" />
      <copy tname="_clampnumber9" />
      <copy tname="_clampnumber14" />

      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);
      let replacement3 = components['/_copy3'].replacements[0];
      let replacement3Anchor = cesc('#' + replacement3.componentName);
      let replacement4 = components['/_copy4'].replacements[0];
      let replacement4Anchor = cesc('#' + replacement4.componentName);

      cy.get('#\\/_clampnumber1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_clampnumber2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0')
      });
      cy.get('#\\/_clampnumber3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.3')
      });
      cy.get('#\\/_clampnumber4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('40')
      });
      cy.get('#\\/_clampnumber5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('10')
      });
      cy.get('#\\/_clampnumber6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_clampnumber7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('40')
      });
      cy.get('#\\/_clampnumber8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('10')
      });
      cy.get('#\\/_clampnumber9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_clampnumber10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get('#\\/_clampnumber11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get('#\\/_clampnumber12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('40')
      });
      cy.get('#\\/_clampnumber13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('10')
      });
      cy.get('#\\/_clampnumber14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('10')
      });
      cy.get(replacement3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get(replacement4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });


      cy.window().then(async (win) => {
        expect(components['/_clampnumber1'].stateValues.value.tree).eq(1);
        expect(components['/_clampnumber2'].stateValues.value.tree).eq(0);
        expect(components['/_clampnumber3'].stateValues.value.tree).eq(0.3);
        expect(components['/_clampnumber4'].stateValues.value.tree).eq(40);
        expect(components['/_clampnumber5'].stateValues.value.tree).eq(10);
        expect(components['/_clampnumber6'].stateValues.value.tree).eq(12);
        expect(components['/_clampnumber7'].stateValues.value.tree).eq(40);
        expect(components['/_clampnumber8'].stateValues.value.tree).eq(10);
        expect(components['/_clampnumber9'].stateValues.value.tree).eq(12);
        expect(components['/_clampnumber10'].stateValues.value.tree).eqls(NaN);
        expect(components['/_clampnumber11'].stateValues.value.tree).eqls(NaN);
        expect(components['/_clampnumber12'].stateValues.value.tree).eq(40);
        expect(components['/_clampnumber13'].stateValues.value.tree).eq(10);
        expect(components['/_clampnumber14'].stateValues.value.tree).eq(12);
        expect(replacement1.stateValues.value.tree).eq(1);
        expect(replacement2.stateValues.value.tree).eq(10);
        expect(replacement3.stateValues.value.tree).eq(12);
        expect(replacement4.stateValues.value.tree).eq(12);
        expect(await components['/_clampnumber1'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber3'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber4'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber5'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber6'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber7'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber8'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber9'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber10'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber11'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber12'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber13'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber14'].stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement2.stateValues.isNumericOperator).eq(true);
        expect(await replacement3.stateValues.isNumericOperator).eq(true);
        expect(await replacement4.stateValues.isNumericOperator).eq(true);
        expect(await components['/_clampnumber1'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber2'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber3'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber4'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber5'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber6'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber7'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber8'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber9'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber10'].stateValues.isNumber).eq(false);
        expect(await components['/_clampnumber11'].stateValues.isNumber).eq(false);
        expect(await components['/_clampnumber12'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber13'].stateValues.isNumber).eq(true);
        expect(await components['/_clampnumber14'].stateValues.isNumber).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        expect(await replacement2.stateValues.isNumber).eq(true);
        expect(await replacement3.stateValues.isNumber).eq(true);
        expect(await replacement4.stateValues.isNumber).eq(true);

      })
    })
  })

  it('wrap number periodic', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>

      <wrapnumberperiodic>55.3</wrapnumberperiodic>
      <wrapnumberperiodic>-55.3</wrapnumberperiodic>
      <wrapnumberperiodic>0.3</wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">55.3</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">-55.3</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">12</wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40"><math>55.3</math></wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><number>-55.3</number></wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><number>12</number></wrapnumberperiodic>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">x+y</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40"><math>x+y</math></wrapnumberperiodic>

      <number name="a">4</number>

      <wrapnumberperiodic lowervalue="10" uppervalue="40">12$a</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">-12$a</wrapnumberperiodic>
      <wrapnumberperiodic lowervalue="10" uppervalue="40">3$a</wrapnumberperiodic>

      <copy tname="_wrapnumberperiodic1" />
      <copy tname="_wrapnumberperiodic5" />
      <copy tname="_wrapnumberperiodic9" />
      <copy tname="_wrapnumberperiodic14" />

      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);
      let replacement3 = components['/_copy3'].replacements[0];
      let replacement3Anchor = cesc('#' + replacement3.componentName);
      let replacement4 = components['/_copy4'].replacements[0];
      let replacement4Anchor = cesc('#' + replacement4.componentName);

      cy.get('#\\/_wrapnumberperiodic1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.3')
      });
      cy.get('#\\/_wrapnumberperiodic2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.7')
      });
      cy.get('#\\/_wrapnumberperiodic3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.3')
      });
      cy.get('#\\/_wrapnumberperiodic4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('25.3')
      });
      cy.get('#\\/_wrapnumberperiodic5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('34.7')
      });
      cy.get('#\\/_wrapnumberperiodic6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_wrapnumberperiodic7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('25.3')
      });
      cy.get('#\\/_wrapnumberperiodic8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('34.7')
      });
      cy.get('#\\/_wrapnumberperiodic9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_wrapnumberperiodic10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get('#\\/_wrapnumberperiodic11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get('#\\/_wrapnumberperiodic12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('18')
      });
      cy.get('#\\/_wrapnumberperiodic13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get('#\\/_wrapnumberperiodic14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.3')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('34.7')
      });
      cy.get(replacement3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });
      cy.get(replacement4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('12')
      });

      cy.window().then(async (win) => {
        expect(components['/_wrapnumberperiodic1'].stateValues.value.tree).closeTo(0.3, 1E-12);
        expect(components['/_wrapnumberperiodic2'].stateValues.value.tree).closeTo(0.7, 1E-12);
        expect(components['/_wrapnumberperiodic3'].stateValues.value.tree).closeTo(0.3, 1E-12);
        expect(components['/_wrapnumberperiodic4'].stateValues.value.tree).closeTo(25.3, 1E-12);
        expect(components['/_wrapnumberperiodic5'].stateValues.value.tree).closeTo(34.7, 1E-12);
        expect(components['/_wrapnumberperiodic6'].stateValues.value.tree).closeTo(12, 1E-12);
        expect(components['/_wrapnumberperiodic7'].stateValues.value.tree).closeTo(25.3, 1E-12);
        expect(components['/_wrapnumberperiodic8'].stateValues.value.tree).closeTo(34.7, 1E-12);
        expect(components['/_wrapnumberperiodic9'].stateValues.value.tree).closeTo(12, 1E-12);
        expect(components['/_wrapnumberperiodic10'].stateValues.value.tree).eqls(NaN);
        expect(components['/_wrapnumberperiodic11'].stateValues.value.tree).eqls(NaN);
        expect(components['/_wrapnumberperiodic12'].stateValues.value.tree).closeTo(18, 1E-12);
        expect(components['/_wrapnumberperiodic13'].stateValues.value.tree).closeTo(12, 1E-12);
        expect(components['/_wrapnumberperiodic14'].stateValues.value.tree).closeTo(12, 1E-12);
        expect(replacement1.stateValues.value.tree).closeTo(0.3, 1E-12);
        expect(replacement2.stateValues.value.tree).closeTo(34.7, 1E-12);
        expect(replacement3.stateValues.value.tree).closeTo(12, 1E-12);
        expect(replacement4.stateValues.value.tree).closeTo(12, 1E-12);
        expect(await components['/_wrapnumberperiodic1'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic3'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic4'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic5'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic6'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic7'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic8'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic9'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic10'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic11'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic12'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic13'].stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic14'].stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement2.stateValues.isNumericOperator).eq(true);
        expect(await replacement3.stateValues.isNumericOperator).eq(true);
        expect(await replacement4.stateValues.isNumericOperator).eq(true);
        expect(await components['/_wrapnumberperiodic1'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic2'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic3'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic4'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic5'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic6'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic7'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic8'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic9'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic10'].stateValues.isNumber).eq(false);
        expect(await components['/_wrapnumberperiodic11'].stateValues.isNumber).eq(false);
        expect(await components['/_wrapnumberperiodic12'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic13'].stateValues.isNumber).eq(true);
        expect(await components['/_wrapnumberperiodic14'].stateValues.isNumber).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        expect(await replacement2.stateValues.isNumber).eq(true);
        expect(await replacement3.stateValues.isNumber).eq(true);
        expect(await replacement4.stateValues.isNumber).eq(true);

      })
    })
  })

  it('clamp and wrap number updatable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <graph>
        <point layer="1">(6,7)</point>
        <point>
          (<clampnumber lowervalue="-2" uppervalue="5">
            <copy prop="x" tname="_point1" />
          </clampnumber>,
          <wrapnumberperiodic lowervalue="-2" uppervalue="5">
            <copy prop="y" tname="_point1" />
          </wrapnumberperiodic>
          )
        </point>
        <point>(<copy prop="y" tname="_point2" />, <copy prop="x" tname="_point2" />)</point>
      </graph>

      <copy name="g2" tname="_graph1" />
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let clamp = x => Math.min(5, Math.max(-2, x));
    let wrap = x => -2 + me.math.mod((x + 2), 7);

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 6, y = 7;
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(clamp(x));

      let g2children = components['/g2'].replacements[0].activeChildren
      expect((await g2children[0].stateValues.xs)[0].tree).eq(x);
      expect((await g2children[0].stateValues.xs)[1].tree).eq(y);
      expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

    })

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -5, y = 0;
      await components['/_point1'].movePoint({ x, y });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(clamp(x));

      let g2children = components['/g2'].replacements[0].activeChildren
      expect((await g2children[0].stateValues.xs)[0].tree).eq(x);
      expect((await g2children[0].stateValues.xs)[1].tree).eq(y);
      expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

    })


    cy.log("move point 2");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 9, y = -3;
      await components['/_point2'].movePoint({ x, y });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(clamp(x));

      let g2children = components['/g2'].replacements[0].activeChildren
      expect((await g2children[0].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[0].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

    })

    cy.log("move point 3");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -4, y = 8;
      await components['/_point3'].movePoint({ x: y, y: x });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(clamp(x));


      let g2children = components['/g2'].replacements[0].activeChildren
      expect((await g2children[0].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[0].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

    })


    cy.log("move point 4");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 10, y = -10;

      let g2children = components['/g2'].replacements[0].activeChildren
      await g2children[0].movePoint({ x, y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(clamp(x));

      expect((await g2children[0].stateValues.xs)[0].tree).eq(x);
      expect((await g2children[0].stateValues.xs)[1].tree).eq(y);
      expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

    })

    cy.log("move point 5");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = 11, y = -13;

      let g2children = components['/g2'].replacements[0].activeChildren
      await g2children[1].movePoint({ x, y });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(clamp(x));

      expect((await g2children[0].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[0].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));

    })

    cy.log("move point 6");
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = -3, y = 12;

      let g2children = components['/g2'].replacements[0].activeChildren
      await g2children[2].movePoint({ x: y, y: x });

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(clamp(x));

      expect((await g2children[0].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[0].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[1].stateValues.xs)[0].tree).eq(clamp(x));
      expect((await g2children[1].stateValues.xs)[1].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[0].tree).eq(wrap(y));
      expect((await g2children[2].stateValues.xs)[1].tree).eq(clamp(x));
    })

  });

  it('round', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <round>55.3252326</round>
      <round>log(31)</round>
      <round>0.5</round>

      <round numberdecimals="1">55.3252326</round>
      <round numberdecimals="2">log(31)</round>
      <round numberdecimals="3">0.5555</round>

      <round numberdigits="3">55.3252326</round>
      <round numberdigits="4">log(31)</round>
      <round numberdigits="5">0.555555</round>

      <round numberdigits="3"><math>sin(55.3252326 x)</math></round>
      <round numberdigits="3">log(31) exp(3) <number>sin(2)</number></round>

      <round numberdecimals="-6"><math>exp(20) pi</math></round>

      <copy tname="_round1" />
      <copy tname="_round5" />
      <copy tname="_round11" />
  
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);
      let replacement3 = components['/_copy3'].replacements[0];
      let replacement3Anchor = cesc('#' + replacement3.componentName);

      cy.get('#\\/_round1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55')
      });
      cy.get('#\\/_round2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/_round3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_round4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55.3')
      });
      cy.get('#\\/_round5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3.43')
      });
      cy.get('#\\/_round6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.556')
      });
      cy.get('#\\/_round7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55.3')
      });
      cy.get('#\\/_round8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3.434')
      });
      cy.get('#\\/_round9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('0.55556')
      });
      cy.get('#\\/_round10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(55.3x)')
      });
      cy.get('#\\/_round11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('62.7')
      });
      cy.get('#\\/_round12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1524000000')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3.43')
      });
      cy.get(replacement3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('62.7')
      });


      cy.window().then(async (win) => {
        expect(components['/_round1'].stateValues.value.tree).eq(55);
        expect(components['/_round2'].stateValues.value.tree).eq(3);
        expect(components['/_round3'].stateValues.value.tree).eq(1);
        expect(components['/_round4'].stateValues.value.tree).eq(55.3);
        expect(components['/_round5'].stateValues.value.tree).eq(3.43);
        expect(components['/_round6'].stateValues.value.tree).eq(0.556);
        expect(components['/_round7'].stateValues.value.tree).eq(55.3);
        expect(components['/_round8'].stateValues.value.tree).eq(3.434);
        expect(components['/_round9'].stateValues.value.tree).eq(0.55556);
        expect(components['/_round10'].stateValues.value.tree).eqls(['apply', 'sin', ['*', 55.3, 'x']]);
        expect(components['/_round11'].stateValues.value.tree).eq(62.7);
        expect(components['/_round12'].stateValues.value.tree).eq(1524000000);
        expect(replacement1.stateValues.value.tree).eq(55);
        expect(replacement2.stateValues.value.tree).eq(3.43);
        expect(replacement3.stateValues.value.tree).eq(62.7);
      })
    })
  })

  it('convert set to list', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

      <p><text>a</text></p>
      <p><math>{1,2,3,2,1}</math></p>
      <p><math>(1,2,3,2,1)</math></p>
      <p><math>1,2,3,2,1</math></p>

      <p><convertSetToList><copy tname="_math1" /></convertSetToList></p>
      <p><convertSetToList><copy tname="_math2" /></convertSetToList></p>
      <p><convertSetToList><copy tname="_math3" /></convertSetToList></p>

      <p><copy name="r1" tname="_convertsettolist1" /></p>
      <p><copy name="r2" tname="_convertsettolist2" /></p>
      <p><copy name="r3" tname="_convertsettolist3" /></p>


      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/r1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/r2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);
      let replacement3 = components['/r3'].replacements[0];
      let replacement3Anchor = cesc('#' + replacement3.componentName);

      cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('{1,2,3,2,1}')
      });
      cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2,3,2,1)')
      });
      cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3,2,1')
      });
      cy.get('#\\/_convertsettolist1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3')
      });
      cy.get('#\\/_convertsettolist2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2,3,2,1)')
      });
      cy.get('#\\/_convertsettolist3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3,2,1')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2,3,2,1)')
      });
      cy.get(replacement3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1,2,3,2,1')
      });


      cy.window().then(async (win) => {
        expect(components['/_math1'].stateValues.value.tree).eqls(['set', 1, 2, 3, 2, 1]);
        expect(components['/_math2'].stateValues.value.tree).eqls(['tuple', 1, 2, 3, 2, 1]);
        expect(components['/_math3'].stateValues.value.tree).eqls(['list', 1, 2, 3, 2, 1]);
        expect(components['/_convertsettolist1'].stateValues.value.tree).eqls(['list', 1, 2, 3]);
        expect(components['/_convertsettolist2'].stateValues.value.tree).eqls(['tuple', 1, 2, 3, 2, 1]);
        expect(components['/_convertsettolist3'].stateValues.value.tree).eqls(['list', 1, 2, 3, 2, 1]);
        expect(replacement1.stateValues.value.tree).eqls(['list', 1, 2, 3]);
        expect(replacement2.stateValues.value.tree).eqls(['tuple', 1, 2, 3, 2, 1]);
        expect(replacement3.stateValues.value.tree).eqls(['list', 1, 2, 3, 2, 1]);
        expect(await components['/_convertsettolist1'].stateValues.unordered).eq(true);
        expect(await components['/_convertsettolist2'].stateValues.unordered).eq(true);
        expect(await components['/_convertsettolist3'].stateValues.unordered).eq(true);
        expect(await replacement1.stateValues.unordered).eq(true);
        expect(await replacement2.stateValues.unordered).eq(true);
        expect(await replacement3.stateValues.unordered).eq(true);
      })
    })
  })

  it('convert set to list, initially unresolved', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

      <p><text>a</text></p>

      <p><math name="m">7</math>
      <selectFromSequence assignNames='p' hide='true' exclude="$m, $n" from="-10" to="10" />
      </p>

      <p><convertSetToList><math>{<copy tname="m" />,<copy tname="n" />,<copy tname="p" />, <copy tname="m" />}</math></convertSetToList></p>
      <p><copy name="csl2" tname="_convertsettolist1" /></p>

      <p><copy name="n2" tname="n3" />
      <copy name="n" tname="num1" />
      <math name="num1" simplify><copy tname="n2" />+<copy tname="num2" /></math>
      <math name="num2" simplify><copy tname="n3" />+<copy tname="num3" /></math>
      <copy name="n3" tname="num3" />
      <number name="num3">1</number></p>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let p = components['/p'].stateValues.value;
      expect(components['/_convertsettolist1'].stateValues.value.tree).eqls(['list', 7, 3, p]);
      expect(components['/csl2'].replacements[0].stateValues.value.tree).eqls(['list', 7, 3, p]);
      expect(components['/_convertsettolist1'].stateValues.unordered).eq(true);
      expect(await components['/csl2'].replacements[0].stateValues.unordered).eq(true);
    })
  })

  it('floor and ceil', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <floor>55.3252326</floor>
      <ceil>log(31)</ceil>

      <floor><copy tname="_floor1" />/<copy tname="_ceil1" /></floor>
      <ceil><copy tname="_ceil1" />/<copy tname="_floor1" /></ceil>

      <p>Allow for slight roundoff error:
      <floor>3.999999999999999</floor>
      <ceil>-6999.999999999999</ceil>
      </p>

      <copy name="f2a" tname="_floor2" />
      <copy name="c2a" tname="_ceil2" />

      <floor>2.1x</floor>
      <ceil>-3.2y</ceil>
  
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/f2a'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/c2a'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      cy.get('#\\/_floor1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('55')
      });
      cy.get('#\\/_ceil1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      });
      cy.get('#\\/_floor2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('13')
      });
      cy.get('#\\/_ceil2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_floor3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      });
      cy.get('#\\/_ceil3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−7000')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('13')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/_floor4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('floor(2.1x)')
      });
      cy.get('#\\/_ceil4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('ceil(−3.2y)')
      });

      cy.window().then(async (win) => {
        expect(components['/_floor1'].stateValues.value.tree).eq(55);
        expect(components['/_ceil1'].stateValues.value.tree).eq(4);
        expect(components['/_floor2'].stateValues.value.tree).eq(13);
        expect(components['/_ceil2'].stateValues.value.tree).eq(1);
        expect(components['/_floor3'].stateValues.value.tree).eq(4);
        expect(components['/_ceil3'].stateValues.value.tree).eq(-7000);
        expect(replacement1.stateValues.value.tree).eq(13);
        expect(replacement2.stateValues.value.tree).eq(1);
        expect(components['/_floor4'].stateValues.value.tree).eqls(["apply", "floor", ['*', 2.1, 'x']]);
        expect(components['/_ceil4'].stateValues.value.tree).eqls(["apply", "ceil", ['-', ['*', 3.2, 'y']]]);
      })
    })
  })

  it('abs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <abs>-5.3</abs>
      <abs>-x</abs>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_abs1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5.3')
    });
    cy.get('#\\/_abs2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('|−x|')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_abs1'].stateValues.value.tree).eq(5.3);
      expect(components['/_abs2'].stateValues.value.tree).eqls(['apply', 'abs', ['-', 'x']]);
    })
  })


  it('invert abs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <abs name="a1">-9</abs>
      <mathinput bindValueTo="$a1" name="a2" />
      <copy prop="value" tname="a2" assignNames="a3" />
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/a1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    });
    cy.get(`#\\/a2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('9')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a1'].stateValues.value.tree).eq(9);
      expect(components['/a2'].stateValues.value.tree).eq(9);
      expect(components['/a3'].stateValues.value.tree).eq(9);
    })

    cy.get("#\\/a2 textarea").type("{end}{backspace}-3{enter}", {force: true})

    cy.get('#\\/a1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get(`#\\/a2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('0')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a1'].stateValues.value.tree).eq(0);
      expect(components['/a2'].stateValues.value.tree).eq(0);
      expect(components['/a3'].stateValues.value.tree).eq(0);
    })


    cy.get("#\\/a2 textarea").type("{end}{backspace}7{enter}", {force: true})

    cy.get('#\\/a1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get(`#\\/a2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('7')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a1'].stateValues.value.tree).eq(7);
      expect(components['/a2'].stateValues.value.tree).eq(7);
      expect(components['/a3'].stateValues.value.tree).eq(7);
    })


    cy.get("#\\/a2 textarea").type("{end}{backspace}x{enter}", {force: true})

    cy.get('#\\/a1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('|x|')
    });
    cy.get(`#\\/a2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('|x|')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('|x|')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a1'].stateValues.value.tree).eqls(["apply", "abs", "x"]);
      expect(components['/a2'].stateValues.value.tree).eqls(["apply", "abs", "x"]);
      expect(components['/a3'].stateValues.value.tree).eqls(["apply", "abs", "x"]);
    })


    cy.get("#\\/a2 textarea").type("{end}{leftArrow}{backspace}y{enter}", {force: true})

    cy.get('#\\/a1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('|y|')
    });
    cy.get(`#\\/a2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('|y|')
    })
    cy.get('#\\/a3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('|y|')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a1'].stateValues.value.tree).eqls(["apply", "abs", "y"]);
      expect(components['/a2'].stateValues.value.tree).eqls(["apply", "abs", "y"]);
      expect(components['/a3'].stateValues.value.tree).eqls(["apply", "abs", "y"]);
    })


  })

  it('floor, ceil, round and abs updatable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <graph>
        <point layer="1">(6.1,7.6)</point>
        <point>
          (
          <floor>
            <copy prop="x" tname="_point1" />
          </floor>,
          <ceil>
            <copy prop="y" tname="_point1" />
          </ceil>
          )
        </point>
        <point>(<abs><copy prop="y" tname="_point2" /></abs>, <round><copy prop="x" tname="_point1" /></round>)</point>
      </graph>

      <copy name="g2" tname="_graph1" />
      `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let clamp = x => Math.min(5, Math.max(-2, x));
    let wrap = x => -2 + me.math.mod((x + 2), 7);

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let g2children = components['/g2'].replacements[0].activeChildren


      let checkPoints = async function (x, y) {
        expect((await components['/_point1'].stateValues.xs)[0].tree).eq(x);
        expect((await components['/_point1'].stateValues.xs)[1].tree).eq(y);
        expect((await components['/_point2'].stateValues.xs)[0].tree).eq(Math.floor(x));
        expect((await components['/_point2'].stateValues.xs)[1].tree).eq(Math.ceil(y));
        expect((await components['/_point3'].stateValues.xs)[0].tree).eq(Math.abs(Math.ceil(y)));
        expect((await components['/_point3'].stateValues.xs)[1].tree).eq(Math.round(x));

        expect((await g2children[0].stateValues.xs)[0].tree).eq(x);
        expect((await g2children[0].stateValues.xs)[1].tree).eq(y);
        expect((await g2children[1].stateValues.xs)[0].tree).eq(Math.floor(x));
        expect((await g2children[1].stateValues.xs)[1].tree).eq(Math.ceil(y));
        expect((await g2children[2].stateValues.xs)[0].tree).eq(Math.abs(Math.ceil(y)));
        expect((await g2children[2].stateValues.xs)[1].tree).eq(Math.round(x));
      }

      checkPoints(6.1, 7.6);

      cy.log("move point 1, positive y");
      cy.window().then(async (win) => {
        let x = -5.1, y = 0.3;
        await components['/_point1'].movePoint({ x, y });
        checkPoints(x, y);
      })

      cy.log("move point 1, negative y");
      cy.window().then(async (win) => {
        let x = -7.9, y = -5.8;
        await components['/_point1'].movePoint({ x, y });
        checkPoints(x, y);
      })

      cy.log("move point 2, positive y");
      cy.window().then(async (win) => {
        let x = 3.4, y = 8.6;
        await components['/_point2'].movePoint({ x, y });
        checkPoints(x, y);
      })

      cy.log("move point 2, negative y");
      cy.window().then(async (win) => {
        let x = 7.7, y = -4.4;
        await components['/_point2'].movePoint({ x, y });
        checkPoints(x, y);
      })

      cy.log("move point 3, positive x");
      cy.window().then(async (win) => {
        let x = 9.4, y = -1.3;
        await components['/_point3'].movePoint({ x, y });
        checkPoints(y, x);
      })

      cy.log("move point 3, negative x");
      cy.window().then(async (win) => {
        let x = -8.9, y = -4.6;
        await components['/_point3'].movePoint({ x, y });
        checkPoints(y, 0);
      })

      cy.log("move point 4, positive y");
      cy.window().then(async (win) => {
        let x = 6.8, y = 3.7;
        await g2children[0].movePoint({ x, y });
        checkPoints(x, y);
      })

      cy.log("move point 4, negative y");
      cy.window().then(async (win) => {
        let x = 1.2, y = -1.4;
        await g2children[0].movePoint({ x, y });
        checkPoints(x, y);
      })

      cy.log("move point 5, positive y");
      cy.window().then(async (win) => {
        let x = -6.6, y = 3.2;
        await g2children[1].movePoint({ x, y });
        checkPoints(x, y);
      })

      cy.log("move point 5, negative y");
      cy.window().then(async (win) => {
        let x = -4.3, y = -8.9;
        await g2children[1].movePoint({ x, y });
        checkPoints(x, y);
      })

      cy.log("move point 6, positive x");
      cy.window().then(async (win) => {
        let x = 6.4, y = 2.3;
        await g2children[2].movePoint({ x, y });
        checkPoints(y, x);
      })

      cy.log("move point 6, negative x");
      cy.window().then(async (win) => {
        let x = -5.6, y = 7.8;
        await g2children[2].movePoint({ x, y });
        checkPoints(y, 0);
      })

    })

  });

  it('sign', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <sign>-5.3</sign>
      <sign>63</sign>
      <sign>0</sign>
      `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_sign1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('−1')
    });
    cy.get('#\\/_sign2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/_sign3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_sign1'].stateValues.value.tree).eq(-1);
      expect(components['/_sign2'].stateValues.value.tree).eq(1);
      expect(components['/_sign3'].stateValues.value.tree).eq(0);
    })
  })

  it('mean', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <mean name="numbers"><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></mean>
      <mean name="withNumberMean"><math>3</math><mean><number>17</number><number>5-4</number></mean></mean>
      <mean name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3+17+13')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3+17+13')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('62+17+13')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      });
      cy.get('#\\/withNumberMean').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6')
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+x+y+x+y+z3')
      });
      cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3x+2y+z3')
      });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+x+y+x+y+z3')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(7);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(7);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(7);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(7);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(7);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(7);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMean'].stateValues.value.tree).eq(6);
        expect(components['/withNumberMean'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMean'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).eq(7);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        expect(replacement2.stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })
  })

  it('mean with sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <mean name="numbers"><number>3</number><number>17</number><number>5-4</number></mean>
      <mean name="numbersAsString">3 17 1</mean>
      <mean name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</mean>
      <mean name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</mean>
      <mean name="numericAsString">6/2 17 5-4</mean>
      <mean name="numericAsStringSimplify" simplify>6/2 17 5-4</mean>
      <mean name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</mean>
      <mean name="numbersAsMacros">$a$b$c</mean>
      <mean name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</mean>
      <mean name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</mean>
      <mean name="numbersAsMacros2">$a $b $c</mean>
      <mean name="withNumberMathMacro">$aNumberMath$b$c</mean>
      <mean name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</mean>
      <mean name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</mean>
      <mean name="withNumericMathMacro">$aNumericMath$b$c</mean>
      <mean name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</mean>
      <mean name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</mean>
      <mean name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></mean>
      <mean name="varsAsString">x x+y x+y+z</mean>
      <mean name="varsAsStringSimplify" simplify>x x+y x+y+z</mean>
      <mean name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</mean>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numbersAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numbersAsStringForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3+17+13')
    });
    cy.get('#\\/numbersAsStringForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numericAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62+17+5−43')
    });
    cy.get('#\\/numericAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numericAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numbersAsMacros').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3+17+13')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numbersAsMacros2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/withNumberMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3+17+13')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/withNumericMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('62+17+13')
    });
    cy.get('#\\/withNumericMathMacroSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/withNumericMathMacroForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x+y+x+y+z3')
    });
    cy.get('#\\/varsAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+x+y+x+y+z3')
    });
    cy.get('#\\/varsAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3x+2y+z3')
    });
    cy.get('#\\/varsAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(7);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsString'].stateValues.value.tree).eq(7);
        expect(components['/numbersAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsString'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.value.tree).eq(7);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsString'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 5, ['-', 4]], 3]);
        expect(components['/numericAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsString'].stateValues.isNumber).eq(false);
        expect(components['/numericAsStringSimplify'].stateValues.value.tree).eq(7);
        expect(components['/numericAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringForceNumeric'].stateValues.value.tree).eq(7);
        expect(components['/numericAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros'].stateValues.value.tree).eq(7);
        expect(components['/numbersAsMacros'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.value.tree).eq(7);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros2'].stateValues.value.tree).eq(7);
        expect(components['/numbersAsMacros2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros2'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacro'].stateValues.value.tree).eq(7);
        expect(components['/withNumberMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacro'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.value.tree).eq(7);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacro'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(components['/withNumericMathMacro'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacro'].stateValues.isNumber).eq(false);
        expect(components['/withNumericMathMacroSimplify'].stateValues.value.tree).eq(7);
        expect(components['/withNumericMathMacroSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacroSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.value.tree).eq(7);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsAsString'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/varsAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsString'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(components['/varsAsStringSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(await components['/varsAsStringSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringForceNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsStringForceNumeric'].stateValues.isNumber).eq(false);
      })
    })
  })

  it('mean as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">mean(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>mean(3,17,5-4)</math>
      <math name="numberStringProduct">mean(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>mean(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        mean(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      mean(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        mean(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        mean(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        mean($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        mean($a,$b,$c)
      </math>
      <math name="macrosProduct">
        mean($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        mean($a$b$c)
      </math>
      <math name="group">
        mean($nums)
      </math>
      <math name="groupSimplify" simplify>
        mean($nums)
      </math>
      <math name="groupPlus">
        mean($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        mean($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        mean($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        mean($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        mean($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        mean($a, $b, $nums, $c)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3,17,5−4)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numberStringProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3⋅17⋅5−4)')
    });
    cy.get('#\\/numberStringProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('251')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3,17,1)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/numberComponentsProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3⋅17⋅1)')
    });
    cy.get('#\\/numberComponentsProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3,17,1)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/macrosProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3⋅17⋅1)')
    });
    cy.get('#\\/macrosProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3,17,1)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/groupPlus').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlusSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/groupPlus2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlus2Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });
    cy.get('#\\/groupPlus3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mean(3,17,3,17,1,1)')
    });
    cy.get('#\\/groupPlus3Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'mean', ["tuple", 3, 17, ["+", 5, ["-", 4]]]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(7);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberStringProduct'].stateValues.value.tree).eqls(['apply', 'mean', ["+", ["*", 3, 17, 5], ["-", 4]]]);
        expect(await components['/numberStringProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberStringProductSimplify'].stateValues.value.tree).eq(251);
        expect(await components['/numberStringProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'mean', ["tuple", 3, 17, 1]]);
        expect(await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(7);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberComponentsProduct'].stateValues.value.tree).eqls(['apply', 'mean', ["*", 3, 17, 1]]);
        expect(await components['/numberComponentsProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/numberComponentsProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'mean', ["tuple", 3, 17, 1]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(7);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/macrosProduct'].stateValues.value.tree).eqls(['apply', 'mean', ["*", 3, 17, 1]]);
        expect(await components['/macrosProduct'].stateValues.isNumber).eq(false);
        expect(components['/macrosProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/macrosProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'mean', ["tuple", 3, 17, 1]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(7);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus'].stateValues.value.tree).eqls(['apply', 'mean', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus'].stateValues.isNumber).eq(false);
        expect(components['/groupPlusSimplify'].stateValues.value.tree).eq(7);
        expect(await components['/groupPlusSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus2'].stateValues.value.tree).eqls(['apply', 'mean', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus2'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus2Simplify'].stateValues.value.tree).eq(7);
        expect(await components['/groupPlus2Simplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus3'].stateValues.value.tree).eqls(['apply', 'mean', ["tuple", 3, 17, 3, 17, 1, 1]]);
        expect(await components['/groupPlus3'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus3Simplify'].stateValues.value.tree).eq(7);
        expect(await components['/groupPlus3Simplify'].stateValues.isNumber).eq(true);


      })
    })
  })

  it('mean additional cases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Mean of first primes: <mean name="meanPrime">2 3 5 7</mean></p>
    <p>Copying that mean: <copy tname="meanPrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Mean of numbers from 1 to 100: <mean name="mean100"><sequence to="100" /></mean></p>
    <p>Copying that mean: <copy tname="mean100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let mean2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let mean3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let mean5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let mean6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      cy.log('Test value displayed in browser')

      cy.get('#\\/meanPrime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4.25')
      });
      cy.get(mean2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4.25')
      });
      cy.get(mean3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4.25')
      });
      cy.get('#\\/mean100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('50.5')
      });
      cy.get(mean5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('50.5')
      });
      cy.get(mean6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('50.5')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        expect(components['/meanPrime'].stateValues.value.tree).eq(4.25);
        expect(components['/_copy1'].replacements[0].stateValues.value.tree).eq(4.25);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value.tree).eq(4.25);
        expect(components['/mean100'].stateValues.value.tree).eq(50.5);
        expect(components['/_copy3'].replacements[0].stateValues.value.tree).eq(50.5);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value.tree).eq(50.5);
      })
    })
  })

  // TODO: skipping most checks of ugly expressions for now
  it('variance', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <variance name="numbers"><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></variance>
      <variance name="withNumberVariance"><math>3</math><variance><number>17</number><number>5-4</number></variance></variance>
      <variance name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      let theVariance = me.math.var([3, 17, 1]);
      let theVarianceString = theVariance.toString();

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('32+172+12−(3+17+1)232')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('32+172+12−(3+17+1)232')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(62)2+172+12−(62+17+1)232')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/withNumberVariance').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(me.math.var([3, me.math.var([17, 1])]).toString())
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232')
      });
      // cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('3x+2y+z3')
      // });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        // expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        // expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        // expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberVariance'].stateValues.value.tree).eq(me.math.var([3, me.math.var([17, 1])]));
        expect(components['/withNumberVariance'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberVariance'].stateValues.isNumber).eq(true);
        // expect(components['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        // expect(components['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).eq(theVariance);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        // expect(replacement2.stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })
  })

  it('variance with sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <variance name="numbers"><number>3</number><number>17</number><number>5-4</number></variance>
      <variance name="numbersAsString">3 17 1</variance>
      <variance name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</variance>
      <variance name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</variance>
      <variance name="numericAsString">6/2 17 5-4</variance>
      <variance name="numericAsStringSimplify" simplify>6/2 17 5-4</variance>
      <variance name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</variance>
      <variance name="numbersAsMacros">$a$b$c</variance>
      <variance name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</variance>
      <variance name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</variance>
      <variance name="numbersAsMacros2">$a $b $c</variance>
      <variance name="withNumberMathMacro">$aNumberMath$b$c</variance>
      <variance name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</variance>
      <variance name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</variance>
      <variance name="withNumericMathMacro">$aNumericMath$b$c</variance>
      <variance name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</variance>
      <variance name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</variance>
      <variance name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
      <variance name="varsAsString">x x+y x+y+z</variance>
      <variance name="varsAsStringSimplify" simplify>x x+y x+y+z</variance>
      <variance name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</variance>
      `}, "*");
    });

    let theVariance = me.math.var([3, 17, 1]);
    let theVarianceString = theVariance.toString();

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numbersAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numbersAsStringForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('32+172+12−(3+17+1)232')
    });
    cy.get('#\\/numbersAsStringForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numericAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(62)2+172+(5−4)2−(62+17+5−4)232')
    });
    cy.get('#\\/numericAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numericAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numbersAsMacros').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numbersAsMacrosForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('32+172+12−(3+17+1)232')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numbersAsMacros2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/withNumberMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/withNumberMathMacroForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('32+172+12−(3+17+1)232')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/withNumericMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(62)2+172+12−(62+17+1)232')
    });
    cy.get('#\\/withNumericMathMacroSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/withNumericMathMacroForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232')
    });
    cy.get('#\\/varsAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232')
    });
    // cy.get('#\\/varsAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('3x+2y+z3')
    // });
    cy.get('#\\/varsAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsString'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsString'].stateValues.isNumber).eq(true);
        // expect(components['/numbersAsStringForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        // expect(components['/numericAsString'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 5, ['-', 4]], 3]);
        expect(components['/numericAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsString'].stateValues.isNumber).eq(false);
        expect(components['/numericAsStringSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numericAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringForceNumeric'].stateValues.value.tree).eq(theVariance);
        expect(components['/numericAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersAsMacros'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros'].stateValues.isNumber).eq(true);
        // expect(components['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros2'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersAsMacros2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros2'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacro'].stateValues.value.tree).eq(theVariance);
        expect(components['/withNumberMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacro'].stateValues.isNumber).eq(true);
        // expect(components['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        // expect(components['/withNumericMathMacro'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(components['/withNumericMathMacro'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacro'].stateValues.isNumber).eq(false);
        expect(components['/withNumericMathMacroSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/withNumericMathMacroSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacroSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.value.tree).eq(theVariance);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroForceNumeric'].stateValues.isNumber).eq(true);
        // expect(components['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        // expect(components['/varsAsString'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/varsAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsString'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        // expect(components['/varsAsStringSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(await components['/varsAsStringSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringForceNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsStringForceNumeric'].stateValues.isNumber).eq(false);
      })
    })
  })

  it('variance as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">var(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>var(3,17,5-4)</math>
      <math name="numberStringProduct">var(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>var(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        var(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      var(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        var(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        var(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        var($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        var($a,$b,$c)
      </math>
      <math name="macrosProduct">
        var($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        var($a$b$c)
      </math>
      <math name="group">
        var($nums)
      </math>
      <math name="groupSimplify" simplify>
        var($nums)
      </math>
      <math name="groupPlus">
        var($nums, $a, $b, 13)
      </math>
      <math name="groupPlusSimplify" simplify>
        var($nums, $a, $b, 13)
      </math>
      <math name="groupPlus2">
        var($a, $b, 13, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        var($a, $b, 13, $nums)
      </math>
      <math name="groupPlus3">
        var($a, $b, $nums, 13)
      </math>
      <math name="groupPlus3Simplify" simplify>
        var($a, $b, $nums, 13)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let theVariance = me.math.var([3, 17, 1]);
    let theVarianceString = theVariance.toString();
    let theVariance2 = me.math.var([3, 17, 1, 3, 17, 13]);
    let theVariance2String = theVariance2.toString();

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3,17,5−4)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numberStringProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3⋅17⋅5−4)')
    });
    cy.get('#\\/numberStringProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3,17,1)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/numberComponentsProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3⋅17⋅1)')
    });
    cy.get('#\\/numberComponentsProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3,17,1)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/macrosProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3⋅17⋅1)')
    });
    cy.get('#\\/macrosProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3,17,1)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVarianceString)
    });
    cy.get('#\\/groupPlus').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3,17,1,3,17,13)')
    });
    cy.get('#\\/groupPlusSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVariance2String)
    });
    cy.get('#\\/groupPlus2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3,17,13,3,17,1)')
    });
    cy.get('#\\/groupPlus2Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVariance2String)
    });
    cy.get('#\\/groupPlus3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('var(3,17,3,17,1,13)')
    });
    cy.get('#\\/groupPlus3Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theVariance2String)
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'var', ["tuple", 3, 17, ["+", 5, ["-", 4]]]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(theVariance);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberStringProduct'].stateValues.value.tree).eqls(['apply', 'var', ["+", ["*", 3, 17, 5], ["-", 4]]]);
        expect(await components['/numberStringProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberStringProductSimplify'].stateValues.value.tree).eq(0);
        expect(await components['/numberStringProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'var', ["tuple", 3, 17, 1]]);
        expect(await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(theVariance);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberComponentsProduct'].stateValues.value.tree).eqls(['apply', 'var', ["*", 3, 17, 1]]);
        expect(await components['/numberComponentsProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsProductSimplify'].stateValues.value.tree).eq(0);
        expect(await components['/numberComponentsProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'var', ["tuple", 3, 17, 1]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(theVariance);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/macrosProduct'].stateValues.value.tree).eqls(['apply', 'var', ["*", 3, 17, 1]]);
        expect(await components['/macrosProduct'].stateValues.isNumber).eq(false);
        expect(components['/macrosProductSimplify'].stateValues.value.tree).eq(0);
        expect(await components['/macrosProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'var', ["tuple", 3, 17, 1]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(theVariance);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus'].stateValues.value.tree).eqls(['apply', 'var', ["tuple", 3, 17, 1, 3, 17, 13]]);
        expect(await components['/groupPlus'].stateValues.isNumber).eq(false);
        expect(components['/groupPlusSimplify'].stateValues.value.tree).eq(theVariance2);
        expect(await components['/groupPlusSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus2'].stateValues.value.tree).eqls(['apply', 'var', ["tuple", 3, 17, 13, 3, 17, 1]]);
        expect(await components['/groupPlus2'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus2Simplify'].stateValues.value.tree).eq(theVariance2);
        expect(await components['/groupPlus2Simplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus3'].stateValues.value.tree).eqls(['apply', 'var', ["tuple", 3, 17, 3, 17, 1, 13]]);
        expect(await components['/groupPlus3'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus3Simplify'].stateValues.value.tree).eq(theVariance2);
        expect(await components['/groupPlus3Simplify'].stateValues.isNumber).eq(true);

      })
    })
  })

  it('variance additional cases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Variance of first primes: <variance name="variancePrime">2 3 5 7</variance></p>
    <p>Copying that variance: <copy tname="variancePrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Variance of numbers from 1 to 100: <variance name="variance100"><sequence to="100" /></variance></p>
    <p>Copying that variance: <copy tname="variance100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let variance2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let variance3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let variance5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let variance6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      let variancePrimes = me.math.var(2, 3, 5, 7);
      let variance100 = me.math.var(Array.from({ length: 100 }, (_, i) => i + 1))

      cy.log('Test value displayed in browser')

      cy.get('#\\/variancePrime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1E-6);
      });
      cy.get(variance2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1E-6);
      });
      cy.get(variance3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1E-6);
      });
      cy.get('#\\/variance100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variance100, 1E-6);
      });
      cy.get(variance5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variance100, 1E-6);
      });
      cy.get(variance6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variance100, 1E-6);
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/variancePrime'].stateValues.value.tree).closeTo(variancePrimes, 1E-12);
        expect(components['/_copy1'].replacements[0].stateValues.value.tree).closeTo(variancePrimes, 1E-12);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value.tree).closeTo(variancePrimes, 1E-12);
        expect(components['/variance100'].stateValues.value.tree).closeTo(variance100, 1E-12);
        expect(components['/_copy3'].replacements[0].stateValues.value.tree).closeTo(variance100, 1E-12);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value.tree).closeTo(variance100, 1E-12);
      })
    })
  })

  // TODO: skipping most checks of ugly expressions for now
  it('population variance', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
        <text>a</text>
        <variance population name="numbers"><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population name="numbersForceSymbolic" forceSymbolic><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>4</number><number>16</number><number>5-4</number></variance>
        <variance population name="numbersWithNumberMath"><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>4</math><number>16</number><number>5-4</number></variance>
        <variance population name="numbersWithNumericMath"><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population name="numbersWithNumericMathSimplify" simplify><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population name="numbersWithNumericMathForceNumeric" forceNumeric><math>8/2</math><number>16</number><number>5-4</number></variance>
        <variance population name="withNumberVariance"><math>4</math><variance population><number>17</number><number>5-4</number></variance></variance>
        <variance population name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        <variance population name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        <variance population name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></variance>
        <copy tname="numbers" />
        <copy tname="vars" />
        `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      let theVariance = me.math.var([4, 16, 1], 'uncorrected');
      let theVarianceString = theVariance.toString();

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('42+162+12−(4+16+1)233')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('42+162+12−(4+16+1)233')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(82)2+162+12−(82+16+1)233')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get('#\\/withNumberVariance').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(me.math.var([4, me.math.var([17, 1], 'uncorrected')], 'uncorrected').toString())
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)233')
      });
      // cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('3x+2y+z3')
      // });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(theVarianceString)
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)233')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        // expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        // expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        // expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(theVariance);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberVariance'].stateValues.value.tree).eq(me.math.var([4, me.math.var([17, 1], 'uncorrected')], 'uncorrected'));
        expect(components['/withNumberVariance'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberVariance'].stateValues.isNumber).eq(true);
        // expect(components['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        // expect(components['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).eq(theVariance);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        // expect(replacement2.stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })
  })

  it('population variance additional cases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Variance of first primes: <variance population name="variancePrime">2 3 5 7</variance></p>
    <p>Copying that variance: <copy tname="variancePrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Variance of numbers from 1 to 100: <variance population name="variance100"><sequence to="100" /></variance></p>
    <p>Copying that variance: <copy tname="variance100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let variance2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let variance3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let variance5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let variance6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      let variancePrimes = me.math.var([2, 3, 5, 7], 'uncorrected');
      let variance100 = me.math.var(Array.from({ length: 100 }, (_, i) => i + 1), 'uncorrected')

      cy.log('Test value displayed in browser')

      cy.get('#\\/variancePrime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1E-6);
      });
      cy.get(variance2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1E-6);
      });
      cy.get(variance3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variancePrimes, 1E-6);
      });
      cy.get('#\\/variance100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variance100, 1E-6);
      });
      cy.get(variance5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variance100, 1E-6);
      });
      cy.get(variance6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(variance100, 1E-6);
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/variancePrime'].stateValues.value.tree).closeTo(variancePrimes, 1E-12);
        expect(components['/_copy1'].replacements[0].stateValues.value.tree).closeTo(variancePrimes, 1E-12);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value.tree).closeTo(variancePrimes, 1E-12);
        expect(components['/variance100'].stateValues.value.tree).closeTo(variance100, 1E-12);
        expect(components['/_copy3'].replacements[0].stateValues.value.tree).closeTo(variance100, 1E-12);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value.tree).closeTo(variance100, 1E-12);
      })
    })
  })

  // TODO: skipping most checks of ugly expressions for now
  it('standard deviation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <standarddeviation name="numbers"><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></standarddeviation>
      <standarddeviation name="withNumberStandardDeviation"><math>3</math><standarddeviation><number>17</number><number>5-4</number></standarddeviation></standarddeviation>
      <standarddeviation name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      let theStandardDeviation = me.math.std([3, 17, 1]);

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(theStandardDeviation, 1E-6)
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√32+172+12−(3+17+1)232')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√76')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(theStandardDeviation, 1E-6)
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√32+172+12−(3+17+1)232')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√76')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√(62)2+172+12−(62+17+1)232')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√76')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(theStandardDeviation, 1E-6)
      });
      cy.get('#\\/withNumberStandardDeviation').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(me.math.std([3, me.math.std([17, 1])]), 1E-6)
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232')
      });
      // cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('3x+2y+z3')
      // });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(theStandardDeviation, 1E-6)
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)232')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).closeTo(theStandardDeviation, 1E-12);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        // expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eqls(['apply', 'sqrt', 76]);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).closeTo(theStandardDeviation, 1E-16);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        // expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eqls(['apply', 'sqrt', 76]);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(false);
        // expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eqls(['apply', 'sqrt', 76]);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).closeTo(theStandardDeviation, 1E-12);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberStandardDeviation'].stateValues.value.tree).closeTo(me.math.std([3, me.math.std([17, 1])]), 1E-12);
        expect(components['/withNumberStandardDeviation'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberStandardDeviation'].stateValues.isNumber).eq(true);
        // expect(components['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        // expect(components['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).closeTo(theStandardDeviation, 1E-12);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        // expect(replacement2.stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })
  })


  it('standard deviation as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">13</number>
        <number name="b">25</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">std(13,25,5-4)</math>
      <math name="numberStringSimplify" simplify>std(13,25,5-4)</math>
      <math name="numberStringProduct">std(13 25 5-4)</math>
      <math name="numberStringProductSimplify" simplify>std(13 25 5-4)</math>
      <math name="numberComponentsCommas">
        std(<number>13</number>,<number>25</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      std(<number>13</number>,<number>25</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        std(<number>13</number><number>25</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        std(<number>13</number><number>25</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        std($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        std($a,$b,$c)
      </math>
      <math name="macrosProduct">
        std($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        std($a$b$c)
      </math>
      <math name="group">
        std($nums)
      </math>
      <math name="groupSimplify" simplify>
        std($nums)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let theStd = me.math.std([13, 25, 1]);
    let theStdString = theStd.toString();

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('std(13,25,5−4)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theStdString)
    });
    cy.get('#\\/numberStringProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('std(13⋅25⋅5−4)')
    });
    cy.get('#\\/numberStringProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('std(13,25,1)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theStdString)
    });
    cy.get('#\\/numberComponentsProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('std(13⋅25⋅1)')
    });
    cy.get('#\\/numberComponentsProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('std(13,25,1)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theStdString)
    });
    cy.get('#\\/macrosProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('std(13⋅25⋅1)')
    });
    cy.get('#\\/macrosProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('std(13,25,1)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(theStdString)
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'std', ["tuple", 13, 25, ["+", 5, ["-", 4]]]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(theStd);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberStringProduct'].stateValues.value.tree).eqls(['apply', 'std', ["+", ["*", 13, 25, 5], ["-", 4]]]);
        expect(await components['/numberStringProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberStringProductSimplify'].stateValues.value.tree).eq(0);
        expect(await components['/numberStringProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'std', ["tuple", 13, 25, 1]]);
        expect(await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(theStd);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberComponentsProduct'].stateValues.value.tree).eqls(['apply', 'std', ["*", 13, 25, 1]]);
        expect(await components['/numberComponentsProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsProductSimplify'].stateValues.value.tree).eq(0);
        expect(await components['/numberComponentsProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'std', ["tuple", 13, 25, 1]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(theStd);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/macrosProduct'].stateValues.value.tree).eqls(['apply', 'std', ["*", 13, 25, 1]]);
        expect(await components['/macrosProduct'].stateValues.isNumber).eq(false);
        expect(components['/macrosProductSimplify'].stateValues.value.tree).eq(0);
        expect(await components['/macrosProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'std', ["tuple", 13, 25, 1]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(theStd);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

      })
    })
  })


  it('standard deviation additional cases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Standard deviation of first primes: <standarddeviation name="standarddeviationPrime">2 3 5 7</standarddeviation></p>
    <p>Copying that standard deviation: <copy tname="standarddeviationPrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Standard deviation of numbers from 1 to 100: <standarddeviation name="standarddeviation100"><sequence to="100" /></standarddeviation></p>
    <p>Copying that standard deviation: <copy tname="standarddeviation100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let std2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let std3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let std5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let std6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      let stdPrimes = me.math.std(2, 3, 5, 7);
      let std100 = me.math.std(Array.from({ length: 100 }, (_, i) => i + 1))

      cy.log('Test value displayed in browser')

      cy.get('#\\/standarddeviationPrime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1E-6);
      });
      cy.get(std2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1E-6);
      });
      cy.get(std3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1E-6);
      });
      cy.get('#\\/standarddeviation100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(std100, 1E-6);
      });
      cy.get(std5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(std100, 1E-6);
      });
      cy.get(std6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(std100, 1E-6);
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/standarddeviationPrime'].stateValues.value.tree).closeTo(stdPrimes, 1E-12);
        expect(components['/_copy1'].replacements[0].stateValues.value.tree).closeTo(stdPrimes, 1E-12);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value.tree).closeTo(stdPrimes, 1E-12);
        expect(components['/standarddeviation100'].stateValues.value.tree).closeTo(std100, 1E-12);
        expect(components['/_copy3'].replacements[0].stateValues.value.tree).closeTo(std100, 1E-12);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value.tree).closeTo(std100, 1E-12);
      })
    })
  })

  // TODO: skipping most checks of ugly expressions for now
  it('population standard deviation', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <standarddeviation population name="numbers"><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="numbersForceSymbolic" forceSymbolic><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>4</number><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="numbersWithNumberMath"><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>4</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="numbersWithNumericMath"><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="numbersWithNumericMathSimplify" simplify><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="numbersWithNumericMathForceNumeric" forceNumeric><math>8/2</math><number>16</number><number>5-4</number></standarddeviation>
      <standarddeviation population name="withNumberStandardDeviation"><math>3</math><standarddeviation population><number>17</number><number>5-4</number></standarddeviation></standarddeviation>
      <standarddeviation population name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation population name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <standarddeviation population name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></standarddeviation>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      let theStandardDeviation = me.math.std([4, 16, 1], 'uncorrected');

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(theStandardDeviation, 1E-6)
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√42+162+12−(4+16+1)233')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√42')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(theStandardDeviation, 1E-6)
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√42+162+12−(4+16+1)233')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√42')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√(82)2+162+12−(82+16+1)233')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√42')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(theStandardDeviation, 1E-6)
      });
      cy.get('#\\/withNumberStandardDeviation').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(me.math.std([3, me.math.std([17, 1], 'uncorrected')], 'uncorrected'), 1E-6)
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)233')
      });
      // cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      //   expect(text.trim()).equal('3x+2y+z3')
      // });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(theStandardDeviation, 1E-6)
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('√x2+(x+y)2+(x+y+z)2−(x+x+y+x+y+z)233')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).closeTo(theStandardDeviation, 1E-12);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        // expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eqls(['apply', 'sqrt', 42]);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).closeTo(theStandardDeviation, 1E-16);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        // expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['/', ['+', 3, 17, 1], 3]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eqls(['apply', 'sqrt', 42]);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(false);
        // expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['/', ['+', ['/', 6, 2], 17, 1], 3]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eqls(['apply', 'sqrt', 42]);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).closeTo(theStandardDeviation, 1E-12);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberStandardDeviation'].stateValues.value.tree).closeTo(me.math.std([3, me.math.std([17, 1], 'uncorrected')], 'uncorrected'), 1E-12);
        expect(components['/withNumberStandardDeviation'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberStandardDeviation'].stateValues.isNumber).eq(true);
        // expect(components['/vars'].stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        // expect(components['/varsSimplify'].stateValues.value.tree).eqls(['/', ['+', ['*', 3, 'x'], ['*', 2, 'y'], 'z'], 3]);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).closeTo(theStandardDeviation, 1E-12);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        // expect(replacement2.stateValues.value.tree).eqls(['/', ['+', 'x', 'x', 'y', 'x', 'y', 'z'], 3]);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })
  })

  it('population standard deviation additional cases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Standard deviation of first primes: <standarddeviation population name="standarddeviationPrime">2 3 5 7</standarddeviation></p>
    <p>Copying that standard deviation: <copy tname="standarddeviationPrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Standard deviation of numbers from 1 to 100: <standarddeviation population name="standarddeviation100"><sequence to="100" /></standarddeviation></p>
    <p>Copying that standard deviation: <copy tname="standarddeviation100" /></p>
    <copy tname="p100" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let std2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let std3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let std5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let std6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      let stdPrimes = me.math.std([2, 3, 5, 7], 'uncorrected');
      let std100 = me.math.std(Array.from({ length: 100 }, (_, i) => i + 1), 'uncorrected')

      cy.log('Test value displayed in browser')

      cy.get('#\\/standarddeviationPrime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1E-6);
      });
      cy.get(std2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1E-6);
      });
      cy.get(std3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(stdPrimes, 1E-6);
      });
      cy.get('#\\/standarddeviation100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(std100, 1E-6);
      });
      cy.get(std5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(std100, 1E-6);
      });
      cy.get(std6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(std100, 1E-6);
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/standarddeviationPrime'].stateValues.value.tree).closeTo(stdPrimes, 1E-12);
        expect(components['/_copy1'].replacements[0].stateValues.value.tree).closeTo(stdPrimes, 1E-12);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value.tree).closeTo(stdPrimes, 1E-12);
        expect(components['/standarddeviation100'].stateValues.value.tree).closeTo(std100, 1E-12);
        expect(components['/_copy3'].replacements[0].stateValues.value.tree).closeTo(std100, 1E-12);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value.tree).closeTo(std100, 1E-12);
      })
    })
  })

  it('count', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <count name="numbers"><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></count>
      <count name="withNumberCount"><math>3</math><count><number>17</number><number>5-4</number></count></count>
      <count name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/withNumberCount').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(3);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersForceSymbolic'].stateValues.value.tree).eq(3);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(true);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(3);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(3);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eq(3);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(3);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMath'].stateValues.value.tree).eq(3);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(3);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(3);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberCount'].stateValues.value.tree).eq(2);
        expect(components['/withNumberCount'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberCount'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eq(3);
        expect(components['/vars'].stateValues.isNumericOperator).eq(true);
        expect(await components['/vars'].stateValues.isNumber).eq(true);
        expect(components['/varsSimplify'].stateValues.value.tree).eq(3);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(true);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eq(3);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(true);
        expect(replacement1.stateValues.value.tree).eq(3);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        expect(replacement2.stateValues.value.tree).eq(3);
        expect(await replacement2.stateValues.isNumericOperator).eq(true);
        expect(await replacement2.stateValues.isNumber).eq(true);
      })
    })
  })

  it('count with sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <count name="numbers"><number>3</number><number>17</number><number>5-4</number></count>
      <count name="numbersAsString">3 17 1</count>
      <count name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</count>
      <count name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</count>
      <count name="numericAsString">6/2 17 5-4</count>
      <count name="numericAsStringSimplify" simplify>6/2 17 5-4</count>
      <count name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</count>
      <count name="numbersAsMacros">$a$b$c</count>
      <count name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</count>
      <count name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</count>
      <count name="numbersAsMacros2">$a $b $c</count>
      <count name="withNumberMathMacro">$aNumberMath$b$c</count>
      <count name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</count>
      <count name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</count>
      <count name="withNumericMathMacro">$aNumericMath$b$c</count>
      <count name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</count>
      <count name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</count>
      <count name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></count>
      <count name="varsAsString">x x+y x+y+z</count>
      <count name="varsAsStringSimplify" simplify>x x+y x+y+z</count>
      <count name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</count>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numbersAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numbersAsStringForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numbersAsStringForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numericAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numericAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numericAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numbersAsMacros').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numbersAsMacros2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/withNumberMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/withNumericMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/withNumericMathMacroSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/withNumericMathMacroForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/varsAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/varsAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/varsAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(3);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsString'].stateValues.value.tree).eq(3);
        expect(components['/numbersAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsString'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.value.tree).eq(3);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsStringForceSymbolic'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.value.tree).eq(3);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsString'].stateValues.value.tree).eq(3);
        expect(components['/numericAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsString'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringSimplify'].stateValues.value.tree).eq(3);
        expect(components['/numericAsStringSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringForceNumeric'].stateValues.value.tree).eq(3);
        expect(components['/numericAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros'].stateValues.value.tree).eq(3);
        expect(components['/numbersAsMacros'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eq(3);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacrosForceSymbolic'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.value.tree).eq(3);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros2'].stateValues.value.tree).eq(3);
        expect(components['/numbersAsMacros2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros2'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacro'].stateValues.value.tree).eq(3);
        expect(components['/withNumberMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacro'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eq(3);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacroForceSymbolic'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.value.tree).eq(3);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacro'].stateValues.value.tree).eq(3);
        expect(components['/withNumericMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacro'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroSimplify'].stateValues.value.tree).eq(3);
        expect(components['/withNumericMathMacroSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.value.tree).eq(3);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eq(3);
        expect(components['/vars'].stateValues.isNumericOperator).eq(true);
        expect(await components['/vars'].stateValues.isNumber).eq(true);
        expect(components['/varsAsString'].stateValues.value.tree).eq(3);
        expect(components['/varsAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsString'].stateValues.isNumber).eq(true);
        expect(components['/varsAsStringSimplify'].stateValues.value.tree).eq(3);
        expect(components['/varsAsStringSimplify'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/varsAsStringForceNumeric'].stateValues.value.tree).eq(3);
        expect(components['/varsAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsStringForceNumeric'].stateValues.isNumber).eq(true);
      })
    })
  })

  // need to upgrade mathjs to get the count function
  it.skip('count as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">count(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>count(3,17,5-4)</math>
      <math name="numberStringProduct">count(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>count(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        count(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      count(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        count(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        count(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        count($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        count($a,$b,$c)
      </math>
      <math name="macrosProduct">
        count($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        count($a$b$c)
      </math>
      <math name="group">
        count($nums)
      </math>
      <math name="groupSimplify" simplify>
        count($nums)
      </math>
      <math name="groupPlus">
        count($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        count($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        count($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        count($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        count($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        count($a, $b, $nums, $c)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3,17,5−4)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numberStringProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3⋅17⋅5−4)')
    });
    cy.get('#\\/numberStringProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3,17,1)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/numberComponentsProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3⋅17⋅1)')
    });
    cy.get('#\\/numberComponentsProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3,17,1)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/macrosProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3⋅17⋅1)')
    });
    cy.get('#\\/macrosProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3,17,1)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/groupPlus').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlusSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    });
    cy.get('#\\/groupPlus2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlus2Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    });
    cy.get('#\\/groupPlus3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('count(3,17,3,17,1,1)')
    });
    cy.get('#\\/groupPlus3Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'count', ["tuple", 3, 17, ["+", 5, ["-", 4]]]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(3);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberStringProduct'].stateValues.value.tree).eqls(['apply', 'count', ["+", ["*", 3, 17, 5], ["-", 4]]]);
        expect(await components['/numberStringProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberStringProductSimplify'].stateValues.value.tree).eq(1);
        expect(await components['/numberStringProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'count', ["tuple", 3, 17, 1]]);
        expect(await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(3);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberComponentsProduct'].stateValues.value.tree).eqls(['apply', 'count', ["*", 3, 17, 1]]);
        expect(await components['/numberComponentsProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsProductSimplify'].stateValues.value.tree).eq(1);
        expect(await components['/numberComponentsProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'count', ["tuple", 3, 17, 1]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(3);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/macrosProduct'].stateValues.value.tree).eqls(['apply', 'count', ["*", 3, 17, 1]]);
        expect(await components['/macrosProduct'].stateValues.isNumber).eq(false);
        expect(components['/macrosProductSimplify'].stateValues.value.tree).eq(1);
        expect(await components['/macrosProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'count', ["tuple", 3, 17, 1]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(3);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus'].stateValues.value.tree).eqls(['apply', 'count', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus'].stateValues.isNumber).eq(false);
        expect(components['/groupPlusSimplify'].stateValues.value.tree).eq(6);
        expect(await components['/groupPlusSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus2'].stateValues.value.tree).eqls(['apply', 'count', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus2'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus2Simplify'].stateValues.value.tree).eq(6);
        expect(await components['/groupPlus2Simplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus3'].stateValues.value.tree).eqls(['apply', 'count', ["tuple", 3, 17, 3, 17, 1, 1]]);
        expect(await components['/groupPlus3'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus3Simplify'].stateValues.value.tree).eq(6);
        expect(await components['/groupPlus3Simplify'].stateValues.isNumber).eq(true);


      })
    })
  })

  it('count additional cases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="pPrime">Count of first primes: <count name="countPrime">2 3 5 7</count></p>
    <p>Copying that count: <copy tname="countPrime" /></p>
    <copy tname="pPrime" />

    <p name="p100">Count of numbers from 1 to 100: <count name="count100"><sequence to="100" /></count></p>
    <p>Copying that count: <copy tname="count100" /></p>
    <copy tname="p100" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let count2Anchor = cesc('#' + components['/_copy1'].replacements[0].componentName);
      let count3Anchor = cesc('#' + components['/_copy2'].replacements[0].componentName);
      let count5Anchor = cesc('#' + components['/_copy3'].replacements[0].componentName);
      let count6Anchor = cesc('#' + components['/_copy4'].replacements[0].componentName);

      cy.log('Test value displayed in browser')

      cy.get('#\\/countPrime').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      });
      cy.get(count2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      });
      cy.get(count3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4')
      });
      cy.get('#\\/count100').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('100')
      });
      cy.get(count5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('100')
      });
      cy.get(count6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('100')
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        expect(components['/countPrime'].stateValues.value.tree).eq(4);
        expect(components['/_copy1'].replacements[0].stateValues.value.tree).eq(4);
        expect(components['/_copy2'].replacements[0].activeChildren[1].stateValues.value.tree).eq(4);
        expect(components['/count100'].stateValues.value.tree).eq(100);
        expect(components['/_copy3'].replacements[0].stateValues.value.tree).eq(100);
        expect(components['/_copy4'].replacements[0].activeChildren[1].stateValues.value.tree).eq(100);
      })

    })
  })

  it('min', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <min name="numbers"><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></min>
      <min name="withNumberMin"><math>3</math><min><number>17</number><number>5-4</number></min></min>
      <min name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('min(3,17,1)')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('min(3,17,1)')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('min(62,17,1)')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/withNumberMin').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('min(x,x+y,x+y+z)')
      });
      cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('min(x,x+y,x+y+z)')
      });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('min(x,x+y,x+y+z)')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(1);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1]]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(1);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(1);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1]]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(1);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", ['/', 6, 2], 17, 1]]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(1);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(1);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMin'].stateValues.value.tree).eq(1);
        expect(components['/withNumberMin'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMin'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsSimplify'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).eq(1);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        expect(replacement2.stateValues.value.tree).eqls(['apply', 'min', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })
  })

  it('min with sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <min name="numbers"><number>3</number><number>17</number><number>5-4</number></min>
      <min name="numbersAsString">3 17 1</min>
      <min name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</min>
      <min name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</min>
      <min name="numericAsString">6/2 17 5-4</min>
      <min name="numericAsStringSimplify" simplify>6/2 17 5-4</min>
      <min name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</min>
      <min name="numbersAsMacros">$a$b$c</min>
      <min name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</min>
      <min name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</min>
      <min name="numbersAsMacros2">$a $b $c</min>
      <min name="withNumberMathMacro">$aNumberMath$b$c</min>
      <min name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</min>
      <min name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</min>
      <min name="withNumericMathMacro">$aNumericMath$b$c</min>
      <min name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</min>
      <min name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</min>
      <min name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></min>
      <min name="varsAsString">x x+y x+y+z</min>
      <min name="varsAsStringSimplify" simplify>x x+y x+y+z</min>
      <min name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</min>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numbersAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numbersAsStringForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,1)')
    });
    cy.get('#\\/numbersAsStringForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numericAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(62,17,5−4)')
    });
    cy.get('#\\/numericAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numericAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numbersAsMacros').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,1)')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numbersAsMacros2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/withNumberMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,1)')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/withNumericMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(62,17,1)')
    });
    cy.get('#\\/withNumericMathMacroSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/withNumericMathMacroForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(x,x+y,x+y+z)')
    });
    cy.get('#\\/varsAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(x,x+y,x+y+z)')
    });
    cy.get('#\\/varsAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(x,x+y,x+y+z)')
    });
    cy.get('#\\/varsAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(1);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsString'].stateValues.value.tree).eq(1);
        expect(components['/numbersAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsString'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1]]);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.value.tree).eq(1);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsString'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", ['/', 6, 2], 17, ['+', 5, ['-', 4]]]]);
        expect(components['/numericAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsString'].stateValues.isNumber).eq(false);
        expect(components['/numericAsStringSimplify'].stateValues.value.tree).eq(1);
        expect(components['/numericAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringForceNumeric'].stateValues.value.tree).eq(1);
        expect(components['/numericAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros'].stateValues.value.tree).eq(1);
        expect(components['/numbersAsMacros'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1]]);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.value.tree).eq(1);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros2'].stateValues.value.tree).eq(1);
        expect(components['/numbersAsMacros2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros2'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacro'].stateValues.value.tree).eq(1);
        expect(components['/withNumberMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacro'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1]]);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.value.tree).eq(1);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacro'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", ['/', 6, 2], 17, 1]]);
        expect(components['/withNumericMathMacro'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacro'].stateValues.isNumber).eq(false);
        expect(components['/withNumericMathMacroSimplify'].stateValues.value.tree).eq(1);
        expect(components['/withNumericMathMacroSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacroSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.value.tree).eq(1);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsAsString'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/varsAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsString'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringSimplify'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/varsAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsStringSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringForceNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsStringForceNumeric'].stateValues.isNumber).eq(false);
      })
    })
  })

  it('min as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">min(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>min(3,17,5-4)</math>
      <math name="numberStringProduct">min(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>min(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        min(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      min(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        min(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        min(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        min($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        min($a,$b,$c)
      </math>
      <math name="macrosProduct">
        min($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        min($a$b$c)
      </math>
      <math name="group">
        min($nums)
      </math>
      <math name="groupSimplify" simplify>
        min($nums)
      </math>
      <math name="groupPlus">
        min($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        min($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        min($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        min($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        min($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        min($a, $b, $nums, $c)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,5−4)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numberStringProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3⋅17⋅5−4)')
    });
    cy.get('#\\/numberStringProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('251')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,1)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/numberComponentsProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3⋅17⋅1)')
    });
    cy.get('#\\/numberComponentsProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,1)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/macrosProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3⋅17⋅1)')
    });
    cy.get('#\\/macrosProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,1)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/groupPlus').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlusSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/groupPlus2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlus2Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/groupPlus3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('min(3,17,3,17,1,1)')
    });
    cy.get('#\\/groupPlus3Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, ["+", 5, ["-", 4]]]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(1);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberStringProduct'].stateValues.value.tree).eqls(['apply', 'min', ["+", ["*", 3, 17, 5], ["-", 4]]]);
        expect(await components['/numberStringProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberStringProductSimplify'].stateValues.value.tree).eq(251);
        expect(await components['/numberStringProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1]]);
        expect(await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(1);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberComponentsProduct'].stateValues.value.tree).eqls(['apply', 'min', ["*", 3, 17, 1]]);
        expect(await components['/numberComponentsProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/numberComponentsProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(1);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/macrosProduct'].stateValues.value.tree).eqls(['apply', 'min', ["*", 3, 17, 1]]);
        expect(await components['/macrosProduct'].stateValues.isNumber).eq(false);
        expect(components['/macrosProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/macrosProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(1);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus'].stateValues.isNumber).eq(false);
        expect(components['/groupPlusSimplify'].stateValues.value.tree).eq(1);
        expect(await components['/groupPlusSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus2'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus2'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus2Simplify'].stateValues.value.tree).eq(1);
        expect(await components['/groupPlus2Simplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus3'].stateValues.value.tree).eqls(['apply', 'min', ["tuple", 3, 17, 3, 17, 1, 1]]);
        expect(await components['/groupPlus3'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus3Simplify'].stateValues.value.tree).eq(1);
        expect(await components['/groupPlus3Simplify'].stateValues.isNumber).eq(true);


      })
    })
  })

  it('max', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <max name="numbers"><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersForceSymbolic" forceSymbolic><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMath"><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMathForceSymbolic" forceSymbolic><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><math>3</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMath"><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMathSimplify" simplify><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="numbersWithNumericMathForceNumeric" forceNumeric><math>6/2</math><number>17</number><number>5-4</number></max>
      <max name="withNumberMax"><math>3</math><max><number>17</number><number>5-4</number></max></max>
      <max name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsSimplify" simplify><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsForcedNumeric" forceNumeric><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <copy tname="numbers" />
      <copy tname="vars" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);
      let replacement2 = components['/_copy2'].replacements[0];
      let replacement2Anchor = cesc('#' + replacement2.componentName);

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('17')
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('max(3,17,1)')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('17')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('17')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('max(3,17,1)')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('17')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('max(62,17,1)')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('17')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('17')
      });
      cy.get('#\\/withNumberMax').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('17')
      });
      cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('max(x,x+y,x+y+z)')
      });
      cy.get('#\\/varsSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('max(x,x+y,x+y+z)')
      });
      cy.get('#\\/varsForcedNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('NaN')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('17')
      });
      cy.get(replacement2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('max(x,x+y,x+y+z)')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(17);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1]]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(17);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(17);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1]]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(17);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", ['/', 6, 2], 17, 1]]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(17);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(17);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMax'].stateValues.value.tree).eq(17);
        expect(components['/withNumberMax'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMax'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsSimplify'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/varsSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsForcedNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsForcedNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsForcedNumeric'].stateValues.isNumber).eq(false);
        expect(replacement1.stateValues.value.tree).eq(17);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
        expect(replacement2.stateValues.value.tree).eqls(['apply', 'max', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(await replacement2.stateValues.isNumericOperator).eq(false);
        expect(await replacement2.stateValues.isNumber).eq(false);
      })
    })
  })

  it('max with sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="a">3</number>
      <number name="b">17</number>
      <number name="c">5-4</number>
      <math name="aNumberMath">3</math>
      <math name="aNumericMath">6/2</math>
      <max name="numbers"><number>3</number><number>17</number><number>5-4</number></max>
      <max name="numbersAsString">3 17 1</max>
      <max name="numbersAsStringForceSymbolic" forceSymbolic>3 17 1</max>
      <max name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>3 17 1</max>
      <max name="numericAsString">6/2 17 5-4</max>
      <max name="numericAsStringSimplify" simplify>6/2 17 5-4</max>
      <max name="numericAsStringForceNumeric" forceNumeric>6/2 17 5-4</max>
      <max name="numbersAsMacros">$a$b$c</max>
      <max name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b$c</max>
      <max name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b$c</max>
      <max name="numbersAsMacros2">$a $b $c</max>
      <max name="withNumberMathMacro">$aNumberMath$b$c</max>
      <max name="withNumberMathMacroForceSymbolic" forceSymbolic>$aNumberMath$b$c</max>
      <max name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$aNumberMath$b$c</max>
      <max name="withNumericMathMacro">$aNumericMath$b$c</max>
      <max name="withNumericMathMacroSimplify" simplify>$aNumericMath$b$c</max>
      <max name="withNumericMathMacroForceNumeric" forceNumeric>$aNumericMath$b$c</max>
      <max name="vars"><math>x</math><math>x+y</math><math>x+y+z</math></max>
      <max name="varsAsString">x x+y x+y+z</max>
      <max name="varsAsStringSimplify" simplify>x x+y x+y+z</max>
      <max name="varsAsStringForceNumeric" forceNumeric>x x+y x+y+z</max>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numbersAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numbersAsStringForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,1)')
    });
    cy.get('#\\/numbersAsStringForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numericAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(62,17,5−4)')
    });
    cy.get('#\\/numericAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numericAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numbersAsMacros').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,1)')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numbersAsMacros2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/withNumberMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,1)')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/withNumericMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(62,17,1)')
    });
    cy.get('#\\/withNumericMathMacroSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/withNumericMathMacroForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/vars').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(x,x+y,x+y+z)')
    });
    cy.get('#\\/varsAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(x,x+y,x+y+z)')
    });
    cy.get('#\\/varsAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(x,x+y,x+y+z)')
    });
    cy.get('#\\/varsAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('NaN')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(17);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsString'].stateValues.value.tree).eq(17);
        expect(components['/numbersAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsString'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1]]);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.value.tree).eq(17);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsString'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", ['/', 6, 2], 17, ['+', 5, ['-', 4]]]]);
        expect(components['/numericAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsString'].stateValues.isNumber).eq(false);
        expect(components['/numericAsStringSimplify'].stateValues.value.tree).eq(17);
        expect(components['/numericAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringForceNumeric'].stateValues.value.tree).eq(17);
        expect(components['/numericAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros'].stateValues.value.tree).eq(17);
        expect(components['/numbersAsMacros'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1]]);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.value.tree).eq(17);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros2'].stateValues.value.tree).eq(17);
        expect(components['/numbersAsMacros2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros2'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacro'].stateValues.value.tree).eq(17);
        expect(components['/withNumberMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacro'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1]]);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.value.tree).eq(17);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacro'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", ['/', 6, 2], 17, 1]]);
        expect(components['/withNumericMathMacro'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacro'].stateValues.isNumber).eq(false);
        expect(components['/withNumericMathMacroSimplify'].stateValues.value.tree).eq(17);
        expect(components['/withNumericMathMacroSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacroSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.value.tree).eq(17);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/vars'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/vars'].stateValues.isNumericOperator).eq(false);
        expect(await components['/vars'].stateValues.isNumber).eq(false);
        expect(components['/varsAsString'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/varsAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsString'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringSimplify'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 'x', ['+', 'x', 'y'], ['+', 'x', 'y', 'z']]]);
        expect(components['/varsAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/varsAsStringSimplify'].stateValues.isNumber).eq(false);
        expect(components['/varsAsStringForceNumeric'].stateValues.value.tree).eqls(NaN);
        expect(components['/varsAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/varsAsStringForceNumeric'].stateValues.isNumber).eq(false);
      })
    })
  })

  it('max as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">3</number>
        <number name="b">17</number>
        <number name="c">5-4</number>
      </group>
      <math name="numberString">max(3,17,5-4)</math>
      <math name="numberStringSimplify" simplify>max(3,17,5-4)</math>
      <math name="numberStringProduct">max(3 17 5-4)</math>
      <math name="numberStringProductSimplify" simplify>max(3 17 5-4)</math>
      <math name="numberComponentsCommas">
        max(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      max(<number>3</number>,<number>17</number>,<number>5-4</number>)
      </math>
      <math name="numberComponentsProduct">
        max(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="numberComponentsProductSimplify" simplify>
        max(<number>3</number><number>17</number><number>5-4</number>)
      </math>
      <math name="macrosCommas">
        max($a,$b,$c)
      </math>
      <math name="macrosCommasSimplify" simplify>
        max($a,$b,$c)
      </math>
      <math name="macrosProduct">
        max($a$b$c)
      </math>
      <math name="macrosProductSimplify" simplify>
        max($a$b$c)
      </math>
      <math name="group">
        max($nums)
      </math>
      <math name="groupSimplify" simplify>
        max($nums)
      </math>
      <math name="groupPlus">
        max($nums, $a, $b, $c)
      </math>
      <math name="groupPlusSimplify" simplify>
        max($nums, $a, $b, $c)
      </math>
      <math name="groupPlus2">
        max($a, $b, $c, $nums)
      </math>
      <math name="groupPlus2Simplify" simplify>
        max($a, $b, $c, $nums)
      </math>
      <math name="groupPlus3">
        max($a, $b, $nums, $c)
      </math>
      <math name="groupPlus3Simplify" simplify>
        max($a, $b, $nums, $c)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,5−4)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numberStringProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3⋅17⋅5−4)')
    });
    cy.get('#\\/numberStringProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('251')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,1)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/numberComponentsProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3⋅17⋅1)')
    });
    cy.get('#\\/numberComponentsProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,1)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/macrosProduct').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3⋅17⋅1)')
    });
    cy.get('#\\/macrosProductSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('51')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,1)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/groupPlus').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlusSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/groupPlus2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,1,3,17,1)')
    });
    cy.get('#\\/groupPlus2Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });
    cy.get('#\\/groupPlus3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('max(3,17,3,17,1,1)')
    });
    cy.get('#\\/groupPlus3Simplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('17')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, ["+", 5, ["-", 4]]]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(17);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberStringProduct'].stateValues.value.tree).eqls(['apply', 'max', ["+", ["*", 3, 17, 5], ["-", 4]]]);
        expect(await components['/numberStringProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberStringProductSimplify'].stateValues.value.tree).eq(251);
        expect(await components['/numberStringProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1]]);
        expect(await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(17);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numberComponentsProduct'].stateValues.value.tree).eqls(['apply', 'max', ["*", 3, 17, 1]]);
        expect(await components['/numberComponentsProduct'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/numberComponentsProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(17);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);
        expect(components['/macrosProduct'].stateValues.value.tree).eqls(['apply', 'max', ["*", 3, 17, 1]]);
        expect(await components['/macrosProduct'].stateValues.isNumber).eq(false);
        expect(components['/macrosProductSimplify'].stateValues.value.tree).eq(51);
        expect(await components['/macrosProductSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(17);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus'].stateValues.isNumber).eq(false);
        expect(components['/groupPlusSimplify'].stateValues.value.tree).eq(17);
        expect(await components['/groupPlusSimplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus2'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 1, 3, 17, 1]]);
        expect(await components['/groupPlus2'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus2Simplify'].stateValues.value.tree).eq(17);
        expect(await components['/groupPlus2Simplify'].stateValues.isNumber).eq(true);

        expect(components['/groupPlus3'].stateValues.value.tree).eqls(['apply', 'max', ["tuple", 3, 17, 3, 17, 1, 1]]);
        expect(await components['/groupPlus3'].stateValues.isNumber).eq(false);
        expect(components['/groupPlus3Simplify'].stateValues.value.tree).eq(17);
        expect(await components['/groupPlus3Simplify'].stateValues.isNumber).eq(true);


      })
    })
  })

  it('mod', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <mod name="numbers"><number>17</number><number>3</number></mod>
      <mod name="numbersForceSymbolic" forceSymbolic><number>17</number><number>3</number></mod>
      <mod name="numbersForceSymbolicSimplify" forceSymbolic simplify><number>17</number><number>3</number></mod>
      <mod name="numbersWithNumberMath"><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumberMathForceSymbolic" forceSymbolic><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumberMathForceSymbolicSimplify" forceSymbolic simplify><number>17</number><math>3</math></mod>
      <mod name="numbersWithNumericMath"><number>17</number><math>6/2</math></mod>
      <mod name="numbersWithNumericMathSimplify" simplify><number>17</number><math>6/2</math></mod>
      <mod name="numbersWithNumericMathForceNumeric" forceNumeric><number>17</number><math>6/2</math></mod>
      <mod name="withNumberMod"><math>17</math><mod><number>16</number><number>9</number></mod></mod>
      <copy tname="numbers" />
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let replacement1 = components['/_copy1'].replacements[0];
      let replacement1Anchor = cesc('#' + replacement1.componentName);

      cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      });
      cy.get('#\\/numbersForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('mod(17,3)')
      });
      cy.get('#\\/numbersForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      });
      cy.get('#\\/numbersWithNumberMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('mod(17,3)')
      });
      cy.get('#\\/numbersWithNumberMathForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      });
      cy.get('#\\/numbersWithNumericMath').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('mod(17,62)')
      });
      cy.get('#\\/numbersWithNumericMathSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      });
      cy.get('#\\/numbersWithNumericMathForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      });
      cy.get('#\\/withNumberMod').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3')
      });
      cy.get(replacement1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('2')
      });
      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(2);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersForceSymbolic'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(components['/numbersForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.value.tree).eq(2);
        expect(components['/numbersForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMath'].stateValues.value.tree).eq(2);
        expect(components['/numbersWithNumberMath'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumberMath'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.value.tree).eq(2);
        expect(components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumberMathForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMath'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, ['/', 6, 2]]]);
        expect(components['/numbersWithNumericMath'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMath'].stateValues.isNumber).eq(false);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.value.tree).eq(2);
        expect(components['/numbersWithNumericMathSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersWithNumericMathSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.value.tree).eq(2);
        expect(components['/numbersWithNumericMathForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersWithNumericMathForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMod'].stateValues.value.tree).eq(3);
        expect(components['/withNumberMod'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMod'].stateValues.isNumber).eq(true);
        expect(replacement1.stateValues.value.tree).eq(2);
        expect(await replacement1.stateValues.isNumericOperator).eq(true);
        expect(await replacement1.stateValues.isNumber).eq(true);
      })
    })
  })

  it('mod with sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <number name="a">17</number>
      <number name="b">3</number>
      <math name="bNumberMath">3</math>
      <math name="bNumericMath">6/2</math>
      <mod name="numbers"><number>17</number><number>3</number></mod>
      <mod name="numbersAsString">17 3</mod>
      <mod name="numbersAsStringForceSymbolic" forceSymbolic>17 3</mod>
      <mod name="numbersAsStringForceSymbolicSimplify" forceSymbolic simplify>17 3</mod>
      <mod name="numericAsString">17 6/2</mod>
      <mod name="numericAsStringSimplify" simplify>17 6/2</mod>
      <mod name="numericAsStringForceNumeric" forceNumeric>17 6/2</mod>
      <mod name="numbersAsMacros">$a$b</mod>
      <mod name="numbersAsMacrosForceSymbolic" forceSymbolic>$a$b</mod>
      <mod name="numbersAsMacrosForceSymbolicSimplify" forceSymbolic simplify>$a$b</mod>
      <mod name="numbersAsMacros2">$a $b</mod>
      <mod name="withNumberMathMacro">$a$bNumberMath</mod>
      <mod name="withNumberMathMacroForceSymbolic" forceSymbolic>$a$bNumberMath</mod>
      <mod name="withNumberMathMacroForceSymbolicSimplify" forceSymbolic simplify>$a$bNumberMath</mod>
      <mod name="withNumericMathMacro">$a$bNumericMath</mod>
      <mod name="withNumericMathMacroSimplify" simplify>$a$bNumericMath</mod>
      <mod name="withNumericMathMacroForceNumeric" forceNumeric>$a$bNumericMath</mod>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numbers').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/numbersAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/numbersAsStringForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,3)')
    });
    cy.get('#\\/numbersAsStringForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/numericAsString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,62)')
    });
    cy.get('#\\/numericAsStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/numericAsStringForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/numbersAsMacros').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,3)')
    });
    cy.get('#\\/numbersAsMacrosForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/numbersAsMacros2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/withNumberMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolic').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,3)')
    });
    cy.get('#\\/withNumberMathMacroForceSymbolicSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/withNumericMathMacro').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,62)')
    });
    cy.get('#\\/withNumericMathMacroSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/withNumericMathMacroForceNumeric').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numbers'].stateValues.value.tree).eq(2);
        expect(components['/numbers'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbers'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsString'].stateValues.value.tree).eq(2);
        expect(components['/numbersAsString'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsString'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(components['/numbersAsStringForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.value.tree).eq(2);
        expect(components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsStringForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsString'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, ['/', 6, 2]]]);
        expect(components['/numericAsString'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsString'].stateValues.isNumber).eq(false);
        expect(components['/numericAsStringSimplify'].stateValues.value.tree).eq(2);
        expect(components['/numericAsStringSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numericAsStringSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numericAsStringForceNumeric'].stateValues.value.tree).eq(2);
        expect(components['/numericAsStringForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numericAsStringForceNumeric'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros'].stateValues.value.tree).eq(2);
        expect(components['/numbersAsMacros'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(components['/numbersAsMacrosForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.value.tree).eq(2);
        expect(components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/numbersAsMacrosForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/numbersAsMacros2'].stateValues.value.tree).eq(2);
        expect(components['/numbersAsMacros2'].stateValues.isNumericOperator).eq(true);
        expect(await components['/numbersAsMacros2'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacro'].stateValues.value.tree).eq(2);
        expect(components['/withNumberMathMacro'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumberMathMacro'].stateValues.isNumber).eq(true);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(components['/withNumberMathMacroForceSymbolic'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolic'].stateValues.isNumber).eq(false);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.value.tree).eq(2);
        expect(components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumberMathMacroForceSymbolicSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacro'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, ['/', 6, 2]]]);
        expect(components['/withNumericMathMacro'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacro'].stateValues.isNumber).eq(false);
        expect(components['/withNumericMathMacroSimplify'].stateValues.value.tree).eq(2);
        expect(components['/withNumericMathMacroSimplify'].stateValues.isNumericOperator).eq(false);
        expect(await components['/withNumericMathMacroSimplify'].stateValues.isNumber).eq(true);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.value.tree).eq(2);
        expect(components['/withNumericMathMacroForceNumeric'].stateValues.isNumericOperator).eq(true);
        expect(await components['/withNumericMathMacroForceNumeric'].stateValues.isNumber).eq(true);
      })
    })
  })

  it('mod as math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <group name="nums">
        <number name="a">17</number>
        <number name="b">3</number>
      </group>
      <math name="numberString">mod(17,3)</math>
      <math name="numberStringSimplify" simplify>mod(17,3)</math>
      <math name="numberComponentsCommas">
        mod(<number>17</number>,<number>3</number>)
      </math>
      <math name="numberComponentsCommasSimplify" simplify>
      mod(<number>17</number>,<number>3</number>)
      </math>
      <math name="macrosCommas">
        mod($a,$b)
      </math>
      <math name="macrosCommasSimplify" simplify>
        mod($a,$b)
      </math>
      <math name="group">
        mod($nums)
      </math>
      <math name="groupSimplify" simplify>
        mod($nums)
      </math>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/numberString').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,3)')
    });
    cy.get('#\\/numberStringSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/numberComponentsCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,3)')
    });
    cy.get('#\\/numberComponentsCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/macrosCommas').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,3)')
    });
    cy.get('#\\/macrosCommasSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });
    cy.get('#\\/group').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('mod(17,3)')
    });
    cy.get('#\\/groupSimplify').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      cy.window().then(async (win) => {
        expect(components['/numberString'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(await components['/numberString'].stateValues.isNumber).eq(false);
        expect(components['/numberStringSimplify'].stateValues.value.tree).eq(2);
        expect(await components['/numberStringSimplify'].stateValues.isNumber).eq(true);

        expect(components['/numberComponentsCommas'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(await components['/numberComponentsCommas'].stateValues.isNumber).eq(false);
        expect(components['/numberComponentsCommasSimplify'].stateValues.value.tree).eq(2);
        expect(await components['/numberComponentsCommasSimplify'].stateValues.isNumber).eq(true);

        expect(components['/macrosCommas'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(await components['/macrosCommas'].stateValues.isNumber).eq(false);
        expect(components['/macrosCommasSimplify'].stateValues.value.tree).eq(2);
        expect(await components['/macrosCommasSimplify'].stateValues.isNumber).eq(true);

        expect(components['/group'].stateValues.value.tree).eqls(['apply', 'mod', ["tuple", 17, 3]]);
        expect(await components['/group'].stateValues.isNumber).eq(false);
        expect(components['/groupSimplify'].stateValues.value.tree).eq(2);
        expect(await components['/groupSimplify'].stateValues.isNumber).eq(true);

      })
    })
  })

  it('gcd', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <gcd><number>135</number><number>81</number></gcd>
      <gcd>135 81 63</gcd>
      <gcd>x y z</gcd>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load


    cy.get('#\\/_gcd1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('27')
    });
    cy.get('#\\/_gcd2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9')
    });
    cy.get('#\\/_gcd3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('gcd(x,y,z)')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
   
      expect(components['/_gcd1'].stateValues.value.tree).eq(27);
      expect(components['/_gcd2'].stateValues.value.tree).eq(9);
      expect(components['/_gcd3'].stateValues.value.tree).eqls(["apply", "gcd", ["tuple", "x", "y", "z"]]);


    })
  })


  it('extract parts of math expression', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p>original expression: <math name="expr" functionSymbols="f g">f(x)+g(y,z)+h(q)</math></p>
      <p>Operator: <extractMathOperator name="operator">$expr</extractMathOperator></p>
      <p>Number of operands: <extractMath type="numberOfOperands" name="numOperands">$expr</extractMath></p>
      <p>First operand: <extractMath type="Operand" name="operand1" operandNumber="1">$expr</extractMath></p>
      <p>Second operand: <extractMath type="Operand" name="operand2" operandNumber="2">$expr</extractMath></p>
      <p>Third operand: <extractMath type="Operand" name="operand3" operandNumber="3">$expr</extractMath></p>
      <p>No fourth operand: <extractMath type="Operand" name="blank1" operandNumber="4">$expr</extractMath></p>
      <p>Function from first operand: <extractMath type="function" name="f">$operand1</extractMath></p>
      <p>Function from second operand: <extractMath type="function" name="g">$operand2</extractMath></p>
      <p>No function from third operand: <extractMath type="function" name="blank2">$operand3</extractMath></p>
      <p>Function argument from first operand: <extractMath type="functionArgument" name="farg1">$operand1</extractMath></p>
      <p>Function argument from first operand again: <extractMath type="functionArgument" argumentNumber="1" name="farg1a">$operand1</extractMath></p>
      <p>No second function argument from first operand: <extractMath type="functionArgument" argumentNumber="2" name="blank3">$operand1</extractMath></p>
      <p>All function arguments from second operand: <extractMath type="functionArgument" name="gargAll">$operand2</extractMath></p>
      <p>First function argument from second operand: <extractMath type="functionArgument" argumentNumber="1" name="garg1">$operand2</extractMath></p>
      <p>Second function argument from second operand: <extractMath type="functionArgument" argumentNumber="2" name="garg2">$operand2</extractMath></p>
      <p>No third function argument from second operand: <extractMath type="functionArgument" argumentNumber="3" name="blank4">$operand2</extractMath></p>
      <p>No function argument from third operand: <extractMath type="functionArgument" name="blank5">$operand3</extractMath></p>
      <p>Number of operands from first operand: <extractMath type="numberofoperands" name="numOperands1">$operand1</extractMath></p>
      <p>First operand from first operand: <extractMath type="operand" operandNumber="1" name="operand11">$operand1</extractMath></p>


      <p>Pick operand number: <mathinput name="nOperand" prefill="1" /></p>
      <p>Resulting operand: <extractMath type="operand" operandNumber="$nOperand" name="operandN">$expr</extractMath></p>
      <p>Function of resulting operand: <extractMath type="function" name="functionN">$operandN</extractMath></p>
      <p>Pick argument number: <mathinput name="nArgument" prefill="1" /></p>
      <p>Resulting argument: <extractMath type="functionArgument" argumentNumber="$nArgument" name="argumentN">$operandN</extractMath></p>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/operator').should('have.text', '+')
    cy.get('#\\/numOperands').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    });
    cy.get('#\\/operand1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)')
    });
    cy.get('#\\/operand2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g(y,z)')
    });
    cy.get('#\\/operand3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hq')
    });
    cy.get('#\\/blank1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    });
    cy.get('#\\/g').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    });
    cy.get('#\\/blank2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/farg1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/farg1a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.get('#\\/blank3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/gargAll').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(y,z)')
    });
    cy.get('#\\/garg1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.get('#\\/garg2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.get('#\\/blank4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/blank5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/numOperands1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    });
    cy.get('#\\/operand11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)')
    });
    cy.get('#\\/operandN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f(x)')
    });
    cy.get('#\\/functionN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('f')
    });
    cy.get('#\\/argumentN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/operator'].stateValues.value).eq('+')
      expect(components['/numOperands'].stateValues.value.tree).eq(3)
      expect(components['/operand1'].stateValues.value.tree).eqls(['apply', 'f', 'x'])
      expect(components['/operand2'].stateValues.value.tree).eqls(['apply', 'g', ["tuple",'y',"z"]])
      expect(components['/operand3'].stateValues.value.tree).eqls(['*', 'h', 'q'])
      expect(components['/blank1'].stateValues.value.tree).eqls('＿')
      expect(components['/f'].stateValues.value.tree).eqls('f')
      expect(components['/g'].stateValues.value.tree).eqls('g')
      expect(components['/blank2'].stateValues.value.tree).eqls('＿')
      expect(components['/farg1'].stateValues.value.tree).eqls('x')
      expect(components['/farg1a'].stateValues.value.tree).eqls('x')
      expect(components['/blank3'].stateValues.value.tree).eqls('＿')
      expect(components['/gargAll'].stateValues.value.tree).eqls(["tuple",'y',"z"])
      expect(components['/garg1'].stateValues.value.tree).eqls('y')
      expect(components['/garg2'].stateValues.value.tree).eqls('z')
      expect(components['/blank4'].stateValues.value.tree).eqls('＿')
      expect(components['/blank5'].stateValues.value.tree).eqls('＿')
      expect(components['/numOperands1'].stateValues.value.tree).eq(1)
      expect(components['/operand11'].stateValues.value.tree).eqls(['apply', 'f', 'x'])

      expect(components['/operandN'].stateValues.value.tree).eqls(['apply', 'f', 'x'])
      expect(components['/functionN'].stateValues.value.tree).eqls('f')
      expect(components['/argumentN'].stateValues.value.tree).eqls('x')

    })

    cy.get('#\\/nArgument textarea').type('{end}{backspace}2', { force: true }).blur();
    cy.get('#\\/argumentN .mjx-mrow').should('contain.text', '＿')
    cy.get('#\\/argumentN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/argumentN'].stateValues.value.tree).eqls('＿')
    })

    cy.get('#\\/nOperand textarea').type('{end}{backspace}2', { force: true }).blur();
    cy.get('#\\/operandN .mjx-mrow').should('contain.text', 'g(y,z)')
      cy.get('#\\/operandN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g(y,z)')
    });
    cy.get('#\\/functionN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('g')
    });
    cy.get('#\\/argumentN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/operandN'].stateValues.value.tree).eqls(['apply', 'g', ["tuple",'y',"z"]])
      expect(components['/functionN'].stateValues.value.tree).eqls('g')
      expect(components['/argumentN'].stateValues.value.tree).eqls('z')
    })

    cy.get('#\\/nArgument textarea').type('{end}{backspace}3', { force: true }).blur();
    cy.get('#\\/argumentN .mjx-mrow').should('contain.text', '＿')
    cy.get('#\\/argumentN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/argumentN'].stateValues.value.tree).eqls('＿')
    })


    cy.get('#\\/nArgument textarea').type('{end}{backspace}1', { force: true }).blur();
    cy.get('#\\/argumentN .mjx-mrow').should('contain.text', 'y')
    cy.get('#\\/argumentN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/argumentN'].stateValues.value.tree).eqls('y')
    })

    cy.get('#\\/nOperand textarea').type('{end}{backspace}3', { force: true }).blur();
    cy.get('#\\/operandN .mjx-mrow').should('contain.text', 'hq')
    cy.get('#\\/operandN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('hq')
    });
    cy.get('#\\/functionN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/argumentN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/operandN'].stateValues.value.tree).eqls(['*', 'h', 'q'])
      expect(components['/functionN'].stateValues.value.tree).eqls('＿')
      expect(components['/argumentN'].stateValues.value.tree).eqls('＿')
    })

    cy.get('#\\/nOperand textarea').type('{end}{backspace}4', { force: true }).blur();
    cy.get('#\\/operandN .mjx-mrow').should('contain.text', '＿')
    cy.get('#\\/operandN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/functionN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.get('#\\/argumentN').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('＿')
    });
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/operandN'].stateValues.value.tree).eqls('＿')
      expect(components['/functionN'].stateValues.value.tree).eqls('＿')
      expect(components['/argumentN'].stateValues.value.tree).eqls('＿')
    })


  })


})
