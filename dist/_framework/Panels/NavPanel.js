import React, {useState, createContext} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import DragPanel, {handleDirection} from "./Panel.js";
export const IsNavContext = createContext(false);
export default function NavPanel({children, isInitOpen}) {
  const [visible, setVisible] = useState(isInitOpen);
  return /* @__PURE__ */ React.createElement(IsNavContext.Provider, {
    value: true
  }, /* @__PURE__ */ React.createElement(DragPanel, {
    gridArea: "navPanel",
    direction: handleDirection.RIGHT,
    isInitOpen
  }, children));
}
