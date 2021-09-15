import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import {Styles, Table, studentData, attemptData, driveId} from "./Gradebook.js";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import DoenetViewer, {
  serializedComponentsReviver
} from "../../viewer/DoenetViewer.js";
import axios from "../../_snowpack/pkg/axios.js";
import {currentAttemptNumber} from "./AssignmentViewer.js";
const getUserId = (students, name) => {
  for (let userId in students) {
    if (students[userId].firstName + " " + students[userId].lastName == name) {
      return userId;
    }
  }
  return -1;
};
export default function GradebookStudentAssignmentView(props) {
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  let attempts = useRecoilValueLoadable(attemptData(doenetId));
  let students = useRecoilValueLoadable(studentData);
  const setRecoilAttemptNumber = useSetRecoilState(currentAttemptNumber);
  const attemptsObj = attempts?.contents?.[userId]?.attempts;
  let [attemptNumber, setAttemptNumber] = useState(null);
  let [attemptsInfo, setAttemptsInfo] = useState(null);
  let assignmentsTable = {};
  let maxAttempts = 0;
  useEffect(() => {
    if (attemptsObj) {
      setAttemptNumber(Object.keys(attemptsObj).length);
      setRecoilAttemptNumber(Object.keys(attemptsObj).length);
    }
  }, [attemptsObj, setAttemptNumber, setRecoilAttemptNumber]);
  if (!doenetId || !userId) {
    return null;
  }
  async function loadAssignmentInfo(doenetId2, userId2) {
    const {data} = await axios.get(`/api/getGradebookAssignmentAttempts.php`, {params: {doenetId: doenetId2, userId: userId2}});
    let dataAttemptInfo = [];
    let contentIdToDoenetML = {};
    let solutionDisplayMode = "none";
    if (data.showSolutionInGradebook === "1") {
      solutionDisplayMode = "button";
    }
    for (let attempt of data.attemptInfo) {
      let gvariant = JSON.parse(attempt.variant, serializedComponentsReviver);
      let doenetML = contentIdToDoenetML[attempt.contentId];
      if (doenetML) {
        dataAttemptInfo.push({
          contentId: attempt.contentId,
          variant: {name: gvariant.name},
          doenetML,
          solutionDisplayMode
        });
      } else {
        const {data: data2} = await axios.get(`/media/${attempt.contentId}.doenet`);
        contentIdToDoenetML[attempt.contentId] = data2;
        dataAttemptInfo.push({
          contentId: attempt.contentId,
          variant: {name: gvariant.name},
          doenetML: data2,
          solutionDisplayMode
        });
      }
    }
    setAttemptsInfo(dataAttemptInfo);
  }
  if (attemptsInfo === null) {
    loadAssignmentInfo(doenetId, userId);
    return null;
  }
  if (attempts.state == "hasValue" && userId !== null && userId !== "") {
    let len = Object.keys(attempts.contents[userId].attempts).length;
    maxAttempts = len;
  }
  assignmentsTable.headers = [
    {
      Header: "Student",
      accessor: "student"
    }
  ];
  for (let i = 1; i <= maxAttempts; i++) {
    assignmentsTable.headers.push({
      Header: "Attempt " + i,
      accessor: "a" + i,
      disableFilters: true,
      Cell: (row) => /* @__PURE__ */ React.createElement("a", {
        onClick: (e) => {
          setAttemptNumber(i);
          setRecoilAttemptNumber(i);
        }
      }, " ", row.value, " ")
    });
  }
  assignmentsTable.headers.push({
    Header: "Assignment Grade",
    accessor: "grade",
    disableFilters: true
  });
  assignmentsTable.rows = [];
  if (students.state == "hasValue" && userId !== null && userId !== "") {
    let firstName = students.contents[userId].firstName;
    let lastName = students.contents[userId].lastName;
    let row = {};
    row["student"] = firstName + " " + lastName;
    if (attempts.state == "hasValue") {
      for (let i = 1; i <= maxAttempts; i++) {
        let attemptCredit = attempts.contents[userId].attempts[i];
        row["a" + i] = attemptCredit ? Math.round(attemptCredit * 1e3) / 10 + "%" : "";
      }
      row["grade"] = attempts.contents[userId].credit ? Math.round(attempts.contents[userId].credit * 1e3) / 10 + "%" : "";
    }
    assignmentsTable.rows.push(row);
  }
  let dViewer = null;
  if (attemptNumber > 0) {
    let variant = attemptsInfo[attemptNumber - 1].variant;
    let doenetML = attemptsInfo[attemptNumber - 1].doenetML;
    let solutionDisplayMode = attemptsInfo[attemptNumber - 1].solutionDisplayMode;
    dViewer = /* @__PURE__ */ React.createElement(DoenetViewer, {
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
        isAssignment: true
      },
      attemptNumber,
      allowLoadPageState: true,
      allowSavePageState: false,
      allowLocalPageState: false,
      allowSaveSubmissions: false,
      allowSaveEvents: false,
      requestedVariant: variant
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: assignmentsTable.headers,
    data: assignmentsTable.rows
  })), attemptNumber > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {paddingLeft: "8px"}
  }, "Viewing Attempt Number ", attemptNumber), dViewer) : /* @__PURE__ */ React.createElement("div", null, "Click an attempt's grade to see your attempt"));
}
