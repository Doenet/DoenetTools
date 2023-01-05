import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProgressBar from '../../_reactComponents/PanelHeaderComponents/ProgressBar.jsx';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.width ? props.width : '330px'};
`;

const BarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
`;

const DateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RemainingTimeContainer = styled.div`
  text-align: right;
`;

const CompletedBar = styled.div`
  height: 30px;
  width: 100%;
  border: 4px solid var(--mainBlue);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--mainGray);
`;

const Text =  styled.span`
  font-size: 14px;
`;


export default function DueDateBar({width, startDate, endDate, isCompleted}) {
  const TODAY = new Date();
  const STARTDATE = startDate;
  const ENDDATE = endDate;
  const [timeLeft, setTimeLeft] = useState({unit: "days", value: 0});
  const [progress, setProgress] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (TODAY >= ENDDATE) {
      setIsOverdue(true);
    } else if (STARTDATE < TODAY) {
      let difference = dateDiff(STARTDATE, TODAY);
      let total = dateDiff(STARTDATE, ENDDATE);
      if (total.inDays.value - difference.inDays.value > 0) {
        setTimeLeft({
          unit: total.inDays.unit,
          value: total.inDays.value - difference.inDays.value
        })
        setProgress(difference.inDays.value * 1.0 / total.inDays.value)
      } else if (total.inHours.value - difference.inHours.value > 0) {
        setTimeLeft({
          unit: total.inHours.unit,
          value: total.inHours.value - difference.inHours.value
        })
        setProgress(difference.inHours.value * 1.0 / total.inHours.value)
      } else {
        setTimeLeft({
          unit: total.inMinutes.unit,
          value: total.inMinutes.value - difference.inMinutes.value
        })
        setProgress(difference.inMinutes.value * 1.0 / total.inMinutes.value)
      }
    }
  }, [])

  const dateDiff = (a, b) => {
    const _MS_PER_MINUTE = 1000 * 60;
    const _MS_PER_HOUR = 1000 * 60 * 60;
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes());
  
    return {
      inDays: {
        unit: "days",
        value: Math.floor((utc2 - utc1) / _MS_PER_DAY)
      },
      inHours: {
        unit: "hours",
        value: Math.floor((utc2 - utc1) / _MS_PER_HOUR)
      },
      inMinutes: {
        unit: "minutes",
        value: Math.floor((utc2 - utc1) / _MS_PER_MINUTE)
      }
    };
  }
  
  const formatDate = date => {
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`
  }
  
  return (
    <Container width={width}>
      {
        <RemainingTimeContainer>
          <Text>
            {
              !isCompleted ?
                isOverdue ? 
                  `Assignment Overdue`  
                :
                  `${timeLeft.value} ${timeLeft.unit} remaining` 
                :
                null
            }
          </Text>
        </RemainingTimeContainer>
      }
      
      <BarWrapper>
        {
          isCompleted ? 
          <CompletedBar>
            <Text>Completed!</Text>
          </CompletedBar>
          :
          <ProgressBar 
            progress={isOverdue ? 1 : 1 - progress} 
            rotated 
            width="100%" 
            height="30px"  
            radius="15px"
            color={isOverdue ? "#121212" : "var(--mainBlue)"} 
          />
        }
      </BarWrapper>
      <DateContainer>
        <Text>{formatDate(STARTDATE)}</Text>
        <Text>{formatDate(ENDDATE)}</Text>
      </DateContainer>
    </Container>
  );
};
  