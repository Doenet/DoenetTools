import React from 'react';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useRecoilCallback } from 'recoil';
import { fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';
import { assignmentData, overViewData, studentData } from '../ToolPanels/Gradebook';
import axios from 'axios';


export default function GradeDownload(){

    const download = useRecoilCallback(({snapshot})=> async ()=>{

      const driveId = await snapshot.getPromise(searchParamAtomFamily('driveId'))

    let driveInfo = await snapshot.getPromise(fetchDrivesQuery);
    let driveLabel;
    for (let info of driveInfo.driveIdsAndLabels){
      if (info.driveId === driveId){
        driveLabel = info.label;
        break;
      }
    }

    let filename = `${driveLabel}.csv`
    let csvText;
    let gradeCategories = [
      {category:'Gateway',
      scaleFactor:0},
      {category:'Exams'},
      {category:'Quizzes',
      maximumNumber:10},
      {category:'Problem sets',
      maximumNumber:30},
      {category:'Projects'},
      {category:'Participation'}
  ];
    let assignments = await snapshot.getPromise(assignmentData);
    let students = await snapshot.getPromise(studentData); //Need more id data
    let overview = await snapshot.getPromise(overViewData);

    let { data } = await axios.get('/api/getEnrollment.php', { params: { driveId } })
    let enrollmentArray = data.enrollmentArray;

    let studentInfo = {}
    let headingsCSV = "Name,Email,Student ID,Section,Withdrew,"
    let possiblePointsCSV = "Possible Points,,,,,"
    for (const userId in students){
      if (students[userId].role !== 'Student'){ continue; }
      let email = "";
      let studentId = "";
      let section = "";
      let withdrew = "";
      for (const enrollment of enrollmentArray){
   
        if (enrollment.userId === userId){
          email = enrollment.email;
          studentId = enrollment.empId;
          section = enrollment.section;
          if (enrollment.withdrew === "1"){
            withdrew = 'X';
          }
          break;
        }
      }

      studentInfo[userId] = {
        courseTotal: 0,
        csv:`${students[userId].firstName} ${students[userId].lastName},${email},${studentId},${section},${withdrew},`
      }
    }
    let courseTotalPossiblePoints = 0;


    for (let {category,scaleFactor=1,maximumNumber=Infinity} of gradeCategories){

      let categoryTotalPossiblePoints = 0;

      for (const userId in students){
      if (students[userId].role !== 'Student'){ continue; }

        studentInfo[userId][category] = {
          categoryTotal: 0
        }
      }
            
      
            for(let doenetId in assignments){
    
                let inCategory = assignments[doenetId]?.category;
                if (inCategory.toLowerCase() !== category.toLowerCase()){ continue;}
    
                let possiblepoints = assignments?.[doenetId]?.totalPointsOrPercent * 1;
                possiblePointsCSV = `${possiblePointsCSV}${possiblepoints},`
                categoryTotalPossiblePoints += possiblepoints;

                let assignmentLabel = assignments[doenetId]?.label
                headingsCSV += assignmentLabel + ','

              for (const userId in students){
                if (students[userId].role !== 'Student'){ continue; }
                let credit = overview[userId]?.assignments?.[doenetId];
                let score = possiblepoints * credit;
                score = Math.round(score*100)/100;
                studentInfo[userId].csv = `${studentInfo[userId].csv}${score},`
                studentInfo[userId][category].categoryTotal += score;

              }

            }
            courseTotalPossiblePoints += categoryTotalPossiblePoints;
            headingsCSV += `${category} Total,`
            possiblePointsCSV = `${possiblePointsCSV}${categoryTotalPossiblePoints},`
            for (const userId in students){
              if (students[userId].role !== 'Student'){ continue; }
              let catTotal = studentInfo[userId][category].categoryTotal;
              studentInfo[userId].csv = `${studentInfo[userId].csv}${catTotal},`
              studentInfo[userId].courseTotal += catTotal
            }

    }
    headingsCSV += 'Course Total'
    possiblePointsCSV = `${possiblePointsCSV}${courseTotalPossiblePoints}`

    csvText = `${headingsCSV}\n${possiblePointsCSV}`
    for (const userId in students){
      if (students[userId].role !== 'Student'){ continue; }
      csvText = `${csvText}\n${studentInfo[userId].csv}${studentInfo[userId].courseTotal}`
      }

    var element = document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(csvText));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
})

  return <div>
    <Button value='Download CSV' onClick={()=>{ download() }} />
  </div>
}