import React, { useState, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import styled from "styled-components";

const MenuPanelWrapper = styled.div`
  grid-area: menuPanel;
  width: 240px;
  display: grid;
  grid-template:
    "buttons" 60px
    "sections" 1fr;
`;
const ButtonsWrapper = styled.div`
  grid-area: buttons;
  display: flex;
`;

const PanelsWrapper = styled.div`
  grid-area: sections;
  display: flex;
  flex-direction: column;
  overflow: auto;
  border-left: 1px solid black;
`;

const MenuHeaderButton = styled.button`
  border: none;
  border-top: 8px solid ${({ linkedPanel, activePanel }) =>
    linkedPanel === activePanel ? "#1A5A99" : "#f6f8ff"};
  background-color: "#f6f8ff";
  border-bottom: 1px solid #3d3d3d;
  border-left: 1px solid #3d3d3d;
  width: 100%;
  height: 100%;
`;

export const activeMenuPanelAtom = atom({
  key: "activeMenuPanel",
  default: 0,
});

export default function MenuPanel({ children }) {
  const [activePanel, setActivePanel] = useRecoilState(activeMenuPanelAtom);
  const [panels, setPanels] = useState([]);

  useEffect(() => {
    setPanels(children.map((panel) => panel.children));
  }, [children]);

  return (
    <MenuPanelWrapper>
      <ButtonsWrapper>
        {children.map((panel, idx) => (
          <MenuHeaderButton
            key={`headerB${idx}`}
            onClick={() => {
              activePanel !== idx ? setActivePanel(idx) : null;
            }}
            linkedPanel={idx}
            activePanel={activePanel}
          >
            {panel.props.title}
          </MenuHeaderButton>
        ))}
      </ButtonsWrapper>
      <PanelsWrapper>{panels[activePanel]}</PanelsWrapper>
    </MenuPanelWrapper>
  );
}
