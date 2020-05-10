import React, { useState, useEffect, useCallback } from "react";
import { LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import "./index.css";
import SpinningLoader from '../SpinningLoader';


export const TreeView = ({containerId, loading, parentsInfo, childrenInfo, currentDraggedObject, 
  onDragStart, onDragEnd, onDraggableDragOver, onDrop, onDropEnter, onDropLeave}) => {
  const [currentDraggedOverContainerId, setCurrentDraggedOverContainerId] = useState(null);

  // handle dragEnd
  useEffect(() => {
    if (currentDraggedObject.id == null) setCurrentDraggedOverContainerId(null);
  }, [currentDraggedObject])

  const onDragStartCb = (draggedId, type) => {
    onDragStart && onDragStart(draggedId, type, containerId);
  }
  
  const onDragEndCb = () => {
    onDragEnd && onDragEnd(containerId);
  }

  const onDropCb = () => {
    onDrop && onDrop(containerId);
  }

  const onDropEnterCb = (id) => {
    setCurrentDraggedOverContainerId(id); 
    onDropEnter && onDropEnter(id, containerId);
  }

  const onDraggableDragOverCb = (id, type) => {
    onDraggableDragOver && onDraggableDragOver(id, type, containerId);
  }

  const onDropLeaveCb = (id) => {
    if (currentDraggedObject.dataObject == null) return;
    // console.log(id + " " + currentDraggedObject.dataObject.parent)
    if (id === "UltimateHeader" && currentDraggedObject.dataObject.parent === "UltimateHeader") {
      // onDropLeave && onDropLeave(id, containerId);
    }
  }
  
  if (loading){
    return <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
      <SpinningLoader/>
    </div>
  }

  return (
    <>
    { buildTreeStructure({
        parentsInfo: parentsInfo, 
        childrenInfo: childrenInfo, 
        onDragStart: onDragStartCb, 
        onDragEnd: onDragEndCb, 
        onDraggableDragOver: onDraggableDragOverCb, 
        onDrop: onDropCb, 
        onDropEnter: onDropEnterCb, 
        onDropLeave: onDropLeaveCb, 
        currentDraggedOverContainerId: currentDraggedOverContainerId,
        currentDraggedObject: currentDraggedObject,
      }) 
    }
    </>
  );
}

function buildTreeStructure({parentsInfo, childrenInfo, onDragStart, onDragEnd, 
  onDraggableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedObject, currentDraggedOverContainerId}) {

  return buildTreeStructureHelper(
    { parentHeadingId: "UltimateHeader", 
      parentNodeHeadingId: "UltimateHeader",
      parentsInfo: parentsInfo, 
      childrenInfo: childrenInfo, 
      onDragStart: onDragStart, 
      onDragEnd: onDragEnd, 
      onDraggableDragOver: onDraggableDragOver, 
      onDrop: onDrop, 
      onDropEnter: onDropEnter, 
      onDropLeave: onDropLeave, 
      currentDraggedObject: currentDraggedObject,
      currentDraggedOverContainerId: currentDraggedOverContainerId});
}

function buildTreeStructureHelper({parentHeadingId, parentNodeHeadingId, parentsInfo, childrenInfo, 
  onDragStart, onDragEnd, onDraggableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedObject,
   currentDraggedOverContainerId}) {

  const getItemStyle = (currentDraggedObject, parentNodeHeadingId, currentItemId) => {
    let itemDragged = currentDraggedObject.id == currentItemId;
    let isShadow = itemDragged && 
      currentDraggedObject.dataObject.parent == parentNodeHeadingId &&
      currentDraggedObject.sourceParentId != currentDraggedObject.dataObject.parent;

    if (!itemDragged) {  // item not dragged
      return ({
        border: "0px",
        background: "none",
        padding: "0px"
      })
    } else if (isShadow) {
      return ({
        width: "100%",
        border: "0px",
        background: "#fdfdfd",
        padding: "0px 5px",
        color: "#fdfdfd",
        boxShadow: "0 0 3px rgba(0, 0, 0, .2)"
      })
    } else {
      return ({
        border: "2px dotted #37ceff",
        background: "#fff",
        padding: "0px 5px"
      })
    }
  }

  let subTree = <ParentNode 
    id={parentHeadingId}
    key={parentHeadingId} 
    data={parentHeadingId == "UltimateHeader" ? "Assignments Outline" : parentsInfo[parentHeadingId]["title"]}
    onDrop={onDrop} 
    onDropEnter={onDropEnter}
    onDropLeave={onDropLeave}
    draggedOver={parentHeadingId == currentDraggedOverContainerId}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd} 
    onDraggableDragOver={onDraggableDragOver}
    currentDraggedId={currentDraggedObject.id}
    currentDraggedType={currentDraggedObject.type}
    style={ getItemStyle(currentDraggedObject, parentNodeHeadingId, parentHeadingId) }> 
      { // iterate through children headings to generate tree recursively
      parentsInfo[parentHeadingId]["childFolders"].map(parentId => {
        return buildTreeStructureHelper(
          { parentHeadingId: parentId, 
            parentNodeHeadingId: parentHeadingId,
            parentsInfo: parentsInfo, 
            childrenInfo: childrenInfo, 
            onDragStart: onDragStart, 
            onDragEnd: onDragEnd, 
            onDraggableDragOver: onDraggableDragOver, 
            onDrop: onDrop, 
            onDropEnter: onDropEnter, 
            onDropLeave: onDropLeave,
            currentDraggedObject: currentDraggedObject,
            currentDraggedOverContainerId: currentDraggedOverContainerId});
      })}
      { // iterate through children assigments to generate tree recursively
      parentsInfo[parentHeadingId]["childrenList"].map((childId, index) => {
        
        return <LeafNode 
          index={index}
          id={childId} 
          key={childId} 
          data={childrenInfo[childId]["title"]}
          styles={ Object.assign({color: '#0083e3'}, 
            getItemStyle(currentDraggedObject, parentHeadingId, childId))
          }
          onDragStart={onDragStart} 
          onDragEnd={onDragEnd} 
          onDragOver={onDraggableDragOver} />
      })}
    </ParentNode>;

  return subTree;
}
