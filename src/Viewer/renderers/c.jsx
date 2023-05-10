import React from "react";
import useDoenetRender from "../useDoenetRenderer";

export default React.memo(function C(props) {
  let { name, id, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return (
    <code id={id} style={{ margin: "12px 0" }}>
      <a name={id} />
      {children}
    </code>
  );
});
