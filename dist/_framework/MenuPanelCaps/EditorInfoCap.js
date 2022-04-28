import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {authorItemByDoenetId, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function EditorInfoCap() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const pageId = useRecoilValue(searchParamAtomFamily("pageId"));
  let {color, image, label: course_label} = useCourse(courseId);
  const pageInfo = useRecoilValue(authorItemByDoenetId(pageId));
  const activityInfo = useRecoilValue(authorItemByDoenetId(doenetId));
  if (!pageInfo) {
    return null;
  }
  if (image != "none") {
    image = "/media/drive_pictures/" + image;
  }
  if (color != "none") {
    color = "#" + color;
  }
  let activityPageJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "1px", marginTop: "5px"}
  }, "Activity"), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "5px", padding: "1px 5px"}
  }, activityInfo.label), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "1px", marginTop: "5px"}
  }, "Page"), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "5px", padding: "1px 5px"}
  }, pageInfo.label));
  if (activityInfo.isSinglePage) {
    activityPageJSX = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      style: {marginBottom: "1px", marginTop: "5px"}
    }, "Activity"), /* @__PURE__ */ React.createElement("div", {
      style: {marginBottom: "5px", padding: "1px 5px"}
    }, activityInfo.label));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {position: "relative", width: "100%", height: "135px", overflow: "hidden"}
  }, /* @__PURE__ */ React.createElement("img", {
    src: image,
    style: {position: "absolute", width: "100%", top: "50%", transform: "translateY(-50%)"}
  })), /* @__PURE__ */ React.createElement("b", null, "Editor"), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "1px", marginTop: "5px"}
  }, "Course"), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "5px", padding: "1px 5px"}
  }, course_label), activityPageJSX);
}
