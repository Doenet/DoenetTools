import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {coursePermissionsAndSettingsByCourseId} from "../../_reactComponents/Course/CourseActions.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {RoleDropdown} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
export default function DriveInfoCap() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const tool = useRecoilValue(searchParamAtomFamily("tool"));
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  if (!course || Object.keys(course).length == 0) {
    return null;
  }
  let roles = [...course.roleLabels];
  let color = course.color;
  let image = course.image;
  let label = course.label;
  if (image != "none") {
    image = "url(/media/drive_pictures/" + image + ")";
  }
  if (color != "none") {
    color = "#" + color;
  }
  let toolText = "";
  if (tool == "navigation") {
    toolText = "Course Navigation";
  } else if (tool == "dashboard") {
    toolText = "Dashboard";
  } else if (tool == "data") {
    toolText = "Data";
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {position: "relative", width: "100%", height: "135px", overflow: "hidden"}
  }, /* @__PURE__ */ React.createElement("img", {
    style: {position: "absolute", width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: image, backgroundColor: color}
  })), /* @__PURE__ */ React.createElement("b", null, toolText), /* @__PURE__ */ React.createElement("div", {
    style: {padding: "16px 12px"}
  }, /* @__PURE__ */ React.createElement("span", {
    style: {marginBottom: "15px"}
  }, label), " ", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", {
    style: {marginBottom: "15px"}
  }, roles), " ", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(RoleDropdown, null)));
}
