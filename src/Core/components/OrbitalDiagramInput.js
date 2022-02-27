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

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "rows",
        value: newRows,
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

    return await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "rows",
        value: newRows,
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
    selectRow: this.selectRow.bind(this),
    selectBox: this.selectBox.bind(this),

  };


}





// import BlockComponent from './abstract/BlockComponent';
// import subsets, { buildSubsetFromMathExpression } from '../utils/subset-of-reals';
// import { renameStateVariable } from '../utils/stateVariables';
// import me from 'math-expressions';
// export default class OrbitalDiagramInput extends BlockComponent {

//   static componentType = "orbitalDiagramInput";
//   static rendererType = "orbitalDiagramInput";

//   // // used when creating new component via adapter or copy prop
//   // static primaryStateVariableForDefinition = "subsetValue";

//   static createAttributesObject(args) {
//     let attributes = super.createAttributesObject(args);
//     // attributes.createIntervals.defaultValue = true;

//     // attributes.variable = {
//     //   createComponentOfType: "variable",
//     //   createStateVariable: "variable",
//     //   defaultValue: me.fromAst("x"),
//     // }

//     // attributes.displayMode = {
//     //   createComponentOfType: "text",
//     //   createStateVariable: "displayMode",
//     //   defaultValue: "intervals",
//     //   public: true,
//     //   toLowerCase: true,
//     //   validValues: ["intervals", "inequalities"]
//     // };


//     return attributes;
//   }


//   static returnStateVariableDefinitions() {

//     let stateVariableDefinitions = super.returnStateVariableDefinitions();


//     // rename unnormalizedValue to unnormalizedValuePreliminary
//     // renameStateVariable({
//     //   stateVariableDefinitions,
//     //   oldName: "unnormalizedValue",
//     //   newName: "unnormalizedValuePreliminary"
//     // });

//     // stateVariableDefinitions.value.componentType = "math";

//     // stateVariableDefinitions.haveSingleSubsetChild = {
//     //   returnDependencies: () => ({
//     //     mathChildren: {
//     //       dependencyType: "child",
//     //       childGroups: ["maths"]
//     //     }
//     //   }),
//     //   definition({ dependencyValues, componentInfoObjects }) {

//     //     let haveSingleSubsetChild = 
//     //     dependencyValues.mathChildren.length === 1 &&
//     //     dependencyValues.mathChildren.filter(child =>
//     //       componentInfoObjects.isInheritedComponentType({
//     //         inheritedComponentType: child.componentType,
//     //         baseComponentType: "subsetOfReals"
//     //       })
//     //     ).length === 1;

//     //     return { setValue: { haveSingleSubsetChild } }
//     //   }
//     // }

//     // stateVariableDefinitions.subsetValue = {
//     //   stateVariablesDeterminingDependencies: ["haveSingleSubsetChild"],
//     //   returnDependencies({ stateValues }) {
//     //     let dependencies = {
//     //       haveSingleSubsetChild: {
//     //         dependencyType: "stateVariable",
//     //         variableName: "haveSingleSubsetChild"
//     //       },
//     //     }

//     //     if (stateValues.haveSingleSubsetChild) {
//     //       dependencies.subsetChild = {
//     //         dependencyType: "child",
//     //         childGroups: ["maths"],
//     //         variableNames: ["subsetValue"]
//     //       }
//     //     } else {
//     //       dependencies.unnormalizedValuePreliminary = {
//     //         dependencyType: "stateVariable",
//     //         variableName: "unnormalizedValuePreliminary"
//     //       };
//     //       dependencies.variable = {
//     //         dependencyType: "stateVariable",
//     //         variableName: "variable"
//     //       };
//     //     }
//     //     return dependencies;
//     //   },
//     //   definition({ dependencyValues }) {

//     //     let subsetValue;

//     //     if (dependencyValues.haveSingleSubsetChild) {
//     //       subsetValue = dependencyValues.subsetChild[0].stateValues.subsetValue;
//     //     } else {
//     //       subsetValue = buildSubsetFromMathExpression(
//     //         dependencyValues.unnormalizedValuePreliminary,
//     //         dependencyValues.variable
//     //       )
//     //     }

//     //     return { setValue: { subsetValue } }
//     //   },
//     //   async inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {

//     //     if (dependencyValues.haveSingleSubsetChild) {
//     //       return {
//     //         success: true,
//     //         instructions: [{
//     //           setDependency: "subsetChild",
//     //           desiredValue: desiredStateVariableValues.subsetValue,
//     //           childIndex: 0,
//     //           variableIndex: 0
//     //         }]
//     //       }
//     //     } else {

//     //       let mathExpression = mathExpressionFromSubsetValue({
//     //         subsetValue: desiredStateVariableValues.subsetValue,
//     //         variable: dependencyValues.variable,
//     //         displayMode: await stateValues.displayMode
//     //       })

//     //       return {
//     //         success: true,
//     //         instructions: [{
//     //           setDependency: "unnormalizedValuePreliminary",
//     //           desiredValue: mathExpression
//     //         }]
//     //       }
//     //     }
//     //   }
//     // }

