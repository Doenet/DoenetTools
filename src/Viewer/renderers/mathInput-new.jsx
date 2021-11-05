import React, { useRef, useState, useEffect } from 'react';
import useDoenetRender from '../../Viewer/renderers/useDoenetRenderer';
import ReactDOM from 'react-dom';
import DoenetRenderer from './DoenetRenderer';
import me from 'math-expressions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import mathquill from 'react-mathquill';
mathquill.addStyles(); //Styling for react-mathquill input field
let EditableMathField = mathquill.EditableMathField;
import { focusedMathField, palletRef, buttonRef, functionRef } from '../../Tools/_framework/temp/MathInputSelector'
import {useRecoilValue, useSetRecoilState } from 'recoil';
import { getFromLatex, normalizeLatexString } from '../../Core/utils/math';

// const Prev = styled.div`
//   font-size: 23px;
//   // min-height: 30px;
//   background: rgba(0, 0, 0, 0.8);
//   width: auto;
//   display: inline-block;
//   border-radius: 5px;
//   color: white;
//   // line-height: 0px;
//   z-index: 10;
//   padding: 3px;
//   // position: absolute;
//   user-select: none;
//   // left: ${props => `${props.left}px`};
//   // top: ${props => `${props.top}px`};
// `;

export default function MathInput(props){
  let [name, SVs, actions] = useDoenetRender(props);
  const [latex, setLatex] = useState("");
  const [focused, setFocus] = useState(false);
  let mathExpression = SVs.valueForDisplay;
  let latexValue = stripLatex(SVs.valueForDisplay.toLatex());
  const [mathField, setMathField] = useState(null);
  let validationState = "unvalidated"
  const setFocusedField = useSetRecoilState(focusedMathField);
  let valueToRevertTo = SVs.value;
  let valueForDisplayToRevertTo = SVs.valueForDisplay;
  const containerRef = useRecoilValue(palletRef)
  const toggleButtonRef = useRecoilValue(buttonRef)
  const functionTabRef = useRecoilValue(functionRef)

  if (latexValue === '\uFF3F') { latexValue = ""; }

  let initializeChildrenOnConstruction = false;

  const calculateMathExpressionFromLatex = (text) => {
    let expression;

    text = normalizeLatexString(text);
    let fromLatex = getFromLatex({
      functionSymbols: SVs.functionSymbols,
    });
    try {
      expression = fromLatex(text);
    } catch (e) {
      // TODO: error on bad text
      expression = me.fromAst('\uFF3F');

    }
    return expression;
  }

  const updateImmediateValueFromLatex = (text) => {
    let currentMathExpressionNormalized = calculateMathExpressionFromLatex(latexValue);

    latexValue = text;
    let newMathExpression = calculateMathExpressionFromLatex(text);
    if (!newMathExpression.equalsViaSyntax(currentMathExpressionNormalized)) {
      mathExpression = newMathExpression;
      actions.updateImmediateValue({
        mathExpression: newMathExpression
      });
    }
  }

  const updateValidationState = () => {
    validationState = "unvalidated";
    if (SVs.valueHasBeenValidated) {
      if (SVs.creditAchieved === 1) {
        validationState = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState = "incorrect";
      } else {
        validationState = "partialcorrect";
      }
    }
  }
  const handleVirtualKeyboardClick = (text) => {
    mathField.focus();
    if(!text){
      console.log("Empty value");
      
      return;
    }
    if(text.split(" ")[0] == "cmd"){
      mathField.cmd(text.split(" ")[1]);
    }else if(text.split(" ")[0] == "write"){
      mathField.write(text.split(" ")[1]);
    }else if(text.split(" ")[0] == "keystroke"){
      mathField.keystroke(text.split(" ")[1]);
    }else if(text.split(" ")[0] == "type"){
      mathField.typedText(text.split(" ")[1]);
    }
  }

  const handleDefaultVirtualKeyboardClick = (text) => {
    console.log("no mathinput field focused")
  }

  const handlePressEnter = (e) => {
    valueToRevertTo = SVs.immediateValue;
    valueForDisplayToRevertTo = mathExpression;

    // this.latexValueToRevertTo = this.latexValue;
    if (!SVs.value.equalsViaSyntax(SVs.immediateValue)) {
      actions.updateValue();
    }
    if (SVs.includeCheckWork && validationState === "unvalidated") {
      actions.submitAnswer();
    }
  }

  const handleFocus = (e) => {
    setFocus(true);
    //console.log(">>> ", mathField);
    setFocusedField(() => handleVirtualKeyboardClick);
  }

  const handleBlur = (e) => {
    if (containerRef.current && containerRef.current.contains(e.relatedTarget)) {
      //console.log(">>> clicked inside the panel")
    }else if (toggleButtonRef.current && toggleButtonRef.current.contains(e.relatedTarget)) {
      //console.log(">>> clicked inside the button")
    }else if (functionTabRef.current && functionTabRef.current.contains(e.relatedTarget)) {
      //console.log(">>> clicked inside the panel functional panel")
    }else{
      valueToRevertTo = SVs.immediateValue;
      valueForDisplayToRevertTo = mathExpression;
      // this.latexValueToRevertTo = this.latexValue;
      if (!SVs.value.equalsViaSyntax(SVs.immediateValue)) {
        actions.updateValue();
      }

      setFocus(false);
      //console.log(">>>", e.target, e.currentTarget, e.relatedTarget);
      setFocusedField(() => handleDefaultVirtualKeyboardClick);
    }
  }

  const onChangeHandler = (e) => {
    updateImmediateValueFromLatex(e)
  }

  if (SVs.hidden) {
    return null;
  }

  updateValidationState();

  // const inputKey = this.componentName + '_input';

  let surroundingBorderColor = "#efefef";
  if (focused) {
    surroundingBorderColor = "#82a5ff";
  }

  if (!valueForDisplayToRevertTo.equalsViaSyntax(SVs.valueForDisplay)) {
    // The valueForDisplay coming from the mathInput component
    // is not the same as the renderer's value
    // so we change the renderer's value to match

    mathExpression = SVs.valueForDisplay;
    latexValue = stripLatex(mathExpression.toLatex());
    if (latexValue === '\uFF3F') {
      latexValue = "";
    }
    valueToRevertTo = SVs.value;
    valueForDisplayToRevertTo = SVs.valueForDisplay;
    // this.latexValueToRevertTo = this.latexValue;
  }

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

    if (validationState === "unvalidated") {
      checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
      checkWorkButton = <button
        id={'_submit'}
        tabIndex="0"
        //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
        style={checkWorkStyle}
        onClick={actions.submitAnswer}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            actions.submitAnswer();
          }
        }}
      >
        <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
      </button>
    } else {
      if (SVs.showCorrectness) {
        if (validationState === "correct") {
          checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
          checkWorkButton = <span
            id={'_correct'}
            style={checkWorkStyle}
            //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
        } else if (validationState === "partialcorrect") {
          //partial credit

          let percent = Math.round(SVs.creditAchieved * 100);
          let partialCreditContents = `${percent} %`;
          checkWorkStyle.width = "50px";

          checkWorkStyle.backgroundColor = "#efab34";
          checkWorkButton = <span
            id={'_partial'}
            style={checkWorkStyle}
            //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          >{partialCreditContents}</span>
        } else {
          //incorrect
          checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
          checkWorkButton = <span
            id={'_incorrect'}
            style={checkWorkStyle}
            //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
          ><FontAwesomeIcon icon={faTimes} /></span>

        }
      } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        checkWorkButton = <span
          id={'_saved'}
          style={checkWorkStyle}
          //ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
        ><FontAwesomeIcon icon={faCloud} /></span>

      }
    }
  }

  return(
    <React.Fragment>
      <a/>


      <span className="textInputSurroundingBox">
        {/* <input
        key={inputKey}
        id={inputKey}
        ref = {this.inputRef}
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
          // position: "absolute",
        }}
      /> */}
        <span style={{ margin: "10px" }}>
          <EditableMathField
            latex={latexValue}
            config={{
              autoCommands: "sqrt pi theta integral infinity",
              autoOperatorNames: 'arg deg det dim exp gcd hom ker lg lim ln log max min'
              + ' Pr'
              + ' sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth'
              + ' sin cos tan sec cosec csc cotan cot ctg'
              + ' arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg'
              + ' sinh cosh tanh sech cosech csch cotanh coth ctgh'
              + ' arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh'
              + ' arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh',
              handlers: {
                enter: handlePressEnter
              }
            }}//more commands go here
            onChange={(mathField) => {
              onChangeHandler(mathField.latex())
            }}
            onBlur={handleBlur}
            onFocus={handleFocus}
            mathquillDidMount = {(mf) => {
              //console.log(">>> MathQuilMounted")
              setMathField(mf)}}
          />
          {/* <p>{this.mathExpression.toLatex()}</p> */}
        </span>
        {checkWorkButton}
        {/* {this.textValue ? 
      <Prev style = {{top: this.state.previewTopOffset+"px", left: this.state.previewLeftOffset+"px"}} onMouseDown = {this.handleDragEnter} onMouseMove = {this.handleDragThrough} onMouseUp = {this.handleDragExit} onMouseLeave = {this.handleDragExit}>
        <div>
          <MathJax.Context input='tex'>
              <div>
                  <MathJax.Node inline>{this.textValue ? this.previewValue : ''}</MathJax.Node>
              </div>
          </MathJax.Context>
        </div>
      </Prev> : 
      null} */}
      </span>
    </React.Fragment>
  )
  

}


