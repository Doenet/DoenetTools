import { useState, useCallback, useEffect, useRef } from "react";

const useDrag = ({ id, effect, ref, onDragStart, onDragOver, onDragEnd }) => {
  const [dragState, updateDragState] = useState("draggable");
  const dragStartCb = ev => {
    updateDragState("dragging");
    ev.dataTransfer.dropEffect = effect;
    ev.dataTransfer.setData("source", id);
    
    onDragStart && onDragStart(ev);
    ev.stopPropagation();
  };

  const dragOverCb = ev => {
    ev.preventDefault();
    updateDragState("draggedOver");
    onDragOver && onDragOver(ev);
    ev.stopPropagation();
  };

  const dragEndCb = ev => {
    updateDragState("draggable");
    if (effect === "move") {
      updateDragState("moved");
    }
    onDragEnd && onDragEnd(ev);
  };
  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.setAttribute("draggable", true);
      elem.addEventListener("dragstart", dragStartCb);
      elem.addEventListener("dragover", dragOverCb);
      elem.addEventListener("dragend", dragEndCb);
      return () => {
        elem.removeEventListener("dragstart", dragStartCb);
        elem.removeEventListener("dragover", dragOverCb);
        elem.removeEventListener("dragend", dragEndCb);
      };
    }
  }, [onDragStart, onDragOver, onDragEnd]);
  return {
    dragState: dragState
  };
};

export default useDrag;
