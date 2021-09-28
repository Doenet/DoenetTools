import React, { useEffect } from "react";
import { Styles, Table, studentData, attemptData } from "./Gradebook"

import {
    atom,
    RecoilRoot,
    useSetRecoilState,
    useRecoilState,
    useRecoilValue,
    selector,
    atomFamily,
    selectorFamily,
    useRecoilValueLoadable,
    useRecoilStateLoadable,
  } from "recoil";
 
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
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
export default function GradebookAssignmentView(props){
    const setPageToolView = useSetRecoilState(pageToolViewAtom);
    let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
    let driveIdValue = useRecoilValue(searchParamAtomFamily('driveId'))
    let source = useRecoilValue(searchParamAtomFamily('source'))
    let assignmentsTable = {}
    let attempts = useRecoilValueLoadable(attemptData(doenetId))
    let students = useRecoilValueLoadable(studentData)
    console.log(">>>>attempts",attempts)
    console.log(">>>>students",students)


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

    console.log(">>>>maxAttempts",maxAttempts)

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
        Header: "Assignment Grade",
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

        if(attempts.state == 'hasValue'){
            for (let i = 1; i <= maxAttempts; i++) {
                let attemptCredit = attempts.contents[userId].attempts[i];
    
                row[("a"+i)] = attemptCredit ? attemptCredit * 100 + "%" : ""
                
                // <Link to={`/attempt/?doenetId=${doenetId}&userId=${userId}&attemptNumber=${i}`}>
                // {
                //     attemptCredit ? attemptCredit * 100 + "%" : "" // if attemptCredit is `undefined`, we still want a table cell so that the footer column still shows up right.
                // }
                // </Link>
            }

            row["grade"] = attempts.contents[userId].credit ? attempts.contents[userId].credit*100+ "%" : ""
        }

        
        
        assignmentsTable.rows.push(row);
    }
    

    return(
    <Styles>
        <Table columns = {assignmentsTable.headers} data = {assignmentsTable.rows}/>
    </Styles>
    )

}
