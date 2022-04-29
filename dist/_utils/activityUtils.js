import { returnAllPossibleVariants } from "../core/utils/returnAllPossibleVariants.js";
import { parseAndCompile } from "../parser/parser.js";

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

    let foundOrder = false;

    // remove blank string children
    let documentChildren = serializedDefinition.children
      .filter(x => typeof x !== "string" || /\S/.test(x))

    for (let child of documentChildren) {
      if (child.componentType?.toLowerCase() === "order") {
        if (foundOrder) {
          return { success: false, message: `Invalid activity definition: more than one base order defined` };
        }

        foundOrder = true;

        let result = validateOrder(child);

        if (!result.success) {
          return { success: false, message: `Invalid activity definition: ${result.message}` };
        }

        jsonDefinition.order = result.order;

      } else {
        return { success: false, message: `Invalid activity definition: invalid child of type ${child.componentType}` };
      }

    }

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



export async function determineNumberOfActivityVariants(activityDefinition) {
  let numberOfVariants = 1000;
  let pageVariantsResult = null;

  if (activityDefinition.numberOfVariants !== undefined) {
    numberOfVariants = activityDefinition.numberOfVariants;
    if (!(Number.isInteger(numberOfVariants) && numberOfVariants >= 1)) {
      numberOfVariants = 1000;
    }

  } else if (activityDefinition.order.behavior === "sequence" &&
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
