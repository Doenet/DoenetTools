import React from "../../_snowpack/pkg/react.js";
import {useRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {coursePermissionsAndSettingsByCourseId} from "../../_reactComponents/Course/CourseActions.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {effectiveRoleIdByCourseId, RoleDropdown} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {find_image_label, find_color_label} from "./util.js";
export default function DriveInfoCap() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const tool = useRecoilValue(searchParamAtomFamily("tool"));
  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  const [effectiveRoleId, setEffectiveRoleId] = useRecoilState(effectiveRoleIdByCourseId(courseId));
  if (!course || Object.keys(course).length == 0) {
    return null;
  }
  let role = course.roleLabel;
  let color = course.color;
  let image = course.image;
  let label = course.label;
  let accessible_name = "course";
  if (image != "none") {
    accessible_name = find_image_label(image);
    image = "url(/media/drive_pictures/" + image + ")";
  }
  if (color != "none") {
    accessible_name = find_color_label(color);
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
    style: {position: "relative", width: "100%", height: "165px", overflow: "hidden"}
  }, /* @__PURE__ */ React.createElement("img", {
    "aria-label": accessible_name,
    style: {position: "absolute", width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: image, backgroundColor: color}
  })), /* @__PURE__ */ React.createElement("b", null, toolText), /* @__PURE__ */ React.createElement("div", {
    style: {padding: "16px 12px"}
  }, /* @__PURE__ */ React.createElement("span", {
    style: {marginBottom: "15px"}
  }, label), " ", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", {
    style: {marginBottom: "15px"}
  }, role), " ", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(RoleDropdown, {
    label: "View as",
    onChange: ({value: roleId}) => setEffectiveRoleId(roleId),
    valueRoleId: effectiveRoleId ?? course.roleId,
    vertical: true
  })));
}
