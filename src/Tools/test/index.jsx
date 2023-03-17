import React from 'react';
import { createRoot } from 'react-dom/client';
import DoenetTest from './DoenetTest.jsx';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const root = createRoot(document.getElementById('root'));
root.render(
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
  </RecoilRoot>
);