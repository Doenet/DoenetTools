import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
import {serializedComponentsReviver} from "../../core/utils/serializedStateProcessing.js";
import {
  useRecoilValue,
  atom,
  atomFamily,
  useRecoilCallback,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, pageToolViewAtom, footerAtom} from "../NewToolRoot.js";
import {
  itemHistoryAtom,
  fileByContentId
} from "../ToolHandlers/CourseToolHandler.js";
import {returnAllPossibleVariants} from "../../core/utils/returnAllPossibleVariants.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import axios from "../../_snowpack/pkg/axios.js";
import {suppressMenusAtom} from "../NewToolRoot.js";
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
  const setFooter = useSetRecoilState(footerAtom);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  let [stage, setStage] = useState("Initializing");
  let [message, setMessage] = useState("");
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const [
    {
      requestedVariant,
      attemptNumber,
      showCorrectness,
      showFeedback,
      showHints,
      doenetML,
      doenetId,
      solutionDisplayMode
    },
    setLoad
  ] = useState({});
  let startedInitOfDoenetId = useRef(null);
  let storedAllPossibleVariants = useRef([]);
  console.log(`storedAllPossibleVariants -${storedAllPossibleVariants}-`);
  const initializeValues = useRecoilCallback(({snapshot, set}) => async (doenetId2) => {
    if (startedInitOfDoenetId.current === doenetId2) {
      return;
    }
    const isCollection = await snapshot.getPromise(searchParamAtomFamily("isCollection"));
    startedInitOfDoenetId.current = doenetId2;
    const {
      timeLimit,
      assignedDate,
      dueDate,
      showCorrectness: showCorrectness2,
      showCreditAchievedMenu,
      showFeedback: showFeedback2,
      showHints: showHints2,
      showSolution,
      proctorMakesAvailable
    } = await snapshot.getPromise(loadAssignmentSelector(doenetId2));
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
    let contentId = null;
    let isAssigned = false;
    let assignedVariant = null;
    if (isCollection) {
      try {
        const {data} = await axios.get("/api/getAssignedCollectionData.php", {params: {doenetId: doenetId2}});
        contentId = data.contentId;
        isAssigned = data.isAssigned;
        assignedVariant = JSON.parse(data.assignedVariant, serializedComponentsReviver);
      } catch (error) {
        console.error(error);
      }
    } else {
      const {data} = await axios.get(`/api/getContentIdFromAssignmentAttempt.php`, {params: {doenetId: doenetId2}});
      if (data.foundAttempt) {
        contentId = data.contentId;
        isAssigned = true;
      } else {
        const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId2));
        for (let version of versionHistory.named) {
          if (version.isReleased === "1") {
            isAssigned = true;
            contentId = version.contentId;
            break;
          }
        }
      }
    }
    let doenetML2 = null;
    if (!isAssigned) {
      setStage("Problem");
      setMessage("Assignment is not assigned.");
      return;
    }
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object") {
      response = response.data;
    }
    doenetML2 = response;
    returnAllPossibleVariants({
      doenetML: doenetML2,
      callback: isCollection ? setCollectionVariant : setVariantsFromDoenetML
    });
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
      let attemptNumber2 = Math.max(...data.attemptNumbers);
      let needNewVariant = false;
      if (attemptNumber2 < 1) {
        attemptNumber2 = 1;
        needNewVariant = true;
      } else if (!data.variants[data.variants.length - 1]) {
        needNewVariant = true;
      }
      set(currentAttemptNumber, attemptNumber2);
      if (needNewVariant) {
        usersVariantAttempts = pushRandomVariantOfRemaining({
          previous: [...usersVariantAttempts],
          from: allPossibleVariants
        });
      }
      let requestedVariant2 = {
        name: usersVariantAttempts[usersVariantAttempts.length - 1]
      };
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
    async function setCollectionVariant() {
      const {data} = await axios.get("/api/loadTakenVariants.php", {
        params: {doenetId: doenetId2}
      });
      let numberOfCompletedAttempts = data.attemptNumbers.length - 1;
      if (numberOfCompletedAttempts === -1) {
        numberOfCompletedAttempts = 0;
      }
      let attemptNumber2 = numberOfCompletedAttempts + 1;
      set(currentAttemptNumber, attemptNumber2);
      setLoad({
        requestedVariant: assignedVariant,
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
  }, []);
  const updateAttemptNumberAndRequestedVariant = useRecoilCallback(({snapshot, set}) => async (newAttemptNumber) => {
    const isCollection = await snapshot.getPromise(searchParamAtomFamily("isCollection"));
    if (isCollection) {
      console.error("How did you get here?");
      return;
    }
    let doenetId2 = await snapshot.getPromise(searchParamAtomFamily("doenetId"));
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let contentId = null;
    for (let version of versionHistory.named) {
      if (version.isReleased === "1") {
        contentId = version.contentId;
        break;
      }
    }
    let doenetML2 = null;
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object") {
      response = response.data;
    }
    doenetML2 = response;
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
    usersVariantAttempts = pushRandomVariantOfRemaining({
      previous: [...usersVariantAttempts],
      from: storedAllPossibleVariants.current
    });
    let newRequestedVariant = {
      name: usersVariantAttempts[newAttemptNumber - 1]
    };
    setLoad((was) => {
      let newObj = {...was};
      newObj.attemptNumber = newAttemptNumber;
      newObj.requestedVariant = newRequestedVariant;
      newObj.doenetML = doenetML2;
      return newObj;
    });
  }, []);
  const updateCreditAchieved = useRecoilCallback(({set}) => async ({creditByItem, creditForAssignment, creditForAttempt, totalPointsOrPercent}) => {
    set(creditAchievedAtom, {creditByItem, creditForAssignment, creditForAttempt, totalPointsOrPercent});
  });
  if (recoilDoenetId === "") {
    return null;
  }
  if (stage === "Initializing") {
    initializeValues(recoilDoenetId);
    return null;
  } else if (stage === "Problem") {
    return /* @__PURE__ */ React.createElement("h1", null, message);
  } else if (recoilAttemptNumber > attemptNumber) {
    updateAttemptNumberAndRequestedVariant(recoilAttemptNumber);
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DoenetViewer, {
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
    requestedVariant,
    updateCreditAchievedCallback: updateCreditAchieved
  }));
}
