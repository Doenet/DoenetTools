import Text from './Text';


// convert number to number separated by commas, a la django humanize's intcomma 

export default class IntComma extends Text {
  static componentType = "intcomma";

  updateState(args = {}) {

    super.updateState(args);

    if (!this.childLogicSatisfied || this.unresolvedState.value) {
      return;
    }

    let startAtLeastFourNumRegex = /^(-?\d+)(\d{3})/
    let matchObj = this.state.value.match(startAtLeastFourNumRegex);
    while (matchObj !== null) {
      this.state.value = this.state.value.replace(startAtLeastFourNumRegex, `$1,$2`)
      matchObj = this.state.value.match(startAtLeastFourNumRegex);
    }

  }

}
