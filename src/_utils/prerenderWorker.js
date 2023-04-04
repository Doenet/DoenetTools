import axios from "axios";
import { retrieveTextFileForCid } from "../Core/utils/retrieveTextFile";
import { serializedComponentsReplacer } from "../Core/utils/serializedStateProcessing";
import { calculateOrderAndVariants, determineNumberOfActivityVariants, parseActivityDefinition } from "./activityUtils";

onmessage = function (e) {

  if (e.data.messageType === "prerenderActivity") {
    prerenderActivity(e.data.args);
  }
}

async function prerenderActivity({ cid, doenetId, flags = {} }) {

  let activityDefDoenetML;

  try {
    activityDefDoenetML = await retrieveTextFileForCid(cid, "doenet");
  } catch (e) {
    postMessage({ messageType: "error", message: e.message });
    return;
  }


  let parseResult = parseActivityDefinition(activityDefDoenetML);

  if (!parseResult.success) {
    postMessage({ messageType: "error", message: parseResult.message });
    return;
  }

  let activityDefinition = parseResult.activityJSON;


  let { numberOfVariants } = await determineNumberOfActivityVariants(activityDefinition);


  postMessage({ messageType: "status", stage: "gathering", complete: 0 });

  // first determine all the pages and the variant indices needed for each page

  const variantsNeededByPage = {};
  const doenetMLByPage = {};


  for (let variantIndex = 1; variantIndex <= numberOfVariants; variantIndex++) {

    console.log(`Gathering ${variantIndex} of ${numberOfVariants}`);

    let result = await calculateOrderAndVariants({ activityDefinition, requestedVariantIndex: variantIndex });

    if (!result.success) {
      console.error(`Couldn't save initial renderer state: ${result.message}`);
      continue;
    }


    let order = result.order;
    let variantsByPage = result.variantsByPage;

    for (let [pageInd, page] of order.entries()) {

      let variantsNeeded = variantsNeededByPage[page.cid];
      if (!variantsNeeded) {
        variantsNeeded = variantsNeededByPage[page.cid] = [];
      }

      let pageVariant = variantsByPage[pageInd];
      if (!variantsNeeded.includes(pageVariant)) {
        variantsNeeded.push(pageVariant);
      }

      doenetMLByPage[page.cid] = page.doenetML;
    }

    if (variantIndex % 10 === 0) {
      postMessage({ messageType: "status", stage: "Gathering", complete: variantIndex / numberOfVariants });
    }

  }

  postMessage({ messageType: "status", stage: "Gathering", complete: 1 });

  let allCids = Object.keys(variantsNeededByPage);

  let payload = {
    doenetId,
    cids: allCids,
    showCorrectness: flags.showCorrectness,
    solutionDisplayMode: flags.solutionDisplayMode,
    showFeedback: flags.showFeedback,
    showHints: flags.showHints,
    autoSubmit: flags.autoSubmit,
  }


  let { data } = await axios.post('/api/getSavedInitialRendererStates.php', payload);

  if (!data.success) {
    console.error('Count not retrieve saved initial renderer states')
  } else {
    let foundVariants = data.foundVariants;

    for (let [ind, cid] of allCids.entries()) {

      let variantsNeeded = variantsNeededByPage[cid];
      for (let variant of foundVariants[ind]) {
        let varInd = variantsNeeded.indexOf(Number(variant))

        if (varInd !== -1) {
          variantsNeeded.splice(varInd, 1)
          if (variantsNeeded.length === 0) {
            delete variantsNeededByPage[cid];
          }
        }
      }
    }

  }


  let totalNVariants = Object.values(variantsNeededByPage).reduce((a, c) => a + c.length, 0)


  let nFinished = 0;

  postMessage({ messageType: "status", stage: "Rendering", complete: 0 });

  for (let cid in variantsNeededByPage) {
    console.log(`prerendering page with cid: ${cid}`);

    let doenetML = doenetMLByPage[cid];

    for (let requestedVariantIndex of variantsNeededByPage[cid]) {

      let { coreInfo, rendererState } = await calculateInitialRendererState({ doenetML, doenetId, requestedVariantIndex, flags });
      console.log(`variant ${requestedVariantIndex} prerendered`);

      let payload = {
        doenetId, cid, variantIndex: requestedVariantIndex,
        showCorrectness: flags.showCorrectness,
        solutionDisplayMode: flags.solutionDisplayMode,
        showFeedback: flags.showFeedback,
        showHints: flags.showHints,
        autoSubmit: flags.autoSubmit,
        rendererState: JSON.stringify(rendererState, serializedComponentsReplacer),
        coreInfo: JSON.stringify(coreInfo, serializedComponentsReplacer)
      }

      try {
        let resp = await axios.post('/api/saveInitialRendererState.php', payload);

        if (!resp.data.success) {
          console.error(`Couldn't save initial renderer state: ${resp.data.message}`);
        } else if (resp.data.message) {
          console.log(`Initial renderer state not saved: ${resp.data.message}`);
        }

      } catch (e) {
        console.error(`Couldn't save initial renderer state: ${e.message}`)
      }

      nFinished++;
      postMessage({ messageType: "status", stage: "Rendering", complete: nFinished / totalNVariants });
      console.log(`progress rendering: ${Math.round(nFinished / totalNVariants * 100)}%`)
    }
  }



  postMessage({ messageType: "finished" });

}

function calculateInitialRendererState({ doenetML, doenetId, requestedVariantIndex, flags = {} }) {

  let coreWorker = new Worker(new URL('../Core/CoreWorker.js', import.meta.url), { type: 'module' });

  coreWorker.postMessage({
    messageType: "createCore",
    args: {
      doenetML,
      doenetId,
      requestedVariantIndex,
      flags,
      prerender: true,
    }
  })

  let resolveRenderState;
  let rendererStatePromise = new Promise((resolve, reject) => {
    resolveRenderState = resolve;
  });

  let rendererState = {};
  coreWorker.onmessage = function (e) {
    // console.log('message from core', e.data)
    if (e.data.messageType === "updateRenderers" && e.data.init) {
      for (let instruction of e.data.args.updateInstructions) {
        if (instruction.instructionType === "updateRendererStates") {
          for (let { componentName, stateValues, childrenInstructions } of instruction.rendererStatesToUpdate
          ) {
            rendererState[componentName] = { stateValues, childrenInstructions }
          }
        }
      }
    } else if (e.data.messageType === "initializeRenderers") {
      let coreInfo = e.data.args.coreInfo;

      coreWorker.terminate();

      resolveRenderState({ coreInfo, rendererState });
    }
  }

  return rendererStatePromise;
}