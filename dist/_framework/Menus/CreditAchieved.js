import React, {useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {creditAchievedAtom, currentAttemptNumber} from "../ToolPanels/AssignmentViewer.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {itemByDoenetId} from "../../_reactComponents/Course/CourseActions.js";
import {activityAttemptNumberSetUpAtom, currentPageAtom, itemWeightsAtom} from "../../viewer/ActivityViewer.js";
const Line = styled.div`
  border-bottom: 2px solid var(--canvastext);
  height: 2px;
  width: 230px;
`;
const ScoreOnRight = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
`;
const ScoreContainer = styled.div`
  position: relative;
  background: ${(props) => props.highlight ? "var(--mainGray)" : "var(--canvas)"};
`;
export default function CreditAchieved() {
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const recoilUserId = useRecoilValue(searchParamAtomFamily("userId"));
  const recoilTool = useRecoilValue(searchParamAtomFamily("tool"));
  const itemObj = useRecoilValue(itemByDoenetId(recoilDoenetId));
  const itemWeights = useRecoilValue(itemWeightsAtom);
  const currentPage = useRecoilValue(currentPageAtom);
  const activityAttemptNumberSetUp = useRecoilValue(activityAttemptNumberSetUpAtom);
  const lastAttemptNumber = useRef(null);
  let [disabled, setDisabled] = useState(false);
  const {creditByItem, creditForAttempt, creditForAssignment, totalPointsOrPercent} = useRecoilValue(creditAchievedAtom);
  const initialize = useRecoilCallback(({set}) => async (attemptNumber, doenetId, userId, tool) => {
    const {data} = await axios.get(`/api/loadAssessmentCreditAchieved.php`, {params: {attemptNumber, doenetId, userId, tool}});
    const creditByItem2 = data.creditByItem.map(Number);
    const creditForAssignment2 = Number(data.creditForAssignment);
    const creditForAttempt2 = Number(data.creditForAttempt);
    const showCorrectness = data.showCorrectness === "1";
    const totalPointsOrPercent2 = Number(data.totalPointsOrPercent);
    if (!showCorrectness && tool.substring(0, 9) !== "gradebook") {
      setDisabled(true);
    } else {
      set(creditAchievedAtom, (was) => {
        let newObj = {...was};
        newObj.creditByItem = creditByItem2;
        newObj.creditForAssignment = creditForAssignment2;
        newObj.creditForAttempt = creditForAttempt2;
        newObj.totalPointsOrPercent = totalPointsOrPercent2;
        return newObj;
      });
    }
    lastAttemptNumber.current = attemptNumber;
  }, []);
  if (!creditByItem) {
    return null;
  }
  if (!recoilAttemptNumber || !recoilDoenetId || !recoilTool) {
    return null;
  }
  if (activityAttemptNumberSetUp !== recoilAttemptNumber) {
    lastAttemptNumber.current = activityAttemptNumberSetUp;
    return null;
  }
  if (lastAttemptNumber.current !== recoilAttemptNumber) {
    initialize(recoilAttemptNumber, recoilDoenetId, recoilUserId, recoilTool);
    return null;
  }
  if (disabled) {
    return /* @__PURE__ */ React.createElement("div", {
      style: {fontSize: "20px", textAlign: "center"}
    }, "Not Shown");
  }
  let score = 0;
  if (creditForAssignment) {
    score = Math.round(creditForAssignment * totalPointsOrPercent * 100) / 100;
  }
  let creditByItemsJSX = creditByItem.map((x, i) => {
    let scoreDisplay;
    if (itemWeights[i] === 0) {
      scoreDisplay = x === 0 ? "Not started" : x === 1 ? "Complete" : "In progress";
    } else {
      scoreDisplay = (x ? Math.round(x * 1e3) / 10 : 0) + "%";
    }
    return /* @__PURE__ */ React.createElement(ScoreContainer, {
      key: `creditByItem${i}`,
      highlight: currentPage === i + 1
    }, "Item ", i + 1, ": ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
      "data-test": `Item ${i + 1} Credit`
    }, scoreDisplay));
  });
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ScoreContainer, null, "Possible Points: ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
    "data-test": "Possible Points"
  }, totalPointsOrPercent)), /* @__PURE__ */ React.createElement(ScoreContainer, null, "Final Score: ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
    "data-test": "Final Score"
  }, score)), /* @__PURE__ */ React.createElement(Line, null), /* @__PURE__ */ React.createElement("b", null, "Credit For:"), /* @__PURE__ */ React.createElement(ScoreContainer, {
    "data-test": "Attempt Container"
  }, "Attempt ", recoilAttemptNumber, ": ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
    "data-test": "Attempt Percent"
  }, creditForAttempt ? Math.round(creditForAttempt * 1e3) / 10 : 0, "%")), /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "15px"}
  }, creditByItemsJSX), /* @__PURE__ */ React.createElement(ScoreContainer, null, "Assignment: ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
    "data-test": "Assignment Percent"
  }, creditForAssignment ? Math.round(creditForAssignment * 1e3) / 10 : 0, "%")));
}
