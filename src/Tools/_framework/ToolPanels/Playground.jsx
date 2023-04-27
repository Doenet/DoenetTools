import React from "react";
import Button from "../../../_reactComponents/PanelHeaderComponents/Button";

export default function PlaygroundTool() {
  return (
    <div style={{ gridArea: "mainPanel" }}>
      <p>hello</p>
    </div>
  );
}

export function PlayControler() {
  return <Button label="swap" />;
}
