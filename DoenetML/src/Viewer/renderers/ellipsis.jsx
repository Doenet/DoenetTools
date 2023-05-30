import React from "react";
import useDoenetRender from "../useDoenetRenderer";

export default React.memo(function Ellipsis(props) {
  let { name, id, SVs } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return (
    <>
      <a name={id} />
      &hellip;
    </>
  );
});
