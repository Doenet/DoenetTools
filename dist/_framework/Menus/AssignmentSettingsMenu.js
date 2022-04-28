import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {AssignmentSettings} from "./SelectedActivity.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
export default function AssignmentSettingsMenu() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  return /* @__PURE__ */ React.createElement("div", {
    style: {paddingTop: "6px", paddingBottom: "6px"}
  }, /* @__PURE__ */ React.createElement(AssignmentSettings, {
    role: "instructor",
    doenetId
  }));
}
