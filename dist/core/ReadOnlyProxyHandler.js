const readOnlyProxyHandler = {
  get: function (obj, prop) {
    if (prop === "__isReadOnlyProxy") {
      return true;
    }
    if (prop === "then" && obj instanceof Promise) {
      // If we are wrapping the read-only proxy around the "then" of a promise,
      // we want to swap the order of the promise and the read-only proxy
      // so that we have a promise of a proxy rather than vice-versa.

      // We return a function that will be used instead of the "then"
      // that first applies the read-only proxy
      return f => obj.then.bind(obj)(x => f(
        x !== null && typeof x === "object" ? new Proxy(x, readOnlyProxyHandler) : x
      ))
    }
    let result = obj[prop];
    if (result !== null && typeof result === 'object' && result.__isReadOnlyProxy !== true) {
      return new Proxy(result, readOnlyProxyHandler);
    }
    else {
      return result;
    }
  },
  set: function (obj, prop, value) {
    throw Error("Property " + prop + " is read-only");
  },
  deleteProperty: function (obj, prop) {
    throw Error("Property " + prop + " is read-only");
  }
}

export default readOnlyProxyHandler;