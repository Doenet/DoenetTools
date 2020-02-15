import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { convertValueToMathExpression } from '../utils/math';

export default class Point extends GraphicalComponent {
  constructor(args) {
    super(args);
    this.movePoint = this.movePoint.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
  }
  static componentType = "point";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["xs", "nDimensions"] };

  static primaryStateVariableForDefinition = "coordsShadow";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true };
    properties.styleDefinitions = { propagateToDescendants: true, mergeArrays: true }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneX = childLogic.newLeaf({
      name: "exactlyOneX",
      componentType: 'x',
      number: 1,
    });

    let exactlyOneY = childLogic.newLeaf({
      name: "exactlyOneY",
      componentType: 'y',
      number: 1,
    });

    let exactlyOneZ = childLogic.newLeaf({
      name: "exactlyOneZ",
      componentType: 'z',
      number: 1,
    });

    let coordinatesViaComponents = childLogic.newOperator({
      name: "coordinatesViaComponents",
      operator: "or",
      propositions: [exactlyOneX, exactlyOneY, exactlyOneZ],
    })

    let exactlyOneCoords = childLogic.newLeaf({
      name: "exactlyOneCoords",
      componentType: 'coords',
      number: 1,
    });

    let addCoords = function ({ activeChildrenMatched }) {
      let coordsChildren = [];
      for (let child of activeChildrenMatched) {
        coordsChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "coords", children: coordsChildren }],
      }
    }

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneString, atLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      affectedBySugar: ["exactlyOneCoords"],
      replacementFunction: addCoords,
    });

    let noCoords = childLogic.newLeaf({
      name: "noCoords",
      componentType: 'coords',
      number: 0,
      allowSpillover: false,
    });

    let coordsXorSugar = childLogic.newOperator({
      name: "coordsXorSugar",
      operator: 'xor',
      propositions: [coordinatesViaComponents, exactlyOneCoords, stringsAndMaths, noCoords],
    });


    let addConstraints = function ({ activeChildrenMatched }) {
      let constraintsChildren = [];
      for (let child of activeChildrenMatched) {
        constraintsChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "constraints", children: constraintsChildren }],
      }
    }


    let constraintComponents = childLogic.newLeaf({
      name: "constraintComponents",
      componentType: "_constraint",
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      affectedBySugar: ["atMostOneConstraints"],
      replacementFunction: addConstraints,

    });

    let atMostOneConstraints = childLogic.newLeaf({
      name: "atMostOneConstraints",
      componentType: "constraints",
      comparison: 'atMost',
      number: 1,
    });

    let constraintsXorConstraintsComponents = childLogic.newOperator({
      name: "constraintsXorConstraintsComponents",
      operator: "xor",
      propositions: [constraintComponents, atMostOneConstraints],
    });

    childLogic.newOperator({
      name: "pointWithConstraints",
      operator: "and",
      propositions: [coordsXorSugar, constraintsXorConstraintsComponents],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.selectedStyle = {
      returnDependencies: () => ({
        styleNumber: {
          dependencyType: "stateVariable",
          variableName: "styleNumber",
        },
        styleDefinitions: {
          dependencyType: "stateVariable",
          variableName: "styleDefinitions"
        }
      }),
      definition: function ({ dependencyValues }) {

        let selectedStyle;

        for (let styleDefinition of dependencyValues.styleDefinitions) {
          if (dependencyValues.styleNumber === styleDefinition.styleNumber) {
            if (selectedStyle === undefined) {
              selectedStyle = styleDefinition;
            } else {
              // attributes from earlier matches take precedence
              selectedStyle = Object.assign(Object.assign({}, styleDefinition), selectedStyle)
            }
          }
        }

        if (selectedStyle === undefined) {
          selectedStyle = dependencyValues.styleDefinitions[0];
        }
        return { newValues: { selectedStyle } };
      }
    }


    stateVariableDefinitions.styleDescription = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {

        let pointDescription = dependencyValues.selectedStyle.markerColor;
        if (dependencyValues.selectedStyle.markerStyle === "circle") {
          pointDescription += " point";
        } else {
          pointDescription += ` ${dependencyValues.selectedStyle.markerStyle}`
        }
        return { newValues: { styleDescription: pointDescription } };
      }
    }


    // coordsShadow will be null unless point was created
    // via an adapter or ref prop
    // In that case, given the primaryStateVariableForDefinition static variable,
    // the definition of coordsShadow will be changed to be the value
    // that shadows the component adapted or reffed
    stateVariableDefinitions.coordsShadow = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { coordsShadow: null } })
    }

    // Note: if point created via a ref (with no prop) of another point
    // definition of nDimensions will be overwritten to shadow nDimensions
    // of the other point
    // (based on static variable stateVariablesShadowedForReference)
    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        coordsShadow: {
          dependencyType: "stateVariable",
          variableName: "coordsShadow",
        },
        coordsChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneCoords",
          variableNames: ["value"],
        },
        xChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneX",
        },
        yChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneY",
        },
        zChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneZ",
        }
      }),
      definition: function ({ dependencyValues }) {

        let haveCoords = false;
        let coords;
        let nDimensions;

        if (dependencyValues.coordsChild.length == 1) {
          haveCoords = true;
          coords = dependencyValues.coordsChild[0].stateValues.value;
        } else if (dependencyValues.coordsShadow !== null) {
          haveCoords = true;
          coords = dependencyValues.coordsShadow;
        }

        if (haveCoords) {

          let coordsTree = coords.tree;
          if (Array.isArray(coordsTree) && ["tuple", "vector"].includes(coordsTree[0])) {
            nDimensions = coordsTree.length - 1;
          } else {
            nDimensions = dependencyValues.coords;
          }

        } else {

          // don't have coords, so determine from which component children have
          if (dependencyValues.zChild.length === 1) {
            nDimensions = 3;
          } else if (dependencyValues.yChild.length === 1) {
            nDimensions = 2;
          } else {
            nDimensions = 1;
          }
        }
        return { newValues: { nDimensions } };

      }
    }

    stateVariableDefinitions.arrayVariableForConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { arrayVariableForConstraints: "unconstrainedXs" } })
    }

    stateVariableDefinitions.arrayEntryPrefixForConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { arrayEntryPrefixForConstraints: "unconstrainedX" } })
    }

    stateVariableDefinitions.unconstrainedXs = {
      isArray: true,
      entryPrefixes: ["unconstrainedX"],
      returnDependencies: function ({ arrayKeys }) {
        let dependencies = {
          nDimensions: {
            dependencyType: "stateVariable",
            variableName: "nDimensions",
          },
          coordsShadow: {
            dependencyType: "stateVariable",
            variableName: "coordsShadow",
          },
          coordsChild: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneCoords",
            variableNames: ["value"],
          },
        };


        let arrayKey;
        if (arrayKeys) {
          arrayKey = arrayKeys[0];
        }
        if (arrayKey === "0" || arrayKey === undefined) {
          dependencies.xChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneX",
            variableNames: ["value"],
          };
        }
        if (arrayKey === "1" || arrayKey === undefined) {
          dependencies.yChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneY",
            variableNames: ["value"],
          };
        }
        if (arrayKey === "2" || arrayKey === undefined) {
          dependencies.zChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneZ",
            variableNames: ["value"],
          };
        }
        return dependencies;
      },
      markStale: function ({ freshByKey, changes }) {
        if (!changes.coords) {
          // if based on coords, don't need to separately track freshByKey
          // as all components become stale whenever coords changes
          if (changes.xChild) {
            delete freshByKey[0];
          }
          if (changes.yChild) {
            delete freshByKey[1];
          }
          if (changes.zChild) {
            delete freshByKey[2];
          }
        }
      },
      definition: calculateUnconstrainedXs,
      inverseDefinition: invertUnconstrainedXs,

    }


    stateVariableDefinitions.xs = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["x"],
      returnDependencies: function ({ arrayKeys }) {
        let dependencies = {
          nDimensions: {
            dependencyType: "stateVariable",
            variableName: "nDimensions",
          },
        };

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }
        if (arrayKey !== undefined) {
          dependencies[`unconstrainedX${arrayKey + 1}`] = {
            dependencyType: "stateVariable",
            variableName: `unconstrainedX${arrayKey + 1}`,
          };
          dependencies.constraintsChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneConstraints",
            variableNames: [`constraintResult${arrayKey + 1}`]
          }
        } else {
          dependencies.unconstrainedXs = {
            dependencyType: "stateVariable",
            variableName: "unconstrainedXs"
          }
          dependencies.constraintsChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneConstraints",
            variableNames: ["constraintResults"],
          }
        }
        return dependencies;
      },

      definition: function ({ dependencyValues, arrayKeys, freshByKey }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          if (dependencyValues.constraintsChild.length === 1) {
            return {
              newValues: {
                xs:
                  dependencyValues.constraintsChild[0].stateValues.constraintResults
                    .map(x => convertValueToMathExpression(x))
              }
            }
          } else {
            return {
              newValues: { xs: dependencyValues.unconstrainedXs }
            }
          }
        } else {
          if (dependencyValues.constraintsChild.length === 1) {
            return {
              newValues: {
                xs:
                {
                  [arrayKey]:
                    convertValueToMathExpression(
                      dependencyValues.constraintsChild[0].stateValues[`constraintResult${arrayKey + 1}`]
                    )
                }
              }
            }
          } else {
            return {
              newValues: {
                xs: {
                  [arrayKey]: dependencyValues[`unconstrainedX${arrayKey + 1}`]
                }
              }
            }
          }

        }

      },

      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        stateValues, initialChange, arrayKeys }) {

        // console.log('invert xs')
        // console.log(desiredStateVariableValues);
        // console.log(dependencyValues);

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }


        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          // working with entire array
          if (dependencyValues.constraintsChild.length === 1) {
            return {
              success: true,
              instructions: [{
                setDependency: "constraintsChild",
                desiredValue: desiredStateVariableValues.xs,
                childIndex: 0,
                variableIndex: 0,
              }]
            }
          } else {

            return {
              success: true,
              instructions: [{
                setDependency: "unconstrainedXs",
                desiredValue: desiredStateVariableValues.xs,
              }]
            }
          }
        } else {

          if (dependencyValues.constraintsChild.length === 1) {
            return {
              success: true,
              instructions: [{
                setDependency: "constraintsChild",
                desiredValue: desiredStateVariableValues.xs[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              }]
            }
          } else {
            return {
              success: true,
              instructions: [{
                setDependency: `unconstrainedX${arrayKey + 1}`,
                desiredValue: desiredStateVariableValues.xs[arrayKey],
              }]
            }
          }

        }
      }
    }

    stateVariableDefinitions.x = {
      isAlias: true,
      targetVariableName: "x1"
    };

    stateVariableDefinitions.y = {
      isAlias: true,
      targetVariableName: "x2"
    };

    stateVariableDefinitions.z = {
      isAlias: true,
      targetVariableName: "x3"
    };

    stateVariableDefinitions.coords = {
      public: true,
      componentType: "coords",
      returnDependencies: () => ({
        xs: {
          dependencyType: "stateVariable",
          variableName: "xs",
        }
      }),
      definition: function ({ dependencyValues }) {
        let coordsAst = [];
        for (let v of dependencyValues.xs) {
          coordsAst.push(v.tree);
        }
        if (coordsAst.length > 1) {
          coordsAst = ["tuple", ...coordsAst];
        } else {
          coordsAst = coordsAst[0];
        }

        return { newValues: { coords: me.fromAst(coordsAst) } }
      },

      inverseDefinition: function ({ desiredStateVariableValues, stateValues, initialChange }) {
        // console.log("invertCoords");
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues);
        // console.log(stateValues);

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }

        let instructions = [];

        let desiredXValues = {};

        let coordsTree = desiredStateVariableValues.coords.tree;

        if (!(Array.isArray(coordsTree) && ["tuple", "vector"].includes(coordsTree[0]))) {
          desiredXValues[0] = desiredStateVariableValues.coords;
        } else {
          for (let i = 0; i < coordsTree.length - 1; i++) {
            let desiredValue = desiredStateVariableValues.coords.get_component(i);
            if (desiredValue.tree !== undefined) {
              desiredXValues[i] = desiredValue;
            }
          }
        }

        instructions.push({
          setDependency: "xs",
          desiredValue: desiredXValues,
        });

        return {
          success: true,
          instructions,
        }

      }

    }

    stateVariableDefinitions.constraintUsed = {
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({
        constraintsChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneConstraints",
          variableNames: ["constraintUsed"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.constraintsChild.length === 0) {
          return { newValues: { constraintUsed: false } }
        } else {
          return {
            newValues: {
              constraintUsed:
                dependencyValues.constraintsChild[0].stateValues.constraintUsed
            }
          }

        }
      }
    }



    stateVariableDefinitions.numericalXs = {
      public: true,
      componentType: "number",
      isArray: true,
      entryPrefixes: ["numericalX"],
      returnDependencies: function ({ arrayKeys }) {
        let dependencies = {};

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }
        if (arrayKey !== undefined) {
          dependencies[`x${arrayKey + 1}`] = {
            dependencyType: "stateVariable",
            variableName: `x${arrayKey + 1}`,
          };
        } else {
          dependencies.xs = {
            dependencyType: "stateVariable",
            variableName: "xs"
          }
        }
        return dependencies;
      },

      definition: function ({ dependencyValues, arrayKeys, freshByKey }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          return {
            newValues: { numericalXs: dependencyValues.xs.map(x => x.evaluate_to_constant()) }
          }
        } else {
          return {
            newValues: {
              numericalXs: {
                [arrayKey]: dependencyValues[`xs${arrayKey + 1}`].evaluate_to_constant()
              }
            }
          }
        }
      },

    }


    return stateVariableDefinitions;
  }


  adapters = ["coords"];

  movePoint({ x, y }) {
    let components = {};
    if (x !== undefined) {
      components[0] = x;
    }
    if (y !== undefined) {
      components[1] = y;
    }
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        stateVariable: "xs",
        value: components,
      }]
    })

  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    const actions = {
      movePoint: this.movePoint,
    }
    if (this.stateValues.nDimensions === 2) {
      let x = this.stateValues.numericalXs[0];
      let y = this.stateValues.numericalXs[1];
      this.renderer = new this.availableRenderers.point2d({
        key: this.componentName,
        label: this.stateValues.label,
        draggable: this.stateValues.draggable,
        layer: this.stateValues.layer,
        x,
        y,
        actions: actions,
        color: this.stateValues.selectedStyle.markerColor,
        size: this.stateValues.selectedStyle.markerSize,
        style: this.stateValues.selectedStyle.markerStyle,
        visible: !this.stateValues.hide,
        showlabel: this.stateValues.showlabel,
      });
    }
  }

  updateRenderer({ sourceOfUpdate } = {}) {
    let changeInitiatedWithPoint = false;
    if (sourceOfUpdate !== undefined &&
      sourceOfUpdate.originalComponents.includes(this.componentName)) {
      changeInitiatedWithPoint = true;
    }
    let x = this.stateValues.numericalXs[0];
    let y = this.stateValues.numericalXs[1];

    this.renderer.updatePoint({
      x, y,
      changeInitiatedWithPoint: changeInitiatedWithPoint,
      label: this.stateValues.label,
      visible: !this.stateValues.hide,
      draggable: this.stateValues.draggable,
      showlabel: this.stateValues.showlabel,
    });
  }


}

