import NumberBaseOperatorOrNumber from './abstract/NumberBaseOperatorOrNumber';
import me from 'math-expressions';

export class Mean extends NumberBaseOperatorOrNumber {
  static componentType = "mean";

  applyNumberOperator() {
    if(this.state.nMaths === 0) {
      return NaN;
    }

    let mean = 0;
    for(let child of this.state.mathChildren) {
      let numValue = child.state.value.evaluate_to_constant();
      if(numValue === null) {
        return NaN;
      }
      mean += numValue;
    }
    mean /= this.state.nMaths;
    return mean;
  }  
}


export class Variance extends NumberBaseOperatorOrNumber {
  static componentType = "variance";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.unbiased = {default: false};
    return properties;
  }

  applyNumberOperator() {
    if(this.state.nMaths === 0) {
      return NaN;
    }

    let mean=0, variance=0;
    for(let child of this.state.mathChildren) {
      let numValue = child.state.value.evaluate_to_constant();
      if(numValue === null) {
        return NaN;
      }
      mean += numValue;
      variance += numValue*numValue;
    }
    mean /= this.state.nMaths;
    variance /= this.state.nMaths;

    variance -= mean**2;

    if(this.state.unbiased) {
      variance *= this.state.nMaths / (this.state.nMaths - 1);
    }
    return variance;
  }  
}


export class StandardDeviation extends Variance {
  static componentType = "standarddeviation"

  applyNumberOperator() {
    return Math.sqrt(super.applyNumberOperator());
  }  
}


export class Count extends NumberBaseOperatorOrNumber {
  static componentType = "count";

  applyNumberOperator() {
    return this.state.nMaths;
  }  
}

export class Min extends NumberBaseOperatorOrNumber {
  static componentType = "min";

  applyNumberOperator() {
    if(this.state.nMaths === 0) {
      return NaN;
    }

    let min = Infinity;
    for(let child of this.state.mathChildren) {
      let numValue = child.state.value.evaluate_to_constant();
      if(numValue === null) {
        return NaN;
      }
      min = Math.min(min,numValue);
    }
    return min;
  }  
}


export class Max extends NumberBaseOperatorOrNumber {
  static componentType = "max";

  applyNumberOperator() {
    if(this.state.nMaths === 0) {
      return NaN;
    }

    let max = -Infinity;
    for(let child of this.state.mathChildren) {
      let numValue = child.state.value.evaluate_to_constant();
      if(numValue === null) {
        return NaN;
      }
      max = Math.max(max,numValue);
    }
    return max;
  }
}


export class Mod extends NumberBaseOperatorOrNumber {
  static componentType = "mod";

  applyNumberOperator() {
    if(this.state.nMaths !== 2) {
      return NaN;
    }

    return me.math.mod(
      this.state.mathChildren[0].state.value.evaluate_to_constant(),
      this.state.mathChildren[1].state.value.evaluate_to_constant()
    )
  }  
}