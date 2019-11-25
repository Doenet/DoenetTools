import CompositeComponent from './abstract/CompositeComponent';
import me from 'math-expressions';

export default class Map extends CompositeComponent {
  static componentType = "map";

  static childrenToAssignNamespaces = ["template"];

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.behavior = {default: "combination"};
    return properties;
  }
  
  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let ExactlyOneTemplate = childLogic.newLeaf({
      name: "ExactlyOneTemplate",
      componentType: 'template',
      number: 1
    });

    let AtLeastOneSubstitutions = childLogic.newLeaf({
      name: "AtLeastOneSubstitutions",
      componentType: 'substitutions',
      comparison: "atLeast",
      number: 1
    });

    childLogic.newOperator({
      name: "TemplateSubstitutions",
      operator: 'and',
      propositions: [ExactlyOneTemplate, AtLeastOneSubstitutions],
      setAsBase: true,
    });

    return childLogic;

  }

  updateState(args={}) {
    if(args.init === true) {
      this.replacementsToWithhold = 0;
      this.allowSugarInSerializedReplacements = true;
    }
    
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.nSubstitutions = true;
      this.unresolvedState.nIterates = true;
      this.serializedReplacements = [];
      return;
     }

    delete this.unresolvedState.nSubstitutions;
    delete this.unresolvedState.nIterates;

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      this.state.template = this.activeChildren[this.childLogic.returnMatches("ExactlyOneTemplate")[0]];
      this.state.substitutions = this.childLogic.returnMatches("AtLeastOneSubstitutions").map(x => this.activeChildren[x]);
      this.state.nSubstitutions = this.state.substitutions.length;
      this.state.substitutionsNames = this.state.substitutions.map(x => x.componentName);
    }

    if(childrenChanged || trackChanges.getVariableChanges({
      component:this.state.template, variable: "lastSerializedChildren"
    })) {
      this.state.templateString = JSON.stringify(this.state.template.serializedChildren);
      this.state.nChildrenInTemplate = this.state.template.serializedChildren.length;
      this.preprocessTemplate();
    }

    if(this.state.substitutions.some(x => x.unresolvedState.nIterates)) {
      this.unresolvedState.nIterates = true;
      this.serializedReplacements = [];
      return;
    }


    let nIteratesChanged = this.state.substitutions.some(
      x=> trackChanges.getVariableChanges({
        component: x, variable: "nIterates"
    }));

    if(childrenChanged || nIteratesChanged) {

      this.state.nIterates = this.state.substitutions.map(x => x.state.nIterates);

      // calculate scalar minNIterates, a scalar holding the minimum value
      this.state.minNIterates = Math.min(...this.state.nIterates);
    }

    if(this.unresolvedState.behavior) {
      this.serializedReplacements = [];
      return;
    }else if(nIteratesChanged || trackChanges.getVariableChanges({
      component: this, variable: "behavior"
    })) {

      this.state.invalidBehavior = false;
      if(this.state.behavior === "parallel") {
        // display warning if some substitutions activeChildren have differ numbers of iterates
        if(this.state.nIterates.slice(1).some(x => x!= this.state.nIterates[0])) {
          console.log("Warning: map with parallel behavior and different numbers of iterates in substitutions activeChildren." +
            " Extra iterates will be ignored.");
        }
      }else if(this.state.behavior !== "combination" ) {
        console.warn("Invalid map behavior: " + this.state.behavior);
        this.serializedReplacements = [];
        this.state.invalidBehavior = true;
        return;
      }
    }

    if(args.init=== true) {
      this.serializedReplacements = this.createSerializedReplacements();
    }

    // console.log(this.state.preprocessedTemplate);
    // console.log(this.state.aliasesFound)
    // console.log(this.state.refsFound);
    // console.log(this.state.originalNamespace);
    // console.log("*************");

  }

  createSerializedReplacements() {

    this.state.lastReplacementParameters = {
      substitutionsNames: this.state.substitutionsNames.slice(),
      behavior: this.state.behavior,
      nIterates: this.state.nIterates.slice(),
      minNIterates: this.state.minNIterates,
    }

    let serializedComponents = [];

    if(this.state.behavior === "parallel") {
      for(let iter = 0; iter < this.state.minNIterates; iter++) {

        let newComponents = this.substitutionIntoTemplate({
          childnumbers: Array(this.state.nSubstitutions).fill(iter+1),
          iterateNumber: iter,
        });

        serializedComponents = [...serializedComponents, 
          ...newComponents];
      }
    }else {
      //behavior is combination
      // A better solution here?
      // https://stackoverflow.com/a/51470002
      let results = this.recurseThroughCombinations({
        substitutionsNumber: 0,
        iterateNumber: -1,
      });
      serializedComponents = results.newComponents;
    }

    return serializedComponents;
  }

  recurseThroughCombinations({substitutionsNumber, childnumberArray = [], iterateNumber}) {
    let serializedComponents = [];
    let newComponents;
    let newChildnumberArray = [...childnumberArray, 1];

    for(let iter=1; iter <= this.state.nIterates[substitutionsNumber]; iter++) {
      newChildnumberArray[substitutionsNumber] = iter;
      if(substitutionsNumber >= this.state.nSubstitutions-1) {
        iterateNumber++;
        newComponents = this.substitutionIntoTemplate({
          childnumbers: newChildnumberArray,
          iterateNumber: iterateNumber,
        })
      }else {
        let results = this.recurseThroughCombinations({
          substitutionsNumber: substitutionsNumber+1,
          childnumberArray: newChildnumberArray,
          iterateNumber: iterateNumber,
        });
        newComponents = results.newComponents;
        iterateNumber = results.iterateNumber;
      }
      serializedComponents = [...serializedComponents, ...newComponents];
    }
    return {newComponents: serializedComponents, iterateNumber: iterateNumber};
  }

  substitutionIntoTemplate({childnumbers, iterateNumber}) {
    // Given that we have a preprocessed template with 
    // - pointers to all components with aliases (and their alias endings)
    // - pointers to all references (normalized with refTargetName in state)
    // change the actual components within the preprocessed template as follows
    // 1. Determine the new namespace based on iterateNumber, 
    //    the map's namespace, and any assignNamespace parameter
    //    (using an obsure namespace that's not intended to be referenced
    //    in the case that don't have a namespace assigned)
    // 2. Prepend this namespace to the componentAliasEnding already
    //    determined for each aliased component
    // 3. For any references to those components, update the refTargetName
    //    to the new alias
    // 4. For any references to aliases of substitutions, change the childnumber
    //    based on the childnumbers argument
    // Since these operations change the actual preprocessedTemplate,
    // return a deep copy of the preprocessedTemplate

    let namespace;
    let assignNamespaces = this.doenetAttributes.assignNamespaces;

    if(assignNamespaces !== undefined && iterateNumber < assignNamespaces.length) {
      namespace = assignNamespaces[iterateNumber];
    }else {
      // if nothing specified, create an obscure name
      namespace = this.componentName.substring(this.componentName.lastIndexOf('/')+1);
      namespace = "_" + namespace + "_" + iterateNumber;
    }
    
    // prepend map's namespace
    if(this.state.mapNamespace !== undefined) {
      namespace = this.state.mapNamespace + namespace;
    }

    // for each alias found, change it to the new namespace
    // by prepending the namespace to the componentAliasEnding
    for(let originalAlias in this.state.aliasesFound) {
      let aliasObject = this.state.aliasesFound[originalAlias];
      let component = aliasObject.component;
      let newAlias = namespace + aliasObject.componentAliasEnding;
      component.doenetAttributes.componentAlias = newAlias;

      // change any references to this component to the new alias
      if(originalAlias in this.state.refsFound) {
        for(let refComp of this.state.refsFound[originalAlias]) {
          // find reftarget child
          for(let child of refComp.children) {
            if(child.componentType === "reftarget") {
              child.state.refTargetName = newAlias;
              break;
            }
          }
        }

      }
    }

    // look for references to substitutionsNames
    // whose state indicates they were from subsrefs
    // change their childnumbers
    for(let ind in this.state.substitutionsNames) {
      let substitutionAlias = this.state.substitutionsNames[ind];
      if(substitutionAlias in this.state.refsFound) {
        for(let refComp of this.state.refsFound[substitutionAlias]) {
          if(refComp.state.fromSubsref === true) {
            if(refComp.children === undefined) {
              refComp.children = [];
            }
            let foundChildNumber = false;
            for(let child of refComp.children) {
              if(child.componentType === "childnumber") {
                foundChildNumber = true;
                child.state.value = childnumbers[ind];
                break;
              }
            }
            if(!foundChildNumber) {
              refComp.children.push({
                componentType: "childnumber",
                state: {value: childnumbers[ind]}
              });
            }
          } else if(refComp.state.fromSubsindex === true) {
            refComp.state.value = childnumbers[ind];
          }
        }
      }
    }

    let templateWithSubstitutions = JSON.parse(
      JSON.stringify(this.state.preprocessedTemplate),
      me.reviver
    );
    // console.log("templateWithSubstitutions");
    
    // console.log(templateWithSubstitutions);

    // console.log(namesAltered);
    // console.log(refsFound);

    return templateWithSubstitutions;
  }

  preprocessTemplate() {
    // deep copy the template (which is serialized),
    // then create data structures to facilitate changing namespaces and refs
    // 1. Record what original namespace in which the template was created
    // 2. Find all aliases, and record their ending
    //    (after original namespace is removed)
    // 3. Find all references, normalize the form of their reference target
    // For both aliases and references, record that actual components
    // within the preprocessed template, so that they can be quickly changed
    
    // deep copy the template
    this.state.preprocessedTemplate = JSON.parse(
      this.state.templateString,
      me.reviver
    );
    
    this.state.aliasesFound = {};
    this.state.refsFound = {};
    this.state.originalNamespace;

    //TODO: NAMESPACES SHOULD BE IN CORE 

    // determine the namespace of the map
    let mapAlias = this.doenetAttributes.componentAlias;
    if(mapAlias !== undefined) {
      if(this.doenetAttributes.newNamespace === true) {
        this.state.mapNamespace = mapAlias + "/";
      }else {
        //Grab everything at the begining up to and including the slash
        this.state.mapNamespace = mapAlias.substring(0, mapAlias.lastIndexOf('/')+1);
      }
    }

    // determine the original namespace of the template when it was created
    let assignNamespaces = this.doenetAttributes.assignNamespaces;
    // if assignNamespace was defined, then components originally have first one
    if(assignNamespaces !== undefined) {
      this.state.originalNamespace = assignNamespaces[0];
    }
    else {
      this.state.originalNamespace = "";
    }
    // prepend map's namespace
    // this.state.originalNamespace should be the namespace of the template
    if(this.state.mapNamespace !== undefined) {
      this.state.originalNamespace = this.state.mapNamespace + this.state.originalNamespace;
    }

    this.state.originalNamespaceLength = this.state.originalNamespace.length;

    this.findReferencesAndAliases({
      serializedComponents: this.state.preprocessedTemplate
    });

    // console.log("**** preprocessed template ****");
    // console.log(JSON.parse(JSON.stringify(this.state.preprocessedTemplate)));

  }

  findReferencesAndAliases({serializedComponents, templateNumber = 1}) {
    // recurse through serialized components and collect two types of components
    // 1. All components with an alias
    //    Also, record each alias ending,
    //    which is the alias after the original template namespace is removed
    // 2. All references
    //    Also, normalized their form 
    // For both sets of components, record the actual components
    // within the preprocessed template so that they can be easily changed

    if(serializedComponents === undefined) {
      return;
    }

    for(let component of serializedComponents) {

      let componentAlias;
      if(component.doenetAttributes !== undefined) {
        componentAlias = component.doenetAttributes.componentAlias;
      }

      // if component has an alias,
      // determine alias ending after originalNamespace is removed
      if(componentAlias !== undefined) {
        let componentAliasEnding = componentAlias;

        // If an alias begins with the original namespace,
        // delete that portion of the alias
        if(componentAlias.substring(0,this.state.originalNamespaceLength) === this.state.originalNamespace) {
          componentAliasEnding = componentAlias.substring(this.state.originalNamespaceLength);
        }

        // record both the new ending of the alias
        // and the component itself
        this.state.aliasesFound[componentAlias] = {
          componentAliasEnding: componentAliasEnding,
          component: component,
        }

      }

      // find all reference and record them in refsFound
      // indexed by their refTargetName
      // At the same time, normalize the reference
      // to record refTargetName in state (rather than a string child)
      // TODO: how to generalize beyond ref?
      if(component.componentType==="ref") {
        let refTargetName;

        // find the refTarget child
        let refTargetChild;
        for(let child of component.children) {
          if(child.componentType === "reftarget") {
            refTargetChild = child;
            break;
          }
        }
        // if no refTargetChild, then check for string child
        // which we have to do since sugar may not have been applied
        if(refTargetChild === undefined) {
          for(let childInd=0; childInd< component.children.length; childInd++) {
            let child = component.children[childInd];
            if(child.componentType==="string") {
              refTargetName = child.state.value;

              // delete the string child and create a refTarget child
              component.children[childInd] = {
                componentType: "reftarget",
                state: {refTargetName: refTargetName}
              }
            }
          }
        } else {
          // found a refTargetChild
          
          // first look to see if refTargetName is defined in state
          if(refTargetChild.state !== undefined) {
            refTargetName = refTargetChild.state.refTargetName;
          }

          // if not, look for first string child
          if(refTargetName === undefined) {
            for(let childInd=0; childInd< refTargetChild.children.length; childInd++) {
              let child = refTargetChild.children[childInd];
              if(child.componentType==="string") {
                refTargetName = child.state.value;

                // for consistency, we'll change the form of the reftarget
                // so that the refTargetName is stored in state
                // rather than child.
                // That way, we don't have to deal with cases
                // when processing the refs
                refTargetChild.children.splice(childInd,1); // delete child
                childInd--;
                if(refTargetChild.state === undefined) {
                  refTargetChild.state = {};
                }
                refTargetChild.state.refTargetName = refTargetName; // store in state
              }
            }
          }
        }

        // record that found references in refsFound
        // include actual (serialized) component so that we can alter it
        if(this.state.refsFound[refTargetName] === undefined) {
          this.state.refsFound[refTargetName] = [];
        }
        this.state.refsFound[refTargetName].push(component);

      }

      // if subsref, then
      // 1. if no refTargetName, use alias of first substitutions
      // 2. convert the subsref into a ref
      // 3. record it in subsrefsFound
      if(component.componentType === "subsref" || component.componentType === "subsindex") {

        let ctype = component.componentType;

        let substitutionNumber = 1;
        let substitutionChildNumber;
        let parentTemplate = 1;
        let parentTemplatesFound = 0;
        let parentTemplateChildNumber;

        for(let childInd = 0; childInd < component.children.length; childInd++) {
          let child = component.children[childInd];
          if(child.componentType === "string") {
            substitutionNumber = Number(child.state.value);
            if(!Number.isInteger(substitutionNumber) || substitutionNumber <= 0) {
              throw Error(`${ctype} must be a positive integer`);
            }
            if(parentTemplate === templateNumber && 
                substitutionNumber > this.state.nSubstitutions) {
              throw Error(`${ctype} cannot be greater than number of substitutions`)
            }
            substitutionChildNumber = childInd;
          }else if(child.componentType === "childnumber") {
            throw Error(`Invalid child: ${ctype} cannot have a childnumber`);
          }else if(child.componentType === "parenttemplate") {
            if(child.children.length !== 1) {
              throw Error(`Bad parentTemplate of ${ctype}`);
            }
            parentTemplate = Number(child.children[0].state.value);
            parentTemplatesFound++;
            if(parentTemplatesFound > 1) {
              throw Error(`Multiple parentTemplates in ${ctype}`);
            }
            if(!Number.isInteger(parentTemplate) || parentTemplate <= 0) {
              throw Error(`parentTemplate in ${ctype} must be a positive integer`);
            }
            if(parentTemplate > templateNumber) {
              throw Error(`parentTemplate in ${ctype} too large`);
            }
            parentTemplateChildNumber = childInd;
          }
          
        }

        // if substitutionNumber or parentTemplate is already defined in state
        // they override the values
        if(component.state !== undefined) {
          if(component.state.substitutionNumber !== undefined) {
            substitutionNumber = component.state.substitutionNumber;
          }
          if(component.state.parentTemplate !== undefined) {
            parentTemplate = component.state.parentTemplate;
          }
        }

        //turn the subsref into a ref and the subsindex into a number
        if(parentTemplate === templateNumber) {

          if(substitutionChildNumber !== undefined) {
            component.children.splice(substitutionChildNumber,1); // delete child
          }
          if(parentTemplateChildNumber !== undefined) {
            component.children.splice(parentTemplateChildNumber,1); // delete child
          }
          
          let refTargetName = this.state.substitutionsNames[substitutionNumber-1];

          if(ctype === "subsref") {
            component.componentType = "ref";

            // modify refTarget name, creating a reftarget child, if needed
            let refTarget;
            for(let child of component.children) {
              if(child.componentType === "reftarget") {
                refTarget = child;
                break;
              }
            }
            if(refTarget === undefined) {
              component.children.push({
                componentType: "reftarget",
                state: {refTargetName: refTargetName}
              })
            }else {
              refTarget.state.refTargetName = refTargetName;
            }

            if(component.state === undefined) {
              component.state = {};
            }
            component.state.fromSubsref = true;

          } else {
            // turn subsindex into a number
            component.componentType = "number";

            // delete refTarget child, if found
            for(let [index, child] of component.children) {
              if(child.componentType === "reftarget") {
                component.children.splice(index, 1);
                break;
              }
            }

            if(component.state === undefined) {
              component.state = {};
            }
            component.state.fromSubsindex = true;

            component.state.value = 0;

          }


          component.state.substitutionNumber = substitutionNumber;
          component.state.parentTemplate = parentTemplate;

          // record that found references in refsFound
          // include actual (serialized) component so that we can alter it
          if(this.state.refsFound[refTargetName] === undefined) {
            this.state.refsFound[refTargetName] = [];
          }
          this.state.refsFound[refTargetName].push(component);

        }

      }
      
      let templateNumberForChildren = templateNumber;
      if (component.componentType==="template") {
        templateNumberForChildren++;
      }
      
      // recurse
      this.findReferencesAndAliases({
        serializedComponents: component.children,
        templateNumber: templateNumberForChildren
      });
    }
  }

  calculateReplacementChanges(componentChanges) {

    let replacementChanges = [];

    // if unresolved or invalid behavior, have no replacements
    if(Object.keys(this.unresolvedState).length > 0 || this.state.invalidBehavior) {
      delete this.state.lastReplacementParameters;
      if(this.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: this.replacements.length,
        }

        replacementChanges.push(replacementInstruction);
      }
      return replacementChanges;
    }


    let allSameSubstitutionsNames = true;
    for(let ind=0; ind < this.state.substitutionsNames.length; ind++) {
      if(this.state.substitutionsNames[ind] !==
        this.state.lastReplacementParameters.substitutionsNames[ind]) {
        allSameSubstitutionsNames = false;
        break;
      }
    } 

    // if substitutions names, template string or behavior changed,
    // need to recalculate all replacements

    if(!allSameSubstitutionsNames ||
      this.state.lastReplacementParameters.behavior !== this.state.behavior) {
 
      let newSerializedReplacements = this.createSerializedReplacements();

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: this.replacements.length,
        serializedReplacements: newSerializedReplacements,
        replacementsToWithhold: 0,
      };

      replacementChanges.push(replacementInstruction);

    }else {
      // same substitution names, template, and behavior
      
      // if number of iterates is unchanged, don't do anything
      let allSameNIterates = true;
      for(let ind=0; ind < this.state.nIterates.length; ind++) {
        if(this.state.nIterates[ind] !==
          this.state.lastReplacementParameters.nIterates[ind]) {
          allSameNIterates = false;
          break;
        }
      }
      if(allSameNIterates) {
        return [];
      }
      
      // for combinations with more than one substitution,
      // just recreate everything if iterates have changed
      if(this.state.behavior === "combination" && 
      this.state.nSubstitutions !== this.state.lastReplacementParameters.substitutionsNames.length) {
        let newSerializedReplacements = this.createSerializedReplacements();

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToReplace: this.replacements.length,
          serializedReplacements: newSerializedReplacements,
          replacementsToWithhold: 0,
        };
  
        replacementChanges.push(replacementInstruction);
  
      }else {
        // parallel or combination with just one substitutions (which behaves as parallel)
        // We can just work with minNIterates

        let prevMinNIterates = this.state.lastReplacementParameters.minNIterates;
        let newReplacementsToWithhold=0;

        // if have fewer iterates than before
        // mark old replacements as hidden
        if(this.state.minNIterates < prevMinNIterates) {
          
          newReplacementsToWithhold = this.replacementsToWithhold + 
            (prevMinNIterates - this.state.minNIterates)*this.state.nChildrenInTemplate;

          let replacementInstruction = {
            changeType: "changedReplacementsToWithhold",
            replacementsToWithhold: newReplacementsToWithhold,
          };
          replacementChanges.push(replacementInstruction);   
    
        }else if(this.state.minNIterates > prevMinNIterates) {
          let numReplacementsToAdd = (this.state.minNIterates - prevMinNIterates)*this.state.nChildrenInTemplate;
          if(this.replacementsToWithhold > 0) {
            if(this.replacementsToWithhold >= numReplacementsToAdd) {
              newReplacementsToWithhold = this.replacementsToWithhold -
                numReplacementsToAdd;
              numReplacementsToAdd = 0;

              let replacementInstruction = {
                changeType: "changedReplacementsToWithhold",
                replacementsToWithhold: newReplacementsToWithhold,
              };
              replacementChanges.push(replacementInstruction);   

            } else {
              numReplacementsToAdd -= this.replacementsToWithhold;
              prevMinNIterates += Math.round(this.replacementsToWithhold/this.state.nChildrenInTemplate);
              newReplacementsToWithhold = 0;
              // don't need to send changedReplacementsToWithold instructions
              // since will send add instructions,
              // which will also recalculate replacements in parent
            }
          }

          if(numReplacementsToAdd > 0) {

            let newSerializedReplacements = [];

            for(let iter = prevMinNIterates; iter < this.state.minNIterates; iter++) {

              let newComponents = this.substitutionIntoTemplate({
                childnumbers: Array(this.state.nSubstitutions).fill(iter+1),
                iterateNumber: iter,
              });
      
              newSerializedReplacements = [...newSerializedReplacements, 
                ...newComponents];
            }

            let replacementInstruction = {
              changeType: "add",
              changeTopLevelReplacements: true,
              firstReplacementInd: prevMinNIterates*this.state.nChildrenInTemplate,
              numberReplacementsToReplace: 0,
              serializedReplacements: newSerializedReplacements,
              replacementsToWithhold: newReplacementsToWithhold,
            }
            replacementChanges.push(replacementInstruction);
          }
        }
      }

    }

    this.state.lastReplacementParameters = {
      substitutionsNames: this.state.substitutionsNames.slice(),
      behavior: this.state.behavior,
      nIterates: this.state.nIterates.slice(),
      minNIterates: this.state.minNIterates,
    }

    // console.log(replacementChanges);
    return replacementChanges;
  }
  
  static determineNumberOfUniqueVariants({serializedComponent}) {
    return {success: false};
  }
}