function calculateUnconstrainedXs({ dependencyValues, arrayKeys, freshByKey }) {

  // console.log('calculate unconstrained xs')
  // console.log(dependencyValues);
  // console.log(arrayKeys);

  let newXs = {};
  let essentialXs = {};


  let haveCoords = false;
  let coords;

  if (dependencyValues.coordsChild.length == 1) {
    haveCoords = true;
    coords = dependencyValues.coordsChild[0].stateValues.value;
  } else if (dependencyValues.coordsShadow !== null) {
    haveCoords = true;
    coords = dependencyValues.coordsShadow;
  }

  if (haveCoords) {

    let coordsTree = coords.tree;
    if (Array.isArray(coordsTree) && ["tuple", "vector"].includes(coordsTree[0])) {
      for (let i = 0; i < coordsTree.length - 1; i++) {
        newXs[i] = coords.get_component(i).simplify();
      }
    } else {
      newXs[0] = coords.simplify();
    }

  } else {

    let arrayKey;
    if (arrayKeys) {
      arrayKey = arrayKeys[0];
    }

    let { xChild, yChild, zChild, nDimensions } = dependencyValues;

    if (!freshByKey[0]) {
      if (arrayKey === "0" || arrayKey === undefined) {
        if (xChild && xChild.length === 1) {
          newXs[0] = xChild[0].stateValues.value.simplify();
        } else {
          essentialXs[0] = {
            variablesToCheck: [
              { variableName: "xs", arrayIndex: 0 },
              { variableName: "coords", mathComponentIndex: 0 }
            ]
          };
        }
      }
    }
    if (!freshByKey[1]) {
      if (arrayKey === "1" || arrayKey === undefined) {
        if (yChild && yChild.length === 1) {
          newXs[1] = yChild[0].stateValues.value.simplify();
        } else if (nDimensions > 1) {
          essentialXs[1] = {
            variablesToCheck: [
              { variableName: "xs", arrayIndex: 1 },
              { variableName: "coords", mathComponentIndex: 1 }
            ]
          };
        }
      }
    }

    if (!freshByKey[2]) {
      if (arrayKey === "2" || arrayKey === undefined) {
        if (zChild && zChild.length === 1) {
          newXs[2] = zChild[0].stateValues.value.simplify();
        } else if (nDimensions > 2) {
          essentialXs[2] = {
            variablesToCheck: [
              { variableName: "xs", arrayIndex: 2 },
              { variableName: "coords", mathComponentIndex: 2 }
            ]
          };
        }
      }
    }
  }

  // console.log("newXs");
  // console.log(newXs);
  // console.log("essentialXs");
  // console.log(essentialXs);

  if (Object.keys(newXs).length > 0) {
    newXs = { unconstrainedXs: newXs };
  }
  if (Object.keys(essentialXs).length > 0) {
    essentialXs = { unconstrainedXs: essentialXs };
  }
  return { newValues: newXs, useEssentialOrDefaultValue: essentialXs };

}


