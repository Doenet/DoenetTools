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
  let name =  props.componentInstructions.componentName;
  let [renderersToLoad,setRenderersToLoad] = useState({})
  
  let stateValues = useRecoilValue(rendererSVs(name));

  props.rendererUpdateMethods[name] = {
    update: ()=>{},
    addChildren,
    removeChildren,
    swapChildren,
  }

  //TODO: Fix this for graph
  // if (initializeChildrenOnConstruction
  let children = [];
  const loadMoreRenderers = Object.keys(renderersToLoad).length === 0;
  for (let childInstructions of props.componentInstructions.children) {   
    let child = createChildFromInstructions(childInstructions,loadMoreRenderers);
    children.push(child);
  }

  useEffect(()=>{
    if (Object.keys(renderersToLoad).length > 0){
      renderersloadComponent(Object.values(renderersToLoad), Object.keys(renderersToLoad)).then((newRendererClasses)=>{
        Object.assign(props.rendererClasses,newRendererClasses)
        setRenderersToLoad({})
      })
    }
  },[renderersToLoad,props.rendererClasses])


  async function addChildren(instruction) {
    console.warn("CALLED addChildren in useDoenetRenderer",instruction)
  }

  function removeChildren(instruction) {
    console.warn("CALLED removeChildren in useDoenetRenderer",instruction)
  }

  function swapChildren(instruction) {
    console.warn("CALLED swapChildren in useDoenetRenderer",instruction)
  }

  function createChildFromInstructions(childInstructions,loadMoreRenderers) {

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
      if (loadMoreRenderers){
        setRenderersToLoad((old)=>{
          let rendererPromises = {...old};
          if (!(childInstructions.rendererType in rendererPromises)){
            rendererPromises[childInstructions.rendererType] = import(`./${childInstructions.rendererType}.js`);
          }
          return rendererPromises;
        })
      }
      
      return null;  //skip the child for now
     
    }

    let child = React.createElement(rendererClass, propsForChild);
    return child;
  }

  function updatesetDoenetPropsForChildren(props){
    // setDoenetPropsForChildren(props);
  }

  return {name,SVs:stateValues,actions,children,initializeChildren:()=>{},updatesetDoenetPropsForChildren};
}