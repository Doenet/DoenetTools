import React from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {useCreateCourse} from "../../_reactComponents/Course/CourseActions.js";
const CreateCourse = (props) => {
  const {createCourse} = useCreateCourse();
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Create New Course",
    onClick: createCourse
  }, "Create New Course")));
};
export default CreateCourse;
