import axios from "../../_snowpack/pkg/axios.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {
  itemByDoenetId,
  selectedCourseItems,
  studentCourseItemOrderByCourseIdBySection
} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useToast, toastType} from "../Toast.js";
export default function SelectedDataSources() {
  const [assignedSelectedDoenetIds, setAssignedSelectedDoenetIds] = useState([]);
  const selectedDoenetIds = useRecoilValue(selectedCourseItems);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const findAssignedDoenetIds = useRecoilCallback(({snapshot}) => async (selectedDoenetIds2) => {
    let foundDoenetIds = [];
    for (let doenetId of selectedDoenetIds2) {
      let itemObj = await snapshot.getPromise(itemByDoenetId(doenetId));
      if (itemObj.type == "activity" && itemObj.isAssigned) {
        foundDoenetIds.push(doenetId);
      } else if (itemObj.type == "section" && itemObj.isAssigned) {
        let sectionDoenetIds = await snapshot.getPromise(studentCourseItemOrderByCourseIdBySection({courseId, sectionId: doenetId}));
        let newDoenetIds = await findAssignedDoenetIds(sectionDoenetIds);
        foundDoenetIds = [...newDoenetIds, ...foundDoenetIds];
      }
    }
    foundDoenetIds = [...new Set(foundDoenetIds)];
    return foundDoenetIds;
  }, [courseId]);
  useEffect(() => {
    if (selectedDoenetIds.length > 0) {
      findAssignedDoenetIds(selectedDoenetIds).then((doenetIds) => {
        setAssignedSelectedDoenetIds(doenetIds);
      });
    } else {
      setAssignedSelectedDoenetIds([]);
    }
  }, [selectedDoenetIds]);
  const addToast = useToast();
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-test": "selectedDataSourcesHeading",
    style: {margin: "16px 5px"}
  }, "Event Data");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement("div", null, assignedSelectedDoenetIds.length, " ", assignedSelectedDoenetIds.length == 1 ? "Activity" : "Activities"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "View on Shiny",
    disabled: assignedSelectedDoenetIds.length == 0,
    onClick: async () => {
      if (assignedSelectedDoenetIds.length == 0) {
        addToast(`No activities found`, toastType.INFO);
      } else {
        let searchParamsText = assignedSelectedDoenetIds.join("&data=");
        const resp = await axios.get(`/api/createSecretCode.php?courseId=${courseId}`);
        const {secretCode} = resp.data;
        window.open(`https://doenet.shinyapps.io/analyzer/?data=${searchParamsText}&code=${secretCode}`, "_blank");
      }
    }
  }));
}
