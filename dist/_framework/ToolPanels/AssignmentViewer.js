import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import ActivityViewer from "../../viewer/ActivityViewer.js";
import {
  useRecoilValue,
  atom,
  atomFamily,
  useRecoilCallback,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {
  searchParamAtomFamily,
  pageToolViewAtom,
  suppressMenusAtom,
  profileAtom
} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {retrieveTextFileForCid} from "../../core/utils/retrieveTextFile.js";
import {prng_alea} from "../../_snowpack/pkg/esm-seedrandom.js";
import {determineNumberOfActivityVariants, parseActivityDefinition} from "../../_utils/activityUtils.js";
import {itemByDoenetId, courseIdAtom, useInitCourseItems, useSetCourseIdFromDoenetId} from "../../_reactComponents/Course/CourseActions.js";
export const currentAttemptNumber = atom({
  key: "currentAttemptNumber",
  default: null
});
export const creditAchievedAtom = atom({
  key: "creditAchievedAtom",
  default: {
    creditByItem: [1, 0, 0.5],
    creditForAttempt: 0,
    creditForAssignment: 0,
    totalPointsOrPercent: 0
  }
});
function generateNewVariant({previousVariants, allPossibleVariants, individualize, userId, doenetId, attemptNumber}) {
  let possible = [];
  let numRemaining = (attemptNumber - 1) % allPossibleVariants.length;
  let mostRecentPreviousVariants = [];
  if (numRemaining > 0) {
    for (let aNum = attemptNumber - numRemaining; aNum < attemptNumber; aNum++) {
      if (previousVariants[aNum - 1]) {
        mostRecentPreviousVariants.push(previousVariants[aNum - 1]);
      } else {
        let oldVariant = generateNewVariant({
          previousVariants: previousVariants.slice(0, aNum - 1),
          allPossibleVariants,
          individualize,
          userId,
          doenetId,
          attemptNumber: aNum
        });
        previousVariants[aNum - 1] = oldVariant;
        mostRecentPreviousVariants.push(oldVariant);
      }
    }
  }
  for (let variant of allPossibleVariants) {
    if (!mostRecentPreviousVariants.includes(variant)) {
      possible.push(variant);
    }
  }
  let seed = doenetId + "|" + attemptNumber;
  if (individualize) {
    seed += "|" + userId;
  }
  let rng = new prng_alea(seed);
  const ind = Math.floor(rng() * possible.length);
  const nextVariant = possible[ind];
  return nextVariant;
}
export default function AssignmentViewer() {
  console.log(">>>===AssignmentViewer");
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(courseIdAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  let [stage, setStage] = useState("Initializing");
  let [message, setMessage] = useState("");
  const [recoilAttemptNumber, setRecoilAttemptNumber] = useRecoilState(currentAttemptNumber);
  const [
    {
      requestedVariantIndex,
      attemptNumber,
      showCorrectness,
      showFeedback,
      showHints,
      cid,
      doenetId,
      solutionDisplayMode,
      cidChanged
    },
    setLoad
  ] = useState({});
  let allPossibleVariants = useRef([]);
  let userId = useRef(null);
  let individualize = useRef(null);
  useSetCourseIdFromDoenetId(recoilDoenetId);
  useInitCourseItems(courseId);
  let itemObj = useRecoilValue(itemByDoenetId(recoilDoenetId));
  useEffect(() => {
    initializeValues(recoilDoenetId, itemObj);
  }, [itemObj, recoilDoenetId]);
  const loadProfile = useRecoilValueLoadable(profileAtom);
  userId.current = loadProfile.contents.userId;
  const initializeValues = useRecoilCallback(({snapshot, set}) => async (doenetId2, {
    type,
    timeLimit,
    assignedDate,
    dueDate,
    showCorrectness: showCorrectness2,
    showCreditAchievedMenu,
    showFeedback: showFeedback2,
    showHints: showHints2,
    showSolution,
    proctorMakesAvailable
  }) => {
    if (type === void 0) {
      return;
    }
    let suppress = [];
    if (timeLimit === null) {
      suppress.push("TimerMenu");
    }
    if (!showCorrectness2 || !showCreditAchievedMenu) {
      suppress.push("CreditAchieved");
    }
    setSuppressMenus(suppress);
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
      } else {
        const {data} = await axios.get("/api/checkSEBheaders.php", {
          params: {doenetId: doenetId2}
        });
        if (Number(data.legitAccessKey) !== 1) {
          setStage("Problem");
          setMessage("Browser not configured properly to take an exam.");
          return;
        }
      }
    }
    let cid2 = null;
    let resp = await axios.get(`/api/getCidForAssignment.php`, {params: {doenetId: doenetId2, latestAttemptOverrides: true}});
    if (!resp.data.success) {
      setStage("Problem");
      setMessage(`Error loading assignment: ${resp.data.message}`);
      return;
    } else if (!resp.data.cid) {
      setStage("Problem");
      setMessage("Assignment is not assigned.");
      return;
    } else {
      cid2 = resp.data.cid;
    }
    console.log(`retrieved cid: ${cid2}`);
    let cidChanged2 = resp.data.cidChanged;
    let result = await returnNumberOfActivityVariants(cid2);
    if (!result.success) {
      setStage("Problem");
      setMessage(result.message);
      return;
    }
    allPossibleVariants.current = [...Array(result.numberOfVariants).keys()].map((x) => x + 1);
    resp = await axios.get("/api/loadTakenVariants.php", {
      params: {doenetId: doenetId2}
    });
    if (!resp.data.success) {
      setStage("Problem");
      if (resp.data.message) {
        setMessage(`Could not load assignment: ${resp.data.message}`);
      } else {
        setMessage(`Could not load assignment: ${resp.data}`);
      }
      return;
    }
    let usersVariantAttempts = resp.data.variants.map(Number);
    let attemptNumber2 = Math.max(...resp.data.attemptNumbers.map(Number));
    let needNewVariant = false;
    if (attemptNumber2 < 1) {
      attemptNumber2 = 1;
      needNewVariant = true;
    } else if (resp.data.variants[resp.data.variants.length - 1] === null) {
      needNewVariant = true;
    }
    set(currentAttemptNumber, attemptNumber2);
    if (needNewVariant) {
      resp = await axios.get("/api/getIndividualizeForAssignment.php", {
        params: {doenetId: doenetId2}
      });
      if (!resp.data.success) {
        setStage("Problem");
        if (resp.data.message) {
          setMessage(`Could not load assignment: ${resp.data.message}`);
        } else {
          setMessage(`Could not load assignment: ${resp.data}`);
        }
        return;
      }
      individualize.current = resp.data.individualize === "1";
      usersVariantAttempts = usersVariantAttempts.slice(0, attemptNumber2 - 1);
      usersVariantAttempts.push(generateNewVariant({
        previousVariants: usersVariantAttempts,
        allPossibleVariants: allPossibleVariants.current,
        individualize: individualize.current,
        userId: userId.current,
        doenetId: doenetId2,
        attemptNumber: attemptNumber2
      }));
    }
    let requestedVariantIndex2 = usersVariantAttempts[usersVariantAttempts.length - 1];
    console.log(`requestedVariantIndex: ${requestedVariantIndex2}`);
    setLoad({
      requestedVariantIndex: requestedVariantIndex2,
      attemptNumber: attemptNumber2,
      showCorrectness: showCorrectness2,
      showFeedback: showFeedback2,
      showHints: showHints2,
      cid: cid2,
      doenetId: doenetId2,
      solutionDisplayMode: solutionDisplayMode2,
      cidChanged: cidChanged2
    });
    setStage("Ready");
  }, [setSuppressMenus]);
  async function updateAttemptNumberAndRequestedVariant(newAttemptNumber, doenetId2) {
    let cid2 = null;
    let resp = await axios.get(`/api/getCidForAssignment.php`, {params: {doenetId: doenetId2, latestAttemptOverrides: false}});
    if (!resp.data.success) {
      setStage("Problem");
      setMessage(`Error loading assignment: ${resp.data.message}`);
      return;
    } else if (!resp.data.cid) {
      setStage("Problem");
      setMessage("Assignment is not assigned.");
      return;
    } else {
      cid2 = resp.data.cid;
    }
    console.log(`retrieved cid: ${cid2}`);
    const {data} = await axios.get("/api/loadTakenVariants.php", {
      params: {doenetId: doenetId2}
    });
    if (!data.success) {
      setStage("Problem");
      if (data.message) {
        setMessage(`Could not load assignment: ${data.message}`);
      } else {
        setMessage(`Could not load assignment: ${data}`);
      }
      return;
    }
    let usersVariantAttempts = data.variants.map(Number).slice(0, newAttemptNumber - 1);
    if (individualize.current === null) {
      resp = await axios.get("/api/getIndividualizeForAssignment.php", {
        params: {doenetId: doenetId2}
      });
      if (!resp.data.success) {
        setStage("Problem");
        if (resp.data.message) {
          setMessage(`Could not load assignment: ${resp.data.message}`);
        } else {
          setMessage(`Could not load assignment: ${resp.data}`);
        }
        return;
      }
      individualize.current = resp.data.individualize === "1";
    }
    usersVariantAttempts.push(generateNewVariant({
      previousVariants: usersVariantAttempts,
      allPossibleVariants: allPossibleVariants.current,
      individualize: individualize.current,
      userId: userId.current,
      doenetId: doenetId2,
      attemptNumber: newAttemptNumber
    }));
    let newRequestedVariantIndex = usersVariantAttempts[usersVariantAttempts.length - 1];
    setLoad((was) => {
      let newObj = {...was};
      newObj.attemptNumber = newAttemptNumber;
      newObj.requestedVariantIndex = newRequestedVariantIndex;
      newObj.cid = cid2;
      newObj.cidChanged = false;
      return newObj;
    });
  }
  const updateCreditAchieved = useRecoilCallback(({set}) => async ({
    creditByItem,
    creditForAssignment,
    creditForAttempt,
    totalPointsOrPercent
  }) => {
    set(creditAchievedAtom, {
      creditByItem,
      creditForAssignment,
      creditForAttempt,
      totalPointsOrPercent
    });
  });
  function pageChanged(pageNumber) {
    console.log(`page changed to ${pageNumber}`);
  }
  if (recoilDoenetId === "") {
    return null;
  }
  if (courseId === "__not_found__") {
    return /* @__PURE__ */ React.createElement("h1", null, "Content not found or no permission to view content");
  } else if (stage === "Initializing") {
    return null;
  } else if (stage === "Problem") {
    return /* @__PURE__ */ React.createElement("h1", null, message);
  } else if (recoilAttemptNumber > attemptNumber) {
    updateAttemptNumberAndRequestedVariant(recoilAttemptNumber, recoilDoenetId);
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActivityViewer, {
    key: `activityViewer${doenetId}`,
    cid,
    doenetId,
    cidChanged,
    flags: {
      showCorrectness,
      readOnly: false,
      solutionDisplayMode,
      showFeedback,
      showHints,
      allowLoadState: true,
      allowSaveState: true,
      allowLocalState: true,
      allowSaveSubmissions: true,
      allowSaveEvents: true
    },
    attemptNumber,
    requestedVariantIndex,
    updateCreditAchievedCallback: updateCreditAchieved,
    updateAttemptNumber: setRecoilAttemptNumber,
    pageChangedCallback: pageChanged
  }));
}
async function returnNumberOfActivityVariants(cid) {
  let activityDefinitionDoenetML = await retrieveTextFileForCid(cid);
  let result = parseActivityDefinition(activityDefinitionDoenetML);
  if (!result.success) {
    return result;
  }
  result = await determineNumberOfActivityVariants(result.activityJSON);
  return {success: true, numberOfVariants: result.numberOfVariants};
}
