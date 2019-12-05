import BaseComponent from './abstract/BaseComponent';


export default class Cellblock extends BaseComponent {
  static componentType = "cellblock";

  static alwaysContinueUpstreamUpdates = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.rownum = {default: undefined};
    properties.colnum = {default: undefined};
    
    return properties;
  }

  static returnChildLogic (args) {
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
      propositions: [zeroOrMoreCells,zeroOrMoreRows,zeroOrMoreColumns,zeroOrMoreCellblocks],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.cellRelatedChildren = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      delete this.unresolvedState.cellRelatedChildren;

      let cellsRowsColumnsBlocks = this.childLogic.returnMatches("cellsRowsColumnsBlocks");
      this.state.cellRelatedChildren = cellsRowsColumnsBlocks.map(x => this.activeChildren[x]);

      // // also keep track of individual types of children to quickly
      // // test for changes (without having to test what type of child it is)
      // this.state.cellChildren = this.childLogic.returnMatches("zeroOrMoreCells").map(x=>this.activeChildren[x]);
      // this.state.rowChildren = this.childLogic.returnMatches("zeroOrMoreRows").map(x=>this.activeChildren[x]);
      // this.state.columnChildren = this.childLogic.returnMatches("zeroOrMoreColumns").map(x=>this.activeChildren[x]);
      // this.state.cellblockChildren = this.childLogic.returnMatches("zeroOrMoreCellblocks").map(x=>this.activeChildren[x]);
    }
  }


  checkForChangesOrUnresolved() {
    // return
    // - unresolvedLocation=true: if location of any cell is not determined
    //     so that it could end up being anywhere
    //  TODO: deal with cases where only one of rownum and colnum is unresolved
    //     either from cell itself or from rows, columns, and other cellblocks
    // else return
    // - possibleCellIdentityChange: if a cell may have changed location
    // - unresolvedCells: array of cell component names whose content is not resolved

    let possibleCellIdentityChange = false;
    let unresolvedCells = [];

    // if identity of child or location of cellblock is unresolved
    // we report that we can't determine where cells may be
    // TODO: exploit cases where know one of rownum and colnum?
    if(this.unresolvedState.cellRelatedChildren || this.unresolvedState.rownum ||
        this.unresolvedState.colnum) {
      return {unresolvedLocation: true};
    }

    let trackChanges = this.currentTracker.trackChanges;

    // if children or location has changed
    // cells may have moved around
    if(trackChanges.childrenChanged(this.componentName) ||
      trackChanges.getVariableChanges({
        component: this, variable: "rownum"
    }) ||
      trackChanges.getVariableChanges({
        component: this, variable: "colnum"
    })) {
      possibleCellIdentityChange = true;
    }

    for(let child of this.state.cellRelatedChildren) {

      if(child instanceof this.allComponentClasses.cell) {
        if(child.unresolvedState.rownum || child.unresolvedState.colnum) {
          // a particular cell has unresolved row or column
          // mark as completely unresolved location
          // TODO: keep track of cases where only one of rownum/colnum is unresolved
          return {unresolvedLocation: true};
        }else if(child.unresolvedState.text) {
          // a particular cell has unresolved contents
          unresolvedCells.push(child.componentName);
        }else if(trackChanges.getVariableChanges({
            component: child, variable: "rownum"
          }) ||
          trackChanges.getVariableChanges({
            component: child, variable: "colnum"
        })) {
          // cell could have changed columns
          possibleCellIdentityChange =  true;
        }
      }else {

        let result = child.checkForChangesOrUnresolved();

        if(result.unresolvedLocation) {
          return {unresolvedLocation: true};
        }
        if(result.possibleCellIdentityChange) {
          possibleCellIdentityChange = true;
        }

        unresolvedCells.push(...result.unresolvedCells);
        
      }

    }

    return {
      possibleCellIdentityChange: possibleCellIdentityChange,
      unresolvedCells: unresolvedCells,
    };

  }

}