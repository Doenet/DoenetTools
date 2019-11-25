import React from 'react';
import ReactTextInput from './ReactTextInput';
import BaseRenderer from './BaseRenderer';

class TextinputRenderer extends BaseRenderer {
  constructor({ actions, text, key, includeCheckWork, creditachieved,
    valueHasBeenValidated, numbertimessubmitted, size, showCorrectness }) {
    super({ key: key });

    this.actions = actions;
    this.includeCheckWork = includeCheckWork;
    this.creditachieved = creditachieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.numbertimessubmitted = numbertimessubmitted;
    this.size = size;
    this.showCorrectness = showCorrectness;

    this.initialTextValue = text;
    this.text = text;

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

  updateTextinputRenderer({ text, creditachieved, valueHasBeenValidated, numbertimessubmitted }) {

    if (text !== this.text) {
      this.text = text;
      this.sharedState.textValue = text;
    }

    this.creditachieved = creditachieved;
    this.valueHasBeenValidated = valueHasBeenValidated;
    this.numbertimessubmitted = numbertimessubmitted;

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
      creditachieved={this.creditachieved}
      valueHasBeenValidated={this.valueHasBeenValidated}
      numbertimessubmitted={this.numbertimessubmitted}
      showMathPreview={false}
      size={this.size}
      showCorrectness={this.showCorrectness}
    />
  }

}

let AvailableRenderers = {
  textinput: TextinputRenderer,
}

export default AvailableRenderers;
