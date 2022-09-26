import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import styled from "styled-components";


const Line = styled.div`
  border-bottom: 2px solid var(--canvastext);
  height: 2px;
  width: 230px;
`

const ScoreOnRight = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
`

const ScoreContainer = styled.div`
  position: relative;
  background: var(--canvas);
  cursor: auto;
`

export default function EndExamPanel() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const attemptNumber = useRecoilValue(searchParamAtomFamily('attemptNumber'));
  const itemWeights = useRecoilValue(searchParamAtomFamily('itemWeights')).split(",").map(Number);

  const [{ creditByItem, creditForAssignment, creditForAttempt, totalPointsOrPercent }, setCreditItems] = useState({
    creditByItem: [],
    creditForAssignment: null,
    creditForAttempt: null,
    totalPointsOrPercent: null
  });


  useEffect(() => {
    axios.get(`/api/loadAssessmentCreditAchieved.php`,
      { params: { attemptNumber, doenetId, tool: "endExam" } })
      .then(({ data }) => {
        if (data.success) {
          setCreditItems({
            creditByItem: data.creditByItem.map(Number),
            creditForAssignment: Number(data.creditForAssignment),
            creditForAttempt: Number(data.creditForAttempt),
            totalPointsOrPercent: Number(data.totalPointsOrPercent)
          })
        }

      });


  }, [doenetId, attemptNumber])

  let scoreResults = null;

  if (creditByItem.length > 0) {

    let score = 0;
    if (creditForAssignment) {
      score = Math.round(creditForAssignment * totalPointsOrPercent * 100) / 100;
    }

    let creditByItemsJSX = creditByItem.map((x, i) => {
      let scoreDisplay;
      if (itemWeights[i] === 0) {
        scoreDisplay = x === 0 ? "Not started" : (x === 1 ? "Complete" : "In progress");
      } else {
        scoreDisplay = (x ? Math.round(x * 1000) / 10 : 0) + "%";
      }
      return <ScoreContainer key={`creditByItem${i}`}>Item {i + 1}: <ScoreOnRight data-test={`Item ${i + 1} Credit`}>{scoreDisplay}</ScoreOnRight></ScoreContainer>
    })

    scoreResults = <div style={{ leftMargin: "100px", leftPadding: "100px" }}>
      <ScoreContainer>Possible Points: <ScoreOnRight data-test="Possible Points">{totalPointsOrPercent}</ScoreOnRight></ScoreContainer>
      <ScoreContainer>Final Score: <ScoreOnRight data-test="Final Score">{score}</ScoreOnRight></ScoreContainer>
      <Line />
      <b>Credit For:</b>
      <ScoreContainer data-test="Attempt Container">Attempt {attemptNumber}: <ScoreOnRight data-test="Attempt Percent">{creditForAttempt ? Math.round(creditForAttempt * 1000) / 10 : 0}%</ScoreOnRight></ScoreContainer>
      <div style={{ marginLeft: '15px' }}>{creditByItemsJSX}</div>
      <ScoreContainer>Assignment: <ScoreOnRight data-test="Assignment Percent">{creditForAssignment ? Math.round(creditForAssignment * 1000) / 10 : 0}%</ScoreOnRight></ScoreContainer>
    </div>
  }


  return <div
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
    <div style={{display: 'flex',alignItems: 'center'}}>
        <div>
        <img
            style={{ width: '250px', height: '250px' }}
            alt="Doenet Logo"
            src={'/media/Doenet_Logo_Frontpage.png'}
          />
        </div>
        
        <h1>Exam is finished</h1>
    </div>
    <div style={{  display: 'flex',
      justifyContent: 'center'
      }}>
      <div style={{width: '230px', maxHeight: '340px', overflowY: 'scroll'}}>
        {scoreResults}
      </div>
    </div>
   
       

    
    
  </div>
}
