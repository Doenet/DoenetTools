import React, {useEffect, useRef, useState} from "../_snowpack/pkg/react.js";
import {retrieveTextFileForCid} from "../core/utils/retrieveTextFile.js";
import PageViewer, {scrollableContainerAtom} from "./PageViewer.js";
import {FontAwesomeIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faExclamationCircle} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import axios from "../_snowpack/pkg/axios.js";
import {get as idb_get, set as idb_set} from "../_snowpack/pkg/idb-keyval.js";
import {cidFromText} from "../core/utils/cid.js";
import {useToast, toastType} from "../_framework/Toast.js";
import {nanoid} from "../_snowpack/pkg/nanoid.js";
import {calculateOrderAndVariants, parseActivityDefinition} from "../_utils/activityUtils.js";
import VisibilitySensor from "../_snowpack/pkg/react-visibility-sensor-v2.js";
import {useLocation, useNavigate} from "../_snowpack/pkg/react-router.js";
import cssesc from "../_snowpack/pkg/cssesc.js";
import {atom, useRecoilCallback, useRecoilState, useSetRecoilState} from "../_snowpack/pkg/recoil.js";
import Button from "../_reactComponents/PanelHeaderComponents/Button.js";
import ActionButton from "../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ButtonGroup from "../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {pageToolViewAtom} from "../_framework/NewToolRoot.js";
export const saveStateToDBTimerIdAtom = atom({
  key: "saveStateToDBTimerIdAtom",
  default: null
});
export const currentPageAtom = atom({
  key: "currentPageAtom",
  default: 0
});
export const activityAttemptNumberSetUpAtom = atom({
  key: "activityAttemptNumberSetUpAtom",
  default: 0
});
export const itemWeightsAtom = atom({
  key: "itemWeightsAtom",
  default: []
});
export default function ActivityViewer(props) {
  const toast = useToast();
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const [errMsg, setErrMsg] = useState(null);
  const [
    {
      cidFromProps,
      activityDefinitionFromProps,
      attemptNumber,
      requestedVariantIndex
    },
    setInfoFromProps
  ] = useState({
    cidFromProps: null,
    activityDefinitionFromProps: null,
    attemptNumber: null,
    requestedVariantIndex: null
  });
  const attemptNumberRef = useRef(null);
  attemptNumberRef.current = attemptNumber;
  const [cid, setCid] = useState(null);
  const cidRef = useRef(null);
  cidRef.current = cid;
  const activityDefinitionDoenetML = useRef(null);
  const [activityDefinition, setActivityDefinition] = useState(null);
  const [variantIndex, setVariantIndex] = useState(null);
  const variantIndexRef = useRef(null);
  variantIndexRef.current = variantIndex;
  const [stage, setStage] = useState("initial");
  const stageRef = useRef(null);
  stageRef.current = stage;
  const settingUp = useRef(true);
  const [activityContentChanged, setActivityContentChanged] = useState(false);
  const [order, setOrder] = useState(null);
  const [flags, setFlags] = useState(props.flags);
  const [currentPage, setCurrentPage] = useState(0);
  const setRecoilCurrentPage = useSetRecoilState(currentPageAtom);
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;
  const setActivityAttemptNumberSetUp = useSetRecoilState(activityAttemptNumberSetUpAtom);
  const [nPages, setNPages] = useState(0);
  const [variantsByPage, setVariantsByPage] = useState(null);
  const [itemWeights, setItemWeights] = useRecoilState(itemWeightsAtom);
  const previousComponentTypeCountsByPage = useRef([]);
  const serverSaveId = useRef(null);
  const activityStateToBeSavedToDatabase = useRef(null);
  const changesToBeSaved = useRef(false);
  const setSaveStateToDBTimerId = useSetRecoilState(saveStateToDBTimerIdAtom);
  const [scrollableContainer, setScrollableContainer] = useRecoilState(scrollableContainerAtom);
  const activityInfo = useRef(null);
  const activityInfoString = useRef(null);
  const pageAtPreviousSave = useRef(null);
  const pageAtPreviousSaveToDatabase = useRef(null);
  const [pageInfo, setPageInfo] = useState({
    pageIsVisible: [],
    pageIsActive: [],
    pageCoreWorker: [],
    waitingForPagesCore: null
  });
  const [renderedPages, setRenderedPages] = useState([]);
  const allPagesRendered = useRef(false);
  const nodeRef = useRef(null);
  const ignoreNextScroll = useRef(false);
  const stillNeedToScrollTo = useRef(null);
  let location = useLocation();
  let hash = location.hash;
  const previousLocations = useRef({});
  const currentLocationKey = useRef(null);
  const viewerWasUnmounted = useRef(false);
  const [finishAssessmentMessageOpen, setFinishAssessmentMessageOpen] = useState(false);
  const [processingSubmitAll, setProcessingSubmitAll] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    return () => {
      saveState({overrideThrottle: true});
      viewerWasUnmounted.current = true;
    };
  }, []);
  useEffect(() => {
    let newFlags = {...props.flags};
    if (props.userId) {
      newFlags.allowLocalState = false;
      newFlags.allowSaveState = false;
    } else if (newFlags.allowSaveState) {
      newFlags.allowLoadState = true;
    }
    setFlags(newFlags);
  }, [props.userId, props.flags]);
  useEffect(() => {
    window.returnActivityData = function() {
      return {
        activityDefinition,
        requestedVariantIndex,
        variantIndex,
        cid,
        order,
        currentPage,
        nPages,
        variantsByPage,
        itemWeights
      };
    };
  }, [
    activityDefinition,
    requestedVariantIndex,
    variantIndex,
    cid,
    order,
    currentPage,
    nPages,
    variantsByPage,
    itemWeights
  ]);
  useEffect(() => {
    if (nodeRef.current) {
      let newScrollableContainer = nodeRef.current.parentNode.id === "mainPanel" ? nodeRef.current.parentNode : window;
      setScrollableContainer(newScrollableContainer);
      if (!props.paginate && nPages > 1) {
        newScrollableContainer.addEventListener("scroll", (event) => {
          if (ignoreNextScroll.current) {
            ignoreNextScroll.current = false;
          } else {
            let topPage;
            for (let ind = 0; ind < nPages - 1; ind++) {
              let thePage = document.getElementById(`page${ind + 1}`);
              if (thePage) {
                let {bottom} = thePage.getBoundingClientRect();
                if (bottom < 50) {
                  topPage = ind + 2;
                } else if (!topPage) {
                  topPage = 1;
                }
              }
            }
            if (topPage && topPage !== currentPageRef.current) {
              setCurrentPage(topPage);
              setRecoilCurrentPage(topPage);
            }
          }
        });
      }
    }
  }, [nodeRef.current, nPages]);
  useEffect(() => {
    props.pageChangedCallback?.(currentPage);
  }, [currentPage]);
  useEffect(() => {
    if (hash && nPages) {
      let match = hash.match(/^#page(\d+)/);
      if (match) {
        let newPage = Math.max(1, Math.min(nPages, match[1]));
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
          setRecoilCurrentPage(newPage);
        }
      }
    }
  }, [hash, nPages]);
  useEffect(() => {
    if (currentPage > 0 && nPages > 1) {
      let hashPage = Number(hash?.match(/^#page(\d+)/)?.[1]);
      if (hashPage !== currentPage) {
        let pageAnchor = `#page${currentPage}`;
        let navigateAttrs = {replace: true};
        if (!props.paginate) {
          navigateAttrs.state = {doNotScroll: true};
        }
        navigate(location.search + pageAnchor, navigateAttrs);
      }
      if (stillNeedToScrollTo.current) {
        document.getElementById(stillNeedToScrollTo.current)?.scrollIntoView();
        stillNeedToScrollTo.current = null;
      }
    }
  }, [currentPage, nPages]);
  useEffect(() => {
    if (allPagesRendered.current && !props.paginate && hash?.match(/^#page(\d+)$/)) {
      ignoreNextScroll.current = true;
      document.getElementById(cssesc(hash.slice(1)))?.scrollIntoView();
    }
  }, [allPagesRendered.current]);
  useEffect(() => {
    let foundNewInPrevious = false;
    if (currentLocationKey.current !== location.key) {
      if (location.state?.previousScrollPosition !== void 0 && currentLocationKey.current) {
        previousLocations.current[currentLocationKey.current].lastScrollPosition = location.state.previousScrollPosition;
      }
      if (previousLocations.current[location.key]) {
        foundNewInPrevious = true;
        if (previousLocations.current[location.key]?.lastScrollPosition !== void 0) {
          scrollableContainer.scroll({top: previousLocations.current[location.key].lastScrollPosition});
        }
      }
      previousLocations.current[location.key] = {...location};
      currentLocationKey.current = location.key;
    }
    stillNeedToScrollTo.current = null;
    if (!location.state?.doNotScroll && (location.key === "default" || !foundNewInPrevious)) {
      let scrollTo = cssesc(hash.slice(1));
      if (props.paginate && hash.match(/^#page(\d+)$/)) {
        scrollTo = "activityTop";
      }
      if (props.paginate && Number(hash.match(/^#page(\d+)/)?.[1]) !== currentPage) {
        stillNeedToScrollTo.current = scrollTo;
      } else {
        document.getElementById(scrollTo)?.scrollIntoView();
      }
    }
  }, [location]);
  const getValueOfTimeoutWithoutARefresh = useRecoilCallback(({snapshot}) => async () => {
    return await snapshot.getPromise(saveStateToDBTimerIdAtom);
  }, [saveStateToDBTimerIdAtom]);
  function resetActivity({changedOnDevice, newCid, newAttemptNumber}) {
    console.log("resetActivity", changedOnDevice, newCid, newAttemptNumber);
    if (newAttemptNumber !== attemptNumber) {
      if (props.updateAttemptNumber) {
        toast(`Reverted activity as attempt number changed on other device`, toastType.ERROR);
        props.updateAttemptNumber(newAttemptNumber);
      } else {
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true);
        }
        setErrMsg("how to reset attempt number when not given updateAttemptNumber function?");
      }
    } else if (newCid !== cid) {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true);
      }
      setErrMsg("Content changed unexpectedly!");
    } else {
    }
  }
  function calculateCidDefinition() {
    if (activityDefinitionFromProps) {
      if (cidFromProps) {
        cidFromText(JSON.stringify(activityDefinitionFromProps)).then((calcCid) => {
          if (calcCid === cidFromProps) {
            setCid(cidFromProps);
            activityDefinitionDoenetML.current = activityDefinitionFromProps;
            let result = parseActivityDefinition(activityDefinitionFromProps);
            if (result.success) {
              setActivityDefinition(result.activityJSON);
              setStage("continue");
            } else {
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true);
              }
              setErrMsg(result.message);
            }
          } else {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true);
            }
            setErrMsg(`activity definition did not match specified cid: ${cidFromProps}`);
          }
        });
      } else {
        cidFromText(JSON.stringify(activityDefinitionFromProps)).then((cid2) => {
          setCid(cid2);
          activityDefinitionDoenetML.current = activityDefinitionFromProps;
          let result = parseActivityDefinition(activityDefinitionFromProps);
          if (result.success) {
            setActivityDefinition(result.activityJSON);
            setStage("continue");
          } else {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true);
            }
            setErrMsg(result.message);
          }
        });
      }
    } else {
      retrieveTextFileForCid(cidFromProps, "doenet").then((retrievedActivityDefinition) => {
        setCid(cidFromProps);
        activityDefinitionDoenetML.current = retrievedActivityDefinition;
        let result = parseActivityDefinition(retrievedActivityDefinition);
        if (result.success) {
          setActivityDefinition(result.activityJSON);
          setStage("continue");
        } else {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true);
          }
          setErrMsg(result.message);
        }
      }).catch((e) => {
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true);
        }
        setErrMsg(`activity definition not found for cid: ${cidFromProps}`);
      });
    }
  }
  async function loadState() {
    let loadedState = false;
    let newItemWeights;
    let newVariantIndex;
    let loadedFromInitialState = false;
    if (props.flags.allowLocalState) {
      let localInfo;
      try {
        localInfo = await idb_get(`${props.doenetId}|${attemptNumber}|${cid}`);
      } catch (e) {
      }
      if (localInfo) {
        if (props.flags.allowSaveState) {
          let result = await saveLoadedLocalStateToDatabase(localInfo);
          if (result.changedOnDevice) {
            if (Number(result.newAttemptNumber) !== attemptNumber) {
              resetActivity({
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
          }
        }
        serverSaveId.current = localInfo.saveId;
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(localInfo.activityState.currentPage);
          setRecoilCurrentPage(localInfo.activityState.currentPage);
        }
        let newActivityInfo = localInfo.activityInfo;
        newVariantIndex = localInfo.variantIndex;
        setVariantIndex(newVariantIndex);
        setNPages(newActivityInfo.orderWithCids.length);
        setOrder(newActivityInfo.orderWithCids);
        setVariantsByPage(newActivityInfo.variantsByPage);
        setItemWeights(newActivityInfo.itemWeights);
        newItemWeights = newActivityInfo.itemWeights;
        previousComponentTypeCountsByPage.current = newActivityInfo.previousComponentTypeCounts || [];
        activityInfo.current = newActivityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);
        loadedState = true;
      }
    }
    if (!loadedState) {
      const payload = {
        params: {
          cid,
          attemptNumber,
          doenetId: props.doenetId,
          userId: props.userId,
          allowLoadState: props.flags.allowLoadState
        }
      };
      let resp;
      try {
        resp = await axios.get("/api/loadActivityState.php", payload);
        if (!resp.data.success) {
          if (props.flags.allowLoadState) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true);
            }
            setErrMsg(`Error loading activity state: ${resp.data.message}`);
            return;
          } else {
          }
        }
      } catch (e) {
        if (props.flags.allowLoadState) {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true);
          }
          setErrMsg(`Error loading activity state: ${e.message}`);
          return;
        } else {
        }
      }
      if (resp.data.loadedState) {
        let newActivityInfo = JSON.parse(resp.data.activityInfo);
        let activityState = JSON.parse(resp.data.activityState);
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(activityState.currentPage);
          setRecoilCurrentPage(activityState.currentPage);
        }
        newVariantIndex = resp.data.variantIndex;
        setVariantIndex(newVariantIndex);
        setNPages(newActivityInfo.orderWithCids.length);
        setOrder(newActivityInfo.orderWithCids);
        setVariantsByPage(newActivityInfo.variantsByPage);
        setItemWeights(newActivityInfo.itemWeights);
        newItemWeights = newActivityInfo.itemWeights;
        previousComponentTypeCountsByPage.current = newActivityInfo.previousComponentTypeCounts || [];
        activityInfo.current = newActivityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);
      } else {
        loadedFromInitialState = true;
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(1);
          setRecoilCurrentPage(1);
        }
        let results;
        results = await calculateOrderAndVariants({activityDefinition, requestedVariantIndex});
        if (!results.success) {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true);
          }
          setErrMsg(`Error initializing activity state: ${results.message}`);
          return;
        }
        newVariantIndex = results.variantIndex;
        setVariantIndex(newVariantIndex);
        setNPages(results.order.length);
        setOrder(results.order);
        setVariantsByPage(results.variantsByPage);
        setItemWeights(results.itemWeights);
        newItemWeights = results.itemWeights;
        previousComponentTypeCountsByPage.current = results.previousComponentTypeCounts || [];
        activityInfo.current = results.activityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);
      }
    }
    return {newItemWeights, newVariantIndex, loadedFromInitialState};
  }
  async function saveLoadedLocalStateToDatabase(localInfo) {
    let serverSaveId2 = await idb_get(`${props.doenetId}|${attemptNumber}|${cid}|ServerSaveId`);
    let activityStateToBeSavedToDatabase2 = {
      cid,
      activityInfo: JSON.stringify(localInfo.activityInfo),
      activityState: JSON.stringify(localInfo.activityState),
      variantIndex: localInfo.variantIndex,
      attemptNumber,
      doenetId: props.doenetId,
      saveId: localInfo.saveId,
      serverSaveId: serverSaveId2,
      updateDataOnContentChange: props.updateDataOnContentChange
    };
    let resp;
    try {
      console.log("first one saveActivityState activityStateToBeSavedToDatabase", activityStateToBeSavedToDatabase2);
      resp = await axios.post("/api/saveActivityState.php", activityStateToBeSavedToDatabase2);
    } catch (e) {
      return {localInfo, cid, attemptNumber};
    }
    if (resp.data.cidChanged === true) {
      props.cidChangedCallback();
    }
    let data = resp.data;
    if (!data.success) {
      return {localInfo, cid, attemptNumber};
    }
    await idb_set(`${props.doenetId}|${attemptNumber}|${cid}|ServerSaveId`, data.saveId);
    if (data.stateOverwritten) {
      let newLocalInfo = {
        activityState: JSON.parse(data.activityState),
        activityInfo: JSON.parse(data.activityInfo),
        saveId: data.saveId,
        variantIndex: data.variantIndex
      };
      await idb_set(`${props.doenetId}|${data.attemptNumber}|${data.cid}`, newLocalInfo);
      return {
        changedOnDevice: data.device,
        newLocalInfo,
        newCid: data.cid,
        newAttemptNumber: data.attemptNumber
      };
    }
    return {localInfo, cid, attemptNumber};
  }
  async function saveState({overrideThrottle = false, overrideStage = false} = {}) {
    if (!props.flags.allowSaveState && !props.flags.allowLocalState) {
      return;
    }
    if (stageRef.current !== "saving" && !overrideStage || !overrideThrottle && currentPageRef.current === pageAtPreviousSave.current || overrideThrottle && currentPageRef.current === pageAtPreviousSaveToDatabase.current) {
      return;
    }
    pageAtPreviousSave.current = currentPageRef.current;
    let saveId = nanoid();
    if (props.flags.allowLocalState) {
      await idb_set(`${props.doenetId}|${attemptNumberRef.current}|${cidRef.current}`, {
        activityInfo: activityInfo.current,
        activityState: {currentPage: currentPageRef.current},
        saveId,
        variantIndex: variantIndexRef.current
      });
    }
    if (!props.flags.allowSaveState) {
      return;
    }
    activityStateToBeSavedToDatabase.current = {
      cid: cidRef.current,
      activityInfo: activityInfoString.current,
      activityState: JSON.stringify({currentPage: currentPageRef.current}),
      variantIndex: variantIndexRef.current,
      attemptNumber: attemptNumberRef.current,
      doenetId: props.doenetId,
      saveId,
      serverSaveId: serverSaveId.current,
      updateDataOnContentChange: props.updateDataOnContentChange
    };
    changesToBeSaved.current = true;
    await saveChangesToDatabase(overrideThrottle);
  }
  async function saveChangesToDatabase(overrideThrottle) {
    if (!changesToBeSaved.current) {
      return;
    }
    let oldTimeoutId = await getValueOfTimeoutWithoutARefresh();
    if (oldTimeoutId !== null) {
      if (overrideThrottle) {
        clearTimeout(oldTimeoutId);
      } else {
        return;
      }
    }
    changesToBeSaved.current = false;
    pageAtPreviousSaveToDatabase.current = currentPageRef.current;
    let newTimeoutId = setTimeout(() => {
      setSaveStateToDBTimerId(null);
      saveChangesToDatabase();
    }, 6e4);
    setSaveStateToDBTimerId(newTimeoutId);
    let resp;
    try {
      console.log("activity state params", activityStateToBeSavedToDatabase.current);
      resp = await axios.post("/api/saveActivityState.php", activityStateToBeSavedToDatabase.current);
    } catch (e) {
      console.log(`sending toast: Error synchronizing data.  Changes not saved to the server.`);
      toast("Error synchronizing data.  Changes not saved to the server.", toastType.ERROR);
      return;
    }
    console.log("result from saving activity to database:", resp.data);
    if (resp.status === null) {
      console.log(`sending toast: Error synchronizing data.  Changes not saved to the server.  Are you connected to the internet?`);
      toast("Error synchronizing data.  Changes not saved to the server.  Are you connected to the internet?", toastType.ERROR);
      return;
    }
    let data = resp.data;
    if (!data.success) {
      console.log(`sending toast: ${data.message}`);
      toast(data.message, toastType.ERROR);
      return;
    }
    serverSaveId.current = data.saveId;
    if (props.flags.allowLocalState) {
      await idb_set(`${props.doenetId}|${attemptNumberRef.current}|${cidRef.current}|ServerSaveId`, data.saveId);
    }
    if (data.stateOverwritten) {
      if (attemptNumberRef.current !== Number(data.attemptNumber)) {
        resetActivity({
          changedOnDevice: data.device,
          newCid: data.cid,
          newAttemptNumber: Number(data.attemptNumber)
        });
      } else if (cidRef.current !== data.cid) {
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true);
        }
        setErrMsg("Content changed unexpectedly!");
        return;
      }
    }
  }
  async function initializeUserAssignmentTables(newItemWeights) {
    if (flags.allowSaveSubmissions) {
      try {
        let resp = await axios.post("/api/initAssignmentAttempt.php", {
          doenetId: props.doenetId,
          weights: newItemWeights,
          attemptNumber
        });
        if (resp.status === null) {
          toast(`Could not initialize assignment tables.  Are you connected to the internet?`, toastType.ERROR);
        } else if (!resp.data.success) {
          toast(`Could not initialize assignment tables: ${resp.data.message}.`, toastType.ERROR);
        }
      } catch (e) {
        toast(`Could not initialize assignment tables: ${e.message}.`, toastType.ERROR);
      }
    }
  }
  async function receivedSaveFromPage() {
    if (stage !== "saving" && !settingUp.current) {
      setStage("saving");
    }
    try {
      let resp = await axios.get("/api/checkForChangedAssignment.php", {
        params: {
          currentCid: cid,
          doenetId: props.doenetId
        }
      });
      if (resp.data.cidChanged === true) {
        props.cidChangedCallback();
      }
    } catch (e) {
    }
    if (viewerWasUnmounted.current) {
      await saveState({overrideThrottle: true, overrideStage: true});
    }
  }
  function clickNext() {
    setCurrentPage((was) => Math.min(nPages, was + 1));
    setRecoilCurrentPage((was) => Math.min(nPages, was + 1));
    let event = {
      verb: "interacted",
      object: {objectType: "button", objectname: "next page button"},
      result: {newPage: Math.min(nPages, currentPage + 1)},
      context: {oldPage: currentPage}
    };
    recordEvent(event);
  }
  function clickPrevious() {
    setCurrentPage((was) => Math.max(1, was - 1));
    setRecoilCurrentPage((was) => Math.max(1, was - 1));
    let event = {
      verb: "interacted",
      object: {objectType: "button", objectname: "previous page button"},
      result: {newPage: Math.max(1, currentPage - 1)},
      context: {oldPage: currentPage}
    };
    recordEvent(event);
  }
  function recordEvent(event) {
    if (!flags.allowSaveEvents) {
      return;
    }
    const payload = {
      doenetId: props.doenetId,
      activityCid: cid,
      attemptNumber,
      activityVariantIndex: variantIndex,
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      version: "0.1.1",
      verb: event.verb,
      object: JSON.stringify(event.object),
      result: JSON.stringify(event.result),
      context: JSON.stringify(event.context)
    };
    axios.post("/api/recordEvent.php", payload).then((resp) => {
    }).catch((e) => {
      console.error(`Error saving event: ${e.message}`);
    });
  }
  function onChangeVisibility(isVisible, pageInd) {
    if (!props.paginate) {
      setPageInfo((was) => {
        let newObj = {...was};
        let newVisible = [...newObj.pageIsVisible];
        newVisible[pageInd] = isVisible;
        newObj.pageIsVisible = newVisible;
        if (!isVisible && newObj.pageIsActive[pageInd]) {
          let newActive = [...newObj.pageIsActive];
          newActive[pageInd] = false;
          newObj.pageIsActive = newActive;
          if (newObj.waitingForPagesCore === pageInd) {
            newObj.waitingForPagesCore = null;
          }
        }
        return newObj;
      });
    }
  }
  function coreCreatedCallback(pageInd, coreWorker) {
    setPageInfo((was) => {
      let newObj = {...was};
      if (newObj.waitingForPagesCore === pageInd) {
        newObj.waitingForPagesCore = null;
      }
      let newPageCoreWorker = [...newObj.pageCoreWorker];
      newPageCoreWorker[pageInd] = coreWorker;
      newObj.pageCoreWorker = newPageCoreWorker;
      return newObj;
    });
  }
  function pageRenderedCallback(pageInd) {
    let newRenderedPages;
    setRenderedPages((was) => {
      newRenderedPages = [...was];
      newRenderedPages[pageInd] = true;
      return newRenderedPages;
    });
    if (newRenderedPages?.length === nPages && newRenderedPages.every((x) => x)) {
      allPagesRendered.current = true;
    }
  }
  async function submitAllAndFinishAssessment() {
    setProcessingSubmitAll(true);
    let terminatePromises = [];
    for (let coreWorker of pageInfo.pageCoreWorker) {
      if (coreWorker) {
        let actionId = nanoid();
        let resolveTerminatePromise;
        terminatePromises.push(new Promise((resolve, reject) => {
          resolveTerminatePromise = resolve;
        }));
        coreWorker.onmessage = function(e) {
          if (e.data.messageType === "resolveAction" && e.data.args.actionId === actionId) {
            coreWorker.postMessage({
              messageType: "terminate"
            });
          } else if (e.data.messageType === "terminated") {
            resolveTerminatePromise();
          }
        };
        coreWorker.postMessage({
          messageType: "submitAllAnswers",
          args: {actionId}
        });
      }
    }
    await Promise.all(terminatePromises);
    await saveState({overrideThrottle: true});
    if (!activityInfo.canViewAfterCompleted) {
      console.log("CLEAR state from viewer and cache");
    }
    let resp = await axios.get("/api/saveCompleted.php", {
      params: {doenetId: props.doenetId, isCompleted: true}
    });
    if (resp.data.success) {
      props?.setActivityAsCompleted();
      setPageToolView((prev) => {
        return {
          page: prev.page,
          tool: "endExam",
          view: "",
          params: {
            doenetId: props.doenetId,
            attemptNumber,
            itemWeights: itemWeights.join(",")
          }
        };
      });
    }
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
  if (pageInfo.waitingForPagesCore === null) {
    if (currentPage) {
      for (let pageInd of [currentPage - 1, ...Array(nPages).keys()]) {
        let isVisible = pageInfo.pageIsVisible[pageInd];
        if ((isVisible || currentPage === pageInd + 1) && !pageInfo.pageIsActive[pageInd]) {
          let waitingAgain = !pageInfo.pageCoreWorker[pageInd];
          setPageInfo((was) => {
            let newObj = {...was};
            let newActive = [...newObj.pageIsActive];
            newActive[pageInd] = true;
            newObj.pageIsActive = newActive;
            if (!newObj.pageCoreWorker[pageInd]) {
              newObj.waitingForPagesCore = pageInd;
            }
            return newObj;
          });
          if (waitingAgain) {
            break;
          }
        }
      }
    }
  }
  let propAttemptNumber = props.attemptNumber;
  if (propAttemptNumber === void 0) {
    propAttemptNumber = 1;
  }
  let adjustedRequestedVariantIndex = props.requestedVariantIndex;
  if (adjustedRequestedVariantIndex === void 0) {
    adjustedRequestedVariantIndex = propAttemptNumber;
  }
  if (activityDefinitionFromProps !== props.activityDefinition || cidFromProps !== props.cid || propAttemptNumber !== attemptNumber || requestedVariantIndex !== adjustedRequestedVariantIndex) {
    settingUp.current = true;
    setInfoFromProps({
      activityDefinitionFromProps: props.activityDefinition,
      cidFromProps: props.cid,
      attemptNumber: propAttemptNumber,
      requestedVariantIndex: adjustedRequestedVariantIndex
    });
    setStage("recalcParams");
    setActivityContentChanged(true);
    return null;
  }
  if (stage === "wait") {
    return null;
  }
  if (stage === "recalcParams") {
    setStage("wait");
    calculateCidDefinition();
    return null;
  }
  if (activityDefinition?.type?.toLowerCase() !== "activity") {
    if (props.setIsInErrorState) {
      props.setIsInErrorState(true);
    }
    setErrMsg("Invalid activity definition: type is not activity");
    return null;
  }
  if (activityContentChanged) {
    setActivityContentChanged(false);
    setActivityAttemptNumberSetUp(0);
    previousComponentTypeCountsByPage.current = [];
    setStage("wait");
    loadState().then(async (results) => {
      if (results) {
        if (results.loadedFromInitialState) {
          await initializeUserAssignmentTables(results.newItemWeights);
        }
        setStage("continue");
        setActivityAttemptNumberSetUp(attemptNumber);
        props.generatedVariantCallback?.(results.newVariantIndex, activityInfo.current.numberOfVariants);
      }
      settingUp.current = false;
    });
    return null;
  }
  saveState();
  let title = /* @__PURE__ */ React.createElement("h1", null, activityDefinition.title);
  let pages = [];
  if (order && variantsByPage) {
    for (let [ind, page] of order.entries()) {
      let thisPageIsActive = false;
      if (props.paginate) {
        if (ind === currentPage - 1) {
          thisPageIsActive = true;
        } else if (pageInfo.pageCoreWorker[currentPage - 1] && ind === currentPage) {
          thisPageIsActive = true;
        } else if (pageInfo.pageCoreWorker[currentPage - 1] && (currentPage === nPages || pageInfo.pageCoreWorker[currentPage]) && ind === currentPage - 2) {
          thisPageIsActive = true;
        }
      } else {
        thisPageIsActive = pageInfo.pageIsActive[ind];
      }
      let prefixForIds = nPages > 1 ? `page${ind + 1}` : "";
      let pageViewer = /* @__PURE__ */ React.createElement(PageViewer, {
        userId: props.userId,
        doenetId: props.doenetId,
        activityCid: cid,
        cid: page.cid,
        doenetML: page.doenetML,
        pageNumber: (ind + 1).toString(),
        previousComponentTypeCounts: previousComponentTypeCountsByPage.current[ind],
        pageIsActive: thisPageIsActive,
        pageIsCurrent: ind === currentPage - 1,
        itemNumber: ind + 1,
        attemptNumber,
        forceDisable: props.forceDisable,
        forceShowCorrectness: props.forceShowCorrectness,
        forceShowSolution: props.forceShowSolution,
        forceUnsuppressCheckwork: props.forceUnsuppressCheckwork,
        flags,
        activityVariantIndex: variantIndex,
        requestedVariantIndex: variantsByPage[ind],
        unbundledCore: props.unbundledCore,
        updateCreditAchievedCallback: props.updateCreditAchievedCallback,
        setIsInErrorState: props.setIsInErrorState,
        updateAttemptNumber: props.updateAttemptNumber,
        saveStateCallback: receivedSaveFromPage,
        updateDataOnContentChange: props.updateDataOnContentChange,
        coreCreatedCallback: (coreWorker) => coreCreatedCallback(ind, coreWorker),
        renderersInitializedCallback: () => pageRenderedCallback(ind),
        hideWhenNotCurrent: props.paginate,
        prefixForIds
      });
      if (!props.paginate) {
        pageViewer = /* @__PURE__ */ React.createElement(VisibilitySensor, {
          partialVisibility: true,
          offset: {top: -200, bottom: -200},
          requireContentsSize: false,
          onChange: (isVisible) => onChangeVisibility(isVisible, ind)
        }, /* @__PURE__ */ React.createElement("div", null, pageViewer));
      }
      pages.push(/* @__PURE__ */ React.createElement("div", {
        key: `page${ind + 1}`,
        id: `page${ind + 1}`
      }, pageViewer));
    }
  }
  let pageControlsTop = null;
  let pageControlsBottom = null;
  if (props.paginate && nPages > 1) {
    pageControlsTop = /* @__PURE__ */ React.createElement("div", {
      style: {display: "flex", alignItems: "center", marginLeft: "5px"}
    }, /* @__PURE__ */ React.createElement(Button, {
      "data-test": "previous",
      disabled: currentPage === 1,
      onClick: clickPrevious,
      value: "Previous page"
    }), /* @__PURE__ */ React.createElement("p", {
      style: {margin: "5px"}
    }, " Page ", currentPage, " of ", nPages, " "), /* @__PURE__ */ React.createElement(Button, {
      "data-test": "next",
      disabled: currentPage === nPages,
      onClick: clickNext,
      value: "Next page"
    }));
    if (renderedPages[currentPage - 1]) {
      pageControlsBottom = /* @__PURE__ */ React.createElement("div", {
        style: {display: "flex", alignItems: "center", marginLeft: "5px"}
      }, /* @__PURE__ */ React.createElement(Button, {
        "data-test": "previous-bottom",
        disabled: currentPage === 1,
        onClick: clickPrevious,
        value: "Previous page"
      }), /* @__PURE__ */ React.createElement("p", {
        style: {margin: "5px"}
      }, " Page ", currentPage, " of ", nPages, " "), /* @__PURE__ */ React.createElement(Button, {
        "data-test": "next-bottom",
        disabled: currentPage === nPages,
        onClick: clickNext,
        value: "Next page"
      }));
    }
  }
  let finishAssessmentPrompt = null;
  if (props.showFinishButton) {
    if (finishAssessmentMessageOpen) {
      finishAssessmentPrompt = /* @__PURE__ */ React.createElement("div", {
        style: {border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)", padding: "5px", margin: "5px", display: "flex", flexFlow: "column wrap"}
      }, /* @__PURE__ */ React.createElement("div", {
        style: {display: "flex", justifyContent: "center", padding: "5px"}
      }, "Are you sure you want to finish this assessment?"), /* @__PURE__ */ React.createElement("div", {
        style: {display: "flex", justifyContent: "center", padding: "5px"}
      }, /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
        onClick: submitAllAndFinishAssessment,
        "data-test": "ConfirmFinishAssessment",
        value: "Yes",
        disabled: processingSubmitAll
      }), /* @__PURE__ */ React.createElement(Button, {
        onClick: () => setFinishAssessmentMessageOpen(false),
        "data-test": "CancelFinishAssessment",
        value: "No",
        alert: true,
        disabled: processingSubmitAll
      }))));
    } else {
      finishAssessmentPrompt = /* @__PURE__ */ React.createElement("div", {
        style: {marginLeft: "1px", marginRight: "5px", marginBottom: "5px", marginTop: "5px"}
      }, /* @__PURE__ */ React.createElement(ActionButton, {
        onClick: () => setFinishAssessmentMessageOpen(true),
        "data-test": "FinishAssessmentPrompt",
        value: "Finish assessment"
      }));
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {paddingBottom: "50vh"},
    id: "activityTop",
    ref: nodeRef
  }, pageControlsTop, title, pages, pageControlsBottom, finishAssessmentPrompt);
}
