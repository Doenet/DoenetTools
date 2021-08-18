import React from "../../_snowpack/pkg/react.js";
import Select from "../../_snowpack/pkg/react-select.js";
const DropdownMenu = (props) => {
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
    control: (provided, state) => {
      return {
        alignItems: "center",
        fontFamily: "Open Sans",
        backgroundColor: "hsl(0, 0%, 100%)",
        cursor: "default",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        label: "control",
        minHeight: 38,
        width: state.selectProps.width,
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "black",
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
    width = "235px";
  }
  console.log(options.length);
  return /* @__PURE__ */ React.createElement(Select, {
    defaultValue: options[props.defaultIndex - 1],
    styles: customStyles,
    width,
    isSearchable: false,
    autoFocus: false,
    onChange: props.onChange,
    options,
    placeholder: props.title,
    closeMenuOnSelect: true,
    isMulti: props.isMulti ? props.isMulti : false
  });
};
export default DropdownMenu;
