import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {coursePermissionsAndSettingsByCourseId} from "../../_reactComponents/Course/CourseActions.js";
import {
  AddRole,
  MangeRoles
} from "../../_reactComponents/Course/SettingComponents.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
const Conainer = styled.div`
  padding: 10px;
`;
export default function RolesEditor() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {isAdmin} = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));
  if (isAdmin !== "1")
    return null;
  return /* @__PURE__ */ React.createElement(Conainer, null, /* @__PURE__ */ React.createElement("h2", null, "Edit Role Permissons"), /* @__PURE__ */ React.createElement(AddRole, {
    courseId
  }), /* @__PURE__ */ React.createElement(MangeRoles, {
    courseId
  }));
}
