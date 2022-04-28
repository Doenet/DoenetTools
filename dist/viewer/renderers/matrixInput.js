import React, {useRef, useState, useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import me from "../../_snowpack/pkg/math-expressions.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Matrix = styled.div`
  position: relative;
  margin: 6px;
  display: inline-block;
  vertical-align: middle;
  width:auto;
  border-style: none;

  :before {
    content: "";
    position: absolute;
    left: -6px;
    top: -6px;
    border: 1px solid #000;
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
    border: 1px solid #000;
    border-left: 0px;
    width: 6px;
    height: 100%;
    padding-top: 6px;
    padding-bottom: 3px;
  }
`;
export default function MatrixInput(props) {
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
  let surroundingBorderColor = "#efefef";
  let checkWorkStyle = {
    position: "relative",
    width: "30px",
    height: "24px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#ffffff",
    display: "inline-block",
    textAlign: "center",
    top: "3px",
    padding: "2px",
    zIndex: "0"
  };
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {
    if (validationState.current === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = "rgb(200,200,200)";
      } else {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
      }
      checkWorkButton = /* @__PURE__ */ React.createElement("button", {
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
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkWorkButton = /* @__PURE__ */ React.createElement("span", {
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
          checkWorkButton = /* @__PURE__ */ React.createElement("span", {
            id: name + "_partial",
            style: checkWorkStyle
          }, partialCreditContents);
        } else {
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkWorkButton = /* @__PURE__ */ React.createElement("span", {
            id: name + "_incorrect",
            style: checkWorkStyle
          }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
            icon: faTimes
          }));
        }
      } else {
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = /* @__PURE__ */ React.createElement("span", {
          id: name + "_saved",
          style: checkWorkStyle
        }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
          icon: faCloud
        }));
      }
    }
    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(no attempts remaining)"));
    } else if (SVs.numberOfAttemptsLeft < Infinity) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(attempts remaining: ", SVs.numberOfAttemptsLeft, ")"));
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
    rowNumControls = /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("button", {
      id: name + "_rowDecrement",
      onClick: () => callAction({
        action: actions.updateNumRows,
        args: {numRows: SVs.numRows - 1}
      }),
      disabled: SVs.numRows < 2
    }, "r-"), /* @__PURE__ */ React.createElement("button", {
      id: name + "_rowIncrement",
      onClick: () => callAction({
        action: actions.updateNumRows,
        args: {numRows: SVs.numRows + 1}
      })
    }, "r+"));
  }
  let colNumControls = null;
  if (SVs.showSizeControls) {
    colNumControls = /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("button", {
      id: name + "_columnDecrement",
      onClick: () => callAction({
        action: actions.updateNumColumns,
        args: {numColumns: SVs.numColumns - 1}
      }),
      disabled: SVs.numColumns < 2
    }, "c-"), /* @__PURE__ */ React.createElement("button", {
      id: name + "_columnIncrement",
      onClick: () => callAction({
        action: actions.updateNumColumns,
        args: {numColumns: SVs.numColumns + 1}
      })
    }, "c+"));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement(Matrix, {
    className: "matrixInputSurroundingBox",
    id: name
  }, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("tbody", null, matrixInputs))), rowNumControls, colNumControls, checkWorkButton);
}
