import React, { useEffect, useRef, useState } from 'react';
import { retrieveTextFileForCid } from '../Core/utils/retrieveTextFile';
import PageViewer, { scrollableContainerAtom } from './PageViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { get as idb_get, set as idb_set } from 'idb-keyval';
import { cidFromText } from '../Core/utils/cid';
import { useToast, toastType } from '@Toast';
import { nanoid } from 'nanoid';
import { calculateOrderAndVariants, parseActivityDefinition } from '../_utils/activityUtils';
import VisibilitySensor from 'react-visibility-sensor-v2';
import { useLocation, useNavigate } from 'react-router';
import cssesc from 'cssesc';
import { atom, useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';
import Button from '../_reactComponents/PanelHeaderComponents/Button';
import ActionButton from '../_reactComponents/PanelHeaderComponents/ActionButton';
import ButtonGroup from '../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { pageToolViewAtom } from '../Tools/_framework/NewToolRoot';

export const saveStateToDBTimerIdAtom = atom({
  key: "saveStateToDBTimerIdAtom",
  default: null
})


export const currentPageAtom = atom({
  key: "currentPageAtom",
  default: 0
})

export const activityAttemptNumberSetUpAtom = atom({
  key: "activityAttemptNumberSetUpAtom",
  default: 0
})

export const itemWeightsAtom = atom({
  key: "itemWeightsAtom",
  default: []
})

export default function ActivityViewer(props) {
  const toast = useToast();
  const setPageToolView = useSetRecoilState(pageToolViewAtom);


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

  const [stage, setStage] = useState('initial');
  const stageRef = useRef(null);
  stageRef.current = stage;

  const settingUp = useRef(true);

  const [activityContentChanged, setActivityContentChanged] = useState(false);

  const [order, setOrder] = useState(null);

  const [flags, setFlags] = useState(props.flags);

  const [currentPage, setCurrentPage] = useState(0);
  const setRecoilCurrentPage = useSetRecoilState(currentPageAtom);
  const currentPageRef = useRef(currentPage);  // so that event listener can get new current page
  currentPageRef.current = currentPage; // so updates on every refresh

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
  })


  const [renderedPages, setRenderedPages] = useState([])
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
      saveState({ overrideThrottle: true });
      viewerWasUnmounted.current = true;
    }
  }, [])

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
  ])

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
              setRecoilCurrentPage(topPage)
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
        let newPage = Math.max(1, Math.min(nPages, match[1]));
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
          setRecoilCurrentPage(newPage);
        }
      }
    }
  }, [hash, nPages])

  useEffect(() => {
    if (currentPage > 0 && nPages > 1) {
      let hashPage = Number(hash?.match(/^#page(\d+)/)?.[1]);
      if (hashPage !== currentPage) {
        let pageAnchor = `#page${currentPage}`;
        // if we have moved to a page that does not correspond to the hash
        // modify the hash to match the page.
        let navigateAttrs = { replace: true }
        if (!props.paginate) {
          // If not paginated, then do not scroll to the top of the page,
          // as the page change could be triggered by scrolling

          navigateAttrs.state = { doNotScroll: true }
        }
        navigate(location.search + pageAnchor, navigateAttrs)
      }
      if (stillNeedToScrollTo.current) {
        document.getElementById(stillNeedToScrollTo.current)?.scrollIntoView();
        stillNeedToScrollTo.current = null;

      }
    }
  }, [currentPage, nPages])

  useEffect(() => {
    if (allPagesRendered.current && !props.paginate && hash?.match(/^#page(\d+)$/)) {
      ignoreNextScroll.current = true;
      document.getElementById(cssesc(hash.slice(1)))?.scrollIntoView();
    }
  }, [allPagesRendered.current])

  useEffect(() => {
    // Keep track of scroll position when clicked on a link
    // If navigate back to that location (i.e., hit back button)
    // then scroll back to the location when clicked

    // console.log({
    //   currentLocationKey: currentLocationKey.current,
    //   newLocationKey: location.key,
    //   scrollPositionFromLink: location.state?.previousScrollPosition,
    //   newScrollPosition: previousLocations.current[location.key]?.lastScrollPosition
    // })

    let foundNewInPrevious = false;

    if (currentLocationKey.current !== location.key) {
      if (location.state?.previousScrollPosition !== undefined && currentLocationKey.current) {
        previousLocations.current[currentLocationKey.current].lastScrollPosition = location.state.previousScrollPosition
      }

      if (previousLocations.current[location.key]) {
        foundNewInPrevious = true;

        if (previousLocations.current[location.key]?.lastScrollPosition !== undefined) {
          scrollableContainer.scroll({ top: previousLocations.current[location.key].lastScrollPosition })
        }
      }


      previousLocations.current[location.key] = { ...location };
      currentLocationKey.current = location.key;
    }

    stillNeedToScrollTo.current = null;

    // since the <Link> from react router doesn't seem to scroll into hashes
    // always scroll to the hash the first time we get a location from a <Link>
    if (!location.state?.doNotScroll && (location.key === "default" || !foundNewInPrevious)) {
      let scrollTo = cssesc(hash.slice(1));
      if (props.paginate && hash.match(/^#page(\d+)$/)) {
        // if paginate, want to scroll to top of activity so can still see page controls
        scrollTo = 'activityTop';
      }
      if (props.paginate && Number(hash.match(/^#page(\d+)/)?.[1]) !== currentPage) {
        stillNeedToScrollTo.current = scrollTo;
      } else {
        document.getElementById(scrollTo)?.scrollIntoView();
      }

    }

  }, [location])

  const getValueOfTimeoutWithoutARefresh = useRecoilCallback(({ snapshot }) => async () => {
    return await snapshot.getPromise(saveStateToDBTimerIdAtom)
  }, [saveStateToDBTimerIdAtom])


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
    let loadedFromInitialState = false;

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
        // if hash doesn't already specify a page, set page from activityState
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(localInfo.activityState.currentPage);
          setRecoilCurrentPage(localInfo.activityState.currentPage);
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
      // still call loadActivityState, in which case it will only retrieve the initial activity state


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
        // if hash doesn't already specify a page, set page from activityState
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(activityState.currentPage);
          setRecoilCurrentPage(activityState.currentPage);
        }

        // activityInfo is orderWithCids, variantsByPage, itemWeights, and numberOfVariants
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

        // get initial state and info

        loadedFromInitialState = true;

        // start at page 1
        // if hash doesn't already specify a page, set page to 1
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(1);
          setRecoilCurrentPage(1);
        }

        let results;
        results = await calculateOrderAndVariants({ activityDefinition, requestedVariantIndex });
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


    return { newItemWeights, newVariantIndex, loadedFromInitialState };

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

    if (resp.data.cidChanged === true) {
      props.cidChangedCallback();
    }

    let data = resp.data;

    if (!data.success) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    await idb_set(
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

      await idb_set(
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


  async function saveState({ overrideThrottle = false, overrideStage = false } = {}) {

    if (!props.flags.allowSaveState && !props.flags.allowLocalState) {
      return;
    }


    if ((stageRef.current !== "saving" && !overrideStage)
      || (!overrideThrottle && currentPageRef.current === pageAtPreviousSave.current)
      || (overrideThrottle && currentPageRef.current === pageAtPreviousSaveToDatabase.current)
    ) {
      // haven't gotten a save event from page or no change to be saved
      return;
    }

    pageAtPreviousSave.current = currentPageRef.current;

    let saveId = nanoid();

    if (props.flags.allowLocalState) {
      await idb_set(
        `${props.doenetId}|${attemptNumberRef.current}|${cidRef.current}`,
        {
          activityInfo: activityInfo.current,
          activityState: { currentPage: currentPageRef.current },
          saveId,
          variantIndex: variantIndexRef.current,
        }
      )
    }

    if (!props.flags.allowSaveState) {
      return;
    }


    activityStateToBeSavedToDatabase.current = {
      cid: cidRef.current,
      activityInfo: activityInfoString.current,
      activityState: JSON.stringify({ currentPage: currentPageRef.current }),
      variantIndex: variantIndexRef.current,
      attemptNumber: attemptNumberRef.current,
      doenetId: props.doenetId,
      saveId,
      serverSaveId: serverSaveId.current,
      updateDataOnContentChange: props.updateDataOnContentChange,
    }

    // mark presence of changes
    // so that next call to saveChangesToDatabase will save changes
    changesToBeSaved.current = true;

    // if not currently in throttle, save changes to database
    await saveChangesToDatabase(overrideThrottle);


  }

  async function saveChangesToDatabase(overrideThrottle) {
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
    pageAtPreviousSaveToDatabase.current = currentPageRef.current;


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
      await idb_set(
        `${props.doenetId}|${attemptNumberRef.current}|${cidRef.current}|ServerSaveId`,
        data.saveId
      )
    }

    if (data.stateOverwritten) {

      // if a new attempt number was generated,
      // then we reset the activity to the new state
      if (attemptNumberRef.current !== Number(data.attemptNumber)) {

        resetActivity({
          changedOnDevice: data.device,
          newCid: data.cid,
          newAttemptNumber: Number(data.attemptNumber),
        })

      } else if (cidRef.current !== data.cid) {

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


      try {
        let resp = await axios.post('/api/initAssignmentAttempt.php', {
          doenetId: props.doenetId,
          weights: newItemWeights,
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

      if (resp.data.cidChanged === true) {
        props.cidChangedCallback();
      }

    } catch (e) {
      // ignore any errors
    }

    if (viewerWasUnmounted.current) {
      await saveState({ overrideThrottle: true, overrideStage: true });
    }

  }

  function clickNext() {
    setCurrentPage((was) => Math.min(nPages, was + 1));
    setRecoilCurrentPage((was) => Math.min(nPages, was + 1));

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
    setRecoilCurrentPage((was) => Math.max(1, was - 1));

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

  function coreCreatedCallback(pageInd, coreWorker) {
    setPageInfo(was => {
      let newObj = { ...was };
      if (newObj.waitingForPagesCore === pageInd) {
        newObj.waitingForPagesCore = null;
      }
      let newPageCoreWorker = [...newObj.pageCoreWorker];
      newPageCoreWorker[pageInd] = coreWorker;
      newObj.pageCoreWorker = newPageCoreWorker;

      return newObj;

    })

  }

  function pageRenderedCallback(pageInd) {
    let newRenderedPages;
    setRenderedPages(was => {
      newRenderedPages = [...was];
      newRenderedPages[pageInd] = true;
      return newRenderedPages;
    })

    if (newRenderedPages?.length === nPages && newRenderedPages.every(x => x)) {
      allPagesRendered.current = true;
    }

  }

  async function submitAllAndFinishAssessment() {

    setProcessingSubmitAll(true);
    
    let terminatePromises = [];

    for (let coreWorker of pageInfo.pageCoreWorker) {

      if (coreWorker) {
        let actionId = nanoid();
        let resolveTerminatePromise

        terminatePromises.push(new Promise((resolve, reject) => {
          resolveTerminatePromise = resolve;
        }));


        coreWorker.onmessage = function (e) {
          if (e.data.messageType === "resolveAction" && e.data.args.actionId === actionId) {

            // posting terminate will make sure page state gets saved
            // (as navigating to another URL will not initiate a state save)
            coreWorker.postMessage({
              messageType: "terminate"
            })

          } else if (e.data.messageType === "terminated") {
            // resolve promise
            resolveTerminatePromise();
          }
        }

        coreWorker.postMessage({
          messageType: "submitAllAnswers",
          args: { actionId }
        })


      }
    }

    await Promise.all(terminatePromises);

    await saveState({ overrideThrottle: true })

    // // TODO: what should this do in general?
    // window.location.href = `/exam?tool=endExam&doenetId=${props.doenetId}&attemptNumber=${attemptNumber}&itemWeights=${itemWeights.join(",")}`;
    setPageToolView((prev)=>{
      return {
        page:prev.page,
        tool: 'endExam',
        view: '',
        params: {
          doenetId:props.doenetId,
          attemptNumber,
          itemWeights:itemWeights.join(","),
        }
      }
    });
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
          let waitingAgain = !pageInfo.pageCoreWorker[pageInd];

          setPageInfo(was => {
            let newObj = { ...was };
            let newActive = [...newObj.pageIsActive];
            newActive[pageInd] = true;
            newObj.pageIsActive = newActive;
            if (!newObj.pageCoreWorker[pageInd]) {
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
    setActivityAttemptNumberSetUp(0);

    previousComponentTypeCountsByPage.current = [];

    setStage("wait");

    loadState().then(async results => {
      if (results) {
        if (results.loadedFromInitialState) {
          await initializeUserAssignmentTables(results.newItemWeights);
        }
        setStage('continue');
        setActivityAttemptNumberSetUp(attemptNumber)
        props.generatedVariantCallback?.(results.newVariantIndex, activityInfo.current.numberOfVariants);
      }
      settingUp.current = false;
    })

    return null;

  }


  saveState();

  let title = <h1>{activityDefinition.title}</h1>


  let pages = [];

  if (order && variantsByPage) {
    for (let [ind, page] of order.entries()) {


      let thisPageIsActive = false;
      if (props.paginate) {
        if (ind === currentPage - 1) {
          // the current page is always active
          thisPageIsActive = true;
        } else if (pageInfo.pageCoreWorker[currentPage - 1] && ind === currentPage) {
          // if the current page already has core created, activate next page
          thisPageIsActive = true;
        } else if (pageInfo.pageCoreWorker[currentPage - 1]
          && (currentPage === nPages || pageInfo.pageCoreWorker[currentPage])
          && ind === currentPage - 2
        ) {
          // if current page and page after current page (if exists) already have current page
          // activate previous page
          thisPageIsActive = true;
        }
      } else {
        // pageIsActive is used only if not paginated
        thisPageIsActive = pageInfo.pageIsActive[ind];
      }

      let prefixForIds = nPages > 1 ? `page${ind + 1}` : '';

      let pageViewer = <PageViewer
        userId={props.userId}
        doenetId={props.doenetId}
        activityCid={cid}
        cid={page.cid}
        doenetML={page.doenetML}
        pageNumber={(ind + 1).toString()}
        previousComponentTypeCounts={previousComponentTypeCountsByPage.current[ind]}
        pageIsActive={thisPageIsActive}
        pageIsCurrent={ind === currentPage - 1}
        itemNumber={ind + 1}
        attemptNumber={attemptNumber}
        forceDisable={props.forceDisable}
        forceShowCorrectness={props.forceShowCorrectness}
        forceShowSolution={props.forceShowSolution}
        flags={flags}
        activityVariantIndex={variantIndex}
        requestedVariantIndex={variantsByPage[ind]}
        unbundledCore={props.unbundledCore}
        updateCreditAchievedCallback={props.updateCreditAchievedCallback}
        setIsInErrorState={props.setIsInErrorState}
        updateAttemptNumber={props.updateAttemptNumber}
        saveStateCallback={receivedSaveFromPage}
        updateDataOnContentChange={props.updateDataOnContentChange}
        coreCreatedCallback={(coreWorker) => coreCreatedCallback(ind, coreWorker)}
        renderersInitializedCallback={() => pageRenderedCallback(ind)}
        hideWhenNotCurrent={props.paginate}
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
  }


  let pageControlsTop = null;
  let pageControlsBottom = null;
  if (props.paginate && nPages > 1) {
    pageControlsTop = <div style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}>
      <Button data-test={"previous"} disabled={currentPage === 1} onClick={clickPrevious} value="Previous page"></Button>
      <p style={{ margin: '5px' }}>{ } Page {currentPage} of {nPages} { }</p>
      <Button data-test={"next"} disabled={currentPage === nPages} onClick={clickNext} value="Next page"></Button>
    </div>

    if (renderedPages[currentPage - 1]) {
      pageControlsBottom = <div style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}>
        <Button data-test={"previous-bottom"} disabled={currentPage === 1} onClick={clickPrevious} value="Previous page"></Button>
        <p style={{ margin: '5px' }}>{ } Page {currentPage} of {nPages} { }</p>
        <Button data-test={"next-bottom"} disabled={currentPage === nPages} onClick={clickNext} value="Next page"></Button>
      </div>
    }

  }

  let finishAssessmentPrompt = null;

  if (props.showFinishButton) {
    if (finishAssessmentMessageOpen) {
      finishAssessmentPrompt = <div style={{ border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)", padding: "5px", margin: "5px", display: "flex", flexFlow: "column wrap" }}>
        Are you sure you want to finish this assessment?
        <div style={{ display: "flex", justifyContent: "center", padding: "5px" }}>
          <ButtonGroup>
            <Button onClick={submitAllAndFinishAssessment} data-test="ConfirmFinishAssessment" value="Yes" disabled={processingSubmitAll}></Button>
            <Button onClick={() => setFinishAssessmentMessageOpen(false)} data-test="CancelFinishAssessment" value="No" alert disabled={processingSubmitAll}></Button>
          </ButtonGroup>
        </div>

      </div>
    } else {
      finishAssessmentPrompt = <div style={{ marginLeft: "1px", marginRight: "5px", marginBottom: "5px", marginTop: "5px" }}>
        <ActionButton onClick={() => setFinishAssessmentMessageOpen(true)} data-test="FinishAssessmentPrompt" value="Finish assessment"></ActionButton>
      </div>
    }
  }

  return <div style={{ paddingBottom: "50vh" }} id="activityTop" ref={nodeRef}>
    {pageControlsTop}
    {title}
    {pages}
    {pageControlsBottom}
    {finishAssessmentPrompt}
  </div>
}
