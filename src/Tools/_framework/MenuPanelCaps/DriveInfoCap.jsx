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
let roles = [...course.roleLabels];
let color = course.color;
let image = course.image;
let label = course.label;
 
 if (image != 'none'){
  image = '/media/drive_pictures/' + image;
 }
 if (color != 'none'){
  color = '#' + color;
 }

 let toolText = ""
 if (tool == "navigation"){
   toolText = "Course Navigation"
 }else if (tool == "dashboard"){
   toolText = "Dashboard"
 }else if (tool == "surveyList"){
    toolText = "Data"
 }
 
 return <>
    <div style={{ position: "relative", width: "100%", height: "135px", overflow: "hidden"}}>
      <img src={image} style={{ position: "absolute", width: "100%", top: "50%", transform: "translateY(-50%)" }}  />
    </div>
    <b>{toolText}</b>
    <div style={{ padding:'16px 12px' }}>
      <span style={{ marginBottom: "15px" }}>{label}</span> <br />
      <span style={{ marginBottom: "15px" }}>{roles}</span> <br />
      <RoleDropdown />
    </div>
  </>
}