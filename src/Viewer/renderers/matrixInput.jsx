import React, { useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
// import me from 'math-expressions';
import ActionButton from '../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import './mathInput.css';

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

  const Button = styled.button `
    position: relative;
    width: 24px;
    height: 24px;
    display: inline-block;
    color: white;
    background-color: var(--mainBlue);
    /* border: var(--mainBorder); */
    padding: 2px;
    border: none;
    border-radius: var(--mainBorderRadius);
    margin: 0px 4px 4px 0px;


    &:hover {
      background-color: var(--lightBlue);
      color: black;
    };
  `;

export default React.memo(function MatrixInput(props) {
  let { name, id, SVs, actions, children, callAction } = useDoenetRender(props);

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

  // const inputKey = id + '_input';

  let surroundingBorderColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray");
  // if (this.focused) {
  //   surroundingBorderColor = "#82a5ff";
  // }

  let checkWorkStyle = {
    cursor: "pointer",
    padding: "1px 6px 1px 6px",
  }

  //Assume we don't have a check work button
  let checkWorkButton = null;
  if (SVs.includeCheckWork && !SVs.suppressCheckwork) {

    if (validationState.current === "unvalidated") {
      if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGray")
        ;
      }
      checkWorkButton = <Button
        id={id + '_submit'}
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
      </Button>
    } else {
      if (SVs.showCorrectness) {
        if (validationState.current === "correct") {
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainGreen")
          ;
          checkWorkButton = <Button
            id={id + '_correct'}
            style={checkWorkStyle}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
        } else if (validationState.current === "partialcorrect") {
          //partial credit

          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = '44px';

          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = <Button
            id={id + '_partial'}
            style={checkWorkStyle}
          >{partialCreditContents}</Button>
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--mainRed")
          ;
          checkWorkButton = <Button
            id={id + '_incorrect'}
            style={checkWorkStyle}
          ><FontAwesomeIcon icon={faTimes} /></Button>

        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkStyle.padding = "1px 8px 1px 4px"; // To center the faCloud icon
        checkWorkButton = <Button
          id={id + '_saved'}
          style={checkWorkStyle}
        ><FontAwesomeIcon icon={faCloud} /></Button>

      }
    }

    if (SVs.numberOfAttemptsLeft < 0) {
      checkWorkButton = <>
        {checkWorkButton}
        <span>
          (no attempts remaining)
        </span>
      </>
    } else if (SVs.numberOfAttemptsLeft == 1) {

      checkWorkButton = <>
        {checkWorkButton}
        <span>
          (1 attempt remaining)
        </span>
      </>
    } else if (SVs.numberOfAttemptsLeft < Infinity) {

      checkWorkButton = <>
        {checkWorkButton}
        <span>
          ({SVs.numberOfAttemptsLeft} attempts remaining)
        </span>
      </>
    }

  }


  let matrixInputs = [];

  for (let rowInd = 0; rowInd < SVs.numRows; rowInd++) {
    let mathinputRow = [];

    for (let colInd = 0; colInd < SVs.numColumns; colInd++) {
      mathinputRow.push(
        <td key={colInd} className="matrixCell" id={id + "_component_" + rowInd + "_" + colInd}>
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
    rowNumControls = <span style={{margin: "0px 4px 4px 0px"}}>
      <ActionButtonGroup>
      <ActionButton id={id + "_rowDecrement"} value="r-" onClick={() => callAction({
        action: actions.updateNumRows,
        args: { numRows: SVs.numRows - 1 }
      })} disabled={SVs.numRows < 2}>
        r-
      </ActionButton>
      <ActionButton id={id + "_rowIncrement"} value="r+" onClick={() => callAction({
        action: actions.updateNumRows,
        args: { numRows: SVs.numRows + 1 }
      })}>
        r+
      </ActionButton>
      </ActionButtonGroup>
    </span>
  }
  let colNumControls = null;
  if (SVs.showSizeControls) {
    colNumControls = <span style={{margin: "0px 4px 4px 0px"}}>
      <ActionButtonGroup>
      <ActionButton id={id + "_columnDecrement"} value="c-" onClick={() => callAction({
        action: actions.updateNumColumns,
        args: { numColumns: SVs.numColumns - 1 }
      })} disabled={SVs.numColumns < 2}>
        c-
      </ActionButton>
      <ActionButton id={id + "_columnIncrement"} value="c+" onClick={() => callAction({
        action: actions.updateNumColumns,
        args: { numColumns: SVs.numColumns + 1 }
      })}>
        c+
      </ActionButton>
      </ActionButtonGroup>
    </span>
  }


  return <React.Fragment>
    <a name={id} />
      <div style={{display: "inline-flex", margin: "0px 4px 4px 4px"}}>
        <Matrix className="matrixInputSurroundingBox" id={id}>
          <table><tbody>
            {matrixInputs}
          </tbody></table>
        </Matrix>
        <div style={{marginRight: "4px"}}></div>
        {rowNumControls}
        {colNumControls}
        {checkWorkButton}
      </div>
  </React.Fragment>

})



