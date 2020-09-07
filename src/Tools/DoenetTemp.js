import React from 'react';
// import VerticalDivider from "../Doenet/components/VerticalDivider.js";
// import ToolLayout from '../Tools/ToolLayout/ToolLayout.js';
// import ToolLayoutPanel from '../Tools/ToolLayout/ToolLayoutPanel.js';
// import { getCourses_CI, setSelected_CI, saveCourse_CI } from "../imports/courseInfo";
import DoenetBox from './DoenetBox';
import styled from 'styled-components';


export default function temp() {
  let assignmentName = "Sample"
  let dueDate = new Date();
  
  let evenOrOdd = 0
  const months = {
    "Jan":"01",
    "Feb":"02",
    "Mar":"03",
    "Apr":"04",
    "May":"05",
    "June":"06",
    "Jul":"07",
    "Aug":"08",
    "Sep":"09",
    "Oct":"10",
    "Nov":"11",
    "Dec":"12"
  }
  const SettingContainer = styled.button`
  display:flex;
  justify-content:space-between;
  flex-direction: column;
  `
return (
  <>
  
      <SettingContainer>
        
      <DoenetBox key={"title"} 
      evenOrOdd = {evenOrOdd+=1}
      callBack={(e)=>{
        console.log('e',e)
        assignmentName = e;
        }} 
         type="text" 
         title="Assignment Name: "
         writePriviledge={true}
         value={assignmentName?assignmentName:""}/>

      <DoenetBox key={"duedate"}
         evenOrOdd = {evenOrOdd+=1}
         callBack={(e)=>{
            let date = e.split(" ")
            let result = date[3]+"-"+months[date[1]]+"-"+date[2]+" "+date[4]
            dueDate = result
            console.log('dueDate',dueDate)
          }}
        type="Calendar" 
        title="Due Date: "
        value={dueDate?dueDate:""}
        writePriviledge={true}
        />
      </SettingContainer>
  </>
);
}

