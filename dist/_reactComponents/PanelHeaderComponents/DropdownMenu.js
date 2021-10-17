import React from "../../_snowpack/pkg/react.js";
import Select from "../../_snowpack/pkg/react-select.js";
const DropdownMenu = (props) => {
  console.log("right ", props.right);
  const customStyles = {
    option: (provided, state) => {
      return {
        ...provided,
        color: "black",
        backgroundColor: state.isSelected ? "hsl(209,54%,82%)" : "white",
        ":active": {backgroundColor: "white"}
      };
    },
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width
    }),
    container: (provided, state) => ({
      ...provided,
      position: props.absolute ? "absolute" : "relative",
      top: props.absolute && props.top ? props.top : null,
      right: props.absolute && props.right ? props.right : null,
      left: props.absolute && props.left ? props.left : null,
      bottom: props.absolute && props.bottom ? props.bottom : null
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: "20px"
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "20px"
    }),
    control: (provided, state) => {
      return {
        margin: "0px 4px 0px 4px",
        alignItems: "center",
        fontFamily: "Open Sans",
        backgroundColor: "hsl(0, 0%, 100%)",
        cursor: "default",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        label: "control",
        minHeight: "20px",
        height: "20px",
        width: state.selectProps.width,
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: state.isDisabled ? "#e2e2e2" : "black",
        borderRadius: "5px",
        position: "relative",
        transition: "all 100ms",
        ":focus": {
          outline: "none"
        }
      };
    }
  };
  const options = props.items.map(([value, label]) => {
    return {value, label};
  });
  var width = props.width;
  if (props.width == "menu") {
    width = "210px";
  }
  return /* @__PURE__ */ React.createElement(Select, {
    value: options[props.valueIndex - 1],
    defaultValue: options[props.defaultIndex - 1],
    styles: customStyles,
    width,
    isSearchable: false,
    autoFocus: false,
    onChange: props.onChange,
    options,
    placeholder: props.title,
    closeMenuOnSelect: true,
    isMulti: props.isMulti ? props.isMulti : false,
    isDisabled: props.disabled ? true : false
  });
};
export default DropdownMenu;
