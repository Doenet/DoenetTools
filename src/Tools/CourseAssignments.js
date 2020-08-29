// import nanoid from 'nanoid';
// import query from '../queryParamFuncs';
// import DoenetAssignmentTree from "./DoenetAssignmentTree"
// import { TreeView } from './TreeView/TreeView';
// import styled from "styled-components";
// import DoenetBox from '../Tools/DoenetBox';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { save } from 'math-expressions';

export function CourseAssignments(props) {
 
  return (<ToolLayoutPanel>
    <div>
    <h1>Assignments</h1>
  <p 
  onDoubleClick={()=>{props.setAssignmentId('Assignment1');props.setModalOpen(true)}}
  onClick={()=>{props.setAssignmentId('4P7WK6V4HvxS9fIT8IY4i')}}
  >Assignment1</p>
  <p 
  onDoubleClick={()=>{props.setAssignmentId('Assignment2');props.setModalOpen(true)}}
  onClick={()=>{props.setAssignmentId('yfP_Pslr-WC1D8g2rEqhF')}}
  >Assignment2</p>
  student or Instructor = {props.studentInstructor}
    </div>
  
  </ToolLayoutPanel>)
}

export function CourseAssignmentControls(props) {
  const [settings,setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadedAssignmentId,setLoadedAssignmentId] = useState("");

  useEffect(() => {
    if (loadedAssignmentId !== props.assignmentId){
      if (props.assignmentId === ""){
        setLoading(false);
      }else{
        const payload = { params: {assignmentId:props.assignmentId} }
        axios.get('/api/getAssignmentSettings.php',payload)
          .then(resp=>{
            console.log("get assignment settings",resp.data)
            setSettings(resp.data);
            setLoading(false);
            setLoadedAssignmentId(props.assignmentId);
          })
          .catch(error=>{console.warn(error)});
        }
    }
  })

  function saveSettings(){
    console.log("save",settings)
    setSettings(settings);
  }
    
  let evenOrOdd = 0
  const months = {
    "Jan":"01",
    "Feb":"02",
    "Mar":"03",
    "Apr":"04",
    "May":"05",
    "June":"06",
    "Jul":"07",
    "Aug":"08",
    "Sep":"09",
    "Oct":"10",
    "Nov":"11",
    "Dec":"12"
  }


  if (loading){
    return (<ToolLayoutPanel> <div> <h1>Loading Assignment Controls</h1> </div> </ToolLayoutPanel>)
  }
  if (props.assignmentId === ""){
    return (<ToolLayoutPanel> <div> <h1>No Assignment Selected</h1> </div> </ToolLayoutPanel>)
  }
  if (props.studentInstructor === "Student"){
    return (<ToolLayoutPanel>
      <div>
      <h1>Assignment Overview</h1>
    <p>Student Overview Here</p>
    <p>for assignmentId {props.assignmentId}</p>
      </div>
    
    </ToolLayoutPanel>)
  }

  let dueDate = new Date();

  // let result = date[3]+"-"+months[date[1]]+"-"+date[2]+" "+date[4]
  //             dueDate = result
  //Instructor Assignment Controls
  return (<ToolLayoutPanel>
    <div>
    <h1>{settings.title} Controls</h1>
        <div>
          Title: <input type="text" value={settings.title} />
        </div>

        <div>
        Due Date: <input type="text" value={settings.dueDate} />
        </div>
   
  
    </div>
  
  </ToolLayoutPanel>)
}

