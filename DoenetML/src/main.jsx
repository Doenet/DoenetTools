import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import PageViewer from "./Viewer/PageViewer.jsx";
import axios from "axios";
import { RecoilRoot } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "./Core/utils/math.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DarkmodeController from "./Tools/_framework/DarkmodeController.jsx";

// function CypressTest(props){

//   axios.post('/api/test.php',{}).then((resp) => console.log('>>>resp', resp.data));

//   return <p>test</p>
// }

//let doenetML = "<graph><regularPolygon /></graph><mathinput name='f'/>$f";
let doenetML = "<graph><regularPolygon /></graph>";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RecoilRoot>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <DarkmodeController>
              <MathJaxContext
                version={2}
                config={mathjaxConfig}
                onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
              >
                <PageViewer
                  doenetML={doenetML}
                  // cid={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
                  updateDataOnContentChange={true}
                  flags={{
                    showCorrectness: true,
                    readOnly: false,
                    showFeedback: true,
                    showHints: true,
                    allowLoadState: false,
                    allowSaveState: false,
                    allowLocalState: false,
                    allowSaveSubmissions: false,
                    allowSaveEvents: false,
                    autoSubmit: false,
                  }}
                  attemptNumber={1}
                  requestedVariantIndex={1}
                  doenetId=""
                  pageIsActive={true}
                  // collaborate={true}
                  // viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
                  // functionsSuppliedByChild = {this.functionsSuppliedByChild}
                />
              </MathJaxContext>
            </DarkmodeController>
          }
        />
      </Routes>
    </Router>
  </RecoilRoot>,
  // </React.StrictMode>,
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  // console.log(">>>import.meta.hot")
  // import.meta.hot.accept(({module}) => {
  //   console.log(">>>ACCEPT CALLED!!!!!!!!!")
  // }
  // );
  import.meta.hot.accept();
}
