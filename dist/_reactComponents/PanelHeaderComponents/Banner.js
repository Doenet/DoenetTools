import React, {useState} from "../../_snowpack/pkg/react.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faTimes} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default function Banner(props) {
  const [bannerVisible, setBannerVisible] = useState("flex");
  var banner = {
    padding: "10px",
    display: `${bannerVisible}`,
    alignItems: "center"
  };
  var bannerText = {
    flexGrow: "1",
    lineHeight: "1.4",
    fontFamily: "Open Sans",
    fontSize: "16px"
  };
  var closeButton = {
    background: "none",
    border: "0px",
    marginLeft: "5px",
    padding: "0px",
    value: "Label:",
    fontFamily: "Open Sans",
    fontSize: "14px",
    cursor: "pointer"
  };
  var container = {};
  switch (props.type) {
    case "ERROR":
      container.backgroundColor = "var(--mainRed)";
      container.color = "var(--canvas)";
      closeButton.color = "var(--canvas)";
      break;
    case "ALERT":
      container.backgroundColor = "var(--lightYellow)";
      break;
    case "ACTION":
      container.backgroundColor = "var(--lightBlue)";
      break;
    case "SUCCESS":
      container.backgroundColor = "var(--lightGreen)";
      break;
    default:
      container.backgroundColor = "var(--mainGreen)";
      break;
  }
  function clearBanner() {
    setBannerVisible("none");
  }
  return /* @__PURE__ */ React.createElement("div", {
    "aria-labelledby": "banner-text"
  }, /* @__PURE__ */ React.createElement("div", {
    style: container
  }, /* @__PURE__ */ React.createElement("div", {
    style: banner
  }, /* @__PURE__ */ React.createElement("div", {
    style: bannerText,
    id: "banner-text"
  }, /* @__PURE__ */ React.createElement("strong", null, "Reminder:"), " Your assignment is due tomorrow. Please contact the instructor to request an extension. Here is some more text! I am trying out this banner to see how many words I can fit. Please contact the help desk if you need any assistance. They can be reached at 651-713-8393."), /* @__PURE__ */ React.createElement("button", {
    "aria-label": "Close banner",
    style: closeButton,
    onClick: () => {
      clearBanner();
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTimes
  })))), /* @__PURE__ */ React.createElement("div", {
    style: {padding: "5px"}
  }));
}
