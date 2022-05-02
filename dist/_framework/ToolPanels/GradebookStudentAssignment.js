import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import {Styles, Table, studentData, attemptData, assignmentData} from "./Gradebook.js";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily, suppressMenusAtom} from "../NewToolRoot.js";
import DoenetViewer from "./AssignmentViewer.js";
import {serializedComponentsReviver} from "../../core/utils/serializedStateProcessing.js";
import axios from "../../_snowpack/pkg/axios.js";
import {currentAttemptNumber} from "./AssignmentViewer.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import PageViewer from "../../viewer/PageViewer.js";
const getUserId = (students, name) => {
  for (let userId in students) {
    if (students[userId].firstName + " " + students[userId].lastName == name) {
      return userId;
    }
  }
  return -1;
};
export default function GradebookStudentAssignmentView() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let source = useRecoilValue(searchParamAtomFamily("source"));
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  let driveIdValue = useRecoilValue(searchParamAtomFamily("driveId"));
  let paramAttemptNumber = useRecoilValue(searchParamAtomFamily("attemptNumber"));
  let attempts = useRecoilValueLoadable(attemptData(doenetId));
  let students = useRecoilValueLoadable(studentData);
  const setRecoilAttemptNumber = useSetRecoilState(currentAttemptNumber);
  let assignments = useRecoilValueLoadable(assignmentData);
  let effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const totalPointsOrPercent = Number(assignments.contents[doenetId]?.totalPointsOrPercent);
  const label = assignments.contents[doenetId]?.label;
  const attemptsObj = attempts?.contents?.[userId]?.attempts;
  let [attemptNumber, setAttemptNumber] = useState(null);
  let [attemptsInfo, setAttemptsInfo] = useState(null);
  let assignmentsTable = {};
  let maxAttempts = 0;
  useEffect(() => {
    if (attemptsObj) {
      let attemptNumbers = Object.keys(attemptsObj).map(Number);
      let effectiveAttemptNumber = Math.max(0, ...attemptNumbers);
      if (paramAttemptNumber && paramAttemptNumber < effectiveAttemptNumber) {
        effectiveAttemptNumber = paramAttemptNumber;
      }
      setAttemptNumber(effectiveAttemptNumber);
      setRecoilAttemptNumber(effectiveAttemptNumber);
    } else {
      console.log(">>>>TODO TELL THEM YOU HAVENT TAKEN YET");
    }
  }, [attemptsObj, setAttemptNumber, setRecoilAttemptNumber, paramAttemptNumber]);
  useEffect(() => {
    if (effectiveRole === "student") {
      setSuppressMenus(["GradeSettings"]);
    } else {
      setSuppressMenus([]);
    }
  }, [effectiveRole, setSuppressMenus]);
  if (!doenetId || !userId) {
    return null;
  }
  async function loadAssignmentInfo(doenetId2, userId2) {
    const {data} = await axios.get(`/api/getGradebookAssignmentAttempts.php`, {params: {doenetId: doenetId2, userId: userId2}});
    let dataAttemptInfo = {};
    let contentIdToDoenetML = {};
    let solutionDisplayMode = "none";
    if (data.showSolutionInGradebook === "1") {
      solutionDisplayMode = "button";
    }
    for (let attempt of data.attemptInfo) {
      let attemptNumber2 = attempt.attemptNumber;
      let gvariant = JSON.parse(attempt.variant, serializedComponentsReviver);
      let doenetML = contentIdToDoenetML[attempt.cid];
      if (doenetML) {
        dataAttemptInfo[attemptNumber2] = {
          cid: attempt.cid,
          variant: {name: gvariant?.name},
          doenetML,
          solutionDisplayMode
        };
      } else {
        const {data: data2} = await axios.get(`/media/${attempt.cid}.doenet`);
        contentIdToDoenetML[attempt.cid] = data2;
        dataAttemptInfo[attemptNumber2] = {
          cid: attempt.cid,
          variant: {name: gvariant?.name},
          doenetML: data2,
          solutionDisplayMode
        };
      }
    }
    setAttemptsInfo(dataAttemptInfo);
  }
  if (attemptsInfo === null) {
    loadAssignmentInfo(doenetId, userId);
    return null;
  }
  if (attempts.state == "hasValue" && userId !== null && userId !== "") {
    maxAttempts = Math.max(0, ...Object.keys(attemptsInfo).map(Number));
  }
  assignmentsTable.headers = [
    {
      Header: "Score",
      Footer: "Possible Points",
      accessor: "score",
      disableFilters: true
    }
  ];
  assignmentsTable.rows = [];
  if (students.state == "hasValue" && userId !== null && userId !== "") {
    let creditRow = {};
    let scoreRow = {};
    creditRow["score"] = "Percentage";
    scoreRow["score"] = "Score";
    if (attempts.state == "hasValue") {
      for (let i = 1; i <= maxAttempts; i++) {
        let attemptCredit = attempts.contents[userId].attempts[i];
        creditRow["a" + i] = attemptCredit ? Math.round(attemptCredit * 1e3) / 10 + "%" : "";
        scoreRow["a" + i] = attemptCredit ? Math.round(attemptCredit * 100 * totalPointsOrPercent) / 100 : "";
      }
      creditRow["total"] = attempts.contents[userId].credit ? Math.round(attempts.contents[userId].credit * 1e3) / 10 + "%" : "";
      scoreRow["total"] = attempts.contents[userId].credit ? Math.round(attempts.contents[userId].credit * totalPointsOrPercent * 100) / 100 : "0";
    }
    assignmentsTable.rows.push(scoreRow);
    assignmentsTable.rows.push(creditRow);
  }
  assignmentsTable.headers.push({
    Header: "Assignment Total",
    Footer: totalPointsOrPercent,
    accessor: "total",
    disableFilters: true
  });
  for (let i = 1; i <= maxAttempts; i++) {
    assignmentsTable.headers.push({
      Header: "Attempt " + i,
      Footer: totalPointsOrPercent,
      accessor: "a" + i,
      disableFilters: true,
      Cell: (row) => /* @__PURE__ */ React.createElement("a", {
        onClick: (e) => {
          setPageToolView({
            page: "course",
            tool: "gradebookStudentAssignment",
            view: "",
            params: {driveId: driveIdValue, doenetId, userId, attemptNumber: i, source}
          });
        }
      }, " ", row.value, " ")
    });
  }
  let dViewer = null;
  let attemptNumberJSX = null;
  if (attemptNumber > 0 && attemptsInfo[attemptNumber] && attemptsInfo[attemptNumber].cid !== "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") {
    let variant = attemptsInfo[attemptNumber].variant;
    let doenetML = attemptsInfo[attemptNumber].doenetML;
    let solutionDisplayMode = attemptsInfo[attemptNumber].solutionDisplayMode;
    dViewer = /* @__PURE__ */ React.createElement(PageViewer, {
      key: `doenetviewer${doenetId}`,
      doenetML,
      doenetId,
      userId,
      flags: {
        showCorrectness: true,
        readOnly: true,
        solutionDisplayMode,
        showFeedback: true,
        showHints: true,
        isAssignment: true,
        allowLoadState: true,
        allowSaveState: false,
        allowLocalState: false,
        allowSaveSubmissions: false,
        allowSaveEvents: false,
        pageStateSource: "submissions"
      },
      attemptNumber,
      requestedVariant: variant
    });
    attemptNumberJSX = /* @__PURE__ */ React.createElement("div", {
      style: {paddingLeft: "8px"}
    }, "Viewing attempt number ", attemptNumber);
  } else {
    attemptNumberJSX = /* @__PURE__ */ React.createElement("div", {
      style: {paddingLeft: "8px"}
    }, "No content available for attempt number ", attemptNumber);
  }
  let studentName = `${students.contents[userId]?.firstName} ${students.contents[userId]?.lastName}`;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "18px"}
  }, /* @__PURE__ */ React.createElement("b", null, "Gradebook for ", studentName)), /* @__PURE__ */ React.createElement("div", {
    style: {paddingLeft: "18px"}
  }, /* @__PURE__ */ React.createElement("b", null, label)), /* @__PURE__ */ React.createElement("div", {
    style: {paddingLeft: "18px"}
  }, totalPointsOrPercent, " Points Possible"), /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: assignmentsTable.headers,
    data: assignmentsTable.rows
  })), attemptNumber > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, attemptNumberJSX, dViewer) : /* @__PURE__ */ React.createElement("div", null, "Click an attempt's grade to see your attempt"));
}
