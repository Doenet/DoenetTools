import React, { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { useToast, toastType } from "@Toast";
import {
  serializedComponentsReplacer,
  serializedComponentsReviver,
} from "../Core/utils/serializedStateProcessing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { rendererState } from "./useDoenetRenderer";
import { atom, atomFamily, useRecoilCallback, useRecoilValue } from "recoil";
import { get as idb_get, set as idb_set } from "idb-keyval";
import { cidFromText } from "../Core/utils/cid";
import { retrieveTextFileForCid } from "../Core/utils/retrieveTextFile";
import axios from "axios";
import { returnAllPossibleVariants } from "../Core/utils/returnAllPossibleVariants";
import { useLocation, useNavigate } from "react-router";
import { pageToolViewAtom } from "../Tools/_framework/NewToolRoot";
import { itemByDoenetId } from "../_reactComponents/Course/CourseActions";
import { darkModeAtom } from "../Tools/_framework/DarkmodeController";
import { cesc } from "../_utils/url";

const rendererUpdatesToIgnore = atomFamily({
  key: "rendererUpdatesToIgnore",
  default: {},
});

export const scrollableContainerAtom = atom({
  key: "scollParentAtom",
  default: null,
});

// Two notes about props.flags of PageViewer
// 1. In Core, flags.allowSaveState implies flags.allowLoadState
// Rationale: saving state will result in loading a new state if another device changed it,
// so having allowLoadState false in that case would lead to inconsistent behavior
// 2. In Core, if props.userId is defined, both
// flags.allowLocalState and flags.allowSaveState are set to false

export default function PageViewer(props) {
  const toast = useToast();
  const updateRendererSVsWithRecoil = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({
        coreId,
        componentName,
        stateValues,
        childrenInstructions,
        sourceOfUpdate,
        baseStateVariable,
        actionId,
      }) => {
        let ignoreUpdate = false;

        let rendererName = coreId + componentName;

        if (baseStateVariable) {
          let updatesToIgnore = snapshot.getLoadable(
            rendererUpdatesToIgnore(rendererName),
          ).contents;

          if (Object.keys(updatesToIgnore).length > 0) {
            let valueFromRenderer = updatesToIgnore[actionId];
            let valueFromCore = stateValues[baseStateVariable];
            if (
              valueFromRenderer === valueFromCore ||
              (Array.isArray(valueFromRenderer) &&
                Array.isArray(valueFromCore) &&
                valueFromRenderer.length == valueFromCore.length &&
                valueFromRenderer.every((v, i) => valueFromCore[i] === v))
            ) {
              // console.log(`ignoring update of ${componentName} to ${valueFromCore}`)
              ignoreUpdate = true;
              set(rendererUpdatesToIgnore(rendererName), (was) => {
                let newUpdatesToIgnore = { ...was };
                delete newUpdatesToIgnore[actionId];
                return newUpdatesToIgnore;
              });
            } else {
              // since value was changed from the time the update was created
              // don't ignore the remaining pending changes in updatesToIgnore
              // as we changed the state used to determine they could be ignored
              set(rendererUpdatesToIgnore(rendererName), {});
            }
          }
        }

        let newRendererState = {
          stateValues,
          childrenInstructions,
          sourceOfUpdate,
          ignoreUpdate,
          prefixForIds: prefixForIds,
        };

        if (childrenInstructions === undefined) {
          let previousRendererState = snapshot.getLoadable(
            rendererState(rendererName),
          ).contents;
          newRendererState.childrenInstructions =
            previousRendererState.childrenInstructions;
        }

        set(rendererState(rendererName), newRendererState);
      },
  );
  const updateRendererUpdatesToIgnore = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ coreId, componentName, baseVariableValue, actionId }) => {
        let rendererName = coreId + componentName;

        // add to updates to ignore so don't apply change again
        // if it comes back from core without any changes
        // (possibly after a delay)
        set(rendererUpdatesToIgnore(rendererName), (was) => {
          let newUpdatesToIgnore = { ...was };
          newUpdatesToIgnore[actionId] = baseVariableValue;
          return newUpdatesToIgnore;
        });
      },
  );

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
  const coreCreationInProgress = useRef(false);
  const coreId = useRef(null);

  const resolveAllStateVariables = useRef(null);
  const actionsBeforeCoreCreated = useRef([]);

  const coreWorker = useRef(null);

  const preventMoreAnimations = useRef(false);
  const animationInfo = useRef({});

  const resolveActionPromises = useRef({});
  const actionTentativelySkipped = useRef(null);

  const prefixForIds = props.prefixForIds || "";

  const previousLocationKeys = useRef([]);

  const errorInitializingRenderers = useRef(false);
  const errorInsideRenderers = useRef(false);

  const [ignoreRendererError, setIgnoreRendererError] = useState(false);

  const darkMode = useRecoilValue(darkModeAtom);

  const pageToolView = useRecoilValue(pageToolViewAtom);
  const itemInCourse = useRecoilValue(itemByDoenetId(props.doenetId));
  const scrollableContainer = useRecoilValue(scrollableContainerAtom);

  let navigate = useNavigate();

  let location = useLocation();
  let hash = location.hash;

  useEffect(() => {
    if (coreWorker.current) {
      coreWorker.current.onmessage = function (e) {
        // console.log('message from core', e.data)
        if (e.data.messageType === "updateRenderers") {
          if (
            e.data.init &&
            coreInfo.current &&
            !errorInitializingRenderers.current &&
            !errorInsideRenderers.current
          ) {
            // we don't initialize renderer state values if already have a coreInfo
            // and no errors were encountered
            // as we must have already gotten the renderer information before core was created
          } else {
            updateRenderers(e.data.args);
            if (errorInsideRenderers.current) {
              setIgnoreRendererError(true);
              props.setIsInErrorState?.(false);
            }
          }
        } else if (e.data.messageType === "requestAnimationFrame") {
          requestAnimationFrame(e.data.args);
        } else if (e.data.messageType === "cancelAnimationFrame") {
          cancelAnimationFrame(e.data.args);
        } else if (e.data.messageType === "coreCreated") {
          coreCreated.current = true;
          coreCreationInProgress.current = false;
          preventMoreAnimations.current = false;
          for (let actionArgs of actionsBeforeCoreCreated.current) {
            // Note: we protect against the possibility that core is terminated before posting message
            coreWorker.current?.postMessage({
              messageType: "requestAction",
              args: actionArgs,
            });
          }
          setStage("coreCreated");
          props.coreCreatedCallback?.(coreWorker.current);
        } else if (e.data.messageType === "initializeRenderers") {
          if (
            coreInfo.current &&
            JSON.stringify(coreInfo.current) ===
              JSON.stringify(e.data.args.coreInfo) &&
            !errorInitializingRenderers.current &&
            !errorInsideRenderers.current
          ) {
            // we already initialized renderers before core was created and no errors were encountered
            // so don't initialize them again when core sends the initializeRenderers message
          } else {
            initializeRenderers(e.data.args);
            if (errorInsideRenderers.current) {
              setIgnoreRendererError(true);
              props.setIsInErrorState?.(false);
            }
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
        } else if (e.data.messageType === "componentRangePieces") {
          window["componentRangePieces" + pageNumber] =
            e.data.args.componentRangePieces;
        } else if (e.data.messageType === "inErrorState") {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true);
          }
          setErrMsg(e.data.args.errMsg);
        } else if (e.data.messageType === "resetPage") {
          resetPage(e.data.args);
        } else if (e.data.messageType === "copyToClipboard") {
          copyToClipboard(e.data.args);
        } else if (e.data.messageType === "navigateToTarget") {
          navigateToTarget(e.data.args);
        } else if (e.data.messageType === "navigateToHash") {
          navigate(e.data.args.hash);
        } else if (e.data.messageType === "terminated") {
          terminateCoreAndAnimations();
        }
      };
    }
  }, [coreWorker.current]);

  useEffect(() => {
    return () => {
      if (coreWorker.current) {
        coreWorker.current.postMessage({
          messageType: "terminate",
        });
      }
    };
  }, []);

  useEffect(() => {
    if (pageNumber !== null) {
      window["returnAllStateVariables" + pageNumber] = function () {
        coreWorker.current.postMessage({
          messageType: "returnAllStateVariables",
        });

        return new Promise((resolve, reject) => {
          resolveAllStateVariables.current = resolve;
        });
      };

      window["callAction" + pageNumber] = async function ({
        actionName,
        componentName,
        args,
      }) {
        return await callAction({
          action: { actionName, componentName },
          args,
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
            visible: document.visibilityState === "visible",
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    if (hash && coreCreated.current && coreWorker.current) {
      let anchor = hash.slice(1);
      if (anchor.substring(0, prefixForIds.length) === prefixForIds) {
        coreWorker.current.postMessage({
          messageType: "navigatingToComponent",
          args: {
            componentName: anchor
              .substring(prefixForIds.length)
              .replaceAll("\\/", "/"),
            hash,
          },
        });
      }
    }
  }, [location, hash, coreCreated.current, coreWorker.current]);

  useEffect(() => {
    if (hash && documentRenderer && props.pageIsActive) {
      let anchor = hash.slice(1);
      if (
        (!previousLocationKeys.current.includes(location.key) ||
          location.key === "default") &&
        anchor.length > prefixForIds.length &&
        anchor.substring(0, prefixForIds.length) === prefixForIds
      ) {
        document.getElementById(anchor)?.scrollIntoView();
      }
      previousLocationKeys.current.push(location.key);
    }
  }, [location, hash, documentRenderer, props.pageIsActive]);

  useEffect(() => {
    callAction({
      action: { actionName: "setTheme" },
      args: { theme: darkMode, doNotIgnore: true },
    });
  }, [darkMode]);

  function terminateCoreAndAnimations() {
    preventMoreAnimations.current = true;
    coreWorker.current.terminate();
    coreWorker.current = null;
    coreCreated.current = false;
    coreCreationInProgress.current = false;
    for (let id in animationInfo.current) {
      cancelAnimationFrame(id);
    }
    animationInfo.current = {};
    actionsBeforeCoreCreated.current = [];
  }

  async function callAction({
    action,
    args,
    baseVariableValue,
    componentName,
    rendererType,
    promiseResolve,
  }) {
    // Note: the reason we check both the renderer class and .type
    // is that if the renderer was memoized, then the renderer class itself is on .type,
    // Otherwise, the renderer class is the value of the rendererClasses entry.
    let ignoreActionsWithoutCore =
      rendererClasses.current[rendererType]?.ignoreActionsWithoutCore ||
      rendererClasses.current[rendererType]?.type?.ignoreActionsWithoutCore;
    if (
      !coreCreated.current &&
      (ignoreActionsWithoutCore?.(action.actionName) ||
        !coreCreationInProgress.current) &&
      !args?.doNotIgnore
    ) {
      // The action is being skipped because core has not been created
      // and either the action must be ignored without core or core isn't actually
      // in the process of being created (relevant case is that core has been terminated).
      // Also, don't ignore if the doNotIgnore argument has been set
      // (used for actions called directly from PageViewer for initialization)

      if (promiseResolve) {
        // if were given promiseResolve, then action was called from resolveAction
        // where the return value is being ignored.
        // Resolve promise as false as action will be skipped
        promiseResolve(false);
        return;
      } else {
        // Action was called normally where it is expecting a promise to be returned.
        // A promise resolved as false indicates action was skipped.
        return Promise.resolve(false);
      }
    }

    if (actionTentativelySkipped.current) {
      // we are for sure skipping the actionTentativelySkipped,
      // so resolve its promise as false
      actionTentativelySkipped.current.promiseResolve(false);
      actionTentativelySkipped.current = null;
    }

    if (args?.skippable) {
      let nActionsInProgress = Object.keys(
        resolveActionPromises.current,
      ).length;

      if (nActionsInProgress > 0) {
        // Since another action is currently in progress,
        // we will (at least initially) skip this skippable action.
        // If the currently running action is resolved while this action
        // is still the last skipped action, then this action might be executed.

        // If promiseResolve is undefined, then it's the original call of thise action.
        // Create a promise that will be returned.
        // It will be resolved with false when this action is definitely skipped,
        // or it will be resolved with true if this action ends up being executed.
        let newPromise;
        if (!promiseResolve) {
          newPromise = new Promise((resolve, reject) => {
            promiseResolve = resolve;
          });
        }

        actionTentativelySkipped.current = {
          action,
          args,
          baseVariableValue,
          componentName,
          rendererType,
          promiseResolve,
        };

        if (newPromise) {
          return newPromise;
        } else {
          // if we don't have a newPromise, that means that we were given a promiseResolve
          // as an argument to callAction,
          // which happens when we are being called from within resolveAction
          // and the return value is ignored
          return;
        }
      }
    }

    let actionId = nanoid();
    args = { ...args };
    args.actionId = actionId;

    if (baseVariableValue !== undefined && componentName) {
      // Update the bookkeping variables for the optimistic UI that will tell the renderer
      // whether or not to ignore the information core sends when it finishes the action
      updateRendererUpdatesToIgnore({
        coreId: coreId.current,
        componentName,
        baseVariableValue,
        actionId,
      });
    }

    let actionArgs = {
      actionName: action.actionName,
      componentName: action.componentName,
      args,
    };

    if (coreCreated.current) {
      // Note: it is possible that core has been terminated, so we need the question mark
      coreWorker.current?.postMessage({
        messageType: "requestAction",
        args: actionArgs,
      });
    } else {
      // If core has not yet been created,
      // queue the action to be sent once core is created
      actionsBeforeCoreCreated.current.push(actionArgs);
    }

    if (promiseResolve) {
      // If we were sent promiseResolve as an argument,
      // then the promise for this action has already been returned to the original caller
      // and we are just being called inside resolveAction
      // (where the return is being ignored).
      // Simply set it up so that promiseResolve will be called when the action is resolved
      resolveActionPromises.current[actionId] = promiseResolve;
      return;
    } else {
      return new Promise((resolve, reject) => {
        resolveActionPromises.current[actionId] = resolve;
      });
    }
  }

  function forceRendererState({
    rendererState,
    forceDisable,
    forceShowCorrectness,
    forceShowSolution,
    forceUnsuppressCheckwork,
  }) {
    for (let componentName in rendererState) {
      let stateValues = rendererState[componentName].stateValues;
      if (forceDisable && stateValues.disabled === false) {
        stateValues.disabled = true;
      }
      if (forceShowCorrectness && stateValues.showCorrectness === false) {
        stateValues.showCorrectness = true;
      }
      if (forceUnsuppressCheckwork && stateValues.suppressCheckwork === true) {
        stateValues.suppressCheckwork = false;
      }
      if (
        forceShowSolution &&
        rendererState[componentName].childrenInstructions?.length > 0
      ) {
        // look for a child that has a componentType solution
        for (let childInst of rendererState[componentName]
          .childrenInstructions) {
          if (childInst.componentType === "solution") {
            let solComponentName = childInst.componentName;
            if (rendererState[solComponentName].stateValues.hidden) {
              rendererState[solComponentName].stateValues.hidden = false;
            }
          }
        }
      }
    }
  }

  function initializeRenderers(args) {
    if (args.rendererState) {
      delete args.rendererState.__componentNeedingUpdateValue;
      if (
        props.forceDisable ||
        props.forceShowCorrectness ||
        props.forceShowSolution ||
        props.forceUnsuppressCheckwork
      ) {
        forceRendererState({ rendererState: args.rendererState, ...props });
      }
      for (let componentName in args.rendererState) {
        updateRendererSVsWithRecoil({
          coreId: coreId.current,
          componentName,
          stateValues: args.rendererState[componentName].stateValues,
          childrenInstructions:
            args.rendererState[componentName].childrenInstructions,
        });
      }
    }

    coreInfo.current = args.coreInfo;

    if (props.generatedVariantCallback) {
      props.generatedVariantCallback(
        JSON.parse(
          coreInfo.current.generatedVariantString,
          serializedComponentsReviver,
        ),
        coreInfo.current.allPossibleVariants,
      );
    }

    let renderPromises = [];
    let rendererClassNames = [];
    // console.log('rendererTypesInDocument');
    // console.log(">>>core.rendererTypesInDocument",core.rendererTypesInDocument);
    for (let rendererClassName of coreInfo.current.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      renderPromises.push(import(`./renderers/${rendererClassName}.jsx`));
    }

    let documentComponentInstructions = coreInfo.current.documentToRender;

    renderersloadComponent(renderPromises, rendererClassNames)
      .then((newRendererClasses) => {
        rendererClasses.current = newRendererClasses;
        let documentRendererClass =
          newRendererClasses[documentComponentInstructions.rendererType];

        setDocumentRenderer(
          React.createElement(documentRendererClass, {
            key: coreId.current + documentComponentInstructions.componentName,
            componentInstructions: documentComponentInstructions,
            rendererClasses: newRendererClasses,
            flags: props.flags,
            coreId: coreId.current,
            callAction,
          }),
        );

        props.renderersInitializedCallback?.();
      })
      .catch((e) => {
        errorInitializingRenderers.current = true;
      });
  }

  //offscreen then postpone that one
  function updateRenderers({ updateInstructions, actionId }) {
    for (let instruction of updateInstructions) {
      if (instruction.instructionType === "updateRendererStates") {
        for (let {
          componentName,
          stateValues,
          rendererType,
          childrenInstructions,
        } of instruction.rendererStatesToUpdate) {
          updateRendererSVsWithRecoil({
            coreId: coreId.current,
            componentName,
            stateValues,
            childrenInstructions,
            sourceOfUpdate: instruction.sourceOfUpdate,
            // Note: the reason we check both the renderer class and .type
            // is that if the renderer was memoized, then the renderer class itself is on .type,
            // Otherwise, the renderer class is the value of the rendererClasses entry.
            baseStateVariable:
              rendererClasses.current[rendererType]?.baseStateVariable ||
              rendererClasses.current[rendererType]?.type?.baseStateVariable,
            actionId,
          });
        }
      }
    }

    resolveAction({ actionId });
  }

  function resolveAction({ actionId }) {
    if (actionId) {
      resolveActionPromises.current[actionId]?.(true);
      delete resolveActionPromises.current[actionId];

      if (
        actionTentativelySkipped.current &&
        Object.keys(resolveActionPromises.current).length === 0
      ) {
        let actionToCall = actionTentativelySkipped.current;
        actionTentativelySkipped.current = null;
        callAction(actionToCall);
      }
    }
  }

  function resetPage({ changedOnDevice, newCid, newAttemptNumber }) {
    // console.log('resetPage', changedOnDevice, newCid, newAttemptNumber);

    if (newAttemptNumber !== attemptNumber) {
      toast(
        `Reverted activity as attempt number changed on other device`,
        toastType.ERROR,
      );
      if (props.updateAttemptNumber) {
        props.updateAttemptNumber(newAttemptNumber);
      } else {
        // what do we do in this case?
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true);
        }
        setErrMsg(
          "how to reset attempt number when not given updateAttemptNumber function?",
        );
      }
    } else {
      // TODO: are there cases where will get an infinite loop here?
      toast(
        `Reverted page to state saved on device ${changedOnDevice}`,
        toastType.ERROR,
      );

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
        cidFromText(doenetMLFromProps).then((calcCid) => {
          //Guard against the possiblity that parameters changed while waiting

          if (coreIdWhenCalled === coreId.current) {
            if (calcCid === cidFromProps) {
              setDoenetML(doenetMLFromProps);
              setCid(cidFromProps);
              setStage("continue");
            } else {
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true);
              }
              setErrMsg(
                `doenetML did not match specified cid: ${cidFromProps}`,
              );
            }
          }
        });
      } else {
        // if have doenetML and no cid, then calculate cid
        cidFromText(doenetMLFromProps).then((cid) => {
          //Guard against the possiblity that parameters changed while waiting
          if (coreIdWhenCalled === coreId.current) {
            setDoenetML(doenetMLFromProps);
            setCid(cid);
            setStage("continue");
          }
        });
      }
    } else {
      // if don't have doenetML, then retrieve doenetML from cid

      retrieveTextFileForCid(cidFromProps, "doenet")
        .then((retrievedDoenetML) => {
          //Guard against the possiblity that parameters changed while waiting

          if (coreIdWhenCalled === coreId.current) {
            setDoenetML(retrievedDoenetML);
            setCid(cidFromProps);
            setStage("continue");
          }
        })
        .catch((e) => {
          //Guard against the possiblity that parameters changed while waiting

          if (coreIdWhenCalled === coreId.current) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true);
            }
            setErrMsg(`doenetML not found for cid: ${cidFromProps}`);
          }
        });
    }
  }

  async function loadStateAndInitialize() {
    const coreIdWhenCalled = coreId.current;
    let loadedState = false;

    if (props.flags.allowLocalState) {
      let localInfo;

      try {
        localInfo = await idb_get(
          `${props.doenetId}|${pageNumber}|${attemptNumber}|${cid}`,
        );
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
              });
              return;
            } else if (result.newCid !== cid) {
              // if cid changes for the same attempt number, then something went wrong
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true);
              }
              setErrMsg(`content changed unexpectedly!`);
            }

            // if just the localInfo changed, use that instead
            localInfo = result.newLocalInfo;
            console.log(
              `sending toast: Reverted page to state saved on device ${result.changedOnDevice}`,
            );
            toast(
              `Reverted page to state saved on device ${result.changedOnDevice}`,
              toastType.ERROR,
            );
          }
        }

        if (localInfo.rendererState.__componentNeedingUpdateValue) {
          callAction({
            action: {
              actionName: "updateValue",
              componentName:
                localInfo.rendererState.__componentNeedingUpdateValue,
            },
            args: { doNotIgnore: true },
          });
        }

        initializeRenderers({
          rendererState: localInfo.rendererState,
          coreInfo: localInfo.coreInfo,
        });

        initialCoreData.current = {
          coreState: localInfo.coreState,
          serverSaveId: localInfo.saveId,
          requestedVariant: JSON.parse(
            localInfo.coreInfo.generatedVariantString,
            serializedComponentsReviver,
          ),
        };

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
          autoSubmit: props.flags.autoSubmit,
        },
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
            // ignore this error if didn't allow loading of page state
          }
        }

        if (resp.data.loadedState) {
          let coreInfo = JSON.parse(
            resp.data.coreInfo,
            serializedComponentsReviver,
          );

          let rendererState = JSON.parse(
            resp.data.rendererState,
            serializedComponentsReviver,
          );

          if (rendererState.__componentNeedingUpdateValue) {
            callAction({
              action: {
                actionName: "updateValue",
                componentName: rendererState.__componentNeedingUpdateValue,
              },
            });
          }

          initializeRenderers({
            rendererState,
            coreInfo,
          });

          initialCoreData.current = {
            coreState: JSON.parse(
              resp.data.coreState,
              serializedComponentsReviver,
            ),
            serverSaveId: resp.data.saveId,
            requestedVariant: JSON.parse(
              coreInfo.generatedVariantString,
              serializedComponentsReviver,
            ),
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
          // ignore this error if didn't allow loading of page state
        }
      }
    }

    //Guard against the possiblity that parameters changed while waiting
    if (coreIdWhenCalled === coreId.current) {
      if (props.pageIsActive) {
        startCore();
      } else {
        setStage("readyToCreateCore");
      }
    }
  }

  async function saveLoadedLocalStateToDatabase(localInfo) {
    let serverSaveId = await idb_get(
      `${props.doenetId}|${pageNumber}|${attemptNumber}|${cid}|ServerSaveId`,
    );

    let pageStateToBeSavedToDatabase = {
      cid,
      coreInfo: JSON.stringify(
        localInfo.coreInfo,
        serializedComponentsReplacer,
      ),
      coreState: JSON.stringify(
        localInfo.coreState,
        serializedComponentsReplacer,
      ),
      rendererState: JSON.stringify(
        localInfo.rendererState,
        serializedComponentsReplacer,
      ),
      pageNumber,
      attemptNumber,
      doenetId: props.doenetId,
      saveId: localInfo.saveId,
      serverSaveId,
      updateDataOnContentChange: props.updateDataOnContentChange,
    };

    let resp;

    try {
      resp = await axios.post(
        "/api/savePageState.php",
        pageStateToBeSavedToDatabase,
      );
    } catch (e) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    let data = resp.data;

    if (!data.success) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    await idb_set(
      `${props.doenetId}|${pageNumber}|${attemptNumber}|${cid}|ServerSaveId`,
      data.saveId,
    );

    if (data.stateOverwritten) {
      let newLocalInfo = {
        coreState: JSON.parse(data.coreState, serializedComponentsReviver),
        rendererState: JSON.parse(
          data.rendererState,
          serializedComponentsReviver,
        ),
        coreInfo: JSON.parse(data.coreInfo, serializedComponentsReviver),
        saveId: data.saveId,
      };

      await idb_set(
        `${props.doenetId}|${pageNumber}|${data.attemptNumber}|${data.cid}`,
        newLocalInfo,
      );

      return {
        changedOnDevice: data.device,
        newLocalInfo,
        newCid: data.cid,
        newAttemptNumber: data.attemptNumber,
      };
    }

    return { localInfo, cid, attemptNumber };
  }

  function startCore() {
    //Kill the current core if it exists
    if (coreWorker.current) {
      terminateCoreAndAnimations();
    }

    resolveActionPromises.current = {};

    // console.log(`send message to create core ${pageNumber}`)
    coreWorker.current = new Worker(
      new URL("../Core/CoreWorker.js", import.meta.url),
      { type: "module" },
    );

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
        theme: darkMode,
        requestedVariantIndex,
        pageNumber,
        attemptNumber,
        itemNumber: props.itemNumber,
        updateDataOnContentChange: props.updateDataOnContentChange,
        serverSaveId: initialCoreData.current.serverSaveId,
        activityVariantIndex: props.activityVariantIndex,
        requestedVariant: initialCoreData.current.requestedVariant,
        stateVariableChanges: initialCoreData.current.coreState
          ? initialCoreData.current.coreState
          : undefined,
      },
    });

    setStage("waitingOnCore");
    coreCreationInProgress.current = true;
  }

  function requestAnimationFrame({ action, actionArgs, delay, animationId }) {
    if (!preventMoreAnimations.current) {
      // create new animationId

      if (delay) {
        // set a time out to call actual request animation frame after a delay
        let timeoutId = window.setTimeout(
          () => _requestAnimationFrame({ action, actionArgs, animationId }),
          delay,
        );
        animationInfo.current[animationId] = { timeoutId };
      } else {
        // call actual request animation frame right away
        animationInfo.current[animationId] = {};
        _requestAnimationFrame({ action, actionArgs, animationId });
      }
    }
  }

  function _requestAnimationFrame({ action, actionArgs, animationId }) {
    let animationFrameID = window.requestAnimationFrame(() =>
      callAction({
        action,
        args: actionArgs,
      }),
    );

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

  async function copyToClipboard({ text, actionId }) {
    await navigator.clipboard.writeText(text);

    resolveAction({ actionId });
  }

  async function navigateToTarget({
    cid,
    doenetId,
    variantIndex,
    edit,
    hash,
    page,
    uri,
    targetName,
    actionId,
    componentName,
    effectiveName,
  }) {
    let id = prefixForIds + cesc(effectiveName);
    let { targetForATag, url, haveValidTarget, externalUri } = getURLFromRef({
      cid,
      doenetId,
      variantIndex,
      edit,
      hash,
      page,
      givenUri: uri,
      targetName,
      pageToolView,
      inCourse: Object.keys(itemInCourse).length > 0,
      pathname: location.pathname,
      search: location.search,
      id,
    });

    if (haveValidTarget) {
      if (targetForATag === "_blank") {
        window.open(url, targetForATag);
      } else {
        // TODO: when fix regular ref navigation to scroll back to previous scroll position
        // when click the back button
        // add that ability to this navigation as well

        // let scrollAttribute = scrollableContainer === window ? "scrollY" : "scrollTop";
        // let stateObj = { fromLink: true }
        // Object.defineProperty(stateObj, 'previousScrollPosition', { get: () => scrollableContainer?.[scrollAttribute], enumerable: true });

        navigate(url);
      }
    }

    resolveAction({ actionId });
  }

  function errorHandler() {
    errorInsideRenderers.current = true;

    if (ignoreRendererError) {
      setIgnoreRendererError(false);
    }
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
    propPageNumber = "1";
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
    if (errMsg !== null) {
      setErrMsg(null);
      if (props.setIsInErrorState) {
        props.setIsInErrorState(false);
      }
    }

    if (coreWorker.current) {
      terminateCoreAndAnimations();
    }
    setStage("recalcParams");
    coreId.current = nanoid();
    initialCoreData.current = {};
    setPageContentChanged(true);
    return null;
  }

  if (errMsg !== null) {
    let errorIcon = (
      <span style={{ fontSize: "1em", color: "#C1292E" }}>
        <FontAwesomeIcon icon={faExclamationCircle} />
      </span>
    );
    return (
      <div style={{ fontSize: "1.3em", marginLeft: "20px", marginTop: "20px" }}>
        {errorIcon} {errMsg}
      </div>
    );
  }

  if (stage === "wait") {
    return null;
  }

  if (stage == "recalcParams") {
    setStage("wait");
    calculateCidDoenetML();
    return null;
  }

  if (pageContentChanged) {
    setPageContentChanged(false);

    coreInfo.current = null;
    setDocumentRenderer(null);
    coreCreated.current = false;
    coreCreationInProgress.current = false;

    setStage("wait");

    loadStateAndInitialize();

    return null;
  }

  if (stage === "readyToCreateCore" && props.pageIsActive) {
    startCore();
  } else if (stage === "waitingOnCore" && !props.pageIsActive) {
    // we've moved off this page, but core is still being initialized
    // kill the core worker

    terminateCoreAndAnimations();

    setStage("readyToCreateCore");
  }

  if (props.hideWhenNotCurrent && !props.pageIsCurrent) {
    return null;
  }

  let noCoreWarning = null;
  let pageStyle = {
    maxWidth: "850px",
    paddingLeft: "20px",
    paddingRight: "20px",
  };
  if (!coreCreated.current) {
    if (!documentRenderer) {
      noCoreWarning = (
        <div style={{ backgroundColor: "lightCyan", padding: "10px" }}>
          <p>Initializing....</p>
        </div>
      );
    }
    pageStyle.backgroundColor = "#F0F0F0";
  }

  //Spacing around the whole doenetML document
  return (
    <ErrorBoundary
      setIsInErrorState={props.setIsInErrorState}
      errorHandler={errorHandler}
      ignoreError={ignoreRendererError}
      coreCreated={coreCreated.current}
    >
      {noCoreWarning}
      <div style={pageStyle} className="doenet-viewer">
        {documentRenderer}
      </div>
    </ErrorBoundary>
  );
}

