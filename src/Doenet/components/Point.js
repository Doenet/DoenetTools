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
      requireConsecutive: true,
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
      definition: function ({ dependencyValues, changes }) {

        let basedOnCoords = false;
        let coords;
        let nDimensions;

        if (dependencyValues.coordsChild.length == 1) {
          basedOnCoords = true;
          coords = dependencyValues.coordsChild[0].stateValues.value;
        } else if (dependencyValues.coordsShadow !== null) {
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

          // if based on coords, should check to for actual change
          // as frequently the dimension doesn't change
          return { newValues: { nDimensions }, checkForActualChange: ["nDimensions"] };


        } else {

          // don't have coords, so determine from which component children have

          // Note: wouldn't have been marked stale (so wouldn't get to definution)
          // if identities of one of the children hadn't changed
          // so don't need to check if identity changed

          if (dependencyValues.zChild.length === 1) {
            nDimensions = 3;
          } else if (dependencyValues.yChild.length === 1) {
            nDimensions = 2;
          } else {
            nDimensions = 1;
          }
        }

        return { newValues: { nDimensions }, checkForActualChange: ["nDimensions"] };

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
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {

        // TODO: is there a reason to bother with calculating
        // details of this freshness
        // as xs won't be able to take advantage of it due
        // possible constraints that could introduce dependencies among components? 

        let freshByKey = freshnessInfo.freshByKey
        if (changes.coordsShadow || changes.coordsChild || changes.nDimensions) {
          // if based on coords or number of dimensions changed
          // always regard as the whole entry changed
          // (although fressByKey isn't set when based on coords
          // delete these values just in case the depedencies changed)

          for (let key in freshByKey) {
            delete freshByKey[key];
          }

          // since returning fresh as false, it is important that we deleted
          // all entries of freshByKey,
          // as core will recurse markStale to upstream dependents now
          // but won't recurse again if there are additional changes
          // (as fresh===false indicates everything is already stale)
          return { fresh: false }

        } else {

          if (changes.xChild) {
            delete freshByKey[0];
          }
          if (changes.yChild) {
            delete freshByKey[1];
          }
          if (changes.zChild) {
            delete freshByKey[2];
          }

          let arrayKey;
          if (arrayKeys) {
            arrayKey = arrayKeys[0];
          }

          if (arrayKey === undefined) {
            if (Object.keys(freshByKey).length === 0) {
              // asked for entire array and it is all stale
              return { fresh: false }
            } else {
              // asked for entire array, but it has some fresh elements
              return { partiallyFresh: true }
            }
          } else {
            // asked for just one component
            return { fresh: freshByKey[arrayKey] === true }
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
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {

        let freshByKey = freshnessInfo.freshByKey

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (changes.constraintsChild) {
          // if have constraint, mark all entries as stale
          for (let key in freshByKey) {
            delete freshByKey[key];
          }
        } else if (changes.unconstrainedXs) {
          // if no constraint, mark any keys that were stale in unconstrainedXs
          // as stale for xs
          let unconstrainedFreshByKey = changes.unconstrainedXs.valuesChanged.unconstrainedXs.freshnessInfo.freshByKey;
          for (let key in freshByKey) {
            if (!unconstrainedFreshByKey[key]) {
              delete freshByKey[key];
            }
          }
        }


        if (arrayKey === undefined) {
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            // (we don't know here how many elements xs has, 
            // so can't determine if completely fresh)
            return { partiallyFresh: true }
          }
        } else {
          // asked for just one component
          return { fresh: freshByKey[arrayKey] === true }
        }

      },

      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.freshByKey

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          if (dependencyValues.constraintsChild.length === 1) {
            let xs = dependencyValues.constraintsChild[0].stateValues.constraintResults
              .map(x => convertValueToMathExpression(x));

            for (let key in xs) {
              freshByKey[key] = true;
            }

            return {
              newValues: { xs }
            }
          } else {
            let xs = {};
            if (changes.unconstrainedXs) {
              let changedXs = changes.unconstrainedXs.valuesChanged.unconstrainedXs.changed;

              if (changedXs === true || changedXs.changedEntireArray === true) {
                // whole array changes
                xs = dependencyValues.unconstrainedXs;

                for (let key in xs) {
                  freshByKey[key] = true;
                }

              } else if (changedXs) {
                // if changedXs exists but isn't true, then is object of arrayKeys
                for (let key in changedXs.arrayKeysChanged) {
                  xs[key] = dependencyValues.unconstrainedXs[key];
                  freshByKey[key] = true;
                }
              }
            }

            return {
              newValues: { xs }
            }
          }
        } else {

          // arrayKey is defined

          if (freshByKey[arrayKey]) {
            // Already calculated this value, so no need to calculate it again.
            // Since is array state variable, don't need to send noChanges
            return {};
          }

          freshByKey[arrayKey] = true;

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
      forRenderer: true,
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
      markStale({ freshnessInfo, changes, arrayKeys }) {

        let freshByKey = freshnessInfo.freshByKey;

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          if (changes.xs) {
            let xsFreshByKey = changes.xs.valuesChanged.xs.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              if (!xsFreshByKey[key]) {
                delete freshByKey[key];
              }
            }
          }
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: false }
          } else {
            // asked for entire array, but it has some fresh elements
            // (we don't know here how many elements numericalXs has, 
            // so can't determine if completely fresh)
            return { partiallyFresh: true }
          }
        } else {

          // have arrayKey
          // so asked for just one component

          if (changes[`x${arrayKey + 1}`]) {
            delete freshByKey[arrayKey];
          }

          return { fresh: freshByKey[arrayKey] === true };
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.freshByKey


        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {

          let numericalXs = {};
          if (changes.xs) {
            let changedXs = changes.xs.valuesChanged.xs.changed;

            if (changedXs === true || changedXs.changedEntireArray == true) {
              // changed true means whole array changes
              numericalXs = dependencyValues.xs.map(x => x.evaluate_to_constant());
              for (let key in numericalXs) {
                freshByKey[key] = true;
              }

            } else if (changedXs) {
              // if changedXs exists but isn't true, then is object of arrayKeys
              for (let key in changedXs.arrayKeysChanged) {
                numericalXs[key] = dependencyValues.xs[key].evaluate_to_constant();
                freshByKey[key] = true;
              }
            }
          }

          return {
            newValues: { numericalXs }
          }
        } else {

          // arrayKey is defined

          if (freshByKey[arrayKey]) {
            // Already calculated this value, so no need to calculate it again.
            // Since is array state variable, don't need to send noChanges
            return {};
          }

          freshByKey[arrayKey] = true;

          return {
            newValues: {
              numericalXs: {
                [arrayKey]: dependencyValues[`x${arrayKey + 1}`].evaluate_to_constant()
              }
            }
          }
        }
      },

      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues,
        stateValues, initialChange, arrayKeys }) {

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

          return {
            success: true,
            instructions: [{
              setDependency: "xs",
              desiredValue: desiredStateVariableValues.numericalXs,
            }]
          }
        } else {

          return {
            success: true,
            instructions: [{
              setDependency: `x${arrayKey + 1}`,
              desiredValue: desiredStateVariableValues.xs[arrayKey],
            }]
          }

        }
      }
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

