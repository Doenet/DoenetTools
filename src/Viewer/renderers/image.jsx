import React, { useEffect, useState, useContext, useRef } from 'react';
import { BoardContext, IMAGE_LAYER_OFFSET } from './graph';
import { retrieveMediaForCid } from '../../Core/utils/retrieveMedia';
import useDoenetRender from './useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import VisibilitySensor from 'react-visibility-sensor-v2';
import me from 'math-expressions';

export default React.memo(function Image(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props, false);
  let [url, setUrl] = useState(null)


  let imageJXG = useRef(null);
  let anchorPointJXG = useRef(null);

  const board = useContext(BoardContext);

  let pointerAtDown = useRef(false);
  let pointAtDown = useRef(false);
  let dragged = useRef(false);

  let calculatedX = useRef(null);
  let calculatedY = useRef(null);

  let lastPositionFromCore = useRef(null);
  let previousPositionFromAnchor = useRef(null);
  let currentSize = useRef(null);

  let currentOffset = useRef(null);

  let rotationTransform = useRef(null);
  let lastRotate = useRef(SVs.rotate);

  const urlOrSource = (SVs.cid ? url : SVs.source) || "";

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

  useEffect(() => {
    if (SVs.cid) {
      retrieveMediaForCid(SVs.cid, SVs.mimeType).then(result => {
        // console.log('retrieved media')
        // console.log(result)
        setUrl(result.mediaURL);
      })
        .catch((e) => {
          //Ignore errors for now
        })
    }
  }, [])


  function createImageJXG() {

    let fixed = !SVs.draggable || SVs.fixed;

    //things to be passed to JSXGraph as attributes
    let jsxImageAttributes = {
      visible: !SVs.hidden,
      fixed,
      layer: 10 * SVs.layer + IMAGE_LAYER_OFFSET,
      highlight: !fixed,
    };



    let newAnchorPointJXG;

    try {
      let anchor = me.fromAst(SVs.anchor);
      let anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant()
      ]

      if (!Number.isFinite(anchorCoords[0])) {
        anchorCoords[0] = 0;
        jsxImageAttributes['visible'] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxImageAttributes['visible'] = false;
      }

      newAnchorPointJXG = board.create('point', anchorCoords, { visible: false });


    } catch (e) {
      jsxImageAttributes['visible'] = false;
      newAnchorPointJXG = board.create('point', [0, 0], { visible: false });
    }

    jsxImageAttributes.anchor = newAnchorPointJXG;

    let width = SVs.widthForGraph?.size || 1;
    let height = width / (SVs.aspectRatio || 1);
    if (!(Number.isFinite(width) && Number.isFinite(height))) {
      width = 0;
      height = 0;
    }


    let offset;
    if (SVs.positionFromAnchor === "center") {
      offset = [-width / 2, -height / 2];
    } else if (SVs.positionFromAnchor === "lowerleft") {
      offset = [-width, -height];
    } else if (SVs.positionFromAnchor === "lowerright") {
      offset = [0, -height];
    } else if (SVs.positionFromAnchor === "upperleft") {
      offset = [-width, 0];
    } else if (SVs.positionFromAnchor === "upperright") {
      offset = [0, 0];
    } else if (SVs.positionFromAnchor === "bottom") {
      offset = [-width / 2, -height];
    } else if (SVs.positionFromAnchor === "top") {
      offset = [-width / 2, 0];
    } else if (SVs.positionFromAnchor === "right") {
      offset = [0, -height / 2];
    } else {
      // positionFromAnchor === left
      offset = [-width, -height / 2];
    }
    currentOffset.current = offset;


    let newImageJXG = board.create('image', [urlOrSource, offset, [width, height]], jsxImageAttributes);

    // tranformation code copied from jsxgraph documentation:
    // https://jsxgraph.uni-bayreuth.de/wiki/index.php?title=Images#The_JavaScript_code_5
    var tOff = board.create('transform', [
      function () {
        return -newImageJXG.X() - newImageJXG.W() * 0.5;
      }, function () {
        return -newImageJXG.Y() - newImageJXG.H() * 0.5;
      }
    ], { type: 'translate' });
    var tOffInverse = board.create('transform', [
      function () {
        return newImageJXG.X() + newImageJXG.W() * 0.5;
      }, function () {
        return newImageJXG.Y() + newImageJXG.H() * 0.5;
      }
    ], { type: 'translate' });
    var tRot = board.create('transform', [
      SVs.rotate
    ], { type: 'rotate' });


    tOff.bindTo(newImageJXG);        // Shift image to origin
    tRot.bindTo(newImageJXG);        // Rotate
    tOffInverse.bindTo(newImageJXG); // Shift image back

    rotationTransform.current = tRot;
    lastRotate.current = SVs.rotate;

    newImageJXG.on('down', function (e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;

    });

    newImageJXG.on('up', function (e) {
      if (dragged.current) {
        callAction({
          action: actions.moveImage,
          args: {
            x: calculatedX.current,
            y: calculatedY.current,
          }
        });
      }
      dragged.current = false;

    });

    newImageJXG.on('drag', function (e) {
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
      let xminAdjusted = xmin + 0.01 * (xmax - xmin) - currentOffset.current[0] - currentSize.current[0];
      let xmaxAdjusted = xmax - 0.01 * (xmax - xmin) - currentOffset.current[0];
      let yminAdjusted = ymin + 0.01 * (ymax - ymin) - currentOffset.current[1] - currentSize.current[1];
      let ymaxAdjusted = ymax - 0.01 * (ymax - ymin) - currentOffset.current[1];


      calculatedX.current = (pointAtDown.current[1] + e.x - pointerAtDown.current[0]
        - o[1]) / board.unitX;
      calculatedX.current = Math.min(xmaxAdjusted, Math.max(xminAdjusted, calculatedX.current));

      calculatedY.current = (o[2] -
        (pointAtDown.current[2] + e.y - pointerAtDown.current[1]))
        / board.unitY;
      calculatedY.current = Math.min(ymaxAdjusted, Math.max(yminAdjusted, calculatedY.current));

      callAction({
        action: actions.moveImage,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true,
        }
      });

      newImageJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, currentOffset.current);
      newAnchorPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionFromCore.current);

      //Protect against very small unintended drags
      if (Math.abs(e.x - pointerAtDown.current[0]) > .1 ||
        Math.abs(e.y - pointerAtDown.current[1]) > .1) {
        dragged.current = true;
      }

    });


    imageJXG.current = newImageJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;
    currentSize.current = [width, height];

    // need fullUpdate to get initial rotation in case image was from a blob
    imageJXG.current.fullUpdate();

  }

  if (board) {
    let anchorCoords;
    try {
      let anchor = me.fromAst(SVs.anchor);
      anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant()
      ]
    } catch (e) {
      anchorCoords = [NaN, NaN];
    }

    lastPositionFromCore.current = anchorCoords;


    if (imageJXG.current === null) {
      if (SVs.cid && !url) {
        return null;
      }
      createImageJXG();
    } else {

      anchorPointJXG.current.coords.setCoordinates(JXG.COORDS_BY_USER, anchorCoords);


      // imageJXG.current.setImage(SVs.image)

      let visible = !SVs.hidden;

      if (Number.isFinite(anchorCoords[0]) && Number.isFinite(anchorCoords[1])) {
        let actuallyChangedVisibility = imageJXG.current.visProp["visible"] !== visible;
        imageJXG.current.visProp["visible"] = visible;
        imageJXG.current.visPropCalc["visible"] = visible;

        if (actuallyChangedVisibility) {
          // this function is incredibly slow, so don't run it if not necessary
          // TODO: figure out how to make label disappear right away so don't need to run this function
          imageJXG.current.setAttribute({ visible })
        }
      } else {
        imageJXG.current.visProp["visible"] = false;
        imageJXG.current.visPropCalc["visible"] = false;
      }

      let layer = 10 * SVs.layer + IMAGE_LAYER_OFFSET;
      let layerChanged = imageJXG.current.visProp.layer !== layer;

      if (layerChanged) {
        imageJXG.current.setAttribute({ layer });
      }

      let fixed = !SVs.draggable || SVs.fixed;


      imageJXG.current.visProp.highlight = !fixed;
      imageJXG.current.visProp.fixed = fixed;

      imageJXG.current.needsUpdate = true;

      let width = SVs.widthForGraph?.size || 1;
      let height = width / (SVs.aspectRatio || 1);
      if (!(Number.isFinite(width) && Number.isFinite(height))) {
        width = 0;
        height = 0;
      }

      let sizeChanged = width !== currentSize.current[0] || height !== currentSize.current[1];

      if (sizeChanged) {
        imageJXG.current.setSize(width, height);
        currentSize.current = [width, height];
      }

      if (SVs.rotate != lastRotate.current) {
        rotationTransform.current.setMatrix(board, "rotate", [SVs.rotate]);
        lastRotate.current = SVs.rotate;
      }


      if (SVs.positionFromAnchor !== previousPositionFromAnchor.current || sizeChanged) {
        let offset;
        if (SVs.positionFromAnchor === "center") {
          offset = [-width / 2, -height / 2];
        } else if (SVs.positionFromAnchor === "lowerleft") {
          offset = [-width, -height];
        } else if (SVs.positionFromAnchor === "lowerright") {
          offset = [0, -height];
        } else if (SVs.positionFromAnchor === "upperleft") {
          offset = [-width, 0];
        } else if (SVs.positionFromAnchor === "upperright") {
          offset = [0, 0];
        } else if (SVs.positionFromAnchor === "bottom") {
          offset = [-width / 2, -height];
        } else if (SVs.positionFromAnchor === "top") {
          offset = [-width / 2, 0];
        } else if (SVs.positionFromAnchor === "right") {
          offset = [0, -height / 2];
        } else {
          // positionFromAnchor === left
          offset = [-width, -height / 2];
        }

        imageJXG.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, offset);

        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        currentOffset.current = offset;
        imageJXG.current.fullUpdate();
      } else {
        imageJXG.current.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, currentOffset.current);
        imageJXG.current.update();
      }

      anchorPointJXG.current.needsUpdate = true;
      anchorPointJXG.current.update();
      board.updateRenderer();
    }

    return <a name={id} />

  }

  // not in board

  if (SVs.hidden) return null;

  let outerStyle = {};

  if (SVs.displayMode === "inline") {
    outerStyle = { display: "inline-block", verticalAlign: "middle", margin: "12px 0" }
  } else {
    outerStyle = { display: "flex", justifyContent: SVs.horizontalAlign, margin: "12px 0" };
  }

  let imageStyle = {
    maxWidth: '100%',
    width: sizeToCSS(SVs.width),
  }

  if (SVs.aspectRatio > 0) {
    imageStyle.aspectRatio = String(SVs.aspectRatio);
  }

  if (!(urlOrSource)) {
    imageStyle.border = "var(--mainBorder)";
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div style={outerStyle}>
        <a name={id} />
        {
          urlOrSource ?
            <img
              id={id}
              src={urlOrSource}
              style={imageStyle}
              alt={SVs.description}
            />
            :
            <div
              id={id}
              style={imageStyle}
            >
              {SVs.description}
            </div>
        }
      </div>
    </VisibilitySensor>
  )

})
