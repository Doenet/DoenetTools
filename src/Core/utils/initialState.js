import axios from "axios";
import { CIDFromText } from "./cid";
import { retrieveTextFileForCID } from "./retrieveTextFile";
import { serializedComponentsReplacer } from "./serializedStateProcessing";

onmessage = function (e) {

  if (e.data.messageType === "saveInitialRendererStates") {

    saveInitialRendererStates(e.data.args);

  }
}

export async function saveInitialRendererStates({ doenetML, CID, doenetId, nVariants, flags = {} }) {

  if (doenetML === undefined) {
    doenetML = await retrieveTextFileForCID(CID, "doenet");
  } else {
    let CIDcalc = await CIDFromText(doenetML);
    if (!CID) {
      CID = CIDcalc;
    } else if (CID !== CIDcalc) {
      throw Error(`CID mismatch: ${CID}, ${CIDcalc}`)
    }
  }


  for (let variantIndex = 1; variantIndex <= nVariants; variantIndex++) {
    let { coreInfo, rendererState } = await calculateInitialRendererState({ doenetML, CID, doenetId, requestedVariantIndex: variantIndex, flags });
    console.log(`generated initial renderer state for variant ${variantIndex} of ${nVariants}`);

    let payload = {
      doenetId, CID, variantIndex,
      rendererState: JSON.stringify(rendererState, serializedComponentsReplacer),
      coreInfo: JSON.stringify(coreInfo, serializedComponentsReplacer)
    }

    try {
      let resp = await axios.post('/api/saveInitialRendererState.php', payload);

      if (!resp.data.success) {
        console.error(`Couldn't save initial renderer state: ${resp.data.message}`);
        return;
      }

      if(resp.data.message) {
        console.log(`Initial renderer state not saved: ${resp.data.message}`);
      }

    } catch (e) {
      console.error(`Couldn't save initial renderer state: ${e.message}`)
      return;
    }
  }

}

function calculateInitialRendererState({ doenetML, CID, doenetId, requestedVariantIndex, flags = {} }) {

  let coreWorker = new Worker('../../viewer/core.js', { type: 'module' });

  coreWorker.postMessage({
    messageType: "createCore",
    args: {
      doenetML,
      CID,
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
      for (let instruction of e.data.args) {
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