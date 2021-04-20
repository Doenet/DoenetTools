import React, {useState} from "../../_snowpack/pkg/react.js";
export default function useDoenetRenderer(props, initializeChildrenOnConstruction = true, doenetPropsForChildren = {}) {
  let [updateCount, setUpdateCount] = useState(0);
  let stateValues = props.componentInstructions.stateValues;
  let actions = props.componentInstructions.actions;
  let children = [];
  let name = props.componentInstructions.componentName;
  props.rendererUpdateMethods[name] = {
    update: () => {
      setUpdateCount(updateCount + 1);
    },
    addChildren,
    removeChildren,
    swapChildren
  };
  function addChildren(instruction) {
    let childInstructions = childrenToCreate[instruction.indexForParent];
    let child = createChildFromInstructions(childInstructions);
    children.splice(instruction.indexForParent, 0, child);
    children = [...children];
    setUpdateCount(updateCount + 1);
  }
  function removeChildren(instruction) {
    children.splice(instruction.firstIndexInParent, instruction.numberChildrenDeleted);
    children = [...children];
    for (let componentName of instruction.deletedComponentNames) {
      delete props.rendererUpdateMethods[componentName];
    }
    setUpdateCount(updateCount + 1);
  }
  function swapChildren(instruction) {
    [children[instruction.index1], children[instruction.index2]] = [children[instruction.index2], children[instruction.index1]];
    children = [...children];
    setUpdateCount(updateCount + 1);
  }
  if (initializeChildrenOnConstruction) {
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
      flags: props.flags
    };
    Object.assign(propsForChild, doenetPropsForChildren);
    let child = React.createElement(props.rendererClasses[childInstructions.rendererType], propsForChild);
    return child;
  }
  function updatesetDoenetPropsForChildren(props2) {
    setDoenetPropsForChildren(props2);
  }
  return [name, stateValues, actions, children, initializeChildren, updatesetDoenetPropsForChildren];
}
