import React, {useState, useEffect, useRef} from "../_snowpack/pkg/react.js";
import DoenetViewer from "../viewer/DoenetViewer.js";
import doenetDefaultML from "./defaultCode.js";
export default function DoenetTest() {
  useEffect(() => {
    doenetML.current = doenetDefaultML;
    setUpdateNumber((was) => was + 1);
  }, doenetDefaultML);
  let doenetML = useRef("");
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [updateNumber, setUpdateNumber] = useState(1);
  const showCorrectness = true;
  const readOnly = false;
  const solutionDisplayMode = "button";
  const showFeedback = true;
  const showHints = true;
  const ignoreDatabase = true;
  const requestedVariant = {index: 1};
  window.onmessage = (e) => {
    if (e.data.doenetML !== void 0) {
      doenetML.current = e.data.doenetML;
      setUpdateNumber((was) => was + 1);
    }
  };
  if (doenetML.current === "") {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {backgroundColor: "#e3e3e3"}
  }, /* @__PURE__ */ React.createElement("h3", null, "Test Tool"), /* @__PURE__ */ React.createElement("label", null, "Attempt Number: ", attemptNumber, " ", /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      setAttemptNumber((was) => was + 1);
      setUpdateNumber((was) => was + 1);
    }
  }, "New Attempt"))), /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: "doenetviewer" + updateNumber,
    doenetML: doenetML.current,
    flags: {
      showCorrectness,
      readOnly,
      solutionDisplayMode,
      showFeedback,
      showHints
    },
    attemptNumber,
    ignoreDatabase,
    requestedVariant
  }));
}
