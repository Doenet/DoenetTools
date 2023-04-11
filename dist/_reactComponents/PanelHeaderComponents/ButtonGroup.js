import React from "../../_snowpack/pkg/react.js";
import styled, {ThemeProvider} from "../../_snowpack/pkg/styled-components.js";
const Container = styled.div`
  display: ${(props) => props.vertical ? "static" : "flex"};
  width: ${(props) => props.width == "menu" ? "var(--menuWidth)" : ""};
  /* flex-wrap: wrap; */
  // margin: 2px 0px 2px 0px
  overflow: clip;
`;
export default function ButtonGroup(props) {
  const buttonGroup = {
    margin: "0px 2px 4px 2px",
    borderRadius: "0",
    padding: "0px 12px 0px 10px"
  };
  const verticalButtonGroup = {
    margin: "4px 4px 4px 4px",
    borderRadius: "0",
    padding: "0px 10px 0px 10px"
  };
  let elem = React.Children.toArray(props.children);
  return /* @__PURE__ */ React.createElement(Container, {
    vertical: props.vertical,
    width: props.width
  }, /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme: props.vertical ? verticalButtonGroup : buttonGroup
  }, elem));
}
;