// export default class MathInput extends DoenetRenderer {
//   constructor(props) {
//     super(props);

//     this.state = { latex: "" };
//     // const [latex, setLatex] = useState("");
//     // const config = {
//     //   autoCommands: "sqrt pi theta",
//     //   autoOperatorNames: "cos sin"
//     // };

//     this.handlePressEnter = this.handlePressEnter.bind(this);
//     // this.handleKeyDown = this.handleKeyDown.bind(this);
//     this.handleBlur = this.handleBlur.bind(this);
//     this.handleFocus = this.handleFocus.bind(this);
//     this.onChangeHandler = this.onChangeHandler.bind(this);
//     // this.handleDragEnter = this.handleDragEnter.bind(this);
//     // this.handleDragThrough = this.handleDragThrough.bind(this);
//     // this.handleDragExit = this.handleDragExit.bind(this);

//     this.mathExpression = this.doenetSvData.valueForDisplay;
//     this.latexValue = stripLatex(this.doenetSvData.valueForDisplay.toLatex());
//     this.mathField = null;

//     // this.state = {isDragging: false, previewLeftOffset: this.doenetSvData.size * 10 + 80, previewTopOffset: 0, clickXOffset: 0, clickYOffset: 0};
//     // this.inputRef = React.createRef();
//     // this.mathInputRef = React.createRef();


