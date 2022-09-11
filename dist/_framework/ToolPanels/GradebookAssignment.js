import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {
  Styles,
  Table,
  studentData,
  attemptData,
  assignmentData,
  attemptDataQuerry,
  studentDataQuerry,
  overViewDataQuerry
} from "./Gradebook.js";
import {
  atom,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast, toastType} from "../Toast.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import DropdownMenu from "../../_reactComponents/PanelHeaderComponents/DropdownMenu.js";
import {suppressMenusAtom} from "../NewToolRoot.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import axios from "../../_snowpack/pkg/axios.js";
export const processGradesAtom = atom({
  key: "processGradesAtom",
  default: "Assignment Table"
});
export const headersGradesAtom = atom({
  key: "headersGradesAtom",
  default: []
});
export const entriesGradesAtom = atom({
  key: "entriesGradesAtom",
  default: []
});
const getUserId = (students, name) => {
  console.log(students, name);
  for (let userId in students) {
    if (students[userId].firstName + " " + students[userId].lastName == name) {
      return userId;
    }
  }
  return -1;
};
function UploadChoices({doenetId, maxAttempts}) {
  let headers = useRecoilValue(headersGradesAtom);
  let rows = useRecoilValue(entriesGradesAtom);
  const addToast = useToast();
  const setProcess = useSetRecoilState(processGradesAtom);
  let assignments = useRecoilValueLoadable(assignmentData);
  let [scoreIndex, setScoreIndex] = useState(null);
  let [selectedColumnIndex, setSelectedColumnIndex] = useState(1);
  let [attemptNumber, setAttemptNumber] = useState(null);
  let [selectedAttemptIndex, setSelectedAttemptIndex] = useState(1);
  const refreshGradebook = useRecoilCallback(({set, snapshot}) => async ({doenetId: doenetId2, addToast: addToast2}) => {
    const driveId = await snapshot.getPromise(searchParamAtomFamily("driveId"));
    let doenetIdPayload = {params: {doenetId: doenetId2}};
    let driveIdPayload = {params: {driveId}};
    let attemptData2 = await axios.get("/api/loadGradebookAssignmentAttempts.php", doenetIdPayload);
    let studentData2 = await axios.get("/api/loadGradebookEnrollment.php", driveIdPayload);
    let overView = await axios.get("/api/loadGradebookOverview.php", driveIdPayload);
    set(attemptDataQuerry(doenetId2), attemptData2.data);
    set(studentDataQuerry, studentData2.data);
    set(overViewDataQuerry, overView.data);
    addToast2(`Updated scores!`);
    set(processGradesAtom, "Assignment Table");
  });
  if (assignments.state !== "hasValue") {
    return null;
  }
  const totalPointsOrPercent = assignments.contents?.[doenetId]?.totalPointsOrPercent;
  if (!headers.includes("SIS User ID")) {
    addToast("Need a column header named 'SIS User ID' ", toastType.ERROR);
    setProcess("Assignment Table");
    return null;
  }
  let columnIndexes = [];
  let validColumns = headers.filter((value, i) => {
    let columnPoints = Number(rows?.[0]?.[i]);
    if (columnPoints == totalPointsOrPercent) {
      columnIndexes.push(i);
    }
    return columnPoints == totalPointsOrPercent;
  });
  if (validColumns.length < 1) {
    addToast(`Need a column with an assignment worth ${totalPointsOrPercent} points`, toastType.ERROR);
    setProcess("Assignment Table");
    return null;
  }
  if (!scoreIndex) {
    setScoreIndex(columnIndexes[0]);
  }
  let tableRows = [];
  let emails = [];
  let scores = [];
  for (let row of rows) {
    let name = row[0];
    let id = row[1];
    let email = row[3];
    let score = row[scoreIndex];
    if (email !== "") {
      emails.push(email);
      scores.push(score);
      tableRows.push(/* @__PURE__ */ React.createElement("tr", null, " ", /* @__PURE__ */ React.createElement("td", null, name), /* @__PURE__ */ React.createElement("td", null, email), /* @__PURE__ */ React.createElement("td", null, id), /* @__PURE__ */ React.createElement("td", null, score)));
    }
  }
  let importTable = /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", {
    style: {width: "200px"}
  }, "Student"), /* @__PURE__ */ React.createElement("th", {
    style: {width: "200px"}
  }, "Email"), /* @__PURE__ */ React.createElement("th", {
    style: {width: "100px"}
  }, "ID"), /* @__PURE__ */ React.createElement("th", {
    style: {width: "50px"}
  }, "Score")), tableRows);
  let dropdownItems = [];
  for (let [i, name] of Object.entries(validColumns)) {
    dropdownItems.push([i, name]);
  }
  let attemptDropdownItems = [];
  if (attemptNumber === null) {
    attemptDropdownItems.push([0, `Select Attempt Number`]);
  }
  for (let i = 1; i <= maxAttempts; i++) {
    attemptDropdownItems.push([i, `Attempt Number ${i}`]);
  }
  attemptDropdownItems.push([Number(maxAttempts) + 1, `New Attempt Number`]);
  let descriptionOfUpload = null;
  if (attemptNumber) {
    if (Number(maxAttempts) + 1 === attemptNumber) {
      descriptionOfUpload = /* @__PURE__ */ React.createElement("div", null, "Use column ", /* @__PURE__ */ React.createElement("b", null, validColumns[Number(selectedColumnIndex) - 1]), " to insert a new ", /* @__PURE__ */ React.createElement("b", null, "Attempt Number ", attemptNumber), "?");
    } else {
      descriptionOfUpload = /* @__PURE__ */ React.createElement("div", null, "Use column ", /* @__PURE__ */ React.createElement("b", null, validColumns[Number(selectedColumnIndex) - 1]), " to change ", /* @__PURE__ */ React.createElement("b", null, "Attempt Number ", attemptNumber), " scores?");
    }
  }
  {
    attemptNumber ? /* @__PURE__ */ React.createElement("div", null, "Use column ", /* @__PURE__ */ React.createElement("b", null, validColumns[Number(selectedColumnIndex) - 1]), " as ", /* @__PURE__ */ React.createElement("b", null, "Attempt Number ", attemptNumber), " to ", Number(maxAttempts) + 1 === attemptNumber ? "insert" : "override", " scores?") : null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, validColumns.length, " column", validColumns.length > 1 ? "s" : null, " match ", totalPointsOrPercent, " total points "), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DropdownMenu, {
    items: dropdownItems,
    valueIndex: selectedColumnIndex,
    width: "400px",
    onChange: ({value}) => {
      setSelectedColumnIndex(Number(value) + 1);
      setScoreIndex(columnIndexes[value]);
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DropdownMenu, {
    items: attemptDropdownItems,
    valueIndex: selectedAttemptIndex,
    width: "400px",
    onChange: ({value}) => {
      setSelectedAttemptIndex(value);
      setAttemptNumber(value);
    }
  })), /* @__PURE__ */ React.createElement("br", null), descriptionOfUpload, /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
    alert: true,
    value: "Cancel",
    onClick: () => {
      addToast(`Override Cancelled`);
      setProcess("Assignment Table");
    }
  }), attemptNumber ? /* @__PURE__ */ React.createElement(Button, {
    value: "Accept",
    onClick: () => {
      let payload = {
        doenetId,
        attemptNumber,
        emails,
        scores
      };
      axios.post("/api/saveOverrideGrades.php", payload).catch((e) => {
        addToast(e, toastType.ERROR);
        setProcess("Assignment Table");
      }).then(({data}) => {
        if (data.success) {
          refreshGradebook({doenetId, addToast});
        } else {
          console.log(">>>>data", data);
          addToast(data.message, toastType.ERROR);
        }
      });
    }
  }) : null), /* @__PURE__ */ React.createElement("br", null), importTable);
}
export default function GradebookAssignmentView() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let attempts = useRecoilValueLoadable(attemptData(doenetId));
  let students = useRecoilValueLoadable(studentData);
  let [process, setProcess] = useRecoilState(processGradesAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  let {canViewAndModifyGrades} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  let assignments = useRecoilValueLoadable(assignmentData);
  useEffect(() => {
    if (canViewAndModifyGrades === "1") {
      setSuppressMenus(["GradeUpload"]);
    } else {
      setSuppressMenus([]);
    }
  }, [canViewAndModifyGrades, setSuppressMenus]);
  if (attempts.state !== "hasValue" || students.state !== "hasValue" || assignments.state !== "hasValue") {
    return null;
  }
  const label = assignments.contents[doenetId].label;
  const totalPossiblePoints = Number(assignments.contents[doenetId]?.totalPointsOrPercent);
  let assignmentsTable = {};
  let maxAttempts = 0;
  for (let userId in attempts.contents) {
    if (attempts.contents[userId]?.attempts) {
      let len = Object.keys(attempts.contents[userId].attempts).length;
      if (len > maxAttempts)
        maxAttempts = len;
    }
  }
  if (process === "Upload Choice Table") {
    return /* @__PURE__ */ React.createElement(UploadChoices, {
      doenetId,
      maxAttempts
    });
  }
  assignmentsTable.headers = [];
  assignmentsTable.headers.push({
    Header: "Student",
    Footer: "Possible Points",
    accessor: "student"
  });
  for (let i = 1; i <= maxAttempts; i++) {
    assignmentsTable.headers.push({
      Header: "Attempt " + i,
      Footer: totalPossiblePoints,
      accessor: "a" + i,
      disableFilters: true,
      Cell: (row) => /* @__PURE__ */ React.createElement("a", {
        onClick: (e) => {
          let name = row.cell.row.cells[0].value.props.children;
          console.log(name);
          let userId = getUserId(students.contents, name);
          setPageToolView({
            page: "course",
            tool: "gradebookStudentAssignment",
            view: "",
            params: {courseId, doenetId, userId, attemptNumber: i, previousCrumb: "assignment"}
          });
        }
      }, row.value)
    });
  }
  assignmentsTable.headers.push({
    Header: "Assignment Total",
    Footer: totalPossiblePoints,
    accessor: "grade",
    disableFilters: true
  });
  assignmentsTable.rows = [];
  for (let userId in students.contents) {
    let firstName = students.contents[userId].firstName;
    let lastName = students.contents[userId].lastName;
    let row = {};
    let name = firstName + " " + lastName;
    row["student"] = /* @__PURE__ */ React.createElement("a", {
      onClick: (e) => {
        setPageToolView({
          page: "course",
          tool: "gradebookStudentAssignment",
          view: "",
          params: {courseId, doenetId, userId, previousCrumb: "assignment"}
        });
      }
    }, name);
    for (let i = 1; i <= maxAttempts; i++) {
      let attemptCredit = attempts.contents[userId]?.attempts[i];
      let pointsEarned = Math.round(attemptCredit * totalPossiblePoints * 100) / 100;
      row["a" + i] = attemptCredit === void 0 ? "" : pointsEarned;
    }
    let totalCredit = attempts.contents[userId]?.credit;
    let totalPointsEarned = Math.round(totalCredit * totalPossiblePoints * 100) / 100;
    row["grade"] = totalCredit ? totalPointsEarned : "0";
    assignmentsTable.rows.push(row);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {paddingLeft: "8px"}
  }, /* @__PURE__ */ React.createElement("b", null, label)), /* @__PURE__ */ React.createElement("div", {
    style: {paddingLeft: "8px"}
  }, totalPossiblePoints, " Points Possible"), /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: assignmentsTable.headers,
    data: assignmentsTable.rows
  })));
}
