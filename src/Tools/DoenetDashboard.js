import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import { useIndexedDB } from 'react-indexed-db';





export default function DoenetDashboard(props){

  const {add, getAll } = useIndexedDB('CourseList');

  function addCourse(){
    add({ name : 'first', courseId : 'id' }).then(
      event => {
        // console.log('ID', event.target.result);
        console.log('ID', event);
      },
      error => {
        console.log(error);
      }
    )
  }
  getAll().then(courses => {
    console.log(courses);
  })

    return (
      <>
        <ToolLayout toolName="Dashboard">

       <ToolLayoutPanel
            // menuControls={menuControls}
            panelName="context"
          >

          <p>test</p>
          <button onClick={()=>{addCourse()}}>Add to db</button>
          </ToolLayoutPanel> 

       <ToolLayoutPanel
            // menuControls={menuControlsEditor}
            panelName="Editor">
TEST
          </ToolLayoutPanel>

          {/* <ToolLayoutPanel menuControls={menuControlsViewer} panelName="Viewer">
            {alphabet} {alphabet} {alphabet} {alphabet}
          </ToolLayoutPanel>  */}
        </ToolLayout>
      </>
    );
  }

