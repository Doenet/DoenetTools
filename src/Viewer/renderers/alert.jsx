import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";

export default React.memo(function Alert(props) {
  let { name, id, SVs, children } = useDoenetRenderer(props);

  if (SVs.hidden) {
    return null;
  }

  if (SVs._compositeReplacementActiveRange) {
    children = addCommasForCompositeRanges({
      children,
      compositeReplacementActiveRange: SVs._compositeReplacementActiveRange,
      startInd: 0,
      endInd: children.length - 1,
    });
  }

  return (
    <strong id={id}>
      <a name={id} />
      {children}
    </strong>
  );
});
