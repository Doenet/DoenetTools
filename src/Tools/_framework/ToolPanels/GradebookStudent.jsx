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
    // console.log(">>>>studentName",studentName)

    // console.log(">>>>overView",overView.contents)
    let overviewTable = {}

    overviewTable.headers=[{
        Header: "Assignment",
        accessor: "assignment",
        disableFilters: true,
        disableSortBy: true,
    },
    {
        Header: "Possible Points",
        accessor: "possiblepoints",
        disableFilters: true,
        disableSortBy: true,
    },
    {
        Header: "Score",
        accessor: "score",
        disableFilters: true,
        disableSortBy: true,

    },
    {
        Header: "Percentage",
        accessor: "percentage",
        disableFilters: true,
        disableSortBy: true,

    }
];

    overviewTable.rows = []

 if(assignments.state == 'hasValue' && 
    students.state === 'hasValue' && 
    overView.state === 'hasValue' && 
    userId !== null && userId !== ''){

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

    let totalScore = 0;
    let totalPossiblePoints = 0;

    for (let {category,scaleFactor=1,maximumNumber=Infinity} of gradeCategories){
        overviewTable.rows.push({
            assignment:category
        });
        let scores = [];
        let allpossiblepoints = [];
  
        for(let doenetId in assignments.contents){

            let inCategory = assignments.contents[doenetId].category;
            if (inCategory.toLowerCase() !== category.toLowerCase()){ continue;}

            let possiblepoints = assignments.contents[doenetId].totalPointsOrPercent * 1;
            let credit = overView.contents[userId].assignments[doenetId];
            let score = possiblepoints * credit;
            allpossiblepoints.push(possiblepoints);
            scores.push(score);
            
            score = Math.round(score*100)/100;
            let percentage = Math.round(credit * 1000)/10 + '%';
            let assignment = <a onClick = {(e) =>{
                                // e.stopPropagation()
                                setPageToolView({
                                    page: 'course',
                                    tool: 'gradebookStudentAssignment',
                                    view: '',
                                    params: { driveId, userId, doenetId, source: 'student'},
                                })
                            }
                            }>{assignments.contents[doenetId].label}</a>
                            
            overviewTable.rows.push({
                assignment,
                possiblepoints,
                score,
                percentage
            });
            
        }

        let numberScores = scores.length;
        scores = scores.sort((a,b)=>b-a).slice(0,maximumNumber);
        let categoryScore = scores.reduce((a,c)=>a+c,0) * scaleFactor;

        allpossiblepoints = allpossiblepoints.sort((a,b)=>b-a).slice(0,maximumNumber);
        let categoryPossiblePoints = allpossiblepoints.reduce((a,c)=>a+c,0) * scaleFactor;

        let categoryPercentage = "0%";
   
        if (categoryPossiblePoints !== 0){
            categoryPercentage = Math.round(categoryScore / categoryPossiblePoints * 1000)/10 + '%'
        }
        totalScore += categoryScore;
        totalPossiblePoints += categoryPossiblePoints;

        categoryScore = Math.round(categoryScore* 100)/100 

        let description = "";
        if (numberScores > maximumNumber){
            description = <div style={{fontSize:'.8em'}}>(Based on top {maximumNumber} scores)</div>
        }
        if (scaleFactor !== 1 ){
            description = <div style={{fontSize:'.8em'}}>(Based on rescaling by {scaleFactor * 100}%)</div>
        }
        overviewTable.rows.push({
            // assignment:"Subtotal for ${category} Description ",
            assignment:<>{`Subtotal for ${category}`}{description}</>,
            score:categoryScore,
            possiblepoints:categoryPossiblePoints,
            percentage:categoryPercentage
        });


    }
    let totalPercentage = Math.round(totalScore/totalPossiblePoints * 1000)/10 + '%'

    totalScore = Math.round(totalScore*100)/100;
    overviewTable.rows.push({
        // assignment:"Subtotal for ${category} Description ",
        assignment:'Course Total',
        score:totalScore,
        possiblepoints:totalPossiblePoints,
        percentage:totalPercentage
    });


    
}

let studentName = `${students.contents[userId]?.firstName} ${students.contents[userId]?.lastName}`

    return (<>
    <div style={{marginLeft:'18px'}}><b>Gradebook for {studentName}</b></div>
        <Styles>
            <Table disableSortBy={true} columns = {overviewTable.headers} data = {overviewTable.rows}/>
        </Styles>
        </>
    )

}