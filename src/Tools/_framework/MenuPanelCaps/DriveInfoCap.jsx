import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {  coursePermissionsAndSettingsByCourseId } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';
import { effectiveRoleIdByCourseId, RoleDropdown } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { find_image_label, find_color_label } from './util'

export default function DriveInfoCap(){
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const tool = useRecoilValue(searchParamAtomFamily('tool'));
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  const [effectiveRoleId, setEffectiveRoleId] = useRecoilState(effectiveRoleIdByCourseId(courseId));

if (!course || Object.keys(course).length == 0){
  return null;
}
let role = course.roleLabel;
let color = course.color;
let image = course.image;
let label = course.label;

let accessible_name = "course";
 
 if (image != 'none'){
  accessible_name = find_image_label(image);
  image = 'url(/media/drive_pictures/' + image + ')';
 }
 if (color != 'none'){
  accessible_name = find_color_label(color);
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
    <div style={{ position: "relative", width: "100%", height: "165px", overflow: "hidden"}}>
      <img aria-label={accessible_name} style={{ position: "absolute", width: "100%", height: "100%", backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: image, backgroundColor: color }}  />
    </div>
    <b>{toolText}</b>
    <div style={{ padding:'16px 12px' }}>
      <span style={{ marginBottom: "15px" }}>{label}</span> <br />
      <span style={{ marginBottom: "15px" }}>{role}</span> <br />
      <RoleDropdown
        label="View as"
        onChange={({ value: roleId }) => setEffectiveRoleId(roleId)}
        valueRoleId={effectiveRoleId ?? course.roleId}
        vertical
      />
    </div>
  </>
}