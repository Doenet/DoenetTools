import { useState, useEffect } from "react";

const useDrop = ({ ref, onDrop, onDragOver, onDropEnter, onDropExit }) => {
  const [dropState, updateDropState] = useState("droppable");

  const dropOverCb = ev => {
    ev.preventDefault();
    onDragOver && onDragOver();
    updateDropState("dragging over");
  };

  const dropCb = ev => {
    ev.preventDefault();
    ev.dataTransfer.getData("source")
    onDrop && onDrop();
    updateDropState("dropped");
  };

  const dropEnterCb = ev => {
    ev.preventDefault();
    onDropEnter && onDropEnter();
    ev.stopPropagation();
  };
  const dropExitCb = ev => {
    ev.preventDefault();
    var rect = ref.current.getBoundingClientRect();

    // Check the mouseEvent coordinates are outside of the rectangle
    if(ev.x > rect.left + rect.width || ev.x < rect.left
    || ev.y > rect.top + rect.height || ev.y < rect.top) {
      onDropExit && onDropExit();
    }
    // ev.stopPropagation();
  };
  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.addEventListener("dragenter", dropEnterCb);
      elem.addEventListener("dragleave", dropExitCb);
      elem.addEventListener("dragover", dropOverCb);
      elem.addEventListener("drop", dropCb);
      return () => {
        elem.removeEventListener("dragenter", dropEnterCb);
        elem.removeEventListener("dragleave", dropExitCb);
        elem.removeEventListener("dragover", dropOverCb);
        elem.removeEventListener("drop", dropCb);
      };
    }
  }, [dropOverCb, dropCb]);
  return {
    dropState
  };
};

export default useDrop;
