import BaseComponent from './BaseComponent';

export default class ComponentSize extends BaseComponent {
  constructor(args){
    super(args);

    // make default reference (with no prop) be value
    this.stateVariablesForReference = ["value","isAbsolute"];

  }
  static componentType = "_componentsize";

  updateState(args={}) {
    super.updateState(args);

    let MathAndStringInds = this.childLogic.returnMatches("MathAndString");
    if (MathAndStringInds.length === 0){
      let AtMostOneComponentSizeInds = this.childLogic.returnMatches("AtMostOneComponentSize");
      if (AtMostOneComponentSizeInds.length === 0){
        if(this._state.value.essential !== true || this._state.isAbsolute.essential !== true ) {
          throw Error(this.componentType + " needs a value")
        }
        
      }else{
        //The case where we have componentsize child
        this.state.componentSizeChild = this.activeChildren[AtMostOneComponentSizeInds[0]];
        this.state.value = this.state.componentSizeChild.state.value;
        this.state.isAbsolute = this.state.componentSizeChild.state.isAbsolute;
      }

    }else{
      //The case where we have math and a string
      let mathAndStringChildren = MathAndStringInds.map( x => this.activeChildren[x]);

      // console.log(mathAndStringChildren);
      if (mathAndStringChildren.length === 1){
        //Only have a string
        // <width>100px</width>
        // <width>100 px</width>
        // <width>100 pixels</width>
        // <width>100pixels</width>
        // <width>100     pixel</width>
        // <width>100pixel</width>

        let result = mathAndStringChildren[0].state.value.match(/^\s*(\d+)\s*([a-zA-Z]+|%+)\s*$/);
        if (result === null){ throw Error(this.componentType + " must have a number and a unit.");}
        this.state.originalValue = result[1];
        this.state.originalUnit = result[2];
        
      }else{
        //Have a math followed by a string
        this.state.originalValue = mathAndStringChildren[0].state.value.evaluate_to_constant();
        if (!Number.isFinite(this.state.originalValue)) {
          throw Error(this.componentType + " must have a number");
        }
        let result = mathAndStringChildren[1].state.value.match(/^\s*([a-zA-Z]+|%+)\s*$/);
        if (result === null){ throw Error(this.componentType + " must have a number and a unit.");}
        this.state.originalUnit = result[1];

      }
 
      //Set isAbsolute and value (this.state)
      if (this.state.originalUnit === '%' || this.state.originalUnit === 'em'){
        this.state.isAbsolute = false;
      }else{
        this.state.isAbsolute = true;
      }

      let conversionFactor = {
        'px': 1,
        'pixel': 1,
        'pixels': 1,
        '%': 1,
        'em': 100,
        'in': 96,
        'inch': 96,
        'inches': 96,
        'pt': 1.333333333333,
        'mm': 3.7795296,
        'millimeter': 3.7795296,
        'millimeters': 3.7795296,
        'cm': 37.795296,
        'centimeter': 37.795296,
        'centimeters': 37.795296,
      }
      if (conversionFactor[this.state.originalUnit] === undefined){
        throw Error(this.state.originalUnit + ' is not a defined unit of measure.');
      }
      this.state.value = conversionFactor[this.state.originalUnit] * this.state.originalValue;

 
      // console.log(this.state.originalValue);
      // console.log(this.state.originalUnit);
      // console.log(this.state.isAbsolute);
      // console.log(this.state.value);
      
      
    }

  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    let ExactlyOneString = childLogic.newLeaf({
      name: "ExactlyOneString",
      componentType: 'string',
      comparison: 'exactly',
      number: 1,
    });

    let AtMostOneMath = childLogic.newLeaf({
      name: "AtMostOneMath",
      componentType: 'math',
      comparison: 'atMost',
      number: 1,
    });

    let MathAndString = childLogic.newOperator({
      name: "MathAndString",
      operator: 'and',
      propositions: [AtMostOneMath,ExactlyOneString],
      requireConsecutive: true,
      sequenceMatters: true,
    });

    let AtMostOneComponentSize = childLogic.newLeaf({
      name: "AtMostOneComponentSize",
      componentType: '_componentsize',
      comparison: 'atMost',
      number: 1,
    });

    childLogic.newOperator({
      name: "MathAndStringXorComponentSize",
      operator: 'xor',
      propositions: [MathAndString,AtMostOneComponentSize],
      setAsBase: true
    });

    return childLogic;
  }


}