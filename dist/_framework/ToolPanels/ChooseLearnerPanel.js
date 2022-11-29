import React, {useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import axios from "../../_snowpack/pkg/axios.js";
import {useToast, toastType} from "../Toast.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import SearchBar from "../../_reactComponents/PanelHeaderComponents/SearchBar.js";
import {formatAMPM, UTCDateStringToDate} from "../../_utils/dateUtilityFunction.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {useRef} from "../../_snowpack/pkg/react.js";
import {checkIfUserClearedOut, clearUsersInformationFromTheBrowser} from "../../_utils/applicationUtils.js";
export const Styles = styled.div`
  padding: 1rem;
  table {
    /* border-collapse: collapse; */
    border-spacing: 0;
    width: 100%;
    margin-bottom: 20vh;

    thead {
      position: sticky;
      top: 43px;
      box-shadow: 0 2px 0 0px var(--canvastext);
    }

    a {
      text-decoration: var(--mainBlue) underline;
    }

    .sortIcon {
      padding-left: 4px;
    }

    tbody tr:not(:last-child) {
      border-bottom: 1px solid var(--mainGray);
    }

    td:first-child {
      text-align: left;
      max-width: 15rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    th {
      position: sticky;
      top: 0;
      background: var(--canvas);
      user-select: none;
      max-width: 4rem;
      //word-wrap: break-word;
      padding: 2px;
      max-height: 10rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

    }

    th:first-child {
      vertical-align: bottom;
      max-width: 15rem;
      p {
        margin: 5px;
      }
    }

    /* th > p {
      height: 100%;
    } */

    tr:first-child th > p{
      margin: 0px 0px 4px 0px;
      padding: 0px;
    }

    tr:not(:first-child) th:not(:first-child) > p {
      /* writing-mode: vertical-rl; */
      text-align: left;
      /* transform: rotate(180deg); */
      /* max-height: 160px; */

    }

    tr:nth-child(even) {
      background-color: var(--mainGray);
    }

    thead tr:only-child th:not(:first-child) > p {
      /* writing-mode: vertical-rl; */
      text-align: left;
      /* transform: rotate(180deg); */
      /* max-height: 160px; */
    }

    td {
      /* user-select: none; */
      text-align: center;
      max-width: 5rem;
    }
    td,
    th {
      border-right: 2px solid var(--canvastext);
      :last-child {
        border-right: 0;
      }
    }

    tfoot {
      font-weight: bolder;
      position: sticky;
      bottom: 0;
      background-color: var(--canvas);
      box-shadow: inset 0 2px 0 var(--canvastext);
    }
  }
`;
export default function ChooseLearnerPanel(props) {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let [stage, setStage] = useState("request password");
  let [code, setCode] = useState("");
  let [learners, setLearners] = useState([]);
  let [exams, setExams] = useState([]);
  let [examsById, setExamsById] = useState({});
  let [choosenLearner, setChoosenLearner] = useState(null);
  let [filter, setFilter] = useState("");
  let [resumeAttemptFlag, setResumeAttemptFlag] = useState(false);
  let [message, setMessage] = useState("");
  let [selectedExamLabel, setSelectedExamLabel] = useState("");
  let clearingUserRef = useRef(false);
  let [clearingMessageJSX, setClearingMessageJSX] = useState(null);
  const addToast = useToast();
  const newAttempt = useRecoilCallback(({set, snapshot}) => async (doenetId2, code2, userId, resumeAttemptFlag2) => {
    if (!resumeAttemptFlag2) {
      const {data} = await axios.get("/api/incrementAttemptNumberForExam.php", {
        params: {doenetId: doenetId2, code: code2, userId}
      });
    }
    location.href = `/api/examjwt.php?userId=${encodeURIComponent(choosenLearner.userId)}&doenetId=${encodeURIComponent(doenetId2)}&code=${encodeURIComponent(code2)}`;
  });
  const setDoenetId = useRecoilCallback(({set}) => async (doenetId2, courseId2) => {
    set(pageToolViewAtom, (was) => {
      let newObj = {...was};
      if (doenetId2) {
        newObj.params = {doenetId: doenetId2, courseId: courseId2};
      } else {
        newObj.params = {courseId: courseId2};
      }
      return newObj;
    });
  });
  async function clearOutUser() {
    while (clearingUserRef.current) {
      await clearUsersInformationFromTheBrowser();
      let {userInformationIsCompletelyRemoved, messageArray} = await checkIfUserClearedOut();
      setClearingMessageJSX(messageArray.map((text, i) => /* @__PURE__ */ React.createElement("p", {
        key: `error ${i}`
      }, text)));
      if (userInformationIsCompletelyRemoved) {
        setStage("choose exam");
        clearingUserRef.current = false;
        break;
      }
    }
  }
  if (stage === "request password" || stage === "problem with code") {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20"
      }
    }, /* @__PURE__ */ React.createElement("img", {
      style: {width: "250px", height: "250px"},
      alt: "Doenet Logo",
      src: "/media/Doenet_Logo_Frontpage.png"
    }), /* @__PURE__ */ React.createElement("div", {
      style: {leftPadding: "10px"}
    }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("div", {
      style: {weight: "bold"}
    }, "Enter Passcode "), /* @__PURE__ */ React.createElement("input", {
      type: "password",
      value: code,
      "data-test": "signinCodeInput",
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          setStage("check code");
        }
      },
      onChange: (e) => {
        setCode(e.target.value);
      }
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
      style: {},
      onClick: () => setStage("check code"),
      "data-test": "signInButton"
    }, "Submit"))));
  }
  if (stage === "check code") {
    const checkCode = async (code2) => {
      let {data} = await axios.get("/api/checkPasscode.php", {params: {code: code2, doenetId, courseId}});
      if (data.success) {
        clearingUserRef.current = true;
        clearOutUser();
        setStage("clearing past user");
        setLearners(data.learners);
        setExams(data.exams);
        let nextExamsById = {};
        for (let examInfo of data.exams) {
          nextExamsById[examInfo.doenetId] = examInfo;
        }
        setExamsById(nextExamsById);
      } else {
        addToast(data.message);
        setStage("problem with code");
      }
    };
    checkCode(code);
  }
  if (stage === "clearing past user") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, "Clearing out past user..."), clearingMessageJSX, /* @__PURE__ */ React.createElement(Button, {
      value: "Cancel",
      onClick: () => {
        clearingUserRef.current = false;
        setStage("choose exam");
      }
    }));
  }
  if (stage === "choose exam") {
    if (exams.length < 1) {
      return /* @__PURE__ */ React.createElement("h1", null, "No Exams Available!");
    }
    let examRows = [];
    for (let exam of exams) {
      examRows.push(/* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, exam.label), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, /* @__PURE__ */ React.createElement("button", {
        onClick: async () => {
          const {data} = await axios.get("/api/checkSEBheaders.php", {
            params: {doenetId: exam.doenetId}
          });
          if (Number(data.legitAccessKey) !== 1) {
            setStage("Problem");
            setMessage("Browser not configured properly to take an exam.");
            return;
          } else {
            setDoenetId(exam.doenetId, courseId);
            setSelectedExamLabel(exam.label);
            setStage("choose learner");
          }
        }
      }, "Choose"))));
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "Exam"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "100px"}
    }, "Choose")), /* @__PURE__ */ React.createElement("tbody", null, examRows)));
  }
  if (stage === "choose learner") {
    if (!doenetId) {
      return null;
    }
    if (learners.length < 1) {
      return /* @__PURE__ */ React.createElement("h1", null, "No One is Enrolled!");
    }
    let learnerRows = [];
    let examTimeLimit = examsById[doenetId].timeLimit;
    for (let learner of learners) {
      if (!learner.firstName.toLowerCase().includes(filter.toLowerCase()) && !learner.lastName.toLowerCase().includes(filter.toLowerCase())) {
        continue;
      }
      let timeZoneCorrectLastExamDate = null;
      let allowResume = false;
      if (learner?.exam_to_date[doenetId]) {
        let lastExamDT = UTCDateStringToDate(learner?.exam_to_date[doenetId]);
        allowResume = examTimeLimit === null;
        let minutesRemainingPhrase = null;
        if (!allowResume) {
          let users_timeLimit_minutes = Number(examTimeLimit) * Number(learner.timeLimitMultiplier);
          let minutes_remaining;
          if (users_timeLimit_minutes) {
            let users_exam_end_DT = new Date(lastExamDT.getTime() + users_timeLimit_minutes * 60 * 1e3);
            let now = new Date();
            minutes_remaining = (users_exam_end_DT.getTime() - now.getTime()) / (1e3 * 60);
          }
          if (minutes_remaining && minutes_remaining > 1) {
            allowResume = true;
            minutesRemainingPhrase = `${Math.round(minutes_remaining)} mins remain`;
          }
          ;
        }
        if (allowResume) {
          if (!minutesRemainingPhrase) {
            let time = formatAMPM(lastExamDT);
            minutesRemainingPhrase = `${lastExamDT.getMonth() + 1}/${lastExamDT.getDate()} ${time}`;
          }
          timeZoneCorrectLastExamDate = /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
            value: "Resume",
            onClick: () => {
              setChoosenLearner(learner);
              setStage("student final check");
              setResumeAttemptFlag(true);
            }
          }), minutesRemainingPhrase);
        } else if (lastExamDT) {
          let time = formatAMPM(lastExamDT);
          timeZoneCorrectLastExamDate = `${lastExamDT.getMonth() + 1}/${lastExamDT.getDate()} ${time}`;
        }
      }
      learnerRows.push(/* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, learner.firstName), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, learner.lastName), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, learner.studentId), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, timeZoneCorrectLastExamDate), /* @__PURE__ */ React.createElement("td", {
        style: {display: "block", margin: "4px auto"}
      }, /* @__PURE__ */ React.createElement(Button, {
        width: "menu",
        value: "Start",
        onClick: () => {
          setChoosenLearner(learner);
          setStage("student final check");
          setResumeAttemptFlag(false);
        }
      }))));
    }
    return /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement("div", {
      style: {
        background: "var(--canvas)",
        top: 0,
        position: "sticky",
        paddingLeft: "50px",
        paddingBottom: "15px",
        display: "flex"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {marginRight: "15px", fontSize: "16pt"}
    }, "Exam: ", selectedExamLabel), "  ", /* @__PURE__ */ React.createElement(SearchBar, {
      autoFocus: true,
      onChange: setFilter,
      width: "100%"
    })), /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "First Name"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "Last Name"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "Student ID"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "240px"}
    }, "Last Exam"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "60px"}
    }, "Choose")), /* @__PURE__ */ React.createElement("tbody", null, learnerRows)));
  }
  if (stage === "student final check") {
    let yesButtonText = "Yes It's me. Start Exam.";
    if (resumeAttemptFlag) {
      yesButtonText = "Yes It's me. Resume Exam.";
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      style: {
        fontSize: "1.5em",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        justifyContent: "center",
        alignItems: "center",
        margin: "20"
      }
    }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
      style: {marginRight: "15px", fontSize: "16pt"}
    }, "Exam: ", selectedExamLabel), /* @__PURE__ */ React.createElement("div", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Is this you?")), /* @__PURE__ */ React.createElement("div", null, "Name: ", choosenLearner.firstName, " ", choosenLearner.lastName), /* @__PURE__ */ React.createElement("div", null, "ID: ", choosenLearner.studentId)), /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
      alert: true,
      value: "No",
      onClick: () => {
        setStage("request password");
        setCode("");
        setChoosenLearner(null);
        setDoenetId(null, courseId);
        setResumeAttemptFlag(false);
      }
    }), /* @__PURE__ */ React.createElement(Button, {
      value: yesButtonText,
      onClick: () => {
        newAttempt(doenetId, code, choosenLearner.userId, resumeAttemptFlag);
      }
    }))));
  }
  if (stage === "Problem") {
    return /* @__PURE__ */ React.createElement("h1", null, message);
  }
  return null;
}
