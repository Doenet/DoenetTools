import React from 'react';
import { useRecoilValue } from 'recoil';
import { fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';
import { RoleDropdown } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

export default function DriveInfoCap(){
  let path = useRecoilValue(searchParamAtomFamily('path'));
  let driveId = useRecoilValue(searchParamAtomFamily('driveId'));

  if (!driveId){
    driveId = path.split(':')[0]
  }
  const driveInfo = useRecoilValue(fetchDrivesQuery)
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
  image = '/media/drive_pictures/' + image;
  console.log('there is an image??');
 }
 if (color != 'none'){
  color = '#' + color;
 }
 
 return <>
    <div style={{display: 'flex', justifyContent: 'center', alignItems:'center' }}>
      <img src={image} height='135px' width="100%"/>
    </div>
    <div style={{padding:'8px'}}>
    <div>{label}</div>
    <div>{roles}</div>
    <div><RoleDropdown /></div>
    </div>
  </>
}