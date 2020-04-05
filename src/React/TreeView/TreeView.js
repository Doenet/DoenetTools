import React, { useState, useEffect, useCallback } from "react";
import { LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import "./index.css";


export const TreeView = ({headingsInfo, assignmentsInfo, currentDraggedObject, onDragStart, onDraggableDragOver, onDrop, onDropEnter}) => {
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
    <Global />
    { buildTreeStructure(headingsInfo, assignmentsInfo, onDragStart, onDraggableDragOver, onDropCb, onDropEnterCb, currentDraggedObject.id, currentDraggedOverContainerId) }
    </>
  );
}

function buildTreeStructure(headingsInfo, assignmentsInfo, onDragStart, onDraggableDragOver, onDrop, onDropEnter, currentDraggedId, currentDraggedOverContainerId) {
  let baseLevelHeadings = headingsInfo["UltimateHeader"]["headingId"];
  
  let treeStructure = <React.Fragment>
    <div>
      <ParentNode 
      id="UltimateHeader"
      key="ultimateHeader"
      data="Tree 1"
      onDrop={onDrop} 
      onDragStart={onDragStart}
      onDropEnter={onDropEnter}
      onDraggableDragOver={onDraggableDragOver}
      draggedOver={currentDraggedOverContainerId == "UltimateHeader"}
      draggable={false}
      defaultOpen={true} > 
      {// iterate through base level headings to generate tree recursively
      baseLevelHeadings.map(baseHeadingId => {
        return buildTreeStructureHelper(baseHeadingId, headingsInfo, assignmentsInfo, 
          onDragStart, onDraggableDragOver, onDrop, onDropEnter, currentDraggedId, currentDraggedOverContainerId);
      })}
      </ParentNode>
    </div>
  </React.Fragment>;
  
  return treeStructure;
}

function buildTreeStructureHelper(parentHeadingId, headingsInfo, assignmentsInfo, 
  onDragStart, onDraggableDragOver, onDrop, onDropEnter, currentDraggedId, currentDraggedOverContainerId) {
  
  let subTree = <ParentNode 
    id={parentHeadingId}
    key={parentHeadingId} 
    data={headingsInfo[parentHeadingId]["name"]}
    onDrop={onDrop} 
    onDropEnter={onDropEnter}
    draggedOver={parentHeadingId == currentDraggedOverContainerId}
    onDragStart={onDragStart}
    onDraggableDragOver={onDraggableDragOver}
    style={{
      border: currentDraggedId == parentHeadingId ? "2px dotted #37ceff" : "0px",
      background: currentDraggedId == parentHeadingId ? "rgba(255, 255, 255, 0.3)" : "none",
      padding: currentDraggedId == parentHeadingId ? "0px 5px" : "0px",
    }}> 
      { // iterate through children headings to generate tree recursively
      headingsInfo[parentHeadingId]["headingId"].map(headingId => {
        return buildTreeStructureHelper(headingId, headingsInfo, assignmentsInfo,
          onDragStart, onDraggableDragOver, onDrop, onDropEnter, currentDraggedId, currentDraggedOverContainerId);
      })}
      { // iterate through children assigments to generate tree recursively
      headingsInfo[parentHeadingId]["assignmentId"].map((assignmentId, index) => {
        return <LeafNode 
          index={index}
          id={assignmentId} 
          key={assignmentId} 
          data={assignmentsInfo[assignmentId]["name"]} 
          styles={{
            color: '#37ceff',
            border: currentDraggedId == assignmentId ? "2px dotted #37ceff" : "0px",
            background: currentDraggedId == assignmentId ? "rgba(255, 255, 255, 0.3)" : "none",
            padding: currentDraggedId == assignmentId ? "0px 5px" : "0px",
          }}
          onDragStart={onDragStart} 
          onDragOver={onDraggableDragOver} />
      })}
    </ParentNode>;

  return subTree;
}
