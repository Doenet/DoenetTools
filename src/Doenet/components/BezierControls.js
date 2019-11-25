import BaseComponent from './abstract/BaseComponent';
import {breakEmbeddedStringByCommas, breakIntoVectorComponents} from './commonsugar/breakstrings';
import me from 'math-expressions';

export default class BezierControls extends BaseComponent {
  static componentType = "beziercontrols";
  
  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.deleteAllLogic();

    let checkIfMathVector = function(compList) {
      if(compList.length === 1) {
        let component = compList[0]._component;
        if(component !== undefined && component.componentType==="math") {
          let tree = component.state.value.tree;
          if(tree !== undefined) {
            if(Array.isArray(tree) && (tree[0] === "tuple" || tree[0] === "vector")) {
              return true;
            }
          }
        }
      }
      return false;
    }

    let createControlList = function({activeChildrenMatched}) {

      let results = breakEmbeddedStringByCommas({
        childrenList: activeChildrenMatched,
        classesToExtract: [this.allComponentClasses.defaultcontrols],
      });

      if(results.success !== true) {
        return {success: false}
      }

      let defaultcontrolsChild = results.componentsExtracted[0];
      let pieces = results.pieces;
      let toDelete = results.toDelete;

      let newChildren = [];
      let controlsAreVectors = false;
      if(defaultcontrolsChild !== undefined) {
        newChildren.push(defaultcontrolsChild);
        if(defaultcontrolsChild._component.state.value === "vector") {
          controlsAreVectors = true;
        }
      }

      for(let ind=0; ind < pieces.length; ind++) {
        let piece = pieces[ind];

        // each piece must be a vector (if not, we won't sugar)
        // the next step is to find the vector components
        // so that we can see if the components themselves are vectors

        let componentsAreVectors = false;
        let vectorComponents;
        let result = breakIntoVectorComponents(piece);
        if(result.foundVector !== true) {
          // check if is a single math that is a tuple or vector
          if(!checkIfMathVector(piece)) {
            return {success: false};
          }
        } else {
        
          vectorComponents = result.vectorComponents;

          // check if each component is itself a vector
          componentsAreVectors = true;
          for(let comp of vectorComponents) {
            let result2 = breakIntoVectorComponents(comp);
            if(result2.foundVector !== true) {
              if(!checkIfMathVector(comp)) {
                componentsAreVectors = false;
                break;
              }
            }
          }
        }

        let children;
        let controlType = "point";
        let controlListType = "controlpoints";
        if(controlsAreVectors) {
          controlType = "vector";
          controlListType = "controlvectors";
        }

        if(componentsAreVectors) {
          // found a piece that is a vector of vectors
          // Instead of using the piece itself as the children for the control,
          // we'll use the vector components of the piece

          // since we're actually breaking it up,
          // add any more strings to delete
          // that we encountered in the initial breaking into components
          toDelete = [...toDelete, ...result.toDelete];

          children = vectorComponents.map(x=> ({
            componentType: controlType,
            children: x
          }));

        }else {
          // if not vector of vectors, just keep original children from piece
          children = [{
            componentType: controlType,
            children: piece
          }]
        }
        
        newChildren.push({
          componentType: controlListType,
          children: children
        })

      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }

    let defaultControlsForSugar = childLogic.newLeaf({
      name: "defaultControlsForSugar",
      componentType: 'defaultcontrols',
      comparison: 'atMost',
      number: 1,
    });

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });
    
    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneString, atLeastOneMath],
      requireConsecutive: true,
    });

    let stringsAndMathsSugar = childLogic.newOperator({
      name: "stringsAndMathsSugar",
      operator: 'and',
      propositions: [defaultControlsForSugar, stringsAndMaths],
      isSugar: true,
      replacementFunction: createControlList,
    });

    let defaultControls = childLogic.newLeaf({
      name: "defaultControls",
      componentType: 'defaultcontrols',
      comparison: 'atMost',
      number: 1,
    });
  
    let atLeastOnePoint = childLogic.newLeaf({
      name: "atLeastOnePoint",
      componentType: 'point',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneVector = childLogic.newLeaf({
      name: "atLeastOneVector",
      componentType: 'vector',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneControlpoints = childLogic.newLeaf({
      name: "atLeastOneControlpoints",
      componentType: 'controlpoints',
      comparison: 'atLeast',
      number: 1
    });

    let atLeastOneControlvectors = childLogic.newLeaf({
      name: "atLeastOneControlvectors",
      componentType: 'controlvectors',
      comparison: 'atLeast',
      number: 1
    });

    let atLeastOneControl = childLogic.newOperator({
      name: "atLeastOneControl",
      operator: "or",
      propositions: [atLeastOneControlpoints, atLeastOneControlvectors, atLeastOnePoint, atLeastOneVector],
      requireConsecutive: true,
    })

    let controlsWithDefault = childLogic.newOperator({
      name: "controlsWithDefault",
      operator: "and",
      propositions: [defaultControls, atLeastOneControl]
    })

    childLogic.newOperator({
      name: "controlsXorSugar",
      operator: 'xor',
      propositions: [controlsWithDefault, stringsAndMathsSugar],
      allowSpillover: false,
      setAsBase: true
    });

    return childLogic;
  }

  updateState(args={}) {
    if(args.init) {
      this.makeArrayVariable({
        variableName: "controls",
        trackChanges: true
      });
    }

    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.controls = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      let controlInds = this.childLogic.returnMatches("atLeastOneControl");
      this.state.controlChildren = controlInds.map(x => this.activeChildren[x]);
    }

    if(childrenChanged) {
      this.state.controls = [];
    }

    for(let [ind, child] of this.state.controlChildren.entries()) {
      if(child instanceof this.allComponentClasses.controlvectors) {
        if(child.unresolvedState.vectors ||
            child.state.vectors.some(x=>x.unresolvedState.displacement)) {
          if(this.unresolvedState.controls === undefined) {
            this.unresolvedState.controls = {isArray: true, arrayComponents: {}}
          }
          this.unresolvedState.controls.arrayComponents[ind] = true;
          continue;
        }
        if(childrenChanged || trackChanges.getVariableChanges({
          component: child, variable: "vectors"
        }) || child.state.vectors.some(x=>trackChanges.getVariableChanges({
          component: x, variable: "displacement"
        }))) {
          if(child.state.nVectors === 0) {
            console.log("can't create beizer controlvector with zero vectors");
            this.state.controls[ind] = {
              controlType: "vector",
              vectors: [me.fromAst(0)],
            };
          }else if(child.state.nVectors === 1) {
            let vector = child.state.vectors[0].state.displacement.copy();
            this.state.controls[ind] = {
              controlType: "vector",
              vectors: [vector],
            };
          }else if(child.state.nVectors === 2) {
            let vectors = [
              child.state.vectors[0].state.displacement.copy(),
              child.state.vectors[1].state.displacement.copy()
            ];
            this.state.controls[ind] = {
              controlType: "vector",
              vectors: vectors,
            };
          }else {
            throw Error("can't create beizer controlvector with more than two vectors");
          }
        }
      }else if(child instanceof this.allComponentClasses.controlpoints) {
        if(child.unresolvedState.points ||
            child.state.points.some(x=>x.unresolvedState.coords)) {
          if(this.unresolvedState.controls === undefined) {
            this.unresolvedState.controls = {isArray: true, arrayComponents: {}}
          }
          this.unresolvedState.controls.arrayComponents[ind] = true;
          continue;
        }
        if(childrenChanged || trackChanges.getVariableChanges({
          component: child, variable: "points"
        }) || child.state.points.some(x=>trackChanges.getVariableChanges({
          component: x, variable: "coords"
        }))) {
          if(child.state.nPoints === 0) {
            console.log("can't create beizer controlpoint with zero points");
            this.state.controls[ind] = {
              controlType: "point",
              points: [me.fromAst(0)],
            };
          } else if(child.state.nPoints === 1) {
            let point = child.state.points[0].state.coords.copy();
            this.state.controls[ind] = {
              controlType: "point",
              points: [point],
            };
          }else if(child.state.nPoints === 2) {
            let points = [
              child.state.points[0].state.coords.copy(),
              child.state.points[1].state.coords.copy()
            ];
            this.state.controls[ind] = {
              controlType: "point",
              points: points,
            };
          }else {
            throw Error("can't create bezier controlpoint with more than two points");
          }
        }
      }else if(child instanceof this.allComponentClasses.vector) {
        if(child.unresolvedState.displacement) {
          if(this.unresolvedState.controls === undefined) {
            this.unresolvedState.controls = {isArray: true, arrayComponents: {}}
          }
          this.unresolvedState.controls.arrayComponents[ind] = true;
          continue;
        }
        if(childrenChanged || trackChanges.getVariableChanges({
          component: child, variable: "displacement"
        })) {
          let vector = child.state.displacement.copy();
          this.state.controls[ind] = {
            controlType: "vector",
            vectors: [vector],
          };
        }
      }else if(child instanceof this.allComponentClasses.point) {
        if(child.unresolvedState.coords) {
          if(this.unresolvedState.controls === undefined) {
            this.unresolvedState.controls = {isArray: true, arrayComponents: {}}
          }
          this.unresolvedState.controls.arrayComponents[ind] = true;
          continue;
        }
        if(childrenChanged || trackChanges.getVariableChanges({
          component: child, variable: "coords"
        })) {
          let point = child.state.coords.copy();
          this.state.controls[ind] = {
            controlType: "point",
            points: [point],
          };
        }
      }
    }

  }

  allowDownstreamUpdates() {
    return true;
  }

  get variablesUpdatableDownstream() {
    return ["controls"];
  }

  calculateDownstreamChanges({stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate}) {

    let newControls = {};
    let newStateVariables = {};
    for(let varName in stateVariablesToUpdate) {
      if(varName === "controls") {
        if(newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for(let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          newControls[ind] = newStateVariables[varName].changes.arrayComponents[ind] = 
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      }
    } 

    for(let ind in newControls) {
      let child = this.state.controlChildren[ind];
      if(child === undefined) {
        continue;
      }
      let name = child.componentName;

      if(child instanceof this.allComponentClasses.controlvectors) {
        let vectors = child.state.vectors;
        for(let ind2=0; ind2 < vectors.length; ind2++) {
          if(newControls[ind][ind2] !== undefined) {
            let vectorName = vectors[ind2].componentName;
            dependenciesToUpdate[vectorName] = {displacement: {changes: newControls[ind][ind2]}};
          }
        }
      }else if(child instanceof this.allComponentClasses.controlpoints) {
        let points = child.state.points;
        for(let ind2=0; ind2 < points.length; ind2++) {
          if(newControls[ind][ind2] !== undefined) {
            let pointName = points[ind2].componentName;
            dependenciesToUpdate[pointName] = {coords: {changes: newControls[ind][ind2]}};
          }
        }
      }else if(child instanceof this.allComponentClasses.vector) {
        dependenciesToUpdate[name] = {displacement: {changes: newControls[ind][0]}};
      }else if(child instanceof this.allComponentClasses.point) {
        dependenciesToUpdate[name] = {coords: {changes: newControls[ind][0]}};
      }
    }

    // this.updateShadowSources({
    //   newStateVariables: newStateVariables,
    //   dependenciesToUpdate: dependenciesToUpdate,
    // });

    return true;
    
  }

}