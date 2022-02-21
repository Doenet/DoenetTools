import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {atomFamily, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {renderersloadComponent} from "../DoenetViewer.js";
export const rendererSVs = atomFamily({
  key: "rendererSVs",
  default: {stateValues: {}, sourceOfUpdate: {}, ignoreUpdate: false}
});
export default function useDoenetRenderer(props, initializeChildrenOnConstruction = true) {
  let actions = props.componentInstructions.actions;
  let name = props.componentInstructions.componentName;
  let [renderersToLoad, setRenderersToLoad] = useState({});
  let {stateValues, sourceOfUpdate = {}, ignoreUpdate} = useRecoilValue(rendererSVs(name));
  props.rendererUpdateMethods[name] = {
    update: () => {
    }
  };
  let children = [];
  const loadMoreRenderers = Object.keys(renderersToLoad).length === 0;
  for (let childInstructions of props.componentInstructions.children) {
    let child = createChildFromInstructions(childInstructions, loadMoreRenderers);
    children.push(child);
  }
  useEffect(() => {
    if (Object.keys(renderersToLoad).length > 0) {
      renderersloadComponent(Object.values(renderersToLoad), Object.keys(renderersToLoad)).then((newRendererClasses) => {
        Object.assign(props.rendererClasses, newRendererClasses);
        setRenderersToLoad({});
      });
    }
  }, [renderersToLoad, props.rendererClasses]);
  function createChildFromInstructions(childInstructions, loadMoreRenderers2) {
    if (typeof childInstructions === "string") {
      return childInstructions;
    }
    let propsForChild = {
      key: childInstructions.componentName,
      componentInstructions: childInstructions,
      rendererClasses: props.rendererClasses,
      rendererUpdateMethods: props.rendererUpdateMethods,
      flags: props.flags,
      callAction: props.callAction
    };
    let rendererClass = props.rendererClasses[childInstructions.rendererType];
    if (!rendererClass) {
      if (loadMoreRenderers2) {
        setRenderersToLoad((old) => {
          let rendererPromises = {...old};
          if (!(childInstructions.rendererType in rendererPromises)) {
            rendererPromises[childInstructions.rendererType] = import(`./${childInstructions.rendererType}.js`);
          }
          return rendererPromises;
        });
      }
      return null;
    }
    let child = React.createElement(rendererClass, propsForChild);
    return child;
  }
  let rendererType = props.componentInstructions.rendererType;
  const callAction = (argObj) => {
    if (!argObj.name) {
      argObj = {...argObj};
      argObj.name = name;
    }
    if (!argObj.rendererType) {
      argObj = {...argObj};
      argObj.rendererType = rendererType;
    }
    return props.callAction(argObj);
  };
  return {name, SVs: stateValues, actions, children, sourceOfUpdate, ignoreUpdate, initializeChildren: () => {
  }, callAction};
}
