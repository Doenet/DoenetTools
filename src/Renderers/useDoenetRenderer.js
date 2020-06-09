import React, { useState } from 'react';

export default function useDoenetRenderer(props){
  let [updateCount,setUpdateCount] = useState(0);

  let stateValues = props.componentInstructions.stateValues;
  let actions = props.componentInstructions.actions;
  let children = [];
  let name =  props.componentInstructions.componentName;

  // console.log("updateCount",updateCount)
  props.rendererUpdateMethods[name] = {
    update: ()=>{setUpdateCount(updateCount + 1)},
    addChildren: ()=>{console.log('add')},
    removeChildren: ()=>{console.log('remove')},
    swapChildren: ()=>{console.log('swap')},
  }

  return [name,stateValues,actions,children];
}