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
  onDoubleClick={()=>{props.setAssignmentId('4P7WK6V4HvxS9fIT8IY42');props.setModalOpen(true)}}
  onClick={()=>{props.setAssignmentId('4P7WK6V4HvxS9fIT8IY42')}}
  >Quiz 1</p>
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
  const [loading, setLoading] = useState(true);
  const [loadedAssignmentId,setLoadedAssignmentId] = useState("");
  const [changed,setChanged] = useState(false);
  const [save,saveToDB] = useState(false);

  const [title,setTitle] = useState("");
  const [dueDate,setDueDate] = useState("");
  const [assignedDate,setAssignedDate] = useState("");
  const [timeLimit,setTimeLimit] = useState("");
  const [numberOfAttemptsAllowed,setNumberOfAttemptsAllowed] = useState("")
  const [attemptAggregation,setAttemptAggregation] = useState("")
  const [totalPointsOrPercent,setTotalPointsOrPercent] = useState("")
  const [gradeCategory,setGradeCategory] = useState("")
  const [individualize,setIndividualize] = useState(false)
  const [multipleAttempts,setMultipleAttempts] = useState(false)
  const [showSolution,setShowSolution] = useState(false)
  const [showFeedback,setShowFeedback] = useState(false)
  const [showHints,setShowHints] = useState(false)
  const [showCorrectness,setShowCorrectness] = useState(false)
  const [proctorMakesAvailable,setProctorMakesAvailable] = useState(false)


  useEffect(() => {
    if (loadedAssignmentId !== props.assignmentId){
      if (props.assignmentId === ""){
        setLoading(false);
      }else{
        // console.log("LOAD ASSIGNMENT!!!",loadedAssignmentId,props.assignmentId)
        setLoadedAssignmentId(props.assignmentId);
        const payload = { params: {assignmentId:props.assignmentId} }
        axios.get('/api/getAssignmentSettings.php',payload)
          .then(resp=>{
            // console.log("get assignment settings",resp.data)
            //TODO: test if resp.data failed

            setTitle(resp.data.title);
            setDueDate(resp.data.dueDate);
            setAssignedDate(resp.data.assignedDate);
            setTimeLimit(resp.data.timeLimit);
            setNumberOfAttemptsAllowed(resp.data.numberOfAttemptsAllowed);
            setAttemptAggregation(resp.data.attemptAggregation);
            setTotalPointsOrPercent(resp.data.totalPointsOrPercent);
            setGradeCategory(resp.data.gradeCategory);
            if (resp.data.individualize === '1'){setIndividualize(true)}else{setIndividualize(false)}
            if (resp.data.multipleAttempts === '1'){setMultipleAttempts(true)}else{setMultipleAttempts(false)}
            if (resp.data.showSolution === '1'){setShowSolution(true)}else{setShowSolution(false)}
            if (resp.data.showFeedback === '1'){setShowFeedback(true)}else{setShowFeedback(false)}
            if (resp.data.showHints === '1'){setShowHints(true)}else{setShowHints(false)}
            if (resp.data.showCorrectness === '1'){setShowCorrectness(true)}else{setShowCorrectness(false)}
            if (resp.data.proctorMakesAvailable === '1'){setProctorMakesAvailable(true)}else{setProctorMakesAvailable(false)}

            setLoading(false);
            setChanged(false);
          })
          .catch(error=>{console.warn(error)});
        }
    }
  })

    useEffect(()=>{
      if (changed && save){
        const payload = { 
          assignmentId:props.assignmentId,
          title,
          dueDate,
          assignedDate,
          timeLimit,
          numberOfAttemptsAllowed,
          attemptAggregation,
          totalPointsOrPercent,
          gradeCategory,
          individualize:(individualize)?'1':'0',
          multipleAttempts:(multipleAttempts)?'1':'0',
          showSolution:(showSolution)?'1':'0',
          showFeedback:(showFeedback)?'1':'0',
          showHints:(showHints)?'1':'0',
          showCorrectness:(showCorrectness)?'1':'0',
          proctorMakesAvailable:(proctorMakesAvailable)?'1':'0',
         }
        console.log("save to db",payload)
        axios.post('/api/saveAssignmentSettings.php',payload)
              .then(resp=>{
                console.log("Saved response-->",resp.data)
                //TODO: test if save failed
              })
              .catch(error=>{console.warn(error)});
        setChanged(false);
        saveToDB(false);
      }
    })
    
    

  if (loading){
    return (<ToolLayoutPanel> <div> <h1>Loading Assignment Controls</h1> </div> </ToolLayoutPanel>)
  }
  if (props.assignmentId === ""){
    return (<ToolLayoutPanel> <div> <h1>No Assignment Selected</h1> </div> </ToolLayoutPanel>)
  }
  if (props.studentInstructor === "Student"){
    return (<ToolLayoutPanel panelHeaderControls={[
      <button key='start'
      onClick={()=>{props.setAssignmentId('Assignment1');props.setModalOpen(true)}}
      >Start Assignment</button>]}>
      <div>
      <h1>{title}</h1>
      <p>Due: {dueDate}</p>
      <p>Time Limit: {timeLimit}</p>
      <p>Number of Attempts Allowed: {numberOfAttemptsAllowed}</p>
      <p>Points: {totalPointsOrPercent}</p>
      <p>Grade Category: {gradeCategory}</p>
      </div>
    
    </ToolLayoutPanel>)
  }



  return (<ToolLayoutPanel panelHeaderControls={[
  <button key='edit'
  onClick={()=>{props.setAssignmentId('Assignment1');props.setModalOpen(true)}}
  >Edit Assignment</button>]}>
    <div>
    <h1>{title} Controls</h1>

        <div>
          Title: <input type="text" 
          value={title?title:""} 
          onChange={(e)=>{setTitle(e.target.value); setChanged(true);}}
          onKeyDown={(e)=>{if(e.key === 'Enter'){ saveToDB(true) }}}
          onBlur={()=>saveToDB(true)}
          />
        </div>
        <div>
        Due Date: <input type="text" 
          value={dueDate?dueDate:""} 
          onChange={(e)=>{setDueDate(e.target.value); setChanged(true);}}
          onKeyDown={(e)=>{if(e.key === 'Enter'){ saveToDB(true) }}}
          onBlur={()=>saveToDB(true)}
          />
        </div>
        <div>
        Assigned Date: <input type="text" 
          value={assignedDate?assignedDate:""} 
          onChange={(e)=>{setAssignedDate(e.target.value); setChanged(true);}}
          onKeyDown={(e)=>{if(e.key === 'Enter'){ saveToDB(true) }}}
          onBlur={()=>saveToDB(true)}
          />
        </div>
        <div>
        Time Limit: <input type="text" 
          value={timeLimit?timeLimit:""} 
          onChange={(e)=>{setTimeLimit(e.target.value); setChanged(true);}}
          onKeyDown={(e)=>{if(e.key === 'Enter'){ saveToDB(true) }}}
          onBlur={()=>saveToDB(true)}
          />
        </div>
        <div>
        Number Of Attempts Allowed: <input type="text" 
          value={numberOfAttemptsAllowed?numberOfAttemptsAllowed:""} 
          onChange={(e)=>{setNumberOfAttemptsAllowed(e.target.value); setChanged(true);}}
          onKeyDown={(e)=>{if(e.key === 'Enter'){ saveToDB(true) }}}
          onBlur={()=>saveToDB(true)}
          />
        </div>
        <div>
        Attempt Aggregation (m or l): <input type="text" 
          value={attemptAggregation?attemptAggregation:""} 
          onChange={(e)=>{setAttemptAggregation(e.target.value); setChanged(true);}}
          onKeyDown={(e)=>{if(e.key === 'Enter'){ saveToDB(true) }}}
          onBlur={()=>saveToDB(true)}
          />
        </div>
        <div>
        Total Points Or Percent: <input type="text" 
          value={totalPointsOrPercent?totalPointsOrPercent:""} 
          onChange={(e)=>{setTotalPointsOrPercent(e.target.value); setChanged(true);}}
          onKeyDown={(e)=>{if(e.key === 'Enter'){ saveToDB(true) }}}
          onBlur={()=>saveToDB(true)}
          />
        </div>
        <div>
        Grade Category: <input type="text" 
          value={gradeCategory?gradeCategory:""} 
          onChange={(e)=>{setGradeCategory(e.target.value); setChanged(true);}}
          onKeyDown={(e)=>{if(e.key === 'Enter'){ saveToDB(true) }}}
          onBlur={()=>saveToDB(true)}
          />
        </div>
        <div>
         Individualize <input type="checkbox" checked={individualize} 
          onChange={(e)=>{(e.target.checked) ? setIndividualize(true):setIndividualize(false); setChanged(true); saveToDB(true);}}
          />
        </div>
        <div>
         Multiple Attempts <input type="checkbox" checked={multipleAttempts} 
          onChange={(e)=>{(e.target.checked) ? setMultipleAttempts(true):setMultipleAttempts(false); setChanged(true); saveToDB(true);}}
          />
        </div>
        <div>
        Show Solution <input type="checkbox" checked={showSolution} 
          onChange={(e)=>{(e.target.checked) ? setShowSolution(true):setShowSolution(false); setChanged(true); saveToDB(true);}}
          />
        </div>
        <div>
        Show Feedback <input type="checkbox" checked={showFeedback} 
          onChange={(e)=>{(e.target.checked) ? setShowFeedback(true):setShowFeedback(false); setChanged(true); saveToDB(true);}}
          />
        </div>
        <div>
        Show Hints <input type="checkbox" checked={showHints} 
          onChange={(e)=>{(e.target.checked) ? setShowHints(true):setShowHints(false); setChanged(true); saveToDB(true);}}
          />
        </div>
        <div>
        Show Correctness <input type="checkbox" checked={showCorrectness} 
          onChange={(e)=>{(e.target.checked) ? setShowCorrectness(true):setShowCorrectness(false); setChanged(true); saveToDB(true);}}
          />
        </div>
        <div>
        Proctor Makes Available <input type="checkbox" checked={proctorMakesAvailable} 
          onChange={(e)=>{(e.target.checked) ? setProctorMakesAvailable(true):setProctorMakesAvailable(false); setChanged(true); saveToDB(true);}}
          />
        </div>
        
    </div>
  
  </ToolLayoutPanel>)
}

