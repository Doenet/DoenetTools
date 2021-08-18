import React, {useState, useRef, useEffect} from "../../_snowpack/pkg/react.js";
import {doenetComponentForegroundInactive, doenetComponentForegroundActive} from "./theme.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faSearch, faTimes} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default function Form(props) {
  const [textTerm, setTextTerm] = useState("");
  const [cancelShown, setCancelShown] = useState("hidden");
  const [formwidth, setformWidth] = useState("0px");
  const [labelVisible, setLabelVisible] = useState(props.label ? "static" : "none");
  const [align, setAlign] = useState(props.vertical ? "static" : "flex");
  const formRef = useRef(0);
  useEffect(() => {
    if (formRef && props.submitButton) {
      let button = document.querySelector("#submitButton");
      setTimeout(function() {
        setformWidth(button.clientWidth);
      }, 1e3);
    }
  }, [formRef, props]);
  var textfield = {
    margin: `0px -${formwidth}px 0px 0px`,
    height: "20px",
    border: `2px solid black`,
    borderRadius: "5px",
    position: "relative",
    padding: "0px 70px 0px 5px",
    color: "#000",
    overflow: "hidden",
    width: "215px",
    resize: "none",
    alignItems: "center",
    value: "Enter Text here",
    whiteSpace: "nowrap",
    outline: "none",
    fontFamily: "Open Sans",
    lineHeight: "20px"
  };
  var container = {
    display: `${align}`,
    width: "235px",
    alignItems: "center"
  };
  var tableCellContainer = {
    display: `table-cell`
  };
  var cancelButton = {
    float: "right",
    margin: "6px 0px 0px -30px",
    position: "absolute",
    zIndex: "4",
    border: "0px",
    backgroundColor: "#FFF",
    visibility: `${cancelShown}`,
    color: "#000",
    overflow: "hidden",
    outline: "none"
  };
  var submitButton = {
    position: "absolute",
    display: "inline",
    margin: `0px -6px 0px -5px`,
    zIndex: "2",
    height: "24px",
    border: `2px solid black`,
    backgroundColor: `${doenetComponentForegroundActive}`,
    color: "#FFFFFF",
    borderRadius: "0px 3px 3px 0px",
    cursor: "pointer",
    fontSize: "12px",
    overflow: "hidden"
  };
  var label = {
    value: "Label:",
    fontSize: "12px",
    marginRight: "5px",
    display: `${labelVisible}`
  };
  if (props.disabled) {
    submitButton.backgroundColor = "#e2e2e2";
    submitButton.color = "black";
    submitButton.cursor = "not-allowed";
    textfield.cursor = "not-allowed";
  }
  if (props.width) {
    if (props.width === "menu") {
      container.width = "235px";
      textfield.width = "100px";
      if (props.submitButton) {
        container.width = "235px";
        textfield.width = "auto";
      }
      if (props.label) {
        container.width = "235px";
        textfield.width = "auto";
      }
    }
  }
  if (props.value) {
    textfield.value = props.value;
  }
  if (props.label) {
    label.value = props.label;
  }
  if (props.alert) {
    textfield.border = "2px solid #C1292E";
  }
  function handleChange(e) {
    if (props.onChange)
      props.onChange(e.target.value);
  }
  function handleClick(e) {
    if (props.onClick)
      props.onClick(e);
  }
  function clearInput() {
    document.getElementById("textarea").value = "";
    setCancelShown("hidden");
  }
  function changeTextTerm() {
    setTextTerm(document.getElementById("textarea").value);
    setCancelShown("visible");
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: container
  }, /* @__PURE__ */ React.createElement("p", {
    style: label
  }, label?.value), /* @__PURE__ */ React.createElement("div", {
    style: tableCellContainer,
    onClick: () => {
      clearInput();
    }
  }, /* @__PURE__ */ React.createElement("textarea", {
    id: "textarea",
    defaultValue: textfield.value,
    type: "text",
    style: textfield,
    onKeyUp: () => {
      changeTextTerm();
    },
    onChange: (e) => {
      handleChange(e);
    }
  }), /* @__PURE__ */ React.createElement("button", {
    style: cancelButton,
    onClick: () => {
      clearInput();
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTimes
  })), /* @__PURE__ */ React.createElement("button", {
    id: "submitButton",
    style: submitButton,
    ref: formRef,
    onClick: (e) => {
      handleClick(e);
    }
  }, props.submitButton ? props.submitButton : "Submit"))));
}
