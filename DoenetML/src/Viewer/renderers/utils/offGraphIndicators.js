import { getEffectiveBoundingBox } from "./graph";

export function characterizeOffGraphPoint(coords, board) {
  let { flippedX, flippedY, xmin, xmax, ymin, ymax } =
    getEffectiveBoundingBox(board);

  let xscale = xmax - xmin;
  let yscale = ymax - ymin;

  let xminAdjusted = xmin + xscale * 0.01;
  let xmaxAdjusted = xmax - xscale * 0.01;
  let yminAdjusted = ymin + yscale * 0.01;
  let ymaxAdjusted = ymax - yscale * 0.01;

  let indicatorCoords = [...coords];
  let indicatorSides = [0, 0];

  let needIndicator = false;

  if (indicatorCoords[0] < xminAdjusted) {
    needIndicator = true;
    indicatorSides[0] = flippedX ? 1 : -1;
    indicatorCoords[0] = xminAdjusted;
  } else if (indicatorCoords[0] > xmaxAdjusted) {
    needIndicator = true;
    indicatorSides[0] = flippedX ? -1 : 1;
    indicatorCoords[0] = xmaxAdjusted;
  }

  if (indicatorCoords[1] < yminAdjusted) {
    needIndicator = true;
    indicatorSides[1] = flippedY ? 1 : -1;
    indicatorCoords[1] = yminAdjusted;
  } else if (indicatorCoords[1] > ymaxAdjusted) {
    needIndicator = true;
    indicatorSides[1] = flippedY ? -1 : 1;
    indicatorCoords[1] = ymaxAdjusted;
  }

  return {
    needIndicator,
    indicatorCoords,
    indicatorSides,
  };
}

export function characterizeOffGraphCircleArc({
  center,
  radius,
  directionToCheck,
  board,
}) {
  // check to see if the arc of the circle (determine by directionToCheck)
  // intersects the edge of the graph (adjusted inward by a buffer)

  let { flippedX, flippedY, xmin, xmax, ymin, ymax } =
    getEffectiveBoundingBox(board);

  let xSign = flippedX ? -1 : 1;
  let ySign = flippedY ? -1 : 1;

  let xscale = xmax - xmin;
  let yscale = ymax - ymin;

  let xminAdjusted = xmin + xscale * 0.01;
  let xmaxAdjusted = xmax - xscale * 0.01;
  let yminAdjusted = ymin + yscale * 0.01;
  let ymaxAdjusted = ymax - yscale * 0.01;

  let xToCheck =
    directionToCheck[0] * xSign === 1 ? xmaxAdjusted : xminAdjusted;
  let yToCheck =
    directionToCheck[1] * ySign === 1 ? ymaxAdjusted : yminAdjusted;

  let yOnVerticalEdge =
    center[1] -
    ySign *
      directionToCheck[1] *
      Math.sqrt(radius ** 2 - (xToCheck - center[0]) ** 2);

  let doubleSign = directionToCheck[1] * ySign;
  if (yOnVerticalEdge * doubleSign > yToCheck * doubleSign) {
    return {
      needIndicator: true,
      indicatorSides: directionToCheck,
      indicatorCoords: [xToCheck, yToCheck],
    };
  }

  return { needIndicator: false };
}
