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
        const refs = dropTargetsRef.current[dropTargetId]?.refs;
        for (let ref of refs) {
          if (underCursor.includes(ref)) return dropTargetId;
        } 
      }
      return null;
    },
    []
  );

  const registerDropTarget = useCallback(({ id, ref, onDragOver, onDrop }) => {
    let dropTargetObj = dropTargetsRef.current[id];
    if (!dropTargetObj) {
      dropTargetObj = {
        refs: [],
        onDragOver: onDragOver,
        onDrop: onDrop
      };
    }
    dropTargetObj.refs.push(ref);
    dropTargetsRef.current[id] = dropTargetObj;
  }, []);

  const unregisterDropTarget = useCallback((id) => {
    // delete dropTargetsRef.current[id];
  }, []);

  const handleDrag = useCallback(
    (x, y, selfId = null) => {
      const dropTargetId = getDropTargetFromCursor(x, y, selfId);
      console.log(">>>Here", dropTargetsRef.current, dropTargetId)     
      // trigger onDrag once
      if (activeDropTargetId !== dropTargetId) {
        setActiveDropTargetId(dropTargetId);
        dropTargetsRef.current[dropTargetId]?.onDragOver();
      }
    },
    [activeDropTargetId, getDropTargetFromCursor]
  );

  const handleDrop = (selfId = null) => {
    if (activeDropTargetId !== null) {
      dropTargetsRef.current[activeDropTargetId]?.onDrop();
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