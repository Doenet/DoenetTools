import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { clearDriveAndItemSelections } from "../../Drive";

const ContentPanelContainer = styled.div`
  grid-area: contentPanel;
  display: grid;
  grid-template:
    "mainPanel . supportPanel" 1.5fr
    "mainPanel handle supportPanel" 1fr
    "mainPanel . supportPanel" 1.5fr
    / ${({ $proportion }) => $proportion};
  border-left: 1px solid black;
  overflow-x: hidden;
  overflow-y: auto;
`;

const DragHandle = styled.div`
  grid-area: handle;
  padding: 0;
  cursor: ew-resize;
  background-color: #1a5a99;
  border-radius: 2px;
  margin: 2px;
`;

export default function ContentPanel({ main, support }) {
  const wrapperRef = useRef();
  const [panelProportion, setPanelProportion] = useState("1fr 11px 0fr");
  const clearDriveSelections = useSetRecoilState(clearDriveAndItemSelections);

  let handleClicked = false;
  let handleDragged = false;

  const onMouseDown = (event) => {
    event.preventDefault();
    handleClicked = true;
  };

  const onMouseMove = (event) => {
    // Only activate if handle was clicked
    if (handleClicked) {
      event.preventDefault();
      handleDragged = true;
      let proportion =
        (event.clientX - wrapperRef.current.offsetLeft) /
        wrapperRef.current.clientWidth;
      //use the ref to save on
      wrapperRef.current.style.gridTemplateColumns = `${proportion}fr 11px ${
        1 - proportion
      }fr`;
    }
  };

  const onMouseUp = () => {
    //Only updates the proportions on mouse up
    if (handleClicked) {
      handleClicked = false;
      if (handleDragged) {
        handleDragged = false;
        setPanelProportion(wrapperRef.current.style.gridTemplateColumns);
        wrapperRef.current.style.gridTemplateColumns = null;
      } else {
        setPanelProportion((old) =>
          old === "1fr 11px 0fr" ? "1fr 11px 1fr" : "1fr 11px 0fr"
        );
      }
    }
  };

  return (
    <ContentPanelContainer
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      ref={wrapperRef}
      onClick={clearDriveSelections}
      $proportion={panelProportion}
    >
      {main}
      {support ? <DragHandle onMouseDown={onMouseDown} /> : null}
      {support}
    </ContentPanelContainer>
  );
}
