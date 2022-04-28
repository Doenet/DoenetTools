import React, {useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {currentAttemptNumber} from "../ToolPanels/AssignmentViewer.js";
import axios from "../../_snowpack/pkg/axios.js";
import {UTCDateStringToDate} from "../../_utils/dateUtilityFunction.js";
export default function TimerMenu() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const userAttemptNumber = useRecoilValue(currentAttemptNumber);
  const {timeLimit} = useRecoilValue(loadAssignmentSelector(doenetId));
  let [timeDisplay, setTimeDisplay] = useState("Unlimited");
  const [endTime, setEndTime] = useState(null);
  const [refresh, setRefresh] = useState(new Date());
  let timer = useRef(null);
  useEffect(async () => {
    let startDT = new Date();
    const {data} = await axios.get("/api/loadAttemptStartTime.php", {
      params: {doenetId, attemptNumber: userAttemptNumber}
    });
    if (data.attemptStart !== null) {
      startDT = UTCDateStringToDate(data.attemptStart);
    }
    let endDT = new Date(startDT.getTime() + timeLimit * 6e4 * data.timeLimitMultiplier);
    setEndTime(endDT);
  }, [userAttemptNumber, timeLimit, doenetId, setEndTime]);
  useEffect(() => {
    clearTimeout(timer.current);
    if (timeLimit > 0) {
      let mins_floor = Math.floor((endTime - new Date()) / 6e4);
      let mins_raw = (endTime - new Date()) / 6e4;
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
        }, 1e4);
      }
    }
  }, [refresh, endTime]);
  return /* @__PURE__ */ React.createElement("div", {
    style: {fontSize: "40px", textAlign: "center"}
  }, timeDisplay);
}
