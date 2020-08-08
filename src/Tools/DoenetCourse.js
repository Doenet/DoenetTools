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
import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import { getCourses, setSelected } from "../imports/courseInfo";

export default function DoenetCourse(props){

  
  getCourses(updateCourseInfo);
  function updateCourseInfo(courseListArray,selectedCourseObj){
    // console.log('called back');
    // console.log("courses",courseListArray);
    // console.log("selected",selectedCourseObj);
    setSelected("NfzKqYtTgYRyPnmaxc7XB");
  }

    return (
      <>
        <ToolLayout toolName="Course" headingTitle="Course Name Here">

       <ToolLayoutPanel
            // menuControls={menuControls}
            panelName="Left Nav"
          >
            <div style={{display:"flex",flexDirection:"column"}}>
            <button>Overview</button>
           <button>Syllabus</button>
           <button>Grades</button>
           <button>Assignments</button>
            </div>
           
          </ToolLayoutPanel> 

       <ToolLayoutPanel
            // menuControls={menuControlsEditor}
            panelName="Content">
              <p>Content Here</p>
          </ToolLayoutPanel>

          <ToolLayoutPanel
          // menuControlsViewermenuControls={menuControlsViewer} 
          panelName="Rt. Nav">
             <p>Assignment Control Panel</p>
          </ToolLayoutPanel> 
        </ToolLayout>
      </>
    );
  }

