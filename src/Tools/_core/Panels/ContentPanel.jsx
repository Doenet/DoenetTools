import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import {
  useSetRecoilState,
  useRecoilState,
  atomFamily,
  useRecoilValue,
} from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import { clearDriveAndItemSelections } from "../../Drive";
import { useSupportPanelController } from "./SupportPanel";
import { useStackId } from "../ToolRoot";

const Wrapper = styled.div`
  grid-area: contentPanel;
  display: grid;
  grid-template:
    "mainControls . supportControls" 40px
    "mainPanel . supportPanel" 1.5fr
    "mainPanel handle supportPanel" 1fr
    "mainPanel . supportPanel" 1.5fr
    / ${({ $proportion }) => `${$proportion}fr auto ${1 - $proportion}fr`};
  overflow-x: hidden;
  overflow-y: auto;
  gap: 2px;
`;

const DragHandle = styled.div`
  grid-area: handle;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(246, 248, 255);
  font-size: 12px;
  padding: 0;
  cursor: ew-resize;
  background-color: #1a5a99;
  border-radius: 10px 0px 0px 10px;
  width: 10px;
  box-sizing: border-box;
`;

export const panelProportion = atomFamily({
  key: "panelProportionAtom",
  default: 1,
});

export default function ContentPanel({ main, support }) {
  const wrapperRef = useRef();
  const stackId = useStackId();
  const setProportion = useSupportPanelController();
  const proportion = useRecoilValue(panelProportion(stackId));
  //   , setSupportController] = useRecoilState(
  //   supportPanelControl(stackId)
  // );
  const clearDriveSelections = useSetRecoilState(clearDriveAndItemSelections);

  useEffect(() => {
    if (support?.props?.isInitOpen) setProportion(0.5);
  }, [support?.props.isInitOpen, setProportion]);

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
      wrapperRef.current.style.gridTemplateColumns =
        proportion < 0.95
          ? proportion > 0.1
            ? `${proportion}fr auto ${1 - proportion}fr`
            : "0.1fr auto 0.9fr"
          : "0.95fr auto 0.05fr";
      wrapperRef.current.proportion =
        proportion > 0.95 ? 1 : proportion < 0.1 ? 0.1 : proportion;
    }
  };

  const onMouseUp = () => {
    //Only updates the proportions on mouse up
    if (handleClicked) {
      handleClicked = false;
      if (handleDragged) {
        handleDragged = false;
        setProportion(wrapperRef.current.proportion);
        wrapperRef.current.style.gridTemplateColumns = null;
      } else {
        setProportion();
      }
    }
  };

  return (
    <Wrapper
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      ref={wrapperRef}
      onClick={clearDriveSelections}
      $proportion={proportion}
    >
      {main}
      {support ? (
        <DragHandle onMouseDown={onMouseDown} key={`SupportHandle${stackId}`}>
          <FontAwesomeIcon icon={faGripLinesVertical} />
        </DragHandle>
      ) : null}
      {support}
    </Wrapper>
  );
}
