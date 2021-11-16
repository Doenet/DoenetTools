import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../../_framework/NewToolRoot.js";
import {searchParamAtomFamily} from "../../_framework/NewToolRoot.js";
import {fetchDrivesQuery} from "../Drive/NewDrive.js";
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
  const path = useRecoilValue(searchParamAtomFamily("path"));
  const searchDriveId = useRecoilValue(searchParamAtomFamily("driveId"));
  const recoilDriveId = useRecoilValue(permsForDriveIdAtom);
  let driveId = "";
  if (path) {
    [driveId] = path.split(":");
  }
  if (searchDriveId !== "") {
    driveId = searchDriveId;
  }
  const initilizeEffectiveRole = useRecoilCallback(({set, snapshot}) => async (driveId2) => {
    let role = "instructor";
    if (driveId2 !== "") {
      const driveInfo = await snapshot.getPromise(fetchDrivesQuery);
      for (let drive of driveInfo.driveIdsAndLabels) {
        if (drive.driveId === driveId2) {
          if (drive.role.length === 1 && drive.role[0] === "Student") {
            role = "student";
          }
        }
      }
    } else {
      role = "student";
    }
    set(effectiveRoleAtom, role);
    set(permsForDriveIdAtom, driveId2);
    setPermittedRole(role);
  }, [driveId]);
  if (effectiveRole === "" || recoilDriveId !== driveId && driveId !== "") {
    initilizeEffectiveRole(driveId);
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
    width: "150px",
    items,
    title: "Role",
    defaultIndex,
    onChange: ({value}) => setEffectiveRole(value)
  }));
}
