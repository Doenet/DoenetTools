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
      return (
        sortedDropTargetIds.find(
          (id) => underCursor.includes(dropTargets[id]?.ref) && id !== ignoreId
        ) || null
      );
    },
    [sortedDropTargetIds, dropTargets]
  );

  const registerDropTarget = useCallback(({ id, ref, onDragOver, onDrop }) => {
    const dropTargetObj = {
      ref: ref,
      onDragOver: onDragOver,
      onDrop: onDrop
    };
    setDropTargets((prev) => ({ ...prev, [id]: dropTargetObj }));
  }, []);

  const unregisterDropTarget = useCallback((id) => {
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