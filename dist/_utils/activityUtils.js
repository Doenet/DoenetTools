import { prng_alea } from "../_snowpack/pkg/esm-seedrandom.js";
import { retrieveTextFileForCid } from "../core/utils/retrieveTextFile.js";
import { returnAllPossibleVariants } from "../core/utils/returnAllPossibleVariants.js";
import { parseAndCompile } from "../parser/parser.js";
import { enumerateCombinations } from '../core/utils/enumeration.js';
import createComponentInfoObjects from '../core/utils/componentInfoObjects.js';
import { addDocumentIfItsMissing, countComponentTypes, expandDoenetMLsToFullSerializedComponents } from '../core/utils/serializedStateProcessing.js';

let rngClass = prng_alea;

export function parseActivityDefinition(activityDefDoenetML) {

  let serializedDefinition = parseAndCompile(activityDefDoenetML)
    .filter(x => typeof x !== "string" || /\S/.test(x))

  if (serializedDefinition.length !== 1 || serializedDefinition[0].componentType !== "document") {
    return { success: false, message: `Invalid activity definition` }
  }

  serializedDefinition = serializedDefinition[0];

  // make document props lowercase
  let documentProps = {};
  for (let prop in serializedDefinition.props) {
    let lowerProp = prop.toLowerCase();
    if (lowerProp in documentProps) {
      return { success: false, message: `Invalid activity definition: duplicate attribute ${lowerProp}` };
    }
    documentProps[prop.toLowerCase()] = serializedDefinition.props[prop];
  }

  let xmlns;

  if (documentProps.type.toLowerCase() === "activity") {
    let jsonDefinition = {
      type: "activity",
    };
    delete documentProps.type;

    if (documentProps.itemweights) {
      if (typeof documentProps.itemweights !== "string") {
        return { success: false, message: `Invalid activity definition: invalid itemWeights` };
      }
      jsonDefinition.itemWeights = documentProps.itemweights
        .split(/\s+/)
        .filter(s => s)
        .map(Number);

      delete documentProps.itemweights;
    }

    jsonDefinition.shuffleItemWeights =
      documentProps.shuffleitemweights !== undefined &&
      (documentProps.shuffleitemweights === true ||
        documentProps.shuffleitemweights.toLowerCase() === "true"
      );

    delete documentProps.shuffleitemweights;

    jsonDefinition.isSinglePage =
      documentProps.issinglepage !== undefined &&
      (documentProps.issinglepage === true ||
        documentProps.issinglepage.toLowerCase() === "true"
      );

    delete documentProps.issinglepage;


    if (documentProps.xmlns) {
      if (documentProps.xmlns.slice(0, 34) === "https://doenet.org/spec/doenetml/v") {
        jsonDefinition.version = documentProps.xmlns.slice(34);
        xmlns = documentProps.xmlns;
        delete documentProps.xmlns;
      } else {
        return { success: false, message: `Invalid activity definition: unrecognized xmlns` };
      }
    } else {
      console.warn('no xmlns of activity!');
    }

    if (documentProps.numberofvariants) {
      jsonDefinition.numberOfVariants = Number(documentProps.numberofvariants);
      delete documentProps.numberofvariants;
    }

    if (Object.keys(documentProps).length > 0) {
      return { success: false, message: `Invalid activity definition: invalid document attributes: ${Object.keys(documentProps).join(", ")}` };
    }

    let fakeOrder = { type: "order", behavior: "sequence", children: serializedDefinition.children };
    let result = validateOrder(fakeOrder);

    if (!result.success) {
      return { success: false, message: `Invalid activity definition: ${result.message}` };
    }

    jsonDefinition.order = result.order;

    return { success: true, activityJSON: jsonDefinition }

  } else if (documentProps.type.toLowerCase() === "page") {

    let page = { type: "page", doenetML: activityDefDoenetML };

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
        return { success: false, message: `Invalid activity definition: unrecognized xmlns` };
      }
    } else {
      console.warn('no xmlns of activity!');
    }


    // TODO: what to do about variant control?
    // It'd be great to have a way to map activity variants
    // directly to page variants
    // That way, we could preserve the exact variants specified in the page definition

    return { success: true, activityJSON: jsonDefinition }

  } else {
    return { success: false, message: `Invalid activity definition` };
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
      let pageDoenetML = activityDefDoenetML.slice(page.range.openEnd + 1, page.range.closeBegin);

      if (page.children[0].componentType?.toLowerCase() !== "document") {
        // add <docoument> around page
        let xmlnsprop = '';
        if (xmlns) {
          xmlnsprop = ` xmlns="${xmlns}"`
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


}


export async function calculateOrderAndVariants({ activityDefinition, requestedVariantIndex }) {

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

export async function determineNumberOfActivityVariants(activityDefinition) {
  let numberOfVariants = 1000;
  let pageVariantsResult = null;

  if (activityDefinition.numberOfVariants !== undefined) {
    numberOfVariants = activityDefinition.numberOfVariants;
    if (!(Number.isInteger(numberOfVariants) && numberOfVariants >= 1)) {
      numberOfVariants = 1000;
    }

  } else if ((activityDefinition.order.behavior === undefined || activityDefinition.order.behavior === "sequence") &&
    activityDefinition.order.content.every(x => x.type === "page")
  ) {

    // determine number of variants from the pages

    let promises = [];
    for (let page of activityDefinition.order.content) {
      promises.push(returnAllPossibleVariants({
        cid: page.cid, doenetML: page.doenetML
      }));
    }

    pageVariantsResult = await Promise.all(promises);

    numberOfVariants = pageVariantsResult.reduce((a, c) => a * c.allPossibleVariants.length, 1)

    numberOfVariants = Math.min(1000, numberOfVariants);

  }


  return { numberOfVariants, pageVariantsResult };

}

export async function returnNumberOfActivityVariantsForCid(cid) {

  let activityDefinitionDoenetML = await retrieveTextFileForCid(cid);

  let result = parseActivityDefinition(activityDefinitionDoenetML);

  if (!result.success) {
    return result;
  }

  result = await determineNumberOfActivityVariants(result.activityJSON);

  return { success: true, numberOfVariants: result.numberOfVariants };
}


export function prerenderActivity({ cid, doenetId, flags }) {

  let worker = new Worker('/_utils/prerenderWorker.js', { type: 'module' });

  // console.log(`Prerendering activity`, cid, doenetId, flags, worker);

  worker.postMessage({
    messageType: "prerenderActivity",
    args: {
      cid,
      doenetId,
      flags
    }
  })


  worker.onmessage = function (e) {
    if (e.data.messageType === "finished") {
      worker.terminate();
    } else if (e.data.messageType === "error") {
      console.error(e.data.message)
      worker.terminate();
    }
  }

  return worker;

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