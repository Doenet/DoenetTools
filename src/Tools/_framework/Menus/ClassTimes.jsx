import React, { useState } from 'react';
import { 
  // useRecoilState,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { classTimesAtom } from '../Widgets/Next7Days';
import DropdownMenu from '../../../_reactComponents/PanelHeaderComponents/DropdownMenu';
import DateTime from '../../../_reactComponents/PanelHeaderComponents/DateTime';
import axios from 'axios';
import { searchParamAtomFamily } from '../NewToolRoot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

const TimeEntry = ({parentValue,valueCallback=()=>{}})=>{
  let [time,setTime] = useState(parentValue);
  let [previousTime,setPreviousTime] = useState(parentValue); //Prevent valueCallback calls if value didn't change

  //This causes extra calls, but updates time when prop changes
  if (parentValue != previousTime){
    setTime(parentValue);
    setPreviousTime(parentValue);
  }

  return <input type='text' value={time} style={{width:"40px"}} 
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

function sortClassTimes(classTimesArray){
  return classTimesArray.sort((first,second)=>{
    //Sunday at the end
    let mondayFirstDotw = first.dotwIndex;
    if (mondayFirstDotw === 0){ mondayFirstDotw = 7;} 
    let mondaySecondDotw = second.dotwIndex;
    if (mondaySecondDotw === 0){ mondaySecondDotw = 7;} 
    if (mondayFirstDotw > mondaySecondDotw){
      return 1
    }else if (mondayFirstDotw < mondaySecondDotw){
      return -1
    }else{
      //They are equal so go by start time
      let firstStartDate = new Date();
      const [firstHour,firstMinute] = first.startTime.split(':');
      firstStartDate.setHours(firstHour,firstMinute,0,0);
      let secondStartDate = new Date();
      const [secondHour,secondMinute] = second.startTime.split(':');
      secondStartDate.setHours(secondHour,secondMinute,0,0);
      if (firstStartDate > secondStartDate){
        return 1
      }else{
        return -1;
      }

    }
   
  });
}

export default function ClassTimes(){
  const timesObj = useRecoilValue(classTimesAtom);
  // var --menuPanelMargin = "0px";

  const addClassTime = useRecoilCallback(({set,snapshot})=> async ()=>{

    let was = await snapshot.getPromise(classTimesAtom);
    let newArr = [...was];
    const newClassTime = {
      dotwIndex:1,
      startTime:"09:00",
      endTime:"10:00"
    }
    newArr.push(newClassTime);
    newArr = sortClassTimes(newArr);
    set(classTimesAtom,newArr);

    let path = await snapshot.getPromise(searchParamAtomFamily('path'));
    let [driveId] = path.split(':');
    let dotwIndexes = [];
    let startTimes = [];
    let endTimes = [];
    for (let classTime of newArr){
      dotwIndexes.push(classTime.dotwIndex);
      startTimes.push(classTime.startTime);
      endTimes.push(classTime.endTime);

    }

    let { data } = await axios.post('/api/updateClassTimes.php',{driveId,dotwIndexes,startTimes,endTimes})
    console.log(">>>>data",data)
  })

  const updateClassTime = useRecoilCallback(({set,snapshot})=> async ({index,newClassTime})=>{
 
     let was = await snapshot.getPromise(classTimesAtom);
    let newArr = [...was];
      newArr[index] = {...newClassTime};
    newArr = sortClassTimes(newArr);
    set(classTimesAtom,newArr);

     let path = await snapshot.getPromise(searchParamAtomFamily('path'));
    let [driveId] = path.split(':');
    let dotwIndexes = [];
    let startTimes = [];
    let endTimes = [];
    for (let classTime of newArr){
      dotwIndexes.push(classTime.dotwIndex);
      startTimes.push(classTime.startTime);
      endTimes.push(classTime.endTime);

    }

    let { data } = await axios.post('/api/updateClassTimes.php',{driveId,dotwIndexes,startTimes,endTimes})
    console.log(">>>>data",data)
   })

   const deleteClassTime = useRecoilCallback(({set,snapshot})=> async ({index})=>{
  
     let was = await snapshot.getPromise(classTimesAtom);
    let newArr = [...was];
    newArr.splice(index,1);
    newArr = sortClassTimes(newArr);
    set(classTimesAtom,newArr);

     let path = await snapshot.getPromise(searchParamAtomFamily('path'));
    let [driveId] = path.split(':');
    let dotwIndexes = [];
    let startTimes = [];
    let endTimes = [];
    for (let classTime of newArr){
      dotwIndexes.push(classTime.dotwIndex);
      startTimes.push(classTime.startTime);
      endTimes.push(classTime.endTime);

    }

    let { data } = await axios.post('/api/updateClassTimes.php',{driveId,dotwIndexes,startTimes,endTimes})
    console.log(">>>>data",data)
   })


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
      <td style={{width:"190px"}}><DropdownMenu width="180px" items={dotwItems} valueIndex={timeObj.dotwIndex} 
        onChange={
      ({value})=>{
        let newClassTime = {...timeObj}
        newClassTime.dotwIndex = value;
      updateClassTime({index,newClassTime})
    }}
    /></td>
      <Button icon={<FontAwesomeIcon icon={faTimes}/>} alert onClick={()=>{deleteClassTime({index})}} />
      </tr>)
      timesJSX.push(<div><tr>
        <td style={{width:"190px", display: "flex", alignItems: "center", marginLeft: '2px'}}><DateTime datePicker={false} width="82px" menuPanelMargin={false} parentValue={timeObj.startTime} valueCallback={(value)=>{
           let newClassTime = {...timeObj}
           newClassTime.startTime = value;
         updateClassTime({index,newClassTime})
        }}/> - <DateTime datePicker={false} width="82px" menuPanelMargin={true} parentValue={timeObj.endTime} valueCallback={(value)=>{
          let newClassTime = {...timeObj}
          newClassTime.endTime = value;
        updateClassTime({index,newClassTime})
        }}/></td>
        </tr>
        <div style={{margin: "10px"}}></div>
        </div>)
  }

  
  let classTimesTable = <div>No times set.</div>
  
  if (timesJSX.length > 0){
  classTimesTable = <table style={{width:"230px",margins:"5px"}}>
    {timesJSX}
  </table>
  }
  return <>
  {/* <DateTime datePicker={false} width="50px" /> */}
  {classTimesTable}
    <Button width="10px" icon={<FontAwesomeIcon icon={faPlus}/>} style={{margin: "auto"}} onClick={()=>addClassTime()}/>
  </>
}