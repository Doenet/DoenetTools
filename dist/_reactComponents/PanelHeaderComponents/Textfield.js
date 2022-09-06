import React, {useState, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const TextfieldStyling = styled.input`
  margin: 0px 4px 0px 0px;
  height: 24px;
  border: 2px solid ${(props) => props.disabled ? "var(--mainGray)" : props.alert ? "var(--mainRed)" : "var(--canvastext)"};
  font-family: Arial;
  border-radius: var(--mainBorderRadius);
  color: var(--canvastext);
  resize: none;
  white-space: nowrap;
  padding: 0px 5px 0px 5px;
  line-height: 24px;
  font-size: 14px;
  background-color: var(--canvas);
  cursor: ${(props) => props.disabled ? "not-allowed" : "auto"};
  pointer-events: ${(props) => props.disabled ? "none" : "auto"};
  width: ${(props) => props.inputWidth};
  &:focus {
    outline: 2px solid ${(props) => props.disabled ? "var(--mainGray)" : props.alert ? "var(--mainRed)" : "var(--canvastext)"};
    outline-offset: 2px;
  }
`;
export default function Textfield(props) {
  const labelVisible = props.label ? "static" : "none";
  const align = props.vertical ? "initial" : "flex";
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
  const inputRef = useRef(null);
  var textfieldValue = {
    value: `${props.value}`
  };
  var label = {
    value: "Label:",
    fontSize: "14px",
    display: `${labelVisible}`,
    marginRight: "5px",
    marginBottom: `${align == "flex" ? "none" : "2px"}`
  };
  var container = {
    display: `${align}`,
    width: "auto",
    alignItems: "center"
  };
  useEffect(() => {
    inputRef.current.selectionStart = cursorStart;
    inputRef.current.selectionEnd = cursorEnd;
  });
  if (props.label) {
    label.value = props.label;
  }
  ;
  if (props.value) {
    textfieldValue.value = props.value;
  }
  ;
  if (props.placeholder) {
    textfieldValue.placeholder = props.placeholder;
  }
  ;
  var disable = "";
  var read_only = false;
  if (props.disabled) {
    disable = "disabled";
    read_only = true;
  }
  ;
  var inputWidth = "";
  if (props.width) {
    if (props.width === "menu") {
      inputWidth = "200px";
      if (props.label) {
        container.width = "200px";
      }
    }
  }
  ;
  function handleChange(e) {
    if (props.onChange)
      props.onChange(e);
    setCursorStart(e.target.selectionStart);
    setCursorEnd(e.target.selectionEnd);
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: container
  }, /* @__PURE__ */ React.createElement("p", {
    style: label,
    id: "textfield-label"
  }, label.value), /* @__PURE__ */ React.createElement(TextfieldStyling, {
    "aria-disabled": props.disabled ? true : false,
    "aria-labelledby": "textfield-label",
    type: "text",
    inputWidth,
    readOnly: read_only,
    alert: props.alert,
    disabled: props.disabled,
    ref: inputRef,
    value: props.value,
    placeholder: textfieldValue.placeholder,
    "aria-label": textfieldValue.ariaLabel,
    style: textfieldValue,
    "data-test": props.dataTest,
    onChange: (e) => {
      handleChange(e);
    },
    onBlur: (e) => {
      handleBlur(e);
    },
    onKeyDown: (e) => {
      handleKeyDown(e);
    }
  })));
}
;
