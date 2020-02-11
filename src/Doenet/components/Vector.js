import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Vector extends GraphicalComponent {
  static componentType = "vector";

  // used when referencing this component without prop
  // reference via the head/tail plus keep track of how defined
  static useChildrenForReference = false;
  static get stateVariablesForReference() {
    return [
      "head", "tail", "displacement", "basedOnHead", "basedOnTail", "basedOnDisplacement"
    ]
  };

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = { default: true };
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
      replacementFunction: addHead,
    });

    let exactlyTwoPoints = childLogic.newLeaf({
      name: "exactlyTwoPoints",
      componentType: 'point',
      number: 2,
      isSugar: true,
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

  updateState(args = {}) {
    if (args.init === true) {


      this.moveVector = this.moveVector.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );

      this.makePublicStateVariable({
        variableName: "head",
        componentType: "point",
        stateVariableForRef: "coords"
      });
      this.makePublicStateVariable({
        variableName: "tail",
        componentType: "point",
        stateVariableForRef: "coords"
      });
      this.makePublicStateVariable({
        variableName: "displacement",
        componentType: "vector",
        stateVariableForRef: "displacement"
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

      if (this._state.basedOnHead === undefined) {
        this._state.basedOnHead = {};
      }
      if (this._state.basedOnTail === undefined) {
        this._state.basedOnTail = {};
      }
      if (this._state.basedOnDisplacement === undefined) {
        this._state.basedOnDisplacement = {};
      }
    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.head = true;
      this.unresolvedState.tail = true;
      this.unresolvedState.displacement = true;
      this.unresolvedState.xs = true;
      return;
    }

    delete this.unresolvedState.head;
    delete this.unresolvedState.tail;
    delete this.unresolvedState.displacement;
    delete this.unresolvedState.xs;

    this.state.selectedStyle = this.styleDefinitions[this.state.stylenumber];
    if (this.state.selectedStyle === undefined) {
      this.state.selectedStyle = this.styleDefinitions[1];
    }

    let lineDescription = "";
    if (this.state.selectedStyle.lineWidth >= 4) {
      lineDescription += "thick ";
    } else if (this.state.selectedStyle.lineWidth <= 1) {
      lineDescription += "thin ";
    }
    if (this.state.selectedStyle.lineStyle === "dashed") {
      lineDescription += "dashed ";
    } else if (this.state.selectedStyle.lineStyle === "dotted") {
      lineDescription += "dotted ";
    }

    lineDescription += `${this.state.selectedStyle.lineColor} `;

    this.state.styledescription = lineDescription;


    // allowed possibilities for children
    // head (tail set to zero, displacement set to head)
    // head and tail (displacement set to head-tail)
    // displacement (tail set to zero, head set to displacement)
    // head and displacement (tail set to head-displacement)
    // tail and displacement (head set to tail+displacement)
    // endpoints: same as head (if one point) or tail and head (if two points)

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {

      // collect information for children
      let displacementInds = this.childLogic.returnMatches("exactlyOneDisplacement");
      if (displacementInds.length === 0) {
        delete this.displacementChild;
        let endpointsInds = this.childLogic.returnMatches("exactlyOneEndpoints");
        if (endpointsInds.length === 0) {
          delete this.endpointsChild;
          let headInds = this.childLogic.returnMatches("exactlyOneHead");
          let tailInds = this.childLogic.returnMatches("exactlyOneTail");
          if (headInds.length === 0) {
            delete this.state.headChild;
          } else {
            this.state.headChild = this.activeChildren[headInds[0]];
          }
          if (tailInds.length == 0) {
            delete this.state.tailChild;
          } else {
            this.state.tailChild = this.activeChildren[tailInds[0]];
          }
          if (!this.state.headChild && !this.state.tailChild &&
            this._state.head.essential !== true &&
            this._state.tail.essential !== true &&
            this._state.displacement.essential !== true) {
            console.warn("Must specify head, tail, or displacement of vector.");
            this.state.head = me.fromAst(0);
            this.state.tail = me.fromAst(0);
            this.state.displacement = me.fromAst(0);

          }
        } else {
          // have a endpoints child
          this.state.endpointsChild = this.activeChildren[endpointsInds[0]];
        }
      } else {
        // have a displacement child
        this.state.displacementChild = this.activeChildren[displacementInds[0]];

        let headInds = this.childLogic.returnMatches("exactlyOneHeadForDisplacement");

        if (headInds.length === 0) {
          delete this.state.headChild;

          let tailInds = this.childLogic.returnMatches("exactlyOneTailForDisplacement");
          if (tailInds.length === 0) {
            delete this.state.tailChild;
          } else {
            this.state.tailChild = this.activeChildren[tailInds[0]];
          }
        } else {
          // have a head child
          this.state.headChild = this.activeChildren[headInds[0]];
        }
      }
    }

    let foundChange = childrenChanged;

    if (this.state.headChild) {
      if (this.state.headChild.unresolvedState.coords) {
        this.unresolvedState.head = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.headChild, variable: "coords"
      })) {
        this.state.head = this.state.headChild.state.coords.copy();
        foundChange = true;
      }
    }

    if (this.state.tailChild) {
      if (this.state.tailChild.unresolvedState.coords) {
        this.unresolvedState.tail = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.tailChild, variable: "coords"
      })) {
        this.state.tail = this.state.tailChild.state.coords.copy();
        foundChange = true;
      }
    }

    if (this.state.displacementChild) {
      if (this.state.displacementChild.unresolvedState.coords) {
        this.unresolvedState.displacement = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.displacementChild, variable: "displacement"
      })) {
        this.state.displacement = this.state.displacementChild.state.displacement.copy();
        foundChange = true;
      }
    }

    // since didn't return if found an unresolved variable, above,
    // return now if found unresolved
    if (Object.keys(this.unresolvedState).length > 0) {
      return;
    }

    if (this.state.endpointsChild) {
      let endpointsState = this.state.endpointsChild.state;

      if (this.state.endpointsChild.unresolvedState.points ||
        endpointsState.points.some(x => x.unresolvedState.coords)) {
        this.unresolvedState.head = true;
        this.unresolvedState.tail = true;
        this.unresolvedState.displacement = true;
        return;
      } else {

        let pointsChanged = childrenChanged || trackChanges.childrenChanged(this.state.endpointsChild.componentName);

        if (pointsChanged) {
          foundChange = true;

          if (endpointsState.nPoints === 0) {
            console.warn("Vector can't be determined by zero endpoints");
            this.state.head = me.fromAst(0);
            this.state.tail = me.fromAst(0);
          } else if (endpointsState.nPoints === 1) {
            this.state.head = endpointsState.points[0].state.coords.copy();
          } else if (endpointsState.nPoints === 2) {
            this.state.tail = endpointsState.points[0].state.coords.copy();
            this.state.head = endpointsState.points[1].state.coords.copy();
          } else {
            throw Error("Vector cannot must be determined more than two endpoints (" + endpointsState.nPoints + " given)");
          }

        } else {
          if (trackChanges.getVariableChanges({
            component: endpointsState.points[0],
            variable: "coords"
          })) {
            foundChange = true;

            if (endpointsState.nPoints === 2) {
              this.state.tail = endpointsState.points[0].state.coords.copy();
            } else {
              this.state.head = endpointsState.points[0].state.coords.copy();
            }
          }

          if (endpointsState.nPoints === 2 && trackChanges.getVariableChanges({
            component: endpointsState.points[1],
            variable: "coords"
          })) {
            foundChange = true;
            this.state.head = endpointsState.points[1].state.coords.copy();
          }
        }
      }
    }

    // if didn't have change via children
    // check if essential state variables changed
    if (!foundChange) {
      if (this._state.head.essential && trackChanges.getVariableChanges({ component: this, variable: "head" })) {
        foundChange = true
      } else if (this._state.tail.essential && trackChanges.getVariableChanges({ component: this, variable: "tail" })) {
        foundChange = true
      } else if (this._state.displacement.essential && trackChanges.getVariableChanges({ component: this, variable: "displacement" })) {
        foundChange = true
      }
    }

    // if didn't find any changes, we're done
    if (!foundChange) {
      return;
    }

    // recalculate what based on
    // Having an essential state variable (head, tail, or displacement)
    // isn't enough to determined what based on, unless basedOnX isn't essential
    // Having a child is sufficient, since a child will override essential

    if (!this._state.basedOnHead.essential) {
      this.state.basedOnHead = this._state.head.essential;
    }
    if (this.state.headChild !== undefined) {
      this.state.basedOnHead = true;
    }
    if (!this._state.basedOnTail.essential) {
      this.state.basedOnTail = this._state.tail.essential;
    }
    if (this.state.tailChild !== undefined) {
      this.state.basedOnTail = true;
    }
    if (!this._state.basedOnDisplacement.essential) {
      this.state.basedOnDisplacement = this._state.displacement.essential;
    }
    if (this.state.displacementChild !== undefined) {
      this.state.basedOnDisplacement = true;
    }

    if (this.state.endpointsChild) {
      this.state.basedOnHead = true;
      if (this.state.endpointsChild.state.nPoints === 2) {
        this.state.basedOnTail = true;
      }
    }

    if (!this.state.basedOnHead) {
      this.state.head = undefined;
    }
    if (!this.state.basedOnTail) {
      this.state.tail = undefined;
    }
    if (!this.state.basedOnDisplacement) {
      this.state.displacement = undefined;
    }

    // Information collected into state variables head, tail, and/or displacement
    // Now, derive the values of the variables than remain undefined.
    // In cases where fewer than two variables were defined,
    // (ie., just head or just displacement),
    // set tail to be essential so that can save changes

    if (this.state.displacement === undefined) {
      if (this.state.tail === undefined) {
        // only head defined, so make tail be zero of same size as head
        // but just the first time through, so later changes will be saved
        if (this._state.tail.essential !== true) {
          let tailTree = ["tuple"]
          for (let i = 1; i < this.state.head.tree.length; i++) {
            tailTree.push(0);
          }
          this.state.tail = me.fromAst(tailTree);
          // mark tail as essential so that value is saved if moved
          this._state.tail.essential = true;
          this.state.basedOnTail = true;
          this.state.tailChangedToEssential = true;
        }
        // displacement is the same as head
        this.state.displacement = this.state.head.copy();
      } else {
        // tail but no displacement is defined
        if (this.state.head) {
          // calculate displacement from head and tail
          if (this.state.head.tree.length !== this.state.tail.tree.length) {
            console.warn("Dimensions of head and tail don't match for vector");
            this.unresolvedState.head = true;
            this.unresolvedState.tail = true;
            this.unresolvedState.displacement = true;
            return;
          }
          let displacementTree = ["tuple"]
          for (let i = 1; i < this.state.head.tree.length; i++) {
            displacementTree.push(
              this.state.head.get_component(i - 1).subtract(
                this.state.tail.get_component(i - 1)
              ).simplify().tree
            );
          }
          this.state.displacement = me.fromAst(displacementTree);
        } else {
          // only tail is defined, so make head be zero of same size as tail
          // but just the first time through, so later changes will be saved
          if (this._state.head.essential !== true) {
            let headTree = ["tuple"]
            for (let i = 1; i < this.state.tail.tree.length; i++) {
              headTree.push(0);
            }
            this.state.head = me.fromAst(headTree);
            // mark head as essential so that value is saved if moved
            this._state.head.essential = true;
            this.state.basedOnHead = true;
            this.state.headChangedToEssential = true;
          }
          // displacement is negative the tail
          let displacementTree = ["tuple"]
          for (let i = 1; i < this.state.tail.tree.length; i++) {
            displacementTree.push(['-', this.state.tail.tree[i]]);
          }
          this.state.displacement = me.fromAst(displacementTree);

        }
      }
    } else {
      // displacement is defined
      if (this.state.head === undefined) {
        if (this.state.tail === undefined) {

          // first time through, set tailcoords to be zero
          if (this._state.tail.essential !== true) {
            let tailTree = ["tuple"]
            for (let i = 1; i < this.state.displacement.tree.length; i++) {
              tailTree.push(0);
            }
            this.state.tail = me.fromAst(tailTree);
            // mark tail as essential so that value is saved if moved
            this._state.tail.essential = true;
            this.state.basedOnTail = true;
            this.state.tailChangedToEssential = true;
          }

          // since tail may no longer be zero
          // add it to displacement to get head
          if (this.state.displacement.tree.length !== this.state.tail.tree.length) {
            console.warn("Dimensions of displacement and tail don't match for vector");
            this.unresolvedState.head = true;
            this.unresolvedState.tail = true;
            this.unresolvedState.displacement = true;
            return;
          }
          let headTree = ["tuple"]
          for (let i = 1; i < this.state.displacement.tree.length; i++) {
            headTree.push(
              this.state.tail.get_component(i - 1).add(this.state.displacement.get_component(i - 1)).simplify()
            );
          }
          this.state.head = me.fromAst(headTree);
        } else {
          // displacement and tail: add to create head
          if (this.state.displacement.tree.length !== this.state.tail.tree.length) {
            console.warn("Dimensions of displacement and tail don't match for vector");
            this.unresolvedState.head = true;
            this.unresolvedState.tail = true;
            this.unresolvedState.displacement = true;
            return;
          }
          let headTree = ["tuple"]
          for (let i = 1; i < this.state.displacement.tree.length; i++) {
            headTree.push(
              this.state.tail.get_component(i - 1).add(this.state.displacement.get_component(i - 1)).simplify()
            );
          }
          this.state.head = me.fromAst(headTree);
        }
      } else {
        // displacement and head: subtract to create tail
        if (this.state.displacement.tree.length !== this.state.head.tree.length) {
          console.warn("Dimensions of displacement and head don't match for vector");
          this.unresolvedState.head = true;
          this.unresolvedState.tail = true;
          this.unresolvedState.displacement = true;
          return;
        }
        let tailTree = ["tuple"];
        for (let i = 1; i < this.state.displacement.tree.length; i++) {
          tailTree.push(
            this.state.head.get_component(i - 1).subtract(this.state.displacement.get_component(i - 1)).simplify()
          );
        }
        this.state.tail = me.fromAst(tailTree);
      }
    }

    // have head, tail, and displacement from children or essential state

    this.state.ndimensions = 1;
    let headtree = this.state.head.tree;
    if (headtree[0] === "tuple" || headtree[0] === "vector") {
      this.state.ndimensions = headtree.length - 1;
    }
    let ndim2 = 1;
    let tailtree = this.state.tail.tree;
    if (tailtree[0] === "tuple" || tailtree[0] === "vector") {
      ndim2 = tailtree.length - 1;
    }
    if (ndim2 !== this.state.ndimensions) {
      console.warn("Invalid format for vector: heand and tail dimensions must agree");
      this.unresolvedState.head = true;
      this.unresolvedState.tail = true;
      this.unresolvedState.displacement = true;
      return;
    }

    ndim2 = 1;
    let displacementtree = this.state.displacement.tree;
    if (displacementtree[0] === "tuple" || displacementtree[0] === "vector") {
      ndim2 = displacementtree.length - 1;
    }
    if (ndim2 !== this.state.ndimensions) {
      console.warn("Invalid format for vector: dimensions must agree");
      this.unresolvedState.head = true;
      this.unresolvedState.tail = true;
      this.unresolvedState.displacement = true;
      return;
    }

    // we'll build xs from displacement
    this.state.xs = [];

    let x = this.state.displacement;
    if (this.state.ndimensions > 1) {
      x = me.fromAst(this.state.displacement.tree[1])
    }
    this.state.xs[0] = x;

    if (this.state.ndimensions > 1) {
      this.state.xs[1] = me.fromAst(this.state.displacement.tree[2]);
    }

    if (this.state.ndimensions > 2) {
      this.state.xs[2] = me.fromAst(this.state.displacement.tree[3]);
    }

    for (let i = 4; i <= this.state.ndimensions; i++) {
      this.state.xs[i - 1] = me.fromAst(this.state.displacement.tree[i]);
    }

  }


  adapters = [{
    stateVariable: "displacement",
    componentType: "coords",
    stateVariableForNewComponent: "value",
  }];

  moveVector({ tailcoords, headcoords }) {

    let variableUpdates = {};

    if (tailcoords !== undefined) {
      variableUpdates.tail = { changes: me.fromAst(["tuple", ...tailcoords]) };
    }
    if (headcoords !== undefined) {
      variableUpdates.head = { changes: me.fromAst(["tuple", ...headcoords]) };
    }

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: variableUpdates,
      }]
    });

  }


  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    if (this.state.ndimensions === 2) {
      const actions = {
        moveVector: this.moveVector,
      }
      this.renderer = new this.availableRenderers.vector2d({
        key: this.componentName,
        label: this.state.label,
        draggable: this.state.draggable,
        layer: this.state.layer,
        tailcoords:
          [
            this.state.tail.get_component(0).evaluate_to_constant(),
            this.state.tail.get_component(1).evaluate_to_constant()
          ],
        headcoords:
          [
            this.state.head.get_component(0).evaluate_to_constant(),
            this.state.head.get_component(1).evaluate_to_constant()
          ],
        actions: actions,
        color: this.state.selectedStyle.lineColor,
        width: this.state.selectedStyle.lineWidth,
        style: this.state.selectedStyle.lineStyle,
      });
    }
  }

  updateRenderer() {
    this.renderer.setPointCoordinates({
      tailcoords:
        [
          this.state.tail.get_component(0).evaluate_to_constant(),
          this.state.tail.get_component(1).evaluate_to_constant()
        ],
      headcoords:
        [
          this.state.head.get_component(0).evaluate_to_constant(),
          this.state.head.get_component(1).evaluate_to_constant()
        ],
    });
  }

  updateChildrenWhoRender() {
    if (this.state.endpointsChild !== undefined) {
      this.childrenWhoRender = [this.state.endpointsChild.componentName];
    } else {
      this.childrenWhoRender = [];
      if (this.state.headChild !== undefined) {
        this.childrenWhoRender.push(this.state.headChild.componentName);
      }
      if (this.state.tailChild !== undefined) {
        this.childrenWhoRender.push(this.state.tailChild.componentName);
      }
    }
  }

  allowDownstreamUpdates(status) {
    return ((status.initialChange === true && this.state.draggable === true) ||
      (status.initialChange !== true && this.state.modifyIndirectly === true));
  }

  get variablesUpdatableDownstream() {
    return ["head", "tail", "displacement", "xs"];
  }


  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate, initialChange }) {


    let newHeadArray = Array(this.state.ndimensions);
    let newTailArray = Array(this.state.ndimensions);
    let newDisplacementArray = Array(this.state.ndimensions);

    if ("head" in stateVariablesToUpdate) {
      if (this.state.ndimensions === 1) {
        newHeadArray = [stateVariablesToUpdate.head.changes.tree];
      } else {
        newHeadArray = [...stateVariablesToUpdate.head.changes.tree.slice(1)];
      }
    }

    if ("tail" in stateVariablesToUpdate) {
      if (this.state.ndimensions === 1) {
        newTailArray = [stateVariablesToUpdate.tail.changes.tree];
      } else {
        newTailArray = [...stateVariablesToUpdate.tail.changes.tree.slice(1)];
      }
    }

    if ("displacement" in stateVariablesToUpdate) {
      if (this.state.ndimensions === 1) {
        newDisplacementArray = [stateVariablesToUpdate.displacement.changes.tree];
      } else {
        newDisplacementArray = [...stateVariablesToUpdate.displacement.changes.tree.slice(1)];
      }
    }

    // if have xs in stateVariablesToUpdate
    // just merge them into any empty coordinates of displacement
    if (stateVariablesToUpdate.xs !== undefined) {
      for (let ind in stateVariablesToUpdate.xs.changes.arrayComponents) {
        if (newDisplacementArray[ind] === undefined) {
          // found a component that hasn't been specified directly by displacement
          let x = stateVariablesToUpdate.xs.changes.arrayComponents[ind];
          if (x === undefined) {
            x = 1;
          } else if (x.tree !== undefined) {
            x = x.tree;
          }
          newDisplacementArray[ind] = x;
        }
      }
    }

    // merge head/tail/displacement for any coordinates
    // where at least one is defined
    for (let ind = 0; ind < this.state.ndimensions; ind++) {
      if (newHeadArray[ind] === undefined) {
        if (newTailArray[ind] === undefined) {
          if (newDisplacementArray[ind] !== undefined) {
            // just displacement changed
            if (this.state.basedOnDisplacement && !this.state.basedOnTail && !initialChange) {
              // keep head fixed and calculate new tail of head
              // only in case where have vector based on just head and displacement
              // and change wasn't initiated from vector itself
              // (check !basedOnTail rather than basedOnHead since if were based
              // on all three, tail would take precedence over displacement)
              let oldHead = this.state.head.get_component(ind).tree;
              newTailArray[ind] = ['+', oldHead, ['-', newDisplacementArray[ind]]];
            } else {
              // calculate new value of head
              let oldTail = this.state.tail.get_component(ind).tree;
              newHeadArray[ind] = ['+', oldTail, newDisplacementArray[ind]];
            }
          }
        } else {
          if (newDisplacementArray[ind] === undefined) {
            // just tail changed
            if (this.state.basedOnDisplacement && !this.state.basedOnHead && !initialChange) {
              // keep displacement fixed and calculate new value of head
              // only in case where have vector based on just tail and displacement
              // and change wasn't initiated from vector itself
              // (check !basedOnHead rather than basedOnTail since if were based
              // on all three, head would take precedence over displacement)
              let oldDisplacement = this.state.displacement.get_component(ind).tree;
              newHeadArray[ind] = ['+', newTailArray[ind], oldDisplacement];
            } else {
              // calculate new value of displacement
              let oldHead = this.state.head.get_component(ind).tree;
              newDisplacementArray[ind] = ['+', oldHead, ['-', newTailArray[ind]]];
            }
          } else {
            // tail and displacement changed
            // calculate new value of head
            newHeadArray[ind] = ['+', newTailArray[ind], newDisplacementArray[ind]];
          }
        }
      } else {
        if (newTailArray[ind] === undefined) {
          if (newDisplacementArray[ind] === undefined) {
            // just head changed
            if (this.state.basedOnDisplacement && !this.state.basedOnTail && !initialChange) {
              // keep displacement fixed and calculate new value of tail
              // only in case where have vector based on just head and displacement
              // and change wasn't initiated from vector itself
              // (check !basedOnTail rather than basedOnHead since if were based
              // on all three, tail would take precedence over displacement)
              let oldDisplacement = this.state.displacement.get_component(ind).tree;
              newTailArray[ind] = ['+', newHeadArray[ind], ['-', oldDisplacement]];
            } else {
              // calculate new value of displacement
              let oldTail = this.state.tail.get_component(ind).tree;
              newDisplacementArray[ind] = ['+', newHeadArray[ind], ['-', oldTail]];
            }
          } else {
            // head and displacement change
            // calculate new value of tail
            newTailArray[ind] = ['+', newHeadArray[ind], ['-', newDisplacementArray[ind]]];
          }
        } else {
          // head and tail changed
          // calculate new value of displacement
          // (which overrides any displacement given)
          newDisplacementArray[ind] = ['+', newHeadArray[ind], ['-', newTailArray[ind]]];
        }
      }
    }

    let newHead, newTail, newDisplacement;
    if (newHeadArray.some(x => x !== undefined)) {
      if (this.state.ndimensions === 1) {
        newHead = me.fromAst(newHeadArray[0]);
      } else {
        newHead = me.fromAst(["tuple", ...newHeadArray]);
      }
    }
    if (newTailArray.some(x => x !== undefined)) {
      if (this.state.ndimensions === 1) {
        newTail = me.fromAst(newTailArray[0]);
      } else {
        newTail = me.fromAst(["tuple", ...newTailArray]);
      }
    }
    if (newDisplacementArray.some(x => x !== undefined)) {
      if (this.state.ndimensions === 1) {
        newDisplacement = me.fromAst(newDisplacementArray[0]);
      } else {
        newDisplacement = me.fromAst(["tuple", ...newDisplacementArray]);
      }
    }

    // check if based on endpoints child
    if (this.state.endpointsChild !== undefined) {
      let endpoints = this.state.endpointsChild.state.points;

      for (let ind = 0; ind < endpoints.length; ind++) {
        let pointName = endpoints[ind].componentName;
        if (endpoints.length === 1 || ind === 1) {
          if (newHead !== undefined) {
            dependenciesToUpdate[pointName] = { coords: { changes: newHead } };
          }
        } else {
          if (newTail !== undefined) {
            dependenciesToUpdate[pointName] = { coords: { changes: newTail } };
          }
        }
      }
    } else {
      if (this.state.headChild !== undefined && newHead !== undefined) {
        let headName = this.state.headChild.componentName;
        dependenciesToUpdate[headName] = { coords: { changes: newHead } };
      }
      if (this.state.tailChild !== undefined && newTail !== undefined) {
        let tailName = this.state.tailChild.componentName;
        dependenciesToUpdate[tailName] = { coords: { changes: newTail } };
      }
      if (this.state.displacementChild !== undefined && newDisplacement !== undefined) {
        let displacementName = this.state.displacementChild.componentName;
        dependenciesToUpdate[displacementName] = { displacement: { changes: newDisplacement } };
      }
    }

    let newStateVariables = {};
    if (newHead !== undefined) {
      newStateVariables.head = { changes: newHead };
    }
    if (newTail !== undefined) {
      newStateVariables.tail = { changes: newTail };
    }
    if (newDisplacement !== undefined) {
      newStateVariables.displacement = { changes: newDisplacement };
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
        !shadowedStateVariables.has(varname)) {
        if (isReplacement) {
          // for replacement, only allow changes if variable is tail and
          // it wasn't originally essential
          if (varname === "tail" && this.state.tailChangedToEssential === true) {
            stateVariableChangesToSave[varname] = newStateVariables[varname];
          }
        } else {
          stateVariableChangesToSave[varname] = newStateVariables[varname];
        }
      }
    }

    // console.log({
    //   componentName: this.componentName,
    //   dependenciesToUpdate: dependenciesToUpdate,
    //   stateVariableChangesToSave: stateVariableChangesToSave,
    // })

    return true;

  }


  nearestPoint({ x1, x2, x3 }) {

    // only implemented in 2D for now
    if (this.state.ndimensions !== 2) {
      return;
    }

    let A1 = this.state.head.get_component(0).evaluate_to_constant();
    let A2 = this.state.head.get_component(1).evaluate_to_constant();
    let B1 = this.state.tail.get_component(0).evaluate_to_constant();
    let B2 = this.state.tail.get_component(1).evaluate_to_constant();

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

    if (x3 !== undefined) {
      result.x3 = 0;
    }

    return result;

  }

}