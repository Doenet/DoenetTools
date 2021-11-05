import React, {useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import axios from "../../_snowpack/pkg/axios.js";
import {useToast, toastType} from "../Toast.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import SearchBar from "../../_reactComponents/PanelHeaderComponents/SearchBar.js";
import {formatAMPM, UTCDateStringToDate} from "../../_utils/dateUtilityFunction.js";
export default function ChooseLearnerPanel(props) {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  let [stage, setStage] = useState("request password");
  let [code, setCode] = useState("");
  let [learners, setLearners] = useState([]);
  let [exams, setExams] = useState([]);
  let [choosenLearner, setChoosenLearner] = useState(null);
  let [filter, setFilter] = useState("");
  const addToast = useToast();
  const newAttempt = useRecoilCallback(({set, snapshot}) => async (doenetId2, code2, userId) => {
    const {data} = await axios.get("/api/incrementAttemptNumber.php", {
      params: {doenetId: doenetId2, code: code2, userId}
    });
    location.href = `/api/examjwt.php?userId=${encodeURIComponent(choosenLearner.userId)}&doenetId=${encodeURIComponent(doenetId2)}&code=${encodeURIComponent(code2)}`;
  });
  const setDoenetId = useRecoilCallback(({set}) => async (doenetId2, driveId2) => {
    set(pageToolViewAtom, (was) => {
      let newObj = {...was};
      if (doenetId2) {
        newObj.params = {doenetId: doenetId2, driveId: driveId2};
      } else {
        newObj.params = {driveId: driveId2};
      }
      return newObj;
    });
  });
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
      "data-cy": "signinCodeInput",
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
      "data-cy": "signInButton"
    }, "Submit"))));
  }
  if (stage === "check code") {
    const checkCode = async (code2) => {
      let {data} = await axios.get("/api/checkPasscode.php", {params: {code: code2, doenetId, driveId}});
      if (data.success) {
        if (driveId === "") {
          setStage("choose learner");
        } else {
          setStage("choose exam");
        }
        setLearners(data.learners);
        setExams(data.exams);
      } else {
        addToast(data.message);
        setStage("problem with code");
      }
    };
    checkCode(code);
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
        onClick: () => {
          setDoenetId(exam.doenetId, driveId);
          setStage("choose learner");
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
    if (learners.length < 1) {
      return /* @__PURE__ */ React.createElement("h1", null, "No One is Enrolled!");
    }
    let learnerRows = [];
    for (let learner of learners) {
      if (!learner.firstName.toLowerCase().includes(filter.toLowerCase()) && !learner.lastName.toLowerCase().includes(filter.toLowerCase())) {
        continue;
      }
      let timeZoneCorrectLastExamDate = null;
      if (learner.exam_to_date[doenetId]) {
        let lastExamDT = UTCDateStringToDate(learner.exam_to_date[doenetId]);
        if (lastExamDT) {
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
        style: {textAlign: "center"}
      }, /* @__PURE__ */ React.createElement("button", {
        onClick: () => {
          setChoosenLearner(learner);
          setStage("student final check");
        }
      }, "Choose"))));
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
      style: {marginLeft: "50px", marginBottom: "15px"}
    }, /* @__PURE__ */ React.createElement(SearchBar, {
      autoFocus: true,
      onChange: setFilter
    })), /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "First Name"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "Last Name"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "Student ID"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "200px"}
    }, "Last Exam"), /* @__PURE__ */ React.createElement("th", {
      style: {width: "100px"}
    }, "Choose")), /* @__PURE__ */ React.createElement("tbody", null, learnerRows)));
  }
  if (stage === "student final check") {
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
    }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Is this you?")), /* @__PURE__ */ React.createElement("div", null, "Name: ", choosenLearner.firstName, " ", choosenLearner.lastName), /* @__PURE__ */ React.createElement("div", null, "ID: ", choosenLearner.studentId)), /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
      alert: true,
      value: "No",
      onClick: () => {
        setStage("request password");
        setCode("");
        setChoosenLearner(null);
        setDoenetId(null, driveId);
      }
    }), /* @__PURE__ */ React.createElement(Button, {
      value: "Yes It's me. Start Exam.",
      onClick: () => {
        newAttempt(doenetId, code, choosenLearner.userId);
      }
    }))));
  }
  return null;
}
