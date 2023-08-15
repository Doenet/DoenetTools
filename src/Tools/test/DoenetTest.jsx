import React, { useState, useEffect, useRef } from "react";
import { DoenetML } from "../../Viewer/DoenetML";
import testCodeDoenetML from "./testCode.doenet?raw";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "../../Core/utils/math.js";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router";

function Test() {
  // console.log("===Test")

  const [doenetML, setDoenetML] = useState(null);

  let navigate = useNavigate();
  let location = useLocation();

  //New ActivityViewer when code changes
  useEffect(() => {
    setDoenetML(testCodeDoenetML);
  }, [testCodeDoenetML]);

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

  const [updateNumber, setUpdateNumber] = useState(testSettings.updateNumber);
  const [attemptNumber, setAttemptNumber] = useState(
    testSettings.attemptNumber,
  );
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
  const solutionDisplayMode = "button";

  // TODO: currently, requestedVariantIndex cannot be changed from undefined
  // so variant is always determined by attemptNumber
  // Do we add the ability to specify requestedVariantIndex directly in test mode?
  let requestedVariantIndex = useRef(undefined);

  //Don't construct core until we have the doenetML defined
  if (doenetML === null) {
    return null;
  }

  let controls = null;
  let buttonText = "show";
  if (controlsVisible) {
    buttonText = "hide";
    controls = (
      <div style={{ padding: "8px" }}>
        <div>
          <button
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
              onClick={() => {
                testSettings.attemptNumber = testSettings.attemptNumber + 1;
                localStorage.setItem(
                  "test settings",
                  JSON.stringify(testSettings),
                );
                setAttemptNumber((was) => was + 1);
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
                setAttemptNumber(1);
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

  let viewer = (
    <DoenetML
      key={"activityViewer" + updateNumber}
      doenetML={doenetML}
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
      activityId="activityIdFromTest"
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

  return (
    <div
      style={{ backgroundColor: "var(--canvas)", color: "var(--canvastext)" }}
      data-theme={darkMode}
    >
      <MathJaxContext
        version={2}
        config={mathjaxConfig}
        onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
      >
        <div style={{ backgroundColor: "#e3e3e3" }}>
          <h3>
            <button onClick={() => setControlsVisible((was) => !was)}>
              {buttonText} controls
            </button>
            Test Viewer and Core
          </h3>
          {controls}
        </div>
        {viewer}
      </MathJaxContext>
    </div>
  );
}

if (import.meta.hot) {
  import.meta.hot.accept();
  // import.meta.hot.accept(({module}) => {
  //   Test = module.default;
  //   console.log(">>>ACCEPT CALLED in test!!!!!!!!!",module.default)
  //   console.log(">>>module",module)
  // }
  // );
}

export default Test;
