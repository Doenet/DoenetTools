import React, { useState, useEffect } from "react";
import { atom, selector, useRecoilState } from "recoil";
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
  border-top: 8px solid
    ${({ linkedPanel, activePanel }) =>
      linkedPanel === activePanel ? "#1A5A99" : "#f6f8ff"};
  background-color: "#f6f8ff";
  border-bottom: 1px solid #3d3d3d;
  border-left: 1px solid #3d3d3d;
  width: 100%;
  height: 100%;
`;

export const activeMenuPanelAtom = atom({
  key: "activeMenuPanelAtom",
  default: [0],
});

const activeMenuPanel = selector({
  key: "activeMenuPanel",
  get: ({ get }) => {
    const activePanelArray = get(activeMenuPanelAtom);
    return activePanelArray[activePanelArray.length - 1];
  },

  set: ({ set }, newValue) => {
    set(activeMenuPanelAtom, (old) => {
      let newArray = [...old];
      newArray[newArray.length - 1] = newValue;
      return newArray;
    });
  },
});

export default function MenuPanel({ children }) {
  const [activePanel, setActivePanel] = useRecoilState(activeMenuPanel);
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
