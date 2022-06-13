import React, { useEffect, useState } from 'react';
import PageViewer from '../../../Viewer/PageViewer';
import {
  useRecoilValue,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from '../ToolHandlers/CourseToolHandler';
import { findFirstPageOfActivity } from '../../../_reactComponents/Course/CourseActions';
import axios from 'axios';
import { editorPageIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom, viewerDoenetMLAtom, refreshNumberAtom, editorViewerErrorStateAtom } from '../ToolPanels/EditorViewer'
import { retrieveTextFileForCid } from '../../../Core/utils/retrieveTextFile';
import { parseActivityDefinition } from '../../../_utils/activityUtils';


export default function EditorViewer() {
  // console.log(">>>>===EditorViewer")
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);

  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorPageIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const [pageCid, setPageCid] = useState(null);

  const [errMsg, setErrMsg] = useState(null);


  useEffect(async () => {

    // determine cid
    let resp = await axios.get(
      `/api/getCidForAssignment.php`,
      { params: { doenetId, latestAttemptOverrides: false, publicOnly: true, userCanViewSourceOnly: true } },
    );

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
    }
    catch (e) {
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

  }, [doenetId])


  let initDoenetML = useRecoilCallback(({ snapshot, set }) => async (pageCid) => {

    const doenetML = await retrieveTextFileForCid(pageCid, "doenet");

    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML)
    set(viewerDoenetMLAtom, doenetML)
  }, [])


  useEffect(() => {
    if (pageCid) {
      initDoenetML(pageCid)
    }
    return () => {
      setEditorInit("");
    }
  }, [pageCid]);

  if (errMsg) {
    return <h1>{errMsg}</h1>;
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

  if (!viewerDoenetML) {
    return null;
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


function findFirstPageCidFromCompiledActivity(orderObj) {
  if (!orderObj?.content) {
    return null;
  }
  //No pages or orders in order so return null
  if (orderObj.content.length == 0) {
    return null;
  }

  for (let item of orderObj.content) {
    if (item.type === "page") {
      return item.cid;
    } else {
      //First item of content is another order
      let nextOrderResponse = findFirstPageOfActivity(item.content);
      if (nextOrderResponse) {
        return nextOrderResponse;
      }
    }
  }

  return null; // didn't find any pages

}