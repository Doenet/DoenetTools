import React, { useState, useEffect, useCallback } from "react";
import { LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import "./index.css";


export const SortableTreeView = ({headingsInfo, assignmentsInfo, updateHeadingsAndAssignments}) => {
  const [currentDraggedObject, setCurrentDraggedObject] = useState({id: null, ev: null});
  const [headings, setHeadings] = useState(headingsInfo);
  const [assignments, setAssignments] = useState(assignmentsInfo);
  const [currentDraggedOverContainerId, setCurrentDraggedOverContainerId] = useState(null);

  useEffect(() => {
    setHeadings(headingsInfo);
    setAssignments(assignmentsInfo);
  }, [headingsInfo, assignmentsInfo])

  const onDragStart = (draggedId, draggedType, ev) => {
    setCurrentDraggedObject({id: draggedId, type: draggedType, ev: ev});
  }

  const onDraggableDragOver = (id, type) => {
    // draggedType must be equal to dragOver type
    if (type != currentDraggedObject.type) return;

    const draggedOverItemInfo = type == "leaf" ? assignments : headings;
    const currentDraggedObjectInfo = currentDraggedObject.type == "leaf" ? assignments : headings;

    const draggedOverItemParentListId = draggedOverItemInfo[id]["parent"];
    const draggedOverItemIndex = headings[draggedOverItemParentListId]["assignmentId"]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = currentDraggedObjectInfo[currentDraggedObject.id]["parent"];

    // if the item is dragged over itself, ignore
    if (currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    } 
    
    const headingsChildrenListKey = type == "leaf" ? "assignmentId" : "headingId";
    // filter out the currently dragged item
    const items = headings[draggedOverItemParentListId][headingsChildrenListKey].filter(itemId => itemId != currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, currentDraggedObject.id);
    
    // update headings
    setHeadings((prevHeadings) => {
      prevHeadings[draggedOverItemParentListId][headingsChildrenListKey] = items;
      return({
        ...prevHeadings
      })
    })
  };

  const onDroppableDragOver = useCallback((listId) => {
    const currentDraggedObjectInfo = currentDraggedObject.type == "leaf" ? assignments : headings;
    const previousParentId = currentDraggedObjectInfo[currentDraggedObject.id].parent; 
    if (previousParentId == listId) return;
    
    const headingsChildrenListKey = currentDraggedObject.type == "leaf" ? "assignmentId" : "headingId";
    const previousList = headings[previousParentId][headingsChildrenListKey];
    const indexInList = previousList.findIndex(itemId => itemId == currentDraggedObject.id);
    if (indexInList > -1) {
      previousList.splice(indexInList, 1);
    }
    const currentList = headings[listId][headingsChildrenListKey];
    currentList.push(currentDraggedObject.id);
    setHeadings((prevHeadings) => {
      prevHeadings[previousParentId][headingsChildrenListKey] = previousList;
      prevHeadings[listId][headingsChildrenListKey] = currentList;
      if (currentDraggedObject.type == "parent") prevHeadings[currentDraggedObject.id]["parent"] = listId;
      return({
        ...prevHeadings
      })
    })
    if (currentDraggedObject.type == "leaf") {
      setAssignments((prevAssignments) => {
        prevAssignments[currentDraggedObject.id]["parent"] = listId;
        return({
          ...prevAssignments
        })
      })
    }
  }, [currentDraggedObject.id])

  const onDrop = () => {
    setCurrentDraggedObject({id: null, ev: null});
    setCurrentDraggedOverContainerId(null);
    updateHeadingsAndAssignments(headings, assignments);
  }

  const onDropEnter = (id) => {
    setCurrentDraggedOverContainerId(id); 
  }

  const onDropLeave = () => {
    setCurrentDraggedOverContainerId(null);
  }

  return (
    <div className="App">
      <div style={{ "textAlign": "left", "marginTop":"2em"}}>
        <Global />
        {buildTreeStructure(headings, assignments, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropLeave, currentDraggedObject.id, currentDraggedOverContainerId)}
      </div>
    </div>
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
    onDraggableDragOver={onDraggableDragOver}
    style={{
      border: currentDraggedId == parentHeadingId ? "2px dotted #37ceff" : "0px",
      background: currentDraggedId == parentHeadingId ? "rgba(255, 255, 255, 0.3)" : "none",
      padding: currentDraggedId == parentHeadingId ? "0px 5px" : "0px",
    }}> 
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
