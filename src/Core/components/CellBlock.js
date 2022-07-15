import BaseComponent from './abstract/BaseComponent';


export default class CellBlock extends BaseComponent {
  static componentType = "cellBlock";
  static rendererType = "containerBlock";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.rowNum = {
      createComponentOfType: "text",
      createStateVariable: "rowNum",
      defaultValue: null,
      public: true,
    };
    attributes.colNum = {
      createComponentOfType: "text",
      createStateVariable: "colNum",
      defaultValue: null,
      public: true,
    };
    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "children",
      componentTypes: ["cell", "row", "column", "cellblock"]
    }]

  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.prescribedCellsRowsColumnsBlocks = {
      returnDependencies: () => ({
        cellRelatedChildren: {
          dependencyType: "child",
          childGroups: ["children"],
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
          setValue: {
            prescribedCellsRowsColumnsBlocks: dependencyValues.cellRelatedChildren
          }
        }
      }
    }

    return stateVariableDefinitions;

  }

}