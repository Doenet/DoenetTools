import React, {useState, useRef, useEffect} from "../../_snowpack/pkg/react.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faTimes} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const FormInput = styled.input`
  margin: 0px -${(props) => props.formWidth}px 0px 0px;
  height: 24px;
  width: ${(props) => props.inputWidth};
  border: ${(props) => props.alert ? "2px solid var(--mainRed)" : "var(--mainBorder)"};
  border-radius: var(--mainBorderRadius);
  position: relative;
  padding: 0px 30px 0px 5px;
  color: var(--canvastext);
  overflow: hidden;
  width: 175px;
  resize: none;
  align-items: center;
  white-space: nowrap;
  outline: none;
  font-family: 'Open Sans';
  font-size: 14px;
  line-height: 20px;
  cursor: ${(props) => props.disabled ? "not-allowed" : "auto"};
`;
const CancelButton = styled.button`
  float: right;
  margin: 5px 0px 0px -30px;
  position: absolute;
  z-index: 4;
  border: 0px;
  background-color: transparent;
  visibility: ${(props) => props.cancelShown};
  color: var(--canvastext);
  overflow: hidden;
  outline: none;
`;
const SubmitButton = styled.button`
  position: absolute;
  display: inline;
  margin: 0px -5px 0px -5px;
  z-index: 2;
  height: 28px;
  border: ${(props) => props.alert ? "2px solid var(--mainRed)" : "var(--mainBorder)"};
  border-radius: 0px 5px 5px 0px;
  background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};
  color: ${(props) => props.disabled ? "var(--canvastext)" : "var(--canvas)"};
  cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};
  font-size: 12px;
  overflow: hidden;

  &:hover {
    color: var(--canvastext);
    background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
`;
const Label = styled.p`
  font-size: 14px;
  display: ${(props) => props.labelVisible};
  margin: 0px 5px 2px 0px;
`;
const Container = styled.div`
  display: ${(props) => props.align};
  width: 235px;
  align-items: center;
`;
export default function Form(props) {
  const [text, setText] = useState(props.value ? props.value : "");
  const [cancelShown, setCancelShown] = useState("hidden");
  const [formWidth, setFormWidth] = useState(props.formWidth ? props.formWidth : "0px");
  const labelVisible = props.label ? "static" : "none";
  const align = props.vertical ? "static" : "flex";
  const alert = props.alert ? props.alert : null;
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
  const inputRef = useRef(null);
  let cleared = false;
  const formRef = useRef(0);
  useEffect(() => {
    if (formRef && props.submitButton) {
      let button = document.querySelector("#submitButton");
      let buttonWidth = button.clientWidth;
      setTimeout(function() {
        setFormWidth(235 - buttonWidth + "px");
      }, 1e3);
      console.log(buttonWidth);
    }
  }, [formRef, props]);
  useEffect(() => {
    inputRef.current.selectionStart = cursorStart;
    inputRef.current.selectionEnd = cursorEnd;
  });
  var disable = "";
  if (props.disabled) {
    disable = "disabled";
  }
  ;
  var inputWidth = "175px";
  if (props.width) {
    if (props.width === "menu") {
      inputWidth = "100px";
      if (props.submitButton) {
        inputWidth = "auto";
      }
      if (props.label) {
        inputWidth = "auto";
      }
    }
  }
  ;
  var placeholder = "";
  if (props.placeholder) {
    placeholder = props.placeholder;
  }
  ;
  var label = "";
  if (props.label) {
    label = props.label;
  }
  ;
  var ariaLabel = "";
  if (props.ariaLabel) {
    ariaLabel = props.ariaLabel;
  }
  ;
  function handleChange(e) {
    if (cleared) {
      setText("");
    } else {
      setText(e.target.value);
      cleared = false;
    }
    if (props.onChange)
      props.onChange(e.target.value);
    setCursorStart(e.target.selectionStart);
    setCursorEnd(e.target.selectionEnd);
  }
  ;
  function handleClick(e) {
    if (props.onClick)
      props.onClick(e);
  }
  ;
  function clearInput(e) {
    if (props.clearInput)
      props.clearInput(e);
    setCancelShown("hidden");
    cleared = true;
    handleChange(e);
  }
  ;
  function changeTextTerm() {
    setCancelShown("visible");
  }
  ;
  function handleBlur(e) {
    if (props.onBlur)
      props.onBlur(e);
  }
  ;
  function handleKeyDown(e) {
    if (props.onKeyDown)
      props.onKeyDown(e);
  }
  ;
  let clearButton = null;
  if (props.clearInput) {
    clearButton = /* @__PURE__ */ React.createElement(CancelButton, {
      cancelShown,
      onClick: (e) => {
        clearInput(e);
      }
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faTimes
    }));
  }
  ;
  return /* @__PURE__ */ React.createElement(Container, {
    align
  }, /* @__PURE__ */ React.createElement(Label, {
    labelVisible,
    align
  }, label), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(FormInput, {
    id: "textarea",
    value: text,
    placeholder,
    type: "text",
    ref: inputRef,
    inputWidth,
    formWidth,
    onKeyUp: () => {
      changeTextTerm();
    },
    onChange: (e) => {
      handleChange(e);
    },
    onBlur: (e) => {
      handleBlur(e);
    },
    onKeyDown: (e) => {
      handleKeyDown(e);
    },
    disabled: disable,
    alert,
    ariaLabel
  }), clearButton, /* @__PURE__ */ React.createElement(SubmitButton, {
    id: "submitButton",
    ref: formRef,
    disabled: disable,
    alert,
    onClick: (e) => {
      handleClick(e);
    }
  }, props.submitButton ? props.submitButton : "Submit")));
}
;
