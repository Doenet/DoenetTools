import React, {useState} from "../../_snowpack/pkg/react.js";
import {doenetComponentForegroundInactive, doenetComponentForegroundActive} from "./theme.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faSearch, faTimes} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default function Searchbar(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelShown, setCancelShown] = useState("hidden");
  var searchBar = {
    margin: "0px",
    height: "24px",
    border: `2px solid black`,
    borderRadius: "5px",
    position: "relative",
    padding: "0px 70px 0px 30px",
    color: "#000",
    overflow: "hidden",
    width: "220px"
  };
  if (props.width) {
    if (props.width === "menu") {
      searchBar.width = "130px";
    }
  }
  let cancelLeftMargin = Number(searchBar.width.split("px")[0]) + 30 + "px";
  var cancelButton = {
    float: "right",
    margin: `6px 0px 0px ${cancelLeftMargin}`,
    position: "absolute",
    zIndex: "2",
    border: "0px",
    backgroundColor: "#FFF",
    visibility: `${cancelShown}`,
    color: "#000",
    overflow: "hidden",
    outline: "none"
  };
  var searchIcon = {
    margin: "6px 0px 0px 6px",
    position: "absolute",
    zIndex: "1",
    color: "#000",
    overflow: "hidden"
  };
  var submitButton = {
    position: "absolute",
    display: "inline",
    margin: "2px 0px 0px -58px",
    zIndex: "2",
    height: "24px",
    border: `2px hidden`,
    backgroundColor: `${doenetComponentForegroundActive}`,
    color: "#FFFFFF",
    borderRadius: "0px 3px 3px 0px",
    cursor: "pointer",
    fontSize: "12px",
    overflow: "hidden"
  };
  var disable = "";
  if (props.disabled) {
    submitButton.backgroundColor = "#e2e2e2";
    submitButton.color = "black";
    submitButton.cursor = "not-allowed";
    searchBar.cursor = "not-allowed";
    disable = "disabled";
  }
  function clearInput() {
    setSearchTerm("");
    setCancelShown("hidden");
    if (props.onChange) {
      props.onChange("");
    }
  }
  function onChange(e) {
    let val = e.target.value;
    setSearchTerm(val);
    if (val === "") {
      setCancelShown("hidden");
    } else {
      setCancelShown("visible");
    }
    if (props.onChange) {
      props.onChange(val);
    }
  }
  function searchSubmitAction() {
    if (props.onSubmit) {
      props.onSubmit(searchTerm);
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {display: "table-cell"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faSearch,
    style: searchIcon
  }), /* @__PURE__ */ React.createElement("button", {
    style: cancelButton,
    onClick: () => {
      clearInput();
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTimes
  })), /* @__PURE__ */ React.createElement("input", {
    id: "search",
    type: "text",
    placeholder: "Search...",
    style: searchBar,
    onChange,
    disabled: disable,
    value: searchTerm,
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        searchSubmitAction();
      }
    }
  }), /* @__PURE__ */ React.createElement("div", {
    style: {padding: "3px", display: "inline"}
  }), /* @__PURE__ */ React.createElement("button", {
    style: submitButton,
    onClick: searchSubmitAction
  }, "Search"));
}
