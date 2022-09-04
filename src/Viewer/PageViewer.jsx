import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { useToast, toastType } from '@Toast';
import { serializedComponentsReplacer, serializedComponentsReviver } from '../Core/utils/serializedStateProcessing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { rendererState } from './renderers/useDoenetRenderer';
import { atom, atomFamily, useRecoilCallback } from 'recoil';
import { get as idb_get, set as idb_set } from 'idb-keyval';
import { cidFromText } from '../Core/utils/cid';
import { retrieveTextFileForCid } from '../Core/utils/retrieveTextFile';
import axios from 'axios';
import { returnAllPossibleVariants } from '../Core/utils/returnAllPossibleVariants';
import { useLocation } from "react-router";
import cssesc from 'cssesc';

const rendererUpdatesToIgnore = atomFamily({
  key: 'rendererUpdatesToIgnore',
  default: {},
})

export const scrollableContainerAtom = atom({
  key: "scollParentAtom",
  default: null
})

// Two notes about props.flags of PageViewer
// 1. In Core, flags.allowSaveState implies flags.allowLoadState
// Rationale: saving state will result in loading a new state if another device changed it,
// so having allowLoadState false in that case would lead to inconsistent behavior
// 2. In Core, if props.userId is defined, both 
// flags.allowLocalState and flags.allowSaveState are set to false


