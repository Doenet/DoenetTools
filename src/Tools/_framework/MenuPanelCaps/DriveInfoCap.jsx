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
  image = 'url(/media/drive_pictures/' + image + ')';
 }
 if (color != 'none'){
  color = '#' + color;
 }
 
 return <>
    <div style={{ position: "relative", width: "100%", height: "135px", overflow: "hidden"}}>
      <img style={{ position: "absolute", width: "100%", height: "100%", backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: image, backgroundColor: color }}  />
    </div>
    <div style={{ padding:'16px 12px' }}>
      <span style={{ marginBottom: "15px" }}>{label}</span> <br />
      <span style={{ marginBottom: "15px" }}>{roles}</span> <br />
      <RoleDropdown />
    </div>
  </>
}