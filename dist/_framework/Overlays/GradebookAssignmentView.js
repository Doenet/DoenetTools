import React, {useEffect} from "../../_snowpack/pkg/react.js";
import Tool from "../Tool.js";
import {Styles, Table, studentData, attemptData} from "../../gradebook/Gradebook.js";
import {useToolControlHelper} from "../ToolRoot.js";
import {
  atom,
  RecoilRoot,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable
} from "../../_snowpack/pkg/recoil.js";
const getUserId = (students, name) => {
  for (let userId in students) {
    if (students[userId].firstName + " " + students[userId].lastName == name) {
      return userId;
    }
  }
  return -1;
};
export default function GradebookAssignmentView(props) {
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  let doenetId = props.doenetId;
  let assignmentsTable = {};
  let attempts = useRecoilValueLoadable(attemptData(doenetId));
  let students = useRecoilValueLoadable(studentData);
  let maxAttempts = 0;
  if (attempts.state == "hasValue") {
    for (let userId in attempts.contents) {
      let len = Object.keys(attempts.contents[userId].attempts).length;
      if (len > maxAttempts)
        maxAttempts = len;
    }
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
          let name = row.cell.row.cells[0].value;
          let userId = getUserId(students.contents, name);
          console.log("trying overlay");
          openOverlay({type: "gradebookattemptview", title: "Gradebook Attempt View", doenetId, attemptNumber: i, userId});
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
  if (students.state == "hasValue") {
    for (let userId in students.contents) {
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
  }
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", null), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: assignmentsTable.headers,
    data: assignmentsTable.rows
  }))), /* @__PURE__ */ React.createElement("supportPanel", null));
}
