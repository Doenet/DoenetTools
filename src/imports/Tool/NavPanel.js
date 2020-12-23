import React, { useState } from "react";
import styled from "styled-components";
import "../../../src/Tools/ToolLayout/toollayout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

const NavPanelDiv = styled.div`
  grid-area: navPanel;
  width: 240px;
  display: flex;
  height: 100vh;
  color: black;
  background-color: #8fb8de;
  overflow: scroll;
`;

export default function NavPanel({ children }) {
  const [hidden, setHidden] = useState(false);

  return (
    <>
      {hidden ? (
        <button
          onClick={() => {
            setHidden(false);
          }}
          className="middleLeftButton circle"
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{
              display: "block",
              alignSelf: "center",
              fontSize: "16px",
            }}
          />
        </button>
      ) : (
        <NavPanelDiv>
          <button
            onClick={() => {
              setHidden(true);
            }}
            className="leftCloseButton circle"
          >
            <FontAwesomeIcon
              icon={faTimes}
              style={{
                alignSelf: "center",
                fontSize: "16px",
              }}
            />
          </button>
          {children}
        </NavPanelDiv>
      )}
    </>
  );
}
