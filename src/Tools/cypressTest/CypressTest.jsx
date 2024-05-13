import React, { useState, useEffect, useRef } from "react";
import { DoenetML } from "@doenet/doenetml";
// import testCodeDoenetML from './testCode.doenet?raw';
import { useLocation, useNavigate } from "react-router";

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
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveSubmissions: false,
    allowSaveEvents: false,
    autoSubmit: false,
    paginate: true,
    darkMode: "light",
  };
  let testSettings = JSON.parse(localStorage.getItem("test settings"));
  if (!testSettings) {
    testSettings = defaultTestSettings;
    localStorage.setItem("test settings", JSON.stringify(defaultTestSettings));
  }

  const [{ doenetMLstring, attemptNumber }, setBaseState] = useState({
    doenetMLstring: null,
    attemptNumber: testSettings.attemptNumber,
  });

  const [updateNumber, setUpdateNumber] = useState(testSettings.updateNumber);
  const [controlsVisible, setControlsVisible] = useState(
    testSettings.controlsVisible,
  );
  const [showCorrectness, setShowCorrectness] = useState(
    testSettings.showCorrectness,
  );
  const [readOnly, setReadOnly] = useState(testSettings.readOnly);
  const [showFeedback, setShowFeedback] = useState(testSettings.showFeedback);
  const [showHints, setShowHints] = useState(testSettings.showHints);

  const [darkMode, setDarkMode] = useState(testSettings.darkMode);

  const [allowLoadState, setAllowLoadState] = useState(
    testSettings.allowLoadState,
  );
  const [allowSaveState, setAllowSaveState] = useState(
    testSettings.allowSaveState,
  );
  const [allowLocalState, setAllowLocalState] = useState(
    testSettings.allowLocalState,
  );
  const [allowSaveSubmissions, setAllowSaveSubmissions] = useState(
    testSettings.allowSaveSubmissions,
  );
  const [allowSaveEvents, setAllowSaveEvents] = useState(
    testSettings.allowSaveEvents,
  );
  const [autoSubmit, setAutoSubmit] = useState(testSettings.autoSubmit);
  const [paginate, setPaginate] = useState(testSettings.paginate);
  const [_, setRefresh] = useState(0);
  const solutionDisplayMode = "button";

  let navigate = useNavigate();
  let location = useLocation();

  // requestedVariantIndex is undefined by default so that viewer
  // will use attemptNumber for variant
  // unless get a message (from cypress) to select a particular variant
  let requestedVariantIndex = useRef(undefined);

  //For Cypress Test Use
  window.onmessage = (e) => {
    let newDoenetMLstring = null,
      newAttemptNumber = attemptNumber;

    if (e.data.doenetML !== undefined) {
      newDoenetMLstring = e.data.doenetML;
    }

    if (e.data.requestedVariantIndex !== undefined) {
      requestedVariantIndex.current = e.data.requestedVariantIndex;
    }
    if (e.data.attemptNumber !== undefined) {
      newAttemptNumber = e.data.attemptNumber;
      testSettings.attemptNumber = newAttemptNumber;
      localStorage.setItem("test settings", JSON.stringify(testSettings));
    }

    // don't do anything if receive a message from another source (like the youtube player)
    if (newDoenetMLstring || newAttemptNumber !== attemptNumber) {
      setBaseState({
        doenetMLstring: newDoenetMLstring,
        attemptNumber: newAttemptNumber,
      });
    }
  };

  let controls = null;
  let buttonText = "show";
  if (controlsVisible) {
    buttonText = "hide";
    controls = (
      <div style={{ padding: "8px" }}>
        <div>
          <button
            id="testRunner_resetControls"
            onClick={() => {
              localStorage.setItem(
                "test settings",
                JSON.stringify(defaultTestSettings),
              );
              location.href = "/test";
            }}
          >
            Reset
          </button>
        </div>
        <hr />
        <div>
          <label>
            Attempt Number: {attemptNumber}{" "}
            <button
              id="testRunner_newAttempt"
              onClick={() => {
                testSettings.attemptNumber = testSettings.attemptNumber + 1;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setBaseState((was) => {
                  let newObj = { ...was };
                  newObj.attemptNumber++;
                  return newObj;
                });
              }}
            >
              New Attempt
            </button>{" "}
            <button
              onClick={() => {
                testSettings.attemptNumber = 1;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setBaseState((was) => {
                  let newObj = { ...was };
                  newObj.attemptNumber = 1;
                  return newObj;
                });
              }}
            >
              Reset Attempt Number
            </button>
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_showCorrectness"
              type="checkbox"
              checked={showCorrectness}
              onChange={() => {
                testSettings.showCorrectness = !testSettings.showCorrectness;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setShowCorrectness((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Show Correctness
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_readOnly"
              type="checkbox"
              checked={readOnly}
              onChange={() => {
                testSettings.readOnly = !testSettings.readOnly;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setReadOnly((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Read Only
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_showFeedback"
              type="checkbox"
              checked={showFeedback}
              onChange={() => {
                testSettings.showFeedback = !testSettings.showFeedback;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setShowFeedback((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Show Feedback
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_showHints"
              type="checkbox"
              checked={showHints}
              onChange={() => {
                testSettings.showHints = !testSettings.showHints;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setShowHints((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Show Hints
          </label>
        </div>
        <hr />
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowLoadState"
              type="checkbox"
              checked={allowLoadState}
              onChange={() => {
                testSettings.allowLoadState = !testSettings.allowLoadState;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setAllowLoadState((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Load Page State
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowSaveState"
              type="checkbox"
              checked={allowSaveState}
              onChange={() => {
                testSettings.allowSaveState = !testSettings.allowSaveState;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setAllowSaveState((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Save Page State
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowLocalState"
              type="checkbox"
              checked={allowLocalState}
              onChange={() => {
                testSettings.allowLocalState = !testSettings.allowLocalState;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setAllowLocalState((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Local Page State
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowSaveSubmissions"
              type="checkbox"
              checked={allowSaveSubmissions}
              onChange={() => {
                testSettings.allowSaveSubmissions =
                  !testSettings.allowSaveSubmissions;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setAllowSaveSubmissions((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Save Submissions
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowSaveEvents"
              type="checkbox"
              checked={allowSaveEvents}
              onChange={() => {
                testSettings.allowSaveEvents = !testSettings.allowSaveEvents;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setAllowSaveEvents((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Save Events
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_autoSubmit"
              type="checkbox"
              checked={autoSubmit}
              onChange={() => {
                testSettings.autoSubmit = !testSettings.autoSubmit;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setAutoSubmit((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Auto Submit Answers
          </label>
        </div>
        <hr />
        <div>
          <label>
            {" "}
            <input
              id="testRunner_paginate"
              type="checkbox"
              checked={paginate}
              onChange={() => {
                testSettings.paginate = !testSettings.paginate;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setPaginate((was) => !was);
                setUpdateNumber((was) => was + 1);
              }}
            />
            Paginate
          </label>
        </div>
        <hr />
        <div>
          <label>
            {" "}
            <input
              id="testRunner_darkmode"
              type="checkbox"
              checked={darkMode === "dark"}
              onChange={() => {
                setDarkMode(darkMode === "dark" ? "light" : "dark");
              }}
            />
            Dark Mode
          </label>
        </div>
      </div>
    );
  }

  let viewer = null;

  if (doenetMLstring) {
    viewer = (
      <DoenetML
        key={"activityViewer" + updateNumber}
        doenetML={doenetMLstring}
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
        activityId="activityIdFromCypress"
        idsIncludeActivityId={false}
        paginate={paginate}
        location={location}
        navigate={navigate}
        linkSettings={{
          viewURL: "/portfolioviewer",
          editURL: "/publiceditor",
        }}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div
      style={{ backgroundColor: "var(--canvas)", color: "var(--canvastext)" }}
      data-theme={darkMode}
    >
      <div style={{ backgroundColor: "var(--mainGray)" }}>
        <h3>
          <button
            id="testRunner_toggleControls"
            onClick={() => setControlsVisible((was) => !was)}
          >
            {buttonText} controls
          </button>
          Test Viewer and Core
        </h3>
        {controls}
      </div>
      {viewer}
    </div>
  );
}

export default Test;
