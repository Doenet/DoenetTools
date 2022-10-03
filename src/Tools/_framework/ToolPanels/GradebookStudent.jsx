import React from 'react';
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import { UTCDateStringToDate } from '../../../_utils/dateUtilityFunction';

import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import {
  Styles,
  Table,
  studentData,
  assignmentData,
  overViewData,
  gradeSorting,
} from './Gradebook';

export default function GradebookStudent() {
  //const { openOverlay, activateMenuPanel } = useToolControlHelper();
  let courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  let userId = useRecoilValue(searchParamAtomFamily('userId'));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let assignments = useRecoilValueLoadable(assignmentData);
  let students = useRecoilValueLoadable(studentData);
  let overView = useRecoilValueLoadable(overViewData);

  let overviewTable = {};

  overviewTable.headers = [
    {
      Header: 'Assignment',
      Footer: 'Course Total',
      accessor: 'assignment',
      disableFilters: true,
      disableSortBy: true,
    },
  ];

  overviewTable.rows = [];
  let totalAssignedPoints = 0;
  let totalScore = 0;


  if (
    assignments.state == 'hasValue' &&
    students.state === 'hasValue' &&
    overView.state === 'hasValue' &&
    userId !== null &&
    userId !== ''
  ) {
    let gradeCategories = [
      { category: 'Gateway', scaleFactor: 0 },
      { category: 'Exams' },
      { category: 'Quizzes', maximumNumber: 10 },
      { category: 'Problem sets', maximumNumber: 30 },
      { category: 'Projects' },
      { category: 'Participation' },
    ];

    let totalPossiblePoints = 0;

    for (let {
      category,
      scaleFactor = 1,
      maximumNumber = Infinity,
    } of gradeCategories) {
      // let c = <b>{assignment?.category}</b>;

      overviewTable.rows.push({
        // c
        assignment: category,
      });
      let scores = [];
      let allpossiblepoints = [];
      let allassignedpoints = [];
      let earnedallassignedpoints = [];
      let categoryAssignedPointsAreAllDashes = true;

      for (let doenetId in assignments.contents) {
        let inCategory = assignments.contents[doenetId].category;
        if (inCategory?.toLowerCase() !== category.toLowerCase()) {
          continue;
        }

        let assignedpoints = '-';
        let possiblepoints =
          assignments.contents[doenetId].totalPointsOrPercent * 1;
        let credit = overView.contents[userId].assignments[doenetId];
        let score = possiblepoints * credit;
        const assignedDate = assignments.contents[doenetId].assignedDate;
        allpossiblepoints.push(possiblepoints);
        scores.push(score);
        
        score = Math.round(score * 100) / 100;
        let percentage = Math.round(credit * 1000) / 10 + '%';

        const convertedTZAssignedDate = UTCDateStringToDate(assignedDate)

        if (assignedDate == null || //No assignment date
        // credit != null || //has taken the activity
        credit > 0 || //positive credit for the activity
        convertedTZAssignedDate < new Date() //AssignedDate has past
        ){
          assignedpoints = possiblepoints;
          allassignedpoints.push(possiblepoints)
          earnedallassignedpoints.push(score)
          categoryAssignedPointsAreAllDashes = false;
        }

        let assignment = (
          <a
            onClick={() => {
              // e.stopPropagation()
              setPageToolView({
                page: 'course',
                tool: 'gradebookStudentAssignment',
                view: '',
                params: {
                  courseId,
                  userId,
                  doenetId,
                  previousCrumb: 'student',
                },
              });
            }}
            style={{ paddingLeft: '15px' }}
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
      scores = scores.sort((a, b) => b - a).slice(0, maximumNumber);
      let categoryScore = scores.reduce((a, c) => a + c, 0) * scaleFactor;
      let categoryAssignedPoints = allassignedpoints.reduce((a, c) => a + c, 0) * scaleFactor;
      if (categoryAssignedPointsAreAllDashes){categoryAssignedPoints = '-'}


      allpossiblepoints = allpossiblepoints
        .sort((a, b) => b - a)
        .slice(0, maximumNumber);
      let categoryPossiblePoints =
        allpossiblepoints.reduce((a, c) => a + c, 0) * scaleFactor;

      let categoryPercentage = '0%';

      if (categoryPossiblePoints !== 0) {
        categoryPercentage =
          Math.round((categoryScore / categoryPossiblePoints) * 1000) / 10 +
          '%';
      }
      totalScore += categoryScore;
      totalPossiblePoints += categoryPossiblePoints;
      if (categoryAssignedPoints != '-'){
        totalAssignedPoints += categoryAssignedPoints;
      }

      categoryScore = Math.round(categoryScore * 100) / 100;
      categoryPossiblePoints = Math.round(categoryPossiblePoints * 100) / 100;

      let description = '';
      if (numberScores > maximumNumber) {
        description = (
          <div style={{ fontSize: '.8em' }}>
            (Based on top {maximumNumber} scores)
          </div>
        );
      }
      if (scaleFactor !== 1) {
        description = (
          <div style={{ fontSize: '.8em' }}>
            (Based on rescaling by {scaleFactor * 100}%)
          </div>
        );
      }
      overviewTable.rows.push({
        // assignment:"Subtotal for ${category} Description ",
        assignment: (
          <b>
            {`Subtotal for ${category}`}
            {description}
          </b>
        ),
        score: categoryScore,
        possiblepoints: categoryPossiblePoints,
        assignedpoints: categoryAssignedPoints,
        percentage: categoryPercentage,
      });
    }
    let totalPercentage =
      Math.round((totalScore / totalPossiblePoints) * 1000) / 10 + '%';

    totalScore = Math.round(totalScore * 100) / 100;
    totalPossiblePoints = Math.round(totalPossiblePoints * 100) / 100;

    overviewTable.headers.push(
      {
        Header: 'Possible Points',
        Footer: totalPossiblePoints,
        accessor: 'possiblepoints',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Assigned Points',
        Footer: totalAssignedPoints,
        accessor: 'assignedpoints',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Score',
        Footer: totalScore,
        accessor: 'score',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Percentage',
        Footer: totalPercentage,
        accessor: 'percentage',
        disableFilters: true,
        disableSortBy: true,
      },
    );
  }

  let studentName = `${students.contents[userId]?.firstName} ${students.contents[userId]?.lastName}`;

  return (
    <>
      <div style={{ marginLeft: '18px' }}>
        <b>Gradebook for {studentName}</b>
      </div>
      <div style={{ marginLeft: '18px' }}>
        <b>Current Score {totalScore}/{totalAssignedPoints}</b>
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
