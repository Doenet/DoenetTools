import React, {Suspense} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useRecoilValueLoadable} from "../../_snowpack/pkg/recoil.js";
import BreadCrumb from "../../_reactComponents/Breadcrumb/BreadCrumb.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {assignmentData, studentData} from "../ToolPanels/Gradebook.js";
export default function GradebookBreadCrumb() {
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const userId = useRecoilValue(searchParamAtomFamily("userId"));
  const attemptNumber = useRecoilValue(searchParamAtomFamily("attemptNumber"));
  const source = useRecoilValue(searchParamAtomFamily("source"));
  const path = `${driveId}:${driveId}`;
  let assignments = useRecoilValueLoadable(assignmentData);
  let students = useRecoilValueLoadable(studentData);
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading Drive...")
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      margin: "-9px 0px 0px -25px",
      maxWidth: "850px"
    }
  }, assignments.state === "hasValue" && students.state === "hasValue" ? /* @__PURE__ */ React.createElement(BreadCrumb, {
    path,
    tool: "Gradebook",
    doenetId,
    userId,
    attemptNumber,
    source,
    assignments,
    students
  }) : /* @__PURE__ */ React.createElement("p", null, "Loading...")));
}
