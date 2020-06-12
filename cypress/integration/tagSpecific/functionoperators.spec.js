import me from 'math-expressions';

describe('Function Operator Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('clamp function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <function name="original">x^3</function>
    <clampfunction name="clamp01"><ref>original</ref></clampfunction>
    <clampfunction name="clampn35" lowervalue="-3" uppervalue="5"><ref>original</ref></clampfunction>

    <p><aslist>
    <map>
      <template>
        <evaluate numeric="true"><ref>original</ref><subsref/></evaluate>
      </template>
      <substitutions><sequence step="0.2">-2,2</sequence></substitutions>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template>
        <evaluate numeric="true"><ref>clamp01</ref><subsref/></evaluate>
      </template>
      <substitutions><sequence step="0.2">-2,2</sequence></substitutions>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template>
        <evaluate numeric="true"><ref>clampn35</ref><subsref/></evaluate>
      </template>
      <substitutions><sequence step="0.2">-2,2</sequence></substitutions>
    </map>
    </aslist></p>
    <p><aslist>
      <ref>_map2</ref>
    </aslist></p>
    <p><aslist>
      <ref>_map3</ref>
    </aslist></p>
    `}, "*");
    });

    let clamp01 = x => Math.min(1, Math.max(0, x));
    let clampn35 = x => Math.min(5, Math.max(-3, x));
    let indToVal = ind => me.math.round((0.2 * (ind - 11)) ** 3, 8);

    for (let i = 1; i <= 21; i++) {
      cy.get('#\\/__map1_' + (i-1) +'_evaluate1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(indToVal(i).toString())
      });

      cy.get('#\\/__map2_' + (i-1) +'_evaluate2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(clamp01(indToVal(i)).toString())
      });

      cy.get('#\\/__map3_' + (i-1) +'_evaluate3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(clampn35(indToVal(i)).toString())
      });

      cy.get('#__evaluate' + i).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(clamp01(indToVal(i)).toString())
      });

      cy.get('#__evaluate' + (i + 21)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(clampn35(indToVal(i)).toString())
      });
    }


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let i = 1; i <= 21; i++) {
        expect(components['/__map1_' + (i-1) + '_evaluate1'].state.value.tree).closeTo(indToVal(i), 1E-10);
        expect(components['/__map2_' + (i-1) + '_evaluate2'].state.value.tree).closeTo(clamp01(indToVal(i)), 1E-10);
        expect(components['/__map3_' + (i-1) + '_evaluate3'].state.value.tree).closeTo(clampn35(indToVal(i)), 1E-10);
        expect(components['__evaluate' + i].state.value.tree).closeTo(clamp01(indToVal(i)), 1E-10);
        expect(components['__evaluate' + (i + 21)].state.value.tree).closeTo(clampn35(indToVal(i)), 1E-10);
      }
    })
  })


  it('wrap function', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <function name="original">x^3</function>
    <wrapfunctionperiodic name="wrap01"><ref>original</ref></wrapfunctionperiodic>
    <wrapfunctionperiodic name="wrapn23" lowervalue="-2" uppervalue="3"><ref>original</ref></wrapfunctionperiodic>

    <p><aslist>
    <map>
      <template>
        <evaluate numeric="true"><ref>original</ref><subsref/></evaluate>
      </template>
      <substitutions><sequence step="0.2">-2,2</sequence></substitutions>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template>
        <evaluate numeric="true"><ref>wrap01</ref><subsref/></evaluate>
      </template>
      <substitutions><sequence step="0.2">-2,2</sequence></substitutions>
    </map>
    </aslist></p>
    <p><aslist>
    <map>
      <template>
        <evaluate numeric="true"><ref>wrapn23</ref><subsref/></evaluate>
      </template>
      <substitutions><sequence step="0.2">-2,2</sequence></substitutions>
    </map>
    </aslist></p>
    <p><aslist>
      <ref>_map2</ref>
    </aslist></p>
    <p><aslist>
      <ref>_map3</ref>
    </aslist></p>
    `}, "*");
    });

    let wrap01 = x => me.math.round(me.math.mod(x, 1), 8);
    let wrapn23 = x => me.math.round(-2 + me.math.mod(x + 2, 5), 8);
    let indToVal = ind => me.math.round((0.2 * (ind - 11)) ** 3, 8);

    for (let i = 1; i <= 21; i++) {
      cy.get('#\\/__map1_' + (i-1) +'_evaluate1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(indToVal(i).toString())
      });

      cy.get('#\\/__map2_' + (i-1) +'_evaluate2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(wrap01(indToVal(i)).toString())
      });

      cy.get('#\\/__map3_' + (i-1) +'_evaluate3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(wrapn23(indToVal(i)).toString())
      });

      cy.get('#__evaluate' + i).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(wrap01(indToVal(i)).toString())
      });

      cy.get('#__evaluate' + (i + 21)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace('−', '-')).equal(wrapn23(indToVal(i)).toString())
      });
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let i = 1; i <= 21; i++) {
        expect(components['/__map1_' + (i-1) + '_evaluate1'].state.value.tree).closeTo(indToVal(i), 1E-10);
        expect(components['/__map2_' + (i-1) + '_evaluate2'].state.value.tree).closeTo(wrap01(indToVal(i)), 1E-10);
        expect(components['/__map3_' + (i-1) + '_evaluate3'].state.value.tree).closeTo(wrapn23(indToVal(i)), 1E-10);
        expect(components['__evaluate' + i].state.value.tree).closeTo(wrap01(indToVal(i)), 1E-10);
        expect(components['__evaluate' + (i + 21)].state.value.tree).closeTo(wrapn23(indToVal(i)), 1E-10);
      }
    })
  })


})
