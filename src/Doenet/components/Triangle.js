import Polygon from './Polygon';

export default class Triangle extends Polygon {
  static componentType = "triangle";

  updateState(args) {
    super.updateState(args);

    if(!this.childLogicSatisfied || Object.keys(this.unresolvedState).length > 0) {
      return;
    }

    if(this.state.nPoints !== 3) {
      console.warn("Triangle must have three points");
      this.unresolvedState.vertices = true;
      return;
    }

  }

}