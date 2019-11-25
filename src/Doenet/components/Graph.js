import BlockComponent from './abstract/BlockComponent';

export default class Graph extends BlockComponent {
  constructor(args){
    super(args);
    this.returnRenderersInGraph = this.returnRenderersInGraph.bind(this);
  }
  static componentType = "graph";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.xmin = {default: -10};
    properties.xmax = {default: 10};
    properties.ymin = {default: -10};
    properties.ymax = {default: 10};
    properties.width = {default: 300};
    properties.height = {default: 300};
    properties.displayaxes = {default: true};
    properties.xlabel = {default: ""};  
    properties.ylabel = {default: ""};  
    return properties;
  }

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });


    let addCurve = function({activeChildrenMatched}) {
      // add <curve> around strings, as long as they don't have points
      let curveChildren = [];
      for(let child of activeChildrenMatched) {
        if(child.stateValues.value.includes(",")) {
          return {success: false};
        }
        curveChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "curve", children: curveChildren }],
      }
    }

    let AtLeastOneString = childLogic.newLeaf({
      name: "AtLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
      requireConsecutive: true,
      isSugar: true,
      replacementFunction: addCurve,
    });

    let AtLeastZeroGraphical = childLogic.newLeaf({
      name: "AtLeastZeroGraphical",
      componentType: '_graphical',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "SugarXorGraph",
      operator: "xor",
      propositions: [AtLeastOneString, AtLeastZeroGraphical],
      setAsBase: true,
    })
    
    return childLogic;
  }

  get descendantSearchClasses() {
    return ["_graphical"];
  }

  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }
    this.renderer = new this.availableRenderers.graph2d({
      key: this.componentName,
      returnRenderersInGraph: this.returnRenderersInGraph,
      graphRenderComponents: this.graphRenderComponents,
      width: parseInt(this.stateValues.width),
      height: parseInt(this.stateValues.height),
      xmin: this.stateValues.xmin,
      xmax: this.stateValues.xmax,
      ymin: this.stateValues.ymin,
      ymax: this.stateValues.ymax,
      displayaxes: this.stateValues.displayaxes,
      xlabel: this.stateValues.xlabel,
      ylabel: this.stateValues.ylabel,
    });
  }

  updateRenderer() {
    if(this.renderer !== undefined) {
      this.renderer.resizeBoard({
        xmin: this.stateValues.xmin,
        xmax: this.stateValues.xmax,
        ymin: this.stateValues.ymin,
        ymax: this.stateValues.ymax,
      })
    }
  }

  updateChildrenWhoRender(){
    this.childrenWhoRender = this.activeChildren.map(x => x.componentName);
  }

  returnRenderersInGraph() {
    let graphicalRenderers = {};

    for(let component of this.descendantsFound._graphical) {
      let componentRenderer = this.allRenderComponents[component.componentName];
      // could be undefined if no renderer present
      graphicalRenderers[component.componentName] = componentRenderer;
    }

    return graphicalRenderers;

  }

}
