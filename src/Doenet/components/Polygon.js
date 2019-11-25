import Polyline from './Polyline';
import me from 'math-expressions';

export default class Polygon extends Polyline {
  static componentType = "polygon";

  updateState(args={}) {
    if(args.init === true) {
      this.movePolygon = this.movePolygon.bind(
        new Proxy(this, this.readOnlyProxyHandler)
      );
    }

    super.updateState(args);

    if(!this.childLogicSatisfied || Object.keys(this.unresolvedState).length > 0) {
      return; // in case add more logic to this later...
    }

  }

  movePolygon(pointcoordsObject) {
    let vertexComponents = {};
    for(let ind in pointcoordsObject) {
      vertexComponents[ind] = me.fromAst(["tuple", ...pointcoordsObject[ind]])
    }

    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          vertices: {
            isArray: true,
            changes: { arrayComponents: vertexComponents }
          }
        }
      }]
    });

  }


  initializeRenderer({}){
    if(this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    if(this.state.ndimensions === 2) {
      const actions = {
        movePolygon: this.movePolygon,
      }
      this.renderer = new this.availableRenderers.polygon2d({
        key: this.componentName,
        label: this.state.label,
        draggable: this.state.draggable,
        layer: this.state.layer,
        visible: !this.state.hide,
        pointcoords: this.state.vertices.map(x => 
          [x.get_component(0).evaluate_to_constant(),
          x.get_component(1).evaluate_to_constant()]),
        actions: actions,
      });
    }
  }

  updateRenderer(){
    this.renderer.updatePolygon({
      visible: !this.state.hide,
      pointcoords: this.state.vertices.map(x => 
        [x.get_component(0).evaluate_to_constant(),
        x.get_component(1).evaluate_to_constant()]),
   });
  }

}