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
  const wrapperRef = useRef();
  let isDragging = false;

  useEffect(() => {
    // document.addEventListener("mousemove", handleMouseMove, false);
    return () => {
      // document.addEventListener("mousemove", handleMouseMove, false);
    };
  });

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
    >
      {main}
      <DragHandle onMouseDown={handleMouseDown} />
      {support}
    </ContentPanelContainer>
  );
}
