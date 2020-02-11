import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';
import { convertValueToMathExpression } from './Math';

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
  static get stateVariablesForReference() { return ["xs"] };

  static primaryStateVariableForDefinition = "coords";

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

    let replacementFunction = function ({ activeChildrenMatched }) {
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
      replacementFunction: replacementFunction,
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

    let constraints = childLogic.newLeaf({
      name: "constraints",
      componentType: "_constraint",
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "pointWithConstraints",
      operator: "and",
      propositions: [coordsXorSugar, constraints],
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


    stateVariableDefinitions.basedOnCoords = {
      returnDependencies: function ({ childLogic, shadows }) {
        let isBasedOnCoords = true;
        if (childLogic.returnMatches("coordinatesViaComponents").length > 0) {
          isBasedOnCoords = false;
        } else if (childLogic.returnMatches("exactlyOneCoords").length === 0
          && shadows && !shadows.propVariable) {
          isBasedOnCoords = false;
        }
        return {
          basedOnCoords: {
            dependencyType: "value",
            value: isBasedOnCoords,
          }
        }
      },
      definition: ({ dependencyValues }) => ({ newValues: dependencyValues })

    }

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      stateVariablesDeterminingDependencies: ["basedOnCoords"],
      returnDependencies: function ({ stateValues, childLogic }) {
        if (stateValues.basedOnCoords) {
          return {
            coords: {
              dependencyType: "stateVariable",
              variableName: "coords",
            }
          }
        } else if (childLogic.returnMatches("coordinatesViaComponents").length > 0) {
          return {
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
          };
        } else {
          // must be shadowing xs, so can have nDimensions depend on xs
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs",
            }
          }
        }
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.coords) {
          let nDimensions;

          let coordsTree = dependencyValues.coords.tree;
          if (Array.isArray(coordsTree) && ["tuple", "vector"].includes(coordsTree[0])) {
            nDimensions = coordsTree.length - 1;
          } else {
            nDimensions = dependencyValues.coords;
          }
          return { newValues: { nDimensions } };

        } else if (dependencyValues.xs) {
          return { newValues: { nDimensions: dependencyValues.xs.length } };

        } else {

          let nDimensions;
          if (dependencyValues.zChild.length === 1) {
            nDimensions = 3;
          } else if (dependencyValues.yChild.length === 1) {
            nDimensions = 2;
          } else if (dependencyValues.xChild.length === 1) {
            nDimensions = 1;
          }
          if (nDimensions) {
            return { newValues: { nDimensions } };
          } else {
            // no x,y,z children

          }

        }
      }
    }


    stateVariableDefinitions.xs = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["x"],
      defaultEntryValue: me.fromAst(0),
      stateVariablesDeterminingDependencies: ["basedOnCoords"],
      returnDependencies: function ({ arrayKeys, stateValues }) {
        let dependencies = {
          nDimensions: {
            dependencyType: "stateVariable",
            variableName: "nDimensions",
          }
        };

        if (stateValues.basedOnCoords) {
          return {
            coords: {
              dependencyType: "stateVariable",
              variableName: "coords",
            }
          };
        } else {

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
        }
      },
      markStale: function ({ staleByKey, changes }) {
        if (!changes.coords) {
          // if based on coords, don't need to separately track staleByKey
          // as all components become stale whenever coords changes
          if (changes.xChild) {
            staleByKey[0] = true;
          }
          if (changes.yChild) {
            staleByKey[1] = true;
          }
          if (changes.zChild) {
            staleByKey[2] = true;
          }
        }
      },
      definition: calculateXs,
      inverseDefinition: invertXs,

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
      defaultValue: me.fromAst(0),
      stateVariablesDeterminingDependencies: ["basedOnCoords"],
      returnDependencies: function ({ stateValues }) {
        if (stateValues.basedOnCoords) {
          return {
            coordsChild: {
              dependencyType: "childStateVariables",
              childLogicName: "exactlyOneCoords",
              variableNames: ["value"],
            }
          };
        } else {
          return {
            xs: {
              dependencyType: "stateVariable",
              variableName: "xs",
            }
          }
        }
      },
      definition: calculateCoords,
      inverseDefinition: invertCoords,

    }

    return stateVariableDefinitions;
  }


  updateState(args = {}) {
    if (args.init === true) {

      this.makePublicStateVariable({
        variableName: "coords",
        componentType: "coords",
      });
      this.makePublicStateVariable({
        variableName: "ndimensions",
        componentType: "number",
      });
      this.makePublicStateVariableArray({
        variableName: "xs",
        componentType: "math",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "x",
        arrayVariableName: "xs",
      });
      this.makePublicStateVariableAlias({
        variableName: "x",
        targetName: "x",
        arrayIndex: '1',
      });
      this.makePublicStateVariableAlias({
        variableName: "y",
        targetName: "x",
        arrayIndex: '2',
      });
      this.makePublicStateVariableAlias({
        variableName: "z",
        targetName: "x",
        arrayIndex: '3',
      });
      this.makePublicStateVariable({
        variableName: "styledescription",
        componentType: "text",
      });
      this.makePublicStateVariable({
        variableName: "constraintused",
        componentType: "math",
      });

      if (!this._state.constraintused.essential) {
        this.state.constraintused = me.fromAst('\uFF3F');
      }

      this.state.firstTimeThrough = true;

    }

    // don't delete unresolved state in first pass, where could have
    // gotten unresolved passed in via serialized state
    // (on second pass, super.updateState will make it unresolved again, if needed)

    if (!args.init) {
      delete this.unresolvedState.coords;
      delete this.unresolvedState.ndimensions;
      delete this.unresolvedState.xs;
    }
    super.updateState(args);

    // coords could come in unresolved if a reference
    if (!this.childLogicSatisfied || this.unresolvedState.coords) {
      this.unresolvedState.coords = true;
      this.unresolvedState.ndimensions = true;
      this.unresolvedState.xs = true;
      this.state.coords = undefined;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged || this.state.firstTimeThrough) {

      delete this.state.firstTimeThrough;

      let coordsIndMatch = this.childLogic.returnMatches("exactlyOneCoords");
      if (coordsIndMatch.length === 0) {
        delete this.state.coordsChild;

        // no coords specified, check if have components specified individually
        let exactlyOneX = this.childLogic.returnMatches("exactlyOneX");
        let exactlyOneY = this.childLogic.returnMatches("exactlyOneY");
        let exactlyOneZ = this.childLogic.returnMatches("exactlyOneZ");

        if (exactlyOneX.length === 1) {
          this.state.xChild = this.activeChildren[exactlyOneX[0]];
        } else {
          delete this.state.xChild;
        }
        if (exactlyOneY.length === 1) {
          this.state.yChild = this.activeChildren[exactlyOneY[0]];
        } else {
          delete this.state.yChild;
        }
        if (exactlyOneZ.length === 1) {
          this.state.zChild = this.activeChildren[exactlyOneZ[0]];
        } else {
          delete this.state.zChild;
        }

      } else {
        this.state.coordsChild = this.activeChildren[coordsIndMatch[0]];
        delete this.state.xChild;
        delete this.state.yChild;
        delete this.state.zChild;
      }

      this.state.constraintIndices = this.childLogic.returnMatches("constraints");
      this.state.constraintChildren = this.state.constraintIndices.map(x => this.activeChildren[x]);

    }

    let coordsChanged = false;
    let buildComponentsFromCoords = false;

    // if have constraints, checked if unresolved or changed
    if (this.state.constraintIndices.length > 0) {

      if (this.state.constraintChildren.some(x => Object.keys(x.unresolvedState).length > 0)) {
        // if have some unresolved constraints, then coords are unresolved
        this.unresolvedState.coords = true;
        this.unresolvedState.xs = true;
        return;
      }

      // if constraints changed, need to recalculate coordinates from original value
      // not from the previous values, which are from the previous constraints
      // to force recalculate, just set the childrenChanged flag to true
      if (this.state.constraintChildren.some(x => trackChanges.checkIfVariableChanged(x))) {
        childrenChanged = true;
      }
    }

    if (this.state.coordsChild === undefined) {

      let haveComponentChild = false;
      let changedComponents = [];

      if (this.state.xChild) {
        haveComponentChild = true;
        this.state.ndimensions = 1;
        if (this.state.xChild.unresolvedState.value) {
          this.unresolvedState.coords = true;
          this.unresolvedState.xs = { isArray: true, arrayComponents: { 0: true } };

        } else if (childrenChanged || trackChanges.getVariableChanges({
          component: this.state.xChild, variable: "value"
        })) {
          this.state.xs[0] = this.state.xChild.state.value.value.simplify();
          changedComponents[0] = true;
        }
      }

      if (this.state.yChild) {
        haveComponentChild = true;
        this.state.ndimensions = 2;
        if (this.state.yChild.unresolvedState.value) {
          this.unresolvedState.coords = true;
          if (this.unresolvedState.xs == undefined) {
            this.unresolvedState.xs = { isArray: true, arrayComponents: { 1: true } };
          } else {
            this.unresolvedState.xs.arrayComponents[1] = true;
          }
        } else if (childrenChanged || trackChanges.getVariableChanges({
          component: this.state.yChild, variable: "value"
        })) {
          this.state.xs[1] = this.state.yChild.state.value.value.simplify();
          changedComponents[1] = true;

          if (this.state.xChild === undefined) {
            if (this._state.coords.essential) {
              this.state.xs[0] = this.state.coords.get_component(0);
            } else {
              this.state.xs[0] = me.fromAst(0);
              this._state.coords.essential = true;  // so changes get saved
              changedComponents[0] = true;
            }
          }
        }
      }


      if (this.state.zChild) {
        haveComponentChild = true;
        this.state.ndimensions = 3;
        if (this.state.zChild.unresolvedState.value) {
          this.unresolvedState.coords = true;
          if (this.unresolvedState.xs == undefined) {
            this.unresolvedState.xs = { isArray: true, arrayComponents: { 2: true } };
          } else {
            this.unresolvedState.xs.arrayComponents[2] = true;
          }
        } else if (childrenChanged || trackChanges.getVariableChanges({
          component: this.state.zChild, variable: "value"
        })) {
          this.state.xs[2] = this.state.zChild.state.value.value.simplify();
          changedComponents[2] = true;

          if (this.state.yChild === undefined) {
            if (this._state.coords.essential) {
              this.state.xs[1] = this.state.coords.get_component(1);
            } else {
              this.state.xs[1] = me.fromAst(0);
              this._state.coords.essential = true;  // so changes get saved
              changedComponents[1] = true;
            }

            if (this.state.xChild === undefined) {
              if (this._state.coords.essential) {
                this.state.xs[0] = this.state.coords.get_component(0);
              } else {
                this.state.xs[0] = me.fromAst(0);
                changedComponents[0] = true;
              }
            }
          }
        }
      }

      // if one of the coordinate children was unresolved
      // just quit
      if (this.unresolvedState.coords) {
        return;
      }

      if (changedComponents.length > 0) {
        // update coords if a component changed
        coordsChanged = true;

        let coordsAst;
        if (this.state.coords !== undefined) {
          coordsAst = [...this.state.coords.tree]
        } else {
          coordsAst = ["tuple"];
        }
        if (changedComponents[0]) {
          coordsAst[1] = this.state.xs[0].tree;
        }
        if (changedComponents[1]) {
          coordsAst[2] = this.state.xs[1].tree;
        }
        if (changedComponents[2]) {
          coordsAst[3] = this.state.xs[2].tree;
        }
        this.state.coords = me.fromAst(coordsAst);
      } else if (!haveComponentChild) {

        // no coordinates or component children 
        if (!this._state.coords.essential) {
          this.state.coords = me.fromAst(0);
          console.warn("Point must have coordinates or xs specified");
        }
        if (trackChanges.getVariableChanges({
          component: this,
          variable: "coords"
        })) {
          coordsChanged = true;
          buildComponentsFromCoords = true;
        }
      }

    } else {
      // coordinates child is defined

      if (this.state.coordsChild.unresolvedState.value) {
        this.unresolvedState.coords = true;
        this.unresolvedState.xs = true;
        this.unresolvedState.ndimensions = true;
        return

      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.coordsChild, variable: "value"
      })) {

        coordsChanged = true;
        buildComponentsFromCoords = true;
        this.state.coords = this.state.coordsChild.state.value.value.simplify();
      }

    }

    if (buildComponentsFromCoords) {

      let coords = this.state.coords;

      // determine ndimensions and xs from coords
      let ndimensions = 1;
      if (coords.tree[0] === "tuple" || coords.tree[0] === "vector") {
        ndimensions = coords.tree.length - 1;
      }
      this.state.ndimensions = ndimensions;

      // we'll rebuild xs from coords
      this.state.xs = [];

      let x = coords;
      if (ndimensions > 1) {
        x = me.fromAst(coords.tree[1])
      }
      this.state.xs[0] = x;

      if (ndimensions > 1) {
        this.state.xs[1] = me.fromAst(coords.tree[2]);
      }

      if (ndimensions > 2) {
        this.state.xs[2] = me.fromAst(coords.tree[3]);
      }

      for (let i = 4; i <= ndimensions; i++) {
        this.state.xs[i - 1] = me.fromAst(coords.tree[i]);
      }
    }

    // don't calculate constraints if have any unresolved coords
    if (this.unresolvedState.coords) {
      return;
    }

    // if don't have any constraints, we're done
    if (this.state.constraintIndices.length === 0) {
      return;
    }

    // if coords or constraint change, reapply constraints
    if (childrenChanged ||
      (coordsChanged && !this.state.constraintChildren.every(x => x.state.constraintInactive))
    ) {

      let variables = {}
      for (let i = 1; i <= this.state.ndimensions; i++) {
        variables["x" + i] = this.state.xs[i - 1];
      }


      let constraintResult = this.applyConstraints(variables, this.state.constraintIndices);

      if (constraintResult.constrained) {

        let constraintIndices = constraintResult.constraintIndices;

        if (constraintIndices.length === 1) {
          this.state.constraintused = me.fromAst(constraintIndices[0])
        } else {
          this.state.constraintused = me.fromAst(["list", ...constraintIndices])
        }

        let createExpression = function (x) {
          if (x.tree !== undefined) {
            return x;
          } else {
            return me.fromAst(x);
          }
        }

        let coordsAst = ["tuple"];
        for (let i = 1; i <= this.state.ndimensions; i++) {
          this.state.xs[i - 1] = createExpression(variables["x" + i]);
          coordsAst.push(this.state.xs[i - 1].tree);
        }
        this.state.coords = me.fromAst(coordsAst);
      } else {
        this.state.constraintused = me.fromAst('\uFF3F');
      }
    }
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
      let x = this.stateValues.xs[0].evaluate_to_constant();
      let y = NaN;
      if (this.stateValues.xs.length > 1) {
        y = this.stateValues.xs[1].evaluate_to_constant()
      }
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
    let x = this.stateValues.xs[0].evaluate_to_constant();
    let y = NaN;
    if (this.stateValues.xs.length > 1) {
      y = this.stateValues.xs[1].evaluate_to_constant()
    }

    this.renderer.updatePoint({
      x, y,
      changeInitiatedWithPoint: changeInitiatedWithPoint,
      label: this.stateValues.label,
      visible: !this.stateValues.hide,
      draggable: this.stateValues.draggable,
      showlabel: this.stateValues.showlabel,
    });
  }


  allowDownstreamUpdates(status) {
    // TODO: if this.state.modifyIndirectly !== true
    // how do we detect if is being modified by reference rather than by parent?
    return ((status.initialChange === true && this.state.draggable === true) ||
      (status.initialChange !== true && this.state.modifyIndirectly === true));
  }

  get variablesUpdatableDownstream() {
    return ["coords", "xs"];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    let newCoordinates;
    let coordinatesChanged = new Set([]);

    let ndimensions = this.state.ndimensions;

    // attempt to reconstruct all coordinate properties from given properties to update
    if ("coords" in stateVariablesToUpdate) {
      // if coordinates property was ever assigned
      // components assigned take precedence over any components from xs
      newCoordinates = stateVariablesToUpdate.coords.changes;

      for (let i = 1; i < newCoordinates.tree.length; i++) {
        if (newCoordinates.tree[i] !== undefined) {
          coordinatesChanged.add(i - 1);
        }
      }
    }

    // only update individual coordinates that weren't already
    // specified through coords

    if (stateVariablesToUpdate.xs !== undefined) {

      let coordsAst;
      if (newCoordinates === undefined) {
        coordsAst = ["tuple"];
        coordsAst.length = ndimensions + 1;
      } else {
        // copy coords already determined
        // so can add additional compoonents from xs
        coordsAst = [...newCoordinates.tree];
      }

      for (let ind in stateVariablesToUpdate.xs.changes.arrayComponents) {
        if (!coordinatesChanged.has(Number(ind))) {
          let x = stateVariablesToUpdate.xs.changes.arrayComponents[ind];
          // if x is a math expression with tree attribute
          // switch to using tree
          if (x.tree !== undefined) {
            x = x.tree;
          }
          coordsAst[Number(ind) + 1] = x;
          coordinatesChanged.add(Number(ind));
        }
      }
      newCoordinates = me.fromAst(coordsAst);
    }

    if (this.state.constraintIndices.length > 0 &&
      !this.state.constraintChildren.every(x => x.state.constraintInactive)) {


      // apply constraints to coordinates
      let variables = {};
      for (let i = 1; i <= ndimensions; i++) {
        if (coordinatesChanged.has(i - 1)) {
          variables["x" + i] = newCoordinates.get_component(i - 1);
        } else {
          variables["x" + i] = this.state.coords.get_component(i - 1);
        }
      }

      let constraintResult = this.applyConstraints(variables, this.state.constraintIndices);

      if (constraintResult.constrained) {

        let getTree = function (x) {
          if (x.tree !== undefined) {
            return x.tree;
          } else {
            return x;
          }
        }

        let coordsAst = ["tuple"];
        for (let i = 1; i <= ndimensions; i++) {
          coordsAst[i] = getTree(variables["x" + i]);
        }
        newCoordinates = me.fromAst(coordsAst);

        // if have constraints, need to check if coordinates changed
        for (let i = 1; i < newCoordinates.tree.length; i++) {
          if (!coordinatesChanged.has(i - 1)) {
            // Use !== for efficiency, which means
            // this check will only work for number or string trees.
            // We primarily care about number case, 
            // and it's OK if extra coordinates get marked as changed.
            if (newCoordinates.tree[i] !== this.state.coords.tree[i]) {
              coordinatesChanged.add(i - 1);
            }
          }
        }
      }
    }

    if (this.state.coordsChild === undefined) {
      if (this.state.xChild && coordinatesChanged.has(0)) {
        let xName = this.state.xChild.componentName;
        dependenciesToUpdate[xName] = { value: { changes: newCoordinates.tree[1] } };
      }
      if (this.state.yChild && coordinatesChanged.has(1)) {
        let yName = this.state.yChild.componentName;
        dependenciesToUpdate[yName] = { value: { changes: newCoordinates.tree[2] } };
      }
      if (this.state.zChild && coordinatesChanged.has(2)) {
        let zName = this.state.zChild.componentName;
        dependenciesToUpdate[zName] = { value: { changes: newCoordinates.tree[3] } };
      }

    } else {
      // update coords child to newCoordinates
      let coordsName = this.state.coordsChild.componentName;
      dependenciesToUpdate[coordsName] = { value: { changes: newCoordinates } };
    }

    let newStateVariables = {
      coords: { changes: newCoordinates },
      xs: { isArray: true, changes: { arrayComponents: {} } }
    };

    for (let ind of coordinatesChanged) {
      newStateVariables.xs.changes.arrayComponents[ind] = newCoordinates.get_component(ind);
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add stateVariable to stateVariableChangesToSave if is essential
    // and no shadow sources were updated
    for (let varname in newStateVariables) {
      if (this._state[varname].essential === true &&
        !shadowedStateVariables.has(varname) && !isReplacement) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    return true;

  }

  nearestPoint() {

    let result = {};
    // only implement for constant coefficients
    result.x1 = this.state.xs[0].evaluate_to_constant();
    if (!Number.isFinite(result.x1)) {
      return {};
    }
    if (this.state.ndimensions > 1) {
      result.x2 = this.state.xs[1].evaluate_to_constant();
      if (!Number.isFinite(result.x2)) {
        return {};
      }
      if (this.state.ndimensions > 2) {
        result.x3 = this.state.xs[2].evaluate_to_constant();
        if (!Number.isFinite(result.x3)) {
          return {};
        }
      }
    }

    return result;

  }
}

function calculateXs({ dependencyValues, arrayKeys, arrayValues, staleByKey }) {

  let newXs = {};
  let essentialXs = {};

  // console.log("dependencyValues")
  // console.log(dependencyValues)

  if (dependencyValues.coords) {
    let coordsTree = dependencyValues.coords.tree;
    if (Array.isArray(coordsTree) && ["tuple", "vector"].includes(coordsTree[0])) {
      for (let i = 0; i < coordsTree.length - 1; i++) {
        newXs[i] = dependencyValues.coords.get_component(i);
      }
    } else {
      newXs[0] = dependencyValues.coords;
    }
  } else {

    let arrayKey;
    if (arrayKeys) {
      arrayKey = arrayKeys[0];
    }

    let { xChild, yChild, zChild, nDimensions } = dependencyValues;

    if (staleByKey[0] || arrayValues[0] === undefined) {
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
    if (staleByKey[1] || arrayValues[1] === undefined) {
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

    if (staleByKey[2] || arrayValues[2] === undefined) {
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
    newXs = { xs: newXs };
  }
  if (Object.keys(essentialXs).length > 0) {
    essentialXs = { xs: essentialXs };
  }
  return { newValues: newXs, useEssentialOrDefaultValue: essentialXs };

  let newValues = {};
  let useEssentialOrDefaultValue = {};

  if (coordsChild.children.length === 0) {

    let haveComponentChild = false;
    let changedComponents = [];

    if (xChild) {
      haveComponentChild = true;

      if (xChild.componentIdentitiesChanged || xChild.state.value.valueChanged) {
        newValues.x = xChild.children[0].state.value.value.simplify();
        changedComponents[0] = true;
      }
    }

    if (yChild) {
      haveComponentChild = true;
      if (yChild.componentIdentitiesChanged || yChild.state.value.valueChanged) {
        newValues.y = yChild.children[0].state.value.value.simplify();
        changedComponents[1] = true;

        if (!xChild) {
          useEssentialOrDefaultValue.x = { variablesToCheck: ["x", { variableName: "coords", mathComponentIndex: 0 }] }
        }
      }
    }


    if (zChild) {
      haveComponentChild = true;
      if (zChild.componentIdentitiesChanged || zChild.state.value.valueChanged) {
        newValues.z = zChild.children[0].state.value.value.simplify();
        changedComponents[2] = true;

        if (!yChild === undefined) {
          if (this._state.coords.essential) {
            this.state.xs[1] = this.state.coords.get_component(1);
          } else {
            this.state.xs[1] = me.fromAst(0);
            this._state.coords.essential = true;  // so changes get saved
            changedComponents[1] = true;
          }

          if (this.state.xChild === undefined) {
            if (this._state.coords.essential) {
              this.state.xs[0] = this.state.coords.get_component(0);
            } else {
              this.state.xs[0] = me.fromAst(0);
              changedComponents[0] = true;
            }
          }
        }
      }
    }

    // if one of the coordinate children was unresolved
    // just quit
    if (this.unresolvedState.coords) {
      return;
    }

    if (changedComponents.length > 0) {
      // update coords if a component changed
      coordsChanged = true;

      let coordsAst;
      if (this.state.coords !== undefined) {
        coordsAst = [...this.state.coords.tree]
      } else {
        coordsAst = ["tuple"];
      }
      if (changedComponents[0]) {
        coordsAst[1] = this.state.xs[0].tree;
      }
      if (changedComponents[1]) {
        coordsAst[2] = this.state.xs[1].tree;
      }
      if (changedComponents[2]) {
        coordsAst[3] = this.state.xs[2].tree;
      }
      this.state.coords = me.fromAst(coordsAst);
    } else if (!haveComponentChild) {

      // no coordinates or component children 
      if (!this._state.coords.essential) {
        this.state.coords = me.fromAst(0);
        console.warn("Point must have coordinates or xs specified");
      }
      if (trackChanges.getVariableChanges({
        component: this,
        variable: "coords"
      })) {
        coordsChanged = true;
        buildComponentsFromCoords = true;
      }
    }

  } else {
    // coordinates child is defined

    if (this.state.coordsChild.unresolvedState.value) {
      this.unresolvedState.coords = true;
      this.unresolvedState.xs = true;
      this.unresolvedState.ndimensions = true;
      return

    } else if (childrenChanged || trackChanges.getVariableChanges({
      component: this.state.coordsChild, variable: "value"
    })) {

      coordsChanged = true;
      buildComponentsFromCoords = true;
      this.state.coords = this.state.coordsChild.state.value.value.simplify();
    }

  }



}

function invertXs({ desiredStateVariableValues, dependencyValues, stateValues, initialChange }) {
  // console.log("invertXs");
  // console.log(desiredStateVariableValues)
  // console.log(dependencyValues);
  // console.log(stateValues);

  // if not draggable, then disallow initial change 
  if (initialChange && !stateValues.draggable) {
    return { success: false };
  }

  let instructions = [];

  if (dependencyValues.coords) {
    let currentCoordsTree = Array(stateValues.nDimensions + 1);
    currentCoordsTree[0] = "tuple";
    for (let arrayKey in desiredStateVariableValues.xs) {
      currentCoordsTree[Number(arrayKey) + 1] = desiredStateVariableValues.xs[arrayKey];
    }
    instructions.push({
      setDependency: "coords",
      desiredValue: me.fromAst(currentCoordsTree),
    });

    return {
      success: true,
      instructions,
    }
  } else {

    let arrayKeyToChild = ["xChild", "yChild", "zChild"];

    for (let arrayKey in desiredStateVariableValues.xs) {
      let childName = arrayKeyToChild[arrayKey];

      if (childName === undefined) {
        throw Error(`Haven't implemented coords beyond 3 for inverse definition of xs in point`)
      }

      if (dependencyValues[childName].length === 0) {
        instructions.push({
          setStateVariable: "xs",
          arrayKey,
          // since not going through Math component, have to manually convert to math expression
          value: convertValueToMathExpression(desiredStateVariableValues.xs[arrayKey]),
        });
      } else {
        instructions.push({
          setDependency: childName,
          desiredValue: desiredStateVariableValues.xs[arrayKey],
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

function calculateCoords({ dependencyValues }) {
  // console.log("calculateCoords");
  // console.log(dependencyValues)

  if (dependencyValues.coordsChild) {
    if (dependencyValues.coordsChild.length === 0) {
      return { useEssentialOrDefaultValue: { coords: { variablesToCheck: "coords" } } };
    } else {
      return { newValues: { coords: dependencyValues.coordsChild[0].stateValues.value.simplify() } };
    }
  } else {
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
  }

  let newValues = {};
  let useEssentialOrDefaultValue = {};

  if (coordsChild.children.length === 0) {

    let haveComponentChild = false;
    let changedComponents = [];

    if (xChild) {
      haveComponentChild = true;

      if (xChild.componentIdentitiesChanged || xChild.state.value.valueChanged) {
        newValues.x = xChild.children[0].state.value.value.simplify();
        changedComponents[0] = true;
      }
    }

    if (yChild) {
      haveComponentChild = true;
      if (yChild.componentIdentitiesChanged || yChild.state.value.valueChanged) {
        newValues.y = yChild.children[0].state.value.value.simplify();
        changedComponents[1] = true;

        if (!xChild) {
          useEssentialOrDefaultValue.x = { variablesToCheck: ["x", { variableName: "coords", mathComponentIndex: 0 }] }
        }
      }
    }


    if (zChild) {
      haveComponentChild = true;
      if (zChild.componentIdentitiesChanged || zChild.state.value.valueChanged) {
        newValues.z = zChild.children[0].state.value.value.simplify();
        changedComponents[2] = true;

        if (!yChild === undefined) {
          if (this._state.coords.essential) {
            this.state.xs[1] = this.state.coords.get_component(1);
          } else {
            this.state.xs[1] = me.fromAst(0);
            this._state.coords.essential = true;  // so changes get saved
            changedComponents[1] = true;
          }

          if (this.state.xChild === undefined) {
            if (this._state.coords.essential) {
              this.state.xs[0] = this.state.coords.get_component(0);
            } else {
              this.state.xs[0] = me.fromAst(0);
              changedComponents[0] = true;
            }
          }
        }
      }
    }

    // if one of the coordinate children was unresolved
    // just quit
    if (this.unresolvedState.coords) {
      return;
    }

    if (changedComponents.length > 0) {
      // update coords if a component changed
      coordsChanged = true;

      let coordsAst;
      if (this.state.coords !== undefined) {
        coordsAst = [...this.state.coords.tree]
      } else {
        coordsAst = ["tuple"];
      }
      if (changedComponents[0]) {
        coordsAst[1] = this.state.xs[0].tree;
      }
      if (changedComponents[1]) {
        coordsAst[2] = this.state.xs[1].tree;
      }
      if (changedComponents[2]) {
        coordsAst[3] = this.state.xs[2].tree;
      }
      this.state.coords = me.fromAst(coordsAst);
    } else if (!haveComponentChild) {

      // no coordinates or component children 
      if (!this._state.coords.essential) {
        this.state.coords = me.fromAst(0);
        console.warn("Point must have coordinates or xs specified");
      }
      if (trackChanges.getVariableChanges({
        component: this,
        variable: "coords"
      })) {
        coordsChanged = true;
        buildComponentsFromCoords = true;
      }
    }

  } else {
    // coordinates child is defined

    if (this.state.coordsChild.unresolvedState.value) {
      this.unresolvedState.coords = true;
      this.unresolvedState.xs = true;
      this.unresolvedState.ndimensions = true;
      return

    } else if (childrenChanged || trackChanges.getVariableChanges({
      component: this.state.coordsChild, variable: "value"
    })) {

      coordsChanged = true;
      buildComponentsFromCoords = true;
      this.state.coords = this.state.coordsChild.state.value.value.simplify();
    }

  }



}

function invertCoords({ desiredStateVariableValues, dependencyValues, stateValues, initialChange }) {
  // console.log("invertCoords");
  // console.log(desiredStateVariableValues)
  // console.log(dependencyValues);
  // console.log(stateValues);

  // if not draggable, then disallow initial change 
  if (initialChange && !stateValues.draggable) {
    return { success: false };
  }

  let instructions = [];

  if (dependencyValues.coordsChild) {
    instructions.push({
      setDependency: "coordsChild",
      desiredValue: desiredStateVariableValues.coords,
      childIndex: 0,
      variableIndex: 0,
    });
    return {
      success: true,
      instructions,
    }
  } else {

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
