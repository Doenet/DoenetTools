import React, { useEffect, useRef, useState } from 'react';
import { retrieveTextFileForCid } from '../Core/utils/retrieveTextFile';
import PageViewer from './PageViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { prng_alea } from 'esm-seedrandom';
import Button from '../_reactComponents/PanelHeaderComponents/Button';
import { returnAllPossibleVariants } from '../Core/utils/returnAllPossibleVariants';
import axios from 'axios';
import { get as idb_get, set as idb_set } from 'idb-keyval';
import { cidFromText } from '../Core/utils/cid';
import { useToast, toastType } from '@Toast';
import { nanoid } from 'nanoid';
import { parseAndCompile } from '../Parser/parser';

let rngClass = prng_alea;

export default function ActivityViewer(props) {
  const toast = useToast();

  const [errMsg, setErrMsg] = useState(null);

  const [cidFromProps, setCidFromProps] = useState(null);
  const [activityDefinitionFromProps, setActivityDefinitionFromProps] = useState(null);
  const [cid, setCid] = useState(null);

  const activityDefinitionDoenetML = useRef(null);
  const xmlns = useRef(null);

  const [activityDefinition, setActivityDefinition] = useState(null);

  const [attemptNumber, setAttemptNumber] = useState(null);

  const [requestedVariantIndex, setRequestedVariantIndex] = useState(null);
  const [variantIndex, setVariantIndex] = useState(null);

  const [stage, setStage] = useState('initial');

  const [activityContentChanged, setActivityContentChanged] = useState(false);

  const [order, setOrder] = useState(null);

  const [flags, setFlags] = useState(props.flags);

  const [currentPage, setCurrentPage] = useState(1);
  const [nPages, setNPages] = useState(1);

  const [variantsByItem, setVariantsByItem] = useState(null);
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
              parseActivityDefinition(activityDefinitionFromProps);
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
            parseActivityDefinition(activityDefinitionFromProps);
          })
      }
    } else {
      // if don't have activityDefinition, then retrieve activityDefinition from cid

      retrieveTextFileForCid(cidFromProps, "doenet")
        .then(retrievedActivityDefinition => {
          setCid(cidFromProps);
          parseActivityDefinition(retrievedActivityDefinition);
        })
        .catch(e => {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`activity definition not found for cid: ${cidFromProps}`);
        })
    }

  }

  function parseActivityDefinition(activityDef) {

    activityDefinitionDoenetML.current = activityDef;

    let serializedDefinition = parseAndCompile(activityDef)
      .filter(x => typeof x !== "string" || /\S/.test(x))

    if (serializedDefinition.length !== 1 || serializedDefinition[0].componentType !== "document") {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg(`Invalid activity definition`);
      return;
    }

    serializedDefinition = serializedDefinition[0];

    // make document props lowercase
    let documentProps = {};
    for (let prop in serializedDefinition.props) {
      let lowerProp = prop.toLowerCase();
      if (lowerProp in documentProps) {
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true)
        }
        setErrMsg(`Invalid activity definition: duplicate attribute ${lowerProp}`);
        return;
      }
      documentProps[prop.toLowerCase()] = serializedDefinition.props[prop];
    }

    if (documentProps.type.toLowerCase() === "activity") {
      let jsonDefinition = {
        type: "activity",
      };
      delete documentProps.type;

      if (documentProps.itemweights) {
        if (typeof documentProps.itemweights !== "string") {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`Invalid activity definition: invalid itemWeights`);
          return;
        }
        jsonDefinition.itemWeights = documentProps.itemweights
          .split(/\s+/)
          .filter(s => s)
          .map(Number);

        delete documentProps.itemweights;
      }

      jsonDefinition.shuffleItemWidths =
        documentProps.shuffleitemwidths !== undefined &&
        (documentProps.shuffleitemwidths === true ||
          documentProps.shuffleitemwidths.toLowerCase() === "true"
        );

      delete documentProps.shuffleitemwidths;

      if (documentProps.xmlns) {
        if (documentProps.xmlns.slice(0, 34) === "https://doenet.org/spec/doenetml/v") {
          jsonDefinition.version = documentProps.xmlns.slice(34);
          xmlns.current = documentProps.xmlns;
          delete documentProps.xmlns;
        } else {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`Invalid activity definition: unrecognized xmlns`);
          return;
        }
      } else {
        console.warn('no xmls of activity!');
      }

      if (Object.keys(documentProps).length > 0) {
        if (props.setIsInErrorState) {
          props.setIsInErrorState(true)
        }
        setErrMsg(`Invalid activity definition: invalid document attributes: ${Object.keys(documentProps).join(", ")}`);
        return;
      }

      let foundOrder = false;
      let foundVariantControl = false;

      // remove blank string children
      let documentChildren = serializedDefinition.children
        .filter(x => typeof x !== "string" || /\S/.test(x))

      for (let child of documentChildren) {
        if (child.componentType.toLowerCase() === "order") {
          if (foundOrder) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(`Invalid activity definition: more than one base order defined`);
            return;
          }

          foundOrder = true;

          let result = validateOrder(child);

          if (!result.success) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(`Invalid activity definition: ${result.message}`);
            return;
          }

          jsonDefinition.order = result.order;

        } else if (child.componentType.toLowerCase() === "variantcontrol") {

          if (foundVariantControl) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(`Invalid activity definition: more than one variantControl defined`);
            return;
          }

          foundVariantControl = true;

          let result = validateVariantControl(child);

          if (!result.success) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(`Invalid activity definition: ${result.message}`);
            return;
          }

          jsonDefinition.variantControl = result.variantControl;

        } else {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`Invalid activity definition: invalid child of type ${child.componentType}`);
          return;
        }

      }

      console.log('jsonDefinition', jsonDefinition);
      setActivityDefinition(jsonDefinition);
      setStage("continue");


    } else if (documentProps.type.toLowerCase() === "page") {


      let page = { type: "page" };

      if(cidFromProps) {
        page.cid = cidFromProps
      }
      if(activityDefinitionFromProps) {
        page.doenetML = activityDefinitionFromProps;
      }


      let jsonDefinition = {
        type: "activity",
        order: {
          type: "order",
          behavior: "sequence",
          content: [page]
        }
      }


      if (documentProps.xmlns) {
        if (documentProps.xmlns.slice(0, 34) === "https://doenet.org/spec/doenetml/v") {
          jsonDefinition.version = documentProps.xmlns.slice(34);
          delete documentProps.xmlns;
        } else {
          if (props.setIsInErrorState) {
            props.setIsInErrorState(true)
          }
          setErrMsg(`Invalid activity definition: unrecognized xmlns`);
          return;
        }
      } else {
        console.warn('no xmls of activity!');
      }


      // TODO: what to do about variant control?
      // It'd be great to have a way to map activity variants
      // directly to page variants
      // That way, we could preserve the exact variants specified in the page definition

      console.log("jsonDefinition", jsonDefinition)
      setActivityDefinition(jsonDefinition);
      setStage("continue");


    } else {
      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg(`Invalid activity definition`);
      return;
    }


  }

  function validateOrder(order) {
    let newOrder = { type: "order" };

    let orderProps = {};
    for (let prop in order.props) {
      let lowerProp = prop.toLowerCase();
      if (lowerProp in orderProps) {
        return {
          success: false,
          message: `duplicate attribute of order ${lowerProp}`
        }
      }
      orderProps[prop.toLowerCase()] = order.props[prop];
    }

    for (let prop in orderProps) {
      if (prop === "behavior") {
        newOrder.behavior = orderProps.behavior;
      } else if (prop == "numbertoselect") {
        newOrder.numberToSelect = Number(orderProps.numbertoselect);
      } else if (prop == "withreplacement") {
        newOrder.withReplacement =
          orderProps.withreplacement !== undefined &&
          (orderProps.withreplacement === true ||
            orderProps.withreplacement.toLowerCase() === "true"
          );
      } else {
        return {
          success: false,
          message: `invalid order attribute: ${prop}`
        }
      }
    }


    // remove blank string children
    let orderChildren = order.children
      .filter(x => typeof x !== "string" || /\S/.test(x));

    let content = [];
    for (let child of orderChildren) {
      if (child.componentType.toLowerCase() === "order") {
        let result = validateOrder(child);
        if (result.success) {
          content.push(result.order);
        } else {
          return result;
        }
      } else if (child.componentType.toLowerCase() == "page") {
        let result = validatePage(child);
        if (result.success) {
          content.push(result.page)
        } else {
          return result;
        }
      } else {
        return {
          success: false,
          message: `invalid child of order, found type: ${child.componentType}`
        }
      }
    }

    newOrder.content = content;

    return {
      success: true,
      order: newOrder
    }

  }


  function validatePage(page) {
    let newPage = { type: "page" };

    let pageProps = {};
    for (let prop in page.props) {
      let lowerProp = prop.toLowerCase();
      if (lowerProp in pageProps) {
        return {
          success: false,
          message: `duplicate attribute of page ${lowerProp}`
        }
      }
      pageProps[prop.toLowerCase()] = page.props[prop];
    }


    for (let prop in pageProps) {
      if (prop === "cid") {
        newPage.cid = pageProps.cid;
        delete pageProps.cid;
      } else {
        return {
          success: false,
          message: `invalid page attribute: ${prop}`
        }
      }
    }

    if (page.children.length > 0) {
      let pageDoenetML = activityDefinitionDoenetML.current.slice(page.range.openEnd+1, page.range.closeBegin);

      if(page.children[0].componentType.toLowerCase() !== "document")  {
        // add <docoument> around page
        let xmlnsprop = '';
        if(xmlns.current) {
          xmlnsprop = ` xmlns="${xmlns.current}"`
        }
        pageDoenetML = `<document type="page" ${xmlnsprop}>${pageDoenetML}</document>`;
      }

      newPage.doenetML = pageDoenetML;
    }

    return {
      success: true,
      page: newPage
    }
  }


  function validateVariantControl(variantControl) {
    let newVariantControl = {};

    let variantControlProps = {};
    for (let prop in variantControl.props) {
      let lowerProp = prop.toLowerCase();
      if (lowerProp in variantControlProps) {
        return {
          success: false,
          message: `duplicate attribute of variantControl ${lowerProp}`
        }
      }
      variantControlProps[prop.toLowerCase()] = variantControl.props[prop];
    }


    for (let prop in variantControlProps) {
      if (prop === "nvariants") {
        newVariantControl.nVariants = Number(variantControlProps.nvariants);
      } else if (prop === "seeds") {
        if (typeof variantControlProps.seeds !== "string") {
          return {
            success: false,
            message: "invalid seeds of variantControl"
          }
        }
        newVariantControl.seeds = variantControlProps.seeds
          .split(/\s+/)
          .filter(s => s);

      } else {
        return {
          success: false,
          message: `invalid variantControl attribute: ${prop}`
        }
      }
    }


    if (variantControl.children.length > 0) {
      return {
        success: false,
        message: "invalid variantControl: variantControl cannot have children"
      }
    }

    return {
      success: true,
      variantControl: newVariantControl
    }
  }

  async function loadState() {

    let loadedState = false;
    let newItemWeights;
    let newCurrentPage;

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
        newCurrentPage = localInfo.activityState.currentPage
        setCurrentPage(newCurrentPage);

        // activityInfo is orderWithCids and variantsByItem
        let newActivityInfo = localInfo.activityInfo;
        setVariantIndex(localInfo.variantIndex);
        setNPages(newActivityInfo.orderWithCids.length);
        setOrder(newActivityInfo.orderWithCids);
        setVariantsByItem(newActivityInfo.variantsByItem);
        setItemWeights(newActivityInfo.itemWeights);
        newItemWeights = newActivityInfo.itemWeights;


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

          let newActivityInfo = JSON.parse(resp.data.activityInfo);
          let activityState = JSON.parse(resp.data.activityState);

          // activityState is just currentPage
          newCurrentPage = activityState.currentPage;
          setCurrentPage(newCurrentPage);

          // activityInfo is orderWithCids and variantsByItem
          setVariantIndex(resp.data.variantIndex);
          setNPages(newActivityInfo.orderWithCids.length);
          setOrder(newActivityInfo.orderWithCids);
          setVariantsByItem(newActivityInfo.variantsByItem);
          setItemWeights(newActivityInfo.itemWeights);
          newItemWeights = newActivityInfo.itemWeights;


          activityInfo.current = newActivityInfo;
          activityInfoString.current = JSON.stringify(activityInfo.current);

        } else {

          // get initial state and info

          // state at page 1
          newCurrentPage = 1;
          setCurrentPage(1);

          let results = await calculateOrderAndVariants();
          if (!results.success) {
            if (props.setIsInErrorState) {
              props.setIsInErrorState(true)
            }
            setErrMsg(`Error loading activity state: ${results.message}`);
            return;
          }
          setVariantIndex(results.variantIndex);
          setNPages(results.order.length);
          setOrder(results.order);
          setVariantsByItem(results.variantsByItem);
          setItemWeights(results.itemWeights);
          newItemWeights = results.itemWeights;

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


    return { newItemWeights };

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
      resp = await axios.post('/api/saveActivityState.php', activityStateToBeSavedToDatabase);
    } catch (e) {
      // since this is initial load, don't show error message
      return { localInfo, cid, attemptNumber };
    }

    console.log('result from saving activity to db', resp.data)

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

    let variantSeed = determineVariantSeed(activityDefinition, requestedVariantIndex);

    let rng = new rngClass(variantSeed.seed);

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

    console.time('getContent');

    let promises = [];

    for (let page of originalOrder) {
      promises.push(returnAllPossibleVariants({
        cid: page.cid, doenetML: page.doenetML, flags
      }));
    }

    let variantsResult;

    try {
      variantsResult = await Promise.all(promises);
    } catch (e) {
      return { success: false, message: `Error retrieving content for activity. ${e.message}` };
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

    let activityInfo = {
      orderWithCids,
      variantsByItem: chosenVariants,
      itemWeights
    };

    return {
      success: true,
      order: newOrder,
      itemWeights,
      variantsByItem: chosenVariants,
      variantIndex: variantSeed.variantIndex,
      activityInfo
    };

  }

  async function saveState() {

    if (!props.flags.allowSaveState && !props.flags.allowLocalState) {
      return;
    }


    if (stage != "saving" || currentPage === pageAtPreviousSave.current) {
      // haven't got a save event from page or no change to be saved
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
    setStage("saving");

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


  if (errMsg !== null) {
    let errorIcon = <span style={{ fontSize: "1em", color: "#C1292E" }}><FontAwesomeIcon icon={faExclamationCircle} /></span>
    return <div style={{ fontSize: "1.3em", marginLeft: "20px", marginTop: "20px" }}>{errorIcon} {errMsg}</div>
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

    setStage("wait");

    loadState().then(results => {
      if (results) {
        initializeUserAssignmentTables(results.newItemWeights);
      }
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

    pages.push(
      <div key={`page${ind}`}>
        <PageViewer
          doenetId={props.doenetId}
          cid={page.cid}
          doenetML={page.doenetML}
          pageId={(ind + 1).toString()}
          pageIsActive={ind + 1 === currentPage}
          itemNumber={itemNumber}
          attemptNumber={attemptNumber}
          flags={flags}
          requestedVariant={{ index: variantsByItem[ind] }}
          unbundledCore={props.unbundledCore}
          updateCreditAchievedCallback={props.updateCreditAchievedCallback}
          setIsInErrorState={props.setIsInErrorState}
          updateAttemptNumber={props.updateAttemptNumber}
          saveStateCallback={receivedSaveFromPage}
          updateDataOnContentChange={props.updateDataOnContentChange}
        />

      </div>
    )
  }

  let cidChangedAlert = null;
  if (cidChanged) {
    cidChangedAlert = <div>
      <Button onClick={() => alert("Hey, content changed")} value={"content changed"} />
    </div>
  }

  return <div style={{ marginBottom: "200px" }}>
    {cidChangedAlert}
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

  let variantIndex = (requestedVariantIndex - 1) % nVariants + 1;

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

  let selectedSeed = seeds[variantIndex - 1];


  return { selectedSeed, variantIndex };

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
