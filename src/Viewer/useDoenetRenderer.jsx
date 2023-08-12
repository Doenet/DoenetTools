import React, { useEffect, useState } from "react";
import { atomFamily, useRecoilValue, useSetRecoilState } from "recoil";
// import { serializedComponentsReviver } from '../../Core/utils/serializedStateProcessing';
import { renderersloadComponent } from "./PageViewer";
import { cesc } from "../_utils/url";

export const rendererState = atomFamily({
  key: "rendererState",
  default: {
    stateValues: {},
    sourceOfUpdate: {},
    ignoreUpdate: false,
    childrenInstructions: [],
    prefixForIds: "",
  },
  // dangerouslyAllowMutability: true,
});

// TODO: potentially remove initializeChildrenOnConstruction
export default function useDoenetRenderer(
  props,
  initializeChildrenOnConstruction = true,
) {
  let actions = props.componentInstructions.actions;
  let componentName = props.componentInstructions.componentName;
  let effectiveName = props.componentInstructions.effectiveName;
  let rendererName = props.coreId + componentName;
  let [renderersToLoad, setRenderersToLoad] = useState({});

  let {
    stateValues,
    sourceOfUpdate = {},
    ignoreUpdate,
    childrenInstructions,
    prefixForIds,
  } = useRecoilValue(rendererState(rendererName));

  //TODO: Fix this for graph
  // if (initializeChildrenOnConstruction
  let children = [];
  const loadMoreRenderers = Object.keys(renderersToLoad).length === 0;
  for (let childInstructions of childrenInstructions) {
    let child = createChildFromInstructions(
      childInstructions,
      loadMoreRenderers,
    );
    children.push(child);
  }

  useEffect(() => {
    if (Object.keys(renderersToLoad).length > 0) {
      renderersloadComponent(
        Object.values(renderersToLoad),
        Object.keys(renderersToLoad),
      ).then((newRendererClasses) => {
        Object.assign(props.rendererClasses, newRendererClasses);
        setRenderersToLoad({});
      });
    }
  }, [renderersToLoad, props.rendererClasses]);

  function createChildFromInstructions(childInstructions, loadMoreRenderers) {
    if (typeof childInstructions === "string") {
      return childInstructions;
    }

    let propsForChild = {
      key: props.coreId + childInstructions.componentName,
      componentInstructions: childInstructions,
      rendererClasses: props.rendererClasses,
      coreId: props.coreId,
      callAction: props.callAction,
    };

    let rendererClass = props.rendererClasses[childInstructions.rendererType];

    if (!rendererClass) {
      //If we don't have the component then attempt to load it
      if (loadMoreRenderers) {
        setRenderersToLoad((old) => {
          let rendererPromises = { ...old };
          if (!(childInstructions.rendererType in rendererPromises)) {
            rendererPromises[childInstructions.rendererType] = import(
              `./renderers/${childInstructions.rendererType}.jsx`
            );
          }
          return rendererPromises;
        });
      }

      return null; //skip the child for now
    }

    let child = React.createElement(rendererClass, propsForChild);
    return child;
  }

  let rendererType = props.componentInstructions.rendererType;
  const callAction = (argObj) => {
    if (!argObj.componentName) {
      argObj = { ...argObj };
      argObj.componentName = componentName;
    }
    if (!argObj.rendererType) {
      argObj = { ...argObj };
      argObj.rendererType = rendererType;
    }
    return props.callAction(argObj);
  };

  return {
    name: effectiveName,
    id: prefixForIds + cesc(effectiveName),
    SVs: stateValues,
    actions,
    children,
    sourceOfUpdate,
    ignoreUpdate,
    rendererName,
    initializeChildren: () => {},
    callAction,
    navigate: props.navigate,
    location: props.location,
    linkSettings: props.linkSettings,
    scrollableContainer: props.scrollableContainer,
  };
}
