import React from "react"
import {
    useSetRecoilState,
    useRecoilValue,
    useRecoilValueLoadable,
  } from "recoil";

import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { Styles, Table, studentData, assignmentData,  overViewData, gradeSorting} from "./Gradebook"

export default function GradebookStudent() {

    //const { openOverlay, activateMenuPanel } = useToolControlHelper();
    let driveId = useRecoilValue(searchParamAtomFamily('driveId'));
    let userId = useRecoilValue(searchParamAtomFamily('userId'))
    const setPageToolView = useSetRecoilState(pageToolViewAtom);
    let assignments = useRecoilValueLoadable(assignmentData);
    let students = useRecoilValueLoadable(studentData)
    let overView = useRecoilValueLoadable(overViewData)
    // console.log(">>>> driveId: ", driveId)
    // console.log(">>>> USERID: ", userId)
    // console.log(">>>>assignments",assignments.contents)
    // console.log(">>>>students",students.contents)
    // console.log(">>>>overView",overView.contents)

    let overviewTable = {}

    overviewTable.headers=[{
        Header: "Assignment",
        accessor: "assignment",
    },
    {
        Header: "Score",
        accessor: "score",
        disableFilters: true,
    }];

    overviewTable.rows = []

 if(assignments.state == 'hasValue' && 
    students.state === 'hasValue' && 
    overView.state === 'hasValue' && 
    userId !== null && userId !== ''){

    for(let doenetId in assignments.contents){
        let score = (overView.contents[userId].assignments[doenetId]) * 100 + "%";
        let assignment = <a onClick = {(e) =>{
                            // e.stopPropagation()
                            setPageToolView({
                                page: 'course',
                                tool: 'gradebookStudentAssignment',
                                view: '',
                                params: { driveId, userId, doenetId, source: 'student'},
                            })
                        }
                        }>{assignments.contents[doenetId]}</a>
                        
        overviewTable.rows.push({
            assignment,
            score
        });
        
    }
}
overviewTable.rows.push({
    assignment:"Weighted Credit",
    score:"wc"
});

overviewTable.rows.push({
    assignment:"Grade",
    score:"g"
});


    // overviewTable.headers=[{
    //     Header: "Name",
    //     accessor: "name",
    // },];

    // if(assignments.state == 'hasValue'){
    //     for(let doenetId in assignments.contents){
    //         overviewTable.headers.push({
    //             //`/assignment/?doenetId=${doenetId}`
    //             Header: <a onClick = {(e) =>{
    //                 e.stopPropagation()

    //                 setPageToolView({
    //                     page: 'course',
    //                     tool: 'gradebookStudentAssignment',
    //                     view: '',
    //                     params: { driveId, userId, doenetId, source: 'student'},
    //                 })
    //             }
    //             }>{assignments.contents[doenetId]}</a>,
    //             accessor: doenetId,
    //             disableFilters: true,
    //             // <a onClick={() => {
    //             //     open("calendar", "fdsa", "f001");
    //             //   }}>
                

    //         })
    //     }
    // }

    // overviewTable.headers.push(
    //     {
    //         Header: "Weighted Credt",
    //         accessor: "weight",
    //         disableFilters: true
            
    //     }
    // )
    // overviewTable.headers.push(
    //     {
    //         Header: "Grade",
    //         accessor: "grade",
    //         sortType: gradeSorting,
    //         disableFilters: true
    //     },
    // )

    // overviewTable.rows = []
    


    // if(students.state === 'hasValue' && userId !== null && userId !== ''){
    //     //console.log(">>> userId", userId)
    //     let firstName = students.contents[userId].firstName,
    //         lastName = students.contents[userId].lastName,
    //         credit = students.contents[userId].courseCredit,
    //         generatedGrade = students.contents[userId].courseGrade,
    //         overrideGrade = students.contents[userId].overrideCourseGrade;

    //     let grade = overrideGrade ? overrideGrade : generatedGrade

    //     let row = {}

    //     row["name"] = firstName + " " + lastName
        
    //     if(overView.state == 'hasValue' && assignments.state == 'hasValue'){
    //         for (let doenetId in assignments.contents) {
    //             row[doenetId] = (overView.contents[userId].assignments[doenetId]) * 100 + "%"
    //         }
    //     }

    //     row["weight"] = credit
    //     row["grade"] = grade

        
    //     overviewTable.rows.push(row);
    // }

    //console.log("debug overviewtable", overviewTable);
    // console.log(">>>>data",overviewTable.rows)
    // console.log(">>>>columns",overviewTable.headers)

    return (
        <Styles>
            <Table columns = {overviewTable.headers} data = {overviewTable.rows}/>
        </Styles>
    )

}
