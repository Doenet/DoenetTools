import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import { variantsAndAttemptsByDoenetId } from '../ToolPanels/AssignmentViewer';

export default function TimerMenu(){
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const userAttempts = useRecoilValue(variantsAndAttemptsByDoenetId(doenetId));
  const userAttemptNumber = userAttempts.numberOfCompletedAttempts + 1; //Zero indexed
  const { timeLimit } = useRecoilValue(loadAssignmentSelector(doenetId));
  let [timeDisplay,setTimeDisplay] = useState("Unlimited")
  const [endTime,setEndTime] = useState(null);
  const [refresh,setRefresh] = useState(new Date())
  // console.log(">>>>endTime",endTime);
  // console.log(">>>>refresh",refresh);


  useEffect(()=>{
    if (timeLimit > 0){
      let mins = Math.floor((endTime - new Date()) / 60000);
        if (mins <= 0){
          setTimeDisplay(`Times Up`);
        }else{
          if (mins === 1){
            setTimeDisplay(`1 Min`);
          }else{
            setTimeDisplay(`${mins} Mins`);
          }
          setTimeout(()=>{
            if (new Date() < endTime){
              setRefresh(new Date())
            }
          },5000)
        }
        
      }

      if (endTime === null){
        let now = new Date();
        let newDateObj = new Date(now.getTime() + timeLimit*60000);
        setEndTime(newDateObj);
      }
    },[userAttemptNumber,timeLimit,refresh,endTime])


  return <div style={{fontSize:"40px",textAlign:"center"}}>
    {timeDisplay}
  </div>
}