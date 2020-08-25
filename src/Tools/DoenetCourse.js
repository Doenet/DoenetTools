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
import LearnerGrades from './LearnerGrades';

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
                
              
           <Link to="/overview">Overview</Link>
           <Link to="/syllabus">Syllabus</Link>
           <Link to="/grades">Grades</Link>
           <Link to="/assignments">Assignments</Link>
           <Link to="/enrollment">Enrollment</Link>
            </div>
          </ToolLayoutPanel> 
          <Switch>
              <Route sensitive exact path="/enrollment/" render={(props) => (<Enrollment selectedCourse={selectedCourse}/> )} />
              <Route sensitive exact path="/grades/" render={(props) => (<LearnerGrades selectedCourse={selectedCourse}/>)} />
              {/* <Route sensitive exact path="/attempt/" render={(props) => (<GradebookAttemptView />)} /> */}
          </Switch>
          {/* <Enrollment selectedCourse={selectedCourse}/> */}
          {/* <LearnerGrades selectedCourse={selectedCourse}/> */}

          <ToolLayoutPanel
          // menuControlsViewermenuControls={menuControlsViewer} 
          panelName="Rt. Nav">
             <p>Assignment Control Panel</p>
          </ToolLayoutPanel> 
        </ToolLayout>
        </Router>

    );
  }
