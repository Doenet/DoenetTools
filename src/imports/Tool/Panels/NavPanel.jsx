import React, { useState, createContext } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { useSpring, animated } from "react-spring";

export const IsNavContext = createContext(false);

const NavPanelWrapper = styled(animated.div)`
  grid-area: navPanel;
  background-color: #f6f8ff;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid black;
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

export default function NavPanel({ children }) {
  const [visible, setVisible] = useState(true);
  const props = useSpring({
    width: visible ? 240 : 0,
    from: { width: visible ? 0 : 240 },
  });

  const icon = visible ? faTimes : faBars;

  return (
    <IsNavContext.Provider value={true}>
      <NavPanelWrapper style={props}>
        <VisibilityButton
          onClick={() => {
            setVisible(!visible);
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </VisibilityButton>
        {children} {/* render when closed? */}
      </NavPanelWrapper>
    </IsNavContext.Provider>
  );
}
