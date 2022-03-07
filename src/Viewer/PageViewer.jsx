import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { useToast, toastType } from '@Toast';
import { serializedComponentsReplacer, serializedComponentsReviver } from '../Core/utils/serializedStateProcessing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { rendererState } from './renderers/useDoenetRenderer';
import { atomFamily, useRecoilCallback } from 'recoil';
import { get as idb_get, set as idb_set } from 'idb-keyval';
import { CIDFromText } from '../Core/utils/cid';
import { retrieveTextFileForCID } from '../Core/utils/retrieveTextFile';
import axios from 'axios';
import { returnAllPossibleVariants } from '../Core/utils/returnAllPossibleVariants';

const rendererUpdatesToIgnore = atomFamily({
  key: 'rendererUpdatesToIgnore',
  default: {},
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
    coreId, componentName, stateValues, childrenInstructions, sourceOfUpdate, baseStateVariable
  }) => {

    let ignoreUpdate = false;

    let rendererName = coreId + componentName;

    if (baseStateVariable) {

      let sourceActionId = sourceOfUpdate?.sourceInformation?.[componentName]?.actionId;

      let updatesToIgnore = snapshot.getLoadable(rendererUpdatesToIgnore(rendererName)).contents;

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
          set(rendererUpdatesToIgnore(rendererName), was => {
            let newUpdatesToIgnore = { ...was };
            delete newUpdatesToIgnore[sourceActionId];
            return newUpdatesToIgnore;
          })

        } else {
          // since value was change from the time the update was created
          // don't ignore the remaining pending changes in updatesToIgnore
          // as we changed the state used to determine they could be ignored
          set(rendererUpdatesToIgnore(rendererName), {});
        }
      }
    }

    let newRendererState = { stateValues, childrenInstructions, sourceOfUpdate, ignoreUpdate };

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

  const [CIDFromProps, setCIDFromProps] = useState(null);
  const [doenetMLFromProps, setDoenetMLFromProps] = useState(null);
  const [CID, setCID] = useState(null);
  const [doenetML, setDoenetML] = useState(null);


  const [pageId, setPageId] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(null);
  const [requestedVariantIndex, setRequestedVariantIndex] = useState(null);

  const [stage, setStage] = useState('initial');

  const [pageContentChanged, setPageContentChanged] = useState(false);

  const [documentRenderer, setDocumentRenderer] = useState(null);

  const [initialCoreData, setInitialCoreData] = useState({});


  const rendererClasses = useRef({});
  const coreInfo = useRef(null);
  const coreCreated = useRef(false);
  const coreId = useRef(null);

  const resolveAllStateVariables = useRef(null);
  const actionsBeforeCoreCreated = useRef([]);

  const coreWorker = useRef(
    new Worker(props.unbundledCore ? 'core/CoreWorker.js' : 'viewer/core.js', { type: 'module' })
  );

  const [saveStatesWorker, setSaveStatesWorker] = useState(null);


  useEffect(() => {

    coreWorker.current.onmessage = function (e) {
      // console.log('message from core', e.data)
      if (e.data.messageType === "updateRenderers") {
        if (e.data.init && coreInfo.current) {
          // we don't initialize renderer state values if already have a coreInfo
          // as we must have already gotten the renderer information before core was created
        } else {
          updateRenderers(e.data.args)
        }
      } else if (e.data.messageType === "coreCreated") {
        coreCreated.current = true;
        setStage('coreCreated');
      } else if (e.data.messageType === "initializeRenderers") {
        if (coreInfo.current && JSON.stringify(coreInfo.current) === JSON.stringify(e.data.args.coreInfo)) {
          // we already initialized renderers before core was created
          // so don't initialize them again when core is createad and this is called a second time
        } else {
          initializeRenderers(e.data.args)
        }
      } else if (e.data.messageType === "updateCreditAchieved") {
        props.updateCreditAchievedCallback?.(e.data.args);
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
      } else if (e.data.messageType === "resetPage") {
        resetPage(e.data.args);
      }
    }
  }, [coreWorker.current]);


  useEffect(() => {

    if (pageId !== null) {
      window["returnAllStateVariables" + pageId] = function () {
        coreWorker.current.postMessage({
          messageType: "returnAllStateVariables"
        })

        return new Promise((resolve, reject) => {
          resolveAllStateVariables.current = resolve;
        })

      }

      window["callAction" + pageId] = function ({ actionName, componentName, args }) {
        callAction({
          action: { actionName, componentName },
          args
        })
      }

    }


  }, [pageId])


  function callAction({ action, args, baseVariableValue, name, rendererType }) {

    if (coreCreated.current || !rendererClasses.current[rendererType]?.ignoreActionsWithoutCore) {
      if (baseVariableValue !== undefined && name) {
        let actionId = nanoid();
        updateRendererUpdatesToIgnore({
          coreId: coreId.current,
          componentName: name,
          baseVariableValue,
          actionId
        })
        args = { ...args };
        args.actionId = actionId;
      }

      let actionArgs = {
        actionName: action.actionName,
        componentName: action.componentName,
        args,
      }

      coreWorker.current.postMessage({
        messageType: "requestAction",
        args: actionArgs
      });

      if (!coreCreated.current) {
        actionsBeforeCoreCreated.current.push(actionArgs);
        // console.log('actions before core created', actionsBeforeCoreCreated.current)
      }
    }
  }


  function initializeRenderers(args) {

    if (args.rendererState) {
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
          key: coreId.current + documentComponentInstructions.componentName,
          componentInstructions: documentComponentInstructions,
          rendererClasses: newRendererClasses,
          flags: props.flags,
          coreId: coreId.current,
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
            coreId: coreId.current,
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


  function resetPage({ changedOnDevice, newCID, newAttemptNumber }) {
    console.log('resetPage', changedOnDevice, newCID, newAttemptNumber);

    toast(`Reverted page to state saved on device ${changedOnDevice}`, toastType.ERROR);

    if (CID && newCID !== CID) {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      console.log(`CID: ${CID}, newCID ${newCID}`)
      setErrMsg("Have not implemented handling change in page content from other device.  Please reload page");
    } else if (newAttemptNumber !== attemptNumber) {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg("Have not implemented handling creating new attempt from other device.  Please reload page");
    } else {
      // TODO: are there cases where will get an infinite loop here?

      coreId.current = nanoid();
      setPageContentChanged(true);
    }


  }

  function calculateCIDDoenetML() {

    // compare with undefined as doenetML could be empty string
    if (doenetMLFromProps !== undefined) {
      if (CIDFromProps) {
        // check to see if doenetML matches CID
        CIDFromText(doenetMLFromProps)
          .then(calcCID => {
            if (calcCID === CIDFromProps) {
              setDoenetML(doenetMLFromProps);
              setCID(CIDFromProps);
              setStage('continue');
            } else {
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true)
              }
              setErrMsg(`doenetML did not match specified CID: ${CIDFromProps}`);
            }
          })
      } else {
        // if have doenetML and no CID, then calculate CID
        CIDFromText(doenetMLFromProps)
          .then(CID => {
            setDoenetML(doenetMLFromProps);
            setCID(CID);
            setStage('continue');
          })
      }
    } else {
      // if don't have doenetML, then retrieve doenetML from CID

      retrieveTextFileForCID(CIDFromProps, "doenet")
        .then(retrievedDoenetML => {
          setDoenetML(retrievedDoenetML);
          setCID(CIDFromProps);
          setStage('continue');
        })
        .catch(e => {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`doenetML not found for CID: ${CIDFromProps}`);
        })
    }

  }

  async function loadStateAndInitializeRenderers() {

    let loadedCoreState = false;

    if (props.flags.allowLocalState) {

      let localInfo;

      try {
        localInfo = await idb_get(`${props.doenetId}|${pageId}|${attemptNumber}|${CID}`);
      } catch (e) {
        // ignore error
      }

      if (localInfo) {

        if (props.flags.allowSaveState) {
          // attempt to save local info to database,
          // reseting data to that from database if it has changed since last save

          let result = await saveLoadedLocalStateToDatabase(localInfo);

          if (result.changedOnDevice) {
            if (result.newCID !== CID || Number(result.newAttemptNumber) !== attemptNumber) {
              resetPage({
                changedOnDevice: result.changedOnDevice,
                newCID: result.newCID,
                newAttemptNumber: Number(result.newAttemptNumber),
              })
              return;
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


        setInitialCoreData({
          coreState: localInfo.coreState,
          serverSaveId: localInfo.saveId,
          requestedVariant: JSON.parse(localInfo.coreInfo.generatedVariantString, serializedComponentsReviver)
        });

        loadedCoreState = true;

      }
    }

    if (!loadedCoreState) {
      // if didn't load core state from local storage, try to load from database

      // even if allowLoadState is false,
      // still call loadPageState, in which case it will only retrieve the initial page state


      const payload = {
        params: {
          CID,
          pageId,
          attemptNumber,
          doenetId: props.doenetId,
          userId: props.userId,
          requestedVariantIndex,
          allowLoadState: props.flags.allowLoadState,
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

          setInitialCoreData({
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

    setStage('readyToCreateCore');

  }

  async function saveLoadedLocalStateToDatabase(localInfo) {

    let serverSaveId = await idb_get(`${props.doenetId}|${pageId}|${attemptNumber}|${CID}|ServerSaveId`);

    let pageStateToBeSavedToDatabase = {
      CID,
      coreInfo: JSON.stringify(localInfo.coreInfo, serializedComponentsReplacer),
      coreState: JSON.stringify(localInfo.coreState, serializedComponentsReplacer),
      rendererState: JSON.stringify(localInfo.rendererState, serializedComponentsReplacer),
      pageId,
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
      return { localInfo, CID, attemptNumber };
    }

    console.log('result from saving to db', resp.data)

    let data = resp.data;

    if (!data.success) {
      // since this is initial load, don't show error message
      return { localInfo, CID, attemptNumber };
    }

    idb_set(
      `${props.doenetId}|${pageId}|${attemptNumber}|${CID}|ServerSaveId`,
      data.saveId
    )


    if (data.stateOverwritten) {

      if (CID !== data.CID || attemptNumber !== Number(data.attemptNumber)
        || pageStateToBeSavedToDatabase.coreInfo !== data.coreInfo
        || pageStateToBeSavedToDatabase.coreState !== data.coreState
        || pageStateToBeSavedToDatabase.rendererState !== data.rendererState
      ) {

        let newLocalInfo = {
          coreState: JSON.parse(data.coreState, serializedComponentsReviver),
          rendererState: JSON.parse(data.rendererState, serializedComponentsReviver),
          coreInfo: JSON.parse(data.coreInfo, serializedComponentsReviver),
          saveId: data.saveId,
        }

        idb_set(
          `${props.doenetId}|${pageId}|${data.attemptNumber}|${data.CID}`,
          newLocalInfo
        );

        return {
          changedOnDevice: data.device,
          newLocalInfo,
          newCID: data.CID,
          newAttemptNumber: data.attemptNumber,
        }
      }
    }

    return { localInfo, CID, attemptNumber };

  }

  async function saveInitialRendererStates() {

    let result = await returnAllPossibleVariants({ doenetId: props.doenetId, CID, flags: props.flags });

    let nVariants = result.allPossibleVariants.length;

    let sWorker = new Worker('core/utils/initialState.js', { type: 'module' });

    console.log(`Generating initial renderer states for ${nVariants} variants`);

    sWorker.postMessage({
      messageType: "saveInitialRendererStates",
      args: {
        doenetId: props.doenetId,
        CID,
        doenetML,
        flags: props.flags,
        nVariants
      }
    })

    sWorker.onmessage = function (e) {
      if (e.data.messageType === "finished") {
        sWorker.terminate();
        setSaveStatesWorker(null);
      }
    }

    setSaveStatesWorker(sWorker);
  }

  function cancelSaveInitialRendererStates() {
    saveStatesWorker.terminate();
    setSaveStatesWorker(null);
  }


  if (errMsg !== null) {
    let errorIcon = <span style={{ fontSize: "1em", color: "#C1292E" }}><FontAwesomeIcon icon={faExclamationCircle} /></span>
    return <div style={{ fontSize: "1.3em", marginLeft: "20px", marginTop: "20px" }}>{errorIcon} {errMsg}</div>
  }



  // first, if CIDFromProps or doenetMLFromProps don't match props
  // set state to props and record that that need a new core

  let changedState = false;

  if (doenetMLFromProps !== props.doenetML) {
    setDoenetMLFromProps(props.doenetML);
    changedState = true;
  }
  if (CIDFromProps !== props.CID) {
    setCIDFromProps(props.CID);
    changedState = true;
  }

  //If no pageId prop then set to '1'
  let propPageId = props.pageId;
  if (propPageId === undefined) {
    propPageId = '1';
  }

  if (propPageId !== pageId) {
    setPageId(propPageId);
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

  // Next time through will recalculate, after state variables are set
  if (changedState) {
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
    calculateCIDDoenetML();
    return null;
  }

  if (pageContentChanged) {

    setPageContentChanged(false);

    coreInfo.current = null;
    setDocumentRenderer(null);
    coreCreated.current = false;

    loadStateAndInitializeRenderers();

    return null;

  }

  if (stage === 'readyToCreateCore' && props.pageIsActive) {

    console.log(`send message to create core ${pageId}`)

    coreWorker.current.postMessage({
      messageType: "createCore",
      args: {
        coreId: coreId.current,
        userId: props.userId,
        doenetML,
        CID,
        doenetId: props.doenetId,
        flags: props.flags,
        requestedVariantIndex,
        pageId,
        attemptNumber,
        updateDataOnContentChange: props.updateDataOnContentChange,
        serverSaveId: initialCoreData.serverSaveId,
        requestedVariant: initialCoreData.requestedVariant,
        stateVariableChanges: initialCoreData.coreState ? initialCoreData.coreState : undefined
      }
    });
    setStage('waitingOnCore');

    for (let actionArgs of actionsBeforeCoreCreated.current) {
      coreWorker.current.postMessage({
        messageType: "requestAction",
        args: actionArgs
      });
    }
  } else if (stage === 'waitingOnCore' && !props.pageIsActive) {
    // we've moved off this page, but core is still being initialized
    // kill the core worker and create a new one

    console.log('terminating worker!!')

    coreWorker.current.terminate();

    coreWorker.current =
      new Worker(props.unbundledCore ? 'core/CoreWorker.js' : 'viewer/core.js', { type: 'module' });

    setStage('readyToCreateCore');


  }


  let savesStateButton;
  if (saveStatesWorker) {
    savesStateButton = <button onClick={() => cancelSaveInitialRendererStates()}>Cancel saving initial renderer states</button>
  } else {
    savesStateButton = <button onClick={() => saveInitialRendererStates()}>Save initial renderer states</button>
  }

  //Spacing around the whole doenetML document
  return <>
    <div style={{ backgroundColor: "lightCyan", padding: "10px" }}>
      <p>For page {pageId}, have renderer: {Boolean(documentRenderer).toString()}, isActive: {props.pageIsActive.toString()}, coreCreated: {coreCreated.current.toString()}</p>
      <p>{savesStateButton}</p>
    </div>
    <div style={{ maxWidth: "850px", paddingLeft: "20px", paddingRight: "20px" }}>
      {documentRenderer}
    </div>
  </>;

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

