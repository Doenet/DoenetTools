import React from "../../_snowpack/pkg/react.js";
import {atom, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import Tool from "../Tool.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
const viewerContentDoenetMLAtom = atom({
  key: "viewerContentDoenetMLAtom",
  default: {updateNumber: 0, doenetML: ""}
});
export default function Content({branchId = "", contentId = "", title}) {
  function DoenetViewerPanel() {
    const viewerDoenetML = useRecoilValue(viewerContentDoenetMLAtom);
    let attemptNumber = 1;
    let requestedVariant = {index: attemptNumber};
    let assignmentId = "myassignmentid";
    let solutionDisplayMode = "button";
    return /* @__PURE__ */ React.createElement(DoenetViewer, {
      key: "doenetviewer" + viewerDoenetML?.updateNumber,
      doenetML: viewerDoenetML?.doenetML,
      contentId: contentId ? contentId : branchId,
      flags: {
        showCorrectness: true,
        readOnly: true,
        solutionDisplayMode,
        showFeedback: true,
        showHints: true
      },
      attemptNumber,
      assignmentId,
      ignoreDatabase: true,
      requestedVariant
    });
  }
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title
  }), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", {
    style: {overflowY: "scroll", height: "calc(100vh - 84px)"}
  }, /* @__PURE__ */ React.createElement(DoenetViewerPanel, null))));
}
