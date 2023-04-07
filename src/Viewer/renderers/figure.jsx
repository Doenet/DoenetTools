import React, { useState, useEffect } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import VisibilitySensor from 'react-visibility-sensor-v2';
import Measure from 'react-measure';

export default React.memo(function Figure(props) {
  let { name, id, SVs, children, actions, callAction } = useDoenetRender(props);

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
  let caption = null; // The <div/> element holding the figureName and the caption description
  let captionChild = null; // The caption description

  if (SVs.captionChildName) {
    let captionChildInd;
    for (let [ind, child] of children.entries()) {
      //child might be null or a string
      if (child?.props?.componentInstructions.componentName === SVs.captionChildName) {
        captionChildInd = ind;
        break;
      }
    }

    captionChild = children[captionChildInd];
    childrenToRender.splice(captionChildInd, 1); // remove caption
  }

  if (!SVs.suppressFigureNameInCaption) {
    let figureName = <strong>{SVs.figureName}</strong>
    if (captionChild) {
      caption = <div>{figureName}: {captionChild}</div>
    } else {
      caption = <div>{figureName}</div>
    }
  } else {
    if (captionChild) {
      caption = <div>{captionChild}</div>
    }
  }

  const [captionTextAlign, setCaptionTextAlign] = useState("center");

  // Helper function for countCaptionLines
  function getLineHeight(el) {
    var temp = document.createElement(el.nodeName), ret;
    temp.setAttribute("style", "margin:0; padding:0; "
      + "font-family:" + (el.style.fontFamily || "inherit") + "; "
      + "font-size:" + (el.style.fontSize || "inherit"));
    temp.innerHTML = "A";

    el.parentNode.appendChild(temp);
    ret = temp.clientHeight;
    temp.parentNode.removeChild(temp);

    return ret;
  }

  // Helper function for handleResize
  // Count the number of lines in the caption
  function countCaptionLines() {
    var el = document.getElementById(id + "_caption");
    var divHeight = el.offsetHeight;
    var lineHeight = getLineHeight(document.getElementById(id + "_caption"));
    var lines = Math.round(divHeight / lineHeight);
    return lines;
  }

  // Change the display of the caption based on the number of lines in the caption
  // Same behavior as LaTeX
  function handleResize() {
    if (countCaptionLines() >= 2) {
      setCaptionTextAlign("left"); // If the caption is 2 or more lines long, it is left-aligned
    } else {
      setCaptionTextAlign("center"); // Otherwise, it is centered
    }
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <figure id={id} style={{ margin: "12px 0" }}>
        <a name={id} />
        {childrenToRender}
        <figcaption id={id + "_caption"}>
          <Measure onResize={handleResize}>
            {({ measureRef }) => (
              <div ref={measureRef} style={{ textAlign: captionTextAlign }}>
                {caption}
              </div>
            )}
          </Measure>
        </figcaption>
      </figure>
    </VisibilitySensor>
  )
})

