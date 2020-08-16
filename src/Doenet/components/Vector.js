import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { breakEmbeddedStringByCommas, breakIntoVectorComponents } from './commonsugar/breakstrings';

export default class Vector extends GraphicalComponent {
  constructor(args) {
    super(args);
    this.moveVector = this.moveVector.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    );
    this.actions = {
      moveVector: this.moveVector,
    }
  }
  static componentType = "vector";

  // used when referencing this component without prop
  // reference via the head/tail/displacement plus keep track of how defined
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() {
    return [
      "head", "tail", "displacement",
      "basedOnHead", "basedOnTail", "basedOnDisplacement",
      "nDimensions",
    ]
  };

  static primaryStateVariableForDefinition = "displacementShadow";

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

    let displacementViaComponents = childLogic.newOperator({
      name: "displacementViaComponents",
      operator: "or",
      propositions: [exactlyOneX, exactlyOneY, exactlyOneZ],
    })

    let exactlyOneDisplacement = childLogic.newLeaf({
      name: "exactlyOneDisplacement",
      componentType: 'vector',
      number: 1
    });

    let displacementOptions = childLogic.newOperator({
      name: "displacementOptions",
      operator: "xor",
      propositions: [exactlyOneDisplacement, exactlyOneXs, displacementViaComponents]
    })

    let exactlyOneHead = childLogic.newLeaf({
      name: "exactlyOneHead",
      componentType: 'head',
      number: 1
    });

    let exactlyOneTail = childLogic.newLeaf({
      name: "exactlyOneTail",
      componentType: 'tail',
      number: 1
    });

    let vectorDefiningPieces = childLogic.newOperator({
      name: "vectorDefiningPieces",
      operator: "or",
      propositions: [displacementOptions, exactlyOneHead, exactlyOneTail]
    })

    let addHeadTail = function ({ activeChildrenMatched }) {
      // if there are two points, add <tail> around first and <head> around second
      // if there is one point, add <head> around it
      let newChildren;
      if (activeChildrenMatched.length === 2) {
        newChildren = [
          {
            componentType: "tail",
            children: [{
              createdComponent: true,
              componentName: activeChildrenMatched[0].componentName
            }],
          },
          {
            componentType: "head",
            children: [{
              createdComponent: true,
              componentName: activeChildrenMatched[1].componentName
            }],
          }
        ]

      } else {
        newChildren = [{
          componentType: "head",
          children: [{
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }],
        }]
      }
      return {
        success: true,
        newChildren,
      }
    }

    let createHeadTailList = function ({ dependencyValues }) {

      let results = breakEmbeddedStringByCommas({
        childrenList: dependencyValues.stringsAndMaths,
      });

      if (results.success !== true) {
        return { success: false }
      }

      let pieces = results.pieces;
      let toDelete = results.toDelete;

      let newChildren = [];


      if (pieces.length < 0 || pieces.length > 2) {
        return { success: false }
      }

      for (let ind = 0; ind < pieces.length; ind++) {
        let piece = pieces[ind];

        // each piece must be a vector (if not, we won't sugar)
        // the next step is to find the vector components
        // so that we can see if the components themselves are vectors

        let result = breakIntoVectorComponents(piece);
        if (result.foundVector !== true) {
          return { success: false };
        }

        let vectorComponents = result.vectorComponents;


        // since we're actually breaking it up,
        // add any more strings to delete
        // that we encountered in the initial breaking into components
        toDelete = [...toDelete, ...result.toDelete];

        let children = vectorComponents.map(x => ({
          componentType: "x",
          children: x
        }));

        if (pieces.length === 2 && ind == 0) {
          newChildren.push({
            componentType: "tail",
            children: [{
              componentType: "xs",
              children
            }]
          })
        } else {
          newChildren.push({
            componentType: "head",
            children: [{
              componentType: "xs",
              children
            }]
          })
        }

      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }

    let exactlyOnePoint = childLogic.newLeaf({
      name: "exactlyOnePoint",
      componentType: 'point',
      number: 1,
    });

    let atMostOnePoint = childLogic.newLeaf({
      name: "exactlyTwoPoints",
      componentType: 'point',
      comparison: "atMost",
      number: 1,
    });

    let oneOrTwoPoints = childLogic.newOperator({
      name: "oneOrTwoPoints",
      operator: "and",
      propositions: [exactlyOnePoint, atMostOnePoint],
      isSugar: true,
      allowSpillover: false,
      logicToWaitOnSugar: ["exactlyOneHead", "exactlyOneTail"],
      replacementFunction: addHeadTail,
    })

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
      logicToWaitOnSugar: ["oneOrTwoPoints"],
      replacementFunction: createHeadTailList,
    });

    let noPoints = childLogic.newLeaf({
      name: "noPoints",
      componentType: 'point',
      number: 0
    });

    childLogic.newOperator({
      name: "vectorOptions",
      operator: 'xor',
      propositions: [
        vectorDefiningPieces,
        oneOrTwoPoints,
        stringsAndMaths,
        noPoints
      ],
      setAsBase: true
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

        let lineDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          lineDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          lineDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          lineDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          lineDescription += "dotted ";
        }

        lineDescription += `${dependencyValues.selectedStyle.lineColor} `;

        return { newValues: { styleDescription: lineDescription } };

      }
    }


    // displacementShadow will be null unless vector was created
    // via an adapter or ref prop or from serialized state with displacement value
    // In case of adapter or ref prop,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of displacementShadow will be changed to be the value
    // that shadows the component adapted or reffed
    stateVariableDefinitions.displacementShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          displacementShadow: { variablesToCheck: ["displacement", "displacementShadow"] }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "displacementShadow",
            value: desiredStateVariableValues.displacementShadow
          }]
        };
      }
    }


    // headShadow will be null unless vector was created
    // from serialized state with head value
    stateVariableDefinitions.headShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          headShadow: { variablesToCheck: ["head", "headShadow"] }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "headShadow",
            value: desiredStateVariableValues.headShadow
          }]
        };
      }
    }

    // tailShadow will be null unless vector was created
    // from serialized state with tail value
    stateVariableDefinitions.tailShadow = {
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          tailShadow: { variablesToCheck: ["tail", "tailShadow"] }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "tailShadow",
            value: desiredStateVariableValues.tailShadow
          }]
        };
      }
    }


    // if a copy shadow, the basedOnX definitions will be overwritten
    // so we don't have to consider that case here

    stateVariableDefinitions.basedOnHead = {
      returnDependencies: () => ({
        headChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneHead"
        },
        headShadow: {
          dependencyType: "stateVariable",
          variableName: "headShadow"
        },
        tailChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneTail"
        },
        displacementOptions: {
          dependencyType: "childIdentity",
          childLogicName: "displacementOptions"
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.tailChild.length === 1 &&
          dependencyValues.displacementOptions.length > 0
        ) {
          if (dependencyValues.headChild.length === 1) {
            // if overprescribed by specifying head, tail, and displacement
            // we ignore head
            console.warn(`Vector is prescribed by head, tail, and displacement.  Ignoring specified head.`);
          }
          return {
            newValues: { basedOnHead: false },
            checkForActualChange: { basedOnHead: true }
          }
        }

        if (dependencyValues.headChild.length === 1) {
          return {
            newValues: { basedOnHead: true },
            checkForActualChange: { basedOnHead: true }
          }
        }

        return {
          newValues: { basedOnHead: dependencyValues.headShadow !== null },
          checkForActualChange: { basedOnHead: true }
        }

      }
    }

    stateVariableDefinitions.basedOnTail = {
      returnDependencies: () => ({
        tailChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneTail"
        },
        tailShadow: {
          dependencyType: "stateVariable",
          variableName: "tailShadow"
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.tailChild.length === 1) {
          return {
            newValues: { basedOnTail: true },
            checkForActualChange: { basedOnTail: true }
          }
        }

        return {
          newValues: { basedOnTail: dependencyValues.tailShadow !== null },
          checkForActualChange: { basedOnTail: true }
        }

      }
    }

    stateVariableDefinitions.basedOnDisplacement = {
      returnDependencies: () => ({
        displacementOptions: {
          dependencyType: "childIdentity",
          childLogicName: "displacementOptions"
        },
        displacementShadow: {
          dependencyType: "stateVariable",
          variableName: "displacementShadow"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.displacementOptions.length > 0) {
          return {
            newValues: { basedOnDisplacement: true },
            checkForActualChange: { basedOnDisplacement: true }
          }
        }
        return {
          newValues: { basedOnDisplacement: dependencyValues.displacementShadow !== null },
          checkForActualChange: { basedOnDisplacement: true }
        }

      }
    }


    // Note: if vector created via a copy (with no prop) of another vector
    // definition of nDimensions will be overwritten to shadow nDimensions
    // of the other vector
    // (based on static variable stateVariablesShadowedForReference)
    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
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
        displacementShadow: {
          dependencyType: "stateVariable",
          variableName: "displacementShadow",
        },
        displacementChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneDisplacement",
          variableNames: ["nDimensions"],
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
        headShadow: {
          dependencyType: "stateVariable",
          variableName: "headShadow",
        },
        headChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneHead",
          variableNames: ["nDimensions"],
        },
        tailShadow: {
          dependencyType: "stateVariable",
          variableName: "tailShadow",
        },
        tailChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneTail",
          variableNames: ["nDimensions"],
        },
      }),
      definition: function ({ dependencyValues, changes }) {
        // console.log(`nDimensions definition`)
        // console.log(dependencyValues)

        let displacementNDimensions, headNDimensions, tailNDimensions;

        if (dependencyValues.basedOnDisplacement) {
          if (dependencyValues.displacementChild.length === 1) {
            displacementNDimensions = dependencyValues.displacementChild[0].stateValues.nDimensions;
          } else if (dependencyValues.xsChild.length === 1) {
            displacementNDimensions = dependencyValues.xsChild[0].stateValues.nComponents;
          } else if (dependencyValues.zChild.length === 1) {
            displacementNDimensions = 3;
          } else if (dependencyValues.yChild.length === 1) {
            displacementNDimensions = 2;
          } else if (dependencyValues.xChild.length === 1) {
            displacementNDimensions = 1;
          } else if (dependencyValues.displacementShadow) {
            let displacementTree = dependencyValues.displacementShadow.tree;
            if (Array.isArray(displacementTree) && ["tuple", "vector"].includes(displacementTree[0])) {
              displacementNDimensions = displacementTree.length - 1;
            } else {
              displacementNDimensions = 2;
            }
          }
        }

        if (dependencyValues.basedOnHead) {
          if (dependencyValues.headChild.length === 1) {
            headNDimensions = dependencyValues.headChild[0].stateValues.nDimensions;
          } else if (headShadow) {
            let headTree = headShadow.tree;
            if (Array.isArray(headTree) && ["tuple", "vector"].includes(headTree[0])) {
              headNDimensions = headTree.length - 1;
            } else {
              headNDimensions = 2;
            }
          }
        }

        if (dependencyValues.basedOnTail) {
          if (dependencyValues.tailChild.length === 1) {
            tailNDimensions = dependencyValues.tailChild[0].stateValues.nDimensions;
          } else if (tailShadow) {
            let tailTree = tailShadow.tree;
            if (Array.isArray(tailTree) && ["tuple", "vector"].includes(tailTree[0])) {
              tailNDimensions = tailTree.length - 1;
            } else {
              tailNDimensions = 2;
            }
          }
        }

        let nDimensions
        if (dependencyValues.basedOnDisplacement) {
          if (dependencyValues.basedOnTail) {
            // ignore head if have both displacement and tail
            if (displacementNDimensions !== tailNDimensions) {
              console.warn(`nDimensions mismatch in vector`)
              return { newValues: { nDimensions: NaN } }
            }
          } else if (dependencyValues.basedOnHead) {
            if (displacementNDimensions !== headNDimensions) {
              console.warn(`nDimensions mismatch in vector`)
              return { newValues: { nDimensions: NaN } }
            }
          }
          nDimensions = displacementNDimensions;
        } else if (dependencyValues.basedOnTail) {
          if (dependencyValues.basedOnHead) {
            if (tailNDimensions !== headNDimensions) {
              console.warn(`nDimensions mismatch in vector`)
              return { newValues: { nDimensions: NaN } }
            }
          }
          nDimensions = tailNDimensions;
        } else if (dependencyValues.basedOnHead) {
          nDimensions = headNDimensions;
        } else {
          nDimensions = 2
        }

        return { newValues: { nDimensions }, checkForActualChange: { nDimensions: true } };

      }
    }

    // allowed possibilities for children
    // head (tail set to zero, displacement/xs set to head)
    // head and tail (displacement/xs set to head-tail)
    // displacement/xs (tail set to zero, head set to displacement)
    // head and displacement/xs (tail set to head-displacement)
    // tail and displacement/xs (head set to tail+displacement)
    // If head, tail, and displacment/xs supplied, ignore head


    stateVariableDefinitions.displacement = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["x"],
      returnWrappingComponents(prefix) {
        if (prefix === "x") {
          return [];
        } else {
          // entire array
          // wrap by both <vector> and <xs>
          return [["vector", "xs"]];
        }
      },
      stateVariablesDeterminingDependencies: ["basedOnDisplacement"],
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
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
          displacementShadow: {
            dependencyType: "stateVariable",
            variableName: "displacementShadow"
          },
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            displacementChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneDisplacement",
              variableNames: ["x" + varEnding],
            },
            xsChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneXs",
              variableNames: ["math" + varEnding]
            },
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

          if (!stateValues.basedOnDisplacement) {
            // if not based on displacement, will always use head and tail values
            // as, even if not based on head or tail,
            // head or tail will be made essential (with default of zero)
            dependenciesByKey[arrayKey].tailX = {
              dependencyType: "stateVariable",
              variableName: "tailX" + varEnding
            }
            dependenciesByKey[arrayKey].headX = {
              dependencyType: "stateVariable",
              variableName: "headX" + varEnding
            }
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey: function ({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {
        // console.log('array definition of vector displacement')
        // console.log(globalDependencyValues, dependencyValuesByKey, arrayKeys)

        let displacement = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          let displacementChild = dependencyValuesByKey[arrayKey].displacementChild;
          if (displacementChild && displacementChild.length === 1) {
            displacement[arrayKey] = displacementChild[0].stateValues["x" + varEnding];
          } else {
            let xsChild = dependencyValuesByKey[arrayKey].xsChild;
            if (xsChild && xsChild.length === 1) {
              displacement[arrayKey] = xsChild[0].stateValues["math" + varEnding].simplify();
            } else {
              let componentChild = dependencyValuesByKey[arrayKey].componentChild;
              if (componentChild && componentChild.length === 1) {
                displacement[arrayKey] = componentChild[0].stateValues.value.simplify();
              } else if (globalDependencyValues.displacementShadow !== null) {
                displacement[arrayKey] = globalDependencyValues.displacementShadow.get_component(Number(arrayKey));
              } else {

                // if made it to here, basedOnDisplacement is false
                // calculate displacement from head and tail

                displacement[arrayKey] = dependencyValuesByKey[arrayKey].headX.subtract(dependencyValuesByKey[arrayKey].tailX).simplify();
              }
            }
          }
        }
        return { newValues: { displacement } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        globalDependencyValues, dependencyValuesByKey, dependencyNamesByKey, arraySize,
      }) {

        // console.log(`inverse array definition of displacement`)
        // console.log(JSON.parse(JSON.stringify(desiredStateVariableValues)))
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)))
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))

        let instructions = [];

        let updateDisplacementShadow = false;

        for (let arrayKey in desiredStateVariableValues.displacement) {

          let displacementChild = dependencyValuesByKey[arrayKey].displacementChild;
          if (displacementChild && displacementChild.length === 1) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].displacementChild,
              desiredValue: desiredStateVariableValues.displacement[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            })
          } else {
            let xsChild = dependencyValuesByKey[arrayKey].xsChild;
            if (xsChild && xsChild.length === 1) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].xsChild,
                desiredValue: desiredStateVariableValues.displacement[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            } else {
              let componentChild = dependencyValuesByKey[arrayKey].componentChild;
              if (componentChild && componentChild.length === 1) {
                instructions.push({
                  setDependency: dependencyNamesByKey[arrayKey].componentChild,
                  desiredValue: desiredStateVariableValues.displacement[arrayKey],
                  childIndex: 0,
                  variableIndex: 0,
                });
              } else if (globalDependencyValues.displacementShadow !== null) {
                updateDisplacementShadow = true;
              } else {

                // if made it to here, basedOnDisplacement is false

                // set head to be sum of tail and desired displacement
                instructions.push({
                  setDependency: dependencyNamesByKey[arrayKey].headX,
                  desiredValue: dependencyValuesByKey[arrayKey].tailX.add(desiredStateVariableValues.displacement[arrayKey]).simplify()

                })
              }
            }
          }
        }

        if (updateDisplacementShadow) {
          if (arraySize[0] > 1) {
            let desiredDisplacement = ["vector"];
            for (let arrayKey in desiredStateVariableValues.displacement) {
              desiredDisplacement[Number(arrayKey) + 1] = desiredStateVariableValues.displacement[arrayKey].tree;
            }
            desiredDisplacement.length = arraySize[0] + 1
            instructions.push({
              setDependency: "displacementShadow",
              desiredValue: me.fromAst(desiredDisplacement),
            })
          } else if (arraySize[0] === 1 && "0" in desiredStateVariableValues.displacement) {
            instructions.push({
              setDependency: "displacementShadow",
              desiredValue: desiredStateVariableValues.displacement[0]
            })
          }
        }

        return {
          success: true,
          instructions
        };

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


    stateVariableDefinitions.head = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["headX"],
      returnWrappingComponents(prefix) {
        if (prefix === "headX") {
          return [];
        } else {
          // entire array
          // wrap by both <point> and <xs>
          return [["point", "xs"]];
        }
      },
      stateVariablesDeterminingDependencies: ["basedOnHead", "basedOnDisplacement"],
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
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
            variableName: "headShadow"
          },
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            headChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneHead",
              variableNames: ["x" + varEnding],
            },
          }

          if (!stateValues.basedOnHead) {
            // if not based on head, will always use tail value
            // as, even if not based on tail,
            // tail will be made essential (with default of zero)
            dependenciesByKey[arrayKey].tailX = {
              dependencyType: "stateVariable",
              variableName: "tailX" + varEnding
            }

            if (stateValues.basedOnDisplacement) {
              dependenciesByKey[arrayKey].x = {
                dependencyType: "stateVariable",
                variableName: "x" + varEnding
              }
            }
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey: function ({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of vector head')
        // console.log(globalDependencyValues, dependencyValuesByKey, arrayKeys)

        let head = {};
        let essentialHeadXs = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          if (globalDependencyValues.basedOnHead) {
            if (dependencyValuesByKey[arrayKey].headChild.length === 1) {
              head[arrayKey] = dependencyValuesByKey[arrayKey].headChild[0].stateValues["x" + varEnding];
            } else if (globalDependencyValues.headShadow !== null) {
              head[arrayKey] = globalDependencyValues.headShadow.get_component(Number(arrayKey));
            }
          } else {

            // basedOnHead is false

            if (globalDependencyValues.basedOnDisplacement) {

              // displacement and tail: add to create head
              // for this case, it doesn't matter if based on tail
              // as will use tail value anyway
              // (tail will be made essential with default of zero
              // if not based on head or tail)

              head[arrayKey] = dependencyValuesByKey[arrayKey].tailX.add(dependencyValuesByKey[arrayKey].x).simplify();
            } else {

              if (globalDependencyValues.basedOnTail) {
                // if just based on tail, then head component should default 
                // to the tail plut 1 in the first component and zero elsewhere
                // (but it will use the resulting essential value after that
                // so any changes will be saved)
                essentialHeadXs[arrayKey] = {
                  get defaultValue() {
                    if (arrayKey === "0") {
                      return dependencyValuesByKey[arrayKey].tailX.add(me.fromAst(1)).simplify()
                    } else {
                      return dependencyValuesByKey[arrayKey].tailX
                    }
                  },
                  variablesToCheck: ["headX" + varEnding]
                }
              } else {
                // if not based on anything, then head component should default
                // to 1 in the first component and zeros elsewhere
                // (but it will use the resulting essential value after that
                // so any changes will be saved)
                essentialHeadXs[arrayKey] = {
                  get defaultValue() { return me.fromAst(arrayKey === "0" ? 1 : 0) },
                  variablesToCheck: ["headX" + varEnding]
                }
              }
            }
          }
        }

        let result = {};
        if (Object.keys(head).length > 0) {
          result.newValues = { head }
        }
        if (Object.keys(essentialHeadXs).length > 0) {
          result.useEssentialOrDefaultValue = { head: essentialHeadXs }
        }

        // console.log(`result of array definition of head of vector`)
        // console.log(result);

        return result;

      },

      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        globalDependencyValues, dependencyValuesByKey, dependencyNamesByKey, arraySize
      }) {

        // console.log(`inverse array definition of head`, desiredStateVariableValues,
        //   globalDependencyValues, dependencyValuesByKey
        // )

        let instructions = [];

        let updateHeadShadow = false;

        for (let arrayKey in desiredStateVariableValues.head) {

          if (globalDependencyValues.basedOnHead) {

            if (dependencyValuesByKey[arrayKey].headChild &&
              dependencyValuesByKey[arrayKey].headChild.length === 1
            ) {

              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].headChild,
                desiredValue: desiredStateVariableValues.head[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              })
            } else if (globalDependencyValues.headShadow !== null) {
              updateHeadShadow = true;
            }
          } else {

            // not based on head

            if (globalDependencyValues.basedOnDisplacement) {

              // displacement and tail: set displacement to be desired head - tail

              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].x,
                desiredValue: desiredStateVariableValues.head[arrayKey].subtract(dependencyValuesByKey[arrayKey].tailX).simplify()
              })
            } else {

              // if just based on tail, then headX should have become
              // an essential state variable
              // set the value of the variable directly

              instructions.push({
                setStateVariable: "head",
                value: { [arrayKey]: desiredStateVariableValues.head[arrayKey] },
              })

            }
          }

        }

        if (updateHeadShadow) {
          if (arraySize[0] > 1) {
            let desiredHead = ["vector"];
            for (let arrayKey in desiredStateVariableValues.head) {
              desiredHead[Number(arrayKey) + 1] = desiredStateVariableValues.head[arrayKey].tree;
            }
            desiredHead.length = arraySize[0] + 1
            instructions.push({
              setDependency: "headShadow",
              desiredValue: me.fromAst(desiredHead),
            })
          } else if (arraySize[0] === 1 && "0" in desiredStateVariableValues.head) {
            instructions.push({
              setDependency: "headShadow",
              desiredValue: desiredStateVariableValues.head[0]
            })
          }

        }

        return {
          success: true,
          instructions
        };

      }
    }



    stateVariableDefinitions.tail = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["tailX"],
      returnWrappingComponents(prefix) {
        if (prefix === "tailX") {
          return [];
        } else {
          // entire array
          // wrap by both <point> and <xs>
          return [["point", "xs"]];
        }
      },
      stateVariablesDeterminingDependencies: ["basedOnHead", "basedOnDisplacement"],
      returnArraySizeDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nDimensions];
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
            variableName: "tailShadow"
          },
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            tailChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneTail",
              variableNames: ["x" + varEnding],
            },
          }

          if (!stateValues.basedOnTail) {
            if (stateValues.basedOnHead) {
              dependenciesByKey[arrayKey].headX = {
                dependencyType: "stateVariable",
                variableName: "headX" + varEnding
              }
            }
            if (stateValues.basedOnDisplacement) {
              dependenciesByKey[arrayKey].x = {
                dependencyType: "stateVariable",
                variableName: "x" + varEnding
              }
            }
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey: function ({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of vector tail');
        // console.log(JSON.parse(JSON.stringify(globalDependencyValues)))
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))

        let tail = {};
        let essentialTailXs = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          if (dependencyValuesByKey[arrayKey].tailChild.length === 1) {
            tail[arrayKey] = dependencyValuesByKey[arrayKey].tailChild[0].stateValues["x" + varEnding];
          } else if (globalDependencyValues.tailShadow !== null) {
            tail[arrayKey] = globalDependencyValues.tailShadow.get_component(Number(arrayKey));
          } else {

            // if made it to here, basedOnTail is false

            if (globalDependencyValues.basedOnHead && globalDependencyValues.basedOnDisplacement) {
              // based on head and displacement,
              // subtract displacement from head to get tail
              tail[arrayKey] = dependencyValuesByKey[arrayKey].headX.subtract(dependencyValuesByKey[arrayKey].x).simplify();

            } else {

              // tail defaults to zero
              // (but it will use the resulting essential value after that
              // so any changes will be saved)
              essentialTailXs[arrayKey] = {
                get defaultValue() { return me.fromAst(0) },
                variablesToCheck: ["tailX" + varEnding]
              }
            }

          }
        }

        let result = {};
        if (Object.keys(tail).length > 0) {
          result.newValues = { tail }
        }
        if (Object.keys(essentialTailXs).length > 0) {
          result.useEssentialOrDefaultValue = { tail: essentialTailXs }
        }

        return result;

      },

      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        globalDependencyValues, dependencyValuesByKey, dependencyNamesByKey, arraySize,
      }) {

        // console.log(`inverse array definition of tail`, desiredStateVariableValues,
        //   globalDependencyValues, dependencyValuesByKey
        // )

        let instructions = [];

        let updateTailShadow = false;

        for (let arrayKey in desiredStateVariableValues.tail) {

          if (dependencyValuesByKey[arrayKey].tailChild &&
            dependencyValuesByKey[arrayKey].tailChild.length === 1
          ) {

            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].tailChild,
              desiredValue: desiredStateVariableValues.tail[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            })
          } else if (globalDependencyValues.tailShadow !== null) {
            updateTailShadow = true;
          } else {

            // not based on tail

            if (globalDependencyValues.basedOnHead && globalDependencyValues.basedOnDisplacement) {

              // set displacement to be difference between head and desired tail

              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].x,
                desiredValue: dependencyValuesByKey[arrayKey].headX.subtract(desiredStateVariableValues.tail[arrayKey]).simplify()
              })
            } else {

              // if not based on both head and displacement,
              // then tail should have become
              // an essential state variable
              // set the value of the variable directly

              instructions.push({
                setStateVariable: "tail",
                value: { [arrayKey]: desiredStateVariableValues.tail[arrayKey] },
              })

            }
          }

        }

        if (updateTailShadow) {
          if (arraySize[0] > 1) {
            let desiredTail = ["vector"];
            for (let arrayKey in desiredStateVariableValues.tail) {
              desiredTail[Number(arrayKey) + 1] = desiredStateVariableValues.tail[arrayKey].tree;
            }
            desiredTail.length = arraySize[0] + 1
            instructions.push({
              setDependency: "tailShadow",
              desiredValue: me.fromAst(desiredTail),
            })
          } else if (arraySize[0] === 1 && "0" in desiredStateVariableValues.tail) {
            instructions.push({
              setDependency: "tailShadow",
              desiredValue: desiredStateVariableValues.tail[0]
            })
          }

        }

        return {
          success: true,
          instructions
        };

      }
    }



    stateVariableDefinitions.numericalEndpoints = {
      forRenderer: true,
      returnDependencies: () => ({
        head: {
          dependencyType: "stateVariable",
          variableName: "head"
        },
        tail: {
          dependencyType: "stateVariable",
          variableName: "tail"
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        }
      }),
      definition: function ({ dependencyValues }) {

        let numericalHead, numericalTail;
        if (dependencyValues.nDimensions === 1) {
          let numericalHead = dependencyValues.head.evaluate_to_constant();
          if (!Number.isFinite(numericalHead)) {
            numericalHead = NaN;
          }
          numericalTail = dependencyValues.tail.evaluate_to_constant();
          if (!Number.isFinite(numericalTail)) {
            numericalTail = NaN;
          }
        } else {

          numericalHead = [];
          numericalTail = [];

          for (let i = 0; i < dependencyValues.nDimensions; i++) {
            let head = dependencyValues.head[i].evaluate_to_constant();
            if (!Number.isFinite(head)) {
              head = NaN;
            }
            numericalHead.push(head);

            let tail = dependencyValues.tail[i].evaluate_to_constant();
            if (!Number.isFinite(tail)) {
              tail = NaN;
            }
            numericalTail.push(tail);
          }
        }

        return { newValues: { numericalEndpoints: [numericalTail, numericalHead] } }
      }
    }

    stateVariableDefinitions.displacementCoords = {
      forRenderer: true,
      returnDependencies: () => ({
        displacement: {
          dependencyType: "stateVariable",
          variableName: "displacement"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            displacementCoords: me.fromAst(["vector", ...dependencyValues.displacement.map(x => x.tree)])
          }
        }
      }
    }


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        headChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneHead"
        },
        tailChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneTail"
        },
      }),
      definition: function ({ dependencyValues }) {

        let childrenToRender = [];
        if (dependencyValues.headChild.length === 1) {
          childrenToRender.push(dependencyValues.headChild[0].componentName)
        }
        if (dependencyValues.tailChild.length === 1) {
          childrenToRender.push(dependencyValues.tailChild[0].componentName)
        }

        return { newValues: { childrenToRender } }
      }
    }


    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        },
        numericalEndpoints: {
          dependencyType: "stateVariable",
          variableName: "numericalEndpoints"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          nearestPoint: function (variables) {

            // only implemented in 2D for now
            if (dependencyValues.nDimensions !== 2) {
              return {};
            }



            let A1 = dependencyValues.numericalEndpoints[0][0];
            let A2 = dependencyValues.numericalEndpoints[0][1];
            let B1 = dependencyValues.numericalEndpoints[1][0];
            let B2 = dependencyValues.numericalEndpoints[1][1];

            // only implement for constants
            if (!(Number.isFinite(A1) && Number.isFinite(A2) &&
              Number.isFinite(B1) && Number.isFinite(B2))) {
              return {};
            }

            let BA1 = B1 - A1;
            let BA2 = B2 - A2;
            let denom = (BA1 * BA1 + BA2 * BA2);

            if (denom === 0) {
              return {};
            }

            let x1 = variables.x1.evaluate_to_constant();
            let x2 = variables.x2.evaluate_to_constant();

            if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
              return {};
            }

            let t = ((x1 - A1) * BA1 + (x2 - A2) * BA2) / denom;

            let result = {};

            if (t <= 0) {
              result = { x1: A1, x2: A2 };
            } else if (t >= 1) {
              result = { x1: B1, x2: B2 };
            } else {
              result = {
                x1: A1 + t * BA1,
                x2: A2 + t * BA2,
              };
            }

            if (variables.x3 !== undefined) {
              result.x3 = 0;
            }

            return result;

          }
        }
      })
    }



    return stateVariableDefinitions;

  }


  adapters = [{
    stateVariable: "displacementCoords",
    componentType: "coords",
    stateVariableForNewComponent: "value",
  }];

  moveVector({ tailcoords, headcoords, transient }) {

    let updateInstructions = [];

    if (tailcoords !== undefined) {

      // if based on both head and displacement
      // then set displacement as head - tail
      if (this.stateValues.basedOnHead && this.stateValues.basedOnDisplacement) {

        let displacement;
        if (headcoords === undefined) {
          // use current value of head
          // if head isn't supposed to change
          displacement = tailcoords.map((x, i) => this.stateValues.numericalEndpoints[1][i] - x);

        } else {
          displacement = tailcoords.map((x, i) => headcoords[i] - x);
        }

        updateInstructions.push({
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "displacement",
          value: displacement.map(x => me.fromAst(x))
        })

      } else {
        // set tail directly
        updateInstructions.push({
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "tail",
          value: tailcoords.map(x => me.fromAst(x))
        })
      }

      if (headcoords === undefined) {
        // if set tail but not head, the idea is that head shouldn't move
        // however, head would move if based on displacement but not head
        // so give instructions to change displacement to keep head fixed
        if (!this.stateValues.basedOnHead && this.stateValues.basedOnDisplacement) {
          let displacement = tailcoords.map((x, i) => this.stateValues.numericalEndpoints[1][i] - x);
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "displacement",
            value: displacement.map(x => me.fromAst(x))
          })
        }
      }
    }

    if (headcoords !== undefined) {

      // for head, we'll set it directly if based on head
      // or not based on displacement
      if (this.stateValues.basedOnHead || !this.stateValues.basedOnDisplacement) {
        updateInstructions.push({
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "head",
          value: headcoords.map(x => me.fromAst(x))
        })
      } else {
        // if based on displacement alone or displacement and tail
        // then update displacement instead of head

        if (tailcoords == undefined) {
          tailcoords = this.stateValues.numericalEndpoints[0];
        }
        let displacement = tailcoords.map((x, i) => headcoords[i] - x);
        updateInstructions.push({
          updateType: "updateValue",
          componentName: this.componentName,
          stateVariable: "displacement",
          value: displacement.map(x => me.fromAst(x))
        })
      }


      if (tailcoords === undefined) {
        // if set head but not tail, the idea is that tail shouldn't move
        // however, tail would move if based on displacement and head
        // so give instructions to change displacement to keep tail fixed
        if (this.stateValues.basedOnHead && this.stateValues.basedOnDisplacement) {
          let displacement = headcoords.map((x, i) => x - this.stateValues.numericalEndpoints[0][i]);
          updateInstructions.push({
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "displacement",
            value: displacement.map(x => me.fromAst(x))
          })
        }
      }

    }


    this.requestUpdate({
      updateInstructions,
      transient
    });

  }

}