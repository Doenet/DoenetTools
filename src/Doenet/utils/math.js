import me from 'math-expressions';

export function findFiniteNumericalValue(value) {
  // return undefined if value is undefined
  // returns null if value has a non-numerical value (including Infinity)
  // otherwise, returns numerical value

  if (value === undefined) {
    return undefined;
  }

  if (Number.isFinite(value)) {
    return value;
  }

  if (value.evaluate_to_constant !== undefined) {
    value = value.evaluate_to_constant();
    if (Number.isFinite(value)) {
      return value;
    }
  }

  // couldn't find numerical value
  return null;
}


export function convertValueToMathExpression(value) {
  if (value === undefined || value === null) {
    return me.fromAst('\uFF3F');  // long underscore
  } else if (value instanceof me.class) {
    return value;
  } else if (typeof value === "number" || typeof value === "string") {
    // let value be math-expression based on value
    return me.fromAst(value);
  } else {
    return me.fromAst('\uFF3F');  // long underscore
  }
}