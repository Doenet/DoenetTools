import { useState, useEffect } from "react";

const useDrop = ({ ref, onDrop, onDragOver, onDropEnter }) => {
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
  
  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.addEventListener("dragenter", dropEnterCb);
      // elem.addEventListener("dragover", dropOverCb);
      elem.addEventListener("drop", dropCb);
      return () => {
        elem.removeEventListener("dragenter", dropEnterCb);
        // elem.removeEventListener("dragover", dropOverCb);
        elem.removeEventListener("drop", dropCb);
      };
    }
  }, [dropOverCb, dropCb]);
  return {
    dropState
  };
};

export default useDrop;
