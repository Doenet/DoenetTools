import BaseComponent from './abstract/BaseComponent';
import {breakEmbeddedStringByCommas, breakIntoVectorComponents,
  breakPiecesByEquals} from './commonsugar/breakstrings';

export class Extremum extends BaseComponent {
  static componentType = "extremum";

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let getVarName = function(piece) {
      if(piece.length > 1) {
        return;
      }
      let varName = piece[0]._string;
      if(varName !== undefined) {
        return varName.trim();
      }
    }

    let createLocationValueFromSugar = function({activeChildrenMatched}) {

      let results = breakEmbeddedStringByCommas({
        childrenList: activeChildrenMatched,
        classesToExtract: [
          this.allComponentClasses.variables,
        ],
      });

      if(results.success !== true) {
        return {success: false}
      }

      let pieces = results.pieces;
      let toDelete = results.toDelete;

      let variablesChild = results.componentsExtracted[0];

      results = breakPiecesByEquals(pieces, true);

      if(results.success !== true) {
        return {success: false}
      }

      toDelete = [...toDelete, ...results.toDelete];

      let lhsByPiece = results.lhsByPiece;
      let rhsByPiece = results.rhsByPiece;


      let initialDefaultVars = ["x","y","z"];
      let variableNames = [];
      let newChildren = [];

      let nVariablesInChild = 0;
      let nVariablesNeeded = Math.max(lhsByPiece.length,2);
      if(variablesChild !== undefined) {
        nVariablesInChild = variablesChild._component.state.ncomponents;
        newChildren.push(variablesChild);
      }
      for(let i=0; i < Math.min(nVariablesInChild, nVariablesNeeded); i++) {
        variableNames.push(variablesChild._component.state.variables[i].tree);
      }
      for(let i=nVariablesInChild; i < nVariablesNeeded; i++) {
        // if have more pieces that variables
        // make the variable be x, y, z, x4, x5, x6...
        if(i < 3) {
          variableNames.push(initialDefaultVars[i]);
        }else {
          variableNames.push("x" + (i+1));
        }
      }

      // we accept the following cases:
      // - a single equation (e.g., x=1), i.e., a single lhs and a single rhs
      //   one must match either variable 1 (in which case it is a location)
      //   or match variable 2 (in which case it is a value)
      // - two equations (e.g., x=1, y=3), i.e., two lhs and two rhs
      //   one equation must variable 1 and the other variable 2
      //   giving both a location and a value
      // - a single component with that is a 2D vector (e.g., (1,3))
      //   first vector component is a location, the second a value
      // - a single component with no equation (e.g., 3)
      //   the component is a value
      // - two components with no equation (e.g., 1, 3)
      //   the first is a location, the second is a value

      let locationChildren = [];
      let valueChildren = [];

      if(lhsByPiece.length === 1) {
        if(rhsByPiece.length === 0) {
          let vectorResult = breakIntoVectorComponents(lhsByPiece[0]);
          if(vectorResult.foundVector === true && vectorResult.vectorComponents.length === 2) {
            locationChildren = vectorResult.vectorComponents[0];
            valueChildren = vectorResult.vectorComponents[1];
            toDelete = [...toDelete, ...vectorResult.toDelete];
          }else {
            valueChildren = lhsByPiece[0];
          }
        }else if(rhsByPiece.length !== 1) {
          return {success: false}
        }else {
          if(getVarName(lhsByPiece[0]) === variableNames[1]) {
            valueChildren =rhsByPiece[0];
          }else if(getVarName(rhsByPiece[0]) === variableNames[1]) {
            valueChildren =lhsByPiece[0];
          }else if(getVarName(lhsByPiece[0]) === variableNames[0]) {
            locationChildren =rhsByPiece[0];
          }else if(getVarName(rhsByPiece[0]) === variableNames[0]) {
            locationChildren =lhsByPiece[0];
          }else {
            return {success: false};
          }
        }
      }else if(lhsByPiece.length !== 2) {
        return {success: false};
      }else {

        if(rhsByPiece.length === 0) {
          locationChildren =lhsByPiece[0];
          valueChildren =lhsByPiece[1];
        }else if(rhsByPiece.length !== 2) {
          return {success: false};
        }else {

          let side;
          if(getVarName(lhsByPiece[0]) === variableNames[1]) {
            side = "l";
          }else if(getVarName(rhsByPiece[0]) === variableNames[1]) {
            side = "r";
          }
          if(side !== undefined) {
            if(side === "l") {
              valueChildren =rhsByPiece[0];
            }else {
              valueChildren =lhsByPiece[0];
            }
            if(getVarName(lhsByPiece[1]) === variableNames[0]) {
              locationChildren =rhsByPiece[1];
            }else if(getVarName(rhsByPiece[1]) === variableNames[0]) {
              locationChildren =lhsByPiece[1];
            }else {
              return {success:false}
            }
          } else {
            if(getVarName(lhsByPiece[1]) === variableNames[1]) {
              side = "l";
            }else if(getVarName(rhsByPiece[1]) === variableNames[1]) {
              side = "r";
            }
            if(side === undefined) {
              return {success: false };
            }
            if(side === "l") {
              valueChildren =rhsByPiece[1];
            }else {
              valueChildren =lhsByPiece[1];
            }
            if(getVarName(lhsByPiece[0]) === variableNames[0]) {
              locationChildren =rhsByPiece[0];
            }else if(getVarName(rhsByPiece[0]) === variableNames[0]) {
              locationChildren =lhsByPiece[0];
            }else {
              return {success:false};
            }
          }
        }
      }

      if(locationChildren.length > 0) {
        newChildren.push({
          componentType: "location",
          children: locationChildren,
        })
      }
      if(valueChildren.length > 0) {
        newChildren.push({
          componentType: "value",
          children: valueChildren,
        })
      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }

    let VariablesForSugar = childLogic.newLeaf({
      name: "VariablesForSugar",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1,
    });

    let AtLeastOneString = childLogic.newLeaf({
      name: "AtLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });
    
    let AtLeastOneMath = childLogic.newLeaf({
      name: "AtLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let StringsAndMaths = childLogic.newOperator({
      name: "StringsAndMaths",
      operator: 'or',
      propositions: [AtLeastOneString, AtLeastOneMath],
      requireConsecutive: true,
    });

    let StringsAndMathsSugar = childLogic.newOperator({
      name: "StringsAndMathsSugar",
      operator: 'and',
      propositions: [VariablesForSugar, StringsAndMaths],
      isSugar: true,
      replacementFunction: createLocationValueFromSugar,
    });

    let ExactlyOneLocation = childLogic.newLeaf({
      name: "ExactlyOneLocation",
      componentType: 'location',
      number: 1,
    });

    let ExactlyOneValue = childLogic.newLeaf({
      name: "ExactlyOneValue",
      componentType: 'value',
      number: 1,
    });

    let LocationOrValue = childLogic.newOperator({
      name: "LocationOrValue",
      operator: 'or',
      propositions: [ExactlyOneLocation, ExactlyOneValue],
    });

    let Variables = childLogic.newLeaf({
      name: "Variables",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1,
    });

    let LocationValueVariables = childLogic.newOperator({
      name: "LocationValueVariables",
      operator: 'and',
      propositions: [LocationOrValue, Variables],
    });

    let ExactlyOnePoint = childLogic.newLeaf({
      name: "ExactlyOnePoint",
      componentType: "point",
      number: 1,
    });

    childLogic.newOperator({
      name: "SugarXorLocationValue",
      operator: 'xor',
      propositions: [LocationValueVariables, ExactlyOnePoint, StringsAndMathsSugar],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init === true) {

      this.makePublicStateVariable({
        variableName: "value",
        componentType: "math",
      })
  
      this.makePublicStateVariable({
        variableName: "location",
        componentType: "math",
      })
  
    }
    
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.value = true;
      this.unresolvedState.location = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
    
      let pointInd = this.childLogic.returnMatches("ExactlyOnePoint");
      if(pointInd.length === 1) {
        this.state.pointChild = this.activeChildren[pointInd[0]];
      }else {
        delete this.state.pointChild;

        let locationInd = this.childLogic.returnMatches("ExactlyOneLocation");
        if(locationInd.length === 1) {
          this.state.locationChild = this.activeChildren[locationInd[0]];
        }else {
          delete this.state.locationChild;
        }

        let valueInd = this.childLogic.returnMatches("ExactlyOneValue");
        if(valueInd.length === 1) {
          this.state.valueChild = this.activeChildren[valueInd[0]];
        }else {
          delete this.state.valueChild;
        }
      }
    }

    if(this.state.pointChild) {
      if(this.state.pointChild.unresolvedState.coords) {
        this.unresolvedState.value = true;
        this.unresolvedState.location = true;
      } else if(childrenChanged || trackChanges.getVariableChanges({
        component: this.state.pointChild, variable: "coords"
      })) {
        delete this.unresolvedState.value;
        delete this.unresolvedState.location;
    
        if(this.state.pointChild.state.ndimensions !== 2) {
          console.log("Cannot determine " + this.componentType + " from a point that isn't 2D");
          this.state.location = undefined;
          this.state.value = undefined;
        }else {
          this.state.location = this.state.pointChild.state.xs[0];
          this.state.value = this.state.pointChild.state.xs[1];
        }
      }
    }else {

      if(this.state.locationChild) {
        if(this.state.locationChild.unresolvedState.value) {
          this.unresolvedState.location = true;
        } else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.locationChild, variable: "value"
        })) {
          delete this.unresolvedState.location;
          this.state.location = this.state.locationChild.state.value;
        }
      }else {
        if(this._state.location.essential !== true) {
          this.state.location = undefined;
        }
      }

      if(this.state.valueChild) {
        console.log(`for ${this.componentName}, valueChild is ${this.state.valueChild.state.value}`)
        if(this.state.valueChild.unresolvedState.value) {
          this.unresolvedState.value = true;
          console.log('make value unresolved')
        } else if(childrenChanged || trackChanges.getVariableChanges({
          component: this.state.valueChild, variable: "value"
        })) {
          console.log('recording change');
          delete this.unresolvedState.value;
          this.state.value = this.state.valueChild.state.value;
        }
      }else {
        if(this._state.value.essential !== true) {
          this.state.value = undefined;
        }
      }

    }
  }

}

export class Maximum extends Extremum {
  static componentType = "maximum";
}

export class Minimum extends Extremum {
  static componentType = "minimum";
}

