import axios from "../../_snowpack/pkg/axios.js";
import { cidFromText } from "./cid.js";
import { retrieveTextFileForCid } from "./retrieveTextFile.js";
import { serializedComponentsReplacer } from "./serializedStateProcessing.js";

onmessage = function (e) {

  if (e.data.messageType === "saveInitialRendererStates") {

    saveInitialRendererStates(e.data.args);

  }
}

export async function saveInitialRendererStates({ doenetML, cid, doenetId, nVariants, flags = {} }) {

  if (doenetML === undefined) {
    doenetML = await retrieveTextFileForCid(cid, "doenet");
  } else {
    let cidCalc = await cidFromText(doenetML);
    if (!cid) {
      cid = cidCalc;
    } else if (cid !== cidCalc) {
      throw Error(`cid mismatch: ${cid}, ${cidCalc}`)
    }
  }


  for (let variantIndex = 1; variantIndex <= nVariants; variantIndex++) {
    let { coreInfo, rendererState } = await calculateInitialRendererState({ doenetML, cid, doenetId, requestedVariantIndex: variantIndex, flags });
    console.log(`generated initial renderer state for variant ${variantIndex} of ${nVariants}`);

    let payload = {
      doenetId, cid, variantIndex,
      rendererState: JSON.stringify(rendererState, serializedComponentsReplacer),
      coreInfo: JSON.stringify(coreInfo, serializedComponentsReplacer)
    }

    try {
      let resp = await axios.post('/api/saveInitialRendererState.php', payload);

      if (!resp.data.success) {
        console.error(`Couldn't save initial renderer state: ${resp.data.message}`);
        postMessage({ messageType: "finished" });
        return;
      }

      if (resp.data.message) {
        console.log(`Initial renderer state not saved: ${resp.data.message}`);
      }

    } catch (e) {
      console.error(`Couldn't save initial renderer state: ${e.message}`)
      postMessage({ messageType: "finished" });
      return;
    }
  }

  postMessage({ messageType: "finished" });

}

function calculateInitialRendererState({ doenetML, cid, doenetId, requestedVariantIndex, flags = {} }) {

  let coreWorker = new Worker('../../viewer/core.js', { type: 'module' });

  coreWorker.postMessage({
    messageType: "createCore",
    args: {
      doenetML,
      cid,
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