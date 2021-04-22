import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import {atomFamily, useRecoilState, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {useStackId} from "../ToolRoot.js";
import DragPanel, {handleDirection} from "./Panel.js";
const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template:
    'buttons' 60px
    'sections' 1fr;
  background-color: hsl(0, 0%, 99%);
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
`;
const MenuHeaderButton = styled.button`
  border: none;
  border-top: ${({linkedPanel, activePanel}) => linkedPanel === activePanel ? "8px solid #1A5A99" : "none"};
  background-color: hsl(0, 0%, 99%);
  border-bottom: 2px solid
    ${({linkedPanel, activePanel}) => linkedPanel === activePanel ? "#f6f8ff" : "black"};
  width: 100%;
  height: 100%;
`;
export const activeMenuPanel = atomFamily({
  key: "activeMenuPanelAtom",
  default: 0
});
export const useMenuPanelController = () => {
  const stackId = useStackId();
  const menuAtomControl = useSetRecoilState(activeMenuPanel(stackId));
  return menuAtomControl;
};
export default function MenuPanel({children, isInitOpen}) {
  const stackId = useStackId();
  const [activePanel, setActivePanel] = useRecoilState(activeMenuPanel(stackId));
  const [panels, setPanels] = useState([]);
  useEffect(() => {
    setPanels(children.map((panel) => panel));
  }, [children]);
  return /* @__PURE__ */ React.createElement(DragPanel, {
    gridArea: "menuPanel",
    direction: handleDirection.LEFT,
    id: `menuPanel${stackId}`,
    isInitOpen
  }, /* @__PURE__ */ React.createElement(Wrapper, null, /* @__PURE__ */ React.createElement(ButtonsWrapper, null, panels.map((panel, idx) => {
    return /* @__PURE__ */ React.createElement(MenuHeaderButton, {
      key: `headerB${idx}`,
      onClick: () => {
        activePanel !== idx ? setActivePanel(idx) : null;
      },
      linkedPanel: idx,
      activePanel
    }, panel.props.title);
  })), /* @__PURE__ */ React.createElement(PanelsWrapper, null, panels[activePanel]?.children)));
}
