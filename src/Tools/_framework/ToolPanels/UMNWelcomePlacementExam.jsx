// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
// import { searchParamAtomFamily } from '../NewToolRoot';
// import styled from "styled-components";

import {
  pageToolViewAtom, searchParamAtomFamily,
} from '../NewToolRoot';

export default function WelcomeUMNPlacementExam() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  let extended = useRecoilValue(searchParamAtomFamily('extended'));

  //Default to the placement exam
  if (!doenetId){
    doenetId = '_Xzibs2aYiKJbZsZ69bBZP' //Placement exam
  }
 

 //hard coded test descriptions will be in db in the future
 const doenetIdToExamInfo = {
  _Xzibs2aYiKJbZsZ69bBZP:{
    examName:'Placement Exam',
  },
  _tnDtMiI7Nc6tHtVm6To7c:{
    examName:'Math1151 Exam'
  }
 }
console.log("doenetId",doenetId)
const info = doenetIdToExamInfo[doenetId];
console.log("info",info)

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

  return <>
  <p>welcome!</p>
  <Button onClick={startExamLink} value={`Start ${info?.examName}`} />
  </>
}
  
