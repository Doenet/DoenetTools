import React, {useState} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {MathJax} from "../../_snowpack/pkg/better-react-mathjax.js";
const ButtonStyling = styled.button`
  margin: ${(props) => props.theme.margin};
  height: 24px;
  border-style: hidden;
  // border-color: var(--canvastext);
  // border-width: 2px;
  color: white;
  background-color: ${(props) => props.alert ? "var(--mainRed)" : "var(--mainBlue)"};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: ${(props) => props.theme.padding};
  cursor: pointer;
  font-size: 12px;
  border-radius: 20px;

  &:hover {
    background-color: ${(props) => props.alert ? "var(--lightRed)" : "var(--lightBlue)"};
    color: black;
  };

  &:focus {
    outline: 2px solid ${(props) => props.alert ? "var(--mainRed)" : props.disabled ? "var(--canvastext)" : "var(--mainBlue)"};
    outline-offset: 2px;
  }
`;
ButtonStyling.defaultProps = {
  theme: {
    margin: 0,
    borderRadius: "var(--mainBorderRadius)",
    padding: "0 10px"
  }
};
const Label = styled.p`
  font-size: 14px;
  display: ${(props) => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${(props) => props.align == "flex" ? "none" : "2px"};
`;
const Container = styled.div`
  display: ${(props) => props.align ? props.align : "inline-block"};
  width: auto;
  align-items: center;
`;
export default function Button(props) {
  var container = {};
  var align = "flex";
  var button = {
    value: "Button"
  };
  if (props.width) {
    if (props.width === "menu") {
      button.width = "100%";
      if (props.label) {
        container.width = "menu";
        button.width = "100%";
      }
    }
  }
  ;
  const [labelVisible, setLabelVisible] = useState(props.label ? "static" : "none");
  var label = "";
  if (props.label) {
    label = props.label;
    if (props.vertical) {
      align = "static";
    }
  }
  ;
  var icon = "";
  if (props.value || props.icon) {
    if (props.value && props.icon) {
      icon = props.icon;
      button.value = props.value;
    } else if (props.value) {
      button.value = props.value;
    } else if (props.icon) {
      icon = props.icon;
      button.value = "";
    }
    if (props.value && props.valueHasLatex) {
      button.value = /* @__PURE__ */ React.createElement(MathJax, {
        hideUntilTypeset: "first",
        inline: true,
        dynamic: true
      }, button.value);
    }
  }
  ;
  if (props.disabled) {
    button.backgroundColor = "var(--mainGray)";
    button.color = "var(--canvastext)";
    button.cursor = "not-allowed";
  }
  ;
  function handleClick(e) {
    if (props.onClick)
      props.onClick(e);
  }
  ;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Container, {
    style: container,
    align
  }, /* @__PURE__ */ React.createElement(Label, {
    labelVisible,
    align
  }, label), /* @__PURE__ */ React.createElement(ButtonStyling, {
    disabled: props.disabled,
    "aria-disabled": props.disabled,
    "aria-labelledby": label,
    "aria-label": button.value,
    style: button,
    ...props,
    onClick: (e) => {
      handleClick(e);
    }
  }, icon, " ", button.value)));
}
;
