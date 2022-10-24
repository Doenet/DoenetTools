import React from "../../_snowpack/pkg/react.js";
import Select from "../../_snowpack/pkg/react-select.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Container = styled.div`
    display: ${(props) => props.align};
    align-items: center;
`;
const Label = styled.p`
    font-size: 14px;
    display: ${(props) => props.labelVisible};
    margin-right: 5px;
    margin-bottom: ${(props) => props.align == "flex" ? "none" : "2px"};
`;
const DropdownMenu = (props) => {
  const customStyles = {
    option: (provided, state) => {
      return {
        ...provided,
        color: "var(--canvastext)",
        backgroundColor: state.isFocused ? "var(--lightBlue)" : state.isSelected ? "var(--mainGray)" : "var(--canvas)",
        ":active": {backgroundColor: "var(--canvas)"}
      };
    },
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      maxHeigh: state.selectProps.maxMenuHeight,
      overflow: "scroll",
      color: "var(--canvastext)",
      backgroundColor: state.isFocused ? "var(--lightBlue)" : state.isSelected ? "var(--mainGray)" : "var(--canvas)",
      ":active": {backgroundColor: "var(--canvas)"}
    }),
    container: (provided, state) => ({
      ...provided,
      position: props.absolute ? "absolute" : "relative",
      top: props.absolute && props.top ? props.top : null,
      right: props.absolute && props.right ? props.right : null,
      left: props.absolute && props.left ? props.left : null,
      bottom: props.absolute && props.bottom ? props.bottom : null,
      color: "var(--canvastext)",
      ":active": {backgroundColor: "var(--canvas)"}
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: "20px",
      color: "var(--canvastext)",
      backgroundColor: state.isFocused ? "var(--lightBlue)" : state.isSelected ? "var(--mainGray)" : "var(--canvas)",
      ":active": {backgroundColor: "var(--canvas)"}
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "20px",
      color: "var(--canvastext)",
      backgroundColor: state.isFocused ? "var(--lightBlue)" : state.isSelected ? "var(--mainGray)" : "var(--canvas)",
      ":active": {backgroundColor: "var(--canvas)"}
    }),
    singleValue: (provided, state) => {
      return {
        ...provided,
        color: "var(--canvastext)",
        backgroundColor: state.isFocused ? "var(--lightBlue)" : state.isSelected ? "var(--mainGray)" : "var(--canvas)",
        ":active": {backgroundColor: "var(--canvas)"}
      };
    },
    control: (provided, state) => {
      return {
        alignItems: "center",
        fontFamily: "Open Sans",
        color: "var(--canvastext)",
        backgroundColor: "var(--canvas)",
        cursor: state.isDisabled ? "not-allowed" : "default",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        label: "control",
        minHeight: "20px",
        height: "20px",
        width: state.selectProps.width,
        border: state.isDisabled ? "2px solid var(--mainGray)" : "var(--mainBorder)",
        borderRadius: "var(--mainBorderRadius)",
        position: "relative",
        transition: "all 100ms",
        outline: state.isFocused ? "2px solid black" : "none",
        outlineOffset: state.isFocused ? "2px" : "none"
      };
    }
  };
  const options = props.items.map(([value, label2]) => {
    return {value, label: label2};
  });
  const labelVisible = props.label ? "static" : "none";
  var width = "210px";
  var align = "flex";
  var label = "";
  if (props.label) {
    label = props.label;
    if (props.vertical) {
      align = "static";
    }
  }
  ;
  return /* @__PURE__ */ React.createElement(Container, {
    align,
    "data-test": props.dataTest
  }, /* @__PURE__ */ React.createElement(Label, {
    labelVisible,
    align
  }, label), /* @__PURE__ */ React.createElement(Select, {
    "aria-haspopup": "true",
    value: options[props.valueIndex - 1],
    defaultValue: options[props.defaultIndex - 1],
    styles: customStyles,
    width,
    maxMenuHeight: props.maxMenuHeight,
    isSearchable: false,
    autoFocus: false,
    onChange: props.onChange,
    options,
    placeholder: props.title,
    closeMenuOnSelect: true,
    isMulti: props.isMulti ? props.isMulti : false,
    isDisabled: props.disabled ? true : false,
    "aria-disabled": props.disabled ? true : false,
    "data-test": `${props.dataTest} Dropdown`
  }));
};
export default DropdownMenu;
