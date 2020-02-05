import React from 'react';
import me from 'math-expressions';
import ReactTextInput from './ReactTextInput';
import BaseRenderer from './BaseRenderer';

class MathinputRenderer extends BaseRenderer {
  constructor({ actions, mathExpression, key, includeCheckWork, creditAchieved,
    valueHasBeenValidated, size, showCorrectness, disabled }) {

    super({ key: key });

    this.actions = actions;
    this.includeCheckWork = includeCheckWork;
    this.creditAchieved = creditAchieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.size = size;
    this.showCorrectness = showCorrectness;
    this.disabled = disabled;

    let initialTextValue = mathExpression.toString();
    //Remove __ value so it doesn't show
    if (initialTextValue === '\uFF3F') { initialTextValue = ""; }

    this.pushNewTextValue = this.pushNewTextValue.bind(this);

    this.sharedState = {
      textValue: initialTextValue
    }

    this.mathExpression = mathExpression;
    this.changeInitiatedWithThisComponent = false;

  }

  pushNewTextValue() {

    let newMathExpression = this.calculateMathExpressionFromText();
    if (!this.mathExpressionExactEquality(newMathExpression, this.mathExpression)) {
      this.mathExpression = newMathExpression;
      this.actions.updateMathExpression({
        mathExpression: this.mathExpression
      });
    }

  }

  mathExpressionExactEquality(mathExpression1, mathExpression2) {
    // TODO: a better deep comparison of mathExpression
    // using an internal function that doesn't rely on tree?
    return JSON.stringify(mathExpression1.tree) === JSON.stringify(mathExpression2.tree);
  }

  updateMathinputRenderer({ mathExpression, creditAchieved, valueHasBeenValidated,
    disabled, changeInitiatedWithThisComponent
  }) {

    if (mathExpression !== undefined) {
      // TODO: what should happen when have an invalid expression?
      if (!this.mathExpressionExactEquality(mathExpression, this.mathExpression)) {
        this.mathExpression = mathExpression;
        let textValue = this.mathExpression.toString();
        if (textValue === '\uFF3F') {
          textValue = "";
        }
        //tell the render it has a new value
        this.sharedState.textValue = textValue;
      }
    }

    this.creditAchieved = creditAchieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.disabled = disabled;
    this.changeInitiatedWithThisComponent = changeInitiatedWithThisComponent;

  }

  calculateMathExpressionFromText() {
    let expression;
    try {
      expression = me.fromText(this.sharedState.textValue);
    } catch (e) {
      // TODO: error on bad text
      expression = me.fromAst('\uFF3F');

    }
    return expression;
  }

  jsxCode() {

    return <ReactTextInput
      free={{ sharedState: this.sharedState, pushNewTextValue: this.pushNewTextValue }}
      key={this._key}
      _key={this._key}
      includeCheckWork={this.includeCheckWork}
      actions={this.actions}
      creditAchieved={this.creditAchieved}
      valueHasBeenValidated={this.valueHasBeenValidated}
      showMathPreview={true}
      size={this.size}
      showCorrectness={this.showCorrectness}
      disabled={this.disabled}
      changeInitiatedWithThisComponent={this.changeInitiatedWithThisComponent}
    />
  }

}

let AvailableRenderers = {
  mathinput: MathinputRenderer,
}

export default AvailableRenderers;
