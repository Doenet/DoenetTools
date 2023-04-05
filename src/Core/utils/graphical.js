import me from 'math-expressions';

export function returnAnchorStateVariableDefinition() {

  return {
    anchor: {
      defaultValue: me.fromText("(0,0)").tuples_to_vectors(),
      public: true,
      forRenderer: true,
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "point"
      },
      returnDependencies: () => ({
        anchorAttr: {
          dependencyType: "attributeComponent",
          attributeName: "anchor",
          variableNames: ["coords"],
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.anchorAttr) {
          return { setValue: { anchor: dependencyValues.anchorAttr.stateValues.coords } }
        } else {
          return { useEssentialOrDefaultValue: { anchor: true } }
        }
      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues, initialChange }) {

        // if not draggable, then disallow initial change 
        if (initialChange && !await stateValues.draggable) {
          return { success: false };
        }

        if (dependencyValues.anchorAttr) {
          return {
            success: true,
            instructions: [{
              setDependency: "anchorAttr",
              desiredValue: desiredStateVariableValues.anchor,
              variableIndex: 0,
            }]
          }
        } else {
          return {
            success: true,
            instructions: [{
              setEssentialValue: "anchor",
              value: desiredStateVariableValues.anchor
            }]
          }
        }

      }
    }
  }

}
