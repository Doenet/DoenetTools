import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import Select from "../_snowpack/pkg/react-select.js";
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
      console.log(">>> state", state);
      console.log(">>> provided", provided);
      return {
        alignItems: "center",
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
  console.log(">>>", options);
  return /* @__PURE__ */ React.createElement(Select, {
    styles: customStyles,
    width: props.width,
    isSearchable: false,
    autoFocus: false,
    onChange: props.callBack,
    options,
    placeholder: props.title,
    closeMenuOnSelect: false,
    isMulti: props.isMulti ? props.isMulti : false
  });
};
export default DropdownMenu;
