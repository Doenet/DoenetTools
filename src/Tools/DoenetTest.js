import React, { Component } from 'react';
import DoenetViewer from './DoenetViewer';
import doenetDefaultML from '../defaultCode.doenet';

class DoenetTest extends Component {
  constructor(props) {
    super(props);

    this.updateAfterMessage = this.updateAfterMessage.bind(this);

    this.state = {
      error: null,
      errorInfo: null,
      showCorrectness: false,
      doenetML: doenetDefaultML,
    };

    this.updateNumber = 1;

    window.onmessage = this.updateAfterMessage;

  }

  updateAfterMessage(e) {

    if (e.data.doenetML !== undefined) {
      this.updateNumber++;
      window.MathJax.Hub.Queue(
        ["resetEquationNumbers", window.MathJax.InputJax.TeX],
      );
      this.setState({ doenetML: e.data.doenetML, error: null, errorInfo: null });
      // this.setState({doenetML:e.data.doenetML,error:null,errorInfo:null,
      //   requestedVariant: e.data.requestedVariant});
    }
  }

  // componentDidCatch(error, info) {

  //   this.setState({ error: error, errorInfo: info });
  // }

  render() {

    //We have an error so doen't show the viewer
    if (this.state.error) {

      return (<React.Fragment>
        <p style={{ color: "red" }}>{this.state.error && this.state.error.toString()}</p>
      </React.Fragment>);
    }

    return (<React.Fragment>
      <DoenetViewer
        key={"doenetviewer" + this.updateNumber}
        doenetML={this.state.doenetML}
        // contentId={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
        flags={{ showCorrectness: this.state.showCorrectness }}
      // collaborate={true}
      // free={{doenetCode: this.state.code, requestedVariant: this.state.requestedVariant}} 
      // mode={{
      //   solutionType:this.state.solutionType,
      //   allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
      //   showHints:this.state.showHints,
      //   showFeedback:this.state.showFeedback,
      //   showCorrectness:this.state.showCorrectness,
      // }}
      // viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
      // functionsSuppliedByChild = {this.functionsSuppliedByChild}
      />
    </React.Fragment>);
  }
}

export default DoenetTest;

// mode={{solutionType:"displayed",allowViewSolutionWithoutRoundTrip:true}}
