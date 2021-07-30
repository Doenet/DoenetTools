import Template from './Template';

export default class PaginatorPage extends Template {
  static componentType = "paginatorPage";

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.rendered = {
      createComponentOfType: "boolean",
    };
    attributes.isResponse = {
      leaveRaw: true,
    }
    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.pageNumber = {
      public: true,
      componentType: "integer",
      defaultValue: 1,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { pageNumber: { variablesToCheck: ["pageNumber"] } }
      })
    }

    stateVariableDefinitions.sectionPlaceholder = {
      defaultValue: false,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { sectionPlaceholder: { variablesToCheck: ["sectionPlaceholder"] } }
      })
    }

    stateVariableDefinitions.rendered = {
      public: true,
      componentType: "boolean",
      defaultValue: this.renderedDefault,
      returnDependencies: () => ({
        pageNumber: {
          dependencyType: "stateVariable",
          variableName: "pageNumber"
        },
        sectionPlaceholder: {
          dependencyType: "stateVariable",
          variableName: "sectionPlaceholder"
        },
        paginatorCurrentPage: {
          dependencyType: "sourceCompositeStateVariable",
          parentComponentType: "paginator",
          variableName: "currentPage"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.paginatorCurrentPage === null) {
          return {
            useEssentialOrDefaultValue:
              { rendered: { variablesToCheck: ["rendered"] } }
          }
        } else {
          let rendered = dependencyValues.paginatorCurrentPage === dependencyValues.pageNumber;
          if (dependencyValues.sectionPlaceholder) {
            rendered = !rendered;
          }
          return {
            newValues: { rendered }
          }
        }

      }
    }


    stateVariableDefinitions.readyToExpandWhenResolved = {

      returnDependencies: () => ({
        rendered: {
          dependencyType: "stateVariable",
          variableName: "rendered",
        },
      }),
      // when this state variable is marked stale
      // it indicates we should update replacement
      // For this to work, must get value in replacement functions
      // so that the variable is marked fresh
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, componentInfoObjects, workspace }) {

    workspace.rendered = component.stateValues.rendered;

    let alwaysCreateReplacements = component.stateValues.sectionPlaceholder;

    let result = super.createSerializedReplacements({ component, componentInfoObjects, alwaysCreateReplacements });

    if (!component.stateValues.rendered && component.stateValues.sectionPlaceholder) {
      result.withholdReplacements = true;
    }

    return result;

  }


  static calculateReplacementChanges({ component, workspace, componentInfoObjects }) {
    // console.log(`calculate replacement changes for ${component.componentName}`);

    let replacementChanges = [];

    if (!component.stateValues.rendered) {
      if (workspace.rendered) {
        workspace.rendered = false;

        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: component.replacements.length,
        };
        replacementChanges.push(replacementInstruction);

      }


    } else if (!workspace.rendered) {

      workspace.rendered = true;

      if (component.replacementsToWithhold > 0) {
        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: 0,
        };
        replacementChanges.push(replacementInstruction);

      } else {
        let replacements = this.createSerializedReplacements({ component, componentInfoObjects, workspace }).replacements;

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          serializedReplacements: replacements,
          replacementsToWithhold: 0,
        }

        replacementChanges.push(replacementInstruction);

      }
    }

    return replacementChanges;

  }


}
