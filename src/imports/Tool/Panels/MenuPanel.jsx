import React, { useState, useEffect } from "react";
import { atomFamily, useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { useStackId } from "../ToolRoot";

const MenuPanelWrapper = styled.div`
  grid-area: menuPanel;
  width: 240px;
  display: grid;
  grid-template:
    "buttons" 60px
    "sections" 1fr;
  border-left: 1px solid black;
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
  border-top: 
    ${({ linkedPanel, activePanel }) =>
      linkedPanel === activePanel ? "8px solid #1A5A99" : "none"};
  background-color: #f6f8ff;
  border-bottom: 2px solid ${({ linkedPanel, activePanel }) =>
  linkedPanel === activePanel ? '#f6f8ff' : "black"};;
  border-left: 1px solid black;
  border-right: 1px solid black;
  width: 100%;
  height: 100%;
`;

export const activeMenuPanel = atomFamily({
  key: "activeMenuPanelAtom",
  default: 0,
});

export const useMenuPanelController = () => {
  const stackId = useStackId();
  const menuAtomControl = useSetRecoilState(activeMenuPanel(stackId));
  return menuAtomControl;
};

export default function MenuPanel({ children }) {
  const stackId = useStackId();
  const [activePanel, setActivePanel] = useRecoilState(
    activeMenuPanel(stackId)
  );
  const [panels, setPanels] = useState([]);

  // console.log(">>>Loading Menu w/ Child");

  useEffect(() => {
    setPanels(children.map((panel) => panel)); //swap this to only render buttons once (store in state)
  }, [children]);

  return (
    <MenuPanelWrapper>
      <ButtonsWrapper>
        {panels.map((panel, idx) => {
          return (
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
          );
        })}
      </ButtonsWrapper>
      <PanelsWrapper>{panels[activePanel]?.children}</PanelsWrapper>
    </MenuPanelWrapper>
  );
}
