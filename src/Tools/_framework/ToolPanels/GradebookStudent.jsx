import React from "react";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import { coursePermissionsAndSettingsByCourseId } from "../../../_reactComponents/Course/CourseActions";
import { UTCDateStringToDate } from "../../../_utils/dateUtilityFunction";

import { pageToolViewAtom, searchParamAtomFamily } from "../NewToolRoot";
import {
  Styles,
  Table,
  studentData,
  assignmentData,
  overviewData,
  gradeSorting,
  gradeCategories,
} from "./Gradebook";

export default function GradebookStudent() {
  //const { openOverlay, activateMenuPanel } = useToolControlHelper();
  let courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let assignments = useRecoilValueLoadable(assignmentData);
  let students = useRecoilValueLoadable(studentData);
  let overview = useRecoilValueLoadable(overviewData);
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

  if (course?.canViewCourse == "0") {
    return <h1>No Access to view this page.</h1>;
  }

  let overviewTable = {};

  overviewTable.headers = [
    {
      Header: "Assignment",
      Footer: "Course Total",
      accessor: "assignment",
      disableFilters: true,
      disableSortBy: true,
    },
  ];

  overviewTable.rows = [];
  let totalAssignedPoints = 0;
  let totalScore = 0;

  if (
    assignments.state == "hasValue" &&
    students.state === "hasValue" &&
    overview.state === "hasValue" &&
    userId !== null &&
    userId !== ""
  ) {
    let totalPossiblePoints = 0;
    let sortedAssignments = Object.entries(assignments.contents);
    sortedAssignments.sort((a, b) =>
      a[1].sortOrder < b[1].sortOrder ? -1 : 1,
    );

    for (let {
      category,
      scaleFactor = 1,
      maximumNumber = Infinity,
      maximumValue = Infinity,
    } of gradeCategories) {
      // let c = <b>{assignment?.category}</b>;

      overviewTable.rows.push({
        // c
        assignment: category,
      });
      let scores = [];
      let allpossiblepoints = [];
      let allassignedpoints = [];
      let categoryAssignedPointsAreAllDashes = true;

      for (let [doenetId] of sortedAssignments) {
        let inCategory = assignments.contents[doenetId].category;
        if (inCategory?.toLowerCase() !== category.toLowerCase()) {
          continue;
        }

        let assignedpoints = "-";
        let possiblepoints =
          assignments.contents[doenetId].totalPointsOrPercent * 1;
        let credit = overview.contents[userId].assignments[doenetId];
        if (
          credit === null &&
          assignments.contents[doenetId].isGloballyAssigned === "0"
        ) {
          continue;
        }
        let score = possiblepoints * credit;
        const assignedDate = assignments.contents[doenetId].assignedDate;
        allpossiblepoints.push(possiblepoints);
        scores.push(score);

        score = Math.round(score * 100) / 100;
        let percentage = Math.round(credit * 1000) / 10 + "%";

        const convertedTZAssignedDate = UTCDateStringToDate(assignedDate);

        if (
          assignedDate == null || //No assignment date
          // credit != null || //has taken the activity
          credit > 0 || //positive credit for the activity
          convertedTZAssignedDate < new Date() //AssignedDate has past
        ) {
          assignedpoints = possiblepoints;
          allassignedpoints.push(possiblepoints);
          categoryAssignedPointsAreAllDashes = false;
        }

        let assignment = (
          <a
            onClick={() => {
              // e.stopPropagation()
              setPageToolView({
                page: "course",
                tool: "gradebookStudentAssignment",
                view: "",
                params: {
                  courseId,
                  userId,
                  doenetId,
                  previousCrumb: "student",
                },
              });
            }}
            style={{ paddingLeft: "15px" }}
          >
            {assignments.contents[doenetId].label}
          </a>
        );

        overviewTable.rows.push({
          assignment,
          possiblepoints,
          assignedpoints,
          score,
          percentage,
        });
      }

      let numberScores = scores.length;

      //Sort scores by points value and retain the maximumNumber
      scores = scores.sort((a, b) => b - a).slice(0, maximumNumber);

      //Sort assigned points by points value and retain the maximumNumber
      allassignedpoints = allassignedpoints
        .sort((a, b) => b - a)
        .slice(0, maximumNumber);

      //Scale by scareFactor
      let scaledScore = scores.reduce((a, c) => a + c, 0) * scaleFactor;
      let scaledAssignedPoints =
        allassignedpoints.reduce((a, c) => a + c, 0) * scaleFactor;

      //cap value to maximumValue
      let categoryScore = Math.min(scaledScore, maximumValue);
      let categoryAssignedPoints = Math.min(scaledAssignedPoints, maximumValue);

      if (categoryAssignedPointsAreAllDashes) {
        categoryAssignedPoints = "-";
      }

      //Sort by points value and retain the maximumNumber
      allpossiblepoints = allpossiblepoints
        .sort((a, b) => b - a)
        .slice(0, maximumNumber);

      //Scale by scareFactor
      let scaledPossiblePoints =
        allpossiblepoints.reduce((a, c) => a + c, 0) * scaleFactor;

      //cap value to maximumValue
      let categoryPossiblePoints = Math.min(scaledPossiblePoints, maximumValue);

      let categoryPercentage = "0%";

      if (categoryPossiblePoints !== 0) {
        categoryPercentage =
          Math.round((categoryScore / categoryPossiblePoints) * 1000) / 10 +
          "%";
      }
      totalScore += categoryScore;
      totalPossiblePoints += categoryPossiblePoints;
      if (categoryAssignedPoints != "-") {
        totalAssignedPoints += categoryAssignedPoints;
        categoryAssignedPoints = Math.round(categoryAssignedPoints * 100) / 100;
      }

      categoryScore = Math.round(categoryScore * 100) / 100;
      categoryPossiblePoints = Math.round(categoryPossiblePoints * 100) / 100;

      let description = [];
      if (numberScores > maximumNumber) {
        description.push(`top ${maximumNumber} scores`);
      }
      if (scaleFactor !== 1) {
        description.push(`rescaling by ${scaleFactor * 100}%`);
      }
      if (scaledPossiblePoints > maximumValue) {
        description.push(`a cap of ${maximumValue} points`);
      }

      overviewTable.rows.push({
        // assignment:"Subtotal for ${category} Description ",
        assignment: (
          <b>
            {`Subtotal for ${category}`}
            {description.length > 0 && (
              <div style={{ fontSize: ".7em" }}>
                Based on {description.join(",")}
              </div>
            )}
          </b>
        ),
        score: categoryScore,
        possiblepoints: categoryPossiblePoints,
        assignedpoints: categoryAssignedPoints,
        percentage: categoryPercentage,
      });
    }
    let totalPercentage =
      Math.round((totalScore / totalPossiblePoints) * 1000) / 10 + "%";

    totalScore = Math.round(totalScore * 100) / 100;
    totalPossiblePoints = Math.round(totalPossiblePoints * 100) / 100;
    totalAssignedPoints = Math.round(totalAssignedPoints * 100) / 100;

    overviewTable.headers.push(
      {
        Header: "Possible Points",
        Footer: totalPossiblePoints,
        accessor: "possiblepoints",
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: "Assigned Points",
        Footer: totalAssignedPoints,
        accessor: "assignedpoints",
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: "Score",
        Footer: totalScore,
        accessor: "score",
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: "Percentage",
        Footer: totalPercentage,
        accessor: "percentage",
        disableFilters: true,
        disableSortBy: true,
      },
    );
  }

  let studentName = `${students.contents[userId]?.firstName} ${students.contents[userId]?.lastName}`;
  const section = students.contents[userId]?.section;

  return (
    <>
      <div style={{ marginLeft: "18px" }}>
        <b>Gradebook for {studentName}</b>
      </div>
      <div style={{ marginLeft: "18px" }}>
        <b>Section {section}</b>
      </div>
      <div style={{ marginLeft: "18px" }}>
        <b>
          Current Score {totalScore}/{totalAssignedPoints}
        </b>
      </div>
      <Styles>
        <Table
          disableSortBy={true}
          columns={overviewTable.headers}
          data={overviewTable.rows}
        />
      </Styles>
    </>
  );
}
