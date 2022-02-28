import Template from './Template.js';
import BlockComponent from './abstract/BlockComponent.js';

export class Paginator extends Template {
  static componentType = "paginator";
  static renderedDefault = true;
  static includeBlankStringChildren = false;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.initialPage = {
      createComponentOfType: "integer",
      createStateVariable: "initialPage",
      defaultValue: 1,
    }
    attributes.submitAllOnPageChange = {
      createComponentOfType: "boolean",
      createStateVariable: "submitAllOnPageChange",
      defaultValue: false,
    }
    return attributes;

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


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
            if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "_sectioningComponent"
              }) ||
              child.componentType === "copy" && child.attributes &&
              child.attributes.componentType &&
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.attributes.componentType.primitive,
                baseComponentType: "_sectioningComponent"
              })
            ) {
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
                  let ntsComp = child.attributes.numberToSelect.component;
                  if (ntsComp.children) {
                    // look for a string child
                    for (let child of ntsComp.children) {
                      if (typeof child === "string") {
                        let n = Number(child);
                        if (Number.isFinite(n)) {
                          numberToSelect = Math.round(n);
                          break;
                        }
                      }
                    }
                  }
                }
                n += nPagesPerOption * numberToSelect;
              }
            }

          }
          return n;
        }


        return {
          setValue: {
            nPages: countSectionsFromChildren(dependencyValues.serializedChildren)
          }
        }
      }

    }

    stateVariableDefinitions.currentPage = {
      public: true,
      componentType: "integer",
      hasEssential: true,
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
      definition({ dependencyValues }) {

        return {
          useEssentialOrDefaultValue: {
            currentPage: {
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
        }
      },
      async inverseDefinition({ desiredStateVariableValues, stateValues, sourceInformation = {} }) {

        // allow change only from setPage action
        if (!sourceInformation.fromSetPage) {
          return { success: false }
        }

        let desiredPageNumber = Number(desiredStateVariableValues.currentPage);
        if (!Number.isInteger(desiredPageNumber)) {
          return { success: false }
        }

        desiredPageNumber = Math.max(1, Math.min(await stateValues.nPages, desiredPageNumber))

        return {
          success: true,
          instructions: [{
            setEssentialValue: "currentPage",
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
          setValue: {
            pageDescendants: dependencyValues.pageDescendants
          }
        }
      }
    }

    stateVariableDefinitions.documentName = {
      returnDependencies: () => ({
        documentAncestor: {
          dependencyType: "ancestor",
          componentType: "document"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.documentAncestor) {
          return {
            setValue: {
              documentName: dependencyValues.documentAncestor.componentName
            }
          }
        } else {
          return { setValue: { documentName: null } }
        }
      }
    }

    return stateVariableDefinitions;
  }


  static async createSerializedReplacements({ component, componentInfoObjects }) {
    let sectionReplacements = (await super.createSerializedReplacements({ component, componentInfoObjects })).replacements;


    let insertPages = async function (serializedReplacements) {
      let newReplacements = [];
      for (let replacement of serializedReplacements) {
        if (
          componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: replacement.componentType,
            baseComponentType: "_sectioningComponent"
          }) ||
          replacement.componentType === "copy" && replacement.attributes &&
          replacement.attributes.componentType &&
          componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: replacement.attributes.componentType.primitive,
            baseComponentType: "_sectioningComponent"
          })
        ) {


          newReplacements.push({
            componentType: "paginatorPage",
            children: [replacement],
          })

        } else if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: replacement.componentType,
          baseComponentType: "select"
        })) {


          if (replacement.children) {
            for (let child of replacement.children) {
              if (child.componentType === "option") {
                if (child.children) {

                  child.children = await insertPages(child.children);

                }
              }
            }
          }

          newReplacements.push(replacement)


        }
      }
      return newReplacements;
    }

    let replacements = await insertPages(sectionReplacements);


    return { replacements };

  }

  async setPage({ number }) {

    if (await this.stateValues.submitAllOnPageChange && !this.flags.readOnly) {
      await this.coreFunctions.performAction({
        componentName: await this.stateValues.documentName,
        actionName: "submitAllAnswers"
      })
    }

    if (!Number.isInteger(number)) {
      return;
    }

    let pageNumber = Math.max(1, Math.min(await this.stateValues.nPages, number));

    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "currentPage",
      value: pageNumber,
      sourceInformation: { fromSetPage: true }
    }];


    await this.coreFunctions.performUpdate({
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
    setPage: this.setPage.bind(this),
  };

}

export class PaginatorPage extends Template {
  static componentType = "paginatorPage";

