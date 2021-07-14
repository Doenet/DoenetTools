import React, {useState} from "../../_snowpack/pkg/react.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import styled, {ThemeProvider} from "../../_snowpack/pkg/styled-components.js";
export default function ButtonGroup(props) {
  const buttonGroup = {
    margin: "0px 2px 0px 2px",
    borderRadius: "0",
    padding: "0px 12px 0px 10px"
  };
  let elem = React.Children.toArray(props.children);
  return /* @__PURE__ */ React.createElement("div", {
    style: {display: "flex"}
  }, /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme: buttonGroup
  }, elem));
}
