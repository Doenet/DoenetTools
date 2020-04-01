import React, { useState, useEffect, useCallback } from "react";
import { LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import { useTransition, animated, config } from 'react-spring'
import "./index.css";


export const TreeView = ({headingsInfo, assignmentsInfo, currentDraggedObject, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop}) => {
  const [headings, setHeadings] = useState(headingsInfo);
  const [assignments, setAssignments] = useState(assignmentsInfo);
  const [currentDraggedOverContainerId, setCurrentDraggedOverContainerId] = useState(null);

  const onDrop = () => {
    setCurrentDraggedOverContainerId(null);
    onDrop();
  }

  const onDropEnter = (id) => {
    setCurrentDraggedOverContainerId(id); 
  }

  const onDropLeave = () => {
    setCurrentDraggedOverContainerId(null);
  }

  return (
    buildTreeStructure(headings, assignments, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedObject.id, currentDraggedOverContainerId)
  );
}

function buildTreeStructure(headingsInfo, assignmentsInfo, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedId, currentDraggedOverContainerId) {
  let baseLevelHeadings = headingsInfo["UltimateHeader"]["headingId"];
  
  let treeStructure = <React.Fragment>
    <div>
      <ParentNode 
      id="UltimateHeader"
      key="ultimateHeader"
      data="Tree 1"
      onDroppableDragOver={onDroppableDragOver} 
      onDrop={onDrop} 
      onDragStart={onDragStart}
      onDropEnter={() => {}}
      onDropLeave={() => {}}
      draggedOver={false}
      onDraggableDragOver={onDraggableDragOver}
      draggable={false}
      defaultOpen={true}> 
      {// iterate through base level headings to generate tree recursively
      baseLevelHeadings.map(baseHeadingId => {
        return buildTreeStructureHelper(baseHeadingId, headingsInfo, assignmentsInfo, 
          onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedId, currentDraggedOverContainerId);
      })}
      </ParentNode>
    </div>
  </React.Fragment>;
  
  return treeStructure;
}

function buildTreeStructureHelper(parentHeadingId, headingsInfo, assignmentsInfo, 
  onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedId, currentDraggedOverContainerId) {
  
  let subTree = <ParentNode 
    id={parentHeadingId}
    key={parentHeadingId} 
    data={headingsInfo[parentHeadingId]["name"]}
    onDroppableDragOver={onDroppableDragOver} 
    onDrop={onDrop} 
    onDropEnter={onDropEnter}
    onDropLeave={onDropLeave}
    draggedOver={parentHeadingId == currentDraggedOverContainerId}
    onDragStart={onDragStart}
    onDraggableDragOver={onDraggableDragOver}> 
      { // iterate through children headings to generate tree recursively
      headingsInfo[parentHeadingId]["headingId"].map(headingId => {
        return buildTreeStructureHelper(headingId, headingsInfo, assignmentsInfo,
          onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedId, currentDraggedOverContainerId);
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