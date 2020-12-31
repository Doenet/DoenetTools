import React from "react";

export default function HeaderMenuPanelButton(props) {
  let buttonRef = React.useRef();
  return (
    <div
      ref={buttonRef}
      style={{
        height: "100%",
        width: "100%",
        borderRight: "1px solid #3d3d3d",
      }}
    >
      <div>
        <button
          style={{
            border: "none",
            textAlign: "center",
            background: "none",
            width: "100%",
            height: "60px",
          }}
          onClick={props.buttonClick}
        >
          {props.buttonText}
        </button>
      </div>
    </div>
  );
}
