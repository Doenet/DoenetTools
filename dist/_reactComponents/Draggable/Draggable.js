import React, {useState, useEffect, useCallback, useRef} from "../../_snowpack/pkg/react.js";
const POSITION = {x: 0, y: 0};
const Draggable = ({children, id, className = "", onDragStart, onDrag, onDragEnd, ghostElement = null}) => {
  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    translation: POSITION,
    actionType: null
  });
  const timerRef = useRef(null);
  const targetEvent = useRef(null);
  const [initializingDrag, setInitializingDrag] = useState(false);
  const handleMouseDown = useCallback((ev) => {
    if (ev.button !== 0)
      return;
    setInitializingDrag(true);
    targetEvent.current = {...ev};
    timerRef.current = setTimeout(() => {
      let ev2 = targetEvent.current;
      let clientX = ev2.clientX, clientY = ev2.clientY, actionType = "mouse";
      if (ev2.type === "touchstart") {
        clientX = ev2.touches[0]?.clientX;
        clientY = ev2.touches[0]?.clientY;
        actionType = "touch";
      }
      setState((state2) => ({
        ...state2,
        isDragging: true,
        origin: {x: clientX, y: clientY},
        actionType
      }));
      onDragStart?.({
        ev: targetEvent.current
      });
      timerRef.current = null;
    }, 300);
  }, [onDragStart, id]);
  const handleMouseUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    } else {
      setState((state2) => ({
        ...state2,
        isDragging: false,
        actionType: null
      }));
      onDragEnd?.();
    }
    setInitializingDrag(false);
  }, [onDragEnd]);
  const handleMouseMove = useCallback((ev) => {
    if (!state.isDragging)
      return;
    let clientX = ev.clientX, clientY = ev.clientY;
    if (ev.type === "touchmove") {
      clientX = ev.touches[0]?.clientX;
      clientY = ev.touches[0]?.clientY;
    }
    const translation = {
      x: clientX - state.origin.x,
      y: clientY - state.origin.y
    };
    setState((state2) => ({
      ...state2,
      translation
    }));
    onDrag?.({clientX, clientY, translation, id, ev});
  }, [state.origin, onDrag, id]);
  useEffect(() => {
    if (initializingDrag) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [initializingDrag, handleMouseUp]);
  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      setState((state2) => ({...state2, translation: {x: 0, y: 0}}));
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, [state.isDragging, handleMouseMove]);
  const styles = {
    cursor: state.isDragging ? "-webkit-grabbing" : "-webkit-grab",
    transition: state.isDragging ? "none" : "transform 500ms"
  };
  const ghostStyles = {
    cursor: state.isDragging ? "-webkit-grabbing" : "-webkit-grab",
    transform: state.isDragging ? `translate(${state.translation.x}px, ${state.translation.y}px)` : "",
    transition: state.isDragging ? "visibility 0s, opacity 0.2s linear" : "visibility 0s, opacity 0.2s linear, transform 500ms",
    zIndex: state.isDragging ? 2 : 1,
    opacity: state.isDragging ? 1 : 0,
    visibility: state.isDragging ? "visible" : "hidden",
    height: state.isDragging ? "auto" : "0",
    position: state.isDragging ? "absolute" : "relative",
    left: state.origin.x,
    top: state.origin.y
  };
  return /* @__PURE__ */ React.createElement("div", {
    key: `draggable${id}`,
    className,
    style: styles,
    onMouseDown: handleMouseDown,
    onTouchStart: handleMouseDown
  }, children, /* @__PURE__ */ React.createElement("div", {
    style: ghostStyles
  }, ghostElement));
};
export default Draggable;
