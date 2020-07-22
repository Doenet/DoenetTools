import BaseComponent from './abstract/BaseComponent';

export default class Row extends BaseComponent {
  static componentType = "row";

  static alwaysContinueUpstreamUpdates = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.rownum = {default: undefined};
    
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atLeastZeroCells",
      componentType: 'cell',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.cellChildren = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      delete this.unresolvedState.cellChildren;

      let atLeastZeroCells = this.childLogic.returnMatches("atLeastZeroCells");
      this.state.cellChildren = atLeastZeroCells.map(x=>this.activeChildren[x]);
      if(this.state.cellChildren.some(x => x.state.rownum !== undefined && x.state.rownum !== "")) {
        // for efficiency, test for extra rownum only when children change
        // (extra rownum will be ignored if added on fly in other update)
        throw Error("Cannot specify the rownum of a cell within a row.")
      }
    }
  }


  checkForChangesOrUnresolved() {
    // return
    // - unresolvedLocation=true: if location of any cell is not determined
    //     so that it could end up being anywhere
    //  TODO: if cell within row has unsolved colnum, we do know it is within
    //        this row, so we could refine our tracking of unresolved locations
    // else return
    // - possibleCellIdentityChange: if a cell may have changed location
    // - unresolvedCells: set of cell component names whose content is not resolved

    let possibleCellIdentityChange = false;
    let unresolvedCells = [];

    // if identity of cell or location of row is unresolved
    // we report that we can't determine where cells may be
    if(this.unresolvedState.cellChildren || this.unresolvedState.rownum) {
      return {unresolvedLocation: true};
    }

    let trackChanges = this.currentTracker.trackChanges;

    // if cell children or row location has changed
    // cells may have moved around
    if(trackChanges.childrenChanged(this.componentName) ||
      trackChanges.getVariableChanges({
        component: this, variable: "rownum"
    })) {
      possibleCellIdentityChange = true;
    }

    for(let child of this.state.cellChildren) {

      if(child.unresolvedState.colnum) {
        // a particular cell has unresolved column.
        // we know it is in this row, but for now, mark as completely
        // unresolved location
        // TODO: keep track that only colnum is unresolved
        return {unresolvedLocation: true};
      }else if(child.unresolvedState.text) {
        // a particular cell has unresolved contents
        unresolvedCells.push(child.componentName);
      }else if(trackChanges.getVariableChanges({
          component: child, variable: "colnum"
      })) {
        // cell could have changed columns
        possibleCellIdentityChange =  true;
      }
    }

    return {
      possibleCellIdentityChange: possibleCellIdentityChange,
      unresolvedCells: unresolvedCells,
    };

  }


}