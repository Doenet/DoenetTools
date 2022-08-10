import React, {useEffect, useRef, useState} from "../_snowpack/pkg/react.js";
import {retrieveTextFileForCid} from "../core/utils/retrieveTextFile.js";
import PageViewer from "./PageViewer.js";
import {FontAwesomeIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faExclamationCircle} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {prng_alea} from "../_snowpack/pkg/esm-seedrandom.js";
import {returnAllPossibleVariants} from "../core/utils/returnAllPossibleVariants.js";
import axios from "../_snowpack/pkg/axios.js";
import {get as idb_get, set as idb_set} from "../_snowpack/pkg/idb-keyval.js";
import {cidFromText} from "../core/utils/cid.js";
import {useToast, toastType} from "../_framework/Toast.js";
import {nanoid} from "../_snowpack/pkg/nanoid.js";
import {enumerateCombinations} from "../core/utils/enumeration.js";
import {determineNumberOfActivityVariants, parseActivityDefinition} from "../_utils/activityUtils.js";
let rngClass = prng_alea;
export default function ActivityViewer(props) {
  const toast = useToast();
  const [errMsg, setErrMsg] = useState(null);
  const [cidFromProps, setCidFromProps] = useState(null);
  const [activityDefinitionFromProps, setActivityDefinitionFromProps] = useState(null);
  const [cid, setCid] = useState(null);
  const activityDefinitionDoenetML = useRef(null);
  const [activityDefinition, setActivityDefinition] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(null);
  const [requestedVariantIndex, setRequestedVariantIndex] = useState(null);
  const [variantIndex, setVariantIndex] = useState(null);
  const [stage, setStage] = useState("initial");
  const [activityContentChanged, setActivityContentChanged] = useState(false);
  const [order, setOrder] = useState(null);
  const [flags, setFlags] = useState(props.flags);
  const [currentPage, setCurrentPage] = useState(1);
  const [nPages, setNPages] = useState(1);
  const [variantsByPage, setVariantsByPage] = useState(null);
  const [itemWeights, setItemWeights] = useState(null);
  const [cidChanged, setCidChanged] = useState(props.cidChanged);
  const serverSaveId = useRef(null);
  const activityStateToBeSavedToDatabase = useRef(null);
  const changesToBeSaved = useRef(false);
  const saveStateToDBTimerId = useRef(null);
  const activityInfo = useRef(null);
  const activityInfoString = useRef(null);
  const pageAtPreviousSave = useRef(null);
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
  });
  useEffect(() => {
    props.pageChangedCallback?.(currentPage);
  }, [currentPage]);
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
    let newCurrentPage;
    let newVariantIndex;
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
        newCurrentPage = localInfo.activityState.currentPage;
        setCurrentPage(newCurrentPage);
        let newActivityInfo = localInfo.activityInfo;
        newVariantIndex = localInfo.variantIndex;
        setVariantIndex(newVariantIndex);
        setNPages(newActivityInfo.orderWithCids.length);
        setOrder(newActivityInfo.orderWithCids);
        setVariantsByPage(newActivityInfo.variantsByPage);
        setItemWeights(newActivityInfo.itemWeights);
        newItemWeights = newActivityInfo.itemWeights;
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
        newCurrentPage = activityState.currentPage;
        setCurrentPage(newCurrentPage);
        newVariantIndex = resp.data.variantIndex;
        setVariantIndex(variantIndex);
        setNPages(newActivityInfo.orderWithCids.length);
        setOrder(newActivityInfo.orderWithCids);
        setVariantsByPage(newActivityInfo.variantsByPage);
        setItemWeights(newActivityInfo.itemWeights);
        newItemWeights = newActivityInfo.itemWeights;
        activityInfo.current = newActivityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);
      } else {
        newCurrentPage = 1;
        setCurrentPage(1);
        let results;
        results = await calculateOrderAndVariants();
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
        activityInfo.current = results.activityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);
      }
    }
    return {newItemWeights, newVariantIndex};
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
    setCidChanged(resp.data.cidChanged === true);
    let data = resp.data;
    if (!data.success) {
      return {localInfo, cid, attemptNumber};
    }
    idb_set(`${props.doenetId}|${attemptNumber}|${cid}|ServerSaveId`, data.saveId);
    if (data.stateOverwritten) {
      let newLocalInfo = {
        activityState: JSON.parse(data.activityState),
        activityInfo: JSON.parse(data.activityInfo),
        saveId: data.saveId,
        variantIndex: data.variantIndex
      };
      idb_set(`${props.doenetId}|${data.attemptNumber}|${data.cid}`, newLocalInfo);
      return {
        changedOnDevice: data.device,
        newLocalInfo,
        newCid: data.cid,
        newAttemptNumber: data.attemptNumber
      };
    }
    return {localInfo, cid, attemptNumber};
  }
  async function calculateOrderAndVariants() {
    let activityVariantResult = await determineNumberOfActivityVariants(activityDefinition);
    let variantIndex2 = (requestedVariantIndex - 1) % activityVariantResult.numberOfVariants + 1;
    if (variantIndex2 < 1) {
      variantIndex2 += activityVariantResult.numberOfVariants;
    }
    let rng = new rngClass(variantIndex2.toString());
    let orderResult = determineOrder(activityDefinition.order, rng);
    if (!orderResult.success) {
      return orderResult;
    }
    let originalOrder = orderResult.pages;
    let itemWeights2 = activityDefinition.itemWeights || [];
    if (!Array.isArray(itemWeights2) || !itemWeights2.every((x) => x >= 0)) {
      return {success: false, message: "Invalid itemWeights"};
    }
    let nPages2 = originalOrder.length;
    itemWeights2 = itemWeights2.slice(0, nPages2);
    if (itemWeights2.length < nPages2) {
      itemWeights2.push(...Array(nPages2 - itemWeights2.length).fill(1));
    }
    let totalWeight = itemWeights2.reduce((a, c) => a + c);
    if (totalWeight > 0) {
      itemWeights2 = itemWeights2.map((x) => x / totalWeight);
    }
    let pageVariantsResult;
    if (activityVariantResult.pageVariants) {
      pageVariantsResult = [activityVariantResult.pageVariants];
    } else {
      let promises = [];
      for (let page of originalOrder) {
        promises.push(returnAllPossibleVariants({
          cid: page.cid,
          doenetML: page.doenetML
        }));
      }
      try {
        pageVariantsResult = await Promise.all(promises);
      } catch (e) {
        return {success: false, message: `Error retrieving content for activity. ${e.message}`};
      }
    }
    let variantForEachPage;
    let allPossibleNonIgnoredPerPage = [], indicesToIgnorePerPage = [];
    let numberOfVariantsPerPage = [];
    for (let pageResult of pageVariantsResult) {
      let allPossibleVariants = [...pageResult.allPossibleVariants];
      let indicesToIgnore = [...pageResult.variantIndicesToIgnore];
      for (let ind of indicesToIgnore) {
        delete allPossibleVariants[ind];
      }
      let numberOfVariants = allPossibleVariants.filter((x) => x !== void 0).length;
      allPossibleNonIgnoredPerPage.push(allPossibleVariants);
      indicesToIgnorePerPage.push(indicesToIgnore);
      numberOfVariantsPerPage.push(numberOfVariants);
    }
    let numberOfPageVariantCombinations = numberOfVariantsPerPage.reduce((a, c) => a * c, 1);
    if (numberOfPageVariantCombinations <= activityVariantResult.numberOfVariants) {
      let pageVariantCombinationIndex = (variantIndex2 - 1) % numberOfPageVariantCombinations + 1;
      variantForEachPage = enumerateCombinations({
        numberOfOptionsByIndex: numberOfVariantsPerPage,
        maxNumber: pageVariantCombinationIndex
      })[pageVariantCombinationIndex - 1].map((x) => x + 1);
    } else {
      variantForEachPage = [...Array(nPages2).keys()].map((i) => Math.floor(rng() * numberOfVariantsPerPage[i]) + 1);
    }
    let variantsByPage2 = [];
    let newOrder = [];
    for (let [ind, possibleVariants] of pageVariantsResult.entries()) {
      let pageVariantIndex = variantForEachPage[ind];
      let indicesToIgnore = indicesToIgnorePerPage[ind];
      for (let i of indicesToIgnore) {
        if (pageVariantIndex >= i) {
          pageVariantIndex++;
        } else {
          break;
        }
      }
      variantsByPage2.push(pageVariantIndex);
      let page = originalOrder[ind];
      if (page.doenetML === void 0) {
        page = {...page};
        page.doenetML = possibleVariants.doenetML;
      } else if (!page.cid) {
        page = {...page};
        page.cid = possibleVariants.cid;
      }
      newOrder.push(page);
    }
    let orderWithCids = [...originalOrder];
    newOrder.forEach((v, i) => orderWithCids[i].cid = v.cid);
    let activityInfo2 = {
      orderWithCids,
      variantsByPage: variantsByPage2,
      itemWeights: itemWeights2,
      numberOfVariants: activityVariantResult.numberOfVariants
    };
    return {
      success: true,
      order: newOrder,
      itemWeights: itemWeights2,
      variantsByPage: variantsByPage2,
      variantIndex: variantIndex2,
      activityInfo: activityInfo2
    };
  }
  async function saveState() {
    if (!props.flags.allowSaveState && !props.flags.allowLocalState) {
      return;
    }
    if (stage !== "saving" || currentPage === pageAtPreviousSave.current) {
      return;
    }
    pageAtPreviousSave.current = currentPage;
    let saveId = nanoid();
    if (props.flags.allowLocalState) {
      idb_set(`${props.doenetId}|${attemptNumber}|${cid}`, {
        activityInfo: activityInfo.current,
        activityState: {currentPage},
        saveId,
        variantIndex
      });
    }
    if (!props.flags.allowSaveState) {
      return;
    }
    activityStateToBeSavedToDatabase.current = {
      cid,
      activityInfo: activityInfoString.current,
      activityState: JSON.stringify({currentPage}),
      variantIndex,
      attemptNumber,
      doenetId: props.doenetId,
      saveId,
      serverSaveId: serverSaveId.current,
      updateDataOnContentChange: props.updateDataOnContentChange
    };
    changesToBeSaved.current = true;
    saveChangesToDatabase();
  }
  async function saveChangesToDatabase() {
    if (saveStateToDBTimerId.current !== null || !changesToBeSaved.current) {
      return;
    }
    changesToBeSaved.current = false;
    saveStateToDBTimerId.current = setTimeout(() => {
      saveStateToDBTimerId.current = null;
      saveChangesToDatabase();
    }, 1e4);
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
      idb_set(`${props.doenetId}|${attemptNumber}|${cid}|ServerSaveId`, data.saveId);
    }
    if (data.stateOverwritten) {
      if (attemptNumber !== Number(data.attemptNumber)) {
        if (props.flags.allowLocalState) {
          idb_set(`${props.doenetId}|${data.attemptNumber}|${data.cid}`, {
            activityState: JSON.parse(data.activityState),
            activityInfo: JSON.parse(data.activityInfo),
            saveId: data.saveId,
            variantIndex: data.variantIndex
          });
          resetActivity({
            changedOnDevice: data.device,
            newCid: data.cid,
            newAttemptNumber: Number(data.attemptNumber)
          });
        }
      } else if (cid !== data.cid) {
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
      let weights = newItemWeights.filter((x) => x);
      try {
        let resp = await axios.post("/api/initAssignmentAttempt.php", {
          doenetId: props.doenetId,
          weights,
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
    setStage("continue");
  }
  async function receivedSaveFromPage() {
    setStage("saving");
    try {
      let resp = await axios.get("/api/checkForChangedAssignment.php", {
        params: {
          currentCid: cid,
          doenetId: props.doenetId
        }
      });
      setCidChanged(resp.data.cidChanged === true);
    } catch (e) {
    }
  }
  function clickNext() {
    setCurrentPage((was) => Math.min(nPages, was + 1));
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
  if (activityDefinitionFromProps !== props.activityDefinition) {
    setActivityDefinitionFromProps(props.activityDefinition);
    changedState = true;
  }
  if (cidFromProps !== props.cid) {
    setCidFromProps(props.cid);
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
    setStage("wait");
    loadState().then((results) => {
      if (results) {
        initializeUserAssignmentTables(results.newItemWeights);
        props.generatedVariantCallback?.(results.newVariantIndex, activityInfo.current.numberOfVariants);
      }
    });
    return null;
  }
  saveState();
  let title = /* @__PURE__ */ React.createElement("h1", null, activityDefinition.title);
  let pages = [];
  let lastItemNumber = 0;
  for (let [ind, page] of order.entries()) {
    let itemNumber;
    if (itemWeights[ind] > 0) {
      lastItemNumber++;
      itemNumber = lastItemNumber;
    } else {
      itemNumber = 0;
    }
    pages.push(/* @__PURE__ */ React.createElement("div", {
      key: `page${ind}`
    }, /* @__PURE__ */ React.createElement(PageViewer, {
      doenetId: props.doenetId,
      activityCid: cid,
      cid: page.cid,
      doenetML: page.doenetML,
      pageNumber: (ind + 1).toString(),
      pageIsActive: ind + 1 === currentPage,
      itemNumber,
      attemptNumber,
      flags,
      activityVariantIndex: variantIndex,
      requestedVariantIndex: variantsByPage[ind],
      unbundledCore: props.unbundledCore,
      updateCreditAchievedCallback: props.updateCreditAchievedCallback,
      setIsInErrorState: props.setIsInErrorState,
      updateAttemptNumber: props.updateAttemptNumber,
      saveStateCallback: receivedSaveFromPage,
      updateDataOnContentChange: props.updateDataOnContentChange
    })));
  }
  let cidChangedAlert = null;
  if (cidChanged) {
    cidChangedAlert = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
      onClick: () => alert("Hey, content changed")
    }, "content changed"));
  }
  let pageControls = null;
  if (nPages > 1) {
    pageControls = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
      "data-test": "previous",
      disabled: currentPage === 1,
      onClick: clickPrevious
    }, "Previous page"), /* @__PURE__ */ React.createElement("button", {
      "data-test": "next",
      disabled: currentPage === nPages,
      onClick: clickNext
    }, "Next page"), /* @__PURE__ */ React.createElement("p", null, "Page ", currentPage, " of ", nPages));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "200px"}
  }, cidChangedAlert, pageControls, title, pages);
}
function determineOrder(order, rng) {
  if (order?.type?.toLowerCase() !== "order") {
    return {success: false, message: "invalid order"};
  }
  let behavior = order.behavior?.toLowerCase();
  if (behavior === void 0) {
    behavior = "sequence";
  }
  switch (behavior) {
    case "sequence":
      return processSequenceOrder(order, rng);
    case "select":
      return processSelectOrder(order, rng);
    case "shuffle":
      return processShuffleOrder(order, rng);
    default:
      return {success: false, message: `Have not implemented behavior: ${behavior}`};
  }
}
function processSequenceOrder(order, rng) {
  let pages = [];
  for (let item of order.content) {
    let type = item.type.toLowerCase();
    if (type === "page") {
      pages.push(item);
    } else if (type === "order") {
      let orderResult = determineOrder(item, rng);
      if (orderResult.success) {
        pages.push(...orderResult.pages);
      } else {
        return orderResult;
      }
    } else {
      return {success: false, message: "Unrecognized item in order."};
    }
  }
  return {success: true, pages};
}
function processSelectOrder(order, rng) {
  let numberToSelect = order.numberToSelect;
  let nItems = order.content.length;
  if (!(Number.isInteger(numberToSelect) && numberToSelect > 0)) {
    numberToSelect = 1;
  }
  let numberUniqueRequired = 1;
  if (!order.withReplacement) {
    numberUniqueRequired = numberToSelect;
  }
  if (numberUniqueRequired > nItems) {
    return {
      success: false,
      message: "Cannot select " + numberUniqueRequired + " components from only " + nItems
    };
  }
  let selectWeights = order.selectWeights || [];
  if (!Array.isArray(selectWeights) || !selectWeights.every((x) => x >= 0)) {
    return {success: false, message: "Invalid selectWeights"};
  }
  selectWeights = selectWeights.slice(0, nItems);
  if (selectWeights.length < nItems) {
    selectWeights.push(...Array(nItems - selectWeights.length).fill(1));
  }
  let totalWeight = selectWeights.reduce((a, c) => a + c);
  selectWeights = selectWeights.map((x) => x / totalWeight);
  let cumulativeWeights = selectWeights.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);
  let indsRemaining = [...Array(cumulativeWeights.length).keys()];
  let selectedItems = [];
  for (let ind = 0; ind < numberToSelect; ind++) {
    let rand = rng();
    let start = -1, end = cumulativeWeights.length - 1;
    while (start < end - 1) {
      let mid = Math.floor((start + end) / 2);
      if (cumulativeWeights[mid] > rand) {
        end = mid;
      } else {
        start = mid;
      }
    }
    selectedItems.push(order.content[indsRemaining[end]]);
    if (!order.withReplacement && ind < numberToSelect - 1) {
      selectWeights.splice(end, 1);
      indsRemaining.splice(end, 1);
      totalWeight = selectWeights.reduce((a, c) => a + c);
      selectWeights = selectWeights.map((x) => x / totalWeight);
      cumulativeWeights = selectWeights.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);
    }
  }
  let pages = [];
  for (let item of selectedItems) {
    let type = item.type.toLowerCase();
    if (type === "page") {
      pages.push(item);
    } else if (type === "order") {
      let orderResult = determineOrder(item);
      if (orderResult.success) {
        pages.push(...orderResult.pages);
      } else {
        return orderResult;
      }
    } else {
      return {success: false, message: "Unrecognized item in order."};
    }
  }
  return {success: true, pages};
}
function processShuffleOrder(order, rng) {
  let newOrder = [...order.content];
  for (let i = order.content.length - 1; i > 0; i--) {
    const rand = rng();
    const j = Math.floor(rand * (i + 1));
    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
  }
  let pages = [];
  for (let item of newOrder) {
    let type = item.type.toLowerCase();
    if (type === "page") {
      pages.push(item);
    } else if (type === "order") {
      let orderResult = determineOrder(item, rng);
      if (orderResult.success) {
        pages.push(...orderResult.pages);
      } else {
        return orderResult;
      }
    } else {
      return {success: false, message: "Unrecognized item in order."};
    }
  }
  return {success: true, pages};
}
