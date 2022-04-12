import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ToolRoot from '../_framework/NewToolRoot';

export default function Root() {
  return (
    // <html dark={darkModeToggle === true ? 'true' : null}>
    <RecoilRoot>
      <Router>
        <ToolRoot />
      </Router>
    </RecoilRoot>
    // </html>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
