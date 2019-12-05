import Curve from './Curve';
import me from 'math-expressions';

export default class Parabola extends Curve {
  static componentType = "parabola";


  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: "atMostOneThrough",
      componentType: 'through',
      comparison: "atMost",
      number: 1,
      setAsBase: true,
    });


    return childLogic;
  }


  updateState(args = {}) {
    if (args.init === true) {

      this.makePublicStateVariable({
        variableName: "vertex",
        componentType: "point",
        stateVariableForRef: "coords",
      });
      this.makePublicStateVariable({
        variableName: "equation",
        componentType: "equation",
        additionalProperties: { simplify: "numberspreserveorder", displaysmallaszero: true }
      });
      this._state.throughPoints = { trackChanges: true, value: [] }

      // this.moveParabola = this.moveParabola.bind(
      //   new Proxy(this, this.readOnlyProxyHandler)
      // );
    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.vertex = true;
      this.unresolvedState.equation = true;
      return;
    }


    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      let throughInds = this.childLogic.returnMatches("atMostOneThrough");
      if (throughInds.length === 1) {
        this.state.throughChild = this.activeChildren[throughInds[0]];
      } else {
        delete this.state.throughChild;
        this.state.throughPoints = [];
        this.state.nThroughPoints = 0;
      }
    }

    if (this.state.throughChild) {
      let throughState = this.state.throughChild.state;
      if (this.state.throughChild.unresolvedState.points ||
        throughState.points.some(x => x.unresolvedState.coords)) {
        this.unresolvedState.vertex = true;
        this.unresolvedState.equation = true;
        return;
      }

      let nPoints = throughState.nPoints;

      let pointsChanged = childrenChanged ||
        trackChanges.childrenChanged(this.state.throughChild.componentName) ||
        this.state.nThroughPoints !== nPoints;

      let points = throughState.points;

      if (pointsChanged) {

        this.state.throughPoints = [];

        for (let i = 0; i < nPoints; i++) {
          this.state.throughPoints.push(points[i].state.coords.copy());
          let throughTree = this.state.throughPoints[i].tree
          if (!(throughTree[0] === "tuple" || throughTree[0] === "vector" ||
            throughTree.length !== 3)) {
            throw Error("Parabola implemented only for two-dimensional points")
          }
        }
        this.state.nThroughPoints = nPoints;

      } else {
        for (let i = 0; i < nPoints; i++) {
          if (trackChanges.getVariableChanges({
            component: points[i],
            variable: "coords"
          })) {
            this.state.throughPoints[i] = points[i].state.coords.copy();
          }
        }
      }
    }

    this.state.numericEntries = true;

    this.state.throughPointsNumeric = [];
    if (this.state.throughPoints.length > 0) {
      for (let i = 0; i < this.state.nThroughPoints; i++) {
        let pt = this.state.throughPoints[i];
        let ptNumeric = [];
        for (let dim = 0; dim < 2; dim++) {
          let temp = pt.get_component(dim).evaluate_to_constant();
          if (!Number.isFinite(temp) && !Number.isNaN(temp)) {
            this.state.numericEntries = false;
            break;
          }
          ptNumeric.push(temp);
        }
        if (!this.state.numericEntries) {
          break;
        }
        this.state.throughPointsNumeric.push(ptNumeric);
      }
    }

    if (this.state.numericEntries) {

      if (this.state.throughPointsNumeric.length === 0) {
        // nothing specified.  Create parabola y=x^2

        this.state.a = 1;
        this.state.b = 0;
        this.state.c = 0;

        // TODO: allow on to translate this parabola?

      } else if (this.state.throughPointsNumeric.length === 1) {
        // one point
        // create parabola with point as vertex

        let p1 = this.state.throughPointsNumeric[0];
        let x1 = p1[0];
        let y1 = p1[1];

        this.state.a = 1;
        this.state.b = -2 * x1;
        this.state.c = x1 * x1 + y1;

      } else if (this.state.throughPointsNumeric.length === 2) {
        // two points
        // create parabola through those points with a=1

        let p1 = this.state.throughPointsNumeric[0];
        let x1 = p1[0];
        let y1 = p1[1];
        let x12 = x1 * x1;

        let p2 = this.state.throughPointsNumeric[1];
        let x2 = p2[0];
        let y2 = p2[1];
        let x22 = x2 * x2;

        if(x1 === x2) {
          this.state.numericEntries = false;
          this.state.a = NaN;
          this.state.b = NaN;
          this.state.c = NaN;
        } else {
          this.state.a = 1;
          this.state.b = (y1 - y2 - x12 + x22) / (x1 - x2);
          this.state.c = y1 - x12 - this.state.b * x1;
        }
      } else if (this.state.throughPointsNumeric.length === 3) {
        // three points

        let p1 = this.state.throughPointsNumeric[0];
        let x1 = p1[0];
        let y1 = p1[1];
        let x12 = x1 * x1;

        let p2 = this.state.throughPointsNumeric[1];
        let x2 = p2[0];
        let y2 = p2[1];
        let x22 = x2 * x2;

        let p3 = this.state.throughPointsNumeric[2];
        let x3 = p3[0];
        let y3 = p3[1];
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        if(det === 0) {
          this.state.numericEntries = false;
          this.state.a = NaN;
          this.state.b = NaN;
          this.state.c = NaN;
        } else {
          this.state.a = (z1 * v2 - z2 * v1) / det;
          this.state.b = (z2 * u1 - z1 * u2) / det;
          this.state.c = y1 - this.state.b * x1 - this.state.a * x12;
        }

      } else {
        throw Error("Haven't implemented parabola through more than 3 points")

      }
    } else {
      // non-numeric entries
      this.state.a = NaN;
      this.state.b = NaN;
      this.state.c = NaN;
    }

    this.state.f = function (x) {
      return this.state.a * x * x + this.state.b * x + this.state.c
    }.bind(this);

    this.state.curveType = "function";

    if (this.state.numericEntries) {
      if (this.state.a === 0) {
        this.state.vertex = undefined;
      } else {
        let vertex_x = -this.state.b / (2 * this.state.a);
        let vertex_y = this.state.c - this.state.b ** 2 / (4 * this.state.a)
        this.state.vertex = me.fromAst(["tuple", vertex_x, vertex_y])
      }

    } else {
      this.state.vertex = undefined;
    }

    
    delete this.unresolvedState.vertex;

    let ast = [
      '=',
      'y',
      ['+',
        ['*', this.state.a, ['^', 'x', 2]],
        ['*', this.state.b, 'x'],
        this.state.c
      ]
    ]

    this.state.equation = me.fromAst(ast).evaluate_numbers({ skip_ordering: true });

    delete this.unresolvedState.equation;

  }


  parameterizationMin = 0;
  parameterizationMax = 1;
  parameterizationPeriodic = true;

}