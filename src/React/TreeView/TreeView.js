import React, { useState, useEffect, useCallback } from "react";
import { LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import "./index.css";


export const TreeView = ({containerId, headingsInfo, assignmentsInfo, currentDraggedObject, 
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

  return (
    <>
    { buildTreeStructure({
        headingsInfo: headingsInfo, 
        assignmentsInfo: assignmentsInfo, 
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

function buildTreeStructure({headingsInfo, assignmentsInfo, onDragStart, onDragEnd, 
  onDraggableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedObject, currentDraggedOverContainerId}) {
  
  // let treeStructure = <React.Fragment>
  //   <div>
  //     <ParentNode 
  //     id="UltimateHeader"
  //     key="ultimateHeader"
  //     data="Tree 1"
  //     onDrop={onDrop} 
  //     onDragStart={onDragStart}
  //     onDragEnd={onDragEnd} 
  //     onDropEnter={onDropEnter}
  //     onDraggableDragOver={onDraggableDragOver}
  //     draggedOver={currentDraggedOverContainerId == "UltimateHeader" && 
  //       currentDraggedObject.type !== "leaf"}
  //     currentDraggedId={currentDraggedObject.id}
  //     currentDraggedType={currentDraggedObject.type}
  //     defaultOpen={true} > 
  //     {// iterate through base level headings to generate tree recursively
  //     baseLevelHeadings.map(baseHeadingId => {
  //       return buildTreeStructureHelper(
  //         { parentHeadingId: baseHeadingId, 
  //           parentNodeHeadingId: "UltimateHeader",
  //           headingsInfo: headingsInfo, 
  //           assignmentsInfo: assignmentsInfo, 
  //           onDragStart: onDragStart, 
  //           onDragEnd: onDragEnd, 
  //           onDraggableDragOver: onDraggableDragOver, 
  //           onDrop: onDrop, 
  //           onDropEnter: onDropEnter, 
  //           currentDraggedObject: currentDraggedObject,
  //           currentDraggedOverContainerId: currentDraggedOverContainerId});
  //     })}
  //     </ParentNode>
  //   </div>
  // </React.Fragment>;
  
  // return treeStructure;

  return buildTreeStructureHelper(
    { parentHeadingId: "UltimateHeader", 
      parentNodeHeadingId: "UltimateHeader",
      headingsInfo: headingsInfo, 
      assignmentsInfo: assignmentsInfo, 
      onDragStart: onDragStart, 
      onDragEnd: onDragEnd, 
      onDraggableDragOver: onDraggableDragOver, 
      onDrop: onDrop, 
      onDropEnter: onDropEnter, 
      onDropLeave: onDropLeave, 
      currentDraggedObject: currentDraggedObject,
      currentDraggedOverContainerId: currentDraggedOverContainerId});
}

function buildTreeStructureHelper({parentHeadingId, parentNodeHeadingId, headingsInfo, assignmentsInfo, 
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
    data={parentHeadingId == "UltimateHeader" ? "Assignments Outline" : headingsInfo[parentHeadingId]["title"]}
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
      headingsInfo[parentHeadingId]["childHeadings"].map(headingId => {
        return buildTreeStructureHelper(
          { parentHeadingId: headingId, 
            parentNodeHeadingId: parentHeadingId,
            headingsInfo: headingsInfo, 
            assignmentsInfo: assignmentsInfo, 
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
      headingsInfo[parentHeadingId]["childAssignments"].map((assignmentId, index) => {
        
        return <LeafNode 
          index={index}
          id={assignmentId} 
          key={assignmentId} 
          data={assignmentsInfo[assignmentId]["title"]} 
          styles={ Object.assign({color: '#0083e3'}, 
            getItemStyle(currentDraggedObject, parentHeadingId, assignmentId))
          }
          onDragStart={onDragStart} 
          onDragEnd={onDragEnd} 
          onDragOver={onDraggableDragOver} />
      })}
    </ParentNode>;

  return subTree;
}
