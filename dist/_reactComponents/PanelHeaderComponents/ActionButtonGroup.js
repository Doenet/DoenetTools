import React from "../../_snowpack/pkg/react.js";
import styled, {ThemeProvider} from "../../_snowpack/pkg/styled-components.js";
const Container = styled.div`
  margin-left: 3px;
  display: ${(props) => props.vertical ? "static" : "flex"};
  overflow: auto;
  min-width: 0;
`;
const LabelContainer = styled.div`
  display: ${(props) => props.align};
  align-items: ${(props) => props.alignItems};
`;
const Label = styled.p`
  font-size: 14px;
  display: ${(props) => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${(props) => props.align == "flex" ? "none" : "2px"};
`;
const actionGroup = {
  margin: "0px -2px 0px -2px",
  borderRadius: "0",
  padding: "0px 12px 0px 10px",
  border: "1px solid lightGray"
};
const verticalActionGroup = {
  margin: "-2px 4px -2px 4px",
  borderRadius: "0",
  padding: "0px 10px 0px 10px",
  border: "1px solid lightGray"
};
const ActionButtonGroup = (props) => {
  var container = {};
  container.width = props.width;
  if (props.width === "menu") {
    container.width = "100%";
  }
  let first_prop = props.vertical ? "first_vert" : "first";
  let last_prop = props.vertical ? "last_vert" : "last";
  let overflow_prop = props.width ? "no_overflow" : "overflow";
  let elem = React.Children.toArray(props.children);
  if (elem.length > 1) {
    elem = [
      React.cloneElement(elem[0], {num: first_prop, overflow: overflow_prop})
    ].concat(elem.slice(1, -1).map((x) => React.cloneElement(x, {overflow: overflow_prop}))).concat(React.cloneElement(elem[elem.length - 1], {
      num: last_prop,
      overflow: overflow_prop
    }));
  }
  const labelVisible = props.label ? "static" : "none";
  var label = "";
  var align = "flex";
  var alignItems = "center";
  if (props.label) {
    label = props.label;
    if (props.verticalLabel) {
      align = "static";
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LabelContainer, {
    align,
    alignItems
  }, /* @__PURE__ */ React.createElement(Label, {
    labelVisible,
    align
  }, label), /* @__PURE__ */ React.createElement(Container, {
    style: container,
    vertical: props.vertical
  }, /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme: props.vertical ? verticalActionGroup : actionGroup
  }, elem))));
};
export default ActionButtonGroup;