//     this.valueToRevertTo = this.doenetSvData.value;
//     this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay;
//     // this.latexValueToRevertTo = this.latexValue;
//     // this.previewValue = "";

//     //Remove __ value so it doesn't show
//     if (this.latexValue === '\uFF3F') { this.latexValue = ""; }

//   }

//   static initializeChildrenOnConstruction = false;

//   componentDidMount() {
//     // if (this && this.mathInputRef){
//     //   let rect = this.mathInputRef.current.getBoundingClientRect();
//     // // this.setState({previewLeftOffset: rect.width + rect.left + 2, previewTopOffset: rect.top -17}); 
//     // this.setState({previewLeftOffset: rect.left, previewTopOffset: rect.height + rect.top - 2 });
//     // }
//   }

//   calculateMathExpressionFromLatex(text) {
//     let expression;

//     text = normalizeLatexString(text);
//     let fromLatex = getCustomFromLatex({
//       functionSymbols: this.doenetSvData.functionSymbols,
//     });
//     try {
//       expression = fromLatex(text);
//     } catch (e) {
//       // TODO: error on bad text
//       expression = me.fromAst('\uFF3F');

//     }
//     return expression;
//   }

//   updateImmediateValueFromLatex(text) {
//     // update immediateValue to the math expression corresponding to text
//     // if the math expression corresponding to text is different 
//     // from the current math expression

//     // to detect changes only due to a different value
//     // (and not to other differences, in particular to representation of scientific notation)
//     // convert the latexValue to a math expression rather than using the current math expression
//     let currentMathExpressionNormalized = this.calculateMathExpressionFromLatex(this.latexValue);

//     this.latexValue = text;
//     let newMathExpression = this.calculateMathExpressionFromLatex(text);
//     if (!newMathExpression.equalsViaSyntax(currentMathExpressionNormalized)) {
//       this.mathExpression = newMathExpression;
//       this.actions.updateImmediateValue({
//         mathExpression: newMathExpression
//       });
//     }

//     // //evalute math expression
//     //   let nextPreviewValue = newMathExpression.toLatex();

//     //   if (nextPreviewValue === "＿"){
//     //     //Error
//     //     clearTimeout(this.timer)
//     //     this.timer = setTimeout(()=>{
//     //       this.previewValue = "Err";
//     //       this.forceUpdate();
//     //     },1000)
//     //   }else{
//     //     //No Error
//     //     clearTimeout(this.timer)
//     //     this.previewValue = nextPreviewValue;
//     //   }


//   }

//   updateValidationState() {

