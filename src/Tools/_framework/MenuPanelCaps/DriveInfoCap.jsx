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

if (!course || Object.keys(course).length == 0){
  return null;
}
let roles = [...course.roleLabels];
let color = course.color;
let image = course.image;
let label = course.label;
 
 if (image != 'none'){
  image = '/media/drive_pictures/' + image;
  // console.log('there is an image??');
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