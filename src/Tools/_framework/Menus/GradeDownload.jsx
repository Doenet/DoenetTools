import React from 'react';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useRecoilCallback } from 'recoil';
import { fetchDrivesQuery } from '../../../_reactComponents/Drive/NewDrive';
import { searchParamAtomFamily } from '../NewToolRoot';
import { assignmentData, studentData } from '../ToolPanels/Gradebook';


export default function GradeDownload(){

  // function download() {
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


    // console.log(">>>>students",students)
    console.log(">>>>assignments",assignments)
    // console.log(">>>>csvText",csvText)


    // var element = document.createElement('a');
    // element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(csvText));
    // element.setAttribute('download', filename);
    // document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);
})

  return <div>
    <Button value='Download CSV' onClick={()=>{ download() }} />
  </div>
}