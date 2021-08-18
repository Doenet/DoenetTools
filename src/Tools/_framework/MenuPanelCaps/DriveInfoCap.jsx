import React from 'react';
import { useRecoilValue } from 'recoil';
import { fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';

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
    <div style={{position: 'relative', paddingBottom: '100px'}}>
    <img style={{position: "absolute", height: "100px", objectFit: 'cover'}} src={imageURL} alt={`${label} course`} width='240px' />
    </div>
 {/* <div style={{position: 'relative', paddingBottom: '100px'}}>
    <img style={{position: "absolute", clip: "rect(0, 240px, 100px, 0)" }} src={imageURL} alt={`${label} course`} height='100px' />
    </div> */}
    <div>{label}</div>
    <div>{roles}</div>
  </>
}