import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {useCourse} from "../../_reactComponents/Course/CourseActions.js";
import {useToast, toastType} from "../Toast.js";
export default function AddDriveItems() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {create} = useCourse(courseId);
  const addToast = useToast();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    dataTest: "Add Activity Button",
    onClick: () => create({itemType: "activity"}, () => {
      addToast("Activity Created!");
    }),
    value: "Add Activity"
  }, "Add Activity"), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    dataTest: "Add Collection Button",
    onClick: () => create({itemType: "bank"}, () => {
      addToast("Collection Created!");
    }),
    value: "Add Collection"
  }), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    dataTest: "Add Section Button",
    onClick: () => create({itemType: "section"}, () => {
      addToast("Section Created!");
    }),
    value: "Add Section"
  }, "Add Section")));
}
