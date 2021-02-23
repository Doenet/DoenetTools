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

  const timerRef = useRef(null);
  const timerDropTargetId = useRef(null);
  const [initializingDragHover, setInitializingDragHover] = useState(false); 

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

      if (dropTargetId) {
        dropTargetObj?.onDragOver({x, y, dropTargetRef: dropTargetObj.ref});
      }

      if (dropTargetId !== activeDropTargetId) {
        /* Trigger onDragExit */
        handleDragExit(activeDropTargetId);
        
        /* Trigger onDragEnter */
        handleDragEnter({dropTargetId, dropTargetObj});
      }

      setActiveDropTargetId(dropTargetId);
    },
    [activeDropTargetId, getDropTargetFromCursor]
  );

  const handleDragEnter = ({dropTargetId, dropTargetObj}) => {

    // if timer already set for same dropTargetId, ignore
    if (timerDropTargetId.current === dropTargetId ) return;

    if (dropTargetId) {
      setInitializingDragHover(true);
      timerDropTargetId.current = dropTargetId;
      timerRef.current = setTimeout(() => {
        if (dropTargetObj.onDragHover) dropTargetObj.onDragHover();
        timerRef.current = null;
      }, 1500);
    }
  }

  const handleDragExit = (dropTargetId) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerDropTargetId.current = null;
    setInitializingDragHover(false);
  }

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