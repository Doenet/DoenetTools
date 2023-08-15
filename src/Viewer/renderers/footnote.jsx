import React, { useState } from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Footnote(props) {
  let { name, id, SVs } = useDoenetRenderer(props, false);
  let [isVisible, setIsVisible] = useState(false);

  if (SVs.hidden) {
    return null;
  }

  const footnoteMessageStyle = {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#e2e2e2",
    display: `static`,
  };
  let footnoteMessage = "";

  if (isVisible) {
    footnoteMessage = <div style={footnoteMessageStyle}>{SVs.text}</div>;
  }

  const buttonStyle = {
    backgroundColor: "white",
    border: "none",
  };

  const footnoteStyle = {
    textDecoration: "none",
    color: "#1A5A99",
  };

  return (
    <>
      <span id={id}>
        <a name={id} />
        <sup>
          <button
            style={buttonStyle}
            onClick={() => setIsVisible((was) => !was)}
          >
            <a href="#" title={SVs.text} style={footnoteStyle}>
              [{SVs.footnoteTag}]
            </a>
          </button>
        </sup>
        {footnoteMessage}
      </span>
    </>
  );
});
