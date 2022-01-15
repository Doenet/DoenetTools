import Template from './Template';
import BlockComponent from './abstract/BlockComponent';

export class Paginator extends Template {
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

    stateVariableDefinitions.pageSetDescendants = {
      returnDependencies: () => ({
        pageSetDescendants: {
          dependencyType: "descendant",
          componentTypes: ["paginatorPageSet"],
          useReplacementsForComposites: true,
          includeNonActiveChildren: true,
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            pageSetDescendants: dependencyValues.pageSetDescendants
          }
        }
      }
    }

    stateVariableDefinitions.sectionsByPageSet = {
      stateVariablesDeterminingDependencies: ["pageSetDescendants"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          nPages: {
            dependencyType: "stateVariable",
            variableName: "nPages"
          }
        };

        for (let [ind, paginatorPageSet] of stateValues.pageSetDescendants.entries()) {
          dependencies[ind] = {
            dependencyType: "replacement",
            compositeName: paginatorPageSet.componentName,
            variableNames: ["creditAchieved", "percentCreditAchieved"],
            recursive: true,
            recurseNonStandardComposites: true,
            includeWithheldReplacements: true,
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let sectionsByPageSet = [];

        for (let ind = 0; ind < dependencyValues.nPages; ind++) {
          sectionsByPageSet.push(dependencyValues[ind])
        }
        return {
          setValue: {
            sectionsByPageSet
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


    let insertPageSets = async function (serializedReplacements) {
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

          if (await component.stateValues.preserveScores) {
            if (!replacement.state) {
              replacement.state = {};
            }
            replacement.state.aggregateScores = true;
          }
          newReplacements.push({
            componentType: "paginatorPageSet",
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

                  child.children = await insertPageSets(child.children);

                }
              }
            }
          }

          newReplacements.push(replacement)


        }
      }
      return newReplacements;
    }

    let replacements = await insertPageSets(sectionReplacements);


    return { replacements };

  }

  async setPage({ number }) {

    if (await this.stateValues.submitAllOnPageChange && !this.flags.readOnly) {
      await this.coreFunctions.performAction({
        componentName: await this.stateValues.documentName,
        actionName: "submitAllAnswers"
      })
    }


    let currentPageNumber = await this.stateValues.currentPage;


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

    let postponeUpdatingPlaceholderCreditAchieved = false;

    if (await this.stateValues.preserveScores) {

      let sections = (await this.stateValues.sectionsByPageSet)[currentPageNumber - 1];
      if (sections.length === 2) {
        let sectionToBeWithheld = sections[0];
        let sectionCreditAchieved = sectionToBeWithheld.stateValues.creditAchieved;
        let sectionPercentCreditAchieved = sectionToBeWithheld.stateValues.percentCreditAchieved;

        let placeholderSectionName = sections[1].componentName;

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
      } else {
        postponeUpdatingPlaceholderCreditAchieved = true;
      }

    }



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


    if (postponeUpdatingPlaceholderCreditAchieved) {
      await this.setPlaceholderCredit({ number: currentPageNumber });
    }

  }


