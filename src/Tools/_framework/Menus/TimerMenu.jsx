import React, { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { searchParamAtomFamily } from "../NewToolRoot";
import { loadAssignmentSelector } from "../../../_reactComponents/Drive/NewDrive";
import { currentAttemptNumber } from "../ToolPanels/AssignmentViewer";
import axios from "axios";
import { UTCDateStringToDate } from "../../../_utils/dateUtilityFunction";

export default function TimerMenu() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const userAttemptNumber = useRecoilValue(currentAttemptNumber);

  const { timeLimit } = useRecoilValue(loadAssignmentSelector(doenetId));
  let [timeDisplay, setTimeDisplay] = useState("Unlimited");
  const [endTime, setEndTime] = useState(null);
  const [refresh, setRefresh] = useState(new Date());

  let timer = useRef(null);

  //Need fresh data on began time each time
  //in case they opened another tab or hit refresh
  useEffect(() => {
    let startDT = new Date();

    axios
      .get("/api/loadAttemptStartTime.php", {
        params: { doenetId, attemptNumber: userAttemptNumber },
      })
      .then(({ data }) => {
        if (data.attemptStart !== null) {
          //This attempt was started in the past so update startDT
          //AND Convert UTC to local time
          startDT = UTCDateStringToDate(data.attemptStart);
        }

        let endDT = new Date(
          startDT.getTime() + timeLimit * 60000 * data.timeLimitMultiplier,
        );
        setEndTime(endDT);
      })
      .catch(console.error);
  }, [userAttemptNumber, timeLimit, doenetId, setEndTime]);

  useEffect(() => {
    //Clear timer to prevent multiple timers
    clearTimeout(timer.current);

    if (timeLimit > 0) {
      let mins_floor = Math.floor((endTime - new Date()) / 60000);
      let mins_raw = (endTime - new Date()) / 60000;

      if (mins_raw <= 0) {
        setTimeDisplay(`Time's Up`);
      } else {
        if (mins_raw < 1) {
          setTimeDisplay(`< 1 Min`);
        } else if (mins_floor === 1) {
          setTimeDisplay(`1 Min`);
        } else {
          setTimeDisplay(`${mins_floor} Mins`);
        }
        timer.current = setTimeout(() => {
          if (mins_raw >= 0) {
            setRefresh(new Date());
          }
        }, 10000);
      }
    }
  }, [refresh, endTime]);

  return (
    <div style={{ fontSize: "40px", textAlign: "center" }}>{timeDisplay}</div>
  );
}