export default function PageViewer(props) {

  const toast = useToast();
  const updateRendererSVsWithRecoil = useRecoilCallback(({ snapshot, set }) => async ({
    coreId, componentName, stateValues, childrenInstructions, sourceOfUpdate, baseStateVariable, actionId
  }) => {

    let ignoreUpdate = false;

    let rendererName = coreId + componentName;

    if (baseStateVariable) {

      let updatesToIgnore = snapshot.getLoadable(rendererUpdatesToIgnore(rendererName)).contents;

      if (Object.keys(updatesToIgnore).length > 0) {
        let valueFromRenderer = updatesToIgnore[actionId];
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
          set(rendererUpdatesToIgnore(rendererName), was => {
            let newUpdatesToIgnore = { ...was };
            delete newUpdatesToIgnore[actionId];
            return newUpdatesToIgnore;
          })

        } else {
          // since value was changed from the time the update was created
          // don't ignore the remaining pending changes in updatesToIgnore
          // as we changed the state used to determine they could be ignored
          set(rendererUpdatesToIgnore(rendererName), {});
        }
      }
    }

    let newRendererState = { stateValues, childrenInstructions, sourceOfUpdate, ignoreUpdate, prefixForIds: prefixForIds };

    if (childrenInstructions === undefined) {
      let previousRendererState = snapshot.getLoadable(rendererState(rendererName)).contents;
      newRendererState.childrenInstructions = previousRendererState.childrenInstructions;
    }

    set(rendererState(rendererName), newRendererState)

  })
  const updateRendererUpdatesToIgnore = useRecoilCallback(({ snapshot, set }) => async ({ coreId, componentName, baseVariableValue, actionId }) => {

    let rendererName = coreId + componentName;

    // add to updates to ignore so don't apply change again
    // if it comes back from core without any changes
    // (possibly after a delay)
    set(rendererUpdatesToIgnore(rendererName), was => {
      let newUpdatesToIgnore = { ...was };
      newUpdatesToIgnore[actionId] = baseVariableValue;
      return newUpdatesToIgnore;
    })

  })


  const [errMsg, setErrMsg] = useState(null);

  const [cidFromProps, setCidFromProps] = useState(null);
  const [doenetMLFromProps, setDoenetMLFromProps] = useState(null);
  const [cid, setCid] = useState(null);
  const [doenetML, setDoenetML] = useState(null);


  const [pageNumber, setPageNumber] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(null);
  const [requestedVariantIndex, setRequestedVariantIndex] = useState(null);

  const [stage, setStage] = useState('initial');
  const [pageContentChanged, setPageContentChanged] = useState(false);

  const [documentRenderer, setDocumentRenderer] = useState(null);

  const initialCoreData = useRef({});


  const rendererClasses = useRef({});
  const coreInfo = useRef(null);
  const coreCreated = useRef(false);
  const coreId = useRef(null);

  const resolveAllStateVariables = useRef(null);
  const actionsBeforeCoreCreated = useRef([]);

  const coreWorker = useRef(null);

  const preventMoreAnimations = useRef(false);
  const animationInfo = useRef({});

  const resolveActionPromises = useRef({});

  const prefixForIds = props.prefixForIds || "";

  const previousLocationKeys = useRef([]);

  let location = useLocation();
  let hash = location.hash;

  useEffect(() => {

    if (coreWorker.current) {
      coreWorker.current.onmessage = function (e) {
        // console.log('message from core', e.data)
        if (e.data.messageType === "updateRenderers") {
          if (e.data.init && coreInfo.current) {
            // we don't initialize renderer state values if already have a coreInfo
            // as we must have already gotten the renderer information before core was created
          } else {
            updateRenderers(e.data.args)
          }
        } else if (e.data.messageType === "requestAnimationFrame") {
          requestAnimationFrame(e.data.args);
        } else if (e.data.messageType === "cancelAnimationFrame") {
          cancelAnimationFrame(e.data.args);
        } else if (e.data.messageType === "coreCreated") {
          coreCreated.current = true;
          preventMoreAnimations.current = false;
          setStage('coreCreated');
          props.coreCreatedCallback?.(coreWorker.current);
        } else if (e.data.messageType === "initializeRenderers") {
          if (coreInfo.current && JSON.stringify(coreInfo.current) === JSON.stringify(e.data.args.coreInfo)) {
            // we already initialized renderers before core was created
            // so don't initialize them again when core is createad and this is called a second time
          } else {
            initializeRenderers(e.data.args)
          }
        } else if (e.data.messageType === "updateCreditAchieved") {
          props.updateCreditAchievedCallback?.(e.data.args);
        } else if (e.data.messageType === "savedState") {
          props.saveStateCallback?.();
        } else if (e.data.messageType === "sendToast") {
          console.log(`Sending toast message: ${e.data.args.message}`);
          toast(e.data.args.message, e.data.args.toastType)
        } else if (e.data.messageType === "resolveAction") {
          resolveAction(e.data.args)
        } else if (e.data.messageType === "returnAllStateVariables") {
          console.log(e.data.args)
          resolveAllStateVariables.current(e.data.args);
        } else if (e.data.messageType === "componentRangePieces") {
          window["componentRangePieces" + pageNumber] = e.data.args.componentRangePieces;
        } else if (e.data.messageType === "inErrorState") {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(e.data.args.errMsg);
        } else if (e.data.messageType === "resetPage") {
          resetPage(e.data.args);
        } else if (e.data.messageType === "terminated") {
          terminateCoreAndAnimations();
        }
      }
    }
  }, [coreWorker.current]);


  useEffect(() => {
    return () => {
      if (coreWorker.current) {
        coreWorker.current.postMessage({
          messageType: "terminate"
        })
      }
    }
  }, [])

  useEffect(() => {

    if (pageNumber !== null) {
      window["returnAllStateVariables" + pageNumber] = function () {
        coreWorker.current.postMessage({
          messageType: "returnAllStateVariables"
        })

        return new Promise((resolve, reject) => {
          resolveAllStateVariables.current = resolve;
        })

      }

      window["callAction" + pageNumber] = async function ({ actionName, componentName, args }) {
        await callAction({
          action: { actionName, componentName },
          args
        })
      }

    }


  }, [pageNumber])


  useEffect(() => {
    return () => {
      preventMoreAnimations.current = true;
      for (let id in animationInfo.current) {
        cancelAnimationFrame(id);
      }
      animationInfo.current = {};
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (coreWorker.current) {
        coreWorker.current.postMessage({
          messageType: "visibilityChange",
          args: {
            visible: document.visibilityState === "visible"
          }
        })
      }
    })
  }, [])

  useEffect(() => {
    if (hash && coreCreated.current && coreWorker.current) {
      let anchor = hash.slice(1);
      if (anchor.substring(0, prefixForIds.length) === prefixForIds) {
        coreWorker.current.postMessage({
          messageType: "navigatingToComponent",
          args: {
            componentName: anchor.substring(prefixForIds.length)
          }
        })
      }
    }
  }, [location, hash, coreCreated.current, coreWorker.current])


  useEffect(() => {
    if (hash && documentRenderer && props.pageIsActive) {
      let anchor = hash.slice(1);
      if ((!previousLocationKeys.current.includes(location.key) || location.key === "default") &&
        anchor.length > prefixForIds.length &&
        anchor.substring(0, prefixForIds.length) === prefixForIds
      ) {
        document.getElementById(cssesc(anchor))?.scrollIntoView();
      }
      previousLocationKeys.current.push(location.key);
    }


  }, [location, hash, documentRenderer, props.pageIsActive])

  function terminateCoreAndAnimations() {
    preventMoreAnimations.current = true;
    coreWorker.current.terminate();
    coreWorker.current = null;
    for (let id in animationInfo.current) {
      cancelAnimationFrame(id);
    }
    animationInfo.current = {};
  }

  async function callAction({ action, args, baseVariableValue, componentName, rendererType }) {

    if (coreCreated.current || !rendererClasses.current[rendererType]?.ignoreActionsWithoutCore) {
      let actionId = nanoid();
      args = { ...args };
      args.actionId = actionId;

      if (baseVariableValue !== undefined && componentName) {
        updateRendererUpdatesToIgnore({
          coreId: coreId.current,
          componentName,
          baseVariableValue,
          actionId
        })
      }

      let actionArgs = {
        actionName: action.actionName,
        componentName: action.componentName,
        args,
      }


      // Note: it is possible that core has been terminated
      coreWorker.current?.postMessage({
        messageType: "requestAction",
        args: actionArgs
      });

      if (!coreCreated.current) {
        actionsBeforeCoreCreated.current.push(actionArgs);
        // console.log('actions before core created', actionsBeforeCoreCreated.current)
      }

      return new Promise((resolve, reject) => {
        resolveActionPromises.current[actionId] = resolve;
      })

    }
  }

  function forceRendererStateDisabledShowCorrectness(rendererState) {
    for (let componentName in rendererState) {
      let stateValues = rendererState[componentName].stateValues;
      if(stateValues.disabled === false) {
        stateValues.disabled = true;
      }
      if(stateValues.showCorrectness === false) {
        stateValues.showCorrectness = true;
      }

    }
  }

  function initializeRenderers(args) {

    if (args.rendererState) {
      if (props.snapshotOnly) {
        forceRendererStateDisabledShowCorrectness(args.rendererState)
      }
      for (let componentName in args.rendererState) {
        updateRendererSVsWithRecoil({
          coreId: coreId.current,
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
        coreInfo.current.allPossibleVariants,
        coreInfo.current.variantIndicesToIgnore
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
          key: coreId.current + documentComponentInstructions.componentName,
          componentInstructions: documentComponentInstructions,
          rendererClasses: newRendererClasses,
          flags: props.flags,
          coreId: coreId.current,
          callAction,
        }
      ));

      props.renderersInitializedCallback?.()

    });


  }

  //offscreen then postpone that one
  function updateRenderers({ updateInstructions, actionId }) {

    for (let instruction of updateInstructions) {

      if (instruction.instructionType === "updateRendererStates") {
        for (let { componentName, stateValues, rendererType, childrenInstructions } of instruction.rendererStatesToUpdate
        ) {

          updateRendererSVsWithRecoil({
            coreId: coreId.current,
            componentName,
            stateValues,
            childrenInstructions,
            sourceOfUpdate: instruction.sourceOfUpdate,
            baseStateVariable: rendererClasses.current[rendererType]?.baseStateVariable,
            actionId,
          })

        }
      }
    }

    resolveAction({ actionId });

  }

  function resolveAction({ actionId }) {
    if (actionId) {
      resolveActionPromises.current[actionId]?.();
      delete resolveActionPromises.current[actionId]
    }
  }


  function resetPage({ changedOnDevice, newCid, newAttemptNumber }) {
    // console.log('resetPage', changedOnDevice, newCid, newAttemptNumber);


    if (newAttemptNumber !== attemptNumber) {
      toast(`Reverted activity as attempt number changed on other device`, toastType.ERROR);
      if (props.updateAttemptNumber) {
        props.updateAttemptNumber(newAttemptNumber);
      } else {
        // what do we do in this case?
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true)
        }
        setErrMsg('how to reset attempt number when not given updateAttemptNumber function?')

      }
    } else {
      // TODO: are there cases where will get an infinite loop here?
      toast(`Reverted page to state saved on device ${changedOnDevice}`, toastType.ERROR);

      coreId.current = nanoid();
      setPageContentChanged(true);
    }


  }

  function calculateCidDoenetML() {
    const coreIdWhenCalled = coreId.current;
    // compare with undefined as doenetML could be empty string
    if (doenetMLFromProps !== undefined) {
      if (cidFromProps) {
        // check to see if doenetML matches cid
        cidFromText(doenetMLFromProps)
          .then(calcCid => {
            //Guard against the possiblity that parameters changed while waiting

            if (coreIdWhenCalled === coreId.current) {
              if (calcCid === cidFromProps) {
                setDoenetML(doenetMLFromProps);
                setCid(cidFromProps);
                setStage('continue');
              } else {
                if (props.setIsInErrorState) {
                  props.setIsInErrorState(true)
                }
                setErrMsg(`doenetML did not match specified cid: ${cidFromProps}`);
              }
            }
          })
      } else {
        // if have doenetML and no cid, then calculate cid
        cidFromText(doenetMLFromProps)
          .then(cid => {

            //Guard against the possiblity that parameters changed while waiting
            if (coreIdWhenCalled === coreId.current) {
              setDoenetML(doenetMLFromProps);
              setCid(cid);
              setStage('continue');
            }
          })
      }
    } else {
      // if don't have doenetML, then retrieve doenetML from cid

      retrieveTextFileForCid(cidFromProps, "doenet")
        .then(retrievedDoenetML => {
          //Guard against the possiblity that parameters changed while waiting

          if (coreIdWhenCalled === coreId.current) {
            setDoenetML(retrievedDoenetML);
            setCid(cidFromProps);
            setStage('continue');
          }
        })
        .catch(e => {
          //Guard against the possiblity that parameters changed while waiting

          if (coreIdWhenCalled === coreId.current) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(`doenetML not found for cid: ${cidFromProps}`);
          }
        })
    }

  }

  async function loadStateAndInitialize() {
    const coreIdWhenCalled = coreId.current
    let loadedState = false;

    if (props.flags.allowLocalState) {

      let localInfo;

      try {
        localInfo = await idb_get(`${props.doenetId}|${pageNumber}|${attemptNumber}|${cid}`);
      } catch (e) {
        // ignore error
      }

      if (localInfo) {

        if (props.flags.allowSaveState) {
          // attempt to save local info to database,
          // reseting data to that from database if it has changed since last save

          let result = await saveLoadedLocalStateToDatabase(localInfo);

          if (result.changedOnDevice) {
            if (Number(result.newAttemptNumber) !== attemptNumber) {
              resetPage({
                changedOnDevice: result.changedOnDevice,
                newCid: result.newCid,
                newAttemptNumber: Number(result.newAttemptNumber),
              })
              return;
            } else if (result.newCid !== cid) {
              // if cid changes for the same attempt number, then something went wrong
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true)
              }
              setErrMsg(`content changed unexpectedly!`);
            }

            // if just the localInfo changed, use that instead
            localInfo = result.newLocalInfo;
            console.log(`sending toast: Reverted page to state saved on device ${result.changedOnDevice}`)
            toast(`Reverted page to state saved on device ${result.changedOnDevice}`, toastType.ERROR)

          }

        }


        initializeRenderers({
          rendererState: localInfo.rendererState,
          coreInfo: localInfo.coreInfo,
        });


        initialCoreData.current = ({
          coreState: localInfo.coreState,
          serverSaveId: localInfo.saveId,
          requestedVariant: JSON.parse(localInfo.coreInfo.generatedVariantString, serializedComponentsReviver)
        });

        loadedState = true;

      }
    }

    if (!loadedState) {
      // if didn't load state from local storage, try to load from database

      // even if allowLoadState is false,
      // still call loadPageState, in which case it will only retrieve the initial page state


      const payload = {
        params: {
          cid,
          pageNumber,
          attemptNumber,
          doenetId: props.doenetId,
          userId: props.userId,
          requestedVariantIndex,
          allowLoadState: props.flags.allowLoadState,
          showCorrectness: props.flags.showCorrectness,
          solutionDisplayMode: props.flags.solutionDisplayMode,
          showFeedback: props.flags.showFeedback,
          showHints: props.flags.showHints,
        }
      }

      try {
        let resp = await axios.get('/api/loadPageState.php', payload);
        if (!resp.data.success) {
          if (props.flags.allowLoadState) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(`Error loading page state: ${resp.data.message}`);
            return;
          } else {
            // ignore this error if didn't allow loading of page state

          }

        }

        if (resp.data.loadedState) {

          let coreInfo = JSON.parse(resp.data.coreInfo, serializedComponentsReviver);

          initializeRenderers({
            rendererState: JSON.parse(resp.data.rendererState, serializedComponentsReviver),
            coreInfo,
          });

          initialCoreData.current = ({
            coreState: JSON.parse(resp.data.coreState, serializedComponentsReviver),
            serverSaveId: resp.data.saveId,
            requestedVariant: JSON.parse(coreInfo.generatedVariantString, serializedComponentsReviver)
          });
        }


      } catch (e) {

        if (props.flags.allowLoadState) {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`Error loading page state: ${e.message}`);
          return;
        } else {
          // ignore this error if didn't allow loading of page state

        }


      }

    }

    //Guard against the possiblity that parameters changed while waiting
    if (coreIdWhenCalled === coreId.current) {
      if (props.pageIsActive) {
        startCore();
      } else {
        setStage('readyToCreateCore');
      }
    }

  }

  async function saveLoadedLocalStateToDatabase(localInfo) {

    let serverSaveId = await idb_get(`${props.doenetId}|${pageNumber}|${attemptNumber}|${cid}|ServerSaveId`);

    let pageStateToBeSavedToDatabase = {
      cid,
      coreInfo: JSON.stringify(localInfo.coreInfo, serializedComponentsReplacer),
      coreState: JSON.stringify(localInfo.coreState, serializedComponentsReplacer),
      rendererState: JSON.stringify(localInfo.rendererState, serializedComponentsReplacer),
      pageNumber,
      attemptNumber,
      doenetId: props.doenetId,
      saveId: localInfo.saveId,
      serverSaveId,
      updateDataOnContentChange: props.updateDataOnContentChange,
    }

    let resp;

    try {
      resp = await axios.post('/api/savePageState.php', pageStateToBeSavedToDatabase);
    } catch (e) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }


    let data = resp.data;

    if (!data.success) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    idb_set(
      `${props.doenetId}|${pageNumber}|${attemptNumber}|${cid}|ServerSaveId`,
      data.saveId
    )


    if (data.stateOverwritten) {

      let newLocalInfo = {
        coreState: JSON.parse(data.coreState, serializedComponentsReviver),
        rendererState: JSON.parse(data.rendererState, serializedComponentsReviver),
        coreInfo: JSON.parse(data.coreInfo, serializedComponentsReviver),
        saveId: data.saveId,
      }

      idb_set(
        `${props.doenetId}|${pageNumber}|${data.attemptNumber}|${data.cid}`,
        newLocalInfo
      );

      return {
        changedOnDevice: data.device,
        newLocalInfo,
        newCid: data.cid,
        newAttemptNumber: data.attemptNumber,
      }
    }

    return { localInfo, cid, attemptNumber };

  }

  function startCore() {

    // don't create core if snapshot only
    if (props.snapshotOnly) {
      if (stage !== 'readyToCreateCore') {
        setStage('readyToCreateCore');
      }
      return;
    }

    //Kill the current core if it exists
    if (coreWorker.current) {
      terminateCoreAndAnimations();
    }
    // console.log(`send message to create core ${pageNumber}`)

    coreWorker.current = new Worker(props.unbundledCore ? 'core/CoreWorker.js' : '/viewer/core.js', { type: 'module' });

    coreWorker.current.postMessage({
      messageType: "createCore",
      args: {
        coreId: coreId.current,
        userId: props.userId,
        doenetML,
        doenetId: props.doenetId,
        previousComponentTypeCounts: props.previousComponentTypeCounts,
        activityCid: props.activityCid,
        flags: props.flags,
        requestedVariantIndex,
        pageNumber,
        attemptNumber,
        itemNumber: props.itemNumber,
        updateDataOnContentChange: props.updateDataOnContentChange,
        serverSaveId: initialCoreData.current.serverSaveId,
        activityVariantIndex: props.activityVariantIndex,
        requestedVariant: initialCoreData.current.requestedVariant,
        stateVariableChanges: initialCoreData.current.coreState ? initialCoreData.current.coreState : undefined
      }
    });

    setStage('waitingOnCore');

    for (let actionArgs of actionsBeforeCoreCreated.current) {
      coreWorker.current.postMessage({
        messageType: "requestAction",
        args: actionArgs
      });
    }
  }


  function requestAnimationFrame({ action, actionArgs, delay, animationId }) {
    if (!preventMoreAnimations.current) {

      // create new animationId

      if (delay) {
        // set a time out to call actual request animation frame after a delay
        let timeoutId = window.setTimeout(
          () => _requestAnimationFrame({ action, actionArgs, animationId }),
          delay);
        animationInfo.current[animationId] = { timeoutId };
      } else {
        // call actual request animation frame right away
        animationInfo.current[animationId] = {};
        _requestAnimationFrame({ action, actionArgs, animationId });
      }
    }
  }

  function _requestAnimationFrame({ action, actionArgs, animationId }) {

    let animationFrameID = window.requestAnimationFrame(() => callAction({
      action,
      args: actionArgs
    }))

    let animationInfoObj = animationInfo.current[animationId];
    delete animationInfoObj.timeoutId;
    animationInfoObj.animationFrameID = animationFrameID;
  }


  async function cancelAnimationFrame(animationId) {

    let animationInfoObj = animationInfo.current[animationId];
    let timeoutId = animationInfoObj?.timeoutId;
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
    let animationFrameID = animationInfoObj?.animationFrameID;
    if (animationFrameID !== undefined) {
      window.cancelAnimationFrame(animationFrameID);
    }
    delete animationInfo.current[animationId];

  }



  if (errMsg !== null) {
    let errorIcon = <span style={{ fontSize: "1em", color: "#C1292E" }}><FontAwesomeIcon icon={faExclamationCircle} /></span>
    return <div style={{ fontSize: "1.3em", marginLeft: "20px", marginTop: "20px" }}>{errorIcon} {errMsg}</div>
  }



  // first, if cidFromProps or doenetMLFromProps don't match props
  // set state to props and record that that need a new core

  let changedState = false;
  if (doenetMLFromProps !== props.doenetML) {
    setDoenetMLFromProps(props.doenetML);
    changedState = true;
  }
  if (cidFromProps !== props.cid) {
    setCidFromProps(props.cid);
    changedState = true;
  }

  //If no pageNumber prop then set to '1'
  let propPageNumber = props.pageNumber;
  if (propPageNumber === undefined) {
    propPageNumber = '1';
  }

  if (propPageNumber !== pageNumber) {
    setPageNumber(propPageNumber);
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
  let adjustedRequestedVariantIndex = props.requestedVariantIndex;
  if (adjustedRequestedVariantIndex === undefined) {
    adjustedRequestedVariantIndex = propAttemptNumber;
  }


  if (requestedVariantIndex !== adjustedRequestedVariantIndex) {
    setRequestedVariantIndex(adjustedRequestedVariantIndex);
    changedState = true;
  }


  // Next time through will recalculate, after state variables are set
  if (changedState) {
    if (coreWorker.current) {
      terminateCoreAndAnimations();
    }
    setStage('recalcParams')
    coreId.current = nanoid();
    setPageContentChanged(true);
    return null;
  }

  if (stage === 'wait') {
    return null;
  }

  if (stage == 'recalcParams') {
    setStage('wait');
    calculateCidDoenetML();
    return null;
  }

  if (pageContentChanged) {

    setPageContentChanged(false);

    coreInfo.current = null;
    setDocumentRenderer(null);
    coreCreated.current = false;

    setStage("wait");

    loadStateAndInitialize();

    return null;

  }

  if (stage === 'readyToCreateCore' && props.pageIsActive) {
    startCore();

  } else if (stage === 'waitingOnCore' && !props.pageIsActive) {
    // we've moved off this page, but core is still being initialized
    // kill the core worker

    terminateCoreAndAnimations()
    coreWorker.current = null;

    setStage('readyToCreateCore');


  }

  if (props.hideWhenNotCurrent && !props.pageIsCurrent) {
    return null;
  }


  let noCoreWarning = null;
  let pageStyle = { maxWidth: "850px", paddingLeft: "20px", paddingRight: "20px" };
  if (!coreCreated.current && !props.snapshotOnly) {
    if (!documentRenderer) {
      noCoreWarning = <div style={{ backgroundColor: "lightCyan", padding: "10px" }}>
        <p>Initializing....</p>
      </div>
    }
    pageStyle.backgroundColor = "#F0F0F0";
  }

  //Spacing around the whole doenetML document
  return <ErrorBoundary setIsInErrorState={props.setIsInErrorState}>
    {noCoreWarning}
    <div style={pageStyle}>
      {documentRenderer}
    </div>
  </ErrorBoundary>;

}



export async function renderersloadComponent(promises, rendererClassNames) {

  var rendererClasses = {};
  for (let [index, promise] of promises.entries()) {
    try {
      let module = await promise;
      rendererClasses[rendererClassNames[index]] = module.default;
    } catch (error) {
      console.log(error)
      throw Error(`Error: loading ${rendererClassNames[index]} failed.`)
    }

  }
  return rendererClasses;

}


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    this.props.setIsInErrorState?.(true)
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}