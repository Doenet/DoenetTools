import React, {useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {currentAttemptNumber} from "../ToolPanels/AssignmentViewer.js";
import axios from "../../_snowpack/pkg/axios.js";
export default function TimerMenu() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const userAttemptNumber = useRecoilValue(currentAttemptNumber);
  const {timeLimit} = useRecoilValue(loadAssignmentSelector(doenetId));
  let [timeDisplay, setTimeDisplay] = useState("Unlimited");
  const [endTime, setEndTime] = useState(null);
  const [refresh, setRefresh] = useState(new Date());
  let timer = useRef(null);
  useEffect(() => {
    async function setEndTimeAsync() {
      let startDT = new Date();
      const {data} = await axios.get("/api/loadTakenVariants.php", {
        params: {doenetId}
      });
      for (let [i, attemptNumber] of Object.entries(data.attemptNumbers)) {
        if (attemptNumber == userAttemptNumber) {
          if (data.starts[i] !== null) {
            let t = data.starts[i].split(/[- :]/);
            startDT = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
          }
        }
      }
      console.log(">>>>startDT", startDT);
      let endDT = new Date(startDT.getTime() + timeLimit * 6e4 * data.timeLimitMultiplier);
      console.log(">>>>endDT", endDT);
      console.log(">>>>now", new Date());
      setEndTime(endDT);
    }
    setEndTimeAsync();
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
