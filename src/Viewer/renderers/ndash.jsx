import React from "react";
import useDoenetRender from "../useDoenetRenderer";

export default React.memo(function Ndash(props) {
  let { SVs } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

  return <>&ndash;</>;
});
