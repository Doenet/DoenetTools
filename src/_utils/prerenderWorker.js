import axios from "axios";
import { retrieveTextFileForCid } from "../Core/utils/retrieveTextFile";
import { serializedComponentsReplacer } from "../Core/utils/serializedStateProcessing";
import { calculateOrderAndVariants, determineNumberOfActivityVariants, parseActivityDefinition } from "./activityUtils";

onmessage = function (e) {

  if (e.data.messageType === "prerenderActivity") {

    console.log('got message', e.data)

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

  let variantsCalculatedByPage = {};

  postMessage({ messageType: "status", finished: 0, numberOfVariants });

  for (let variantIndex = 1; variantIndex <= numberOfVariants; variantIndex++) {

    let result = await calculateOrderAndVariants({ activityDefinition, requestedVariantIndex: variantIndex });

    if (!result.success) {
      console.error(`Couldn't save initial renderer state: ${result.message}`);
      continue;
    }

    let order = result.order;
    let variantsByPage = result.variantsByPage;



    for (let [pageInd, page] of order.entries()) {

      let variantsCalculated = variantsCalculatedByPage[page.cid];
      if (!variantsCalculated) {
        variantsCalculated = variantsCalculatedByPage[page.cid] = [];
      }

      let pageVariant = variantsByPage[pageInd];

      if (!variantsCalculated.includes(pageVariant)) {
        variantsCalculated.push(pageVariant);

        let { coreInfo, rendererState } = await calculateInitialRendererState({ doenetML: page.doenetML, doenetId, requestedVariantIndex: variantsByPage[pageInd], flags });
        console.log(`generated initial renderer state for variant ${variantsByPage[pageInd]} of page ${pageInd + 1}`);

        let payload = {
          doenetId, cid: page.cid, variantIndex,
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
      }


    }

    postMessage({ messageType: "status", finished: variantIndex, numberOfVariants });

  }

  postMessage({ messageType: "finished" });

}

function calculateInitialRendererState({ doenetML, doenetId, requestedVariantIndex, flags = {} }) {

  let coreWorker = new Worker('/viewer/core.js', { type: 'module' });

  coreWorker.postMessage({
    messageType: "createCore",
    args: {
      doenetML,
      doenetId,
      requestedVariantIndex,
      flags
    }
  })

  let resolveRenderState;
  let rendererStatePromise = new Promise((resolve, reject) => {
    resolveRenderState = resolve;
  });

  let rendererState = {};
  coreWorker.onmessage = function (e) {
    // console.log('message from core', e.data)
    if (e.data.messageType === "updateRenderers") {
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