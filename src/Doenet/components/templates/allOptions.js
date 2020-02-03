import InheritedComponentClass from './InheritedComponentClass';

export class NewComponentClass extends InheritedComponentClass {

  constructor(args){
    super(args); 
    this.stateVariablesForReference = ["value"];
  }
    static componentType = "newcomponentname";

    static createPropertiesObject(args) {
      let properties = super.createPropertiesObject(args);
    
      properties.componentTypeName1 = {default: 1}; 
      properties.componentTypeName2 = {default: "one"}; 

      return properties;
    }
   
    static returnChildLogic (args) {
      let childLogic = super.returnChildLogic(args);

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

    updateState(args={}) {


      if(args.init){

        this.makePublicStateVariable({
          variableName:'myfavoritenumber',
          componentType: 'number'
        });
        this.actionName = this.actionName.bind(this);
      }
      super.updateState(args);

      this.state.myFavoriteNumber = 8;

      let exactlyOneCoords = this.childLogic.returnMatches("exactlyOneCoords"); //array of active children indicies
      if (exactlyOneCoords.length === 1){
        this.state.coordsChild = this.activeChildren[exactlyOneCoords[0]];
        this.state.coords = this.state.coordsChild.state.value;
      }

      let atLeastZeroCoords = this.childLogic.returnMatches("atLeastZeroCoords");
      if (atLeastZeroCoords.length > 0){
        this.state.coordsChildren = atLeastZeroCoords.map(x => this.activeChildren[x]);
        this.state.coords = this.state.coordsChildren.map(x => x.state.value);
      }
      //#############
      //TODO: Essential state
      //#############
    }

  
    static includeBlankStringChildren = true;

    //TODO: Renderer/Action
    //TODO: Downstream Updates
  }