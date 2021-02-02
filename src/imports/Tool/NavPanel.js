import React, { useState, createContext } from "react";
import styled from "styled-components";
import "../../../src/Tools/ToolLayout/toollayout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

export const IsNavContext = createContext(false);

const NavPanelWrapper = styled.div`
  grid-area: navPanel;
  width: ${({ visible }) => (visible ? "240px" : "0px")};
  background-color: #f6f8ff;
  overflow: auto;
  border-right: 1px solid black
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

  const icon = visible ? faTimes : faBars;

  return (
    <IsNavContext.Provider value={true}>
      <NavPanelWrapper visible={visible}>
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
