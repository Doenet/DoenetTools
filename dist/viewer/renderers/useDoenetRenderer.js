import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {atomFamily, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {renderersloadComponent} from "../PageViewer.js";
export const rendererState = atomFamily({
  key: "rendererState",
  default: {stateValues: {}, sourceOfUpdate: {}, ignoreUpdate: false, childrenInstructions: [], prefixForIds: ""}
});
export default function useDoenetRenderer(props, initializeChildrenOnConstruction = true) {
  let actions = props.componentInstructions.actions;
  let componentName = props.componentInstructions.componentName;
  let effectiveName = props.componentInstructions.effectiveName;
  let rendererName = props.coreId + componentName;
  let [renderersToLoad, setRenderersToLoad] = useState({});
  let {stateValues, sourceOfUpdate = {}, ignoreUpdate, childrenInstructions, prefixForIds} = useRecoilValue(rendererState(rendererName));
  let children = [];
  const loadMoreRenderers = Object.keys(renderersToLoad).length === 0;
  for (let childInstructions of childrenInstructions) {
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
      key: props.coreId + childInstructions.componentName,
      componentInstructions: childInstructions,
      rendererClasses: props.rendererClasses,
      flags: props.flags,
      coreId: props.coreId,
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
    if (!argObj.componentName) {
      argObj = {...argObj};
      argObj.componentName = componentName;
    }
    if (!argObj.rendererType) {
      argObj = {...argObj};
      argObj.rendererType = rendererType;
    }
    return props.callAction(argObj);
  };
  return {
    name: effectiveName,
    id: prefixForIds + effectiveName,
    SVs: stateValues,
    actions,
    children,
    sourceOfUpdate,
    ignoreUpdate,
    rendererName,
    initializeChildren: () => {
    },
    callAction
  };
}
