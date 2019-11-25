import CompositeComponent from './abstract/CompositeComponent';
import { normalizeSerializedRef } from './Ref';
import { enumerateSelectionCombinations, enumerateCombinations } from '../utils/enumeration';
import { getVariantsForDescendants } from '../utils/variants';
import { deepClone } from '../utils/deepFunctions';

export default class Select extends CompositeComponent {
  constructor(args) {
    super(args);

    this.serializedReplacements = this.createSerializedReplacements();
  }
  static componentType = "select";

  static assignNamesToAllChildrenExcept = Object.keys(Select.createPropertiesObject({}));

  // static selectedVariantVariable = "selectedIndices";


  static previewSerializedComponent({ serializedComponent, allComponentClasses }) {
    if (serializedComponent.children === undefined) {
      return;
    }

    let propertyClasses = [];
    for (let componentType in this.createPropertiesObject({})) {
      propertyClasses.push({
        componentType: componentType,
        class: allComponentClasses[componentType]
      });
    }

    let nonPropertyChildInds = [];

    // first occurence of a property component class
    // will be created
    // any other component will stay serialized
    for (let [ind, child] of serializedComponent.children.entries()) {
      let propFound = false;
      for (let propObj of propertyClasses) {
        if ((child.componentType === propObj.componentType ||
          propObj.class.isPrototypeOf(allComponentClasses[child.componentType])) &&
          !propObj.propFound) {
          propFound = propObj.propFound = true;
          break;
        }
      }
      if (!propFound) {
        nonPropertyChildInds.push(ind);
      }
    }

    let creationInstructions = [];
    creationInstructions.push({ keepChildrenSerialized: nonPropertyChildInds });

    return creationInstructions;

  }

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.numbertoselect = { default: 1 };
    properties.withreplacement = { default: false };
    return properties;
  }

  // don't need additional child logic
  // as all non-property children will remain serialized


  updateState(args = {}) {

    if (args.init) {
      this.state.createdReplacements = false;
      this.allowSugarInSerializedReplacements = true;
    }

    // component is not reselected
    // so run update only until selection is made
    if (this.state.madeSelection) {
      return;
    }

    super.updateState(args);

    // child logic cannot fail, as any component that wouldn't be matched
    // as a property was left serialized

    // if have unresolved property
    // don't continue
    if (Object.keys(this.unresolvedState).length > 0 || this.state.unresolvedDependenceChain !== undefined) {
      this.state.previousNumbertoselect = this.state.numbertoselect;
      this.state.previousWithreplacement = this.state.withreplacement;
      this.unresolvedDependencies = {};
      return
    }

    if (this.compositeDescendant && (
      this.state.previousNumbertoselect !== this.state.numbertoselect ||
      this.state.previousWithreplacement !== this.state.withreplacement ||
      !this.currentTracker.trackChanges.allowSelectExpands)
    ) {
      this.state.previousNumbertoselect = this.state.numbertoselect;
      this.state.previousWithreplacement = this.state.withreplacement;
      this.unresolvedDependencies = {};
      return
    }

    delete this.unresolvedDependencies;

    // if make it this far, will make selection
    this.state.madeSelection = true;

    if (this.state.numbertoselect < 1) {
      this.state.selectedValues = [];
      return;
    }


    // if make it this far, will make selection
    this.state.madeSelection = true;

    // filter out any undefined serialized children
    // (which occur in slots for property children)
    this.serializedChildren = this.serializedChildren.filter(x => x);

    // this.state.childrenToSelect = JSON.parse(JSON.stringify(this.serializedChildren));
    this.state.childrenToSelect = deepClone(this.serializedChildren);

    // if have just one string, convert it to array of text or numbers
    // in the same fashion that sugar works for regular children
    if (this.state.childrenToSelect.length === 1 && this.state.childrenToSelect[0].componentType === "string") {
      this.state.childrenToSelect = numbersOrTextFromString(this.state.childrenToSelect[0].state.value)
    }

    // make sure each serialized child has children and doenetAttributes
    for (let child of this.state.childrenToSelect) {
      if (child.children === undefined) {
        child.children = [];
      }
      if (child.doenetAttributes === undefined) {
        child.doenetAttributes = {};
      }
    };

    this.state.numberOfChildren = this.state.childrenToSelect.length;

    if (this.state.numbertoselect < 1 || this.state.childrenToSelect.length === 0) {
      this.state.selectedIndices = [];
      return;
    }

    this.state.numbertoselect = Math.round(this.state.numbertoselect);

    if (this.state.selectedIndices === undefined) {
      this.state.selectedIndices = [];
    }

    // make selected indices essential so that they are saved
    this._state.selectedIndices.essential = true;


    //TODO: NAMESPACES SHOULD BE IN CORE
    // determine the namespace of the select
    let selectAlias = this.doenetAttributes.componentAlias;
    if (selectAlias !== undefined) {
      if (this.doenetAttributes.newNamespace === true) {
        this.state.selectNamespace = selectAlias + "/";
      } else {
        //Grab everything at the begining up to and including the slash
        this.state.selectNamespace = selectAlias.substring(0, selectAlias.lastIndexOf('/') + 1);
      }
    }

    // // check to see if all children are the same component type
    // let childComponentType = this.state.childrenToSelect[0].componentType;
    // if(this.state.childrenToSelect.slice(1).some(x => x.componentType !== childComponentType)) {
    //   throw Error("Invalid select: all children must be the same component type");
    // }

    // if assign names as a second dimension,
    // then grand children that could be assigned names must be of the same type
    let assignNames = this.doenetAttributes.assignNames;
    this.state.numGrandchildrenNamed = 0;
    if (assignNames !== undefined) {
      for (let item of assignNames) {
        if (Array.isArray(item)) {
          if (item.some(x => Array.isArray(x))) {
            throw Error("Invalid assign names.  Only two levels implemented");
          }
          this.state.numGrandchildrenNamed = Math.max(this.state.numGrandchildrenNamed, item.length)
        }
      }

      // if(this.state.numGrandchildrenNamed > 0) {
      //   let children = this.state.childrenToSelect[0].children;
      //   let grandChildComponentTypes = children.map(x => x.componentType).slice(0, this.state.numGrandchildrenNamed);
      //   for(let ind=1; ind < this.state.childrenToSelect.length; ind++) {
      //     let c = this.state.childrenToSelect[ind].children;
      //     let ctypes = c.map(x => x.componentType).slice(0, this.state.numGrandchildrenNamed);
      //     if(ctypes.length !== grandChildComponentTypes.length ||
      //       ctypes.some((e,i) => e !== grandChildComponentTypes[i])
      //     ) {
      //       throw Error("Invalid select: when have two levels of assignnames, grandchildren types must agree")
      //     }
      //   }
      // }
    }

    this.state.childResults = [];
    for (let child of this.state.childrenToSelect) {
      this.state.childResults.push(this.preprocessSerializedChild({
        serializedComponent: child,
      }));
    }

    // if already have selected indices, then they must have been
    // passed in at the beginning.  Just use those indices.
    if (this.state.selectedIndices.length > 0) {
      return;
    }

    this.state.availableVariants = {};
    for (let [ind, result] of this.state.childResults.entries()) {
      for (let variant of result.availableVariants) {
        let variantLower = variant.toLowerCase();
        if (this.state.availableVariants[variantLower] === undefined) {
          this.state.availableVariants[variantLower] = [];
        }
        this.state.availableVariants[variantLower].push(ind);
      }
    }

    for (let variant in this.state.availableVariants) {
      if (this.state.availableVariants[variant].length !== this.state.numbertoselect) {
        throw Error("Invalid variant for select.  Variant " + variant + " appears in "
          + this.state.availableVariants[variant].length + " options but number to select is "
          + this.state.numbertoselect);
      }
    }

    if (Object.keys(this.state.availableVariants).length > 0) {
      // if have at least one variant specified,
      // then require that all possible variants have a variant specified
      for (let variant of this.sharedParameters.allPossibleVariants) {
        if (!(variant in this.state.availableVariants)) {
          throw Error("Some variants are specified for select but no options are specified for possible variant: " + variant)
        }
      }
      for (let variant in this.state.availableVariants) {
        if (!(this.sharedParameters.allPossibleVariants.includes(variant))) {
          throw Error("Variant " + variant + " that is specified for select is not a possible variant.");
        }
      }
    }


    // if desiredIndices is specfied, use those
    if (this.variants && this.variants.desiredVariant !== undefined) {
      let desiredIndices = this.variants.desiredVariant.indices;
      if (desiredIndices !== undefined) {
        if (desiredIndices.length !== this.state.numbertoselect) {
          throw Error("Number of indices specified for select must match number to select");
        }
        desiredIndices = desiredIndices.map(Number);
        if (!desiredIndices.every(Number.isInteger)) {
          throw Error("All indices specified for select must be integers");
        }
        let n = this.state.numberOfChildren
        desiredIndices = desiredIndices.map(x => ((x % n) + n) % n);

        this.state.selectedIndices = desiredIndices;
        return;
      }
    }


    // first check if have a variant for which options are specified
    let variantOptions = this.state.availableVariants[this.sharedParameters.variant];

    if (variantOptions !== undefined) {

      if (this.state.numbertoselect > 1) {
        // first shuffle the array of indices
        // https://stackoverflow.com/a/12646864
        for (let i = this.state.numbertoselect - 1; i > 0; i--) {
          const rand = this.sharedParameters.selectRng.random();
          const j = Math.floor(rand * (i + 1));
          [variantOptions[i], variantOptions[j]] = [variantOptions[j], variantOptions[i]];
        }
      }
      this.state.selectedIndices = variantOptions;

      return;

    }

    let numberUniqueRequired = 1;
    if (!this.state.withreplacement) {
      numberUniqueRequired = this.state.numbertoselect;
    }

    if (numberUniqueRequired > this.state.numberOfChildren) {
      throw Error("Cannot select " + numberUniqueRequired +
        " components from only " + this.state.numberOfChildren);
    }

    // normalize selectweights to sum to 1
    let selectweightByChild = this.state.childResults.map(x => x.selectweight);
    let totalWeight = selectweightByChild.reduce((a, c) => a + c);
    selectweightByChild = selectweightByChild.map(x => x / totalWeight);

    //https://stackoverflow.com/a/44081700
    let cumulativeWeights = selectweightByChild.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);
    let indsRemaining = [...Array(cumulativeWeights.length).keys()];

    for (let ind = 0; ind < this.state.numbertoselect; ind++) {

      // random number in [0, 1)
      let rand = this.sharedParameters.selectRng.random();

      // find largest index where cumulativeWeight is larger than rand
      // using binary search
      let start = -1, end = cumulativeWeights.length - 1;
      while (start < end - 1) {
        let mid = Math.floor((start + end) / 2); // mid point
        if (cumulativeWeights[mid] > rand) {
          end = mid;
        } else {
          start = mid;
        }
      }

      let selectedInd = indsRemaining[end]
      this.state.selectedIndices.push(selectedInd);

      if (!this.state.withreplacement && ind < this.state.numbertoselect - 1) {
        // remove selected index and renormalize weights
        selectweightByChild.splice(end, 1);
        indsRemaining.splice(end, 1);
        totalWeight = selectweightByChild.reduce((a, c) => a + c);
        selectweightByChild = selectweightByChild.map(x => x / totalWeight);
        cumulativeWeights = selectweightByChild.reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []);

      }
    }

  }

  preprocessSerializedChild({ serializedComponent }) {

    // determine the original namespace of the child when it was created
    let childNamespace, internalChildAlias;

    if (serializedComponent.doenetAttributes.componentAlias !== undefined) {

      childNamespace = serializedComponent.doenetAttributes.componentAlias + "/";

      internalChildAlias = serializedComponent.doenetAttributes.originalName;
      if (internalChildAlias === undefined) {
        internalChildAlias = "_" + serializedComponent.componentType + "1";
      }
      if (serializedComponent.doenetAttributes.alreadyHadNewNamespace) {
        internalChildAlias = this.state.selectNamespace + internalChildAlias;
      } else {
        internalChildAlias = childNamespace + internalChildAlias;
      }
    }

    // check if component has a variants or selectweight children
    // if so, gather information and remove children from component
    let availableVariants = this.extractVariants(serializedComponent);
    let selectweight = this.extractSelectWeight(serializedComponent);

    let namedGrandchildrenAliases = {};
    let nAliases = 0;
    for (let child of serializedComponent.children) {
      if (nAliases >= this.state.numGrandchildrenNamed) {
        break;
      }
      if (child.componentType === "string" || child.doenetAttributes === undefined) {
        continue;  // can't give alias to string or component without alias
      }
      let alias = child.doenetAttributes.componentAlias;
      if (alias === undefined) {
        continue;
      }

      // grandchild should have new namespace
      if (child.doenetAttributes.newNamespace) {
        child.doenetAttributes.alreadyHadNewNamespace = true;
      }
      child.doenetAttributes.newNamespace = true;

      namedGrandchildrenAliases[alias] = { component: child, index: nAliases };
      nAliases++;
    }


    let aliasesFound = {};
    let refsFound = {};

    this.findReferencesAndAliases({
      serializedComponents: serializedComponent.children,
      originalNamespace: childNamespace,
      aliasesFound: aliasesFound,
      refsFound: refsFound,
      namedGrandchildrenAliases: namedGrandchildrenAliases,
    });

    return {
      aliasesFound: aliasesFound,
      refsFound: refsFound,
      internalChildAlias: internalChildAlias,
      namedGrandchildrenAliases: namedGrandchildrenAliases,
      availableVariants: availableVariants,
      selectweight: selectweight,
    }

  }

  findReferencesAndAliases({ serializedComponents, originalNamespace,
    aliasesFound, refsFound, namedGrandchildrenAliases, insideNamedGrandchild }) {
    // recurse through serialized components and collect two types of components
    // 1. All components with an alias
    //    Also, record each alias ending,
    //    which is the alias after the original namespace is removed
    // 2. All references
    //    Also, normalized their form
    // For both sets of components, record the actual components
    // within the preprocessed template so that they can be easily changed

    if (serializedComponents === undefined) {
      return;
    }

    for (let component of serializedComponents) {

      let childrenInsideNamedGrandchild = insideNamedGrandchild;

      let componentAlias;
      if (component.doenetAttributes !== undefined) {
        componentAlias = component.doenetAttributes.componentAlias;
      }

      // if component has an alias,
      // determine alias ending after originalNamespace is removed
      if (componentAlias !== undefined) {
        let componentAliasEnding = componentAlias;

        // if inside a named grandchild that already had a new namespace
        // then delete the entire grandchild name from the alias
        // The children of the named grandchild are already getting a new namespace
        // which should replace the namespace they received 
        // from the original alias of the named grandchild
        let deletedNamedGrandchildFromAliasEnding = false;
        if (insideNamedGrandchild) {
          let namedOne = namedGrandchildrenAliases[insideNamedGrandchild].component;
          if (namedOne.doenetAttributes.alreadyHadNewNamespace) {
            let deleteNamespace = insideNamedGrandchild + '/';
            if (componentAlias.substring(0, deleteNamespace.length) === deleteNamespace) {
              componentAliasEnding = componentAlias.substring(deleteNamespace.length);
              deletedNamedGrandchildFromAliasEnding = true;
            }
          }
        }

        // If an alias begins with the original namespace,
        // delete that portion of the alias
        if (!deletedNamedGrandchildFromAliasEnding) {
          if (componentAlias.substring(0, originalNamespace.length) === originalNamespace) {
            componentAliasEnding = componentAlias.substring(originalNamespace.length);
          }
        }

        // record both the new ending of the alias
        // and the component itself
        aliasesFound[componentAlias] = {
          componentAliasEnding: componentAliasEnding,
          component: component,
          insideNamedGrandchild: insideNamedGrandchild,
        }

        if (componentAlias in namedGrandchildrenAliases) {
          childrenInsideNamedGrandchild = componentAlias;

          // if component has assignnames attribute,
          // then we need to record the aliases it created
          let assignNames = component.doenetAttributes.assignNames;
          if (assignNames !== undefined) {
            let names = flattenDeep(assignNames);
            let aliasNamespace;
            if (component.doenetAttributes.alreadyHadNewNamespace) {
              aliasNamespace = componentAlias + "/";
            } else {
              aliasNamespace = originalNamespace;
            }
            for (let name of names) {
              let originalAlias = aliasNamespace + name;

              // record the alias but with no component,
              // as we simply want to change referenes to this alias
              // but there is no component's alias to change
              aliasesFound[originalAlias] = {
                componentAliasEnding: name,
                insideNamedGrandchild: componentAlias,
              }
            }
          }

        }

      }

      // find all reference and record them in refsFound
      // indexed by their refTargetName
      // At the same time, normalize the reference
      // to record refTargetName in state (rather than a string child)
      // TODO: how to generalize beyond ref?
      if (component.componentType === "ref") {

        let refTargetName = normalizeSerializedRef(component);

        // record that found references in refsFound
        // include actual (serialized) component so that we can alter it
        if (refsFound[refTargetName] === undefined) {
          refsFound[refTargetName] = [];
        }
        refsFound[refTargetName].push(component);

      }

      // recurse
      this.findReferencesAndAliases({
        serializedComponents: component.children,
        originalNamespace: originalNamespace,
        aliasesFound: aliasesFound,
        refsFound: refsFound,
        namedGrandchildrenAliases: namedGrandchildrenAliases,
        insideNamedGrandchild: childrenInsideNamedGrandchild,
      });
    }
  }

  extractVariants(serializedComponent) {
    let variantsChild, variantsInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "variants") {
        if (variantsChild !== undefined) {
          throw Error("A component can have only one variants child");
        }
        variantsChild = child;
        variantsInd = ind;
      }
    }
    if (variantsChild === undefined) {
      return [];
    }

    // remove variants child
    serializedComponent.children.splice(variantsInd, 1);

    let availableVariants = [];

    // extract variants from variantsInd
    // Two options:
    // - variants has single string child
    // - variants has variant children
    if (variantsChild.children.length === 1 && variantsChild.children[0].componentType === "string") {
      availableVariants = variantsChild.children[0].state.value.split(",").map(x => x.trim());
    } else {
      for (let grandchild of variantsChild.children) {
        if (grandchild.componentType !== "variant") {
          throw Error("Invalid variants tag.  It must have either a single string child or all variant children.");
        }
        if (grandchild.children === undefined || grandchild.children.length !== 1 ||
          grandchild.children[0].componentType !== "string") {
          throw Error("Invalid variant tag.  It must have a single string child.");
        }
        availableVariants.push(grandchild.children[0].state.value);
      }
    }

    return availableVariants;

  }

  extractSelectWeight(serializedComponent) {
    let selectweightChild, selectweightInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "selectweight") {
        if (selectweightChild !== undefined) {
          throw Error("A component can have only one selectweight child");
        }
        selectweightChild = child;
        selectweightInd = ind;
      }
    }
    if (selectweightChild === undefined) {
      return 1;
    }

    // remove selectweight child
    serializedComponent.children.splice(selectweightInd, 1);

    if (selectweightChild.children.length === 1 && selectweightChild.children[0].componentType === "string") {
      let selectweight = Number(selectweightChild.children[0].state.value.split(",").map(x => x.trim()));
      if (selectweight >= 0) {
        return selectweight;
      }
      throw Error("Invalid selectweight tag.  It must be a nonnegative number.")
    } else {
      throw Error("Invalid selectweight tag.  It must have a single string child.");
    }

  }

  createSerializedReplacements() {

    if (!this.state.madeSelection || Object.keys(this.unresolvedState).length > 0 ||
      this.state.unresolvedDependenceChain !== undefined) {
      return [];
    } else {
      this.state.createdReplacements = true;
    }

    let replacements = [];

    for (let [replacementNumber, childIndex] of this.state.selectedIndices.entries()) {
      replacements.push(this.createReplacementForChild({
        replacementNumber: replacementNumber,
        childIndex: childIndex
      }))
    }

    // if subvariants were specified, add those the corresponding descendants
    if (this.variants && this.variants.desiredVariant !== undefined) {

      let desiredVariant = this.variants.desiredVariant;
      if (desiredVariant !== undefined && desiredVariant.subvariants !== undefined &&
        this.variants.descendantVariantComponents !== undefined) {

        // collect descendantVariantComponents that would be in select
        // if it just had the selected indicies
        let descendantVariantComponents = [];
        for (let r of replacements) {
          if (r.variants !== undefined) {
            if (r.variants.isVariantComponent) {
              descendantVariantComponents.push(r)
            } else if (r.variants.descendantVariantComponents) {
              descendantVariantComponents.push(...r.variants.descendantVariantComponents);
            }
          }
        }
        for (let ind in desiredVariant.subvariants) {
          let subvariant = desiredVariant.subvariants[ind];
          let variantComponent = descendantVariantComponents[ind];
          if (variantComponent === undefined) {
            break;
          }
          variantComponent.variants.desiredVariant = subvariant;
        }
      }
    }

    // console.log("replacements")
    // console.log(JSON.parse(JSON.stringify(replacements)));
    return replacements;
  }

  createReplacementForChild({ replacementNumber, childIndex }) {

    let serializedChild = this.state.childrenToSelect[childIndex];

    let originalChildNamespace = serializedChild.doenetAttributes.componentAlias;
    let originalChildNamespaceLength;
    if (originalChildNamespace !== undefined) {
      originalChildNamespace += "/";
      originalChildNamespaceLength = originalChildNamespace.length;
    }

    let childResults = this.state.childResults[childIndex];

    let childName;
    let grandchildrenNames = [];

    let assignNames = this.doenetAttributes.assignNames;

    if (assignNames !== undefined && replacementNumber < assignNames.length) {
      if (Array.isArray(assignNames[replacementNumber])) {
        grandchildrenNames = assignNames[replacementNumber];
      } else {
        childName = assignNames[replacementNumber];
      }
    }

    // create an obscure name for components that cannot be reffed
    let namespaceForNonReffable = "_" + this.componentName + "_" + replacementNumber
    if (childName === undefined) {
      // if nothing specified, child itself has obscure name
      childName = namespaceForNonReffable;
    }
    namespaceForNonReffable += "/";

    // prepend select's namespace
    if (this.state.selectNamespace !== undefined) {
      childName = this.state.selectNamespace + childName;
      grandchildrenNames = grandchildrenNames.map(x => this.state.selectNamespace + x);
      namespaceForNonReffable = this.state.selectNamespace + namespaceForNonReffable;
    }

    let newNamespace = childName + "/";



    // give child the alias of childname
    serializedChild.doenetAttributes.componentAlias = childName;

    // for each alias found, change it to the new namespace
    // by prepending the childname to the componentAliasEnding
    for (let originalAlias in childResults.aliasesFound) {
      let aliasObject = childResults.aliasesFound[originalAlias];
      let component = aliasObject.component;
      let insideNamedGrandchild = aliasObject.insideNamedGrandchild;
      let namedGrandchildObj = childResults.namedGrandchildrenAliases[originalAlias];
      let newAlias;
      if (namedGrandchildObj !== undefined) {
        newAlias = grandchildrenNames[namedGrandchildObj.index];
      } else if (insideNamedGrandchild !== undefined) {
        let index = childResults.namedGrandchildrenAliases[insideNamedGrandchild].index;
        let grandChildNamespace = grandchildrenNames[index] + '/';
        if (aliasObject.componentAliasEnding.substring(0, 1) === '_') {
          // since we aren't renumbering component names
          // make component without an author name non-reffable
          // If we want to make it reffable, we should renumber all components
          // inside named grandchildren
          newAlias = grandChildNamespace + '__' + aliasObject.componentAliasEnding
        } else {
          newAlias = grandChildNamespace + aliasObject.componentAliasEnding
        }
      } else {
        newAlias = newNamespace + aliasObject.componentAliasEnding;
      }

      // it is possible component was not defined
      // because alias may have come from assignnames
      // in which case we only want to change references to the new alias
      if (component !== undefined) {
        component.doenetAttributes.componentAlias = newAlias;
      }

      // change any references to this component to the new alias
      if (originalAlias in childResults.refsFound) {
        for (let refComp of childResults.refsFound[originalAlias]) {
          // find reftarget child
          for (let child of refComp.children) {
            if (child.componentType === "reftarget") {
              child.state.refTargetName = newAlias;
              break;
            }
          }
        }
      }
    }

    // look for refs to child itself
    if (childResults.internalChildAlias in childResults.refsFound) {
      for (let refComp of childResults.refsFound[childResults.internalChildAlias]) {
        // find reftarget child
        for (let child of refComp.children) {
          if (child.componentType === "reftarget") {
            child.state.refTargetName = childName;
            break;
          }
        }
      }
    }

    // look for any remaining ref targets that begin with original namespace
    // and change to point to new namespace
    if (originalChildNamespace) {
      for (let originalAlias in childResults.refsFound) {
        if (!(originalAlias in childResults.aliasesFound) &&
          originalAlias !== childResults.internalChildAlias) {
          if (originalAlias.substring(0, originalChildNamespaceLength) === originalChildNamespace) {
            let newAlias = newNamespace + originalAlias.substring(originalChildNamespaceLength);
            for (let refComp of childResults.refsFound[originalAlias]) {
              // find reftarget child
              for (let child of refComp.children) {
                if (child.componentType === "reftarget") {
                  child.state.refTargetName = newAlias;
                  break;
                }
              }
            }
          }
        }
      }
    }


    let childWithSubstitutions = deepClone(serializedChild);

    if (this.state.hide) {
      if (childWithSubstitutions.state === undefined) {
        childWithSubstitutions.state = {};
      }
      childWithSubstitutions.state.hide = true;

      if(grandchildrenNames.length > 0) {
        if(childWithSubstitutions.children) {
          for(let grandChild of childWithSubstitutions.children) {
            if(grandChild.state === undefined) {
              grandChild.state = {};
            }
            grandChild.state.hide = true;
          }

        }
      }
    }

    return childWithSubstitutions;

  }

  calculateReplacementChanges(componentChanges) {

    if (!this.state.madeSelection || Object.keys(this.unresolvedState).length > 0 ||
      this.state.unresolvedDependenceChain !== undefined || this.state.createdReplacements) {
      return [];
    }

    let replacementChanges = [];

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: 0,
      serializedReplacements: this.createSerializedReplacements(),
    };
    replacementChanges.push(replacementInstruction);

    return replacementChanges;

  }


  static determineNumberOfUniqueVariants({ serializedComponent }) {
    let numbertoselect = 1, withreplacement = false;
    let numberOfVariantsByChild = [];
    let childrenToSelect = [];
    if (serializedComponent.state !== undefined) {
      if (serializedComponent.state.numbertoselect !== undefined) {
        numbertoselect = serializedComponent.state.numbertoselect;
      }
      if (serializedComponent.state.withreplacement !== undefined) {
        withreplacement = serializedComponent.state.withreplacement;
      }
    }
    if (serializedComponent.children === undefined) {
      return { succes: false }
    }

    let stringChild;
    for (let child of serializedComponent.children) {
      let componentType = child.componentType;
      if (componentType === "numbertoselect") {
        // calculate numbertoselect only if has its value set directly
        // or if has a child that is a string
        let foundValid = false;
        if (child.state !== undefined && child.state.value !== undefined) {
          numbertoselect = Math.round(Number(child.state.value));
          foundValid = true;
        }
        // children overwrite state
        if (child.children !== undefined) {
          for (let grandchild of child.children) {
            if (grandchild.componentType === "string") {
              numbertoselect = Math.round(Number(grandchild.state.value));
              foundValid = true;
              break;
            }
          }
        }
        if (!foundValid) {
          return { success: false }
        }
      } else if (componentType === "withreplacement") {
        // calculate withreplacement only if has its implicitValue or value set directly
        // or if has a child that is a string
        let foundValid = false;
        if (child.state !== undefined) {
          if (child.state.implicitValue !== undefined) {
            withreplacement = child.state.implicitValue;
            foundValid = true;
          }
          if (child.state.value !== undefined) {
            withreplacement = child.state.value;
            foundValid = true;
          }
        }
        // children overwrite state
        if (child.children !== undefined) {
          for (let grandchild of child.children) {
            if (grandchild.componentType === "string") {
              foundValid = true;
              if (["true", "t"].includes(grandchild.state.value.trim().toLowerCase())) {
                withreplacement = true;
              } else {
                withreplacement = false;
              }
              break;
            }
          }
        }

        if (!foundValid) {
          return { success: false }
        }

      } else if (componentType === "selectweight") {
        // uniquevariants disabled if have a child with selectweight specified
        return { succes: false }
      } else if (componentType !== "hide" && componentType !== "modifybyreference") {
        if (componentType === "string") {
          stringChild = child;
        }
        let childvariants = 1;
        if (child.variants !== undefined && child.variants.numberOfVariants !== undefined) {
          childvariants = child.variants.numberOfVariants;
        }
        numberOfVariantsByChild.push(childvariants);
        childrenToSelect.push(child);
      }
    }
    // console.log("numberOfVariantsByChild")
    // console.log(numberOfVariantsByChild)
    if (numberOfVariantsByChild.length === 0) {
      return { success: false }
    }

    // if have one string child, it will be broken into children by commas
    // account for number of resulting children, each with one variant
    if (stringChild !== undefined && numberOfVariantsByChild.length === 1) {
      let numPieces = stringChild.state.value.split(",").length;
      numberOfVariantsByChild = Array(numPieces).fill(1);
    }

    let uniqueVariantData = {
      numberOfVariantsByChild: numberOfVariantsByChild,
      numbertoselect: numbertoselect,
      withreplacement: withreplacement,
      childrenToSelect: childrenToSelect,
    }

    if (withreplacement || numbertoselect === 1) {
      let numberOfOptionsPerSelection = numberOfVariantsByChild.reduce((a, c) => a + c);
      let numberOfVariants = Math.pow(numberOfOptionsPerSelection, numbertoselect);
      return {
        success: true,
        numberOfVariants: numberOfVariants,
        uniqueVariantData: uniqueVariantData,
      }
    }
    let numberOfChildren = numberOfVariantsByChild.length;

    if (numbertoselect > numberOfChildren) {
      return { success: false }
    }

    let firstNumber = numberOfVariantsByChild[0]
    let allSameNumber = numberOfVariantsByChild.slice(1).every(x => x === firstNumber);

    if (allSameNumber) {
      let numberOfPermutations = numberOfChildren;
      for (let n = numberOfChildren - 1; n > numberOfChildren - numbertoselect; n--) {
        numberOfPermutations *= n;
      }
      let numberOfVariants = numberOfPermutations * Math.pow(firstNumber, numbertoselect);
      return {
        success: true,
        numberOfVariants: numberOfVariants,
        uniqueVariantData: uniqueVariantData,
      }
    }

    // have select without replacement where options have different numbers of variants
    let numberOfVariants = countOptions(numberOfVariantsByChild, numbertoselect);
    return {
      success: true,
      numberOfVariants: numberOfVariants,
      uniqueVariantData: uniqueVariantData,
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

    let uniqueVariantData = serializedComponent.variants.uniqueVariantData;
    let numberOfVariantsByChild = uniqueVariantData.numberOfVariantsByChild;
    let numbertoselect = uniqueVariantData.numbertoselect;
    let withreplacement = uniqueVariantData.withreplacement;
    let numberOfChildren = numberOfVariantsByChild.length;
    let childrenToSelect = uniqueVariantData.childrenToSelect;

    let combinations = enumerateSelectionCombinations({
      numberOfIndices: numbertoselect,
      numberOfOptions: numberOfChildren,
      maxNumber: variantNumber + 1,
      withReplacement: withreplacement,
    })

    // console.log(combinations);

    let numberOfCombinations = combinations.length;
    // console.log("number of combinations: " + numberOfCombinations);

    // for each combination, determine the number of possibilities
    let combinationsAvailable = combinations.map(x => ({
      combination: x,
      numberOfPossibilities: x.reduce((a, c) => a * numberOfVariantsByChild[c], 1),
    }))

    // console.log(combinationsAvailable);
    // console.log(numberOfVariantsByChild);

    // The variants, in order, will
    // select the first possibility from each combination
    // followed by the second possibility, etc.
    // When the possibilities from the combination are exhaust
    // skip that combination

    let combinationsLeft = [...Array(numberOfCombinations).keys()];
    let possibilitiesUsed = 0;
    let nCombinationsLeft = combinationsLeft.length;
    let combinationIndexSelected, variantNumberOfSelected;

    let variantNumberLeft = variantNumber;

    while (nCombinationsLeft > 0) {

      // find minimum number of possibilities in those that are left

      let minNumPos = combinationsLeft.map(ind => combinationsAvailable[ind])
        .reduce((a, c) => Math.min(a, c.numberOfPossibilities), Infinity);

      let chunksize = minNumPos - possibilitiesUsed;

      if (variantNumberLeft < chunksize * nCombinationsLeft) {
        // won't exhaust the possibilities for any combination
        combinationIndexSelected = combinationsLeft[variantNumberLeft % nCombinationsLeft];
        variantNumberOfSelected = possibilitiesUsed + Math.floor(variantNumberLeft / nCombinationsLeft);
        break;
      } else {
        possibilitiesUsed += chunksize;
        variantNumberLeft -= chunksize * nCombinationsLeft;
        combinationsLeft = combinationsLeft.filter(
          ind => combinationsAvailable[ind].numberOfPossibilities > possibilitiesUsed
        );
        nCombinationsLeft = combinationsLeft.length;

      }

    }

    // console.log("combinationIndexSelected: " + combinationIndexSelected)
    // console.log("variantNumberOfSelected: " + variantNumberOfSelected)

    let selectedCombination = combinations[combinationIndexSelected];
    // console.log("selectedCombination: " + selectedCombination)

    let indicesForEachChild = enumerateCombinations({
      numberOfOptionsByIndex: selectedCombination.map(x => numberOfVariantsByChild[x]),
      maxNumber: variantNumberOfSelected + 1,
    })[variantNumberOfSelected];

    // console.log("indicesForEachChild: " + indicesForEachChild)

    // for each selected child, find the descendant variant components
    // and map the variant number (index) of that child
    // to the indices of those descendat variant components


    let subvariants = [];

    let haveNontrivialSubvariants = false;
    for (let [ind, childNum] of selectedCombination.entries()) {
      if (numberOfVariantsByChild[childNum] > 1) {
        let child = childrenToSelect[childNum];
        if (child.variants.isVariantComponent) {
          let compClass = allComponentClasses[child.componentType];
          let result = compClass.getUniqueVariant({
            serializedComponent: child,
            variantNumber: indicesForEachChild[ind],
            allComponentClasses: allComponentClasses,
          });
          if (!result.success) {
            return { success: false }
          }
          subvariants.push(result.desiredVariant);
        } else {
          let result = getVariantsForDescendants({
            variantNumber: indicesForEachChild[ind],
            serializedComponent: child,
            allComponentClasses: allComponentClasses
          })
          if (!result.success) {
            return { success: false }
          }
          subvariants.push(...result.desiredVariants);
        }
        haveNontrivialSubvariants = true;
      } else {
        subvariants.push({});
      }
    }

    let desiredVariant = { indices: selectedCombination };
    if (haveNontrivialSubvariants) {
      desiredVariant.subvariants = subvariants;
    }
    return { success: true, desiredVariant: desiredVariant }

  }

}


function numbersOrTextFromString(s) {
  let pieces = s.split(",").map(x => x.trim());

  let foundNumbers = pieces.every(x => Number.isFinite(Number(x)));
  if (foundNumbers) {
    pieces = pieces.map(Number)
  }

  let componentType = foundNumbers ? "number" : "text";

  return pieces.map(x => ({
    componentType: componentType,
    state: { value: x }
  }));

}



// counts the number of options (including permutations)
// where you can select numItems from numOptionsByItem (without replacement)
// and each select gets multiplied by the total number of options of that selection
let countOptions = function (numOptionsByItem, numItems) {
  if (numItems === 0) {
    return 0;
  }
  if (numItems === 1) {
    // if select just one item, simply add up all the different options
    return numOptionsByItem.reduce((a, c) => a + c);
  }
  let numOptions = 0;
  for (let ind in numOptionsByItem) {
    let num = numOptionsByItem[ind];
    let rest = [...numOptionsByItem];
    rest.splice(ind, 1); // remove selected item
    numOptions += num * countOptions(rest, numItems - 1);
  }
  return numOptions;
}


// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flattenDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}