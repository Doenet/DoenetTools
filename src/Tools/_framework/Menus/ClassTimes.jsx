import React, { useState } from 'react';
import { 
  useRecoilState,
  useRecoilCallback,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { classTimesAtom } from '../Widgets/Next7Days';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
// import DateTime from '../../../_reactComponents/PanelHeaderComponents/DateTime';

const TimeEntry = ({initValue,valueCallback=()=>{}})=>{
  let [time,setTime] = useState(initValue);
  let [previousTime,setPreviousTime] = useState(initValue); //Prevent valueCallback calls if value didn't change

  return <input type='text' value={time} style={{width:"34px"}} 
  onChange={(e)=>{
    setTime(e.target.value)
  }}
  onBlur={()=>{
    if (previousTime !== time){
      valueCallback(time);
      setPreviousTime(time);
    }
  }}
  onKeyDown={(e)=>{
    if (e.key === 'Enter'){
    if (previousTime !== time){
      valueCallback(time);
      setPreviousTime(time);
    }
    }
  }}
  
  />
}


export default function ClassTimes(){
  const [timesObj,setTimesObj] = useRecoilState(classTimesAtom);
  
  const addClassTime = useRecoilCallback(({set})=> async ()=>{
   set(classTimesAtom,(was)=>{
     let newArr = [...was];
     const newClassTime = {
      dotwIndex:1,
       startTime:"09:00",
       endTime:"10:00"
     }
     newArr.push(newClassTime);
     return newArr;
    })
  })

  const updateClassTime = useRecoilCallback(({set})=> async ({index,newClassTime})=>{
    set(classTimesAtom,(was)=>{
      let newArr = [...was];
      newArr[index] = {...newClassTime};
      return newArr;
     })
   })

   const deleteClassTime = useRecoilCallback(({set})=> async ({index})=>{
    set(classTimesAtom,(was)=>{
      let newArr = [...was];
      newArr.splice(index,1);
      return newArr;
     })
   })


  // const dotw = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const dotwItems = [
    [1,'Monday'],
    [2,'Tuesday'],
    [3,'Wednesday'],
    [4,'Thursday'],
    [5,'Friday'],
    [6,'Saturday'],
    [0,'Sunday']];

  let timesJSX = []
  for (let [index,timeObj] of Object.entries(timesObj)){
    timesJSX.push(<tr>
      <td><DropdownMenu width="90px" items={dotwItems} valueIndex={timeObj.dotwIndex} 
        onChange={
      ({value})=>{
        let newClassTime = {...timeObj}
        newClassTime.dotwIndex = value;
      updateClassTime({index,newClassTime})
    }}
    /></td>
      <td><TimeEntry initValue={timeObj.startTime} valueCallback={(value)=>{
         let newClassTime = {...timeObj}
         newClassTime.startTime = value;
       updateClassTime({index,newClassTime})
      }}/></td>
      <td><TimeEntry initValue={timeObj.endTime} valueCallback={(value)=>{
        let newClassTime = {...timeObj}
        newClassTime.endTime = value;
      updateClassTime({index,newClassTime})
      }}/></td>
      <td><Button value='x' alert onClick={()=>{deleteClassTime({index})}} /> </td>
      </tr>)

  }

  
  let classTimesTable = <div>No times set.</div>
  
  if (timesJSX.length > 0){
  classTimesTable = <table style={{width:"230px",margins:"5px"}}>
    <tr>
      <th style={{width:"100px"}}>Day</th>
      <th style={{width:"50px"}}>Start</th>
      <th style={{width:"50px"}}>End</th>
      <th style={{width:"30px"}}></th>
    </tr>
    {timesJSX}
  </table>
  }
  return <>
  {/* <DateTime datePicker={false} width="50px" /> */}
  {classTimesTable}
    <Button width='menu' value='Add' onClick={()=>addClassTime()}/>
  </>
}