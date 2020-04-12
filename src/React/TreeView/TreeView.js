import React, { useState, useEffect, useCallback } from "react";
import { LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import "./index.css";


export const TreeView = ({headingsInfo, assignmentsInfo, currentDraggedObject, onDragStart, onDragEnd, onDraggableDragOver, onDrop, onDropEnter}) => {
  const [currentDraggedOverContainerId, setCurrentDraggedOverContainerId] = useState(null);

  const onDropCb = () => {
    setCurrentDraggedOverContainerId(null);
    onDrop();
  }

  const onDropEnterCb = (id) => {
    setCurrentDraggedOverContainerId(id); 
    onDropEnter(id);
  }

  return (
    <>
    { buildTreeStructure({
        headingsInfo: headingsInfo, 
        assignmentsInfo: assignmentsInfo, 
        onDragStart: onDragStart, 
        onDragEnd: onDragEnd, 
        onDraggableDragOver: onDraggableDragOver, 
        onDrop: onDropCb, 
        onDropEnter: onDropEnterCb, 
        currentDraggedId: currentDraggedObject.id, 
        currentDraggedType: currentDraggedObject.type, 
        currentDraggedOverContainerId: currentDraggedOverContainerId
      }) 
    }
    </>
  );
}

function buildTreeStructure({headingsInfo, assignmentsInfo, onDragStart, onDragEnd, 
  onDraggableDragOver, onDrop, onDropEnter, currentDraggedId, currentDraggedType, currentDraggedOverContainerId}) {
  let baseLevelHeadings = headingsInfo["UltimateHeader"]["headingId"];
  
  let treeStructure = <React.Fragment>
    <div>
      <ParentNode 
      id="UltimateHeader"
      key="ultimateHeader"
      data="Tree 1"
      onDrop={onDrop} 
      onDragStart={onDragStart}
      onDragEnd={onDragEnd} 
      onDropEnter={onDropEnter}
      onDraggableDragOver={onDraggableDragOver}
      draggedOver={currentDraggedOverContainerId == "UltimateHeader" && 
        currentDraggedType !== "leaf"}
      currentDraggedId={currentDraggedId}
      currentDraggedType={currentDraggedType}
      defaultOpen={true} > 
      {// iterate through base level headings to generate tree recursively
      baseLevelHeadings.map(baseHeadingId => {
        return buildTreeStructureHelper(
          { parentHeadingId: baseHeadingId, 
            headingsInfo: headingsInfo, 
            assignmentsInfo: assignmentsInfo, 
            onDragStart: onDragStart, 
            onDragEnd: onDragEnd, 
            onDraggableDragOver: onDraggableDragOver, 
            onDrop: onDrop, 
            onDropEnter: onDropEnter, 
            currentDraggedId: currentDraggedId, 
            currentDraggedType: currentDraggedType,
            currentDraggedOverContainerId: currentDraggedOverContainerId});
      })}
      </ParentNode>
    </div>
  </React.Fragment>;
  
  return treeStructure;
}

function buildTreeStructureHelper({parentHeadingId, headingsInfo, assignmentsInfo, 
  onDragStart, onDragEnd, onDraggableDragOver, onDrop, onDropEnter, currentDraggedId, currentDraggedType,
   currentDraggedOverContainerId}) {
  
  let subTree = <ParentNode 
    id={parentHeadingId}
    key={parentHeadingId} 
    data={headingsInfo[parentHeadingId]["name"]}
    onDrop={onDrop} 
    onDropEnter={onDropEnter}
    draggedOver={parentHeadingId == currentDraggedOverContainerId}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd} 
    onDraggableDragOver={onDraggableDragOver}
    currentDraggedId={currentDraggedId}
    currentDraggedType={currentDraggedType}
    style={{
      border: currentDraggedId == parentHeadingId ? "2px dotted #37ceff" : "0px",
      background: currentDraggedId == parentHeadingId ? "#fff" : "none",
      padding: currentDraggedId == parentHeadingId ? "0px 5px" : "0px",
    }}> 
      { // iterate through children headings to generate tree recursively
      headingsInfo[parentHeadingId]["headingId"].map(headingId => {
        return buildTreeStructureHelper(
          { parentHeadingId: headingId, 
            headingsInfo: headingsInfo, 
            assignmentsInfo: assignmentsInfo, 
            onDragStart: onDragStart, 
            onDragEnd: onDragEnd, 
            onDraggableDragOver: onDraggableDragOver, 
            onDrop: onDrop, 
            onDropEnter: onDropEnter, 
            currentDraggedId: currentDraggedId, 
            currentDraggedType: currentDraggedType,
            currentDraggedOverContainerId: currentDraggedOverContainerId});
      })}
      { // iterate through children assigments to generate tree recursively
      headingsInfo[parentHeadingId]["assignmentId"].map((assignmentId, index) => {
        return <LeafNode 
          index={index}
          id={assignmentId} 
          key={assignmentId} 
          data={assignmentsInfo[assignmentId]["name"]} 
          styles={{
            color: '#0083e3',
            border: currentDraggedId == assignmentId ? "2px dotted #37ceff" : "0px",
            background: currentDraggedId == assignmentId ? "#fff" : "none",
            padding: currentDraggedId == assignmentId ? "0px 5px" : "0px",
          }}
          onDragStart={onDragStart} 
          onDragEnd={onDragEnd} 
          onDragOver={onDraggableDragOver} />
      })}
    </ParentNode>;

  return subTree;
}
