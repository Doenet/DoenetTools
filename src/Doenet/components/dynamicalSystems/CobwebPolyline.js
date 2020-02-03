import Polyline from '../Polyline';
import me from 'math-expressions';

export default class CobwebPolyline extends Polyline {
  static componentType = "cobwebpolyline";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.attractthreshold = {default: 0.5};
    properties.nPoints = {default: 1};
    return properties;
  }


  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let exactlyOneInitialPoint = childLogic.newLeaf({
      name: 'exactlyOneInitialPoint',
      componentType: "initialpoint",
      number: 1,
    });

    let exactlyOneFunction = childLogic.newLeaf({
      name: "exactlyOneFunction",
      componentType: "function",
      number: 1,
    });

    childLogic.newOperator({
      name: "initialPointAndFunction",
      operator: "and",
      propositions: [exactlyOneInitialPoint, exactlyOneFunction],
      setAsBase: true,
    })

    return childLogic;

  }


  updateState(args={}) {

    super.updateState(args);

    if(args.init) {

      this.makePublicStateVariableArray({
        variableName: "correctvertices",
        componentType: "boolean",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "correctvertex",
        arrayVariableName: "correctvertices",
      });

      this.makePublicStateVariableArray({
        variableName: "iteratevalues",
        componentType: "number",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "iteratevalue",
        arrayVariableName: "iteratevalues",
      });
      this.makePublicStateVariableAlias({
        variableName: "lastvertex",
        targetName: "vertex",
        arrayIndex: '-1',
      })

      this._state.vertices.essential = true;

      if(this._state.removedVertices === undefined) {
        this._state.removedVertices = {
          value: [],
          essential: true,
          trackChanges: true,
        }
      }

      if(this.state.initialPoint === undefined) {
        this._state.initialPoint = {}
      }
      this._state.initialPoint.trackChanges = true;

      // since polyline has an ndimensions state variable
      this.state.ndimensions = 2;

      this.state.draggablePoints = [];
    }

    if(!this.childLogicSatisfied) {
      return;
    }

    // use not greater than to catch case when have NaN
    if(!(this.state.nPoints >= 1)) {
      this.state.nPoints = 1;
    }else {
      this.state.nPoints = Math.round(this.state.nPoints);
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let exactlyOneInitialPoint = this.childLogic.returnMatches("exactlyOneInitialPoint");
      this.state.initialPointChild = this.activeChildren[exactlyOneInitialPoint[0]];

      let exactlyOneFunction = this.childLogic.returnMatches("exactlyOneFunction");
      this.state.functionChild = this.activeChildren[exactlyOneFunction[0]];

    }

    if(this.state.initialPointChild.unresolvedState.coords) {
      this.unresolvedState.vertices = true;
      return;
    }

    let initialPointChanged = false;

    if(childrenChanged || trackChanges.getVariableChanges({component: this.state.initialPointChild, variable: "coords"})
      || trackChanges.getVariableChanges({component: this, variable: "vertices", index: 0})  
    ) {
      this.state.initialPoint = this.state.initialPointChild.state.coords.copy();
      this.state.vertices[0] = this.state.initialPoint;
      initialPointChanged = true;
    }

    if(this.state.functionChild.unresolvedState.formula) {
      this.unresolvedState.vertices = true;
      return;
    }else {
      this.state.f = this.state.functionChild.returnNumericF();
    }
    

    let nCurrentVertices = this.state.vertices.length;
    if(this.state.nPoints > nCurrentVertices) {
      let topAvailable = Math.min(this.state.nPoints, nCurrentVertices + this.state.removedVertices.length);
      if(topAvailable > nCurrentVertices) {
        this.state.vertices.push(...this.state.removedVertices.slice(0, topAvailable-nCurrentVertices));
        this.state.removedVertices = this.state.removedVertices.slice(topAvailable-nCurrentVertices);
        nCurrentVertices = topAvailable;
      }
      for(let ind = nCurrentVertices; ind < this.state.nPoints; ind++) {
        let newCoords = me.fromAst(["tuple", 0, 0]);
        this.state.vertices.push(newCoords);
      }
    } else if(this.state.nPoints < nCurrentVertices) {
      this.state.removedVertices = [...this.state.vertices.slice(this.state.nPoints), ...this.state.removedVertices];
      this.state.vertices.length = this.state.nPoints;
      this.state.correctvertices.length = this.state.nPoints-1;
    }

    if(this.state.draggablePoints.length !== this.state.nPoints) {
      this.state.draggablePoints = new Array(this.state.nPoints).fill(false);
      if(this.state.nPoints > 1) {
        this.state.draggablePoints[this.state.nPoints-1] = true;
      }
    }

    let pointsToAttract = [];

    if(initialPointChanged) {
      // if initial point changed, attract all points except first
      pointsToAttract = [...Array(this.state.nPoints).keys()].slice(1);
      this.state.correctvertices = [];
    } else if(this.state.nPoints > 1) {
      // attract just last point
      pointsToAttract = [this.state.nPoints-1];
    }

    for(let pointInd of pointsToAttract) {

      let attractPoint;
      if(pointInd % 2 === 1) {
        // odd point number, so attract to function

        let prevVertex = this.state.vertices[pointInd-1];
        let prevValue = this.findFiniteNumericalValue(prevVertex.get_component(0));
        let newValue = this.state.f(prevValue);
        attractPoint = [prevValue, newValue];

      } else {
        // even point number, so attract to diagonal
        let prevVertex = this.state.vertices[pointInd-1];
        let prevValue = this.findFiniteNumericalValue(prevVertex.get_component(1));
        attractPoint = [prevValue, prevValue]
      }

      if(attractPoint !== undefined) {
        let thisVertex = this.state.vertices[pointInd];
        let x1 = this.findFiniteNumericalValue(thisVertex.get_component(0));
        let x2 = this.findFiniteNumericalValue(thisVertex.get_component(1));

        let distance2FromAttractor = Math.pow(x1-attractPoint[0],2) + Math.pow(x2-attractPoint[1], 2);

        if(distance2FromAttractor < this.state.attractthreshold*this.state.attractthreshold) {
          this.state.vertices[pointInd] = me.fromAst(["tuple", ...attractPoint]);
          this.state.correctvertices[pointInd-1] = true;
        } else {
          this.state.correctvertices[pointInd-1] = false;
        }
      }
    }

    // get the y-values of the odd vertices
    this.state.iteratevalues = this.state.vertices
      .filter((v,i) => i % 2 === 1)
      .map(v => v.get_component(1).evaluate_to_constant())

    
  }


  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    if(this.unresolvedState.vertices === undefined) {
      const actions = {
        movePolyline: this.movePolyline,
      }
      this.renderer = new this.availableRenderers.polyline2d({
        key: this.componentName,
        actions: actions,
        label: this.state.label,
        draggable: false,
        layer: this.state.layer,
        visible: !this.state.hide,
        pointcoords: this.state.vertices.map(x => 
          [x.get_component(0).evaluate_to_constant(),
          x.get_component(1).evaluate_to_constant()]),
        color: this.state.selectedStyle.lineColor,
        width: this.state.selectedStyle.lineWidth,
        style: this.state.selectedStyle.lineStyle,
        pointColor: this.state.selectedStyle.markerColor,
        pointSize: this.state.selectedStyle.markerSize,
        pointStyle: this.state.selectedStyle.markerStyle,
      });
    }
  }

  updateRenderer(){
    this.renderer.updatePolyline({
      visible: !this.state.hide,
      pointcoords: this.state.vertices.map(x => 
        [x.get_component(0).evaluate_to_constant(),
        x.get_component(1).evaluate_to_constant()]),
   });
  }


  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newStateVariables = {};
    let verticesChanged = new Set([]);

    let newVertices = Array(this.state.nPoints);

    for(let varName in stateVariablesToUpdate) {
      if(varName === "vertices") {
        if(newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for(let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          verticesChanged.add(Number(ind));
          newVertices[ind] = newStateVariables[varName].changes.arrayComponents[ind] = 
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      }
    }

    // if changed vertex 0, change initial condition point
    if(verticesChanged.has(0)) {
      dependenciesToUpdate[this.state.initialPointChild.componentName] = {
        coords: {changes: newVertices[0]}
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

}