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

export function returnNVariables(n, variablesSpecified) {

  // console.log(`return N variables`, n, variablesSpecified)

  if (!Number.isInteger(n) || n < 1) {
    return [];
  }

  let nVariablesSpecified = variablesSpecified.length;

  if (nVariablesSpecified === 0) {
    if (n === 1) {
      return [me.fromAst("x")];
    } else if (n === 2) {
      return [me.fromAst("x"), me.fromAst("y")];
    } else if (n === 3) {
      return [me.fromAst("x"), me.fromAst("y"), me.fromAst("z")]
    } else {
      let variables = [];
      for (let i = 1; i <= n; i++) {
        variables.push(me.fromText(`x_${i}`))
      }
      return variables;
    }
  }


  if ((new Set(variablesSpecified.map(x => x.toString()))).size
    < nVariablesSpecified) {
    console.warn('Duplicate variables specified')
  }

  if (n <= nVariablesSpecified) {
    return variablesSpecified.slice(0, n);
  }

  let variablesUsed = [...variablesSpecified.map(x => x.toString())];
  let variables = [...variablesSpecified];
  for (let i = nVariablesSpecified + 1; i <= n; i++) {
    let preferredVariables;
    if (i == 1) {
      if (n > 3) {
        preferredVariables = ["x_1"];
      } else {
        preferredVariables = ["x"];
      }
    } else if (i == 2) {
      if (n > 3) {
        preferredVariables = ["x_2", "y_2"];
      } else {
        preferredVariables = ["y", "x_2"];
      }
    } else if (i == 3) {
      if (n > 3) {
        preferredVariables = ["x_3", "y_3", "z_3"];
      } else {
        preferredVariables = ["z", "x_3", "z_3"];
      }
    } else {
      preferredVariables =
        ["x", "y", "z", "u", "v", "w", "X", "Y", "Z"].map(x => `${x}_${i}`)
    }
    let addedVariable = false;
    for (let v of preferredVariables) {
      if (!variablesUsed.includes(v)) {
        variables.push(me.fromText(v));
        variablesUsed.push(v);
        addedVariable = true;
        break;
      }
    }
    if (!addedVariable) {
      let v = preferredVariables[0]
      variables.push(me.fromText(v));
      variablesUsed.push(v);
      console.warn(`Variables added were not unique`)
    }
  }

  return variables;

}


export function mergeVectorsForInverseDefinition({ desiredVector, currentVector, workspace, workspaceKey }) {

  if (desiredVector.tree[0] === "vector" && currentVector.tree[0] === "vector") {

    let vectorAst;
    if (workspace[workspaceKey]) {
      vectorAst = workspace[workspaceKey].slice(0);
    } else {
      vectorAst = currentVector.tree.slice(0);
    }

    for (let [ind, value] of desiredVector.tree.entries()) {
      if (value !== undefined) {
        vectorAst[ind] = value;
      }
    }

    desiredVector = me.fromAst(vectorAst);
    workspace[workspaceKey] = vectorAst;

  }

  return desiredVector;
}