import readOnlyProxyHandler from "./ReadOnlyProxyHandler";

export default function createStateProxyHandler() {
  return {
    get: function (obj, prop) {
      let result = obj[prop];
      if (result !== undefined) {
        if (result.isArray && (result.public || result.trackChanges)) {
          result = new Proxy(
            result.value,
            createArrayProxyHandler({
              variable: prop,
              numDimensions: result.numDimensions,
            }),
          );
        } else {
          result = result.value;
          // if (result !== null && typeof result === 'object' && result.__isReadOnlyProxy !== true) {
          //   result = new Proxy(result, readOnlyProxyHandler);
          // }
        }
      }
      return result;
    },
    set: function (obj, prop, value) {
      throw Error("Property " + prop + " is read-only");
    },
    deleteProperty: function (obj, prop) {
      throw Error("Property " + prop + " is read-only");
    },
  };
}

function createArrayProxyHandler({
  variable,
  numDimensions,
  indicesSoFar = [],
}) {
  return {
    variable: variable,
    numDimensions: numDimensions,
    indicesSoFar: indicesSoFar,
    get: function (obj, index) {
      if (index === "then" && obj instanceof Promise) {
        // If we are wrapping the array proxy around the "then" of a promise,
        // we want to swap the order of the promise and the array proxy
        // so that we have a promise of a proxy rather than vice-versa.

        // We return a function that will be used instead of the "then"
        // that first applies the array proxy
        return (f) =>
          obj.then.bind(obj)((x) =>
            f(
              x !== null && typeof x === "object"
                ? new Proxy(
                    x,
                    createArrayProxyHandler({
                      variable: this.variable,
                      numDimensions: this.numDimensions,
                      indicesSoFar: this.indicesSoFar,
                    }),
                  )
                : x,
            ),
          );
      }

      let result = obj[index];
      if (result !== null && typeof result === "object" && numDimensions > 1) {
        result = new Proxy(
          result,
          createArrayProxyHandler({
            variable: this.variable,
            numDimensions: this.numDimensions - 1,
            indicesSoFar: [...this.indicesSoFar, index],
          }),
        );
      }
      return result;
    },
    set: function (obj, prop, value) {
      throw Error("Property " + prop + " is read-only");
    },
    deleteProperty: function (obj, prop) {
      throw Error("Property " + prop + " is read-only");
    },
  };
}
