import React, {useEffect} from "../../_snowpack/pkg/react.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {
  itemHistoryAtom,
  fileByContentId,
  variantInfoAtom,
  variantPanelAtom
} from "../ToolHandlers/CourseToolHandler.js";
import {currentDraftSelectedAtom} from "../Menus/VersionHistory.js";
const assignmentDoenetMLAtom = atom({
  key: "assignmentDoenetMLAtom",
  default: ""
});
export default function AssignmentViewer(props) {
  console.log(">>>===AssignmentViewer");
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const doenetML = useRecoilValue(assignmentDoenetMLAtom);
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (doenetId) => {
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId));
    const contentId = versionHistory.draft.contentId;
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object") {
      response = response.data;
    }
    const doenetML2 = response;
    set(assignmentDoenetMLAtom, doenetML2);
  }, []);
  useEffect(() => {
    initDoenetML(paramDoenetId);
    return () => {
    };
  }, [paramDoenetId]);
  if (doenetML === "") {
    return null;
  }
  let attemptNumber = 1;
  let solutionDisplayMode = "button";
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: "doenetviewer",
    doenetML,
    flags: {
      showCorrectness: true,
      readOnly: false,
      solutionDisplayMode,
      showFeedback: true,
      showHints: true
    },
    attemptNumber,
    allowLoadPageState: false,
    allowSavePageState: false,
    allowLocalPageState: false,
    allowSaveSubmissions: false,
    allowSaveEvents: false
  }));
}
