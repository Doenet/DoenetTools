import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Ellipsis(props) {
  let { name, id, SVs } = useDoenetRenderer(props);

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
