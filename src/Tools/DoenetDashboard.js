import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";




export default function DoenetDashboard(props){


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

