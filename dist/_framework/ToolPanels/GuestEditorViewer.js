import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import PageViewer from "../../viewer/PageViewer.js";
import {
  useRecoilValue,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {
  fileByDoenetId,
  pageVariantInfoAtom,
  pageVariantPanelAtom
} from "../ToolHandlers/CourseToolHandler.js";
import {findFirstPageOfActivity} from "../../_reactComponents/Course/CourseActions.js";
import axios from "../../_snowpack/pkg/axios.js";
import {editorPageIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom, viewerDoenetMLAtom, refreshNumberAtom, editorViewerErrorStateAtom} from "./EditorViewer.js";
export default function EditorViewer() {
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramPageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorPageIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const {page} = useRecoilValue(pageToolViewAtom);
  const [errMsg, setErrMsg] = useState(null);
  const [pageId, setPageId] = useState(null);
  useEffect(async () => {
    let resp = await axios.get(`/api/getPublicActivityDefinition.php`, {params: {doenetId}});
    if (!resp.data.success) {
      setErrMsg(resp.data.message);
      return;
    }
    let page2 = findFirstPageOfActivity(resp.data.json.order);
    if (!page2) {
      setErrMsg("Could not find a page of activity");
      return;
    }
    setPageId(page2);
  }, [doenetId, paramPageId]);
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (pageId2) => {
    let response = await snapshot.getPromise(fileByDoenetId(pageId2));
    const doenetML = response;
    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, doenetML);
    set(editorPageIdInitAtom, pageId2);
  }, []);
  useEffect(() => {
    if (pageId) {
      initDoenetML(pageId);
    }
    return () => {
      setEditorInit("");
    };
  }, [pageId]);
  if (pageId !== initializedPageId) {
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
  if (errMsg) {
    return /* @__PURE__ */ React.createElement("h1", null, errMsg);
  }
  return /* @__PURE__ */ React.createElement(PageViewer, {
    key: `pageViewer${refreshNumber}`,
    doenetML: viewerDoenetML,
    flags: {
      showCorrectness: true,
      readOnly: false,
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
