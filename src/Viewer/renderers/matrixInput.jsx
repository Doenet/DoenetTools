import React, { useRef, useState, useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import me from 'math-expressions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

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
`

export default function MatrixInput(props) {
  let { name, SVs, actions, children, ignoreUpdate, callAction } = useDoenetRender(props);

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

  // const inputKey = name + '_input';

  let surroundingBorderColor = "#efefef";
  // if (this.focused) {
  //   surroundingBorderColor = "#82a5ff";
  // }

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
    zIndex: "0",
  }
  //Assume we don't have a check work button
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {

    if (validationState.current === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = "rgb(200,200,200)";
      } else {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
      }
      checkWorkButton = <button
        id={name + '_submit'}
        tabIndex="0"
        disabled={disabled}
        style={checkWorkStyle}
        onClick={() => callAction({
          action: actions.submitAnswer,
        })}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            callAction({
              action: actions.submitAnswer,
            });
          }
        }}
      >
        <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
      </button>
    } else {
      if (SVs.showCorrectness) {
        if (validationState.current === "correct") {
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkWorkButton = <span
            id={name + '_correct'}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
        } else if (validationState.current === "partialcorrect") {
          //partial credit

          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "50px";

          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = <span
            id={name + '_partial'}
            style={checkWorkStyle}
          >{partialCreditContents}</span>
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkWorkButton = <span
            id={name + '_incorrect'}
            style={checkWorkStyle}
          ><FontAwesomeIcon icon={faTimes} /></span>

        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = <span
          id={name + '_saved'}
          style={checkWorkStyle}
        ><FontAwesomeIcon icon={faCloud} /></span>

      }
    }

    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = <>
        {checkWorkButton}
        <span>
          (no attempts remaining)
        </span>
      </>
    } else if (SVs.numberOfAttemptsLeft < Infinity) {

      checkWorkButton = <>
        {checkWorkButton}
        <span>
          (attempts remaining: {SVs.numberOfAttemptsLeft})
        </span>
      </>
    }

  }


  let matrixInputs = [];

  for (let rowInd = 0; rowInd < SVs.numRows; rowInd++) {
    let mathinputRow = [];

    for (let colInd = 0; colInd < SVs.numColumns; colInd++) {
      mathinputRow.push(
        <td style={{ margin: "10px" }} key={colInd} id={name + "_component_" + rowInd + "_" + colInd}>
          {children[rowInd * SVs.numColumns + colInd]}
        </td>
      )
    }

    matrixInputs.push(
      <tr key={rowInd}>
        {mathinputRow}
      </tr>
    )

  }

  let rowNumControls = null;
  if (SVs.showSizeControls) {
    rowNumControls = <span>
      <button id={name + "_rowDecrement"} onClick={() => callAction({
        action: actions.updateNumRows,
        args: { numRows: SVs.numRows - 1 }
      })} disabled={SVs.numRows < 2}>
        r-
      </button>
      <button id={name + "_rowIncrement"} onClick={() => callAction({
        action: actions.updateNumRows,
        args: { numRows: SVs.numRows + 1 }
      })}>
        r+
      </button>
    </span>
  }
  let colNumControls = null;
  if (SVs.showSizeControls) {
    colNumControls = <span>
      <button id={name + "_columnDecrement"} onClick={() => callAction({
        action: actions.updateNumColumns,
        args: { numColumns: SVs.numColumns - 1 }
      })} disabled={SVs.numColumns < 2}>
        c-
      </button>
      <button id={name + "_columnIncrement"} onClick={() => callAction({
        action: actions.updateNumColumns,
        args: { numColumns: SVs.numColumns + 1 }
      })}>
        c+
      </button>
    </span>
  }


  return <React.Fragment>
    <a name={name} />
    <Matrix className="matrixInputSurroundingBox" id={name}>
      <table><tbody>
        {matrixInputs}
      </tbody></table>
    </Matrix>
    {rowNumControls}
    {colNumControls}
    {checkWorkButton}
  </React.Fragment>

}



