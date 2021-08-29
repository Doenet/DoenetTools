import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import { variantsAndAttemptsByDoenetId } from '../ToolPanels/AssignmentViewer';
import axios from 'axios';

export default function TimerMenu(){
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const userAttempts = useRecoilValue(variantsAndAttemptsByDoenetId(doenetId));
  const userAttemptNumber = userAttempts.numberOfCompletedAttempts + 1; //Zero indexed
  const { timeLimit } = useRecoilValue(loadAssignmentSelector(doenetId));
  let [timeDisplay,setTimeDisplay] = useState("Unlimited")
  const [endTime,setEndTime] = useState(null);
  const [refresh,setRefresh] = useState(new Date())
  // console.log(">>>>userAttemptNumber",userAttemptNumber)
  // console.log(">>>>endTime",endTime);
  // console.log(">>>>refresh",refresh);
  let timer = useRef(null);

  //Need fresh data on began time each time 
  //in case they opened another tab or hit refresh
  useEffect( ()=>{
    async function setEndTimeAsync() {
      let startDT = new Date();
      const { data } = await axios.get('/api/loadTakenVariants.php', {
        params: { doenetId },
      })
      for (let [i,attemptNumber] of Object.entries(data.attemptNumbers)){
        //Testing numbers are equal not objects so use ==
        if (attemptNumber == userAttemptNumber){
          if (data.starts[i] !== null){
            //This attempt was started in the past so update startDT
            //AND Convert UTC to local time
            startDT = new Date(`${data.starts[i]} UTC`);
          }
        }
      }

      let endDT = new Date(startDT.getTime() + timeLimit*60000);
      // console.log(">>>>startDT",startDT)
      // console.log(">>>>endDT",endDT)
      setEndTime(endDT);

    }
      setEndTimeAsync();
  },[userAttemptNumber,timeLimit,doenetId,setEndTime])

  useEffect(()=>{
    // console.log(">>>>SET TIMER DISPLAY")
    //Clear timer to prevent multiple timers
    clearTimeout(timer.current);

    if (timeLimit > 0){
      let mins = Math.floor((endTime - new Date()) / 60000);
        if (mins <= 0){
          setTimeDisplay(`Time's Up`);
        }else{
          if (mins === 1){
            setTimeDisplay(`1 Min`);
          }else{
            setTimeDisplay(`${mins} Mins`);
          }
          timer.current = setTimeout(()=>{
            if (new Date() < endTime){
              setRefresh(new Date())
            }
          },10000)
        }
        
      }

  //     if (endTime === null){
  //       let now = new Date();
  //       let newDateObj = new Date(now.getTime() + timeLimit*60000);
  //       setEndTime(newDateObj);
  //     }
    },[refresh,endTime])


  return <div style={{fontSize:"40px",textAlign:"center"}}>
    {timeDisplay}
  </div>
}