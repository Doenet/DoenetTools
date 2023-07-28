import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Sq(props) {
  let { name, id, SVs, children } = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  return (
    <>
      <a name={id} />
      &lsquo;{children}&rsquo;
    </>
  );
});
