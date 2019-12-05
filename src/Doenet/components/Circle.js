import Curve from './Curve';
import me from 'math-expressions';

export default class Circle extends Curve {
  static componentType = "circle";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let addCenter = function({activeChildrenMatched}) {
      // add <center> around point
      return {
        success: true,
        newChildren: [{
          componentType: "center",
          children: [{
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }],
        }],
      }
    }

    let exactlyOnePoint = childLogic.newLeaf({
      name: "exactlyOnePoint",
      componentType: 'point',
      number: 1,
      isSugar: true,
      replacementFunction: addCenter,
    });

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      replacementFunction: addCenter,
    });
    
    let noPoints = childLogic.newLeaf({
      name: "noPoints",
      componentType: 'point',
      number: 0
    });

    let exactlyOneThrough = childLogic.newLeaf({
      name: "exactlyOneThrough",
      componentType: 'through',
      number: 1
    });

    let exactlyOneCenter = childLogic.newLeaf({
      name: "exactlyOneCenter",
      componentType: 'center',
      number: 1
    });

    let exactlyOneRadius = childLogic.newLeaf({
      name: "exactlyOneRadius",
      componentType: 'radius',
      number: 1,
    });

    let centerXorSugar = childLogic.newOperator({
      name: "centerXorSugar",
      operator: 'xor',
      propositions: [exactlyOneCenter, exactlyOnePoint, exactlyOneString, noPoints],
    });

    childLogic.newOperator({
      name: "radiusCenterOrThrough",
      operator: 'or',
      propositions: [exactlyOneRadius, exactlyOneThrough, centerXorSugar],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      this.makePublicStateVariable({
        variableName: "center",
        componentType: "point",
        stateVariableForRef: "coords"
      });
  
      this.makePublicStateVariable({
        variableName: "radius",
        componentType: "radius",
      });

      this._state.throughPoints = {trackChanges: true, value: []}

      this.stateVariablesForReference = ["center", "radius"];
  
      this.moveCircle = this.moveCircle.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.center = true;
      this.unresolvedState.radius = true;
      this.unresolvedState.centerNumeric = true;
      this.unresolvedState.radiusNumeric = true;
      return;
    }

    delete this.unresolvedState.center;
    delete this.unresolvedState.radius;
    delete this.unresolvedState.centerNumeric;
    delete this.unresolvedState.radiusNumeric;

    
    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let throughInds = this.childLogic.returnMatches("exactlyOneThrough");
      if(throughInds.length === 1) {
        this.state.throughChild = this.activeChildren[throughInds[0]];
      }else {
        delete this.state.throughChild;
      }
      let centerInds = this.childLogic.returnMatches("exactlyOneCenter");
      if(centerInds.length === 1) {
        this.state.centerChild = this.activeChildren[centerInds[0]];
      }else {
        delete this.state.centerChild;
      }
      let radiusInds = this.childLogic.returnMatches("exactlyOneRadius");
      if(radiusInds.length === 1) {
        this.state.radiusChild = this.activeChildren[radiusInds[0]];
      }else {
        delete this.state.radiusChild;
      }
    }

    let recalculateCircle = childrenChanged;

    if(this.state.throughChild) {
      let throughState = this.state.throughChild.state;
      if(this.state.throughChild.unresolvedState.points ||
          throughState.points.some(x => x.unresolvedState.coords)) {
        this.unresolvedState.center = true;
        this.unresolvedState.radius = true;
        this.unresolvedState.centerNumeric = true;
        this.unresolvedState.radiusNumeric = true;
        return;
      }

      let pointsChanged = childrenChanged || trackChanges.childrenChanged(this.state.throughChild.componentName);

      let points = throughState.points;
      let nPoints = throughState.nPoints;

      if(pointsChanged) {
        recalculateCircle = true;

        this.state.throughPoints=[];

        for(let i=0; i < nPoints; i++) {
          this.state.throughPoints.push(points[i].state.coords.copy());
          let throughTree = this.state.throughPoints[i].tree
          if(!(throughTree[0] === "tuple" || throughTree[0] === "vector" ||
              throughTree.length !== 3)) {
            throw Error("Circle implemented only for two-dimensional points")
          }
        }
        this.state.nThroughPoints = nPoints;

      }else {
        for(let i=0; i < nPoints; i++) {
          if(trackChanges.getVariableChanges({
            component: points[i],
            variable: "coords"
          })) {
            recalculateCircle = true;
            this.state.throughPoints[i] = points[i].state.coords.copy();
          }
        }
      }
    }else if(trackChanges.getVariableChanges({component: this, variable: "throughPoints"})) {
      recalculateCircle = true;
    }


    if(this.state.centerChild) {
      if(this.state.centerChild.unresolvedState.coords) {
        this.unresolvedState.center = true;
        this.unresolvedState.radius = true;
        this.unresolvedState.centerNumeric = true;
        this.unresolvedState.radiusNumeric = true;
        return;
      }

      if(childrenChanged || trackChanges.getVariableChanges({
        component: this.state.centerChild,
        variable: "coords"
      })) {
        recalculateCircle = true;
        this.state.center = this.state.centerChild.state.coords.copy();

        let centerTree = this.state.center.tree
        if(!(centerTree[0] === "tuple" || centerTree[0] === "vector" ||
            centerTree.length !== 3)) {
          throw Error("Circle implemented only for two-dimensional points")
        }
      }
    }else if(trackChanges.getVariableChanges({component: this, variable: "center"})) {
      recalculateCircle = true;
    }

    if(this.state.radiusChild) {
      if(this.state.radiusChild.unresolvedState.value) {
        this.unresolvedState.center = true;
        this.unresolvedState.radius = true;
        this.unresolvedState.centerNumeric = true;
        this.unresolvedState.radiusNumeric = true;
        return;
      }
      if(childrenChanged || trackChanges.getVariableChanges({
        component: this.state.radiusChild,
        variable: "value"
      })) {
        recalculateCircle = true;
        this.state.radius = this.state.radiusChild.state.value;
      }
    }else if(trackChanges.getVariableChanges({component: this, variable: "radius"})) {
      recalculateCircle = true;
    }

    if(!recalculateCircle) {
      return;
    }

    // delete non-essential state variables
    // so that can check which one were specified
    if(this.state.throughChild) {
      if(this.state.throughPoints.length >= 2) {
        // if radius and center were made essential
        // this means, at some earlier pass, we didn't have two through points
        // delete the essential parameter from the state variables
        // so that the radius and center values will be erased
        // and that circle won't be overprescribed
        // (or will have the two points to be the diameter)
        if(this.state.radiusMadeEssential) {
          delete this._state.radius.essential;
        }
        if(this.state.centerMadeEssential) {
          delete this._state.center.essential;
        }
      }else if(this.state.throughPoints.length === 1) {
        // if center was made essential, this means, at some earlier pass
        // we didn't have any through points
        // delete the essential parameter so that the value will be erased
        if(this.state.centerMadeEssential) {
          delete this._state.center.essential;
        }
      }
    }else if(!this._state.throughPoints.essential) {
      this.state.throughPoints = [];
    }
    if(!this.state.centerChild && !this._state.center.essential) {
      this.state.center = undefined;
    }
    if(this.state.radiusChild) {
      // reset value of radius, as it is possible radius was set to NaN
      // (for case with two points and radius, where radius is too small)
      this.state.radius = this.state.radiusChild.state.value;
    }else if(!this._state.radius.essential) {
      this.state.radius = undefined;
    }

    this.state.numericEntries = true;
    if(this.state.center !== undefined) {
      this.state.centerNumeric = [];
      for(let dim=0; dim<2; dim++) {
        let temp = this.state.center.get_component(dim).evaluate_to_constant();
        if(!Number.isFinite(temp) && !Number.isNaN(temp)) {
          this.state.numericEntries = false;
          break;
        }
        this.state.centerNumeric.push(temp);
      }
    }
    if(this.state.numericEntries && this.state.radius !== undefined) {
      this.state.radiusNumeric = this.state.radius.evaluate_to_constant();
      if(!Number.isFinite(this.state.radiusNumeric) && !Number.isNaN(this.state.radiusNumeric)) {
        this.state.numericEntries = false;
      }
    }
    if(this.state.numericEntries && this.state.throughPoints.length > 0) {
      this.state.throughPointsNumeric = [];
      for(let i=0; i<this.state.nThroughPoints; i++) {
        let pt = this.state.throughPoints[i];
        let ptNumeric = [];
        for(let dim=0; dim<2; dim++) {
          let temp = pt.get_component(dim).evaluate_to_constant();
          if(!Number.isFinite(temp) && !Number.isNaN(temp)) {
              this.state.numericEntries = false;
            break;
          }
          ptNumeric.push(temp);
        }
        if(!this.state.numericEntries) {
          break;
        }
        this.state.throughPointsNumeric.push(ptNumeric);
      }
    }

    if(this.state.center === undefined) {
      if(this.state.radius === undefined) {
        if(this.state.throughPoints.length === 0) {
          // nothing specified.  Create circle of radius 1 centered at origin
          this.state.center = me.fromAst(["tuple", 0, 0]);
          this.state.radius = me.fromAst(1);
          if(this.state.numericEntries) {
            this.state.centerNumeric = [0, 0];
            this.state.radiusNumeric = 1;
          }
          // make center and radius essential
          // so that values will be saved on updates
          this._state.center.essential = true;
          this._state.radius.essential = true;
          this.state.radiusMadeEssential = true;
          this.state.centerMadeEssential = true;
        }else {
          // only have through points
          if(this.state.nThroughPoints === 1) {
            // only one point
            // create a circle of radius 1 with top being the point
            this.state.radius = me.fromAst(1);
            // make radius essential, so value saved on updates
            this._state.radius.essential = true;
            this.state.radiusMadeEssential = true;
            if(this.state.numericEntries) {
              this.state.radiusNumeric = 1;
              this.state.centerNumeric = [
                this.state.throughPointsNumeric[0][0],
                this.state.throughPointsNumeric[0][1]-1
              ];
              this.state.center = me.fromAst(["tuple", ...this.state.centerNumeric]);
            }else {
              let temp = this.state.throughPoints[0];
              this.state.center = temp.substitute_component(1,
                temp.get_component(1).subtract(1)
              ).simplify();
            }
          }else if(this.state.nThroughPoints === 2) {
            this.findCircleThroughTwoPoints();
          }else if(this.state.nThroughPoints === 3) {
            this.findCircleThroughThreePoints();
          }else {
            throw Error("Can't create circle through more than three points");
          }
        }
      }else {
        // have a radius defined and no center
        if(this.state.throughPoints.length === 0) {
          // only radius specified.  Create centered at origin.
          this.state.center = me.fromAst(["tuple", 0, 0]);
          if(this.state.numericEntries) {
            this.state.centerNumeric = [0,0];
          }
          // mark center as essential so updates can be saved
          this._state.center.essential = true;
          this.state.centerMadeEssential = true;
        }else {
          // radius and through points
          if(this.state.nThroughPoints === 1) {
            // only one point
            // create a circle with top being the point
            if(this.state.numericEntries) {
              this.state.centerNumeric = [
                this.state.throughPointsNumeric[0][0],
                this.state.throughPointsNumeric[0][1]-this.state.radiusNumeric
              ];
              this.state.center = me.fromAst(["tuple", ...this.state.centerNumeric]);
            }else {
              let temp = this.state.throughPoints[0];
              this.state.center = temp.substitute_component(1,
                temp.get_component(1).subtract(this.state.radius)
              ).simplify();
            }
          }else if(this.state.nThroughPoints === 2) {
            this.findCircleThroughTwoPointsRadius()
          }else {
            throw Error("Can't create circle through more than two points with given radius");
          }
        }
      }
    }else {
      // center was specified
      if(this.state.radius === undefined) {
        if(this.state.throughPoints.length === 0) {
          // just center specified, 
          this.state.radius = me.fromAst(1);
          if(this.state.numericEntries) {
            this.state.radiusNumeric = 1;
          }
          // make radius essential so updates can be saved
          this._state.radius.essential = true;
          this.state.radiusMadeEssential = true;
        }else {
          // center and through points
          if(this.state.nThroughPoints === 1) {
            // only one point.  Radius is distance to that point.
            if(this.state.numericEntries) {
              let pt = this.state.throughPointsNumeric[0];
              this.state.radiusNumeric = Math.sqrt(
                Math.pow(pt[0]-this.state.centerNumeric[0],2)
                + Math.pow(pt[1]-this.state.centerNumeric[1],2)
              );
              this.state.radius = me.fromAst(this.state.radiusNumeric);
            }else {
              let pt = this.state.throughPoints[0];
              let ptx = pt.get_component(0);
              let pty = pt.get_component(1);
              let ctx = this.state.center.get_component(0);
              let cty = this.state.center.get_component(1);
  
              this.state.radius = ptx.subtract(ctx).pow(2)
                .add(pty.subtract(cty).pow(2))
                .pow(0.5).simplify();
            }
          }else {
            throw Error("Can't create circle with center through more than one point");
          }
        }
      }else {
        // center and radius specified
        if(this.state.throughPoints.length !== 0) {
          throw Error("Can't create circle with radius, center, and through points");
        }
      }
    }

    // if have through points, numeric entries and positive radius
    // calculate angles
    if(this.state.numericEntries && this.state.throughPoints.length > 0
      && this.state.radiusNumeric > 0 && Number.isFinite(this.state.centerNumeric[0])
      && Number.isFinite(this.state.centerNumeric[1])) {
      let throughAngles = [];
      let finiteThroughAngles = true;
      for(let i=0; i<this.state.nThroughPoints; i++) {
        let pt = this.state.throughPointsNumeric[i];
        if(!Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) {
          finiteThroughAngles = false;
          break;
        }
        throughAngles.push(
          Math.atan2(pt[1]-this.state.centerNumeric[1], pt[0]-this.state.centerNumeric[0])
        );
      }
      if(finiteThroughAngles) {
        this.state.throughAngles = throughAngles;
      }
    }
  }

  findCircleThroughTwoPoints() {
    // just two points
    // find center and radius of circle with the two points being across diameter
    if(this.state.numericEntries) {
      this.findCircleThroughTwoPointsNumeric();
    }else {
      console.warn("Haven't yet implemented circle through two symbolic points");
      this.state.center = me.fromAst('\uFF3F');
      this.state.radius = me.fromAst('\uFF3F');
      this.state.numericEntries = false;

      // this.state.center = this.state.throughPoints[0].add(this.state.throughPoints[1]).divide(2).simplify();
      // this.state.radius = 
      //   this.state.center.get_component(0).subtract(this.state.throughPoints[0].get_component(0))
      //   .pow(2).add(
      //     this.state.center.get_component(1).subtract(this.state.throughPoints[0].get_component(1))
      //     .pow(2)
      //   ).pow(["/", 1, 2]);
    }
  }

  findCircleThroughTwoPointsNumeric() {

    let xcenter = (this.state.throughPointsNumeric[0][0]
      +this.state.throughPointsNumeric[1][0])/2;
    let ycenter = (this.state.throughPointsNumeric[0][1]
      +this.state.throughPointsNumeric[1][1])/2;
    
    this.state.center = me.fromAst(["tuple", xcenter, ycenter]);
    this.state.centerNumeric = [xcenter, ycenter];
    this.state.radiusNumeric = Math.sqrt(Math.pow(xcenter-this.state.throughPointsNumeric[0][0],2)
      +Math.pow(ycenter-this.state.throughPointsNumeric[0][1],2));
    this.state.radius = me.fromAst(this.state.radiusNumeric);

  }

  findCircleThroughThreePoints() {
    // just three points
    // find center and radius of circle through those three points
    if(this.state.numericEntries) {
      this.findCircleThroughThreePointsNumeric();
    } else {
      throw Error("Haven't yet implemented circle through three symbolic points");
    }
    
  }

  findCircleThroughThreePointsNumeric() {

    let x1 = this.state.throughPointsNumeric[0][0];
    let x2 = this.state.throughPointsNumeric[1][0];
    let x3 = this.state.throughPointsNumeric[2][0];
    let y1 = this.state.throughPointsNumeric[0][1];
    let y2 = this.state.throughPointsNumeric[1][1];
    let y3 = this.state.throughPointsNumeric[2][1];

    let mag1 = x1*x1 + y1*y1;
    let mag2 = x2*x2 + y2*y2;
    let mag3 = x3*x3 + y3*y3;

    let A = x1*(y2-y3)-y1*(x2-x3)+x2*y3-x3*y2;
    let B = mag1*(y3-y2)+mag2*(y1-y3)+mag3*(y2-y1);
    let C = mag1*(x2-x3)+mag2*(x3-x1)+mag3*(x1-x2);
    let D = mag1*(x3*y2-x2*y3)+mag2*(x1*y3-x3*y1)+mag3*(x2*y1-x1*y2);

    if(A !== 0) {
      this.state.centerNumeric = [ -B/(2*A), -C/(2*A)];
      this.state.radiusNumeric = Math.sqrt((B*B+C*C-4*A*D)/(4*A*A));
    }else {
      // case where all three points are collinear

      // if all points are identical, it's a circle with radius zero
      if(x1==x2 && x1==x3 && y1==y2 && y1==y3) {
        this.state.centerNumeric = [x1, y1];
        this.state.radiusNumeric = 0;
      }else {
        // collinear non-identical points, can't make a circle
        this.state.centerNumeric = [NaN, NaN];
        this.state.radiusNumeric = NaN;
      }
    }
    this.state.center = me.fromAst(["tuple",...this.state.centerNumeric]);
    this.state.radius = me.fromAst(this.state.radiusNumeric);

  }

  findCircleThroughTwoPointsRadius() {
    // just two points and a radius
    // find center of circle
    if(this.state.numericEntries) {
      this.findCircleThroughTwoPointsRadiusNumeric();
    }else {
      throw Error("Haven't yet implemented circle through two symbolic points with prescribed radius");
    }
  }

  findCircleThroughTwoPointsRadiusNumeric() {

    let r = this.state.radiusNumeric;

    let x1 = this.state.throughPointsNumeric[0][0];
    let x2 = this.state.throughPointsNumeric[1][0];
    let y1 = this.state.throughPointsNumeric[0][1];
    let y2 = this.state.throughPointsNumeric[1][1];

    let dist2 = Math.pow(x1-x2,2) + Math.pow(y1-y2,2);
    let r2 = r*r;

    if(r < 0 || 4*r2 < dist2) {
      console.log("Can't find circle through given radius and two points");
      this.state.center = me.fromAst(["tuple", NaN, NaN]);
      this.state.centerNumeric = [NaN, NaN];
      this.state.radius = me.fromAst(NaN);
      this.state.radiusNumeric = NaN;
      return true;
    }

    if(r === 0 && dist2===0) {
      this.state.centerNumeric = [x1, y1];
      this.state.center = me.fromAst(["tuple", x1, y1]);
      return;
    }

    let centerx = 0.5*(dist2*(x1 + x2)+(y2 - y1)*Math.sqrt((4*r2 - dist2)*dist2))
      /dist2

    let centery = 0.5*(dist2*(y1 + y2)+(x1 - x2)*Math.sqrt((4*r2 - dist2)*dist2))
      /dist2;

    this.state.center = me.fromAst(["tuple", centerx, centery]);
    this.state.centerNumeric = [centerx, centery];
  }

  moveCircle({center, radius}) {
    let variableUpdates = {}
    if(center !== undefined) {
      variableUpdates.center = {changes: me.fromAst(["tuple", ...center])};
    }
    if(radius !== undefined) {
      variableUpdates.radius = {changes: me.fromAst(radius)};
    }

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: variableUpdates,
      }]
    });

  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    const actions = {
      moveCircle: this.moveCircle,
    }
    this.renderer = new this.availableRenderers.circle2d({
      key: this.componentName,
      label: this.state.label,
      draggable: this.state.draggable,
      layer: this.state.layer,
      visible: !this.state.hide,
      center:
      [
        this.state.center.get_component(0).evaluate_to_constant(),
        this.state.center.get_component(1).evaluate_to_constant()
      ],
      radius: this.state.radius.evaluate_to_constant(),
      actions: actions,
    });
  }

  updateRenderer(){
    this.renderer.updateCircle({
      visible: !this.state.hide,
      center:
      [
        this.state.center.get_component(0).evaluate_to_constant(),
        this.state.center.get_component(1).evaluate_to_constant()
      ],
      radius: this.state.radius.evaluate_to_constant(),
    });
  }

  updateChildrenWhoRender(){
    if(this.state.throughChild !== undefined) {
      this.childrenWhoRender = [this.state.throughChild.componentName];
    }
  }

  allowDownstreamUpdates(status) {
    if(!((status.initialChange === true && this.state.draggable === true) ||
      (status.initialChange !== true && this.state.modifyIndirectly === true))) {
        return false;
    }

    // don't update if currently have numeric entries
    if(!this.state.numericEntries) {
      return false;
    }

    return true;

  }

  get variablesUpdatableDownstream() {
    return ["center", "radius"];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newCenter;
    let newRadius;

    let newCenterNumeric;
    let newRadiusNumeric;
    let newThroughPoints;

    let centerCoordinatesChanged = new Set([]);
    let radiusChanged = false;

    if("center" in stateVariablesToUpdate) {
      if(stateVariablesToUpdate.center === undefined) {
        newCenter = this.state.center;
      }else {
        newCenter = stateVariablesToUpdate.center.changes;
      }

      newCenterNumeric = [];
      newCenterNumeric.length = newCenter.tree.length-1;
      for(let i=1; i < newCenter.tree.length; i++) {
        if(newCenter.tree[i] !== undefined) {
          centerCoordinatesChanged.add(i-1);
          newCenterNumeric[i-1] = (newCenter.get_component(i-1).evaluate_to_constant());
          if(!Number.isFinite(newCenterNumeric[i-1])) {
            return false;
          }

        }
      }
    }

    if("radius" in stateVariablesToUpdate) {
      radiusChanged = true;
      newRadius = stateVariablesToUpdate.radius.changes;

      newRadiusNumeric = newRadius.evaluate_to_constant();
      if(!Number.isFinite(newRadiusNumeric)) {
        return false;
      }
      if(newRadiusNumeric < 0) {
        newRadiusNumeric = 0;
        newRadius = me.fromAst(0);
      }
    }

    // calculate new through points
    if(this.state.throughPoints.length > 0) {
      newThroughPoints = [];

      for(let i=0; i < this.state.nThroughPoints; i++) {
        let theta = this.state.throughAngles[i]
        let pt=Array(2);
        if(radiusChanged) {
          let theCenterNumeric = this.state.centerNumeric;
          for(let ind of centerCoordinatesChanged) {
            theCenterNumeric[ind] = newCenterNumeric[ind];
          }
          pt[0] = theCenterNumeric[0]+newRadiusNumeric*Math.cos(theta);
          pt[1] = theCenterNumeric[1]+newRadiusNumeric*Math.sin(theta);
        }else {
          if(centerCoordinatesChanged.has(0)) {
            pt[0] = newCenterNumeric[0]+this.state.radiusNumeric*Math.cos(theta);
          }
          if(centerCoordinatesChanged.has(1)) {
            pt[1] = newCenterNumeric[1]+this.state.radiusNumeric*Math.sin(theta);
          }
        }
        newThroughPoints.push(me.fromAst(["tuple", ...pt]));
      }

      // check if based on through child
      if(this.state.throughChild !== undefined) {
        let points = this.state.throughChild.state.points;
        for(let ind=0; ind < points.length; ind++) {
          let pointName = points[ind].componentName;
          dependenciesToUpdate[pointName] = {coords: {changes: newThroughPoints[ind]}};
        }
      }
  
    }

    if(this.state.centerChild !== undefined && newCenter !== undefined) {
      let centerName = this.state.centerChild.componentName;
      dependenciesToUpdate[centerName] = {coords: {changes: newCenter}};
    }

    if(this.state.radiusChild !== undefined && radiusChanged) {
      let radiusName = this.state.radiusChild.componentName;
      dependenciesToUpdate[radiusName] = {value: {changes: newRadius}};
    }

    let newStateVariables = {};
    if(newCenter !== undefined) {
      newStateVariables.center = {changes: newCenter};
    }
    if(radiusChanged) {
      newStateVariables.radius = {changes: newRadius};
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

  parameterizationMin = 0;
  parameterizationMax = 2*Math.PI;
  parameterizationPeriodic = true;

  parameterization(t) {
    return [
      this.state.centerNumeric[0]+this.state.radiusNumeric*Math.cos(t),
      this.state.centerNumeric[1]+this.state.radiusNumeric*Math.sin(t)
    ]
  }

  nearestPoint({x1, x2, x3}) {

    if(this.state.numericEntries !== true) {
      return {};
    }

    if(!(Number.isFinite(this.state.centerNumeric[0]) && 
      Number.isFinite(this.state.centerNumeric[1]) &&
      Number.isFinite(this.state.radiusNumeric))) {
      return {};
    }

    let theta = Math.atan2(x2-this.state.centerNumeric[1], x1-this.state.centerNumeric[0])

    let result = {
      x1: this.state.centerNumeric[0]+this.state.radiusNumeric*Math.cos(theta),
      x2: this.state.centerNumeric[1]+this.state.radiusNumeric*Math.sin(theta),
    }

    if(x3 !== undefined) {
      result.x3 = 0;
    }

    return result;

  }

}