import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const ContentWrapper = styled.div`
  grid-area: mainPanel;
  background-color: hsl(0, 0%, 100%);
  height: 100%;
  border-radius: 0 0 4px 4px;
  overflow: auto;
`;
const ControlsWrapper = styled.div`
  grid-area: mainControls;
  display: flex;
  gap: 4px;
  background-color: hsl(0, 0%, 89%);
  border-radius: 4px 4px 0 0;
  overflow: auto hidden;
`;
export default function MainPanel({children, responsiveControls}) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ControlsWrapper, null, responsiveControls), /* @__PURE__ */ React.createElement(ContentWrapper, null, children));
}