//     this.validationState = "unvalidated";
//     if (this.doenetSvData.valueHasBeenValidated) {
//       if (this.doenetSvData.creditAchieved === 1) {
//         this.validationState = "correct";
//       } else if (this.doenetSvData.creditAchieved === 0) {
//         this.validationState = "incorrect";
//       } else {
//         this.validationState = "partialcorrect";
//       }
//     }
//   }

//   // handleDragEnter(e) {
//   //   this.setState({
//   //     isDragging: true,
//   //     clickXOffset: e.pageX - this.state.previewLeftOffset,
//   //     clickYOffset: e.pageY - this.state.previewTopOffset,
//   //   })
//   // }

//   // handleDragThrough(e) {
//   //   if(this.state.isDragging){
//   //     // console.log();
//   //     this.setState({previewLeftOffset: e.pageX - this.state.clickXOffset, previewTopOffset: e.pageY - this.state.clickYOffset});
//   //   }
//   // }

//   // handleDragExit(e){
//   //   this.setState({
//   //     isDragging: false,
//   //     clickXOffset: 0,
//   //     clickYOffset: 0,
//   //   })
//   // }

//   handlePressEnter(e) {
//     this.valueToRevertTo = this.doenetSvData.immediateValue;
//     this.valueForDisplayToRevertTo = this.mathExpression;

//     // this.latexValueToRevertTo = this.latexValue;
//     if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
//       this.actions.updateValue();
//     }
//     if (this.doenetSvData.includeCheckWork && this.validationState === "unvalidated") {
//       this.actions.submitAnswer();
//     }
//     this.forceUpdate();
//   }

//   // handleKeyDown(e) {
//   //   if (e.key === "Escape") {
//   //     if (!this.mathExpression.equalsViaSyntax(this.valueForDisplayToRevertTo)) {
//   //       this.mathExpression = this.valueForDisplayToRevertTo;
//   //       this.actions.updateImmediateValue({
//   //         mathExpression: this.valueToRevertTo
//   //       });
//   //       this.forceUpdate();
//   //     }
//   //   }
//   // }

//   handleFocus(e) {
//     this.focused = true;
//     this.forceUpdate();
//   }

//   handleBlur(e) {
//     this.focused = false;
//     this.valueToRevertTo = this.doenetSvData.immediateValue;
//     this.valueForDisplayToRevertTo = this.mathExpression;
//     // this.latexValueToRevertTo = this.latexValue;
//     if (!this.doenetSvData.value.equalsViaSyntax(this.doenetSvData.immediateValue)) {
//       this.actions.updateValue();
//     }
//     this.forceUpdate();

//   }

//   onChangeHandler(e) {
//     this.updateImmediateValueFromLatex(e)
//     this.forceUpdate();
//   }



//   render() {

//     if (this.doenetSvData.hidden) {
//       return null;
//     }

//     this.updateValidationState();

//     // const inputKey = this.componentName + '_input';

//     let surroundingBorderColor = "#efefef";
//     if (this.focused) {
//       surroundingBorderColor = "#82a5ff";
//     }

//     if (!this.valueForDisplayToRevertTo.equalsViaSyntax(this.doenetSvData.valueForDisplay)) {
//       // The valueForDisplay coming from the mathInput component
//       // is not the same as the renderer's value
//       // so we change the renderer's value to match

//       this.mathExpression = this.doenetSvData.valueForDisplay;
//       this.latexValue = stripLatex(this.mathExpression.toLatex());
//       if (this.latexValue === '\uFF3F') {
//         this.latexValue = "";
//       }
//       this.valueToRevertTo = this.doenetSvData.value;
//       this.valueForDisplayToRevertTo = this.doenetSvData.valueForDisplay;
//       // this.latexValueToRevertTo = this.latexValue;

//     }

//     let checkWorkStyle = {
//       position: "relative",
//       width: "30px",
//       height: "24px",
//       fontSize: "20px",
//       fontWeight: "bold",
//       color: "#ffffff",
//       display: "inline-block",
//       textAlign: "center",
//       top: "3px",
//       padding: "2px",
//       zIndex: "0",
//     }
//     //Assume we don't have a check work button
//     let checkWorkButton = null;
//     if (this.doenetSvData.includeCheckWork) {

