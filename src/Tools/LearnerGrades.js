import axios from 'axios';
import React, { useState, useEffect, useCallback } from "react";
// import {useDropzone} from 'react-dropzone';
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
// import parse from 'csv-parse';
// import nanoid from 'nanoid';



export default function LearnerGrades(params){
  const [process, setProcess] = useState("Loading");//array containing column names
  console.log("process",process);
  const [courseId,setCourseId] = useState("");

   //Load Enrollment Data When CourseId changes
   useEffect(()=>{
    if (courseId !== ""){

      const payload = { params: {courseId} }
      axios.get('/api/getLearnerAssignmentsAndGrades.php',payload)
        .then(resp=>{
        console.log('resp.data',resp.data)
        setProcess("Display Assignments")
        })
        .catch(error=>{console.warn(error)});
    }
  },[courseId])
  if (!params.selectedCourse){
    return (<ToolLayoutPanel panelName="Enrollment"> <p>Loading...</p> </ToolLayoutPanel>)
  }else{
    if (courseId === ""){
      setCourseId(params.selectedCourse.courseId);
    }
  }

  if (process === "Display Assignments"){
    return (<ToolLayoutPanel><p>Assignments</p></ToolLayoutPanel>)
  }
 
  return (<ToolLayoutPanel><p>Grades</p></ToolLayoutPanel>)
}