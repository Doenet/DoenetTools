import React, {useEffect, useState, useContext, useRef} from "../../_snowpack/pkg/react.js";
import {BoardContext} from "./graph.js";
import {retrieveMediaForCid} from "../../core/utils/retrieveMedia.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {sizeToCSS} from "./utils/css.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
import me from "../../_snowpack/pkg/math-expressions.js";
export default React.memo(function Image(props) {
  let {name, id, SVs, actions, callAction} = useDoenetRender(props, false);
  let [url, setUrl] = useState(null);
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
  const urlOrSource = (SVs.cid ? url : SVs.source) || "";
  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: {isVisible}
    });
  };
  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: {isVisible: false}
      });
    };
  }, []);
  useEffect(() => {
    if (SVs.cid) {
      retrieveMediaForCid(SVs.cid, SVs.mimeType).then((result) => {
        setUrl(result.mediaURL);
      }).catch((e) => {
      });
    }
  }, []);
  function createImageJXG() {
    let fixed = !SVs.draggable || SVs.fixed;
    let jsxImageAttributes = {
      visible: !SVs.hidden,
      fixed,
      layer: 10 * SVs.layer + 0,
      highlight: !fixed
    };
    let newAnchorPointJXG;
    try {
      let anchor = me.fromAst(SVs.anchor);
      let anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant()
      ];
      if (!Number.isFinite(anchorCoords[0])) {
        anchorCoords[0] = 0;
        jsxImageAttributes["visible"] = false;
      }
      if (!Number.isFinite(anchorCoords[1])) {
        anchorCoords[1] = 0;
        jsxImageAttributes["visible"] = false;
      }
      newAnchorPointJXG = board.create("point", anchorCoords, {visible: false});
    } catch (e) {
      jsxImageAttributes["visible"] = false;
      newAnchorPointJXG = board.create("point", [0, 0], {visible: false});
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
      offset = [-width, -height / 2];
    }
    currentOffset.current = offset;
    let newImageJXG = board.create("image", [urlOrSource, offset, [width, height]], jsxImageAttributes);
    newImageJXG.on("down", function(e) {
      pointerAtDown.current = [e.x, e.y];
      pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
      dragged.current = false;
    });
    newImageJXG.on("up", function(e) {
      if (dragged.current) {
        callAction({
          action: actions.moveImage,
          args: {
            x: calculatedX.current,
            y: calculatedY.current
          }
        });
      }
      dragged.current = false;
    });
    newImageJXG.on("drag", function(e) {
      var o = board.origin.scrCoords;
      let [xmin, ymax, xmax, ymin] = board.getBoundingBox();
      let xminAdjusted = xmin + 0.01 * (xmax - xmin) - currentOffset.current[0] - currentSize.current[0];
      let xmaxAdjusted = xmax - 0.01 * (xmax - xmin) - currentOffset.current[0];
      let yminAdjusted = ymin + 0.01 * (ymax - ymin) - currentOffset.current[1] - currentSize.current[1];
      let ymaxAdjusted = ymax - 0.01 * (ymax - ymin) - currentOffset.current[1];
      calculatedX.current = (pointAtDown.current[1] + e.x - pointerAtDown.current[0] - o[1]) / board.unitX;
      calculatedX.current = Math.min(xmaxAdjusted, Math.max(xminAdjusted, calculatedX.current));
      calculatedY.current = (o[2] - (pointAtDown.current[2] + e.y - pointerAtDown.current[1])) / board.unitY;
      calculatedY.current = Math.min(ymaxAdjusted, Math.max(yminAdjusted, calculatedY.current));
      callAction({
        action: actions.moveImage,
        args: {
          x: calculatedX.current,
          y: calculatedY.current,
          transient: true,
          skippable: true
        }
      });
      newImageJXG.relativeCoords.setCoordinates(JXG.COORDS_BY_USER, currentOffset.current);
      newAnchorPointJXG.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionFromCore.current);
      if (Math.abs(e.x - pointerAtDown.current[0]) > 0.1 || Math.abs(e.y - pointerAtDown.current[1]) > 0.1) {
        dragged.current = true;
      }
    });
    imageJXG.current = newImageJXG;
    anchorPointJXG.current = newAnchorPointJXG;
    previousPositionFromAnchor.current = SVs.positionFromAnchor;
    currentSize.current = [width, height];
  }
  if (board) {
    let anchorCoords;
    try {
      let anchor = me.fromAst(SVs.anchor);
      anchorCoords = [
        anchor.get_component(0).evaluate_to_constant(),
        anchor.get_component(1).evaluate_to_constant()
      ];
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
      let visible = !SVs.hidden;
      if (Number.isFinite(anchorCoords[0]) && Number.isFinite(anchorCoords[1])) {
        let actuallyChangedVisibility = imageJXG.current.visProp["visible"] !== visible;
        imageJXG.current.visProp["visible"] = visible;
        imageJXG.current.visPropCalc["visible"] = visible;
        if (actuallyChangedVisibility) {
          imageJXG.current.setAttribute({visible});
        }
      } else {
        imageJXG.current.visProp["visible"] = false;
        imageJXG.current.visPropCalc["visible"] = false;
      }
      let layer = 10 * SVs.layer + 0;
      let layerChanged = imageJXG.current.visProp.layer !== layer;
      if (layerChanged) {
        imageJXG.current.setAttribute({layer});
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
    return /* @__PURE__ */ React.createElement("a", {
      name: id
    });
  }
  if (SVs.hidden)
    return null;
  let outerStyle = {};
  if (SVs.displayMode === "inline") {
    outerStyle = {display: "inline-block", verticalAlign: "middle", margin: "12px 0"};
  } else {
    outerStyle = {display: "flex", justifyContent: SVs.horizontalAlign, margin: "12px 0"};
  }
  let imageStyle = {
    maxWidth: "100%",
    width: sizeToCSS(SVs.width)
  };
  if (SVs.aspectRatio > 0) {
    imageStyle.aspectRatio = String(SVs.aspectRatio);
  }
  if (!urlOrSource) {
    imageStyle.border = "var(--mainBorder)";
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    style: outerStyle
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), urlOrSource ? /* @__PURE__ */ React.createElement("img", {
    id,
    src: urlOrSource,
    style: imageStyle,
    alt: SVs.description
  }) : /* @__PURE__ */ React.createElement("div", {
    id,
    style: imageStyle
  }, SVs.description)));
});
