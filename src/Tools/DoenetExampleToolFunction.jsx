import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import axios from 'axios';

      {/*************************  ToolLayout  ******************  
       **** mandatory 
         toolName  = "Course"                                      ////tool title in DoenetHeader(can send as props in anytool )
         
       **** Optional 
            ----  headingTitle = "" | {}                           //// Header text in middle of Header

            ----  leftPanelWidth = '100' && !<= 0 && !> 300        //// able to add width of first child of ToolLayout
            ----  rightPanelWidth = '200' && ! <= 0 &&  !> 500     //// able to add width of third child if available in ToolLayout
              
            ----  leftPanelClose = {true}                           //// true or false or none - open or close left panel on load
            ----  rightPanelClose = {false}                         //// true or false or none - open or close right panel on load

            ----  guestUser = {true}                                //// removes leftNav and roles, toolbox and profile section in header
            ----  headerChangesFromLayout = {}                      //// 

      
      *****************  ToolLayoutPanel  *****************
      **** mandatory 
            ---- panelName = ""                                     //// In small screen panel button's name label
            ---- key = ""                                           //// unique key for each children in toollayout
            
      **** Optional 
            ---- panelHeaderControls = {[]}                          //// can be defined & send as prop
            ---- disableSplitPanelScroll= {[true, false]}            //// {[main panel , split panel]} scroll or disable scroll
            ---- splitPanel = {this.state.splitPanelLayout}          //// Split panel flag
      */}

export default function DoenetExampleTool(props){
 let [contentInteractionsDivs,setContentInteractionsDivs] = useState([])

function recordContentInteraction({assignmentId, contentId, stateVariables}={}){
//assignmentId, emailAddress (handle JWT and anonymous),  Attempt number, state glob
let serializedStateVariables = JSON.stringify(stateVariables);

if (assignmentId){
  //Save Assignment Info
  console.log('assignment')
}
console.log('recordContentInteraction')
const phpUrl = '/api/recordContentInteraction.php';
      const data = {
        assignmentId,
        contentId,
        stateVariables:serializedStateVariables,
      }

      axios.post(phpUrl, data)
        .then(resp => {
          console.log('save',resp.data);
        });
}

function loadContentInteractions({assignmentId, contentId, attemptNumber, submissionNumber}={}){
  //assignmentId, Attempt number, state glob
  const phpUrl = '/api/loadContentInteractions.php';
      const data = {
        contentId,
      }
      console.log('data',data)
      const payload = {
        params: data
      }

      axios.get(phpUrl, payload)
        .then(resp => {
          console.log('load',resp.data);
          let divs = [];
          for (let stringified of resp.data.stateVariables){
            divs.push(<div>{JSON.stringify(stringified)}</div>)
          }
    
          setContentInteractionsDivs(divs);
        });
  }
    return (
      <>
        <ToolLayout toolName="Dashboard">

       <ToolLayoutPanel
            // menuControls={menuControls}
            panelName="context"
          >
          <p>Left</p>
          </ToolLayoutPanel> 

       <ToolLayoutPanel
            // menuControls={menuControlsEditor}
            panelName="Editor">
              <div>
            <button onClick={()=>{recordContentInteraction({
                contentId:'mycontentId',
                stateVariables:{x:'1',y:'2'}
            })}}>Record Content Interaction</button>
            <br />
            <br />
            <br />
            <br />
            <button onClick={()=>{loadContentInteractions({
              contentId:'mycontentId'
            })}}>Update Content Interactions</button>
            <br />
            <b>Content Interactions</b>
            {contentInteractionsDivs}
            </div>
            </ToolLayoutPanel>

          {/* <ToolLayoutPanel menuControls={menuControlsViewer} panelName="Viewer">
            {alphabet} {alphabet} {alphabet} {alphabet}
          </ToolLayoutPanel>  */}
        </ToolLayout>
      </>
    );
  }


