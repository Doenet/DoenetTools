import React, { useRef, useEffect } from "react";

const WithDropTarget = ({ children, id, registerDropTarget, unregisterDropTarget, dropCallbacks }) => {
  const dropRef = useRef();

  const { onDragOver, onDrop } = dropCallbacks;

  useEffect(() => {
    registerDropTarget({ id, ref: dropRef.current, onDragOver, onDrop });
    return () => {
      unregisterDropTarget(id);
    };
  }, [id, registerDropTarget, unregisterDropTarget]);

  return <div ref={dropRef}>{children}</div>;
};

export default WithDropTarget;