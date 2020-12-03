import React, { useRef, useEffect } from "react";

const WithDropTarget = ({ children, id, dropProps, dropCallbacks }) => {
  const dropRef = useRef();

  const {
    dropActions: { registerDropTarget, unregisterDropTarget }
  } = dropProps;

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