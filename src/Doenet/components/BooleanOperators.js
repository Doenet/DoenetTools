import BooleanBaseOperator from './abstract/BooleanBaseOperator';

export class Not extends BooleanBaseOperator {
  static componentType = "not";

  applyBooleanOperator() {
    if(this.state.nBooleans !==1) {
      throw Error("Not requires exactly one boolean child");
    }
    return !this.state.booleanChildren[0].state.value;
  }
}

export class And extends BooleanBaseOperator {
  static componentType = "and";

  applyBooleanOperator() {
    return this.state.booleanChildren.every(x => x.state.value);
  }
}

export class Or extends BooleanBaseOperator {
  static componentType = "or";

  applyBooleanOperator() {
    return this.state.booleanChildren.some(x => x.state.value);
  }
}

export class Xor extends BooleanBaseOperator {
  static componentType = "xor";

  applyBooleanOperator() {
    let numberTrues = this.state.booleanChildren.reduce(
      (acc, curr) => acc + curr.state.value, 0);
    return numberTrues === 1;
  }
}