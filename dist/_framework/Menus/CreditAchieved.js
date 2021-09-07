import React, {useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {creditAchievedAtom, currentAttemptNumber} from "../ToolPanels/AssignmentViewer.js";
export default function CreditAchieved() {
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const lastAttemptNumber = useRef(null);
  let [disabled, setDisabled] = useState(false);
  const {creditByItem, creditForAttempt, creditForAssignment} = useRecoilValue(creditAchievedAtom);
  let [stage, setStage] = useState("Initialize");
  let creditByItemsJSX = creditByItem.map((x, i) => {
    return /* @__PURE__ */ React.createElement("div", {
      key: `creditByItem${i}`
    }, "Credit For Item ", i + 1, ": ", x ? Math.round(x * 1e3) / 1e3 : 0);
  });
  const initialize = useRecoilCallback(({set}) => async (attemptNumber, doenetId) => {
    const {data} = await axios.get(`api/loadAssessmentCreditAchieved.php`, {params: {attemptNumber, doenetId}});
    const {
      creditByItem: creditByItem2,
      creditForAssignment: creditForAssignment2,
      creditForAttempt: creditForAttempt2,
      showCorrectness
    } = data;
    if (Number(showCorrectness) === 0) {
      setDisabled(true);
    } else {
      set(creditAchievedAtom, (was) => {
        let newObj = {...was};
        newObj.creditByItem = creditByItem2;
        newObj.creditForAssignment = creditForAssignment2;
        newObj.creditForAttempt = creditForAttempt2;
        return newObj;
      });
    }
    lastAttemptNumber.current = attemptNumber;
    setStage("Ready");
  }, []);
  if (!recoilAttemptNumber || !recoilDoenetId) {
    return null;
  }
  if (lastAttemptNumber.current !== recoilAttemptNumber) {
    initialize(recoilAttemptNumber, recoilDoenetId);
    return null;
  }
  if (disabled) {
    return /* @__PURE__ */ React.createElement("div", {
      style: {fontSize: "20px", textAlign: "center"}
    }, "Not Available");
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", null, "Credit For Assignment: ", creditForAssignment ? Math.round(creditForAssignment * 1e3) / 1e3 : 0), /* @__PURE__ */ React.createElement("div", null, "Credit For Attempt ", recoilAttemptNumber, ": ", creditForAttempt ? Math.round(creditForAttempt * 1e3) / 1e3 : 0), /* @__PURE__ */ React.createElement("div", null, creditByItemsJSX));
}
