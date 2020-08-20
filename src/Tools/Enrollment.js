import axios from 'axios';
import React, { useState, useEffect, useCallback } from "react";
import {useDropzone} from 'react-dropzone';
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";


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

export default function Enrollment(params){
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
    let foundId = true;
    let columnToIndex = {
      email:null,
      empId:null,
      firstName:null,
      lastName:null,
      section:null,
      dropped:null,
    };
    for (let [i,head] of headers.entries()){
      const colHead = head.toLowerCase().replace(/\s/g, '').replace(/"/g, '');

      if (colHead === 'empid' ||
          colHead === 'id' ||
          colHead === 'studentid' ||
          colHead === 'employeeid'){columnToIndex.empId = i;}
      else if (colHead === 'emailaddress' ||
               colHead === 'email'){columnToIndex.email = i;}
      else if (colHead === 'firstname'){columnToIndex.firstname = i;}
      else if (colHead === 'lastname'){columnToIndex.lastname = i;}
      else if (colHead === 'section'){columnToIndex.section = i;}
      else if (colHead === 'mainsectionstatus'){columnToIndex.dropped = i;}
    }
    // console.log("columnToIndex",columnToIndex)
    // console.log("headers",headers)
    // console.log("first",entries[0])
    if (columnToIndex.empId == null && columnToIndex.email == null){
      foundId = false;
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
    let importHeads = []
    let mergeHeads = [];
    if (columnToIndex.empId != null){
      importHeads.push(<th key="empId">ID</th>)
      mergeHeads.push('id');
    }
    if (columnToIndex.firstName != null){
      importHeads.push(<th key="firstName">First Name</th>)
      mergeHeads.push('firstName');
    }
    if (columnToIndex.lastName != null){
      importHeads.push(<th key="lastName">Last Name</th>)
      mergeHeads.push('lastName');
    }
    if (columnToIndex.email != null){
      importHeads.push(<th key="email">Email</th>)
      mergeHeads.push('email');
    }
    if (columnToIndex.section != null){
      importHeads.push(<th key="section">Section</th>)
      mergeHeads.push('section');
    }
    if (columnToIndex.dropped != null){
      importHeads.push(<th key="dropped">Dropped</th>)
      mergeHeads.push('dropped');
    }
    let importRows = []
    let mergeId = [];
      let mergeFirstName = [];
      let mergeLastName = [];
      let mergeEmail = [];
      let mergeSection = [];
      let mergeDropped = [];
    for(let [i,rowdata] of entries.entries()){
      let rowcells = [];
      
      if (columnToIndex.empId != null && typeof rowdata[columnToIndex.empId] == "string" ){
        let empId = rowdata[columnToIndex.empId].replace(/"/g, '');
        rowcells.push(<td key="empId">{empId}</td>)
        mergeId.push(empId);
      }
      if (columnToIndex.firstName != null && typeof rowdata[columnToIndex.firstName] == "string"){
        let firstName = rowdata[columnToIndex.firstName].replace(/"/g, '');
        rowcells.push(<td key="firstName">{firstName}</td>)
        mergeFirstName.push(firstName);
      }
      if (columnToIndex.lastName != null && typeof rowdata[columnToIndex.lastName] == "string"){
        let lastName = rowdata[columnToIndex.lastName].replace(/"/g, '');
        rowcells.push(<td key="lastName">{}</td>)
        mergeLastName.push(lastName);
      }
      if (columnToIndex.email != null && typeof rowdata[columnToIndex.email] == "string"){
        let email = rowdata[columnToIndex.email].replace(/"/g, '');
        rowcells.push(<td key="email">{email}</td>)
        mergeEmail.push(email);
      }
      if (columnToIndex.section != null && typeof rowdata[columnToIndex.section] == "string"){
        let section = rowdata[columnToIndex.section].replace(/"/g, '');
        rowcells.push(<td key="section">{section}</td>)
        mergeSection.push(section);
      }
      if (columnToIndex.dropped != null && typeof rowdata[columnToIndex.dropped] == "string"){
        let dropped = rowdata[columnToIndex.dropped].replace(/"/g, '');
        rowcells.push(<td key="dropped">{dropped}</td>)
        mergeDropped.push(dropped);
      }
      importRows.push(<tr key={`rowdata${i}`}>{rowcells}</tr>)
    }

    return (<ToolLayoutPanel panelHeaderControls={[
    <button key='merge' onClick={()=>{
      const payload = { 
        courseId,
        mergeHeads,
        mergeId,
        mergeFirstName,
        mergeLastName,
        mergeEmail,
        mergeSection,
        mergeDropped
      }
      axios.post('/api/mergeEnrollmentData.php', payload)
        .then(resp => {
          console.log('mergeEnrollmentData-->>>',resp.data);
          // setEnrollmentTableData(resp.data.enrollmentTable)
          setProcess("Display Enrollment") 
        });
    }}>Merge</button>,
    <button key='cancel' onClick={()=>setProcess("Display Enrollment")}>Cancel</button>
    ]} panelName="Enrollment"> 
    <div style={{flexDirection: "row",display: "flex"}} >
    {/* <p>Choose Columns to Merge</p> */}
    <table>
      <thead>
      <tr>{importHeads}</tr>
      </thead>
      <tbody>
      {importRows}
      </tbody>
    </table>
    
    {/* {importData} */}
    
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