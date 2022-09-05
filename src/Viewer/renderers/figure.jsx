import React, { useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import VisibilitySensor from 'react-visibility-sensor-v2';

export default React.memo(function Figure(props) {
  let {name, id, SVs, children, actions, callAction} = useDoenetRender(props);

  let onChangeVisibility = isVisible => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible }
    })
  }

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false }
      })
    }
  }, [])

  if (SVs.hidden || !children) {
    return null;
  }

  // BADBADBAD: need to redo how getting the caption child
    // getting it using the internal guts of componentInstructions
    // is just asking for trouble
    let childrenToRender = children;

    let caption;
    if (SVs.captionChildName) {
      let captionChildInd;
      for (let [ind, child] of children.entries()) {
        if (typeof child !== "string" && child.props.componentInstructions.componentName === SVs.captionChildName) {
          captionChildInd = ind;
          break;
        }
      }
      caption = children[captionChildInd]
      childrenToRender.splice(captionChildInd, 1); // remove caption
    } else {
      caption = SVs.caption;
    }


    if (!SVs.suppressFigureNameInCaption) {
      let figureName = <strong>{SVs.figureName}</strong>
      if (caption) {
        caption = <>{figureName}: {caption}</>
      } else {
        caption = figureName;
      }
    }

    return (
      <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <figure id={id} style={{ margin: "12px 0" }}>
        <a name={id} />
        {childrenToRender}
        <figcaption id={ id + "_caption" }>{caption}</figcaption>
      </figure>
      </VisibilitySensor>
    )
})

