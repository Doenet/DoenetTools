import React, { useState, useEffect, useRef } from 'react';
import DoenetViewer from '../../Tools/_framework/ToolPanels/AssignmentViewer';
import testCodeDoenetML from './testCode.doenet?raw';
import core from '../../Core/Core';

// import MathInputPallet from '../_framework/temp/MathInputPallet'

// function Test() {
//   // console.log("===Test")

//   const [doenetML,setDoenetML] = useState(null);

//   //New DoenetViewer when code changes
//   useEffect(() => {
//     setDoenetML(testCodeDoenetML);
//   }, [testCodeDoenetML]);

//   const defaultTestSettings = {
//     updateNumber:0,
//     attemptNumber:1,
//     controlsVisible:false,
//     showCorrectness:true,
//     readOnly:false,
//     showFeedback:true,
//     showHints:true,
//     bundledCore:false,
//     allowLoadState:false,
//     allowSaveState:false,
//     allowLocalState:false,
//     allowSaveSubmissions:false,
//     allowSaveEvents:false,
//   }
//   let testSettings = JSON.parse(localStorage.getItem("test settings")) 
//   if (!testSettings){
//     testSettings = defaultTestSettings;
//     localStorage.setItem("test settings",JSON.stringify(defaultTestSettings))
//   }
  

//   const [updateNumber, setUpdateNumber] = useState(testSettings.updateNumber);
//   const [attemptNumber, setAttemptNumber] = useState(testSettings.attemptNumber);
//   const [controlsVisible, setControlsVisible] = useState(testSettings.controlsVisible);
//   const [showCorrectness, setShowCorrectness] = useState(testSettings.showCorrectness);
//   const [readOnly, setReadOnly] = useState(testSettings.readOnly);
//   const [showFeedback, setShowFeedback] = useState(testSettings.showFeedback);
//   const [showHints, setShowHints] = useState(testSettings.showHints);

//   const [bundledCore, setBundledCore] = useState(testSettings.bundledCore);
//   const [allowLoadState, setAllowLoadState] = useState(testSettings.allowLoadState);
//   const [allowSaveState, setAllowSaveState] = useState(testSettings.allowSaveState);
//   const [allowLocalState, setAllowLocalState] = useState(testSettings.allowLocalState);
//   const [allowSaveSubmissions, setAllowSaveSubmissions] = useState(testSettings.allowSaveSubmissions);
//   const [allowSaveEvents, setAllowSaveEvents] = useState(testSettings.allowSaveEvents);
//   const [_, setRefresh] = useState(0);
//   const solutionDisplayMode = "button";

//   // let requestedVariant = useRef({ index: 0 });
//   // requestedVariant is undefined by default so that viewer
//   // will use attemptNumber for variant
//   // unless get a message (from cypress) to select a particular variant
//   let requestedVariant = useRef(undefined);



//   //For Cypress Test Use
//   window.onmessage = (e) => {
//     if (e.data.doenetML !== undefined) {
//       //Only if defined
//       if (e.data.requestedVariant) {
//         requestedVariant.current = e.data.requestedVariant;
//       }
//       setDoenetML(e.data.doenetML);
//     }
//   };

//   //Don't construct core until we have the doenetML defined
//   if (doenetML === null) {
//     return null;
//   }

//   let controls = null;
//   let buttonText = 'show';
//   if (controlsVisible) {
//     buttonText = 'hide';
//     controls = <div style={{padding:"8px"}}>
//       <div><button onClick={()=>{
//         localStorage.setItem("test settings",JSON.stringify(defaultTestSettings))
//         location.href = '/test';
//       }}>Reset</button></div>
//       <hr />
//       <div>
//         <label>Attempt Number: {attemptNumber} <button onClick={
//           () => {
//             testSettings.attemptNumber = testSettings.attemptNumber + 1;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setAttemptNumber(was => was + 1)
//           }
//         }>New Attempt</button> <button onClick={
//           () => {
//             testSettings.attemptNumber = 1;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setAttemptNumber(1)
//           }
//         }>Reset Attempt Number</button></label>
//       </div>
//       <div>
//         <label> <input type='checkbox' checked={showCorrectness} onChange={
//           () => {
//             testSettings.showCorrectness = !testSettings.showCorrectness;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setShowCorrectness(was => !was)
//             setUpdateNumber(was => was+1)


