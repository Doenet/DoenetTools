import ComponentWithSelectableType from './ComponentWithSelectableType';

export default class ComponentListWithSelectableType extends ComponentWithSelectableType {
  static componentType = "_componentlistwithselectabletype";


  static returnSugarInstructions() {
    let sugarInstructions = [];

    // function breakIntoTypesByCommas({ matchedChildren, componentProps, parentProps }) {
    //   let stringPieces = matchedChildren[0].state.value.split(",").map(s => s.trim());

    //   let selectedType = componentProps.type;
    //   if (!selectedType) {
    //     selectedType = parentProps.type;
    //   }

    //   if (!selectedType) {
    //     if (stringPieces.every(s => /^[a-zA-Z]+$/.test(s))) {
    //       selectedType = "letters";
    //     } else if (stringPieces.every(s => Number.isFinite(Number(s)))) {
    //       selectedType = "number";
    //     } else {
    //       selectedType = "text";
    //     }
    //   }

    //   let newChildren = stringPieces.map(x => ({
    //     componentType: selectedType,
    //     children: [{
    //       componentType: "string",
    //       state: { value: x.trim() }
    //     }]
    //   }));

    //   return {
    //     success: true,
    //     newChildren: newChildren,
    //   }
    // }

    // sugarInstructions.push({
    //   childrenRegex: "s",
    //   replacementFunction: breakIntoTypesByCommas
    // })


    function breakIntoTypesByCommasAndAddType({ matchedChildren, componentProps, parentProps, componentInfoObjects }) {

      // first, break any string by commas

      matchedChildren = matchedChildren.reduce(function (a, c) {
        if (c.componentType === "string") {
          return [
            ...a,
            ...c.state.value.split(",")
              .map(s => s.trim())
              .filter(s => s)
              .map(s => ({ componentType: "string", state: { value: s } }))
          ]
        } else {
          return [...a, c]
        }
      }, []);

      console.log(matchedChildren);

      let selectedType = componentProps.type;
      if (!selectedType) {
        selectedType = parentProps.type;
      }

      if (!selectedType) {
        if (matchedChildren.every(c =>
          c.componentType === "letters" ||
          (c.componentType === "string" && /^[a-zA-Z]+$/.test(c.state.value))
        )) {
          selectedType = "letters";
        } else if (matchedChildren.every(c =>
          c.componentType === "number" ||
          (c.componentType === "string" && Number.isFinite(Number(c.state.value)))
        )) {
          selectedType = "number";
        } else if (matchedChildren.every(c =>
          c.componentType === "text" || c.componentType === "string"
        )) {
          selectedType = "text";
        } else {
          // have more than one child, but don't know what type to create
          // selectedType will be determined by first child
          return {
            success: true,
            newChildren: matchedChildren
          }
        }
      }

      // if all children already are of the correct type, don't add type
      // the children will be matched by anythingForSelectedType
      if (matchedChildren.every(x => x.componentType === selectedType)) {
        return {
          success: true,
          newChildren: matchedChildren
        }
      }

      if (!(selectedType in componentInfoObjects.standardComponentClasses)) {
        // if didn't get a valid type and component is string
        // set to selected type to text
        if (matchedChildren.length === 1 && matchedChildren[0].componentType === "string") {
          selectedType = 'text';
        } else {
          //  the first component will determine the type
          return {
            success: true,
            newChildren: matchedChildren
          }
        }
      }

      // wrap components with selectedType if they aren't that type already
      return {
        success: true,
        newChildren: matchedChildren.map(x => x.componentType === selectedType ? x : ({ componentType: selectedType, children: [x] })),
      }
    }

    sugarInstructions.push({
      replacementFunction: breakIntoTypesByCommasAndAddType
    })


    return sugarInstructions;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);
    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: 'anythingForSelectedType',
      componentType: "_base",
      excludeComponentTypes: ["_composite"],
      comparison: 'atLeast',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.value;

    stateVariableDefinitions.selectedType = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        anythingForSelectedType: {
          dependencyType: "child",
          childLogicName: "anythingForSelectedType",
        },
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.anythingForSelectedType.length === 0) {
          return {
            newValues: { selectedType: "number" } // placeholder
          };
        } else {
          return {
            newValues: { selectedType: dependencyValues.anythingForSelectedType[0].componentType }
          };
        }
      }
    }

    stateVariableDefinitions.nValues = {
      returnDependencies: () => ({
        anythingForSelectedType: {
          dependencyType: "child",
          childLogicName: "anythingForSelectedType",
        },
      }),
      definition({ dependencyValues }) {
        return { newValues: { nValues: dependencyValues.anythingForSelectedType.length } }
      }
    }

    stateVariableDefinitions.values = {
      public: true,
      isArray: true,
      entryPrefixes: ["value"],
      returnArraySizeDependencies: () => ({
        nValues: {
          dependencyType: "stateVariable",
          variableName: "nValues",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nValues];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          selectedType: {
            dependencyType: "stateVariable",
            variableName: "selectedType"
          }
        }

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            anythingForSelectedType: {
              dependencyType: "child",
              childLogicName: "anythingForSelectedType",
              variableNames: ["value"],
              childIndices: [arrayKey]
            },
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        // console.log(`array definition for value of component list with selectable type`)
        // console.log(globalDependencyValues)
        // console.log(dependencyValuesByKey);
        // console.log(arrayKeys)

        let values = {};

        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].anythingForSelectedType &&
            dependencyValuesByKey[arrayKey].anythingForSelectedType.length === 1
          ) {
            values[arrayKey] = dependencyValuesByKey[arrayKey].anythingForSelectedType[0].stateValues.value
          }
        }

        return {
          newValues: { values },
          setComponentType: { values: globalDependencyValues.selectedType },
        };
      }
    }

    stateVariableDefinitions.value = {
      isAlias: true,
      targetVariableName: "values"
    };

    return stateVariableDefinitions;
  }

}