  async setPlaceholderCredit({ number }) {

    if (!Number.isInteger(number)) {
      return;
    }

    let pageNumber = Math.max(1, Math.min(await this.stateValues.nPages, number));

    let updateInstructions = [];

    if (await this.stateValues.preserveScores) {

      let sections = (await this.stateValues.sectionsByPageSet)[pageNumber - 1];
      if (sections.length === 2) {
        let sectionThatWasWithheld = sections[0];
        let sectionCreditAchieved = sectionThatWasWithheld.stateValues.creditAchieved;
        let sectionPercentCreditAchieved = sectionThatWasWithheld.stateValues.percentCreditAchieved;

        let placeholderSectionName = sections[1].componentName;

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

    }

    return await this.coreFunctions.performUpdate({
      updateInstructions,
    });

  }

  actions = {
    setPage: this.setPage.bind(this),
    setPlaceholderCredit: this.setPlaceholderCredit.bind(this),
  };

}

export class PaginatorPageSet extends Template {
  static componentType = "paginatorPageSet";
  static renderedDefault = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static assignNamesSkipOver = true;


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.preserveScores = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        paginatorPreserveScores: {
          dependencyType: "sourceCompositeStateVariable",
          compositeComponentType: "paginator",
          variableName: "preserveScores"
        }
      }),
      definition({ dependencyValues }) {


        return { setValue: { preserveScores: dependencyValues.paginatorPreserveScores } }


      }
    }

    stateVariableDefinitions.pageNumber = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        paginatorPageSetDescendants: {
          dependencyType: "sourceCompositeStateVariable",
          compositeComponentType: "paginator",
          variableName: "pageSetDescendants"
        }
      }),
      definition({ dependencyValues, componentName }) {

        let pageNumber = null;

        if (dependencyValues.paginatorPageSetDescendants) {
          let ind = dependencyValues.paginatorPageSetDescendants
            .map(x => x.componentName).indexOf(componentName);
          if (ind !== -1) {
            pageNumber = ind + 1;
          }
        }

        return { setValue: { pageNumber } }


      }
    }


    stateVariableDefinitions.renderPage = {
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
        let renderPage = false;
        if (dependencyValues.paginatorCurrentPage) {
          renderPage = dependencyValues.paginatorCurrentPage === dependencyValues.pageNumber;
        }

        return {
          setValue: { renderPage }
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

    stateVariableDefinitions.readyToExpandWhenResolved = {

      returnDependencies: () => ({
        renderPage: {
          dependencyType: "stateVariable",
          variableName: "renderPage",
        },
      }),
      // when this state variable is marked stale
      // it indicates we should update replacement
      // For this to work, must get value in replacement functions
      // so that the variable is marked fresh
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({ component, componentInfoObjects, workspace }) {

    workspace.renderPage = await component.stateValues.renderPage;

    let result = await super.createSerializedReplacements({ component, componentInfoObjects });

    if (!result.replacements.length === 1) {
      return { replacements: [] };
    }

    let sectionReplacement = result.replacements[0];

    let newReplacements = [{
      componentType: "paginatorPage",
      children: [sectionReplacement]
    }]

    // if have a copy of external content
    // get attributes and variant info from the section
    // rather than the copy

    // TODO: address internal copy of a section

    let effectiveSectionReplacement = sectionReplacement;
    if (sectionReplacement.componentType === "copy") {
      if (sectionReplacement.children && sectionReplacement.children.length == 1
        && sectionReplacement.children[0].componentType === "externalContent") {
        let extContent = sectionReplacement.children[0];
        if (extContent.children && extContent.children.length === 1 &&
          componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: extContent.children[0].componentType,
            baseComponentType: "_sectioningComponent"
          })) {
          effectiveSectionReplacement = extContent.children[0];
        }
      }
    }


    let placeholderAttributes = {};
    if (effectiveSectionReplacement.attributes) {
      placeholderAttributes = effectiveSectionReplacement.attributes;
    }


    let placeholderVariants;
    if (effectiveSectionReplacement.variants) {
      placeholderVariants = effectiveSectionReplacement.variants
    }

    let placeholderChildren = [];
    for (let child of effectiveSectionReplacement.children) {
      if (componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: child.componentType,
        baseComponentType: "variantControl"
      })) {
        placeholderChildren = [JSON.parse(JSON.stringify(child))]
        let variantChild = placeholderChildren[0];
        if (!variantChild.doenetAttributes) {
          variantChild.doenetAttributes = {};
        }
        variantChild.doenetAttributes.createUniqueName = true;

        break;
      }
    }

    let sectionComponentType = sectionReplacement.componentType;
    if (sectionComponentType === "copy") {
      sectionComponentType = sectionReplacement.attributes.componentType.primitive;
    }

    newReplacements.push({
      componentType: "paginatorPage",
      children: [{
        componentType: sectionComponentType,
        attributes: placeholderAttributes,
        variants: placeholderVariants,
        state: {
          hide: true,
          aggregateScores: await component.stateValues.preserveScores,
          sectionPlaceholder: true,
        },
        children: placeholderChildren,
      }],
      state: {
        sectionPlaceholder: true,
      }
    })

    return { replacements: newReplacements }

  }


}


