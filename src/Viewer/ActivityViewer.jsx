import React, { useEffect, useRef, useState } from 'react';
import { retrieveTextFileForCID } from '../Core/utils/retrieveTextFile';
import PageViewer from './PageViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { prng_alea } from 'esm-seedrandom';
import Button from '../_reactComponents/PanelHeaderComponents/Button';
import { returnAllPossibleVariants } from '../Core/utils/returnAllPossibleVariants';

let rngClass = prng_alea;

export default function ActivityViewer(props) {

  const [errMsg, setErrMsg] = useState(null);

  const [activityDefinitionFromProps, setActivityDefinitionFromProps] = useState(null);
  const [CID, setCID] = useState(null);
  const [activityDefinition, setActivityDefinition] = useState(null);

  const [attemptNumber, setAttemptNumber] = useState(null);

  const [requestedVariantIndex, setRequestedVariantIndex] = useState(null);

  const [stage, setStage] = useState('initial');

  const [order, setOrder] = useState(null);

  const [flags, setFlags] = useState(props.flags);

  const [seed, setSeed] = useState(null);
  const rng = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [nPages, setNPages] = useState(1);

  const [variantsByPage, setVariantsByPage] = useState(null);



  useEffect(() => {

    let newFlags = { ...props.flags };
    if (props.userId) {
      newFlags.allowLocalPageState = false;
      newFlags.allowSavePageState = false;
    } else if (newFlags.allowSavePageState) {
      // allowSavePageState implies allowLoadPageState
      newFlags.allowLoadPageState = true;
    }

    setFlags(newFlags);

  }, [props.userId, props.flags]);


  async function getVariantsByPage() {

    let promises = [];

    for (let page of order) {
      promises.push(returnAllPossibleVariants({
        CID: page.CID, flags
      }));
    }

    let allPossibleVariantsByPage = await Promise.all(promises);

    console.log('allPossibleVariantsByPage', allPossibleVariantsByPage);
    console.log('rng', rng)

    let chosenVariants = [];

    for (let possibleVariants of allPossibleVariantsByPage) {
      let nVariants = possibleVariants.allPossibleVariants.length;

      let variantIndex = Math.floor(rng.current() * nVariants) + 1;

      chosenVariants.push(variantIndex);

    }

    setVariantsByPage(chosenVariants);
    setStage("continue");

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
  if (CID !== props.CID) {
    setCID(props.CID);
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

  // return null so that don't need to make a special case of props and state
  // but can use state from now on
  if (changedState) {
    setStage('regenerateDef')
    return null;
  }

  if (stage === "waiting") {
    return null;
  }

  // at this point, we have 
  // attemptNumber, requestedVariantIndex, CID, activityDefinitionFromProps

  if (stage === "regenerateDef") {
    setStage("waiting");
    // regenerate activityDefinition and CID from activityDefinitionFromProps and/or CID
    if (activityDefinitionFromProps) {
      // if have actual activity definition, then ignore CID
      // (since stringifying JSON may not result is same text as used for the CID)
      setActivityDefinition(activityDefinitionFromProps);
      setOrder(null);
      setStage("continue");
    } else if (CID) {
      setActivityDefinition(null);
      retrieveTextFileForCID(CID, "json").then(activityDefinitionString => {
        setActivityDefinition(JSON.parse(activityDefinitionString));
        setOrder(null);
        setStage("continue");
      })
    } else {

      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg("Must specify CID or activity definition");
    }

    return null;
  }

  if (!activityDefinition) {
    return null;
  }

  if (activityDefinition.type.toLowerCase() !== "activity") {
    if (props.setIsInErrorState) {
      props.setIsInErrorState(true)
    }
    setErrMsg("Invalid activity definition");
    return null;
  }

  console.log(order)

  if (order === null) {
    let seed = determineVariantSeed(activityDefinition, requestedVariantIndex);
    setSeed(determineVariantSeed(activityDefinition, requestedVariantIndex));
    rng.current = new rngClass(seed);

    console.log('rng', rng.current)

    let orderResult = determineOrder(activityDefinition.order, rng.current);

    console.log(orderResult)

    if (!orderResult.success) {

      if (props.setIsInErrorState) {
        props.setIsInErrorState(true)
      }
      setErrMsg(orderResult.message);
      return null;
    }

    let pages = orderResult.pages;
    setOrder(pages);
    setNPages(pages.length);
    setVariantsByPage(null);

    return null;

  }


  if (variantsByPage === null) {
    setStage("waiting");

    getVariantsByPage();

    return null;

  }



  let title = <h1>{activityDefinition.title}</h1>



  let pages = [];

  for (let [ind, page] of order.entries()) {

    console.log(`requestedVariant for page ${ind+1}: ${variantsByPage[ind]}`)
    pages.push(
      <div key={`page${ind}`}>
        <h2>Page {ind + 1}</h2>

        <PageViewer
          doenetId={props.doenetId}
          CID={page.CID}
          pageId={(ind + 1).toString()}
          pageIsActive={ind + 1 === currentPage}
          attemptNumber={attemptNumber}
          flags={flags}
          requestedVariant={{ index: variantsByPage[ind] }}
          unbundledCore={props.unbundledCore}
          updateCreditAchievedCallback={props.updateCreditAchievedCallback}
          setIsInErrorState={props.setIsInErrorState}
          updatePageDataOnContentChange={props.updatePageDataOnContentChange}
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

  console.log(`selectedSeed: ${selectedSeed}`);


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
