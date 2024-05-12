import React from "react";
import { createRoot } from "react-dom/client";
import CypressTest from "./CypressTest.jsx";
import axios from "axios";
import { RecoilRoot } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { mathjaxConfig } from "@doenet/doenetml";

// function CypressTest(props){

//   axios.post('/api/test.php',{}).then((resp) => console.log('>>>resp', resp.data));

//   return <p>test</p>
// }

const root = createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <MathJaxContext
              version={2}
              config={mathjaxConfig}
              onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
            >
              <CypressTest />
            </MathJaxContext>
          }
        />
      </Routes>
    </Router>
  </RecoilRoot>,
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