export class PaginatorPage extends Template {
  static componentType = "paginatorPage";

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static assignNamesSkipOver = true;


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.rendered = {
      createComponentOfType: "boolean",
    };
    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.pageNumber = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        pageNumber: {
          dependencyType: "sourceCompositeStateVariable",
          compositeComponentType: "paginatorPageSet",
          variableName: "pageNumber"
        }
      }),
      definition({ dependencyValues }) {

        return { setValue: { pageNumber: dependencyValues.pageNumber } }

      }
    }

    stateVariableDefinitions.sectionPlaceholder = {
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { sectionPlaceholder: true }
      })
    }

    stateVariableDefinitions.rendered = {
      public: true,
      componentType: "boolean",
      defaultValue: this.renderedDefault,
      hasEssential: true,
      returnDependencies: () => ({
        pageNumber: {
          dependencyType: "stateVariable",
          variableName: "pageNumber"
        },
        sectionPlaceholder: {
          dependencyType: "stateVariable",
          variableName: "sectionPlaceholder"
        },
        paginatorPageSetRenderPage: {
          dependencyType: "sourceCompositeStateVariable",
          compositeComponentType: "paginatorPageSet",
          variableName: "renderPage"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.paginatorPageSetRenderPage === null) {
          return {
            useEssentialOrDefaultValue:
              { rendered: true }
          }
        } else {
          let rendered = dependencyValues.paginatorPageSetRenderPage;
          if (dependencyValues.sectionPlaceholder) {
            rendered = !rendered;
          }
          return {
            setValue: { rendered }
          }
        }

      }
    }

    stateVariableDefinitions.mirrorPage = {
      returnDependencies: () => ({
        paginatorPageSetPages: {
          dependencyType: "sourceCompositeStateVariable",
          compositeComponentType: "paginatorPageSet",
          variableName: "pageDescendants"
        }
      }),
      definition({ dependencyValues, componentName }) {
        let mirrorPage;

        for (let page of dependencyValues.paginatorPageSetPages) {
          if (page.componentName !== componentName) {
            mirrorPage = page;
            break;
          }
        }

        return { setValue: { mirrorPage } }

      }
    }

    stateVariableDefinitions.mirrorPageReplacements = {
      stateVariablesDeterminingDependencies: ["mirrorPage"],
      returnDependencies: ({ stateValues }) => ({
        mirrorPageReplacements: {
          dependencyType: "replacement",
          compositeName: stateValues.mirrorPage.componentName,
          includeWithheldReplacements: true,
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { mirrorPageReplacements: dependencyValues.mirrorPageReplacements } }
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
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({ component, componentInfoObjects, workspace }) {

    workspace.rendered = await component.stateValues.rendered;

    // let alwaysCreateReplacements = component.stateValues.sectionPlaceholder;

    // let result = super.createSerializedReplacements({ component, componentInfoObjects, alwaysCreateReplacements });
    let result = await super.createSerializedReplacements({ component, componentInfoObjects });

    // if (!component.stateValues.rendered && component.stateValues.sectionPlaceholder) {
    //   result.withholdReplacements = true;
    // }

    return result;

  }


  static async calculateReplacementChanges({ component, components, workspace, componentInfoObjects }) {
    // console.log(`calculate replacement changes for ${component.componentName}`);

    let replacementChanges = [];

    if (!await component.stateValues.rendered) {
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
        let replacements = (await this.createSerializedReplacements({ component, componentInfoObjects, workspace })).replacements;

        let sectionReplacement = replacements[0];

        // if sectionReplacement or mirrorReplacement are copies to external section
        // use variant info from the section itself rather than the copy

        // TODO: address case of interal copy of section

        let effectiveSectionReplacement = sectionReplacement;
        if (sectionReplacement.componentType === "copy") {
          if (sectionReplacement.children && sectionReplacement.children.length == 1
            && sectionReplacement.children[0].componentType === "externalContent") {
            let extContent = sectionReplacement.children[0];
            if (extContent.children && extContent.children.length === 1 &&
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: extContent.children[0].componentType,
                baseComponentType: "_sectioningComponent"
              })) {
              effectiveSectionReplacement = extContent.children[0];
            }
          }
        }

        if (!effectiveSectionReplacement.variants) {
          effectiveSectionReplacement.variants = {}
        }

        let mirrorPageReplacement = components[(await component.stateValues.mirrorPageReplacements)[0].componentName]

        let effectiveMirrorReplacement = mirrorPageReplacement;
        if (mirrorPageReplacement.componentType === "copy") {
          if (mirrorPageReplacement.replacements && mirrorPageReplacement.replacements.length == 1
            && mirrorPageReplacement.replacements[0].componentType === "externalContent") {
            let extContent = mirrorPageReplacement.replacements[0];
            if (extContent.replacements && extContent.replacements.length === 1 &&
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: extContent.replacements[0].componentType,
                baseComponentType: "_sectioningComponent"
              })) {
              effectiveMirrorReplacement = extContent.replacements[0];
            }
          }
        }

        if (effectiveMirrorReplacement.variants && effectiveMirrorReplacement.variants.desiredVariant) {
          effectiveSectionReplacement.variants.desiredVariant = Object.assign({}, effectiveMirrorReplacement.variants.desiredVariant);
        } else {
          effectiveSectionReplacement.variants.desiredVariant = {};
        }

        // overwrite index from actual variant, even if index or name specified
        // in case they aren't valid
        effectiveSectionReplacement.variants.desiredVariant.index = effectiveMirrorReplacement.sharedParameters.variantIndex;


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
