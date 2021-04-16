// Documentation on how to create a component
// that has complex behaviour
//
// Process
// 1. Duplicate this file and rename it to the component name and end it with .js 
//    place in the appropriate components directory
// 2. Edit the InheritedComponentClass, NewComponentClass and newcomponentname in this template 
// 3. In /src/Doenet/ComponentTypes.js , 
//     A. Import the NewComponentClass
//     B. Add NewComponentClass to the componentTypeArray
//

import InheritedComponentClass from './InheritedComponentClass';

export class NewComponentClass extends InheritedComponentClass {

  //likely there is no need for a constructor due to base component's constructor
  //calling updateState with init=true 
  //The following are cases for using a constructor
  constructor(args){
    super(args); //calls this.updateState({init:true})
    
    //setting stateVariablesShadowedForReference causes refs to only copy the variables listed
    //it disables refs default behavior of copying children
    //choosing this option requires setting child logic to accept no children and
    //requires making updateState check for these essential state variables in lieu of children
    this.stateVariablesShadowedForReference = ["value"];

    //A constructor should not be used to bind this to a function as the update function may need the bind
    // this.actionName = this.actionName.bind(this);
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
      //Required even if you don't want to inherit off the parent as
      //basecomponent needs it

      //Use this if you don't want to inherit off the parent
      //Note: this doesn't affect inherited properties
      childLogic.deleteAllLogic();
  
      let atLeastZeroStrings = childLogic.newLeaf({
        name: "atLeastZeroStrings",
        componentType: 'string',
        comparison: 'atLeast',
        number: 0,
      });
  
      let atLeastZeroMaths = childLogic.newLeaf({
        name: "atLeastZeroMaths",
        componentType: 'math',
        comparison: 'atLeast',
        number: 0,
      });

      //Function used to sugar stringsAndMaths into a coords
      let replacementFunction = function({activeChildrenMatched}) {
        let coordsChildren = [];
        for(let child of activeChildrenMatched) {
          coordsChildren.push({
            createdComponent: true,
            componentName: child.componentName
          });
        }
        return {
          success: true,
          newChildren: [{ componentType: "coords", children: coordsChildren }],
        }
      }
  
      childLogic.newOperator({
        name: "stringsAndMaths",
        operator: 'and',
        propositions: [atLeastZeroStrings, atLeastZeroMaths],
        requireConsecutive: true,
        isSugar: true,
        replacementFunction: replacementFunction,
      });


      let exactlyOneCoords = childLogic.newLeaf({
        name: "exactlyOneCoords",
        componentType: 'coords',
        number: 1,
      });
  
      childLogic.newOperator({
        name: "coordsXorSugar",
        operator: 'xor',
        propositions: [exactlyOneCoords, stringsAndMaths],
        setAsBase: true
      });
  
      
      return childLogic;
    }

    //updateState is called on construction and....
    updateState(args={}) {

      //This code only runs once on construction
      //
      if(args.init){
        //Example to make a variable that someone can refer to by
        //<ref prop="myFavoriteNumber">...
        //(variableName must be lower case, though Doenet code is case-insensitive)
        this.makePublicStateVariable({
          variableName:'myfavoritenumber',
          componentType: 'number'
        });
        //This is the recommended location to bind this to a function 
        this.actionName = this.actionName.bind(this);
      }
      super.updateState(args);

      //Example of setting
      this.state.myFavoriteNumber = 8;

      //child logic for the case of a single coords child
      let exactlyOneCoords = this.childLogic.returnMatches("exactlyOneCoords"); //array of active children indicies
      if (exactlyOneCoords.length === 1){
        this.state.coordsChild = this.activeChildren[exactlyOneCoords[0]];
        this.state.coords = this.state.coordsChild.state.value;
      }

      //child logic for the case of multiple coords children
      let atLeastZeroCoords = this.childLogic.returnMatches("atLeastZeroCoords");
      if (atLeastZeroCoords.length > 0){
        this.state.coordsChildren = atLeastZeroCoords.map(x => this.activeChildren[x]);
        this.state.coords = this.state.coordsChildren.map(x => x.state.value);
      }
      //#############
      //TODO: Essential state
      //#############
    }

    // Most components won't have this.
    // Default behavior is to ignore the white space string children 
    // To preserve the white space children set as true
    // Even if this is true it will ignore white space strings 
    // before property children
    // E.g. the white space string child before <hide> will not be included
    // <text>
    // <hide>true</hide>
    // </text>
    static includeBlankStringChildren = true;

    //TODO: Renderer/Action
    //TODO: Downstream Updates
  }