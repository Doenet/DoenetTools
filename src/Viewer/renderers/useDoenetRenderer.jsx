import React, { useState } from 'react';
import { atomFamily, useRecoilValue } from 'recoil';
import { serializedComponentsReviver } from '../../Core/utils/serializedStateProcessing';

export const rendererSVs = atomFamily({
  key:'rendererSVs',
  default:{},
  dangerouslyAllowMutability: true,
})

//Renderers will need to set doenetPropsForChildren locally and pass it along. 
//Renderer can change it later and values will be here
export default function useDoenetRenderer(props,initializeChildrenOnConstruction=true,doenetPropsForChildren={}){
  // let [updateCount,setUpdateCount] = useState(0);

  // let stateValues = props.componentInstructions.stateValues;
  let actions = props.componentInstructions.actions;
  let children = [];
  let name =  props.componentInstructions.componentName;
  
  let stateValues = useRecoilValue(rendererSVs(name));
  // stateValues = JSON.parse(stateValues, serializedComponentsReviver)

  // let sv = useRecoilValue(rendererSVs(name));
  // console.log(">>>>>>>>>useDoenetRenderer sv",sv)
  // console.log(">>>>>>>>>useDoenetRenderer stateValues",stateValues)

  // console.log("updateCount",updateCount)
  props.rendererUpdateMethods[name] = {
    update: ()=>{},
    addChildren,
    removeChildren,
    swapChildren,
  }

  function addChildren(instruction) {
    let childInstructions = props.componentInstructions.children[instruction.indexForParent];
    let child = createChildFromInstructions(childInstructions);
    children.splice(instruction.indexForParent, 0, child);
    children = [...children]; // needed for React to recognize it's different

    // setUpdateCount(updateCount + 1);
  }

  function removeChildren(instruction) {
    children.splice(instruction.firstIndexInParent, instruction.numberChildrenDeleted);
    children = [...children]; // needed for React to recognize it's different
    for (let componentName of instruction.deletedComponentNames) {
      delete props.rendererUpdateMethods[componentName];
    }
    // setUpdateCount(updateCount + 1);
  }

  function swapChildren(instruction) {
    [children[instruction.index1], children[instruction.index2]]
      = [children[instruction.index2], children[instruction.index1]];
    children = [...children]; // needed for React to recognize it's different
    // setUpdateCount(updateCount + 1);
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

    if(typeof childInstructions === "string") {
      return childInstructions;
    }
    
    let propsForChild = {
      key: childInstructions.componentName,
      componentInstructions: childInstructions,
      rendererClasses: props.rendererClasses,
      rendererUpdateMethods: props.rendererUpdateMethods,
      flags: props.flags,
    };
    Object.assign(propsForChild, doenetPropsForChildren);

    let child = React.createElement(props.rendererClasses[childInstructions.rendererType], propsForChild);
    return child;
  }

  function updatesetDoenetPropsForChildren(props){
    setDoenetPropsForChildren(props);
  }

  return {name,SVs:stateValues,actions,children,initializeChildren,updatesetDoenetPropsForChildren};
}