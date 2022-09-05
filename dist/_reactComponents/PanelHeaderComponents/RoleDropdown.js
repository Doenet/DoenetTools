import React from "../../_snowpack/pkg/react.js";
import {atomFamily, selectorFamily, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../../_framework/NewToolRoot.js";
import {
  coursePermissionsAndSettingsByCourseId,
  courseRolePermissonsByCourseIdRoleId,
  courseRolesByCourseId
} from "../Course/CourseActions.js";
import DropdownMenu from "./DropdownMenu.js";
export const effectiveRoleIdByCourseId = atomFamily({
  key: "effectiveRoleId",
  default: null
});
export const effectivePermissionsByCourseId = selectorFamily({
  key: "effectivePermissons",
  get: (courseId) => ({get}) => {
    const roleId = get(effectiveRoleIdByCourseId(courseId));
    if (roleId !== null) {
      return get(courseRolePermissonsByCourseIdRoleId({courseId, roleId}));
    }
    return get(coursePermissionsAndSettingsByCourseId(courseId));
  }
});
export function RoleDropdown({
  label,
  width = "menu",
  maxMenuHeight = "200px",
  defaultRoleId,
  valueRoleId,
  onChange = () => {
  },
  vertical,
  disabled
}) {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId")) ?? "";
  const roles = useRecoilValue(courseRolesByCourseId(courseId));
  const valueIndex = valueRoleId ? roles.findIndex(({roleId}) => roleId === valueRoleId) : null;
  const defaultIndex = defaultRoleId ? roles.findIndex(({roleId}) => roleId === defaultRoleId) : null;
  return /* @__PURE__ */ React.createElement(DropdownMenu, {
    width,
    maxMenuHeight,
    items: roles.map(({roleLabel, roleId}) => [roleId, roleLabel]),
    label,
    defaultIndex: defaultIndex + 1,
    valueIndex: valueIndex + 1,
    onChange,
    vertical,
    disabled,
    dataTest: "RoleDropDown"
  });
}
