import React, { useState, useEffect, useCallback } from "react";
import DragItem from "./components/drag-item";
import DropItem from "./components/drop-item";
import { TreeNode, LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import { useTransition, animated, config } from 'react-spring'
import "./index.css";


export const TreeView = ({headingsInfo, assignmentsInfo, updateHeadingsAndAssignments}) => {
  const [currentDraggedObject, setCurrentDraggedObject] = useState({id: null, ev: null});
  const [headings, setHeadings] = useState(headingsInfo);
  const [assignments, setAssignments] = useState(assignmentsInfo);
  const [dropTimer, setDropTimer] = useState(null);

  useEffect(() => {
    setHeadings(headingsInfo);
    setAssignments(assignmentsInfo);
  }, [headingsInfo, assignmentsInfo])

  // let height = 0
  // let transitions = {};
  // for (let [listId, listVal] of Object.entries(list)) {
  //   const transition = useTransition(
  //     listVal.map((data, i) => ({ ...data, y: (height += 1) - 1 })),
  //     d => d.id,
  //     {
  //       from: { opacity: 0 },
  //       leave: { height: 0, opacity: 0 },
  //       enter: ({ y }) => ({ y, opacity: 1 }),
  //       update: ({ y }) => ({ y })
  //     }
  //   );
  //   transitions[listId] = transition;
  // }


  const onDragStart = (draggedId, draggedType, ev) => {
    setCurrentDraggedObject({id: draggedId, type: draggedType, ev: ev});
  }

  const onDraggableDragOver = (id, type) => {
    // draggedType must be equal to dragOver type
    if (type != currentDraggedObject.type) return;

    console.log(id);
    console.log(type);

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
    // console.log(headings[draggedOverItemParentListId][headingsChildrenListKey])
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
    window.requestAnimationFrame(() => { currentDraggedObject.ev.target.style.visibility = "hidden"; });
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
    // window.requestAnimationFrame(() => { currentDraggedObject.ev.target.style.visibility = "visible"; });
    setCurrentDraggedObject({id: null, ev: null});
    clearInterval(dropTimer);
    updateHeadingsAndAssignments(headings, assignments);
  }

  const onDropEnter = (listId) => {
    if (currentDraggedObject.type == "leaf") {
      return;
    }
    clearInterval(dropTimer);
    let newTimer = setTimeout(function() {
        // console.log(listId)
        // onDroppableDragOver(listId)
    }, 2000);
    setDropTimer(newTimer);
  }

  const onDropExit = () => {
    clearInterval(dropTimer);
    setDropTimer(null);
  }

  return (
    <div className="App">
      <div style={{ "textAlign": "left", "marginTop":"2em"}}>
        <Global />
        {buildTreeStructure(headings, assignments, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropExit)}
      </div>
    </div>
  );
}

function buildTreeStructure(headingsInfo, assignmentsInfo, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropExit) {
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
      onDropEnter={() => console.log()} 
      onDropExit={() => console.log()} 
      onDraggableDragOver={onDraggableDragOver}
      draggable={false}
      defaultOpen={true}> 
      {// iterate through base level headings to generate tree recursively
      baseLevelHeadings.map(baseHeadingId => {
        return buildTreeStructureHelper(baseHeadingId, headingsInfo, assignmentsInfo, 
          onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropExit);
      })}
      </ParentNode>
    </div>
  </React.Fragment>;
  
  return treeStructure;
}

function buildTreeStructureHelper(parentHeadingId, headingsInfo, assignmentsInfo, 
  onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropExit) {
  let subTree = <ParentNode 
    id={parentHeadingId}
    key={parentHeadingId} 
    data={headingsInfo[parentHeadingId]["name"]}
    onDroppableDragOver={onDroppableDragOver} 
    onDrop={onDrop} 
    onDropEnter={onDropEnter} 
    onDropExit={onDropExit} 
    onDragStart={onDragStart}
    onDraggableDragOver={onDraggableDragOver}> 
      { // iterate through children headings to generate tree recursively
      headingsInfo[parentHeadingId]["headingId"].map(headingId => {
        return buildTreeStructureHelper(headingId, headingsInfo, assignmentsInfo,
          onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop, onDropEnter, onDropExit);
      })}
      { // iterate through children assigments to generate tree recursively
      headingsInfo[parentHeadingId]["assignmentId"].map((assignmentId, index) => {
        return <LeafNode 
          index={index}
          id={assignmentId} 
          key={assignmentId} 
          data={assignmentsInfo[assignmentId]["name"]} 
          style={{ color: '#37ceff' }}  
          onDragStart={onDragStart} 
          onDragOver={onDraggableDragOver} />
      })}
    </ParentNode>;

  return subTree;
}
