import React, {useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import {variantsAndAttemptsByDoenetId} from "../ToolPanels/AssignmentViewer.js";
import axios from "../../_snowpack/pkg/axios.js";
export default function TimerMenu() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const userAttempts = useRecoilValue(variantsAndAttemptsByDoenetId(doenetId));
  const userAttemptNumber = userAttempts.numberOfCompletedAttempts + 1;
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
            startDT = new Date(`${data.starts[i]} UTC`);
          }
        }
      }
      let endDT = new Date(startDT.getTime() + timeLimit * 6e4);
      setEndTime(endDT);
    }
    setEndTimeAsync();
  }, [userAttemptNumber, timeLimit, doenetId, setEndTime]);
  useEffect(() => {
    clearTimeout(timer.current);
    if (timeLimit > 0) {
      let mins = Math.floor((endTime - new Date()) / 6e4);
      if (mins <= 0) {
        setTimeDisplay(`Time's Up`);
      } else {
        if (mins === 1) {
          setTimeDisplay(`1 Min`);
        } else {
          setTimeDisplay(`${mins} Mins`);
        }
        timer.current = setTimeout(() => {
          if (new Date() < endTime) {
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
