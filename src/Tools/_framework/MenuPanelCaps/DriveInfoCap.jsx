import React from 'react';
import { useRecoilValue } from 'recoil';
import { fetchCoursesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';
import { RoleDropdown } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

export default function DriveInfoCap(){
  let path = useRecoilValue(searchParamAtomFamily('path'));
  let driveId = useRecoilValue(searchParamAtomFamily('driveId'));

  if (!driveId){
    driveId = path.split(':')[0]
  }
  const driveInfo = useRecoilValue(fetchCoursesQuery)
  let roles;
  let image;
  let color;
  let label = "";
 for (let info of driveInfo.driveIdsAndLabels){
   if (info.driveId === driveId){
     roles = [...info.role];
     color = info.color;
     image = info.image;
     label = info.label;
     break;
   }
 }

 
 if (image != 'none'){
  image = 'url(/media/drive_pictures/' + image + ')';
  console.log('there is an image??');
 }
 if (color != 'none'){
  color = '#' + color;
 }
 
 return <>
    <div style={{position: 'relative', paddingBottom: '135px'}}>
    <img style={{position: "absolute", height: "135px", objectFit: 'cover', backgroundColor: color, backgroundImage: image}}   width='240px' />
    </div>
    <div style={{padding:'8px'}}>
    <div>{label}</div>
    <div>{roles}</div>
    <div><RoleDropdown /></div>
    </div>
  </>
}