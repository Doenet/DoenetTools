import React, { useContext, useEffect, useState, useRef } from 'react';
import useDoenetRender from './useDoenetRenderer';
import { BoardContext } from './graph';
import me from 'math-expressions';

export default function Vector(props) {
  let { name, SVs, actions, sourceOfUpdate } = useDoenetRender(props);

  const board = useContext(BoardContext);
  const [vectorJXG, setVectorJXG] = useState({})
  const [point1JXG, setPoint1JXG] = useState({})
  const [point2JXG, setPoint2JXG] = useState({})

  let pointerAtDown = useRef(false);
  let pointsAtDown = useRef(false);
  let headBeingDragged = useRef(false);
  let tailBeingDragged = useRef(false);

  headBeingDragged.current = false;
  tailBeingDragged.current = false;


  let previousWithLabel = useRef(false);

  let lastPositionsFromCore = useRef(null);

  lastPositionsFromCore.current = SVs.numericalEndpoints;


  useEffect(() => {
    if (board) {

      if (SVs.numericalEndpoints.length === 2 &&
        SVs.numericalEndpoints.every(x => x.length === 2)
      ) {

        let layer = 10 * SVs.layer + 7;

        //things to be passed to JSXGraph as attributes
        var jsxVectorAttributes = {
          name: SVs.label,
          visible: !SVs.hidden,
          withLabel: SVs.showLabel && SVs.label !== "",
          fixed: !SVs.draggable || SVs.fixed,
          layer,
          strokeColor: SVs.selectedStyle.lineColor,
          highlightStrokeColor: SVs.selectedStyle.lineColor,
          strokeWidth: SVs.selectedStyle.lineWidth,
          highlightStrokeWidth: SVs.selectedStyle.lineWidth,
          dash: styleToDash(SVs.selectedStyle.lineStyle),
          lastArrow: { type: 1, size: 3, highlightSize: 3 },
        };


        let endpoints = [
          [...SVs.numericalEndpoints[0]],
          [...SVs.numericalEndpoints[1]]
        ];

        let jsxPointAttributes = Object.assign({}, jsxVectorAttributes);
        Object.assign(jsxPointAttributes, {
          withLabel: false,
          fillColor: 'none',
          strokeColor: 'none',
          highlightStrokeColor: 'none',
          highlightFillColor: 'lightgray',
          layer: layer + 1,
        });
        if (!SVs.draggable || SVs.fixed) {
          jsxPointAttributes.visible = false;
        }

        // create invisible points at endpoints
        let tailPointAttributes = Object.assign({}, jsxPointAttributes);
        if (!SVs.tailDraggable) {
          tailPointAttributes.visible = false;
        }
        let newPoint1JXG = board.create('point', endpoints[0], tailPointAttributes);
        let headPointAttributes = Object.assign({}, jsxPointAttributes);
        if (!SVs.headDraggable) {
          headPointAttributes.visible = false;
        }
        let newPoint2JXG = board.create('point', endpoints[1], headPointAttributes);


        let newVectorJXG = board.create('arrow', [newPoint1JXG, newPoint2JXG], jsxVectorAttributes);

        newPoint1JXG.on('drag', e => onDragHandler(e, 0, true));
        newPoint2JXG.on('drag', e => onDragHandler(e, 1, true));
        newVectorJXG.on('drag', e => onDragHandler(e, -1, true));
        newPoint1JXG.on('up', e => onDragHandler(e, 0, false));
        newPoint2JXG.on('up', e => onDragHandler(e, 1, false));
        newVectorJXG.on('up', e => {
          if (headBeingDragged.current && tailBeingDragged.current) {
            props.callAction({
              actionName: "finalizeVectorPosition",
              componentName: name,
            })
          }
        });

        newPoint1JXG.on('down', function (e) {
          headBeingDragged.current = false;
          tailBeingDragged.current = false;
        });
        newPoint2JXG.on('down', function (e) {
          headBeingDragged.current = false;
          tailBeingDragged.current = false;
        });

        // if drag vector, need to keep track of original point positions
        // so that they won't get stuck in an attractor
        newVectorJXG.on('down', function (e) {
          headBeingDragged.current = false;
          tailBeingDragged.current = false;
          pointerAtDown.current = [e.x, e.y];
          pointsAtDown.current = [
            [...newVectorJXG.point1.coords.scrCoords],
            [...newVectorJXG.point2.coords.scrCoords]
          ]
        });

        function onDragHandler(e, i, transient) {

          if (transient) {
            if (i === 0) {
              tailBeingDragged.current = true;
            } else if (i === 1) {
              headBeingDragged.current = true;
            } else {
              headBeingDragged.current = true;
              tailBeingDragged.current = true;
            }
          }
      
          let instructions = { transient, skippable: transient };
      
          let performMove = false;
      
          if (headBeingDragged.current) {
            performMove = true;
            if (i === -1) {
              instructions.headcoords = calculatePointPosition(e, 1)
            } else {
              instructions.headcoords = [newVectorJXG.point2.X(), newVectorJXG.point2.Y()];
            }
          }
          if (tailBeingDragged.current) {
            performMove = true;
            if (i === -1) {
              instructions.tailcoords = calculatePointPosition(e, 0)
            } else {
              instructions.tailcoords = [newVectorJXG.point1.X(), newVectorJXG.point1.Y()];
            }
          }
      
          if (i === 0 || i === 1) {
            instructions.sourceInformation = { vertex: i };
          }
      
          if (performMove) {
            props.callAction({
              actionName: "moveVector",
              componentName: name,
              args: instructions
            })

            newVectorJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[0]);
            newVectorJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[1]);
            if (i === 0) {
              board.updateInfobox(newPoint1JXG);
            } else if (i === 1) {
              board.updateInfobox(newPoint2JXG);
            }

          }
      
        }
      

        setVectorJXG(newVectorJXG)
        setPoint1JXG(newPoint1JXG)
        setPoint2JXG(newPoint2JXG)
      }
    } else {
      //Not on a board (Not a graph component child)
      if (window.MathJax) {
        window.MathJax.Hub.Config({ showProcessingMessages: false, "fast-preview": { disabled: true } });
        window.MathJax.Hub.processSectionDelay = 0;
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "#" + name]);
      }
    }
    //On unmount
    return () => {
      // if point is defined
      if (Object.keys(vectorJXG).length !== 0) {
        vectorJXG.off('drag');
        vectorJXG.off('down');
        vectorJXG.off('up');
        board.removeObject(vectorJXG);
        setVectorJXG({})


        point1JXG.off('drag');
        point1JXG.off('down');
        point1JXG.off('up');
        board.removeObject(point1JXG);
        setPoint1JXG({})

        point2JXG.off('drag');
        point2JXG.off('down');
        point2JXG.off('up');
        board.removeObject(point2JXG);
        setPoint2JXG({})
      }

    }
  }, [])




  if (Object.keys(vectorJXG).length !== 0) {


    if (SVs.numericalEndpoints.length === 2 &&
      SVs.numericalEndpoints.every(x => x.length === 2)
    ) {

      let validPoints = true;

      for (let coords of [SVs.numericalEndpoints[0], SVs.numericalEndpoints[1]]) {
        if (!Number.isFinite(coords[0])) {
          validPoints = false;
        }
        if (!Number.isFinite(coords[1])) {
          validPoints = false;
        }
      }

      vectorJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalEndpoints[0]);
      vectorJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, SVs.numericalEndpoints[1]);

      let visible = !SVs.hidden;

      if (validPoints) {
        vectorJXG.visProp["visible"] = visible;
        vectorJXG.visPropCalc["visible"] = visible;
        // vectorJXG.setAttribute({visible: visible})


        if (SVs.draggable && !SVs.fixed) {
          vectorJXG.visProp["fixed"] = false;

          if (SVs.tailDraggable) {
            point1JXG.visProp["visible"] = visible;
            point1JXG.visPropCalc["visible"] = visible;
            point1JXG.visProp["fixed"] = false;
          } else {
            point1JXG.visProp["visible"] = false;
            point1JXG.visPropCalc["visible"] = false;
            point1JXG.visProp["fixed"] = true;
          }

          if (SVs.headDraggable) {
            point2JXG.visProp["visible"] = visible;
            point2JXG.visPropCalc["visible"] = visible;
            point2JXG.visProp["fixed"] = false;
          } else {
            point2JXG.visProp["visible"] = false;
            point2JXG.visPropCalc["visible"] = false;
            point2JXG.visProp["fixed"] = true;
          }
        } else {
          vectorJXG.visProp["fixed"] = true;

          point1JXG.visProp["visible"] = false;
          point1JXG.visPropCalc["visible"] = false;
          point1JXG.visProp["fixed"] = true;

          point2JXG.visProp["visible"] = false;
          point2JXG.visPropCalc["visible"] = false;
          point2JXG.visProp["fixed"] = true;

        }
      }
      else {
        vectorJXG.visProp["visible"] = false;
        vectorJXG.visPropCalc["visible"] = false;
        // vectorJXG.setAttribute({visible: false})

        point1JXG.visProp["visible"] = false;
        point1JXG.visPropCalc["visible"] = false;

        point2JXG.visProp["visible"] = false;
        point2JXG.visPropCalc["visible"] = false;

      }

      if (sourceOfUpdate.sourceInformation &&
        name in sourceOfUpdate.sourceInformation
      ) {
        let sourceInfo = sourceOfUpdate.sourceInformation[name]
        if (sourceInfo.vertex === 0) {
          board.updateInfobox(point1JXG);
        } else if (sourceInfo.vertex === 1) {
          board.updateInfobox(point2JXG);
        }
      }

      vectorJXG.name = SVs.label;
      // vectorJXG.visProp.withlabel = this.showlabel && this.label !== "";

      let withlabel = SVs.showLabel && SVs.label !== "";
      if (withlabel != previousWithLabel.current) {
        this.vectorJXG.setAttribute({ withlabel: withlabel });
        previousWithLabel.current = withlabel;
      }

      vectorJXG.needsUpdate = true;
      vectorJXG.update()
      if (vectorJXG.hasLabel) {
        vectorJXG.label.needsUpdate = true;
        vectorJXG.label.update();
      }

      point1JXG.needsUpdate = true;
      point1JXG.update();
      point2JXG.needsUpdate = true;
      point2JXG.update();

      board.updateRenderer();

    }

  }



  function calculatePointPosition(e, i) {
    var o = board.origin.scrCoords;


    let calculatedX = (pointsAtDown.current[i][1] + e.x - pointerAtDown.current[0]
      - o[1]) / board.unitX;
    let calculatedY = (o[2] -
      (pointsAtDown.current[i][2] + e.y - pointerAtDown.current[1]))
      / board.unitY;
    let pointCoords = [calculatedX, calculatedY];

    return pointCoords;
  }


  if (board) {
    return <><a name={name} /></>
  }

  if (SVs.hidden) {
    return null;
  }

  let mathJaxify = "\\(" + SVs.displacementCoords + "\\)";
  return <><a name={name} /><span id={name}>{mathJaxify}</span></>
}

function styleToDash(style) {
  if (style === "solid") {
    return 0;
  } else if (style === "dashed") {
    return 2;
  } else if (style === "dotted") {
    return 1;
  } else {
    return 0;
  }
}