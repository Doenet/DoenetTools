import axios from 'axios';
import React, { useState, useEffect, useCallback } from "react";
// import {useDropzone} from 'react-dropzone';
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
// import parse from 'csv-parse';
// import nanoid from 'nanoid';
import DoenetViewer from "./DoenetViewer";
import { useParams } from 'react-router';



export default function LearnerGradesAttempts(params){
  console.log("learner grades attemps params:",params)
  // console.log("history",params.history)
  // const myparams = useParams();
  // console.log('myparams',myparams)
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
      const earned = Math.floor(credit * totalPoints);
      const percent = Math.floor(credit * 100) + '%';
      // const link = 
      gradeRows.push(<tr id={"gradeRow"+i}>
        <td>{obj.title}</td>
        <td>{earned}</td>
        <td>{totalPoints}</td>
        <td>{percent}</td>
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