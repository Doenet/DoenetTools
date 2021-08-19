import React from "react"
import {
    useSetRecoilState,
    useRecoilValue,
    useRecoilValueLoadable,
  } from "recoil";

import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { Styles, Table, studentData, assignmentData,  overViewData, gradeSorting} from "./Gradebook"

export default function GradebookStudent(props) {
    //const { openOverlay, activateMenuPanel } = useToolControlHelper();
    let driveId = useRecoilValue(searchParamAtomFamily('driveId'));
    console.log(">>> driveId: ", driveId)
    let userId = useRecoilValue(searchParamAtomFamily('userId'))
    console.log(">>> USERID: ", userId)

    const setPageToolView = useSetRecoilState(pageToolViewAtom);
    let overviewTable = {}
    overviewTable.headers=[{
        Header: "Name",
        accessor: "name",
    },];

    let assignments = useRecoilValueLoadable(assignmentData);
    //let assignments = { contents: {}}


    if(assignments.state == 'hasValue'){
        for(let doenetId in assignments.contents){
            overviewTable.headers.push({
                //`/assignment/?doenetId=${doenetId}`
                Header: <a onClick = {(e) =>{
                    e.stopPropagation()

                    setPageToolView({
                        page: 'course',
                        tool: 'gradebookStudentAssignment',
                        view: '',
                        params: { driveId, userId, doenetId, source: 'student'},
                    })
                }
                }>{assignments.contents[doenetId]}</a>,
                accessor: doenetId,
                disableFilters: true,
                // <a onClick={() => {
                //     open("calendar", "fdsa", "f001");
                //   }}>
                

            })
        }
    }

    overviewTable.headers.push(
        {
            Header: "Weighted Credt",
            accessor: "weight",
            disableFilters: true
            
        }
    )
    overviewTable.headers.push(
        {
            Header: "Grade",
            accessor: "grade",
            sortType: gradeSorting,
            disableFilters: true
        },
    )

    overviewTable.rows = []
    
    let students = useRecoilValueLoadable(studentData)
    //let students = { state:'hasError', contents: {}}
    let overView = useRecoilValueLoadable(overViewData)
    //let overView = { state:'hasError', contents: {}}

    if(students.state === 'hasValue' && userId !== null && userId !== ''){
        //console.log(">>> userId", userId)
        let firstName = students.contents[userId].firstName,
            lastName = students.contents[userId].lastName,
            credit = students.contents[userId].courseCredit,
            generatedGrade = students.contents[userId].courseGrade,
            overrideGrade = students.contents[userId].overrideCourseGrade;

        let grade = overrideGrade ? overrideGrade : generatedGrade

        let row = {}

        row["name"] = firstName + " " + lastName
        
        if(overView.state == 'hasValue' && assignments.state == 'hasValue'){
            for (let doenetId in assignments.contents) {
                row[doenetId] = (overView.contents[userId].assignments[doenetId]) * 100 + "%"
            }
        }

        row["weight"] = credit
        row["grade"] = grade

        
        overviewTable.rows.push(row);
    }

    //console.log("debug overviewtable", overviewTable);
    

    return (
        <Styles>
            <Table columns = {overviewTable.headers} data = {overviewTable.rows}/>
        </Styles>
    )

}
