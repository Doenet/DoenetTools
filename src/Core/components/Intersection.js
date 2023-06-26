import CompositeComponent from "./abstract/CompositeComponent";
import { convertAttributesForComponentType } from "../utils/copy";
import me from "math-expressions";
import { processAssignNames } from "../utils/serializedStateProcessing";

export default class Intersection extends CompositeComponent {
  static componentType = "intersection";

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };

    attributes.styleNumber = {
      leaveRaw: true,
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "lines",
        componentTypes: ["line", "lineSegment"],
      },
      {
        group: "circles",
        componentTypes: ["circle"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.lineChildren = {
      returnDependencies: () => ({
        lineChildren: {
          dependencyType: "child",
          childGroups: ["lines"],
          variableNames: [
            "numDimensions",
            "numericalPoints",
            "numericalEndpoints",
          ],
          variablesOptional: true,
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          lineChildren: dependencyValues.lineChildren,
        },
      }),
    };

    stateVariableDefinitions.circleChildren = {
      returnDependencies: () => ({
        circleChildren: {
          dependencyType: "child",
          childGroups: ["circles"],
          variableNames: ["numericalCenter", "numericalRadius"],
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          circleChildren: dependencyValues.circleChildren,
        },
      }),
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        lineChildren: {
          dependencyType: "stateVariable",
          variableName: "lineChildren",
        },
        circleChildren: {
          dependencyType: "stateVariable",
          variableName: "circleChildren",
        },
      }),
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    componentInfoObjects,
    flags,
  }) {
    let lines = (await component.stateValues.lineChildren).map(
      (x) => x.stateValues,
    );
    let numLines = lines.length;

    let circles = (await component.stateValues.circleChildren).map(
      (x) => x.stateValues,
    );
    let numCircles = circles.length;

    let totNums = numLines + numCircles;

    if (totNums < 2) {
      return { replacements: [] };
    } else if (totNums > 2) {
      console.warn("Haven't implemented intersection for more than two items");
      return [];
    }

    let serializedReplacements = [];

    if (numCircles === 2) {
      serializedReplacements = intersectTwoCircles(circles);
    } else if (numLines === 2) {
      serializedReplacements = intersectTwoLines(lines);
    } else {
      serializedReplacements = intersectLineAndCircle(lines[0], circles[0]);
    }

    if (serializedReplacements.length === 0) {
      return { replacements: [] };
    }

    let newNamespace = component.attributes.newNamespace?.primitive;

    let attributesToConvert = {};
    if (component.attributes.styleNumber) {
      attributesToConvert.styleNumber = component.attributes.styleNumber;
    }

    if (Object.keys(attributesToConvert).length > 0) {
      for (let repl of serializedReplacements) {
        let attributesFromComposite = convertAttributesForComponentType({
          attributes: attributesToConvert,
          componentType: repl.componentType,
          componentInfoObjects,
          compositeCreatesNewNamespace: newNamespace,
          flags,
        });

        if (!repl.attributes) {
          repl.attributes = {};
        }
        Object.assign(repl.attributes, attributesFromComposite);
      }
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: serializedReplacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });

    serializedReplacements = processResult.serializedComponents;

    return { replacements: serializedReplacements };
  }

  static async calculateReplacementChanges({
    component,
    components,
    componentInfoObjects,
    flags,
  }) {
    let replacementChanges = [];

    let serializedIntersections = (
      await this.createSerializedReplacements({
        component,
        components,
        componentInfoObjects,
        flags,
      })
    ).replacements;

    let nNewIntersections = serializedIntersections.length;

    let recreateReplacements = true;

    if (nNewIntersections === component.replacements.length) {
      recreateReplacements = false;

      for (let ind = 0; ind < nNewIntersections; ind++) {
        if (
          serializedIntersections[ind].componentType !==
          component.replacements[ind].componentType
        ) {
          // found a different type of replacement, so recreate from scratch
          recreateReplacements = true;
          break;
        }
        // only need to change state variables

        if (serializedIntersections[ind].state === undefined) {
          console.warn(
            "No state by which to update intersection component, so recreating",
          );
          recreateReplacements = true;
          break;
        }
        if (serializedIntersections[ind].componentType !== "point") {
          console.warn(
            `Have not implemented state changes for an intersection that results in a  ${serializedIntersections[ind].componentType}, so recreating`,
          );
          recreateReplacements = true;
          break;
        }

        let replacementInstruction = {
          changeType: "updateStateVariables",
          component: component.replacements[ind],
          stateChanges: { coords: serializedIntersections[ind].state.coords },
        };
        replacementChanges.push(replacementInstruction);
      }
    }

    if (recreateReplacements === false) {
      return replacementChanges;
    }

    // replace with new intersection
    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: serializedIntersections,
    };

    return [replacementInstruction];
  }
}

