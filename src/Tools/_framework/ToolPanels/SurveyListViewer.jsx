import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';

export default function SurveyListViewer() {
  // console.log(">>>===SurveyListViewer")
  let driveId = useRecoilValue(searchParamAtomFamily('driveId'))
  let [surveyList,setSurveyList] = useState([])

  useEffect(()=>{
    async function getSurveyList(driveId){
      let { data } = await axios.get('/api/getSurveyList.php',{params:{driveId}})
      console.log(">>>>data",data)
    }
    if (driveId){
      getSurveyList(driveId)
    }
  },[driveId])

  if (!driveId){
     return null; 
    }

    console.log(">>>>surveyList",surveyList)

  return <div>{driveId}</div>
  
}
