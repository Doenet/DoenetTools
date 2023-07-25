import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";
import {
  breakEmbeddedStringByCommas,
  returnBreakStringsSugarFunction,
} from "./commonsugar/breakstrings";
import {
  convertValueToMathExpression,
  roundForDisplay,
  vectorOperators,
} from "../utils/math";
import { returnTextStyleDescriptionDefinitions } from "../utils/style";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

export default class Vector extends GraphicalComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveVector: this.moveVector.bind(this),
      vectorClicked: this.vectorClicked.bind(this),
      vectorFocused: this.vectorFocused.bind(this),
    });
  }
  static componentType = "vector";

  static primaryStateVariableForDefinition = "displacementShadow";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };
    attributes.headDraggable = {
      createComponentOfType: "boolean",
    };
    attributes.tailDraggable = {
      createComponentOfType: "boolean",
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
    attributes.displacement = {
      createComponentOfType: "coords",
    };
    attributes.head = {
      createComponentOfType: "point",
    };
    attributes.tail = {
      createComponentOfType: "point",
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.displayWithAngleBrackets = {
      createComponentOfType: "boolean",
      createStateVariable: "displayWithAngleBrackets",
      defaultValue: false,
      public: true,
    };

    attributes.showCoordsWhenDragging = {
      createComponentOfType: "boolean",
      createStateVariable: "showCoordsWhenDragging",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoXsOrCoords = function ({
      matchedChildren,
      componentInfoObjects,
    }) {
      let componentIsSpecifiedType =
        componentInfoObjects.componentIsSpecifiedType;

      // Find potential component children, i.e., consecutive children that aren't constraints or labels
      // Note: including constraints here in case we add constraints later to vectors

      let componentChildren = [],
        nonComponentChildrenBegin = [],
        nonComponentChildrenEnd = [];

      for (let child of matchedChildren) {
        if (
          componentIsSpecifiedType(child, "constraints") ||
          componentIsSpecifiedType(child, "label")
        ) {
          if (componentChildren.length > 0) {
            nonComponentChildrenEnd.push(child);
          } else {
            nonComponentChildrenBegin.push(child);
          }
        } else if (nonComponentChildrenEnd.length > 0) {
          nonComponentChildrenEnd.push(child);
        } else {
          componentChildren.push(child);
        }
      }

      if (componentChildren.length === 0) {
        return { success: false };
      }

      if (componentChildren.length === 1) {
        let child = componentChildren[0];

        if (
          componentIsSpecifiedType(child, "point") ||
          componentIsSpecifiedType(child, "vector")
        ) {
          // if have an isolated point or vector, don't use sugar
          // and that child will picked up by the point or vector child group
          return { success: false };
        }
      }

      let nCompChildren = componentChildren.length;

      // check if componentChildren represent a single expression inside parens
      let firstChar, lastChar;
      if (typeof componentChildren[0] === "string") {
        componentChildren[0] = componentChildren[0].trimStart();
        firstChar = componentChildren[0][0];
      }
      if (typeof componentChildren[nCompChildren - 1] === "string") {
        componentChildren[nCompChildren - 1] =
          componentChildren[nCompChildren - 1].trimEnd();
        let lastChild = componentChildren[nCompChildren - 1];
        lastChar = lastChild[lastChild.length - 1];
      }

      if (firstChar === "(" && lastChar === ")") {
        // start and end with parens, check if can split by commas after removing these parens
        let modifiedChildren = [...componentChildren];
        modifiedChildren[0] = modifiedChildren[0].substring(1);

        let lastChild = modifiedChildren[modifiedChildren.length - 1];
        modifiedChildren[modifiedChildren.length - 1] = lastChild.substring(
          0,
          lastChild.length - 1,
        );

        let breakResult = breakEmbeddedStringByCommas({
          childrenList: modifiedChildren,
        });

        if (breakResult.success) {
          // wrap maths around each piece, wrap whole thing in mathList
          // and use for xs attribute
          return {
            success: true,
            newAttributes: {
              xs: {
                component: {
                  componentType: "mathList",
                  children: breakResult.pieces.map((x) => ({
                    componentType: "math",
                    children: x,
                  })),
                  skipSugar: true,
                },
              },
            },
            newChildren: [
              ...nonComponentChildrenBegin,
              ...nonComponentChildrenEnd,
            ],
          };
        }
      }

      // if didn't succeed in breaking it into xs, then use the component children as a displacement
      return {
        success: true,
        newAttributes: {
          displacement: {
            component: {
              componentType: "coords",
              children: componentChildren,
            },
          },
        },
        newChildren: [...nonComponentChildrenBegin, ...nonComponentChildrenEnd],
      };
    };

    sugarInstructions.push({
      replacementFunction: breakIntoXsOrCoords,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    let childGroups = super.returnChildGroups();

    childGroups.push(
      ...[
        {
          group: "pointsAndVectors",
          componentTypes: ["point", "vector"],
        },
      ],
    );

    return childGroups;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

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
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let lineColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          lineColorWord = dependencyValues.selectedStyle.lineColorWordDarkMode;
        } else {
          lineColorWord = dependencyValues.selectedStyle.lineColorWord;
        }

        let styleDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (styleDescription) {
            styleDescription += " ";
          }
          styleDescription += dependencyValues.selectedStyle.lineStyleWord;
        }

        if (styleDescription) {
          styleDescription += " ";
        }

        styleDescription += lineColorWord;

        return { setValue: { styleDescription } };
      },
    };

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        styleDescription: {
          dependencyType: "stateVariable",
          variableName: "styleDescription",
        },
      }),
      definition: function ({ dependencyValues }) {
        let styleDescriptionWithNoun =
          dependencyValues.styleDescription + " vector";

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    stateVariableDefinitions.tailDraggable = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        tailDraggableAttr: {
          dependencyType: "attributeComponent",
          attributeName: "tailDraggable",
          variableNames: ["value"],
        },
        draggable: {
          dependencyType: "stateVariable",
          variableName: "draggable",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.tailDraggableAttr) {
          return {
            setValue: {
              tailDraggable:
                dependencyValues.tailDraggableAttr.stateValues.value,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: {
              tailDraggable: { defaultValue: dependencyValues.draggable },
            },
          };
        }
      },
    };

    stateVariableDefinitions.headDraggable = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      hasEssential: true,
      forRenderer: true,
      returnDependencies: () => ({
        headDraggableAttr: {
          dependencyType: "attributeComponent",
          attributeName: "headDraggable",
          variableNames: ["value"],
        },
        draggable: {
          dependencyType: "stateVariable",
          variableName: "draggable",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.headDraggableAttr) {
          return {
            setValue: {
              headDraggable:
                dependencyValues.headDraggableAttr.stateValues.value,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: {
              headDraggable: { defaultValue: dependencyValues.draggable },
            },
          };
        }
      },
    };

    // displacementShadow will be null unless vector was created
    // via an adapter or copy prop or from serialized state with displacement value
    // In case of adapter or copy prop,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of displacementShadow will be changed to be the value
    // that shadows the component adapted or copy
    stateVariableDefinitions.displacementShadow = {
      defaultValue: null,
      isLocation: true,
      hasEssential: true,
      essentialVarName: "displacement",
      set: convertValueToMathExpression,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          displacementShadow: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "displacementShadow",
              value: convertValueToMathExpression(
                desiredStateVariableValues.displacementShadow,
              ),
            },
          ],
        };
      },
    };

    // headShadow will be null unless vector was created
    // from serialized state with head value
    stateVariableDefinitions.headShadow = {
      defaultValue: null,
      isLocation: true,
      hasEssential: true,
      essentialVarName: "head",
      set: convertValueToMathExpression,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          headShadow: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "headShadow",
              value: convertValueToMathExpression(
                desiredStateVariableValues.headShadow,
              ),
            },
          ],
        };
      },
    };

    // tailShadow will be null unless vector was created
    // from serialized state with tail value
    stateVariableDefinitions.tailShadow = {
      defaultValue: null,
      isLocation: true,
      hasEssential: true,
      essentialVarName: "tail",
      set: convertValueToMathExpression,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          tailShadow: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "tailShadow",
              value: convertValueToMathExpression(
                desiredStateVariableValues.tailShadow,
              ),
            },
          ],
        };
      },
    };

    stateVariableDefinitions.sourceOfDisplacement = {
      returnDependencies: () => ({
        xAttr: {
          dependencyType: "attributeComponent",
          attributeName: "x",
        },
        yAttr: {
          dependencyType: "attributeComponent",
          attributeName: "y",
        },
        zAttr: {
          dependencyType: "attributeComponent",
          attributeName: "z",
        },
        xsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "xs",
        },
        displacementAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displacement",
        },
        pointOrVectorChild: {
          dependencyType: "child",
          childGroups: ["pointsAndVectors"],
        },
      }),
      definition({ dependencyValues }) {
        let sourceOfDisplacement = null;
        if (dependencyValues.pointOrVectorChild.length > 0) {
          sourceOfDisplacement = "pointOrVectorChild";
        } else if (dependencyValues.displacementAttr !== null) {
          sourceOfDisplacement = "displacementAttr";
        } else if (dependencyValues.xsAttr !== null) {
          sourceOfDisplacement = "xsAttr";
        } else if (
          dependencyValues.xAttr !== null ||
          dependencyValues.yAttr !== null ||
          dependencyValues.zAttr !== null
        ) {
          sourceOfDisplacement = "componentAttrs";
        }

        return {
          setValue: { sourceOfDisplacement },
        };
      },
    };

    // if a copy shadow, the basedOnX definitions will be overwritten
    // so we don't have to consider that case here

    stateVariableDefinitions.basedOnHead = {
      returnDependencies: () => ({
        headAttr: {
          dependencyType: "attributeComponent",
          attributeName: "head",
        },
        headShadow: {
          dependencyType: "stateVariable",
          variableName: "headShadow",
        },
        tailAttr: {
          dependencyType: "attributeComponent",
          attributeName: "tail",
        },
        sourceOfDisplacement: {
          dependencyType: "stateVariable",
          variableName: "sourceOfDisplacement",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (
          dependencyValues.tailAttr !== null &&
          dependencyValues.sourceOfDisplacement !== null
        ) {
          let warnings = [];
          if (dependencyValues.headAttr !== null) {
            // if overprescribed by specifying head, tail, and displacement
            // we ignore head
            warnings.push({
              message:
                "Vector is prescribed by head, tail, and displacement.  Ignoring specified head.",
              level: 1,
            });
          }
          return {
            setValue: { basedOnHead: false },
            checkForActualChange: { basedOnHead: true },
            sendWarnings: warnings,
          };
        }

        if (dependencyValues.headAttr !== null) {
          return {
            setValue: { basedOnHead: true },
            checkForActualChange: { basedOnHead: true },
          };
        }

        return {
          setValue: { basedOnHead: dependencyValues.headShadow !== null },
          checkForActualChange: { basedOnHead: true },
        };
      },
    };

    stateVariableDefinitions.basedOnTail = {
      returnDependencies: () => ({
        tailAttr: {
          dependencyType: "attributeComponent",
          attributeName: "tail",
        },
        tailShadow: {
          dependencyType: "stateVariable",
          variableName: "tailShadow",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.tailAttr !== null) {
          return {
            setValue: { basedOnTail: true },
            checkForActualChange: { basedOnTail: true },
          };
        }

        return {
          setValue: { basedOnTail: dependencyValues.tailShadow !== null },
          checkForActualChange: { basedOnTail: true },
        };
      },
    };

    stateVariableDefinitions.basedOnDisplacement = {
      returnDependencies: () => ({
        sourceOfDisplacement: {
          dependencyType: "stateVariable",
          variableName: "sourceOfDisplacement",
        },
        displacementShadow: {
          dependencyType: "stateVariable",
          variableName: "displacementShadow",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.sourceOfDisplacement !== null) {
          return {
            setValue: { basedOnDisplacement: true },
            checkForActualChange: { basedOnDisplacement: true },
          };
        }
        return {
          setValue: {
            basedOnDisplacement: dependencyValues.displacementShadow !== null,
          },
          checkForActualChange: { basedOnDisplacement: true },
        };
      },
    };

    stateVariableDefinitions.numDimDisplacement = {
      stateVariablesDeterminingDependencies: [
        "basedOnDisplacement",
        "basedOnHead",
        "basedOnTail",
      ],
      returnDependencies({ stateValues }) {
        let dependencies = {
          basedOnHead: {
            dependencyType: "stateVariable",
            variableName: "basedOnHead",
          },
          basedOnTail: {
            dependencyType: "stateVariable",
            variableName: "basedOnTail",
          },
          basedOnDisplacement: {
            dependencyType: "stateVariable",
            variableName: "basedOnDisplacement",
          },
          sourceOfDisplacement: {
            dependencyType: "stateVariable",
            variableName: "sourceOfDisplacement",
          },
          displacementShadow: {
            dependencyType: "stateVariable",
            variableName: "displacementShadow",
          },
          displacementAttr: {
            dependencyType: "attributeComponent",
            attributeName: "displacement",
            variableNames: ["value"],
          },
          pointOrVectorChild: {
            dependencyType: "child",
            childGroups: ["pointsAndVectors"],
            variableNames: ["numDimensions"],
          },
          xAttr: {
            dependencyType: "attributeComponent",
            attributeName: "x",
          },
          yAttr: {
            dependencyType: "attributeComponent",
            attributeName: "y",
          },
          zAttr: {
            dependencyType: "attributeComponent",
            attributeName: "z",
          },
          xsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "xs",
            variableNames: ["numComponents"],
          },
        };

        if (!stateValues.basedOnDisplacement) {
          if (stateValues.basedOnHead) {
            dependencies.numDimHead = {
              dependencyType: "stateVariable",
              variableName: "numDimHead",
            };
          }
          if (stateValues.basedOnTail) {
            dependencies.numDimTail = {
              dependencyType: "stateVariable",
              variableName: "numDimTail",
            };
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        let numDimDisplacement;

        if (dependencyValues.basedOnDisplacement) {
          switch (dependencyValues.sourceOfDisplacement) {
            case "pointOrVectorChild":
              numDimDisplacement =
                dependencyValues.pointOrVectorChild[0].stateValues
                  .numDimensions;
              break;
            case "displacementAttr":
              let displacementTree1 =
                dependencyValues.displacementAttr.stateValues.value
                  .expand()
                  .simplify().tree;
              if (
                Array.isArray(displacementTree1) &&
                vectorOperators.includes(displacementTree1[0])
              ) {
                numDimDisplacement = displacementTree1.length - 1;
              } else {
                numDimDisplacement = 1;
              }
              break;
            case "xsAttr":
              numDimDisplacement =
                dependencyValues.xsAttr.stateValues.numComponents;
              break;
            case "componentAttrs":
              if (dependencyValues.zAttr !== null) {
                numDimDisplacement = 3;
              } else if (dependencyValues.yAttr !== null) {
                numDimDisplacement = 2;
              } else {
                numDimDisplacement = 1;
              }
              break;
            default:
              // since based on displacement and no source of displacement
              // we must have a displacement shadow
              let displacementTree2 = dependencyValues.displacementShadow
                .tuples_to_vectors()
                .expand()
                .simplify().tree;
              if (
                Array.isArray(displacementTree2) &&
                vectorOperators.includes(displacementTree2[0])
              ) {
                numDimDisplacement = displacementTree2.length - 1;
              } else {
                numDimDisplacement = 1;
              }
          }
        } else {
          if (dependencyValues.basedOnHead) {
            if (dependencyValues.basedOnTail) {
              if (dependencyValues.numDimHead === dependencyValues.numDimTail) {
                numDimDisplacement = dependencyValues.numDimHead;
              } else {
                numDimDisplacement = NaN;
              }
            } else {
              numDimDisplacement = dependencyValues.numDimHead;
            }
          } else if (dependencyValues.basedOnTail) {
            numDimDisplacement = dependencyValues.numDimTail;
          } else {
            numDimDisplacement = 2;
          }
        }

        return {
          setValue: { numDimDisplacement },
          checkForActualChange: { numDimDisplacement: true },
        };
      },
    };

    stateVariableDefinitions.numDimHead = {
      stateVariablesDeterminingDependencies: [
        "basedOnDisplacement",
        "basedOnHead",
        "basedOnTail",
      ],
      returnDependencies({ stateValues }) {
        let dependencies = {
          basedOnHead: {
            dependencyType: "stateVariable",
            variableName: "basedOnHead",
          },
          basedOnTail: {
            dependencyType: "stateVariable",
            variableName: "basedOnTail",
          },
          basedOnDisplacement: {
            dependencyType: "stateVariable",
            variableName: "basedOnDisplacement",
          },
          headShadow: {
            dependencyType: "stateVariable",
            variableName: "headShadow",
          },
          headAttr: {
            dependencyType: "attributeComponent",
            attributeName: "head",
            variableNames: ["numDimensions"],
          },
        };

        if (!stateValues.basedOnHead) {
          if (stateValues.basedOnTail) {
            dependencies.numDimTail = {
              dependencyType: "stateVariable",
              variableName: "numDimTail",
            };
          }
          if (stateValues.basedOnDisplacement) {
            dependencies.numDimDisplacement = {
              dependencyType: "stateVariable",
              variableName: "numDimDisplacement",
            };
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        let numDimHead;

        if (dependencyValues.basedOnHead) {
          if (dependencyValues.headAttr !== null) {
            numDimHead = dependencyValues.headAttr.stateValues.numDimensions;
          } else if (dependencyValues.headShadow) {
            let headTree = dependencyValues.headShadow.tree;
            if (
              Array.isArray(headTree) &&
              vectorOperators.includes(headTree[0])
            ) {
              numDimHead = headTree.length - 1;
            } else {
              numDimHead = 2;
            }
          }
        } else {
          if (dependencyValues.basedOnDisplacement) {
            if (dependencyValues.basedOnTail) {
              if (
                dependencyValues.numDimDisplacement ===
                dependencyValues.numDimTail
              ) {
                numDimHead = dependencyValues.numDimDisplacement;
              } else {
                numDimHead = NaN;
              }
            } else {
              numDimHead = dependencyValues.numDimDisplacement;
            }
          } else if (dependencyValues.basedOnTail) {
            numDimHead = dependencyValues.numDimTail;
          } else {
            numDimHead = 2;
          }
        }

        return {
          setValue: { numDimHead },
          checkForActualChange: { numDimHead: true },
        };
      },
    };

    stateVariableDefinitions.numDimTail = {
      stateVariablesDeterminingDependencies: [
        "basedOnDisplacement",
        "basedOnHead",
        "basedOnTail",
      ],
      returnDependencies({ stateValues }) {
        let dependencies = {
          basedOnHead: {
            dependencyType: "stateVariable",
            variableName: "basedOnHead",
          },
          basedOnTail: {
            dependencyType: "stateVariable",
            variableName: "basedOnTail",
          },
          basedOnDisplacement: {
            dependencyType: "stateVariable",
            variableName: "basedOnDisplacement",
          },
          tailShadow: {
            dependencyType: "stateVariable",
            variableName: "tailShadow",
          },
          tailAttr: {
            dependencyType: "attributeComponent",
            attributeName: "tail",
            variableNames: ["numDimensions"],
          },
        };

        if (!stateValues.basedOnTail) {
          if (stateValues.basedOnHead) {
            dependencies.numDimHead = {
              dependencyType: "stateVariable",
              variableName: "numDimHead",
            };
          }
          if (stateValues.basedOnDisplacement) {
            dependencies.numDimDisplacement = {
              dependencyType: "stateVariable",
              variableName: "numDimDisplacement",
            };
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        let numDimTail;

        if (dependencyValues.basedOnTail) {
          if (dependencyValues.tailAttr !== null) {
            numDimTail = dependencyValues.tailAttr.stateValues.numDimensions;
          } else if (dependencyValues.tailShadow) {
            let tailTree = dependencyValues.tailShadow.tree;
            if (
              Array.isArray(tailTree) &&
              vectorOperators.includes(tailTree[0])
            ) {
              numDimTail = tailTree.length - 1;
            } else {
              numDimTail = 2;
            }
          }
        } else {
          if (dependencyValues.basedOnDisplacement) {
            if (dependencyValues.basedOnHead) {
              if (
                dependencyValues.numDimDisplacement ===
                dependencyValues.numDimHead
              ) {
                numDimTail = dependencyValues.numDimDisplacement;
              } else {
                numDimTail = NaN;
              }
            } else {
              numDimTail = dependencyValues.numDimDisplacement;
            }
          } else if (dependencyValues.basedOnHead) {
            numDimTail = dependencyValues.numDimHead;
          } else {
            numDimTail = 2;
          }
        }

        return {
          setValue: { numDimTail },
          checkForActualChange: { numDimTail: true },
        };
      },
    };

    stateVariableDefinitions.numDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        basedOnHead: {
          dependencyType: "stateVariable",
          variableName: "basedOnHead",
        },
        basedOnTail: {
          dependencyType: "stateVariable",
          variableName: "basedOnTail",
        },
        basedOnDisplacement: {
          dependencyType: "stateVariable",
          variableName: "basedOnDisplacement",
        },
        numDimDisplacement: {
          dependencyType: "stateVariable",
          variableName: "numDimDisplacement",
        },
        numDimHead: {
          dependencyType: "stateVariable",
          variableName: "numDimHead",
        },
        numDimTail: {
          dependencyType: "stateVariable",
          variableName: "numDimTail",
        },
      }),
      definition: function ({ dependencyValues }) {
        // console.log(`numDimensions definition`)
        // console.log(dependencyValues)

        let numDimensions;
        if (dependencyValues.basedOnDisplacement) {
          if (dependencyValues.basedOnTail) {
            // ignore head if have both displacement and tail
            if (
              dependencyValues.numDimDisplacement !==
              dependencyValues.numDimTail
            ) {
              let warning = {
                message: "numDimensions mismatch in vector.",
                level: 1,
              };
              return {
                setValue: { numDimensions: NaN },
                sendWarnings: [warning],
              };
            }
          } else if (dependencyValues.basedOnHead) {
            if (
              dependencyValues.numDimDisplacement !==
              dependencyValues.numDimHead
            ) {
              let warning = {
                message: "numDimensions mismatch in vector.",
                level: 1,
              };
              return {
                setValue: { numDimensions: NaN },
                sendWarnings: [warning],
              };
            }
          }
          numDimensions = dependencyValues.numDimDisplacement;
        } else if (dependencyValues.basedOnTail) {
          if (dependencyValues.basedOnHead) {
            if (dependencyValues.numDimTail !== dependencyValues.numDimHead) {
              let warning = {
                message: "numDimensions mismatch in vector.",
                level: 1,
              };
              return {
                setValue: { numDimensions: NaN },
                sendWarnings: [warning],
              };
            }
          }
          numDimensions = dependencyValues.numDimTail;
        } else if (dependencyValues.basedOnHead) {
          numDimensions = dependencyValues.numDimHead;
        } else {
          numDimensions = 2;
        }

        return {
          setValue: { numDimensions },
          checkForActualChange: { numDimensions: true },
        };
      },
    };

    // allowed possibilities for specified properties
    // nothing (tail set to zero, displacement/xs set to (1,0s), head set to tail+displacement/xs)
    // head (tail set to zero, displacement/xs set to head-tail)
    // tail (displacement/xs set to (1,0s), head set to tail+displacement/xs)
    // displacement/xs (tail set to zero, head set to tail+displacement)
    // head and tail (displacement/xs set to head-tail)
    // head and displacement/xs (tail set to head-displacement)
    // tail and displacement/xs (head set to tail+displacement)
    // If head, tail, and displacment/xs supplied, ignore head

    stateVariableDefinitions.displacement = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        attributesToShadow: ["displayWithAngleBrackets"],
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "x") {
            return [];
          } else {
            // entire array
            // wrap by both <vector> and <xs>
            return [
              ["vector", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      entryPrefixes: ["x"],
      hasEssential: true,
      essentialVarName: "displacement2", // since "displacement" used for displacementShadow
      set: convertValueToMathExpression,
      stateVariablesDeterminingDependencies: [
        "basedOnDisplacement",
        "basedOnHead",
        "sourceOfDisplacement",
      ],
      returnArraySizeDependencies: () => ({
        numDimDisplacement: {
          dependencyType: "stateVariable",
          variableName: "numDimDisplacement",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimDisplacement];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          basedOnHead: {
            dependencyType: "stateVariable",
            variableName: "basedOnHead",
          },
          basedOnTail: {
            dependencyType: "stateVariable",
            variableName: "basedOnTail",
          },
          basedOnDisplacement: {
            dependencyType: "stateVariable",
            variableName: "basedOnDisplacement",
          },
          displacementShadow: {
            dependencyType: "stateVariable",
            variableName: "displacementShadow",
          },
          displacementAttr: {
            dependencyType: "attributeComponent",
            attributeName: "displacement",
            variableNames: ["value"],
          },
          sourceOfDisplacement: {
            dependencyType: "stateVariable",
            variableName: "sourceOfDisplacement",
          },
        };

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            xsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "xs",
              variableNames: ["math" + varEnding],
            },
            pointOrVectorChild: {
              dependencyType: "child",
              childGroups: ["pointsAndVectors"],
              variableNames: ["x" + varEnding],
            },
          };
          if (arrayKey === "0") {
            dependenciesByKey[arrayKey].componentAttr = {
              dependencyType: "attributeComponent",
              attributeName: "x",
              variableNames: ["value"],
            };
          } else if (arrayKey === "1") {
            dependenciesByKey[arrayKey].componentAttr = {
              dependencyType: "attributeComponent",
              attributeName: "y",
              variableNames: ["value"],
            };
          } else if (arrayKey === "2") {
            dependenciesByKey[arrayKey].componentAttr = {
              dependencyType: "attributeComponent",
              attributeName: "z",
              variableNames: ["value"],
            };
          }

          if (!stateValues.basedOnDisplacement && stateValues.basedOnHead) {
            // if not based on displacement and based on head,
            // will always use head and tail values
            // even if not based on tail,
            // as tail will be made essential (with default of zero)
            dependenciesByKey[arrayKey].tailX = {
              dependencyType: "stateVariable",
              variableName: "tailX" + varEnding,
            };
            dependenciesByKey[arrayKey].headX = {
              dependencyType: "stateVariable",
              variableName: "headX" + varEnding,
            };
          }
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        // console.log('array definition of vector displacement', componentName)
        // console.log(globalDependencyValues, dependencyValuesByKey, arrayKeys)

        let displacement = {};
        let essentialDisplacement = {};

        let prescribedDisplacement;
        if (globalDependencyValues.basedOnDisplacement) {
          if (
            globalDependencyValues.sourceOfDisplacement === "displacementAttr"
          ) {
            prescribedDisplacement =
              globalDependencyValues.displacementAttr.stateValues.value;
          } else if (globalDependencyValues.sourceOfDisplacement === null) {
            prescribedDisplacement =
              globalDependencyValues.displacementShadow.tuples_to_vectors();
          }
        }

        if (prescribedDisplacement) {
          prescribedDisplacement = prescribedDisplacement.expand().simplify();
          let displacementTree = prescribedDisplacement.tree;
          if (
            Array.isArray(displacementTree) &&
            vectorOperators.includes(displacementTree[0])
          ) {
            for (let arrayKey of arrayKeys) {
              let ind = Number(arrayKey);
              if (ind >= 0 || ind < displacementTree.length - 1) {
                if (displacementTree[ind + 1] === undefined) {
                  displacement[arrayKey] = me.fromAst("\uff3f");
                } else {
                  displacement[arrayKey] =
                    prescribedDisplacement.get_component(ind);
                }
              }
            }
          } else {
            if (arrayKeys.includes("0")) {
              displacement[0] = prescribedDisplacement;
            }
          }
        } else {
          for (let arrayKey of arrayKeys) {
            let varEnding = Number(arrayKey) + 1;

            if (globalDependencyValues.basedOnDisplacement) {
              switch (globalDependencyValues.sourceOfDisplacement) {
                case "pointOrVectorChild":
                  displacement[arrayKey] =
                    dependencyValuesByKey[
                      arrayKey
                    ].pointOrVectorChild[0].stateValues["x" + varEnding];
                  break;
                case "xsAttr":
                  displacement[arrayKey] =
                    dependencyValuesByKey[arrayKey].xsAttr.stateValues[
                      "math" + varEnding
                    ].simplify();
                  break;
                case "componentAttrs":
                  let componentAttr =
                    dependencyValuesByKey[arrayKey].componentAttr;
                  if (componentAttr === null) {
                    // based on component attributes, but don't have
                    // this particular one specified
                    essentialDisplacement[arrayKey] = {
                      defaultValue: me.fromAst(0),
                    };
                  } else {
                    displacement[arrayKey] =
                      componentAttr.stateValues.value.simplify();
                  }
                  break;
              }
            } else if (globalDependencyValues.basedOnHead) {
              // basedOnDisplacement is false and based on head
              // calculate displacement from head and tail
              displacement[arrayKey] = dependencyValuesByKey[arrayKey].headX
                .subtract(dependencyValuesByKey[arrayKey].tailX)
                .simplify();
            } else {
              // not based on displacement or head, use essential value
              essentialDisplacement[arrayKey] = {
                defaultValue: me.fromAst(arrayKey === "0" ? 1 : 0),
              };
            }
          }
        }

        let result = {};

        if (Object.keys(displacement).length > 0) {
          result.setValue = { displacement };
        }
        if (Object.keys(essentialDisplacement).length > 0) {
          result.useEssentialOrDefaultValue = {
            displacement: essentialDisplacement,
          };
        }

        return result;
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
      }) {
        // console.log(`inverse array definition of displacement`)
        // console.log(JSON.parse(JSON.stringify(desiredStateVariableValues)))
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)))
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))

        let instructions = [];

        if (globalDependencyValues.basedOnDisplacement) {
          if (
            globalDependencyValues.sourceOfDisplacement === "displacementAttr"
          ) {
            if (arraySize[0] > 1) {
              let desiredDisplacement = ["vector"];
              for (let arrayKey in desiredStateVariableValues.displacement) {
                desiredDisplacement[Number(arrayKey) + 1] =
                  desiredStateVariableValues.displacement[arrayKey].tree;
              }
              desiredDisplacement.length = arraySize[0] + 1;
              instructions.push({
                setDependency: "displacementAttr",
                desiredValue: me.fromAst(desiredDisplacement),
                variableIndex: 0,
              });
            } else if (
              arraySize[0] === 1 &&
              "0" in desiredStateVariableValues.displacement
            ) {
              instructions.push({
                setDependency: "displacementAttr",
                desiredValue: desiredStateVariableValues.displacement[0],
                variableIndex: 0,
              });
            }
            return {
              success: true,
              instructions,
            };
          } else if (globalDependencyValues.sourceOfDisplacement === null) {
            if (arraySize[0] > 1) {
              let desiredDisplacement = ["vector"];
              for (let arrayKey in desiredStateVariableValues.displacement) {
                desiredDisplacement[Number(arrayKey) + 1] =
                  desiredStateVariableValues.displacement[arrayKey].tree;
              }
              desiredDisplacement.length = arraySize[0] + 1;
              instructions.push({
                setDependency: "displacementShadow",
                desiredValue: me.fromAst(desiredDisplacement),
              });
            } else if (
              arraySize[0] === 1 &&
              "0" in desiredStateVariableValues.displacement
            ) {
              instructions.push({
                setDependency: "displacementShadow",
                desiredValue: desiredStateVariableValues.displacement[0],
              });
            }
            return {
              success: true,
              instructions,
            };
          }
        }

        for (let arrayKey in desiredStateVariableValues.displacement) {
          if (globalDependencyValues.basedOnDisplacement) {
            switch (globalDependencyValues.sourceOfDisplacement) {
              case "pointOrVectorChild":
                instructions.push({
                  setDependency:
                    dependencyNamesByKey[arrayKey].pointOrVectorChild,
                  desiredValue:
                    desiredStateVariableValues.displacement[arrayKey],
                  childIndex: 0,
                  variableIndex: 0,
                });
                break;
              case "xsAttr":
                instructions.push({
                  setDependency: dependencyNamesByKey[arrayKey].xsAttr,
                  desiredValue:
                    desiredStateVariableValues.displacement[arrayKey],
                  variableIndex: 0,
                });
                break;
              case "componentAttrs":
                let componentAttr =
                  dependencyValuesByKey[arrayKey].componentAttr;
                if (componentAttr === null) {
                  // based on component attributes, but don't have
                  // this particular one specified
                  instructions.push({
                    setEssentialValue: "displacement",
                    value: {
                      [arrayKey]: convertValueToMathExpression(
                        desiredStateVariableValues.displacement[arrayKey],
                      ),
                    },
                  });
                } else {
                  instructions.push({
                    setDependency: dependencyNamesByKey[arrayKey].componentAttr,
                    desiredValue:
                      desiredStateVariableValues.displacement[arrayKey],
                    variableIndex: 0,
                  });
                }
                break;
            }
          } else if (globalDependencyValues.basedOnHead) {
            // basedOnDisplacement is false and based on head
            // set head to be sum of tail and desired displacement
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].headX,
              desiredValue: dependencyValuesByKey[arrayKey].tailX
                .add(desiredStateVariableValues.displacement[arrayKey])
                .simplify(),
            });
          } else {
            // not based on displacement or head
            // set essential value

            instructions.push({
              setEssentialValue: "displacement",
              value: {
                [arrayKey]: convertValueToMathExpression(
                  desiredStateVariableValues.displacement[arrayKey],
                ),
              },
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.x = {
      isAlias: true,
      targetVariableName: "x1",
    };

    stateVariableDefinitions.y = {
      isAlias: true,
      targetVariableName: "x2",
    };

    stateVariableDefinitions.z = {
      isAlias: true,
      targetVariableName: "x3",
    };

    stateVariableDefinitions.head = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "headX") {
            return [];
          } else {
            // entire array
            // wrap by both <point> and <xs>
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      entryPrefixes: ["headX"],
      set: convertValueToMathExpression,
      stateVariablesDeterminingDependencies: ["basedOnHead"],
      returnArraySizeDependencies: () => ({
        numDimHead: {
          dependencyType: "stateVariable",
          variableName: "numDimHead",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimHead];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          basedOnDisplacement: {
            dependencyType: "stateVariable",
            variableName: "basedOnDisplacement",
          },
          basedOnTail: {
            dependencyType: "stateVariable",
            variableName: "basedOnTail",
          },
          basedOnHead: {
            dependencyType: "stateVariable",
            variableName: "basedOnHead",
          },
          headShadow: {
            dependencyType: "stateVariable",
            variableName: "headShadow",
          },
        };

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            headAttr: {
              dependencyType: "attributeComponent",
              attributeName: "head",
              variableNames: ["x" + varEnding],
            },
          };

          if (!stateValues.basedOnHead) {
            // if not based on head, will always use tail and displacement value
            // as, even if not based on tail or displacment,
            // they will be made essential
            dependenciesByKey[arrayKey].tailX = {
              dependencyType: "stateVariable",
              variableName: "tailX" + varEnding,
            };
            dependenciesByKey[arrayKey].x = {
              dependencyType: "stateVariable",
              variableName: "x" + varEnding,
            };
          }
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        // console.log('array definition of vector head')
        // console.log(globalDependencyValues, dependencyValuesByKey, arrayKeys)

        let head = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          if (globalDependencyValues.basedOnHead) {
            if (dependencyValuesByKey[arrayKey].headAttr !== null) {
              head[arrayKey] =
                dependencyValuesByKey[arrayKey].headAttr.stateValues[
                  "x" + varEnding
                ];
            } else if (globalDependencyValues.headShadow !== null) {
              head[arrayKey] = globalDependencyValues.headShadow.get_component(
                Number(arrayKey),
              );
            }
          } else {
            // basedOnHead is false

            // displacement and tail: add to create head
            // it doesn't matter if based on tail or displacement
            // as will use their essential values

            head[arrayKey] = dependencyValuesByKey[arrayKey].tailX
              .add(dependencyValuesByKey[arrayKey].x)
              .simplify();
          }
        }

        return { setValue: { head } };
      },

      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
      }) {
        // console.log(`inverse array definition of head`, desiredStateVariableValues,
        //   globalDependencyValues, dependencyValuesByKey
        // )

        let instructions = [];

        let updateHeadShadow = false;

        for (let arrayKey in desiredStateVariableValues.head) {
          if (globalDependencyValues.basedOnHead) {
            if (
              dependencyValuesByKey[arrayKey].headAttr &&
              dependencyValuesByKey[arrayKey].headAttr !== null
            ) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].headAttr,
                desiredValue: desiredStateVariableValues.head[arrayKey],
                variableIndex: 0,
              });
            } else if (globalDependencyValues.headShadow !== null) {
              updateHeadShadow = true;
            }
          } else {
            // not based on head

            // based on displacement and tail (or their essential values):
            // set displacement to be desired head - tail

            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].x,
              desiredValue: desiredStateVariableValues.head[arrayKey]
                .subtract(dependencyValuesByKey[arrayKey].tailX)
                .simplify(),
            });
          }
        }

        if (updateHeadShadow) {
          if (arraySize[0] > 1) {
            let desiredHead = ["vector"];
            for (let arrayKey in desiredStateVariableValues.head) {
              desiredHead[Number(arrayKey) + 1] =
                desiredStateVariableValues.head[arrayKey].tree;
            }
            desiredHead.length = arraySize[0] + 1;
            instructions.push({
              setDependency: "headShadow",
              desiredValue: me.fromAst(desiredHead),
            });
          } else if (
            arraySize[0] === 1 &&
            "0" in desiredStateVariableValues.head
          ) {
            instructions.push({
              setDependency: "headShadow",
              desiredValue: desiredStateVariableValues.head[0],
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.tail = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "tailX") {
            return [];
          } else {
            // entire array
            // wrap by both <point> and <xs>
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      entryPrefixes: ["tailX"],
      hasEssential: true,
      defaultValueByArrayKey: () => me.fromAst(0),
      essentialVarName: "tail2", // since tailShadow uses "tail"
      set: convertValueToMathExpression,
      stateVariablesDeterminingDependencies: [
        "basedOnTail",
        "basedOnHead",
        "basedOnDisplacement",
      ],
      returnArraySizeDependencies: () => ({
        numDimTail: {
          dependencyType: "stateVariable",
          variableName: "numDimTail",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimTail];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          basedOnDisplacement: {
            dependencyType: "stateVariable",
            variableName: "basedOnDisplacement",
          },
          basedOnHead: {
            dependencyType: "stateVariable",
            variableName: "basedOnHead",
          },
          tailShadow: {
            dependencyType: "stateVariable",
            variableName: "tailShadow",
          },
        };

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          dependenciesByKey[arrayKey] = {
            tailAttr: {
              dependencyType: "attributeComponent",
              attributeName: "tail",
              variableNames: ["x" + varEnding],
            },
          };

          if (!stateValues.basedOnTail) {
            if (stateValues.basedOnHead && stateValues.basedOnDisplacement) {
              dependenciesByKey[arrayKey].headX = {
                dependencyType: "stateVariable",
                variableName: "headX" + varEnding,
              };
              dependenciesByKey[arrayKey].x = {
                dependencyType: "stateVariable",
                variableName: "x" + varEnding,
              };
            }
          }
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey: function ({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        // console.log('array definition of vector tail');
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)))
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))

        let tail = {};
        let essentialTail = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          if (dependencyValuesByKey[arrayKey].tailAttr !== null) {
            tail[arrayKey] =
              dependencyValuesByKey[arrayKey].tailAttr.stateValues[
                "x" + varEnding
              ];
          } else if (globalDependencyValues.tailShadow !== null) {
            tail[arrayKey] = globalDependencyValues.tailShadow.get_component(
              Number(arrayKey),
            );
          } else {
            // if made it to here, basedOnTail is false

            if (
              globalDependencyValues.basedOnHead &&
              globalDependencyValues.basedOnDisplacement
            ) {
              // based on head and displacement,
              // subtract displacement from head to get tail
              tail[arrayKey] = dependencyValuesByKey[arrayKey].headX
                .subtract(dependencyValuesByKey[arrayKey].x)
                .simplify();
            } else {
              // tail defaults to zero
              // (but it will use the resulting essential value after that
              // so any changes will be saved)

              essentialTail[arrayKey] = true;
            }
          }
        }

        let result = {};

        if (Object.keys(tail).length > 0) {
          result.setValue = { tail };
        }
        if (Object.keys(essentialTail).length > 0) {
          result.useEssentialOrDefaultValue = { tail: essentialTail };
        }

        return result;
      },

      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
      }) {
        // console.log(`inverse array definition of tail`, desiredStateVariableValues,
        //   globalDependencyValues, dependencyValuesByKey
        // )

        let instructions = [];

        let updateTailShadow = false;

        for (let arrayKey in desiredStateVariableValues.tail) {
          if (
            dependencyValuesByKey[arrayKey].tailAttr &&
            dependencyValuesByKey[arrayKey].tailAttr !== null
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].tailAttr,
              desiredValue: desiredStateVariableValues.tail[arrayKey],
              variableIndex: 0,
            });
          } else if (globalDependencyValues.tailShadow !== null) {
            updateTailShadow = true;
          } else {
            // not based on tail

            if (
              globalDependencyValues.basedOnHead &&
              globalDependencyValues.basedOnDisplacement
            ) {
              // set displacement to be difference between head and desired tail

              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].x,
                desiredValue: dependencyValuesByKey[arrayKey].headX
                  .subtract(desiredStateVariableValues.tail[arrayKey])
                  .simplify(),
              });
            } else {
              // if not based on both head and displacement,
              // then tail should have become
              // an essential state variable
              // set the value of the variable directly

              instructions.push({
                setEssentialValue: "tail",
                value: {
                  [arrayKey]: convertValueToMathExpression(
                    desiredStateVariableValues.tail[arrayKey],
                  ),
                },
              });
            }
          }
        }

        if (updateTailShadow) {
          if (arraySize[0] > 1) {
            let desiredTail = ["vector"];
            for (let arrayKey in desiredStateVariableValues.tail) {
              desiredTail[Number(arrayKey) + 1] =
                desiredStateVariableValues.tail[arrayKey].tree;
            }
            desiredTail.length = arraySize[0] + 1;
            instructions.push({
              setDependency: "tailShadow",
              desiredValue: me.fromAst(desiredTail),
            });
          } else if (
            arraySize[0] === 1 &&
            "0" in desiredStateVariableValues.tail
          ) {
            instructions.push({
              setDependency: "tailShadow",
              desiredValue: desiredStateVariableValues.tail[0],
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.magnitude = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
        displacement: {
          dependencyType: "stateVariable",
          variableName: "displacement",
        },
      }),
      definition({ dependencyValues }) {
        let magnitude2 = 0;
        let all_numeric = true;
        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          let disp = dependencyValues.displacement[dim].evaluate_to_constant();
          if (!Number.isFinite(disp)) {
            all_numeric = false;
            break;
          }
          magnitude2 += disp * disp;
        }

        if (all_numeric) {
          return { setValue: { magnitude: me.fromAst(Math.sqrt(magnitude2)) } };
        }

        magnitude2 = ["+"];
        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          magnitude2.push(["^", dependencyValues.displacement[dim], 2]);
        }

        return {
          setValue: {
            magnitude: me.fromAst(["apply", "sqrt", magnitude2]),
          },
        };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let dir = [];
        let dir_length2 = 0;
        let all_numeric = true;
        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          let disp = dependencyValues.displacement[dim].evaluate_to_constant();
          if (!Number.isFinite(disp)) {
            all_numeric = false;
            break;
          }
          dir.push(disp);
          dir_length2 += disp * disp;
        }

        if (!all_numeric) {
          return { success: false };
        }

        // make dir be unit length
        let dir_length = Math.sqrt(dir_length2);
        dir = dir.map((x) => x / dir_length);

        let desiredMagnitude =
          desiredStateVariableValues.magnitude.evaluate_to_constant();

        if (!Number.isFinite(desiredMagnitude) || desiredMagnitude < 0) {
          return { success: false };
        }

        let desiredDisplacement = [];

        for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
          desiredDisplacement.push(me.fromAst(dir[dim] * desiredMagnitude));
        }

        return {
          success: true,
          instructions: [
            {
              setDependency: "displacement",
              desiredValue: desiredDisplacement,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.numericalEndpoints = {
      forRenderer: true,
      returnDependencies: () => ({
        head: {
          dependencyType: "stateVariable",
          variableName: "head",
        },
        tail: {
          dependencyType: "stateVariable",
          variableName: "tail",
        },
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      definition: function ({ dependencyValues }) {
        let numericalHead, numericalTail;
        if (dependencyValues.numDimensions === 1) {
          numericalHead = dependencyValues.head[0].evaluate_to_constant();
          numericalTail = dependencyValues.tail[0].evaluate_to_constant();
        } else {
          numericalHead = [];
          numericalTail = [];

          for (let i = 0; i < dependencyValues.numDimensions; i++) {
            let head = dependencyValues.head[i].evaluate_to_constant();
            numericalHead.push(head);

            let tail = dependencyValues.tail[i].evaluate_to_constant();
            numericalTail.push(tail);
          }
        }

        return {
          setValue: { numericalEndpoints: [numericalTail, numericalHead] },
        };
      },
    };

    stateVariableDefinitions.displacementCoords = {
      isLocation: true,
      returnDependencies: () => ({
        displacement: {
          dependencyType: "stateVariable",
          variableName: "displacement",
        },
        displayWithAngleBrackets: {
          dependencyType: "stateVariable",
          variableName: "displayWithAngleBrackets",
        },
      }),
      definition({ dependencyValues }) {
        let coordsAst = [];
        for (let v of dependencyValues.displacement) {
          if (v) {
            coordsAst.push(v.tree);
          } else {
            coordsAst.push("\uff3f");
          }
        }
        if (coordsAst.length > 1) {
          let operator = dependencyValues.displayWithAngleBrackets
            ? "altvector"
            : "vector";
          coordsAst = [operator, ...coordsAst];
        } else if (coordsAst.length === 1) {
          coordsAst = coordsAst[0];
        } else {
          coordsAst = "\uff3f";
        }

        return { setValue: { displacementCoords: me.fromAst(coordsAst) } };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        let coordsAst = desiredStateVariableValues.displacementCoords.tree;
        let newDisplacement;

        if (
          Array.isArray(coordsAst) &&
          vectorOperators.includes(coordsAst[0])
        ) {
          newDisplacement = coordsAst.slice(1).map((x) => me.fromAst(x));
        } else {
          newDisplacement = [desiredStateVariableValues.displacementCoords];
        }

        return {
          success: true,
          instructions: [
            {
              setDependency: "displacement",
              desiredValue: newDisplacement,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.latex = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
      },
      returnDependencies: () => ({
        displacementCoords: {
          dependencyType: "stateVariable",
          variableName: "displacementCoords",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero",
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros",
        },
      }),
      definition: function ({ dependencyValues }) {
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        let latex = roundForDisplay({
          value: dependencyValues.displacementCoords,
          dependencyValues,
        }).toLatex(params);

        return { setValue: { latex } };
      },
    };

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
        numericalEndpoints: {
          dependencyType: "stateVariable",
          variableName: "numericalEndpoints",
        },
      }),
      definition({ dependencyValues }) {
        let A1 = dependencyValues.numericalEndpoints[0]?.[0];
        let A2 = dependencyValues.numericalEndpoints[0]?.[1];
        let B1 = dependencyValues.numericalEndpoints[1]?.[0];
        let B2 = dependencyValues.numericalEndpoints[1]?.[1];

        let haveConstants =
          Number.isFinite(A1) &&
          Number.isFinite(A2) &&
          Number.isFinite(B1) &&
          Number.isFinite(B2);

        // only implement for
        // - 2D
        // - constant endpoints and
        // - non-degenerate parameters
        let skip =
          dependencyValues.numDimensions !== 2 ||
          !haveConstants ||
          (B1 === A1 && B2 === A2);

        return {
          setValue: {
            nearestPoint: function ({ variables, scales }) {
              if (skip) {
                return {};
              }

              let xscale = scales[0];
              let yscale = scales[1];

              let BA1 = (B1 - A1) / xscale;
              let BA2 = (B2 - A2) / yscale;
              let denom = BA1 * BA1 + BA2 * BA2;

              let t =
                (((variables.x1 - A1) / xscale) * BA1 +
                  ((variables.x2 - A2) / yscale) * BA2) /
                denom;

              let result = {};

              if (t <= 0) {
                result = { x1: A1, x2: A2 };
              } else if (t >= 1) {
                result = { x1: B1, x2: B2 };
              } else {
                result = {
                  x1: A1 + t * BA1 * xscale,
                  x2: A2 + t * BA2 * yscale,
                };
              }

              if (variables.x3 !== undefined) {
                result.x3 = 0;
              }

              return result;
            },
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "displacementCoords",
      componentType: "_directionComponent",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
    {
      stateVariable: "displacementCoords",
      componentType: "coords",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
    {
      stateVariable: "displacementCoords",
      componentType: "point",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
  ];

  async moveVector({
    tailcoords,
    headcoords,
    transient,
    skippable,
    sourceDetails,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (tailcoords !== undefined) {
      if (headcoords !== undefined) {
        // dragged entire vector
        if (!(await this.stateValues.draggable)) {
          return;
        }
      } else {
        // dragged just tail
        if (!(await this.stateValues.tailDraggable)) {
          return;
        }
      }
    } else {
      // dragged just head
      if (!(await this.stateValues.headDraggable)) {
        return;
      }
    }

    let updateInstructions = [];

    if (tailcoords !== undefined) {
      // if based on both head and displacement
      // then set displacement as head - tail
      if (
        (await this.stateValues.basedOnHead) &&
        (await this.stateValues.basedOnDisplacement)
      ) {
        let displacement;
        if (headcoords === undefined) {
          // use current value of head
          // if head isn't supposed to change
          let numericalEndpoints = await this.stateValues.numericalEndpoints;
          displacement = tailcoords.map((x, i) => numericalEndpoints[1][i] - x);
        } else {
          displacement = tailcoords.map((x, i) => headcoords[i] - x);
        }

        updateInstructions.push({
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "displacement",
          value: displacement.map((x) => me.fromAst(x)),
          sourceDetails,
        });
      } else {
        // set tail directly
        updateInstructions.push({
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "tail",
          value: tailcoords.map((x) => me.fromAst(x)),
          sourceDetails,
        });
      }

      if (headcoords === undefined) {
        // if set tail but not head, the idea is that head shouldn't move
        // however, head would move if not based on head
        // so give instructions to change displacement to keep head fixed
        if (!(await this.stateValues.basedOnHead)) {
          let numericalEndpoints = await this.stateValues.numericalEndpoints;
          let displacement = tailcoords.map(
            (x, i) => numericalEndpoints[1][i] - x,
          );
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "displacement",
            value: displacement.map((x) => me.fromAst(x)),
            sourceDetails,
          });
        }
      }
    }

    if (headcoords !== undefined) {
      // for head, we'll set it directly if based on head
      if (await this.stateValues.basedOnHead) {
        updateInstructions.push({
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "head",
          value: headcoords.map((x) => me.fromAst(x)),
          sourceDetails,
        });
      } else {
        // if not based on head
        // then update displacement instead of head

        if (tailcoords == undefined) {
          tailcoords = (await this.stateValues.numericalEndpoints)[0];
        }
        let displacement = tailcoords.map((x, i) => headcoords[i] - x);
        updateInstructions.push({
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "displacement",
          value: displacement.map((x) => me.fromAst(x)),
          sourceDetails,
        });
      }

      if (tailcoords === undefined) {
        // if set head but not tail, the idea is that tail shouldn't move
        // however, tail would move if based on displacement and head
        // so give instructions to change displacement to keep tail fixed
        if (
          (await this.stateValues.basedOnHead) &&
          (await this.stateValues.basedOnDisplacement)
        ) {
          let numericalEndpoints = await this.stateValues.numericalEndpoints;
          let displacement = headcoords.map(
            (x, i) => x - numericalEndpoints[0][i],
          );
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "displacement",
            value: displacement.map((x) => me.fromAst(x)),
            sourceDetails,
          });
        }
      }
    }

    // Note: we set skipRendererUpdate to true
    // so that we can make further adjustments before the renderers are updated
    if (transient) {
      await this.coreFunctions.performUpdate({
        updateInstructions,
        transient,
        skippable,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
      });
    } else {
      await this.coreFunctions.performUpdate({
        updateInstructions,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            head: headcoords,
            tail: tailcoords,
          },
        },
      });
    }

    // we attempt to keep the vector displacement fixed
    // even if one of the points defining it is constrained

    // if dragged the whole vector that is based on tail and head,
    // address case where only one point is constrained
    // to make vector just translate in this case
    if (
      tailcoords !== undefined &&
      headcoords !== undefined &&
      (await this.stateValues.basedOnTail) &&
      (await this.stateValues.basedOnHead)
    ) {
      let numericalPoints = [tailcoords, headcoords];
      let resultingNumericalPoints = await this.stateValues.numericalEndpoints;

      let pointsChanged = [];
      let numPointsChanged = 0;

      for (let [ind, pt] of numericalPoints.entries()) {
        if (!pt.every((v, i) => v === resultingNumericalPoints[ind][i])) {
          pointsChanged.push(ind);
          numPointsChanged++;
        }
      }

      if (numPointsChanged === 1) {
        // one point was altered from the requested location.

        let changedInd = pointsChanged[0];

        let orig1 = numericalPoints[changedInd];
        let changed1 = resultingNumericalPoints[changedInd];
        let changevec1 = orig1.map((v, i) => v - changed1[i]);

        let newNumericalPoints = [];

        for (let i = 0; i < 2; i++) {
          if (i === changedInd) {
            newNumericalPoints.push(resultingNumericalPoints[i]);
          } else {
            newNumericalPoints.push(
              numericalPoints[i].map((v, j) => v - changevec1[j]),
            );
          }
        }

        let newInstructions = [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "tail",
            value: newNumericalPoints[0].map((x) => me.fromAst(x)),
          },
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "head",
            value: newNumericalPoints[1].map((x) => me.fromAst(x)),
          },
        ];

        return await this.coreFunctions.performUpdate({
          updateInstructions: newInstructions,
          transient,
          actionId,
          sourceInformation,
          skipRendererUpdate,
        });
      }
    }

    // if no modifications were made, still need to update renderers
    // as original update was performed with skipping renderer update
    return await this.coreFunctions.updateRenderers({
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }

  async vectorClicked({
    actionId,
    name,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.fixed)) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "click",
        componentName: name, // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }

  async vectorFocused({
    actionId,
    name,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.fixed)) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "focus",
        componentName: name, // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }
  }
}
