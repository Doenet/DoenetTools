import React, { useState, useEffect, useCallback } from "react";
import DragItem from "./components/drag-item";
import DropItem from "./components/drop-item";
import { TreeNode, LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import { useTransition, animated, config } from 'react-spring'
import "./index.css";

const todos = {
  1: {
    text: "First thing",
    state: "todo",
    type: "leaf"
  },
  2: {
    text: "Second thing",
    state: "todo",
    type: "leaf"
  },
  3: {
    text: "Third thing",
    state: "todo",
    type: "leaf"
  },
  4: {
    text: "Fourth thing",
    state: "wip",
    type: "leaf"
  },
  5: {

  }
};

const listData = {
  todo: [{id: "1"}, {id: "2"}, {id: "3"}],
  wip: [{id: "4"}],
  done: []
};

export const TreeView = ({headingsInfo, assignmentsInfo, updateHeadingsAndAssignments}) => {
  const [todoValues, setValue] = useState(todos);
  const [list, setLists] = useState(listData);
  const [currentDraggedObject, setCurrentDraggedObject] = useState({id: null, ev: null});
  const [headings, setHeadings] = useState(headingsInfo);
  const [assignments, setAssignments] = useState(assignmentsInfo);

  useEffect(() => {
    setHeadings(headingsInfo);
    setAssignments(assignmentsInfo);
  }, [headingsInfo, assignmentsInfo])

  let height = 0
  let transitions = {};
  for (let [listId, listVal] of Object.entries(list)) {
    const transition = useTransition(
      listVal.map((data, i) => ({ ...data, y: (height += 1) - 1 })),
      d => d.id,
      {
        from: { opacity: 0 },
        leave: { height: 0, opacity: 0 },
        enter: ({ y }) => ({ y, opacity: 1 }),
        update: ({ y }) => ({ y })
      }
    );
    transitions[listId] = transition;
  }


  const onDragStart = (draggedId, ev) => {
    setCurrentDraggedObject({id: draggedId, ev: ev});
  }

  const onDraggableDragOver = (id, type) => {
    // console.log(type);
    if (type == "parent") return;
    const draggedOverItemParentListId = assignments[id]["parent"];
    const draggedOverItemIndex = headings[draggedOverItemParentListId]["assignmentId"]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = assignments[currentDraggedObject.id]["parent"];

    // if the item is dragged over itself, ignore
    if (currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    } 
    
    // filter out the currently dragged item
    const items = headings[draggedOverItemParentListId]["assignmentId"].filter(itemId => itemId != currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, currentDraggedObject.id);
    
    // update headings
    setHeadings((prevHeadings) => {
      prevHeadings[draggedOverItemParentListId]["assignmentId"] = items;
      return({
        ...prevHeadings
      })
    })
  };

  const onDroppableDragOver = useCallback((listId) => {
    const previousParentId = assignments[currentDraggedObject.id].parent; 
    if (previousParentId == listId) return;
    
    const previousList = headings[previousParentId]["assignmentId"];
    const indexInList = previousList.findIndex(itemId => itemId == currentDraggedObject.id);
    if (indexInList > -1) {
      previousList.splice(indexInList, 1);
    }
    const currentList = headings[listId]["assignmentId"];
    currentList.push(currentDraggedObject.id);
    window.requestAnimationFrame(() => { currentDraggedObject.ev.target.style.visibility = "hidden"; });
    setHeadings((prevHeadings) => {
      prevHeadings[previousParentId]["assignmentId"] = previousList;
      prevHeadings[listId]["assignmentId"] = currentList;
      return({
        ...prevHeadings
      })
    })
    setAssignments((prevAssignments) => {
      prevAssignments[currentDraggedObject.id]["parent"] = listId;
      return({
        ...prevAssignments
      })
    })
  }, [todoValues, list, currentDraggedObject.id])

  const onDrop = () => {
    // window.requestAnimationFrame(() => { currentDraggedObject.ev.target.style.visibility = "visible"; });
    setCurrentDraggedObject({id: null, ev: null});
    updateHeadingsAndAssignments(headings, assignments);
  }

  return (
    <div className="App">
      <div style={{ "textAlign": "left", "marginTop":"2em"}}>
        <Global />
        {buildTreeStructure(headings, assignments, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop)}
      </div>
    </div>
  );
}

function buildTreeStructure(headingsInfo, assignmentsInfo, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop) {
  let baseLevelHeadings = headingsInfo["UltimateHeader"]["headingId"];
  
  let treeStructure = <React.Fragment>
    <div>
      {// iterate through base level headings to generate tree recursively
      baseLevelHeadings.map(baseHeadingId => {
        return buildTreeStructureHelper(baseHeadingId, headingsInfo, assignmentsInfo, 
          onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop);
      })}
    </div>
  </React.Fragment>;
  
  return treeStructure;
}

function buildTreeStructureHelper(parentHeadingId, headingsInfo, assignmentsInfo, 
  onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop) {
  let subTree = <ParentNode 
    id={parentHeadingId}
    key={parentHeadingId} 
    data={headingsInfo[parentHeadingId]["name"]}
    onDroppableDragOver={onDroppableDragOver} 
    onDrop={onDrop} 
    onDragStart={onDragStart}
    onDraggableDragOver={onDraggableDragOver}> 
      { // iterate through children headings to generate tree recursively
      headingsInfo[parentHeadingId]["headingId"].map(headingId => {
        return buildTreeStructureHelper(headingId, headingsInfo, assignmentsInfo,
          onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop);
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
