import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'

export default class Section extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    let heading = null;

    let id = this.componentName + "_title";

    let childrenToRender = this.children;

    let title;
    if (this.doenetSvData.titleDefinedByChildren) {
      title = this.children[0]
      childrenToRender = this.children.slice(1); // remove title
    } else {
      title = this.doenetSvData.title;
    }

    if (this.doenetSvData.level === 0) {
      heading = <h1 id={id}>{title}</h1>;
    } else if (this.doenetSvData.level === 1) {
      heading = <h2 id={id}>{title}</h2>;
    } else if (this.doenetSvData.level === 2) {
      heading = <h3 id={id}>{title}</h3>;
    } else if (this.doenetSvData.level === 3) {
      heading = <h4 id={id}>{title}</h4>;
    } else if (this.doenetSvData.level === 4) {
      heading = <h5 id={id}>{title}</h5>;
    } else if (this.doenetSvData.level === 5){
      heading = <h6 id={id}>{title}</h6>;
    }

    let checkworkComponent = null;

    if (this.doenetSvData.createSubmitAllButton) {

      let validationState = "unvalidated";
      if (this.doenetSvData.justSubmitted) {
        if (this.doenetSvData.creditAchieved === 1) {
          validationState = "correct";
        } else if (this.doenetSvData.creditAchieved === 0) {
          validationState = "incorrect";
        } else {
          validationState = "partialcorrect";
        }
      }

      let checkWorkStyle = {
        height: "23px",
        display: "inline-block",
        backgroundColor: "rgb(2, 117, 216)",
        padding: "1px 6px 1px 6px",
        color: "white",
        fontWeight: "bold",
        marginBottom: "30px",  //Space after check work
      }

      let checkWorkText = "Check Work";
      if (!this.doenetSvData.showCorrectness) {
        checkWorkText = "Submit nse";
      }
      checkworkComponent = (
        <button id={this.componentName + "_submit"}
          tabIndex="0"
          style={checkWorkStyle}
          onClick={this.actions.submitAllAnswers}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.actions.submitAllAnswers();
            }
          }}
        >
          <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
      &nbsp;
          {checkWorkText}
        </button>);

      if (this.doenetSvData.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkworkComponent = (
            <span id={this.componentName + "_correct"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCheck} />
          &nbsp;
          Correct
            </span>);
        } else if (validationState === "incorrect") {
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkworkComponent = (
            <span id={this.componentName + "_incorrect"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faTimes} />
          &nbsp;
          Incorrect
            </span>);
        } else if (validationState === "partialcorrect") {
          checkWorkStyle.backgroundColor = "#efab34";
          let percent = Math.round(this.doenetSvData.creditAchieved * 100);
          let partialCreditContents = `${percent}% Correct`;

          checkworkComponent = (
            <span id={this.componentName + "_partial"}
              style={checkWorkStyle}
            >
              {partialCreditContents}
            </span>);
        }
      } else {
        // showCorrectness is false
        if (validationState !== "unvalidated") {
          checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
          checkworkComponent = (
            <span id={this.componentName + "_saved"}
              style={checkWorkStyle}
            >
              <FontAwesomeIcon icon={faCloud} />
          &nbsp;
          Response Saved
            </span>);
        }
      }

      checkworkComponent = <div>{checkworkComponent}</div>
    }

    if (this.doenetSvData.containerTag === "aside") {
      return <aside id={this.componentName} >
        <a name={this.componentName} />
        {heading}
        {childrenToRender}
        {checkworkComponent}
      </aside>
    } else if (this.doenetSvData.containerTag === "div") {
      return <div id={this.componentName} >
        <a name={this.componentName} />
        {heading}
        {childrenToRender}
        {checkworkComponent}
      </div>
    } else if (this.doenetSvData.containerTag === "none") {
      return <>
        <a name={this.componentName} />
        {heading}
        {childrenToRender}
        {checkworkComponent}
      </>
    } else {
      return <section id={this.componentName} >
        <a name={this.componentName} />
        {heading}
        {childrenToRender}
        {checkworkComponent}
      </section>
    }
  }
}