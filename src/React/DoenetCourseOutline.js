import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components'
import { TreeView } from './TreeView/TreeView'


const DoenetCourseOutline = ({ treeHeadingsInfo, treeAssignmentsInfo, updateHeadingsAndAssignments,
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
    const headingsChildrenListKey = type == "leaf" ? "assignmentId" : "headingId";
    const currentDraggedObjectInfo = currentDraggedObject.type == "leaf" ? treeAssignments : treeHeadings;

    const draggedOverItemParentListId = draggedOverItemInfo[id]["parent"];
    const draggedOverItemIndex = treeHeadings[draggedOverItemParentListId][headingsChildrenListKey]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = currentDraggedObjectInfo[currentDraggedObject.id]["parent"];

    // if the item is dragged over itself, ignore
    if (currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    } 

    // filter out the currently dragged item
    const items = treeHeadings[draggedOverItemParentListId][headingsChildrenListKey].filter(itemId => itemId != currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, currentDraggedObject.id);

    console.log(draggedOverItemIndex);
    
    // update headings
    setTreeHeadings((prevHeadings) => {
      prevHeadings[draggedOverItemParentListId][headingsChildrenListKey] = items;
      return({
        ...prevHeadings
      })
    })
  };

  const onDropEnter = (listId) => {

    // check current draggable source == tree
    // true then continue
    // false then (extract from original source, insert into tree at base level)

    // temp fix, do we want to allow assignments at base level
    if (listId == "UltimateHeader" && currentDraggedObject.type == "leaf") return;

    const currentDraggedObjectInfo = currentDraggedObject.type == "leaf" ? treeAssignments : treeHeadings;
    const previousParentId = currentDraggedObjectInfo[currentDraggedObject.id].parent; 
    if (previousParentId == listId || listId == currentDraggedObject.id) // prevent heading from becoming a child of itself 
      return;
    
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
  }

  const onDragEnd = () => {
    console.log("ENDED");
  }

  const onDrop = () => {
    console.log("DRopped")
    setCurrentDraggedObject({id: null, type: null, sourceContainerId: null});
    updateHeadingsAndAssignments(treeHeadings, treeAssignments);
  }

  return (
    <CourseOutlineFrame>
        <TreeView 
          headingsInfo={treeHeadings} 
          assignmentsInfo={treeAssignments} 
          currentDraggedObject={currentDraggedObject}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDraggableDragOver={onTreeDraggableDragOver} 
          onDropEnter={onDropEnter}
          onDrop={onDrop} />
        
        <TempChooser><span>Temp chooser</span></TempChooser>
    </CourseOutlineFrame>
  );
}

const CourseOutlineFrame = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  text-align: left;
  padding: 2em;
  overflow-y: scroll;
`

const TempChooser = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dotted #b3b3b3;
  color: #b3b3b3;
  background: #fff;
  width: 25em;
  height: 15em;
`

export default DoenetCourseOutline;