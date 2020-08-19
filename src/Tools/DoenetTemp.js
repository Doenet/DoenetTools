import React, { useState } from "react";
// import ToolLayout from "./ToolLayout/ToolLayout";
// import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
// import styled from "styled-components";
import axios from 'axios';
import nanoid from 'nanoid';

//The one stop shop for converting content to assignments
//Takes an array of contentId's
//returns contentId->assignment for each
//Processes all the updates to assignment database tables as well
function contentToAssignments({branchIds,courseId,destinationFolderId="root"}={}){
  let branchToAssignment = {};
  let assignmentIds = [];
  for(let branchId of branchIds){
    let assignmentId = nanoid();
    branchToAssignment[branchId] = assignmentId;
    assignmentIds.push(assignmentId);
  }
  const phpUrl = '/api/createAssignments.php';
      const data = {
        courseId,
        branchIds,
        assignmentIds,
        destinationFolderId
      }

      axios.post(phpUrl, data)
        .then(resp => {
          console.log('createAssignments',resp.data);
        });

  return assignmentIds;
}

function assignmentsToContent({assignmentIds}={}){
  let branchIds = [];
  for(let assignmentId of assignmentIds){
    let branchId = nanoid();
    branchIds.push(branchId);
  }
  console.log(branchIds)
  return branchIds;
}

export default function DoenetTemp(props){



    return (
      <>
      <button onClick={()=>contentToAssignments({branchIds:['oqUuyupD-SfL3arUpHsvv','Efg9g5jLABCKexVFxK0np'],courseId:"aI8sK4vmEhC5sdeSP3vNW"})}>convert branchIds to assignments</button>
      <button onClick={()=>assignmentsToContent({assignmentIds:['oqUuyupD-SfL3arUpHsvv','Efg9g5jLABCKexVFxK0np'],courseId:"aI8sK4vmEhC5sdeSP3vNW"})}>convert assignments to branchIds</button>
      </>
    );
  }

