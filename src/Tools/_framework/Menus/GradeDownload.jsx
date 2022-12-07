import React, { useRecoilCallback } from 'react';
import axios from 'axios';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  assignmentData,
  gradeCategories,
  overviewData,
  studentData,
} from '../ToolPanels/Gradebook';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useRecoilValue } from 'recoil';
import {
  coursePermissionsAndSettingsByCourseId,
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
        let students = await snapshot.getPromise(studentData); //Need more id data
        let overview = await snapshot.getPromise(overviewData);

        let { data } = await axios.get('/api/getEnrollment.php', {
          params: { courseId },
        });
        const { value: people } = await snapshot.getPromise(
          peopleByCourseId(courseId),
        );

        let studentInfo = {};
        let headingsCSV = 'Name,Email,Student ID,Section,Withdrew,';
        let possiblePointsCSV = 'Possible Points,,,,,';
        for (const userId in students) {
          if (students[userId].role !== 'Student') {
            continue;
          }
          let email = '';
          let studentId = '';
          let section = '';
          let withdrew = '';
          for (const enrollment of people) {
            if (enrollment.userId === userId) {
              email = enrollment.email;
              studentId = enrollment.empId;
              section = enrollment.section;
              if (enrollment.withdrew === '1') {
                withdrew = 'X';
              }
              break;
            }
          }

          let studentName =
            `${students[userId].firstName} ${students[userId].lastName}`.replaceAll(
              '"',
              '""',
            );

          studentInfo[userId] = {
            courseTotal: 0,
            csv: `"${studentName}",${email},${studentId},${section},${withdrew},`,
          };
        }
        let courseTotalPossiblePoints = 0;

        for (let {
          category,
          scaleFactor = 1,
          maximumNumber = Infinity,
        } of gradeCategories) {
          let categoryTotalPossiblePoints = 0;

          for (const userId in students) {
            if (students[userId].role !== 'Student') {
              continue;
            }

            studentInfo[userId][category] = {
              categoryTotal: 0,
            };
          }

          for (let doenetId in assignments) {
            let inCategory = assignments[doenetId]?.category;
            if (inCategory.toLowerCase() !== category.toLowerCase()) {
              continue;
            }

            let possiblepoints =
              assignments?.[doenetId]?.totalPointsOrPercent * 1;
            possiblePointsCSV = `${possiblePointsCSV}${possiblepoints},`;
            categoryTotalPossiblePoints += possiblepoints;

            //Make sure label will work with commas and double quotes
            let assignmentLabel = assignments[doenetId]?.label.replaceAll(
              '"',
              '""',
            );
            headingsCSV += `"${assignmentLabel}"` + ',';

            for (const userId in students) {
              if (students[userId].role !== 'Student') {
                continue;
              }
              let credit = overview[userId]?.assignments?.[doenetId];
              let score = possiblepoints * credit;
              score = Math.round(score * 100) / 100;
              studentInfo[userId].csv = `${studentInfo[userId].csv}${score},`;
              studentInfo[userId][category].categoryTotal += score;
            }
          }
          courseTotalPossiblePoints += categoryTotalPossiblePoints;
          headingsCSV += `${category} Total,`;
          possiblePointsCSV = `${possiblePointsCSV}${categoryTotalPossiblePoints},`;
          for (const userId in students) {
            if (students[userId].role !== 'Student') {
              continue;
            }
            let catTotal = studentInfo[userId][category].categoryTotal;
            studentInfo[userId].csv = `${studentInfo[userId].csv}${catTotal},`;
            studentInfo[userId].courseTotal += catTotal;
          }
        }
        headingsCSV += 'Course Total';
        possiblePointsCSV = `${possiblePointsCSV}${courseTotalPossiblePoints}`;

        csvText = `${headingsCSV}\n${possiblePointsCSV}`;
        for (const userId in students) {
          if (students[userId].role !== 'Student') {
            continue;
          }
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
