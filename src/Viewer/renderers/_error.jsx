import React from "react";
import useDoenetRender from "../useDoenetRenderer";

export default React.memo(function Error(props) {
  let { name, SVs, children } = useDoenetRender(props);

  let errorStyle = {
    backgroundColor: "#ff9999",
    textAlign: "center",
    borderWidth: 3,
    borderStyle: "solid",
  };

  return (
    <>
      <div id={name} style={errorStyle}>
        Error: {SVs.message}
      </div>
      {children}
    </>
  );
});
