// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
// import { searchParamAtomFamily } from '../NewToolRoot';
// import styled from "styled-components";

import {
  pageToolViewAtom, searchParamAtomFamily,
} from '../NewToolRoot';

export default function WelcomeUMNPlacementExam() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  let extended = useRecoilValue(searchParamAtomFamily('extended'));
  // let [takenStatus, setTakenStatus] = useState('Page Init'); //'Page Init' | 'Not Taken' | 'Timer Going' | 'Completed'
  const [takenStatus, setTakenStatus] = useState('Not Taken'); //'Page Init' | 'Not Taken' | 'Timer Going' | 'Completed'
  const [examName, setExamName] = useState("Calculus Placement Exam");
  const [learnerFirstName, setLearnerFirstName] = useState(null);
  const [learnerLastName, setLearnerLastName] = useState(null);
  const [startWarningMessageOpen, setStartWarningMessageOpen] = useState(false);


  //Default to the placement exam
  if (!doenetId){
    doenetId = '_Xzibs2aYiKJbZsZ69bBZP' //Placement exam
  }

  if (takenStatus == 'Page Init'){
    
    return null;
  }
 
  const startExamLink =  () => {
    let params = {
      doenetId,
    }
    //Don't want to show to the student that extended is an option 
    if (extended){
      params['extended'] = extended;
    }
  
    setPageToolView({
      page: 'umn',
      tool: 'exam',
      view: '',
      params
    })};

  if (startWarningMessageOpen){
   return <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20',
          border: "var(--mainBorder)", 
          borderRadius: "var(--mainBorderRadius)", 
          padding: "5px", 
          display: "flex", 
          flexFlow: "column wrap"
        }}
      >
        {/* <h2 style={{ textAlign: 'center' }}>Warning!</h2> */}
        <h2 style={{ textAlign: 'center' }}>Are you sure you want to start the exam now?</h2>
        <p style={{ textAlign: 'center' }}>The timer begins when you click yes.</p>
        <div style={{ display: "flex", justifyContent: "center", padding: "5px" }}>
          <ButtonGroup>
            <Button onClick={startExamLink} data-test="ConfirmFinishAssessment" value="Yes" ></Button>
            <Button onClick={() => setStartWarningMessageOpen(false)} data-test="CancelFinishAssessment" value="No" alert></Button>
          </ButtonGroup>
        </div>
      </div>
  }

  return <>
  <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          // display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Welcome Kevin Charles!</h2>
        <h2 style={{ textAlign: 'center' }}>{examName}</h2>
  <div style={{ display: "flex", justifyContent: "center", padding: "5px" }}>

  <Button onClick={()=>setStartWarningMessageOpen(true)} value="Start Exam" />
  </div>
      </div>
  
  </>
}
  
