import React from 'react';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import { useSetRecoilState, useRecoilValue } from 'recoil';

export default function EnrollStudents(props){
const setPageToolView = useSetRecoilState(pageToolViewAtom);

//TODO: use this for the current driveId
// const driveId = useRecoilValue(searchParamAtomFamily('driveId'))

  const driveId = 'tempDriveId';
  
  return <div style={props.style}>
  <Button width="menu" onClick={()=>setPageToolView({page:'enrollment',tool:"",view:"",params:{driveId}})} value="Go to Enrollment">Go to Enrollment</Button>
  </div>
}