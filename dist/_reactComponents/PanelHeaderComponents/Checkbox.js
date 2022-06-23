import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faCheck,
  faBan
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import React, {useRef} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Button = styled.button`
  height: 24px;
  border: 2px solid;
  border-color: ${(props) => props.color};
  border-radius: var(--mainBorderRadius);
  color: ${(props) => props.textColor};
  background-color: ${(props) => props.color};
  cursor: ${(props) => props.cursor};
  &:hover {
    color: black;
    background-color: ${(props) => props.alert ? "var(--lightRed)" : props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
`;
const Label = styled.p`
  font-size: 14px;
  display: ${(props) => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${(props) => props.align == "flex" ? "none" : "2px"}
`;
const Container = styled.div`
  display: ${(props) => props.align};
  width: auto;
  align-items: center;
`;
export default function CheckboxButton(props) {
  let checkedIcon = props.checkedIcon ? props.checkedIcon : /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faCheck
  });
  let uncheckedIcon = props.uncheckedIcon ? props.uncheckedIcon : /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faBan
  });
  const icon = props.checked ? checkedIcon : uncheckedIcon;
  const color = props.checked ? "var(--mainBlue)" : "var(--mainGray)";
  const textColor = props.checked ? "white" : "black";
  const buttonRef = useRef(null);
  const cursor = props.disabled ? "not-allowed" : "pointer";
  const labelVisible = props.label ? "static" : "none";
  const align = props.vertical ? "static" : "flex";
  const disabled = props.disabled ? true : false;
  let labelValue = "Label:";
  if (props.label) {
    labelValue = props.label;
  }
  ;
  return /* @__PURE__ */ React.createElement(Container, {
    align
  }, /* @__PURE__ */ React.createElement(Label, {
    align,
    labelVisible
  }, labelValue), /* @__PURE__ */ React.createElement(Button, {
    style: props.style,
    color,
    textColor,
    ref: buttonRef,
    disabled,
    cursor,
    onClick: (e) => {
      if (props.onClick) {
        props.onClick(e);
      }
    }
  }, icon));
}
