import React, { useRef } from "react";
import View from "./view";

import useDrop from "../../hooks/useDrop";

export default ({ children, heading, id, onDrop, onDragOver, className }) => {
  const dropRef = useRef();
  const { dropState, droppedItem } = useDrop({
    ref: dropRef,
    onDrop: onDrop,
    onDragOver: () => onDragOver(id)
  });
  return (
    <View ref={dropRef} heading={heading} droppedItem={droppedItem} classes={className}>
      {children}
    </View>
  );
};