export async function renderersloadComponent(promises, rendererClassNames) {
  var rendererClasses = {};
  for (let [index, promise] of promises.entries()) {
    try {
      let module = await promise;
      rendererClasses[rendererClassNames[index]] = module.default;
    } catch (error) {
      console.log("here:", error);
      throw Error(`loading ${rendererClassNames[index]} failed.`);
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
    this.props.setIsInErrorState?.(true);
    this.props.errorHandler();
  }
  render() {
    if (this.state.hasError && !this.props.ignoreError) {
      if (!this.props.coreCreated) {
        return null;
      } else {
        return <h1>Something went wrong.</h1>;
      }
    }
    return this.props.children;
  }
}

export function getURLFromRef({
  cid,
  doenetId,
  variantIndex,
  edit,
  hash,
  page,
  givenUri,
  targetName = "",
  pageToolView = {},
  inCourse = false,
  pathname = "",
  search = "",
  id = "",
}) {
  let url = "";
  let targetForATag = "_blank";
  let haveValidTarget = false;
  let externalUri = false;

  let portfolioModeURI =
    pathname.substring(0, 10) === "/portfolio" ||
    pathname.substring(0, 13) === "/publiceditor";

  if (cid || doenetId) {
    if (cid) {
      url = `cid=${cid}`;
      portfolioModeURI = false;
    } else {
      if (portfolioModeURI) {
        url = `/${doenetId}`;
      } else {
        url = `doenetId=${doenetId}`;
      }
    }
    if (variantIndex) {
      if (!portfolioModeURI) {
        url += `&variant=${variantIndex}`;
      }
    }

    if (portfolioModeURI) {
      if (edit == true) {
        url = "/publiceditor" + url;
      } else {
        url = "/portfolioviewer" + url;
      }
    } else {
      let usePublic = false;
      if (pageToolView.page === "public") {
        usePublic = true;
      } else if (!inCourse) {
        usePublic = true;
      }
      if (usePublic) {
        if (
          edit === true ||
          (edit === null &&
            pageToolView.page === "public" &&
            pageToolView.tool === "editor")
        ) {
          url = `tool=editor&${url}`;
        }
        url = `/public?${url}`;
      } else if (pageToolView.page === "placementexam") {
        url = `?tool=exam&${url}`;
      } else {
        url = `?tool=assignment&${url}`;
      }
    }

    haveValidTarget = true;

    if (hash) {
      url += hash;
    } else {
      if (page) {
        url += `#page${page}`;
        if (targetName) {
          url += cesc(targetName);
        }
      } else if (targetName) {
        url += "#" + cesc(targetName);
      }
    }
  } else if (givenUri) {
    url = givenUri;
    if (
      url.substring(0, 8) === "https://" ||
      url.substring(0, 7) === "http://" ||
      url.substring(0, 7) === "mailto:"
    ) {
      haveValidTarget = true;
      externalUri = true;
    }
  } else {
    url += search;

    if (page) {
      url += `#page${page}`;
    } else {
      let firstSlash = id.indexOf("\\/");
      let prefix = id.substring(0, firstSlash);
      url += "#" + prefix;
    }
    url += cesc(targetName);
    targetForATag = null;
    haveValidTarget = true;
  }
  return { targetForATag, url, haveValidTarget, externalUri };
}
