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
  const [dropTargets, setDropTargets] = useState({});
  const [activeDropTargetId, setActiveDropTargetId] = useState(null);
  const activeRefId = useRef(null);
  const dropTargetsCacheRef = useRef({});

  const sortedDropTargetIds = useMemo(
    () =>
      Object.keys(dropTargets)
        .map((id) => id)
        .reverse(),
    [dropTargets]
  );

  const getDropTargetFromCursor = useCallback(
    (x, y, ignoreId = null) => {
      const underCursor = document.elementsFromPoint(x, y);

      for (let dropTargetId of sortedDropTargetIds) {
        if (dropTargetId === ignoreId) continue;
        const refs = dropTargets[dropTargetId]?.refs;
        for (let ref of refs) {
          if (underCursor.includes(ref)) return dropTargetId;
        } 
      }
      return null;
    },
    [sortedDropTargetIds, dropTargets]
  );

  const registerDropTarget = useCallback(({ id, ref, onDragOver, onDrop }) => {
    let dropTargetObj = dropTargetsCacheRef.current[id];
    if (!dropTargetObj) {
      dropTargetObj = {
        refs: [],
        onDragOver: onDragOver,
        onDrop: onDrop
      };
    }
    dropTargetObj.refs.push(ref);
    
    dropTargetsCacheRef.current[id] = dropTargetObj;
    setDropTargets((prev) => ({ ...prev, [id]: dropTargetObj }));
  }, []);

  const unregisterDropTarget = useCallback((id) => {
    delete dropTargetsCacheRef.current[id];
    setDropTargets((prev) => {
      const { [id]: _, ...without } = prev;
      return without;
    });
  }, []);

  const handleDrag = useCallback(
    (x, y, selfId = null) => {
      const dropTargetId = getDropTargetFromCursor(x, y, selfId);
      setActiveDropTargetId(dropTargetId);
      // trigger onDrag once
      if (activeDropTargetId !== dropTargetId) {
        setActiveDropTargetId(dropTargetId);
        dropTargets[dropTargetId]?.onDragOver();
      }
    },
    [activeDropTargetId, getDropTargetFromCursor, dropTargets]
  );

  const handleDrop = (selfId = null) => {
    setActiveDropTargetId(null);
  };

  const state = {
    dropState: {
      dropTargets,
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