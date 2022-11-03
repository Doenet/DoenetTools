import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import {  useRecoilValue } from 'recoil';
import CalendarButton from '../../../_reactComponents/PanelHeaderComponents/CalendarToggle';
import DateTime from '../../../_reactComponents/PanelHeaderComponents/DateTime';
import { searchParamAtomFamily } from '../NewToolRoot';
import { useToast, toastType }  from '../Toast';
import { UTCDateStringToDate, DateToDisplayDateString, DateToDateString, DateToUTCDateString } from '../../../_utils/dateUtilityFunction';
import Increment from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';

export default function GradeSettings(){
  let courseId = useRecoilValue(searchParamAtomFamily('courseId'))
  let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
    let userId = useRecoilValue(searchParamAtomFamily('userId'))
    const [attemptsAllowedAdjustment,setAttemptsAllowedAdjustment] = useState(null);
    const [baseAttemptsAllowed,setBaseAttemptsAllowed] = useState(null);
    
    let [dueDateOverride,setDueDateOverride] = useState(null)
    let [dueDate,setDueDate] = useState(null);
    let [initialized,setInitialized] = useState(false);
    const addToast = useToast();

   

    useEffect(()=>{
      async function loadAdjustmentInfo(doenetId,userId,courseId){
        let resp = await axios.get('/api/loadGradebookAdjustmentSettingsInfo.php', {
          params: { doenetId, userId, courseId }});
          // if (!resp.data.success) {
          //   setStage('Problem');
          //   if (resp.data.message) {
          //     setMessage(`Could not load assignment: ${resp.data.message}`);
          //   } else {
          //     setMessage(`Could not load assignment: ${resp.data}`);
          //   }
          //   return;
          // }
    
          console.log("resp",resp.data)
          let numberOfAttemptsAllowedAdjustment = Number(resp.data.numberOfAttemptsAllowedAdjustment)
          setAttemptsAllowedAdjustment(numberOfAttemptsAllowedAdjustment);
          let numberOfBaseAttemptsAllowed = Number(resp.data.baseAttemptsAllowed)
          setBaseAttemptsAllowed(numberOfBaseAttemptsAllowed)
      }

      if (attemptsAllowedAdjustment == null){
        loadAdjustmentInfo(doenetId,userId,courseId);
      }

    },[attemptsAllowedAdjustment,doenetId,userId,courseId])

      //get dueDate and dueDateOverride on init
    const loadDueDates = async (doenetId,userId)=>{
      try {
        let { data } = await axios.get(`/api/loadDueDateInfo.php`,{params:{courseId,doenetId,userId}})
        setInitialized(true);

        if (data.success){
          //Set due date override text to local time and format it
          const dataDueDateOverride = data.dueDateInfo.dueDateOverride;
          let localTimeZoneDueDateOverride = null;
          if (dataDueDateOverride){
            localTimeZoneDueDateOverride = DateToDisplayDateString(UTCDateStringToDate(dataDueDateOverride))
          }
          setDueDateOverride(localTimeZoneDueDateOverride);

          //Set due date text to local time and format it
          const dataDueDate = data.dueDateInfo.dueDate;
          let localTimeZoneDueDate = 'No Due Date'
          if (dataDueDate){
            localTimeZoneDueDate = DateToDisplayDateString(UTCDateStringToDate(dataDueDate))
          }
          setDueDate(localTimeZoneDueDate);
        }else{
          addToast(`ERROR: ${data.message}`, toastType.ERROR);

        }
      } catch (e){
        addToast(`ERROR: ${e}`, toastType.ERROR);

      }
      
    }

    const storeDueDateOverride = async (doenetId,userId,newDateString)=>{
      if (newDateString === null){
        newDateString = 'Cancel Due Date Override'
      }else{
        //Convert to UTC
        newDateString = DateToUTCDateString(new Date(newDateString))
      }

      try {
        let { data } = await axios.get(`/api/saveDueDateInfo.php`,{params:{doenetId,userId,newDateString}})
        if (data.success){
          if (newDateString === 'Cancel Due Date Override'){
            addToast(`Cancelled Due Date Override!`, toastType.SUCCESS);
          }else{
            const displayDate = DateToDisplayDateString(new Date(newDateString));
            addToast(`Set Due Date Override to ${displayDate}`, toastType.SUCCESS);
          }
        }else{
          addToast(`ERROR: ${data.message}`, toastType.ERROR);
        }
      } catch (e){
        addToast(`ERROR: ${e}`, toastType.ERROR);
      }
    }

    if (!doenetId || !userId){
      return null;
    }

    if (!initialized){
      loadDueDates(doenetId,userId);
    }

    let dueDateJSX =  <>Due Date Override:
    <div
            style={{ display: 'flex' }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
    <CalendarButton
              checked={dueDateOverride !== null}
              onClick={() => {
                let value = null;

                if (dueDateOverride === null) {
                  let nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  value = DateToDateString(nextWeek);
                }
                setDueDateOverride(value);
                storeDueDateOverride(doenetId,userId,value);
                
              }}
            />
    <DateTime
    value={dueDateOverride ? new Date(dueDateOverride) : null}
    onBlur={({ valid, value }) => {
      if (valid) {
        try {
          value = value.toDate();
        } catch (e) {
          // console.log('value not moment');
        }
        if (
          new Date(DateToDateString(value)).getTime() !==
          new Date(dueDateOverride).getTime()
        ) {
          setDueDateOverride(value);
          storeDueDateOverride(doenetId,userId,value);
        }
      } else {
        addToast('Invalid Due Date');
      }
    }}
  />
  </div>
  </>

let resultAttemptsAllowed = baseAttemptsAllowed + attemptsAllowedAdjustment;

  return <div>
    <div>Due Date: </div>
    <div>{dueDate} </div>
    {dueDateJSX}
    <br />
    <div>Base Attempts Allowed: </div>
    <div>{baseAttemptsAllowed}</div> 
    <div>Attempts Allowed Adjustment: </div>
    <Increment min={-baseAttemptsAllowed} value={attemptsAllowedAdjustment} onChange={(attemptsAdjustment)=>{
      setAttemptsAllowedAdjustment(attemptsAdjustment);
      //TODO: update the database
      axios.get('/api/updateGradebookAdjustment.php', {
        params: { doenetId, userId, courseId, attemptsAdjustment }}).then(({data})=>{
          console.log("data",data)
        });
      
      }} />
    <div>Resulting Attempts Allowed: </div>
    <div>{resultAttemptsAllowed}</div>
  </div>
}