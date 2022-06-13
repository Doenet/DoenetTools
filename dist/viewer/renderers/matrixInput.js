import React, {useRef} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Matrix = styled.div`
  position: relative;
  margin: 6px;
  display: inline-block;
  vertical-align: middle;
  width: auto;

  :before {
    content: "";
    position: absolute;
    left: -6px;
    top: -6px;
    border: var(--mainBorder);
    border-right: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }

  :after {
    content: "";
    position: absolute;
    right: -6px;
    top: -6px;
    border: var(--mainBorder);
    border-left: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }
`;
const Button = styled.button`
    position: relative;
    width: 24px;
    height: 24px;
    display: inline-block;
    color: white;
    background-color: var(--mainBlue);
    /* border: var(--mainBorder); */
    /* padding: 2px; */
    border: none;
    border-radius: var(--mainBorderRadius);
    margin: 0px 10px 12px 10px;


    &:hover {
      background-color: var(--lightBlue);
      color: black;
    };
  `;
export default React.memo(function MatrixInput(props) {
  let {name, SVs, actions, children, callAction} = useDoenetRender(props);
  let validationState = useRef(null);
  function updateValidationState() {
    validationState.current = "unvalidated";
    if (SVs.valueHasBeenValidated || SVs.numberOfAttemptsLeft < 1) {
      if (SVs.creditAchieved === 1) {
        validationState.current = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState.current = "incorrect";
      } else {
        validationState.current = "partialcorrect";
      }
    }
  }
  if (SVs.hidden) {
    return null;
  }
  updateValidationState();
  let disabled = SVs.disabled;
  let surroundingBorderColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
  let checkWorkStyle = {
    cursor: "pointer"
  };
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {
    if (validationState.current === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
      }
      checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
        id: name + "_submit",
        tabIndex: "0",
        disabled,
        style: checkWorkStyle,
        onClick: () => callAction({
          action: actions.submitAnswer
        }),
        onKeyPress: (e) => {
          if (e.key === "Enter") {
            callAction({
              action: actions.submitAnswer
            });
          }
        }
      }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: faLevelDownAlt,
        transform: {rotate: 90}
      }));
    } else {
      if (SVs.showCorrectness) {
        if (validationState.current === "correct") {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen");
          checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
            id: name + "_correct",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faCheck
          }));
        } else if (validationState.current === "partialcorrect") {
          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "50px";
          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
            id: name + "_partial",
            style: checkWorkStyle
          }, partialCreditContents);
        } else {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed");
          checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
            id: name + "_incorrect",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faTimes
          }));
        }
      } else {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = /* @__PURE__ */ React.createElement(Button, {
          id: name + "_saved",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCloud
        }));
      }
    }
    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
    } else if (SVs.numberOfAttemptsLeft == 1) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(1 attempt remaining)"));
    } else if (SVs.numberOfAttemptsLeft < Infinity) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(", SVs.numberOfAttemptsLeft, " attempts remaining)"));
    }
  }
  let matrixInputs = [];
  for (let rowInd = 0; rowInd < SVs.numRows; rowInd++) {
    let mathinputRow = [];
    for (let colInd = 0; colInd < SVs.numColumns; colInd++) {
      mathinputRow.push(/* @__PURE__ */ React.createElement("td", {
        style: {margin: "10px"},
        key: colInd,
        id: name + "_component_" + rowInd + "_" + colInd
      }, children[rowInd * SVs.numColumns + colInd]));
    }
    matrixInputs.push(/* @__PURE__ */ React.createElement("tr", {
      key: rowInd
    }, mathinputRow));
  }
  let rowNumControls = null;
  if (SVs.showSizeControls) {
    rowNumControls = /* @__PURE__ */ React.createElement("span", {
      style: {margin: "0px 10px 12px 10px"}
    }, /* @__PURE__ */ React.createElement(ActionButtonGroup, null, /* @__PURE__ */ React.createElement(ActionButton, {
      id: name + "_rowDecrement",
      value: "r-",
      onClick: () => callAction({
        action: actions.updateNumRows,
        args: {numRows: SVs.numRows - 1}
      }),
      disabled: SVs.numRows < 2
    }, "r-"), /* @__PURE__ */ React.createElement(ActionButton, {
      id: name + "_rowIncrement",
      value: "r+",
      onClick: () => callAction({
        action: actions.updateNumRows,
        args: {numRows: SVs.numRows + 1}
      })
    }, "r+")));
  }
  let colNumControls = null;
  if (SVs.showSizeControls) {
    colNumControls = /* @__PURE__ */ React.createElement("span", {
      style: {margin: "0px 10px 12px 10px"}
    }, /* @__PURE__ */ React.createElement(ActionButtonGroup, null, /* @__PURE__ */ React.createElement(ActionButton, {
      id: name + "_columnDecrement",
      value: "c-",
      onClick: () => callAction({
        action: actions.updateNumColumns,
        args: {numColumns: SVs.numColumns - 1}
      }),
      disabled: SVs.numColumns < 2
    }, "c-"), /* @__PURE__ */ React.createElement(ActionButton, {
      id: name + "_columnIncrement",
      value: "c+",
      onClick: () => callAction({
        action: actions.updateNumColumns,
        args: {numColumns: SVs.numColumns + 1}
      })
    }, "c+")));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", marginBottom: "12px"}
  }, /* @__PURE__ */ React.createElement(Matrix, {
    className: "matrixInputSurroundingBox",
    id: name
  }, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("tbody", null, matrixInputs))), rowNumControls, colNumControls, checkWorkButton));
});