//       if (this.validationState === "unvalidated") {
//         checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
//         checkWorkButton = <button
//           id={this.componentName + '_submit'}
//           tabIndex="0"
//           ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
//           style={checkWorkStyle}
//           onClick={this.actions.submitAnswer}
//           onKeyPress={(e) => {
//             if (e.key === 'Enter') {
//               this.actions.submitAnswer();
//             }
//           }}
//         >
//           <FontAwesomeIcon icon={faLevelDownAlt} transform={{ rotate: 90 }} />
//         </button>
//       } else {
//         if (this.doenetSvData.showCorrectness) {
//           if (this.validationState === "correct") {
//             checkWorkStyle.backgroundColor = "rgb(92, 184, 92)";
//             checkWorkButton = <span
//               id={this.componentName + '_correct'}
//               style={checkWorkStyle}
//               ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
//             >
//               <FontAwesomeIcon icon={faCheck} />
//             </span>
//           } else if (this.validationState === "partialcorrect") {
//             //partial credit

//             let percent = Math.round(this.doenetSvData.creditAchieved * 100);
//             let partialCreditContents = `${percent} %`;
//             checkWorkStyle.width = "50px";

//             checkWorkStyle.backgroundColor = "#efab34";
//             checkWorkButton = <span
//               id={this.componentName + '_partial'}
//               style={checkWorkStyle}
//               ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
//             >{partialCreditContents}</span>
//           } else {
//             //incorrect
//             checkWorkStyle.backgroundColor = "rgb(187, 0, 0)";
//             checkWorkButton = <span
//               id={this.componentName + '_incorrect'}
//               style={checkWorkStyle}
//               ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
//             ><FontAwesomeIcon icon={faTimes} /></span>

//           }
//         } else {
//           // showCorrectness is false
//           checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
//           checkWorkButton = <span
//             id={this.componentName + '_saved'}
//             style={checkWorkStyle}
//             ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
//           ><FontAwesomeIcon icon={faCloud} /></span>

//         }
//       }
//     }
//     return <React.Fragment>
//       <a name={this.componentName} />


//       <span className="textInputSurroundingBox" id={this.componentName}>
//         {/* <input
//         key={inputKey}
//         id={inputKey}
//         ref = {this.inputRef}
//         value={this.textValue}
//         disabled={this.doenetSvData.disabled}
//         onChange={this.onChangeHandler}
//         onKeyPress={this.handleKeyPress}
//         onKeyDown={this.handleKeyDown}
//         onBlur={this.handleBlur}
//         onFocus={this.handleFocus}
//         style={{
//           width: `${this.doenetSvData.size * 10}px`,
//           height: "22px",
//           fontSize: "14px",
//           borderWidth: "1px",
//           borderColor: surroundingBorderColor,
//           padding: "4px",
//           // position: "absolute",
//         }}
//       /> */}
//         <span style={{ margin: "10px" }}>
//           <EditableMathField
//             latex={this.latexValue}
//             config={{
//               autoCommands: "sqrt pi theta integral",
//               handlers: {
//                 enter: this.handlePressEnter
//               }
//             }}//more commands go here
//             onChange={(mathField) => {
//               this.onChangeHandler(mathField.latex())
//             }}
//             onBlur={this.handleBlur}
//             onFocus={this.handleFocus}
//             mathquillDidMount = {(mathField) => this.mathField = mathField}
//           />
//           {/* <p>{this.mathExpression.toLatex()}</p> */}
//         </span>
//         {checkWorkButton}
//         {/* {this.textValue ? 
//       <Prev style = {{top: this.state.previewTopOffset+"px", left: this.state.previewLeftOffset+"px"}} onMouseDown = {this.handleDragEnter} onMouseMove = {this.handleDragThrough} onMouseUp = {this.handleDragExit} onMouseLeave = {this.handleDragExit}>
//         <div>
//           <MathJax.Context input='tex'>
//               <div>
//                   <MathJax.Node inline>{this.textValue ? this.previewValue : ''}</MathJax.Node>
//               </div>
//           </MathJax.Context>
//         </div>
//       </Prev> : 
//       null} */}
//       </span>



//     </React.Fragment>

//   }
// }


function stripLatex(latex) {
  let s = latex.replaceAll(`\\,`, '');

  return s;

}


// TODO: how to fix case where have readyonly?
// need to revert mathExpression in that case

// else if(!this.mathExpression.equalsViaSyntax(this.doenetSvData.immediateValue)) {
//   console.log(`for ${this.componentName}`)
//   console.log(`math expression: ${this.mathExpression.toString()}`)
//   console.log(`immediateValue: ${this.doenetSvData.immediateValue.toString()}`)

//   this.mathExpression = this.doenetSvData.value;
//   this.textValue = this.mathExpression.toString();
//   if (this.textValue === '\uFF3F') {
//     this.textValue = "";
//   }
//   this.valueToRevertTo = this.doenetSvData.value;
//   this.textValueToRevertTo = this.textValue;

// }


