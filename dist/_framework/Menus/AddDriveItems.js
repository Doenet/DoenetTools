import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {useCourse} from "../../_reactComponents/Course/CourseActions.js";
export default function AddDriveItems() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {create} = useCourse(courseId);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => create({itemType: "activity"}),
    value: "Add Activity"
  }, "Add Activity"), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => create({itemType: "bank"}),
    value: "Add Collection"
  }), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    onClick: () => create({itemType: "section"}),
    value: "Add Section"
  }, "Add Section")));
}
