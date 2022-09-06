import React from 'react';
import ReactDOM from 'react-dom';
import DoenetTest from './DoenetTest.jsx';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

ReactDOM.render(
  <RecoilRoot>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <DoenetTest />
          } />
      </Routes>
    </Router>
  </RecoilRoot>,
  document.getElementById('root'),
);