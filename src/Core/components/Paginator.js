import Template from './Template';

export default class Paginator extends Template {
  static componentType = "paginator";
  static renderedDefault = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.preserveScores = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "preserveScores",
      defaultValue: true
    }
    attributes.initialPage = {
      createComponentOfType: "integer",
      createStateVariable: "initialPage",
      defaultValue: 1,
    }
    return attributes;

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // only include sectioning children
    stateVariableDefinitions.serializedChildren = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let serializedChildren = dependencyValues.serializedChildren.filter(child =>
          componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "_sectioningComponent"
          }));

        return { newValues: { serializedChildren } }
      }
    }

    stateVariableDefinitions.nPages = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "stateVariable",
          variableName: "serializedChildren"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { nPages: dependencyValues.serializedChildren.length }
      })
    }

    stateVariableDefinitions.currentPage = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        initialPage: {
          dependencyType: "stateVariable",
          variableName: "initialPage"
        },
        nPages: {
          dependencyType: "stateVariable",
          variableName: "nPages"
        }
      }),
      definition: ({dependencyValues}) => ({
        useEssentialOrDefaultValue: {
          currentPage: {
            variablesToCheck: ["currentPage"],
            get defaultValue() {
              let initialPageNumber = dependencyValues.initialPage;
              if (!Number.isInteger(initialPageNumber)) {
                return 1;
              } else {
                return Math.max(1, Math.min(dependencyValues.nPages, initialPageNumber));
              }
            }
          }
        }
      }),
      inverseDefinition({ desiredStateVariableValues, stateValues, sourceInformation = {} }) {

        // allow change only from setPage action
        if (!sourceInformation.fromSetPage) {
          return { success: false }
        }

        let desiredPageNumber = Number(desiredStateVariableValues.currentPage);
        if (!Number.isInteger(desiredPageNumber)) {
          return { success: false }
        }

        desiredPageNumber = Math.max(1, Math.min(stateValues.nPages, desiredPageNumber))

        return {
          success: true,
          instructions: [{
            setStateVariable: "currentPage",
            value: desiredPageNumber
          }]
        }
      }
    }


    return stateVariableDefinitions;
  }


  static createSerializedReplacements({ component, componentInfoObjects }) {
    let sectionReplacements = super.createSerializedReplacements({ component, componentInfoObjects }).replacements;

    let replacements = [];
    for (let [pInd, section] of sectionReplacements.entries()) {
      if (component.stateValues.preserveScores) {
        if (!section.state) {
          section.state = {};
        }
        section.state.aggregateScores = true;
      }

      replacements.push({
        componentType: "paginatorPage",
        children: [section],
        state: { pageNumber: pInd + 1 }
      })

      replacements.push({
        componentType: "paginatorPage",
        children: [{
          componentType: section.componentType,
          state: {
            hide: true,
            aggregateScores: component.stateValues.preserveScores,
            sectionPlaceholder: true,
          }
        }],
        state: {
          pageNumber: pInd + 1,
          sectionPlaceholder: true,
        }
      })

    }

    return { replacements };

  }

  setPage({ number }) {

    let currentPageNumber = this.stateValues.currentPage;


    if (!Number.isInteger(number)) {
      return;
    }

    let pageNumber = Math.max(1, Math.min(this.stateValues.nPages, number));

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "currentPage",
      value: pageNumber,
      sourceInformation: { fromSetPage: true }
    }];

    if (this.stateValues.preserveScores) {
      let sectionToBeWithheld = this.replacements[2 * (currentPageNumber - 1)].replacements[0];
      let sectionCreditAchieved = sectionToBeWithheld.stateValues.creditAchieved;
      let sectionPercentCreditAchieved = sectionToBeWithheld.stateValues.percentCreditAchieved;

      let placeholderSectionName = this.replacements[2 * currentPageNumber - 1].replacements[0].componentName;

      updateInstructions.push({
        updateType: "updateValue",
        componentName: placeholderSectionName,
        stateVariable: "creditAchieved",
        value: sectionCreditAchieved
      })
      updateInstructions.push({
        updateType: "updateValue",
        componentName: placeholderSectionName,
        stateVariable: "percentCreditAchieved",
        value: sectionPercentCreditAchieved
      })


    }

    this.coreFunctions.requestUpdate({
      updateInstructions,
      event: {
        verb: "selected",
        object: {
          componentName: this.componentName,
          componentType: this.componentType,
        },
        result: {
          response: pageNumber,
          responseText: pageNumber.toString(),
        }
      },
    });

  }

  actions = {
    setPage: this.setPage.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    ),
  };

}
