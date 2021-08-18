import React from "../../_snowpack/pkg/react.js";
import styled, {ThemeProvider} from "../../_snowpack/pkg/styled-components.js";
const Container = styled.div`
  display: ${(props) => props.vertical ? "static" : "flex"};
  // margin: 2px 0px 2px 0px
 ;
`;
const actionGroup = {
  margin: "0px -2px 0px -2px",
  borderRadius: "0",
  padding: "0px 12px 0px 10px"
};
const verticalActionGroup = {
  margin: "-2px 0px -2px 0px",
  borderRadius: "0",
  padding: "0px 10px 0px 10px"
};
const ActionButtonGroup = (props) => {
  let first_prop = props.vertical ? "first_vert" : "first";
  let last_prop = props.vertical ? "last_vert" : "last";
  let elem = React.Children.toArray(props.children);
  if (elem.length > 1) {
    elem = [React.cloneElement(elem[0], {num: first_prop})].concat(elem.slice(1, -1)).concat(React.cloneElement(elem[elem.length - 1], {num: last_prop}));
  }
  return /* @__PURE__ */ React.createElement(Container, {
    vertical: props.vertical
  }, /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme: props.vertical ? verticalActionGroup : actionGroup
  }, elem));
};
export default ActionButtonGroup;
