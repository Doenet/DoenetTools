import React, {useEffect, useRef, useState} from "../_snowpack/pkg/react.js";
import {nanoid} from "../_snowpack/pkg/nanoid.js";
import {useToast, toastType} from "../_framework/Toast.js";
import {serializedComponentsReplacer, serializedComponentsReviver} from "../core/utils/serializedStateProcessing.js";
import {FontAwesomeIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faExclamationCircle} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {rendererState} from "./renderers/useDoenetRenderer.js";
import {atomFamily, useRecoilCallback} from "../_snowpack/pkg/recoil.js";
import {get as idb_get, set as idb_set} from "../_snowpack/pkg/idb-keyval.js";
import {cidFromText} from "../core/utils/cid.js";
import {retrieveTextFileForCid} from "../core/utils/retrieveTextFile.js";
import axios from "../_snowpack/pkg/axios.js";
import {returnAllPossibleVariants} from "../core/utils/returnAllPossibleVariants.js";
const rendererUpdatesToIgnore = atomFamily({
  key: "rendererUpdatesToIgnore",
  default: {}
});
export default function PageViewer(props) {
  const toast = useToast();
  const updateRendererSVsWithRecoil = useRecoilCallback(({snapshot, set}) => async ({
    coreId: coreId2,
    componentName,
    stateValues,
    childrenInstructions,
    sourceOfUpdate,
    baseStateVariable,
    actionId
  }) => {
    let ignoreUpdate = false;
    let rendererName = coreId2 + componentName;
    if (baseStateVariable) {
      let updatesToIgnore = snapshot.getLoadable(rendererUpdatesToIgnore(rendererName)).contents;
      if (Object.keys(updatesToIgnore).length > 0) {
        let valueFromRenderer = updatesToIgnore[actionId];
        let valueFromCore = stateValues[baseStateVariable];
        if (valueFromRenderer === valueFromCore || Array.isArray(valueFromRenderer) && Array.isArray(valueFromCore) && valueFromRenderer.length == valueFromCore.length && valueFromRenderer.every((v, i) => valueFromCore[i] === v)) {
          ignoreUpdate = true;
          set(rendererUpdatesToIgnore(rendererName), (was) => {
            let newUpdatesToIgnore = {...was};
            delete newUpdatesToIgnore[actionId];
            return newUpdatesToIgnore;
          });
        } else {
          set(rendererUpdatesToIgnore(rendererName), {});
        }
      }
    }
    let newRendererState = {stateValues, childrenInstructions, sourceOfUpdate, ignoreUpdate};
    if (childrenInstructions === void 0) {
      let previousRendererState = snapshot.getLoadable(rendererState(rendererName)).contents;
      newRendererState.childrenInstructions = previousRendererState.childrenInstructions;
    }
    set(rendererState(rendererName), newRendererState);
  });
  const updateRendererUpdatesToIgnore = useRecoilCallback(({snapshot, set}) => async ({coreId: coreId2, componentName, baseVariableValue, actionId}) => {
    let rendererName = coreId2 + componentName;
    set(rendererUpdatesToIgnore(rendererName), (was) => {
      let newUpdatesToIgnore = {...was};
      newUpdatesToIgnore[actionId] = baseVariableValue;
      return newUpdatesToIgnore;
    });
  });
  const [errMsg, setErrMsg] = useState(null);
  const [cidFromProps, setCidFromProps] = useState(null);
  const [doenetMLFromProps, setDoenetMLFromProps] = useState(null);
  const [cid, setCid] = useState(null);
  const [doenetML, setDoenetML] = useState(null);
  const [pageNumber, setPageNumber] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(null);
  const [requestedVariantIndex, setRequestedVariantIndex] = useState(null);
  const [stage, setStage] = useState("initial");
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
  const [saveStatesWorker, setSaveStatesWorker] = useState(null);
  const preventMoreAnimations = useRef(false);
  const animationInfo = useRef({});
  const resolveActionPromises = useRef({});
  useEffect(() => {
    if (coreWorker.current) {
      coreWorker.current.onmessage = function(e) {
        if (e.data.messageType === "updateRenderers") {
          if (e.data.init && coreInfo.current) {
          } else {
            updateRenderers(e.data.args);
          }
        } else if (e.data.messageType === "requestAnimationFrame") {
          requestAnimationFrame(e.data.args);
        } else if (e.data.messageType === "cancelAnimationFrame") {
          cancelAnimationFrame(e.data.args);
        } else if (e.data.messageType === "coreCreated") {
          coreCreated.current = true;
          setStage("coreCreated");
        } else if (e.data.messageType === "initializeRenderers") {
          if (coreInfo.current && JSON.stringify(coreInfo.current) === JSON.stringify(e.data.args.coreInfo)) {
          } else {
            initializeRenderers(e.data.args);
          }
        } else if (e.data.messageType === "updateCreditAchieved") {
          props.updateCreditAchievedCallback?.(e.data.args);
        } else if (e.data.messageType === "savedState") {
          props.saveStateCallback?.();
        } else if (e.data.messageType === "sendToast") {
          console.log(`Sending toast message: ${e.data.args.message}`);
          toast(e.data.args.message, e.data.args.toastType);
        } else if (e.data.messageType === "resolveAction") {
          resolveAction(e.data.args);
        } else if (e.data.messageType === "returnAllStateVariables") {
          console.log(e.data.args);
          resolveAllStateVariables.current(e.data.args);
        } else if (e.data.messageType === "inErrorState") {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true);
          }
          setErrMsg(e.data.args.errMsg);
        } else if (e.data.messageType === "resetPage") {
          resetPage(e.data.args);
        } else if (e.data.messageType === "terminated") {
          coreWorker.current.terminate();
        }
      };
    }
  }, [coreWorker.current]);
  useEffect(() => {
    return () => {
      if (coreWorker.current) {
        coreWorker.current.postMessage({
          messageType: "terminate"
        });
      }
    };
  }, []);
  useEffect(() => {
    if (pageNumber !== null) {
      window["returnAllStateVariables" + pageNumber] = function() {
        coreWorker.current.postMessage({
          messageType: "returnAllStateVariables"
        });
        return new Promise((resolve, reject) => {
          resolveAllStateVariables.current = resolve;
        });
      };
      window["callAction" + pageNumber] = async function({actionName, componentName, args}) {
        await callAction({
          action: {actionName, componentName},
          args
        });
      };
    }
  }, [pageNumber]);
  useEffect(() => {
    return () => {
      preventMoreAnimations.current = true;
      for (let id in animationInfo.current) {
        cancelAnimationFrame(id);
      }
      animationInfo.current = {};
    };
  }, []);
  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (coreWorker.current) {
        coreWorker.current.postMessage({
          messageType: "visibilityChange",
          args: {
            visible: document.visibilityState === "visible"
          }
        });
      }
    });
  });
  async function callAction({action, args, baseVariableValue, componentName, rendererType}) {
    if (coreCreated.current || !rendererClasses.current[rendererType]?.ignoreActionsWithoutCore) {
      let actionId = nanoid();
      args = {...args};
      args.actionId = actionId;
      if (baseVariableValue !== void 0 && componentName) {
        updateRendererUpdatesToIgnore({
          coreId: coreId.current,
          componentName,
          baseVariableValue,
          actionId
        });
      }
      let actionArgs = {
        actionName: action.actionName,
        componentName: action.componentName,
        args
      };
      coreWorker.current.postMessage({
        messageType: "requestAction",
        args: actionArgs
      });
      if (!coreCreated.current) {
        actionsBeforeCoreCreated.current.push(actionArgs);
      }
      return new Promise((resolve, reject) => {
        resolveActionPromises.current[actionId] = resolve;
      });
    }
  }
  function initializeRenderers(args) {
    if (args.rendererState) {
      for (let componentName in args.rendererState) {
        updateRendererSVsWithRecoil({
          coreId: coreId.current,
          componentName,
          stateValues: args.rendererState[componentName].stateValues,
          childrenInstructions: args.rendererState[componentName].childrenInstructions
        });
      }
    }
    coreInfo.current = args.coreInfo;
    if (props.generatedVariantCallback) {
      props.generatedVariantCallback(JSON.parse(coreInfo.current.generatedVariantString, serializedComponentsReviver), coreInfo.current.allPossibleVariants, coreInfo.current.variantIndicesToIgnore);
    }
    let renderPromises = [];
    let rendererClassNames = [];
    for (let rendererClassName of coreInfo.current.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      renderPromises.push(import(`./renderers/${rendererClassName}.js`));
    }
    let documentComponentInstructions = coreInfo.current.documentToRender;
    renderersloadComponent(renderPromises, rendererClassNames).then((newRendererClasses) => {
      rendererClasses.current = newRendererClasses;
      let documentRendererClass = newRendererClasses[documentComponentInstructions.rendererType];
      setDocumentRenderer(React.createElement(documentRendererClass, {
        key: coreId.current + documentComponentInstructions.componentName,
        componentInstructions: documentComponentInstructions,
        rendererClasses: newRendererClasses,
        flags: props.flags,
        coreId: coreId.current,
        callAction
      }));
    });
  }
  function updateRenderers({updateInstructions, actionId}) {
    for (let instruction of updateInstructions) {
      if (instruction.instructionType === "updateRendererStates") {
        for (let {componentName, stateValues, rendererType, childrenInstructions} of instruction.rendererStatesToUpdate) {
          updateRendererSVsWithRecoil({
            coreId: coreId.current,
            componentName,
            stateValues,
            childrenInstructions,
            sourceOfUpdate: instruction.sourceOfUpdate,
            baseStateVariable: rendererClasses.current[rendererType]?.baseStateVariable,
            actionId
          });
        }
      }
    }
    resolveAction({actionId});
  }
  function resolveAction({actionId}) {
    if (actionId) {
      resolveActionPromises.current[actionId]?.();
      delete resolveActionPromises.current[actionId];
    }
  }
  function resetPage({changedOnDevice, newCid, newAttemptNumber}) {
    console.log("resetPage", changedOnDevice, newCid, newAttemptNumber);
    if (newAttemptNumber !== attemptNumber) {
      toast(`Reverted activity as attempt number changed on other device`, toastType.ERROR);
      if (props.updateAttemptNumber) {
        props.updateAttemptNumber(newAttemptNumber);
      } else {
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true);
        }
        setErrMsg("how to reset attempt number when not given updateAttemptNumber function?");
      }
    } else {
      toast(`Reverted page to state saved on device ${changedOnDevice}`, toastType.ERROR);
      coreId.current = nanoid();
      setPageContentChanged(true);
    }
  }
  function calculateCidDoenetML() {
    if (doenetMLFromProps !== void 0) {
      if (cidFromProps) {
        cidFromText(doenetMLFromProps).then((calcCid) => {
          if (calcCid === cidFromProps) {
            setDoenetML(doenetMLFromProps);
            setCid(cidFromProps);
            setStage("continue");
          } else {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true);
            }
            setErrMsg(`doenetML did not match specified cid: ${cidFromProps}`);
          }
        });
      } else {
        cidFromText(doenetMLFromProps).then((cid2) => {
          setDoenetML(doenetMLFromProps);
          setCid(cid2);
          setStage("continue");
        });
      }
    } else {
      retrieveTextFileForCid(cidFromProps, "doenet").then((retrievedDoenetML) => {
        setDoenetML(retrievedDoenetML);
        setCid(cidFromProps);
        setStage("continue");
      }).catch((e) => {
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true);
        }
        setErrMsg(`doenetML not found for cid: ${cidFromProps}`);
      });
    }
  }
  async function loadStateAndInitialize() {
    let loadedState = false;
    if (props.flags.allowLocalState) {
      let localInfo;
      try {
        localInfo = await idb_get(`${props.doenetId}|${pageNumber}|${attemptNumber}|${cid}`);
      } catch (e) {
      }
      if (localInfo) {
        if (props.flags.allowSaveState) {
          let result = await saveLoadedLocalStateToDatabase(localInfo);
          if (result.changedOnDevice) {
            if (Number(result.newAttemptNumber) !== attemptNumber) {
              resetPage({
                changedOnDevice: result.changedOnDevice,
                newCid: result.newCid,
                newAttemptNumber: Number(result.newAttemptNumber)
              });
              return;
            } else if (result.newCid !== cid) {
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true);
              }
              setErrMsg(`content changed unexpectedly!`);
            }
            localInfo = result.newLocalInfo;
            console.log(`sending toast: Reverted page to state saved on device ${result.changedOnDevice}`);
            toast(`Reverted page to state saved on device ${result.changedOnDevice}`, toastType.ERROR);
          }
        }
        initializeRenderers({
          rendererState: localInfo.rendererState,
          coreInfo: localInfo.coreInfo
        });
        initialCoreData.current = {
          coreState: localInfo.coreState,
          serverSaveId: localInfo.saveId,
          requestedVariant: JSON.parse(localInfo.coreInfo.generatedVariantString, serializedComponentsReviver)
        };
        loadedState = true;
      }
    }
    if (!loadedState) {
      const payload = {
        params: {
          cid,
          pageNumber,
          attemptNumber,
          doenetId: props.doenetId,
          userId: props.userId,
          requestedVariantIndex,
          allowLoadState: props.flags.allowLoadState
        }
      };
      try {
        let resp = await axios.get("/api/loadPageState.php", payload);
        if (!resp.data.success) {
          if (props.flags.allowLoadState) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true);
            }
            setErrMsg(`Error loading page state: ${resp.data.message}`);
            return;
          } else {
          }
        }
        if (resp.data.loadedState) {
          let coreInfo2 = JSON.parse(resp.data.coreInfo, serializedComponentsReviver);
          initializeRenderers({
            rendererState: JSON.parse(resp.data.rendererState, serializedComponentsReviver),
            coreInfo: coreInfo2
          });
          initialCoreData.current = {
            coreState: JSON.parse(resp.data.coreState, serializedComponentsReviver),
            serverSaveId: resp.data.saveId,
            requestedVariant: JSON.parse(coreInfo2.generatedVariantString, serializedComponentsReviver)
          };
        }
      } catch (e) {
        if (props.flags.allowLoadState) {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true);
          }
          setErrMsg(`Error loading page state: ${e.message}`);
          return;
        } else {
        }
      }
    }
    startCore();
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
      updateDataOnContentChange: props.updateDataOnContentChange
    };
    let resp;
    try {
      resp = await axios.post("/api/savePageState.php", pageStateToBeSavedToDatabase);
    } catch (e) {
      return {localInfo, cid, attemptNumber};
    }
    console.log("result from saving to db", resp.data);
    let data = resp.data;
    if (!data.success) {
      return {localInfo, cid, attemptNumber};
    }
    idb_set(`${props.doenetId}|${pageNumber}|${attemptNumber}|${cid}|ServerSaveId`, data.saveId);
    if (data.stateOverwritten) {
      let newLocalInfo = {
        coreState: JSON.parse(data.coreState, serializedComponentsReviver),
        rendererState: JSON.parse(data.rendererState, serializedComponentsReviver),
        coreInfo: JSON.parse(data.coreInfo, serializedComponentsReviver),
        saveId: data.saveId
      };
      idb_set(`${props.doenetId}|${pageNumber}|${data.attemptNumber}|${data.cid}`, newLocalInfo);
      return {
        changedOnDevice: data.device,
        newLocalInfo,
        newCid: data.cid,
        newAttemptNumber: data.attemptNumber
      };
    }
    return {localInfo, cid, attemptNumber};
  }
  function startCore() {
    coreWorker.current = new Worker(props.unbundledCore ? "core/CoreWorker.js" : "/viewer/core.js", {type: "module"});
    coreWorker.current.postMessage({
      messageType: "createCore",
      args: {
        coreId: coreId.current,
        userId: props.userId,
        doenetML,
        doenetId: props.doenetId,
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
        stateVariableChanges: initialCoreData.current.coreState ? initialCoreData.current.coreState : void 0
      }
    });
    setStage("waitingOnCore");
    for (let actionArgs of actionsBeforeCoreCreated.current) {
      coreWorker.current.postMessage({
        messageType: "requestAction",
        args: actionArgs
      });
    }
  }
  async function saveInitialRendererStates() {
    let nVariants;
    try {
      let result = await returnAllPossibleVariants({doenetId: props.doenetId, cid, flags: props.flags});
      nVariants = result.allPossibleVariants.length;
    } catch (e) {
      let message = `Could not save initial renderer state: ${e.message}`;
      console.log(`Sending toast: ${message}`);
      toast(message, toastType.ERROR);
      return;
    }
    let sWorker = new Worker("core/utils/initialState.js", {type: "module"});
    console.log(`Generating initial renderer states for ${nVariants} variants`);
    sWorker.postMessage({
      messageType: "saveInitialRendererStates",
      args: {
        doenetId: props.doenetId,
        cid,
        doenetML,
        flags: props.flags,
        nVariants
      }
    });
    sWorker.onmessage = function(e) {
      if (e.data.messageType === "finished") {
        sWorker.terminate();
        setSaveStatesWorker(null);
      }
    };
    setSaveStatesWorker(sWorker);
  }
  function cancelSaveInitialRendererStates() {
    saveStatesWorker.terminate();
    setSaveStatesWorker(null);
  }
  function requestAnimationFrame({action, actionArgs, delay, animationId}) {
    if (!preventMoreAnimations.current) {
      if (delay) {
        let timeoutId = window.setTimeout(() => _requestAnimationFrame({action, actionArgs, animationId}), delay);
        animationInfo.current[animationId] = {timeoutId};
      } else {
        animationInfo.current[animationId] = {};
        _requestAnimationFrame({action, actionArgs, animationId});
      }
    }
  }
  function _requestAnimationFrame({action, actionArgs, animationId}) {
    let animationFrameID = window.requestAnimationFrame(() => callAction({
      action,
      args: actionArgs
    }));
    let animationInfoObj = animationInfo.current[animationId];
    delete animationInfoObj.timeoutId;
    animationInfoObj.animationFrameID = animationFrameID;
  }
  async function cancelAnimationFrame(animationId) {
    let animationInfoObj = animationInfo.current[animationId];
    let timeoutId = animationInfoObj.timeoutId;
    if (timeoutId !== void 0) {
      window.clearTimeout(timeoutId);
    }
    let animationFrameID = animationInfoObj.animationFrameID;
    if (animationFrameID !== void 0) {
      window.cancelAnimationFrame(animationFrameID);
    }
    delete animationInfo.current[animationId];
  }
  if (errMsg !== null) {
    let errorIcon = /* @__PURE__ */ React.createElement("span", {
      style: {fontSize: "1em", color: "#C1292E"}
    }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faExclamationCircle
    }));
    return /* @__PURE__ */ React.createElement("div", {
      style: {fontSize: "1.3em", marginLeft: "20px", marginTop: "20px"}
    }, errorIcon, " ", errMsg);
  }
  let changedState = false;
  if (doenetMLFromProps !== props.doenetML) {
    setDoenetMLFromProps(props.doenetML);
    changedState = true;
  }
  if (cidFromProps !== props.cid) {
    setCidFromProps(props.cid);
    changedState = true;
  }
  let propPageNumber = props.pageNumber;
  if (propPageNumber === void 0) {
    propPageNumber = "1";
  }
  if (propPageNumber !== pageNumber) {
    setPageNumber(propPageNumber);
    changedState = true;
  }
  let propAttemptNumber = props.attemptNumber;
  if (propAttemptNumber === void 0) {
    propAttemptNumber = 1;
  }
  if (propAttemptNumber !== attemptNumber) {
    setAttemptNumber(propAttemptNumber);
    changedState = true;
  }
  let adjustedRequestedVariantIndex = props.requestedVariantIndex;
  if (adjustedRequestedVariantIndex === void 0) {
    adjustedRequestedVariantIndex = propAttemptNumber;
  }
  if (requestedVariantIndex !== adjustedRequestedVariantIndex) {
    setRequestedVariantIndex(adjustedRequestedVariantIndex);
    changedState = true;
  }
  if (changedState) {
    setStage("recalcParams");
    coreId.current = nanoid();
    setPageContentChanged(true);
    return null;
  }
  if (stage === "wait") {
    return null;
  }
  if (stage == "recalcParams") {
    setStage("wait");
    calculateCidDoenetML();
    return null;
  }
  if (pageContentChanged && props.pageIsActive) {
    setPageContentChanged(false);
    coreInfo.current = null;
    setDocumentRenderer(null);
    coreCreated.current = false;
    setStage("wait");
    loadStateAndInitialize();
    return null;
  }
  if (stage === "readyToCreateCore" && props.pageIsActive) {
    startCore();
  } else if (stage === "waitingOnCore" && !props.pageIsActive) {
    coreWorker.current.terminate();
    coreWorker.current = null;
    setStage("readyToCreateCore");
  }
  if (!props.pageIsActive) {
    return null;
  }
  let saveStatesButton;
  if (saveStatesWorker) {
    saveStatesButton = /* @__PURE__ */ React.createElement("button", {
      onClick: () => cancelSaveInitialRendererStates()
    }, "Cancel saving initial renderer states");
  } else {
    saveStatesButton = /* @__PURE__ */ React.createElement("button", {
      onClick: () => saveInitialRendererStates()
    }, "Save initial renderer states");
  }
  let noCoreWarning = null;
  let pageStyle = {maxWidth: "850px", paddingLeft: "20px", paddingRight: "20px", paddingBottom: "50vh"};
  if (!coreCreated.current) {
    noCoreWarning = /* @__PURE__ */ React.createElement("div", {
      style: {backgroundColor: "lightCyan", padding: "10px"}
    }, /* @__PURE__ */ React.createElement("p", null, "Waiting for core to be created...."));
    pageStyle.backgroundColor = "#F0F0F0";
  }
  return /* @__PURE__ */ React.createElement(ErrorBoundary, {
    setIsInErrorState: props.setIsInErrorState
  }, noCoreWarning, /* @__PURE__ */ React.createElement("div", {
    style: pageStyle
  }, documentRenderer));
}
export async function renderersloadComponent(promises, rendererClassNames) {
  var rendererClasses = {};
  for (let [index, promise] of promises.entries()) {
    try {
      let module = await promise;
      rendererClasses[rendererClassNames[index]] = module.default;
    } catch (error) {
      console.log(error);
      throw Error(`Error: loading ${rendererClassNames[index]} failed.`);
    }
  }
  return rendererClasses;
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }
  static getDerivedStateFromError(error) {
    return {hasError: true};
  }
  componentDidCatch(error, errorInfo) {
    this.props.setIsInErrorState?.(true);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ React.createElement("h1", null, "Something went wrong.");
    }
    return this.props.children;
  }
}