function invertUnconstrainedXs({ desiredStateVariableValues, dependencyValues,
  stateValues }) {
  // console.log("invertUnconstrainedXs");
  // console.log(desiredStateVariableValues)
  // console.log(dependencyValues);
  // console.log(stateValues);

  let instructions = [];
  let haveCoords = false;
  let coordsDependency;

  if (dependencyValues.coordsChild.length == 1) {
    haveCoords = true;
    coordsDependency = "coordsChild";
  } else if (dependencyValues.coordsShadow !== null) {
    haveCoords = true;
    coordsDependency = "coordsShadow"
  }

  if (haveCoords) {
    let currentCoordsTree = Array(stateValues.nDimensions + 1);
    currentCoordsTree[0] = "tuple";
    for (let arrayKey in desiredStateVariableValues.unconstrainedXs) {
      currentCoordsTree[Number(arrayKey) + 1] = desiredStateVariableValues.unconstrainedXs[arrayKey];
    }

    let instruction = {
      setDependency: coordsDependency,
      desiredValue: me.fromAst(currentCoordsTree),
    }
    if (coordsDependency === "coordsChild") {
      instruction.childIndex = 0;
      instruction.variableIndex = 0;
    }

    instructions.push(instruction);

    return {
      success: true,
      instructions,
    }
  } else {

    let arrayKeyToChild = ["xChild", "yChild", "zChild"];

    for (let arrayKey in desiredStateVariableValues.unconstrainedXs) {
      let childName = arrayKeyToChild[arrayKey];

      if (childName === undefined) {
        throw Error(`Haven't implemented coords beyond 3 for inverse definition of xs in point`)
      }

      if (dependencyValues[childName].length === 0) {
        instructions.push({
          setStateVariable: "xs",
          arrayKey,
          // since not going through Math component, have to manually convert to math expression
          value: convertValueToMathExpression(desiredStateVariableValues.unconstrainedXs[arrayKey]),
        });
      } else {
        instructions.push({
          setDependency: childName,
          desiredValue: desiredStateVariableValues.unconstrainedXs[arrayKey],
          childIndex: 0,
          variableIndex: 0,
        });
      }
    }

    return {
      success: true,
      instructions,
    }
  }
}
