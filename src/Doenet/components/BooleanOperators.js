import BooleanBaseOperator from './abstract/BooleanBaseOperator';

export class Not extends BooleanBaseOperator {
  static componentType = "not";

  static applyBooleanOperator(values) {
    if(values.length !== 1) {
      console.warn("Not requires exactly one boolean child")
      return null;
    }
    return !values[0];
  }
}

export class And extends BooleanBaseOperator {
  static componentType = "and";

  static applyBooleanOperator(values) {
    return values.every(x => x);
  }
}

export class Or extends BooleanBaseOperator {
  static componentType = "or";

  static applyBooleanOperator(values) {
    return values.some(x => x);
  }
}

export class Xor extends BooleanBaseOperator {
  static componentType = "xor";

  static applyBooleanOperator(values) {
    let numberTrues = values.reduce(
      (acc, curr) => acc + curr, 0);
    return numberTrues === 1;
  }
}