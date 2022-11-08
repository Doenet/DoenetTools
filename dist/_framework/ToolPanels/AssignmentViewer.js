import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import ActivityViewer, {saveStateToDBTimerIdAtom} from "../../viewer/ActivityViewer.js";
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
import {useLocation, useNavigate} from "../../_snowpack/pkg/react-router.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Banner from "../../_reactComponents/PanelHeaderComponents/Banner.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
export const currentAttemptNumber = atom({
  key: "currentAttemptNumber",
  default: null
});
export const creditAchievedAtom = atom({
  key: "creditAchievedAtom",
  default: {
    creditByItem: [],
    creditForAttempt: 0,
    creditForAssignment: 0,
    totalPointsOrPercent: 0
  }
});
export const numberOfAttemptsAllowedAdjustmentAtom = atom({
  key: "numberOfAttemptsAllowedAdjustment",
  default: 0
});
export const cidChangedAtom = atom({
  key: "cidChanged",
  default: false
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
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(courseIdAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  let [stage, setStage] = useState("Initializing");
  let [message, setMessage] = useState("");
  const [recoilAttemptNumber, setRecoilAttemptNumber] = useRecoilState(currentAttemptNumber);
  const [cidChanged, setCidChanged] = useRecoilState(cidChangedAtom);
  const [
    {
      requestedVariantIndex,
      attemptNumber,
      showCorrectness,
      paginate,
      showFinishButton,
      showFeedback,
      showHints,
      autoSubmit,
      cid,
      doenetId,
      solutionDisplayMode,
      baseNumberOfAttemptsAllowed
    },
    setLoad
  ] = useState({});
  const [numberOfAttemptsAllowedAdjustment, setNumberOfAttemptsAllowedAdjustment] = useRecoilState(numberOfAttemptsAllowedAdjustmentAtom);
  const [cidChangedMessageOpen, setCidChangedMessageOpen] = useState(false);
  let allPossibleVariants = useRef([]);
  let userId = useRef(null);
  let individualize = useRef(null);
  const getValueOfTimeoutWithoutARefresh = useRecoilCallback(({snapshot}) => async () => {
    return await snapshot.getPromise(saveStateToDBTimerIdAtom);
  }, [saveStateToDBTimerIdAtom]);
  useSetCourseIdFromDoenetId(recoilDoenetId);
  useInitCourseItems(courseId);
  const effectivePermissions = useRecoilValue(effectivePermissionsByCourseId(courseId));
  let [itemObj, setItemObj] = useRecoilState(itemByDoenetId(recoilDoenetId));
  let label = itemObj.label;
  let {search, hash} = useLocation();
  let navigate = useNavigate();
  useEffect(() => {
    const prevTitle = document.title;
    if (label) {
      document.title = `${label} - Doenet`;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [label]);
  useEffect(() => {
    if (Object.keys(itemObj).length > 0 && Object.keys(effectivePermissions).length > 0) {
      initializeValues(recoilDoenetId, itemObj);
    }
  }, [itemObj, recoilDoenetId, effectivePermissions]);
  const loadProfile = useRecoilValueLoadable(profileAtom);
  userId.current = loadProfile.contents.userId;
  const initializeValues = useRecoilCallback(({snapshot, set}) => async (doenetId2, {
    type,
    timeLimit,
    assignedDate,
    dueDate,
    showCorrectness: showCorrectness2,
    showCreditAchievedMenu,
    paginate: paginate2,
    showFinishButton: showFinishButton2,
    showFeedback: showFeedback2,
    showHints: showHints2,
    autoSubmit: autoSubmit2,
    showSolution,
    proctorMakesAvailable,
    numberOfAttemptsAllowed: baseNumberOfAttemptsAllowed2
  }) => {
    if (type === void 0) {
      return;
    }
    let suppress = [];
    if (timeLimit === null) {
      suppress.push("TimerMenu");
    }
    if (!showCorrectness2 || !showCreditAchievedMenu || effectivePermissions.canViewUnassignedContent !== "0") {
      suppress.push("CreditAchieved");
    }
    setSuppressMenus(suppress);
    let solutionDisplayMode2 = "button";
    if (!showSolution && effectivePermissions.canViewUnassignedContent === "0") {
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
    setCidChanged(resp.data.cidChanged);
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
    resp = await axios.get("/api/loadAttemptsAllowedAdjustment.php", {
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
    let numberOfAttemptsAllowedAdjustment2 = Number(resp.data.numberOfAttemptsAllowedAdjustment);
    set(numberOfAttemptsAllowedAdjustmentAtom, numberOfAttemptsAllowedAdjustment2);
    let result = await returnNumberOfActivityVariants(cid2);
    if (!result.success) {
      setLoad({
        requestedVariantIndex: 0,
        attemptNumber: attemptNumber2,
        showCorrectness: showCorrectness2,
        paginate: paginate2,
        showFinishButton: showFinishButton2,
        showFeedback: showFeedback2,
        showHints: showHints2,
        autoSubmit: autoSubmit2,
        cid: cid2,
        doenetId: doenetId2,
        solutionDisplayMode: solutionDisplayMode2,
        baseNumberOfAttemptsAllowed: baseNumberOfAttemptsAllowed2
      });
      setStage("Problem");
      setMessage(result.message);
      return;
    }
    allPossibleVariants.current = [...Array(result.numberOfVariants).keys()].map((x) => x + 1);
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
      paginate: paginate2,
      showFinishButton: showFinishButton2,
      showFeedback: showFeedback2,
      showHints: showHints2,
      autoSubmit: autoSubmit2,
      cid: cid2,
      doenetId: doenetId2,
      solutionDisplayMode: solutionDisplayMode2,
      baseNumberOfAttemptsAllowed: baseNumberOfAttemptsAllowed2
    });
    setStage("Ready");
  }, [setSuppressMenus, effectivePermissions]);
  const setActivityAsCompleted = useRecoilCallback(({set}) => async () => {
    set(itemByDoenetId(doenetId), (prev) => {
      let next = {...prev};
      next.completed = true;
      next.completedDate = new Date();
      return next;
    });
  }, [doenetId]);
  async function updateAttemptNumberAndRequestedVariant(newAttemptNumber, doenetId2) {
    if (hash && hash !== "#page1") {
      navigate(search, {replace: true});
    }
    let oldTimeoutId = await getValueOfTimeoutWithoutARefresh();
    if (oldTimeoutId !== null) {
      clearTimeout(oldTimeoutId);
    }
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
      setStage("Ready");
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
      return newObj;
    });
    setCidChanged(false);
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
  async function incrementAttemptNumberAndAttemptsAllowed() {
    let resp = await axios.post("/api/incrementAttemptsAllowedIfCidChanged.php", {
      doenetId
    });
    if (resp.data.cidChanged) {
      setNumberOfAttemptsAllowedAdjustment(Number(resp.data.newNumberOfAttemptsAllowedAdjustment));
      setRecoilAttemptNumber((was) => was + 1);
    }
  }
  if (recoilDoenetId === "") {
    return null;
  }
  console.log("stage", stage);
  if (courseId === "__not_found__") {
    return /* @__PURE__ */ React.createElement("h1", null, "Content not found or no permission to view content");
  } else if (stage === "Initializing") {
    return null;
  } else if (recoilAttemptNumber > attemptNumber) {
    updateAttemptNumberAndRequestedVariant(recoilAttemptNumber, recoilDoenetId);
    return null;
  } else if (stage === "Problem") {
    return /* @__PURE__ */ React.createElement("h1", null, message);
  }
  if (!itemObj?.canViewAfterCompleted && itemObj.completed) {
    const totalNumberOfAttemptsAllowed = Number(itemObj.numberOfAttemptsAllowed) + Number(numberOfAttemptsAllowedAdjustment);
    if (totalNumberOfAttemptsAllowed > attemptNumber) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
        style: {margin: "15px"}
      }, /* @__PURE__ */ React.createElement("h1", null, "Assessment Complete"), /* @__PURE__ */ React.createElement("p", null, "You have completed this assessment.  Would you like to begin another attempt?"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement(Button, {
        value: "Begin New Attempt",
        onClick: async () => {
          const {data} = await axios.get(`/api/saveCompleted.php`, {params: {doenetId}});
          if (data.success) {
            setRecoilAttemptNumber((was) => was + 1);
            setItemObj((prev) => {
              let next = {...prev};
              next.completed = false;
              return next;
            });
          } else {
            setStage("Problem");
            setMessage("Internal Error");
          }
        }
      }))));
    } else {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
        style: {margin: "15px"}
      }, /* @__PURE__ */ React.createElement("h1", null, "Assessment Complete"), /* @__PURE__ */ React.createElement("p", null, "You have already completed this assessment and no additional attempts are available.")));
    }
  }
  let cidChangedAlert = null;
  if (cidChanged) {
    if (cidChangedMessageOpen) {
      let attemptNumberPhrase = null;
      if (baseNumberOfAttemptsAllowed > 1) {
        attemptNumberPhrase = " and the number of available attempts";
      }
      cidChangedAlert = /* @__PURE__ */ React.createElement(Banner, {
        type: "ACTION",
        value: /* @__PURE__ */ React.createElement("div", {
          style: {border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)", padding: "5px", margin: "5px", display: "flex", flexFlow: "column wrap"}
        }, "A new version of this activity is available. Do you want to start a new attempt using the new version? (This will reset the activity", attemptNumberPhrase, ".)", /* @__PURE__ */ React.createElement("div", {
          style: {display: "flex", justifyContent: "center", padding: "5px"}
        }, /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
          onClick: incrementAttemptNumberAndAttemptsAllowed,
          dataTest: "ConfirmNewVersion",
          value: "Yes"
        }), /* @__PURE__ */ React.createElement(Button, {
          onClick: () => setCidChangedMessageOpen(false),
          dataTest: "CancelNewVersion",
          value: "No",
          alert: true
        }))))
      });
    } else {
      cidChangedAlert = /* @__PURE__ */ React.createElement(Banner, {
        type: "ACTION",
        value: /* @__PURE__ */ React.createElement("div", {
          style: {marginLeft: "1px", marginRight: "5px"}
        }, /* @__PURE__ */ React.createElement(ActionButton, {
          onClick: () => setCidChangedMessageOpen(true),
          dataTest: "NewVersionAvailable",
          value: "New version available!"
        }))
      });
    }
  }
  const allowLoadAndSave = effectivePermissions.canViewUnassignedContent === "0";
  return /* @__PURE__ */ React.createElement(React.Fragment, null, cidChangedAlert, /* @__PURE__ */ React.createElement(ActivityViewer, {
    key: `activityViewer${doenetId}`,
    cid,
    doenetId,
    flags: {
      showCorrectness,
      readOnly: false,
      solutionDisplayMode,
      showFeedback,
      showHints,
      autoSubmit,
      allowLoadState: allowLoadAndSave,
      allowSaveState: allowLoadAndSave,
      allowLocalState: allowLoadAndSave,
      allowSaveSubmissions: allowLoadAndSave,
      allowSaveEvents: allowLoadAndSave
    },
    attemptNumber,
    requestedVariantIndex,
    updateCreditAchievedCallback: updateCreditAchieved,
    updateAttemptNumber: setRecoilAttemptNumber,
    pageChangedCallback: pageChanged,
    paginate,
    showFinishButton,
    cidChangedCallback: () => setCidChanged(true),
    setActivityAsCompleted
  }));
}
async function returnNumberOfActivityVariants(cid) {
  let activityDefinitionDoenetML;
  try {
    activityDefinitionDoenetML = await retrieveTextFileForCid(cid);
  } catch (e) {
    return {success: false, message: "Could not retrieve file"};
  }
  let result = parseActivityDefinition(activityDefinitionDoenetML);
  if (!result.success) {
    return result;
  }
  try {
    result = await determineNumberOfActivityVariants(result.activityJSON);
  } catch (e) {
    return {success: false, message: e.message};
  }
  return {success: true, numberOfVariants: result.numberOfVariants};
}
