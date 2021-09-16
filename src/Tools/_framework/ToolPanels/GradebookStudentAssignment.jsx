import React, { useState, useEffect } from "react";
import { Styles, Table, studentData, attemptData, driveId } from "./Gradebook"

import {
    useSetRecoilState,
    useRecoilValue,
    useRecoilValueLoadable,
  } from "recoil";
 
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import DoenetViewer, {
    serializedComponentsReviver,
  } from '../../../Viewer/DoenetViewer';
import  axios from 'axios';
import { currentAttemptNumber } from '../ToolPanels/AssignmentViewer';

// import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb';
// import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';

const getUserId = (students, name) => {
    for(let userId in students){
        //console.log(userId, students[userId].firstName);
        
        if(students[userId].firstName + " " + students[userId].lastName == name){
          return userId;
        }
      }
    return -1;
} 
export default function GradebookStudentAssignmentView(props){
    // const setPageToolView = useSetRecoilState(pageToolViewAtom);
    // let source = useRecoilValue(searchParamAtomFamily('source'))
    let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
    let userId = useRecoilValue(searchParamAtomFamily('userId'))
    let attempts = useRecoilValueLoadable(attemptData(doenetId))
    let students = useRecoilValueLoadable(studentData)
    const setRecoilAttemptNumber = useSetRecoilState(currentAttemptNumber);
    
    // console.log(">>>>attempts",Object.keys(attempts.contents[userId].attempts).length)
    // let driveIdValue = useRecoilValue(driveId)
    // let [attemptNumber,setAttemptNumber] = useState(1); //Start with attempt 1
    const attemptsObj =  attempts?.contents?.[userId]?.attempts;
    // Object.keys(attempts?.contents?.[userId]?.attempts).length;
    let [attemptNumber,setAttemptNumber] = useState(null);
    let [attemptsInfo,setAttemptsInfo] = useState(null); //array of {contentId,variant}
    let assignmentsTable = {}
    let maxAttempts = 0;

    useEffect(()=>{
        if (attemptsObj){
            setAttemptNumber(Object.keys(attemptsObj).length);
            setRecoilAttemptNumber(Object.keys(attemptsObj).length);
        }
    },[attemptsObj,setAttemptNumber,setRecoilAttemptNumber])

    //Wait for doenetId and userId and attemptsInfo
    if (!doenetId || !userId){
        return null;
    }

    async function loadAssignmentInfo(doenetId,userId){
        
        const { data } = await axios.get(`/api/getGradebookAssignmentAttempts.php`,{params:{doenetId,userId}})
        let dataAttemptInfo = [];
        let contentIdToDoenetML = {}; //Don't request from server more than once
        let solutionDisplayMode = 'none';
        if(data.showSolutionInGradebook === '1') {
            solutionDisplayMode = 'button';
        }

        for (let attempt of data.attemptInfo){
            let gvariant = JSON.parse(attempt.variant, serializedComponentsReviver);
            let doenetML = contentIdToDoenetML[attempt.contentId];

            if (doenetML){
                dataAttemptInfo.push({
                    contentId:attempt.contentId,
                    variant:{name:gvariant.name},
                    doenetML,
                    solutionDisplayMode
                    })
            }else{
                const { data } = await axios.get(`/media/${attempt.contentId}.doenet`); 
                contentIdToDoenetML[attempt.contentId] = data;
                dataAttemptInfo.push({
                    contentId:attempt.contentId,
                    variant:{name:gvariant.name},
                    doenetML: data,
                    solutionDisplayMode
                    })
            }
            

        }
        setAttemptsInfo(dataAttemptInfo);
    }

    if (attemptsInfo === null){
        loadAssignmentInfo(doenetId,userId)
        return null;
    }



    //attempts.state == 'hasValue' ? console.log(attempts.contents): console.log(attempts.state)
    if(attempts.state == 'hasValue' && userId !== null && userId !== ''){
        let len = Object.keys(attempts.contents[userId].attempts).length;
        maxAttempts = len;
    }

    assignmentsTable.headers = [
        {
            Header: "Student",
            accessor: "student",
        }
    ];

    for (let i = 1; i <= maxAttempts; i++) {
        assignmentsTable.headers.push(
        {
            Header: "Attempt " + i,
            accessor: "a"+i,
            disableFilters: true,
            Cell: row  =><a onClick = {(e) =>{
                setAttemptNumber(i);
                setRecoilAttemptNumber(i);
                //e.stopPropagation()

                // setPageToolView({
                //     page: 'course',
                //     tool: 'gradebookAttempt',
                //     view: '',
                //     params: { driveId: driveIdValue, doenetId, userId, attemptNumber: i, source},
                // })
            }}> {row.value} </a>
        })
    }

    assignmentsTable.headers.push({
        Header: "Assignment Grade",
        accessor: "grade",
        disableFilters: true
    })

    assignmentsTable.rows = [];
    
    if(students.state == 'hasValue' && userId !== null && userId !== ''){
        let firstName = students.contents[userId].firstName;
        let lastName = students.contents[userId].lastName;
        
        let row = {};

        row["student"] = firstName + " " + lastName

        if(attempts.state == 'hasValue'){
            for (let i = 1; i <= maxAttempts; i++) {
                let attemptCredit = attempts.contents[userId].attempts[i];
    
                // row[("a"+i)] = attemptCredit ? attemptCredit * 100 + "%" : ""
                row[("a"+i)] = attemptCredit ? Math.round(attemptCredit * 1000)/10 + '%' : ""
                
                // <Link to={`/attempt/?doenetId=${doenetId}&userId=${userId}&attemptNumber=${i}`}>
                // {
                //     attemptCredit ? attemptCredit * 100 + "%" : "" // if attemptCredit is `undefined`, we still want a table cell so that the footer column still shows up right.
                // }
                // </Link>
            }

            // row["grade"] = attempts.contents[userId].credit ? attempts.contents[userId].credit*100+ "%" : ""
            row["grade"] = attempts.contents[userId].credit ? Math.round(attempts.contents[userId].credit * 1000)/10 + '%' : ""
        }

        
        
        assignmentsTable.rows.push(row);
    }



    let dViewer = null;
    if (attemptNumber > 0){
        // let contentId = attemptsInfo[attemptNumber-1].contentId
        let variant = attemptsInfo[attemptNumber-1].variant;
        let doenetML = attemptsInfo[attemptNumber-1].doenetML;
        let solutionDisplayMode = attemptsInfo[attemptNumber-1].solutionDisplayMode;
  
        dViewer = <DoenetViewer
        key={`doenetviewer${doenetId}`}
        doenetML={doenetML}
        doenetId={doenetId}
        userId={userId}

        flags={{
          showCorrectness: true,
          readOnly: true,
          solutionDisplayMode,
          showFeedback: true,
          showHints: true,
          isAssignment: true,
        }}
        attemptNumber={attemptNumber}
        allowLoadPageState={true}
        allowSavePageState={false}
        allowLocalPageState={false} //Still working out localStorage kinks
        allowSaveSubmissions={false}
        allowSaveEvents={false}
      //   requestedVariant={requestedVariant}
        requestedVariant={variant}
      //   updateCreditAchievedCallback={updateCreditAchieved}
        // generatedVariantCallback={variantCallback}
      />
    }
    

    return(
        <>
        <Styles>
            <Table columns = {assignmentsTable.headers} data = {assignmentsTable.rows}/>
        </Styles>
        {attemptNumber > 0 ? 
        <>
        <div style={{paddingLeft:"8px"}}>
            Viewing Attempt Number {attemptNumber}
        </div>
        {dViewer}
        </>
          : <div>Click an attempt&apos;s grade to see your attempt</div>  }
        </>
    )

}
