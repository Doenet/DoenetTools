import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Container = styled.div`
    display: ${(props) => props.align};
    width: auto;
    align-items: center;
`;
const Select = styled.select`
    width: ${(props) => props.width === "menu" ? "230px" : props.width};
    /* background-color: var(--lightBlue); */
    border: ${(props) => props.alert ? "2px solid var(--mainRed)" : props.disabled ? "2px solid var(--mainGray)" : "var(--mainBorder)"};
    border-radius: var(--mainBorderRadius);
    size: ${(props) => props.size};
    overflow: auto;
    cursor: ${(props) => props.disabled ? "not-allowed" : "auto"};
    &:focus {
        outline: 2px solid ${(props) => props.alert ? "var(--mainRed)" : "var(--canvastext)"};
        outline-offset: 2px;
    }
`;
const Option = styled.option`
    key: ${(props) => props.key};
    value: ${(props) => props.value};
    selected: ${(props) => props.selected};

    &:focus {
        background-color: var(--lightBlue);
    }
`;
const Label = styled.p`
    font-size: 14px;
    display: ${(props) => props.labelVisible};
    margin-right: 5px;
    margin-bottom: ${(props) => props.align == "flex" ? "none" : "2px"};
`;
export default function RelatedItems(props) {
  const labelVisible = props.label ? "static" : "none";
  const width = props.width ? props.width : "200px";
  const size = props.size ? props.size : 4;
  const alert = props.alert ? props.alert : null;
  const disabled = props.disabled ? props.disabled : null;
  const read_only = props.disabled ? true : false;
  var align = "flex";
  var label = "";
  if (props.label) {
    label = props.label;
    if (props.vertical) {
      align = "static";
    }
  }
  ;
  function handleChange(e) {
    if (props.onChange)
      props.onChange(e);
  }
  ;
  function handleClick(e) {
    if (props.onClick)
      props.onClick(e);
  }
  ;
  function handleBlur(e) {
    if (props.onBlur)
      props.onBlur(e);
  }
  ;
  function handleKeyDown(e) {
    if (props.onKeyDown)
      props.onKeyDown(e);
  }
  ;
  var options = "";
  if (props.options) {
    options = props.options;
  }
  return /* @__PURE__ */ React.createElement(Container, {
    align
  }, /* @__PURE__ */ React.createElement(Label, {
    id: "related-items-label",
    labelVisible,
    align
  }, label), /* @__PURE__ */ React.createElement(Select, {
    readOnly: read_only,
    width,
    size,
    onChange: (e) => {
      handleChange(e);
    },
    onClick: (e) => {
      handleClick(e);
    },
    onBlur: (e) => {
      handleBlur(e);
    },
    onKeyDown: (e) => {
      handleKeyDown(e);
    },
    alert,
    disabled,
    multiple: props.multiple,
    "aria-labelledby": "related-items-label",
    "aria-disabled": props.disabled ? true : false,
    role: "listbox",
    "aria-multiselectable": props.multiple
  }, options));
}
