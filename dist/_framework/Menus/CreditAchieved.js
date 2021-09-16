import React, {useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {creditAchievedAtom, currentAttemptNumber} from "../ToolPanels/AssignmentViewer.js";
export default function CreditAchieved() {
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const recoilUserId = useRecoilValue(searchParamAtomFamily("userId"));
  const recoilTool = useRecoilValue(searchParamAtomFamily("tool"));
  const lastAttemptNumber = useRef(null);
  let [disabled, setDisabled] = useState(false);
  const {creditByItem, creditForAttempt, creditForAssignment, totalPointsOrPercent} = useRecoilValue(creditAchievedAtom);
  let [stage, setStage] = useState("Initialize");
  let creditByItemsJSX = creditByItem.map((x, i) => {
    return /* @__PURE__ */ React.createElement("div", {
      key: `creditByItem${i}`
    }, "Credit For Item ", i + 1, ": ", x ? Math.round(x * 1e3) / 1e3 : 0);
  });
  const initialize = useRecoilCallback(({set}) => async (attemptNumber, doenetId, userId, tool) => {
    const {data} = await axios.get(`api/loadAssessmentCreditAchieved.php`, {params: {attemptNumber, doenetId, userId, tool}});
    const {
      creditByItem: creditByItem2,
      creditForAssignment: creditForAssignment2,
      creditForAttempt: creditForAttempt2,
      showCorrectness,
      totalPointsOrPercent: totalPointsOrPercent2
    } = data;
    if (Number(showCorrectness) === 0 && tool.substring(0, 9) !== "gradebook") {
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
    setStage("Ready");
  }, []);
  if (!recoilAttemptNumber || !recoilDoenetId || !recoilTool) {
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
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", null, "Possible Points: ", totalPointsOrPercent), /* @__PURE__ */ React.createElement("div", null, "Score: ", score), /* @__PURE__ */ React.createElement("div", null, "Credit For Assignment: ", creditForAssignment ? Math.round(creditForAssignment * 1e3) / 1e3 : 0), /* @__PURE__ */ React.createElement("div", null, "Credit For Attempt ", recoilAttemptNumber, ": ", creditForAttempt ? Math.round(creditForAttempt * 1e3) / 1e3 : 0), /* @__PURE__ */ React.createElement("div", null, creditByItemsJSX));
}
