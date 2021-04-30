import React, {useState} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import DragPanel, {handleDirection} from "./Panel.js";
export default function NavPanel({children, isInitOpen}) {
  const [visible, setVisible] = useState(isInitOpen);
  return /* @__PURE__ */ React.createElement(DragPanel, {
    gridArea: "footerPanel",
    direction: handleDirection.UP,
    panelSize: 120,
    isInitOpen
  }, children);
}
