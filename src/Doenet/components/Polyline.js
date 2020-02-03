import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Polyline extends GraphicalComponent {
  static componentType = "polyline";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.draggable = {default: true};
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let addVertices = function({activeChildrenMatched}) {
      // add <vertices> around points
      let verticesChildren = [];
      for(let child of activeChildrenMatched) {
        verticesChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "vertices", children: verticesChildren }],
      }
    }


    let AtLeastOnePoint = childLogic.newLeaf({
      name: "AtLeastOnePoint",
      componentType: 'point',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      replacementFunction: addVertices,
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
      replacementFunction: addVertices,
    });

    let NoPoints = childLogic.newLeaf({
      name: "NoPoints",
      componentType: 'point',
      number: 0
    });

    let ExactlyOneVertices = childLogic.newLeaf({
      name: "ExactlyOneVertices",
      componentType: 'vertices',
      number: 1
    });

    childLogic.newOperator({
      name: "VerticesXorSugar",
      operator: 'xor',
      propositions: [ExactlyOneVertices, AtLeastOnePoint, StringsAndMaths, NoPoints],
      setAsBase: true
    });

    return childLogic;
  }


  updateState(args={}) {
    if(args.init === true) {

      this.makePublicStateVariableArray({
        variableName: "vertices",
        componentType: "point",
        stateVariableForRef: "coords",
      });
      this.makePublicStateVariableArrayEntry({
        entryName: "vertex",
        arrayVariableName: "vertices",
      });
      this.makePublicStateVariable({
        variableName: "styledescription",
        componentType: "text",
      });

      // reference via the point coords
      this.stateVariablesForReference = ["vertices"];

      this.movePolyline = this.movePolyline.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );

      if(this.state.nPoints === undefined) {
        this.state.nPoints = 0;
      }

    }

    super.updateState(args);

    this.state.selectedStyle = this.styleDefinitions[this.state.stylenumber];
    if(this.state.selectedStyle === undefined) {
      this.state.selectedStyle = this.styleDefinitions[1];
    }

    let curveDescription = "";
    if(this.state.selectedStyle.lineWidth >= 4) {
      curveDescription += "thick ";
    }else if(this.state.selectedStyle.lineWidth <= 1) {
      curveDescription += "thin ";
    }
    if(this.state.selectedStyle.lineStyle === "dashed") {
      curveDescription += "dashed ";
    } else if(this.state.selectedStyle.lineStyle === "dotted") {
      curveDescription += "dotted ";
    }

    curveDescription += `${this.state.selectedStyle.lineColor} `;

    this.state.styledescription = curveDescription;


    if(!this.childLogicSatisfied) {
      this.unresolvedState.vertices = true;
      this.unresolvedState.ndimensions = true;
      this.unresolvedState.nPoints = true;
      return;
    }

    delete this.unresolvedState.ndimensions;
    delete this.unresolvedState.nPoints;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let verticesInds = this.childLogic.returnMatches("ExactlyOneVertices");

      // if ExactlyOneVertices is undefined, then a superclass
      // must have overwritten childLogic, so skip this processing
      if(verticesInds === undefined) {
        this.state.polylineChildlogicOverwritten = true;
        delete this.unresolvedState.vertices;
        return;
      }


      if(verticesInds.length > 0) {
        this.state.verticesChild = this.activeChildren[verticesInds[0]];
      } else {
        delete this.state.verticesChild;
      }
    }


    if(this.state.polylineChildlogicOverwritten) {
      return;
    }

    let recheckPoints = false;

    if(!this.state.verticesChild) {
      if(!this._state.vertices.essential) {
        delete this.unresolvedState.vertices;
        this.state.vertices = [];
        this.state.nPoints = 0;
        this.state.ndimensions = undefined;
        return;
      }else {
        this.state.nPoints = this.state.vertices.length;
        if(trackChanges.getVariableChanges({component: this, variable: "vertices"})) {
          recheckPoints = true;
        }
      }
    }else {

      let verticesState = this.state.verticesChild.state;
      if(this.state.verticesChild.unresolvedState.points) {
        this.unresolvedState.vertices = true;
        this.unresolvedState.ndimensions = true;
        this.unresolvedState.nPoints = true;
        return;
      }


      if(childrenChanged || 
          trackChanges.getVariableChanges({component:this.state.verticesChild,
            variable: "points"})) {

        recheckPoints = true;
        delete this.unresolvedState.vertices;

        let points = verticesState.points;
        this.state.nPoints = verticesState.nPoints;

        this.state.vertices=[];
        
        for(let i=0; i < this.state.nPoints; i++) {
          if(points[i].unresolvedState.coords) {
            if(!this.unresolvedState.vertices) {
              this.unresolvedState.vertices = {isArray: true, arrayComponents: {}};
            }
            this.unresolvedState.vertices.arrayComponents[i] = true;
            this.state.vertices.push(undefined);
          }else {
            this.state.vertices.push(points[i].state.coords.copy());
          }
        }

      } else {
        for(let i=0; i < this.state.nPoints; i++) {
          if(verticesState.points[i].unresolvedState.coords) {
            if(!this.unresolvedState.vertices) {
              this.unresolvedState.vertices = {isArray: true, arrayComponents: {}};
            }
            this.unresolvedState.vertices.arrayComponents[i] = true;
          }else if(trackChanges.getVariableChanges({
            component: verticesState.points[i],
            variable: "coords"
          })) {
            recheckPoints = true;
            this.state.vertices[i] = verticesState.points[i].state.coords.copy();
          }
        }
      }
    }

    if(recheckPoints && !this.unresolvedState.vertices) {
      this.state.ndimensions = undefined;
      if(this.state.nPoints > 0) {
        this.state.ndimensions = 1;
        let vertex1tree = this.state.vertices[0].tree;
        if(vertex1tree[0] === "tuple" || vertex1tree[0] === "vector") {
          this.state.ndimensions = vertex1tree.length-1;
        }
        for(let i=1; i < this.state.nPoints; i++) {
          let ndimb = 1;
          let vertextree = this.state.vertices[i].tree;
          if(vertextree[0] === "tuple" || vertextree[0] === "vector") {
            ndimb = vertextree.length-1;
          }
          if(ndimb != this.state.ndimensions) {
            console.warn("Invalid polyline: points must have same number of dimensions");
            this.state.nPoints = 0;
            this.state.vertices = [];
            break;
          }
        }
      }
    }

  }

  movePolyline(pointcoordsObject) {
    let vertexComponents = {};
    for(let ind in pointcoordsObject) {
      vertexComponents[ind] = me.fromAst(["tuple", ...pointcoordsObject[ind]])
    }

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          vertices: {
            isArray: true,
            changes: { arrayComponents: vertexComponents }
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
    
    if(this.state.ndimensions === 2 && this.unresolvedState.vertices === undefined) {
      const actions = {
        movePolyline: this.movePolyline,
      }
      this.renderer = new this.availableRenderers.polyline2d({
        key: this.componentName,
        label: this.state.label,
        draggable: this.state.draggable,
        layer: this.state.layer,
        visible: !this.state.hide,
        pointcoords: this.state.vertices.map(x => 
          [x.get_component(0).evaluate_to_constant(),
          x.get_component(1).evaluate_to_constant()]),
        color: this.state.selectedStyle.lineColor,
        width: this.state.selectedStyle.lineWidth,
        style: this.state.selectedStyle.lineStyle,
        actions: actions,
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

  updateChildrenWhoRender(){
    if(this.state.verticesChild !== undefined)
      this.childrenWhoRender = [this.state.verticesChild.componentName];
  }

  allowDownstreamUpdates(status) {
    return ((status.initialChange === true && this.state.draggable === true) ||
    (status.initialChange !== true && this.state.modifyIndirectly === true));
  }

  get variablesUpdatableDownstream() {
    return ["vertices"];
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

    // check if based on vertices child
    if(this.state.verticesChild !== undefined) {
      let vertices = this.state.verticesChild.state.points;

      for(let ind=0; ind < vertices.length; ind++) {
        if(verticesChanged.has(ind)) {
          let pointName = vertices[ind].componentName;
          dependenciesToUpdate[pointName] = {coords: {changes: newVertices[ind]}};
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

    let closestDistance2 = Infinity;
    let closestResult = {}

    let prevPtx, prevPty;
    let nextPtx = this.state.vertices[this.state.nPoints-1].get_component(0).evaluate_to_constant();
    let nextPty = this.state.vertices[this.state.nPoints-1].get_component(1).evaluate_to_constant();

    for(let i=0; i < this.state.nPoints; i++) {
      prevPtx = nextPtx;
      prevPty = nextPty;

      nextPtx = this.state.vertices[i].get_component(0).evaluate_to_constant();
      nextPty = this.state.vertices[i].get_component(1).evaluate_to_constant();
    
      // only implement for constants
      if(!(Number.isFinite(prevPtx) && Number.isFinite(prevPty) && 
          Number.isFinite(nextPtx) && Number.isFinite(nextPty))) {
        continue;
      }

      let BA1 = nextPtx-prevPtx;
      let BA2 = nextPty-prevPty;
      let denom = (BA1*BA1+BA2*BA2);

      if(denom===0) {
        continue;
      }

      let t = ((x1-prevPtx)*BA1+(x2-prevPty)*BA2)/denom;

      let result;

      if(t<=0) {
        result = {x1: prevPtx, x2: prevPty};
      }else if(t >= 1) {
        result = {x1: nextPtx, x2: nextPty};
      }else {
        result = {
          x1: prevPtx + t*BA1,
          x2: prevPty + t*BA2,
        };
      }

      let distance2 = Math.pow(x1 - result.x1, 2) + Math.pow(x2 - result.x2, 2);

      if(distance2 < closestDistance2) {
        closestDistance2 = distance2;
        closestResult = result;
      }

    }

    if(x3 !== undefined && Object.keys(closestResult).length > 0) {
      closestResult.x3 = 0;
    }

    return closestResult;

  }

}