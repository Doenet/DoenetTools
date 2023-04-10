import React from 'react';
import { createRoot } from 'react-dom/client';
import DoenetTest from './DoenetTest.jsx';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DarkmodeController from '../_framework/DarkmodeController.jsx';


const root = createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <DarkmodeController>
              <DoenetTest />
            </DarkmodeController>
          } />
      </Routes>
    </Router>
  </RecoilRoot>
);