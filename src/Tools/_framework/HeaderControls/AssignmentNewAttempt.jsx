import React, { useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import { currentAttemptNumber } from '../ToolPanels/AssignmentViewer';

export default function AssignmentNewAttempt() {
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  let [buttonEnabled,setButtonEnabled] = useState(null);

  const initButtonEnabled = useRecoilCallback(({snapshot})=> async ()=>{
    let doenetId = await snapshot.getPromise(searchParamAtomFamily('doenetId'));
    const userAttemptNumber = await snapshot.getPromise((currentAttemptNumber))
    const { numberOfAttemptsAllowed } = await snapshot.getPromise((loadAssignmentSelector(doenetId)));
    if (numberOfAttemptsAllowed !== null && userAttemptNumber >= numberOfAttemptsAllowed){
      setButtonEnabled(false);
    }else{
      setButtonEnabled(true);
    }
  });
  
  const newAttempt = useRecoilCallback(({set,snapshot})=> async ()=>{
    let doenetId = await snapshot.getPromise(searchParamAtomFamily('doenetId'));
    let userAttemptNumber = await snapshot.getPromise((currentAttemptNumber))
    const { numberOfAttemptsAllowed } = await snapshot.getPromise((loadAssignmentSelector(doenetId)));
    //Only increment when infinite attempts or more attempts available
    if (numberOfAttemptsAllowed === null || userAttemptNumber < numberOfAttemptsAllowed){
      userAttemptNumber++;
      set(currentAttemptNumber,userAttemptNumber);
    }
    
    if (numberOfAttemptsAllowed !== null && userAttemptNumber >= numberOfAttemptsAllowed){
      setButtonEnabled(false);
    }else{
      setButtonEnabled(true);
    }
  })

  if (buttonEnabled === null && recoilAttemptNumber !== null){
    initButtonEnabled();
    return null;
  }

  return (
    <Button value="New Attempt" data-test="New Attempt" disabled={!buttonEnabled} onClick={()=>newAttempt()}/>
  );
}
