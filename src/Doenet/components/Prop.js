import BaseComponent from './abstract/BaseComponent';

export default class Prop extends BaseComponent {
  static componentType = "prop";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.effectiveTargetClasses = {
      returnDependencies: () => ({
        effectiveTargetClasses: {
          dependencyType: "parentStateVariable",
          variableName: "effectiveTargetClasses",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { effectiveTargetClasses: dependencyValues.effectiveTargetClasses } }
      },
    };

    stateVariableDefinitions.propVariableObjs = {
      additionalStateVariablesDefined: ["propComponentTypes"],
      returnDependencies: () => ({
        effectiveTargetClasses: {
          dependencyType: "stateVariable",
          variableName: "effectiveTargetClasses"
        },
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        if (dependencyValues.stringChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              propVariableObjs: { variablesToCheck: "propVariableObjs" }
            }
          }
        }

        // have a string.  Need to see if it is a valid public state variable of effectiveTargetClass
        // TODO: arrays and other embellishments

        // if don't have any effectiveTargetClasses, then we can't determine
        // if the propVariableObjs are valid.  So, we just set propVariableObjs to be undefined
        if (dependencyValues.effectiveTargetClasses.length === 0) {
          return { newValues: { propVariableObjs: undefined } };
        }

        let authorProp = dependencyValues.stringChild[0].stateValues.value.toLowerCase();
        let propVariableObjs = [];
        let propComponentTypes = [];

        let authorPropValid = true;

        let standardComponentClasses = componentInfoObjects.standardComponentClasses;
        let allPossibleProperties = componentInfoObjects.allPossibleProperties;

        // just pick first class
        // TODO: should we check more if there are more?
        for (let targetClass of dependencyValues.effectiveTargetClasses) {

          let publicStateVariablesInfo = targetClass.returnStateVariableInfo({ onlyPublic: true, standardComponentClasses, allPossibleProperties });
          let stateVarDescrip = publicStateVariablesInfo.stateVariableDescriptions;

          // console.log("publicStateVariablesInfo")
          // console.log(publicStateVariablesInfo)

          // need a case insensitive match to variable name
          let variableNames = Object.keys(stateVarDescrip);
          let matchedObj, componentType;
          for (let varName of variableNames) {
            if (authorProp === varName.toLowerCase()) {
              matchedObj = { varName };
              if (stateVarDescrip[varName].isArray) {
                matchedObj.isArray = true;
              }
              componentType = stateVarDescrip[varName].componentType
              break;
            }
          }

          if (matchedObj === undefined) {

            // try to match to alias
            let propToMatch = authorProp;
            for (let aliasName in publicStateVariablesInfo.aliases) {
              if (authorProp === aliasName.toLowerCase()) {
                let targetVarName = publicStateVariablesInfo.aliases[aliasName];
                let targetDescription = stateVarDescrip[targetVarName];
                if (targetDescription && targetDescription.public) {
                  componentType = targetDescription.componentType;
                  matchedObj = { varName: targetVarName };
                  if (targetDescription.isArray) {
                    matchedObj.isArray = true;
                  }
                } else {
                  propToMatch = targetVarName.toLowerCase();
                }
                break;
              }
            }

            if (matchedObj === undefined) {

              // try to match to arrayEntryPrefix
              for (let prefix in publicStateVariablesInfo.arrayEntryPrefixes) {
                if (propToMatch.substring(0, prefix.length) === prefix.toLowerCase()) {
                  let arrayVarName = publicStateVariablesInfo.arrayEntryPrefixes[prefix].arrayVariableName;
                  let varEnding = propToMatch.substring(prefix.length);
                  let varName = prefix + varEnding;
                  matchedObj = { isArrayEntry: true, arrayVarName, arrayEntryPrefix: prefix, varEnding, varName };
                  componentType = stateVarDescrip[arrayVarName].componentType;
                  break;
                }
              }
              if (matchedObj === undefined) {
                authorPropValid = false;
                console.warn(`Invalid prop: ${authorProp}`)
                break;
              }

            }


          }


          // need to keep the capitalization of the actual public state variable
          // since state variables are case sensitive even though DoenetML is not
          propVariableObjs.push(matchedObj);
          propComponentTypes.push(componentType);

        }

        // console.log("authorPropValid")
        // console.log(authorPropValid)
        // console.log(propVariableObjs)
        // console.log(propComponentTypes)

        if (authorPropValid) {
          return { newValues: { propVariableObjs, propComponentTypes } };
        } else {
          return { newValues: { propVariableObjs: undefined, propComponentTypes: undefined } };
        }

      }
    }

