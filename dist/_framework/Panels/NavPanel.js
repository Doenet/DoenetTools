import React, {createContext} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {useStackId} from "../ToolRoot.js";
import DragPanel, {handleDirection} from "./Panel.js";
const Wrapper = styled.div`
  width: 100%;
  overflow: hidden auto;
`;
export const IsNavContext = createContext(false);
export default function NavPanel({children, isInitOpen}) {
  const stackId = useStackId();
  return /* @__PURE__ */ React.createElement(IsNavContext.Provider, {
    value: true
  }, /* @__PURE__ */ React.createElement(DragPanel, {
    gridArea: "navPanel",
    id: `navPanel${stackId}`,
    direction: handleDirection.RIGHT,
    isInitOpen
  }, /* @__PURE__ */ React.createElement(Wrapper, null, children)));
}
