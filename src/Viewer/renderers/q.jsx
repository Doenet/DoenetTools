import React from "react";
import useDoenetRender from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";

export default React.memo(function Q(props) {
  let { name, id, SVs, children } = useDoenetRender(props);

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
    <>
      <a name={id} />
      &ldquo;{children}&rdquo;
    </>
  );
});
