import React, { useEffect, useRef } from 'react';
import DoenetViewer, { serializedComponentsReviver } from '../../../Viewer/DoenetViewer';
import { 
  useRecoilValue, 
  atom,
  atomFamily,
  useRecoilCallback,
  // useRecoilState,
  // useSetRecoilState,
} from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { 
  itemHistoryAtom, 
  fileByContentId, 
  // variantInfoAtom, 
  // variantPanelAtom,
 } from '../ToolHandlers/CourseToolHandler';
//  import { currentDraftSelectedAtom } from '../Menus/VersionHistory'
 import { returnAllPossibleVariants } from '../../../Core/utils/returnAllPossibleVariants';
 import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import axios from 'axios';



const assignmentDoenetMLContentIdAtom = atom({
  key:"assignmentDoenetMLContentIdAtom",
  default:{isAssigned:null,doenetML:null,contentId:null}
})


//key is doenetId
export const variantsAndAttemptsByDoenetId = atomFamily({
  key:'variantsAndAttemptsByDoenetId',
  default: {
    assignedContentId:null,
    usersVariantAttempts:[],
    variantsFromDoenetMLDictionary:{},  //Stored whenever there is a new contentId contentId:[]
    numberOfCompletedAttempts:0,
  },
})

export default function AssignmentViewer(props){
  console.log(">>>===AssignmentViewer")
  const paramDoenetId = useRecoilValue(searchParamAtomFamily('doenetId')) 
  const {isAssigned, doenetML, contentId} = useRecoilValue(assignmentDoenetMLContentIdAtom);

  const variantAttemptInfo = useRecoilValue(variantsAndAttemptsByDoenetId(paramDoenetId))
  let variantOfCurrentAttempt = variantAttemptInfo.usersVariantAttempts?.[variantAttemptInfo.numberOfCompletedAttempts];
  let attemptNumber = variantAttemptInfo.numberOfCompletedAttempts + 1;
  let stage = useRef('Start');
  let doenetIdOfdoenetML = useRef('');
  const assignmentSettings = useRecoilValue(loadAssignmentSelector(paramDoenetId));
    // console.log(">>>>assignmentSettings",assignmentSettings)
  // console.log(">>>>AssignmentViewer variantAttemptInfo",variantAttemptInfo)
  // console.log(">>>>variantOfCurrentAttempt",variantOfCurrentAttempt)
  // console.log(">>>>attemptNumber",attemptNumber)

  const initDoenetML = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
    const versionHistory = await snapshot.getPromise((itemHistoryAtom(doenetId)));

    //Find Assigned ContentId 
    //Use isReleased as isAssigned for now 
    //TODO: refactor isReleased to isAssigned
    let contentId = null;
    let isAssigned = false;
    for (let version of versionHistory.named){
      if (version.isReleased === "1"){
        isAssigned = true;
        contentId = version.contentId;
        break;
      }
    }
    
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object"){
      response = response.data;
    }
    const doenetML = response;
    set(assignmentDoenetMLContentIdAtom,{isAssigned,doenetML,contentId})
    doenetIdOfdoenetML.current = doenetId;
  },[])

  // const updateAssignmentSettings = useRecoilCallback(({snapshot,set})=> async (doenetId)=>{
  //   console.log(">>>>updateAssignmentSettings",doenetId)
  //   const assignmentSettings = await snapshot.getPromise((loadAssignmentSelector(doenetId)));
  //   console.log(">>>>assignmentSettings",assignmentSettings)
  //   //Find numberOfCompletedAttempts
  //   //Find usersVariantAttempts
  // },[]);

  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  //Randomly pick next variant
  //If all were picked then start random picks over
  function pushRandomVariantOfRemaining({previous,from}){
    let usersVariantAttempts = [...previous]
    let possible = [];
    let numRemaining = previous.length % from.length;
    
    let latestSetOfWas = [];
    if (numRemaining > 0){latestSetOfWas = previous.slice(-numRemaining);} 
    for (let variant of from){
      if (!latestSetOfWas.includes(variant)){
        possible.push(variant)
      }
    }
    const nextVariant = possible[randomInt(0,possible.length - 1)]
    usersVariantAttempts.push(nextVariant)
    return usersVariantAttempts;
  }

  const setVariantsFromDoenetML = useRecoilCallback(({snapshot,set})=> async ({allPossibleVariants})=>{
    
    const was = await snapshot.getPromise((variantsAndAttemptsByDoenetId(paramDoenetId)));
    let newObj = {...was}
    newObj.assignedContentId = contentId;
    newObj.variantsFromDoenetMLDictionary = {...was.variantsFromDoenetMLDictionary}
    newObj.variantsFromDoenetMLDictionary[contentId] = [...allPossibleVariants];
    //If no attempts stored load variants of user's past attempts

    if (newObj.usersVariantAttempts.length === 0){

      const { data } = await axios.get('/api/loadTakenVariants.php', {
        params: { doenetId:paramDoenetId },
      })
      for (let variant of data.variants){
        let obj = JSON.parse(variant, serializedComponentsReviver)
        newObj.usersVariantAttempts.push(obj.name)
      }
      newObj.numberOfCompletedAttempts = newObj.usersVariantAttempts.length - 1;
      if (newObj.numberOfCompletedAttempts === -1){
        newObj.numberOfCompletedAttempts = 0;
      }
    }
    let previous = newObj.usersVariantAttempts;
    if (newObj.numberOfCompletedAttempts > previous.length - 1){
      newObj.usersVariantAttempts = pushRandomVariantOfRemaining({previous,from:newObj.variantsFromDoenetMLDictionary[contentId]});
    }
    set(variantsAndAttemptsByDoenetId(paramDoenetId),newObj)
    
  },[paramDoenetId,contentId]);

  //Define usersVariantAttempts, assignedContentId and variantsFromDoenetMLDictionary for contentId
  const updateVariantInfo = useRecoilCallback(({snapshot})=> async (doenetId,contentId,doenetML)=>{
    const variantAttemptInfo = await snapshot.getPromise((variantsAndAttemptsByDoenetId(doenetId)));
    if (!variantAttemptInfo.variantsFromDoenetMLDictionary[contentId]){
      returnAllPossibleVariants({doenetML,callback:setVariantsFromDoenetML})
    }else{
      const allPossibleVariants = variantAttemptInfo.variantsFromDoenetMLDictionary[variantAttemptInfo.assignedContentId]
      setVariantsFromDoenetML({allPossibleVariants})
    }
  },[setVariantsFromDoenetML]);

  // console.log(`>>>>stage -${stage.current}-`)
  // console.log(`>>>>paramDoenetId |${paramDoenetId}|`)

  if (stage.current === 'Start'){
    stage.current = 'Wait for paramDoenetId'
    return null;
  }else if (stage.current === 'Wait for paramDoenetId'){
    if (paramDoenetId !== ''){
      stage.current = 'Wait for DoenetML'
    initDoenetML(paramDoenetId)
    }
    return null;
  }else if (stage.current === 'Wait for DoenetML'){
      if (isAssigned){
        stage.current = 'Wait for Variant'
    updateVariantInfo(paramDoenetId,contentId,doenetML)
      }
    return null;
  }else if (stage.current === 'Wait for Variant'){

    if (variantOfCurrentAttempt){
      stage.current = 'Wait for New Attempt'
  }else{
        return null;
    }
  }else if (stage.current === 'Wait for New Attempt'){
    if (!variantOfCurrentAttempt){
      stage.current = 'Wait for Variant'
      updateVariantInfo(paramDoenetId,contentId,doenetML)
      return null;
    }
  }

  if (!isAssigned){
    return <h1>Content is Not Assigned.</h1>
  }


  //Wait for paramDoenetId update
  if (doenetIdOfdoenetML.current !== paramDoenetId){
    // console.log(`>>>>pd |${paramDoenetId}|`)
    // console.log(`>>>>dd |${doenetIdOfdoenetML.current}|`)
    return null;
  }

  let solutionDisplayMode = "button";
  if (!assignmentSettings.showSolution){
    solutionDisplayMode = "none";
  }

  const requestedVariant = {name: variantOfCurrentAttempt}
  return <div style={props.style}>
    <DoenetViewer
    key={"doenetviewer"}
    doenetML={doenetML}
    doenetId={paramDoenetId}
    flags={{
      showCorrectness: assignmentSettings.showCorrectness,
      readOnly: false,
      solutionDisplayMode: solutionDisplayMode,
      showFeedback: assignmentSettings.showFeedback,
      showHints: assignmentSettings.showHints,
      isAssignment: true,
    }}
    attemptNumber={attemptNumber}
    allowLoadPageState={true} 
    allowSavePageState={true}
    allowLocalPageState={false} //Still working out localStorage kinks
    allowSaveSubmissions={true}
    allowSaveEvents={true}
    requestedVariant={requestedVariant}
    // generatedVariantCallback={variantCallback}
    /> 

  </div>
}