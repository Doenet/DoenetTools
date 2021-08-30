import React, {useEffect} from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {fetchDrivesQuery} from "../../_reactComponents/Drive/NewDrive.js";
const driveRole = atom({
  key: "driveRole",
  default: ""
});
export default function RoleDropdown() {
  const [pageToolView, setPageToolView] = useRecoilState(pageToolViewAtom);
  let view_role = pageToolView.view;
  const drive_role = useRecoilValue(driveRole);
  const initilizeView = useRecoilCallback(({set, snapshot}) => async () => {
    const path = await snapshot.getPromise(searchParamAtomFamily("path"));
    let [driveId] = path.split(":");
    const driveInfo = await snapshot.getPromise(fetchDrivesQuery);
    let role = "instructor";
    for (let drive of driveInfo.driveIdsAndLabels) {
      if (drive.driveId === driveId) {
        if (drive.role.length === 1 && drive.role[0] === "Student") {
          role = "student";
        }
      }
    }
    set(driveRole, role);
    set(pageToolViewAtom, (was) => {
      let newObj = {...was};
      newObj.view = role;
      return newObj;
    });
  });
  useEffect(() => {
    if (view_role === "") {
      initilizeView();
    }
  }, [view_role]);
  if (drive_role !== "instructor") {
    return null;
  }
  return /* @__PURE__ */ React.createElement("select", {
    value: view_role,
    onChange: (e) => setPageToolView((was) => {
      let newObj = {...was};
      newObj.view = e.target.value;
      return newObj;
    })
  }, /* @__PURE__ */ React.createElement("option", {
    value: "instructor"
  }, "Instructor"), /* @__PURE__ */ React.createElement("option", {
    value: "student"
  }, "Student"));
}
