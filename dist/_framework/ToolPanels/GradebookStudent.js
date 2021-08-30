import React from "../../_snowpack/pkg/react.js";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {Styles, Table, studentData, assignmentData, overViewData, gradeSorting} from "./Gradebook.js";
export default function GradebookStudent(props) {
  let driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  console.log(">>> driveId: ", driveId);
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  console.log(">>> USERID: ", userId);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let overviewTable = {};
  overviewTable.headers = [{
    Header: "Name",
    accessor: "name"
  }];
  let assignments = useRecoilValueLoadable(assignmentData);
  if (assignments.state == "hasValue") {
    for (let doenetId in assignments.contents) {
      overviewTable.headers.push({
        Header: /* @__PURE__ */ React.createElement("a", {
          onClick: (e) => {
            e.stopPropagation();
            setPageToolView({
              page: "course",
              tool: "gradebookStudentAssignment",
              view: "",
              params: {driveId, userId, doenetId, source: "student"}
            });
          }
        }, assignments.contents[doenetId]),
        accessor: doenetId,
        disableFilters: true
      });
    }
  }
  overviewTable.headers.push({
    Header: "Weighted Credt",
    accessor: "weight",
    disableFilters: true
  });
  overviewTable.headers.push({
    Header: "Grade",
    accessor: "grade",
    sortType: gradeSorting,
    disableFilters: true
  });
  overviewTable.rows = [];
  let students = useRecoilValueLoadable(studentData);
  let overView = useRecoilValueLoadable(overViewData);
  if (students.state === "hasValue" && userId !== null && userId !== "") {
    let firstName = students.contents[userId].firstName, lastName = students.contents[userId].lastName, credit = students.contents[userId].courseCredit, generatedGrade = students.contents[userId].courseGrade, overrideGrade = students.contents[userId].overrideCourseGrade;
    let grade = overrideGrade ? overrideGrade : generatedGrade;
    let row = {};
    row["name"] = firstName + " " + lastName;
    if (overView.state == "hasValue" && assignments.state == "hasValue") {
      for (let doenetId in assignments.contents) {
        row[doenetId] = overView.contents[userId].assignments[doenetId] * 100 + "%";
      }
    }
    row["weight"] = credit;
    row["grade"] = grade;
    overviewTable.rows.push(row);
  }
  return /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    columns: overviewTable.headers,
    data: overviewTable.rows
  }));
}
