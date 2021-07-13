import React, { useEffect } from 'react';
import DoenetViewer from '../../../Viewer/DoenetViewer';
import { 
  useRecoilValue, 
  atom,
  useRecoilCallback,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { itemHistoryAtom, fileByContentId } from '../ToolHandlers/CourseToolHandler';

const viewerDoenetMLAtom = atom({
  key:"viewerDoenetMLAtom",
  default:"<p>test</p>"
})

export const textEditorDoenetMLAtom = atom({
  key:"textEditorDoenetMLAtom",
  default:""
})

//Boolean initialized editor tool start up
export const editorDoenetIdInitAtom = atom({
  key:"editorDoenetIdInitAtom",
  default:""
})

export default function EditorViewer(props){
  console.log(">>>===EditorViewer")
  // console.log("=== DoenetViewer Panel")
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    console.log(">>>initDoenetML doenetId",doenetId)
    const versionHistory = await snapshot.getPromise((itemHistoryAtom(doenetId)));
    const contentId = versionHistory.draft.contentId;
    
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object"){
      response = response.data;
    }
    const doenetML = response;

    set(textEditorDoenetMLAtom,doenetML);
    set(viewerDoenetMLAtom,doenetML)
    set(editorDoenetIdInitAtom,doenetId);
  },[])

  useEffect(() => {
    console.log(">>>doenetId updated!",doenetId)
    initDoenetML(doenetId)
    return () => {
      // setEditorInit(false);
    }
}, [doenetId]);


  // return <div style={props.style}>
  // </div>




  // const editorInit = useRecoilValue(editorDoenetIdInitAtom);
  // const [variantInfo,setVariantInfo] = useRecoilState(variantInfoAtom);
  // const setVariantPanel = useSetRecoilState(variantPanelAtom);
  // if (!editorInit){ return null; }

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


  function variantCallback(generatedVariantInfo, allPossibleVariants){
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
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
  }
  
 
  
  return <div style={props.style}>
<DoenetViewer
      key={"doenetviewer"}
      doenetML={viewerDoenetML}
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
      generatedVariantCallback={variantCallback}
      requestedVariant={{index:0}}
      // requestedVariant={variantInfo.requestedVariant}
      /> 

  </div>
}