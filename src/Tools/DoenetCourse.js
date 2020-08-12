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
import React, { useState, useEffect } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import { getCourses, setSelected } from "../imports/courseInfo";

export default function DoenetCourse(props){
  

  function updateCourseInfo(courseListArray,selectedCourseObj){
    // console.log('example****> called back');
    // console.log("courses",courseListArray);
    // console.log("selected",selectedCourseObj);
    // setSelected("NfzKqYtTgYRyPnmaxc7XB");
  }

  // useEffect()

    const url = new URL(window.location.href);
    console.log(url)
    let branchId = url.searchParams.get("branchId");
    console.log('test',branchId)

    return (
      <>
        <ToolLayout toolName="Course" headingTitle="Course Name Here">

       <ToolLayoutPanel
            // menuControls={menuControls}
            panelName="Left Nav"
          >
              <Router>

            <div style={{display:"flex",flexDirection:"column"}}>
                
              
           <Link to="?branchId=overview">Overview</Link>
           <Link to="?branchId=syllabus">Syllabus</Link>
           <Link to="?branchId=grades">Grades</Link>
           <Link to="?branchId=assignments">Assignments</Link>
           <Link to="?branchId=roster">Roster</Link>
            </div>
            </Router>
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

