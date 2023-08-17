import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Tag(props) {
  let { name, id, SVs, children } = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  let open = "<";
  let close = ">";

  if (SVs.selfClosed) {
    close = "/>";
  } else if (SVs.closing) {
    open = "</";
  }

  return (
    <code id={id} style={{ color: "var(--mainGreen)" }}>
      <a name={id} />
      {open}
      {children}
      {close}
    </code>
  );
});
