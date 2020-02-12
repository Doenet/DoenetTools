# How to make a Doenet component

## Step 1
Determine which type of component is needed. 

For simpler components start with inheritOnly.js, for most components start with allOptions.js

Duplicate the file and rename it to the component name and end it with .js 
place in the appropriate components directory

## Step 2
 In /src/Doenet/ComponentTypes.js  
A. Import the NewComponentClass
B. Add NewComponentClass to the componentTypeArray

## Step 3
Update the placeholders in the component file

 InheritedComponentClass
 NewComponentClass
 newcomponentname

## Step 4

import InheritedComponentClass from './InheritedComponentClass';

export class NewComponentClass extends InheritedComponentClass {

  //likely there is no need for a constructor due to base component's constructor
  //calling updateState with init=true 
  //The following are cases for using a constructor
  constructor(args){
    super(args);
    
    //setting stateVariablesForReference causes refs to only copy the variables listed
    //it disables refs default behavior of copying children
    //choosing this option requires setting child logic to accept no children and
    //requires making updateState check for these essential state variables in lieu of children
    this.stateVariablesForReference = ["value"];

    //A constructor could be used to bind this to a function
    this.actionName = this.actionName.bind(this);
  }
    static componentType = "newcomponentname";

    //creates properties 
    //Automatically creates childlogic leaf comparison:'atMost' number:1
    //creates state variables with a value from the matching child or default if not found
    //updates the value of the state variable if the child changes
    //makes the state variable public state variable with componentType:childNameHere
    //flagged isProperty = true
    static createPropertiesObject(args) {
      let properties = super.createPropertiesObject(args);
    
      properties.componentTypeName1 = {default: 1}; 
      properties.componentTypeName2 = {default: "one"}; 

      return properties;
    }
   
    //additional options for child logic are given in childlogic.js
    //it's required to have a newOperator or newLeaf with a setAsBase set to true
    //
    //
    //newLeaf requries name and componentType
    //newLeaf Options
    //
    // name - names need to be unique over all child logic, can only be used in proposistions once 
    // componentType - if componentType doesn't exist the leaf won't match any children
    // comparison - can be 'atLeast', 'exactly', 'atMost' default: 'exactly'
    // number - default: 1
    // requireConsecutive - will only match consecutive children, default: false
    // allowSpillover - used for the case where two or more leaves will work in combination and comparison is
    //          set to 'exactly' or 'atMost'. 
    //          if allowSpillover:true and the leaf encounters more children than the number attribute
    //          then leaf will match the first number of children and leave the remainder for later leaves.
    //          default: true
    // condition - javascript function with one arguement for the matched child needs to return true or false
    //             For the child to be considered a match, the condition function must return true
    // setAsBase - Must be defined once in child logic. It indicates the root of the logic. default:false
    // isSugar - true means it's sugar, so a replacementFunction is required. default:false
    // repeatSugar - true means when the logic is run after sugar is applied, sugar will remain enabled. 
    //               default:false
    // replacementFunction - a javascript function that receives an array of child indexes matched
    //            and must return instructions on how to modify the children.
    //            {success: true|false,
    //            toDelete: array of component names to delete. Must be string components.
    //            newChildren: array of serialized components (JSON) that will replace the matched children.
    //                         needs to include all non-deleted components matched.
    //                         Include via {createdComponent: true, componentName: '__example1'}
    //            childChanges: (grandchildren) Object keyed by componentNames of matched children. 
    //                           It has three keys activeChildrenMatched, toDelete, newChildren
    //            resultsByPiece: only needed when separateSugarInputs:true and keyed by childIndex. 
    //                            It has toDelete and  newChildren
    //            }
    // 
    //newOperator requires name, operator and propsitions
    //newOperator Options
    // name - names need to be unique over all child logic, can only be used in proposistions once 
    // operator can be 'and','or','xor'
    // propositions
    // sequenceMatters
    // requireConsecutive - will only match consecutive children, default: false
    // allowSpillover - used for the case where two or more operators will work in combination and operator is 'xor'
    //                  if allowSpillover:true and the operator encounters more than one true proposition 
    //                  then the operator will match the first proposition and ignore the remainder of propositions.
    //                  default: true
    // setAsBase - Must be defined once in child logic. It indicates the root of the logic. default:false
    // isSugar - true means it's sugar, so a replacementFunction is required. default:false
    // repeatSugar - true means when the logic is run after sugar is applied, sugar will remain enabled. 
    //               default:false
    // separateSugarInputs - if true the replacementFunction is given an array of arrays for each proposition. 
    //                       if false it's given a single array of all propsitions combined
    //                       default:false
    // replacementFunction (see newLeaf above)
    //
    static returnChildLogic (args) {
      let childLogic = super.returnChildLogic(args);
  
      let atLeastZeroStrings = childLogic.newLeaf({
        name: "atLeastZeroStrings",
        componentType: 'string',
        comparison: 'atLeast',
        number: 0,
      });
  
      let atLeastZeroTexts = childLogic.newLeaf({
        name: "atLeastZeroTexts",
        componentType: 'text',
        comparison: 'atLeast',
        number: 0,
      });
  
      childLogic.newOperator({
        name: "stringsAndTexts",
        operator: 'and',
        propositions: [atLeastZeroStrings, atLeastZeroTexts],
        requireConsecutive: true,
        setAsBase: true
      });
      
      return childLogic;
    }

    //State Variables are used to store the primary information needed to produce the results needed by 
    //the component.

    static returnStateVariableDefinitions() {

    }

    //updateState is called on construction and....
    updateState(args={}) {
      
      //This code only runs once on construction
      if(args.init){

      }
      super.updateState(args);


    }

    initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    this.renderer = new this.availableRenderers.slider({
      *** parameters here ***
    });
  }

  updateRenderer() {

    this.renderer.updateSlider({
           *** parameters here ***
    })

  }
  }
