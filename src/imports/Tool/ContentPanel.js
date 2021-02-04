import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { supportVisible } from "./SupportPanel";
import { useStackId } from "./Tool";
import { clearAllSelections } from "../Drive";

const ContentPanelContainer = styled.div`
  grid-area: contentPanel;
  display: grid;
  grid-template: "mainPanel handle supportPanel" / 1fr 0px 0fr;
  border-left: 1px solid black;
`;

const DragHandle = styled.div`
  grid-area: handle;
  padding: 0;
  cursor: ew-resize;
  background-color: black;
`;

export default function ContentPanel({ main, support }) {
  const wrapperRef = useRef();
  const stackId = useStackId();
  const supportInUse = useRecoilValue(supportVisible(stackId));
  const clearDriveSelections = useSetRecoilState(clearAllSelections);
  let isDragging = false;

  useEffect(() => {
    wrapperRef.current.style.gridTemplateColumns = supportInUse
      ? "1fr 3px 1fr"
      : "1fr 0px 0fr";
  }, [supportInUse]);

  const handleMouseDown = () => {
    isDragging = true;
  };

  const handleMouseMove = (event) => {
    // Don't do anything if dragging flag is false
    if (isDragging) {
      event.preventDefault();
      let proportion =
        (event.clientX - wrapperRef.current.offsetLeft) /
        wrapperRef.current.clientWidth;
      let newColDefn = `${proportion}fr 3px ${1 - proportion}fr`;
      // setProportion((oldprop) => proportion);
      wrapperRef.current.style.gridTemplateColumns = newColDefn;
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      isDragging = false;
    }
  };

  return (
    <ContentPanelContainer
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      ref={wrapperRef}
      supportInUse={supportInUse}
      onClick={clearDriveSelections}
    >
      {main}
      <DragHandle onMouseDown={handleMouseDown} />
      {support}
    </ContentPanelContainer>
  );
}
