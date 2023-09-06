import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Alert(props) {
  let { name, id, SVs, children } = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  return (
    <strong id={id}>
      <a name={id} />
      {children}
    </strong>
  );
});
