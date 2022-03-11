import React from 'react';
import { useRecoilValue } from 'recoil';
import {  coursePermissionsAndSettingsByCourseId } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
import { RoleDropdown } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

export default function DriveInfoCap(){
  let path = useRecoilValue(searchParamAtomFamily('path'));
  let courseId = useRecoilValue(searchParamAtomFamily('driveId'));

  if (!courseId){
    courseId = path.split(':')[0]
  }

  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

if (!course){
  return null;
}

let roles = [...course.roleLabels];
let color = course.color;
let image = course.image;
let label = course.label;
 
 if (image != 'none'){
  image = 'url(/media/drive_pictures/' + image + ')';
  // console.log('there is an image??');
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