function intersectTwoLines(lines) {
  // for now, have only implemented for two lines
  // in 2D with constant coefficients
  let line1 = lines[0];
  let line2 = lines[1];

  if (line1.numDimensions !== 2 || line2.numDimensions !== 2) {
    console.log("Intersection of lines implemented only in 2D");
    return [];
  }

  let [[x1, y1], [x2, y2]] = line1.numericalPoints || line1.numericalEndpoints;
  let [[x3, y3], [x4, y4]] = line2.numericalPoints || line2.numericalEndpoints;

  if (
    !(
      Number.isFinite(x1) &&
      Number.isFinite(y1) &&
      Number.isFinite(x2) &&
      Number.isFinite(y2) &&
      Number.isFinite(x3) &&
      Number.isFinite(y3) &&
      Number.isFinite(x4) &&
      Number.isFinite(y4)
    )
  ) {
    console.log(
      "Intersection of circles implemented only for numerical values",
    );
    return [];
  }

  let dx12 = x1 - x2;
  let dx34 = x3 - x4;
  let dy12 = y1 - y2;
  let dy34 = y3 - y4;

  let D = dx12 * dy34 - dx34 * dy12;

  if (Math.abs(D) < 1e-14) {
    // parallel, identical or undefined lines.
    return [];
  }

  let line1isSegment = Boolean(line1.numericalEndpoints);
  let line2isSegment = Boolean(line2.numericalEndpoints);

  if (line1isSegment || line2isSegment) {
    // check if intersection point will lie on the line segment

    let dx13 = x1 - x3;
    let dy13 = y1 - y3;

    if (line1isSegment) {
      let num = (dx13 * dy34 - dy13 * dx34) * Math.sign(D);
      if (num < 0 || num > Math.abs(D)) {
        // intersection misses line segment 1
        return [];
      }
    }

    if (line2isSegment) {
      let num = (dx13 * dy12 - dy13 * dx12) * Math.sign(D);
      if (num < 0 || num > Math.abs(D)) {
        // intersection misses line segment 2
        return [];
      }
    }
  }

  let det12 = x1 * y2 - x2 * y1;
  let det34 = x3 * y4 - x4 * y3;

  let x = (det12 * dx34 - det34 * dx12) / D;
  let y = (det12 * dy34 - det34 * dy12) / D;

  let coords = me.fromAst(["vector", x, y]);

  let serializedReplacements = [
    {
      componentType: "point",
      state: { coords, draggable: false, fixed: true },
    },
  ];

  return serializedReplacements;
}

