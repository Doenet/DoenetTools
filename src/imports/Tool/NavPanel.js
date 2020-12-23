import React, { useState } from "react";
import styled from "styled-components";
import "../../../src/Tools/ToolLayout/toollayout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

const NavPanelDiv = styled.div`
  grid-area: navPanel;
  width: ${({ visible }) => (visible ? "240px" : "0px")};
  background-color: #8fb8de;
  overflow: scroll;
`;

export default function NavPanel({ children }) {
  const [visible, setVisible] = useState(true);

  return (
    <NavPanelDiv visible={visible}>
      <button
        onClick={() => {
          setVisible(!visible);
        }}
        className="leftCloseButton circle" //className="middleLeftButton circle"
      >
        <FontAwesomeIcon
          icon={visible ? faBars : faTimes}
          style={{
            alignSelf: "center",
            fontSize: "16px",
          }}
        />
      </button>
      {children} {/* render when closed? */}
    </NavPanelDiv>
  );
}
