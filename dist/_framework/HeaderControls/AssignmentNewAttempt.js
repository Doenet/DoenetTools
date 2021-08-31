import React, {useState} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {variantsAndAttemptsByDoenetId} from "../ToolPanels/AssignmentViewer.js";
export default function AssignmentNewAttempt() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let [buttonEnabled, setButtonEnabled] = useState(true);
  const assignmentSettings = useRecoilValue(loadAssignmentSelector(doenetId));
  const attemptsAllowed = assignmentSettings.numberOfAttemptsAllowed;
  const userAttempts = useRecoilValue(variantsAndAttemptsByDoenetId(doenetId));
  const userAttemptNumber = userAttempts.numberOfCompletedAttempts + 1;
  const newAttempt = useRecoilCallback(({set, snapshot}) => async (doenetId2) => {
    const assignmentSettings2 = await snapshot.getPromise(loadAssignmentSelector(doenetId2));
    const attemptsAllowed2 = assignmentSettings2.numberOfAttemptsAllowed;
    const userAttempts2 = await snapshot.getPromise(variantsAndAttemptsByDoenetId(doenetId2));
    const userAttemptNumber2 = userAttempts2.numberOfCompletedAttempts + 1;
    if (attemptsAllowed2 !== null && userAttemptNumber2 + 1 >= attemptsAllowed2) {
      setButtonEnabled(false);
    }
    let newUserAttempts = {...userAttempts2};
    newUserAttempts.numberOfCompletedAttempts = newUserAttempts.numberOfCompletedAttempts + 1;
    set(variantsAndAttemptsByDoenetId(doenetId2), newUserAttempts);
  });
  if (userAttemptNumber >= attemptsAllowed && buttonEnabled) {
    setButtonEnabled(false);
    return null;
  }
  return /* @__PURE__ */ React.createElement(Button, {
    value: "New Attempt",
    disabled: !buttonEnabled,
    onClick: () => newAttempt(doenetId)
  });
}
