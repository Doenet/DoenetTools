// import nanoid from 'nanoid';
// import query from '../queryParamFuncs';
// import DoenetAssignmentTree from "./DoenetAssignmentTree"
// import { TreeView } from './TreeView/TreeView';
// import styled from "styled-components";
import DoenetBox from '../Tools/DoenetBox';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export function CourseAssignments(props) {
 
  return (<ToolLayoutPanel>
    <div>
    <h1>Assignments</h1>
  <p 
  onDoubleClick={()=>{props.setAssignmentId('Assignment1');props.setModalOpen(true)}}
  onClick={()=>{props.setAssignmentId('Assignment1')}}
  >Open Assignment1</p>
  <p 
  onDoubleClick={()=>{props.setAssignmentId('Assignment2');props.setModalOpen(true)}}
  onClick={()=>{props.setAssignmentId('Assignment2')}}
  >Open Assignment2</p>
  student or Instructor = {props.studentInstructor}
    </div>
  
  </ToolLayoutPanel>)
}

export function CourseAssignmentControls(props) {
  const [settings,setSettings] = useState({});
  useEffect(() => {
    const payload = { params: {assignmentId:props.assignmentId} }
      axios.get('/api/getAssignmentSettings.php',payload)
        .then(resp=>{
          console.log("get assignment settings",resp.data)
          setSettings(resp.data)
        })
        .catch(error=>{console.warn(error)});
  }, [])

  console.log('settings',settings);
  
  return (<ToolLayoutPanel>
    <div>
    <h1>Assignment Controls</h1>
  <p>Controls Here</p>
  <p>for assignmentId {props.assignmentId}</p>
    </div>
  
  </ToolLayoutPanel>)
}

