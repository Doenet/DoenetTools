import React from 'react';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  assignmentData,
  gradeCategories,
  overviewData,
} from '../ToolPanels/Gradebook';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import {
  coursePermissionsAndSettingsByCourseId,
  courseRolePermissionsByCourseIdRoleId,
  peopleByCourseId,
} from '../../../_reactComponents/Course/CourseActions';

export default function GradeDownload() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const download = useRecoilCallback(
    ({ snapshot }) =>
      async (courseId) => {
        const { label } = await snapshot.getPromise(
          coursePermissionsAndSettingsByCourseId(courseId),
        );
        let filename = `${label}.csv`;
        let csvText;
        let assignments = await snapshot.getPromise(assignmentData);
        let overview = await snapshot.getPromise(overviewData);
        const { value: people } = await snapshot.getPromise(
          peopleByCourseId(courseId),
        );

        let studentInfo = {};
        let headingsCSV = 'Name,Email,External Id,Section,Withdrew,';
        let possiblePointsCSV = 'Possible Points,,,,,';
        for (const {
          userId,
          email,
          roleId,
          withdrew,
          externalId,
          section,
          firstName,
          lastName,
        } of people) {
          const { isIncludedInGradebook } = await snapshot.getPromise(
            courseRolePermissionsByCourseIdRoleId({ courseId, roleId }),
          );
          if (isIncludedInGradebook !== '1') continue;

          const studentName = `${firstName} ${lastName}`.replaceAll('"', '""');

          studentInfo[userId] = {
            courseTotal: 0,
            csv: `"${studentName}",${email},${externalId},${section},${
              withdrew === '1' ? 'X' : ''
            },`,
          };
        }

        let courseTotalPossiblePoints = 0;
        let sortedAssignments = Object.entries(assignments);
        sortedAssignments.sort((a, b) =>
          a[1].sortOrder < b[1].sortOrder ? -1 : 1,
        );
        for (let {
          category,
          scaleFactor = 1,
          maximumNumber = Infinity,
          maximumValue = Infinity,
        } of gradeCategories) {
          let allCategoryPossiblePoints = [];

          for (const userId in studentInfo) {
            studentInfo[userId][category] = [];
          }

          for (const [doenetId] of sortedAssignments) {
            let inCategory = assignments[doenetId]?.category;
            if (inCategory.toLowerCase() !== category.toLowerCase()) {
              continue;
            }

            //Make sure label will work with commas and double quotes
            let assignmentLabel = assignments[doenetId]?.label.replaceAll(
              '"',
              '""',
            );
            headingsCSV += `"${assignmentLabel}"` + ',';

            let possiblepoints =
              assignments?.[doenetId]?.totalPointsOrPercent * 1;

            possiblePointsCSV = `${possiblePointsCSV}${possiblepoints},`;
            allCategoryPossiblePoints.push(possiblepoints);

            for (const userId in studentInfo) {
              let credit = overview[userId]?.assignments?.[doenetId];
              if (
                credit === null &&
                assignments?.[doenetId]?.isGloballyAssigned === '0'
              ) {
                studentInfo[userId].csv = `${studentInfo[userId].csv},`;
                continue;
              }
              let score = possiblepoints * credit;
              score = Math.round(score * 100) / 100;
              studentInfo[userId].csv = `${studentInfo[userId].csv}${score},`;
              studentInfo[userId][category].push(score);
            }
          }
          // Sort by points value and retain maximumNumber
          allCategoryPossiblePoints
            .sort((a, b) => b - a)
            .slice(0, maximumNumber);

          //Scale by scaleFactor
          let categoryScaledPoints =
            allCategoryPossiblePoints.reduce((a, b) => a + b, 0) * scaleFactor;

          // Cap value at maximumValue
          let categoryPossiblePoints = Math.min(
            categoryScaledPoints,
            maximumValue,
          );
          courseTotalPossiblePoints += categoryPossiblePoints;

          headingsCSV += `${category} Total,`;
          possiblePointsCSV = `${possiblePointsCSV}${categoryPossiblePoints},`;
          for (const userId in studentInfo) {
            let categoryScores = studentInfo[userId][category];
            // Sort by points value and retain the maximumNumber
            categoryScores = categoryScores
              .sort((a, b) => b - a)
              .slice(0, maximumNumber);

            // Scale by scaleFactor
            let categoryScaledScores =
              categoryScores.reduce((a, c) => a + c, 0) * scaleFactor;

            // Cap value to maximumValue
            let categoryScore = Math.min(categoryScaledScores, maximumValue);
            studentInfo[
              userId
            ].csv = `${studentInfo[userId].csv}${categoryScore},`;
            studentInfo[userId].courseTotal += categoryScore;
          }
        }
        headingsCSV += 'Course Total';
        possiblePointsCSV = `${possiblePointsCSV}${courseTotalPossiblePoints}`;

        csvText = `${headingsCSV}\n${possiblePointsCSV}`;
        for (const userId in studentInfo) {
          csvText = `${csvText}\n${studentInfo[userId].csv}${studentInfo[userId].courseTotal}`;
        }

        var element = document.createElement('a');
        element.setAttribute(
          'href',
          'data:text/plain;charset=utf-8, ' + encodeURIComponent(csvText),
        );
        element.setAttribute('download', filename);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
    [],
  );

  return (
    <div>
      <Button
        value="Download CSV"
        onClick={() => {
          download(courseId);
        }}
      />
    </div>
  );
}
