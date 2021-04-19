import React from "react";
import styled from "styled-components";
const SupportWapper = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  background-color: hsl(0, 0%, 99%);
  height: 100%;
  border-radius: 0 0 4px 4px;
`;
const ControlsWrapper = styled.div`
  overflow: auto;
  grid-area: supportControls;
  display: flex;
  gap: 4px;
  background-color: hsl(0, 0%, 89%);
  border-radius: 4px 4px 0 0;
`;
export default function SupportPanel({children, responsiveControls}) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ControlsWrapper, null, responsiveControls), /* @__PURE__ */ React.createElement(SupportWapper, null, children));
}
