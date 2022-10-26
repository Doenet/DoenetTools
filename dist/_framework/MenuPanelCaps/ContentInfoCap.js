import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {itemByDoenetId, courseIdAtom, useCourse, useInitCourseItems} from "../../_reactComponents/Course/CourseActions.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {find_image_label, find_color_label} from "./util.js";
export default function ContentInfoCap() {
  const courseId = useRecoilValue(courseIdAtom);
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let {color, image, label: course_label} = useCourse(courseId);
  const activityInfo = useRecoilValue(itemByDoenetId(doenetId));
  let accessible_name = "course";
  if (!image) {
    return null;
  }
  if (image != "none") {
    accessible_name = find_image_label(image);
    image = "url(/media/drive_pictures/" + image + ")";
  }
  if (color != "none") {
    accessible_name = find_color_label(color);
    color = "#" + color;
  }
  let activityPageJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "1px", marginTop: "5px"}
  }, "Activity"), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "5px", padding: "1px 5px"}
  }, activityInfo?.label));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {position: "relative", width: "100%", height: "165px", overflow: "hidden"}
  }, /* @__PURE__ */ React.createElement("img", {
    "aria-label": accessible_name,
    style: {position: "absolute", width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: image, backgroundColor: color}
  })), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "1px", marginTop: "5px"}
  }, "Course"), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "5px", padding: "1px 5px"}
  }, course_label), activityPageJSX);
}
