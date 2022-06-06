import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';


export default function SurveyListViewer() {
  // console.log(">>>===SurveyListViewer")
  let driveId = useRecoilValue(searchParamAtomFamily('driveId'))
  let [surveyList,setSurveyList] = useState([])
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  useEffect(()=>{
    async function getSurveyList(driveId){
      let { data } = await axios.get('/api/getSurveyList.php',{params:{driveId}})
      setSurveyList(data.surveys)
    }
    if (driveId){
      getSurveyList(driveId)
    }
  },[driveId])
  
  if (!driveId){
     return null; 
    }


    if (surveyList.length === 0){
      return <div>No surveys available. Make sure you have released zero point activities.</div>
    }

  let surveyJSX = [];
  for (let survey of surveyList){
    surveyJSX.push(<tr style={{borderBottom:'1pt solid var(--canvastext)'}}>
      <td style={{textAlign:'left'}}>{survey.label}</td>
      <td><Button value='View' onClick={()=>{
        setPageToolView({
          page: 'course',
          tool: 'surveyData',
          view: null,
          params: { driveId,doenetId:survey.doenetId },
          })
      }}/></td>
      </tr>)
  }


  return <div style={{margin:'5px'}}>
  <table style={{borderCollapse: "collapse"}}>
    <thead>
      <tr style={{borderBottom:'2pt solid var(--canvastext)'}}>
        <th style={{width:'300px'}}>Survey Name</th>
        <th style={{width:'100px'}}>Download</th>
      </tr>
    </thead>
    <tbody>
    {surveyJSX}
    </tbody>
  </table>
  
  </div>
  
}
