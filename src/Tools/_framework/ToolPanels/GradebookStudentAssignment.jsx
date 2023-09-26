import React, { useState, useEffect } from "react";
import {
  Styles,
  Table,
  studentData,
  attemptData,
  assignmentData,
  overviewData,
} from "./Gradebook";

import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilCallback,
} from "recoil";

import {
  pageToolViewAtom,
  searchParamAtomFamily,
  suppressMenusAtom,
} from "../NewToolRoot";
import axios from "axios";
import {
  activityStatusAtom,
  currentAttemptNumber,
} from "../ToolPanels/AssignmentViewer";
import { effectivePermissionsByCourseId } from "../../../_reactComponents/PanelHeaderComponents/RoleDropdown";
import { DoenetML } from "../../../Viewer/DoenetML";
import { coursePermissionsAndSettingsByCourseId } from "../../../_reactComponents/Course/CourseActions";
import { useLocation, useNavigate } from "react-router";

// import { BreadcrumbProvider } from '../../../_reactComponents/Breadcrumb';
// import { DropTargetsProvider } from '../../../_reactComponents/DropTarget';

const getUserId = (students, name) => {
  for (let userId in students) {
    //console.log(userId, students[userId].firstName);

    if (students[userId].firstName + " " + students[userId].lastName == name) {
      return userId;
    }
  }
  return -1;
};
export default function GradebookStudentAssignmentView() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let userId = useRecoilValue(searchParamAtomFamily("userId"));
  let paramAttemptNumber = useRecoilValue(
    searchParamAtomFamily("attemptNumber"),
  );
  let previousCrumb = useRecoilValue(searchParamAtomFamily("previousCrumb"));
  let attempts = useRecoilValueLoadable(attemptData(doenetId));
  let students = useRecoilValueLoadable(studentData);
  const setRecoilAttemptNumber = useSetRecoilState(currentAttemptNumber);
  let assignments = useRecoilValueLoadable(assignmentData);
  let { canViewAndModifyGrades } = useRecoilValue(
    effectivePermissionsByCourseId(courseId),
  );
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  let overview = useRecoilValueLoadable(overviewData);

  let navigate = useNavigate();
  let location = useLocation();

  const totalPointsOrPercent = Number(
    assignments.contents[doenetId]?.totalPointsOrPercent,
  );
  const label = assignments.contents[doenetId]?.label;

  // let driveIdValue = useRecoilValue(driveId)
  // let [attemptNumber,setAttemptNumber] = useState(1); //Start with attempt 1
  const attemptsObj = attempts?.contents?.[userId]?.attempts;
  let [attemptNumber, setAttemptNumber] = useState(null);
  let [attemptsInfo, setAttemptsInfo] = useState(null); //array of {cid,variant}
  let assignmentsTable = {};
  let maxAttempts = 0;

  useEffect(() => {
    if (attemptsObj) {
      let attemptNumbers = Object.keys(attemptsObj).map(Number);
      let effectiveAttemptNumber = Math.max(0, ...attemptNumbers);

      if (paramAttemptNumber && paramAttemptNumber < effectiveAttemptNumber) {
        effectiveAttemptNumber = paramAttemptNumber;
      }
      setAttemptNumber(effectiveAttemptNumber);
      setRecoilAttemptNumber(effectiveAttemptNumber);
    } else {
      console.log(">>>>TODO TELL THEM YOU HAVENT TAKEN YET");
    }
  }, [
    attemptsObj,
    setAttemptNumber,
    setRecoilAttemptNumber,
    paramAttemptNumber,
  ]);

  useEffect(() => {
    if (canViewAndModifyGrades !== "1") {
      setSuppressMenus(["GradeSettings"]);
    } else {
      setSuppressMenus([]);
    }
  }, [canViewAndModifyGrades, setSuppressMenus]);

  const updateActivityStatus = useRecoilCallback(
    ({ set }) =>
      async ({ itemWeights, currentPage, activityAttemptNumberSetUp }) => {
        set(activityStatusAtom, {
          itemWeights,
          currentPage,
          activityAttemptNumberSetUp,
        });
      },
  );

  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

  if (course?.canViewCourse == "0") {
    return <h1>No Access to view this page.</h1>;
  }

  //Wait for doenetId and userId and attemptsInfo
  if (!doenetId || !userId) {
    return null;
  }

  async function loadAssignmentInfo(courseId, doenetId, userId) {
    const {
      data: {
        success,
        message,
        foundAttempt,
        attemptInfo,
        showSolutionInGradebook,
        paginate,
      },
    } = await axios.get(`/api/getGradebookAssignmentAttempts.php`, {
      params: { courseId, doenetId, userId },
    });
    let dataAttemptInfo = {};
    let contentIdToDoenetML = {}; //Don't request from server more than once
    let solutionDisplayMode = "none";
    if (showSolutionInGradebook === "1") {
      solutionDisplayMode = "button";
    }

    for (let attempt of attemptInfo) {
      let attemptNumber = attempt.attemptNumber;
      let variantIndex = attempt.variantIndex;
      // let gvariant = JSON.parse(attempt.variant, serializedComponentsReviver);
      let doenetML = contentIdToDoenetML[attempt.cid];

      if (doenetML) {
        dataAttemptInfo[attemptNumber] = {
          cid: attempt.cid,
          variantIndex,
          // variant:{name:gvariant?.name},
          doenetML,
          solutionDisplayMode,
          paginate,
        };
      } else {
        const { data } = await axios.get(`/media/${attempt.cid}.doenet`);

        contentIdToDoenetML[attempt.cid] = data;

        dataAttemptInfo[attemptNumber] = {
          cid: attempt.cid,
          variantIndex,
          // variant:{name:gvariant?.name},
          doenetML: data,
          solutionDisplayMode,
          paginate,
        };
      }
    }
    setAttemptsInfo(dataAttemptInfo);
  }

  if (attemptsInfo === null) {
    loadAssignmentInfo(courseId, doenetId, userId);
    return null;
  }

  //attempts.state == 'hasValue' ? console.log(attempts.contents): console.log(attempts.state)
  if (attempts.state == "hasValue" && userId !== null && userId !== "") {
    maxAttempts = Math.max(0, ...Object.keys(attemptsInfo).map(Number));
  }

  assignmentsTable.headers = [
    {
      Header: "Score",
      Footer: "Possible Points",
      accessor: "score",
      disableFilters: true,
    },
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

  if (students.state == "hasValue" && userId !== null && userId !== "") {
    // let firstName = students.contents[userId].firstName;
    // let lastName = students.contents[userId].lastName;
    // row["score"] = firstName + " " + lastName

    let creditRow = {};
    let scoreRow = {};

    creditRow["score"] = "Percentage";
    scoreRow["score"] = "Score";

    if (attempts.state == "hasValue") {
      for (let i = 1; i <= maxAttempts; i++) {
        let attemptCredit = attempts.contents[userId].attempts[i];

        creditRow["a" + i] = attemptCredit
          ? Math.round(attemptCredit * 1000) / 10 + "%"
          : "";
        scoreRow["a" + i] = attemptCredit
          ? Math.round(attemptCredit * 100 * totalPointsOrPercent) / 100
          : "";
      }
      let credit = overview.contents?.[userId]?.assignments?.[doenetId];

      let score = Math.round(totalPointsOrPercent * credit * 100) / 100;
      let percentage = Math.round(credit * 1000) / 10 + "%";

      scoreRow["total"] = score;
      creditRow["total"] = percentage;
      // creditRow["total"] = attempts.contents[userId].credit ? Math.round(attempts.contents[userId].credit * 1000)/10 + '%' : ""
      // scoreRow["total"] = attempts.contents[userId].credit ? Math.round(attempts.contents[userId].credit * totalPointsOrPercent * 100)/100   : "0"
    }

    assignmentsTable.rows.push(scoreRow);
    assignmentsTable.rows.push(creditRow);
  }

  assignmentsTable.headers.push({
    Header: "Assignment Total",
    Footer: totalPointsOrPercent,
    accessor: "total",
    disableFilters: true,
  });

  for (let i = 1; i <= maxAttempts; i++) {
    assignmentsTable.headers.push({
      Header: "Attempt " + i,
      Footer: totalPointsOrPercent,
      accessor: "a" + i,
      disableFilters: true,
      Cell: (row) => (
        <a
          onClick={() => {
            setPageToolView({
              page: "course",
              tool: "gradebookStudentAssignment",
              view: "",
              params: {
                courseId,
                doenetId,
                userId,
                attemptNumber: i,
                previousCrumb,
              },
            });
          }}
        >
          {" "}
          {row.value}{" "}
        </a>
      ),
    });
  }

  let dViewer = null;
  let attemptNumberJSX = null;
  console.log, ("userId", userId);

  if (attemptNumber > 0 && attemptsInfo[attemptNumber]) {
    let cid = attemptsInfo[attemptNumber].cid;
    let requestedVariantIndex = attemptsInfo[attemptNumber].variantIndex;
    // let doenetML = attemptsInfo[attemptNumber].doenetML;
    let solutionDisplayMode = attemptsInfo[attemptNumber].solutionDisplayMode;
    let paginate = attemptsInfo[attemptNumber].paginate;

    const apiURLs = {
      loadActivityState: "/api/loadActivityState.php",
      saveActivityState: "/api/saveActivityState.php",
      initAssignmentAttempt: "/api/initAssignmentAttempt.php",
      recordEvent: "/api/recordEvent.php",
      loadPageState: "/api/loadPageState.php",
      savePageState: "/api/savePageState.php",
      saveCreditForItem: "/api/saveCreditForItem.php",
      reportSolutionViewed: "/api/reportSolutionViewed.php",
    };

    dViewer = (
      <DoenetML
        /** REAL below */
        key={`activityViewer${doenetId}`}
        cid={cid}
        // cidChanged={cidChanged}
        // doenetML={doenetML}
        activityId={doenetId}
        userId={userId}
        forceDisable={true}
        forceShowCorrectness={true}
        forceShowSolution={solutionDisplayMode !== "none"}
        forceUnsuppressCheckwork={true}
        flags={{
          showCorrectness: true,
          readOnly: true,
          solutionDisplayMode,
          showFeedback: true,
          showHints: true,
          autoSubmit: false,
          allowLoadState: true,
          allowSaveState: false,
          allowLocalState: false,
          allowSaveSubmissions: false,
          allowSaveEvents: false,
          //   pageStateSource: "submissions",
        }}
        attemptNumber={attemptNumber}
        idsIncludeActivityId={false}
        // requestedVariant={requestedVariant}
        // requestedVariant={variant}
        requestedVariantIndex={requestedVariantIndex}
        updateActivityStatusCallback={updateActivityStatus}
        // updateAttemptNumber={setRecoilAttemptNumber}
        // updateCreditAchievedCallback={updateCreditAchieved}
        // generatedVariantCallback={variantCallback}
        // pageChangedCallback={pageChanged}
        paginate={paginate}
        location={location}
        navigate={navigate}
        apiURLs={apiURLs}
        linkSettings={{
          viewURL: "/course?tool=assignment",
          editURL: "/public?tool=editor",
          useQueryParameters: true,
        }}
      />
    );

    attemptNumberJSX = (
      <div style={{ paddingLeft: "8px" }}>
        Viewing attempt number {attemptNumber}
      </div>
    );
  } else {
    attemptNumberJSX = (
      <div style={{ paddingLeft: "8px" }}>
        No content available for attempt number {attemptNumber}
      </div>
    );
  }

  let studentName = `${students.contents[userId]?.firstName} ${students.contents[userId]?.lastName}`;
  const section = students.contents[userId]?.section;
  return (
    <>
      <div style={{ marginLeft: "18px" }}>
        <b>Gradebook for {studentName}</b>
      </div>
      {section && (
        <div style={{ marginLeft: "18px" }}>
          <b>Section {section}</b>
        </div>
      )}
      <div style={{ paddingLeft: "18px" }}>
        <b>{label}</b>
      </div>
      <div style={{ paddingLeft: "18px" }}>
        {totalPointsOrPercent} Points Possible
      </div>
      <Styles>
        <Table
          columns={assignmentsTable.headers}
          data={assignmentsTable.rows}
        />
      </Styles>
      {attemptNumber > 0 ? (
        <>
          {attemptNumberJSX}
          {dViewer}
        </>
      ) : (
        <div>Click an attempt&apos;s grade to see your attempt</div>
      )}
    </>
  );
}
