import Curve from './Curve';
import me from 'math-expressions';

export default class Parabola extends Curve {
  static componentType = "parabola";


  static returnChildLogic(args) {
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

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.throughPoints = {
      isArray: true,
      entryPrefixes: ["throughPoint"],
      additionalStateVariablesDefined: ["nThroughPoints"],
      returnDependencies: () => ({
        throughChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneThrough",
          variableNames: ["points"]
        }
      }),
      definition: function ({ dependencyValues, changes }) {


        let throughPoints = [];

        let points = dependencyValues.throughChild[0].stateValues.points;


        // TODO: determine how to figure out which point changed
        // rather than which through changed
        if (true) {//changes.throughChild.componentIdentitiesChanged) {

          for (let point of points) {
            let pCopy = point.stateValues.coords.copy()
            throughPoints.push(pCopy);
            let throughTree = pCopy.tree
            if (!(throughTree[0] === "tuple" || throughTree[0] === "vector") ||
              throughTree.length !== 3
            ) {
              throw Error("Parabola implemented only for two-dimensional points")
            }
          }

          return {
            newValues: {
              throughPoints,
              nThroughPoints: throughPoints.length
            },
          }


        } else {

          for (let ind in changes.throughChild.valuesChanged) {
            let changed = changes.throughChild.valuesChanged[ind];
            if (changed) {
              throughPoints[ind] = points[ind].stateValues.coords.copy();
            }
          }

          return {
            newValues: { throughPoints },
            noChanges: ["nThroughPoints"]
          }

        }

      }
    }

    stateVariableDefinitions.throughPointsNumeric = {
      additionalStateVariablesDefined: ["numericEntries"],
      isArray: true,
      entryPrefixes: ["throughPointNumeric"],
      returnDependencies: () => ({
        throughPoints: {
          dependencyType: "stateVariable",
          variableName: "throughPoints"
        },
      }),
      definition: function ({ dependencyValues }) {

        let numericEntries = true;

        let throughPointsNumeric = [];
        for (let point of dependencyValues.throughPoints) {
          let pointNumeric = [];
          for (let dim = 0; dim < 2; dim++) {
            let temp = point.get_component(dim).evaluate_to_constant();
            if (!Number.isFinite(temp) && !Number.isNaN(temp)) {
              numericEntries = false;
              break;
            }
            pointNumeric.push(temp);
          }
          if (!numericEntries) {
            break;
          }
          throughPointsNumeric.push(pointNumeric);
        }

        return {
          newValues: {
            throughPointsNumeric,
            numericEntries
          }
        }

      }

    }

    stateVariableDefinitions.a = {
      additionalStateVariablesDefined: ["b", "c", "realValued"],
      returnDependencies: () => ({
        throughPointsNumeric: {
          dependencyType: "stateVariable",
          variableName: "throughPointsNumeric"
        },
        numericEntries: {
          dependencyType: "stateVariable",
          variableName: "numericEntries"
        }
      }),
      definition: function ({ dependencyValues }) {

        if (!dependencyValues.numericEntries) {
          return {
            newValues: {
              a: NaN,
              b: NaN,
              c: NaN,
              realValued: false
            }
          }
        }

        let a, b, c;
        let realValued = true;

        if (dependencyValues.throughPointsNumeric.length === 0) {
          // nothing specified.  Create parabola y=x^2

          a = 1;
          b = 0;
          c = 0;

          // TODO: allow on to translate this parabola?

        } else if (dependencyValues.throughPointsNumeric.length === 1) {
          // one point
          // create parabola with point as vertex

          let p1 = dependencyValues.throughPointsNumeric[0];
          let x1 = p1[0];
          let y1 = p1[1];

          a = 1;
          b = -2 * x1;
          c = x1 * x1 + y1;

        } else if (dependencyValues.throughPointsNumeric.length === 2) {
          // two points
          // create parabola through those points with a=1

          let p1 = dependencyValues.throughPointsNumeric[0];
          let x1 = p1[0];
          let y1 = p1[1];
          let x12 = x1 * x1;

          let p2 = dependencyValues.throughPointsNumeric[1];
          let x2 = p2[0];
          let y2 = p2[1];
          let x22 = x2 * x2;

          if (x1 === x2) {
            realValued = false;
            a = NaN;
            b = NaN;
            c = NaN;
          } else {
            a = 1;
            b = (y1 - y2 - x12 + x22) / (x1 - x2);
            c = y1 - x12 - b * x1;
          }
        } else if (dependencyValues.throughPointsNumeric.length === 3) {
          // three points

          let p1 = dependencyValues.throughPointsNumeric[0];
          let x1 = p1[0];
          let y1 = p1[1];
          let x12 = x1 * x1;

          let p2 = dependencyValues.throughPointsNumeric[1];
          let x2 = p2[0];
          let y2 = p2[1];
          let x22 = x2 * x2;

          let p3 = dependencyValues.throughPointsNumeric[2];
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

          if (det === 0) {
            realValued = false;
            a = NaN;
            b = NaN;
            c = NaN;
          } else {
            a = (z1 * v2 - z2 * v1) / det;
            b = (z2 * u1 - z1 * u2) / det;
            c = y1 - b * x1 - a * x12;
          }

        } else {
          throw Error("Haven't implemented parabola through more than 3 points")

        }
        return { newValues: { a, b, c, realValued } }
      }

    }

