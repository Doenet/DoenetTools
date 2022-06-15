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
  color: var(--canvastext);
  background-color: ${(props) => props.color};
  
  &:hover {
    color: black;
    background-color: ${(props) => props.alert ? "var(--lightRed)" : props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
`;
export default function CalendarButton(props) {
  let checkedIcon = props.checkedIcon ? props.checkedIcon : /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faCheck
  });
  let uncheckedIcon = props.uncheckedIcon ? props.uncheckedIcon : /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faBan
  });
  const icon = props.checked ? checkedIcon : uncheckedIcon;
  const color = props.checked ? "var(--mainBlue)" : "var(--mainGray)";
  const buttonRef = useRef(null);
  return /* @__PURE__ */ React.createElement(Button, {
    style: props.style,
    color,
    ref: buttonRef,
    onClick: (e) => {
      props.onClick(e);
    }
  }, icon);
}
