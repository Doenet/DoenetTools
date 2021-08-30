import React, {useState} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {variantsAndAttemptsByDoenetId} from "../ToolPanels/AssignmentViewer.js";
export default function AssignmentNewAttempt() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let [buttonEnabled, setButtonEnabled] = useState(true);
  const newAttempt = useRecoilCallback(({set, snapshot}) => async (doenetId2) => {
    const assignmentSettings = await snapshot.getPromise(loadAssignmentSelector(doenetId2));
    const attemptsAllowed = assignmentSettings.numberOfAttemptsAllowed;
    const userAttempts = await snapshot.getPromise(variantsAndAttemptsByDoenetId(doenetId2));
    const userAttemptNumber = userAttempts.numberOfCompletedAttempts + 1;
    if (userAttemptNumber + 1 >= attemptsAllowed) {
      setButtonEnabled(false);
    }
    let newUserAttempts = {...userAttempts};
    newUserAttempts.numberOfCompletedAttempts = newUserAttempts.numberOfCompletedAttempts + 1;
    set(variantsAndAttemptsByDoenetId(doenetId2), newUserAttempts);
  });
  return /* @__PURE__ */ React.createElement(Button, {
    value: "New Attempt",
    disabled: !buttonEnabled,
    onClick: () => newAttempt(doenetId)
  });
}
