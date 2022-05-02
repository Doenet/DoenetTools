import React, { useState, useEffect } from "react";
import { Styles, Table, studentData, attemptData, assignmentData } from "./Gradebook"

import {
    useSetRecoilState,
    useRecoilValue,
    useRecoilValueLoadable,
  } from "recoil";
 
import { pageToolViewAtom, searchParamAtomFamily, suppressMenusAtom } from '../NewToolRoot';
import DoenetViewer from '../../../Tools/_framework/ToolPanels/AssignmentViewer';
import { serializedComponentsReviver } from "../../../Core/utils/serializedStateProcessing";
import  axios from 'axios';
import { currentAttemptNumber } from '../ToolPanels/AssignmentViewer';
import { effectiveRoleAtom } from "../../../_reactComponents/PanelHeaderComponents/RoleDropdown";

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
export default function GradebookStudentAssignmentView(){
    const setPageToolView = useSetRecoilState(pageToolViewAtom);
    let source = useRecoilValue(searchParamAtomFamily('source'))
    let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
    let userId = useRecoilValue(searchParamAtomFamily('userId'))
    let driveIdValue = useRecoilValue(searchParamAtomFamily('driveId'))
    let paramAttemptNumber = useRecoilValue(searchParamAtomFamily('attemptNumber'))
    let attempts = useRecoilValueLoadable(attemptData(doenetId))
    let students = useRecoilValueLoadable(studentData)
    const setRecoilAttemptNumber = useSetRecoilState(currentAttemptNumber);
    let assignments = useRecoilValueLoadable(assignmentData);
    let effectiveRole = useRecoilValue(effectiveRoleAtom);
    const setSuppressMenus = useSetRecoilState(suppressMenusAtom);


  
    const totalPointsOrPercent = Number(assignments.contents[doenetId]?.totalPointsOrPercent)
    const label = assignments.contents[doenetId]?.label;

    // let driveIdValue = useRecoilValue(driveId)
    // let [attemptNumber,setAttemptNumber] = useState(1); //Start with attempt 1
    const attemptsObj =  attempts?.contents?.[userId]?.attempts;
    let [attemptNumber,setAttemptNumber] = useState(null);
    let [attemptsInfo,setAttemptsInfo] = useState(null); //array of {cid,variant}
    let assignmentsTable = {}
    let maxAttempts = 0;

    useEffect(()=>{
        if (attemptsObj){
            let attemptNumbers = Object.keys(attemptsObj).map(Number);
            let effectiveAttemptNumber = Math.max(0,...attemptNumbers);

            if (paramAttemptNumber && paramAttemptNumber < effectiveAttemptNumber){
                effectiveAttemptNumber = paramAttemptNumber;
            }
            setAttemptNumber(effectiveAttemptNumber);
            setRecoilAttemptNumber(effectiveAttemptNumber);
        }else{
            console.log(">>>>TODO TELL THEM YOU HAVENT TAKEN YET")
        }
    },[attemptsObj,setAttemptNumber,setRecoilAttemptNumber,paramAttemptNumber])

    useEffect(()=>{
        if (effectiveRole === 'student'){
            setSuppressMenus(["GradeSettings"])
        }else{
            setSuppressMenus([])

        }
    },[effectiveRole,setSuppressMenus])

    //Wait for doenetId and userId and attemptsInfo
    if (!doenetId || !userId){
        return null;
    }



    async function loadAssignmentInfo(doenetId,userId){
        
        const { data } = await axios.get(`/api/getGradebookAssignmentAttempts.php`,{params:{doenetId,userId}})
        let dataAttemptInfo = {};
        let contentIdToDoenetML = {}; //Don't request from server more than once
        let solutionDisplayMode = 'none';
        if(data.showSolutionInGradebook === '1') {
            solutionDisplayMode = 'button';
        }

        for (let attempt of data.attemptInfo){
            let attemptNumber = attempt.attemptNumber;
            let gvariant = JSON.parse(attempt.variant, serializedComponentsReviver);
            let doenetML = contentIdToDoenetML[attempt.cid];

            if (doenetML){
                dataAttemptInfo[attemptNumber] = {
                    cid:attempt.cid,
                    variant:{name:gvariant?.name},
                    doenetML,
                    solutionDisplayMode
                    }
            }else{
                const { data } = await axios.get(`/media/${attempt.cid}.doenet`); 
  
                contentIdToDoenetML[attempt.cid] = data;
           
                dataAttemptInfo[attemptNumber] = {
                    cid:attempt.cid,
                    variant:{name:gvariant?.name},
                    doenetML: data,
                    solutionDisplayMode
                    }

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
        maxAttempts = Math.max(0,...Object.keys(attemptsInfo).map(Number))
    }

    assignmentsTable.headers = [
        {
            Header: "Score",
            Footer: "Possible Points",
            accessor: "score",
            disableFilters: true
    }
    ];

    // for (let i = 1; i <= maxAttempts; i++) {
    //     assignmentsTable.headers.push(
    //     {
    //         Header: "Attempt " + i,
    //         accessor: "a"+i,
    //         disableFilters: true,
    //         Cell: row  =><a onClick = {(e) =>{
    //             // setAttemptNumber(i);
    //             // setRecoilAttemptNumber(i);
    //             //e.stopPropagation()

    //             setPageToolView({
    //                 page: 'course',
    //                 tool: 'gradebookStudentAssignment',
    //                 view: '',
    //                 params: { driveId: driveIdValue, doenetId, userId, attemptNumber: i, source},
    //             })
    //         }}> {row.value} </a>
    //     })
    // }

    // assignmentsTable.headers.push({
    //     Header: "Assignment Total",
    //     accessor: "total",
    //     disableFilters: true
    // })

    assignmentsTable.rows = [];
    
    if(students.state == 'hasValue' && userId !== null && userId !== ''){
        // let firstName = students.contents[userId].firstName;
        // let lastName = students.contents[userId].lastName;
        // row["score"] = firstName + " " + lastName
        
        let creditRow = {};
        let scoreRow = {};

        creditRow["score"] = "Percentage";
        scoreRow["score"] = "Score";

        if(attempts.state == 'hasValue'){
            for (let i = 1; i <= maxAttempts; i++) {
                let attemptCredit = attempts.contents[userId].attempts[i];
    
                creditRow[("a"+i)] = attemptCredit ? Math.round(attemptCredit * 1000)/10 + '%' : ""
                scoreRow[("a"+i)] = attemptCredit ? Math.round(attemptCredit * 100 * totalPointsOrPercent)/100 : ""
        
            }

            creditRow["total"] = attempts.contents[userId].credit ? Math.round(attempts.contents[userId].credit * 1000)/10 + '%' : ""
            scoreRow["total"] = attempts.contents[userId].credit ? Math.round(attempts.contents[userId].credit * totalPointsOrPercent * 100)/100   : "0"
        }

        
        
        assignmentsTable.rows.push(scoreRow);
        assignmentsTable.rows.push(creditRow);
    }

    assignmentsTable.headers.push({
        Header: "Assignment Total",
        Footer: totalPointsOrPercent,
        accessor: "total",
        disableFilters: true
    })

    for (let i = 1; i <= maxAttempts; i++) {
        assignmentsTable.headers.push(
        {
            Header: "Attempt " + i,
            Footer: totalPointsOrPercent,
            accessor: "a"+i,
            disableFilters: true,
            Cell: row  =><a onClick = {(e) =>{
                // setAttemptNumber(i);
                // setRecoilAttemptNumber(i);
                //e.stopPropagation()

                setPageToolView({
                    page: 'course',
                    tool: 'gradebookStudentAssignment',
                    view: '',
                    params: { driveId: driveIdValue, doenetId, userId, attemptNumber: i, source},
                })
            }}> {row.value} </a>
        })
    }

    let dViewer = null;
    let attemptNumberJSX = null;
    if (attemptNumber > 0 && 
        attemptsInfo[attemptNumber] &&
        attemptsInfo[attemptNumber].cid !== 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        ){
        // let cid = attemptsInfo[attemptNumber].cid
        let variant = attemptsInfo[attemptNumber].variant;
        let doenetML = attemptsInfo[attemptNumber].doenetML;
        let solutionDisplayMode = attemptsInfo[attemptNumber].solutionDisplayMode;
  
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
          allowLoadState: true,
          allowSaveState: false,
          allowLocalState: false,
          allowSaveSubmissions: false,
          allowSaveEvents: false,
          pageStateSource: "submissions",
        }}
        attemptNumber={attemptNumber}
      //   requestedVariant={requestedVariant}
        requestedVariant={variant}
      //   updateCreditAchievedCallback={updateCreditAchieved}
        // generatedVariantCallback={variantCallback}
      />

      attemptNumberJSX = <div style={{paddingLeft:"8px"}}>
        Viewing attempt number {attemptNumber}
        </div>;

    }else{
        attemptNumberJSX = <div style={{paddingLeft:"8px"}}>
        No content available for attempt number {attemptNumber}
        </div>;

    }
    
    let studentName = `${students.contents[userId]?.firstName} ${students.contents[userId]?.lastName}`

    return(
        <>
        <div style={{marginLeft:'18px'}}><b>Gradebook for {studentName}</b></div>
        <div style={{paddingLeft:"18px"}}><b>{label}</b></div>
        <div style={{paddingLeft:"18px"}}>{totalPointsOrPercent} Points Possible</div>
        <Styles>
            <Table columns = {assignmentsTable.headers} data = {assignmentsTable.rows}/>
        </Styles>
        {attemptNumber > 0 ? 
        <>
        {attemptNumberJSX}
        {dViewer}
        </>
          : <div>Click an attempt&apos;s grade to see your attempt</div>  }
        </>
    )

}
