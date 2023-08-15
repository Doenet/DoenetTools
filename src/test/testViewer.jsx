import React, { useState } from "react";
import { DoenetML } from "../DoenetML";
import doenetML from "./testCode.doenet?raw";
// import { useLocation, useNavigate } from "react-router";
import Button from "../uiComponents/Button";

export function TestViewer() {
  // let navigate = useNavigate();
  // let location = useLocation();

  const defaultTestSettings = {
    showCorrectness: true,
    readOnly: false,
    showFeedback: true,
    showHints: true,
    allowLocalState: false,
    autoSubmit: false,
    paginate: true,
    darkMode: "light",
  };

  const [controlsVisible, setControlsVisible] = useState(false);
  const [testSettings, setTestSettings] = useState(defaultTestSettings);
  const [updateNumber, setUpdateNumber] = useState(0);

  let {
    showCorrectness,
    readOnly,
    showFeedback,
    showHints,
    allowLocalState,
    autoSubmit,
    paginate,
    darkMode,
  } = testSettings;

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
        <p>
          The DoenetML is displayed is loaded from the file:{" "}
          <code>src/test/testCode.doenet</code>.
        </p>

        <div>
          <Button
            onClick={() => {
              setTestSettings(defaultTestSettings);
              setUpdateNumber((was) => was + 1);
            }}
            value="Reset"
          />
        </div>
        <hr />
        <div>
          <label>
            {" "}
            <input
              type="checkbox"
              checked={showCorrectness}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.showCorrectness = !was.showCorrectness;
                  return newObj;
                });
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
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.readOnly = !was.readOnly;
                  return newObj;
                });
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
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.showFeedback = !was.showFeedback;
                  return newObj;
                });
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
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.showHints = !was.showHints;
                  return newObj;
                });
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
              checked={allowLocalState}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.allowLocalState = !was.allowLocalState;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Local State
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              type="checkbox"
              checked={autoSubmit}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.autoSubmit = !was.autoSubmit;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Autosubmit
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              type="checkbox"
              checked={paginate}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.paginate = !was.paginate;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Paginate
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              type="checkbox"
              checked={darkMode === "dark"}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.darkMode = was.darkMode === "dark" ? "light" : "dark";
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Dark Mode
          </label>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          backgroundColor: "#e3e3e3",
          marginBottom: "12px",
          padding: "8px",
        }}
      >
        <h3>
          <div style={{ display: "flex" }}>
            Test DoenetML
            <Button
              onClick={() => setControlsVisible((was) => !was)}
              value={buttonText + " controls"}
              style={{ marginLeft: "12px" }}
            />
          </div>
        </h3>
        {controls}
      </div>
      <DoenetML
        key={"doenetml" + updateNumber}
        doenetML={doenetML}
        flags={{
          showCorrectness,
          readOnly,
          showFeedback,
          showHints,
          allowLocalState,
          autoSubmit,
        }}
        activityId="activityIdFromTest"
        idsIncludeActivityId={false}
        paginate={paginate}
        // location={location}
        // navigate={navigate}
        linkSettings={{
          viewURL: "/portfolioviewer",
          editURL: "/publiceditor",
        }}
        darkMode={darkMode}
        addVirtualKeyboard={true}
      />
    </div>
  );
}
