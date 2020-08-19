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
import Enrollment from './Enrollment';

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
           <Link to="?branchId=Enrollment">Enrollment</Link>
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
