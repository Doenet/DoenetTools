import React, { useEffect, useRef } from 'react';
import PageViewer from '../../../Viewer/PageViewer';
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  fileByDoenetId,
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from '../ToolHandlers/CourseToolHandler';
import { authorItemByDoenetId, useInitCourseItems } from '../../../_reactComponents/Course/CourseActions';

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

//Boolean initialized editor tool start up
export const editorDoenetIdInitAtom = atom({
  key: "editorDoenetIdInitAtom",
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

export default function EditorViewer() {
  // let refreshCount = useRef(1);
  // console.log(">>>>===EditorViewer",refreshCount.current)
  // refreshCount.current++;
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'))
  const initializedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorDoenetIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const pageObj = useRecoilValue(authorItemByDoenetId(paramDoenetId))

  useInitCourseItems(courseId);

  let pageInitiated = false;
  if (Object.keys(pageObj).length > 0) {
    pageInitiated = true;
  }


  let initDoenetML = useRecoilCallback(({ snapshot, set }) => async (doenetId) => {
    let response = await snapshot.getPromise(fileByDoenetId(doenetId));
    // if (typeof response === "object"){
    //   response = response.data;
    // }
    const doenetML = response;

    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML)
    set(viewerDoenetMLAtom, doenetML)
    set(editorDoenetIdInitAtom, doenetId);
  }, [])


  useEffect(() => {
    if (paramDoenetId !== '' && pageInitiated) {
      initDoenetML(paramDoenetId)
    }
    return () => {
      setEditorInit("");
    }
  }, [paramDoenetId, pageInitiated]);

  if (paramDoenetId !== initializedDoenetId) {
    //DoenetML is changing to another DoenetID
    return null;
  }


  let attemptNumber = 1;
  let solutionDisplayMode = "button";


  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo))
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants
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
    doenetId={initializedDoenetId}
    attemptNumber={attemptNumber}
    generatedVariantCallback={variantCallback} //TODO:Replace
    requestedVariantIndex={variantInfo.index}
    setIsInErrorState={setIsInErrorState}
    pageIsActive={true}
  />
}


