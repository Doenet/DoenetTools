import React, { useEffect, useRef, useState } from 'react';
import { retrieveTextFileForCID } from '../Core/utils/retrieveTextFile';
import PageViewer from './PageViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { prng_alea } from 'esm-seedrandom';
import Button from '../_reactComponents/PanelHeaderComponents/Button';
import { returnAllPossibleVariants } from '../Core/utils/returnAllPossibleVariants';
import axios from 'axios';
import { get as idb_get, set as idb_set } from 'idb-keyval';
import { CIDFromText } from '../Core/utils/cid';
import { useToast, toastType } from '@Toast';
import { nanoid } from 'nanoid';

let rngClass = prng_alea;

export default function ActivityViewer(props) {
  const toast = useToast();

  const [errMsg, setErrMsg] = useState(null);

  const [CIDFromProps, setCIDFromProps] = useState(null);
  const [activityDefinitionFromProps, setActivityDefinitionFromProps] = useState(null);
  const [CID, setCID] = useState(null);
  const [activityDefinition, setActivityDefinition] = useState(null);

  const [attemptNumber, setAttemptNumber] = useState(null);

  const [requestedVariantIndex, setRequestedVariantIndex] = useState(null);

  const [stage, setStage] = useState('initial');

  const [activityContentChanged, setActivityContentChanged] = useState(false);

  const [order, setOrder] = useState(null);

  const [flags, setFlags] = useState(props.flags);

  const [currentPage, setCurrentPage] = useState(1);
  const [nPages, setNPages] = useState(1);

  const [variantsByPage, setVariantsByPage] = useState(null);


  const serverSaveId = useRef(null);

  const activityStateToBeSavedToDatabase = useRef(null);
  const changesToBeSaved = useRef(false);
  const saveStateToDBTimerId = useRef(null);
  const activityInfo = useRef(null);
  const activityInfoString = useRef(null);

  useEffect(() => {

    let newFlags = { ...props.flags };
    if (props.userId) {
      newFlags.allowLocalState = false;
      newFlags.allowSaveState = false;
    } else if (newFlags.allowSaveState) {
      // allowSaveState implies allowLoadState
      newFlags.allowLoadState = true;
    }

    setFlags(newFlags);

  }, [props.userId, props.flags]);


  function calculateCIDDefinition() {

    if (activityDefinitionFromProps) {
      if (CIDFromProps) {
        // check to see if activityDefinition matches CID
        CIDFromText(JSON.stringify(activityDefinitionFromProps))
          .then(calcCID => {
            if (calcCID === CIDFromProps) {
              setActivityDefinition(activityDefinitionFromProps);
              setCID(CIDFromProps);
              setStage('continue');
            } else {
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true)
              }
              setErrMsg(`activity definition did not match specified CID: ${CIDFromProps}`);
            }
          })
      } else {
        // if have activityDefinition and no CID, then calculate CID
        CIDFromText(JSON.stringify(activityDefinitionFromProps))
          .then(CID => {
            setActivityDefinition(activityDefinitionFromProps);
            setCID(CID);
            setStage('continue');
          })
      }
    } else {
      // if don't have activityDefinition, then retrieve activityDefinition from CID

      retrieveTextFileForCID(CIDFromProps, "json")
        .then(retrievedActivityDefinition => {
          setActivityDefinition(retrievedActivityDefinition);
          setCID(CIDFromProps);
          setStage('continue');
        })
        .catch(e => {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`activity definition not found for CID: ${CIDFromProps}`);
        })
    }

  }

  async function loadState() {

    let loadedState = false;

    if (props.flags.allowLocalState) {

      let localInfo;

      try {
        localInfo = await idb_get(`${props.doenetId}|${attemptNumber}|${CID}`);
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
              resetActivity({
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

        serverSaveId.current = localInfo.saveId;

        // activityState is just currentPage
        setCurrentPage(localInfo.activityState.currentPage);

        // activityInfo is CIDOrder and variantsByPage
        let newActivityInfo = localInfo.activityInfo;
        setNPages(newActivityInfo.CIDOrder.length);
        setOrder(newActivityInfo.CIDOrder);
        setVariantsByPage(newActivityInfo.variantsByPage);
        activityInfo.current = newActivityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);


        loadedState = true;

      }
    }

    if (!loadedState) {
      // if didn't load core state from local storage, try to load from database

      // even if allowLoadState is false,
      // still call loadPageState, in which case it will only retrieve the initial page state


      const payload = {
        params: {
          CID,
          attemptNumber,
          doenetId: props.doenetId,
          userId: props.userId,
          allowLoadState: props.flags.allowLoadState,
        }
      }

      try {
        let resp = await axios.get('/api/loadActivityState.php', payload);

        if (!resp.data.success) {
          if (props.flags.allowLoadState) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(`Error loading activity state: ${resp.data.message}`);
            return;
          } else {
            // ignore this error if didn't allow loading of page state

          }

        }

        if (resp.data.loadedState) {

          let newActivityInfo = JSON.parse(resp.data.newActivityInfo);
          let activityState = JSON.parse(resp.data.activityState);

          // activityState is just currentPage
          setCurrentPage(activityState.currentPage);

          // activityInfo is CIDOrder and variantsByPage
          setNPages(newActivityInfo.CIDOrder.length);
          setOrder(newActivityInfo.CIDOrder);
          setVariantsByPage(newActivityInfo.variantsByPage);

          activityInfo.current = newActivityInfo;
          activityInfoString.current = JSON.stringify(activityInfo.current);

        } else {

          // get initial state and info

          // state at page 1
          setCurrentPage(1);

          let results = await calculateOrderAndVariants();
          setNPages(results.order.length);
          setOrder(results.order);
          setVariantsByPage(results.variantsByPage);

          activityInfo.current = results.activityInfo;
          activityInfoString.current = JSON.stringify(activityInfo.current);

        }


      } catch (e) {

        if (props.flags.allowLoadState) {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`Error loading activity state: ${e.message}`);
          return;
        } else {
          // ignore this error if didn't allow loading of page state

        }


      }

    }

    setStage('continue');

  }

  async function saveLoadedLocalStateToDatabase(localInfo) {

    let serverSaveId = await idb_get(`${props.doenetId}|${attemptNumber}|${CID}|ServerSaveId`);

    let activityStateToBeSavedToDatabase = {
      CID,
      activityInfo: JSON.stringify(localInfo.activityInfo),
      activityState: JSON.stringify(localInfo.activityState),
      attemptNumber,
      doenetId: props.doenetId,
      saveId: localInfo.saveId,
      serverSaveId,
      updateDataOnContentChange: props.updateDataOnContentChange,
    }

    let resp;

    try {
      resp = await axios.post('/api/saveActivityState.php', activityStateToBeSavedToDatabase);
    } catch (e) {
      // since this is initial load, don't show error message
      return { localInfo, CID, attemptNumber };
    }

    console.log('result from saving activity to db', resp.data)

    let data = resp.data;

    if (!data.success) {
      // since this is initial load, don't show error message
      return { localInfo, CID, attemptNumber };
    }

    idb_set(
      `${props.doenetId}|${attemptNumber}|${CID}|ServerSaveId`,
      data.saveId
    )


    if (data.stateOverwritten) {

      if (CID !== data.CID || attemptNumber !== Number(data.attemptNumber)
        || activityStateToBeSavedToDatabase.activityInfo !== data.activityInfo
        || activityStateToBeSavedToDatabase.activityState !== data.activityState
      ) {

        let newLocalInfo = {
          activityState: JSON.parse(data.activityState),
          activityInfo: JSON.parse(data.activityInfo),
          saveId: data.saveId,
        }

        idb_set(
          `${props.doenetId}|${data.attemptNumber}|${data.CID}`,
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

  async function calculateOrderAndVariants() {

    let seed = determineVariantSeed(activityDefinition, requestedVariantIndex);
    let rng = new rngClass(seed);

    let orderResult = determineOrder(activityDefinition.order, rng);

    if (!orderResult.success) {

      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg(orderResult.message);
      return null;
    }


    let originalOrder = orderResult.pages;

    console.time('getContent');

    let promises = [];

    for (let page of originalOrder) {
      promises.push(returnAllPossibleVariants({
        CID: page.CID, doenetML: page.doenetML, flags
      }));
    }

    let variantsResult;

    try {
      variantsResult = await Promise.all(promises);
    } catch (e) {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg(`Error retrieving content for activity`);
      return;
    }

    console.timeEnd('getContent');

    let chosenVariants = [];

    let newOrder = [];
    for (let [ind, possibleVariants] of variantsResult.entries()) {
      let nVariants = possibleVariants.allPossibleVariants.length;

      let variantIndex = Math.floor(rng() * nVariants) + 1;

      chosenVariants.push(variantIndex);

      // if looked up doenetML to determine possible variants
      // record that doenetML in the order so don't have to load it again
      // Also, add CID if it isn't there
      let page = originalOrder[ind];
      if (page.doenetML === undefined) {
        page = { ...page };
        page.doenetML = possibleVariants.doenetML;
      } else if (!page.CID) {
        page = { ...page };
        page.CID = possibleVariants.CID;
      }
      newOrder.push(page);

    }

    let CIDOrder = newOrder.map(x => ({ CID: x.CID }))
    let activityInfo = { CIDOrder, variantsByPage: chosenVariants };

    return { order: newOrder, variantsByPage: chosenVariants, activityInfo };

  }

  async function saveState() {

    if (!props.flags.allowSaveState && !props.flags.allowLocalState) {
      return;
    }

    let saveId = nanoid();

    if (props.flags.allowLocalState) {
      idb_set(
        `${props.doenetId}|${attemptNumber}|${CID}`,
        {
          activityInfo: activityInfo.current,
          activityState: { currentPage },
          saveId,
        }
      )
    }

    if (!props.flags.allowSaveState) {
      return;
    }


    activityStateToBeSavedToDatabase.current = {
      CID: CID,
      activityInfo: activityInfoString.current,
      activityState: JSON.stringify({ currentPage }),
      attemptNumber: attemptNumber,
      doenetId: props.doenetId,
      saveId,
      serverSaveId: serverSaveId.current,
      updateDataOnContentChange: props.updateDataOnContentChange,
    }

    // mark presence of changes
    // so that next call to saveChangesToDatabase will save changes
    changesToBeSaved.current = true;

    // if not currently in throttle, save changes to database
    saveChangesToDatabase();


  }

  async function saveChangesToDatabase() {
    // throttle save to database at 60 seconds

    if (saveStateToDBTimerId.current !== null || !changesToBeSaved.current) {
      return;
    }


    changesToBeSaved.current = false;

    // check for changes again after 60 seconds
    saveStateToDBTimerId.current = setTimeout(() => {
      saveStateToDBTimerId.current = null;
      saveChangesToDatabase();
    }, 10000);
    // }, 60000);


    // TODO: find out how to test if not online
    // and send this toast if not online:

    // postMessage({
    //   messageType: "sendToast",
    //   args: {
    //     message: "You're not connected to the internet. Changes are not saved. ",
    //     toastType: toastType.ERROR
    //   }
    // })

    let resp;

    let activityStateToSave = activityStateToBeSavedToDatabase.current.activityState;

    try {
      resp = await axios.post('/api/saveActivityState.php', activityStateToBeSavedToDatabase.current);
    } catch (e) {
      console.log(`sending toast: Error synchronizing data.  Changes not saved to the server.`)
      toast("Error synchronizing data.  Changes not saved to the server.", toastType.ERROR)
      return;
    }

    console.log('result from saving activity to database:', resp.data);

    if (resp.status === null) {
      console.log(`sending toast: Error synchronizing data.  Changes not saved to the server.  Are you connected to the internet?`)
      toast("Error synchronizing data.  Changes not saved to the server.  Are you connected to the internet?", toastType.ERROR)
      return;
    }

    let data = resp.data;

    if (!data.success) {
      console.log(`sending toast: ${data.message}`)
      toast(data.message, toastType.ERROR)
      return;
    }

    serverSaveId.current = data.saveId;

    if (props.flags.allowLocalState) {
      idb_set(
        `${props.doenetId}|${attemptNumber}|${CID}|ServerSaveId`,
        data.saveId
      )
    }

    if (data.stateOverwritten) {

      if (CID !== data.CID || attemptNumber !== Number(data.attemptNumber)
        || activityInfoString.current !== data.activityInfo
        || activityStateToSave !== data.activityState
      ) {

        if (props.flags.allowLocalState) {
          idb_set(
            `${props.doenetId}|${data.attemptNumber}|${data.CID}`,
            {
              activityState: JSON.parse(data.activityState),
              activityInfo: JSON.parse(data.activityInfo),
              saveId: data.saveId,
            }
          )
        }

        if (props.setIsInErrorState) {
          props.setIsInErrorState(true)
        }
        setErrMsg('how do we reset activity?')

      }


    }

    // TODO: send message so that UI can show changes have been synchronized

    // console.log(">>>>recordContentInteraction data",data)
  }


  if (errMsg !== null) {
    let errorIcon = <span style={{ fontSize: "1em", color: "#C1292E" }}><FontAwesomeIcon icon={faExclamationCircle} /></span>
    return <div style={{ fontSize: "1.3em", marginLeft: "20px", marginTop: "20px" }}>{errorIcon} {errMsg}</div>
  }


  let changedState = false;

  if (activityDefinitionFromProps !== props.activityDefinition) {
    setActivityDefinitionFromProps(props.activityDefinition);
    changedState = true;
  }
  if (CIDFromProps !== props.CID) {
    setCIDFromProps(props.CID);
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
    setActivityContentChanged(true);
    return null;
  }


  if (stage === 'wait') {
    return null;
  }

  if (stage == 'recalcParams') {
    setStage('wait');
    calculateCIDDefinition();
    return null;
  }

  // at this point, we have 
  // attemptNumber, requestedVariantIndex, CID, activityDefinition


  if (activityDefinition?.type?.toLowerCase() !== "activity") {
    if (props.setIsInErrorState) {
      props.setIsInErrorState(true)
    }
    setErrMsg("Invalid activity definition");
    return null;
  }

  if (activityContentChanged) {
    setActivityContentChanged(false);

    setStage("wait");

    loadState();

    return null;

  }


  saveState();

  let title = <h1>{activityDefinition.title}</h1>


  let pages = [];

  for (let [ind, page] of order.entries()) {

    pages.push(
      <div key={`page${ind}`}>
        <h2>Page {ind + 1}</h2>

        <PageViewer
          doenetId={props.doenetId}
          CID={page.CID}
          doenetML={page.doenetML}
          pageId={(ind + 1).toString()}
          pageIsActive={ind + 1 === currentPage}
          attemptNumber={attemptNumber}
          flags={flags}
          requestedVariant={{ index: variantsByPage[ind] }}
          unbundledCore={props.unbundledCore}
          updateCreditAchievedCallback={props.updateCreditAchievedCallback}
          setIsInErrorState={props.setIsInErrorState}
          updateDataOnContentChange={props.updateDataOnContentChange}
        />

      </div>
    )
  }

  return <div style={{ marginBottom: "200px" }}>
    <Button id={"prev_button"} onClick={() => setCurrentPage((was) => Math.max(1, was - 1))} value={"Previous page"} />
    <Button id={"next_button"} onClick={() => setCurrentPage((was) => Math.min(nPages, was + 1))} value={"Next page"} />
    <p>Current page: {currentPage}</p>
    {title}
    {pages}
  </div>
}

function determineVariantSeed(activityDefinition, requestedVariantIndex) {
  let nVariants = 100;
  let seeds = [];

  if (activityDefinition.variantControl) {
    nVariants = activityDefinition.variantControl.nVariants;
    if (!(Number.isInteger(nVariants) && nVariants >= 1)) {
      nVariants = 100;
    }

    if (Array.isArray(activityDefinition.variantControl.seeds)) {
      seeds = activityDefinition.variantControl.seeds.map(x => x.toString());
    }
  }

  if (seeds.length >= nVariants) {
    seeds = seeds.slice(0, nVariants)
  } else {
    for (let ind = seeds.length; ind < nVariants; ind++) {
      let s = ind + 1;
      while (seeds.includes(s.toString())) {
        s++;
      }
      seeds.push(s.toString());
    }
  }

  let selectedSeed = seeds[requestedVariantIndex - 1];


  return selectedSeed;

}

function determineOrder(order, rng) {

  if (order?.type?.toLowerCase() !== "order") {
    return { success: false, message: "invalid order" }
  }

  let behavior = order.behavior.toLowerCase();

  switch (behavior) {
    case 'sequence':
      return processSequenceOrder(order, rng);
    case 'select':
      return processSelectOrder(order, rng);
    case 'shuffle':
      return processShuffleOrder(order, rng);
    default:
      return { success: false, message: `Have not implemented behavior: ${behavior}` }
  }

}

function processSequenceOrder(order, rng) {
  let pages = [];

  for (let item of order.content) {
    let type = item.type.toLowerCase();
    if (type === "page") {
      pages.push(item)
    } else if (type === "order") {
      let orderResult = determineOrder(item, rng);
      if (orderResult.success) {
        pages.push(...orderResult.pages)
      } else {
        return orderResult;
      }
    } else {
      return { success: false, message: "Unrecognized item in order." }
    }
  }

  return { success: true, pages }
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
      message: "Cannot select " + numberUniqueRequired +
        " components from only " + nItems
    };
  }

  let selectWeights = order.selectWeights || [];

  if (!Array.isArray(selectWeights) || !selectWeights.every(x => x >= 0)) {
    return { success: false, message: "Invalid selectWeights" };
  }

  selectWeights = selectWeights.slice(0, nItems);

  if (selectWeights.length < nItems) {
    selectWeights.push(...Array(nItems - selectWeights.length).fill(1));
  }

  // normalize selectWeights to sum to 1
  let totalWeight = selectWeights.reduce((a, c) => a + c);
  selectWeights = selectWeights.map(x => x / totalWeight);


  //https://stackoverflow.com/a/44081700
  let cumulativeWeights = selectWeights.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);
  let indsRemaining = [...Array(cumulativeWeights.length).keys()];

  let selectedItems = [];

  for (let ind = 0; ind < numberToSelect; ind++) {

    // random number in [0, 1)
    let rand = rng();

    // find largest index where cumulativeWeight is larger than rand
    // using binary search
    let start = -1, end = cumulativeWeights.length - 1;
    while (start < end - 1) {
      let mid = Math.floor((start + end) / 2); // mid point
      if (cumulativeWeights[mid] > rand) {
        end = mid;
      } else {
        start = mid;
      }
    }

    selectedItems.push(order.content[indsRemaining[end]])

    if (!order.withReplacement && ind < numberToSelect - 1) {
      // remove selected index and renormalize weights
      selectWeights.splice(end, 1);
      indsRemaining.splice(end, 1);
      totalWeight = selectWeights.reduce((a, c) => a + c);
      selectWeights = selectWeights.map(x => x / totalWeight);
      cumulativeWeights = selectWeights.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);

    }
  }


  let pages = [];


  for (let item of selectedItems) {
    let type = item.type.toLowerCase();
    if (type === "page") {
      pages.push(item)
    } else if (type === "order") {
      let orderResult = determineOrder(item);
      if (orderResult.success) {
        pages.push(...orderResult.pages)
      } else {
        return orderResult;
      }
    } else {
      return { success: false, message: "Unrecognized item in order." }
    }
  }

  return { success: true, pages }
}

function processShuffleOrder(order, rng) {

  let newOrder = [...order.content];

  // shuffle the order
  // https://stackoverflow.com/a/12646864
  for (let i = order.content.length - 1; i > 0; i--) {
    const rand = rng();
    const j = Math.floor(rand * (i + 1));
    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
  }

  let pages = [];

  for (let item of newOrder) {
    let type = item.type.toLowerCase();
    if (type === "page") {
      pages.push(item)
    } else if (type === "order") {
      let orderResult = determineOrder(item, rng);
      if (orderResult.success) {
        pages.push(...orderResult.pages)
      } else {
        return orderResult;
      }
    } else {
      return { success: false, message: "Unrecognized item in order." }
    }
  }

  return { success: true, pages }
}
