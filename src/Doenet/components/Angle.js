import GraphicalComponent from './abstract/GraphicalComponent';
import me from 'math-expressions';

export default class Angle extends GraphicalComponent {
  static componentType = "angle";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.draggable = {default: true};
    properties.radius = {default: me.fromAst(1)};
    properties.renderAsAcuteAngle = {default: false};
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let addThrough = function({activeChildrenMatched}) {
      // add <through> around points
      let throughChildren = [];
      for(let child of activeChildrenMatched) {
        throughChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "through", children: throughChildren }],
      }
    }


    let ExactlyThreePoints = childLogic.newLeaf({
      name: "ExactlyThreePoints",
      componentType: 'point',
      number: 3,
      isSugar: true,
      replacementFunction: addThrough,
    });

    let addMath = function({activeChildrenMatched}) {
      // add <math> around math/strings
      let mathChildren = [];
      for(let child of activeChildrenMatched) {
        mathChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "math", children: mathChildren }],
      }
    }

    let AtLeastOneString = childLogic.newLeaf({
      name: "AtLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });
    
    let AtLeastZeroMath = childLogic.newLeaf({
      name: "AtLeastZeroMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0,
    });

    let StringsAndMaths = childLogic.newOperator({
      name: "StringsAndMaths",
      operator: 'and',
      propositions: [AtLeastOneString, AtLeastZeroMath],
      requireConsecutive: true,
      isSugar: true,
      replacementFunction: addMath,
    });

    let AtLeastTwoMath = childLogic.newLeaf({
      name: "AtLeastTwoMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 2,
      isSugar: true,
      replacementFunction: addMath,
    });

    let ExactlyOneMath = childLogic.newLeaf({
      name: "ExactlyOneMath",
      componentType: 'math',
      number: 1,
    });

    let NoPoints = childLogic.newLeaf({
      name: "NoPoints",
      componentType: 'point',
      number: 0
    });

    let ExactlyOneThrough = childLogic.newLeaf({
      name: "ExactlyOneThrough",
      componentType: 'through',
      number: 1
    });

    let ExactlyTwoLines = childLogic.newLeaf({
      name: "ExactlyTwoLines",
      componentType: 'line',
      number: 2,
    });

    childLogic.newOperator({
      name: "ThroughXorSugar",
      operator: 'xor',
      propositions: [ExactlyOneThrough, ExactlyThreePoints, ExactlyTwoLines, 
        StringsAndMaths, AtLeastTwoMath, ExactlyOneMath, NoPoints],
      setAsBase: true
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {
      // this.makePublicStateVariableArray({
      //   variableName: "points",
      //   componentType: "point",
      //   stateVariableForRef: "coords",
      // });

      // this.makePublicStateVariableArrayEntry({
      //   entryName: "point",
      //   arrayVariableName: "points",
      // })

      this.makePublicStateVariable({
        variableName: "angle", 
        componentType: "math"
      });

      this.makePublicStateVariable({
        variableName: "degrees", 
        componentType: "number"
      });
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.angle = true;
      this.unresolvedState.degrees = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;

    if(trackChanges.getVariableChanges({component: this, variable: "radius"})) {
      this.state.radius = this.state.radius.simplify();
    }

    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {

      let mathInds = this.childLogic.returnMatches("ExactlyOneMath");

      if(mathInds.length === 1) {
        this.state.mathChild = this.activeChildren[mathInds[0]];
      }else {
        delete this.state.mathChild;

        let throughInds = this.childLogic.returnMatches("ExactlyOneThrough");

        if(throughInds.length === 1) {
          this.state.throughChild = this.activeChildren[throughInds[0]];
        }else {
          delete this.state.throughChild;

          let lineInds = this.childLogic.returnMatches("ExactlyTwoLines");

          if(lineInds.length === 2) {
            this.state.lineChildren = lineInds.map(x=>this.activeChildren[x]);
          } else {
            delete this.state.lineChildren;

            if(this._state.points.essential !== true) {
              console.log("Must specify value of angle.");
              this.unresolvedState.angle = true;
              this.unresolvedState.degrees = true;
              return;
            }
          }
        }
      }
    }

    let recalculateAngleFromPoints = false;

    if(this.state.mathChild) {
      if(this.state.mathChild.unresolvedState.value) {
        this.unresolvedState.angle = true;
        this.unresolvedState.degrees = true;
        return;
      }
      if(childrenChanged || trackChanges.getVariableChanges({
        component: this.state.mathChild, variable: "value"
      })) {
        delete this.unresolvedState.angle;
        delete this.unresolvedState.degrees;

        this.state.angle = this.state.mathChild.state.value.simplify();
        let angleNumeric = this.state.angle.evaluate_to_constant();
  
        if(Number.isFinite(angleNumeric)) {
          // this.state.angle = angleNumeric;
          this.state.degrees = angleNumeric/Math.PI*180;
        }else {
          this.state.degrees = NaN;
        }
   
      }

      return;

    }else if(this.state.throughChild) {

      if(this.state.throughChild.unresolvedState.points) {
        this.unresolvedState.angle = true;
        this.unresolvedState.degrees = true;
        return;
      }

      let throughState = this.state.throughChild.state;

      if(throughState.points.some(x => x.unresolvedState.coords)) {
        this.unresolvedState.angle = true;
        this.unresolvedState.degrees = true;
        return;
      }


      if(childrenChanged || 
        trackChanges.getVariableChanges({component:this.state.throughChild,
          variable: "points"})) {

        recalculateAngleFromPoints = true;

        this.state.nPoints = throughState.nPoints;

        if(this.state.nPoints != 3) {
          console.warn("Angle must be determined by three points (" + this.state.throughChild.state.nPoints + " given)");
          this.unresolvedState.angle = true;
          this.unresolvedState.degrees = true;
          return;
        }

        this.state.points=[];
        for(let i=0; i < this.state.nPoints; i++) {
          this.state.points.push(throughState.points[i].state.coords.copy());
        }

      } else {
        for(let i=0; i < this.state.nPoints; i++) {
          if(trackChanges.getVariableChanges({
            component: throughState.points[i],
            variable: "coords"
          })) {
            recalculateAngleFromPoints = true;
            this.state.points[i] = throughState.points[i].state.coords.copy();
          }
        }
      }


    } else if(this.state.lineChildren) {

      if(this.state.lineChildren.some(x => x.unresolvedState.points)) {
        this.unresolvedState.angle = true;
        this.unresolvedState.degrees = true;
        return;
      }
      let line1 = this.state.lineChildren[0];
      let line2 = this.state.lineChildren[1];

      if(childrenChanged || this.state.lineChildren.some(x=> trackChanges.getVariableChanges({
        component: x, variable: "points"
      }))) {

        this.state.lineIntersection = this.calculateLineIntersection(line1,line2);

        if(this.state.lineIntersection === undefined) {
          this.state.points = [];
          for(let i=0; i<3; i++) {
            this.state.points.push(me.fromAst(["tuple",'\uFF3F','\uFF3F']));
          }
          this.state.angle = NaN;
          this.state.degrees = NaN;
          delete this.unresolvedState.angle;
          delete this.unresolvedState.degrees;
          return;
        }

        let point2 = this.state.lineIntersection;

        let a1 = line1.state.points[0].get_component(0).evaluate_to_constant();
        let a2 = line1.state.points[0].get_component(1).evaluate_to_constant();
        let b1 = line1.state.points[1].get_component(0).evaluate_to_constant();
        let b2 = line1.state.points[1].get_component(1).evaluate_to_constant();
        let point1 = me.fromAst([
          "tuple",
          point2.get_component(0).tree + b1 - a1,
          point2.get_component(1).tree + b2 - a2,
        ])

        a1 = line2.state.points[0].get_component(0).evaluate_to_constant();
        a2 = line2.state.points[0].get_component(1).evaluate_to_constant();
        b1 = line2.state.points[1].get_component(0).evaluate_to_constant();
        b2 = line2.state.points[1].get_component(1).evaluate_to_constant();
        let point3 = me.fromAst([
          "tuple",
          point2.get_component(0).tree + b1 - a1,
          point2.get_component(1).tree + b2 - a2,
        ])

        this.state.points=[point1,point2,point3];

        recalculateAngleFromPoints = true;
      }
    }

    if(recalculateAngleFromPoints) {

      delete this.unresolvedState.angle;
      delete this.unresolvedState.degrees;

      this.state.ndimensions = 1;
      let point1tree = this.state.points[0].tree;
      if(point1tree[0] === "tuple" || point1tree[0] === "vector") {
        this.state.ndimensions = point1tree.length-1;
      }
      for(let i=1; i < 3; i++) {
        let ndimb = 1;
        let pointtree = this.state.points[i].tree;
        if(pointtree[0] === "tuple" || pointtree[0] === "vector") {
          ndimb = pointtree.length-1;
        }
        if(ndimb != this.state.ndimensions) {
          console.warn("Invalid angle: points must have same number of dimensions");
          this.unresolvedState.angle = true;
          this.unresolvedState.degrees = true;
          return;

        }
      }

      let ps = [];
      let foundNull = false;
      for(let i=0; i<3; i++) {
        ps.push([
          this.state.points[i].get_component(0).evaluate_to_constant(),
          this.state.points[i].get_component(1).evaluate_to_constant(),
        ]);
        if(ps[i][0] === null || ps[i][1] === null) {
          foundNull = true;
        }
      }

      if(foundNull) {
        this.state.angle = NaN;
      }else {
        this.state.angle =
          Math.atan2(ps[2][1] - ps[1][1], ps[2][0] - ps[1][0]) -
          Math.atan2(ps[0][1] - ps[1][1], ps[0][0] - ps[1][0]);
      }

      // make angle be between 0 and 2pi
      if(this.state.angle < 0) {
        this.state.angle += 2*Math.PI;
      }

      this.state.degrees = this.state.angle/Math.PI*180;

    }

  }

  calculateLineIntersection(line1,line2) {

    if(line1.state.ndimensions !== 2 || line2.state.ndimensions !== 2) {
      console.log("Calculating angle between two lines implemented only in 2D");
      return;
    }

    // only implement for constant coefficients
    let a1 = line1.state.coeffvar1.evaluate_to_constant();
    let b1 = line1.state.coeffvar2.evaluate_to_constant();
    let c1 = line1.state.coeff0.evaluate_to_constant();
    let a2 = line2.state.coeffvar1.evaluate_to_constant();
    let b2 = line2.state.coeffvar2.evaluate_to_constant();
    let c2 = line2.state.coeff0.evaluate_to_constant();

    if(!(Number.isFinite(a1) && Number.isFinite(b1) && Number.isFinite(c1) &&
      Number.isFinite(a2) && Number.isFinite(b2) && Number.isFinite(c2))) {
      console.log("Calculating angle between two lines implemented only for constant coefficients");
      return;
    }

    let d = a1*b2-a2*b1;

    if(Math.abs(d) < 1E-14) {
      if(Math.abs(c2*a1 -c1*a2) > 1E-14) {
        console.log("Cannot calculate angle between two parallel lines")
        return;
      }else if((a1 === 0 && b1 === 0 && c1 ===0) || (a2 === 0 && b2 === 0 && c2 ===0)) {
        // at least one line not defined
        return;
      }else {
        // identical lines, return any point on the line
        if(b1 !== 0) {
          return me.fromAst(["tuple", 0, -c1/b1]);
        }else {
          return me.fromAst(["tuple", -c1/a1, 0]);
        }
      }
    }

    // two intersecting lines, return point
    let x = (c2*b1-c1*b2)/d;
    let y = (c1*a2-c2*a1)/d;
    return me.fromAst(["tuple", x, y]);
  }


  adapters = ["angle"];

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    if(this.state.ndimensions === 2) {

      this.renderer = new this.availableRenderers.angle2d({
        key: this.componentName,
        label: this.state.label,
        draggable: this.state.draggable,
        layer: this.state.layer,
        renderAsAcuteAngle: this.state.renderAsAcuteAngle,
        angle: this.state.angle,
        visible: !this.state.hide,
        point1coords:
        [
          this.state.points[0].get_component(0).evaluate_to_constant(),
          this.state.points[0].get_component(1).evaluate_to_constant()
        ],
        point2coords:
        [
          this.state.points[1].get_component(0).evaluate_to_constant(),
          this.state.points[1].get_component(1).evaluate_to_constant()
        ],
        point3coords:
        [
          this.state.points[2].get_component(0).evaluate_to_constant(),
          this.state.points[2].get_component(1).evaluate_to_constant()
        ],
        radius: this.state.radius.evaluate_to_constant(),
      });
    }
  }

  updateRenderer(){
    this.renderer.updateAngle({
      angle: this.state.angle,
      visible: !this.state.hide,
      point1coords:
      [
        this.state.points[0].get_component(0).evaluate_to_constant(),
        this.state.points[0].get_component(1).evaluate_to_constant()
      ],
      point2coords:
      [
        this.state.points[1].get_component(0).evaluate_to_constant(),
        this.state.points[1].get_component(1).evaluate_to_constant()
      ],
      point3coords:
      [
        this.state.points[2].get_component(0).evaluate_to_constant(),
        this.state.points[2].get_component(1).evaluate_to_constant()
      ],
      radius: this.state.radius.evaluate_to_constant(),
    });
  }

  updateChildrenWhoRender(){
    if(this.state.throughChild !== undefined)
    this.childrenWhoRender = [this.state.throughChild.componentName];
  }

  allowDownstreamUpdates() {
    return false;
  }

}