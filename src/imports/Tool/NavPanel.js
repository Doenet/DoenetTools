import React, { useState, createContext } from "react";
import styled from "styled-components";
import "../../../src/Tools/ToolLayout/toollayout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

export const IsNavContext = createContext(false);

const NavPanelDiv = styled.div`
  grid-area: navPanel;
  width: ${({ visible }) => (visible ? "240px" : "0px")};
  background-color: #8fb8de;
  overflow: auto;
`;

const VisibilityButton = styled.button`
  width: 40px;
  height: 40px;
  color: #8fb8de;
  background-color: white;
  border-radius: 50%;
  border: 1px solid #e3e2e2;
  font-size: 16px;
  cursor: pointer;
  position: fixed;
  bottom: 2%;
  left: 1%;
  z-index: 100;
`;

export default function NavPanel({ children }) {
  const [visible, setVisible] = useState(true);

  const icon = visible ? faTimes : faBars;

  return (
    <IsNavContext.Provider value={true}>
      <NavPanelDiv visible={visible}>
        <VisibilityButton
          onClick={() => {
            setVisible(!visible);
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </VisibilityButton>
        {children} {/* render when closed? */}
      </NavPanelDiv>
    </IsNavContext.Provider>
  );
}
