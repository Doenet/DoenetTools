import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import {DropTargetsContext} from "./context.js";
export default function DropTargetsProvider({children}) {
  const [draggedObject, setDraggedObject] = useState(null);
  const [activeDropTargetId, setActiveDropTargetId] = useState(null);
  const dropTargetsRef = useRef({});
  const timerRef = useRef(null);
  const timerDropTargetId = useRef(null);
  const activeDropTargetIdRef = useRef(null);
  useEffect(() => {
    activeDropTargetIdRef.current = activeDropTargetId;
  }, [activeDropTargetId]);
  const getDropTargetFromCursor = useCallback((x, y, ignoreId = null) => {
    const underCursor = document.elementsFromPoint(x, y);
    const dropTargetIds = Object.keys(dropTargetsRef.current);
    for (let dropTargetId of dropTargetIds) {
      if (dropTargetId === ignoreId)
        continue;
      const dropTargetsObjs = dropTargetsRef.current[dropTargetId];
      for (let dropTargetObj of dropTargetsObjs) {
        if (underCursor.includes(dropTargetObj.ref))
          return [dropTargetId, dropTargetObj];
      }
    }
    return null;
  }, []);
  const registerDropTarget = useCallback(({id, ref, onDragOver, onDragHover, onDrop}) => {
    let dropTargetObj = dropTargetsRef.current[id];
    if (!dropTargetObj)
      dropTargetObj = [];
    const newDropTarget = {
      ref,
      onDragOver,
      onDragHover,
      onDrop
    };
    dropTargetObj.push(newDropTarget);
    dropTargetsRef.current[id] = dropTargetObj;
  }, []);
  const unregisterDropTarget = useCallback((id) => {
  }, []);
  const handleDrag = useCallback((x, y, selfId = null) => {
    const dropTarget = getDropTargetFromCursor(x, y, selfId);
    let dropTargetId = "", dropTargetObj = {};
    if (dropTarget)
      [dropTargetId, dropTargetObj] = dropTarget;
    if (dropTargetId) {
      dropTargetObj?.onDragOver({x, y, dropTargetRef: dropTargetObj.ref});
    }
    if (dropTargetId !== activeDropTargetId) {
      handleDragExit(activeDropTargetId);
      handleDragEnter({dropTargetId, dropTargetObj});
    }
    setActiveDropTargetId(dropTargetId);
  }, [activeDropTargetId, getDropTargetFromCursor]);
  const handleDragEnter = ({dropTargetId, dropTargetObj}) => {
    if (timerDropTargetId.current === dropTargetId)
      return;
    if (dropTargetId) {
      timerDropTargetId.current = dropTargetId;
      timerRef.current = setTimeout(() => {
        if (dropTargetObj.onDragHover && activeDropTargetIdRef.current) {
          dropTargetObj.onDragHover();
        }
        timerRef.current = null;
      }, 1500);
    }
  };
  const handleDragExit = (dropTargetId) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerDropTargetId.current = null;
  };
  const handleDrop = (selfId = null) => {
    if (activeDropTargetId !== null) {
      if (dropTargetsRef.current[activeDropTargetId]?.[0]?.onDrop)
        dropTargetsRef.current[activeDropTargetId][0].onDrop();
    }
    setActiveDropTargetId(null);
  };
  const state = {
    dropState: {
      activeDropTargetId,
      draggedObject
    },
    dropActions: {
      registerDropTarget,
      unregisterDropTarget,
      handleDrag,
      handleDrop,
      setDraggedObject
    }
  };
  return /* @__PURE__ */ React.createElement(DropTargetsContext.Provider, {
    value: state
  }, children);
}
