// import axios from 'axios';
import axios from "axios";
import { set } from "lodash";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import ButtonGroup from "../../../_reactComponents/PanelHeaderComponents/ButtonGroup";
// import { searchParamAtomFamily } from '../NewToolRoot';
// import styled from "styled-components";

import { pageToolViewAtom, searchParamAtomFamily } from "../NewToolRoot";

export default function WelcomeUMNPlacementExam() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let extended = useRecoilValue(searchParamAtomFamily("extended"));
  //takenStatus = 'Page Init' | 'Not Started' (as in the attempt not started) | 'In Progress' | 'Completed'
  let [takenStatus, setTakenStatus] = useState("Page Init");
  // let [takenStatus, setTakenStatus] = useState('Completed'); //'Page Init' | 'Not Started' | 'In Progress' | 'Completed'
  const [examName, setExamName] = useState("Calculus Placement Exam");
  const [learnerFirstName, setLearnerFirstName] = useState(null);
  const [learnerLastName, setLearnerLastName] = useState(null);
  const [startWarningMessageOpen, setStartWarningMessageOpen] = useState(false);

  //Default to the placement exam
  if (!doenetId) {
    doenetId = "_Xzibs2aYiKJbZsZ69bBZP"; //Placement exam
  }

  const navigateToTheExam = () => {
    let params = {
      doenetId,
    };
    //Don't want to show to the student that extended is an option
    if (extended) {
      params["extended"] = extended;
    }

    setPageToolView({
      page: "umn",
      tool: "exam",
      view: "",
      params,
    });
  };

  useEffect(() => {
    async function getAndSetUsersExamStatus() {
      console.log("doenetId", doenetId);
      //TODO: ask php for status of user
      let resp = await axios.get(
        "/api/getExamNameAndUsersPlacementExamProgress.php",
        { params: { doenetId } },
      );
      console.log("resp", resp.data);
      const { success, status, examName, firstName, lastName } = resp.data;
      if (success) {
        setTakenStatus(status);
        setExamName(examName);
        setLearnerFirstName(firstName);
        setLearnerLastName(lastName);
      }
    }

    if (takenStatus == "In Progress") {
      navigateToTheExam();
    } else if (takenStatus == "Page Init") {
      getAndSetUsersExamStatus();
    }
  }, [navigateToTheExam, takenStatus, doenetId]);

  if (takenStatus == "Page Init") {
    return null;
  } else if (takenStatus == "In Progress") {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          justifyContent: "center",
          alignItems: "center",
          margin: "20",
          padding: "5px",
          display: "flex",
          flexFlow: "column wrap",
        }}
      >
        <p>Redirecting to ongoing exam...</p>
      </div>
    );
  } else if (takenStatus == "Completed") {
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
            alignItems: "center",
            margin: "20",
            padding: "5px",
            display: "flex",
            flexFlow: "column wrap",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            You have already taken the {examName}
          </h2>
          <p>
            (part of results component) If you have questions email? (call help
            desk?) (will be someone to reset)
          </p>
          <p>Results component goes here.</p>
        </div>
      </>
    );
  }

  //Not Started

  if (startWarningMessageOpen) {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          justifyContent: "center",
          alignItems: "center",
          margin: "20",
          border: "var(--mainBorder)",
          borderRadius: "var(--mainBorderRadius)",
          padding: "5px",
          display: "flex",
          flexFlow: "column wrap",
        }}
      >
        {/* <h2 style={{ textAlign: 'center' }}>Warning!</h2> */}
        <h2 style={{ textAlign: "center" }}>
          Are you sure you want to start the exam now?
        </h2>
        <p style={{ textAlign: "center" }}>
          The timer begins when you click yes.
        </p>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "5px" }}
        >
          <ButtonGroup>
            <Button
              onClick={navigateToTheExam}
              data-test="ConfirmFinishAssessment"
              value="Yes"
            ></Button>
            <Button
              onClick={() => setStartWarningMessageOpen(false)}
              data-test="CancelFinishAssessment"
              value="No"
              alert
            ></Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // display: 'flex',
          justifyContent: "center",
          alignItems: "center",
          margin: "20",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Welcome {learnerFirstName} {learnerLastName}!
        </h2>
        <h2 style={{ textAlign: "center" }}>{examName}</h2>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "5px" }}
        >
          <Button
            onClick={() => setStartWarningMessageOpen(true)}
            value="Start Exam"
          />
        </div>
      </div>
    </>
  );
}
