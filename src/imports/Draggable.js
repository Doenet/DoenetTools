import React, { useState, useEffect, useCallback } from "react";

const POSITION = { x: 0, y: 0 };

const Draggable = ({ children, id, onDragStart, onDrag, onDragEnd, ghostElement=null }) => {
  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    translation: POSITION,
    actionType: null
  });

  const handleMouseDown = useCallback(
    (ev) => {
      let clientX = ev.clientX,
        clientY = ev.clientY,
        actionType = "mouse";
      if (ev.type === "touchstart") {
        clientX = ev.touches[0]?.clientX;
        clientY = ev.touches[0]?.clientY;
        actionType = "touch";
      }

      setState((state) => ({
        ...state,
        isDragging: true,
        origin: { x: clientX, y: clientY },
        actionType: actionType
      }));
      // if (onDragStart) onDragStart({ id });
      onDragStart?.({ id });
    },
    [onDragStart, id]
  );

  const handleMouseUp = useCallback(() => {
    setState((state) => ({
      ...state,
      isDragging: false,
      actionType: null
    }));
    onDragEnd?.();
  }, [onDragEnd]);

  const handleMouseMove = useCallback(
    (ev) => {
      let clientX = ev.clientX,
        clientY = ev.clientY;
      if (ev.type === "touchmove") {
        clientX = ev.touches[0]?.clientX;
        clientY = ev.touches[0]?.clientY;
      }

      const translation = {
        x: clientX - state.origin.x,
        y: clientY - state.origin.y
      };
      // console.log(state.isDragging);

      setState((state) => ({
        ...state,
        translation
      }));

      onDrag?.({ clientX, clientY, translation, id });
    },
    [state.origin, onDrag, id]
  );

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);

      setState((state) => ({ ...state, translation: { x: 0, y: 0 } }));
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  const styles = {
    cursor: state.isDragging ? "-webkit-grabbing" : "-webkit-grab",
    // transform: state.isDragging
    //   ? `translate(${state.translation.x}px, ${state.translation.y}px)`
    //   : "",
    transition: state.isDragging ? "none" : "transform 500ms",
    // zIndex: state.isDragging ? 2 : 1,
    // position: state.isDragging ? "absolute" : "relative"
  };

  const ghostStyles = {
    cursor: state.isDragging ? "-webkit-grabbing" : "-webkit-grab",
    transform: state.isDragging
      ? `translate(${state.translation.x}px, ${state.translation.y}px)`
      : "",
    transition: state.isDragging ? "none" : "transform 500ms",
    zIndex: state.isDragging ? 2 : 1,
    opacity: state.isDragging ? 1 : 0,
    position: state.isDragging ? "absolute" : "relative",
    left: state.origin.x,
    top: state.origin.y

  }

  return (
    <div
      key={`draggable${id}`}
      style={styles}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      { children }
      { state.isDragging && <div style={ghostStyles}>{ghostElement}</div>}
    </div>
  );
};

export default Draggable;