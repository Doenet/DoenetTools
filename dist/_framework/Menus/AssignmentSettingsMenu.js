import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {AssignmentSettings} from "./SelectedActivity.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {courseIdAtom} from "../../_reactComponents/Course/CourseActions.js";
import {AssignUnassignActivity} from "../../_reactComponents/Activity/SettingComponents.js";
export default function AssignmentSettingsMenu() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(courseIdAtom);
  return /* @__PURE__ */ React.createElement("div", {
    style: {paddingTop: "6px", paddingBottom: "6px"}
  }, /* @__PURE__ */ React.createElement(AssignUnassignActivity, {
    doenetId,
    courseId
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(AssignmentSettings, {
    effectiveRole: "instructor",
    doenetId,
    courseId
  }));
}
