import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const ContentPanelContainer = styled.div`
  grid-area: "contentPanel";
  display: grid;
  grid-template-areas: "mainPanel handle supportPanel";
  grid-template-columns: 1fr 3px 1fr;
  border-left: 1px solid black;
`;

const DragHandle = styled.div`
  grid-area: handle;
  padding: 0;
  cursor: ew-resize;
  background-color: black;
`;

export default function ContentPanel({ main, support }) {
  console.log("=== Content Panel")
  const handleRef = useRef();
  const wrapperRef = useRef();
  let isDragging = false;

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown, false);
    document.addEventListener("mousemove", handleMouseMove, false);
    document.addEventListener("mouseup", handleMouseUp, false);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown, false);
      document.addEventListener("mousemove", handleMouseMove, false);
      document.addEventListener("mouseup", handleMouseUp, false);
    };
  });

  const handleMouseDown = (event) => {
    if (handleRef.current.contains(event.target)) {
      isDragging = true;
    }
  };

  const handleMouseMove = (event) => {
    // Don't do anything if dragging flag is false
    if (isDragging) {
      let mainWidth =
        (event.clientX - wrapperRef.current.offsetLeft) /
        (wrapperRef.current.clientWidth / 2); //TODO: this math needs work

      let newColDefn =
        mainWidth <= 1
          ? mainWidth + "fr 3px 1fr"
          : "1fr 3px " + 1 / mainWidth + "fr";
      wrapperRef.current.style.gridTemplateColumns = newColDefn;
      event.preventDefault();
    }
  };

  const handleMouseUp = (event) => {
    if (isDragging) {
      isDragging = false;
    }
  };

  return (
    <ContentPanelContainer ref={wrapperRef}>
      {main}
      <DragHandle ref={handleRef} />
      {support}
    </ContentPanelContainer>
  );
}
