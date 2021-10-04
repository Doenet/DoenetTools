import React, { useEffect, useState } from "react";
import { Styles, Table, studentData, attemptData, assignmentData } from "./Gradebook"

import {
    atom,
    useSetRecoilState,
    useRecoilState,
    useRecoilValue,
    useRecoilValueLoadable,
  } from "recoil";
 
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { useToast, toastType } from '../Toast';
import ButtonGroup from "../../../_reactComponents/PanelHeaderComponents/ButtonGroup";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import DropdownMenu from "../../../_reactComponents/PanelHeaderComponents/DropdownMenu";
import axios from "axios";
import { suppressMenusAtom } from '../NewToolRoot';
import { effectiveRoleAtom } from "../../../_reactComponents/PanelHeaderComponents/RoleDropdown";

export const processGradesAtom = atom({
    key: 'processGradesAtom',
    default: 'Assignment Table',
  });

export const headersGradesAtom = atom({
        key: 'headersGradesAtom',
        default: [],
    });

export const entriesGradesAtom = atom({
        key: 'entriesGradesAtom',
        default: [],
    });

const getUserId = (students, name) => {
    for(let userId in students){
        //console.log(userId, students[userId].firstName);
        
        if(students[userId].firstName + " " + students[userId].lastName == name){
          return userId;
        }
      }
    return -1;
} 

function UploadChoices({ doenetId, maxAttempts }){
    let headers = useRecoilValue(headersGradesAtom);
    let rows = useRecoilValue(entriesGradesAtom);
    const addToast = useToast();
    const setProcess = useSetRecoilState(processGradesAtom);
    let assignments = useRecoilValueLoadable(assignmentData);
    let [scoreIndex,setScoreIndex] = useState(null);
    let [selectedColumnIndex,setSelectedColumnIndex] = useState(1);
    let [attemptNumber,setAttemptNumber] = useState(null);
    let [selectedAttemptIndex,setSelectedAttemptIndex] = useState(1);
    //Need points for assignment, but wait for loaded

    
    if (assignments.state !== 'hasValue'){
        return null;
    }
    const totalPointsOrPercent = assignments.contents?.[doenetId]?.totalPointsOrPercent;

    if (!headers.includes("SIS User ID")){
        addToast("Need a column header named 'SIS User ID' ", toastType.ERROR);
        setProcess('Assignment Table')
        return null;
    }

    let columnIndexes = [];
    let validColumns = headers.filter((value,i)=>{
        let columnPoints = rows?.[0]?.[i]
        if (columnPoints == totalPointsOrPercent){ columnIndexes.push(i) }
        return columnPoints == totalPointsOrPercent;
    })

    if (validColumns.length < 1){
        addToast(`Need a column with an assignment worth ${totalPointsOrPercent} points`, toastType.ERROR);
        setProcess('Assignment Table')
        return null;
    }

    if (!scoreIndex){
        setScoreIndex(columnIndexes[0]) //Default to the first one
    }
    
    let tableRows = [];
    let emails = [];
    let scores = [];
    for (let row of rows){
        let name = row[0];
        let id = row[1];
        let email = row[3];
        let score = row[scoreIndex];
        
        if (email !== ''){
            emails.push(email); //needed for payload
            scores.push(score); //needed for payload
            tableRows.push(<tr> <td>{name}</td><td>{email}</td><td>{id}</td><td>{score}</td></tr>)
        }
    }

    let importTable = <table>
            <tr>
            <th style={{width:'200px'}}>Student</th>
            <th style={{width:'200px'}}>Email</th>
            <th style={{width:'100px'}}>ID</th>
            <th style={{width:'50px'}}>Score</th>
            </tr>

           {tableRows}

    </table>

    let dropdownItems = [];
    for (let [i,name] of Object.entries(validColumns)){
        dropdownItems.push([i,name])
    }

    let attemptDropdownItems = [];
    if (attemptNumber === null){
        attemptDropdownItems.push([0,`Select Attempt Number`])
    }

    for (let i = 1; i <= maxAttempts; i++){
        attemptDropdownItems.push([i,`Attempt Number ${i}`])
    }
    attemptDropdownItems.push([Number(maxAttempts) + 1,`New Attempt Number`])

    return <>
    <div>{validColumns.length} column{validColumns.length > 1 ? 's' : null} match {totalPointsOrPercent} total points </div>
    <div><DropdownMenu items = {dropdownItems} valueIndex={selectedColumnIndex} width="400px" onChange={({value})=>{
        setSelectedColumnIndex(Number(value)+1)
        setScoreIndex(columnIndexes[value])
    }}/></div>
    <br />
    <div><DropdownMenu items = {attemptDropdownItems} valueIndex={selectedAttemptIndex} width="400px" onChange={({value})=>{
       setSelectedAttemptIndex(value);
       setAttemptNumber(value);
    }}/></div>
    <br />

    {attemptNumber ? 
    <div>Use column <b>{validColumns[Number(selectedColumnIndex) - 1]}</b> as <b>Attempt Number {attemptNumber}</b> to {Number(maxAttempts) + 1 === attemptNumber ? 'insert' : 'override' } scores?</div>
    : null }
    <ButtonGroup>
        <Button alert value='Cancel' onClick={()=>{
            addToast(`Override Cancelled`);
            setProcess('Assignment Table')
            }}/>
            {attemptNumber ? 
            <Button value='Accept' onClick={()=>{
                
                let payload = {
                    doenetId,
                    attemptNumber,
                    emails,
                    scores
                    }
                axios.post('/api/saveOverrideGrades.php',payload)
                .catch((e)=>{
                    addToast(e, toastType.ERROR);
                    setProcess('Assignment Table')
                })
                .then(({data})=>{
                    if (data.success){
                    addToast(`Updated scores!`);
                    setProcess('Assignment Table')
                    //update data
       
                    }else{
                    console.log(">>>>data",data)
                    addToast(data.message, toastType.ERROR);
                    }
                    
                })
                
                }}/>
            : null}
        
    </ButtonGroup>
    <br />

    {importTable}
    </>
}


