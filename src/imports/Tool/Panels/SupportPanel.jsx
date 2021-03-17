import React from "react";
import styled from "styled-components";
import { atomFamily, selectorFamily, useSetRecoilState } from "recoil";
import { panelProportion } from "./ContentPanel";
import { useStackId } from "../ToolRoot";

const supportVisible = atomFamily({
  key: "supportVisibleAtom",
  default: false,
});

export const supportPanelControl = selectorFamily({
  key: "supportPanelControl",
  get: (id) => ({ get }) => {
    const visible = get(supportVisible(id));
    if (visible) {
      return get(panelProportion(id));
    } else {
      return "1fr 11px 0fr";
    }
  },
  set: (id) => ({ get, set }, newValue) => {
    switch (typeof newValue) {
      case "string":
        set(panelProportion(id), newValue);
        set(supportVisible(id), true);
        break;
      case "boolean":
        set(supportVisible(id), newValue);
        break;
      case "undefined":
        set(supportVisible(id), !get(supportVisible(id)));
        break;
      default:
        console.log("Toast: Should be an error!");
    }
  },
});

export const useSupportPanelController = () => {
  const stackId = useStackId();
  const supportPanelController = useSetRecoilState(
    supportPanelControl(stackId)
  );
  return supportPanelController;
};

const SupportPanelContainer = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  /* box-sizing: border-box;
  border-radius: 4px;
  border: 2px solid #1a5a99; */
`;

export default function SupportPanel({ children }) {
  return <SupportPanelContainer>{children}</SupportPanelContainer>;
}
