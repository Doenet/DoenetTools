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


  // return (
  //   <div>
  //     <CodeMirror
  //       value={editorDoenetML}
  //       // options={options}
  //       onBeforeChange={(editor, data, value) => {
  //         setEditorDoenetML(value)
  //       }}
  //       onChange={(editor, data, value) => {
  //       }}
  //     />
  //   </div>
    
  // )
  let attemptNumber = 1;
  let requestedVariant = { index: attemptNumber }
  let assignmentId = "myassignmentid";
  let solutionDisplayMode = "button";

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
          <button onClick={()=>{
            setViewerDoenetML(editorDoenetML);
            setUpdateNumber((old)=>{return old+1})
            }}>Update</button>
          <DoenetViewer
            key={"doenetviewer" + updateNumber}
            doenetML={viewerDoenetML}
            flags={{
              showCorrectness: true,
              readOnly: false,
              solutionDisplayMode: solutionDisplayMode,
              showFeedback: true,
              showHints: true,
            }}
            attemptNumber={attemptNumber}
            assignmentId={assignmentId}
            ignoreDatabase={false}
            requestedVariant={requestedVariant}

          />
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
