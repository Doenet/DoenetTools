import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import { supportVisible } from "./SupportPanel";
import { useStackId } from "../ToolRoot";
import { clearAllSelections } from "../../Drive";

const ContentPanelContainer = styled.div`
  grid-area: contentPanel;
  display: grid;
  grid-template:
    "mainPanel . supportPanel" 1.5fr
    "mainPanel handle supportPanel" 1fr
    "mainPanel . supportPanel" 1.5fr
    / 1fr 7px 0fr;
  border-left: 1px solid black;
  overflow-x: hidden;
  overflow-y: auto;
`;

const DragHandle = styled.div`
  grid-area: handle;
  padding: 0;
  cursor: ew-resize;
  background-color: darkgrey;
  border-radius: 4px;
`;

export default function ContentPanel({ main, support }) {
  const wrapperRef = useRef();
  const stackId = useStackId();
  const [supportInUse, setSupportInUse] = useRecoilState(
    supportVisible(stackId)
  );
  const clearDriveSelections = useSetRecoilState(clearAllSelections);
  let isDragging = false;

  useEffect(() => {
    wrapperRef.current.style.gridTemplateColumns = `1fr 7px ${
      supportInUse ? "1fr" : "0fr"
    }`;
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
      let newColDefn = `${proportion}fr 7px ${1 - proportion}fr`;
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
      <DragHandle
        onMouseDown={handleMouseDown}
        onClick={() => setSupportInUse(!supportInUse)}
      />
      {support}
    </ContentPanelContainer>
  );
}
