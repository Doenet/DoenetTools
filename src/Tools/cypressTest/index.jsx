import React from 'react';
import ReactDOM from 'react-dom';
import CypressTest from './CypressTest.jsx';
import axios from 'axios';
import { RecoilRoot } from 'recoil';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjaxConfig } from '../../Core/utils/math.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// function CypressTest(props){

//   axios.post('/api/test.php',{}).then((resp) => console.log('>>>resp', resp.data));

//   return <p>test</p>
// }

ReactDOM.render(
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
          } />
      </Routes>
    </Router>
  </RecoilRoot>,
  document.getElementById('root'),
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
