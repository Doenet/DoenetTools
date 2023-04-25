import React from "react";

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
    marginTop: props.marginTop ? props.marginTop : 0,
  };

  return <div style={verticalHeaderDivider}></div>;
}
