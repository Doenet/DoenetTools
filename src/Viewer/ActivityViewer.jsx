import React, { useEffect, useRef, useState } from 'react';
import { retrieveTextFileForCid } from '../Core/utils/retrieveTextFile';
import PageViewer from './PageViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { prng_alea } from 'esm-seedrandom';
import { returnAllPossibleVariants } from '../Core/utils/returnAllPossibleVariants';
import axios from 'axios';
import { get as idb_get, set as idb_set } from 'idb-keyval';
import { cidFromText } from '../Core/utils/cid';
import { useToast, toastType } from '@Toast';
import { nanoid } from 'nanoid';
import { enumerateCombinations } from '../Core/utils/enumeration';
import { determineNumberOfActivityVariants, parseActivityDefinition } from '../_utils/activityUtils';
import createComponentInfoObjects from '../Core/utils/componentInfoObjects';
import { addDocumentIfItsMissing, countComponentTypes, expandDoenetMLsToFullSerializedComponents } from '../Core/utils/serializedStateProcessing';
import VisibilitySensor from 'react-visibility-sensor-v2';
import { useLocation, useNavigate } from 'react-router';
import cssesc from 'cssesc';
import { atom, useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';

let rngClass = prng_alea;

export const saveStateToDBTimerIdAtom = atom({
  key: "saveStateToDBTimerIdAtom",
  default: null
})

export const scrollableContainerAtom = atom({
  key: "scollParentAtom",
  default: null
})

export default function ActivityViewer(props) {
  const toast = useToast();

  const [errMsg, setErrMsg] = useState(null);


  const [{
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
  })


  const [cid, setCid] = useState(null);

  const activityDefinitionDoenetML = useRef(null);

  const [activityDefinition, setActivityDefinition] = useState(null);


  const [variantIndex, setVariantIndex] = useState(null);

  const [stage, setStage] = useState('initial');
  const settingUp = useRef(true);

  const [activityContentChanged, setActivityContentChanged] = useState(false);

  const [order, setOrder] = useState(null);

  const [flags, setFlags] = useState(props.flags);

  const [currentPage, setCurrentPage] = useState(0);
  const currentPageRef = useRef(currentPage);  // so that event listener can get new current page
  currentPageRef.current = currentPage; // so updates on every refresh

  const [nPages, setNPages] = useState(0);

  const [variantsByPage, setVariantsByPage] = useState(null);
  const [itemWeights, setItemWeights] = useState(null);
  const previousComponentTypeCountsByPage = useRef([]);

  const [cidChanged, setCidChanged] = useState(props.cidChanged);

  const serverSaveId = useRef(null);

  const activityStateToBeSavedToDatabase = useRef(null);
  const changesToBeSaved = useRef(false);

  const setSaveStateToDBTimerId = useSetRecoilState(saveStateToDBTimerIdAtom);
  const [scrollableContainer, setScrollableContainer] = useRecoilState(scrollableContainerAtom);

  const activityInfo = useRef(null);
  const activityInfoString = useRef(null);
  const pageAtPreviousSave = useRef(null);


  const [pageInfo, setPageInfo] = useState({
    pageIsVisible: [],
    pageIsActive: [],
    pageHasCore: [],
    waitingForPagesCore: null
  })


  const prerenderedPages = useRef([])
  const allPagesPrerendered = useRef(false);

  const nodeRef = useRef(null);
  const ignoreNextScroll = useRef(false);

  let location = useLocation();
  let hash = location.hash;
  const previousLocations = useRef({});
  const currentLocationKey = useRef(null);


  let navigate = useNavigate();


  // set ref to value from recoil atom

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

  useEffect(() => {
    window.returnActivityData = function () {
      return {
        activityDefinition,
        requestedVariantIndex,
        variantIndex,
        cid,
        order,
        currentPage,
        nPages,
        variantsByPage,
        itemWeights,
      }
    }
  })

  useEffect(() => {
    // for non-paginated activity
    // set the current page to be the page at the top of the screen
    // will be used to set the url hash

    if (nodeRef.current) {

      let newScrollableContainer = nodeRef.current.parentNode.id === "mainPanel"
        ? nodeRef.current.parentNode : window

      setScrollableContainer(newScrollableContainer);

      if (!props.paginate && nPages > 1) {

        newScrollableContainer.addEventListener('scroll', (event) => {
          // find page that is at the top

          if (ignoreNextScroll.current) {
            ignoreNextScroll.current = false;

          } else {

            let topPage;
            for (let ind = 0; ind < nPages - 1; ind++) {
              let thePage = document.getElementById(`page${ind + 1}`);
              if (thePage) {
                let { bottom } = thePage.getBoundingClientRect();
                if (bottom < 50) {
                  topPage = ind + 2;
                } else if (!topPage) {
                  topPage = 1;
                }
              }
            }

            if (topPage && topPage !== currentPageRef.current) {
              setCurrentPage(topPage)
            }
          }

        })
      }
    }
  }, [nodeRef.current, nPages])

  useEffect(() => {
    props.pageChangedCallback?.(currentPage);
  }, [currentPage])

  useEffect(() => {
    if (hash && nPages) {
      let match = hash.match(/^#page(\d+)/)
      if (match) {
        setCurrentPage(Math.max(1, Math.min(nPages, match[1])));
      }
    }
  }, [hash, nPages])

  useEffect(() => {
    if (currentPage > 0 && nPages > 1) {
      let pageAnchor = `#page${currentPage}`;
      if (hash.slice(0, pageAnchor.length) !== pageAnchor) {
        navigate(location.search + pageAnchor, { replace: true })
      }
    }
  }, [currentPage, nPages])

  useEffect(() => {
    if (allPagesPrerendered.current && !props.paginate && hash?.match(/^#page(\d+)$/)) {
      ignoreNextScroll.current = true;
      document.getElementById(cssesc(hash.slice(1)))?.scrollIntoView();
    }
  }, [allPagesPrerendered.current])

  useEffect(() => {
    // Keep track of scroll position when clicked on a link
    // If navigate back to that location (i.e., hit back button)
    // then scroll back to the location when clicked

    console.log(currentLocationKey.current, location.key, location.state?.previousScrollPosition,previousLocations.current[location.key]?.lastScrollPosition)

    if (currentLocationKey.current !== location.key) {
      if (location.state?.previousScrollPosition && currentLocationKey.current) {
        previousLocations.current[currentLocationKey.current].lastScrollPosition = location.state.previousScrollPosition
      }
      if (previousLocations.current[location.key]?.lastScrollPosition !== undefined) {
        scrollableContainer.scroll({ top: previousLocations.current[location.key].lastScrollPosition })
      }

      previousLocations.current[location.key] = { ...location };
      currentLocationKey.current = location.key;
    }

  }, [location])

  const getValueOfTimeoutWithoutARefresh = useRecoilCallback(({ snapshot }) =>
    async () => {
      return await snapshot.getPromise(saveStateToDBTimerIdAtom)
    }
  )


  function resetActivity({ changedOnDevice, newCid, newAttemptNumber }) {
    console.log('resetActivity', changedOnDevice, newCid, newAttemptNumber);


    if (newAttemptNumber !== attemptNumber) {
      if (props.updateAttemptNumber) {
        toast(`Reverted activity as attempt number changed on other device`, toastType.ERROR);
        props.updateAttemptNumber(newAttemptNumber);
      } else {
        // what do we do in this case?
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true)
        }
        setErrMsg('how to reset attempt number when not given updateAttemptNumber function?')

      }
    } else if (newCid !== cid) {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg("Content changed unexpectedly!");
    } else {
      // since, at least for now, only activity state is page number,
      // we ignore the change 

    }

    // toast(`Reverted page to state saved on device ${changedOnDevice}`, toastType.ERROR);

    // if (cid && newCid !== cid) {
    //   if (props.setIsInErrorState) {
    //     props.setIsInErrorState(true)
    //   }
    //   console.log(`cid: ${cid}, newCid ${newCid}`)
    //   setErrMsg("Have not implemented handling change in activity content from other device.  Please reload page");
    // } else if (newAttemptNumber !== attemptNumber) {
    //   if (props.setIsInErrorState) {
    //     props.setIsInErrorState(true)
    //   }
    //   setErrMsg("Have not implemented handling creating new attempt from other device.  Please reload page");
    // } else {
    //   // What here?
    // }


  }


  function calculateCidDefinition() {

    if (activityDefinitionFromProps) {
      if (cidFromProps) {
        // check to see if activityDefinition matches cid
        cidFromText(JSON.stringify(activityDefinitionFromProps))
          .then(calcCid => {
            if (calcCid === cidFromProps) {
              setCid(cidFromProps);
              activityDefinitionDoenetML.current = activityDefinitionFromProps;
              let result = parseActivityDefinition(activityDefinitionFromProps);
              if (result.success) {
                setActivityDefinition(result.activityJSON);
                setStage("continue");
              } else {
                if (props.setIsInErrorState) {
                  props.setIsInErrorState(true)
                }
                setErrMsg(result.message);
              }

            } else {
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true)
              }
              setErrMsg(`activity definition did not match specified cid: ${cidFromProps}`);
            }
          })
      } else {
        // if have activityDefinition and no cid, then calculate cid
        cidFromText(JSON.stringify(activityDefinitionFromProps))
          .then(cid => {
            setCid(cid);
            activityDefinitionDoenetML.current = activityDefinitionFromProps;
            let result = parseActivityDefinition(activityDefinitionFromProps);
            if (result.success) {
              setActivityDefinition(result.activityJSON);
              setStage("continue");
            } else {
              if (props.setIsInErrorState) {
                props.setIsInErrorState(true)
              }
              setErrMsg(result.message);
            }

          })
      }
    } else {
      // if don't have activityDefinition, then retrieve activityDefinition from cid

      retrieveTextFileForCid(cidFromProps, "doenet")
        .then(retrievedActivityDefinition => {
          setCid(cidFromProps);
          activityDefinitionDoenetML.current = retrievedActivityDefinition;
          let result = parseActivityDefinition(retrievedActivityDefinition);
          if (result.success) {
            setActivityDefinition(result.activityJSON);
            setStage("continue");
          } else {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(result.message);
          }

        })
        .catch(e => {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`activity definition not found for cid: ${cidFromProps}`);
        })
    }

  }


  async function loadState() {

    let loadedState = false;
    let newItemWeights;
    let newVariantIndex;

    if (props.flags.allowLocalState) {

      let localInfo;

      try {
        localInfo = await idb_get(`${props.doenetId}|${attemptNumber}|${cid}`);
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
              resetActivity({
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

            // no need to send toast, as state is just page number

          }

        }

        serverSaveId.current = localInfo.saveId;

        // activityState is just currentPage
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(localInfo.activityState.currentPage);
        }

        // activityInfo is orderWithCids, variantsByPage, itemWeights, and numberOfVariants
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
      // if didn't load core state from local storage, try to load from database

      // even if allowLoadState is false,
      // still call loadPageState, in which case it will only retrieve the initial page state


      const payload = {
        params: {
          cid,
          attemptNumber,
          doenetId: props.doenetId,
          userId: props.userId,
          allowLoadState: props.flags.allowLoadState,
        }
      }

      let resp;

      try {
        resp = await axios.get('/api/loadActivityState.php', payload);

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

      if (resp.data.loadedState) {

        let newActivityInfo = JSON.parse(resp.data.activityInfo);
        let activityState = JSON.parse(resp.data.activityState);

        // activityState is just currentPage
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(activityState.currentPage);
        }

        // activityInfo is orderWithCids, variantsByPage, itemWeights, and numberOfVariants
        newVariantIndex = resp.data.variantIndex;
        setVariantIndex(variantIndex);
        setNPages(newActivityInfo.orderWithCids.length);
        setOrder(newActivityInfo.orderWithCids);
        setVariantsByPage(newActivityInfo.variantsByPage);
        setItemWeights(newActivityInfo.itemWeights);
        newItemWeights = newActivityInfo.itemWeights;
        previousComponentTypeCountsByPage.current = newActivityInfo.previousComponentTypeCounts || [];


        activityInfo.current = newActivityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);

      } else {

        // get initial state and info

        // start at page 1
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(1);
        }

        let results;
        results = await calculateOrderAndVariants();
        if (!results.success) {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
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


    return { newItemWeights, newVariantIndex };

  }

  async function saveLoadedLocalStateToDatabase(localInfo) {

    let serverSaveId = await idb_get(`${props.doenetId}|${attemptNumber}|${cid}|ServerSaveId`);

    let activityStateToBeSavedToDatabase = {
      cid,
      activityInfo: JSON.stringify(localInfo.activityInfo),
      activityState: JSON.stringify(localInfo.activityState),
      variantIndex: localInfo.variantIndex,
      attemptNumber,
      doenetId: props.doenetId,
      saveId: localInfo.saveId,
      serverSaveId,
      updateDataOnContentChange: props.updateDataOnContentChange,
    }

    let resp;

    try {
      console.log("first one saveActivityState activityStateToBeSavedToDatabase", activityStateToBeSavedToDatabase)
      resp = await axios.post('/api/saveActivityState.php', activityStateToBeSavedToDatabase);
    } catch (e) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    setCidChanged(resp.data.cidChanged === true);

    let data = resp.data;

    if (!data.success) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    idb_set(
      `${props.doenetId}|${attemptNumber}|${cid}|ServerSaveId`,
      data.saveId
    )


    if (data.stateOverwritten) {

      let newLocalInfo = {
        activityState: JSON.parse(data.activityState),
        activityInfo: JSON.parse(data.activityInfo),
        saveId: data.saveId,
        variantIndex: data.variantIndex,
      }

      idb_set(
        `${props.doenetId}|${data.attemptNumber}|${data.cid}`,
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

  async function calculateOrderAndVariants() {

    let activityVariantResult = await determineNumberOfActivityVariants(activityDefinition);

    let variantIndex = (requestedVariantIndex - 1) % activityVariantResult.numberOfVariants + 1;
    if (variantIndex < 1) {
      variantIndex += activityVariantResult.numberOfVariants;
    }

    let rng = new rngClass(variantIndex.toString());

    let orderResult = determineOrder(activityDefinition.order, rng);

    if (!orderResult.success) {
      return orderResult;
    }


    let originalOrder = orderResult.pages;


    let itemWeights = activityDefinition.itemWeights || [];

    if (!Array.isArray(itemWeights) || !itemWeights.every(x => x >= 0)) {
      return { success: false, message: "Invalid itemWeights" };
    }

    let nPages = originalOrder.length;

    itemWeights = itemWeights.slice(0, nPages);

    if (itemWeights.length < nPages) {
      itemWeights.push(...Array(nPages - itemWeights.length).fill(1));
    }

    // normalize itemWeights to sum to 1
    let totalWeight = itemWeights.reduce((a, c) => a + c);
    if (totalWeight > 0) {
      itemWeights = itemWeights.map(x => x / totalWeight);
    }


    let pageVariantsResult;

    if (activityVariantResult.pageVariants) {
      pageVariantsResult = [activityVariantResult.pageVariants]
    } else {

      let promises = [];
      for (let page of originalOrder) {
        promises.push(returnAllPossibleVariants({
          cid: page.cid, doenetML: page.doenetML
        }));
      }

      try {
        pageVariantsResult = await Promise.all(promises);
      } catch (e) {
        return { success: false, message: `Error retrieving content for activity. ${e.message}` };
      }
    }


    let variantForEachPage;

    // filter out the ignored variants for each page
    let allPossibleNonIgnoredPerPage = [], indicesToIgnorePerPage = [];
    let numberOfVariantsPerPage = [];

    for (let pageResult of pageVariantsResult) {
      let allPossibleVariants = [...pageResult.allPossibleVariants];
      let indicesToIgnore = [...pageResult.variantIndicesToIgnore]
      for (let ind of indicesToIgnore) {
        delete allPossibleVariants[ind];
      }
      let numberOfVariants = allPossibleVariants.filter(x => x !== undefined).length;

      allPossibleNonIgnoredPerPage.push(allPossibleVariants);
      indicesToIgnorePerPage.push(indicesToIgnore);
      numberOfVariantsPerPage.push(numberOfVariants);
    }

    let numberOfPageVariantCombinations = numberOfVariantsPerPage.reduce((a, c) => a * c, 1)

    if (numberOfPageVariantCombinations <= activityVariantResult.numberOfVariants) {

      let pageVariantCombinationIndex = (variantIndex - 1) % numberOfPageVariantCombinations + 1;

      variantForEachPage = enumerateCombinations({
        numberOfOptionsByIndex: numberOfVariantsPerPage,
        maxNumber: pageVariantCombinationIndex,
      })[pageVariantCombinationIndex - 1].map(x => x + 1);

    } else {
      variantForEachPage = [...Array(nPages).keys()].map(i => Math.floor(rng() * numberOfVariantsPerPage[i]) + 1)
    }

    let variantsByPage = [];

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

      variantsByPage.push(pageVariantIndex);

      // if looked up doenetML to determine possible variants
      // record that doenetML in the order so don't have to load it again
      // Also, add cid if it isn't there
      let page = originalOrder[ind];
      if (page.doenetML === undefined) {
        page = { ...page };
        page.doenetML = possibleVariants.doenetML;
      } else if (!page.cid) {
        page = { ...page };
        page.cid = possibleVariants.cid;
      }
      newOrder.push(page);

    }

    let orderWithCids = [...originalOrder];
    newOrder.forEach((v, i) => orderWithCids[i].cid = v.cid);

    let previousComponentTypeCounts = await initializeComponentTypeCounts(newOrder);

    let activityInfo = {
      orderWithCids,
      variantsByPage,
      itemWeights,
      numberOfVariants: activityVariantResult.numberOfVariants,
      previousComponentTypeCounts
    };

    return {
      success: true,
      order: newOrder,
      itemWeights,
      variantsByPage,
      variantIndex,
      activityInfo,
      previousComponentTypeCounts,
    };

  }

  async function saveState() {

    if (!props.flags.allowSaveState && !props.flags.allowLocalState) {
      return;
    }


    if (stage !== "saving" || currentPage === pageAtPreviousSave.current) {
      // haven't gotten a save event from page or no change to be saved
      return;
    }

    pageAtPreviousSave.current = currentPage;

    let saveId = nanoid();

    if (props.flags.allowLocalState) {
      idb_set(
        `${props.doenetId}|${attemptNumber}|${cid}`,
        {
          activityInfo: activityInfo.current,
          activityState: { currentPage },
          saveId,
          variantIndex,
        }
      )
    }

    if (!props.flags.allowSaveState) {
      return;
    }


    activityStateToBeSavedToDatabase.current = {
      cid: cid,
      activityInfo: activityInfoString.current,
      activityState: JSON.stringify({ currentPage }),
      variantIndex,
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

  async function saveChangesToDatabase(overrideThrottle = false) {
    // throttle save to database at 60 seconds

    if (!changesToBeSaved.current) {
      return;
    }

    // get the up-to-date value here without a refresh!!


    // just use the ref

    let oldTimeoutId = await getValueOfTimeoutWithoutARefresh();

    if (oldTimeoutId !== null) {
      if (overrideThrottle) {
        clearTimeout(oldTimeoutId);
      } else {
        return;
      }
    }


    changesToBeSaved.current = false;

    // check for changes again after 60 seconds
    let newTimeoutId = setTimeout(() => {
      setSaveStateToDBTimerId(null)
      saveChangesToDatabase();
    }, 60000);

    setSaveStateToDBTimerId(newTimeoutId)


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


    try {
      console.log("activity state params", activityStateToBeSavedToDatabase.current)
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
        `${props.doenetId}|${attemptNumber}|${cid}|ServerSaveId`,
        data.saveId
      )
    }

    if (data.stateOverwritten) {

      // if a new attempt number was generated,
      // then we reset the activity to the new state
      if (attemptNumber !== Number(data.attemptNumber)) {

        if (props.flags.allowLocalState) {
          idb_set(
            `${props.doenetId}|${data.attemptNumber}|${data.cid}`,
            {
              activityState: JSON.parse(data.activityState),
              activityInfo: JSON.parse(data.activityInfo),
              saveId: data.saveId,
              variantIndex: data.variantIndex
            }
          )

          resetActivity({
            changedOnDevice: data.device,
            newCid: data.cid,
            newAttemptNumber: Number(data.attemptNumber),
          })

        }
      } else if (cid !== data.cid) {

        // if the cid changed without the attemptNumber changing, something went wrong
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true)
        }
        setErrMsg("Content changed unexpectedly!");
        return;
      }

      // if only the activity state changed,
      // just ignore it as it is only changing the page and we can leave it at the old page


    }

    // TODO: send message so that UI can show changes have been synchronized

  }

  async function initializeUserAssignmentTables(newItemWeights) {

    //Initialize user_assignment tables
    if (flags.allowSaveSubmissions) {

      // if an item weight is set to zero, then it is not considered an item
      // in the assignments table
      // and it will not affect the resulting score
      let weights = newItemWeights.filter(x => x);

      try {
        let resp = await axios.post('/api/initAssignmentAttempt.php', {
          doenetId: props.doenetId,
          weights,
          attemptNumber,
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

    setStage('continue');

  }

  async function receivedSaveFromPage() {
    // activity state isn't saved until a first save from a page
    if (stage !== "saving" && !settingUp.current) {
      setStage("saving");
    }

    // check if cid changed
    try {
      let resp = await axios.get('/api/checkForChangedAssignment.php', {
        params: {
          currentCid: cid,
          doenetId: props.doenetId
        }
      });

      setCidChanged(resp.data.cidChanged === true);

    } catch (e) {
      // ignore any errors
    }

  }

  function clickNext() {
    setCurrentPage((was) => Math.min(nPages, was + 1));

    let event = {
      verb: "interacted",
      object: { objectType: "button", objectname: "next page button" },
      result: { newPage: Math.min(nPages, currentPage + 1) },
      context: { oldPage: currentPage },
    }

    recordEvent(event);

  }

  function clickPrevious() {
    setCurrentPage((was) => Math.max(1, was - 1));

    let event = {
      verb: "interacted",
      object: { objectType: "button", objectname: "previous page button" },
      result: { newPage: Math.max(1, currentPage - 1) },
      context: { oldPage: currentPage },
    }

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
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      version: "0.1.1",
      verb: event.verb,
      object: JSON.stringify(event.object),
      result: JSON.stringify(event.result),
      context: JSON.stringify(event.context),
    }

    axios.post('/api/recordEvent.php', payload)
      .then(resp => {
        // console.log(">>>>Activity Viewer resp",resp.data)
      })
      .catch(e => {
        console.error(`Error saving event: ${e.message}`);
        // postMessage({
        //   messageType: "sendToast",
        //   args: {
        //     message: `Error saving event: ${e.message}`,
        //     toastType: toastType.ERROR
        //   }
        // })
      });

  }

  function onChangeVisibility(isVisible, pageInd) {

    if (!props.paginate) {

      setPageInfo(was => {
        let newObj = { ...was };
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

      })

    }

  }

  function coreCreatedCallback(pageInd) {
    setPageInfo(was => {
      let newObj = { ...was };
      if (newObj.waitingForPagesCore === pageInd) {
        newObj.waitingForPagesCore = null;
      }
      let newHasCore = [...newObj.pageHasCore];
      newHasCore[pageInd] = true;
      newObj.pageHasCore = newHasCore;

      return newObj;

    })

  }

  function pagePrerenderedCallback(pageInd, success) {
    if (success) {
      prerenderedPages.current[pageInd] = true;

      if (prerenderedPages.current.length === nPages && prerenderedPages.current.every(x => x)) {
        allPagesPrerendered.current = true;
      }
    }

  }

  if (errMsg !== null) {
    let errorIcon = <span style={{ fontSize: "1em", color: "#C1292E" }}><FontAwesomeIcon icon={faExclamationCircle} /></span>
    return <div style={{ fontSize: "1.3em", marginLeft: "20px", marginTop: "20px" }}>{errorIcon} {errMsg}</div>
  }

  if (pageInfo.waitingForPagesCore === null) {

    // check current page first
    if (currentPage) {
      for (let pageInd of [currentPage - 1, ...Array(nPages).keys()]) {
        let isVisible = pageInfo.pageIsVisible[pageInd];
        if ((isVisible || currentPage === pageInd + 1) && !pageInfo.pageIsActive[pageInd]) {

          // activate either the current page or an inactive page that is visible

          // if we need to create core
          // then stop here to not create multiple cores at once
          let waitingAgain = !pageInfo.pageHasCore[pageInd];

          setPageInfo(was => {
            let newObj = { ...was };
            let newActive = [...newObj.pageIsActive];
            newActive[pageInd] = true;
            newObj.pageIsActive = newActive;
            if (!newObj.pageHasCore[pageInd]) {
              newObj.waitingForPagesCore = pageInd;
            }
            return newObj;
          })


          if (waitingAgain) {
            break;
          }

        }
      }
    }
  }


  //If no attemptNumber prop then set to 1
  let propAttemptNumber = props.attemptNumber;
  if (propAttemptNumber === undefined) {
    propAttemptNumber = 1;
  }

  // attemptNumber is used for requestedVariantIndex if not specified
  let adjustedRequestedVariantIndex = props.requestedVariantIndex;
  if (adjustedRequestedVariantIndex === undefined) {
    adjustedRequestedVariantIndex = propAttemptNumber;
  }


  if (activityDefinitionFromProps !== props.activityDefinition
    || cidFromProps !== props.cid
    || propAttemptNumber !== attemptNumber
    || requestedVariantIndex !== adjustedRequestedVariantIndex
  ) {

    settingUp.current = true;

    setInfoFromProps({
      activityDefinitionFromProps: props.activityDefinition,
      cidFromProps: props.cid,
      attemptNumber: propAttemptNumber,
      requestedVariantIndex: adjustedRequestedVariantIndex
    })

    setStage('recalcParams')
    setActivityContentChanged(true);
    return null;
  }


  if (stage === 'wait') {
    return null;
  }

  if (stage === 'recalcParams') {
    setStage('wait');
    calculateCidDefinition();
    return null;
  }

  // at this point, we have 
  // attemptNumber, requestedVariantIndex, cid, activityDefinition


  if (activityDefinition?.type?.toLowerCase() !== "activity") {
    if (props.setIsInErrorState) {
      props.setIsInErrorState(true)
    }
    setErrMsg("Invalid activity definition: type is not activity");
    return null;
  }

  if (activityContentChanged) {
    setActivityContentChanged(false);
    previousComponentTypeCountsByPage.current = [];

    setStage("wait");

    loadState().then(results => {
      if (results) {
        initializeUserAssignmentTables(results.newItemWeights);
        props.generatedVariantCallback?.(results.newVariantIndex, activityInfo.current.numberOfVariants);
      }
      settingUp.current = false;
    })

    return null;

  }


  saveState();

  let title = <h1>{activityDefinition.title}</h1>


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

    let thisPageIsActive = props.paginate ? ind + 1 === currentPage : pageInfo.pageIsActive[ind];

    let prefixForIds = nPages > 1 ? `page${ind + 1}` : '';

    let pageViewer = <PageViewer
      doenetId={props.doenetId}
      activityCid={cid}
      cid={page.cid}
      doenetML={page.doenetML}
      pageNumber={(ind + 1).toString()}
      previousComponentTypeCounts={previousComponentTypeCountsByPage.current[ind]}
      pageIsActive={thisPageIsActive}
      itemNumber={itemNumber}
      attemptNumber={attemptNumber}
      flags={flags}
      activityVariantIndex={variantIndex}
      requestedVariantIndex={variantsByPage[ind]}
      unbundledCore={props.unbundledCore}
      updateCreditAchievedCallback={props.updateCreditAchievedCallback}
      setIsInErrorState={props.setIsInErrorState}
      updateAttemptNumber={props.updateAttemptNumber}
      saveStateCallback={receivedSaveFromPage}
      updateDataOnContentChange={props.updateDataOnContentChange}
      coreCreatedCallback={() => coreCreatedCallback(ind)}
      pagePrerenderedCallback={(x) => pagePrerenderedCallback(ind, x)}
      hideWhenInactive={props.paginate}
      prefixForIds={prefixForIds}
    />

    if (!props.paginate) {
      pageViewer = <VisibilitySensor partialVisibility={true} offset={{ top: -200, bottom: -200 }} requireContentsSize={false} onChange={(isVisible) => onChangeVisibility(isVisible, ind)}>
        <div>
          {pageViewer}
        </div>
      </VisibilitySensor>
    }

    pages.push(
      <div key={`page${ind + 1}`} id={`page${ind + 1}`}>
        {pageViewer}
      </div>
    )
  }

  let cidChangedAlert = null;
  if (cidChanged) {
    cidChangedAlert = <div>
      <button onClick={() => alert("Hey, content changed")}>content changed</button>
    </div>
  }

  let pageControls = null;
  if (props.paginate && nPages > 1) {
    pageControls = <>
      <button data-test={"previous"} disabled={currentPage === 1} onClick={clickPrevious}>Previous page</button>
      <button data-test={"next"} disabled={currentPage === nPages} onClick={clickNext}>Next page</button>
      <p>Page {currentPage} of {nPages}</p>
    </>
  }

  return <div style={{ paddingBottom: "50vh" }} id="activityTop" ref={nodeRef}>
    {cidChangedAlert}
    {pageControls}
    {title}
    {pages}
  </div>
}


function determineOrder(order, rng) {

  if (order?.type?.toLowerCase() !== "order") {
    return { success: false, message: "invalid order" }
  }

  let behavior = order.behavior?.toLowerCase();

  if (behavior === undefined) {
    behavior = 'sequence';
  }

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

async function initializeComponentTypeCounts(order) {

  let previousComponentTypeCountsByPage = [{}];

  let componentInfoObjects = createComponentInfoObjects();

  for (let [ind, page] of order.slice(0, order.length - 1).entries()) {

    let { fullSerializedComponents } = await expandDoenetMLsToFullSerializedComponents({
      contentIds: [page.cid],
      doenetMLs: [page.doenetML],
      componentInfoObjects,
    });

    let serializedComponents = fullSerializedComponents[0];

    addDocumentIfItsMissing(serializedComponents);

    let documentChildren = serializedComponents[0].children;

    let componentTypeCounts = countComponentTypes(documentChildren);

    let countsSoFar = previousComponentTypeCountsByPage[ind];
    for (let cType in countsSoFar) {
      if (cType in componentTypeCounts) {
        componentTypeCounts[cType] += countsSoFar[cType];
      } else {
        componentTypeCounts[cType] = countsSoFar[cType];
      }
    }

    previousComponentTypeCountsByPage.push(componentTypeCounts);

  }

  return previousComponentTypeCountsByPage;
}