  static assignNamesSkipOver = true;

  static renderedDefault = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    delete attributes.hide;
    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.pageNumber = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        paginatorPageDescendants: {
          dependencyType: "sourceCompositeStateVariable",
          compositeComponentType: "paginator",
          variableName: "pageDescendants"
        }
      }),
      definition({ dependencyValues, componentName }) {

        let pageNumber = null;

        if (dependencyValues.paginatorPageDescendants) {
          let ind = dependencyValues.paginatorPageDescendants
            .map(x => x.componentName).indexOf(componentName);
          if (ind !== -1) {
            pageNumber = ind + 1;
          }
        }

        return { setValue: { pageNumber } }


      }
    }


    stateVariableDefinitions.hide = {
      public: true,
      componentType: "boolean",
      returnDependencies: () => ({
        pageNumber: {
          dependencyType: "stateVariable",
          variableName: "pageNumber"
        },
        paginatorCurrentPage: {
          dependencyType: "sourceCompositeStateVariable",
          compositeComponentType: "paginator",
          variableName: "currentPage"
        }
      }),
      definition({ dependencyValues }) {
        let hide = true;
        if (dependencyValues.paginatorCurrentPage) {
          hide = dependencyValues.paginatorCurrentPage !== dependencyValues.pageNumber;
        }

        return {
          setValue: { hide }
        }

      }
    }


    return stateVariableDefinitions;
  }


}


export class PaginatorControls extends BlockComponent {
  constructor(args) {
    super(args);

    this.externalActions = {};

    //Complex because the stateValues isn't defined until later
    Object.defineProperty(this.externalActions, 'setPage', {
      enumerable: true,
      get: async function () {
        let paginatorComponentName = await this.stateValues.paginatorComponentName;
        if (paginatorComponentName) {
          return {
            componentName: paginatorComponentName,
            actionName: "setPage",
          }
        } else {
          return;
        }
      }.bind(this)
    });

  }
  static componentType = "paginatorControls";
  static renderChildren = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.previousLabel = {
      createComponentOfType: "text",
      createStateVariable: "previousLabel",
      defaultValue: "Previous",
      forRenderer: true,
      public: true,
    }
    attributes.nextLabel = {
      createComponentOfType: "text",
      createStateVariable: "nextLabel",
      defaultValue: "Next",
      forRenderer: true,
      public: true,
    }
    attributes.pageLabel = {
      createComponentOfType: "text",
      createStateVariable: "pageLabel",
      defaultValue: "Page",
      forRenderer: true,
      public: true,
    }
    attributes.paginator = {
      createPrimitiveOfType: "string",
      createStateVariable: "paginator",
      defaultValue: null,
    }

    attributes.disabledIgnoresParentReadOnly.defaultValue = true;

    return attributes;

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.paginatorComponentName = {
      stateVariablesDeterminingDependencies: ["paginator"],
      returnDependencies({ stateValues }) {
        if (stateValues.paginator) {
          return {
            paginatorComponentName: {
              dependencyType: "expandTargetName",
              target: stateValues.paginator
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        return { setValue: { paginatorComponentName: dependencyValues.paginatorComponentName } }
      }
    }

    stateVariableDefinitions.currentPage = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["paginatorComponentName"],
      returnDependencies({ stateValues }) {
        if (!stateValues.paginatorComponentName) {
          return {}
        } else {
          return {
            paginatorPage: {
              dependencyType: "stateVariable",
              componentName: stateValues.paginatorComponentName,
              variableName: "currentPage"
            }
          }
        }
      },
      definition({ dependencyValues }) {
        if ("paginatorPage" in dependencyValues) {
          return {
            setValue: { currentPage: dependencyValues.paginatorPage }
          }
        } else {
          return { setValue: { currentPage: 1 } }
        }
      }
    }

    stateVariableDefinitions.nPages = {
      forRenderer: true,
      stateVariablesDeterminingDependencies: ["paginatorComponentName"],
      returnDependencies({ stateValues }) {
        if (!stateValues.paginatorComponentName) {
          return {}
        } else {
          return {
            paginatorNPages: {
              dependencyType: "stateVariable",
              componentName: stateValues.paginatorComponentName,
              variableName: "nPages"
            }
          }
        }
      },
      definition({ dependencyValues }) {
        if ("paginatorNPages" in dependencyValues) {
          return {
            setValue: { nPages: dependencyValues.paginatorNPages }
          }
        } else {
          return { setValue: { nPages: 1 } }
        }
      }
    }

    return stateVariableDefinitions;

  }



}
