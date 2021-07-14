import React, {useEffect} from "../../_snowpack/pkg/react.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
import {
  useRecoilValue,
  atom,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {itemHistoryAtom, fileByContentId} from "../ToolHandlers/CourseToolHandler.js";
export const viewerDoenetMLAtom = atom({
  key: "viewerDoenetMLAtom",
  default: ""
});
export const textEditorDoenetMLAtom = atom({
  key: "textEditorDoenetMLAtom",
  default: ""
});
export const editorDoenetIdInitAtom = atom({
  key: "editorDoenetIdInitAtom",
  default: ""
});
export default function EditorViewer(props) {
  console.log(">>>===EditorViewer");
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (doenetId) => {
    console.log(">>>initDoenetML doenetId", doenetId);
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId));
    const contentId = versionHistory.draft.contentId;
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object") {
      response = response.data;
    }
    const doenetML = response;
    set(textEditorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, doenetML);
    set(editorDoenetIdInitAtom, doenetId);
  }, []);
  useEffect(() => {
    console.log(">>>paramDoenetId updated!", paramDoenetId);
    initDoenetML(paramDoenetId);
    return () => {
    };
  }, [paramDoenetId]);
  if (paramDoenetId !== initilizedDoenetId) {
    console.log(">>>CHANGING DoenetId!");
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  let attemptNumber = 1;
  let solutionDisplayMode = "button";
  function variantCallback(generatedVariantInfo, allPossibleVariants) {
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: "doenetviewer",
    doenetML: viewerDoenetML,
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
    allowSaveEvents: false,
    generatedVariantCallback: variantCallback,
    requestedVariant: {index: 0}
  }));
}
