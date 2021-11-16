import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {serializedComponentsReviver} from "../../core/utils/serializedStateProcessing.js";
export default function SurveyDataViewer() {
  let doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  let [stateVariableData, setStateVariableData] = useState(null);
  useEffect(() => {
    async function getData(doenetId2) {
      let {data} = await axios.get("/api/getSurveyData.php", {params: {doenetId: doenetId2}});
      setStateVariableData(data.responses);
    }
    if (doenetId) {
      getData(doenetId);
    }
  }, [doenetId]);
  if (!driveId || !stateVariableData) {
    return null;
  }
  let columns = ["User's Name", "Email", "Student Id"];
  for (let svObj of stateVariableData) {
    let svars = JSON.parse(svObj.stateVariables, serializedComponentsReviver);
    for (let key of Object.keys(svars)) {
      if (!columns.includes(key)) {
        let value = svars[key];
        if (value?.immediateValue || value?.value || value?.allSelectedIndices) {
          columns.push(key);
        }
      }
    }
  }
  let rowsJSX = [];
  for (let [x, svObj] of Object.entries(stateVariableData)) {
    let svars = JSON.parse(svObj.stateVariables, serializedComponentsReviver);
    let cellsJSX = [];
    for (let [i, key] of Object.entries(columns)) {
      if (i > 2) {
        let value = svars[key];
        let response = "N/A";
        if (value?.immediateValue) {
          response = value.immediateValue;
        } else if (value?.value) {
          response = value.value;
        } else if (value?.allSelectedIndices) {
          response = value.allSelectedIndices[0];
        }
        cellsJSX.push(/* @__PURE__ */ React.createElement("td", {
          key: `survey${x}-${i}`
        }, response));
      }
    }
    cellsJSX.unshift(/* @__PURE__ */ React.createElement("td", null, svObj.studentId));
    cellsJSX.unshift(/* @__PURE__ */ React.createElement("td", null, svObj.email));
    cellsJSX.unshift(/* @__PURE__ */ React.createElement("td", null, `${svObj.firstName} ${svObj.lastName}`));
    rowsJSX.push(/* @__PURE__ */ React.createElement("tr", {
      style: {borderBottom: "1pt solid black"}
    }, cellsJSX));
  }
  let thJSX = [];
  for (let [i, column] of Object.entries(columns)) {
    thJSX.push(/* @__PURE__ */ React.createElement("th", {
      key: `surveyHead${i}`,
      style: {width: "150px"}
    }, column));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {margin: "5px"}
  }, /* @__PURE__ */ React.createElement("table", {
    style: {borderCollapse: "collapse"}
  }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", {
    style: {borderBottom: "2pt solid black"}
  }, thJSX)), /* @__PURE__ */ React.createElement("tbody", null, rowsJSX)));
}
