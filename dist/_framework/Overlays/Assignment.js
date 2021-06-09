import React from "../../_snowpack/pkg/react.js";
import {atom, useRecoilValue, useRecoilValueLoadable} from "../../_snowpack/pkg/recoil.js";
import Tool from "../Tool.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
import {assignmentDictionary} from "../../course/Course.js";
export const assignmentDoenetMLAtom = atom({
  key: "assignmentDoenetMLAtom",
  default: {updateNumber: 0, doenetML: "", attemptnumber: 0}
});
export default function Assignment({
  doenetId = "",
  assignmentId = "",
  contentId = "",
  title
}) {
  const assignmentInfo = useRecoilValueLoadable(assignmentDictionary());
  let aInfo = "";
  if (assignmentInfo?.state === "hasValue") {
    aInfo = assignmentInfo?.contents;
    if (aInfo?.assignmentId) {
      assignmentId = aInfo?.assignmentId;
    }
  }
  function DoenetViewerPanel(props) {
    const assignmentDoenetML = useRecoilValue(assignmentDoenetMLAtom);
    let attemptNumber = 1;
    let requestedVariant = {index: attemptNumber};
    let solutionDisplayMode = "button";
    return /* @__PURE__ */ React.createElement(DoenetViewer, {
      key: "doenetviewer",
      doenetML: assignmentDoenetML?.doenetML,
      flags: {
        showCorrectness: true,
        readOnly: false,
        solutionDisplayMode,
        showFeedback: true,
        showHints: true
      },
      attemptNumber,
      allowLoadPageState: true,
      allowSavePageState: true,
      allowLocalPageState: true,
      allowSaveSubmissions: true,
      allowSaveEvents: true,
      requestedVariant
    });
  }
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title
  }), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", {
    style: {overflowY: "scroll", height: "calc(100vh - 84px)"}
  }, /* @__PURE__ */ React.createElement(DoenetViewerPanel, null))), /* @__PURE__ */ React.createElement("supportPanel", null));
}
