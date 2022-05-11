import React, { useEffect, useState } from 'react';
import PageViewer from '../../../Viewer/PageViewer';
import {
  useRecoilValue,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import {
  fileByPageId,
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from '../ToolHandlers/CourseToolHandler';
import { findFirstPageOfActivity } from '../../../_reactComponents/Course/CourseActions';
import axios from 'axios';
import { editorPageIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom, viewerDoenetMLAtom, refreshNumberAtom, editorViewerErrorStateAtom } from '../ToolPanels/EditorViewer'


export default function EditorViewer() {
  // let refreshCount = useRef(1);
  // console.log(">>>>===EditorViewer")
  // refreshCount.current++;
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);

  // TODO: use page Id (for now only first page is shown)
  const paramPageId = useRecoilValue(searchParamAtomFamily('pageId'));

  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorPageIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const { page } = useRecoilValue(pageToolViewAtom);

  const [errMsg, setErrMsg] = useState(null);
  const [pageId, setPageId] = useState(null);


  useEffect(async () => {

    // determine cid
    let resp = await axios.get(
      `/api/getPublicActivityDefinition.php`,
      { params: { doenetId } },
    )

    if (!resp.data.success) {
      setErrMsg(resp.data.message);
      return;
    }
    let page = findFirstPageOfActivity(resp.data.json.order);

    if (!page) {
      setErrMsg('Could not find a page of activity');
      return;
    }

    setPageId(page);

  }, [doenetId, paramPageId])




  let initDoenetML = useRecoilCallback(({ snapshot, set }) => async (pageId) => {

    let response = await snapshot.getPromise(fileByPageId(pageId));
    // if (typeof response === "object"){
    //   response = response.data;
    // }
    const doenetML = response;

    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML)
    set(viewerDoenetMLAtom, doenetML)
    set(editorPageIdInitAtom, pageId);
  }, [])


  useEffect(() => {
    if (pageId) {
      initDoenetML(pageId)
    }
    return () => {
      setEditorInit("");
    }
  }, [pageId]);

  if (pageId !== initializedPageId) {
    //DoenetML is changing to another PageId
    return null;
  }


  let attemptNumber = 1;
  let solutionDisplayMode = "button";


  function variantCallback(generatedVariantInfo, allPossibleVariants, variantIndicesToIgnore = []) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo))
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
      variantIndicesToIgnore,
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index,
    });
  }



  // console.log(`>>>>Show PageViewer with value -${viewerDoenetML}- -${refreshNumber}-`)
  // console.log(`>>>> refreshNumber -${refreshNumber}-`)
  // console.log(`>>>> attemptNumber -${attemptNumber}-`)
  // console.log('>>>PageViewer Read Only:',!isCurrentDraft)
  // console.log('>>>>variantInfo.index',variantInfo.index)

  if (errMsg) {
    return <h1>{errMsg}</h1>;
  }

  return <PageViewer
    key={`pageViewer${refreshNumber}`}
    doenetML={viewerDoenetML}
    flags={{
      showCorrectness: true,
      readOnly: false,
      solutionDisplayMode: solutionDisplayMode,
      showFeedback: true,
      showHints: true,
      allowLoadState: false,
      allowSaveState: false,
      allowLocalState: false,
      allowSaveSubmissions: false,
      allowSaveEvents: false
    }}
    doenetId={doenetId}
    attemptNumber={attemptNumber}
    generatedVariantCallback={variantCallback} //TODO:Replace
    requestedVariantIndex={variantInfo.index}
    setIsInErrorState={setIsInErrorState}
    pageIsActive={true}
  />
}