    stateVariableDefinitions.vertex = {
      public: true,
      componentType: "point",
      // TODO: implement stateVariableForRef?
      stateVariableForRef: "coords",
      returnDependencies: () => ({
        a: {
          dependencyType: "stateVariable",
          variableName: "a"
        },
        b: {
          dependencyType: "stateVariable",
          variableName: "b"
        },
        c: {
          dependencyType: "stateVariable",
          variableName: "c"
        },
        realValued: {
          dependencyType: "stateVariable",
          variableName: "realValued"
        }
      }),
      definition: function ({ dependencyValues }) {

        let vertex;

        if (dependencyValues.numericEntries) {
          if (dependencyValues.a !== 0) {
            let vertex_x = -dependencyValues.b / (2 * dependencyValues.a);
            let vertex_y = dependencyValues.c - dependencyValues.b ** 2 / (4 * dependencyValues.a)
            vertex = me.fromAst(["tuple", vertex_x, vertex_y])
          }

        }

        return { newValues: { vertex } }
      }
    }

    stateVariableDefinitions.equation = {
      public: true,
      componentType: "equation",
      // TODO: implement additional properties
      additionalProperties: { simplify: "numberspreserveorder", displaysmallaszero: true },

      returnDependencies: () => ({
        a: {
          dependencyType: "stateVariable",
          variableName: "a"
        },
        b: {
          dependencyType: "stateVariable",
          variableName: "b"
        },
        c: {
          dependencyType: "stateVariable",
          variableName: "c"
        },
      }),
      definition: function ({ dependencyValues }) {

        let ast = [
          '=',
          'y',
          ['+',
            ['*', dependencyValues.a, ['^', 'x', 2]],
            ['*', dependencyValues.b, 'x'],
            dependencyValues.c
          ]
        ]

        let equation = me.fromAst(ast).evaluate_numbers({ skip_ordering: true });

        return { newValues: { equation } }
      }
    }

    stateVariableDefinitions.f = {
      returnDependencies: () => ({
        a: {
          dependencyType: "stateVariable",
          variableName: "a"
        },
        b: {
          dependencyType: "stateVariable",
          variableName: "b"
        },
        c: {
          dependencyType: "stateVariable",
          variableName: "c"
        },
      }),
      definition: function ({ dependencyValues }) {
        let f = function (x) {
          return dependencyValues.a * x * x + dependencyValues.b * x + dependencyValues.c
        }

        return { newValues: { f } }

      }
    }

    stateVariableDefinitions.curveType = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { curveType: "function" } })
    }

    return stateVariableDefinitions;
  }


  // parameterizationMin = 0;
  // parameterizationMax = 1;
  // parameterizationPeriodic = true;

}