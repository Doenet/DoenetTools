import React, {useRef, useState, useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faCheck,
  faLevelDownAlt,
  faTimes,
  faCloud
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import mathquill from "../../_snowpack/pkg/react-mathquill.js";
mathquill.addStyles();
let EditableMathField = mathquill.EditableMathField;
import {
  focusedMathField,
  focusedMathFieldReturn,
  focusedMathFieldID,
  palletRef,
  handleRef
} from "../../_framework/Footers/MathInputSelector.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {rendererState} from "./useDoenetRenderer.js";
export default function MathInput(props) {
  let {name, SVs, actions, sourceOfUpdate, ignoreUpdate, rendererName, callAction} = useDoenetRender(props);
  MathInput.baseStateVariable = "rawRendererValue";
  const [mathField, setMathField] = useState(null);
  const setRendererState = useSetRecoilState(rendererState(rendererName));
  let rendererValue = useRef(SVs.rawRendererValue);
  let includeCheckWork = useRef(SVs.includeCheckWork);
  includeCheckWork.current = SVs.includeCheckWork;
  if (!ignoreUpdate) {
    rendererValue.current = SVs.rawRendererValue;
  }
  let validationState = useRef(null);
  const setFocusedField = useSetRecoilState(focusedMathField);
  const setFocusedFieldID = useSetRecoilState(focusedMathFieldID);
  const focusedFieldID = useRecoilValue(focusedMathFieldID);
  const setFocusedFieldReturn = useSetRecoilState(focusedMathFieldReturn);
  const containerRef = useRecoilValue(palletRef);
  const dragHandleRef = useRecoilValue(handleRef);
  const updateValidationState = () => {
    validationState.current = "unvalidated";
    if (SVs.valueHasBeenValidated) {
      if (SVs.creditAchieved === 1) {
        validationState.current = "correct";
      } else if (SVs.creditAchieved === 0) {
        validationState.current = "incorrect";
      } else {
        validationState.current = "partialcorrect";
      }
    }
  };
  const handleVirtualKeyboardClick = (text) => {
    mathField.focus();
    if (!text) {
      console.log("Empty value");
      return;
    }
    if (text.split(" ")[0] == "cmd") {
      mathField.cmd(text.split(" ")[1]);
    } else if (text.split(" ")[0] == "write") {
      mathField.write(text.split(" ")[1]);
    } else if (text.split(" ")[0] == "keystroke") {
      mathField.keystroke(text.split(" ")[1]);
    } else if (text.split(" ")[0] == "type") {
      mathField.typedText(text.split(" ")[1]);
    }
  };
  const handleDefaultVirtualKeyboardClick = (text) => {
    console.log("no mathinput field focused");
  };
  const handleDefaultVirtualKeyboardReturn = (text) => {
    console.log("no mathinput field focused");
  };
  const handlePressEnter = (e) => {
    callAction({
      action: actions.updateValue,
      baseVariableValue: rendererValue.current
    });
    if (includeCheckWork.current && validationState.current === "unvalidated") {
      callAction({
        action: actions.submitAnswer
      });
    }
  };
  const handleFocus = (e) => {
    setFocusedField(() => handleVirtualKeyboardClick);
    setFocusedFieldReturn(() => handlePressEnter);
    setFocusedFieldID(mathField.id);
  };
  const handleBlur = (e) => {
    if (containerRef?.current?.contains(e.relatedTarget)) {
      setTimeout(() => {
        mathField.focus();
      }, 100);
    } else if (dragHandleRef?.current?.contains(e.relatedTarget)) {
      setTimeout(() => {
        mathField.focus();
      }, 100);
    } else {
      callAction({
        action: actions.updateValue,
        baseVariableValue: rendererValue.current
      });
      setFocusedField(() => handleDefaultVirtualKeyboardClick);
      setFocusedFieldReturn(() => handleDefaultVirtualKeyboardReturn);
      setFocusedFieldID(null);
    }
  };
  const onChangeHandler = (text) => {
    if (text.replace(/\s/g, "").replace(/\^{(\w)}/g, "^$1") !== rendererValue.current?.replace(/\s/g, "").replace(/\^{(\w)}/g, "^$1")) {
      rendererValue.current = text;
      setRendererState((was) => {
        let newObj = {...was};
        newObj.ignoreUpdate = true;
        return newObj;
      });
      callAction({
        action: actions.updateRawValue,
        args: {
          rawRendererValue: text
        },
        baseVariableValue: text
      });
    }
  };
  if (SVs.hidden) {
    return null;
  }
  updateValidationState();
  let checkWorkButton = null;
  if (SVs.includeCheckWork) {
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
    if (validationState.current === "unvalidated") {
      if (SVs.disabled) {
        checkWorkStyle.backgroundColor = "rgb(200,200,200)";
      } else {
        checkWorkStyle.backgroundColor = "rgb(2, 117, 216)";
      }
      checkWorkButton = /* @__PURE__ */ React.createElement("button", {
        id: name + "_submit",
        tabIndex: "0",
        disabled: SVs.disabled,
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
    } else if (Number.isFinite(SVs.numberOfAttemptsLeft)) {
      checkWorkButton = /* @__PURE__ */ React.createElement(React.Fragment, null, checkWorkButton, /* @__PURE__ */ React.createElement("span", null, "(attempts remaining: ", SVs.numberOfAttemptsLeft, ")"));
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("a", {
    name
  }), /* @__PURE__ */ React.createElement("span", {
    className: "textInputSurroundingBox",
    id: name
  }, /* @__PURE__ */ React.createElement("span", {
    style: {margin: "10px"}
  }, /* @__PURE__ */ React.createElement(EditableMathField, {
    latex: rendererValue.current,
    config: {
      autoCommands: "alpha beta gamma delta epsilon zeta eta mu nu xi omega rho sigma tau phi chi psi omega iota kappa lambda Gamma Delta Xi Omega Sigma Phi Psi Omega Lambda sqrt pi Pi theta Theta integral infinity",
      autoOperatorNames: "arg deg det dim exp gcd hom ker lg lim ln log max min Pr sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth sin cos tan sec cosec csc cotan cot ctg arcsin arccos arctan arcsec arccosec arccsc arccotan arccot arcctg sinh cosh tanh sech cosech csch cotanh coth ctgh arsinh arcosh artanh arsech arcosech arcsch arcotanh arcoth arctgh arcsinh arccosh arctanh arcsech arccosech arccsch arccotanh arccoth arcctgh",
      handlers: {
        enter: handlePressEnter
      }
    },
    onChange: (mField) => {
      onChangeHandler(mField.latex());
    },
    onBlur: handleBlur,
    onFocus: handleFocus,
    mathquillDidMount: (mf) => {
      setMathField(mf);
    }
  })), checkWorkButton));
}
