import React from 'react';
import { 
  useRecoilState,
  useRecoilCallback,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { classTimesAtom } from '../Widgets/Next7Days';

export default function ClassTimes(){
  const [timesObj,setTimesObj] = useRecoilState(classTimesAtom);
  const addClassTime = useRecoilCallback(({set})=> async ()=>{
   console.log(">>>>add") 
  })


  const dotw = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  let timesJSX = []
  for (let timeObj of timesObj){
    console.log(">>>>timeObj",timeObj)
  }
  return <>
    <Button width='menu' value='Add' onClick={()=>addClassTime()}/>
    {timesJSX}
  </>
}