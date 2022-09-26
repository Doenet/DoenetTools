import axios from "../../_snowpack/pkg/axios.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Line = styled.div`
  border-bottom: 2px solid var(--canvastext);
  height: 2px;
  width: 230px;
`;
const ScoreOnRight = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
`;
const ScoreContainer = styled.div`
  position: relative;
  background: var(--canvas);
  cursor: auto;
`;
export default function EndExamPanel() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const attemptNumber = useRecoilValue(searchParamAtomFamily("attemptNumber"));
  const itemWeights = useRecoilValue(searchParamAtomFamily("itemWeights")).split(",").map(Number);
  const [{creditByItem, creditForAssignment, creditForAttempt, totalPointsOrPercent}, setCreditItems] = useState({
    creditByItem: [],
    creditForAssignment: null,
    creditForAttempt: null,
    totalPointsOrPercent: null
  });
  useEffect(() => {
    axios.get(`/api/loadAssessmentCreditAchieved.php`, {params: {attemptNumber, doenetId, tool: "endExam"}}).then(({data}) => {
      if (data.success) {
        setCreditItems({
          creditByItem: data.creditByItem.map(Number),
          creditForAssignment: Number(data.creditForAssignment),
          creditForAttempt: Number(data.creditForAttempt),
          totalPointsOrPercent: Number(data.totalPointsOrPercent)
        });
      }
    });
  }, [doenetId, attemptNumber]);
  let scoreResults = null;
  if (creditByItem.length > 0) {
    let score = 0;
    if (creditForAssignment) {
      score = Math.round(creditForAssignment * totalPointsOrPercent * 100) / 100;
    }
    let creditByItemsJSX = creditByItem.map((x, i) => {
      let scoreDisplay;
      if (itemWeights[i] === 0) {
        scoreDisplay = x === 0 ? "Not started" : x === 1 ? "Complete" : "In progress";
      } else {
        scoreDisplay = (x ? Math.round(x * 1e3) / 10 : 0) + "%";
      }
      return /* @__PURE__ */ React.createElement(ScoreContainer, {
        key: `creditByItem${i}`
      }, "Item ", i + 1, ": ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
        "data-test": `Item ${i + 1} Credit`
      }, scoreDisplay));
    });
    scoreResults = /* @__PURE__ */ React.createElement("div", {
      style: {leftMargin: "100px", leftPadding: "100px"}
    }, /* @__PURE__ */ React.createElement(ScoreContainer, null, "Possible Points: ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
      "data-test": "Possible Points"
    }, totalPointsOrPercent)), /* @__PURE__ */ React.createElement(ScoreContainer, null, "Final Score: ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
      "data-test": "Final Score"
    }, score)), /* @__PURE__ */ React.createElement(Line, null), /* @__PURE__ */ React.createElement("b", null, "Credit For:"), /* @__PURE__ */ React.createElement(ScoreContainer, {
      "data-test": "Attempt Container"
    }, "Attempt ", attemptNumber, ": ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
      "data-test": "Attempt Percent"
    }, creditForAttempt ? Math.round(creditForAttempt * 1e3) / 10 : 0, "%")), /* @__PURE__ */ React.createElement("div", {
      style: {marginLeft: "15px"}
    }, creditByItemsJSX), /* @__PURE__ */ React.createElement(ScoreContainer, null, "Assignment: ", /* @__PURE__ */ React.createElement(ScoreOnRight, {
      "data-test": "Assignment Percent"
    }, creditForAssignment ? Math.round(creditForAssignment * 1e3) / 10 : 0, "%")));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      justifyContent: "center",
      alignItems: "center",
      margin: "20"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex", alignItems: "center"}
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("img", {
    style: {width: "250px", height: "250px"},
    alt: "Doenet Logo",
    src: "/media/Doenet_Logo_Frontpage.png"
  })), /* @__PURE__ */ React.createElement("h1", null, "Exam is finished")), /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {width: "230px", maxHeight: "340px", overflowY: "scroll"}
  }, scoreResults)));
}
