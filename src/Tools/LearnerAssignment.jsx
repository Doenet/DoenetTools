// import styled from "styled-components";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import ToolLayout from "./ToolLayout/ToolLayout";
import DoenetViewer from "./DoenetViewer";

export default function LearnerAssignment(props) {

  const [doenetML,setDoenetML] = useState("");
  const [assignmentId,setAssignmentId] = useState("");
  console.log("assignmentId",assignmentId)
  
  useEffect(()=>{
    if (props.assignmentId!==assignmentId){
      const payload = { params: {assignmentId:props.assignmentId} }
      console.log("payload",payload)
          axios.get('/api/getAssignmentDoenetML.php',payload)
            .then(resp=>{
              console.log("getAssignmentDoenetML",resp.data)
              //TODO: test if resp.data failed
              setDoenetML(resp.data.doenetML);
              setAssignmentId(props.assignmentId);
            })
            .catch(error=>{console.warn(error)});
    }
  })

  let mainPanel = "Loading...";
  if (doenetML !== ""){
    console.log("doenetML",doenetML)
    mainPanel = (<>
    <p>assignmentId {props.assignmentId}</p>
    <p>dueDate {props.assignmentObj.dueDate}</p>
    <p>numberOfAttemptsAllowed {props.assignmentObj.numberOfAttemptsAllowed}</p>
    <p>doenetML</p>
    <p>{doenetML}</p>
    </>)
  }

return (<ToolLayout hideHeader={true}>
  <ToolLayoutPanel  panelName="Left Nav"> <div >Coming Soon</div> </ToolLayoutPanel>

  <ToolLayoutPanel  panelName="Assignment">
  <div style={{margin:"10px"}}>{mainPanel} </div>
  </ToolLayoutPanel>
  </ToolLayout> )
 
}

