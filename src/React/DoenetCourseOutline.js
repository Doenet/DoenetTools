import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components'
import { TreeView } from './TreeView/TreeView'


const DoenetCourseOutline = ({ treeHeadingsInfo, treeAssignmentsInfo, updateHeadingsAndAssignments,
  courseFoldersInfo, courseContentInfo, updateCourseFoldersAndContent }) => {
  const [currentDraggedObject, setCurrentDraggedObject] = useState({id: null, type: null, sourceContainerId: null, dataObject: null, sourceParentId: null});
  const [treeHeadings, setTreeHeadings] = useState(treeHeadingsInfo);
  const [treeAssignments, setTreeAssignments] = useState(treeAssignmentsInfo);
  const [originalTreeHeadingsAndAssignments, setOriginalTreeHeadingsAndAssignments] = useState({
    treeHeadings: treeHeadingsInfo,
    treeAssignments: treeAssignmentsInfo,
  });
  const [validDrop, setValidDrop] = useState(true);
  
  // handle onPropsUpdate
  useEffect(() => {
    setTreeHeadings(treeHeadingsInfo);
    setTreeAssignments(treeAssignmentsInfo);
  }, [treeHeadingsInfo, treeAssignmentsInfo])

  // handle dragend
  useEffect(() => {
    console.log(validDrop)
    if (currentDraggedObject.id == null // drag ended
      && !validDrop  // dropped outsize valid dropzone
    ) {
      console.log("invalid end")
    }
  }, [currentDraggedObject])

  // useEffect(() => {
  //   const mouseUpListener = () => {
  //     console.log("TEST")
  //   }
  //   document.documentElement.addEventListener('mouseup', mouseUpListener); 
  //   // return () => {
  //   //   document.documentElement.removeEventListener('mouseup', dragStartCb);
  //   // };
  // });

  const onDragStart = (draggedId, draggedType, sourceContainerId) => {
    setValidDrop(() => false);
    const dataObjectSource = draggedType == "leaf" ? treeAssignments : treeHeadings;
    const dataObject = dataObjectSource[draggedId];
    const sourceParentId = dataObjectSource[draggedId].parent;
    setCurrentDraggedObject({id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId});
    setOriginalTreeHeadingsAndAssignments({
      treeHeadings: treeHeadings,
      treeAssignments: treeAssignments,
    });
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

    const currentDraggedObjectInfo = currentDraggedObject.dataObject;
    const previousParentId = currentDraggedObjectInfo.parent;

    if (previousParentId == listId || listId == currentDraggedObject.id) // prevent heading from becoming a child of itself 
      return;
    console.log(treeHeadings[previousParentId]["name"] + " " + treeHeadings[listId]["name"])
    
    const headingsChildrenListKey = currentDraggedObject.type == "leaf" ? "assignmentId" : "headingId";
    const previousList = treeHeadings[previousParentId][headingsChildrenListKey];
    const currentList = treeHeadings[listId][headingsChildrenListKey];
    // remove from previous list
    if (previousParentId !== currentDraggedObject.sourceParentId) {
      console.log("delete from " + treeHeadings[listId]["name"]);
      const indexInList = previousList.findIndex(itemId => itemId == currentDraggedObject.id);
      if (indexInList > -1) {
        previousList.splice(indexInList, 1);
      }
    }
    if (listId !== currentDraggedObject.sourceParentId) {
      // add to current list
      console.log("PuSHED");
      currentList.push(currentDraggedObject.id);     
    }

    setCurrentDraggedObject((prevCurrentDraggedObject) => {
      prevCurrentDraggedObject.dataObject.parent = listId;
      return {
        ...prevCurrentDraggedObject
      }
    })

    setTreeHeadings((prevHeadings) => {
      prevHeadings[previousParentId][headingsChildrenListKey] = previousList;
      prevHeadings[listId][headingsChildrenListKey] = currentList;
      return({
        ...prevHeadings
      })
    })
    if (currentDraggedObject.type == "leaf") {
      setTreeAssignments((prevAssignments) => {
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
    // update treeHeadings/treeAssignments currentDraggedObject parentId
    // remove currentDraggedObject from sourceParentId children list
    if (currentDraggedObject.type == "leaf") {
      setTreeAssignments((prevAssignments) => {
        prevAssignments[currentDraggedObject.id] = currentDraggedObject.dataObject;
        return({
          ...prevAssignments
        })
      })
    }
    const headingsChildrenListKey = currentDraggedObject.type == "leaf" ? "assignmentId" : "headingId";
    const sourceParentChildrenList = treeHeadings[currentDraggedObject.sourceParentId][headingsChildrenListKey];
    
    if (currentDraggedObject.dataObject.parent !== currentDraggedObject.sourceParentId) {
      const indexInSourceParentChildrenList = sourceParentChildrenList.findIndex(itemId => itemId == currentDraggedObject.id);
      if (indexInSourceParentChildrenList > -1) {
        sourceParentChildrenList.splice(indexInSourceParentChildrenList, 1);
      }
    }
    setTreeHeadings((prevHeadings) => {
      prevHeadings[currentDraggedObject.sourceParentId][headingsChildrenListKey] = sourceParentChildrenList;
      if (currentDraggedObject.type == "parent") prevHeadings[currentDraggedObject.id] = currentDraggedObject.dataObject;
      return({
        ...prevHeadings
      })
    })
    
    setValidDrop(true);
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