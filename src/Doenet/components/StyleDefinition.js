import BaseComponent from './abstract/BaseComponent';

let styleComponents = [
  "lineColor",
  "lineWidth",
  "lineStyle",
  "markerColor",
  "markerStyle",
  "markerSize",
]

export class StyleDefinition extends BaseComponent {
  static componentType = "styledefinition";

  static createPropertiesObject() {
    return {};
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneStyleNumber = childLogic.newLeaf({
      name: "exactlyOneStyleNumber",
      componentType: 'stylenumber',
      number: 1
    });

    let styleComponentLogics = [];
    for (let styleComponent of styleComponents) {
      styleComponentLogics.push(childLogic.newLeaf({
        name: `atMostOne${styleComponent}`,
        componentType: styleComponent,
        comparison: "atMost",
        number: 1
      }))
    }

    childLogic.newOperator({
      name: "styleMapping",
      operator: "and",
      propositions: [exactlyOneStyleNumber, ...styleComponentLogics],
      setAsBase: true
    })

    return childLogic

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      returnDependencies: function () {

        let dependencies = {
          styleNumberChild: {
            dependencyType: "childStateVariables",
            childLogicName: "exactlyOneStyleNumber",
            variableNames: ["value"]
          },
        };

        for (let styleComponent of styleComponents) {
          dependencies[`${styleComponent}Child`] = {
            dependencyType: "childStateVariables",
            childLogicName: `atMostOne${styleComponent}`,
            variableNames: ["value"]
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {

        let value = {
          styleNumber: dependencyValues.styleNumberChild[0].stateValues.value
        };

        for (let styleComponent of styleComponents) {
          if (dependencyValues[`${styleComponent}Child`].length === 1) {

            value[styleComponent] =
              dependencyValues[`${styleComponent}Child`][0].stateValues.value;
          }
        }

        return { newValues: { value } }
      }
    }


    return stateVariableDefinitions;

  }

}


export class StyleDefinitions extends BaseComponent {
  static componentType = "styledefinitions";

  static createPropertiesObject() {
    return {};
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroStyleDefinitions",
      componentType: 'styleDefinition',
      comparison: "atLeast",
      number: 0,
      setAsBase: true
    });

    return childLogic

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      isArray: true,
      entryPrefixes: ["styleDefinition"],
      returnDependencies: () => ({
        styleDefinitionChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroStyleDefinitions",
          variableNames: ["value"]
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          value: dependencyValues.styleDefinitionChildren
            .map(x => x.stateValues.value)
        }
      })
    }

    return stateVariableDefinitions;

  }

}
