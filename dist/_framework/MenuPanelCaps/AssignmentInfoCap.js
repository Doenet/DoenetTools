import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {find_image_label, find_color_label} from "./util.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {
  courseIdAtom,
  coursePermissionsAndSettingsByCourseId
} from "../../_reactComponents/Course/CourseActions.js";
export default function AssignmentInfoCap() {
  const courseId = useRecoilValue(courseIdAtom);
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  if (!course || Object.keys(course).length == 0) {
    return null;
  }
  let color = course.color;
  let image = course.image;
  let accessible_name = "course";
  if (image != "none") {
    accessible_name = find_image_label(image);
    image = "url(/media/drive_pictures/" + image + ")";
  }
  if (color != "none") {
    accessible_name = find_color_label(color);
    color = "#" + color;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    style: {position: "relative", width: "100%", height: "165px", overflow: "hidden"}
  }, /* @__PURE__ */ React.createElement("img", {
    "aria-label": accessible_name,
    style: {position: "absolute", width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: image, backgroundColor: color}
  })), /* @__PURE__ */ React.createElement("b", null, "Assignment"));
}
