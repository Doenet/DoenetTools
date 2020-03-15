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

  const onDraggableDragOver = (id) => {
    const draggedOverItemParentListId = assignmentsInfo[id]["parent"];
    const draggedOverItemIndex = headingsInfo[draggedOverItemParentListId]["assignmentId"]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = assignmentsInfo[currentDraggedObject.id]["parent"];

    // if the item is dragged over itself, ignore
    if (currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    } 
    
    // filter out the currently dragged item
    let items = headingsInfo[draggedOverItemParentListId]["assignmentId"].filter(itemId => itemId != currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, currentDraggedObject.id);
    
    // update headingsInfo
    headingsInfo[draggedOverItemParentListId]["assignmentId"] = items
    updateHeadingsAndAssignments(headingsInfo, assignmentsInfo);
    // invoke callback
    setHeadings((prevHeadings) => {
      prevHeadings[draggedOverItemParentListId]["assignmentId"] = items;
      return({
        ...prevHeadings
      })
    })
  };

  const onDroppableDragOver = useCallback((listId) => {
    // const currentDraggedItem = { ...todoValues[currentDraggedObject.id] };
    // const previousState = currentDraggedItem.state; 
    // if (previousState == listId) return;

    // let previousList = list[currentDraggedItem.state];
    // const indexInList = previousList.findIndex(item => item.id == currentDraggedObject.id);
    // if (indexInList > -1) {
    //   previousList.splice(indexInList, 1);
    // }
    // currentDraggedItem.state = listId;
    // const currentList = list[currentDraggedItem.state];
    // currentList.push({id: currentDraggedObject.id});
    // setValue({ ...todoValues, [currentDraggedObject.id]: currentDraggedItem });
    // setLists({ ...list, [previousState]: previousList, [currentDraggedItem.state]: currentList} );
    // window.requestAnimationFrame(() => { currentDraggedObject.ev.target.style.visibility = "hidden"; });
  }, [todoValues, list, currentDraggedObject.id])

  const onDrop = () => {
    // window.requestAnimationFrame(() => { currentDraggedObject.ev.target.style.visibility = "visible"; });
    // setValue({ ...todoValues});
    // setCurrentDraggedObject({id: null, ev: null});
  }

  return (
    <div className="App">
      <div style={{ "textAlign": "left", "marginTop":"2em"}}>
        <Global />
        {buildTreeStructure(headingsInfo, assignmentsInfo, onDragStart, onDraggableDragOver, onDroppableDragOver, onDrop)}
      </div>
      {/* <div className="box">
        <DropItem heading="Todo" 
          className="container"
          id="todo"
          onDragOver={onDroppableDragOver} 
          onDrop={onDrop}>
          { renderDragItems(transitions["todo"], todoValues, onDragStart, onDragOver) }
        </DropItem>
        <DropItem heading="WIP" 
          className="container"
          id="wip"
          onDragOver={onDroppableDragOver} 
          onDrop={onDrop}>
          { renderDragItems(transitions["wip"], todoValues, onDragStart, onDragOver) }
        </DropItem>
        <DropItem heading="Done" 
          className="container"
          id="done"
          onDragOver={onDroppableDragOver} 
          onDrop={onDrop}>
          { renderDragItems(transitions["done"], todoValues, onDragStart, onDragOver) }
        </DropItem>
      </div>       */}
    </div>
  );
}

// function renderDragItems(transition, todoValues, onDragStart, onDragOver) {
//   return transition.map(({ item, props: { y, ...rest }, key }, index) => (
//     <animated.div
//       key={key}
//       style={{
//         transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
//         width: "100%",
//         height: "100%",
//         ...rest
//       }}
//     >
//     <DragItem id={item.id} key={item.id} index={index}  onDragStart={onDragStart} onDragOver={onDragOver} >
//       <div className="item">{todoValues[item.id].text}</div>
//     </DragItem>
//     </animated.div>
//   ))
// }

// function renderLeafNodes(transition, todoValues, onDragStart, onDragOver) {
//   return transition.map(({ item, props: { y, ...rest }, key }, index) => (
//     <animated.div
//       key={key}
//       style={{
//         transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
//         width: "100%",
//         height: "100%",
//         ...rest
//       }}
//     >
//     <LeafNode 
//       id={item.id} key={item.id} index={index}
//       data={todoValues[item.id].text} 
//       style={{ color: '#37ceff' }}  
//       onDragStart={onDragStart} 
//       onDragOver={onDragOver} />
//     </animated.div>
//   ))
// }

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
    onDrop={onDrop} > 
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
