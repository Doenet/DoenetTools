import React, { useState, useEffect } from 'react';
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

    const [captionDisplay, setCaptionDisplay] = useState("flex");
    const [figureMargin, setFigureMargin] = useState("auto");
    const [figureDisplay, setFigureDisplay] = useState("table");

    if (!SVs.suppressFigureNameInCaption) {
      let figureName = <strong>{SVs.figureName}</strong>
      if (caption) {
        caption = <div style={{display: captionDisplay}}>{figureName}: {caption}</div>
      } else {
        caption = figureName;
      }
    }

    // Set the figure's display property to be the same as the image's display property
    useEffect(() => {
      const image = document.getElementById(id.replace("figure", "image")).parentElement; // The div surrounding the figure's image

      if (image.style.display == "inline-block") {
        setFigureDisplay("inline-block");
        setFigureMargin("12px 0");
      }
    })

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

    useEffect(() => {
      const mainPanel = document.getElementById("mainPanel"); // The div containing the main panel

      // Count the number of lines in the caption
      function countCaptionLines() {
        var el = document.getElementById(id + "_caption");
        var divHeight = el.offsetHeight;
        var lineHeight = getLineHeight(document.getElementById(id + "_caption"));
        var lines = divHeight / lineHeight;
        return lines;
      }

      // Change the display of the caption based on the number of lines in the caption
      function handleResize() {
        if (countCaptionLines() >= 2) {
          setCaptionDisplay("inline-block");
          console.log("The caption is 2 lines long!");
          console.log(captionDisplay);
        } else { 
          setCaptionDisplay("flex");
          console.log("The caption is 1 line long!"); 
          console.log(captionDisplay);
        }
      }

      // Call handleResize if the main panel is resized
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => {
          handleResize();
        });
      });

      resizeObserver.observe(mainPanel); // Watch the main panel for resizing

    });
   
    return (
      <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <figure id={id} style={{ margin: figureMargin, display: figureDisplay }}>
        <a name={id} />
        {childrenToRender}
        <figcaption id={ id + "_caption" }>{caption}</figcaption>
      </figure>
      </VisibilitySensor>
    )
})

