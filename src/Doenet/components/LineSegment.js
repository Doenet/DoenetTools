import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class LineSegment extends GraphicalComponent {
  static componentType = "linesegment";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = {default: true};
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let addEndpoints = function({activeChildrenMatched}) {
      // add <endpoints> around points
      let endpointChildren = [];
      for(let child of activeChildrenMatched) {
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

    let ExactlyTwoPoints = childLogic.newLeaf({
      name: "ExactlyTwoPoints",
      componentType: 'point',
      number: 2,
      isSugar: true,
      replacementFunction: addEndpoints,
    });

    let AtLeastOneString = childLogic.newLeaf({
      name: "AtLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });
    
    let AtLeastOneMath = childLogic.newLeaf({
      name: "AtLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let StringsAndMaths = childLogic.newOperator({
      name: "StringsAndMaths",
      operator: 'or',
      propositions: [AtLeastOneString, AtLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      replacementFunction: addEndpoints,
    });

    let NoPoints = childLogic.newLeaf({
      name: "NoPoints",
      componentType: 'point',
      number: 0
    });

    let ExactlyOneEndpoints = childLogic.newLeaf({
      name: "ExactlyOneEndpoints",
      componentType: 'endpoints',
      number: 1
    });

    childLogic.newOperator({
      name: "EndpointsXorSugar",
      operator: 'xor',
      propositions: [ExactlyOneEndpoints, ExactlyTwoPoints, StringsAndMaths, NoPoints],
      setAsBase: true
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {

      this.makePublicStateVariableArray({
        variableName: "endpoints",
        componentType: "point",
        stateVariableForRef: "coords",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "endpoint",
        arrayVariableName: "endpoints",
      });
      this.makePublicStateVariable({
        variableName: "styledescription",
        componentType: "text",
      });

      // reference via the point coords
      this.stateVariablesForReference = ["endpoints"];

      this.moveLineSegment = this.moveLineSegment.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.endpoints = true;
      return;
    }

    delete this.unresolvedState.endpoints;

    this.state.selectedStyle = this.styleDefinitions[this.state.stylenumber];
    if(this.state.selectedStyle === undefined) {
      this.state.selectedStyle = this.styleDefinitions[1];
    }

    let lineDescription = "";
    if(this.state.selectedStyle.lineWidth >= 4) {
      lineDescription += "thick ";
    }else if(this.state.selectedStyle.lineWidth <= 1) {
      lineDescription += "thin ";
    }
    if(this.state.selectedStyle.lineStyle === "dashed") {
      lineDescription += "dashed ";
    } else if(this.state.selectedStyle.lineStyle === "dotted") {
      lineDescription += "dotted ";
    }

    lineDescription += `${this.state.selectedStyle.lineColor} `;

    this.state.styledescription = lineDescription;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let endpointsInds = this.childLogic.returnMatches("ExactlyOneEndpoints");

      if(endpointsInds.length === 0) {
        if(this._state.endpoints.essential !== true) {
          throw Error("Must specify endpoints of lineSegment.")
        }
      } else {

        this.state.endpointsChild = this.activeChildren[endpointsInds[0]];
      }

    }

    if(this.state.endpointsChild) {
      let endpointsState = this.state.endpointsChild.state;

      if(this.state.endpointsChild.unresolvedState.points ||
        endpointsState.points.some(x =>x.unresolvedState.coords)) {
        this.unresolvedState.endpoints = true;
        return;
      }

      let pointsChanged = childrenChanged || trackChanges.childrenChanged(this.state.endpointsChild.componentName);

      if(pointsChanged) {

        if(endpointsState.nPoints === 0) {
          console.warn("Cannot determine lineSegment with zero endpoints");
          this.state.endpoints = [me.fromAst(0), me.fromAst(0)];
        }else if(endpointsState.nPoints === 1) {
          console.warn("Cannot determine lineSegment with one endpoint");
          this.state.endpoints = [
            endpointsState.points[0].state.coords.copy(),
            endpointsState.points[0].state.coords.copy(),
          ]
        }else if(endpointsState.nPoints === 2) {
          this.state.endpoints = [
            endpointsState.points[0].state.coords.copy(),
            endpointsState.points[1].state.coords.copy(),
          ]
        }else {
          throw Error("LineSegment must be determined by two endpoints (" + endpointsState.nPoints + " given)");
        }
      }else {
        if(endpointsState.nPoints > 0) {
          if(trackChanges.getVariableChanges({
            component: endpointsState.points[0],
            variable: "coords"
          })) {
            this.state.endpoints[0] = endpointsState.points[0].state.coords.copy();
          }
        }

        if(endpointsState.nPoints > 1) {
            if(trackChanges.getVariableChanges({
            component: endpointsState.points[1],
            variable: "coords"
          })) {
            this.state.endpoints[1] = endpointsState.points[1].state.coords.copy();
          }
        }
      }
    }


    if(trackChanges.getVariableChanges({
      component: this, variable: "endpoints"})) {

      this.state.ndimensions = 1;
      let endpoint1tree = this.state.endpoints[0].tree;
      if(endpoint1tree[0] === "tuple" || endpoint1tree[0] === "vector") {
        this.state.ndimensions = endpoint1tree.length-1;
      }
      let ndim2 = 1;
      let endpoint2tree = this.state.endpoints[1].tree;
      if(endpoint2tree[0] === "tuple" || endpoint2tree[0] === "vector") {
        ndim2 = endpoint2tree.length-1;
      }
      if(ndim2 !== this.state.ndimensions) {
        throw Error("Invalid line segment: points must have same number of dimensions");
      }
    }
  }


  moveLineSegment({point1coords, point2coords}) {

    let newComponents = {};

    if(point1coords !== undefined) {
      newComponents[0] = me.fromAst(["tuple", ...point1coords]);
    }
    if(point2coords !== undefined) {
      newComponents[1] = me.fromAst(["tuple", ...point2coords]);
    }

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          endpoints:  {
            isArray: true,
            changes: { arrayComponents: newComponents }
          }
        }
      }]
    });

  }


  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    if(this.state.ndimensions === 2) {
      const actions = {
        moveLineSegment: this.moveLineSegment,
      }

      let point1x, point1y, point2x, point2y;
      try {
        point1x = this.state.endpoints[0].get_component(0);
        point1y = this.state.endpoints[0].get_component(1);
        point2x = this.state.endpoints[1].get_component(0);
        point2y = this.state.endpoints[1].get_component(1);
      } catch(e) {
        console.warn("Endpoints of line segment don't have two dimensions");
        return;
      }

      this.renderer = new this.availableRenderers.linesegment2d({
        key: this.componentName,
        label: this.state.label,
        draggable: this.state.draggable,
        layer: this.state.layer,
        visible: !this.state.hide,
        point1coords:
        [
          point1x.evaluate_to_constant(),
          point1y.evaluate_to_constant()
        ],
        point2coords:
        [
          point2x.evaluate_to_constant(),
          point2y.evaluate_to_constant()
        ],
        actions: actions,
        color: this.state.selectedStyle.lineColor,
        width: this.state.selectedStyle.lineWidth,
        style: this.state.selectedStyle.lineStyle,
      });
    }
  }

  updateRenderer(){
    let point1x, point1y, point2x, point2y;
    try {
      point1x = this.state.endpoints[0].get_component(0);
      point1y = this.state.endpoints[0].get_component(1);
      point2x = this.state.endpoints[1].get_component(0);
      point2y = this.state.endpoints[1].get_component(1);
    } catch(e) {
      console.warn("Endpoints of line segment don't have two dimensions");
      return;
    }

    this.renderer.updateLineSegment({
      point1coords:
      [
        point1x.evaluate_to_constant(),
        point1y.evaluate_to_constant()
      ],
      point2coords:
      [
        point2x.evaluate_to_constant(),
        point2y.evaluate_to_constant()
      ],
      visible: !this.state.hide,      
    });
  }

  updateChildrenWhoRender(){
    if(this.state.endpointsChild !== undefined)
    this.childrenWhoRender = [this.state.endpointsChild.componentName];
  }

  allowDownstreamUpdates(status) {
    return ((status.initialChange === true && this.state.draggable === true) ||
    (status.initialChange !== true && this.state.modifyIndirectly === true));
  }

  get variablesUpdatableDownstream() {
    return ["endpoints"];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newStateVariables = {};
    let endpointsChanged = new Set([]);

    let newEndpoints = Array(2);

    for(let varName in stateVariablesToUpdate) {
      if(varName === "endpoints") {
        if(newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for(let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          endpointsChanged.add(Number(ind));
          newEndpoints[ind] = newStateVariables[varName].changes.arrayComponents[ind] = 
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      }
    }

    // check if based on endpoints child
    if(this.state.endpointsChild !== undefined) {
      let endPoints = this.state.endpointsChild.state.points;

      for(let ind=0; ind < 2; ind++) {
        // use endpointsChanged rather than checking if newEndpoints[ind]
        // is undefined as is possible on dryRun to have passed in an
        // undefined endpoint to indicate it will be changed
        if(endpointsChanged.has(ind)) {
          let pointName = endPoints[ind].componentName;
          dependenciesToUpdate[pointName] = {coords: {changes: newEndpoints[ind]}};
        }
      }
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add stateVariable to stateVariableChangesToSave if is essential
    // and no shadow sources were updated
    for(let varname in newStateVariables) {
      if(this._state[varname].essential === true &&
          !shadowedStateVariables.has(varname) && !isReplacement) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    return true;

  }


  nearestPoint({x1, x2, x3}) {

    // only implemented in 2D for now
    if(this.state.ndimensions !== 2) {
      return;
    }

    let A1 = this.state.endpoints[0].get_component(0).evaluate_to_constant();
    let A2 = this.state.endpoints[0].get_component(1).evaluate_to_constant();
    let B1 = this.state.endpoints[1].get_component(0).evaluate_to_constant();
    let B2 = this.state.endpoints[1].get_component(1).evaluate_to_constant();

    // only implement for constants
    if(!(Number.isFinite(A1) && Number.isFinite(A2) && 
        Number.isFinite(B1) && Number.isFinite(B2))) {
      return {};
    }

    let BA1 = B1-A1;
    let BA2 = B2-A2;
    let denom = (BA1*BA1+BA2*BA2);

    if(denom===0) {
      return {};
    }

    let t = ((x1-A1)*BA1+(x2-A2)*BA2)/denom;

    let result = {};

    if(t<=0) {
      result = {x1: A1, x2: A2};
    }else if(t >= 1) {
      result = {x1: B1, x2: B2};
    }else {
      result = {
        x1: A1 + t*BA1,
        x2: A2 + t*BA2,
      };
    }

    if(x3 !== undefined) {
      result.x3 = 0;
    }

    return result;

  }

}