import React, { useState } from "react";
import styled from "styled-components";
import { atom, selector, useRecoilState } from "recoil";
import ResponsiveControlsWrapper from "../Tool/ResponsiveControls";
import Switch from "../Switch";

export const supportVisibleAtom = atom({
  key: "supportVisibleAtom",
  default: [false],
});

export const supportVisible = selector({
  key: "supportVisibleSelector",
  get: ({ get }) => {
    const supportVisibleArray = get(supportVisibleAtom);
    return supportVisibleArray[supportVisibleArray.length - 1];
  },

  set: ({ set }, newValue) => {
    set(supportVisibleAtom, (old) => {
      let newArray = [...old];
      newArray[newArray.length - 1] = newValue;
      return newArray;
    });
  },
});

export function SupportVisiblitySwitch() {
  const [supportVisiblity, setSupportVisiblity] = useRecoilState(
    supportVisible
  );

  return (
    <Switch
      checked={supportVisiblity}
      onChange={(e) => {
        setSupportVisiblity(e.target.checked);
      }}
    />
  );
}

const SupportPanelContainer = styled.div`
  overflow: auto;
`;

const ResponsiveControlsContainer = styled.div`
  height: 32px;
  border-bottom: 1px solid black;
  display: flex;
`;

export default function SupportPanel({ children, responsiveControls }) {
  const [supportPanelHeaderGrpWidth, setSupportPanelHeaderGrpWidth] = useState(
    0
  );
  const [
    supportPanelHeaderCtrlGrpEl,
    setSupportPanelHeaderCtrlGrpEl,
  ] = useState(null);

  const setSupportHeaderCtrlGroupRef = (element) => {
    if (element) {
      setSupportPanelHeaderCtrlGrpEl(element);
      setSupportPanelHeaderGrpWidth(element.clientWidth);
    }
  };

  const resizeWindowHanlderForSupportPanel = () => {
    if (supportPanelHeaderCtrlGrpEl) {
      //console.log(supportPanelHeaderCtrlGrpEl.clientWidth, "supportPanelHeaderCtrlGrpEl.clientWidth");
      setSupportPanelHeaderGrpWidth(supportPanelHeaderCtrlGrpEl.clientWidth);
    }
  };

  let responsiveControlsContents = null;

  if (responsiveControls) {
    responsiveControlsContents = (
      <ResponsiveControlsContainer>
        <ResponsiveControlsWrapper mainPanelWidth={supportPanelHeaderGrpWidth}>
          {responsiveControls}
        </ResponsiveControlsWrapper>
      </ResponsiveControlsContainer>
    );
  }

  return (
    <SupportPanelContainer>
      {responsiveControlsContents}
      {children}
    </SupportPanelContainer>
  );
}
