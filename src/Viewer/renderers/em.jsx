import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Em(props) {
  let { name, id, SVs, children } = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  return (
    <em id={id}>
      <a name={id} />
      {children}
    </em>
  );
});
