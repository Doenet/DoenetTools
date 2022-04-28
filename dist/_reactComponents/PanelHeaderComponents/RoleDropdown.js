import React from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../../_framework/NewToolRoot.js";
import {searchParamAtomFamily} from "../../_framework/NewToolRoot.js";
import {coursePermissionsAndSettingsByCourseId} from "../Course/CourseActions.js";
import DropdownMenu from "./DropdownMenu.js";
export const effectiveRoleAtom = atom({
  key: "effectiveRoleAtom",
  default: ""
});
const permittedRoleAtom = atom({
  key: "permittedRoleAtom",
  default: ""
});
const permsForDriveIdAtom = atom({
  key: "permsForDriveIdAtom",
  default: ""
});
export function RoleDropdown() {
  const {tool} = useRecoilValue(pageToolViewAtom);
  const [effectiveRole, setEffectiveRole] = useRecoilState(effectiveRoleAtom);
  const [permittedRole, setPermittedRole] = useRecoilState(permittedRoleAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId")) ?? "";
  const recoilDriveId = useRecoilValue(permsForDriveIdAtom);
  const initilizeEffectiveRole = useRecoilCallback(({set, snapshot}) => async (driveId) => {
    let role = "instructor";
    if (driveId !== "") {
      let permissionsAndSettings = await snapshot.getPromise(coursePermissionsAndSettingsByCourseId(driveId));
      if (permissionsAndSettings?.roleLabels?.[0] == "Student") {
        role = "student";
      }
    }
    set(effectiveRoleAtom, role);
    set(permsForDriveIdAtom, driveId);
    setPermittedRole(role);
  }, [setPermittedRole]);
  if (effectiveRole === "" || recoilDriveId !== courseId && courseId !== "") {
    initilizeEffectiveRole(courseId);
    return null;
  }
  if (tool === "enrollment") {
    return null;
  }
  if (permittedRole === "student") {
    return null;
  }
  let items = [
    ["instructor", "Instructor"],
    ["student", "Student"]
  ];
  let defaultIndex = 0;
  for (let [i, item] of Object.entries(items)) {
    if (item[0] === effectiveRole) {
      defaultIndex = Number(i) + 1;
      break;
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, "Role", /* @__PURE__ */ React.createElement(DropdownMenu, {
    width: "menu",
    items,
    title: "Role",
    defaultIndex,
    onChange: ({value}) => setEffectiveRole(value)
  }));
}
