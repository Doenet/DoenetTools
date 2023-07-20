import React from "react";
import useDoenetRender from "../useDoenetRenderer";

export default React.memo(function Error(props) {
  let { name, SVs, children } = useDoenetRender(props);

  let displayedMessage = null;

  if (SVs.showMessage) {
    let errorStyle = {
      backgroundColor: "#ff9999",
      textAlign: "center",
      borderWidth: 3,
      borderStyle: "solid",
    };
    displayedMessage = (
      <div id={name} style={errorStyle}>
        Error: {SVs.message}
      </div>
    );
  }

  return (
    <>
      {displayedMessage}
      {children}
    </>
  );
});
