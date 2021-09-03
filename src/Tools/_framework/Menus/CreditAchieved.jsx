import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import axios from 'axios';
import { creditAchievedAtom, currentAttemptNumber } from '../ToolPanels/AssignmentViewer';


export default function CreditAchieved(){
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const lastAttemptNumber = useRef(null)

  const {creditByItem,creditForAttempt,creditForAssignment} = useRecoilValue(creditAchievedAtom);
  let [stage,setStage] = useState('Initialize');
  let creditByItemsJSX = creditByItem.map((x,i)=>{
    return <div key={`creditByItem${i}`}>Credit For Item {i+1}: {x?x:0}</div> 
  })

  const initialize = useRecoilCallback(({set})=> async (attemptNumber,doenetId)=>{

   const { data }  = await axios.get(`api/loadAssessmentCreditAchieved.php`,{params:{attemptNumber,doenetId}});

    const { creditByItem, creditForAssignment, creditForAttempt } = data;
    set(creditAchievedAtom,(was)=>{
      let newObj = {...was};
      newObj.creditByItem = creditByItem;
      newObj.creditForAssignment = creditForAssignment;
      newObj.creditForAttempt = creditForAttempt;
      return newObj;
    })
    lastAttemptNumber.current = attemptNumber;
    setStage('Ready');

  },[])

  console.log(`>>>>stage -${stage}-`);

  if (!recoilAttemptNumber || !recoilDoenetId){
    return null;
  }

  // if (stage === 'Initialize'){
  //   initialize(recoilAttemptNumber,recoilDoenetId);
  //   return null;
  // }

  if (lastAttemptNumber.current !== recoilAttemptNumber){
    initialize(recoilAttemptNumber,recoilDoenetId);
    return null;
  }

 return <div>
   <div>Credit For Assignment: {creditForAssignment?creditForAssignment:0}</div>
   <div>Credit For Attempt {recoilAttemptNumber}: {creditForAttempt?creditForAttempt:0}</div>
   <div>{creditByItemsJSX}</div>
 </div>
}