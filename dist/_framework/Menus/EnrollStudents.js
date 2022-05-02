import React from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {searchParamAtomFamily, pageToolViewAtom} from "../NewToolRoot.js";
import {useSetRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
export default function EnrollStudents() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  return /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => setPageToolView({page: "course", tool: "enrollment", view: "", params: {courseId}}),
    value: "Go to Enrollment"
  }, "Go to Enrollment"));
}