function calculateUnconstrainedXs({ dependencyValues, arrayKeys, freshnessInfo }) {

  // console.log('calculate unconstrained xs')
  // console.log(dependencyValues);
  // console.log(arrayKeys);

  let newXs = {};
  let essentialXs = {};


  let basedOnCoords = false;
  let coords;

  if (dependencyValues.coordsChild.length == 1) {
    basedOnCoords = true;
    coords = dependencyValues.coordsChild[0].stateValues.value;
  } else if (dependencyValues.coordsShadow !== null) {
    basedOnCoords = true;
    coords = dependencyValues.coordsShadow;
  }

  if (basedOnCoords) {

    // Note: if based on coords, don't set anything in freshnessInfo
    // as any change will cause whole array to be considered stale

    let coordsTree = coords.tree;
    if (Array.isArray(coordsTree) && ["tuple", "vector"].includes(coordsTree[0])) {
      // make it array so know whole array changed
      newXs = [];
      for (let i = 0; i < coordsTree.length - 1; i++) {
        newXs[i] = coords.get_component(i).simplify();
      }
    } else {
      newXs = [coords.simplify()];
    }

  } else {

    let freshByKey = freshnessInfo.freshByKey

    let arrayKey;
    if (arrayKeys) {
      arrayKey = arrayKeys[0];
    }

    let { xChild, yChild, zChild, nDimensions } = dependencyValues;

    if (!freshByKey[0] && (arrayKey === "0" || arrayKey === undefined)) {
      freshByKey[0] = true;
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

    if (!freshByKey[1] && (arrayKey === "1" || arrayKey === undefined)) {
      if (yChild && yChild.length === 1) {
        freshByKey[1] = true;
        newXs[1] = yChild[0].stateValues.value.simplify();
      } else if (nDimensions > 1) {
        freshByKey[1] = true;
        essentialXs[1] = {
          variablesToCheck: [
            { variableName: "xs", arrayIndex: 1 },
            { variableName: "coords", mathComponentIndex: 1 }
          ]
        };
      }
    }

    if (!freshByKey[2] && (arrayKey === "2" || arrayKey === undefined)) {
      if (zChild && zChild.length === 1) {
        freshByKey[2] = true;
        newXs[2] = zChild[0].stateValues.value.simplify();
      } else if (nDimensions > 2) {
        freshByKey[2] = true;
        essentialXs[2] = {
          variablesToCheck: [
            { variableName: "xs", arrayIndex: 2 },
            { variableName: "coords", mathComponentIndex: 2 }
          ]
        };
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
  let basedOnCoords = false;
  let coordsDependency;

  if (dependencyValues.coordsChild.length == 1) {
    basedOnCoords = true;
    coordsDependency = "coordsChild";
  } else if (dependencyValues.coordsShadow !== null) {
    basedOnCoords = true;
    coordsDependency = "coordsShadow"
  }

  if (basedOnCoords) {
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
