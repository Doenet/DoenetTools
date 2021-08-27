import React from "../../_snowpack/pkg/react.js";
import {Styles, Table, studentData, attemptData, driveId} from "./Gradebook.js";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
const getUserId = (students, name) => {
  for (let userId in students) {
    if (students[userId].firstName + " " + students[userId].lastName == name) {
      return userId;
    }
  }
  return -1;
};
export default function GradebookStudentAssignmentView(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  let source = useRecoilValue(searchParamAtomFamily("source"));
  let assignmentsTable = {};
  let attempts = useRecoilValueLoadable(attemptData(doenetId));
  let students = useRecoilValueLoadable(studentData);
  let maxAttempts = 0;
  let driveIdValue = useRecoilValue(driveId);
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
          setPageToolView({
            page: "course",
            tool: "gradebookAttempt",
            view: "",
            params: {driveId: driveIdValue, doenetId, userId, attemptNumber: i, source}
          });
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
        row["a" + i] = attemptCredit ? attemptCredit * 100 + "%" : "";
      }
      row["grade"] = attempts.contents[userId].credit ? attempts.contents[userId].credit * 100 + "%" : "";
    }
    assignmentsTable.rows.push(row);
  }
  return /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: assignmentsTable.headers,
    data: assignmentsTable.rows
  }));
}
