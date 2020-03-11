import { useState, useEffect } from "react";

const useDrop = ({ ref, onDrop, onDragOver }) => {
  const [dropState, updateDropState] = useState("droppable");
  const dropOverCb = ev => {
    ev.preventDefault();
    onDragOver();
    updateDropState("dragging over");
  };

  const dropCb = ev => {
    ev.preventDefault();
    ev.dataTransfer.getData("source")
    onDrop();
    updateDropState("dropped");
  };
  useEffect(() => {
    const elem = ref.current;
    if (elem) {
      elem.addEventListener("dragover", dropOverCb);
      elem.addEventListener("drop", dropCb);
      return () => {
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
