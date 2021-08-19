import React from "react";
import { Styles, Table, studentData, attemptData, driveId } from "./Gradebook"

import {
    useSetRecoilState,
    useRecoilValue,
    useRecoilValueLoadable,
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
export default function GradebookStudentAssignmentView(props){
    const setPageToolView = useSetRecoilState(pageToolViewAtom);
    let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
    let userId = useRecoilValue(searchParamAtomFamily('userId'))
    let source = useRecoilValue(searchParamAtomFamily('source'))
    let assignmentsTable = {}
    let attempts = useRecoilValueLoadable(attemptData(doenetId))
    let students = useRecoilValueLoadable(studentData)
    let maxAttempts = 0;

    let driveIdValue = useRecoilValue(driveId)

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
                
                //e.stopPropagation()
                //open("calendar", "fdsa", "f001");

                setPageToolView({
                    page: 'course',
                    tool: 'gradebookAttempt',
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
    
    if(students.state == 'hasValue' && userId !== null && userId !== ''){
        let firstName = students.contents[userId].firstName;
        let lastName = students.contents[userId].lastName;
        
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

    //console.log("in component");
    

    return(

        <Styles>
            <Table columns = {assignmentsTable.headers} data = {assignmentsTable.rows}/>
        </Styles>
    )

}
