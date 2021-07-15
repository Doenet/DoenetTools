import React, {useEffect} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {animated, useSpring} from "../../_snowpack/pkg/@react-spring/web.js";
import {useGesture} from "../../_snowpack/pkg/react-use-gesture.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faGripLinesVertical, faGripLines} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {useRecoilState, atomFamily} from "../../_snowpack/pkg/recoil.js";
export const handleDirection = {
  LEFT: {
    flexDir: "row-reverse",
    vertical: true,
    rounding: "10px 0px 0px 10px",
    drag: ["x", -1]
  },
  RIGHT: {
    flexDir: "row",
    vertical: true,
    rounding: "0px 10px 10px 0px",
    drag: ["x", 1]
  },
  UP: {
    flexDir: "column-reverse",
    vertical: false,
    rounding: "10px 10px 0px 0px",
    drag: ["y", -1]
  },
  DOWN: {
    flexDir: "column",
    vertical: false,
    rounding: "0px 0px 10px 10px",
    drag: ["y", 1]
  }
};
const Wrapper = styled(animated.div)`
  grid-area: ${({$gridArea}) => $gridArea ?? ""};
  display: flex;
  flex-direction: ${({$flexDir}) => $flexDir};
  align-items: center;
  overflow: hidden;
`;
const Background = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  height: ${({$vertical}) => $vertical ? "100%" : ""};
  width: ${({$vertical}) => $vertical ? "" : "100%"};
  border-radius: 4px;
  background-color: hsl(0, 0%, 99%);
`;
const DragHandle = styled.div`
  flex: 0 0 ${({$handleSize}) => $handleSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(246, 248, 255);
  font-size: 12px;
  padding: 0;
  cursor: ${({$vertical}) => $vertical ? "ew-resize" : "ns-resize"};
  background-color: #1a5a99;
  // border-radius: ${({$rounding}) => $rounding};
  height: ${({$vertical}) => $vertical ? "25%" : ""};
  width: ${({$vertical}) => $vertical ? "" : "25%"};
  box-sizing: border-box;
  touch-action: none;
`;
const panelOpen = atomFamily({
  key: "panelOpenAtom",
  default: false
});
export default function DragPanel({
  children,
  direction,
  id,
  gridArea = "auto",
  handleSize = 10,
  panelSize = 240,
  isInitOpen = false
}) {
  const [open, setOpen] = useRecoilState(panelOpen(id));
  const [{dir}, api] = useSpring(() => ({
    dir: open ? handleSize + panelSize : handleSize
  }), [open]);
  useEffect(() => {
    setOpen(isInitOpen);
  }, [isInitOpen, setOpen]);
  const bindX = useGesture({
    onDrag: ({tap, movement: [mx, my]}) => {
      let movDir = (direction.drag[0] === "x" ? mx : my) * direction.drag[1];
      if (tap) {
        api.start({
          dir: movDir === handleSize ? panelSize + handleSize : handleSize
        });
        setOpen(movDir === handleSize);
      } else {
        api.start({dir: movDir});
      }
    },
    onDragEnd: ({direction: [dirx, diry], movement: [mx, my]}) => {
      let dragDir = (direction.drag[0] === "x" ? dirx : diry) * direction.drag[1];
      let movDir = (direction.drag[0] === "x" ? mx : my) * direction.drag[1];
      api.start({
        dir: dragDir === 1 || movDir >= (panelSize + handleSize) / 2 && dragDir !== -1 ? panelSize + handleSize : handleSize
      });
      setOpen(dragDir === 1 || movDir >= (panelSize + handleSize) / 2 && dragDir !== -1);
    }
  }, {
    drag: {
      filterTaps: true,
      bounds: () => ({
        left: (direction === handleDirection.RIGHT ? handleSize : panelSize) * direction.drag[1],
        right: (direction === handleDirection.RIGHT ? panelSize : handleSize) * direction.drag[1],
        top: (direction === handleDirection.DOWN ? handleSize : panelSize) * direction.drag[1],
        bottom: (direction === handleDirection.DOWN ? panelSize : handleSize) * direction.drag[1]
      }),
      rubberband: true,
      axis: direction.drag[0],
      initial: () => [
        dir.get() * direction.drag[1],
        dir.get() * direction.drag[1]
      ]
    }
  });
  return /* @__PURE__ */ React.createElement(Wrapper, {
    $gridArea: gridArea,
    $flexDir: direction.flexDir,
    style: direction.drag[0] === "x" ? {width: dir} : {height: dir}
  }, /* @__PURE__ */ React.createElement(Background, {
    $vertical: direction.vertical
  }, children), /* @__PURE__ */ React.createElement(DragHandle, {
    "data-cy": "panelDragHandle",
    $vertical: direction.vertical,
    $rounding: direction.rounding,
    $handleSize: handleSize,
    ...bindX()
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: direction.vertical ? faGripLinesVertical : faGripLines
  })));
}
