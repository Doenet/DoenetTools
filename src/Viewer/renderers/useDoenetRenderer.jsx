import React, { useEffect, useState } from 'react';
import { atomFamily, useRecoilValue } from 'recoil';
// import { serializedComponentsReviver } from '../../Core/utils/serializedStateProcessing';
import { renderersloadComponent } from '../DoenetViewer';

export const rendererSVs = atomFamily({
  key:'rendererSVs',
  default:{},
  dangerouslyAllowMutability: true,
})

//Renderers will need to set doenetPropsForChildren locally and pass it along. 
//Renderer can change it later and values will be here
export default function useDoenetRenderer(props,initializeChildrenOnConstruction=true,doenetPropsForChildren={}){
  let actions = props.componentInstructions.actions;
  let [children,setChildren] = useState([]);
  let name =  props.componentInstructions.componentName;
  
  let stateValues = useRecoilValue(rendererSVs(name));

  props.rendererUpdateMethods[name] = {
    update: ()=>{},
    addChildren,
    removeChildren,
    swapChildren,
  }

  useEffect(()=>{
    if (initializeChildrenOnConstruction){
      initializeChildren()
    }
  },[])

  async function addChildren(instruction) {
    let newChildren = [...children];
    let childInstructions = props.componentInstructions.children[instruction.indexForParent];
    let child = await createChildFromInstructions(childInstructions);
    newChildren.splice(instruction.indexForParent, 0, child);
    setChildren(newChildren)
  }

  function removeChildren(instruction) {
    let newChildren = [...children];
    newChildren.splice(instruction.firstIndexInParent, instruction.numberChildrenDeleted);
    for (let componentName of instruction.deletedComponentNames) {
      delete props.rendererUpdateMethods[componentName];
    }
    setChildren(newChildren)
  }

  function swapChildren(instruction) {
    console.warn("CALLED swapChildren in useDoenetRenderer",instruction)

    // [children[instruction.index1], children[instruction.index2]]
    //   = [children[instruction.index2], children[instruction.index1]];
    // children = [...children]; // needed for React to recognize it's different
  }

  async function initializeChildren() {
    let newchildren = [...children];
    for (let childInstructions of props.componentInstructions.children) {   
      let child = await createChildFromInstructions(childInstructions);
      newchildren.push(child);
    }
    setChildren(newchildren)
  }

  async function createChildFromInstructions(childInstructions) {

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

    let rendererClass = props.rendererClasses[childInstructions.rendererType];

    if (!rendererClass) {
      //If we don't have the component then attempt to load it
      let renderPromises = [import(`./${childInstructions.rendererType}.js`)];
      let rendererClassNames = [childInstructions.rendererType];

      let newRendererClasses = await renderersloadComponent(renderPromises, rendererClassNames);
      Object.assign(props.rendererClasses,newRendererClasses)

      rendererClass = props.rendererClasses[childInstructions.rendererType];
      if (!rendererClass) {
        throw Error(`Cannot render component ${childInstructions.componentName} as have not loaded renderer type ${childInstructions.rendererType}`)
      }
    }

    let child = React.createElement(rendererClass, propsForChild);
    return child;
  }

  function updatesetDoenetPropsForChildren(props){
    // setDoenetPropsForChildren(props);
  }

  return {name,SVs:stateValues,actions,children,initializeChildren,updatesetDoenetPropsForChildren};
}