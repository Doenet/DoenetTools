import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Lsq(props) {
  let { SVs } = useDoenetRenderer(props, false);

  if (SVs.hidden) {
    return null;
  }

  return <>&lsquo;</>;
});
