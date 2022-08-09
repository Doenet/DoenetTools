import React, { useEffect, useRef } from 'react';
import PageViewer from '../../../Viewer/PageViewer';
import useEventListener from '../../../_utils/hooks/useEventListener'
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { searchParamAtomFamily, suppressMenusAtom } from '../NewToolRoot';
import {
  fileByPageId,
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from '../ToolHandlers/CourseToolHandler';
import { itemByDoenetId, courseIdAtom, useInitCourseItems, useSetCourseIdFromDoenetId } from '../../../_reactComponents/Course/CourseActions';

export const viewerDoenetMLAtom = atom({
  key: "viewerDoenetMLAtom",
  default: ""
})

export const textEditorDoenetMLAtom = atom({
  key: "textEditorDoenetMLAtom",
  default: ""
})

export const updateTextEditorDoenetMLAtom = atom({
  key: "updateTextEditorDoenetMLAtom",
  default: ""
})

// TODO: change to pageId
//Boolean initialized editor tool start up
export const editorPageIdInitAtom = atom({
  key: "editorPageIdInitAtom",
  default: ""
})

export const refreshNumberAtom = atom({
  key: "refreshNumberAtom",
  default: 0
})

export const editorViewerErrorStateAtom = atom({
  key: "editorViewerErrorStateAtom",
  default: false
})

export const useUpdateViewer = () => {
  const updateViewer = useRecoilCallback(({snapshot,set})=> async ()=>{
    const textEditorDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom)
    const isErrorState = await snapshot.getPromise(editorViewerErrorStateAtom)
  
    set(viewerDoenetMLAtom,textEditorDoenetML)
  
    if (isErrorState){
      set(refreshNumberAtom,(was)=>was+1);
    }
  
  })
  return updateViewer;
};



export default function EditorViewer() {
  // let refreshCount = useRef(1);
  // console.log(">>>>===EditorViewer",refreshCount.current)
  // refreshCount.current++;
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramPageId = useRecoilValue(searchParamAtomFamily('pageId'))
  const courseId = useRecoilValue(courseIdAtom)
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorPageIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const pageObj = useRecoilValue(itemByDoenetId(paramPageId))
  const activityObj = useRecoilValue(itemByDoenetId(doenetId))
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const updateViewer = useUpdateViewer();


  useSetCourseIdFromDoenetId(doenetId);
  useInitCourseItems(courseId);

  let pageInitiated = false;
  let label = null;
  if (Object.keys(pageObj).length > 0) {
    pageInitiated = true;
    if(activityObj.isSinglePage) {
      label = activityObj.label;
    } else {
      label = pageObj.label;
    }
  }

  useEffect(() => {
    const prevTitle = document.title;
    if(label) {
      document.title = `${label} - Doenet`;
    }
    return () => {
      document.title = prevTitle;
    }
  }, [label])


  let initDoenetML = useRecoilCallback(({ snapshot, set }) => async (pageId) => {
    let response = await snapshot.getPromise(fileByPageId(pageId));
    let pageObj = await snapshot.getPromise(itemByDoenetId(pageId))
    let containingObj = await snapshot.getPromise(itemByDoenetId(pageObj.containingDoenetId))
    // if (typeof response === "object"){
    //   response = response.data;
    // }
    const doenetML = response;

    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML)
    set(viewerDoenetMLAtom, doenetML)
    set(editorPageIdInitAtom, pageId);
    let suppress = [];
    if (containingObj.type == 'bank'){
      suppress.push('AssignmentSettingsMenu');
    }

    setSuppressMenus(suppress);
  }, [setSuppressMenus])


  useEffect(() => {
    if (paramPageId !== '' && pageInitiated) {
      initDoenetML(paramPageId)
    }
    return () => {
      setEditorInit("");
    }
  }, [paramPageId, pageInitiated]);

  useEventListener("keydown", e => {
    if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      updateViewer();
    }
  });

  if(courseId === "__not_found__") {
    return <h1>Content not found or no permission to view content</h1>;
  } else if (paramPageId !== initializedPageId) {
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


