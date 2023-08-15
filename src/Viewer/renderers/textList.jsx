import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function TextList(props) {
  let { name, id, SVs, children } = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  if (children.length === 0 && SVs.text) {
    return (
      <React.Fragment key={id}>
        <a name={id} />
        <span id={id}>{SVs.text}</span>
      </React.Fragment>
    );
  }

  let withCommas = children
    .slice(1)
    .reduce((a, b) => [...a, ", ", b], [children[0]]);

  return (
    <React.Fragment key={id}>
      <a name={id} />
      {withCommas}
    </React.Fragment>
  );
});
