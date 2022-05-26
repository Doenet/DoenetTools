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
  activityVariantPanelAtom
} from "../ToolHandlers/CourseToolHandler.js";
import axios from "../../_snowpack/pkg/axios.js";
import {returnNumberOfActivityVariantsForCid} from "../../_utils/activityUtils.js";
import {itemByDoenetId, courseIdAtom, useInitCourseItems, useSetCourseIdFromDoenetId} from "../../_reactComponents/Course/CourseActions.js";
export default function DraftAssignmentViewer() {
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(courseIdAtom);
  const requestedVariantParam = useRecoilValue(searchParamAtomFamily("requestedVariant"));
  const requestedVariantIndex = requestedVariantParam && Number.isFinite(Number(requestedVariantParam)) ? Number(requestedVariantParam) : 1;
  const setVariantPanel = useSetRecoilState(activityVariantPanelAtom);
  let [stage, setStage] = useState("Initializing");
  let [message, setMessage] = useState("");
  const [
    {
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
  useSetCourseIdFromDoenetId(recoilDoenetId);
  useInitCourseItems(courseId);
  let itemObj = useRecoilValue(itemByDoenetId(recoilDoenetId));
  useEffect(() => {
    initializeValues(recoilDoenetId, itemObj);
  }, [itemObj, recoilDoenetId]);
  function variantCallback(variantIndex, numberOfVariants) {
    setVariantPanel({
      index: variantIndex,
      numberOfVariants
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
    let result = await returnNumberOfActivityVariantsForCid(cid2);
    if (!result.success) {
      setStage("Problem");
      setMessage(result.message);
      return;
    }
    allPossibleVariants.current = [...Array(result.numberOfVariants).keys()].map((x) => x + 1);
    setLoad({
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
  if (courseId === "__not_found__") {
    return /* @__PURE__ */ React.createElement("h1", null, "Content not found or no permission to view content");
  } else if (stage === "Initializing") {
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
      allowLoadState: false,
      allowSaveState: false,
      allowLocalState: false,
      allowSaveSubmissions: false,
      allowSaveEvents: false
    },
    requestedVariantIndex,
    generatedVariantCallback: variantCallback
  }));
}
