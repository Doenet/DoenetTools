import React, { Component } from 'react';
import DoenetViewer from './DoenetViewer';
import doenetDefaultML from '../defaultCode.doenet';
import axios from 'axios';

class DoenetTest extends Component {
  constructor(props) {
    super(props);

    this.updateAfterMessage = this.updateAfterMessage.bind(this);
    this.newAttempt = this.newAttempt.bind(this);

    this.updateNumber = 1;
    this.assignmentId = "myassignmentid";

    let ignoreDatabase = false;

    let attemptNumberIsReady = false;
    if (this.assignmentId && !ignoreDatabase) {
      const payload = {
        assignmentId: this.assignmentId,
      }
      axios.post('/api/processAttemptNumber.php', payload)
        .then(resp => {
          console.log('processAttemptNumber-->>>', resp.data);
          this.attemptNumber = resp.data;
          this.setState({ attemptNumberIsReady: true, requestedVariant: { index: this.attemptNumber } })
        });
    } else {
      attemptNumberIsReady = true;
    }

    this.state = {
      error: null,
      errorInfo: null,
      showCorrectness: true,
      doenetML: doenetDefaultML,
      readOnly: false,
      ignoreDatabase,
      attemptNumberIsReady,
      requestedVariant: undefined,
      solutionDisplayMode: "button",
      showFeedbacK: true,
    };

    window.onmessage = this.updateAfterMessage;

  }

  updateAfterMessage(e) {

    if (e.data.doenetML !== undefined) {
      this.updateNumber++;
      window.MathJax.Hub.Queue(
        ["resetEquationNumbers", window.MathJax.InputJax.TeX],
      );
      // this.setState({ doenetML: e.data.doenetML, error: null, errorInfo: null });
      this.setState({
        doenetML: e.data.doenetML, error: null, errorInfo: null,
        requestedVariant: e.data.requestedVariant
      });
    }
  }

  // componentDidCatch(error, info) {

  //   this.setState({ error: error, errorInfo: info });
  // }
  newAttempt() {
    const payload = {
      assignmentId: this.assignmentId,
      newAttempt: true,
    }
    axios.post('/api/processAttemptNumber.php', payload)
      .then(resp => {
        console.log('processAttemptNumber NEW ATTEMPT-->>>', resp.data);
        this.attemptNumber = resp.data;
        this.updateNumber++; //Need to run core again
        this.setState({ attemptNumberIsReady: true, requestedVariant: { index: this.attemptNumber } })
      });
  }

  render() {

    if (!this.state.attemptNumberIsReady) {
      return <p>Loading attempt number</p>
    }

    //We have an error so doen't show the viewer
    if (this.state.error) {

      return (<React.Fragment>
        <p style={{ color: "red" }}>{this.state.error && this.state.error.toString()}</p>
      </React.Fragment>);
    }


    return (<React.Fragment>
      <div style={{ backgroundColor: "#e3e3e3" }}><h3>Test Tool</h3>
        <label>Attempt Number: {this.attemptNumber} <button onClick={() => this.newAttempt()}>New Attempt</button></label>
      </div>
      <DoenetViewer
        key={"doenetviewer" + this.updateNumber}
        doenetML={this.state.doenetML}
        // contentId={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
        flags={{
          showCorrectness: this.state.showCorrectness,
          readOnly: this.state.readOnly,
          solutionDisplayMode: this.state.solutionDisplayMode,
          showFeedback: this.state.showFeedbacK,
        }}
        attemptNumber={this.attemptNumber}
        assignmentId={this.assignmentId}
        ignoreDatabase={this.state.ignoreDatabase}
        requestedVariant={this.state.requestedVariant}
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
