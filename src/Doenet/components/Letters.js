import Text from './Text';

export default class Letters extends Text {
  static componentType = "letters";

  updateState(args={}) {
    super.updateState(args);

    if(!this.childLogicSatisfied || this.unresolvedState.value) {
      return;
    }

    if(!(lettersRegex.test(this.state.value))) {
      throw Error("Letters can only contain a-z or A-Z: '" + this.state.value + "' is invalid.");
    }
  }
}

var lettersRegex = /^[a-zA-Z]*$/;
