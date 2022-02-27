import BlockComponent from './abstract/BlockComponent';

export default class OrbitalDiagramInput extends BlockComponent {

  static componentType = "orbitalDiagramInput";
  
  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.rows = {
      defaultValue:[{orbitalText:"",boxes:[]}],
      hasEssential:true,
      forRenderer:true,
      returnDependencies: () => ({}),
      definition: function () {
        return { useEssentialOrDefaultValue: { rows:true } };
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

    stateVariableDefinitions.selectedRowIndex = {
      defaultValue:-1,
      hasEssential:true,
      forRenderer:true,
      returnDependencies: () => ({}),
      definition: function () {
        return { useEssentialOrDefaultValue: { selectedRowIndex:true } };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "selectedRowIndex",
            value: desiredStateVariableValues.selectedRowIndex
          }]
        }
      }
    }

    stateVariableDefinitions.selectedBoxIndex = {
      defaultValue:-1,
      hasEssential:true,
      forRenderer:true,
      returnDependencies: () => ({}),
      definition: function () {
        return { useEssentialOrDefaultValue: { selectedBoxIndex:true } };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "selectedBoxIndex",
            value: desiredStateVariableValues.selectedBoxIndex
          }]
        }
      }
    }

    

    return stateVariableDefinitions;

  }

  async addRow() {
    
    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
    if (oldRows.length < 20){ //maximum number of rows
      newRows = [{orbitalText:"",boxes:[]},...oldRows];
    }

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]

    // //If a row is selected select the top one when adding a row
    // let selectedRowIndex = await this.stateValues.selectedRowIndex;
    // if (selectedRowIndex != -1){
    //   updateInstructions.push({
    //     updateType: "updateValue",
    //     componentName: this.componentName,
    //     stateVariable: "selectedRowIndex",
    //     value: newRows.length -1,
    //   })
    // }

    //If a row was selected deselect it
    let selectedRowIndex = await this.stateValues.selectedRowIndex;
    if (selectedRowIndex != -1){
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedRowIndex",
        value: -1,
      })
    }

    //If a box was selected deselect it
    let selectedBoxIndex = await this.stateValues.selectedBoxIndex;
    if (selectedBoxIndex != -1){
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: -1,
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
          rows:newRows
        }
      }
    });


    // let numberOfRows = rows.length;
    // if (numberOfRows < 20){ //maximum number of rows
    //   if (selectedRow !== -1){
    //     let topRowIndex = rows.length;
    //     setSelectedRow(topRowIndex); //Select top row if a row was selected
    //   }
    //   setSelectedBox(-1);
    //   setRows((was)=>{
    //     return [{orbitalText:"",boxes:[]},...was]
    //   })
    // }

  }

  async removeRow() {
    
    let oldRows = await this.stateValues.rows;
    let selectedRowIndex = await this.stateValues.selectedRowIndex;
    let newRows = oldRows;
    if (oldRows.length > 1){//Don't delete the last one
      let removeRowIndex = oldRows.length - 1 - selectedRowIndex;
      if (selectedRowIndex === -1){
        removeRowIndex = 0;
      }
      newRows.splice(removeRowIndex,1)
    }

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "rows",
        value: newRows,
      },{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedRowIndex",
        value: -1,
      },{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: -1,
      }],
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows:newRows
        }
      }
    });

  }

  async addBox() {
    
    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
    let selectedRowIndex = await this.stateValues.selectedRowIndex;

    let activeRowIndex = oldRows.length - selectedRowIndex -1;
    if (selectedRowIndex === -1){
      activeRowIndex = 0;
    }

    if (newRows[activeRowIndex].boxes.length < 17){//maximum boxes in one row
      newRows[activeRowIndex].boxes.push('');
    }

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]


    if (selectedRowIndex !== -1){
    // //Add selection to added box if another box was selected
    //   let newIndex = newRows[activeRowIndex].boxes.length -1;
    //Remove box selection on adding box
      let newIndex = -1;
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
          rows:newRows
        }
      }
    });

  }

  async removeBox() {
    
    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
    let selectedRowIndex = await this.stateValues.selectedRowIndex;

    let activeRowIndex = oldRows.length - selectedRowIndex -1;
    if (selectedRowIndex === -1){
      activeRowIndex = 0;
    }
    let selectedBoxIndex = await this.stateValues.selectedBoxIndex;
    let activeBoxIndex = selectedBoxIndex; 
    if (selectedBoxIndex === -1){
      activeBoxIndex = newRows[activeRowIndex].boxes.length -1;
    }

    newRows[activeRowIndex].boxes.splice(activeBoxIndex,1);

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]

    //If selected box is removed remove selection too
    if (selectedBoxIndex !== -1){
      updateInstructions.push({
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "selectedBoxIndex",
        value: -1,
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
          rows:newRows
        }
      }
    });

     // let activeRowNumber = rows.length - selectedRow -1;
  //     if (selectedRow === -1){
  //       activeRowNumber = 0;
  //     }
      
  //     setRows((was)=>{
  //       let newObj = [...was];
  //       newObj[activeRowNumber] = {...was[activeRowNumber]}
  //       newObj[activeRowNumber]['boxes'] = [...was[activeRowNumber]['boxes']];
  //       newObj[activeRowNumber]['boxes'].splice(selectedBox, 1); //-1 removes last box
  //       return newObj;
  //     })

  }

  async addUpArrow() {
    
    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
    let selectedRowIndex = await this.stateValues.selectedRowIndex;

    let activeRowIndex = oldRows.length - selectedRowIndex -1;
    if (selectedRowIndex === -1){
      activeRowIndex = 0;
    }
    let selectedBoxIndex = await this.stateValues.selectedBoxIndex;
    let activeBoxIndex = selectedBoxIndex; 
    if (selectedBoxIndex === -1){
      activeBoxIndex = newRows[activeRowIndex].boxes.length -1;
    }

    
    if (newRows[activeRowIndex].boxes.length > 0 && //Has to have a box to put an arrow in it
      newRows[activeRowIndex].boxes[activeBoxIndex].length < 3 //Limit number of arrows
      ){
      newRows[activeRowIndex].boxes[activeBoxIndex] = newRows[activeRowIndex].boxes[activeBoxIndex] + "U";
    }
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]

    // if (selectedBoxIndex !== -1){
    //   updateInstructions.push({
    //     updateType: "updateValue",
    //     componentName: this.componentName,
    //     stateVariable: "selectedBoxIndex",
    //     value: -1,
    //   })
    // }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows:newRows
        }
      }
    });

  }

  async addDownArrow() {
    
    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
    let selectedRowIndex = await this.stateValues.selectedRowIndex;

    let activeRowIndex = oldRows.length - selectedRowIndex -1;
    if (selectedRowIndex === -1){
      activeRowIndex = 0;
    }
    let selectedBoxIndex = await this.stateValues.selectedBoxIndex;
    let activeBoxIndex = selectedBoxIndex; 
    if (selectedBoxIndex === -1){
      activeBoxIndex = newRows[activeRowIndex].boxes.length -1;
    }

    
    if (newRows[activeRowIndex].boxes.length > 0 && //Has to have a box to put an arrow in it
      newRows[activeRowIndex].boxes[activeBoxIndex].length < 3 //Limit number of arrows
      ){
      newRows[activeRowIndex].boxes[activeBoxIndex] = newRows[activeRowIndex].boxes[activeBoxIndex] + "D";
    }
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]

    // if (selectedBoxIndex !== -1){
    //   updateInstructions.push({
    //     updateType: "updateValue",
    //     componentName: this.componentName,
    //     stateVariable: "selectedBoxIndex",
    //     value: -1,
    //   })
    // }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows:newRows
        }
      }
    });

  }

  async removeArrow() {
    
    let oldRows = await this.stateValues.rows;
    let newRows = oldRows;
    let selectedRowIndex = await this.stateValues.selectedRowIndex;

    let activeRowIndex = oldRows.length - selectedRowIndex -1;
    if (selectedRowIndex === -1){
      activeRowIndex = 0;
    }
    let selectedBoxIndex = await this.stateValues.selectedBoxIndex;
    let activeBoxIndex = selectedBoxIndex; 
    if (selectedBoxIndex === -1){
      activeBoxIndex = newRows[activeRowIndex].boxes.length -1;
    }

    
    if (newRows[activeRowIndex].boxes.length > 0 && //Has to have a box to remove an arrow from it
      newRows[activeRowIndex].boxes[activeBoxIndex].length > 0 //Has to have an arrow to remove
      ){
      newRows[activeRowIndex].boxes[activeBoxIndex] = newRows[activeRowIndex].boxes[activeBoxIndex].slice(0, -1);
    }
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "rows",
      value: newRows,
    }]

    // if (selectedBoxIndex !== -1){
    //   updateInstructions.push({
    //     updateType: "updateValue",
    //     componentName: this.componentName,
    //     stateVariable: "selectedBoxIndex",
    //     value: -1,
    //   })
    // }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
      event: {
        verb: "interacted",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          rows:newRows
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
          selectedRowIndex:index
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
          selectedBoxIndex:index
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
    selectRow: this.selectRow.bind(this),
    selectBox: this.selectBox.bind(this),
  };


}


