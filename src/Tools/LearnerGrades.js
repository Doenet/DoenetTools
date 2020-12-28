import axios from 'axios';
import React, { useState, useEffect, useCallback } from "react";
// import {useDropzone} from 'react-dropzone';
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
// import parse from 'csv-parse';
// import nanoid from 'nanoid';

import { Link } from "react-router-dom";

export default function LearnerGrades(params){
  const [process, setProcess] = useState("Loading");//array containing column names
  console.log("process",process);
  const [courseId,setCourseId] = useState("");
  const [learnerAssignmentsObj,setLearnerAssignmentsObj] = useState({});

   //Load Enrollment Data When CourseId changes
   useEffect(()=>{
    if (courseId !== ""){

      const payload = { params: {courseId} }
      axios.get('/api/getLearnerAssignmentsAndGrades.php',payload)
        .then(resp=>{
        console.log('getLearnerAssignmentsAndGrades resp.data',resp.data)
        setLearnerAssignmentsObj(resp.data)
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
    console.log("learnerAssignmentsObj",learnerAssignmentsObj)
    let gradeRows = [];
    for (let [i,obj] of learnerAssignmentsObj.entries()){
      let credit = (obj.creditOverride === null) ? obj.credit : obj.creditOverride;
      const totalPoints = obj.totalPointsOrPercent;
      const earned = Math.round(credit * totalPoints * 100) / 100;
      const percent = Math.round(credit * 10000)/100 + '%';
      // const link = 
      gradeRows.push(<tr id={"gradeRow"+i}>
        <td>{obj.title}</td>
        <td><Link to={`/grades/attempts/?assignmentId=${obj.assignmentId}`} >{earned}</Link></td>
        <td>{totalPoints}</td>
        <td><Link to="/grades/attempts/">{percent}</Link></td>
        </tr>);
    }
    let gradeTable = <table>
      <thead>
        <th>Assignments</th><th>Points Earned</th><th>Total Points</th><th>Percent</th>
      </thead>
      <tbody>
        {gradeRows}
      </tbody>
    </table>
    return (<ToolLayoutPanel>
      {gradeTable}
      </ToolLayoutPanel>)
  }
 
  return (<ToolLayoutPanel><p>Grades</p></ToolLayoutPanel>)
}