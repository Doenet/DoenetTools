import React from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {searchParamAtomFamily, paramObjAtom} from "../NewToolRoot.js";
import {useSetRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
export default function EnrollStudents(props) {
  const setParamObj = useSetRecoilState(paramObjAtom);
  const driveId = "tempDriveId";
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => setParamObj({tool: "enrollment", driveId}),
    value: "Go to Enrollment"
  }, "Go to Enrollment"));
}