//           }
//         } />Show Correctness</label>
//       </div>
//       <div>
//         <label> <input type='checkbox' checked={readOnly} onChange={
//           () => {
//             testSettings.readOnly = !testSettings.readOnly;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setReadOnly(was => !was)
//             setUpdateNumber(was => was+1)

//           }
//         } />Read Only</label>
//       </div>
//       <div>
//         <label> <input type='checkbox' checked={showFeedback} onChange={
//           () => {
//             testSettings.showFeedback = !testSettings.showFeedback;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setShowFeedback(was => !was)
//             setUpdateNumber(was => was+1)

//           }
//         } />Show Feedback</label>
//       </div>
//       <div>
//         <label> <input type='checkbox' checked={showHints} onChange={
//           () => {
//             testSettings.showHints = !testSettings.showHints;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setShowHints(was => !was)
//             setUpdateNumber(was => was+1)

//           }
//         } />Show Hints</label>
//       </div>
//      <hr />
//       <div>
//         <label> <input type='checkbox' checked={allowLoadState} onChange={
//           () => {
//             testSettings.allowLoadState = !testSettings.allowLoadState;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setAllowLoadState(was => !was)
//             setUpdateNumber(was => was+1)

//           }
//         } />Allow Load Page State</label>
//       </div>
//       <div>
//         <label> <input type='checkbox' checked={allowSaveState} onChange={
//           () => {
//             testSettings.allowSaveState = !testSettings.allowSaveState;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setAllowSaveState(was => !was)
//             setUpdateNumber(was => was+1)

//           }
//         } />Allow Save Page State</label>
//       </div>
//       <div>
//         <label> <input type='checkbox' checked={allowLocalState} onChange={
//           () => {
//             testSettings.allowLocalState = !testSettings.allowLocalState;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setAllowLocalState(was => !was)
//             setUpdateNumber(was => was+1)

//           }
//         } />Allow Local Page State</label>
//       </div>
//       <div>
//         <label> <input type='checkbox' checked={allowSaveSubmissions} onChange={
//           () => {
//             testSettings.allowSaveSubmissions = !testSettings.allowSaveSubmissions;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setAllowSaveSubmissions(was => !was)
//             setUpdateNumber(was => was+1)

//           }
//         } />Allow Save Submissions</label>
//       </div>
//       <div>
//         <label> <input type='checkbox' checked={allowSaveEvents} onChange={
//           () => {
//             testSettings.allowSaveEvents = !testSettings.allowSaveEvents;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setAllowSaveEvents(was => !was)
//             setUpdateNumber(was => was+1)

//           }
//         } />Allow Save Events</label>
//       </div>
//      <hr />
//       <div>
//         <label> <input type='checkbox' checked={bundledCore} onChange={
//           () => {
//             testSettings.bundledCore = !testSettings.bundledCore;
//             localStorage.setItem("test settings",JSON.stringify(testSettings))
//             setBundledCore(was => !was)
//             setUpdateNumber(was => was+1)
//           }
//         } />Bundled Core</label>
//       </div>
//     </div>
//   }

//   let coreProp = core;
//   if (bundledCore) {
//     coreProp = null;
//   }



  return (
    <>
      <div style={{ backgroundColor: "#e3e3e3" }}><h3><button onClick={() => setControlsVisible(was => !was)}>{buttonText} controls</button>
        Test Viewer and Core
           </h3>
        {controls}
      </div>
      <DoenetViewer
        key={"doenetviewer"+updateNumber}
        doenetML={doenetML}
        // cid={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
        flags={{
          showCorrectness,
          readOnly,
          solutionDisplayMode,
          showFeedback,
          showHints,
          allowLoadState,
          allowSaveState,
          allowLocalState,
          allowSaveSubmissions,
          allowSaveEvents,
        }}
        attemptNumber={attemptNumber}
        requestedVariant={requestedVariant.current}
        core={coreProp}
        doenetId="doenetId"
      // collaborate={true}
      // viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
      // functionsSuppliedByChild = {this.functionsSuppliedByChild}
      />
      {/* <MathInputPallet /> */}
    </>
  )
}

// if (import.meta.hot) {
//   import.meta.hot.accept();
//   // import.meta.hot.accept(({module}) => {
//   //   Test = module.default;
//   //   console.log(">>>ACCEPT CALLED in test!!!!!!!!!",module.default)
//   //   console.log(">>>module",module)
//   // }
//   // );
// }


// export default Test;