import React, {useEffect, useRef} from "../../_snowpack/pkg/react.js";
import PageViewer from "../../viewer/PageViewer.js";
import useEventListener from "../../_utils/hooks/useEventListener.js";
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {profileAtom, searchParamAtomFamily, suppressMenusAtom} from "../NewToolRoot.js";
import {
  fileByPageId,
  pageVariantInfoAtom,
  pageVariantPanelAtom
} from "../ToolHandlers/CourseToolHandler.js";
import {itemByDoenetId, courseIdAtom, useInitCourseItems, useSetCourseIdFromDoenetId} from "../../_reactComponents/Course/CourseActions.js";
import axios from "../../_snowpack/pkg/axios.js";
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
export const editorPageIdInitAtom = atom({
  key: "editorPageIdInitAtom",
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
export const useUpdateViewer = () => {
  const updateViewer = useRecoilCallback(({snapshot, set}) => async () => {
    const textEditorDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const isErrorState = await snapshot.getPromise(editorViewerErrorStateAtom);
    set(viewerDoenetMLAtom, textEditorDoenetML);
    if (isErrorState) {
      set(refreshNumberAtom, (was) => was + 1);
    }
  });
  return updateViewer;
};
export default function EditorViewer() {
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramPageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const paramlinkPageId = useRecoilValue(searchParamAtomFamily("linkPageId"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let effectivePageId = paramPageId;
  let effectiveDoenetId = doenetId;
  if (paramlinkPageId) {
    effectivePageId = paramlinkPageId;
    effectiveDoenetId = paramlinkPageId;
  }
  const courseId = useRecoilValue(courseIdAtom);
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorPageIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const pageObj = useRecoilValue(itemByDoenetId(effectivePageId));
  const activityObj = useRecoilValue(itemByDoenetId(doenetId));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const {canUpload} = useRecoilValue(profileAtom);
  const updateViewer = useUpdateViewer();
  useSetCourseIdFromDoenetId(effectiveDoenetId);
  useInitCourseItems(courseId);
  let pageInitiated = false;
  let label = null;
  if (Object.keys(pageObj).length > 0) {
    pageInitiated = true;
    if (activityObj?.isSinglePage && !paramlinkPageId) {
      label = activityObj?.label;
    } else {
      label = pageObj.label;
    }
  }
  useEffect(() => {
    const prevTitle = document.title;
    if (label) {
      document.title = `${label} - Doenet`;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [label]);
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (pageId) => {
    let {data: doenetML} = await axios.get(`/media/byPageId/${pageId}.doenet`);
    doenetML = doenetML.toString();
    let pageObj2 = await snapshot.getPromise(itemByDoenetId(pageId));
    let containingObj = await snapshot.getPromise(itemByDoenetId(pageObj2.containingDoenetId));
    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, doenetML);
    set(editorPageIdInitAtom, pageId);
    let suppress = [];
    if (containingObj.type == "bank") {
      suppress.push("AssignmentSettingsMenu");
    }
    if (pageObj2.type == "pageLink") {
      suppress.push("AssignmentSettingsMenu");
      suppress.push("PageLink");
      suppress.push("SupportingFilesMenu");
    }
    if (canUpload !== "1")
      suppress.push("SupportingFilesMenu");
    setSuppressMenus(suppress);
  }, [setSuppressMenus]);
  useEffect(() => {
    if (effectivePageId !== "" && pageInitiated) {
      initDoenetML(effectivePageId);
    }
    return () => {
      setEditorInit("");
    };
  }, [effectivePageId, pageInitiated]);
  useEventListener("keydown", (e) => {
    if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      updateViewer();
    }
  });
  if (courseId === "__not_found__") {
    return /* @__PURE__ */ React.createElement("h1", null, "Content not found or no permission to view content");
  } else if (effectivePageId !== initializedPageId) {
    return null;
  }
  let attemptNumber = 1;
  let solutionDisplayMode = "button";
  function variantCallback(generatedVariantInfo, allPossibleVariants, variantIndicesToIgnore = []) {
    const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo));
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
      variantIndicesToIgnore
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index
    });
  }
  return /* @__PURE__ */ React.createElement(PageViewer, {
    key: `pageViewer${refreshNumber}`,
    doenetML: viewerDoenetML,
    flags: {
      showCorrectness: true,
      solutionDisplayMode,
      showFeedback: true,
      showHints: true,
      allowLoadState: false,
      allowSaveState: false,
      allowLocalState: false,
      allowSaveSubmissions: false,
      allowSaveEvents: false
    },
    doenetId,
    attemptNumber,
    generatedVariantCallback: variantCallback,
    requestedVariantIndex: variantInfo.index,
    setIsInErrorState,
    pageIsActive: true
  });
}
