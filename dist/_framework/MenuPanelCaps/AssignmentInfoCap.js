import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import axios from "../../_snowpack/pkg/axios.js";
import {currentAttemptNumber} from "../ToolPanels/AssignmentViewer.js";
import {authorItemByDoenetId, coursePermissionsAndSettingsByCourseId, useCourse} from "../../_reactComponents/Course/CourseActions.js";
export default function AssignmentInfoCap() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  if (!course || Object.keys(course).length == 0) {
    return null;
  }
  let color = course.color;
  let image = course.image;
  if (image != "none") {
    image = "url(/media/drive_pictures/" + image + ")";
  }
  if (color != "none") {
    color = "#" + color;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    style: {position: "relative", width: "100%", height: "135px", overflow: "hidden"}
  }, /* @__PURE__ */ React.createElement("img", {
    style: {position: "absolute", width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: image, backgroundColor: color}
  })), /* @__PURE__ */ React.createElement("b", null, "Assignment"));
}
