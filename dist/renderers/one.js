import React from "../_snowpack/pkg/react";
export default function One(props) {
  console.log(">>>props", props);
  return /* @__PURE__ */ React.createElement("div", null, "This is One ", props.text);
}
