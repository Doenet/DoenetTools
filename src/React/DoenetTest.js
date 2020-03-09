import React, { Component } from 'react';
import DoenetViewer from './DoenetViewer';
import doenetDefaultCode from '../defaultCode.doenet';

class DoenetTest extends Component {
  constructor(props){
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
    };

    this.updateNumber = 1;

  }


  componentDidCatch(error, info){

    this.setState({error:error,errorInfo:info});
  }

  render() {
    
     //We have an error so doen't show the viewer
     if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }

    return (<React.Fragment>
            <DoenetViewer 
            key={"doenetviewer"+this.updateNumber} 
            doenetML={doenetDefaultCode}
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
