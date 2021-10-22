import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import axios from 'axios';
import { creditAchievedAtom, currentAttemptNumber } from '../ToolPanels/AssignmentViewer';
import styled from "styled-components";

const Line = styled.div`
  border-bottom: 2px solid black;
  height: 2px;
  width: 230px;
`

const ScoreOnRight = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
`

const ScoreContainer = styled.div`
  position: relative;
`


export default function CreditAchieved(){
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const recoilUserId = useRecoilValue(searchParamAtomFamily('userId'));
  const recoilTool = useRecoilValue(searchParamAtomFamily('tool'));
  let [stage,setStage] = useState('Initialize');

  const lastAttemptNumber = useRef(null)
  let [disabled,setDisabled] = useState(false);

  const {creditByItem,creditForAttempt,creditForAssignment,totalPointsOrPercent} = useRecoilValue(creditAchievedAtom);
 

  const initialize = useRecoilCallback(({set})=> async (attemptNumber,doenetId,userId,tool)=>{

  
   const { data }  = await axios.get(`api/loadAssessmentCreditAchieved.php`,{params:{attemptNumber,doenetId,userId,tool}});

  const { 
    creditByItem, 
    creditForAssignment, 
    creditForAttempt,
    showCorrectness,
    totalPointsOrPercent
 } = data;

    if (Number(showCorrectness) === 0 && tool.substring(0,9) !== 'gradebook'){
      setDisabled(true);
    }else{
      set(creditAchievedAtom,(was)=>{
        let newObj = {...was};
        newObj.creditByItem = creditByItem;
        newObj.creditForAssignment = creditForAssignment;
        newObj.creditForAttempt = creditForAttempt;
        newObj.totalPointsOrPercent = totalPointsOrPercent;
        return newObj;
      })
    }
    
    lastAttemptNumber.current = attemptNumber;
    setStage('Ready');

  },[])

  if (!creditByItem){ return null; }
  let creditByItemsJSX = creditByItem.map((x,i)=>{
    return <ScoreContainer key={`creditByItem${i}`}>Item {i+1}: <ScoreOnRight>{x?Math.round(x*1000)/1000:0}</ScoreOnRight></ScoreContainer> 
  })

  // console.log(`>>>>stage -${stage}-`);
  if (!recoilAttemptNumber || !recoilDoenetId || !recoilTool){
    return null;
  }
  // if (stage === 'Initialize'){
  //   initialize(recoilAttemptNumber,recoilDoenetId);
  //   return null;
  // }

  if (lastAttemptNumber.current !== recoilAttemptNumber){
    initialize(recoilAttemptNumber,recoilDoenetId,recoilUserId,recoilTool);
    return null;
  }
  if (disabled){
    return <div style={{fontSize:"20px",textAlign:"center"}}>Not Shown</div>
  }


  let score = 0;
  if (creditForAssignment){
    score = Math.round(creditForAssignment* totalPointsOrPercent*100)/100 ;
  }

 return <div>
   <ScoreContainer>Possible Points: <ScoreOnRight>{totalPointsOrPercent}</ScoreOnRight></ScoreContainer>
   <ScoreContainer>Final Score: <ScoreOnRight>{score}</ScoreOnRight></ScoreContainer>
   <Line/>
   <b>Credit For:</b>
   <ScoreContainer>Attempt {recoilAttemptNumber}: <ScoreOnRight>{creditForAttempt?Math.round(creditForAttempt*1000)/10:0}%</ScoreOnRight></ScoreContainer>
   <div style={{marginLeft: '15px'}}>{creditByItemsJSX}</div>
   <ScoreContainer>Assignment: <ScoreOnRight>{creditForAssignment?Math.round(creditForAssignment*1000)/10:0}%</ScoreOnRight></ScoreContainer>
 </div>
}