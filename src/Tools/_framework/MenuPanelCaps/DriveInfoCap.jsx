import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import { roleAtom } from '../ToolHandlers/CourseToolHandler';

export default function DriveInfoCap(){
  let path = useRecoilValue(searchParamAtomFamily('path'));
  let driveId = useRecoilValue(searchParamAtomFamily('driveId'));
  let [activeRole,setActiveRole] = useRecoilState(roleAtom);

  if (!driveId){
    driveId = path.split(':')[0]
  }
  const driveInfo = useRecoilValue(fetchDrivesQuery)
  let roles;
  let image;
  let label = "";
 for (let info of driveInfo.driveIdsAndLabels){
   if (info.driveId === driveId){
     roles = [...info.role];
     image = info.image;
     label = info.label;
     break;
   }
 }

 let imageURL = `/media/drive_pictures/${image}`

 let activeRoleChoices = [[1,'Instructor'],[2,'Student']];
 let defaultIndex = 1;
//  for (let choice of activeRoleChoices){
//    console.log(">>>>choice",choice)
//    if (choice[1] === activeRole){
//      //set defaultIndex
//    }
//  }
 
 return <>
    <div style={{position: 'relative', paddingBottom: '100px'}}>
    <img style={{position: "absolute", height: "100px", objectFit: 'cover'}} src={imageURL} alt={`${label} course`} width='240px' />
    </div>
 {/* <div style={{position: 'relative', paddingBottom: '100px'}}>
    <img style={{position: "absolute", clip: "rect(0, 240px, 100px, 0)" }} src={imageURL} alt={`${label} course`} height='100px' />
    </div> */}
    <div style={{padding:'8px'}}>
    <div>{label}</div>
    <div>{roles}</div>
    <div>Active Role <DropdownMenu items={activeRoleChoices} defaultIndex={"1"} width="140px" onChange={(choiceObj)=>{
      console.log(">>>>",choiceObj)
    }}/></div>
    </div>
  </>
}