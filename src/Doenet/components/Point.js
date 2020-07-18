import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { convertValueToMathExpression, mergeVectorsForInverseDefinition } from '../utils/math';
import { returnBreakStringsSugarFunction } from './commonsugar/breakstrings';
import { deepClone } from '../utils/deepFunctions';

export default class Point extends GraphicalComponent {
  constructor(args) {
    super(args);
    this.movePoint = this.movePoint.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
    this.actions = { movePoint: this.movePoint };
  }
  static componentType = "point";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["xs", "nDimensions"] };

  // Note: for point, the recommended course of action is not to have
  // a public state variable with component type point, which would use coordsShadow
  // Instead have a array state variable of maths for each component
  // and use wrapping components to create points from those
  static primaryStateVariableForDefinition = "coordsShadow";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true, forRenderer: true };
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

    let exactlyOneXs = childLogic.newLeaf({
      name: "exactlyOneXs",
      componentType: "xs",
      number: 1
    })

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


    let breakIntoXsByCommas = function (args) {
      let childrenToComponentFunction = x => ({
        componentType: "x", children: x
      });

      let breakFunction = returnBreakStringsSugarFunction({
        childrenToComponentFunction,
        dependencyNameWithChildren: "stringsAndMaths",
        stripOffOuterParentheses: true
      })

      let result = breakFunction(args);

      // wrap xs around the x children
      result.newChildren = [{
        componentType: "xs",
        children: result.newChildren
      }];

      return result;

    };

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
      returnSugarDependencies: () => ({
        stringsAndMaths: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        }
      }),
      logicToWaitOnSugar: ["exactlyOneXs"],
      replacementFunction: breakIntoXsByCommas,
    });


    let exactlyOnePoint = childLogic.newLeaf({
      name: "exactlyOnePoint",
      componentType: "point",
      number: 1,
    })

    let noCoords = childLogic.newLeaf({
      name: "noCoords",
      componentType: 'coords',
      number: 0,
      allowSpillover: false,
    });

    let coordsXorSugar = childLogic.newOperator({
      name: "coordsXorSugar",
      operator: 'xor',
      propositions: [
        coordinatesViaComponents, exactlyOneXs, exactlyOnePoint,
        exactlyOneCoords, stringsAndMaths, noCoords
      ],
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
      requireConsecutive: true,
      logicToWaitOnSugar: ["atMostOneConstraints"],
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

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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
    // via an adapter or ref prop or from serialized state with coords value
    // In case of adapter or ref prop,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of coordsShadow will be changed to be the value
    // that shadows the component adapted or reffed
    stateVariableDefinitions.coordsShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          coordsShadow: { variablesToCheck: ["coords", "coordsShadow"] }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues, stateValues, workspace }) {

        let desiredCoords = mergeVectorsForInverseDefinition({
          desiredVector: desiredStateVariableValues.coordsShadow,
          currentVector: stateValues.coordsShadow,
          workspace,
          workspaceKey: "desiredCoords"
        });

        return {
          success: true,
          instructions: [{
            setStateVariable: "coordsShadow",
            value: desiredCoords
          }]
        };
      }
    }

    // Note: if point created via a copy (with no prop) of another point
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
        },
        xsChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneXs",
          variableNames: ["nComponents"]
        },
        pointChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOnePoint",
          variableNames: ["nDimensions"]
        }
      }),
      definition: function ({ dependencyValues, changes }) {
        // console.log(`nDimensions definition`)
        // console.log(dependencyValues)

        let basedOnCoords = false;
        let coords;
        let nDimensions;

        if (dependencyValues.xsChild.length === 1) {
          return {
            newValues: {
              nDimensions: dependencyValues.xsChild[0].stateValues.nComponents
            }
          }
        }
        if (dependencyValues.pointChild.length === 1) {
          return {
            newValues: {
              nDimensions: dependencyValues.pointChild[0].stateValues.nDimensions
            }
          }
        }

        if (dependencyValues.coordsChild.length === 1) {
          basedOnCoords = true;
          coords = dependencyValues.coordsChild[0].stateValues.value;
        } else if (dependencyValues.coordsShadow) {
          basedOnCoords = true;
          coords = dependencyValues.coordsShadow;
        }

        if (basedOnCoords) {

          let coordsTree = coords.tree;
          if (Array.isArray(coordsTree) && ["tuple", "vector"].includes(coordsTree[0])) {
            nDimensions = coordsTree.length - 1;
          } else {
            nDimensions = 1;
          }

          // if based on coords, should check for actual change
          // as frequently the dimension doesn't change
          return { newValues: { nDimensions }, checkForActualChange: { nDimensions: true } };


        } else {

          // don't have coords, so determine from which component children have

          // Note: wouldn't have been marked stale (so wouldn't get to definution)
          // if identities of one of the children hadn't changed
          // so don't need to check if identity changed

          if (dependencyValues.zChild.length === 1) {
            nDimensions = 3;
          } else if (dependencyValues.yChild.length === 1) {
            nDimensions = 2;
          } else if (dependencyValues.xChild.length === 1) {
            nDimensions = 1;
          } else {
            nDimensions = 2;
          }
        }

        return { newValues: { nDimensions }, checkForActualChange: { nDimensions: true } };

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

    stateVariableDefinitions.nDimensionsForConstraints = {
      isAlias: true,
      targetVariableName: "nDimensions"
    };


    stateVariableDefinitions.unconstrainedXs = {
      isArray: true,
      entryPrefixes: ["unconstrainedX"],
      defaultEntryValue: me.fromAst(0),
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
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

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            xsChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneXs",
              variableNames: ["math" + varEnding]
            },
            pointChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOnePoint",
              variableNames: ["x" + varEnding]
            }
          }
          if (arrayKey === "0") {
            dependenciesByKey[arrayKey].componentChild = {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneX",
              variableNames: ["value"],
            }
          } else if (arrayKey === "1") {
            dependenciesByKey[arrayKey].componentChild = {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneY",
              variableNames: ["value"],
            }
          } else if (arrayKey === "2") {
            dependenciesByKey[arrayKey].componentChild = {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneZ",
              variableNames: ["value"],
            }
          }
        }

        return { globalDependencies, dependenciesByKey }
      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        // console.log('unconstrained xs definition by key')
        // console.log(deepClone(globalDependencyValues))
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys));

        let newXs = {};
        let essentialXs = {};

        let basedOnCoords = false;
        let coords;

        if (globalDependencyValues.coordsChild.length === 1) {
          basedOnCoords = true;
          coords = globalDependencyValues.coordsChild[0].stateValues.value;
        } else if (globalDependencyValues.coordsShadow) {
          basedOnCoords = true;
          coords = globalDependencyValues.coordsShadow;
        }

        if (basedOnCoords) {

          let coordsTree = coords.tree;
          if (Array.isArray(coordsTree) && ["tuple", "vector"].includes(coordsTree[0])) {
            for (let arrayKey of arrayKeys) {
              let ind = Number(arrayKey);
              if (ind >= 0 || ind < coordsTree.length - 1) {
                if (coords.tree[ind + 1] === undefined) {
                  newXs[arrayKey] = me.fromAst("\uff3f");
                } else {
                  newXs[arrayKey] = coords.get_component(ind).simplify();
                }
              }
            }
          } else {
            if (arrayKeys.includes('0')) {
              newXs[0] = coords.simplify();
            }
          }

        } else {

          for (let arrayKey of arrayKeys) {
            let varEnding = Number(arrayKey) + 1;
            let xsChild = dependencyValuesByKey[arrayKey].xsChild;
            if (xsChild && xsChild.length === 1) {
              newXs[arrayKey] = xsChild[0].stateValues["math" + varEnding].simplify();
            } else {
              let pointChild = dependencyValuesByKey[arrayKey].pointChild;
              if (pointChild && pointChild.length === 1) {
                newXs[arrayKey] = pointChild[0].stateValues["x" + varEnding]
              } else {
                let componentChild = dependencyValuesByKey[arrayKey].componentChild;
                if (componentChild && componentChild.length === 1) {
                  newXs[arrayKey] = componentChild[0].stateValues.value.simplify();
                } else {
                  essentialXs[arrayKey] = {
                    variablesToCheck: [
                      { variableName: "xs", arrayIndex: arrayKey },
                      { variableName: "coords", mathComponentIndex: arrayKey }
                    ]
                  };
                }
              }
            }
          }
        }

        // console.log("newXs");
        // console.log(newXs);
        // console.log("essentialXs");
        // console.log(essentialXs);
        let result = {};
        if (Object.keys(newXs).length > 0) {
          result.newValues = { unconstrainedXs: newXs };
        }
        if (Object.keys(essentialXs).length > 0) {
          result.useEssentialOrDefaultValue = { unconstrainedXs: essentialXs };
        }
        return result;

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, arraySize
      }) {

        // console.log("invertUnconstrainedXs");
        // console.log(desiredStateVariableValues)
        // console.log(globalDependencyValues);
        // console.log(dependencyValuesByKey);
        // console.log(stateValues);

        let instructions = [];
        let basedOnCoords = false;
        let coordsDependency;

        if (globalDependencyValues.coordsChild.length === 1) {
          basedOnCoords = true;
          coordsDependency = "coordsChild";
        } else if (globalDependencyValues.coordsShadow !== null) {
          basedOnCoords = true;
          coordsDependency = "coordsShadow"
        }

        if (basedOnCoords) {
          let desiredCoords;
          if (arraySize[0] === 1) {
            desiredCoords = convertValueToMathExpression(desiredStateVariableValues.unconstrainedXs[0])
          } else {

            // coordsTree could have undefined components,
            // which will indicate not to change those components
            let coordsTree = Array(arraySize[0] + 1);
            coordsTree[0] = "vector";
            for (let arrayKey in desiredStateVariableValues.unconstrainedXs) {
              let value = desiredStateVariableValues.unconstrainedXs[arrayKey]
              coordsTree[Number(arrayKey) + 1] = value instanceof me.class ? value.tree : value;
            }
            desiredCoords = me.fromAst(coordsTree);

          }

          let instruction = {
            setDependency: coordsDependency,
            desiredValue: desiredCoords
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

          for (let arrayKey in desiredStateVariableValues.unconstrainedXs) {

            if (!dependencyValuesByKey[arrayKey]) {
              continue;
            }

            let xsChild = dependencyValuesByKey[arrayKey].xsChild;
            if (xsChild && xsChild.length === 1) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].xsChild,
                desiredValue: convertValueToMathExpression(desiredStateVariableValues.unconstrainedXs[arrayKey]),
                childIndex: 0,
                variableIndex: 0,
              });
            } else {

              let pointChild = dependencyValuesByKey[arrayKey].pointChild;
              if (pointChild && pointChild.length === 1) {
                instructions.push({
                  setDependency: dependencyNamesByKey[arrayKey].pointChild,
                  desiredValue: convertValueToMathExpression(desiredStateVariableValues.unconstrainedXs[arrayKey]),
                  childIndex: 0,
                  variableIndex: 0,
                });
              } else {

                let componentChild = dependencyValuesByKey[arrayKey].componentChild;
                if (componentChild && componentChild.length === 1) {
                  instructions.push({
                    setDependency: dependencyNamesByKey[arrayKey].componentChild,
                    // since going through Math component, don't need to manually convert to math expression
                    desiredValue: desiredStateVariableValues.unconstrainedXs[arrayKey],
                    childIndex: 0,
                    variableIndex: 0,
                  });
                } else {
                  instructions.push({
                    setStateVariable: "unconstrainedXs",
                    arrayKey,
                    value: convertValueToMathExpression(desiredStateVariableValues.unconstrainedXs[arrayKey]),
                  });
                }
              }
            }
          }

          return {
            success: true,
            instructions,
          }
        }
      },
    }

    stateVariableDefinitions.xs = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["x"],
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          let keyDeps = {};
          keyDeps.unconstrainedX = {
            dependencyType: "stateVariable",
            variableName: `unconstrainedX${varEnding}`,
          };
          keyDeps.constraintsChild = {
            dependencyType: "childStateVariables",
            childLogicName: "atMostOneConstraints",
            variableNames: [`constraintResult${varEnding}`]
          }
          dependenciesByKey[arrayKey] = keyDeps;
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of xs')
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys));

        let xs = {};

        for (let arrayKey of arrayKeys) {

          if (dependencyValuesByKey[arrayKey].constraintsChild &&
            dependencyValuesByKey[arrayKey].constraintsChild.length === 1
          ) {
            let varEnding = Number(arrayKey) + 1;
            xs[arrayKey] = convertValueToMathExpression(
              dependencyValuesByKey[arrayKey].constraintsChild[0].stateValues["constraintResult" + varEnding]
            )
          } else {
            xs[arrayKey] = convertValueToMathExpression(
              dependencyValuesByKey[arrayKey].unconstrainedX
            )
          }
        }

        if (arrayKeys.length > 0) {
          return { newValues: { xs } }
        } else {
          return {};
        }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // console.log('invert xs')
        // console.log(desiredStateVariableValues);
        // console.log(dependencyValuesByKey);
        // console.log(dependencyNamesByKey);

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }


        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.xs) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }
          if (dependencyValuesByKey[arrayKey].constraintsChild.length === 1) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].constraintsChild,
              desiredValue: desiredStateVariableValues.xs[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            })
          } else {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].unconstrainedX,
              desiredValue: desiredStateVariableValues.xs[arrayKey],
            })
          }

        }

        return {
          success: true,
          instructions
        }

      },
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
      forRenderer: true,
      returnDependencies: () => ({
        xs: {
          dependencyType: "stateVariable",
          variableName: "xs",
        }
      }),
      definition: function ({ dependencyValues }) {
        // console.log(`definition of coords`)
        // console.log(deepClone(dependencyValues));
        let coordsAst = [];
        for (let v of dependencyValues.xs) {
          if (v) {
            coordsAst.push(v.tree);
          } else {
            coordsAst.push('\uff3f');
          }
        }
        if (coordsAst.length > 1) {
          coordsAst = ["vector", ...coordsAst];
        } else {
          coordsAst = coordsAst[0];
        }

        return { newValues: { coords: me.fromAst(coordsAst) } }
      },

      inverseDefinition: function ({ desiredStateVariableValues, stateValues, initialChange }) {
        // console.log("invertCoords");
        // console.log(desiredStateVariableValues)
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
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            [`x`]: {
              dependencyType: "stateVariable",
              variableName: `x${varEnding}`,
            }
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log(`definition of numericalXs`)
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys))

        let numericalXs = {};

        for (let arrayKey of arrayKeys) {
          let x = dependencyValuesByKey[arrayKey].x;
          if (x) {
            numericalXs[arrayKey] = dependencyValuesByKey[arrayKey].x.evaluate_to_constant();
          } else {
            numericalXs[arrayKey] = NaN;
          }
        }

        return { newValues: { numericalXs } }
      },

      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // if not draggable, then disallow initial change 
        if (initialChange && !stateValues.draggable) {
          return { success: false };
        }


        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.numericalXs) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].xs,
            desiredValue: desiredStateVariableValues.numericalXs[arrayKey],
          })
        }

        return {
          success: true,
          instructions
        }

      }
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        },
        numericalXs: {
          dependencyType: "stateVariable",
          variableName: "numericalXs"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function () {
            // for point, nearest point is just the point itself
            // only implement for numerical values
            let result = {};

            for (let ind = 1; ind <= dependencyValues.nDimensions; ind++) {
              let x = dependencyValues.numericalXs[ind - 1];
              if (!Number.isFinite(x)) {
                return {};
              }
              result['x' + ind] = x;
            }
            return result;
          }
        }
      })
    }


    return stateVariableDefinitions;
  }


  adapters = ["coords"];

  movePoint({ x, y }) {
    let components = {};
    if (x !== undefined) {
      components[0] = me.fromAst(x);
    }
    if (y !== undefined) {
      components[1] = me.fromAst(y);
    }
    this.requestUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "xs",
        value: components,
      }]
    })

  }

}
