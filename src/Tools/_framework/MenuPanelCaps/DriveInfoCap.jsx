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
 
 return <>
    <div style={{position: 'relative', paddingBottom: '135px'}}>
    <img style={{position: "absolute", height: "135px", objectFit: 'cover'}} src={imageURL} alt={`${label} course`} width='240px' />
    </div>
    <div style={{padding:'8px'}}>
    <div>{label}</div>
    <div>{roles}</div>
    <div><RoleDropdown /></div>
    </div>
  </>
}