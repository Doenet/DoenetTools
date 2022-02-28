import BlockComponent from './abstract/BlockComponent';

export default class OrbitalDiagramInput extends BlockComponent {

  static componentType = "orbitalDiagramInput";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.prefill = {
      createComponentOfType: "mathList",
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

    stateVariableDefinitions.rows = {
      defaultValue: [{ orbitalText: "", boxes: [] }],
      hasEssential: true,
      forRenderer: true,
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

          function boxFromEntry(entry) {
            if (entry === "u" || entry === "U") {
              return "U";
            } else if (entry === "d" || entry === "D") {
              return "D";
            } else if (entry === "e" || entry === "E") {
              return "";
            } else if (Array.isArray(entry) && entry[0] === "*") {
              let str = "";
              for (let fac of entry.slice(1)) {
                if (fac === "u" || fac === "U") {
                  str += "U";
                } else if (fac === "d" || fac === "D") {
                  str += "D";
                } else {
                  // if any factor is not a u or d, create empty box
                  return "";
                }
              }
              return str;
            } else {
              // create empty box
              return "";
            }
          }

          let rows = [];
          if (dependencyValues.prefill.length > 0) {
            for (let rowInd = dependencyValues.prefill.length - 1; rowInd >= 0; rowInd--) {
              let row = dependencyValues.prefill[rowInd];
              let orbitalText = "";
              if (dependencyValues.prefillLabel[rowInd]) {
                orbitalText = dependencyValues.prefillLabel[rowInd];
              }
              let boxes = [];
              if (Array.isArray(row.tree) && row.tree[0] === "tuple") {
                for (let entry of row.tree.slice(1)) {
                  boxes.push(boxFromEntry(entry));
                }
              } else {
                boxes.push(boxFromEntry(row.tree));
              }
              rows.push({ orbitalText, boxes });
            }

            return rows;

          } else {
            return [{ orbitalText: "", boxes: [] }];
          }
        }

        return {
          useEssentialOrDefaultValue: {
            rows: {
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
            setEssentialValue: "rows",
            value: desiredStateVariableValues.rows
          }]
        }
      }
    }

    stateVariableDefinitions.numRows = {
      public: true,
      componentType: "integer",
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
      componentType: "integer",
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
      componentType: "integer",
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

  async addRow() {

    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
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

  async removeRow() {

    let oldRows = await this.stateValues.rows;
    let selectedRowIndex0 = await this.stateValues.selectedRowIndex - 1;
    let newRows = oldRows;
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

  async addBox() {

    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
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

  async removeBox() {

    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
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

  async addUpArrow() {

    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
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

  async addDownArrow() {

    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
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

  async removeArrow() {

    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
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

  async updateRowText(newValue) {

    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
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

  async selectRow(index) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedRowIndex",
        value: index,
      }],
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

  async selectBox(index) {

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: index,
      }],
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
  };


}


