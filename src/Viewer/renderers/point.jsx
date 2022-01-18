import React, {useContext, useEffect, useState, useRef} from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';

  export default function Point(props){
  let {name, SVs, actions, sourceOfUpdate} = useDoenetRender(props);

  const board = useContext(BoardContext);
  const [pointJXG,setPointJXG] = useState({})

  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);
  let previousWithLabel = useRef(null);
  let previousLabelPosition = useRef(null);

  useEffect(()=>{
    if (board){
    let fillColor = SVs.open ? "white" : SVs.selectedStyle.markerColor;

    //things to be passed to JSXGraph as attributes
    let jsxPointAttributes = {
      name: SVs.label,
      visible: !SVs.hidden,
      withLabel: SVs.showLabel && SVs.label !== "",
      fixed: !SVs.draggable || SVs.fixed,
      layer: 10 * SVs.layer + 9,
      fillColor: fillColor,
      strokeColor: SVs.selectedStyle.markerColor,
      // highlightFillColor: SVs.selectedStyle.markerColor,
      // highlightStrokeColor: SVs.selectedStyle.markerColor,
      size: SVs.selectedStyle.markerSize,
      face: normalizeStyle(SVs.selectedStyle.markerStyle),
    };

    if (SVs.showLabel && SVs.label !== "") {
      let anchorx, anchory, offset;
      if (SVs.labelPosition === "upperright") {
        offset = [5, 5];
        anchorx = "left";
        anchory = "bottom";
      } else if (SVs.labelPosition === "upperleft") {
        offset = [-5, 5];
        anchorx = "right";
        anchory = "bottom";
      } else if (SVs.labelPosition === "lowerright") {
        offset = [5, -5];
        anchorx = "left";
        anchory = "top";
      } else if (SVs.labelPosition === "lowerleft") {
        offset = [-5, -5];
        anchorx = "right";
        anchory = "top";
      } else if (SVs.labelPosition === "top") {
        offset = [0, 10];
        anchorx = "middle";
        anchory = "bottom";
      } else if (SVs.labelPosition === "bottom") {
        offset = [0, -10];
        anchorx = "middle";
        anchory = "top";
      } else if (SVs.labelPosition === "left") {
        offset = [-10, 0];
        anchorx = "right";
        anchory = "middle";
      } else {
        // labelPosition === right
        offset = [10, 0];
        anchorx = "left";
        anchory = "middle";
      }
      jsxPointAttributes.label = {
        offset,
        anchorx,
        anchory
      }
    }

    if (SVs.draggable && !SVs.fixed) {
      jsxPointAttributes.highlightFillColor = "#EEEEEE";
      jsxPointAttributes.highlightStrokeColor = "#C3D9FF";
      jsxPointAttributes.showInfoBox = SVs.showCoordsWhenDragging;
    } else {
      jsxPointAttributes.highlightFillColor = fillColor;
      jsxPointAttributes.highlightStrokeColor = SVs.selectedStyle.markerColor;
      jsxPointAttributes.showInfoBox = false;
    }

    let coords = [SVs.numericalXs[0], SVs.numericalXs[1]];

    if (!Number.isFinite(coords[0])) {
      coords[0] = 0;
      jsxPointAttributes['visible'] = false;
    }
    if (!Number.isFinite(coords[1])) {
      coords[1] = 0;
      jsxPointAttributes['visible'] = false;
    }

    let newPointJXG = board.create('point', coords, jsxPointAttributes);

    newPointJXG.on('down', function (e) {
      pointerAtDown.current =[e.x, e.y];
      pointAtDown.current = [...newPointJXG.coords.scrCoords]
      dragged.current = false;
    });

    newPointJXG.on('up', function (e) {

      if (dragged.current) {
        actions.finalizePointPosition();
      } else if(SVs.switchable && !SVs.fixed) {
        actions.switchPoint();
      }
    })

    newPointJXG.on('drag', function (e) {
      // the reason we calculate point position with this algorithm,
    // rather than using .X() and .Y() directly
    // is that attributes .X() and .Y() are affected by the
    // .setCoordinates function called in update().
    // Due to this dependence, the location of .X() and .Y()
    // can be affected by constraints of objects that the points depends on,
    // leading to a different location on up than on drag
    // (as dragging uses the mouse location)

    // TODO: find an example where need this this additional complexity

    var o = board.origin.scrCoords;

    let [xmin, ymax, xmax, ymin] = board.getBoundingBox();

    let calculatedX = (pointAtDown.current[1] + e.x - pointerAtDown.current[0]
      - o[1]) / board.unitX;
    calculatedX = Math.min(xmax, Math.max(xmin, calculatedX));

    let calculatedY = (o[2] -
      (pointAtDown.current[2] + e.y - pointerAtDown.current[1]))
      / board.unitY;
    calculatedY = Math.min(ymax, Math.max(ymin, calculatedY))

    actions.movePoint({
        x: calculatedX,
        y: calculatedY,
        transient: true,
        skippable: true,
      });

      //Protect against very small unintended drags
      if (
        Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > .1 
      ){
        dragged.current = true
      }

    });

    setPointJXG(newPointJXG)
    }else{
      //Not on a board (Not a graph component child)
      if (window.MathJax) {
        window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
        window.MathJax.Hub.processSectionDelay = 0;
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
      }
    }
    //On unmount
    return ()=>{
      // if point is defined
      if (Object.keys(pointJXG).length !== 0){
        pointJXG.off('drag');
        pointJXG.off('down');
        pointJXG.off('up');
        board.removeObject(pointJXG);
        setPointJXG({})
      }
    
    }
  },[])

  if (SVs.hidden) {
    return null;
  }

  if (Object.keys(pointJXG).length !== 0){
    //if values update
    let newFillColor = SVs.open ? "white" : SVs.selectedStyle.markerColor;
    if (pointJXG.visProp.fillcolor !== newFillColor) {
      pointJXG.visProp.fillcolor = newFillColor;
    }

    //Note label update in jsxGraph maybe slow (so check previous value)

    //if coordinates update
    let x = SVs.numericalXs[0];
    let y = SVs.numericalXs[1];

    pointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);

    let visible = !SVs.hidden;

    if (Number.isFinite(x) && Number.isFinite(y)) {
      let actuallyChangedVisibility = pointJXG.visProp["visible"] !== visible;
      pointJXG.visProp["visible"] = visible;
      pointJXG.visPropCalc["visible"] = visible;

      if (actuallyChangedVisibility) {
        // this function is incredibly slow, so don't run it if not necessary
        // TODO: figure out how to make label disappear right away so don't need to run this function
        pointJXG.setAttribute({ visible: visible })
      }
    } else {
      pointJXG.visProp["visible"] = false;
      pointJXG.visPropCalc["visible"] = false;
      // pointJXG.setAttribute({visible: false})
    }

    if (pointJXG.visProp.strokecolor !== SVs.selectedStyle.markerColor) {
      pointJXG.visProp.strokecolor = SVs.selectedStyle.markerColor;
    }

    let newFace = normalizeStyle(SVs.selectedStyle.markerStyle);
    if (pointJXG.visProp.face !== newFace) {
      pointJXG.setAttribute({ face: newFace });
    }
    if (pointJXG.visProp.size !== SVs.selectedStyle.markerSize) {
      pointJXG.visProp.size = SVs.selectedStyle.markerSize
    }

    if (SVs.draggable && !SVs.fixed) {
      pointJXG.visProp.highlightfillcolor = "#EEEEEE";
      pointJXG.visProp.highlightstrokecolor = "#C3D9FF";
      pointJXG.visProp.showinfobox = SVs.showCoordsWhenDragging;
      pointJXG.visProp.fixed = false;
    } else {
      pointJXG.visProp.highlightfillcolor = newFillColor;
      pointJXG.visProp.highlightstrokecolor = SVs.selectedStyle.markerColor;
      pointJXG.visProp.showinfobox = false;
      pointJXG.visProp.fixed = true;
    }

    //Update only when the change was initiated with this point
    if (sourceOfUpdate.sourceInformation &&
      name in sourceOfUpdate.sourceInformation
      ){
        board.updateInfobox(pointJXG);
      }

    pointJXG.name = SVs.label;

    let withlabel = SVs.showLabel && SVs.label !== "";
    if (withlabel != previousWithLabel.current) {
      pointJXG.setAttribute({ withlabel: withlabel });
      previousWithLabel.current = withlabel;
    }

    if (pointJXG.hasLabel) {
      pointJXG.label.needsUpdate = true;

      if (SVs.labelPosition !== previousLabelPosition.current) {
        let anchorx, anchory, offset;
        if (SVs.labelPosition === "upperright") {
          offset = [5, 5];
          anchorx = "left";
          anchory = "bottom";
        } else if (SVs.labelPosition === "upperleft") {
          offset = [-5, 5];
          anchorx = "right";
          anchory = "bottom";
        } else if (SVs.labelPosition === "lowerright") {
          offset = [5, -5];
          anchorx = "left";
          anchory = "top";
        } else if (SVs.labelPosition === "lowerleft") {
          offset = [-5, -5];
          anchorx = "right";
          anchory = "top";
        } else if (SVs.labelPosition === "top") {
          offset = [0, 10];
          anchorx = "middle";
          anchory = "bottom";
        } else if (SVs.labelPosition === "bottom") {
          offset = [0, -10];
          anchorx = "middle";
          anchory = "top";
        } else if (SVs.labelPosition === "left") {
          offset = [-10, 0];
          anchorx = "right";
          anchory = "middle";
        } else {
          // labelPosition === right
          offset = [10, 0];
          anchorx = "left";
          anchory = "middle";
        }
        pointJXG.label.visProp.anchorx = anchorx;
        pointJXG.label.visProp.anchory = anchory;
        pointJXG.label.visProp.offset = offset;
        previousLabelPosition.current = SVs.labelPosition;
        pointJXG.label.fullUpdate();
      } else {
        pointJXG.label.update();
      }
    }


    pointJXG.needsUpdate = true;
    pointJXG.update();
    board.updateRenderer();
  }

  if (board) {
    return <a name={name} />
  }

  //Render text coordinates when outside of graph
  if (window.MathJax) {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
  }
  
  let mathJaxify = "\\(" + SVs.coordsForDisplay.toLatex() + "\\)";
  return <><a name={name} /><span id={name}>{mathJaxify}</span></>
}

function normalizeStyle(style) {
  if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}