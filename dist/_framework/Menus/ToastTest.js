import React from "../../_snowpack/pkg/react.js";
import {useToast, toastType} from "../Toast.js";
export default function ToastTest(props) {
  const toast = useToast();
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("p", {
    style: {margin: 0}
  }, "SUCCESS"), /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      toast("hello from SUCCESS Toast!", toastType.SUCCESS);
    }
  }, "Toast!"), /* @__PURE__ */ React.createElement("p", {
    style: {margin: 0}
  }, "ERROR"), /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      toast("hello from ERROR Toast!", toastType.ERROR);
    }
  }, "Toast!"), /* @__PURE__ */ React.createElement("p", {
    style: {margin: 0}
  }, "INFO"), /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
      toast("hello from INFO Toast!", toastType.INFO);
    }
  }, "Toast!"));
}
