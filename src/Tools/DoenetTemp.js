import React from 'react';
import VerticalDivider from "../Doenet/components/VerticalDivider.js";
import ToolLayout from '../Tools/ToolLayout/ToolLayout.js';
import ToolLayoutPanel from '../Tools/ToolLayout/ToolLayoutPanel.js';
import { getCourses_CI, setSelected_CI, saveCourse_CI } from "../imports/courseInfo";

export default function attempt() {
     //Save new course in IndexedDB
    //  getCourses_CI({courseId, courseName, courseCode, term, description, department, section})
    let courseId = "mycourseid";
    let courseName = "my test course";
    let courseCode = "my101"
    let term = "Spring 2020"
    let description = "my description"
    let department = "dep"
    let section = "01"

    // getCourses_CI({courseId, courseName, courseCode, term, description, department, section})
return (
  <>
   <button onClick={()=>{
     console.log('before')
     saveCourse_CI({courseId, courseName, courseCode, term, description, department, section})

   }
     } >  test add</button>
  </>
);
}

