import React, {useState} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import DragPanel, {handleDirection} from "./Panel.js";
export default function NavPanel({children, isInitOpen, height = 120}) {
  const [visible, setVisible] = useState(isInitOpen);
  return /* @__PURE__ */ React.createElement(DragPanel, {
    gridArea: "footerPanel",
    direction: handleDirection.UP,
    panelSize: height,
    isInitOpen
  }, children);
}