export default function GradebookAssignmentView(){
    const setPageToolView = useSetRecoilState(pageToolViewAtom);
    let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
    let driveIdValue = useRecoilValue(searchParamAtomFamily('driveId'))
    let source = useRecoilValue(searchParamAtomFamily('source'))
    let assignmentsTable = {}
    let attempts = useRecoilValueLoadable(attemptData(doenetId))
    let students = useRecoilValueLoadable(studentData)
    let [process,setProcess] = useRecoilState(processGradesAtom);
    const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
    let effectiveRole = useRecoilValue(effectiveRoleAtom);

    useEffect(()=>{
        if (effectiveRole === "student"){
            setSuppressMenus(["GradeUpload"])
        }else{
            setSuppressMenus([])
        }
    },[effectiveRole])
    


    //Wait for attempts and students to load
    if(attempts.state !== 'hasValue' || students.state !== 'hasValue'){
        return null;
    }

   

    let maxAttempts = 0;

    for (let userId in attempts.contents) {
        if (attempts.contents[userId]?.attempts){
            let len = Object.keys(attempts.contents[userId].attempts).length;
            if (len > maxAttempts) maxAttempts = len;
        }
    }

    if (process === 'Upload Choice Table'){
        return <UploadChoices doenetId={doenetId} maxAttempts={maxAttempts}/>
    }


    assignmentsTable.headers = []
    assignmentsTable.headers.push(
        {
            Header: "Student",
            accessor: "student",
            Cell: row  =><a onClick = {(e) =>{
                let name = row.cell.row.cells[0].value
                let userId = getUserId(students.contents, name);
                setPageToolView({
                    page: 'course',
                    tool: 'gradebookStudentAssignment',
                    view: '',
                    params: { driveId: driveIdValue, doenetId, userId, source: 'assignment'},
                })
            }}> {row.cell.row.cells[0].value} </a>
        }
    )
    

    for (let i = 1; i <= maxAttempts; i++) {
        assignmentsTable.headers.push(
        {
            Header: "Attempt " + i,
            accessor: "a"+i,
            disableFilters: true,
            Cell: row  =><a onClick = {(e) =>{
                let name = row.cell.row.cells[0].value
                let userId = getUserId(students.contents, name);
                
                //e.stopPropagation()
                //open("calendar", "fdsa", "f001");

                setPageToolView({
                    page: 'course',
                    tool: 'gradebookStudentAssignment',
                    view: '',
                    params: { driveId: driveIdValue, doenetId, userId, attemptNumber: i, source},
                })
            }}> {row.value} </a>
        })
    }

    assignmentsTable.headers.push({
        Header: "Assignment Total",
        accessor: "grade",
        disableFilters: true
    })

    assignmentsTable.rows = [];
    
 
    for (let userId in students.contents) {
        let firstName = students.contents[userId].firstName;
        let lastName = students.contents[userId].lastName;
        let role = students.contents[userId].role;

        //TODO: need a switch to filter this in the future
        if (role !== 'Student'){ continue; }

        let row = {};

        row["student"] = firstName + " " + lastName

     
            for (let i = 1; i <= maxAttempts; i++) {
                let attemptCredit = attempts.contents[userId].attempts[i];
                let attemptCreditOverride = attempts.contents[userId].creditOverrides[i];
                // let attemptOverride = attempts.contents[userId].creditOverride[i];
                let effectiveCredit = attemptCredit;
                if (attemptCreditOverride){effectiveCredit = attemptCreditOverride }
                row[("a"+i)] = effectiveCredit ? effectiveCredit * 100 + "%" : ""
                // console.log(">>>>userId",i,userId,effectiveCredit)
                // <Link to={`/attempt/?doenetId=${doenetId}&userId=${userId}&attemptNumber=${i}`}>
                // {
                //     attemptCredit ? attemptCredit * 100 + "%" : "" // if attemptCredit is `undefined`, we still want a table cell so that the footer column still shows up right.
                // }
                // </Link>
            }

            row["grade"] = attempts.contents[userId].credit ? attempts.contents[userId].credit*100+ "%" : ""
        

        
        
        assignmentsTable.rows.push(row);
    }
    

    return(
    <Styles>
        <Table columns = {assignmentsTable.headers} data = {assignmentsTable.rows}/>
    </Styles>
    )

}
