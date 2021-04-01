import React from 'react';
import ReactDOM from 'react-dom';
import DoenetTest from './DoenetTest.jsx';

ReactDOM.render(
  <DoenetTest />,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
