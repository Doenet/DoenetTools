import React, { useState } from 'react';

export default function useDoenetRenderer(props,initializeChildrenOnConstruction=true){
  let [updateCount,setUpdateCount] = useState(0);


  let stateValues = props.componentInstructions.stateValues;
  let actions = props.componentInstructions.actions;
  let children = [];
  let name =  props.componentInstructions.componentName;
  

  // console.log("updateCount",updateCount)
  props.rendererUpdateMethods[name] = {
    update: ()=>{setUpdateCount(updateCount + 1)},
    addChildren,
    removeChildren,
    swapChildren,
  }

  function addChildren(instruction) {
    let childInstructions = this.childrenToCreate[instruction.indexForParent];
    let child = this.createChildFromInstructions(childInstructions);
    children.splice(instruction.indexForParent, 0, child);
    children = [...this.children]; // needed for React to recognize it's different

    setUpdateCount(updateCount + 1);
  }

  function removeChildren(instruction) {
    children.splice(instruction.firstIndexInParent, instruction.numberChildrenDeleted);
    children = [...children]; // needed for React to recognize it's different
    for (let componentName of instruction.deletedComponentNames) {
      delete props.rendererUpdateMethods[componentName];
    }
    setUpdateCount(updateCount + 1);
  }

  function swapChildren(instruction) {
    [children[instruction.index1], children[instruction.index2]]
      = [children[instruction.index2], children[instruction.index1]];
    children = [...children]; // needed for React to recognize it's different
    setUpdateCount(updateCount + 1);
  }

  if (initializeChildrenOnConstruction){
    initializeChildren();
  }

  function initializeChildren() {
    for (let childInstructions of props.componentInstructions.children) {
      let child = createChildFromInstructions(childInstructions);
      children.push(child);
    }
    return children;
  }

  function createChildFromInstructions(childInstructions) {
    let propsForChild = {
      key: childInstructions.componentName,
      componentInstructions: childInstructions,
      rendererClasses: props.rendererClasses,
      rendererUpdateMethods: props.rendererUpdateMethods,
      flags: props.flags,
    };

    let child = React.createElement(props.rendererClasses[childInstructions.rendererType], propsForChild);
    return child;
  }

  return [name,stateValues,actions,children,initializeChildren];
}