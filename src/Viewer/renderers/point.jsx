import React, {useContext, useEffect, useState, useRef} from 'react';
import DoenetRenderer from './DoenetRenderer';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';

//TODO: handle change of label position (from SVs)
// export  function Point2(props){
  export default function Point(props){
  let {name, SVs, actions} = useDoenetRender(props);

  const board = useContext(BoardContext);
  const [pointJXG,setPointJXG] = useState({})

  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);

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

    pointJXG.needsUpdate = true;
    pointJXG.update();
    board.updateRenderer();
  }

  if (board) {

    


    return <a name={name} />
  }

  //Render text coordinates when outside of graph
  if (window.MathJax) {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
  }
  
  let mathJaxify = "\\(" + SVs.coordsForDisplay.toLatex() + "\\)";
  return <><a name={name} /><span id={name}>{mathJaxify}</span></>
}




export class Point2 extends DoenetRenderer {
  // export default class Point extends DoenetRenderer {
  constructor(props) {
    super(props)

    if (props.board) {
      this.createGraphicalObject();
    }
  }

  //TODO: Do we still need this?
  static initializeChildrenOnConstruction = false;

  createGraphicalObject() {


    let fillColor = this.doenetSvData.open ? "white" : this.doenetSvData.selectedStyle.markerColor;

    //things to be passed to JSXGraph as attributes
    var jsxPointAttributes = {
      name: this.doenetSvData.label,
      visible: !this.doenetSvData.hidden,
      withLabel: this.doenetSvData.showLabel && this.doenetSvData.label !== "",
      fixed: !this.doenetSvData.draggable || this.doenetSvData.fixed,
      layer: 10 * this.doenetSvData.layer + 9,
      fillColor: fillColor,
      strokeColor: this.doenetSvData.selectedStyle.markerColor,
      // highlightFillColor: this.doenetSvData.selectedStyle.markerColor,
      // highlightStrokeColor: this.doenetSvData.selectedStyle.markerColor,
      size: this.doenetSvData.selectedStyle.markerSize,
      face: normalizeStyle(this.doenetSvData.selectedStyle.markerStyle),
    };

    if (this.doenetSvData.showLabel && this.doenetSvData.label !== "") {
      let anchorx, anchory, offset;
      if (this.doenetSvData.labelPosition === "upperright") {
        offset = [5, 5];
        anchorx = "left";
        anchory = "bottom";
      } else if (this.doenetSvData.labelPosition === "upperleft") {
        offset = [-5, 5];
        anchorx = "right";
        anchory = "bottom";
      } else if (this.doenetSvData.labelPosition === "lowerright") {
        offset = [5, -5];
        anchorx = "left";
        anchory = "top";
      } else if (this.doenetSvData.labelPosition === "lowerleft") {
        offset = [-5, -5];
        anchorx = "right";
        anchory = "top";
      } else if (this.doenetSvData.labelPosition === "top") {
        offset = [0, 10];
        anchorx = "middle";
        anchory = "bottom";
      } else if (this.doenetSvData.labelPosition === "bottom") {
        offset = [0, -10];
        anchorx = "middle";
        anchory = "top";
      } else if (this.doenetSvData.labelPosition === "left") {
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



    if (this.doenetSvData.draggable && !this.doenetSvData.fixed) {
      jsxPointAttributes.highlightFillColor = "#EEEEEE";
      jsxPointAttributes.highlightStrokeColor = "#C3D9FF";
      jsxPointAttributes.showInfoBox = this.doenetSvData.showCoordsWhenDragging;
    } else {
      jsxPointAttributes.highlightFillColor = fillColor;
      jsxPointAttributes.highlightStrokeColor = this.doenetSvData.selectedStyle.markerColor;
      jsxPointAttributes.showInfoBox = false;
    }

    let coords = [this.doenetSvData.numericalXs[0], this.doenetSvData.numericalXs[1]];

    if (!Number.isFinite(coords[0])) {
      coords[0] = 0;
      jsxPointAttributes['visible'] = false;
    }
    if (!Number.isFinite(coords[1])) {
      coords[1] = 0;
      jsxPointAttributes['visible'] = false;
    }

    this.pointJXG = this.props.board.create('point', coords, jsxPointAttributes);

    this.pointJXG.on('drag', function (e) {
      this.dragged = true;
      this.onDragHandler(e);
    }.bind(this));

    this.pointJXG.on('up', function (e) {
      if (this.dragged) {
        this.actions.finalizePointPosition();
      } else if(this.doenetSvData.switchable && !this.doenetSvData.fixed) {
        this.actions.switchPoint();
      }
    }.bind(this));

    this.pointJXG.on('down', function (e) {

      this.dragged = false;
      this.pointerAtDown = [e.x, e.y];
      this.pointAtDown =
        [...this.pointJXG.coords.scrCoords];
    }.bind(this));


    this.previousWithLabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    this.previousLabelPosition = this.doenetSvData.labelPosition;

    return this.pointJXG;

  }

  deleteGraphicalObject() {
    this.pointJXG.off('drag');
    this.pointJXG.off('down');
    this.pointJXG.off('up');
    this.props.board.removeObject(this.pointJXG);
    delete this.pointJXG;
  }

  componentWillUnmount() {
    if (this.pointJXG) {
      this.deleteGraphicalObject();
    }
  }


  // update({ x, y, changeInitiatedWithPoint, label, visible, draggable, showlabel }) {
  update({ sourceOfUpdate }) {

    if (!this.props.board) {
      this.forceUpdate();
      return;
    }

    // even points that are hidden have renderers
    // (or this could be called before createGraphicalObject
    // for dynamically added components)
    // so this could be called even for points that don't have a JXG point created
    if (this.pointJXG === undefined) {
      return;
    }

    let x = this.doenetSvData.numericalXs[0];
    let y = this.doenetSvData.numericalXs[1];

    this.pointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, [x, y]);

    let visible = !this.doenetSvData.hidden;

    if (Number.isFinite(x) && Number.isFinite(y)) {
      let actuallyChangedVisibility = this.pointJXG.visProp["visible"] !== visible;
      this.pointJXG.visProp["visible"] = visible;
      this.pointJXG.visPropCalc["visible"] = visible;

      if (actuallyChangedVisibility) {
        // this function is incredibly slow, so don't run it if not necessary
        // TODO: figure out how to make label disappear right away so don't need to run this function
        this.pointJXG.setAttribute({ visible: visible })
      }
    } else {
      this.pointJXG.visProp["visible"] = false;
      this.pointJXG.visPropCalc["visible"] = false;
      // this.pointJXG.setAttribute({visible: false})
    }

    if (this.pointJXG.visProp.strokecolor !== this.doenetSvData.selectedStyle.markerColor) {
      this.pointJXG.visProp.strokecolor = this.doenetSvData.selectedStyle.markerColor;
    }
    // let newFillColor = this.doenetSvData.open ? "white" : this.doenetSvData.selectedStyle.markerColor;
    // if (this.pointJXG.visProp.fillcolor !== newFillColor) {
    //   this.pointJXG.visProp.fillcolor = newFillColor;
    // }

    let newFace = normalizeStyle(this.doenetSvData.selectedStyle.markerStyle);
    if (this.pointJXG.visProp.face !== newFace) {
      this.pointJXG.setAttribute({ face: newFace });
    }
    if (this.pointJXG.visProp.size !== this.doenetSvData.selectedStyle.markerSize) {
      this.pointJXG.visProp.size = this.doenetSvData.selectedStyle.markerSize
    }

    if (this.doenetSvData.draggable && !this.doenetSvData.fixed) {
      this.pointJXG.visProp.highlightfillcolor = "#EEEEEE";
      this.pointJXG.visProp.highlightstrokecolor = "#C3D9FF";
      this.pointJXG.visProp.showinfobox = this.doenetSvData.showCoordsWhenDragging;
      this.pointJXG.visProp.fixed = false;
    } else {
      this.pointJXG.visProp.highlightfillcolor = newFillColor;
      this.pointJXG.visProp.highlightstrokecolor = this.doenetSvData.selectedStyle.markerColor;
      this.pointJXG.visProp.showinfobox = false;
      this.pointJXG.visProp.fixed = true;
    }

    //Update only when the change was initiated with this point
    if (sourceOfUpdate && sourceOfUpdate.sourceInformation &&
      this.componentName in sourceOfUpdate.sourceInformation
    ) {
      this.props.board.updateInfobox(this.pointJXG);
    }

    this.pointJXG.name = this.doenetSvData.label;
    // this.pointJXG.visProp.withlabel = this.showlabel && this.label !== "";

    let withlabel = this.doenetSvData.showLabel && this.doenetSvData.label !== "";
    if (withlabel != this.previousWithLabel) {
      this.pointJXG.setAttribute({ withlabel: withlabel });
      this.previousWithLabel = withlabel;
    }

    this.pointJXG.needsUpdate = true;
    this.pointJXG.update();
    if (this.pointJXG.hasLabel) {
      this.pointJXG.label.needsUpdate = true;

      if (this.doenetSvData.labelPosition !== this.previousLabelPosition) {
        let anchorx, anchory, offset;
        if (this.doenetSvData.labelPosition === "upperright") {
          offset = [5, 5];
          anchorx = "left";
          anchory = "bottom";
        } else if (this.doenetSvData.labelPosition === "upperleft") {
          offset = [-5, 5];
          anchorx = "right";
          anchory = "bottom";
        } else if (this.doenetSvData.labelPosition === "lowerright") {
          offset = [5, -5];
          anchorx = "left";
          anchory = "top";
        } else if (this.doenetSvData.labelPosition === "lowerleft") {
          offset = [-5, -5];
          anchorx = "right";
          anchory = "top";
        } else if (this.doenetSvData.labelPosition === "top") {
          offset = [0, 10];
          anchorx = "middle";
          anchory = "bottom";
        } else if (this.doenetSvData.labelPosition === "bottom") {
          offset = [0, -10];
          anchorx = "middle";
          anchory = "top";
        } else if (this.doenetSvData.labelPosition === "left") {
          offset = [-10, 0];
          anchorx = "right";
          anchory = "middle";
        } else {
          // labelPosition === right
          offset = [10, 0];
          anchorx = "left";
          anchory = "middle";
        }
        this.pointJXG.label.visProp.anchorx = anchorx;
        this.pointJXG.label.visProp.anchory = anchory;
        this.pointJXG.label.visProp.offset = offset;
        this.previousLabelPosition = this.doenetSvData.labelPosition;
        this.pointJXG.label.fullUpdate();
      } else {
        this.pointJXG.label.update();
      }

    }
    this.props.board.updateRenderer();


  }

  onDragHandler(e) {
    if (this.dragged) {
      let pointCoords = this.calculatePointPosition(e);
      this.actions.movePoint({
        x: pointCoords[0],
        y: pointCoords[1],
        transient: true,
        skippable: true,
      });
    }
  }

  calculatePointPosition(e) {

    // the reason we calculate point position with this algorithm,
    // rather than using .X() and .Y() directly
    // is that attributes .X() and .Y() are affected by the
    // .setCoordinates function called in update().
    // Due to this dependence, the location of .X() and .Y()
    // can be affected by constraints of objects that the points depends on,
    // leading to a different location on up than on drag
    // (as dragging uses the mouse location)

    // TODO: find an example where need this this additional complexity

    var o = this.props.board.origin.scrCoords;

    let [xmin, ymax, xmax, ymin] = this.props.board.getBoundingBox();

    let calculatedX = (this.pointAtDown[1] + e.x - this.pointerAtDown[0]
      - o[1]) / this.props.board.unitX;
    calculatedX = Math.min(xmax, Math.max(xmin, calculatedX));

    let calculatedY = (o[2] -
      (this.pointAtDown[2] + e.y - this.pointerAtDown[1]))
      / this.props.board.unitY;
    calculatedY = Math.min(ymax, Math.max(ymin, calculatedY))

    return [calculatedX, calculatedY]
  }


  componentDidMount() {
    if (!this.props.board) {
      if (window.MathJax) {
        window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
        window.MathJax.Hub.processSectionDelay = 0;
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
      }
    }
  }

  componentDidUpdate() {
    if (!this.props.board) {
      if (window.MathJax) {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + this.componentName]);
      }
    }
  }

  render() {


    if (this.props.board) {
      return <a name={this.componentName} />
    }

    if (this.doenetSvData.hidden) {
      return null;
    }

    let mathJaxify = "\\(" + this.doenetSvData.coordsForDisplay.toLatex() + "\\)";
    return <><a name={this.componentName} /><span id={this.componentName}>{mathJaxify}</span></>
  }
}

function normalizeStyle(style) {
  if (style === "triangle") {
    return "triangleup";
  } else {
    return style;
  }
}