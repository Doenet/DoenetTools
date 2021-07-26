import React from 'react';
import { 
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
 } from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily } from '../NewToolRoot';
import { fetchDrivesQuery } from '../ToolHandlers/CourseToolHandler';


export default function RoleDropdown(){
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const paramPath = useRecoilValue(searchParamAtomFamily('path')) 
  const driveInfo = useRecoilValueLoadable(fetchDrivesQuery);
  if (driveInfo.state === 'loading') {
    return null;
  }else if (driveInfo.state === 'hasError') {
    console.error(driveInfo.contents);
    return null;
  }
  
  let [driveId] = paramPath.split(':')

  //If role in the class is as a student then don't show menu
  let isLearner = false; //Only role listed is student
  for (let drive of driveInfo.contents.driveIdsAndLabels){
    if (drive.driveId === driveId){
      if (drive.role.length === 1 && drive.role[0] === 'Student'){
        isLearner = true;
        break;
      }
    }
  }
  if (isLearner){
    return null;
  }
  
  return <select onChange={(e)=>setPageToolView((was)=>{
    let newObj = {...was}
    newObj.view = e.target.value
    console.log(">>>newObj",newObj)
    return newObj
  })}>
    <option value='Instructor'>Instructor</option>
    <option value='Student'>Student</option>
  </select>
  // <Button onClick={()=>setPageToolView({back:true})} value='Back' />
}