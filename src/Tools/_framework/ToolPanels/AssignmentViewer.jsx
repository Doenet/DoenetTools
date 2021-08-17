import React, { useEffect } from 'react';
import DoenetViewer from '../../../Viewer/DoenetViewer';
import { 
  useRecoilValue, 
  atom,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { 
  itemHistoryAtom, 
  fileByContentId, 
  variantInfoAtom, 
  variantPanelAtom,
 } from '../ToolHandlers/CourseToolHandler';
 import { currentDraftSelectedAtom } from '../Menus/VersionHistory'

const assignmentDoenetMLAtom = atom({
  key:"assignmentDoenetMLAtom",
  default:""
})


export default function AssignmentViewer(props){
  console.log(">>>===AssignmentViewer")
  // console.log("=== DoenetViewer Panel")
  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 
  const doenetML = useRecoilValue(assignmentDoenetMLAtom);

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    const versionHistory = await snapshot.getPromise((itemHistoryAtom(doenetId)));
    const contentId = versionHistory.draft.contentId;
    
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object"){
      response = response.data;
    }
    const doenetML = response;
    set(assignmentDoenetMLAtom,doenetML)
  },[])

  useEffect(() => {
    initDoenetML(paramDoenetId)
    return () => {
      // setEditorInit(false);
    }
}, [paramDoenetId]);

 
  if (doenetML === ""){
    //DoenetML is changing to another DoenetID
    return null;
  }


  let attemptNumber = 1;
  let solutionDisplayMode = "button";


  // if (variantInfo.lastUpdatedIndexOrName === 'Index'){
  //   setVariantInfo((was)=>{
  //     let newObj = {...was}; 
  //     newObj.lastUpdatedIndexOrName = null; 
  //     newObj.requestedVariant = {index:variantInfo.index};
  //   return newObj})

  // }else if (variantInfo.lastUpdatedIndexOrName === 'Name'){
  //   setVariantInfo((was)=>{
  //     let newObj = {...was}; 
  //     newObj.lastUpdatedIndexOrName = null; 
  //     newObj.requestedVariant = {name:variantInfo.name};
  //   return newObj})

  // }


  // function variantCallback(generatedVariantInfo, allPossibleVariants){
  //   // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
  //   const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo))
  //   cleanGeneratedVariant.lastUpdatedIndexOrName = null 
  //   setVariantPanel({
  //     index:cleanGeneratedVariant.index,
  //     name:cleanGeneratedVariant.name,
  //     allPossibleVariants
  //   });
  //   setVariantInfo((was)=>{
  //     let newObj = {...was}
  //     Object.assign(newObj,cleanGeneratedVariant)
  //     return newObj;
  //   });
  // }
  
  // console.log(`>>>Show DoenetViewer with value -${viewerDoenetML}-`)
  // console.log('>>>DoenetViewer Read Only:',!isCurrentDraft)
  return <div style={props.style}>
    <DoenetViewer
    key={"doenetviewer"}
    doenetML={doenetML}
    flags={{
      showCorrectness: true,
      readOnly: false,
      solutionDisplayMode: solutionDisplayMode,
      showFeedback: true,
      showHints: true,
    }}
    attemptNumber={attemptNumber}
    allowLoadPageState={false}
    allowSavePageState={false}
    allowLocalPageState={false}
    allowSaveSubmissions={false}
    allowSaveEvents={false}
    // generatedVariantCallback={variantCallback}
    // requestedVariant={variantInfo.requestedVariant}
    /> 

  </div>
}