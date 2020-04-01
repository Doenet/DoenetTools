import React, { useState, useEffect, useCallback } from "react";
import DragItem from "./components/drag-item";
import DropItem from "./components/drop-item";
import { TreeNode, LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import { useTransition, animated, config } from 'react-spring'
import "./index.css";


export const DoenetCourseOutline = ({ treeHeadingsInfo, treeAssignmentsInfo, updateHeadingsAndAssignments,
  courseFoldersInfo, courseContentInfo, updateCourseFoldersAndContent }) => {
  const [currentDraggedObject, setCurrentDraggedObject] = useState({id: null, type: null, sourceContainerId: null});
  const [treeHeadings, setTreeHeadings] = useState(treeHeadingsInfo);
  const [treeAssignments, setTreeAssignments] = useState(treeAssignmentsInfo);
  

  useEffect(() => {
    setTreeHeadings(treeHeadingsInfo);
    setTreeAssignments(treeAssignmentsInfo);
  }, [treeHeadingsInfo, treeAssignmentsInfo])

  const onDragStart = (draggedId, draggedType, sourceContainerId) => {
    setCurrentDraggedObject({id: draggedId, type: draggedType, sourceContainerId: sourceContainerId});
  }

  const onTreeDraggableDragOver = (id, type) => {
    // draggedType must be equal to dragOver type
    if (type != currentDraggedObject.type) return;

    const draggedOverItemInfo = type == "leaf" ? treeAssignments : treeHeadings;
    const currentDraggedObjectInfo = currentDraggedObject.type == "leaf" ? treeAssignments : treeHeadings;

    const draggedOverItemParentListId = draggedOverItemInfo[id]["parent"];
    const draggedOverItemIndex = treeHeadings[draggedOverItemParentListId]["assignmentId"]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = currentDraggedObjectInfo[currentDraggedObject.id]["parent"];

    // if the item is dragged over itself, ignore
    if (currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    } 
    
    const headingsChildrenListKey = type == "leaf" ? "assignmentId" : "headingId";
    // filter out the currently dragged item
    const items = treeHeadings[draggedOverItemParentListId][headingsChildrenListKey].filter(itemId => itemId != currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, currentDraggedObject.id);
    
    // update headings
    setTreeHeadings((prevHeadings) => {
      prevHeadings[draggedOverItemParentListId][headingsChildrenListKey] = items;
      return({
        ...prevHeadings
      })
    })
  };

  const onTreeDroppableDragOver = useCallback((listId) => {
    const currentDraggedObjectInfo = currentDraggedObject.type == "leaf" ? treeAssignments : treeHeadings;
    const previousParentId = currentDraggedObjectInfo[currentDraggedObject.id].parent; 
    if (previousParentId == listId) return;
    
    const headingsChildrenListKey = currentDraggedObject.type == "leaf" ? "assignmentId" : "headingId";
    const previousList = treeHeadings[previousParentId][headingsChildrenListKey];
    const indexInList = previousList.findIndex(itemId => itemId == currentDraggedObject.id);
    if (indexInList > -1) {
      previousList.splice(indexInList, 1);
    }
    const currentList = treeHeadings[listId][headingsChildrenListKey];
    currentList.push(currentDraggedObject.id);
    setTreeHeadings((prevHeadings) => {
      prevHeadings[previousParentId][headingsChildrenListKey] = previousList;
      prevHeadings[listId][headingsChildrenListKey] = currentList;
      if (currentDraggedObject.type == "parent") prevHeadings[currentDraggedObject.id]["parent"] = listId;
      return({
        ...prevHeadings
      })
    })
    if (currentDraggedObject.type == "leaf") {
      setTreeAssignments((prevAssignments) => {
        prevAssignments[currentDraggedObject.id]["parent"] = listId;
        return({
          ...prevAssignments
        })
      })
    }
  }, [currentDraggedObject.id])

  const onDrop = () => {
    setCurrentDraggedObject({id: null, type: null, sourceContainerId: null});
    updateHeadingsAndAssignments(treeHeadings, treeAssignments);
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
      </div>
    </div>
  );
}