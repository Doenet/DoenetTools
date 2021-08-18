import React from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import {useSetRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
export default function EnrollStudents(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily("path"));
  const driveId = path.split(":")[0];
  return /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => setPageToolView({page: "course", tool: "enrollment", view: "", params: {driveId}}),
    value: "Go to Enrollment"
  }, "Go to Enrollment"));
}
