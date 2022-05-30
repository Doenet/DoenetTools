import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import PageViewer from "../../viewer/PageViewer.js";
import {
  useRecoilValue,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom
} from "../ToolHandlers/CourseToolHandler.js";
import {findFirstPageOfActivity} from "../../_reactComponents/Course/CourseActions.js";
import axios from "../../_snowpack/pkg/axios.js";
import {editorPageIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom, viewerDoenetMLAtom, refreshNumberAtom, editorViewerErrorStateAtom} from "./EditorViewer.js";
import {retrieveTextFileForCid} from "../../core/utils/retrieveTextFile.js";
import {parseActivityDefinition} from "../../_utils/activityUtils.js";
export default function EditorViewer() {
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorPageIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const [pageCid, setPageCid] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  useEffect(async () => {
    let resp = await axios.get(`/api/getCidForAssignment.php`, {params: {doenetId, latestAttemptOverrides: false, publicOnly: true, userCanViewSourceOnly: true}});
    let activityCid;
    if (!resp.data.success || !resp.data.cid) {
      if (resp.data.cid) {
        setErrMsg(`Error loading activity: ${resp.data.message}`);
      } else {
        setErrMsg(`Error loading activity: public content with public source not found`);
      }
      return;
    } else {
      activityCid = resp.data.cid;
    }
    let activityDefinition;
    try {
      activityDefinition = await retrieveTextFileForCid(activityCid, "doenet");
    } catch (e) {
      setErrMsg(`Error loading activity: activity file not found`);
      return;
    }
    let parseResult = parseActivityDefinition(activityDefinition);
    if (!parseResult.success) {
      setErrMsg(`Invalid activity definition: ${parseResult.message}`);
      return;
    }
    let activityJSON = parseResult.activityJSON;
    setPageCid(findFirstPageCidFromCompiledActivity(activityJSON.order));
    if (errMsg) {
      setErrMsg(null);
    }
  }, [doenetId]);
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (pageCid2) => {
    const doenetML = await retrieveTextFileForCid(pageCid2, "doenet");
    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, doenetML);
  }, []);
  useEffect(() => {
    if (pageCid) {
      initDoenetML(pageCid);
    }
    return () => {
      setEditorInit("");
    };
  }, [pageCid]);
  if (errMsg) {
    return /* @__PURE__ */ React.createElement("h1", null, errMsg);
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
  if (!viewerDoenetML) {
    return null;
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
function findFirstPageCidFromCompiledActivity(orderObj) {
  if (!orderObj?.content) {
    return null;
  }
  if (orderObj.content.length == 0) {
    return null;
  }
  for (let item of orderObj.content) {
    if (item.type === "page") {
      return item.cid;
    } else {
      let nextOrderResponse = findFirstPageOfActivity(item);
      if (nextOrderResponse) {
        return nextOrderResponse;
      }
    }
  }
  return null;
}
