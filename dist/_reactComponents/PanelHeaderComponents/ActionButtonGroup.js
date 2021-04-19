import React from "../../_snowpack/pkg/react.js";
import styled, {ThemeProvider} from "../../_snowpack/pkg/styled-components.js";
const actionGroup = {
  margin: "0px -2px 0px -2px",
  borderRadius: "0",
  padding: "0px 12px 0px 10px"
};
const ActionButtonGroup = (props) => {
  let elem = React.Children.toArray(props.children);
  if (elem.length > 1) {
    elem = [React.cloneElement(elem[0], {num: "first"})].concat(elem.slice(1, -1)).concat(React.cloneElement(elem[elem.length - 1], {num: "last"}));
  }
  return /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme: actionGroup
  }, elem);
};
export default ActionButtonGroup;