function intersectTwoCircles(circleChildren) {
  let circ1 = circleChildren[0];
  let r1 = circ1.numericalRadius;
  let [x1, y1] = circ1.numericalCenter;

  let circ2 = circleChildren[1];
  let r2 = circ2.numericalRadius;
  let [x2, y2] = circ2.numericalCenter;

  if (
    !(
      Number.isFinite(x1) &&
      Number.isFinite(y1) &&
      Number.isFinite(r1) &&
      Number.isFinite(x2) &&
      Number.isFinite(y2) &&
      Number.isFinite(r2)
    )
  ) {
    console.log(
      "Intersection of circles implemented only for numerical values",
    );
    return [];
  }

  let dx = x2 - x1;
  let dy = y2 - y1;
  let dr2 = r1 ** 2 - r2 ** 2;
  let sr2 = r1 ** 2 + r2 ** 2;

  let cDist2 = dx ** 2 + dy ** 2;

  if (cDist2 === 0) {
    // circles with identical centers
    return [];
  }

  let D = (2 * sr2) / cDist2 - dr2 ** 2 / cDist2 ** 2 - 1;

  if (D < 0) {
    // circles do not intersect
    return [];
  }

  let c = dr2 / (2 * cDist2);

  let x = (x1 + x2) / 2 + c * dx;
  let y = (y1 + y2) / 2 + c * dy;

  let intersectionPoints = [];

  if (D === 0) {
    // single point of intersection
    intersectionPoints.push([x, y]);
  } else {
    let D2 = Math.sqrt(D) / 2;

    intersectionPoints.push([x + D2 * dy, y - D2 * dx]);
    intersectionPoints.push([x - D2 * dy, y + D2 * dx]);
  }

  let serializedReplacements = intersectionPoints.map((pt) => ({
    componentType: "point",
    state: {
      coords: me.fromAst(["vector", ...pt]),
      draggable: false,
      fixed: true,
    },
  }));

  return serializedReplacements;
}

function intersectLineAndCircle(line, circle) {
  if (line.numDimensions !== 2) {
    console.log("Intersection involving lines implemented only in 2D");
    return [];
  }

  let [[x1, y1], [x2, y2]] = line.numericalPoints || line.numericalEndpoints;
  let r = circle.numericalRadius;
  let [cx, cy] = circle.numericalCenter;

  if (
    !(
      Number.isFinite(x1) &&
      Number.isFinite(y1) &&
      Number.isFinite(x2) &&
      Number.isFinite(y2) &&
      Number.isFinite(r) &&
      Number.isFinite(cx) &&
      Number.isFinite(cy)
    )
  ) {
    console.log(
      "Intersection of line and circle implemented only for numerical values",
    );
    return [];
  }

  // make everything relative to center of circle

  x1 -= cx;
  x2 -= cx;
  y1 -= cy;
  y2 -= cy;

  let dx = x2 - x1;
  let dy = y2 - y1;

  let dr2 = dx ** 2 + dy ** 2;

  if (dr2 === 0) {
    // have degenerate line
    return [];
  }

  let det = x1 * y2 - x2 * y1;
  let det2 = det ** 2;

  let D = r ** 2 * dr2 - det2;

  if (D < 0) {
    // no intersection
    return [];
  }

  let x = cx + (det * dy) / dr2;
  let y = cy - (det * dx) / dr2;

  let intersectionPoints = [];

  if (D === 0) {
    // one intersection
    intersectionPoints.push([x, y]);
  } else {
    let sqrtD = Math.sqrt(D);
    let xshift = (Math.sign(dy) * dx * sqrtD) / dr2;
    let yshift = (Math.abs(dy) * sqrtD) / dr2;

    intersectionPoints.push([x + xshift, y + yshift]);
    intersectionPoints.push([x - xshift, y - yshift]);
  }

  if (line.numericalEndpoints) {
    // have a line segment
    // need to check in intersections are between endpoints

    intersectionPoints = intersectionPoints.filter((pt) => {
      let [x, y] = pt;
      x -= cx;
      y -= cy;

      if (x2 > x1) {
        if (x < x1 || x > x2) {
          return false;
        }
      } else if (x2 < x1) {
        if (x < x2 || x > x1) {
          return false;
        }
      } else if (y2 > y1) {
        if (y < y1 || y > y2) {
          return false;
        }
      } else if (y < y2 || y > y1) {
        return false;
      }

      return true;
    });
  }

  let serializedReplacements = intersectionPoints.map((pt) => ({
    componentType: "point",
    state: {
      coords: me.fromAst(["vector", ...pt]),
      draggable: false,
      fixed: true,
    },
  }));

  return serializedReplacements;
}
