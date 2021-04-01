import React from "react";
import styled from "styled-components";
import {
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useSetRecoilState,
} from "recoil";
import { panelProportion } from "./ContentPanel";
import { useStackId } from "../ToolRoot";
import { M } from "../../../Doenet/components/MMeMen";

const supportVisible = atomFamily({
  key: "supportVisibleAtom",
  default: false,
});

export const useSupportPanelController = () => {
  const stackId = useStackId();
  const supportController = useRecoilCallback(
    ({ snapshot, set }) => (newProportion) => {
      const visible = snapshot.getLoadable(supportVisible(stackId));
      set(panelProportion(stackId), newProportion ?? (visible ? 1 : 0));
      set(
        supportVisible(stackId),
        (newProportion > 0.95 || newProportion == 0 ? false : true) ?? !visible
      );
    },
    [stackId]
  );
  return supportController;
};

const SupportWapper = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  background-color: hsl(0, 0%, 99%);
  height: 100%;
  border-radius: 0 0 4px 4px;
`;

const ControlsWrapper = styled.div`
  grid-area: supportControls;
  display: flex;
  gap: 4px;
  background-color: hsl(0, 0%, 89%);
  border-radius: 4px 4px 0 0;
`;

export default function SupportPanel({ children, responsiveControls }) {
  return (
    <>
      <ControlsWrapper>{responsiveControls}</ControlsWrapper>
      <SupportWapper>{children}</SupportWapper>
    </>
  );
}
