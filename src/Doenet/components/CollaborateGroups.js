import BaseComponent from './abstract/BaseComponent';
import { breakStringsAndOthersIntoComponentsByStringCommas } from './commonsugar/breakstrings';

export default class CollaborateGroups extends BaseComponent {
  static componentType = "collaborategroups";

  static stateVariableForPropertyValue = "collaborateGroups";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroPoints = childLogic.newLeaf({
      name: "atLeastZeroPoints",
      componentType: 'point',
      comparison: 'atLeast',
      number: 0
    });

    let breakIntoPointsByCommas = breakStringsAndOthersIntoComponentsByStringCommas(x => ({
      componentType: "point", children: [{
        componentType: "coords", children: x
      }]
    }));

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      affectedBySugar: ["atLeastZeroPoints"],
      replacementFunction: breakIntoPointsByCommas,
    });

    childLogic.newOperator({
      name: "pointsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, atLeastZeroPoints],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.collaborateGroups = {
      returnDependencies: () => ({
        pointChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroPoints",
          variableNames: ["xs", "coords", "nDimensions"]
        }
      }),
      definition: function ({ dependencyValues }) {

        let collaborateGroups = {};

        for (let point of dependencyValues.pointChildren) {

          if (point.stateValues.nDimensions !== 2) {
            console.warn(`invalid collaborate group: ${point.stateValues.coords.toString()}`)

          } else {
            let numberOfGroups = point.stateValues.xs[0].evaluate_to_constant();
            let group = point.stateValues.xs[1].evaluate_to_constant();

            if (!(Number.isInteger(numberOfGroups) && numberOfGroups > 0
              && Number.isInteger(group) && group > 0)
            ) {
              console.warn(`invalid collaborate group: ${point.stateValues.coords.toString()}`)
            } else {
              if (collaborateGroups[numberOfGroups] === undefined) {
                collaborateGroups[numberOfGroups] = [];
              }
              collaborateGroups[numberOfGroups].push(group);
            }

          }
        }
        return { newValues: { collaborateGroups } }

      }
    }

    return stateVariableDefinitions;

  }


}