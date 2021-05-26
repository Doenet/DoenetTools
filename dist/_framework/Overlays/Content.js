import React from "../../_snowpack/pkg/react.js";
import {atom, useRecoilValue, useRecoilValueLoadable} from "../../_snowpack/pkg/recoil.js";
import Tool from "../Tool.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
import {itemHistoryAtom} from "../../_sharedRecoil/content.js";
const viewerContentDoenetMLAtom = atom({
  key: "viewerContentDoenetMLAtom",
  default: {updateNumber: 0, doenetML: ""}
});
export default function Content({branchId = "", title}) {
  function DoenetViewerPanel() {
    const viewerDoenetML = useRecoilValue(viewerContentDoenetMLAtom);
    const versionHistory = useRecoilValueLoadable(itemHistoryAtom(branchId));
    if (versionHistory.state === "loading") {
      return null;
    }
    if (versionHistory.state === "hasError") {
      console.error(versionHistory.contents);
      return null;
    }
    let contentId = "";
    for (let version of versionHistory.contents.named) {
      if (version?.isAssigned === "1") {
        contentId = version.contentId;
      }
    }
    let attemptNumber = 1;
    let requestedVariant = {index: attemptNumber};
    let assignmentId = "myassignmentid";
    let solutionDisplayMode = "button";
    return /* @__PURE__ */ React.createElement(DoenetViewer, {
      key: "doenetviewer" + viewerDoenetML?.updateNumber,
      doenetML: viewerDoenetML?.doenetML,
      contentId,
      flags: {
        showCorrectness: true,
        readOnly: false,
        solutionDisplayMode,
        showFeedback: true,
        showHints: true
      },
      attemptNumber,
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
