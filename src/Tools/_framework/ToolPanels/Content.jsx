import React from 'react';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
} from 'recoil';

import DoenetViewer from '../../../Viewer/DoenetViewer';
import { 
  itemHistoryAtom, 
 } from '../ToolHandlers/CourseToolHandler';

const contentIdAtom = atom({
  key:"contentIdAtom",
  default:null
})

export default function Content(props){
  // console.log(">>>===Content")
  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 
  const paramContentId = useRecoilValue(searchParamAtomFamily('contentId')) 
  const paramVariantIndex = useRecoilValue(searchParamAtomFamily('variantIndex')) 
  const paramVariantName = useRecoilValue(searchParamAtomFamily('variantName')) 
  const recoilContentId = useRecoilValue(contentIdAtom);

  const loadRecoilContentId = useRecoilCallback(({set,snapshot})=> async ({doenetId,assignment=false})=>{
    const versionHistory = await snapshot.getPromise((itemHistoryAtom(doenetId)));
    let contentId = null;
    if (assignment){
      for (let named of versionHistory.named){
        if (named.isAssigned === '1'){
          contentId = named.contentId;
          break;
        }
      }
    }else{
      for (let named of versionHistory.named){
        if (named.isReleased === '1'){
          contentId = named.contentId;
          break;
        }
      }
    }
    
    set(contentIdAtom,contentId)
  })

  // console.log(">>>paramDoenetId",paramDoenetId)
  // console.log(">>>recoilContentId",recoilContentId)
  // console.log(">>>paramContentId",paramContentId)
  // console.log(">>>paramVariantIndex",paramVariantIndex)
  // console.log(">>>paramVariantName",paramVariantName)

  let contentId = null;
  if (paramContentId){
    contentId = paramContentId;
  }

  let doenetId = null;
  if (paramDoenetId){
    doenetId = paramDoenetId;
  }

  if (paramDoenetId && !contentId && !recoilContentId){
    loadRecoilContentId({doenetId});
    return <div style={props.style}></div>
  }

  if (recoilContentId && !contentId){
    contentId = recoilContentId;
  }

// console.log(">>>contentId",contentId);

  let requestedVariant = {index: 1}
  if (paramVariantIndex){
    requestedVariant = {index:paramVariantIndex}
  }else if (paramVariantName){
    requestedVariant = {name:paramVariantName}
  }

  const solutionDisplayMode = "button";
  const attemptNumber = 1;
  
  return <div style={props.style}>
    <DoenetViewer
        key={'doenetviewer'}
        // doenetML={doenetML} ???parameter
        contentId={contentId}
        flags={{
          showCorrectness: true,
          readOnly: false,
          solutionDisplayMode: solutionDisplayMode,
          showFeedback: true,
          showHints: true,
          allowLoadPageState: true,
          allowSavePageState: true,
          allowLocalPageState: true,
          allowSaveSubmissions: true,
          allowSaveEvents: true
        }}
        attemptNumber={attemptNumber}
        doenetId={doenetId}
        requestedVariant={requestedVariant}
      />
  </div>
}