export function applyConstraintFromComponentConstraints({
  variables,
  applyComponentConstraint,
  scales,
}) {
  let newVariables = {};
  let constrained = false;

  for (let varName in variables) {
    let result = applyComponentConstraint({
      variables: { [varName]: variables[varName] },
      scales,
    });
    if (result.constrained) {
      constrained = true;
      newVariables[varName] = result.variables[varName];
    }
  }
  if (constrained) {
    return {
      constrained,
      variables: newVariables,
    };
  } else {
    return {};
  }
}
