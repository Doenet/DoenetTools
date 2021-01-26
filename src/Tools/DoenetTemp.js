import React, { useEffect, ErrorBoundary, useState } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom } from "../imports/Drive";
import AddItem from "../imports/AddItem";
import Switch from "../imports/Switch";
// import Button from "../imports/Button";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
} from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { supportVisible } from "../imports/Tool/SupportPanel";
import DoenetViewer from './DoenetViewer';

// import {UnControlled as CodeMirror} from 'react-codemirror2'
import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

export default function DoenetExampleTool(props) {
  // console.log("=== DoenetExampleTool");
  const setSupportVisiblity = useSetRecoilState(supportVisible);
  const setOverlayOpen = useSetRecoilState(openOverlayByName);

  const [updateNumber,setUpdateNumber] = useState(0);
  const [viewerDoenetML,setViewerDoenetML] = useState("");
  const [editorDoenetML,setEditorDoenetML] = useState("");


  return (
    <div>
      <CodeMirror
        value={editorDoenetML}
        // options={options}
        onBeforeChange={(editor, data, value) => {
          setEditorDoenetML(value)
        }}
        onChange={(editor, data, value) => {
        }}
      />
    </div>
    
  )

  // return (
  //   <ErrorBoundary key={"doenetErrorBoundry"}>
  //   <DoenetViewer 
  //           key={"doenetviewer"+updateNumber} //each component has their own key, change the key will trick Reach to look for new component
  //           doenetML="<p>test</p>" 
  //           mode={{
  //           // solutionType:this.state.solutionType,
  //           allowViewSolutionWithoutRoundTrip:false,
  //           showHints:true,
  //           showFeedback:true,
  //           showCorrectness:true,
  //       }}           
  //       />
  //       </ErrorBoundary>
  // )

  return (
    <Tool>
      <navPanel>
        {/* <p>navigate to important stuff</p> */}
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" /> */}
        {/* <Drive driveId="ZLHh5s8BWM2azTVFhazIH" urlClickBehavior="select" /> */}
        {/* <Drive types={['content','course']} /> */}
        <div>
          
        </div>
      </navPanel>

      <headerPanel title="my title">
        <p>header for important stuff</p>
      </headerPanel>

      <mainPanel>
        <p>do the main important stuff</p>
        <button
            onClick={() => {
              setOverlayOpen("George");
            }}
          >
            Editor in Overlay
          </button>
      </mainPanel>

      <menuPanel title="edit">
        <p>control important stuff</p>
      </menuPanel>


      <overlay>
        <headerPanel title="my title">
        <button
            onClick={() => {
              setOverlayOpen("");
            }}
          >
            Go Back
          </button>
          <Switch
            onChange={(value) => {
              setSupportVisiblity(value);
            }}
          />
          <p>header for important stuff</p>
        </headerPanel>

        <mainPanel>
          <button onClick={()=>{setViewerDoenetML(editorDoenetML)}}>Update</button>
          <p>{viewerDoenetML}</p>
        {/* <ErrorBoundary key={"doenetErrorBoundry"+updateNumber}>
      <DoenetViewer 
              key={"doenetviewer"+updateNumber} //each component has their own key, change the key will trick Reach to look for new component
              // free={{doenetCode: this.state.viewerDoenetML}} 
              doenetML={viewerDoenetML} 
          //     mode={{
          //     solutionType:this.state.solutionType,
          //     allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
          //     showHints:this.state.showHints,
          //     showFeedback:this.state.showFeedback,
          //     showCorrectness:this.state.showCorrectness,
          // }}           
          />
          </ErrorBoundary> */}
        </mainPanel>

        <supportPanel width="40%">
        <CodeMirror
        value={editorDoenetML}
        // options={options}
        onBeforeChange={(editor, data, value) => {
          setEditorDoenetML(value)
        }}
        onChange={(editor, data, value) => {
        }}
      />
        </supportPanel>

      
      </overlay>
    </Tool>
  );
}
