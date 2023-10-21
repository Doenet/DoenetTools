import React, { useCallback, useEffect, useRef, useState } from "react";
import { retrieveTextFileForCid } from "../Core/utils/retrieveTextFile";
import { PageViewer } from "./PageViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { get as idb_get, set as idb_set } from "idb-keyval";
import { cidFromText } from "../Core/utils/cid";
import { nanoid } from "nanoid";
import {
  calculateOrderAndVariants,
  parseActivityDefinition,
} from "../_utils/activityUtils";
import VisibilitySensor from "react-visibility-sensor-v2";
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import Button from "../_reactComponents/PanelHeaderComponents/Button";
import ActionButton from "../_reactComponents/PanelHeaderComponents/ActionButton";
import ButtonGroup from "../_reactComponents/PanelHeaderComponents/ButtonGroup";
import { pageToolViewAtom } from "../Tools/_framework/NewToolRoot";
import { clear as idb_clear } from "idb-keyval";
import { cesc } from "../_utils/url";
import { returnAllPossibleVariants } from "../Core/utils/returnAllPossibleVariants";
import {
  findAllNewlines,
  getLineCharRange,
  printDoenetMLrange,
} from "../Core/utils/logging";
import { AlertQueue } from "../Tools/_framework/ChakraBasedComponents/AlertQueue";

