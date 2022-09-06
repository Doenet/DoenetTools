import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Button = styled.button`
  margin: ${(props) => props.theme.margin};
  height: 24px;
  width: 100%;
  border: ${(props) => props.theme.border};
  color: white;
  background-color: ${(props) => props.alert ? "var(--mainRed)" : "var(--mainBlue)"};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: ${(props) => props.theme.padding};
  cursor: pointer;
  font-size: 12px;

  &:hover {
    // Button color lightens on hover
    color: black;
    background-color: ${(props) => props.alert ? "var(--lightRed)" : "var(--lightBlue)"};
  }

  &:focus {
    outline: 2px solid white;
    outline-offset: ${(props) => props.theme.outlineOffset};
  }
`;
Button.defaultProps = {
  theme: {
    margin: "0px 4px 0px 4px",
    borderRadius: "var(--mainBorderRadius)",
    padding: "0px 10px 0px 10px",
    border: "none",
    outlineOffset: "-4px"
  }
};
const Label = styled.p`
  font-size: 14px;
  display: ${(props) => props.labelVisible};
  margin-right: 5px;
  margin-left: 4px;
  margin-bottom: ${(props) => props.align == "flex" ? "none" : "2px"};
`;
const Container = styled.div`
  display: ${(props) => props.align};
  width: 100%;
  min-width: 0;
  align-items: center;
`;
export default function ActionButton(props) {
  const alert = props.alert ? props.alert : null;
  var container = {};
  var align = "flex";
  var actionButton = {
    value: "Action Button"
  };
  if (props.width) {
    if (props.width === "menu") {
      actionButton.width = "216px";
      if (props.label) {
        container.width = "235px";
        actionButton.width = "100%";
      }
    }
  }
  const labelVisible = props.label ? "static" : "none";
  var label = "";
  if (props.label) {
    label = props.label;
    if (props.vertical) {
      align = "static";
    }
  }
  var icon = "";
  if (props.value || props.icon) {
    if (props.value && props.icon) {
      icon = props.icon;
      actionButton.value = props.value;
    } else if (props.value) {
      actionButton.value = props.value;
    } else if (props.icon) {
      icon = props.icon;
      actionButton.value = "";
    }
  }
  if (props.num === "first") {
    actionButton.borderRadius = "5px 0px 0px 5px";
  }
  if (props.num === "last") {
    actionButton.borderRadius = "0px 5px 5px 0px";
  }
  if (props.num === "first_vert") {
    actionButton.borderRadius = "5px 5px 0px 0px";
  }
  if (props.num === "last_vert") {
    actionButton.borderRadius = "0px 0px 5px 5px";
  }
  if (props.disabled) {
    actionButton.backgroundColor = "var(--mainGray)";
    actionButton.color = "black";
    actionButton.cursor = "not-allowed";
  }
  if (props.overflow === "no_overflow") {
    actionButton.overflow = "hidden";
    actionButton.textOverflow = "ellipsis";
    actionButton.whitespace = "nowrap";
  }
  function handleClick(e) {
    if (props.onClick)
      props.onClick(e);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Container, {
    style: container,
    align
  }, /* @__PURE__ */ React.createElement(Label, {
    labelVisible,
    align
  }, label), /* @__PURE__ */ React.createElement(Button, {
    "aria-labelledby": label,
    "aria-label": actionButton.value,
    "aria-disabled": props.disabled,
    id: props.id,
    "data-test": props["data-test"],
    style: actionButton,
    alert,
    disabled: props.disabled,
    onClick: (e) => {
      if (props.disabled !== true) {
        handleClick(e);
      }
    }
  }, icon, " ", actionButton.value)));
}
