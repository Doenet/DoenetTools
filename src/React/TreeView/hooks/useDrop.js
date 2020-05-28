import { useState, useEffect } from "react";

const useDrop = ({ ref, onDrop, onDropLeave, onDropEnter }) => {
  const [dropState, updateDropState] = useState("droppable");

  const dropLeaveCb = ev => {
    ev.preventDefault();
    onDropLeave && onDropLeave();
    updateDropState("drop leave");
  };

  const dropCb = ev => {
    ev.preventDefault();
    ev.dataTransfer.getData("source")
    onDrop && onDrop();
    updateDropState("dropped");
    ev.stopPropagation();
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
      elem.addEventListener("dragleave", dropLeaveCb);
      elem.addEventListener("drop", dropCb);
      return () => {
        elem.removeEventListener("dragenter", dropEnterCb);
        elem.removeEventListener("dragLeave", dropLeaveCb);
        elem.removeEventListener("drop", dropCb);
      };
    }
  }, [dropLeaveCb, dropEnterCb, dropCb]);
  return {
    dropState
  };
};

export default useDrop;
