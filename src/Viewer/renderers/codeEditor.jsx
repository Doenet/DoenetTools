import React from 'react';
import ReactDOM from 'react-dom';
import DoenetRenderer from './DoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import { sizeToCSS } from './utils/css';


export default class CodeEditor extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);

    this.currentValue = this.doenetSvData.value;
    this.valueToRevertTo = this.doenetSvData.value;

  }

  static initializeChildrenOnConstruction = false;



  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.valueToRevertTo = this.doenetSvData.value;
      if (this.doenetSvData.value !== this.doenetSvData.immediateValue) {
        this.actions.updateValue();
      }
      if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
        this.actions.submitAnswer();
      }
      this.forceUpdate();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Escape") {
      this.actions.updateImmediateValue({
        text: this.valueToRevertTo
      });
      this.forceUpdate();
    }
  }

  handleFocus(e) {
    this.focused = true;
    this.forceUpdate();
  }

  handleBlur(e) {
    this.focused = false;
    this.valueToRevertTo = this.doenetSvData.immediateValue;
    if (this.doenetSvData.immediateValue !== this.doenetSvData.value) {
      this.actions.updateValue();
    }

    this.forceUpdate();
  }

  onChangeHandler(e) {
    this.currentValue = e.target.value;
    this.actions.updateImmediateValue({
      text: e.target.value
    });
    this.forceUpdate();
  }

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    let disabled = this.doenetSvData.disabled;

    const inputKey = this.componentName + '_input';

    let surroundingBorderColor = "#efefef";
    if (this.focused) {
      surroundingBorderColor = "#82a5ff";
    }


    if (this.doenetSvData.immediateValue !== this.currentValue) {
      this.currentValue = this.doenetSvData.immediateValue;
      this.valueToRevertTo = this.doenetSvData.immediateValue;
    }


    let input = <textarea
        key={inputKey}
        id={inputKey}
        value={this.currentValue}
        disabled={disabled}
        onChange={this.onChangeHandler}
        onKeyPress={this.handleKeyPress}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        style={{
          width: sizeToCSS(this.doenetSvData.width),
          height: sizeToCSS(this.doenetSvData.height),
          fontSize: "14px",
          borderWidth: "1px",
          // borderColor: surroundingBorderColor,
          padding: "4px",
        }}
      />
  


    return <React.Fragment>
      <a name={this.componentName} />
      <span className="textInputSurroundingBox" id={this.componentName}>
        {input}
      </span>

    </React.Fragment>

  }
}