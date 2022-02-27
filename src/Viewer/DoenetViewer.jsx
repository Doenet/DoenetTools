import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { useToast, toastType } from '@Toast';
import { serializedComponentsReplacer, serializedComponentsReviver } from '../Core/utils/serializedStateProcessing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { rendererState } from '../Viewer/renderers/useDoenetRenderer';
import { atomFamily, useRecoilCallback } from 'recoil';

const rendererUpdatesToIgnore = atomFamily({
  key: 'rendererUpdatesToIgnore',
  default: {},
})

// Two notes about props.flags of DoenetViewer
// 1. In Core, flags.allowSavePageState implies flags.allowLoadPageState
// Rationale: saving state will result in loading a new state if another device changed it,
// so having allowLoadPageState false in that case would lead to inconsistent behavior
// 2. In Core, if props.userId is defined, both 
// flags.allowLocalPageState and flags.allowSavePageState are set to false


export default function DoenetViewer(props) {
  const toast = useToast();
  const updateRendererSVsWithRecoil = useRecoilCallback(({ snapshot, set }) => async ({
    componentName, stateValues, childrenInstructions, sourceOfUpdate, baseStateVariable
  }) => {

    let ignoreUpdate = false;

    if (baseStateVariable) {

      let sourceActionId = sourceOfUpdate?.sourceInformation?.[componentName]?.actionId;

      let updatesToIgnore = snapshot.getLoadable(rendererUpdatesToIgnore(componentName)).contents;

      if (Object.keys(updatesToIgnore).length > 0) {
        let valueFromRenderer = updatesToIgnore[sourceActionId];
        let valueFromCore = stateValues[baseStateVariable];
        if (valueFromRenderer === valueFromCore
          || (
            Array.isArray(valueFromRenderer)
            && Array.isArray(valueFromCore)
            && valueFromRenderer.length == valueFromCore.length
            && valueFromRenderer.every((v, i) => valueFromCore[i] === v)
          )
        ) {
          // console.log(`ignoring update of ${componentName} to ${valueFromCore}`)
          ignoreUpdate = true;
          set(rendererUpdatesToIgnore(componentName), was => {
            let newUpdatesToIgnore = { ...was };
            delete newUpdatesToIgnore[sourceActionId];
            return newUpdatesToIgnore;
          })

        } else {
          // since value was change from the time the update was created
          // don't ignore the remaining pending changes in updatesToIgnore
          // as we changed the state used to determine they could be ignored
          set(rendererUpdatesToIgnore(componentName), {});
        }
      }
    }

    let newRendererState = { stateValues, childrenInstructions, sourceOfUpdate, ignoreUpdate };

    if (childrenInstructions === undefined) {
      let previousRendererState = snapshot.getLoadable(rendererState(componentName)).contents;
      newRendererState.childrenInstructions = previousRendererState.childrenInstructions;
    }

    set(rendererState(componentName), newRendererState)

  })
  const updateRendererUpdatesToIgnore = useRecoilCallback(({ snapshot, set }) => async ({ componentName, baseVariableValue, actionId }) => {

    // add to updates to ignore so don't apply change again
    // if it comes back from core without any changes
    // (possibly after a delay)
    set(rendererUpdatesToIgnore(componentName), was => {
      let newUpdatesToIgnore = { ...was };
      newUpdatesToIgnore[actionId] = baseVariableValue;
      return newUpdatesToIgnore;
    })

  })


  const [errMsg, setErrMsg] = useState(null);

  const [CID, setCID] = useState(null);
  const [doenetML, setDoenetML] = useState(null);
  const [coreId, setCoreId] = useState(null);

  const rendererClasses = useRef({});

  const [coreWorker, setCoreWorker] = useState(
    new Worker(props.unbundledCore ? 'core/CoreWorker.js' : 'viewer/core.js', { type: 'module' })
  );

  const [attemptNumber, setAttemptNumber] = useState(null);
  const [requestedVariantIndex, setRequestedVariantIndex] = useState(null);

  const [needNewCoreFlag, setNeedNewCoreFlag] = useState(false);

  const [documentRenderer, setDocumentRenderer] = useState(null);


  const coreInfo = useRef(null);
  const coreCreated = useRef(false);
  const resolveAllStateVariables = useRef(null);


  useEffect(() => {

    coreWorker.onmessage = function (e) {
      if (e.data.messageType === "updateRenderers") {
        if (e.data.init && coreInfo.current) {
          // we don't initialize renderer state values if already have a coreInfo
          // as we must have already gotten the renderer information before core was created
        } else {
          updateRenderers(e.data.args)
        }
      } else if (e.data.messageType === "coreCreated") {
        coreCreated.current = true;
      } else if (e.data.messageType === "initializeRenderers") {
        if (coreInfo.current && JSON.stringify(coreInfo.current) === JSON.stringify(e.data.args.coreInfo)) {
          // we already initialized renderers before core was created
          // so don't initialize them again when core is createad and this is called a second time
        } else {
          initializeRenderers(e.data.args)
        }
      } else if (e.data.messageType === "updateCreditAchieved") {
        props.updateCreditAchievedCallback(e.data.args);
      } else if (e.data.messageType === "sendToast") {
        console.log(`Sending toast message: ${e.data.args.message}`);
        toast(e.data.args.message, e.data.args.toastType)
      } else if (e.data.messageType === "returnAllStateVariables") {
        console.log(e.data.args)
        resolveAllStateVariables.current(e.data.args);
      } else if (e.data.messageType === "inErrorState") {
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true)
        }
        setErrMsg(e.data.args.errMsg);
      } else if (e.data.messageType === "resetCore") {
        resetCore(e.data.args);
      }
    }
  }, [coreWorker]);


  window.returnAllStateVariables = function () {
    coreWorker.postMessage({
      messageType: "returnAllStateVariables"
    })

    return new Promise((resolve, reject) => {
      resolveAllStateVariables.current = resolve;
    })

  }


  window.callAction = function ({ actionName, componentName, args }) {
    callAction({
      action: { actionName, componentName },
      args
    })
  }


  function callAction({ action, args, baseVariableValue, name, rendererType }) {

    if (coreCreated.current || !rendererClasses.current[rendererType]?.ignoreActionsWithoutCore) {
      if (baseVariableValue !== undefined && name) {
        let actionId = nanoid();
        updateRendererUpdatesToIgnore({
          componentName: name,
          baseVariableValue,
          actionId
        })
        args = { ...args };
        args.actionId = actionId;
      }

      coreWorker.postMessage({
        messageType: "requestAction",
        args: {
          actionName: action.actionName,
          componentName: action.componentName,
          args,
        }
      })
    }
  }


  function initializeRenderers(args) {

    if (args.rendererState) {
      for (let componentName in args.rendererState) {
        updateRendererSVsWithRecoil({
          componentName,
          stateValues: args.rendererState[componentName].stateValues,
          childrenInstructions: args.rendererState[componentName].childrenInstructions,
        })
      }
    }

    coreInfo.current = args.coreInfo;

    if (props.generatedVariantCallback) {
      props.generatedVariantCallback(
        JSON.parse(coreInfo.current.generatedVariantString, serializedComponentsReviver),
        coreInfo.current.allPossibleVariants
      );
    }


    let renderPromises = [];
    let rendererClassNames = [];
    // console.log('rendererTypesInDocument');
    // console.log(">>>core.rendererTypesInDocument",core.rendererTypesInDocument);  
    for (let rendererClassName of coreInfo.current.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      renderPromises.push(import(`./renderers/${rendererClassName}.js`));
    }

    let documentComponentInstructions = coreInfo.current.documentToRender;


    renderersloadComponent(renderPromises, rendererClassNames).then((newRendererClasses) => {
      rendererClasses.current = newRendererClasses;
      let documentRendererClass = newRendererClasses[documentComponentInstructions.rendererType]

      setDocumentRenderer(React.createElement(documentRendererClass,
        {
          key: documentComponentInstructions.componentName,
          componentInstructions: documentComponentInstructions,
          rendererClasses: newRendererClasses,
          flags: props.flags,
          callAction,
        }
      ));

    });


  }

  //offscreen then postpone that one
  function updateRenderers(updateInstructions) {

    for (let instruction of updateInstructions) {

      if (instruction.instructionType === "updateRendererStates") {
        for (let { componentName, stateValues, rendererType, childrenInstructions } of instruction.rendererStatesToUpdate
        ) {

          updateRendererSVsWithRecoil({
            componentName,
            stateValues,
            childrenInstructions,
            sourceOfUpdate: instruction.sourceOfUpdate,
            baseStateVariable: rendererClasses.current[rendererType]?.baseStateVariable
          })

        }
      }
    }


  }


  function resetCore({ changedOnDevice, newCID, newAttemptNumber }) {
    toast(`Reverted page to state saved on device ${changedOnDevice}`, toastType.ERROR);

    if (CID && newCID !== CID) {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg("Have not implemented handling change in page content from other device.  Please reload page");
    } else if (newAttemptNumber !== attemptNumber) {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg("Have not implemented handling creating new attempt from other device.  Please reload page");
    } else {
      setNeedNewCoreFlag(true);
    }


  }


  if (errMsg !== null) {
    let errorIcon = <span style={{ fontSize: "1em", color: "#C1292E" }}><FontAwesomeIcon icon={faExclamationCircle} /></span>
    return <div style={{ fontSize: "1.3em", marginLeft: "20px", marginTop: "20px" }}>{errorIcon} {errMsg}</div>
  }


  // first, if CID or doenetML don't match props
  // set state to props and record that that need a new core

  let changedState = false;

  if (doenetML !== props.doenetML) {
    setDoenetML(props.doenetML);
    changedState = true;
  }
  if (CID !== props.CID) {
    setCID(props.CID);
    changedState = true;
  }


  //If no attemptNumber prop then set to 1
  let propAttemptNumber = props.attemptNumber;
  if (propAttemptNumber === undefined) {
    propAttemptNumber = 1;
  }

  if (propAttemptNumber !== attemptNumber) {
    setAttemptNumber(propAttemptNumber);
    changedState = true;
  }

  // attemptNumber is used for requestedVariantIndex if not specified
  let adjustedRequestedVariantIndex = props.requestedVariant?.index;
  if (adjustedRequestedVariantIndex === undefined) {
    adjustedRequestedVariantIndex = propAttemptNumber;
  }


  if (requestedVariantIndex !== adjustedRequestedVariantIndex) {
    setRequestedVariantIndex(adjustedRequestedVariantIndex);
    changedState = true;
  }

  // return null so that don't need to make a special case of props and state
  // but can use state from now on
  if (changedState) {
    setNeedNewCoreFlag(true);
    return null;
  }

  if (needNewCoreFlag) {

    setNeedNewCoreFlag(false);

    let newCoreId = nanoid();
    setCoreId(newCoreId);
    coreInfo.current = null;
    setDocumentRenderer(null);
    coreCreated.current = false;

    coreWorker.postMessage({
      messageType: "createCore",
      args: {
        coreId: newCoreId,
        userId: props.userId,
        doenetML,
        CID,
        doenetId: props.doenetId,
        flags: props.flags,
        requestedVariantIndex,
        attemptNumber,
      }
    });

    return null;

  }

  if (!documentRenderer) {
    return null;
  }

  //Spacing around the whole doenetML document
  return <div style={{ maxWidth: "850px", paddingLeft: "20px", paddingRight: "20px", marginBottom: "200px" }}>{documentRenderer}</div>;

}



export async function renderersloadComponent(promises, rendererClassNames) {

  var rendererClasses = {};
  for (let [index, promise] of promises.entries()) {
    try {
      let module = await promise;
      rendererClasses[rendererClassNames[index]] = module.default;
    } catch (error) {
      console.log(error)
      console.error(`Error: loading ${rendererClassNames[index]} failed.`)
    }

  }
  return rendererClasses;

}

