import React, {useState, createContext} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faTimes, faBars} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {useSpring, animated} from "../../_snowpack/pkg/react-spring.js";
export const IsNavContext = createContext(false);
const Wrapper = styled(animated.div)`
  grid-area: navPanel;
  background-color: #8fb8de;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 4px;
`;
const VisibilityButton = styled.button`
  width: 40px;
  height: 40px;
  color: #ffffff;
  background-color: #1a5a99;
  border-radius: 50%;
  border: 1px solid #fff;
  font-size: 16px;
  cursor: pointer;
  position: fixed;
  bottom: 2%;
  left: 1%;
  z-index: 2;
`;
export default function NavPanel({children, isInitOpen}) {
  const [visible, setVisible] = useState(isInitOpen);
  const props = useSpring({
    width: visible ? 240 : 0
  });
  const icon = visible ? faTimes : faBars;
  return /* @__PURE__ */ React.createElement(IsNavContext.Provider, {
    value: true
  }, /* @__PURE__ */ React.createElement(Wrapper, {
    style: props
  }, /* @__PURE__ */ React.createElement(VisibilityButton, {
    onClick: () => {
      setVisible(!visible);
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon
  })), children, " "));
}
