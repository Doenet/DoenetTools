import CompositeComponent from './abstract/CompositeComponent';
import { postProcessCopy } from '../utils/copy';
import me from 'math-expressions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Intersection extends CompositeComponent {
  static componentType = "intersection";

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "lines",
      componentTypes: ["line"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.lineChildren = {
      returnDependencies: () => ({
        lineChildren: {
          dependencyType: "child",
          childGroups: ["lines"],
          variableNames: [
            "numericalCoeff0",
            "numericalCoeffvar1",
            "numericalCoeffvar2",
            "nDimensions"
          ]
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          lineChildren: dependencyValues.lineChildren
        }
      })
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        lineChildren: {
          dependencyType: "stateVariable",
          variableName: "lineChildren"
        }
      }),
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    }

    return stateVariableDefinitions;
  }


  static async createSerializedReplacements({ component, components, componentInfoObjects }) {

    let lineChildren = await component.stateValues.lineChildren;
    let numberLineChildren = lineChildren.length;

    if (numberLineChildren === 0) {
      return { replacements: [] };
    }

    // intersection of one object is the object itself
    if (numberLineChildren === 1) {
      let childName = lineChildren[0].componentName;
      let serializedChild = await components[childName].serialize({
        sourceAttributesToIgnoreRecursively: ["isResponse"]
      });
      if (!serializedChild.state) {
        serializedChild.state = {};
      }
      serializedChild.state.draggable = false;
      serializedChild.state.fixed = true;

      let serializedReplacements = postProcessCopy({ serializedComponents: [serializedChild], componentName: component.componentName });

      let newNamespace = component.attributes.newNamespace?.primitive;

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

    if (numberLineChildren > 2) {
      console.warn("Haven't implemented intersection for more than two objects");
      return { replacements: [] };
    }

    // for now, have only implemented for two lines
    // in 2D with constant coefficients
    let line1 = lineChildren[0];
    let line2 = lineChildren[1];


    if (line1.stateValues.nDimensions !== 2 || line2.stateValues.nDimensions !== 2) {
      console.log("Intersection of lines implemented only in 2D");
      return { replacements: [] };
    }

    // only implement for constant coefficients
    let a1 = line1.stateValues.numericalCoeffvar1;
    let b1 = line1.stateValues.numericalCoeffvar2;
    let c1 = line1.stateValues.numericalCoeff0;
    let a2 = line2.stateValues.numericalCoeffvar1;
    let b2 = line2.stateValues.numericalCoeffvar2;
    let c2 = line2.stateValues.numericalCoeff0;

    if (!(Number.isFinite(a1) && Number.isFinite(b1) && Number.isFinite(c1) &&
      Number.isFinite(a2) && Number.isFinite(b2) && Number.isFinite(c2))) {
      console.log("Intersection of lines implemented only for constant coefficients");
      return { replacements: [] };
    }

    let d = a1 * b2 - a2 * b1;

    if (Math.abs(d) < 1E-14) {
      if (Math.abs(c2 * a1 - c1 * a2) > 1E-14) {
        // parallel lines
        return { replacements: [] };
      } else if ((a1 === 0 && b1 === 0 && c1 === 0) || (a2 === 0 && b2 === 0 && c2 === 0)) {
        // at least one line not defined
        return { replacements: [] };
      } else {

        // two identical lines, return first line
        let childName = lineChildren[0].componentName;
        let serializedChild = await components[childName].serialize({
          sourceAttributesToIgnoreRecursively: ["isResponse"]
        });
        if (!serializedChild.state) {
          serializedChild.state = {};
        }
        serializedChild.state.draggable = false;
        serializedChild.state.fixed = true;

        let serializedReplacements = postProcessCopy({ serializedComponents: [serializedChild], componentName: component.componentName });

        let newNamespace = component.attributes.newNamespace?.primitive;

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
    }

    // two intersecting lines, return point
    let x = (c2 * b1 - c1 * b2) / d;
    let y = (c1 * a2 - c2 * a1) / d;
    let coords = me.fromAst(["vector", x, y]);

    let serializedReplacements = [{
      componentType: "point",
      state: { coords, draggable: false, fixed: true },
    }]

    let newNamespace = component.attributes.newNamespace?.primitive;

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: serializedReplacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });

    serializedReplacements = processResult.serializedComponents;

    return { replacements: serializedReplacements };

    // TODO: would it be preferable to send an xs attribute
    // rather than a coords state variable?
    // If so, need to change state variable change is update replacements

    // return {
    //   replacements: [{
    //     componentType: "point",
    //     attributes: {
    //       xs: {
    //         component: {
    //           componentType: "mathList",
    //           children: [{
    //             componentType: "math",
    //             state: { value: me.fromAst(x) }
    //           }, {
    //             componentType: "math",
    //             state: { value: me.fromAst(y) }
    //           }]
    //         }
    //       }
    //     },
    //     state: { draggable: false, fixed: true },
    //   }]
    // };

  }

  static async calculateReplacementChanges({ component, components, componentInfoObjects }) {

    let replacementChanges = [];

    let serializedIntersections = (await this.createSerializedReplacements({ component, components, componentInfoObjects })).replacements;

    let nNewIntersections = serializedIntersections.length;

    let recreateReplacements = true;

    if (nNewIntersections === component.replacements.length) {
      recreateReplacements = false;

      for (let ind = 0; ind < nNewIntersections; ind++) {

        if (serializedIntersections[ind].componentType !== component.replacements[ind].componentType) {

          // found a different type of replacement, so recreate from scratch
          recreateReplacements = true;
          break;
        }
        // only need to change state variables

        if (serializedIntersections[ind].state === undefined) {
          console.warn("No state by which to update intersection component, so recreating");
          recreateReplacements = true;
          break;
        }
        if (serializedIntersections[ind].componentType !== "point") {
          console.warn(`Have not implemented state changes for an intersection that results in a  ${serializedIntersections[ind].componentType}, so recreating`);
          recreateReplacements = true;
          break;
        }

        let replacementInstruction = {
          changeType: "updateStateVariables",
          component: component.replacements[ind],
          stateChanges: { coords: serializedIntersections[ind].state.coords },
        }
        replacementChanges.push(replacementInstruction);
      }

    }

    if (recreateReplacements === false) {
      return replacementChanges
    }


    // replace with new intersection
    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: serializedIntersections,
    }

    return [replacementInstruction];

  }

}