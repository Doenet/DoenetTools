import React from 'react';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';



export default function EnrollStudents(){
const setPageToolView = useSetRecoilState(pageToolViewAtom);

const courseId = useRecoilValue(searchParamAtomFamily('couresId'))
  
  return <ButtonGroup vertical>
  <Button width="menu" onClick={()=>setPageToolView({page:'course',tool:"enrollment",view:"",params:{courseId}})} value="Go to Enrollment">Go to Enrollment</Button>
  </ButtonGroup>
}

