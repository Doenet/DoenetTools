import React, {useEffect, useRef} from "../../_snowpack/pkg/react.js";
import DoenetViewer, {serializedComponentsReviver} from "../../viewer/DoenetViewer.js";
import {
  useRecoilValue,
  atom,
  atomFamily,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {
  itemHistoryAtom,
  fileByContentId
} from "../ToolHandlers/CourseToolHandler.js";
import {returnAllPossibleVariants} from "../../core/utils/returnAllPossibleVariants.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import axios from "../../_snowpack/pkg/axios.js";
const assignmentDoenetMLContentIdAtom = atom({
  key: "assignmentDoenetMLContentIdAtom",
  default: {isAssigned: null, doenetML: null, contentId: null}
});
export const variantsAndAttemptsByDoenetId = atomFamily({
  key: "variantsAndAttemptsByDoenetId",
  default: {
    assignedContentId: null,
    usersVariantAttempts: [],
    variantsFromDoenetMLDictionary: {},
    numberOfCompletedAttempts: 0
  }
});
export default function AssignmentViewer(props) {
  console.log(">>>===AssignmentViewer");
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const {isAssigned, doenetML, contentId} = useRecoilValue(assignmentDoenetMLContentIdAtom);
  const variantAttemptInfo = useRecoilValue(variantsAndAttemptsByDoenetId(paramDoenetId));
  let variantOfCurrentAttempt = variantAttemptInfo.usersVariantAttempts?.[variantAttemptInfo.numberOfCompletedAttempts];
  let attemptNumber = variantAttemptInfo.numberOfCompletedAttempts + 1;
  let stage = useRef("Start");
  let doenetIdOfdoenetML = useRef("");
  const assignmentSettings = useRecoilValue(loadAssignmentSelector(paramDoenetId));
  const initDoenetML = useRecoilCallback(({snapshot, set}) => async (doenetId) => {
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let contentId2 = null;
    let isAssigned2 = false;
    for (let version of versionHistory.named) {
      if (version.isReleased === "1") {
        isAssigned2 = true;
        contentId2 = version.contentId;
        break;
      }
    }
    let response = await snapshot.getPromise(fileByContentId(contentId2));
    if (typeof response === "object") {
      response = response.data;
    }
    const doenetML2 = response;
    set(assignmentDoenetMLContentIdAtom, {isAssigned: isAssigned2, doenetML: doenetML2, contentId: contentId2});
    doenetIdOfdoenetML.current = doenetId;
  }, []);
  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function pushRandomVariantOfRemaining({previous, from}) {
    let usersVariantAttempts = [...previous];
    let possible = [];
    let numRemaining = previous.length % from.length;
    let latestSetOfWas = [];
    if (numRemaining > 0) {
      latestSetOfWas = previous.slice(-numRemaining);
    }
    for (let variant of from) {
      if (!latestSetOfWas.includes(variant)) {
        possible.push(variant);
      }
    }
    const nextVariant = possible[randomInt(0, possible.length - 1)];
    usersVariantAttempts.push(nextVariant);
    return usersVariantAttempts;
  }
  const setVariantsFromDoenetML = useRecoilCallback(({snapshot, set}) => async ({allPossibleVariants}) => {
    const was = await snapshot.getPromise(variantsAndAttemptsByDoenetId(paramDoenetId));
    let newObj = {...was};
    newObj.assignedContentId = contentId;
    newObj.variantsFromDoenetMLDictionary = {...was.variantsFromDoenetMLDictionary};
    newObj.variantsFromDoenetMLDictionary[contentId] = [...allPossibleVariants];
    if (newObj.usersVariantAttempts.length === 0) {
      const {data} = await axios.get("/api/loadTakenVariants.php", {
        params: {doenetId: paramDoenetId}
      });
      for (let variant of data.variants) {
        let obj = JSON.parse(variant, serializedComponentsReviver);
        newObj.usersVariantAttempts.push(obj.name);
      }
      newObj.numberOfCompletedAttempts = newObj.usersVariantAttempts.length - 1;
      if (newObj.numberOfCompletedAttempts === -1) {
        newObj.numberOfCompletedAttempts = 0;
      }
    }
    let previous = newObj.usersVariantAttempts;
    if (newObj.numberOfCompletedAttempts > previous.length - 1) {
      newObj.usersVariantAttempts = pushRandomVariantOfRemaining({previous, from: newObj.variantsFromDoenetMLDictionary[contentId]});
    }
    set(variantsAndAttemptsByDoenetId(paramDoenetId), newObj);
  }, [paramDoenetId, contentId]);
  const updateVariantInfo = useRecoilCallback(({snapshot}) => async (doenetId, contentId2, doenetML2) => {
    const variantAttemptInfo2 = await snapshot.getPromise(variantsAndAttemptsByDoenetId(doenetId));
    if (!variantAttemptInfo2.variantsFromDoenetMLDictionary[contentId2]) {
      returnAllPossibleVariants({doenetML: doenetML2, callback: setVariantsFromDoenetML});
    } else {
      const allPossibleVariants = variantAttemptInfo2.variantsFromDoenetMLDictionary[variantAttemptInfo2.assignedContentId];
      setVariantsFromDoenetML({allPossibleVariants});
    }
  }, [setVariantsFromDoenetML]);
  if (stage.current === "Start") {
    stage.current = "Wait for paramDoenetId";
    return null;
  } else if (stage.current === "Wait for paramDoenetId") {
    if (paramDoenetId !== "") {
      stage.current = "Wait for DoenetML";
      initDoenetML(paramDoenetId);
    }
    return null;
  } else if (stage.current === "Wait for DoenetML") {
    if (isAssigned) {
      stage.current = "Wait for Variant";
      updateVariantInfo(paramDoenetId, contentId, doenetML);
    }
    return null;
  } else if (stage.current === "Wait for Variant") {
    if (variantOfCurrentAttempt) {
      stage.current = "Wait for New Attempt";
    } else {
      return null;
    }
  } else if (stage.current === "Wait for New Attempt") {
    if (!variantOfCurrentAttempt) {
      stage.current = "Wait for Variant";
      updateVariantInfo(paramDoenetId, contentId, doenetML);
      return null;
    }
  }
  if (!isAssigned) {
    return /* @__PURE__ */ React.createElement("h1", null, "Content is Not Assigned.");
  }
  if (doenetIdOfdoenetML.current !== paramDoenetId) {
    return null;
  }
  let solutionDisplayMode = "button";
  if (!assignmentSettings.showSolution) {
    solutionDisplayMode = "none";
  }
  const requestedVariant = {name: variantOfCurrentAttempt};
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: "doenetviewer",
    doenetML,
    doenetId: paramDoenetId,
    flags: {
      showCorrectness: assignmentSettings.showCorrectness,
      readOnly: false,
      solutionDisplayMode,
      showFeedback: assignmentSettings.showFeedback,
      showHints: assignmentSettings.showHints,
      isAssignment: true
    },
    attemptNumber,
    allowLoadPageState: true,
    allowSavePageState: true,
    allowLocalPageState: false,
    allowSaveSubmissions: true,
    allowSaveEvents: true,
    requestedVariant
  }));
}
