import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import ActivityViewer from "../../viewer/ActivityViewer.js";
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {
  searchParamAtomFamily,
  profileAtom
} from "../NewToolRoot.js";
import {
  activityVariantInfoAtom,
  activityVariantPanelAtom
} from "../ToolHandlers/CourseToolHandler.js";
import axios from "../../_snowpack/pkg/axios.js";
import {retrieveTextFileForCid} from "../../core/utils/retrieveTextFile.js";
import {determineNumberOfActivityVariants, parseActivityDefinition} from "../../_utils/activityUtils.js";
import {authorItemByDoenetId, useInitCourseItems} from "../../_reactComponents/Course/CourseActions.js";
export default function DraftAssignmentViewer() {
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const [variantInfo, setVariantInfo] = useRecoilState(activityVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(activityVariantPanelAtom);
  let [stage, setStage] = useState("Initializing");
  let [message, setMessage] = useState("");
  const [
    {
      attemptNumber,
      showCorrectness,
      showFeedback,
      showHints,
      cid,
      doenetId,
      solutionDisplayMode
    },
    setLoad
  ] = useState({});
  let allPossibleVariants = useRef([]);
  let userId = useRef(null);
  useInitCourseItems(courseId);
  let itemObj = useRecoilValue(authorItemByDoenetId(recoilDoenetId));
  useEffect(() => {
    initializeValues(recoilDoenetId, itemObj);
  }, [itemObj, recoilDoenetId]);
  const loadProfile = useRecoilValueLoadable(profileAtom);
  userId.current = loadProfile.contents.userId;
  function variantCallback(variantIndex, numberOfVariants) {
    setVariantPanel({
      index: variantIndex,
      numberOfVariants
    });
    setVariantInfo({
      index: variantIndex
    });
  }
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
    let solutionDisplayMode2 = "button";
    if (!showSolution) {
      solutionDisplayMode2 = "none";
    }
    let cid2 = null;
    let resp = await axios.get(`/api/getCidForAssignment.php`, {params: {doenetId: doenetId2, latestAttemptOverrides: false, getDraft: true}});
    if (!resp.data.success || !resp.data.cid) {
      setStage("Problem");
      setMessage(`Error loading assignment: ${resp.data.message}`);
      return;
    } else {
      cid2 = resp.data.cid;
    }
    let result = await returnNumberOfActivityVariants(cid2);
    if (!result.success) {
      setStage("Problem");
      setMessage(result.message);
      return;
    }
    allPossibleVariants.current = [...Array(result.numberOfVariants).keys()].map((x) => x + 1);
    setLoad({
      attemptNumber,
      showCorrectness: showCorrectness2,
      showFeedback: showFeedback2,
      showHints: showHints2,
      cid: cid2,
      doenetId: doenetId2,
      solutionDisplayMode: solutionDisplayMode2
    });
    setStage("Ready");
  }, []);
  if (recoilDoenetId === "") {
    return null;
  }
  if (stage === "Initializing") {
    return null;
  } else if (stage === "Problem") {
    return /* @__PURE__ */ React.createElement("h1", null, message);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActivityViewer, {
    key: `activityViewer${doenetId}`,
    cid,
    doenetId,
    flags: {
      showCorrectness,
      readOnly: false,
      solutionDisplayMode,
      showFeedback,
      showHints,
      isAssignment: true,
      allowLoadState: false,
      allowSaveState: false,
      allowLocalState: false,
      allowSaveSubmissions: false,
      allowSaveEvents: false
    },
    attemptNumber,
    requestedVariantIndex: variantInfo.index,
    generatedVariantCallback: variantCallback
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
