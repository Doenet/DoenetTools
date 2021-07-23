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
  var searchIcon = {
    margin: "6px 0px 0px 6px",
    position: "absolute",
    zIndex: "1",
    color: "#000",
    overflow: "hidden"
  };
  var cancelButton = {
    float: "right",
    margin: "6px 0px 0px 172px",
    position: "absolute",
    zIndex: "2",
    border: "0px",
    backgroundColor: "#FFF",
    visibility: `${cancelShown}`,
    color: "#000",
    overflow: "hidden",
    outline: "none"
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
  if (props.width) {
    if (props.width === "menu") {
      searchBar.width = "130px";
    }
  }
  function clearInput() {
    document.getElementById("search").value = "";
    setCancelShown("hidden");
  }
  function changeSearchTerm() {
    setSearchTerm(document.getElementById("search").value);
    setCancelShown("visible");
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {display: "table-cell"},
    onClick: () => {
      clearInput();
    }
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
    defaultValue: "Search...",
    style: searchBar,
    onKeyUp: () => {
      changeSearchTerm();
    }
  }), /* @__PURE__ */ React.createElement("div", {
    style: {padding: "3px", display: "inline"}
  }), /* @__PURE__ */ React.createElement("button", {
    style: submitButton,
    onClick: () => {
      searchSubmitAction();
    }
  }, "Search"));
}
