import InlineComponent from './abstract/InlineComponent';

export default class panel extends InlineComponent {
  static componentType = "panel";

  static alwaysContinueUpstreamUpdates = true;

  updateState(args={}) {
    super.updateState(args);

    this.state.breakpoints = [];

    this.state.anythingChildren = this.childLogic.returnMatches('anything').map(x => this.activeChildren[x]);
    
     //find the breakpoints for changing the number of columns
     let itemWidths = this.state.anythingChildren.map(x => x.state.width);

     if (this.state.columns !== undefined){

     let possibleColumnNumbers;
     if (this.state.columns.indexOf(',') !== -1){
         possibleColumnNumbers = this.state.columns.split(',').map(Number);
     }else if (this.state.columns.indexOf('-') !== -1){
         let [start,end] = this.state.columns.split('-');
         possibleColumnNumbers = [];
         for (let ind = Number(start); ind <= end; ind++){
             possibleColumnNumbers.push(ind);
         }
     }else{
         possibleColumnNumbers = [Number(this.state.columns)];
     }
     

    let maxWidths = {};
    let totalOfMaxWidths = {};

    for(let numberOfColumns of possibleColumnNumbers){
        //find maxWidths of this number of numberOfColumns
        let maxWidthsForThisColumn = [];
        let totalWidthsForThisCoumn = 0;
        for (let columnNum = 0; columnNum < numberOfColumns; columnNum++){
        let maxWidth = -1;
            for (let ind=columnNum; ind < itemWidths.length; ind = ind + numberOfColumns){
                if (itemWidths[ind] > maxWidth){maxWidth = itemWidths[ind];}
            }
            maxWidthsForThisColumn.push(maxWidth);
            totalWidthsForThisCoumn = totalWidthsForThisCoumn + Number(maxWidth);
        }
        maxWidths[numberOfColumns] = maxWidthsForThisColumn;
        totalOfMaxWidths[numberOfColumns] = totalWidthsForThisCoumn;

    }
    
    let lastColumnNumber = -1;
    for (let number of possibleColumnNumbers){
        //find lowest next breakpoints
        let minBreakPoint = Number.POSITIVE_INFINITY;
        let minColumnNumber = -1;
        for (let columnNumber of possibleColumnNumbers){
            if (totalOfMaxWidths[columnNumber] <= minBreakPoint &&
                columnNumber > lastColumnNumber){
                minBreakPoint = totalOfMaxWidths[columnNumber];
                minColumnNumber = columnNumber;
            }
            
        }
        //save min in breakpoints if found a match
        if (minBreakPoint < Number.POSITIVE_INFINITY){
            this.state.breakpoints.push({breakpoint: minBreakPoint,
                possibleColumnNumbers: minColumnNumber,
                arrayOfWidths: maxWidths[minColumnNumber]})
            lastColumnNumber = minColumnNumber;
        }

      }
        
    }
     
  }

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.columns = {default: undefined};
    
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });
    
    return childLogic;
  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    
    // console.log(this.widths);
    // console.log(this.activeChildren);
    

    //TODO: Security checking for widths make sure it's px or % 
    
    this.renderer = new this.availableRenderers.panel({
      key: this.componentName,
      breakpoints: this.state.breakpoints,
    });
  }
  
  updateChildrenWhoRender(){
    //Filter to those who actually have renderers as some point
    // this.childrenWhoRender = this.activeChildren.filter(x => x.componentIsAProperty !== true);
    // this.childrenWhoRender = this.childLogic.returnMatches('anything').map(x => this.activeChildren[x]);
    this.childrenWhoRender = this.state.anythingChildren.map(x => x.componentName);
  }

  updateRenderer() {
    // this.renderer.updateText(this.state.value);
  }

}