import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import DoenetViewer, {serializedComponentsReviver} from "../../viewer/DoenetViewer.js";
import {
  useRecoilValue,
  atom,
  atomFamily,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import {
  itemHistoryAtom,
  fileByContentId
} from "../ToolHandlers/CourseToolHandler.js";
import {returnAllPossibleVariants} from "../../core/utils/returnAllPossibleVariants.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import axios from "../../_snowpack/pkg/axios.js";
import {update} from "../../_snowpack/pkg/@react-spring/web.js";
export const currentAttemptNumber = atom({
  key: "currentAttemptNumber",
  default: null
});
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
export default function AssignmentViewer() {
  let [stage, setStage] = useState("Initializing");
  let [message, setMessage] = useState("");
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const [{
    requestedVariant,
    attemptNumber,
    showCorrectness,
    showFeedback,
    showHints,
    doenetML,
    doenetId,
    solutionDisplayMode
  }, setLoad] = useState({});
  let startedInitOfDoenetId = useRef(null);
  let storedAllPossibleVariants = useRef([]);
  const initializeValues = useRecoilCallback(({snapshot, set}) => async () => {
    let doenetId2 = await snapshot.getPromise(searchParamAtomFamily("doenetId"));
    if (startedInitOfDoenetId.current === doenetId2) {
      return;
    }
    startedInitOfDoenetId.current = doenetId2;
    const {
      showCorrectness: showCorrectness2,
      showFeedback: showFeedback2,
      showHints: showHints2,
      showSolution,
      proctorMakesAvailable
    } = await snapshot.getPromise(loadAssignmentSelector(doenetId2));
    let solutionDisplayMode2 = "button";
    if (!showSolution) {
      solutionDisplayMode2 = "none";
    }
    if (proctorMakesAvailable) {
      const {page} = await snapshot.getPromise(pageToolViewAtom);
      if (page !== "exam") {
        setStage("Problem");
        setMessage("Assignment only available in a proctored setting.");
        return;
      }
    }
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let contentId = null;
    let isAssigned = false;
    for (let version of versionHistory.named) {
      if (version.isReleased === "1") {
        isAssigned = true;
        contentId = version.contentId;
        break;
      }
    }
    console.log(">>>>initializeValues contentId", contentId);
    if (!isAssigned) {
      setStage("Problem");
      setMessage("Assignment is not assigned.");
    }
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object") {
      response = response.data;
    }
    const doenetML2 = response;
    returnAllPossibleVariants({doenetML: doenetML2, callback: setVariantsFromDoenetML});
    async function setVariantsFromDoenetML({allPossibleVariants}) {
      storedAllPossibleVariants.current = allPossibleVariants;
      const {data} = await axios.get("/api/loadTakenVariants.php", {
        params: {doenetId: doenetId2}
      });
      let usersVariantAttempts = [];
      for (let variant of data.variants) {
        let obj = JSON.parse(variant, serializedComponentsReviver);
        if (obj) {
          usersVariantAttempts.push(obj.name);
        }
      }
      let numberOfCompletedAttempts = data.attemptNumbers.length - 1;
      if (numberOfCompletedAttempts === -1) {
        numberOfCompletedAttempts = 0;
      }
      let attemptNumber2 = numberOfCompletedAttempts + 1;
      set(currentAttemptNumber, attemptNumber2);
      usersVariantAttempts = pushRandomVariantOfRemaining({previous: [...usersVariantAttempts], from: allPossibleVariants});
      let requestedVariant2 = {name: usersVariantAttempts[numberOfCompletedAttempts]};
      setLoad({
        requestedVariant: requestedVariant2,
        attemptNumber: attemptNumber2,
        showCorrectness: showCorrectness2,
        showFeedback: showFeedback2,
        showHints: showHints2,
        doenetML: doenetML2,
        doenetId: doenetId2,
        solutionDisplayMode: solutionDisplayMode2
      });
      setStage("Ready");
    }
  }, [stage]);
  const updateAttemptNumberAndRequestedVariant = useRecoilCallback(({snapshot, set}) => async (newAttemptNumber) => {
    let doenetId2 = await snapshot.getPromise(searchParamAtomFamily("doenetId"));
    const {data} = await axios.get("/api/loadTakenVariants.php", {
      params: {doenetId: doenetId2}
    });
    let usersVariantAttempts = [];
    for (let variant of data.variants) {
      let obj = JSON.parse(variant, serializedComponentsReviver);
      if (obj) {
        usersVariantAttempts.push(obj.name);
      }
    }
    usersVariantAttempts = pushRandomVariantOfRemaining({previous: [...usersVariantAttempts], from: storedAllPossibleVariants.current});
    let newRequestedVariant = {name: usersVariantAttempts[newAttemptNumber - 1]};
    setLoad((was) => {
      let newObj = {...was};
      newObj.attemptNumber = newAttemptNumber;
      newObj.requestedVariant = newRequestedVariant;
      return newObj;
    });
  }, []);
  console.log(`>>>>stage -${stage}-`);
  if (stage === "Initializing") {
    initializeValues();
    return null;
  } else if (stage === "Problem") {
    return /* @__PURE__ */ React.createElement("h1", null, message);
  } else if (recoilAttemptNumber > attemptNumber) {
    updateAttemptNumberAndRequestedVariant(recoilAttemptNumber);
    return null;
  }
  console.log(">>>>DoenetViewer obj ", {
    requestedVariant,
    attemptNumber,
    showCorrectness,
    showFeedback,
    showHints,
    doenetML,
    doenetId,
    solutionDisplayMode
  });
  if (doenetId === "") {
    console.log(">>>>Data Not loaded Yet");
    startedInitOfDoenetId.current = null;
    setStage("Initializing");
    return /* @__PURE__ */ React.createElement("p", null, "bug");
  }
  return /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: `doenetviewer${doenetId}`,
    doenetML,
    doenetId,
    flags: {
      showCorrectness,
      readOnly: false,
      solutionDisplayMode,
      showFeedback,
      showHints,
      isAssignment: true
    },
    attemptNumber,
    allowLoadPageState: true,
    allowSavePageState: true,
    allowLocalPageState: false,
    allowSaveSubmissions: true,
    allowSaveEvents: true,
    requestedVariant
  });
}
