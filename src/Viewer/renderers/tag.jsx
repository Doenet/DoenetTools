import React from "react";
import useDoenetRender from "../useDoenetRenderer";

export default React.memo(function Tag(props) {
  let { name, id, SVs, children } = useDoenetRender(props);

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
