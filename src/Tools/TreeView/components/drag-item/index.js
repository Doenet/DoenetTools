import React, { useState, useRef, useMemo } from "react";
import "../../index.css";
import useDrag from "../../hooks/useDrag";
import View from "./view";

export default ({ children, dragEffect, id, onDragStart, onDragOver, onDragEnd }) => {
  const dragRef = useRef();
  const [classValue, setClassValue] = useState("grab");
  const { dragState } = useDrag({
    id,
    effect: dragEffect,
    ref: dragRef,
    onDragStart: (ev) => {
      onDragStart(id);
      let dragImage = document.createElement("img");
      dragImage.style.visibility = "hidden";
      // event.dataTransfer.setDragImage(dragImage, 0, 0);
    },
    onDragOver: () => onDragOver(id),
    onDragEnd: (ev) => onDragEnd()
  });

  const styles = useMemo(() => ({
    cursor: dragState == "dragging" ? '-webkit-grabbing' : '-webkit-grab',
    zIndex: dragState == "dragging" ? 2 : 1,
    transition: "transform 1s"
  }), [dragState]);

  return <View children={children} ref={dragRef} styles={styles} classValue={classValue} />;
};
