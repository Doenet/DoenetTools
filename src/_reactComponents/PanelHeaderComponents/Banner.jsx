import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Banner(props) {
  const [bannerVisible, setBannerVisible] = useState("flex");

  var banner = {
    padding: "10px",
    display: `${bannerVisible}`,
    alignItems: "center",
  };

  var bannerText = {
    flexGrow: "1",
    lineHeight: "1.4",
    fontFamily: "Open Sans",
    fontSize: "16px",
  };

  var closeButton = {
    background: "none",
    border: "0px",
    marginLeft: "5px",
    padding: "0px",
    value: "Label:",
    fontFamily: "Open Sans",
    fontSize: "14px",
    cursor: "pointer",
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

  if (props.allowClose) {
    container.closeButton = (
      <button
        aria-label="Close banner"
        style={closeButton}
        onClick={() => {
          clearBanner();
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    );
  }

  return (
    <div aria-labelledby="banner-text">
      <div style={container}>
        <div style={banner}>
          <div style={bannerText} id="banner-text">
            {props.value}
          </div>
          {container.closeButton}
        </div>
      </div>
      <div style={{ padding: "5px" }}></div>
    </div>
  );
}