export function ActivityViewer({
  doenetML: doenetMLFromProps,
  updateDataOnContentChange = false,
  flags,
  cid: cidFromProps,
  activityId,
  userId,
  attemptNumber: attemptNumberFromProps,
  requestedVariantIndex: requestedVariantIndexFromProps,
  updateCreditAchievedCallback,
  updateActivityStatusCallback,
  updateAttemptNumber,
  pageChangedCallback,
  paginate,
  showFinishButton,
  cidChangedCallback,
  checkIfCidChanged,
  setActivityAsCompleted,
  setIsInErrorState,
  apiURLs = {},
  generatedVariantCallback,
  setErrorsAndWarningsCallback,
  forceDisable,
  forceShowCorrectness,
  forceShowSolution,
  forceUnsuppressCheckwork,
  location = {},
  navigate,
  idsIncludeActivityId = true,
  linkSettings,
  addBottomPadding = true,
  scrollableContainer = window,
  darkMode,
  sendAlert: sendAlertFromProps,
}) {
  const [errMsg, setErrMsg] = useState(null);

  const [
    {
      lastCidFromProps,
      lastDoenetMLFromProps,
      attemptNumber,
      requestedVariantIndex,
    },
    setInfoFromProps,
  ] = useState({
    lastCidFromProps: null,
    lastDoenetMLFromProps: null,
    attemptNumber: null,
    requestedVariantIndex: null,
  });

  const attemptNumberRef = useRef(null);
  attemptNumberRef.current = attemptNumber;

  const [cid, setCid] = useState(null);
  const cidRef = useRef(null);
  cidRef.current = cid;

  const doenetML = useRef(null);

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

  const [currentPage, setCurrentPage] = useState(0);
  const currentPageRef = useRef(currentPage); // so that event listener can get new current page
  currentPageRef.current = currentPage; // so updates on every refresh

  const [activityAttemptNumberSetUp, setActivityAttemptNumberSetUp] =
    useState(0);

  const [nPages, setNPages] = useState(0);

  const [variantsByPage, setVariantsByPage] = useState(null);
  const [itemWeights, setItemWeights] = useState([]);
  const previousComponentTypeCountsByPage = useRef([]);

  const serverSaveId = useRef(null);

  const activityStateToBeSavedToDatabase = useRef(null);
  const changesToBeSaved = useRef(false);

  const saveStateToDBTimerId = useRef(null);

  const activityInfo = useRef(null);
  const activityInfoString = useRef(null);
  const pageAtPreviousSave = useRef(null);
  const pageAtPreviousSaveToDatabase = useRef(null);

  const [pageInfo, setPageInfo] = useState({
    pageIsVisible: [],
    pageIsActive: [],
    pageCoreWorker: [],
    waitingForPagesCore: null,
  });

  let [alerts, setAlerts] = useState([]);

  const [renderedPages, setRenderedPages] = useState([]);
  const allPagesRendered = useRef(false);

  const nodeRef = useRef(null);
  const ignoreNextScroll = useRef(false);
  const stillNeedToScrollTo = useRef(null);

  let hash = location.hash;
  const previousLocations = useRef({});
  const currentLocationKey = useRef(null);
  const viewerWasUnmounted = useRef(false);

  const [finishAssessmentMessageOpen, setFinishAssessmentMessageOpen] =
    useState(false);
  const [processingSubmitAll, setProcessingSubmitAll] = useState(false);

  const errorsAndWarningsByPage = useRef([]);
  const errorsActivitySpecific = useRef([]);
  const sendAlert = useRef(null);

  let activityPrefix = "";
  let activityPrefixUnescaped = "";
  if (idsIncludeActivityId) {
    activityPrefixUnescaped = activityId;
    activityPrefix = cesc(activityId);
  }

  useEffect(() => {
    return () => {
      saveState({ overrideThrottle: true });
      viewerWasUnmounted.current = true;
    };
  }, []);

  useEffect(() => {
    updateActivityStatusCallback?.({
      itemWeights,
      currentPage,
      activityAttemptNumberSetUp,
    });
  }, [
    updateActivityStatusCallback,
    itemWeights,
    currentPage,
    activityAttemptNumberSetUp,
  ]);

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
    itemWeights,
  ]);

  useEffect(() => {
    if (typeof sendAlertFromProps === "function") {
      sendAlert.current = sendAlertFromProps;
    } else {
      sendAlert.current = function ({
        message,
        alertType,
        id = "defaultAlertId",
      }) {
        setAlerts((prev) => {
          let next = prev.filter((x) => x.id !== id);
          next.push({
            type: alertType,
            id,
            title: message,
          });
          return next;
        });
      };
    }
  }, [sendAlertFromProps]);

  function scrollListener() {
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
        setCurrentPage(topPage);
      }
    }
  }

  useEffect(() => {
    // for non-paginated activity
    // set the current page to be the page at the top of the screen
    // will be used to set the url hash

    if (!paginate && nPages > 1) {
      scrollableContainer.addEventListener("scroll", scrollListener);
    } else {
      scrollableContainer.removeEventListener("scroll", scrollListener);
    }
  }, [paginate, nPages]);

  useEffect(() => {
    pageChangedCallback?.(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (hash && nPages) {
      let match = hash.match(/^#page(\d+)/);
      if (match) {
        let newPage = Math.max(1, Math.min(nPages, match[1]));
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
        }
      }
    }
  }, [hash, nPages]);

  useEffect(() => {
    if (currentPage > 0 && nPages > 1) {
      let hashPage = Number(hash?.match(/^#page(\d+)/)?.[1]);
      if (hashPage !== currentPage) {
        let pageAnchor = `#page${currentPage}`;
        // if we have moved to a page that does not correspond to the hash
        // modify the hash to match the page.
        let navigateAttrs = { replace: true };
        if (!paginate) {
          // If not paginated, then do not scroll to the top of the page,
          // as the page change could be triggered by scrolling

          navigateAttrs.state = { doNotScroll: true };
        }
        navigate?.(location.search + pageAnchor, navigateAttrs);
      }
      if (stillNeedToScrollTo.current) {
        document.getElementById(stillNeedToScrollTo.current)?.scrollIntoView();
        stillNeedToScrollTo.current = null;
      }
    }
  }, [currentPage, nPages]);

  useEffect(() => {
    if (allPagesRendered.current && !paginate && hash?.match(/^#page(\d+)$/)) {
      ignoreNextScroll.current = true;
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [allPagesRendered.current]);

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
      if (
        location.state?.previousScrollPosition !== undefined &&
        currentLocationKey.current
      ) {
        previousLocations.current[
          currentLocationKey.current
        ].lastScrollPosition = location.state.previousScrollPosition;
      }

      if (previousLocations.current[location.key]) {
        foundNewInPrevious = true;

        if (
          previousLocations.current[location.key]?.lastScrollPosition !==
          undefined
        ) {
          scrollableContainer.scroll({
            top: previousLocations.current[location.key].lastScrollPosition,
          });
        }
      }

      previousLocations.current[location.key] = { ...location };
      currentLocationKey.current = location.key;
    }

    stillNeedToScrollTo.current = null;

    // since the <Link> from react router doesn't seem to scroll into hashes
    // always scroll to the hash the first time we get a location from a <Link>
    if (
      hash &&
      !location.state?.doNotScroll &&
      (location.key === "default" || !foundNewInPrevious)
    ) {
      let scrollTo = hash.slice(1);
      if (paginate && hash.match(/^#page(\d+)$/)) {
        // if paginate, want to scroll to top of activity so can still see page controls
        scrollTo = `${activityPrefix}top`;
      }
      if (paginate && Number(hash.match(/^#page(\d+)/)?.[1]) !== currentPage) {
        stillNeedToScrollTo.current = scrollTo;
      } else {
        document.getElementById(scrollTo)?.scrollIntoView();
      }
    }
  }, [location]);

  function resetActivity({ changedOnDevice, newCid, newAttemptNumber }) {
    console.log("resetActivity", changedOnDevice, newCid, newAttemptNumber);

    if (newAttemptNumber !== attemptNumber) {
      if (updateAttemptNumber) {
        // TODO: this seems to be happening when it wasn't supposed to so removed it for now.
        // Make sure this happens only in this case and then add the alert back

        // sendAlert.current({
        //   message: `Reverted activity as attempt number changed on other device`,
        //   alertType: "info",
        // });
        updateAttemptNumber(newAttemptNumber);
      } else {
        // what do we do in this case?
        setIsInErrorState?.(true);
        setErrMsg(
          "how to reset attempt number when not given updateAttemptNumber function?",
        );
      }
    } else if (newCid !== cid) {
      setIsInErrorState?.(true);
      setErrMsg("Content changed unexpectedly!");
    } else {
      // since, at least for now, only activity state is page number,
      // we ignore the change
    }

    // sendAlert.current(`Reverted page to state saved on device ${changedOnDevice}`, "error");
  }

  async function calculateCidDefinition() {
    let cid;

    if (typeof lastDoenetMLFromProps === "string" || !lastCidFromProps) {
      // If we were given doenetML as a prop, we'll calculate cid from the doenetML.
      // Also if were not given either doenetML or cid, then we'll calculate cid from a blank string doenetML.

      const doenetMLOrEmptyString =
        typeof lastDoenetMLFromProps === "string" ? lastDoenetMLFromProps : "";
      cid = await cidFromText(lastDoenetMLFromProps);

      // If were given both doenetML and cid as a prop and the doenetML doesn't match the cid,
      // then put in error state
      if (lastCidFromProps && cid !== lastCidFromProps) {
        setIsInErrorState?.(true);
        setErrMsg(
          `activity definition did not match specified cid: ${lastCidFromProps}`,
        );
        return;
      }

      doenetML.current = doenetMLOrEmptyString;
    } else {
      // We were given cid as a prop (but not doenetML).
      // Attempt to retrieve the doenetML corresponding to the cid.
      try {
        doenetML.current = await retrieveTextFileForCid(
          lastCidFromProps,
          "doenet",
        );
      } catch (e) {
        setIsInErrorState?.(true);
        setErrMsg(`activity definition not found for cid: ${lastCidFromProps}`);
        return;
      }
      cid = lastCidFromProps;
    }

    setCid(cid);

    // at this point, doenetML.current is set, so we parse it to get the JSON for the activity definition
    let result = await parseActivityDefinition(doenetML.current, cid);

    if (result.errors.length > 0) {
      let doenetMLNewlines = findAllNewlines(doenetML.current);
      for (let err of result.errors) {
        if (err.doenetMLrange && err.doenetMLrange.lineBegin === undefined) {
          Object.assign(
            err.doenetMLrange,
            getLineCharRange(err.doenetMLrange, doenetMLNewlines),
          );
        }
      }
    }

    errorsActivitySpecific.current = result.errors;

    setActivityDefinition(result.activityJSON);
    setStage("continue");
  }

  async function loadState() {
    let loadedState = false;
    let newItemWeights;
    let newVariantIndex;
    let loadedFromInitialState = false;

    if (flags.allowLocalState) {
      let localInfo;

      try {
        localInfo = await idb_get(`${activityId}|${attemptNumber}|${cid}`);
      } catch (e) {
        // ignore error
      }

      if (localInfo) {
        if (flags.allowSaveState) {
          // attempt to save local info to database,
          // reseting data to that from database if it has changed since last save

          let result = await saveLoadedLocalStateToDatabase(localInfo);

          if (result.changedOnDevice) {
            if (Number(result.newAttemptNumber) !== attemptNumber) {
              resetActivity({
                changedOnDevice: result.changedOnDevice,
                newCid: result.newCid,
                newAttemptNumber: Number(result.newAttemptNumber),
              });
              return;
            } else if (result.newCid !== cid) {
              // if cid changes for the same attempt number, then something went wrong
              setIsInErrorState?.(true);
              setErrMsg(`content changed unexpectedly!`);
            }

            // if just the localInfo changed, use that instead
            localInfo = result.newLocalInfo;

            // no need to send sendAlert, as state is just page number
          }
        }

        serverSaveId.current = localInfo.saveId;

        // activityState is just currentPage
        // if hash doesn't already specify a page, set page from activityState
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(localInfo.activityState.currentPage);
        }

        // activityInfo is orderWithCids, variantsByPage, itemWeights, and numVariants
        let newActivityInfo = localInfo.activityInfo;
        newVariantIndex = localInfo.variantIndex;
        setVariantIndex(newVariantIndex);
        setNPages(newActivityInfo.orderWithCids.length);
        setOrder(await normalizeLoadedOrder(newActivityInfo.orderWithCids));
        setVariantsByPage(newActivityInfo.variantsByPage);
        setItemWeights(newActivityInfo.itemWeights);
        newItemWeights = newActivityInfo.itemWeights;
        previousComponentTypeCountsByPage.current =
          newActivityInfo.previousComponentTypeCounts || [];

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
          activityId,
          userId,
          allowLoadState: flags.allowLoadState,
        },
      };

      let resp;

      if (apiURLs.loadActivityState) {
        try {
          resp = await axios.get(apiURLs.loadActivityState, payload);

          if (!resp.data.success) {
            if (flags.allowLoadState) {
              setIsInErrorState?.(true);
              setErrMsg(`Error loading activity state: ${resp.data.message}`);
              return;
            } else {
              // ignore this error if didn't allow loading of page state
            }
          }
        } catch (e) {
          if (flags.allowLoadState) {
            setIsInErrorState?.(true);
            setErrMsg(`Error loading activity state: ${e.message}`);
            return;
          } else {
            // ignore this error if didn't allow loading of page state
          }
        }
      }

      if (resp?.data.loadedState) {
        let newActivityInfo = JSON.parse(resp.data.activityInfo);
        let activityState = JSON.parse(resp.data.activityState);

        // activityState is just currentPage
        // if hash doesn't already specify a page, set page from activityState
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(activityState.currentPage);
        }

        // activityInfo is orderWithCids, variantsByPage, itemWeights, and numVariants
        newVariantIndex = resp.data.variantIndex;
        setVariantIndex(newVariantIndex);
        setNPages(newActivityInfo.orderWithCids.length);
        setOrder(await normalizeLoadedOrder(newActivityInfo.orderWithCids));
        setVariantsByPage(newActivityInfo.variantsByPage);
        setItemWeights(newActivityInfo.itemWeights);
        newItemWeights = newActivityInfo.itemWeights;
        previousComponentTypeCountsByPage.current =
          newActivityInfo.previousComponentTypeCounts || [];

        activityInfo.current = newActivityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);
      } else {
        // get initial state and info

        loadedFromInitialState = true;

        // start at page 1
        // if hash doesn't already specify a page, set page to 1
        if (!hash?.match(/^#page(\d+)/)) {
          setCurrentPage(1);
        }

        let results = await calculateOrderAndVariants({
          activityDefinition,
          requestedVariantIndex,
        });

        if (results.errors.length > 0) {
          let doenetMLNewlines = findAllNewlines(doenetML.current);
          for (let err of results.errors) {
            if (
              err.doenetMLrange &&
              err.doenetMLrange.lineBegin === undefined
            ) {
              Object.assign(
                err.doenetMLrange,
                getLineCharRange(err.doenetMLrange, doenetMLNewlines),
              );
            }
          }
        }

        errorsActivitySpecific.current.push(...results.errors);

        newVariantIndex = results.variantIndex;
        setVariantIndex(newVariantIndex);
        setNPages(results.order.length);
        setOrder(results.order);
        setVariantsByPage(results.variantsByPage);
        setItemWeights(results.itemWeights);
        newItemWeights = results.itemWeights;
        previousComponentTypeCountsByPage.current =
          results.previousComponentTypeCounts || [];

        activityInfo.current = results.activityInfo;
        activityInfoString.current = JSON.stringify(activityInfo.current);
      }
    }

    return { newItemWeights, newVariantIndex, loadedFromInitialState };
  }

  async function normalizeLoadedOrder(order) {
    // In case we load an order from the data base that was created before Sept 1, 2023,
    // we need to check if the page has a doneetML attribute,
    // and load the doenetML if needed

    let newOrder = [];

    for (let page of order) {
      if (page.doenetML === undefined) {
        page.doenetML = await retrieveTextFileForCid(page.cid, "doenet");
      }
      newOrder.push(page);
    }

    return newOrder;
  }

  async function saveLoadedLocalStateToDatabase(localInfo) {
    if (!flags.allowSaveState || !apiURLs.saveActivityState) {
      return;
    }

    let serverSaveId = await idb_get(
      `${activityId}|${attemptNumber}|${cid}|ServerSaveId`,
    );

    let activityStateToBeSavedToDatabase = {
      cid,
      activityInfo: JSON.stringify(localInfo.activityInfo),
      activityState: JSON.stringify(localInfo.activityState),
      variantIndex: localInfo.variantIndex,
      attemptNumber,
      activityId,
      saveId: localInfo.saveId,
      serverSaveId,
      updateDataOnContentChange,
    };

    let resp;

    try {
      console.log(
        "first one saveActivityState activityStateToBeSavedToDatabase",
        activityStateToBeSavedToDatabase,
      );
      resp = await axios.post(
        apiURLs.saveActivityState,
        activityStateToBeSavedToDatabase,
      );
    } catch (e) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    if (resp.data.cidChanged === true) {
      cidChangedCallback?.();
    }

    let data = resp.data;

    if (!data.success) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    await idb_set(
      `${activityId}|${attemptNumber}|${cid}|ServerSaveId`,
      data.saveId,
    );

    if (data.stateOverwritten) {
      let newLocalInfo = {
        activityState: JSON.parse(data.activityState),
        activityInfo: JSON.parse(data.activityInfo),
        saveId: data.saveId,
        variantIndex: data.variantIndex,
      };

      await idb_set(
        `${activityId}|${data.attemptNumber}|${data.cid}`,
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

  async function saveState({
    overrideThrottle = false,
    overrideStage = false,
  } = {}) {
    if (!flags.allowSaveState && !flags.allowLocalState) {
      return;
    }

    if (
      (stageRef.current !== "saving" && !overrideStage) ||
      (!overrideThrottle &&
        currentPageRef.current === pageAtPreviousSave.current) ||
      (overrideThrottle &&
        currentPageRef.current === pageAtPreviousSaveToDatabase.current)
    ) {
      // haven't gotten a save event from page or no change to be saved
      return;
    }

    pageAtPreviousSave.current = currentPageRef.current;

    let saveId = nanoid();

    if (flags.allowLocalState) {
      await idb_set(
        `${activityId}|${attemptNumberRef.current}|${cidRef.current}`,
        {
          activityInfo: activityInfo.current,
          activityState: { currentPage: currentPageRef.current },
          saveId,
          variantIndex: variantIndexRef.current,
        },
      );
    }

    if (!flags.allowSaveState) {
      return;
    }

    activityStateToBeSavedToDatabase.current = {
      cid: cidRef.current,
      activityInfo: activityInfoString.current,
      activityState: JSON.stringify({ currentPage: currentPageRef.current }),
      variantIndex: variantIndexRef.current,
      attemptNumber: attemptNumberRef.current,
      activityId,
      saveId,
      serverSaveId: serverSaveId.current,
      updateDataOnContentChange,
    };

    // mark presence of changes
    // so that next call to saveChangesToDatabase will save changes
    changesToBeSaved.current = true;

    // if not currently in throttle, save changes to database
    await saveChangesToDatabase(overrideThrottle);
  }

  async function saveChangesToDatabase(overrideThrottle) {
    // throttle save to database at 60 seconds

    if (
      !changesToBeSaved.current ||
      !flags.allowSaveState ||
      !apiURLs.saveActivityState
    ) {
      return;
    }

    // get the up-to-date value here without a refresh!!

    // just use the ref

    let oldTimeoutId = saveStateToDBTimerId.current;

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
    saveStateToDBTimerId.current = setTimeout(() => {
      saveStateToDBTimerId.current = null;
      saveChangesToDatabase();
    }, 60000);

    // TODO: find out how to test if not online
    // and send this sendAlert if not online:

    let resp;

    try {
      console.log(
        "activity state params",
        activityStateToBeSavedToDatabase.current,
      );
      resp = await axios.post(
        apiURLs.saveActivityState,
        activityStateToBeSavedToDatabase.current,
      );
    } catch (e) {
      console.log(
        `sending sendAlert: Error synchronizing data.  Changes not saved to the server.`,
      );
      sendAlert.current({
        message: "Error synchronizing data.  Changes not saved to the server.",
        alertType: "error",
      });
      return;
    }

    console.log("result from saving activity to database:", resp.data);

    if (resp.status === null) {
      console.log(
        `sending sendAlert: Error synchronizing data.  Changes not saved to the server.  Are you connected to the internet?`,
      );
      sendAlert.current({
        message:
          "Error synchronizing data.  Changes not saved to the server.  Are you connected to the internet?",
        alertType: "error",
      });
      return;
    }

    let data = resp.data;

    if (!data.success) {
      console.log(`sending sendAlert: ${data.message}`);
      sendAlert.current({ message: data.message, alertType: "error" });
      return;
    }

    serverSaveId.current = data.saveId;

    if (flags.allowLocalState) {
      await idb_set(
        `${activityId}|${attemptNumberRef.current}|${cidRef.current}|ServerSaveId`,
        data.saveId,
      );
    }

    if (data.stateOverwritten) {
      // if a new attempt number was generated,
      // then we reset the activity to the new state
      if (attemptNumberRef.current !== Number(data.attemptNumber)) {
        resetActivity({
          changedOnDevice: data.device,
          newCid: data.cid,
          newAttemptNumber: Number(data.attemptNumber),
        });
      } else if (cidRef.current !== data.cid) {
        // if the cid changed without the attemptNumber changing, something went wrong
        setIsInErrorState?.(true);
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
    if (flags.allowSaveSubmissions && apiURLs.initAssignmentAttempt) {
      try {
        let resp = await axios.post(apiURLs.initAssignmentAttempt, {
          activityId,
          weights: newItemWeights,
          attemptNumber,
        });

        if (resp.status === null) {
          sendAlert.current({
            message: `Could not initialize assignment tables.  Are you connected to the internet?`,
            alertType: "error",
          });
        } else if (!resp.data.success) {
          sendAlert.current(
            `Could not initialize assignment tables: ${resp.data.message}.`,
            "error",
          );
        }
      } catch (e) {
        sendAlert.current({
          message: `Could not initialize assignment tables: ${e.message}.`,
          alertType: "error",
        });
      }
    }
  }

  async function receivedSaveFromPage() {
    // activity state isn't saved until a first save from a page
    if (stage !== "saving" && !settingUp.current) {
      setStage("saving");
    }

    checkIfCidChanged?.(cid);

    if (viewerWasUnmounted.current) {
      await saveState({ overrideThrottle: true, overrideStage: true });
    }
  }

  function clickNext() {
    setCurrentPage((was) => Math.min(nPages, was + 1));

    let event = {
      verb: "interacted",
      object: { objectType: "button", objectname: "next page button" },
      result: { newPage: Math.min(nPages, currentPage + 1) },
      context: { oldPage: currentPage },
    };

    recordEvent(event);
  }

  function clickPrevious() {
    setCurrentPage((was) => Math.max(1, was - 1));

    let event = {
      verb: "interacted",
      object: { objectType: "button", objectname: "previous page button" },
      result: { newPage: Math.max(1, currentPage - 1) },
      context: { oldPage: currentPage },
    };

    recordEvent(event);
  }

  function recordEvent(event) {
    if (!flags.allowSaveEvents || !apiURLs.recordEvent) {
      return;
    }

    const payload = {
      activityId,
      cidForActivity: cid,
      attemptNumber,
      activityVariantIndex: variantIndex,
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      version: "0.1.1",
      verb: event.verb,
      object: JSON.stringify(event.object),
      result: JSON.stringify(event.result),
      context: JSON.stringify(event.context),
    };

    axios
      .post(apiURLs.recordEvent, payload)
      .then((resp) => {
        // console.log(">>>>Activity Viewer resp",resp.data)
      })
      .catch((e) => {
        console.error(`Error saving event: ${e.message}`);
      });
  }

  function onChangeVisibility(isVisible, pageInd) {
    if (!paginate) {
      setPageInfo((was) => {
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
      });
    }
  }

  function coreCreatedCallback(pageInd, coreWorker) {
    setPageInfo((was) => {
      let newObj = { ...was };
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

    if (
      newRenderedPages?.length === nPages &&
      newRenderedPages.every((x) => x)
    ) {
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

        terminatePromises.push(
          new Promise((resolve, reject) => {
            resolveTerminatePromise = resolve;
          }),
        );

        let submitAllAndTerminateListener = function (e) {
          if (
            e.data.messageType === "resolveAction" &&
            e.data.args.actionId === actionId
          ) {
            // posting terminate will make sure page state gets saved
            // (as navigating to another URL will not initiate a state save)
            coreWorker.postMessage({
              messageType: "terminate",
            });
          } else if (e.data.messageType === "terminated") {
            coreWorker.removeEventListener(
              "message",
              submitAllAndTerminateListener,
            );

            // resolve promise
            resolveTerminatePromise();
          }
        };

        coreWorker.addEventListener("message", submitAllAndTerminateListener);

        coreWorker.postMessage({
          messageType: "submitAllAnswers",
          args: { actionId },
        });
      }
    }

    try {
      await Promise.all(terminatePromises);

      await saveState({ overrideThrottle: true });
    } catch (e) {
      sendAlert.current(
        `Error occurred. Assessment was not successfully submitted.`,
        "error",
      );

      // return so don't set activity as completed
      return;
    }

    setActivityAsCompleted?.();
  }

  function setPageErrorsAndWarningsCallback(errorsAndWarnings, pageind) {
    errorsAndWarningsByPage.current[pageind] = errorsAndWarnings;

    setErrorsAndWarningsCallback?.(collateErrorsAndWarnings());
  }

  function collateErrorsAndWarnings() {
    let allErrors = [...errorsActivitySpecific.current];

    let allWarnings = [];

    for (let errWarn of errorsAndWarningsByPage.current) {
      if (errWarn) {
        allErrors.push(...errWarn.errors);
        allWarnings.push(...errWarn.warnings);
      }
    }

    return {
      errors: allErrors,
      warnings: allWarnings,
    };
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

  if (pageInfo.waitingForPagesCore === null) {
    // check current page first
    if (currentPage) {
      for (let pageInd of [currentPage - 1, ...Array(nPages).keys()]) {
        let isVisible = pageInfo.pageIsVisible[pageInd];
        if (
          (isVisible || currentPage === pageInd + 1) &&
          !pageInfo.pageIsActive[pageInd]
        ) {
          // activate either the current page or an inactive page that is visible

          // if we need to create core
          // then stop here to not create multiple cores at once
          let waitingAgain = !pageInfo.pageCoreWorker[pageInd];

          setPageInfo((was) => {
            let newObj = { ...was };
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

  if (
    lastDoenetMLFromProps !== doenetMLFromProps ||
    lastCidFromProps !== cidFromProps ||
    attemptNumber !== attemptNumberFromProps ||
    requestedVariantIndex !== requestedVariantIndexFromProps
  ) {
    settingUp.current = true;

    setInfoFromProps({
      lastDoenetMLFromProps: doenetMLFromProps,
      lastCidFromProps: cidFromProps,
      attemptNumber: attemptNumberFromProps,
      requestedVariantIndex: requestedVariantIndexFromProps,
    });

    errorsAndWarningsByPage.current = [];
    errorsActivitySpecific.current = [];

    // if in a timeout to save changes from a previous instance,
    // cancel that timeout
    let oldTimeoutId = saveStateToDBTimerId.current;
    if (oldTimeoutId !== null) {
      clearTimeout(oldTimeoutId);
    }

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

  // at this point, we have
  // attemptNumber, requestedVariantIndex, cid, activityDefinition

  if (activityDefinition?.type?.toLowerCase() !== "activity") {
    setIsInErrorState?.(true);
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

        let allPossibleVariants;
        if (
          activityDefinition.numVariants === undefined &&
          activityDefinition.children.length === 1 &&
          activityDefinition.children[0].type === "page"
        ) {
          // if have a single page, then use the names of the variants
          // defined for that page (rather than the default of numbering them)
          let page = activityDefinition.children[0];

          // TODO: should we save these so we don't have to recalculate them?
          // Right now, if didn't load state, then we calculated this twice
          // as call returnAllPossibleVariants in loadState
          allPossibleVariants = await returnAllPossibleVariants({
            doenetML: page.doenetML,
            serializedComponents: page.children,
          });
        }

        if (!allPossibleVariants) {
          allPossibleVariants = [
            ...Array(activityInfo.current.numVariants).keys(),
          ].map((i) => String(i + 1));
        }

        generatedVariantCallback?.({
          index: Number(results.newVariantIndex), // TODO: is Number is needed?
          numVariants: activityInfo.current.numVariants,
          allPossibleVariants,
        });
      }
      settingUp.current = false;
    });

    return null;
  }

  saveState();

  let title = <h1>{activityDefinition.title}</h1>;

  let pages = [];

  if (order && variantsByPage) {
    for (let [ind, page] of order.entries()) {
      let thisPageIsActive = false;
      if (paginate) {
        if (ind === currentPage - 1) {
          // the current page is always active
          thisPageIsActive = true;
        } else if (
          pageInfo.pageCoreWorker[currentPage - 1] &&
          ind === currentPage
        ) {
          // if the current page already has core created, activate next page
          thisPageIsActive = true;
        } else if (
          pageInfo.pageCoreWorker[currentPage - 1] &&
          (currentPage === nPages || pageInfo.pageCoreWorker[currentPage]) &&
          ind === currentPage - 2
        ) {
          // if current page and page after current page (if exists) already have current page
          // activate previous page
          thisPageIsActive = true;
        }
      } else {
        // pageIsActive is used only if not paginated
        thisPageIsActive = pageInfo.pageIsActive[ind];
      }

      let prefixForIds =
        activityPrefixUnescaped + (nPages > 1 ? `page${ind + 1}` : "");

      let pageViewer = (
        <PageViewer
          userId={userId}
          activityId={activityId}
          cidForActivity={cid}
          cid={page.cid}
          doenetML={page.doenetML}
          preliminarySerializedComponents={page.children}
          pageNumber={(ind + 1).toString()}
          previousComponentTypeCounts={
            previousComponentTypeCountsByPage.current[ind]
          }
          pageIsActive={thisPageIsActive}
          pageIsCurrent={ind === currentPage - 1}
          itemNumber={ind + 1}
          attemptNumber={attemptNumber}
          forceDisable={forceDisable}
          forceShowCorrectness={forceShowCorrectness}
          forceShowSolution={forceShowSolution}
          forceUnsuppressCheckwork={forceUnsuppressCheckwork}
          // generatedVariantCallback={generatedVariantCallback}
          flags={flags}
          activityVariantIndex={variantIndex}
          requestedVariantIndex={variantsByPage[ind]}
          setErrorsAndWarningsCallback={(x) =>
            setPageErrorsAndWarningsCallback(x, ind)
          }
          updateCreditAchievedCallback={updateCreditAchievedCallback}
          setIsInErrorState={setIsInErrorState}
          sendAlert={sendAlert.current}
          updateAttemptNumber={updateAttemptNumber}
          saveStateCallback={receivedSaveFromPage}
          updateDataOnContentChange={updateDataOnContentChange}
          coreCreatedCallback={(coreWorker) =>
            coreCreatedCallback(ind, coreWorker)
          }
          renderersInitializedCallback={() => pageRenderedCallback(ind)}
          hideWhenNotCurrent={paginate}
          prefixForIds={prefixForIds}
          apiURLs={apiURLs}
          location={location}
          navigate={navigate}
          linkSettings={linkSettings}
          errorsActivitySpecific={errorsActivitySpecific.current}
          scrollableContainer={scrollableContainer}
          darkMode={darkMode}
        />
      );

      if (!paginate) {
        pageViewer = (
          <VisibilitySensor
            partialVisibility={true}
            offset={{ top: -200, bottom: -200 }}
            requireContentsSize={false}
            onChange={(isVisible) => onChangeVisibility(isVisible, ind)}
          >
            <div>{pageViewer}</div>
          </VisibilitySensor>
        );
      }

      pages.push(
        <div key={`page${ind + 1}`} id={`page${ind + 1}`}>
          {pageViewer}
        </div>,
      );
    }
  }

  let pageControlsTop = null;
  let pageControlsBottom = null;
  if (paginate && nPages > 1) {
    pageControlsTop = (
      <div style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}>
        <Button
          dataTest={"previous"}
          disabled={currentPage === 1}
          onClick={clickPrevious}
          value="Previous page"
        ></Button>
        <p style={{ margin: "5px" }}>
          {} Page {currentPage} of {nPages} {}
        </p>
        <Button
          dataTest={"next"}
          disabled={currentPage === nPages}
          onClick={clickNext}
          value="Next page"
        ></Button>
      </div>
    );

    if (renderedPages[currentPage - 1]) {
      pageControlsBottom = (
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}
        >
          <Button
            dataTest={"previous-bottom"}
            disabled={currentPage === 1}
            onClick={clickPrevious}
            value="Previous page"
          ></Button>
          <p style={{ margin: "5px" }}>
            {} Page {currentPage} of {nPages} {}
          </p>
          <Button
            dataTest={"next-bottom"}
            disabled={currentPage === nPages}
            onClick={clickNext}
            value="Next page"
          ></Button>
        </div>
      );
    }
  }

  let finishAssessmentPrompt = null;

  if (showFinishButton) {
    if (finishAssessmentMessageOpen) {
      finishAssessmentPrompt = (
        <div
          style={{
            marginLeft: "1px",
            marginRight: "5px",
            marginBottom: "5px",
            marginTop: "80px",
            border: "var(--mainBorder)",
            borderRadius: "var(--mainBorderRadius)",
            padding: "5px",
            display: "flex",
            flexFlow: "column wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            Are you sure you want to finish this assessment?
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            <ButtonGroup>
              <Button
                onClick={submitAllAndFinishAssessment}
                dataTest="ConfirmFinishAssessment"
                value="Yes"
                disabled={processingSubmitAll}
              ></Button>
              <Button
                onClick={() => setFinishAssessmentMessageOpen(false)}
                dataTest="CancelFinishAssessment"
                value="No"
                alert
                disabled={processingSubmitAll}
              ></Button>
            </ButtonGroup>
          </div>
        </div>
      );
    } else {
      finishAssessmentPrompt = (
        <div
          style={{
            marginLeft: "1px",
            marginRight: "5px",
            marginBottom: "5px",
            marginTop: "80px",
          }}
        >
          <div
            data-test="centerone"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ width: "240px" }}>
              <ActionButton
                onClick={() => setFinishAssessmentMessageOpen(true)}
                dataTest="FinishAssessmentPrompt"
                value="Finish assessment"
              ></ActionButton>
            </div>
          </div>
        </div>
      );
    }
  }

  let paddingStyle = {};
  if (addBottomPadding) {
    paddingStyle.paddingBottom = "50vh";
  }

  let activityErrors = null;
  if (errorsActivitySpecific.current.length > 0) {
    const errorsToDisplay = errorsActivitySpecific.current.filter(
      (x) => x.displayInActivity,
    );
    let errorStyle = {
      backgroundColor: "#ff9999",
      textAlign: "center",
      borderWidth: 3,
      borderStyle: "solid",
    };
    activityErrors = errorsToDisplay.map((err, i) => {
      let rangeMessage = null;
      if (err.doenetMLrange?.lineBegin !== undefined) {
        rangeMessage = (
          <>
            <br />
            <em>{"Found on " + printDoenetMLrange(err.doenetMLrange) + "."}</em>
          </>
        );
      }

      return (
        <div style={errorStyle} key={i}>
          <b>Error</b>: {err.message}
          {rangeMessage}
        </div>
      );
    });
  }

  return (
    <div style={paddingStyle} id={`${activityPrefix}top`} ref={nodeRef}>
      <AlertQueue alerts={alerts} setAlerts={setAlerts} />
      {activityErrors}
      {pageControlsTop}
      {title}
      {pages}
      {pageControlsBottom}
      {finishAssessmentPrompt}
    </div>
  );
}
