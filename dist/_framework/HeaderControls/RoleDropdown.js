import React, {useRef} from "../../_snowpack/pkg/react.js";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {fetchDrivesQuery} from "../ToolHandlers/CourseToolHandler.js";
export default function RoleDropdown() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const paramPath = useRecoilValue(searchParamAtomFamily("path"));
  const driveInfo = useRecoilValueLoadable(fetchDrivesQuery);
  const setViewIfBlank = useRecoilCallback(({set, snapshot}) => async (defaultRole2) => {
    let pageToolView = await snapshot.getPromise(pageToolViewAtom);
    if (pageToolView.view === "") {
      set(pageToolViewAtom, (was) => {
        let newObj = {...was};
        newObj.view = defaultRole2;
        return newObj;
      });
    }
  });
  if (driveInfo.state === "loading") {
    return null;
  } else if (driveInfo.state === "hasError") {
    console.error(driveInfo.contents);
    return null;
  }
  let [driveId] = paramPath.split(":");
  let isLearner = false;
  for (let drive of driveInfo.contents.driveIdsAndLabels) {
    if (drive.driveId === driveId) {
      if (drive.role.length === 1 && drive.role[0] === "Student") {
        isLearner = true;
        break;
      }
    }
  }
  let defaultRole = "student";
  if (!isLearner) {
    defaultRole = "instructor";
  }
  setViewIfBlank(defaultRole);
  if (isLearner) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("select", {
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
