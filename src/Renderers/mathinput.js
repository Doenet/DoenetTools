import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import me from 'math-expressions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'


export default class MathInput extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);

    this.mathExpression = this.doenetSvData.value;
    this.textValue = this.doenetSvData.value.toString();

    this.valueToRevertTo = this.mathExpression;
    this.textValueToRevertTo = this.textValue;

    //Remove __ value so it doesn't show
    if (this.textValue === '\uFF3F') { this.textValue = ""; }

  }

  static initializeChildrenOnConstruction = false;

  calculateMathExpressionFromText(text) {
    let expression;
    try {
      expression = me.fromText(text);
    } catch (e) {
      // TODO: error on bad text
      expression = me.fromAst('\uFF3F');

    }
    return expression;
  }

  updateMathExpressionFromText(text) {
    this.textValue = text;
    let newMathExpression = this.calculateMathExpressionFromText(text);
    if (!newMathExpression.equalsViaSyntax(this.mathExpression)) {
      this.mathExpression = newMathExpression;
      this.actions.updateMathExpression({
        mathExpression: newMathExpression
      });
    }
  }


  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.valueToRevertTo = this.doenetSvData.value;
      this.textValueToRevertTo = this.textValue;
      if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
        this.actions.submitAnswer();
      }
      this.forceUpdate();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Escape") {
      if (!this.mathExpression.equalsViaSyntax(this.valueToRevertTo)) {
        this.textValue = this.textValueToRevertTo;
        this.mathExpression = this.valueToRevertTo;
        this.actions.updateMathExpression({
          mathExpression: this.valueToRevertTo
        });
        this.forceUpdate();
      }
    }
  }

  handleFocus(e) {
    this.focused = true;
    this.forceUpdate();
  }

  handleBlur(e) {
    this.focused = false;
    this.valueToRevertTo = this.doenetSvData.value;

    this.forceUpdate();
  }

  onChangeHandler(e) {
    this.updateMathExpressionFromText(e.target.value)
    this.forceUpdate();
  }

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    const inputKey = this.componentName + '_input';

    let surroundingBorderColor = "#efefef";
    if (this.focused) {
      surroundingBorderColor = "#82a5ff";
    }

    if (!this.mathExpression.equalsViaSyntax(this.doenetSvData.value)) {
      this.mathExpression = this.doenetSvData.value;
      this.textValue = this.mathExpression.toString();
      if (this.textValue === '\uFF3F') {
        this.textValue = "";
      }
      this.valueToRevertTo = this.doenetSvData.value;
      this.textValueToRevertTo = this.textValue;

    }

    return <React.Fragment>
      <a name={this.componentName} />
      <span className="textInputSurroundingBox" id={this.componentName}>
        <input
          key={inputKey}
          id={inputKey}
          value={this.textValue}
          disabled={this.doenetSvData.disabled}
          onChange={this.onChangeHandler}
          onKeyPress={this.handleKeyPress}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          style={{
            width: `${this.doenetSvData.size * 10}px`,
            height: "22px",
            fontSize: "14px",
            borderWidth: "1px",
            borderColor: surroundingBorderColor,
            padding: "4px",
          }}
        />
      </span>

    </React.Fragment>

  }
}