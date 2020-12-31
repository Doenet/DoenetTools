import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';
import { removeNamespace } from '../utils/serializedStateProcessing';

export default class Group extends CompositeComponent {
  static componentType = "group";

  static assignNamesToAllChildrenExcept = Object.keys(this.createPropertiesObject({})).map(x => x.toLowerCase());

  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    }

    let propertyClasses = [];
    for (let componentType in this.createPropertiesObject({})) {
      let ct = componentType.toLowerCase();
      propertyClasses.push({
        componentType: ct,
        class: componentInfoObjects.allComponentClasses[ct]
      });
    }

    let nonPropertyChildInds = [];

    // first occurence of a property component class
    // will be created
    // any other component will stay serialized
    for (let [ind, child] of serializedComponent.children.entries()) {
      let propFound = false;
      for (let propObj of propertyClasses) {
        if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: propObj.componentType
        }) && !propObj.propFound) {
          propFound = propObj.propFound = true;
          break;
        }
      }
      if (!propFound) {
        nonPropertyChildInds.push(ind);
      }
    }

    return nonPropertyChildInds;

  }

  // don't need additional child logic
  // as all non-property children will remain serialized


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.serializedChildren = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true
        },
      }),
      definition: function ({ dependencyValues }) {
        let serializedChildren =
          deepClone(dependencyValues.serializedChildren)
            .filter(x => x.componentType !== "string");

        if (serializedChildren.length !== dependencyValues.serializedChildren.length) {
          console.warn(`String child of group ignored.`)
        }

        // serializedChildren = serializedChildren.map(
        //   x => x.componentType !== "string" ? x : {
        //     componentType: "text",
        //     children: [x]
        //   });

        return {
          newValues: {
            serializedChildren
          }
        }
      }
    }

    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({}),
      definition: function () {
        return { newValues: { readyToExpand: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, componentInfoObjects }) {

    let replacementsWithInstructions = [];

    let assignNames = component.doenetAttributes.assignNames;
    let nChildren = component.state.serializedChildren.value.length

    let nReplacements = nChildren;
    if (assignNames !== undefined) {
      nReplacements = Math.max(nReplacements, assignNames.length)
    }

    for (let ind = 0; ind < nReplacements; ind++) {

      let name;
      if (assignNames !== undefined) {
        name = assignNames[ind];
      }


      let serializedChild;
      let childIsComposite = false;

      if (ind >= nChildren) {
        serializedChild = {
          componentType: "empty"
        }
        if (Array.isArray(name)) {
          serializedChild.doenetAttributes = { assignNames: name };
        }
        childIsComposite = true;
      } else {
        // use state, not stateValues, for child
        // (might be able to use stateValues proxy since don't have variant components)
        serializedChild = deepClone(component.state.serializedChildren.value[ind]);

        childIsComposite = componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: serializedChild.componentType,
          baseComponentType: "_composite"
        });

        if (component.stateValues.hide) {
          // if group is hidden, then make each of its replacements hidden

          if (!serializedChild.state) {
            serializedChild.state = {};
          }

          serializedChild.state.hide = true;

        }
      }

      let instructions = [];

      if (Array.isArray(name)) {
        if (childIsComposite) {
          if (!serializedChild.doenetAttributes) {
            serializedChild.doenetAttributes = {};
          }
          serializedChild.doenetAttributes.assignNames = name;

          // since we don't want to add an extra layer of namespaces
          // we need to undo that fact, since createComponentNames added it
          delete serializedChild.doenetAttributes.newNamespace;
          if (serializedChild.children) {
            removeNamespace(serializedChild.children, serializedChild.doenetAttributes.componentName);
          }

        } else {
          // TODO: what to do when try to assign names recursively to non-composite?
          console.warn(`Group cannot assign names recursively to non-composites`)

          // for now, at least add empties so that names are created
          replacementsWithInstructions.push({
            instructions: [],
            replacements: [{
              componentType: "empty",
              doenetAttributes: { assignNames: name }
            }]
          })
        }

      } else {
        instructions.push({
          operation: "assignName",
          name,
          uniqueIdentifier: ind.toString()
        })
      }

      replacementsWithInstructions.push({
        instructions,
        replacements: [serializedChild]
      })
    }


    console.log("replacementsWithInstructions")
    console.log(JSON.parse(JSON.stringify(replacementsWithInstructions)))
    console.log(replacementsWithInstructions)

    return { replacementsWithInstructions };

  }

  static calculateReplacementChanges({ component, componentChanges, components }) {

    return [];

    let replacementChanges = processChangesForReplacements({
      componentChanges: componentChanges,
      componentName: component.componentName,
      downstreamDependencies: component.downstreamDependencies,
      components
    })
    // console.log(`replacementChanges for group ${component.componentName}`);
    // console.log(replacementChanges);
    return replacementChanges;
  }

}
