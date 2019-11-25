
export default function createStateProxyHandler(component, currentTracker) {

  // TODO: on delete, also log change

  return {
    component: component,
    currentTracker: currentTracker,
    get: function(obj, prop) {
      let result = obj[prop];
      if(result !== undefined) {
        if(result.isArray && (result.public || result.trackChanges)) {
          result = new Proxy(result.value, createArrayProxyHandler({
            component: this.component,
            currentTracker: this.currentTracker,
            variable: prop,
            nDimensions: result.nDimensions
          }));
        }else {
          result = result.value;
        }
      }
      return result;
    },
    set: function(obj, prop, value) {
      let entry = obj[prop];
      if(entry === undefined) {
        entry = obj[prop] = {};
      }
      if(entry.public || entry.trackChanges) {
        this.currentTracker.trackChanges.logPotentialChange({
          component: this.component,
          variable: prop,
          oldValue: entry.value,
        })
      }
      entry.value = value;
      if(entry.isArray && entry.arrayProxyHandler) {
        entry.arrayComponents = new Proxy(entry.value, entry.arrayProxyHandler);
      }
      return true;
    }
  }
}

function createArrayProxyHandler({component, currentTracker, variable,
  nDimensions, indicesSoFar = []}) {

  return {
    component: component,
    currentTracker: currentTracker,
    variable: variable,
    nDimensions: nDimensions,
    indicesSoFar: indicesSoFar,
    get: function(obj, index) {
      let result = obj[index];
      if(result !== null && typeof result === 'object' && nDimensions > 1) {
        result = new Proxy(result, createArrayProxyHandler({
          component: this.component,
          currentTracker: this.currentTracker,
          variable: this.variable,
          nDimensions: this.nDimensions-1,
          indicesSoFar: [...this.indicesSoFar, index],
        }));
      }
      return result;
    },
    set: function(obj, index, value) {
      if(this.nDimensions === 1) {
        this.currentTracker.trackChanges.logPotentialChange({
          component: this.component,
          variable: this.variable,
          oldValue: obj[index],
          index: this.indicesSoFar.length > 0 ? [...this.indicesSoFar, index]: index,
        })
      }
      obj[index] = value;
      return true;
    }
  }
}