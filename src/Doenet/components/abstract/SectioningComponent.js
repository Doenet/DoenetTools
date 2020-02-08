import BlockComponent from './BlockComponent';
import { getVariantsForDescendants } from '../../utils/variants';

export default class SectioningComponent extends BlockComponent {
  static componentType = "_sectioningcomponent";

  setUpVariantIfVariantControlChild = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.title = { default: "", componentType: "text" };
    properties.aggregatescores = { default: false };
    properties.weight = { default: 1 };
    // properties.possiblepoints = {default: undefined};
    // properties.aggregatebypoints = {default: false};
    properties.feedbackDefinitions = { propagateToDescendants: true, mergeArrays: true }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }

  // TODO: component has not yet been completely converted
  // Just added some state variables so basic function works


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.containerTag = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { containerTag: "section" } })
    }

    stateVariableDefinitions.viewedSolution = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { viewedSolution: false } })
    }

    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        activeChildren: {
          dependencyType: "childIdentity",
          childLogicName: "anything"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
            { childrenWhoRender: dependencyValues.activeChildren.map(x => x.componentName) }
        };
      }
    }


    return stateVariableDefinitions;
  }

  updateState(args = {}) {
    if (args.init) {
      this.makePublicStateVariable({
        variableName: "creditAchieved",
        componentType: "number",
        additionalProperties: {
          displaydigits: 3,
        }
      });
      this.makePublicStateVariable({
        variableName: "percentcreditachieved",
        componentType: "number",
        additionalProperties: {
          displaydigits: 3,
        }
      });
      // this.makePublicStateVariable({
      //   variableName: "pointsachieved",
      //   componentType: "number"
      // });

      if (!this._state.creditAchieved.essential) {
        this.state.creditAchieved = 0;
        this._state.creditAchieved.essential = true;
      }
      this.state.percentcreditachieved = this.state.creditAchieved * 100;

      if (this.doenetAttributes.isVariantComponent) {
        this.state.selectedVariant = this.sharedParameters.selectedVariant;
        this._state.selectedVariant.essential = true;
      }

      if (this._state.viewedSolution === undefined) {
        this.state.viewedSolution = false;
      }
      this._state.viewedSolution.essential = true;

    }

    super.updateState(args);


    this.state.level = 1;
    this.state.containerTag = "section";

    if (this.state.aggregatescores) {
      this.calculatecreditachieved();
    }
  }

  calculatecreditachieved() {
    // if(this.state.aggregatebypoints) {
    //   let pointsachieved = 0;
    //   let totalPoints = 0;
    //   for(let component of this.descendantsFound.scoredComponent) {
    //     let possiblePoints = component.state.possiblepoints;
    //     if(possiblePoints === undefined) {
    //       possiblePoints = component.state.weight;
    //     }
    //     totalPoints += possiblePoints;
    //     pointsachieved += possiblePoints * component.state.creditAchieved;
    //   }
    //   this.state.creditAchieved = pointsachieved/totalPoints;
    //   this.state.possiblepoints = totalPoints;

    // }else {
    let creditSum = 0;
    let totalWeight = 0;

    for (let component of this.descendantsFound.scoredComponents) {
      let weight = component.state.weight;
      creditSum += component.state.creditAchieved * weight;
      totalWeight += weight;
    }
    this.state.creditAchieved = creditSum / totalWeight;
    this.state.percentcreditachieved = this.state.creditAchieved * 100;
    // }

    // if(this.state.possiblePoints !== undefined) {
    //   this.state.pointsachieved = this.state.creditAchieved * this.state.possiblePoints;
    // }
  }

  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.section({
        key: this.componentName,
        title: this.stateValues.title,
        level: this.stateValues.level,
        containerTag: this.stateValues.containerTag,
        viewedSolution: this.stateValues.viewedSolution,
      });
    }
  }

  updateRenderer() {
    this.renderer.updateSection({
      title: this.stateValues.title,
      viewedSolution: this.stateValues.viewedSolution,
    });
  }

  get descendantSearchClasses() {
    return [{
      classNames: ["_sectioningcomponent", "answer"],
      recurseToMatchedChildren: false,
      key: "scoredComponents",
      childCondition: child => child.componentType === "answer" || child.state.aggregatescores,
      skip: !this.state.aggregatescores,
    }];
  }


  static setUpVariant({ serializedComponent, sharedParameters, definingChildrenSoFar,
    allComponentClasses }) {
    let variantcontrolChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "variantcontrol") {
        variantcontrolChild = child;
        break;
      }
    }
    sharedParameters.variant = variantcontrolChild.state.selectedVariant.value;
    sharedParameters.variantNumber = variantcontrolChild.state.selectedVariantNumber.value;
    sharedParameters.selectRng = variantcontrolChild.state.selectRng.value;
    sharedParameters.allPossibleVariants = variantcontrolChild.state.variants.value;

    // console.log("****Variant for sectioning component****")
    // console.log("Selected seed: " + variantcontrolChild.state.selectedSeed);
    console.log("Variant for " + this.componentType + ": " + sharedParameters.variant);

    // if subvariants were specified, add those the corresponding descendants
    let desiredVariant = serializedComponent.variants.desiredVariant;

    if (desiredVariant === undefined) {
      desiredVariant = {};
    }

    // if subvariants aren't defined but we have uniquevariants specified
    // then calculate variant information for the descendant variant component
    if (desiredVariant.subvariants === undefined && serializedComponent.variants.uniquevariants) {
      let variantInfo = this.getUniqueVariant({
        serializedComponent: serializedComponent,
        variantNumber: sharedParameters.variantNumber,
        allComponentClasses: allComponentClasses,
      })
      if (variantInfo.success) {
        Object.assign(desiredVariant, variantInfo.desiredVariant);
      }
    }

    if (desiredVariant !== undefined && desiredVariant.subvariants !== undefined &&
      serializedComponent.variants.descendantVariantComponents !== undefined) {
      for (let ind in desiredVariant.subvariants) {
        let subvariant = desiredVariant.subvariants[ind];
        let variantComponent = serializedComponent.variants.descendantVariantComponents[ind];
        if (variantComponent === undefined) {
          break;
        }
        variantComponent.variants.desiredVariant = subvariant;
      }
    }

  }

  static determineNumberOfUniqueVariants({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return { success: true };
    }

    let variantControlInd;
    let variantControlChild
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "variantcontrol" || (
        child.createdComponent && components[child.componentName].componentType === "variantcontrol"
      )) {
        variantControlInd = ind;
        variantControlChild = child;
        break;
      }
    }

    if (variantControlInd === undefined) {
      return { success: true };
    }


    // Find number of variants from variantControl
    let numberOfVariants = 100;
    if (variantControlChild.children !== undefined) {
      for (let child of variantControlChild.children) {
        if (child.componentType === "nvariants") {
          // calculate nvariants only if has its value set directly 
          // or if has a single child that is a string
          let foundValid = false;
          if (child.state !== undefined && child.state.value !== undefined) {
            numberOfVariants = Math.round(Number(child.state.value));
            foundValid = true;
          }
          // children overwrite state
          if (child.children !== undefined && child.children.length === 1 &&
            child.children[0].componentType === "string") {
            numberOfVariants = Math.round(Number(child.children[0].state.value));
            foundValid = true;
          }
          if (!foundValid) {
            return { success: false }
          }
          break;
        }
      }
    }

    // check if uniquevariants is already be defined in variants
    if (serializedComponent.variants === undefined) {
      serializedComponent.variants = {};
    }

    let uniqueVariantData;
    if (serializedComponent.variants.uniquevariants) {
      // max number of variants is the product of 
      // number of variants for each descendantVariantComponent
      let maxNumberOfVariants = 1;
      let numberOfVariantsByDescendant = []
      if (serializedComponent.variants.descendantVariantComponents !== undefined) {
        numberOfVariantsByDescendant = serializedComponent.variants.descendantVariantComponents
          .map(x => x.variants.numberOfVariants);
        maxNumberOfVariants = numberOfVariantsByDescendant.reduce((a, c) => a * c, 1);
        uniqueVariantData = {
          numberOfVariantsByDescendant: numberOfVariantsByDescendant,
        }
      }

      numberOfVariants = Math.min(maxNumberOfVariants, numberOfVariants)
    }

    return {
      success: true,
      numberOfVariants: numberOfVariants,
      uniqueVariantData: uniqueVariantData
    }

  }

  static getUniqueVariant({ serializedComponent, variantNumber, allComponentClasses }) {
    if (serializedComponent.variants === undefined) {
      return { succes: false }
    }
    let numberOfVariants = serializedComponent.variants.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false }
    }

    if (!Number.isInteger(variantNumber) || variantNumber < 0 || variantNumber >= numberOfVariants) {
      return { success: false }
    }

    let desiredVariant = {
      index: variantNumber,
    }

    if (serializedComponent.variants.uniquevariants) {

      let result = getVariantsForDescendants({
        variantNumber: variantNumber,
        serializedComponent: serializedComponent,
        allComponentClasses: allComponentClasses
      })

      if (result.success) {
        desiredVariant.subvariants = result.desiredVariants
      } else {
        console.log("Failed to get unique variant for " + serializedComponent.componentType);
      }

    }

    return { success: true, desiredVariant: desiredVariant }
  }

  static includeBlankStringChildren = true;


  allowDownstreamUpdates(status) {
    // only allow initial change 
    return (status.initialChange === true);
  }

  get variablesUpdatableDownstream() {
    // only allowed to change these state variables
    return [
      "viewedSolution",
    ];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    Object.assign(stateVariableChangesToSave, stateVariablesToUpdate);

    return true;
  }


}