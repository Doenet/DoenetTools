import React, { useState, Component } from 'react';
// import DoenetViewer from '.../Core/DoenetViewer.jsx';
import doenetDefaultML from './defaultCode.doenet';


// window.onmessage = this.updateAfterMessage;

// }

// updateAfterMessage(e) {

//   if (e.data.doenetML !== undefined) {
//     this.updateNumber++;
//     window.MathJax.Hub.Queue(
//       ["resetEquationNumbers", window.MathJax.InputJax.TeX],
//     );
//     // this.setState({ doenetML: e.data.doenetML, error: null, errorInfo: null });
//     this.setState({
//       doenetML: e.data.doenetML, error: null, errorInfo: null,
//       requestedVariant: e.data.requestedVariant
//     });
//   }
// }

// mode={{solutionType:"displayed",allowViewSolutionWithoutRoundTrip:true}}

function DoenetViewer(props){
  return <p>{props.doenetML}</p>
}

export default function DoenetTest(){
  const [attemptNumber,setAttemptNumber] = useState(1);
  const [updateNumber,setUpdateNumber] = useState(1);
  const showCorrectness = true;
  const readOnly = false;
  const solutionDisplayMode = "button";
  const showFeedback = true;
  const showHints = true;
  const ignoreDatabase = true;
  const requestedVariant = '1'; //????

  return (
    <>
         <div style={{ backgroundColor: "#e3e3e3" }}><h3>Test Tool</h3>
        <label>Attempt Number: {attemptNumber} <button onClick={
          () => {
            setAttemptNumber((was)=>was+1)
            setUpdateNumber((was)=>was+1)
          }
          }>New Attempt</button></label>
      </div>
      <DoenetViewer
        key={"doenetviewer" + updateNumber}
        doenetML={doenetDefaultML}
        // contentId={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
        flags={{
          showCorrectness,
          readOnly,
          solutionDisplayMode,
          showFeedback,
          showHints,
        }}
        attemptNumber={attemptNumber}
        ignoreDatabase={ignoreDatabase}
        requestedVariant={requestedVariant}
      // collaborate={true}
      // viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
      // functionsSuppliedByChild = {this.functionsSuppliedByChild}
      />
    </>
  )
}

