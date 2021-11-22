import React, {useState} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {currentAttemptNumber} from "../ToolPanels/AssignmentViewer.js";
export default function AssignmentNewAttempt() {
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  let [buttonEnabled, setButtonEnabled] = useState(null);
  const initButtonEnabled = useRecoilCallback(({snapshot}) => async () => {
    let doenetId = await snapshot.getPromise(searchParamAtomFamily("doenetId"));
    const userAttemptNumber = await snapshot.getPromise(currentAttemptNumber);
    const {numberOfAttemptsAllowed} = await snapshot.getPromise(loadAssignmentSelector(doenetId));
    if (numberOfAttemptsAllowed !== null && userAttemptNumber >= numberOfAttemptsAllowed) {
      setButtonEnabled(false);
    } else {
      setButtonEnabled(true);
    }
  });
  const newAttempt = useRecoilCallback(({set, snapshot}) => async () => {
    let doenetId = await snapshot.getPromise(searchParamAtomFamily("doenetId"));
    let userAttemptNumber = await snapshot.getPromise(currentAttemptNumber);
    const {numberOfAttemptsAllowed} = await snapshot.getPromise(loadAssignmentSelector(doenetId));
    if (numberOfAttemptsAllowed === null || userAttemptNumber < numberOfAttemptsAllowed) {
      userAttemptNumber++;
      set(currentAttemptNumber, userAttemptNumber);
    }
    if (numberOfAttemptsAllowed !== null && userAttemptNumber >= numberOfAttemptsAllowed) {
      setButtonEnabled(false);
    } else {
      setButtonEnabled(true);
    }
  });
  if (buttonEnabled === null && recoilAttemptNumber !== null) {
    initButtonEnabled();
    return null;
  }
  return /* @__PURE__ */ React.createElement(Button, {
    value: "New Attempt",
    disabled: !buttonEnabled,
    onClick: () => newAttempt()
  });
}
