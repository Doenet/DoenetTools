import React from 'react';
import { useRecoilValue } from 'recoil';
import {  coursePermissionsAndSettingsByCourseId } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
import { RoleDropdown } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

export default function DriveInfoCap(){
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const tool = useRecoilValue(searchParamAtomFamily('tool'));
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

if (!course || Object.keys(course).length == 0){
  return null;
}
let role = course.roleLabel;
let color = course.color;
let image = course.image;
let label = course.label;
 
 if (image != 'none'){
  image = 'url(/media/drive_pictures/' + image + ')';
 }
 if (color != 'none'){
  color = '#' + color;
 }

 let toolText = ""
 if (tool == "navigation"){
   toolText = "Course Navigation"
 }else if (tool == "dashboard"){
   toolText = "Dashboard"
 }else if (tool == "data"){
    toolText = "Data"
 }
 
 return <>
    <div style={{ position: "relative", width: "100%", height: "135px", overflow: "hidden"}}>
      <img style={{ position: "absolute", width: "100%", height: "100%", backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: image, backgroundColor: color }}  />
    </div>
    <b>{toolText}</b>
    <div style={{ padding:'16px 12px' }}>
      <span style={{ marginBottom: "15px" }}>{label}</span> <br />
      <span style={{ marginBottom: "15px" }}>{role}</span> <br />
      <RoleDropdown/>
    </div>
  </>
}