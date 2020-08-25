import React from 'react';
import VerticalDivider from "../Doenet/components/VerticalDivider.js";
import ToolLayout from '../Tools/ToolLayout/ToolLayout.js';
import ToolLayoutPanel from '../Tools/ToolLayout/ToolLayoutPanel.js';

export default function attempt() {
  const header = {
    display: 'inline-block',
    fontSize: '95px',
  };
return (
  <>
    <ToolLayout toolName="Course" headingTitle="Course Name Here">
   <ToolLayoutPanel
        //panelHeaderControls={[contextPanelMenu]}
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
        //panelHeaderControls={[contextPanelMenu]}
        panelName="Content">
          <p style={header}>Content</p> <VerticalDivider></VerticalDivider> <p style={header}>Here</p>
          
      </ToolLayoutPanel>
      <ToolLayoutPanel
      //panelHeaderControls={[contextPanelMenu]}
      panelName="Rt. Nav">
         <p>Assignment Control Panel</p>
      </ToolLayoutPanel>
    </ ToolLayout >
  </>
);
};

