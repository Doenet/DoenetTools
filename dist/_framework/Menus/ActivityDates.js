import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  useRecoilCallback,
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {useActivity} from "../../_reactComponents/Activity/ActivityActions.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {courseIdAtom} from "../../_reactComponents/Course/CourseActions.js";
import {
  AssignedDate,
  AssignTo,
  AttemptLimit,
  AttemptAggregation,
  DueDate,
  GradeCategory,
  ItemWeights,
  Individualize,
  MakePublic,
  PinAssignment,
  ProctorMakesAvailable,
  ShowCorrectness,
  ShowCreditAchieved,
  Paginate,
  ShowFinishButton,
  ShowDoenetMLSource,
  ShowFeedback,
  ShowHints,
  ShowSolution,
  ShowSolutionInGradebook,
  TimeLimit,
  TotalPointsOrPercent
} from "../../_reactComponents/Activity/SettingComponents.js";
export default function ActivityDates() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(courseIdAtom);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AssignmentSettings, {
    doenetId,
    courseId
  }));
}
export function AssignmentSettings({doenetId, courseId}) {
  const {canModifyActivitySettings, canViewActivitySettings} = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const {
    value: {
      numberOfAttemptsAllowed,
      timeLimit,
      assignedDate,
      dueDate
    }
  } = useActivity(courseId, doenetId);
  const sharedProps = {
    courseId,
    doenetId,
    editable: canModifyActivitySettings ?? "0"
  };
  if (canViewActivitySettings === "1") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  }
  let nAttemptsAllowed = numberOfAttemptsAllowed;
  if (nAttemptsAllowed === null) {
    nAttemptsAllowed = "unlimited";
  }
  let timeLimitJSX = null;
  if (timeLimit !== null) {
    timeLimitJSX = /* @__PURE__ */ React.createElement("p", null, "Time Limit: ", timeLimit, " minutes");
  }
  let assignedDateJSX = null;
  if (assignedDate !== null) {
    assignedDateJSX = /* @__PURE__ */ React.createElement("p", {
      style: {content: "A"}
    }, "Assigned: ", assignedDate);
  }
  let dueDateJSX = /* @__PURE__ */ React.createElement("p", null, "No Due Date");
  if (dueDate !== null) {
    dueDateJSX = /* @__PURE__ */ React.createElement("p", null, "Due: ", dueDate);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, assignedDateJSX, dueDateJSX, timeLimitJSX, /* @__PURE__ */ React.createElement("p", null, "Attempts Allowed: ", nAttemptsAllowed)));
}
