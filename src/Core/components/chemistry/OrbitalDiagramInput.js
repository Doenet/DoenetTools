import BlockComponent from '../abstract/BlockComponent';

export default class OrbitalDiagramInput extends BlockComponent {

  static componentType = "orbitalDiagramInput";

  static variableForPlainMacro = "value";
  static variableForPlainCopy = "value";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.prefill = {
      createComponentOfType: "orbitalDiagram",
      createStateVariable: "prefill",
      defaultValue: [],
    }
    attributes.prefillLabel = {
      createComponentOfType: "textList",
      createStateVariable: "prefillLabel",
      defaultValue: [],
    }
    return attributes;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      defaultValue: [{ orbitalText: "", boxes: [] }],
      hasEssential: true,
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "orbitalDiagram",
      },
      returnDependencies: () => ({
        prefill: {
          dependencyType: "stateVariable",
          variableName: "prefill"
        },
        prefillLabel: {
          dependencyType: "stateVariable",
          variableName: "prefillLabel"
        }
      }),
      definition: function ({ dependencyValues }) {

        function processedPrefill() {

          if(dependencyValues.prefill?.length > 0) {
            let value = JSON.parse(JSON.stringify(dependencyValues.prefill));
            for(let [rowInd, row] of value.entries()) {
              if (dependencyValues.prefillLabel[rowInd]) {
                row.orbitalText = dependencyValues.prefillLabel[rowInd];
              }
            }

            return value;

          } else {
            return [{ orbitalText: "", boxes: [] }];
          }
        }

        return {
          useEssentialOrDefaultValue: {
            value: {
              get defaultValue() {
                return processedPrefill();
              }
            }
          }
        };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "value",
            value: desiredStateVariableValues.value
          }]
        }
      }
    }


    stateVariableDefinitions.rows = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "orbitalDiagram",
      },
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
      }),
      definition({ dependencyValues }) {
        let rows = [...dependencyValues.value].reverse();

        return { setValue: { rows } }

      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "value",
            desiredValue: [...desiredStateVariableValues.rows].reverse()
          }]
        }
      }
    };

    stateVariableDefinitions.numRows = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        rows: {
          dependencyType: "stateVariable",
          variableName: "rows"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { numRows: dependencyValues.rows.length } };
      },
    }


    stateVariableDefinitions.selectedRowIndex = {
      defaultValue: 0,
      hasEssential: true,
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({}),
      definition: function () {
        return { useEssentialOrDefaultValue: { selectedRowIndex: true } };
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues }) {
        let numRows = await stateValues.numRows;

        let desiredRowIndex = desiredStateVariableValues.selectedRowIndex;
        if (Number.isFinite(desiredRowIndex)) {
          desiredRowIndex = Math.min(numRows, Math.max(0, Math.round(desiredRowIndex)));
        } else {
          desiredRowIndex = 0;
        }

        return {
          success: true,
          instructions: [{
            setEssentialValue: "selectedRowIndex",
            value: desiredRowIndex
          }]
        }
      }
    }

    stateVariableDefinitions.selectedBoxIndex = {
      defaultValue: 0,
      hasEssential: true,
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({}),
      definition: function () {
        return { useEssentialOrDefaultValue: { selectedBoxIndex: true } };
      },
      async inverseDefinition({ desiredStateVariableValues }) {
        let desiredBoxIndex = desiredStateVariableValues.selectedBoxIndex;
        if (Number.isFinite(desiredBoxIndex)) {
          desiredBoxIndex = Math.max(0, Math.round(desiredBoxIndex));
        } else {
          desiredBoxIndex = 0;
        }

        // TODO: do we want to keep selectedBoxIndex to only valid values for row
        // The below was an attempt, but it doesn't keep it consistent
        // if one changes the row number afterward

        // let rows = await stateValues.rows;
        // let numRows = await stateValues.numRows;

        // let selectedRowIndex0 = await stateValues.selectedRowIndex - 1;

        // let activeRowIndex0 = numRows - selectedRowIndex0 - 1;

        // let desiredBoxIndex = desiredStateVariableValues.selectedBoxIndex;


        // let nBoxesInRow = rows[activeRowIndex0]?.boxes.length;
        // if (nBoxesInRow === undefined) {
        //   desiredBoxIndex = 0;
        // } else {
        //   if (Number.isFinite(desiredBoxIndex)) {
        //     desiredBoxIndex = Math.min(nBoxesInRow, Math.max(0, Math.round(desiredBoxIndex)));
        //   } else {
        //     desiredBoxIndex = 0;
        //   }
        // }

        return {
          success: true,
          instructions: [{
            setEssentialValue: "selectedBoxIndex",
            value: desiredBoxIndex
          }]
        }
      }
    }



    return stateVariableDefinitions;

  }

  async addRow({ actionId }) {

    let oldRows = await this.stateValues.rows;
    let newRows = JSON.parse(JSON.stringify(oldRows));
    if (oldRows.length < 20) { //maximum number of rows
      newRows = [{ orbitalText: "", boxes: [] }, ...oldRows];
    }

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]



    //If a row was selected deselect it
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;
    if (selectedRowIndex0 !== -1) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedRowIndex",
        value: 0,
      })
    }

    //If a box was selected deselect it
    let selectedBoxIndex0 = await this.stateValues.selectedBoxIndex - 1;
    if (selectedBoxIndex0 !== -1) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: 0,
      })
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows: newRows
        }
      }
    });


  }

  async removeRow({ actionId }) {

    let oldRows = await this.stateValues.rows;
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;
    let newRows = JSON.parse(JSON.stringify(oldRows));
    if (oldRows.length > 1) {//Don't delete the last one
      let removeRowIndex0 = oldRows.length - 1 - selectedRowIndex0;
      if (selectedRowIndex0 === -1) {
        removeRowIndex0 = 0;
      }
      newRows.splice(removeRowIndex0, 1)
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "rows",
        value: newRows,
      }, {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedRowIndex",
        value: 0,
      }, {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: 0,
      }],
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows: newRows
        }
      }
    });

  }

  async addBox({ actionId }) {

    let oldRows = await this.stateValues.rows;
    let newRows = JSON.parse(JSON.stringify(oldRows));
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;

    let activeRowIndex0 = oldRows.length - selectedRowIndex0 - 1;
    if (selectedRowIndex0 === -1) {
      activeRowIndex0 = 0;
    }

    if (newRows[activeRowIndex0].boxes.length < 17) {//maximum boxes in one row
      newRows[activeRowIndex0].boxes.push('');
    }

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]


    if (selectedRowIndex0 !== -1) {
      // //Add selection to added box if another box was selected
      //   let newIndex = newRows[activeRowIndex].boxes.length -1;
      //Remove box selection on adding box
      let newIndex = 0;
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: newIndex,
      })
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows: newRows
        }
      }
    });

  }

  async removeBox({ actionId }) {

    let oldRows = await this.stateValues.rows;
    let newRows = JSON.parse(JSON.stringify(oldRows));
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;

    let activeRowIndex0 = oldRows.length - selectedRowIndex0 - 1;
    if (selectedRowIndex0 === -1) {
      activeRowIndex0 = 0;
    }
    let selectedBoxIndex0 = await this.stateValues.selectedBoxIndex - 1;
    let activeBoxIndex0 = selectedBoxIndex0;
    if (selectedBoxIndex0 === -1) {
      activeBoxIndex0 = newRows[activeRowIndex0].boxes.length - 1;
    }

    newRows[activeRowIndex0].boxes.splice(activeBoxIndex0, 1);

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]

    //If selected box is removed remove selection too
    if (selectedBoxIndex0 !== -1) {
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: 0,
      })
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows: newRows
        }
      }
    });



  }

  async addUpArrow({ actionId }) {

    let oldRows = await this.stateValues.rows;
    let newRows = JSON.parse(JSON.stringify(oldRows));
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;

    let activeRowIndex0 = oldRows.length - selectedRowIndex0 - 1;
    if (selectedRowIndex0 === -1) {
      activeRowIndex0 = 0;
    }
    let selectedBoxIndex0 = await this.stateValues.selectedBoxIndex - 1;
    let activeBoxIndex0 = selectedBoxIndex0;
    if (selectedBoxIndex0 === -1) {
      activeBoxIndex0 = newRows[activeRowIndex0].boxes.length - 1;
    }


    if (newRows[activeRowIndex0].boxes.length > 0 && //Has to have a box to put an arrow in it
      newRows[activeRowIndex0].boxes[activeBoxIndex0].length < 3 //Limit number of arrows
    ) {
      newRows[activeRowIndex0].boxes[activeBoxIndex0] = newRows[activeRowIndex0].boxes[activeBoxIndex0] + "U";
    }
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]


    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows: newRows
        }
      }
    });

  }

  async addDownArrow({ actionId }) {

    let oldRows = await this.stateValues.rows;
    let newRows = JSON.parse(JSON.stringify(oldRows));
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;

    let activeRowIndex0 = oldRows.length - selectedRowIndex0 - 1;
    if (selectedRowIndex0 === -1) {
      activeRowIndex0 = 0;
    }
    let selectedBoxIndex0 = await this.stateValues.selectedBoxIndex - 1;
    let activeBoxIndex0 = selectedBoxIndex0;
    if (selectedBoxIndex0 === -1) {
      activeBoxIndex0 = newRows[activeRowIndex0].boxes.length - 1;
    }


    if (newRows[activeRowIndex0].boxes.length > 0 && //Has to have a box to put an arrow in it
      newRows[activeRowIndex0].boxes[activeBoxIndex0].length < 3 //Limit number of arrows
    ) {
      newRows[activeRowIndex0].boxes[activeBoxIndex0] = newRows[activeRowIndex0].boxes[activeBoxIndex0] + "D";
    }
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows: newRows
        }
      }
    });

  }

  async removeArrow({ actionId }) {

    let oldRows = await this.stateValues.rows;
    let newRows = JSON.parse(JSON.stringify(oldRows));
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;

    let activeRowIndex0 = oldRows.length - selectedRowIndex0 - 1;
    if (selectedRowIndex0 === -1) {
      activeRowIndex0 = 0;
    }
    let selectedBoxIndex0 = await this.stateValues.selectedBoxIndex - 1;
    let activeBoxIndex0 = selectedBoxIndex0;
    if (selectedBoxIndex0 === -1) {
      activeBoxIndex0 = newRows[activeRowIndex0].boxes.length - 1;
    }


    if (newRows[activeRowIndex0].boxes.length > 0 && //Has to have a box to remove an arrow from it
      newRows[activeRowIndex0].boxes[activeBoxIndex0].length > 0 //Has to have an arrow to remove
    ) {
      newRows[activeRowIndex0].boxes[activeBoxIndex0] = newRows[activeRowIndex0].boxes[activeBoxIndex0].slice(0, -1);
    }
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]


    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows: newRows
        }
      }
    });

  }

  async updateRowText({ newValue, actionId }) {

    let oldRows = await this.stateValues.rows;
    let newRows = JSON.parse(JSON.stringify(oldRows));
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;

    let activeRowIndex0 = oldRows.length - selectedRowIndex0 - 1;
    if (selectedRowIndex0 === -1) {
      activeRowIndex0 = 0;
    }

    newRows[activeRowIndex0].orbitalText = newValue;

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]


    return await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows: newRows
        }
      }
    });

  }

  async selectRow({ index, actionId }) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedRowIndex",
        value: index,
      }],
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          selectedRowIndex: index
        }
      }
    });

  }

  async selectBox({ index, actionId }) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: index,
      }],
      actionId,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          selectedBoxIndex: index
        }
      }
    });

  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }

  actions = {
    addRow: this.addRow.bind(this),
    removeRow: this.removeRow.bind(this),
    addBox: this.addBox.bind(this),
    removeBox: this.removeBox.bind(this),
    addUpArrow: this.addUpArrow.bind(this),
    addDownArrow: this.addDownArrow.bind(this),
    removeArrow: this.removeArrow.bind(this),
    updateRowText: this.updateRowText.bind(this),
    selectRow: this.selectRow.bind(this),
    selectBox: this.selectBox.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
  };


}


