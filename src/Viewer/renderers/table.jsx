import React from 'react';
import useDoenetRender from './useDoenetRenderer';

export default React.memo(function Table(props) {
  let { name, SVs, children } = useDoenetRender(props);

  if (SVs.hidden) {
    return null;
  }

    let heading = null;

    let childrenToRender = [...children];

    // BADBADBAD: need to redo how getting the title child
    // getting it using the internal guts of componentInstructions
    // is just asking for trouble

    let title;
    if (SVs.titleChildName) {
      let titleChildInd;
      for (let [ind, child] of children.entries()) {
        if (typeof child !== "string" && child.props.componentInstructions.componentName === SVs.titleChildName) {
          titleChildInd = ind;
          break;
        }
      }
      title = children[titleChildInd];
      childrenToRender.splice(titleChildInd, 1); // remove title
    } else {
      title = SVs.title;
    }

    if (!SVs.suppressTableNameInTitle) {
      let tableName = <strong>{SVs.tableName}</strong>
      if (title) {
        title = <>{tableName}: {title}</>
      } else {
        title = tableName;
      }
    }

    heading = <div id={name + "_title"}>{title}</div>

    return (
      <div id={name} style={{ margin: "12px 0" }}>
        <a name={name} />
        {heading}
        {childrenToRender}
      </div>
    )
})
