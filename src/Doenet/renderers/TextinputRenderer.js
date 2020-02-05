import React from 'react';
import ReactTextInput from './ReactTextInput';
import BaseRenderer from './BaseRenderer';

class TextinputRenderer extends BaseRenderer {
  constructor({ actions, text, key, includeCheckWork, creditAchieved,
    valueHasBeenValidated, size, showCorrectness }) {

    super({ key: key });

    this.actions = actions;
    this.includeCheckWork = includeCheckWork;
    this.creditAchieved = creditAchieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.size = size;
    this.showCorrectness = showCorrectness;

    this.initialTextValue = text;
    this.text = text;
    this.changeInitiatedWithThisComponent = false;

    this.sharedState = {
      textValue: this.initialTextValue
    }

    this.pushNewTextValue = this.pushNewTextValue.bind(this);
  }

  pushNewTextValue() {

    if (this.text !== this.sharedState.textValue) {
      this.text = this.sharedState.textValue;
      this.actions.updateText({
        text: this.text
      });
    }
  }

  updateTextinputRenderer({ text, creditAchieved, valueHasBeenValidated,
    changeInitiatedWithThisComponent
  }) {

    if (text !== this.text) {
      this.text = text;
      this.sharedState.textValue = text;
    }

    this.creditAchieved = creditAchieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.changeInitiatedWithThisComponent = changeInitiatedWithThisComponent;

  }

  componentWillUnmount() {
    this.text = undefined;
    if (this.sharedState !== undefined) {
      this.sharedState.textValue = undefined;
    }
    this.sharedState = undefined;
    this.pushNewTextValue = undefined;
    this.initialTextValue = undefined;
  }

  jsxCode() {

    return <ReactTextInput
      key={this._key}
      _key={this._key}
      free={{
        sharedState: this.sharedState,
        pushNewTextValue: this.pushNewTextValue,
      }}
      includeCheckWork={this.includeCheckWork}
      actions={this.actions}
      creditAchieved={this.creditAchieved}
      valueHasBeenValidated={this.valueHasBeenValidated}
      showMathPreview={false}
      size={this.size}
      showCorrectness={this.showCorrectness}
      changeInitiatedWithThisComponent={this.changeInitiatedWithThisComponent}
    />
  }

}

let AvailableRenderers = {
  textinput: TextinputRenderer,
}

export default AvailableRenderers;
