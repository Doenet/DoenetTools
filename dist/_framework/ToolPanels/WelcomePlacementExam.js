import axios from "../../_snowpack/pkg/axios.js";
import {set} from "../../_snowpack/pkg/lodash.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {
  pageToolViewAtom,
  searchParamAtomFamily
} from "../NewToolRoot.js";
export default function WelcomeUMNPlacementExam() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let extended = useRecoilValue(searchParamAtomFamily("extended"));
  let [takenStatus, setTakenStatus] = useState("Page Init");
  const [examName, setExamName] = useState("Calculus Placement Exam");
  const [learnerFirstName, setLearnerFirstName] = useState(null);
  const [learnerLastName, setLearnerLastName] = useState(null);
  const [startWarningMessageOpen, setStartWarningMessageOpen] = useState(false);
  if (!doenetId) {
    doenetId = "_Xzibs2aYiKJbZsZ69bBZP";
  }
  const navigateToTheExam = () => {
    let params = {
      doenetId
    };
    if (extended) {
      params["extended"] = extended;
    }
    setPageToolView({
      page: "umn",
      tool: "exam",
      view: "",
      params
    });
  };
  useEffect(() => {
    async function getAndSetUsersExamStatus() {
      console.log("doenetId", doenetId);
      let resp = await axios.get("/api/getExamNameAndUsersPlacementExamProgress.php", {params: {doenetId}});
      console.log("resp", resp.data);
      const {success, status, examName: examName2, firstName, lastName} = resp.data;
      if (success) {
        setTakenStatus(status);
        setExamName(examName2);
        setLearnerFirstName(firstName);
        setLearnerLastName(lastName);
      }
    }
    if (takenStatus == "In Progress") {
      navigateToTheExam();
    } else if (takenStatus == "Page Init") {
      getAndSetUsersExamStatus();
    }
  }, [navigateToTheExam, takenStatus, doenetId]);
  if (takenStatus == "Page Init") {
    return null;
  } else if (takenStatus == "In Progress") {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        justifyContent: "center",
        alignItems: "center",
        margin: "20",
        padding: "5px",
        display: "flex",
        flexFlow: "column wrap"
      }
    }, /* @__PURE__ */ React.createElement("p", null, "Redirecting to ongoing exam..."));
  } else if (takenStatus == "Completed") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        justifyContent: "center",
        alignItems: "center",
        margin: "20",
        padding: "5px",
        display: "flex",
        flexFlow: "column wrap"
      }
    }, /* @__PURE__ */ React.createElement("h2", {
      style: {textAlign: "center"}
    }, "You have already taken the ", examName), /* @__PURE__ */ React.createElement("p", null, "(part of results component) If you have questions email? (call help desk?) (will be someone to reset)"), /* @__PURE__ */ React.createElement("p", null, "Results component goes here.")));
  }
  if (startWarningMessageOpen) {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        justifyContent: "center",
        alignItems: "center",
        margin: "20",
        border: "var(--mainBorder)",
        borderRadius: "var(--mainBorderRadius)",
        padding: "5px",
        display: "flex",
        flexFlow: "column wrap"
      }
    }, /* @__PURE__ */ React.createElement("h2", {
      style: {textAlign: "center"}
    }, "Are you sure you want to start the exam now?"), /* @__PURE__ */ React.createElement("p", {
      style: {textAlign: "center"}
    }, "The timer begins when you click yes."), /* @__PURE__ */ React.createElement("div", {
      style: {display: "flex", justifyContent: "center", padding: "5px"}
    }, /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
      onClick: navigateToTheExam,
      "data-test": "ConfirmFinishAssessment",
      value: "Yes"
    }), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => setStartWarningMessageOpen(false),
      "data-test": "CancelFinishAssessment",
      value: "No",
      alert: true
    }))));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      justifyContent: "center",
      alignItems: "center",
      margin: "20"
    }
  }, /* @__PURE__ */ React.createElement("h2", {
    style: {textAlign: "center"}
  }, "Welcome ", learnerFirstName, " ", learnerLastName, "!"), /* @__PURE__ */ React.createElement("h2", {
    style: {textAlign: "center"}
  }, examName), /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", justifyContent: "center", padding: "5px"}
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setStartWarningMessageOpen(true),
    value: "Start Exam"
  }))));
}
