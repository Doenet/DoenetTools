import DoenetViewer from '../Tools/DoenetViewer';
import axios from 'axios';
// import './course.css';
// import nanoid from 'nanoid';
// import query from '../queryParamFuncs';
import DoenetBox from '../Tools/DoenetBox';
// import DoenetAssignmentTree from "./DoenetAssignmentTree"

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import { getCourses, setSelected } from "../imports/courseInfo";
import {useDropzone} from 'react-dropzone';

export default function DoenetCourse(props){
  

  const [selectedCourse,setSelectedCourse] = useState({});
  
  useEffect(()=>{
    getCourses((courseListArray,selectedCourseObj)=>{setSelectedCourse(selectedCourseObj)})
  },[])

  

    return (
      <Router>
        <ToolLayout toolName="Course" headingTitle="Course Name Here">

       <ToolLayoutPanel
            // menuControls={menuControls}
            panelName="Left Nav"
          >

            <div style={{display:"flex",flexDirection:"column"}}>
                
              
           <Link to="?branchId=overview">Overview</Link>
           <Link to="?branchId=syllabus">Syllabus</Link>
           <Link to="?branchId=grades">Grades</Link>
           <Link to="?branchId=assignments">Assignments</Link>
           <Link to="?branchId=roster">Roster</Link>
            </div>
          </ToolLayoutPanel> 

          <Enrollment selectedCourse={selectedCourse}/>

          <ToolLayoutPanel
          // menuControlsViewermenuControls={menuControlsViewer} 
          panelName="Rt. Nav">
             <p>Assignment Control Panel</p>
          </ToolLayoutPanel> 
        </ToolLayout>
        </Router>

    );
  }

  function csvToArray(csv) {//converts csv file to a 2d array
    let textLines = csv.split(/\r\n|\n/);
    let dataNames = [];
    let dataEntries = [];
    for (let i=0; i<textLines.length; i++) {
        let lineArray = textLines[i].split(',');
        if (i==0) {
            dataNames = lineArray;
        } else {
            dataEntries.push(lineArray);
        }
    }
    return [dataNames, dataEntries];
}

function Enrollment(params){
  const [process, setProcess] = useState("Loading");//array containing column names
  console.log("process",process);
  const [headers, setHeaders] = useState([]);//array containing column names
  const [entries, setEntries] = useState([[]]);//2d array with each row representing a data point
      const onDrop = useCallback( file => {
      const reader = new FileReader();
      
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading encountered an error');
      reader.onload = () => {
          let data = csvToArray(reader.result);
          setHeaders(data[0]);
          setEntries(data[1]);
          setProcess("Choose Columns")
      }
      reader.readAsText(file[0]);
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});


  const [courseId,setCourseId] = useState("");
  const [enrollmentTableData, setEnrollmentTableData] = useState([]);

  //Load Enrollment Data When CourseId changes
  useEffect(()=>{
    if (courseId !== ""){

      const payload = { params: {courseId} }
      axios.get('/api/getEnrollment.php',payload)
        .then(resp=>{
        //TODO: Make sure we don't overwrite existing data
        let enrollmentArray = resp.data.enrollmentArray
        setEnrollmentTableData(enrollmentArray)
        setProcess("Display Enrollment")
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


  
  let enrollmentRows = [];
  for (let [i,rowData] of enrollmentTableData.entries()){
 
 enrollmentRows.push(<tr key={`erow${i}`}>
   <td>{rowData.firstName} {rowData.lastName}</td>
   <td>{rowData.section}</td>
   <td>{rowData.empId}</td>
   <td>{rowData.email}</td>
   <td>{rowData.dateEnrolled}</td>
   </tr>)
  }
  
 
  const enrollmentTable = <table>
  <thead>
    <tr><th>Name</th><th>Section</th><th>ID</th><th>Email</th><th>Date Enrolled</th></tr>
  </thead>
  <tbody>
    {enrollmentRows}
  </tbody>
</table>

  if (process === "Choose Columns"){
    // const 
    console.log(headers)
    let foundId = false;
    let importColumns = [];
    for (let head of headers){

    }

    if (!foundId){
    return (<ToolLayoutPanel panelName="Enrollment"> 
    <div style={{flexDirection: "row",display: "flex"}} >
      <p>Data Needs to have a heading marked "id"</p>
      <p>No Data Imported</p>
      <button onClick={()=>setProcess("Display Enrollment")}>OK</button>
    </div>
    </ToolLayoutPanel>)
  }else{
    return (<ToolLayoutPanel panelName="Enrollment"> 
    <div style={{flexDirection: "row",display: "flex"}} >
    <p>Choose Columns to Merge</p>
    {importColumns}
    {/* {importData} */}
    <button>Merge</button>
    </div>
    </ToolLayoutPanel>)
  }
    
  }

  return (
  
    <ToolLayoutPanel
    panelHeaderControls={[<div key="drop" {...getRootProps()}>
      <input {...getInputProps()}/>
      {
          isDragActive ?
          <p>Drop the files here</p> :
          <button>Enroll Learners</button>
      }
  </div>]}
            panelName="Enrollment">
              {enrollmentTable}
          </ToolLayoutPanel>
 
  )
}