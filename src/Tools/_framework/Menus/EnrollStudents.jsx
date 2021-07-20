import React from 'react';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import { useSetRecoilState, useRecoilValue } from 'recoil';


export default function EnrollStudents(props){
const setPageToolView = useSetRecoilState(pageToolViewAtom);

const path = useRecoilValue(searchParamAtomFamily('path'))
const driveId = path.split(':')[0];
  
  return <div style={props.style}>
  <Button width="menu" onClick={()=>setPageToolView({page:'course',tool:"enrollment",view:"",params:{driveId}})} value="Go to Enrollment">Go to Enrollment</Button>
  </div>
}

