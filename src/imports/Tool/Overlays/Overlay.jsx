import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";
import { useToolControlHelper } from "../ToolRoot";
import axios from "axios";
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import  VisibilitySensor from 'react-visibility-sensor';
import Button from "../../PanelHeaderComponents/Button";
import { nanoid } from 'nanoid';

import { 
  useRecoilValue, 
  atom, 
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable, 
  useRecoilCallback
} from "recoil";
import DoenetViewer from '../../../Tools/DoenetViewer';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
// import 'codemirror/theme/material.css';
import 'codemirror/theme/xq-light.css';
// import 'codemirror/theme/neo.css';
// import 'codemirror/theme/base16-light.css';

import './editor.css';

const fileByContentId = atomFamily({
  key:"fileByContentId",
  default: selectorFamily({
    key:"fileByContentId/Default",
    get:(contentId)=> async ()=>{
      if (!contentId){
        return "";
      }
      return await axios.get(`/media/${contentId}`) 
    }
  })
  
})

const editorDoenetMLAtom = atom({
  key:"editorDoenetMLAtom",
  default:""
})

const viewerDoenetMLAtom = atom({
  key:"viewerDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})

const itemHistoryAtom = atomFamily({
  key:"itemHistoryAtom",
  default: selectorFamily({
    key:"itemHistoryAtom/Default",
    get:(branchId)=> async ()=>{
      // console.log(">>>itemHistoryAtom branchId",branchId)
      if (!branchId){
        return [];
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?branchId=${branchId}`
      );
      // console.log(">>>data",data)
      return data.versions
    }
  })
})




function DoenetViewerPanel1(){
  // console.log("=== DoenetViewer Panel")
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const editorInit = useRecoilValue(editorInitAtom1);

  if (!editorInit){ return null; }

  let attemptNumber = 1;
  let requestedVariant = { index: attemptNumber }
  let assignmentId = "myassignmentid";
  let solutionDisplayMode = "button";

  return <DoenetViewer
      key={"doenetviewer" + viewerDoenetML?.updateNumber}
      doenetML={viewerDoenetML?.doenetML}
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
}

const editorInitAtom1 = atom({
  key:"editorInit",
  default:false
})

export default function Overlay({ branchId,contentId, title }) {
  // console.log("===Editor!");

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    set(editorDoenetMLAtom,doenetML);
    const viewerObj = await snapshot.getPromise(viewerDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(viewerDoenetMLAtom,{updateNumber,doenetML})
    set(editorInitAtom1,true);
  })

  const setEditorInit = useSetRecoilState(editorInitAtom1);

  useEffect(() => {
    initDoenetML(branchId)
    return () => {
      setEditorInit(false);
    }
}, []);


  return (
    <Tool>
      <headerPanel title={title}>
      </headerPanel>

      <mainPanel>
        {/* <div><DoenetViewerUpdateButton  /></div> */}
        <div style={{overflowY:"scroll", height:"calc(100vh - 84px)" }}><DoenetViewerPanel1 /></div>
      </mainPanel>

      <supportPanel isInitOpen>
      {/* <TempEditorHeaderBar branchId={branchId} /> */}
          {/* <TextEditor  branchId={branchId}/> */}
      </supportPanel>

      <menuPanel title="Version history">
      </menuPanel>
    </Tool>
  );
}

// import React, { useEffect, useState, useRef } from "react";
// import Tool from "../Tool";
// import { useToolControlHelper } from "../ToolRoot";
// import axios from "axios";
// import sha256 from 'crypto-js/sha256';
// import CryptoJS from 'crypto-js';
// import  VisibilitySensor from 'react-visibility-sensor';
// import Button from "../../PanelHeaderComponents/Button";
// import { nanoid } from 'nanoid';

// import { 
//   useRecoilValue, 
//   atom, 
//   atomFamily,
//   selector,
//   selectorFamily,
//   useSetRecoilState,
//   useRecoilState,
//   useRecoilValueLoadable,
//   useRecoilStateLoadable, 
//   useRecoilCallback
// } from "recoil";
// import DoenetViewer from '../../../Tools/DoenetViewer';
// import {Controlled as CodeMirror} from 'react-codemirror2'
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/xml/xml';
// // import 'codemirror/theme/material.css';
// import 'codemirror/theme/xq-light.css';
// // import 'codemirror/theme/neo.css';
// // import 'codemirror/theme/base16-light.css';

// import './editor.css';


// export default function Editor({ branchId, title }) {



//   return (
//     <Tool>
//       <headerPanel title={title}>
//       </headerPanel>

//       <mainPanel>
//         <p>Test overlay</p>
//         {/* <div><DoenetViewerUpdateButton  /></div>
        // <div style={{overflowY:"scroll", height:"calc(100vh - 84px)" }}><DoenetViewerPanel1 /></div> */}
//       </mainPanel>

//       {/* <supportPanel isInitOpen>
//       <TempEditorHeaderBar branchId={branchId} />
//           <TextEditor  branchId={branchId}/>
//       </supportPanel> */}

//       <menuPanel title="Version history">
//         {/* <VersionHistoryPanel branchId={branchId} /> */}
//       </menuPanel>
//     </Tool>
//   );
// }
