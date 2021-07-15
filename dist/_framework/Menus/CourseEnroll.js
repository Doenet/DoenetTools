import React from "../../_snowpack/pkg/react.js";
import {useToast} from "../Toast.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function CourseEnroll(props) {
  const [toast, toastType] = useToast();
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", null, "Enter Enrollment code"), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => toast("Stub Enrolled in Course!", toastType.SUCCESS),
    value: "Enroll"
  }, "Enroll"));
}
