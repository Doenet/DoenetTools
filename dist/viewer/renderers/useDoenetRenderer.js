import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {atomFamily, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {renderersloadComponent} from "../DoenetViewer.js";
export const rendererSVs = atomFamily({
  key: "rendererSVs",
  default: {stateValues: {}, sourceOfUpdate: {}},
  dangerouslyAllowMutability: true
});
export default function useDoenetRenderer(props, initializeChildrenOnConstruction = true, doenetPropsForChildren = {}) {
  let actions = props.componentInstructions.actions;
  let name = props.componentInstructions.componentName;
  let [renderersToLoad, setRenderersToLoad] = useState({});
  let {stateValues, sourceOfUpdate = {}} = useRecoilValue(rendererSVs(name));
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
      flags: props.flags
    };
    Object.assign(propsForChild, doenetPropsForChildren);
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
  function updatesetDoenetPropsForChildren(props2) {
  }
  return {name, SVs: stateValues, actions, children, sourceOfUpdate, initializeChildren: () => {
  }, updatesetDoenetPropsForChildren};
}
