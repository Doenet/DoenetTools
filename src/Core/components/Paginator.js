import Template from './Template';

export default class Paginator extends Template {
  static componentType = "paginator";
  static renderedDefault = true;
  static includeBlankStringChildren = false;

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

    // // only include sectioning children
    // stateVariableDefinitions.serializedChildren = {
    //   returnDependencies: () => ({
    //     serializedChildren: {
    //       dependencyType: "serializedChildren",
    //       doNotProxy: true
    //     },
    //   }),
    //   definition({ dependencyValues, componentInfoObjects }) {
    //     let serializedChildren = dependencyValues.serializedChildren.filter(child =>
    //       componentInfoObjects.isInheritedComponentType({
    //         inheritedComponentType: child.componentType,
    //         baseComponentType: "_sectioningComponent"
    //       })
    //       || child.attributes && child.attributes.componentType &&
    //       componentInfoObjects.isInheritedComponentType({
    //         inheritedComponentType: child.attributes.componentType.primitive,
    //         baseComponentType: "_sectioningComponent"
    //       })
    //     );

    //     return { newValues: { serializedChildren } }
    //   }
    // }

    stateVariableDefinitions.nPages = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let countSectionsFromChildren = function (children) {

          let n = 0;
          for (let child of children) {
            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "_sectioningComponent"
            })) {
              n++;
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "select"
            })) {
              let nPagesPerOption = Infinity;
              if (child.children) {
                for (let gChild of child.children) {
                  if (gChild.componentType === "option") {
                    if (gChild.children) {
                      nPagesPerOption = Math.min(nPagesPerOption, countSectionsFromChildren(gChild.children))
                    }
                  }
                }
              }
              if (Number.isFinite(nPagesPerOption)) {
                let numberToSelect = 1;
                if (child.attributes && child.attributes.numberToSelect) {
                  numberToSelect = child.attributes.numberToSelect.primitive
                }
                n += nPagesPerOption * numberToSelect;
              }
            }

          }
          return n;
        }


        return {
          newValues: {
            nPages: countSectionsFromChildren(dependencyValues.serializedChildren)
          }
        }
      }

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
      definition: ({ dependencyValues }) => ({
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

    stateVariableDefinitions.pageDescendants = {
      returnDependencies: () => ({
        pageDescendants: {
          dependencyType: "descendant",
          componentTypes: ["paginatorPage"],
          useReplacementsForComposites: true,
          includeNonActiveChildren: true,
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            pageDescendants: dependencyValues.pageDescendants
          }
        }
      }
    }

    stateVariableDefinitions.pageSections = {
      stateVariablesDeterminingDependencies: ["pageDescendants"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          nPages: {
            dependencyType: "stateVariable",
            variableName: "nPages"
          }
        };

        for (let [ind, paginatorPage] of stateValues.pageDescendants.entries()) {
          dependencies[ind] = {
            dependencyType: "replacement",
            compositeName: paginatorPage.componentName,
            variableNames: ["creditAchieved", "percentCreditAchieved"]
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let pageSections = [];

        for (let ind = 0; ind < 2 * dependencyValues.nPages; ind++) {
          pageSections.push(dependencyValues[ind][0])
        }
        return {
          newValues: {
            pageSections
          }
        }
      }
    }

    return stateVariableDefinitions;
  }


  static createSerializedReplacements({ component, componentInfoObjects }) {
    let sectionReplacements = super.createSerializedReplacements({ component, componentInfoObjects }).replacements;


    let insertPaginators = function (serializedReplacements, requestedSubvariants) {
      let newReplacements = [];
      let nSubvariantsSoFar = 0;
      for (let replacement of serializedReplacements) {
        if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: replacement.componentType,
          baseComponentType: "_sectioningComponent"
        })) {


          if (component.stateValues.preserveScores) {
            if (!replacement.state) {
              replacement.state = {};
            }
            replacement.state.aggregateScores = true;
          }
          newReplacements.push({
            componentType: "paginatorPage",
            children: [replacement],
          })

          let placeholderAttributes = {};
          if (replacement.attributes) {
            placeholderAttributes = replacement.attributes;
          }

          // let isSubvariantComponent = false;
          // if (componentInfoObjects.allComponentClasses[
          //   replacement.componentType].alwaysSetUpVariant
          // ) {
          //   isSubvariantComponent = true;
          // }


          let placeholderVariants;
          console.log(replacement.variants)
          console.log(replacement)
          if (replacement.variants) {
            placeholderVariants = replacement.variants
            console.log(`variants`)
            console.log(JSON.parse(JSON.stringify(replacement.variants)))
          }

          let placeholderChildren = [];
          for (let child of replacement.children) {
            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "variantControl"
            })) {
              placeholderChildren = [JSON.parse(JSON.stringify(child))]
            }
          }

          // if (replacement.componentType === "problem") {
          //   placeholderAttributes.suppresssAutomaticVariants = { primitive: true };
          // }

          newReplacements.push({
            componentType: "paginatorPage",
            children: [{
              componentType: replacement.componentType,
              attributes: placeholderAttributes,
              variants: placeholderVariants,
              state: {
                hide: true,
                aggregateScores: component.stateValues.preserveScores,
                sectionPlaceholder: true,
              },
              children: placeholderChildren,
            }],
            state: {
              sectionPlaceholder: true,
            }
          })


        } else if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: replacement.componentType,
          baseComponentType: "select"
        })) {

          console.log(`variants on select`)
          console.log(replacement.variants)




          if (replacement.children) {
            for (let child of replacement.children) {
              if (child.componentType === "option") {
                if (child.children) {

                  child.children = insertPaginators(child.children);

                }
              }
            }
          }

          newReplacements.push(replacement)


        }
      }
      return newReplacements;
    }

    let replacements = insertPaginators(sectionReplacements);


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
      let sectionToBeWithheld = this.stateValues.pageSections[2 * (currentPageNumber - 1)];
      let sectionCreditAchieved = sectionToBeWithheld.stateValues.creditAchieved;
      let sectionPercentCreditAchieved = sectionToBeWithheld.stateValues.percentCreditAchieved;

      let placeholderSectionName = this.stateValues.pageSections[2 * currentPageNumber - 1].componentName;

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
