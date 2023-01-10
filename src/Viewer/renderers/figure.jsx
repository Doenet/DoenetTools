import React, { useState, useEffect } from 'react';
import useDoenetRender from './useDoenetRenderer';
import VisibilitySensor from 'react-visibility-sensor-v2';
import Measure from 'react-measure';

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

    let caption = SVs.caption;
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

    const [captionTextAlign, setCaptionTextAlign] = useState("center");

    if (!SVs.suppressFigureNameInCaption) {
      let figureName = <strong>{SVs.figureName}</strong>
      if (caption) {
        caption = 
          <Measure onResize={handleResize}>
            {({ measureRef }) => (
              <div ref={measureRef} style={{ textAlign: captionTextAlign }}>
                {figureName}: {SVs.caption}
              </div>
            )}
          </Measure>
      } else {
        caption = figureName;
      }
    }

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

    // Count the number of lines in the caption
    function countCaptionLines() {
      var el = document.getElementById(id + "_caption");
      var divHeight = el.offsetHeight;
      var lineHeight = getLineHeight(document.getElementById(id + "_caption"));
      var lines = Math.round(divHeight / lineHeight);
      return lines;
    }

    // Change the display of the caption based on the number of lines in the caption
    function handleResize() {
      if (countCaptionLines() >= 2) {
        setCaptionTextAlign("left");
        console.log("The caption is 2 lines long!");
      } else { 
        setCaptionTextAlign("center");
        console.log("The caption is 1 line long!"); 
      }

      console.log(captionTextAlign);
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

