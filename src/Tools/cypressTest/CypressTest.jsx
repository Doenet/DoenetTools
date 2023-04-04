import React, { useState, useEffect, useRef } from 'react';
import PageViewer from '../../Viewer/PageViewer.jsx';
import ActivityViewer from '../../Viewer/ActivityViewer.jsx';
// import {plainText as testCodeDoenetML } from './testCode.doenet';

function Test() {
  // console.log("===Test")



  const defaultTestSettings = {
    updateNumber: 0,
    attemptNumber: 1,
    controlsVisible: false,
    showCorrectness: true,
    readOnly: false,
    showFeedback: true,
    showHints: true,
    bundledCore: true,
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveSubmissions: false,
    allowSaveEvents: false,
    autoSubmit: false,
    paginate: true,
  }
  let testSettings = JSON.parse(localStorage.getItem("test settings"))
  if (!testSettings) {
    testSettings = defaultTestSettings;
    localStorage.setItem("test settings", JSON.stringify(defaultTestSettings))
  }

  const [{
    doenetML,
    activityDefinition,
    attemptNumber
  },
    setBaseState
  ] = useState({
    doenetML: null,
    activityDefinition: null,
    attemptNumber: testSettings.attemptNumber
  })


  const [updateNumber, setUpdateNumber] = useState(testSettings.updateNumber);
  const [controlsVisible, setControlsVisible] = useState(testSettings.controlsVisible);
  const [showCorrectness, setShowCorrectness] = useState(testSettings.showCorrectness);
  const [readOnly, setReadOnly] = useState(testSettings.readOnly);
  const [showFeedback, setShowFeedback] = useState(testSettings.showFeedback);
  const [showHints, setShowHints] = useState(testSettings.showHints);

  const [bundledCore, setBundledCore] = useState(testSettings.bundledCore);
  const [allowLoadState, setAllowLoadState] = useState(testSettings.allowLoadState);
  const [allowSaveState, setAllowSaveState] = useState(testSettings.allowSaveState);
  const [allowLocalState, setAllowLocalState] = useState(testSettings.allowLocalState);
  const [allowSaveSubmissions, setAllowSaveSubmissions] = useState(testSettings.allowSaveSubmissions);
  const [allowSaveEvents, setAllowSaveEvents] = useState(testSettings.allowSaveEvents);
  const [autoSubmit, setAutoSubmit] = useState(testSettings.autoSubmit);
  const [paginate, setPaginate] = useState(testSettings.paginate);
  const [_, setRefresh] = useState(0);
  const solutionDisplayMode = "button";

  // requestedVariantIndex is undefined by default so that viewer
  // will use attemptNumber for variant
  // unless get a message (from cypress) to select a particular variant
  let requestedVariantIndex = useRef(undefined);


  //For Cypress Test Use
  window.onmessage = (e) => {
    let newDoenetML = null, newActivityDefinition = null, newAttemptNumber = attemptNumber;

    if (e.data.doenetML !== undefined) {
      newDoenetML = e.data.doenetML;
    } else if (e.data.activityDefinition !== undefined) {
      newActivityDefinition = e.data.activityDefinition;
    }

    if (e.data.requestedVariantIndex !== undefined) {
      requestedVariantIndex.current = e.data.requestedVariantIndex;
    }
    if (e.data.attemptNumber !== undefined) {
      newAttemptNumber = e.data.attemptNumber
      testSettings.attemptNumber = newAttemptNumber;
      localStorage.setItem("test settings", JSON.stringify(testSettings))
    }

    // don't do anything if receive a message from another source (like the youtube player)
    if (newDoenetML || newActivityDefinition || newAttemptNumber !== attemptNumber) {
      setBaseState({
        doenetML: newDoenetML,
        activityDefinition: newActivityDefinition,
        attemptNumber: newAttemptNumber
      })
    }

  };

  let controls = null;
  let buttonText = 'show';
  if (controlsVisible) {
    buttonText = 'hide';
    controls = <div style={{ padding: "8px" }}>
      <div><button id="testRunner_resetControls" onClick={() => {
        localStorage.setItem("test settings", JSON.stringify(defaultTestSettings))
        location.href = '/test';
      }}>Reset</button></div>
      <hr />
      <div>
        <label>Attempt Number: {attemptNumber} <button id="testRunner_newAttempt" onClick={
          () => {
            testSettings.attemptNumber = testSettings.attemptNumber + 1;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setBaseState(was => {
              let newObj = { ...was };
              newObj.attemptNumber++;
              return newObj;
            })
          }
        }>New Attempt</button> <button onClick={
          () => {
            testSettings.attemptNumber = 1;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setBaseState(was => {
              let newObj = { ...was };
              newObj.attemptNumber = 1;
              return newObj;
            })
          }
        }>Reset Attempt Number</button></label>
      </div>
      <div>
        <label> <input id="testRunner_showCorrectness" type='checkbox' checked={showCorrectness} onChange={
          () => {
            testSettings.showCorrectness = !testSettings.showCorrectness;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setShowCorrectness(was => !was)
            setUpdateNumber(was => was + 1)


          }
        } />Show Correctness</label>
      </div>
      <div>
        <label> <input id="testRunner_readOnly" type='checkbox' checked={readOnly} onChange={
          () => {
            testSettings.readOnly = !testSettings.readOnly;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setReadOnly(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Read Only</label>
      </div>
      <div>
        <label> <input id="testRunner_showFeedback" type='checkbox' checked={showFeedback} onChange={
          () => {
            testSettings.showFeedback = !testSettings.showFeedback;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setShowFeedback(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Show Feedback</label>
      </div>
      <div>
        <label> <input id="testRunner_showHints" type='checkbox' checked={showHints} onChange={
          () => {
            testSettings.showHints = !testSettings.showHints;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setShowHints(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Show Hints</label>
      </div>
      <hr />
      <div>
        <label> <input id="testRunner_allowLoadState" type='checkbox' checked={allowLoadState} onChange={
          () => {
            testSettings.allowLoadState = !testSettings.allowLoadState;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setAllowLoadState(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Allow Load Page State</label>
      </div>
      <div>
        <label> <input id="testRunner_allowSaveState" type='checkbox' checked={allowSaveState} onChange={
          () => {
            testSettings.allowSaveState = !testSettings.allowSaveState;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setAllowSaveState(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Allow Save Page State</label>
      </div>
      <div>
        <label> <input id="testRunner_allowLocalState" type='checkbox' checked={allowLocalState} onChange={
          () => {
            testSettings.allowLocalState = !testSettings.allowLocalState;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setAllowLocalState(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Allow Local Page State</label>
      </div>
      <div>
        <label> <input id="testRunner_allowSaveSubmissions" type='checkbox' checked={allowSaveSubmissions} onChange={
          () => {
            testSettings.allowSaveSubmissions = !testSettings.allowSaveSubmissions;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setAllowSaveSubmissions(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Allow Save Submissions</label>
      </div>
      <div>
        <label> <input id="testRunner_allowSaveEvents" type='checkbox' checked={allowSaveEvents} onChange={
          () => {
            testSettings.allowSaveEvents = !testSettings.allowSaveEvents;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setAllowSaveEvents(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Allow Save Events</label>
      </div>
      <div>
        <label> <input id="testRunner_autoSubmit" type='checkbox' checked={autoSubmit} onChange={
          () => {
            testSettings.autoSubmit = !testSettings.autoSubmit;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setAutoSubmit(was => !was)
            setUpdateNumber(was => was + 1)

          }
        } />Auto Submit Answers</label>
      </div>
      <hr />
      <div>
        <label> <input id="testRunner_paginate" type='checkbox' checked={paginate} onChange={
          () => {
            testSettings.paginate = !testSettings.paginate;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setPaginate(was => !was)
            setUpdateNumber(was => was + 1)
          }
        } />Paginate</label>
      </div>
      <hr />
      <div>
        <label> <input id="testRunner_bundledCore" type='checkbox' checked={bundledCore} onChange={
          () => {
            testSettings.bundledCore = !testSettings.bundledCore;
            localStorage.setItem("test settings", JSON.stringify(testSettings))
            setBundledCore(was => !was)
            setUpdateNumber(was => was + 1)
          }
        } />Bundled Core</label>
      </div>
    </div>
  }

  let viewer = null;
  if (doenetML !== null) {
    viewer = <PageViewer
      key={"pageviewer" + updateNumber}
      doenetML={doenetML}
      // cid={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
      updateDataOnContentChange={true}
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
        autoSubmit,
      }}
      attemptNumber={attemptNumber}
      requestedVariantIndex={requestedVariantIndex.current}
      unbundledCore={!bundledCore}
      doenetId="doenetIdFromCypress"
      pageIsActive={true}
    // collaborate={true}
    // viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
    // functionsSuppliedByChild = {this.functionsSuppliedByChild}
    />
  } else if (activityDefinition !== null) {
    viewer = <ActivityViewer
      key={"activityViewer" + updateNumber}
      // doenetML={doenetML}
      activityDefinition={activityDefinition}
      // cid={"bafkreigruw4fxnisjul3oer255qd5mqxaqmbp7j2rywmkzoyg7wfoxzduq"}
      updateDataOnContentChange={true}
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
        autoSubmit,
      }}
      attemptNumber={attemptNumber}
      requestedVariantIndex={requestedVariantIndex.current}
      unbundledCore={!bundledCore}
      doenetId="doenetIdFromCypress"
      paginate={paginate}
    // collaborate={true}
    // viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
    // functionsSuppliedByChild = {this.functionsSuppliedByChild}
    />
  }


  return (
    <>
      <div style={{ backgroundColor: "var(--mainGray)" }}><h3><button id="testRunner_toggleControls" onClick={() => setControlsVisible(was => !was)}>{buttonText} controls</button>
        Test Viewer and Core
      </h3>
        {controls}
      </div>
      {viewer}

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


export default Test;