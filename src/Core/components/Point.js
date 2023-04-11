import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { convertValueToMathExpression, roundForDisplay, vectorOperators } from '../utils/math';
import { returnBreakStringsSugarFunction } from './commonsugar/breakstrings';
import { deepClone } from '../utils/deepFunctions';
import { returnTextStyleDescriptionDefinitions } from '../utils/style';

export default class Point extends GraphicalComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      movePoint: this.movePoint.bind(this),
      switchPoint: this.switchPoint.bind(this),
      pointClicked: this.pointClicked.bind(this),
      pointFocused: this.pointFocused.bind(this),
    });

  }
  static componentType = "point";


  // Note: for other components with public point state variables,
  // the recommended course of action is not to have
  // a public state variable with component type point, which would use coordsShadow
  // Instead have a public array state variable of maths for each component
  // and use wrapping components to create points from those
  static primaryStateVariableForDefinition = "coordsShadow";
  static stateVariableForAttributeValue = "coords";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true
    };

    attributes.x = {
      createComponentOfType: "math",
    };
    attributes.y = {
      createComponentOfType: "math",
    };
    attributes.z = {
      createComponentOfType: "math",
    };
    attributes.xs = {
      createComponentOfType: "mathList",
    };
    attributes.coords = {
      createComponentOfType: "coords",
    };

    attributes.displayDigits = {
      createComponentOfType: "integer",
    };

    attributes.displayDecimals = {
      createComponentOfType: "integer",
      createStateVariable: "displayDecimals",
      defaultValue: null,
      public: true,
    };

    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      createStateVariable: "displaySmallAsZero",
      valueForTrue: 1E-14,
      valueForFalse: 0,
      defaultValue: 0,
      public: true,
    };

    attributes.padZeros = {
      createComponentOfType: "boolean",
      createStateVariable: "padZeros",
      defaultValue: false,
      public: true,
    };

    attributes.labelPosition = {
      createComponentOfType: "text",
      createStateVariable: "labelPosition",
      defaultValue: "upperright",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft", "top", "bottom", "left", "right"]
    }

    attributes.showCoordsWhenDragging = {
      createComponentOfType: "boolean",
      createStateVariable: "showCoordsWhenDragging",
      defaultValue: true,
      public: true,
      forRenderer: true
    }

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoXsByCommas = function ({ matchedChildren, componentInfoObjects }) {
      let childrenToComponentFunction = x => ({
        componentType: "math", children: x
      });

      let breakFunction = returnBreakStringsSugarFunction({
        childrenToComponentFunction,
        mustStripOffOuterParentheses: true
      })

      // find index of first and last string
      let cTypes = matchedChildren.map(x => typeof x)
      let beginInd = cTypes.indexOf("string");
      let lastInd = cTypes.lastIndexOf("string");


      if (beginInd === -1) {
        // if have no strings but have exactly one child that isn't in child group,
        // (point, vector, constraints, label)
        // use that for coords

        let componentIsSpecifiedType = componentInfoObjects.componentIsSpecifiedType;

        let otherChildren = matchedChildren.filter(child => !(
          componentIsSpecifiedType(child, "point")
          || componentIsSpecifiedType(child, "vector")
          || componentIsSpecifiedType(child, "constraints")
          || componentIsSpecifiedType(child, "label")
        ));

        if (otherChildren.length === 1) {
          let mathChild = otherChildren[0];
          let mathInd = matchedChildren.indexOf(mathChild);

          let newChildren = [
            ...matchedChildren.slice(0, mathInd),
            ...matchedChildren.slice(mathInd + 1)
          ];

          return {
            success: true,
            newAttributes: {
              coords: {
                component: {
                  componentType: "math",
                  children: otherChildren
                }
              }
            },
            newChildren
          }

        } else {
          // no strings and don't have exactly one non child-group child
          return { success: false }
        }

      }

      let newChildren = [
        ...matchedChildren.slice(0, beginInd),
        ...matchedChildren.slice(lastInd + 1)
      ]
      matchedChildren = matchedChildren.slice(beginInd, lastInd + 1);

      let result = breakFunction({ matchedChildren });

      if (!result.success && matchedChildren.length === 1) {
        // if didn't succeed and just have a single string child,
        // then just wrap string with an xs
        return {
          success: true,
          newAttributes: {
            xs: {
              component: {
                componentType: "mathList",
                children: [{
                  componentType: "math",
                  children: matchedChildren
                }]
              }
            }
          },
          newChildren
        }
      }


      if (result.success) {
        // wrap xs around the x children
        return {
          success: true,
          newAttributes: {
            xs: {
              component: {
                componentType: "mathList",
                children: result.newChildren,
                skipSugar: true,
              }
            }
          },
          newChildren
        }
      } else {
        return { success: false }
      }


    };

    sugarInstructions.push({
      // childrenRegex: /n*s+(.*s)?n*/,
      replacementFunction: breakIntoXsByCommas
    })

    return sugarInstructions;

  }

  static returnChildGroups() {

    let childGroups = super.returnChildGroups();

    childGroups.push(...[{
      group: "points",
      componentTypes: ["point"]
    }, {
      group: "vectors",
      componentTypes: ["vector"]
    }, {
      group: "constraints",
      componentTypes: ["constraints"]
    }])

    return childGroups;

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let styleDescriptionDefinitions = returnTextStyleDescriptionDefinitions();
    Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

    stateVariableDefinitions.styleDescription = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"]
        },
      }),
      definition: function ({ dependencyValues }) {

        let markerColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          markerColorWord = dependencyValues.selectedStyle.markerColorWordDarkMode;
        } else {
          markerColorWord = dependencyValues.selectedStyle.markerColorWord;
        }
        return {
          setValue: {
            styleDescription: markerColorWord
          }
        };
      }
    }

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        styleDescription: {
          dependencyType: "stateVariable",
          variableName: "styleDescription",
        },
      }),
      definition: function ({ dependencyValues }) {

        let pointDescription = dependencyValues.styleDescription
          + " " + dependencyValues.selectedStyle.markerStyleWord;
        return { setValue: { styleDescriptionWithNoun: pointDescription } };
      }
    }

    stateVariableDefinitions.displayDigits = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      defaultValue: 10,
      returnDependencies: () => ({
        displayDigitsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDigits",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.displayDigitsAttr !== null) {

          let displayDigitsAttrUsedDefault = dependencyValues.displayDigitsAttr === null || usedDefault.displayDigitsAttr;
          let displayDecimalsAttrUsedDefault = dependencyValues.displayDecimalsAttr === null || usedDefault.displayDecimalsAttr;

          if (!(displayDigitsAttrUsedDefault || displayDecimalsAttrUsedDefault)) {
            // if both display digits and display decimals did not used default
            // we'll regard display digits as using default if it comes from a deeper shadow
            let shadowDepthDisplayDigits = dependencyValues.displayDigitsAttr.shadowDepth;
            let shadowDepthDisplayDecimals = dependencyValues.displayDecimalsAttr.shadowDepth;

            if (shadowDepthDisplayDecimals < shadowDepthDisplayDigits) {
              displayDigitsAttrUsedDefault = true;
            }
          }

          if (displayDigitsAttrUsedDefault) {
            return { useEssentialOrDefaultValue: { displayDigits: { defaultValue: dependencyValues.displayDigitsAttr.stateValues.value } } }
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
              }
            }
          }
        }

        return { useEssentialOrDefaultValue: { displayDigits: true } }

      }
    }

    // coordsShadow will be null unless point was created
    // via an adapter or copy prop or from serialized state with coords value
    // In case of adapter or copy prop,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of coordsShadow will be changed to be the value
    // that shadows the component adapted or copied
    stateVariableDefinitions.coordsShadow = {
      defaultValue: null,
      isLocation: true,
      hasEssential: true,
      essentialVarName: "coords",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          coordsShadow: true
        }
      }),
      inverseDefinition: async function ({ desiredStateVariableValues, stateValues, workspace }) {

        return {
          success: true,
          instructions: [{
            setEssentialValue: "coordsShadow",
            value: desiredStateVariableValues.coordsShadow
          }]
        };
      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        coordsShadow: {
          dependencyType: "stateVariable",
          variableName: "coordsShadow",
        },
        coords: {
          dependencyType: "attributeComponent",
          attributeName: "coords",
          variableNames: ["value"],
        },
        x: {
          dependencyType: "attributeComponent",
          attributeName: "x",
        },
        y: {
          dependencyType: "attributeComponent",
          attributeName: "y",
        },
        z: {
          dependencyType: "attributeComponent",
          attributeName: "z",
        },
        xs: {
          dependencyType: "attributeComponent",
          attributeName: "xs",
          variableNames: ["nComponents"]
        },
        pointChild: {
          dependencyType: "child",
          childGroups: ["points"],
          variableNames: ["nDimensions"]
        },
        vectorChild: {
          dependencyType: "child",
          childGroups: ["vectors"],
          variableNames: ["nDimensions"]
        }
      }),
      definition: function ({ dependencyValues }) {
        // console.log(`nDimensions definition`)
        // console.log(dependencyValues)

        let basedOnCoords = false;
        let coords;
        let nDimensions;

        // if have a component child, they will overwrite any other component values
        // so is a minimum for nDimensions
        // Exception if only x is specified, least nDimensions at zero
        // so that only specifying x still gives a 2D point
        // (If want 1D point, specify via other means, such as coords or xs)
        if (dependencyValues.z !== null) {
          nDimensions = 3;
        } else if (dependencyValues.y !== null) {
          nDimensions = 2;
        } else {
          nDimensions = 0;
        }

        if (dependencyValues.coords !== null) {
          basedOnCoords = true;
          coords = dependencyValues.coords.stateValues.value;
        } else if (dependencyValues.coordsShadow) {
          basedOnCoords = true;
          coords = dependencyValues.coordsShadow;
        }

        if (basedOnCoords) {

          let coordsTree = coords.tree;
          if (Array.isArray(coordsTree) && vectorOperators.includes(coordsTree[0])) {
            nDimensions = Math.max(coordsTree.length - 1, nDimensions);
          } else {
            nDimensions = Math.max(1, nDimensions);
          }

          // if based on coords, should check for actual change
          // as frequently the dimension doesn't change
          return { setValue: { nDimensions }, checkForActualChange: { nDimensions: true } };


        } else {

          if (dependencyValues.xs !== null) {
            return {
              setValue: {
                nDimensions: Math.max(dependencyValues.xs.stateValues.nComponents, nDimensions)
              }
            }
          }
          if (dependencyValues.pointChild.length > 0) {
            return {
              setValue: {
                nDimensions: Math.max(dependencyValues.pointChild[0].stateValues.nDimensions, nDimensions)
              }
            }
          }
          if (dependencyValues.vectorChild.length > 0) {
            return {
              setValue: {
                nDimensions: Math.max(dependencyValues.vectorChild[0].stateValues.nDimensions, nDimensions)
              }
            }
          }

          if (nDimensions === 0) {
            // if nothing specified, make it a 2D point
            nDimensions = 2;
          }

          return { setValue: { nDimensions }, checkForActualChange: { nDimensions: true } };

        }


      }
    }

    stateVariableDefinitions.arrayVariableForConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { arrayVariableForConstraints: "unconstrainedXs" } })
    }

    stateVariableDefinitions.arrayEntryPrefixForConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { arrayEntryPrefixForConstraints: "unconstrainedX" } })
    }

    stateVariableDefinitions.nDimensionsForConstraints = {
      isAlias: true,
      targetVariableName: "nDimensions"
    };


    stateVariableDefinitions.unconstrainedXs = {
      isArray: true,
      isLocation: true,
      entryPrefixes: ["unconstrainedX"],
      defaultValueByArrayKey: () => me.fromAst(0),
      hasEssential: true,
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
          coords: {
            dependencyType: "attributeComponent",
            attributeName: "coords",
            variableNames: ["value"],
          },
        };

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            xs: {
              dependencyType: "attributeComponent",
              attributeName: "xs",
              variableNames: ["math" + varEnding]
            },
            pointChild: {
              dependencyType: "child",
              childGroups: ["points"],
              variableNames: ["x" + varEnding]
            },
            vectorChild: {
              dependencyType: "child",
              childGroups: ["vectors"],
              variableNames: ["x" + varEnding]
            }
          }
          if (arrayKey === "0") {
            dependenciesByKey[arrayKey].component = {
              dependencyType: "attributeComponent",
              attributeName: "x",
              variableNames: ["value"],
            }
          } else if (arrayKey === "1") {
            dependenciesByKey[arrayKey].component = {
              dependencyType: "attributeComponent",
              attributeName: "y",
              variableNames: ["value"],
            }
          } else if (arrayKey === "2") {
            dependenciesByKey[arrayKey].component = {
              dependencyType: "attributeComponent",
              attributeName: "z",
              variableNames: ["value"],
            }
          }
        }

        return { globalDependencies, dependenciesByKey }
      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        // console.log(`unconstrained xs definition by key for ${componentName}`)
        // console.log(deepClone(globalDependencyValues))
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys));

        let newXs = {};
        let essentialXs = {};

        let basedOnCoords = false;
        let coords;

        if (globalDependencyValues.coords !== null) {
          basedOnCoords = true;
          coords = globalDependencyValues.coords.stateValues.value;
        } else if (globalDependencyValues.coordsShadow) {
          basedOnCoords = true;
          coords = globalDependencyValues.coordsShadow;
        }

        if (basedOnCoords) {

          let coordsTree = coords.tree;
          if (Array.isArray(coordsTree) && vectorOperators.includes(coordsTree[0])) {
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
            let xs = dependencyValuesByKey[arrayKey].xs;
            if (xs !== null) {
              let val = xs.stateValues["math" + varEnding];
              if (val !== undefined) {
                newXs[arrayKey] = val.simplify();
              }
            } else {
              let pointChild = dependencyValuesByKey[arrayKey].pointChild;
              if (pointChild.length > 0) {
                newXs[arrayKey] = pointChild[0].stateValues["x" + varEnding]
              } else {
                let vectorChild = dependencyValuesByKey[arrayKey].vectorChild;
                if (vectorChild.length > 0) {
                  newXs[arrayKey] = vectorChild[0].stateValues["x" + varEnding]
                }
              }
            }
          }
        }


        // if have a component, that supercedes other values
        for (let arrayKey of arrayKeys) {
          let component = dependencyValuesByKey[arrayKey].component;
          if (component) {
            newXs[arrayKey] = component.stateValues.value.simplify();
          } else if (newXs[arrayKey] === undefined) {
            essentialXs[arrayKey] = true
          }
        }

        // console.log("newXs");
        // console.log(newXs);
        // console.log("essentialXs");
        // console.log(essentialXs);
        let result = {};
        if (Object.keys(newXs).length > 0) {
          result.setValue = { unconstrainedXs: newXs };
        }
        if (Object.keys(essentialXs).length > 0) {
          result.useEssentialOrDefaultValue = { unconstrainedXs: essentialXs };
        }
        return result;

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, arraySize
      }) {

        // console.log(`invertUnconstrainedXs, ${componentName}`);
        // console.log(desiredStateVariableValues)
        // console.log(globalDependencyValues);
        // console.log(dependencyValuesByKey);

        let instructions = [];
        let basedOnCoords = false;
        let coordsDependency;
        let coordsTree;
        let setCoords = false;

        if (globalDependencyValues.coords !== null) {
          basedOnCoords = true;
          coordsDependency = "coords";
          coordsTree = Array(arraySize[0] + 1);
        } else if (globalDependencyValues.coordsShadow !== null) {
          basedOnCoords = true;
          coordsDependency = "coordsShadow"
          coordsTree = Array(arraySize[0] + 1);
        }


        for (let arrayKey of Object.keys(desiredStateVariableValues.unconstrainedXs).reverse()) {
          let desiredValue = convertValueToMathExpression(desiredStateVariableValues.unconstrainedXs[arrayKey])

          let component = dependencyValuesByKey[arrayKey].component;
          if (component !== null) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].component,
              desiredValue,
              childIndex: 0,
              variableIndex: 0,
            });
          } else if (basedOnCoords) {
            coordsTree[Number(arrayKey) + 1] = desiredValue.tree;
            setCoords = true;

          } else {

            let xs = dependencyValuesByKey[arrayKey].xs;
            if (xs !== null) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].xs,
                desiredValue,
                childIndex: 0,
                variableIndex: 0,
              });
            } else {

              let pointChild = dependencyValuesByKey[arrayKey].pointChild;
              if (pointChild.length > 0) {
                instructions.push({
                  setDependency: dependencyNamesByKey[arrayKey].pointChild,
                  desiredValue,
                  childIndex: 0,
                  variableIndex: 0,
                });
              } else {
                let vectorChild = dependencyValuesByKey[arrayKey].vectorChild;
                if (vectorChild.length > 0) {
                  instructions.push({
                    setDependency: dependencyNamesByKey[arrayKey].vectorChild,
                    desiredValue,
                    childIndex: 0,
                    variableIndex: 0,
                  });
                } else {
                  instructions.push({
                    setEssentialValue: "unconstrainedXs",
                    value: { [arrayKey]: desiredValue },
                  });
                }
              }
            }
          }
        }

        if (setCoords) {
          let desiredCoords;
          if (arraySize[0] === 1) {
            desiredCoords = me.fromAst(coordsTree[1])
          } else {
            coordsTree[0] = "vector";
            desiredCoords = me.fromAst(coordsTree)
          };
          let instruction = {
            setDependency: coordsDependency,
            desiredValue: desiredCoords
          }
          if (coordsDependency === "coords") {
            instruction.childIndex = 0;
            instruction.variableIndex = 0;
          }

          instructions.push(instruction);

        }

        return {
          success: true,
          instructions,
        }

      },
    }

    stateVariableDefinitions.xs = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
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
            dependencyType: "child",
            childGroups: ["constraints"],
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

          if (dependencyValuesByKey[arrayKey].constraintsChild.length > 0) {
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
          return { setValue: { xs } }
        } else {
          return {};
        }
      },
      async inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // console.log('invert xs')
        // console.log(desiredStateVariableValues);
        // console.log(dependencyValuesByKey);
        // console.log(dependencyNamesByKey);

        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }


        let instructions = [];
        for (let arrayKey of Object.keys(desiredStateVariableValues.xs).reverse()) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }
          if (dependencyValuesByKey[arrayKey].constraintsChild.length > 0) {
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
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "coords",
        attributesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"],
      },
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
        } else if (coordsAst.length === 1) {
          coordsAst = coordsAst[0];
        } else {
          coordsAst = '\uff3f';
        }

        return { setValue: { coords: me.fromAst(coordsAst) } }
      },

      inverseDefinition: async function ({ desiredStateVariableValues, stateValues, initialChange }) {
        // console.log("invertCoords");
        // console.log(desiredStateVariableValues)
        // console.log(stateValues);

        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }

        let instructions = [];

        let desiredXValues = {};

        let coordsTree = desiredStateVariableValues.coords.tree;

        if (!(Array.isArray(coordsTree) && vectorOperators.includes(coordsTree[0]))) {
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

    stateVariableDefinitions.latex = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex"
      },
      returnDependencies: () => ({
        coords: {
          dependencyType: "stateVariable",
          variableName: "coords"
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits"
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals"
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero"
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        let params = {};
        if (dependencyValues.padZeros) {
          if (usedDefault.displayDigits && !usedDefault.displayDecimals) {
            if (Number.isFinite(dependencyValues.displayDecimals)) {
              params.padToDecimals = dependencyValues.displayDecimals;
            }
          } else if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        let latex = roundForDisplay({
          value: dependencyValues.coords,
          dependencyValues, usedDefault
        }).toLatex(params);

        return { setValue: { latex } }

      }
    }

    // currently value is used by answer to get variable for response
    stateVariableDefinitions.value = {
      isAlias: true,
      targetVariableName: "coords"
    };

    stateVariableDefinitions.constraintUsed = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        constraintsChild: {
          dependencyType: "child",
          childGroups: ["constraints"],
          variableNames: ["constraintUsed"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.constraintsChild.length === 0) {
          return { setValue: { constraintUsed: false } }
        } else {
          return {
            setValue: {
              constraintUsed:
                dependencyValues.constraintsChild[0].stateValues.constraintUsed
            }
          }

        }
      }
    }


    stateVariableDefinitions.numericalXs = {
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
            x = dependencyValuesByKey[arrayKey].x.evaluate_to_constant();
            numericalXs[arrayKey] = x;
          } else {
            numericalXs[arrayKey] = NaN;
          }
        }

        return { setValue: { numericalXs } }
      },

      async inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey,
        initialChange, stateValues,
      }) {

        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }


        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.numericalXs) {
          if (!dependencyNamesByKey[arrayKey]) {
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
        setValue: {
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


  static adapters = [{
    stateVariable: "coords",
    stateVariablesToShadow: ["displayDigits", "displayDecimals", "displaySmallAsZero", "padZeros"]
  }];

  async movePoint({ x, y, z, transient, actionId,
    sourceInformation = {}, skipRendererUpdate = false
  }) {
    let components = {};
    if (x !== undefined) {
      components[0] = me.fromAst(x);
    }
    if (y !== undefined) {
      components[1] = me.fromAst(y);
    }
    if (z !== undefined) {
      components[2] = me.fromAst(z);
    }
    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "xs",
          value: components,
        }],
        transient,
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    } else {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [{
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "xs",
          value: components,
        }],
        actionId,
        sourceInformation,
        skipRendererUpdate,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            x, y, z
          }
        }
      });
    }

  }


  switchPoint() {
  }


  async pointClicked({ actionId, name, sourceInformation = {}, skipRendererUpdate = false }) {

    if (! await this.stateValues.fixed) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "click",
        componentName: name,  // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      })
    }

    this.coreFunctions.resolveAction({ actionId });

  }

  async pointFocused({ actionId, name, sourceInformation = {}, skipRendererUpdate = false }) {

    if (! await this.stateValues.fixed) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "focus",
        componentName: name,  // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      })
    }

    this.coreFunctions.resolveAction({ actionId });

  }

}
