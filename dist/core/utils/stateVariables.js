export function renameStateVariable({ stateVariableDefinitions, oldName, newName }) {

  // first rename object in stateVariableDefinitions
  let stateVarDef = stateVariableDefinitions[newName] = stateVariableDefinitions[oldName];
  delete stateVariableDefinitions[oldName];

  // second, check if name is in additionalStateVariablesDefined
  if (stateVarDef.additionalStateVariablesDefined) {
    let ind = stateVarDef.additionalStateVariablesDefined.indexOf(oldName);
    if (ind !== -1) {
      stateVarDef.additionalStateVariablesDefined[ind] = newName;
    }
  }

  // third, wrap definition in a function that changes oldName to newName in
  // - setValue
  // - useEssentialOrDefaultValue
  // - noChanges
  // - makeEssential
  // Note: if add additional possibilities to definition result,
  // will have to add them to what is changed here

  let originalDefinition = stateVarDef.definition;

  let keysInObjects = ['setValue', 'useEssentialOrDefaultValue', 'setEssentialValue'];
  let entriesInArrays = ['noChanges']

  stateVarDef.definition = function (args) {
    let result = originalDefinition(args);

    for (let key of keysInObjects) {
      if (result[key] && oldName in result[key]) {
        result[key][newName] = result[key][oldName];
        delete result[key][oldName];
      }
    }
    for (let key of entriesInArrays) {
      if (result[key]) {
        let ind = result[key].indexOf(oldName);
        if (ind !== -1) {
          result[key][ind] = newName
        }
      }
    }

    return result;
  }

  // fourth, wrap inverse definition to change 
  // desiredStateVariableValues and setStateVarible
  // from new name to old name

  let originalInverseDefinition = stateVarDef.inverseDefinition;

  if (originalInverseDefinition) {
    stateVarDef.inverseDefinition = async function (args) {
      let desiredStateVariableValues = args.desiredStateVariableValues;
      desiredStateVariableValues[oldName] = desiredStateVariableValues[newName];
      delete desiredStateVariableValues[newName];

      let results = await originalInverseDefinition(args);

      if (results.success) {
        for (let instruction of results.instructions) {
          if (instruction.setEssentialValue === oldName) {
            instruction.setEssentialValue = newName
          }
        }
      }

      return results;

    }
  }

}

export function returnDefaultGetArrayKeysFromVarName(nDim) {
  // the default function for getArrayKeysFromVarName ignores the
  // array entry prefix, but is just based on the variable ending.
  // A component class's function could use arrayEntryPrefix

  if (nDim > 1) {
    return function ({
      arrayEntryPrefix, varEnding, arraySize, nDimensions,
    }) {
      let indices = varEnding.split('_').map(x => Number(x) - 1)
      if (indices.length === nDimensions && indices.every(
        (x, i) => Number.isInteger(x) && x >= 0
      )) {

        if (arraySize) {
          if (indices.every((x, i) => x < arraySize[i])) {
            return [String(indices)];
          } else {
            return [];
          }
        } else {
          // If not given the array size,
          // then return the array keys assuming the array is large enough.
          // Must do this as it is used to determine potential array entries.
          return [String(indices)];
        }
      } else {
        return [];
      }
    }
  } else {
    return function ({
      arrayEntryPrefix, varEnding, arraySize
    }) {
      let index = Number(varEnding) - 1;
      if (Number.isInteger(index) && index >= 0) {
        if (arraySize) {
          if (index < arraySize[0]) {
            return [String(index)];
          } else {
            return [];
          }
        } else {
          // If not given the array size,
          // then return the array keys assuming the array is large enough.
          // Must do this as it is used to determine potential array entries.
          return [String(index)];
        }
      } else {
        return [];
      }
    };
  }
}