import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import { DropTargetsContext } from "./context";

export default function DropTargetsProvider({ children }) {
  const [draggedObject, setDraggedObject] = useState(null);
  const [activeDropTargetId, setActiveDropTargetId] = useState(null);
  const dropTargetsRef = useRef({});

  const getDropTargetFromCursor = useCallback(
    (x, y, ignoreId = null) => {
      const underCursor = document.elementsFromPoint(x, y);
      const dropTargetIds = Object.keys(dropTargetsRef.current);
      for (let dropTargetId of dropTargetIds) {
        if (dropTargetId === ignoreId) continue;
        const dropTargetsObjs = dropTargetsRef.current[dropTargetId];
        for (let dropTargetObj of dropTargetsObjs) {
          if (underCursor.includes(dropTargetObj.ref)) return [dropTargetId, dropTargetObj];
        }
      }
      return null;
    },
    []
  );

  const registerDropTarget = useCallback(({ id, ref, onDragOver, onDrop }) => {
    let dropTargetObj = dropTargetsRef.current[id];
    if (!dropTargetObj) dropTargetObj = [];
    
    const newDropTarget = {
      ref: ref,
      onDragOver: onDragOver,
      onDrop: onDrop
    };
    dropTargetObj.push(newDropTarget);
    dropTargetsRef.current[id] = dropTargetObj;
  }, []);

  const unregisterDropTarget = useCallback((id) => {
    // delete dropTargetsRef.current[id];
  }, []);

  const handleDrag = useCallback(
    (x, y, selfId = null) => {
      const dropTarget = getDropTargetFromCursor(x, y, selfId);
      let dropTargetId = "", dropTargetObj = {};
      if (dropTarget) [dropTargetId, dropTargetObj] = dropTarget;
      
      // // trigger onDrag once
      // if (activeDropTargetId !== dropTargetId) {
      //   setActiveDropTargetId(dropTargetId);
      //   dropTargetsRef.current[dropTargetId]?.onDragOver();
      //   console.log(dropTargetRef?.offsetTop, dropTargetRef?.clientHeight, y)
      // }

      setActiveDropTargetId(dropTargetId);
      if (dropTargetId) {
        dropTargetObj.onDragOver({x, y, dropTargetRef: dropTargetObj.ref});
        // console.log(dropTargetRef?.offsetTop, dropTargetRef?.clientHeight, y)
      }
    },
    [activeDropTargetId, getDropTargetFromCursor]
  );

  const handleDrop = (selfId = null) => {
    if (activeDropTargetId !== null) {
      dropTargetsRef.current[activeDropTargetId]?.[0]?.onDrop();
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

  return <DropTargetsContext.Provider value={state}>
    { children }
    </DropTargetsContext.Provider>
}