//     // stateVariableDefinitions.unnormalizedValue = {
//     //   returnDependencies: () => ({
//     //     subsetValue: {
//     //       dependencyType: "stateVariable",
//     //       variableName: "subsetValue"
//     //     },
//     //     displayMode: {
//     //       dependencyType: "stateVariable",
//     //       variableName: "displayMode"
//     //     },
//     //     variable: {
//     //       dependencyType: "stateVariable",
//     //       variableName: "variable"
//     //     },
//     //   }),
//     //   definition({ dependencyValues }) {

//     //     let unnormalizedValue = mathExpressionFromSubsetValue(dependencyValues);

//     //     return { setValue: { unnormalizedValue } }


//     //   },
//     //   inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
//     //     let subsetValue = buildSubsetFromMathExpression(
//     //       desiredStateVariableValues.unnormalizedValue,
//     //       dependencyValues.variable
//     //     )

//     //     return {
//     //       success: true,
//     //       instructions: [{
//     //         setDependency: "subsetValue",
//     //         desiredValue: subsetValue
//     //       }]
//     //     }

//     //   }
//     // }

//     return stateVariableDefinitions;

//   }

// }

// // function mathExpressionFromSubsetValue({
// //   subsetValue, variable, displayMode = "intervals"
// // }) {

// //   function subsetToMath(subset) {

// //     if (subset === null) {
// //       return '\uff3f';
// //     }

// //     if (displayMode === "intervals") {
// //       if (subset.closedInterval) {
// //         return ["interval", ["tuple", subset.left, subset.right], ["tuple", true, true]];
// //       } else if (subset.openClosedInterval) {
// //         return ["interval", ["tuple", subset.left, subset.right], ["tuple", false, true]];
// //       } else if (subset.closedOpenInterval) {
// //         return ["interval", ["tuple", subset.left, subset.right], ["tuple", true, false]];
// //       } else {
// //         return subset.toMathExpression().tree;
// //       }
// //     } else {
// //       if (subset.closedInterval) {
// //         return ["lts", ["tuple", subset.left, variable, subset.right], ["tuple", false, false]];
// //       } else if (subset.openClosedInterval) {
// //         if (subset.left === -Infinity) {
// //           return ["le", variable, subset.right];
// //         } else {
// //           return ["lts", ["tuple", subset.left, variable, subset.right], ["tuple", true, false]];
// //         }
// //       } else if (subset.closedOpenInterval) {
// //         if (subset.right === Infinity) {
// //           return ["ge", variable, subset.left];
// //         } else {
// //           return ["lts", ["tuple", subset.left, variable, subset.right], ["tuple", false, true]];
// //         }
// //       } else if (subset instanceof subsets.OpenInterval) {
// //         if (subset.left === -Infinity) {
// //           return ["<", variable, subset.right];
// //         } else if (subset.right === Infinity) {
// //           return [">", variable, subset.left];
// //         } else {
// //           return ["lts", ["tuple", subset.left, variable, subset.right], ["tuple", true, true]];
// //         }
// //       } else if (subset instanceof subsets.Singleton) {
// //         return ['=', variable, subset.element];
// //       } else if (subset.isEmpty()) {
// //         return ['in', variable, '∅'];
// //       } else if (subset instanceof subsets.RealLine) {
// //         return ['in', variable, 'R'];
// //       } else {
// //         return null;
// //       }
// //     }
// //   }


// //   let expression;

// //   // merge any singletons to create closed intervals
// //   if (subsetValue instanceof subsets.Union) {
// //     let singletons = subsetValue.subsets
// //       .filter(x => x instanceof subsets.Singleton);

// //     let intervals = subsetValue.subsets
// //       .filter(x => x instanceof subsets.OpenInterval);

// //     for (let ind1 = 0; ind1 < singletons.length; ind1++) {

// //       let x = singletons[ind1].element;

// //       for (let ind2 = 0; ind2 < intervals.length; ind2++) {
// //         let interval = intervals[ind2];

// //         if (x === interval.left) {
// //           if (interval.openClosedInterval) {
// //             interval.closedInterval = true;
// //             delete interval.openClosedInterval;
// //           } else {
// //             interval = {
// //               left: interval.left,
// //               right: interval.right,
// //               closedOpenInterval: true
// //             };
// //             intervals.splice(ind2, 1, interval);
// //           }
// //           singletons.splice(ind1, 1);
// //           ind1--;
// //           // break;
// //         } else if (x === interval.right) {
// //           if (interval.closedOpenInterval) {
// //             interval.closedInterval = true;
// //             delete interval.closedOpenInterval;
// //           } else {
// //             interval = {
// //               left: interval.left,
// //               right: interval.right,
// //               openClosedInterval: true
// //             };
// //             intervals.splice(ind2, 1, interval);
// //           }
// //           singletons.splice(ind1, 1);
// //           ind1--;
// //           // break;
// //         }
// //       }

// //     }


// //     let mathSubsets = [...intervals, ...singletons]
// //       .sort((a, b) => (a.left === undefined ? a.element : a.left) - (b.left === undefined ? b.element : b.left))
// //       .map(x => subsetToMath(x));

// //     if (mathSubsets.length > 1) {
// //       if (displayMode === "intervals") {
// //         expression = me.fromAst(["union", ...mathSubsets]);
// //       } else {
// //         expression = me.fromAst(["or", ...mathSubsets]);
// //       }
// //     } else {
// //       expression = me.fromAst(mathSubsets[0]);
// //     }

// //   } else {
// //     expression = me.fromAst(subsetToMath(subsetValue));
// //   }

// //   return expression;
// // }
