import React from "../../_snowpack/pkg/react.js";
export default function VerticalDivider(props) {
  const verticalHeaderDivider = {
    borderRadius: "var(--mainBorderRadius)",
    borderLeft: "5px solid var(--mainBlue)",
    borderRight: "0px",
    height: props.height ? props.height : "52px",
    width: "0px",
    display: "inline-block",
    margin: "0px",
    verticalAlign: "middle",
    marginTop: props.marginTop ? props.marginTop : 0
  };
  return /* @__PURE__ */ React.createElement("div", {
    style: verticalHeaderDivider
  });
}
;
