import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import { currentAttemptNumber } from '../ToolPanels/AssignmentViewer';
import axios from 'axios';

export default function TimerMenu(){
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const userAttemptNumber = useRecoilValue(currentAttemptNumber);

  const { timeLimit } = useRecoilValue(loadAssignmentSelector(doenetId));
  let [timeDisplay,setTimeDisplay] = useState("Unlimited")
  const [endTime,setEndTime] = useState(null);
  const [refresh,setRefresh] = useState(new Date())

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
            // Split timestamp into [ Y, M, D, h, m, s ]
            let t = data.starts[i].split(/[- :]/);
            // Apply each element to the Date function
            startDT = new Date(
              Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5])
            );
          }
        }
      }

      let endDT = new Date(startDT.getTime() + timeLimit*60000*data.timeLimitMultiplier);
      setEndTime(endDT);

    }
      setEndTimeAsync();
  },[userAttemptNumber,timeLimit,doenetId,setEndTime])

  useEffect(()=>{
    //Clear timer to prevent multiple timers
    clearTimeout(timer.current);

    if (timeLimit > 0){
      let mins_floor = Math.floor((endTime - new Date()) / 60000);
      let mins_raw = (endTime - new Date()) / 60000;
 
        if (mins_raw <= 0){
          setTimeDisplay(`Time's Up`);
        }else{
          if(mins_raw < 1){
            setTimeDisplay(`< 1 Min`);
          }else if (mins_floor === 1){
            setTimeDisplay(`1 Min`);
          }else{
            setTimeDisplay(`${mins_floor} Mins`);
          }
          timer.current = setTimeout(()=>{
            if (mins_raw >= 0){
              setRefresh(new Date())
            }
          },10000)
        }
        
      }

    },[refresh,endTime])


  return <div style={{fontSize:"40px",textAlign:"center"}}>
    {timeDisplay}
  </div>
}