    return stateVariableDefinitions;
  }


  // validateProp({ component, standardComponentClasses }) {

  //   // replace refs and extacts with replacement, if have only one replacement
  //   while ((component.componentType === "ref" || component.componentType === "extract") &&
  //     component.replacements.length === 1) {
  //     component = component.replacements[0];
  //   }

  //   // special case for childnumber, as it isn't a state variable
  //   if (this.state.variableName === "childnumber") {
  //     if (component.ancestors === undefined || component.ancestors.length === 0) {
  //       return { success: false, unresolved: true };
  //     }
  //     let propData = {
  //       componentType: "number",
  //       componentName: component.componentName,
  //     }

  //     let availableClassProperties = this.allComponentClasses.number.createPropertiesObject({
  //       standardComponentClasses: standardComponentClasses
  //     });

  //     return {
  //       success: true,
  //       propData: propData,
  //       availableClassProperties: availableClassProperties,
  //     }
  //   }

  //   if (component.unresolvedState[this.state.variableName] === true) {
  //     return { success: false, unresolved: true }
  //   }

  //   let propStateVariable = component._state[this.state.variableName];

  //   let availableClassProperties = {};

  //   let numReplacements = 1;

  //   let componentType;

  //   // check if there is a valid target state variable
  //   if (propStateVariable === undefined ||
  //     propStateVariable.public !== true
  //   ) {
  //     return { success: false, error: true };
  //   }

  //   if (propStateVariable.isArray !== true) {
  //     componentType = propStateVariable.componentType;


  //   } else {

  //     let results = propStateVariable.validateParameters(this.state.otherChildren);

  //     if (results.success !== true) {
  //       return { success: false, error: true };
  //     }

  //     numReplacements = results.numReplacements;

  //     if (numReplacements === 0) {
  //       return { success: false };
  //     }

  //     if (numReplacements === 1) {
  //       componentType = results.componentType;
  //     }

  //   }

  //   // verify componentType only in case that have one replacement component
  //   if (numReplacements === 1) {
  //     // see if can set replacement component type to match
  //     let replacementClass = standardComponentClasses[componentType];
  //     if (replacementClass === undefined) {
  //       return { success: false, error: true };
  //     }
  //     // available properties are those from replacement componentType
  //     availableClassProperties = replacementClass.createPropertiesObject({
  //       standardComponentClasses: standardComponentClasses
  //     });
  //   }

  //   let propData = {
  //     stateVariable: propStateVariable,
  //     componentType: componentType,
  //     componentName: component.componentName,
  //   }

  //   return {
  //     success: true,
  //     propData: propData,
  //     availableClassProperties: availableClassProperties,
  //   }

  // }

  // static createSerializedReplacements({ component, propData, additionalProperties, additionalDepProperties, components }) {

  //   return [];

  //   // special case for childnumber, as it isn't a state variable
  //   if (component.state.variableName === "childnumber") {
  //     // find child number from parent
  //     let parent = components[components[propData.componentName].ancestors[0]];

  //     let activeIndex = parent.allChildren[propData.componentName].activeChildrenIndex;

  //     if (activeIndex === undefined) {
  //       return [];
  //     }

  //     let downDep = {
  //       dependencyType: "referenceShadow",
  //       prop: component.componentName,
  //       downstreamStateVariables: [{ childnumberOf: propData.componentName }],
  //       upstreamStateVariables: ["value"],
  //     }

  //     if (additionalDepProperties !== undefined) {
  //       Object.assign(downDep, additionalDepProperties);
  //     }

  //     return [{
  //       componentType: propData.componentType,
  //       state: {
  //         ["value"]: activeIndex + 1,
  //       },
  //       downstreamDependencies: {
  //         [parent.componentName]: downDep,
  //       },
  //     }];
  //   }


  //   let propStateVariable = propData.stateVariable;

  //   let stateVariableForRef = "value";
  //   if (propStateVariable.stateVariableForRef !== undefined) {
  //     stateVariableForRef = propStateVariable.stateVariableForRef;
  //   }

  //   let newComponents;

  //   if (propStateVariable.isArray !== true) {
  //     let downDep = {
  //       dependencyType: "referenceShadow",
  //       prop: component.componentName,
  //       downstreamStateVariables: [component.state.variableName],
  //       upstreamStateVariables: [stateVariableForRef],
  //     }

  //     if (additionalDepProperties !== undefined) {
  //       Object.assign(downDep, additionalDepProperties);
  //     }

  //     if (propStateVariable.value === undefined) {
  //       newComponents = [];
  //     } else {
  //       newComponents = [{
  //         componentType: propData.componentType,
  //         state: {
  //           [stateVariableForRef]: propStateVariable.value
  //         },
  //         downstreamDependencies: {
  //           [propData.componentName]: downDep,
  //         },
  //       }]
  //     }
  //   } else {
  //     // state variable is an array

  //     newComponents = propStateVariable.returnSerializedComponents({
  //       propChildren: component.state.otherChildren,
  //       additionalDepProperties: additionalDepProperties,
  //       propName: component.componentName,
  //     });
  //   }

  //   if (newComponents.length === 1) {
  //     if (newComponents[0].state === undefined) {
  //       newComponents[0].state = {};
  //     }

  //     // add any additional properties, as long as aren't already in newComponents[0].state
  //     for (let item in additionalProperties) {
  //       if (!(item in newComponents[0].state)) {
  //         newComponents[0].state[item] = additionalProperties[item];
  //       }
  //     }

  //     // add any additional properties from propStateVariable
  //     if (propStateVariable.additionalProperties !== undefined && !Array.isArray(propStateVariable.additionalProperties)) {
  //       Object.assign(newComponents[0].state, propStateVariable.additionalProperties)
  //     }
  //   }

  //   if (propStateVariable.version !== undefined) {
  //     // since prop state variable includes a version
  //     // add a _version state variable to the first component
  //     if (newComponents.length >= 1) {
  //       if (newComponents[0].state === undefined) {
  //         newComponents[0].state = {};
  //       }
  //       newComponents[0].state._version = propStateVariable.version;
  //     }
  //   }

  //   return newComponents;

  // }


}