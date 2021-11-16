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
export const viewerDoenetMLAtom = atom({
  key: "viewerDoenetMLAtom",
  default: ""
});
export const textEditorDoenetMLAtom = atom({
  key: "textEditorDoenetMLAtom",
  default: ""
});
export const updateTextEditorDoenetMLAtom = atom({
  key: "updateTextEditorDoenetMLAtom",
  default: ""
});
export const editorDoenetIdInitAtom = atom({
  key: "editorDoenetIdInitAtom",
  default: ""
});
export const refreshNumberAtom = atom({
  key: "refreshNumberAtom",
  default: 0
});
export const editorViewerErrorStateAtom = atom({
  key: "editorViewerErrorStateAtom",
  default: false
});
export default function EditorViewer() {
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(variantInfoAtom);
  const setVariantPanel = useSetRecoilState(variantPanelAtom);
  const setEditorInit = useSetRecoilState(editorDoenetIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (doenetId) => {
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId));
    const contentId = versionHistory.draft.contentId;
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object") {
      response = response.data;
    }
    const doenetML = response;
    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, doenetML);
    set(editorDoenetIdInitAtom, doenetId);
  }, []);
  useEffect(() => {
    if (paramDoenetId !== "") {
      initDoenetML(paramDoenetId);
    }
    return () => {
      setEditorInit("");
    };
  }, [paramDoenetId]);
  if (paramDoenetId !== initilizedDoenetId) {
    return null;
  }
  let attemptNumber = 1;
  let solutionDisplayMode = "button";
  if (variantInfo.lastUpdatedIndexOrName === "Index") {
    setVariantInfo((was) => {
      let newObj = {...was};
      newObj.lastUpdatedIndexOrName = null;
      newObj.requestedVariant = {index: variantInfo.index};
      return newObj;
    });
  } else if (variantInfo.lastUpdatedIndexOrName === "Name") {
    setVariantInfo((was) => {
      let newObj = {...was};
      newObj.lastUpdatedIndexOrName = null;
      newObj.requestedVariant = {name: variantInfo.name};
      return newObj;
    });
  }
  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo));
    cleanGeneratedVariant.lastUpdatedIndexOrName = null;
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      name: cleanGeneratedVariant.name,
      allPossibleVariants
    });
    setVariantInfo((was) => {
      let newObj = {...was};
      Object.assign(newObj, cleanGeneratedVariant);
      return newObj;
    });
  }
  return /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: `doenetviewer${refreshNumber}`,
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
    requestedVariant: variantInfo.requestedVariant,
    setIsInErrorState
  });
}
