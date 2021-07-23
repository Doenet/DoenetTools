import Polyline from './Polyline';

export default class Polygon extends Polyline {
  static componentType = "polygon";

  actions = {
    movePolygon: this.movePolygon.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

  get movePolygon() {
    return this.movePolyline;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // overwrite nearestPoint so that it includes 
    // segement between first and last vertex
    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        },
        numericalVertices: {
          dependencyType: "stateVariable",
          variableName: "numericalVertices"
        },
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        },
        graphXmin: {
          dependencyType: "stateVariable",
          variableName: "graphXmin"
        },
        graphXmax: {
          dependencyType: "stateVariable",
          variableName: "graphXmax"
        },
        graphYmin: {
          dependencyType: "stateVariable",
          variableName: "graphYmin"
        },
        graphYmax: {
          dependencyType: "stateVariable",
          variableName: "graphYmax"
        },
      }),
      definition({ dependencyValues }) {
        let nDimensions = dependencyValues.nDimensions;
        let nVertices = dependencyValues.nVertices;
        let numericalVertices = dependencyValues.numericalVertices;

        let xscale = 1, yscale = 1;
        if (dependencyValues.graphXmin !== null &&
          dependencyValues.graphXmax !== null &&
          dependencyValues.graphYmin !== null &&
          dependencyValues.graphYmax !== null
        ) {
          xscale = dependencyValues.graphXmax - dependencyValues.graphXmin;
          yscale = dependencyValues.graphYmax - dependencyValues.graphYmin;
        }


        let vals = [];
        let prPtx, prPty;
        let nxPtx = numericalVertices[nVertices - 1][0];
        let nxPty = numericalVertices[nVertices - 1][1];

        for (let i = 0; i < nVertices; i++) {
          prPtx = nxPtx;
          prPty = nxPty;

          nxPtx = numericalVertices[i][0];
          nxPty = numericalVertices[i][1];

          // only implement for constants
          if (!(Number.isFinite(prPtx) && Number.isFinite(prPty) &&
            Number.isFinite(nxPtx) && Number.isFinite(nxPty))) {
            vals.push(null);
          } else {

            let BA1 = (nxPtx - prPtx) / xscale;
            let BA2 = (nxPty - prPty) / yscale;
            let denom = (BA1 * BA1 + BA2 * BA2);

            if (denom === 0) {
              vals.push(null);
            } else {
              vals.push([BA1, BA2, denom]);
            }
          }
        }


        return {
          newValues: {
            nearestPoint: function (variables) {

              // only implemented in 2D for now
              if (nDimensions !== 2 || nVertices === 0) {
                return {};
              }

              let closestDistance2 = Infinity;
              let closestResult = {};

              let x1 = variables.x1.evaluate_to_constant();
              let x2 = variables.x2.evaluate_to_constant();

              let prevPtx, prevPty;
              let nextPtx = numericalVertices[nVertices - 1][0];
              let nextPty = numericalVertices[nVertices - 1][1];

              for (let i = 0; i < nVertices; i++) {
                prevPtx = nextPtx;
                prevPty = nextPty;

                nextPtx = numericalVertices[i][0];
                nextPty = numericalVertices[i][1];

                let val = vals[i];
                if (val === null) {
                  continue;
                }

                let [BA1, BA2, denom] = val;


                let t = ((x1 - prevPtx) / xscale * BA1 + (x2 - prevPty) / yscale * BA2) / denom;

                let result;

                if (t <= 0) {
                  result = { x1: prevPtx, x2: prevPty };
                } else if (t >= 1) {
                  result = { x1: nextPtx, x2: nextPty };
                } else {
                  result = {
                    x1: prevPtx + t * BA1 * xscale,
                    x2: prevPty + t * BA2 * yscale,
                  };
                }

                let distance2 = Math.pow((x1 - result.x1) / xscale, 2)
                  + Math.pow((x2 - result.x2) / yscale, 2);

                if (distance2 < closestDistance2) {
                  closestDistance2 = distance2;
                  closestResult = result;
                }

              }

              if (variables.x3 !== undefined && Object.keys(closestResult).length > 0) {
                closestResult.x3 = 0;
              }

              return closestResult;

            }
          }
        }
      }
    }
    return stateVariableDefinitions;
  }

}