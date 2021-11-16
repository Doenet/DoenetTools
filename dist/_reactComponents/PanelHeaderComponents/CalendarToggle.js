import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faCalendarPlus,
  faCalendarTimes,
  faCode
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import React, {useRef} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {doenetMainBlue} from "./theme.js";
const Button = styled.button`
  height: 24px;
  border: 2px solid;
  border-color: ${(props) => props.color};
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => props.color};
`;
export default function CalendarButton(props) {
  const icon = props.checked ? faCalendarPlus : faCalendarTimes;
  const color = props.checked ? doenetMainBlue : "#e2e2e2";
  const buttonRef = useRef(null);
  return /* @__PURE__ */ React.createElement(Button, {
    color,
    ref: buttonRef,
    onClick: (e) => {
      props.onClick(e);
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon
  }));
}
