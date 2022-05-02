import React from 'react';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
} from 'recoil';

import DoenetViewer from '../../../Tools/_framework/ToolPanels/AssignmentViewer';
import { 
  itemHistoryAtom, 
 } from '../ToolHandlers/CourseToolHandler';
import PageViewer from '../../../Viewer/PageViewer';

const contentIdAtom = atom({
  key:"contentIdAtom",
  default:null
})

export default function Content(props){
  // console.log(">>>===Content")
  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 
  const paramContentId = useRecoilValue(searchParamAtomFamily('cid')) 
  const paramVariantIndex = useRecoilValue(searchParamAtomFamily('variantIndex')) 
  const paramVariantName = useRecoilValue(searchParamAtomFamily('variantName')) 
  const recoilContentId = useRecoilValue(contentIdAtom);

  const loadRecoilContentId = useRecoilCallback(({set,snapshot})=> async ({doenetId,assignment=false})=>{
    const versionHistory = await snapshot.getPromise((itemHistoryAtom(doenetId)));
    let cid = null;
    if (assignment){
      for (let named of versionHistory.named){
        if (named.isAssigned === '1'){
          cid = named.cid;
          break;
        }
      }
    }else{
      for (let named of versionHistory.named){
        if (named.isReleased === '1'){
          cid = named.cid;
          break;
        }
      }
    }
    
    set(contentIdAtom,cid)
  })

  // console.log(">>>paramDoenetId",paramDoenetId)
  // console.log(">>>recoilContentId",recoilContentId)
  // console.log(">>>paramContentId",paramContentId)
  // console.log(">>>paramVariantIndex",paramVariantIndex)
  // console.log(">>>paramVariantName",paramVariantName)

  let cid = null;
  if (paramContentId){
    cid = paramContentId;
  }

  let doenetId = null;
  if (paramDoenetId){
    doenetId = paramDoenetId;
  }

  if (paramDoenetId && !cid && !recoilContentId){
    loadRecoilContentId({doenetId});
    return <div style={props.style}></div>
  }

  if (recoilContentId && !cid){
    cid = recoilContentId;
  }

// console.log(">>>cid",cid);

  let requestedVariant = {index: 1}
  if (paramVariantIndex){
    requestedVariant = {index:paramVariantIndex}
  }else if (paramVariantName){
    requestedVariant = {name:paramVariantName}
  }

  const solutionDisplayMode = "button";
  const attemptNumber = 1;
  
  return <div style={props.style}>
    <PageViewer
        key={'doenetviewer'}
        // doenetML={doenetML} ???parameter
        cid={cid}
        flags={{
          showCorrectness: true,
          readOnly: false,
          solutionDisplayMode: solutionDisplayMode,
          showFeedback: true,
          showHints: true,
          allowLoadState: true,
          allowSaveState: true,
          allowLocalState: true,
          allowSaveSubmissions: true,
          allowSaveEvents: true
        }}
        attemptNumber={attemptNumber}
        doenetId={doenetId}
        requestedVariant={requestedVariant}
      />
  </div>
}