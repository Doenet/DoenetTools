import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function SurveyListViewer() {
  let driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  let [surveyList, setSurveyList] = useState([]);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  useEffect(() => {
    async function getSurveyList(driveId2) {
      let {data} = await axios.get("/api/getSurveyList.php", {params: {driveId: driveId2}});
      setSurveyList(data.surveys);
    }
    if (driveId) {
      getSurveyList(driveId);
    }
  }, [driveId]);
  if (!driveId) {
    return null;
  }
  if (surveyList.length === 0) {
    return /* @__PURE__ */ React.createElement("div", null, "No surveys available. Make sure you have released zero point activities.");
  }
  let surveyJSX = [];
  for (let survey of surveyList) {
    surveyJSX.push(/* @__PURE__ */ React.createElement("tr", {
      style: {borderBottom: "1pt solid var(--canvastext)"}
    }, /* @__PURE__ */ React.createElement("td", {
      style: {textAlign: "left"}
    }, survey.label), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(Button, {
      value: "View",
      onClick: () => {
        setPageToolView({
          page: "course",
          tool: "surveyData",
          view: null,
          params: {driveId, doenetId: survey.doenetId}
        });
      }
    }))));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {margin: "5px"}
  }, /* @__PURE__ */ React.createElement("table", {
    style: {borderCollapse: "collapse"}
  }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", {
    style: {borderBottom: "2pt solid var(--canvastext)"}
  }, /* @__PURE__ */ React.createElement("th", {
    style: {width: "300px"}
  }, "Survey Name"), /* @__PURE__ */ React.createElement("th", {
    style: {width: "100px"}
  }, "Download"))), /* @__PURE__ */ React.createElement("tbody", null, surveyJSX)));
}
