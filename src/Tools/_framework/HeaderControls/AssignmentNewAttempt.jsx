import React, { useState } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import { cidChangedAtom, currentAttemptNumber, numberOfAttemptsAllowedAdjustmentAtom } from '../ToolPanels/AssignmentViewer';
import axios from 'axios';

export default function AssignmentNewAttempt() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
  const [numberOfAttemptsAllowedAdjustment, setNumberOfAttemptsAllowedAdjustment] = useRecoilState(numberOfAttemptsAllowedAdjustmentAtom);
  const [attemptNumber, setAttemptNumber] = useRecoilState(currentAttemptNumber);
  const { numberOfAttemptsAllowed: baseNumberOfAttemptsAllowed } = useRecoilValue(loadAssignmentSelector(doenetId))
  const cidChanged = useRecoilValue(cidChangedAtom);

  let numberOfAttemptsAllowed = null;
  if (baseNumberOfAttemptsAllowed !== null) {
    numberOfAttemptsAllowed = Number(baseNumberOfAttemptsAllowed)
      + Number(numberOfAttemptsAllowedAdjustment);
  }

  //Only increment when infinite attempts or more attempts available
  const buttonEnabled = numberOfAttemptsAllowed === null || attemptNumber < numberOfAttemptsAllowed;

  const newAttempt = async function () {
    if (buttonEnabled) {
      if(cidChanged) {
        let resp = await axios.post('/api/incrementAttemptsAllowedIfCidChanged.php', {
          doenetId,
        });
        if (resp.data.cidChanged) {
          setNumberOfAttemptsAllowedAdjustment(Number(resp.data.newNumberOfAttemptsAllowedAdjustment))
        }
      }

      setAttemptNumber(was => was + 1)
    }
  }

  return (
    <Button value="New Attempt" dataTest="New Attempt" disabled={!buttonEnabled} onClick={newAttempt} />
  );
}
