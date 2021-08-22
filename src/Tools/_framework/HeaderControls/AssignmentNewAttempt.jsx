import React, { useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
// import axios from 'axios';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import { variantsAndAttemptsByDoenetId } from '../ToolPanels/AssignmentViewer';

export default function AssignmentNewAttempt() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  let [buttonEnabled,setButtonEnabled] = useState(true);

  const newAttempt = useRecoilCallback(({set,snapshot})=> async (doenetId)=>{
    const assignmentSettings = await snapshot.getPromise((loadAssignmentSelector(doenetId)));
    const attemptsAllowed = assignmentSettings.numberOfAttemptsAllowed;
    const userAttempts = await snapshot.getPromise((variantsAndAttemptsByDoenetId(doenetId)))
    const userAttemptNumber = userAttempts.numberOfCompletedAttempts + 1;
    // console.log(">>>>userAttemptNumber",userAttemptNumber)
    // console.log(">>>>attemptsAllowed",attemptsAllowed)
    if (userAttemptNumber + 1  >= attemptsAllowed){
      setButtonEnabled(false);
      console.log(">>>>OUT OF ATTEMPTS")
     
    }
      let newUserAttempts = {...userAttempts}
      newUserAttempts.numberOfCompletedAttempts = newUserAttempts.numberOfCompletedAttempts + 1;
      set(variantsAndAttemptsByDoenetId(doenetId),newUserAttempts);
    
  })

  return (
    <Button value="New Attempt" disabled={!buttonEnabled} onClick={()=>newAttempt(doenetId)}/>
  );
}
