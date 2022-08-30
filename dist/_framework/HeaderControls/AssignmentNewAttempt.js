import React, {useState} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {cidChangedAtom, currentAttemptNumber, numberOfAttemptsAllowedAdjustmentAtom} from "../ToolPanels/AssignmentViewer.js";
import axios from "../../_snowpack/pkg/axios.js";
export default function AssignmentNewAttempt() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [numberOfAttemptsAllowedAdjustment, setNumberOfAttemptsAllowedAdjustment] = useRecoilState(numberOfAttemptsAllowedAdjustmentAtom);
  const [attemptNumber, setAttemptNumber] = useRecoilState(currentAttemptNumber);
  const {numberOfAttemptsAllowed: baseNumberOfAttemptsAllowed} = useRecoilValue(loadAssignmentSelector(doenetId));
  const cidChanged = useRecoilValue(cidChangedAtom);
  let numberOfAttemptsAllowed = null;
  if (baseNumberOfAttemptsAllowed !== null) {
    numberOfAttemptsAllowed = Number(baseNumberOfAttemptsAllowed) + Number(numberOfAttemptsAllowedAdjustment);
  }
  const buttonEnabled = numberOfAttemptsAllowed === null || attemptNumber < numberOfAttemptsAllowed;
  const newAttempt = async function() {
    if (buttonEnabled) {
      if (cidChanged) {
        let resp = await axios.post("/api/incrementAttemptsAllowedIfCidChanged.php", {
          doenetId
        });
        if (resp.data.cidChanged) {
          setNumberOfAttemptsAllowedAdjustment(Number(resp.data.newNumberOfAttemptsAllowedAdjustment));
        }
      }
      setAttemptNumber((was) => was + 1);
    }
  };
  return /* @__PURE__ */ React.createElement(Button, {
    value: "New Attempt",
    "data-test": "New Attempt",
    disabled: !buttonEnabled,
    onClick: newAttempt
  });
}
