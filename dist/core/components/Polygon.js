import Polyline from './Polyline.js';

export default class Polygon extends Polyline {
  static componentType = "polygon";

  actions = {
    movePolygon: this.movePolygon.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
    finalizePolygonPosition: this.finalizePolygonPosition.bind(
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
      }),
      definition({ dependencyValues }) {
        let nDimensions = dependencyValues.nDimensions;
        let nVertices = dependencyValues.nVertices;
        let numericalVertices = dependencyValues.numericalVertices;

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

            let BA1sub = (nxPtx - prPtx);
            let BA2sub = (nxPty - prPty);

            if (BA1sub === 0 && BA2sub === 0) {
              vals.push(null);
            } else {
              vals.push([BA1sub, BA2sub]);
            }
          }
        }


        return {
          setValue: {
            nearestPoint: function ({ variables, scales }) {

              let xscale = scales[0];
              let yscale = scales[1];

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

                let BA1 = val[0] / xscale;
                let BA2 = val[1] / yscale;
                let denom = (BA1 * BA1 + BA2 * BA2);

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

  async finalizePolygonPosition() {
    // trigger a movePolygon 
    // to send the final values with transient=false
    // so that the final position will be recorded

    return await this.actions.movePolygon({
      pointCoords: await this.stateValues.numericalVertices,
      transient: false
    });
  }


}