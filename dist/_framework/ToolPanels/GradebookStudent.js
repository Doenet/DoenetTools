import React from "../../_snowpack/pkg/react.js";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable
} from "../../_snowpack/pkg/recoil.js";
import {coursePermissionsAndSettingsByCourseId} from "../../_reactComponents/Course/CourseActions.js";
import {UTCDateStringToDate} from "../../_utils/dateUtilityFunction.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import {
  Styles,
  Table,
  studentData,
  assignmentData,
  overviewData,
  gradeSorting
} from "./Gradebook.js";
export default function GradebookStudent() {
  let courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let assignments = useRecoilValueLoadable(assignmentData);
  let students = useRecoilValueLoadable(studentData);
  let overview = useRecoilValueLoadable(overviewData);
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  if (course?.canViewCourse == "0") {
    return /* @__PURE__ */ React.createElement("h1", null, "No Access to view this page.");
  }
  let overviewTable = {};
  overviewTable.headers = [
    {
      Header: "Assignment",
      Footer: "Course Total",
      accessor: "assignment",
      disableFilters: true,
      disableSortBy: true
    }
  ];
  overviewTable.rows = [];
  let totalAssignedPoints = 0;
  let totalScore = 0;
  if (assignments.state == "hasValue" && students.state === "hasValue" && overview.state === "hasValue" && userId !== null && userId !== "") {
    let gradeCategories = [
      {category: "Gateway", scaleFactor: 0},
      {category: "Exams"},
      {category: "Quizzes", maximumNumber: 10},
      {category: "Problem sets", maximumNumber: 30},
      {category: "Projects"},
      {category: "Participation"}
    ];
    let totalPossiblePoints = 0;
    for (let {
      category,
      scaleFactor = 1,
      maximumNumber = Infinity
    } of gradeCategories) {
      overviewTable.rows.push({
        assignment: category
      });
      let scores = [];
      let allpossiblepoints = [];
      let allassignedpoints = [];
      let categoryAssignedPointsAreAllDashes = true;
      for (let doenetId in assignments.contents) {
        let inCategory = assignments.contents[doenetId].category;
        if (inCategory?.toLowerCase() !== category.toLowerCase()) {
          continue;
        }
        let assignedpoints = "-";
        let possiblepoints = assignments.contents[doenetId].totalPointsOrPercent * 1;
        let credit = overview.contents[userId].assignments[doenetId];
        if (credit === null && assignments.contents[doenetId].isGloballyAssigned === "0") {
          continue;
        }
        let score = possiblepoints * credit;
        const assignedDate = assignments.contents[doenetId].assignedDate;
        allpossiblepoints.push(possiblepoints);
        scores.push(score);
        score = Math.round(score * 100) / 100;
        let percentage = Math.round(credit * 1e3) / 10 + "%";
        const convertedTZAssignedDate = UTCDateStringToDate(assignedDate);
        if (assignedDate == null || credit > 0 || convertedTZAssignedDate < new Date()) {
          assignedpoints = possiblepoints;
          allassignedpoints.push(possiblepoints);
          categoryAssignedPointsAreAllDashes = false;
        }
        let assignment = /* @__PURE__ */ React.createElement("a", {
          onClick: () => {
            setPageToolView({
              page: "course",
              tool: "gradebookStudentAssignment",
              view: "",
              params: {
                courseId,
                userId,
                doenetId,
                previousCrumb: "student"
              }
            });
          },
          style: {paddingLeft: "15px"}
        }, assignments.contents[doenetId].label);
        overviewTable.rows.push({
          assignment,
          possiblepoints,
          assignedpoints,
          score,
          percentage
        });
      }
      let numberScores = scores.length;
      scores = scores.sort((a, b) => b - a).slice(0, maximumNumber);
      let categoryScore = scores.reduce((a, c) => a + c, 0) * scaleFactor;
      let categoryAssignedPoints = allassignedpoints.reduce((a, c) => a + c, 0) * scaleFactor;
      if (categoryAssignedPointsAreAllDashes) {
        categoryAssignedPoints = "-";
      }
      allpossiblepoints = allpossiblepoints.sort((a, b) => b - a).slice(0, maximumNumber);
      let categoryPossiblePoints = allpossiblepoints.reduce((a, c) => a + c, 0) * scaleFactor;
      let categoryPercentage = "0%";
      if (categoryPossiblePoints !== 0) {
        categoryPercentage = Math.round(categoryScore / categoryPossiblePoints * 1e3) / 10 + "%";
      }
      totalScore += categoryScore;
      totalPossiblePoints += categoryPossiblePoints;
      if (categoryAssignedPoints != "-") {
        totalAssignedPoints += categoryAssignedPoints;
        categoryAssignedPoints = Math.round(categoryAssignedPoints * 100) / 100;
      }
      categoryScore = Math.round(categoryScore * 100) / 100;
      categoryPossiblePoints = Math.round(categoryPossiblePoints * 100) / 100;
      let description = "";
      if (numberScores > maximumNumber) {
        description = /* @__PURE__ */ React.createElement("div", {
          style: {fontSize: ".8em"}
        }, "(Based on top ", maximumNumber, " scores)");
      }
      if (scaleFactor !== 1) {
        description = /* @__PURE__ */ React.createElement("div", {
          style: {fontSize: ".8em"}
        }, "(Based on rescaling by ", scaleFactor * 100, "%)");
      }
      overviewTable.rows.push({
        assignment: /* @__PURE__ */ React.createElement("b", null, `Subtotal for ${category}`, description),
        score: categoryScore,
        possiblepoints: categoryPossiblePoints,
        assignedpoints: categoryAssignedPoints,
        percentage: categoryPercentage
      });
    }
    let totalPercentage = Math.round(totalScore / totalPossiblePoints * 1e3) / 10 + "%";
    totalScore = Math.round(totalScore * 100) / 100;
    totalPossiblePoints = Math.round(totalPossiblePoints * 100) / 100;
    totalAssignedPoints = Math.round(totalAssignedPoints * 100) / 100;
    overviewTable.headers.push({
      Header: "Possible Points",
      Footer: totalPossiblePoints,
      accessor: "possiblepoints",
      disableFilters: true,
      disableSortBy: true
    }, {
      Header: "Assigned Points",
      Footer: totalAssignedPoints,
      accessor: "assignedpoints",
      disableFilters: true,
      disableSortBy: true
    }, {
      Header: "Score",
      Footer: totalScore,
      accessor: "score",
      disableFilters: true,
      disableSortBy: true
    }, {
      Header: "Percentage",
      Footer: totalPercentage,
      accessor: "percentage",
      disableFilters: true,
      disableSortBy: true
    });
  }
  let studentName = `${students.contents[userId]?.firstName} ${students.contents[userId]?.lastName}`;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "18px"}
  }, /* @__PURE__ */ React.createElement("b", null, "Gradebook for ", studentName)), /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "18px"}
  }, /* @__PURE__ */ React.createElement("b", null, "Current Score ", totalScore, "/", totalAssignedPoints)), /* @__PURE__ */ React.createElement(Styles, null, /* @__PURE__ */ React.createElement(Table, {
    disableSortBy: true,
    columns: overviewTable.headers,
    data: overviewTable.rows
  })));
}
