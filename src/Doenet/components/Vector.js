import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

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
  // reference via the head/tail plus keep track of how defined
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() {
    return [
      "head", "tail", "displacement", "basedOnHead", "basedOnTail", "basedOnDisplacement"
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

    let addHead = function ({ activeChildrenMatched }) {
      // add <head> around point
      return {
        success: true,
        newChildren: [{
          componentType: "head",
          children: [{
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }],
        }],
      }
    }

    let addTail = function ({ activeChildrenMatched }) {
      // add <tail> around point
      return {
        success: true,
        newChildren: [{
          componentType: "tail",
          children: [{
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }],
        }],
      }
    }

    let addEndpoints = function ({ activeChildrenMatched }) {
      // add <endpoints> around points
      let endpointChildren = [];
      for (let child of activeChildrenMatched) {
        endpointChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "endpoints", children: endpointChildren }],
      }
    }

    let exactlyOnePoint = childLogic.newLeaf({
      name: "exactlyOnePoint",
      componentType: 'point',
      number: 1,
      isSugar: true,
      affectedBySugar: ["exactlyOneHead"],
      replacementFunction: addHead,
    });

    let exactlyTwoPoints = childLogic.newLeaf({
      name: "exactlyTwoPoints",
      componentType: 'point',
      number: 2,
      isSugar: true,
      affectedBySugar: ["exactlyOneEndpoints"],
      replacementFunction: addEndpoints,
    });

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
      affectedBySugar: ["exactlyOneEndpoints"],
      replacementFunction: addEndpoints,
    });

    let noPoints = childLogic.newLeaf({
      name: "noPoints",
      componentType: 'point',
      number: 0
    });

    let exactlyOneEndpoints = childLogic.newLeaf({
      name: "exactlyOneEndpoints",
      componentType: 'endpoints',
      number: 1
    });

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

    let headAndOrTail = childLogic.newOperator({
      name: "headAndOrTail",
      operator: 'or',
      propositions: [exactlyOneHead, exactlyOneTail],
    });

    let exactlyOneDisplacement = childLogic.newLeaf({
      name: "exactlyOneDisplacement",
      componentType: 'vector',
      number: 1
    });

    let exactlyOneTailForDisplacement = childLogic.newLeaf({
      name: "exactlyOneTailForDisplacement",
      componentType: 'tail',
      number: 1
    });

    let exactlyOneHeadForDisplacement = childLogic.newLeaf({
      name: "exactlyOneHeadForDisplacement",
      componentType: 'head',
      number: 1
    });

    let exactlyOnePointForDisplacement = childLogic.newLeaf({
      name: "exactlyOnePointForDisplacement",
      componentType: 'point',
      number: 1,
      isSugar: true,
      affectedBySugar: ["exactlyOneTailForDisplacement"],
      replacementFunction: addTail,
    });

    let noPointsForDisplacement = childLogic.newLeaf({
      name: "noPointsForDisplacement",
      componentType: 'point',
      number: 0
    });

    let displacementCompanions = childLogic.newOperator({
      name: "displacementCompanions",
      operator: 'xor',
      propositions: [exactlyOneHeadForDisplacement, exactlyOneTailForDisplacement,
        exactlyOnePointForDisplacement, noPointsForDisplacement],
    });

    let displacementPlus = childLogic.newOperator({
      name: "displacementPlus",
      operator: 'and',
      propositions: [exactlyOneDisplacement, displacementCompanions],
    });

    childLogic.newOperator({
      name: "vectorOptions",
      operator: 'xor',
      propositions: [
        displacementPlus,
        exactlyOneEndpoints,
        headAndOrTail,
        exactlyTwoPoints,
        exactlyOnePoint,
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


    // if a ref shadow, the basedOnX definitions will be overwritten
    // so we don't have to consider that case here

    stateVariableDefinitions.basedOnHead = {
      returnDependencies: () => ({
        headChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneHead"
        },
        headChildForDisplacement: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneHeadForDisplacement"
        },
        endpointsChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneEndpoints",
          variableNames: ["nPoints"]
        },
        headShadow: {
          dependencyType: "stateVariable",
          variableName: "headShadow"
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.headChild.length === 1 ||
          dependencyValues.headChildForDisplacement.length === 1
        ) {
          return { newValues: { basedOnHead: true } }
        }
        if (dependencyValues.endpointsChild.length === 1) {
          if (dependencyValues.endpointsChild[0].stateValues.nPoints >= 1) {
            return { newValues: { basedOnHead: true } }
          } else {
            return { newValues: { basedOnHead: false } }
          }
        }

        return { newValues: { basedOnHead: dependencyValues.headShadow !== null } }

      }
    }

    stateVariableDefinitions.basedOnTail = {
      returnDependencies: () => ({
        tailChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneTail"
        },
        tailChildForDisplacement: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneTailForDisplacement"
        },
        endpointsChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneEndpoints",
          variableNames: ["nPoints"]
        },
        tailShadow: {
          dependencyType: "stateVariable",
          variableName: "tailShadow"
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.tailChild.length === 1 ||
          dependencyValues.tailChildForDisplacement.length === 1
        ) {
          return { newValues: { basedOnTail: true } }
        }
        if (dependencyValues.endpointsChild.length === 1) {
          if (dependencyValues.endpointsChild[0].stateValues.nPoints >= 2) {
            return { newValues: { basedOnTail: true } }
          } else {
            return { newValues: { basedOnTail: false } }
          }
        }

        return { newValues: { basedOnTail: dependencyValues.tailShadow !== null } }

      }
    }

    stateVariableDefinitions.basedOnDisplacement = {
      returnDependencies: () => ({
        displacementChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneDisplacement"
        },
        displacementShadow: {
          dependencyType: "stateVariable",
          variableName: "displacementShadow"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.displacementChild.length === 1) {
          return { newValues: { basedOnDisplacement: true } }
        }
        return { newValues: { basedOnDisplacement: dependencyValues.displacementShadow !== null } }

      }
    }

    stateVariableDefinitions.endpointNPoints = {
      returnDependencies: () => ({
        endpointsChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneEndpoints",
          variableNames: ["nPoints"]
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.endpointsChild.length === 1) {
          return { newValues: { endpointNPoints: dependencyValues.endpointsChild[0].stateValues.nPoints } }
        } else {
          return { newValues: { endpointNPoints: null } }
        }
      }
    }

    // allowed possibilities for children
    // head (tail set to zero, displacement set to head)
    // head and tail (displacement set to head-tail)
    // displacement (tail set to zero, head set to displacement)
    // head and displacement (tail set to head-displacement)
    // tail and displacement (head set to tail+displacement)
    // endpoints: same as head (if one point) or tail and head (if two points)

    stateVariableDefinitions.head = {
      public: true,
      componentType: "point",
      stateVariablesDeterminingDependencies: [
        "basedOnHead", "basedOnTail", "basedOnDisplacement", "endpointNPoints"
      ],
      returnDependencies: function ({ stateValues }) {

        let dependencies = {
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
            variableName: "headShadow"
          },
          headChild: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneHead",
            variableNames: ["coords"],
          },
          headChildForDisplacement: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneHeadForDisplacement",
            variableNames: ["coords"],
          },

        };

        if (stateValues.endpointNPoints === 1) {
          dependencies.endpointsChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneEndpoints",
            variableNames: ["point1", "nPoints"]
          }
        } else if (stateValues.endpointNPoints === 2) {
          dependencies.endpointsChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneEndpoints",
            variableNames: ["point2", "nPoints"]
          }
        } else {
          dependencies.endpointsChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneEndpoints",
            variableNames: ["nPoints"]
          }
        }

        if (!stateValues.basedOnHead) {
          // if not based on head, will always use tail value
          // as, even if not based on tail,
          // tail will be made essential (with default of zero)
          dependencies.tail = {
            dependencyType: "stateVariable",
            variableName: "tail"
          }

          if (stateValues.basedOnDisplacement) {
            dependencies.displacement = {
              dependencyType: "stateVariable",
              variableName: "displacement"
            }
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.headChild.length === 1) {
          return { newValues: { head: dependencyValues.headChild[0].stateValues.coords } }
        }
        if (dependencyValues.headChildForDisplacement.length === 1) {
          return { newValues: { head: dependencyValues.headChildForDisplacement[0].stateValues.coords } }
        }
        if (dependencyValues.endpointsChild.length === 1) {
          if (dependencyValues.endpointsChild[0].stateValues.nPoints === 0) {
            console.warn('vector cannot be determined from zero endpoints')
            return { newValues: { head: me.fromAst(0) } }
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints === 1) {
            return { newValues: { head: dependencyValues.endpointsChild[0].stateValues.point1 } }
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints === 2) {
            return { newValues: { head: dependencyValues.endpointsChild[0].stateValues.point2 } }
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints > 2) {
            console.warn('vector cannot be determined from more than two endpoints')
            return { newValues: { head: me.fromAst('\uff3f') } }
          }
        }
        if (dependencyValues.headShadow !== null) {
          return { newValues: { head: headShadow } }
        }


        // if made it to here, basedOnHead is false
        // at this point, doesn't matter if based on tail
        // as will use tail value anyway
        // (tail will be made essential with default of zero
        // if not based on head or tail)

        if (dependencyValues.basedOnDisplacement) {

          // displacement and tail: add to create head

          let nDimDisplacement = 1, nDimTail = 1;
          let displacementTree = dependencyValues.displacement.tree;
          let tailTree = dependencyValues.tail.tree;

          if (Array.isArray(tailTree) && (tailTree[0] === "tuple" || tailTree[0] === "vector")) {
            nDimTail = tailTree.length - 1;
          }
          if (Array.isArray(displacementTree) && (displacementTree[0] === "tuple" || displacementTree[0] === "vector")) {
            nDimDisplacement = displacementTree.length - 1;
          }

          if (nDimDisplacement !== nDimTail) {
            console.warn("Dimensions of displacement and tail don't match for vector");
            return { newValues: { head: me.fromAst('\uff3f') } }
          }
          if (nDimDisplacement === 1) {
            return {
              newValues: {
                head:
                  dependencyValues.tail.add(dependencyValues.displacement).simplify()
              }
            };
          }
          let headTree = ["tuple"]
          for (let i = 0; i < nDimDisplacement; i++) {
            headTree.push(
              dependencyValues.tail.get_component(i)
                .add(dependencyValues.displacement.get_component(i))
                .simplify()
                .tree
            );
          }
          return { newValues: { head: me.fromAst(headTree) } }

        } else {

          // if just based on tail, then head should default to
          // zero of same dimension as tail
          // (but it will use the resulting essential value after that
          // so any changes will be saved)
          // Note: headShadow will not be recalculated
          // so will continue to have basedOnHead be false
          // and this code will be continue to be reached
          // But, since defaultValue is a getter, the defaultValue
          // won't be recalculated when head is essential
          return {
            useEssentialOrDefaultValue: {
              head: {
                variablesToCheck: ["head"],
                get defaultValue() {
                  if (!["tuple", "vector"].includes(dependencyValues.tail.tree[0])) {
                    return me.fromAst(0);
                  }
                  let headTree = ["tuple"]
                  for (let i = 1; i < dependencyValues.tail.tree.length; i++) {
                    headTree.push(0);
                  }
                  return me.fromAst(headTree);
                }
              }
            }
          }


        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.headChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "headChild",
              desiredValue: desiredStateVariableValues.head,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }
        if (dependencyValues.headChildForDisplacement.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "headChildForDisplacement",
              desiredValue: desiredStateVariableValues.head,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }
        if (dependencyValues.endpointsChild.length === 1) {
          if (dependencyValues.endpointsChild[0].stateValues.nPoints === 0) {
            return { success: false }
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints === 1 ||
            dependencyValues.endpointsChild[0].stateValues.nPoints === 2
          ) {
            return {
              success: true,
              instructions: [{
                setDependency: "endpointsChild",
                desiredValue: desiredStateVariableValues.head,
                childIndex: 0,
                variableIndex: 0,
              }]
            };
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints > 2) {
            return { success: false };
          }
        }
        if (dependencyValues.headShadow !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "headShadow",
              desiredValue: desiredStateVariableValues.head,
            }]
          };
        }


        // not based on head

        if (dependencyValues.basedOnDisplacement) {

          // displacement and tail: set displacement to be desired head - tail

          let nDimHead = 1, nDimTail = 1;
          let headTree = desiredStateVariableValues.head.tree;
          let tailTree = dependencyValues.tail.tree;

          if (Array.isArray(tailTree) && (tailTree[0] === "tuple" || tailTree[0] === "vector")) {
            nDimTail = tailTree.length - 1;
          }
          if (Array.isArray(headTree) && (headTree[0] === "tuple" || headTree[0] === "vector")) {
            nDimHead = headTree.length - 1;
          }

          if (nDimHead !== nDimTail) {
            return { success: false }
          }
          if (nDimHead === 1) {
            return {
              success: true,
              instructions: [{
                setDependency: "displacement",
                desiredValue: desiredStateVariableValues.head.subtract(dependencyValues.tail).simplify()
              }]
            };
          }
          let displacementTree = ["tuple"]
          displacementTree.length = nDimHead + 1;
          for (let i = 0; i < nDimHead; i++) {
            if (desiredStateVariableValues.head.tree[i + 1] !== undefined) {
              displacementTree[i + 1] =
                desiredStateVariableValues.head.get_component(i)
                  .subtract(dependencyValues.tail.get_component(i))
                  .simplify()
                  .tree
            }
          }
          return {
            success: true,
            instructions: [{
              setDependency: "displacement",
              desiredValue: me.fromAst(displacementTree)
            }]
          };

        } else {

          // if just based on tail, then head should have become
          // an essential state variable
          // set the value of the variable directly

          return {
            success: true,
            instructions: [{
              setStateVariable: "head",
              value: desiredStateVariableValues.head.simplify(),
            }]
          }
        }


      }
    }


    stateVariableDefinitions.tail = {
      public: true,
      componentType: "point",
      stateVariablesDeterminingDependencies: [
        "basedOnHead", "basedOnTail", "basedOnDisplacement", "endpointNPoints"
      ],
      returnDependencies: function ({ stateValues }) {

        let dependencies = {
          basedOnHead: {
            dependencyType: "stateVariable",
            variableName: "basedOnHead",
          },
          basedOnDisplacement: {
            dependencyType: "stateVariable",
            variableName: "basedOnDisplacement",
          },
          tailShadow: {
            dependencyType: "stateVariable",
            variableName: "tailShadow"
          },
          tailChild: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneTail",
            variableNames: ["coords"],
          },
          tailChildForDisplacement: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneTailForDisplacement",
            variableNames: ["coords"],
          },
        };

        if (stateValues.endpointNPoints === 2) {
          dependencies.endpointsChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneEndpoints",
            variableNames: ["point1", "nPoints"]
          }
        } else {
          dependencies.endpointsChild = {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneEndpoints",
            variableNames: ["nPoints"]
          }
        }

        if (!stateValues.basedOnTail) {
          if (stateValues.basedOnHead) {
            dependencies.head = {
              dependencyType: "stateVariable",
              variableName: "head"
            }
          }
          if (stateValues.basedOnDisplacement) {
            dependencies.displacement = {
              dependencyType: "stateVariable",
              variableName: "displacement"
            }
          }
        }
        return dependencies;

      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.tailChild.length === 1) {
          return { newValues: { tail: dependencyValues.tailChild[0].stateValues.coords } }
        }
        if (dependencyValues.tailChildForDisplacement.length === 1) {
          return { newValues: { tail: dependencyValues.tailChildForDisplacement[0].stateValues.coords } }
        }
        if (dependencyValues.endpointsChild.length === 1) {
          if (dependencyValues.endpointsChild[0].stateValues.nPoints === 0) {
            console.warn('vector cannot be determined from zero endpoints')
            return { newValues: { tail: me.fromAst(0) } }
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints === 2) {
            return { newValues: { tail: dependencyValues.endpointsChild[0].stateValues.point1 } }
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints > 2) {
            console.warn('vector cannot be determined from more than two endpoints')
            return { newValues: { tail: me.fromAst('\uff3f') } }
          }
        }
        if (dependencyValues.tailShadow !== null) {
          return { newValues: { tail: tailShadow } }
        }

        // if made it to here, basedOnTail is false


        if (dependencyValues.basedOnHead) {
          if (dependencyValues.basedOnDisplacement) {
            // based on head and displacement,
            // subtract displacement from head to get tail


            let nDimDisplacement = 1, nDimHead = 1;
            let displacementTree = dependencyValues.displacement.tree;
            let headTree = dependencyValues.head.tree;

            if (Array.isArray(headTree) && (headTree[0] === "tuple" || headTree[0] === "vector")) {
              nDimHead = headTree.length - 1;
            }
            if (Array.isArray(displacementTree) && (displacementTree[0] === "tuple" || displacementTree[0] === "vector")) {
              nDimDisplacement = displacementTree.length - 1;
            }

            if (nDimDisplacement !== nDimHead) {
              console.warn("Dimensions of displacement and head don't match for vector");
              return { newValues: { head: me.fromAst('\uff3f') } }
            }
            if (nDimDisplacement === 1) {
              return {
                newValues: {
                  tail:
                    dependencyValues.head.subtract(dependencyValues.displacement).simplify()
                }
              };
            }
            let tailTree = ["tuple"]
            for (let i = 0; i < nDimDisplacement; i++) {
              tailTree.push(
                dependencyValues.head.get_component(i)
                  .subtract(dependencyValues.displacement.get_component(i))
                  .simplify()
                  .tree
              );
            }
            return { newValues: { tail: me.fromAst(tailTree) } }

          } else {

            // head but no displacement
            // tail defaults to zero of same dimension as head
            // (but it will use the resulting essential value after that
            // so any changes will be saved)
            // Note: tailShadow will not be recalculated
            // so will continue to have basedOnTail be false
            // and this code will be continue to be reached
            // But, since defaultValue is a getter, the defaultValue
            // won't be recalculated when tail is essential
            return {
              useEssentialOrDefaultValue: {
                tail: {
                  variablesToCheck: ["tail"],
                  get defaultValue() {
                    if (!["tuple", "vector"].includes(dependencyValues.head.tree[0])) {
                      return me.fromAst(0);
                    }
                    let tailTree = ["tuple"]
                    for (let i = 1; i < dependencyValues.head.tree.length; i++) {
                      tailTree.push(0);
                    }
                    return me.fromAst(tailTree);
                  }
                }
              }
            }
          }
        } else {
          if (dependencyValues.basedOnDisplacement) {
            // displacement but no head
            // tail default to zero of same size as displacement
            return {
              useEssentialOrDefaultValue: {
                tail: {
                  variablesToCheck: ["tail"],
                  get defaultValue() {
                    if (!["tuple", "vector"].includes(dependencyValues.displacement.tree[0])) {
                      return me.fromAst(0);
                    }
                    let tailTree = ["tuple"]
                    for (let i = 1; i < dependencyValues.displacement.tree.length; i++) {
                      tailTree.push(0);
                    }
                    return me.fromAst(tailTree);
                  }
                }
              }
            }

          } else {
            // no head or displacement
            console.warn('need to set head, tail, or displacement of a vector')
            return {
              useEssentialOrDefaultValue: {
                tail: {
                  variablesToCheck: ["tail"],
                  get defaultValue() {
                    return me.fromAst(0);
                  }
                }
              }
            }

          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.tailChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "tailChild",
              desiredValue: desiredStateVariableValues.tail,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }
        if (dependencyValues.tailChildForDisplacement.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "tailChildForDisplacement",
              desiredValue: desiredStateVariableValues.tail,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }
        if (dependencyValues.endpointsChild.length === 1) {
          if (dependencyValues.endpointsChild[0].stateValues.nPoints === 0) {
            return { success: false }
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints === 2) {
            return {
              success: true,
              instructions: [{
                setDependency: "endpointsChild",
                desiredValue: desiredStateVariableValues.tail,
                childIndex: 0,
                variableIndex: 0,
              }]
            };
          } else if (dependencyValues.endpointsChild[0].stateValues.nPoints > 2) {
            return { success: false }
          }
        }
        if (dependencyValues.tailShadow !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "tailShadow",
              desiredValue: desiredStateVariableValues.tail,
            }]
          };
        }

        // if made it to here, basedOnTail is false

        if (dependencyValues.basedOnHead && dependencyValues.basedOnDisplacement) {
          // if based on head and displacement
          // set displacement to be difference between head and desired tail

          let nDimHead = 1, nDimTail = 1;
          let headTree = dependencyValues.head.tree;
          let tailTree = desiredStateVariableValues.tail.tree;

          if (Array.isArray(tailTree) && (tailTree[0] === "tuple" || tailTree[0] === "vector")) {
            nDimTail = tailTree.length - 1;
          }
          if (Array.isArray(headTree) && (headTree[0] === "tuple" || headTree[0] === "vector")) {
            nDimHead = headTree.length - 1;
          }

          if (nDimHead !== nDimTail) {
            return { success: false }
          }
          if (nDimHead === 1) {
            return {
              success: true,
              instructions: [{
                setDependency: "displacement",
                desiredValue: dependencyValues.head.subtract(desiredStateVariableValues.tail).simplify()
              }]
            };
          }
          let displacementTree = ["tuple"];
          displacementTree.length = nDimHead + 1;
          for (let i = 0; i < nDimHead; i++) {
            if (desiredStateVariableValues.tail.tree[i + 1] !== undefined) {
              displacementTree[i + 1] =
                dependencyValues.head.get_component(i)
                  .subtract(desiredStateVariableValues.tail.get_component(i))
                  .simplify()
                  .tree
            }
          }
          return {
            success: true,
            instructions: [{
              setDependency: "displacement",
              desiredValue: me.fromAst(displacementTree)
            }]
          };

        } else {

          // if not based on both head and displacement,
          // then tail should have become
          // an essential state variable
          // set the value of the variable directly

          return {
            success: true,
            instructions: [{
              setStateVariable: "tail",
              value: desiredStateVariableValues.tail.simplify(),
            }]
          }
        }

      }
    }


    stateVariableDefinitions.displacement = {
      forRenderer: true,
      public: true,
      componentType: "vector",
      stateVariablesDeterminingDependencies: [
        "basedOnHead", "basedOnTail", "basedOnDisplacement"
      ],
      returnDependencies: function ({ stateValues }) {

        let dependencies = {
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
          displacementChild: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneDisplacement",
            variableNames: ["displacement"],
          },
        };

        if (!stateValues.basedOnDisplacement) {
          // if not based on displacement, will always use  head and tail values
          // as, even if not based on head or tail,
          // head or tail will be made essential (with default of zero)
          dependencies.tail = {
            dependencyType: "stateVariable",
            variableName: "tail"
          }
          dependencies.head = {
            dependencyType: "stateVariable",
            variableName: "head"
          }
        }
        return dependencies;

      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.displacementChild.length === 1) {
          return { newValues: { displacement: dependencyValues.displacementChild[0].stateValues.displacement } }
        }
        if (dependencyValues.displacementShadow !== null) {
          return { newValues: { displacement: dependencyValues.displacementShadow } }
        }

        // if made it to here, basedOnDisplacement is false

        // calculate displacement from head and tail

        let nDimTail = 1, nDimHead = 1;
        let tailTree = dependencyValues.tail.tree;
        let headTree = dependencyValues.head.tree;

        if (Array.isArray(headTree) && (headTree[0] === "tuple" || headTree[0] === "vector")) {
          nDimHead = headTree.length - 1;
        }
        if (Array.isArray(tailTree) && (tailTree[0] === "tuple" || tailTree[0] === "vector")) {
          nDimTail = tailTree.length - 1;
        }

        if (nDimTail !== nDimHead) {
          console.warn("Dimensions of tail and head don't match for vector");
          return { newValues: { head: me.fromAst('\uff3f') } }
        }
        if (nDimTail === 1) {
          return {
            newValues: {
              displacement:
                dependencyValues.head.subtract(dependencyValues.tail).simplify()
            }
          };
        }
        let displacementTree = ["tuple"]
        for (let i = 0; i < nDimTail; i++) {
          displacementTree.push(
            dependencyValues.head.get_component(i)
              .subtract(dependencyValues.tail.get_component(i))
              .simplify()
              .tree
          );
        }
        return { newValues: { displacement: me.fromAst(displacementTree) } }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.displacementChild.length === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "displacementChild",
              desiredValue: desiredStateVariableValues.displacement,
              childIndex: 0,
              variableIndex: 0,
            }]
          };
        }

        if (dependencyValues.displacementShadow !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "displacementShadow",
              desiredValue: desiredStateVariableValues.displacement,
            }]
          };
        }

        // if made it to here, basedOnDisplacement is false

        // set head to be sum of tail and desired displacement

        let nDimDisplacement = 1, nDimTail = 1;
        let displacementTree = desiredStateVariableValues.displacement.tree;
        let tailTree = dependencyValues.tail.tree;

        if (Array.isArray(tailTree) && (tailTree[0] === "tuple" || tailTree[0] === "vector")) {
          nDimTail = tailTree.length - 1;
        }
        if (Array.isArray(displacementTree) && (displacementTree[0] === "tuple" || displacementTree[0] === "vector")) {
          nDimDisplacement = displacementTree.length - 1;
        }

        if (nDimDisplacement !== nDimTail) {
          return { success: false }
        }
        if (nDimDisplacement === 1) {
          return {
            success: true,
            instructions: [{
              setDependency: "head",
              desiredValue: dependencyValues.tail.add(desiredStateVariableValues.displacement).simplify()
            }]
          };
        }
        let headTree = ["tuple"];
        headTree.length = nDimDisplacement + 1;
        for (let i = 0; i < nDimDisplacement; i++) {
          if (desiredStateVariableValues.displacement.tree[i + 1] !== undefined) {
            headTree[i + 1] =
              dependencyValues.tail.get_component(i)
                .add(desiredStateVariableValues.displacement.get_component(i))
                .simplify()
                .tree
          }
        }

        return {
          success: true,
          instructions: [{
            setDependency: "head",
            desiredValue: me.fromAst(headTree)
          }]
        };

      }
    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        displacement: {
          dependencyType: "stateVariable",
          variableName: "displacement"
        },
      }),
      definition: function ({ dependencyValues }) {
        let nDimensions = 1;
        let displacementTree = dependencyValues.displacement.tree;

        if (Array.isArray(displacementTree) && (displacementTree[0] === "tuple" || displacementTree[0] === "vector")) {
          nDimensions = displacementTree.length - 1;
        }

        // should check for actual change
        // as frequently the dimension doesn't change
        return { newValues: { nDimensions }, checkForActualChange: ["nDimensions"] };

      }

    }

    stateVariableDefinitions.xs = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["x"],
      returnDependencies: () => ({
        displacement: {
          dependencyType: "stateVariable",
          variableName: "displacement"
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        }
      }),
      markStale: function ({ freshnessInfo }) {
        // mark it all stake
        freshnessInfo.freshByKey = {};
        return { fresh: false }
      },
      definition: function ({ dependencyValues, freshnessInfo }) {
        let freshByKey = freshnessInfo.freshByKey;

        if (Object.keys(freshByKey).length > 0) {
          // if anything is fresh, it all is fresh
          return {};
        }

        for (let i = 0; i < dependencyValues.nDimensions; i++) {
          freshByKey[i] = true;
        }

        // we'll build xs from displacement
        if (dependencyValues.nDimensions === 1) {
          return { newValues: { xs: [dependencyValues.displacement] } }
        }

        let xs = [];
        for (let i = 0; i < dependencyValues.nDimensions; i++) {
          xs.push(dependencyValues.displacement.get_component(i))
        }

        return { newValues: { xs } }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, workspace }) {

        if (dependencyValues.nDimensions === 1) {
          if ("0" in desiredStateVariableValues.xs) {
            return {
              success: true,
              instructions: [{
                setDependency: "displacement",
                desiredValue: desiredStateVariableValues.xs[0],
              }]
            }
          } else {
            return { success: false }
          }
        }


        let displacementTree = ["tuple"];
        displacementTree.length = dependencyValues.nDimensions + 1;


        for (let key in desiredStateVariableValues.xs) {
          displacementTree[Number(key) + 1] = desiredStateVariableValues.xs[key].tree;
        }

        return {
          success: true,
          instructions: [{
            setDependency: "displacement",
            desiredValue: me.fromAst(displacementTree),
          }]
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
            let head = dependencyValues.head.get_component(i).evaluate_to_constant();
            if (!Number.isFinite(head)) {
              head = NaN;
            }
            numericalHead.push(head);

            let tail = dependencyValues.tail.get_component(i).evaluate_to_constant();
            if (!Number.isFinite(tail)) {
              tail = NaN;
            }
            numericalTail.push(tail);
          }
        }

        return { newValues: { numericalEndpoints: [numericalTail, numericalHead] } }
      }
    }


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        endpointsChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneEndpoints"
        },
        headChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneHead"
        },
        tailChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneTail"
        },
        headChild2: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneHeadForDisplacement"
        },
        tailChild2: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneTailForDisplacement"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.endpointsChild.length === 1) {
          return {
            newValues: {
              childrenToRender: [dependencyValues.endpointsChild[0].componentName]
            }
          }
        } else {
          let childrenToRender = [];
          if (dependencyValues.headChild.length === 1) {
            childrenToRender.push(dependencyValues.headChild[0].componentName)
          } else if (dependencyValues.headChild2.length === 1) {
            childrenToRender.push(dependencyValues.headChild2[0].componentName)
          }
          if (dependencyValues.tailChild.length === 1) {
            childrenToRender.push(dependencyValues.tailChild[0].componentName)
          } else if (dependencyValues.tailChild2.length === 1) {
            childrenToRender.push(dependencyValues.tailChild2[0].componentName)
          }

          return { newValues: { childrenToRender } }
        }
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
    stateVariable: "displacement",
    componentType: "coords",
    stateVariableForNewComponent: "value",
  }];

  moveVector({ tailcoords, headcoords }) {

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
          componentName: this.componentName,
          stateVariable: "displacement",
          value: me.fromAst(["tuple", ...displacement])
        })

      } else {
        // set tail directly
        updateInstructions.push({
          componentName: this.componentName,
          stateVariable: "tail",
          value: me.fromAst(["tuple", ...tailcoords])
        })
      }

      if (headcoords === undefined) {
        // if set tail but not head, the idea is that head shouldn't move
        // however, head would move if based on displacement but not head
        // so give instructions to change displacement to keep head fixed
        if (!this.stateValues.basedOnHead && this.stateValues.basedOnDisplacement) {
          let displacement = tailcoords.map((x, i) => this.stateValues.numericalEndpoints[1][i] - x);
          updateInstructions.push({
            componentName: this.componentName,
            stateVariable: "displacement",
            value: me.fromAst(["tuple", ...displacement])
          })
        }
      }
    }

    if (headcoords !== undefined) {

      // for head, we'll set it directly if based on head
      // or not based on displacement
      if (this.stateValues.basedOnHead || !this.stateValues.basedOnDisplacement) {
        updateInstructions.push({
          componentName: this.componentName,
          stateVariable: "head",
          value: me.fromAst(["tuple", ...headcoords])
        })
      } else {
        // if based on displacement alone or displacement and tail
        // then update displacement instead of head

        if (tailcoords == undefined) {
          tailcoords = this.stateValues.numericalEndpoints[0];
        }
        let displacement = tailcoords.map((x, i) => headcoords[i] - x);
        updateInstructions.push({
          componentName: this.componentName,
          stateVariable: "displacement",
          value: me.fromAst(["tuple", ...displacement])
        })
      }


      if (tailcoords === undefined) {
        // if set head but not tail, the idea is that tail shouldn't move
        // however, tail would move if based on displacement and head
        // so give instructions to change displacement to keep tail fixed
        if (this.stateValues.basedOnHead && this.stateValues.basedOnDisplacement) {
          let displacement = headcoords.map((x, i) => x - this.stateValues.numericalEndpoints[0][i]);
          updateInstructions.push({
            componentName: this.componentName,
            stateVariable: "displacement",
            value: me.fromAst(["tuple", ...displacement])
          })
        }
      }

    }


    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions
    });

  }

}