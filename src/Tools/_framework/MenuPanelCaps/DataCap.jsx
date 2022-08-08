import React from 'react';
import { useRecoilValue } from 'recoil';
import {  coursePermissionsAndSettingsByCourseId } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function DataCap(){
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const tool = useRecoilValue(searchParamAtomFamily('tool'));
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

if (!course || Object.keys(course).length == 0){
  return null;
}
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
    </div>
  </>
}