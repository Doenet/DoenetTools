import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';
import { creditAchievedAtom, currentAttemptNumber } from '../ToolPanels/AssignmentViewer';
import styled from "styled-components";
import { itemByDoenetId } from '../../../_reactComponents/Course/CourseActions';
import { activityAttemptNumberSetUpAtom, currentPageAtom, itemWeightsAtom } from '../../../Viewer/ActivityViewer';

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
  background: ${props => props.highlight ? "var(--mainGray)" : "var(--canvas)"};
`


export default function CreditAchieved() {
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const recoilUserId = useRecoilValue(searchParamAtomFamily('userId'));
  const recoilTool = useRecoilValue(searchParamAtomFamily('tool'));
  const itemObj = useRecoilValue(itemByDoenetId(recoilDoenetId));
  const itemWeights = useRecoilValue(itemWeightsAtom);
  const currentPage = useRecoilValue(currentPageAtom);
  const activityAttemptNumberSetUp = useRecoilValue(activityAttemptNumberSetUpAtom);


  const lastAttemptNumber = useRef(null)
  let [disabled, setDisabled] = useState(false);

  const { creditByItem, creditForAttempt, creditForAssignment, totalPointsOrPercent } = useRecoilValue(creditAchievedAtom);


  const initialize = useRecoilCallback(({ set }) => async (attemptNumber, doenetId, userId, tool) => {


    const { data } = await axios.get(`/api/loadAssessmentCreditAchieved.php`, { params: { attemptNumber, doenetId, userId, tool } });

    if (data.success) {
      const creditByItem = data.creditByItem.map(Number);
      const creditForAssignment = Number(data.creditForAssignment)
      const creditForAttempt = Number(data.creditForAttempt)
      const showCorrectness = data.showCorrectness === "1";
      const totalPointsOrPercent = Number(data.totalPointsOrPercent)

      if (!showCorrectness && tool.substring(0, 9) !== 'gradebook') {
        setDisabled(true);
      } else {
        set(creditAchievedAtom, (was) => {
          let newObj = { ...was };
          newObj.creditByItem = creditByItem;
          newObj.creditForAssignment = creditForAssignment;
          newObj.creditForAttempt = creditForAttempt;
          newObj.totalPointsOrPercent = totalPointsOrPercent;
          return newObj;
        })
      }

      lastAttemptNumber.current = attemptNumber;
    }
  }, [])

  if (!creditByItem) { return null; }

  if (!recoilAttemptNumber || !recoilDoenetId || !recoilTool) {
    return null;
  }

  // wait for the assignment attempt item tables to be set up
  // so that will have the rows for each item
  if (activityAttemptNumberSetUp !== recoilAttemptNumber) {
    lastAttemptNumber.current = activityAttemptNumberSetUp;
    return null;
  }

  if (lastAttemptNumber.current !== recoilAttemptNumber) {
    initialize(recoilAttemptNumber, recoilDoenetId, recoilUserId, recoilTool);
    return null;
  }
  if (disabled) {
    return <div style={{ fontSize: "20px", textAlign: "center" }}>Not Shown</div>
  }


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
    return <ScoreContainer key={`creditByItem${i}`} highlight={currentPage === i + 1}>Item {i + 1}: <ScoreOnRight data-test={`Item ${i + 1} Credit`}>{scoreDisplay}</ScoreOnRight></ScoreContainer>
  })

  return <div>
    <ScoreContainer>Possible Points: <ScoreOnRight data-test="Possible Points">{totalPointsOrPercent}</ScoreOnRight></ScoreContainer>
    <ScoreContainer>Final Score: <ScoreOnRight data-test="Final Score">{score}</ScoreOnRight></ScoreContainer>
    <Line />
    <b>Credit For:</b>
    <ScoreContainer data-test="Attempt Container">Attempt {recoilAttemptNumber}: <ScoreOnRight data-test="Attempt Percent">{creditForAttempt ? Math.round(creditForAttempt * 1000) / 10 : 0}%</ScoreOnRight></ScoreContainer>
    <div style={{ marginLeft: '15px' }}>{creditByItemsJSX}</div>
    <ScoreContainer>Assignment: <ScoreOnRight data-test="Assignment Percent">{creditForAssignment ? Math.round(creditForAssignment * 1000) / 10 : 0}%</ScoreOnRight></ScoreContainer>
  </div>
}