import React from 'react';
import { useRecoilValue } from 'recoil';
import { AssignmentSettings } from './SelectedActivity';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function AssignmentSettingsMenu(){
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  return <div style={{paddingTop:"6px",paddingBottom:"6px"}}>
    <AssignmentSettings role='instructor' doenetId={doenetId} />
  </div>
}