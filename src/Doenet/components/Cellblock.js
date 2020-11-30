import BaseComponent from './abstract/BaseComponent';


export default class Cellblock extends BaseComponent {
  static componentType = "cellblock";
  static rendererType = "container";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.rowNum = { default: null };
    properties.colNum = { default: null };

    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let zeroOrMoreCells = childLogic.newLeaf({
      name: "zeroOrMoreCells",
      componentType: 'cell',
      comparison: 'atLeast',
      number: 0,
    });

    let zeroOrMoreRows = childLogic.newLeaf({
      name: "zeroOrMoreRows",
      componentType: 'row',
      comparison: 'atLeast',
      number: 0,
    });

    let zeroOrMoreColumns = childLogic.newLeaf({
      name: "zeroOrMoreColumns",
      componentType: 'column',
      comparison: 'atLeast',
      number: 0,
    });

    let zeroOrMoreCellblocks = childLogic.newLeaf({
      name: "zeroOrMoreCellblocks",
      componentType: 'cellblock',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "cellsRowsColumnsBlocks",
      operator: 'and',
      propositions: [zeroOrMoreCells, zeroOrMoreRows, zeroOrMoreColumns, zeroOrMoreCellblocks],
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.prescribedCellsRowsColumnsBlocks = {
      returnDependencies: () => ({
        cellRelatedChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "cellsRowsColumnsBlocks",
          variableNames: [
            "rowNum",
            "colNum",
            "prescribedCellsWithColNum",
            "prescribedCellsWithRowNum",
            "prescribedCellsRowsColumnsBlocks"
          ],
          variablesOptional: true,
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            prescribedCellsRowsColumnsBlocks: dependencyValues.cellRelatedChildren
          }
        }
      }
    }

    return stateVariableDefinitions;

  }

}